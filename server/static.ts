import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Hashed assets (JS/CSS bundles from Vite) — cache forever (immutable)
  app.use("/assets", express.static(path.join(distPath, "assets"), {
    maxAge: "1y",
    immutable: true,
  }));

  // Other static files (favicon, etc.) — short cache, but NEVER index.html from here
  app.use(express.static(distPath, {
    maxAge: "1h",
    index: false,   // ← prevent express.static from serving index.html
  }));

  // SPA catch-all — always serve index.html with no-cache headers
  app.use("*", (_req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store"); // Fastly
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
