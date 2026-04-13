import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Resolve relative to project root (process.cwd()), not __dirname
  // This works both with tsx (server/ dir) and esbuild bundle (dist/ dir)
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

  // All other static files — short cache
  app.use(express.static(distPath, { maxAge: "1h" }));

  // index.html — NEVER cache so browsers always get the latest entry point
  app.use("/{*path}", (_req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
