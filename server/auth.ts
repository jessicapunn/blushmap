import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage, verifyPassword } from "./storage.js";

const MStore = MemoryStore(session);

// ── Session middleware ────────────────────────────────────────────────────────
export function setupSession(app: Express) {
  app.use(session({
    secret: process.env.SESSION_SECRET || "blushmap-secret-k3y-2026",
    resave: false,
    saveUninitialized: false,
    store: new MStore({ checkPeriod: 86_400_000 }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }));
}

// ── Auth guard middleware ─────────────────────────────────────────────────────
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any).userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

// ── Auth routes ───────────────────────────────────────────────────────────────
export function registerAuthRoutes(app: Express) {
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, name, password } = req.body as { email: string; name: string; password: string };
      if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: "Email and password (min 6 chars) required." });
      }
      const existing = await storage.getUserByEmail(email);
      if (existing) return res.status(409).json({ error: "An account with this email already exists." });
      const user = await storage.createUser(email, name || "", password);
      (req.session as any).userId = user.id;
      return res.json({ ok: true, user: safeUser(user) });
    } catch (err: any) {
      res.status(500).json({ error: "Registration failed", detail: err.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      if (!email || !password) return res.status(400).json({ error: "Email and password required." });
      const user = await storage.getUserByEmail(email);
      if (!user) return res.status(401).json({ error: "No account found with that email." });
      if (!user.passwordHash) return res.status(401).json({ error: "Please log in with Google." });
      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: "Incorrect password." });
      await storage.touchLogin(user.id);
      (req.session as any).userId = user.id;
      return res.json({ ok: true, user: safeUser(user) });
    } catch (err: any) {
      res.status(500).json({ error: "Login failed", detail: err.message });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
  });

  // Get current session user
  app.get("/api/auth/me", async (req, res) => {
    const uid = (req.session as any).userId;
    if (!uid) return res.json({ user: null });
    const user = await storage.getUserById(uid);
    if (!user) return res.json({ user: null });
    return res.json({ user: safeUser(user) });
  });

  // Update profile
  app.patch("/api/auth/profile", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    const { name, skinType, skinConcerns } = req.body;
    const updated = await storage.updateUser(uid, { name, skinType, skinConcerns });
    res.json({ ok: true, user: safeUser(updated!) });
  });
}

function safeUser(u: any) {
  const { passwordHash: _, ...safe } = u;
  return safe;
}
