import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { serveStatic } from "./static.js";
import { setupSession, registerAuthRoutes } from "./auth.js";
import { registerProfileRoutes } from "./profile.js";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage { rawBody: unknown; }
}

// Only parse JSON/urlencoded bodies for non-multipart requests
// Multipart (file uploads) must be handled exclusively by multer — pre-parsing the stream breaks it
app.use((req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.startsWith("multipart/")) return next(); // skip — let multer handle it
  express.json({ limit: "10mb", verify: (req, _res, buf) => { (req as any).rawBody = buf; } })(req, res, next);
});
app.use((req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.startsWith("multipart/")) return next(); // skip
  express.urlencoded({ extended: false, limit: "10mb" })(req, res, next);
});

// Redirect blushmap.co.uk → www.blushmap.com (301 permanent)
app.use((req, res, next) => {
  const host = req.hostname;
  if (host && host.endsWith(".co.uk")) {
    return res.redirect(301, `https://www.blushmap.com${req.originalUrl}`);
  }
  next();
});

// Force no-cache on index.html for ALL paths (prevents CDN/browser caching stale bundles)
app.use((req, res, next) => {
  const accept = req.headers["accept"] || "";
  // Only apply to HTML requests (page loads), not API or asset requests
  if (!req.path.startsWith("/api") && !req.path.startsWith("/assets") && accept.includes("text/html")) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store"); // Fastly/Varnish
  }
  next();
});

export function log(message: string, source = "express") {
  const t = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  console.log(`${t} [${source}] ${message}`);
}

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      log(logLine);
    }
  });
  next();
});

(async () => {
  // ── Session + Auth + Profile must be registered BEFORE serveStatic ──
  setupSession(app);
  registerAuthRoutes(app);
  registerProfileRoutes(app);

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  // Static / SPA catch-all MUST come last
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite.js");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    log(`serving on port ${port}`);
  });
})();
