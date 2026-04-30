import type { Express } from "express";
import { storage } from "./storage.js";
import { requireAuth } from "./auth.js";

export function registerProfileRoutes(app: Express) {
  // ── Face scan history ──
  app.post("/api/profile/face-scan", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    const { analysisId, imageThumb, skinScore, skinTone, skinType, concerns, notes } = req.body;
    const entry = await storage.addFaceScan(uid, {
      analysisId, imageThumb, skinScore, skinTone, skinType, concerns, notes,
    });
    res.json({ ok: true, entry });
  });

  app.get("/api/profile/face-scans", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    const history = await storage.getFaceScanHistory(uid);
    res.json({ history });
  });

  // ── Saved products ──
  app.post("/api/profile/save-product", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    const { productId, productName, productBrand, productImage, affiliateUrl, category } = req.body;
    if (!productId || !productName) return res.status(400).json({ error: "productId and productName required" });
    const saved = await storage.saveProduct(uid, { productId, productName, productBrand, productImage, affiliateUrl, category });
    res.json({ ok: true, saved });
  });

  app.get("/api/profile/saved-products", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    const products = await storage.getSavedProducts(uid);
    res.json({ products });
  });

  app.patch("/api/profile/saved-products/:id/status", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    const { status } = req.body;
    await storage.updateSavedProductStatus(Number(req.params.id), uid, status);
    res.json({ ok: true });
  });

  app.delete("/api/profile/saved-products/:id", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    await storage.removeSavedProduct(Number(req.params.id), uid);
    res.json({ ok: true });
  });

  // ── Skin analyses ──
  app.get("/api/profile/analyses", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    const list = await storage.getUserAnalyses(uid);
    res.json({ analyses: list });
  });

  // ── Product scan history ──
  app.get("/api/profile/product-scans", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    const scans = await storage.getProductScanHistory(uid);
    res.json({ scans });
  });

  // ── Points balance ──
  app.get("/api/profile/points", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    const points = await storage.getPoints(uid);
    res.json({ points });
  });

  // ── Points history (click log) ──
  app.get("/api/profile/points/history", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    const history = await storage.getClickHistory(uid);
    res.json({ history });
  });

  // ── Track affiliate click & award points ──
  // Called from frontend when a signed-in user clicks an affiliate link
  app.post("/api/affiliate/track", requireAuth, async (req, res) => {
    const uid = (req.session as any).userId;
    const { productId, productName, retailer, affiliateUrl } = req.body;
    // 10 pts per click, deduplicate per product per day
    const history = await storage.getClickHistory(uid);
    const today = new Date().toDateString();
    const alreadyToday = history.some(h =>
      h.productId === productId &&
      new Date(h.createdAt).toDateString() === today
    );
    if (alreadyToday) {
      // Still open the link, just don’t double award
      return res.json({ ok: true, awarded: 0, reason: "already_awarded_today" });
    }
    const updated = await storage.awardPoints(uid, 10, { productId, productName, retailer, affiliateUrl });
    res.json({ ok: true, awarded: 10, totalPoints: updated.totalPoints });
  });
}
