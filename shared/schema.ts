import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Analyses (existing) ───────────────────────────────────────────────────────
export const analyses = sqliteTable("analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  userId: integer("user_id"),
  imageData: text("image_data"),
  captureMethod: text("capture_method").notNull().default("upload"),
  skinTone: text("skin_tone"),
  undertone: text("undertone"),
  skinType: text("skin_type"),
  concerns: text("concerns"),
  faceShape: text("face_shape"),
  faceZones: text("face_zones"),
  preferences: text("preferences"),
  analysisResult: text("analysis_result"),
  recommendations: text("recommendations"),
  createdAt: integer("created_at").notNull().default(0),
});

// ── Users ─────────────────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash"),
  avatar: text("avatar"),
  skinType: text("skin_type"),
  skinConcerns: text("skin_concerns"),
  createdAt: integer("created_at").notNull().default(0),
  lastLoginAt: integer("last_login_at"),
});

// ── Face scan history (skin over time) ───────────────────────────────────────
export const faceScanHistory = sqliteTable("face_scan_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  analysisId: integer("analysis_id"),
  imageThumb: text("image_thumb"), // base64 thumbnail, max 200px
  skinScore: integer("skin_score"), // 0-100
  skinTone: text("skin_tone"),
  skinType: text("skin_type"),
  concerns: text("concerns"),
  notes: text("notes"),
  createdAt: integer("created_at").notNull().default(0),
});

// ── Saved products ────────────────────────────────────────────────────────────
export const savedProducts = sqliteTable("saved_products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  productBrand: text("product_brand"),
  productImage: text("product_image"),
  affiliateUrl: text("affiliate_url"),
  category: text("category"),
  status: text("status").notNull().default("saved"), // saved | purchased | tried
  notes: text("notes"),
  savedAt: integer("saved_at").notNull().default(0),
});

// ── Product scan history (barcode scans) ─────────────────────────────────────
export const productScans = sqliteTable("product_scans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id"),
  barcode: text("barcode").notNull(),
  productName: text("product_name"),
  brand: text("brand"),
  category: text("category"),
  score: integer("score"),
  scoreLabel: text("score_label"),
  ingredients: text("ingredients"),
  scanResult: text("scan_result"),
  createdAt: integer("created_at").notNull().default(0),
});

// ── Subscribers (existing) ────────────────────────────────────────────────────
export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  skinConcerns: text("skin_concerns"),
  createdAt: integer("created_at").notNull().default(0),
});

// ── Insert schemas ────────────────────────────────────────────────────────────
export const insertAnalysisSchema = createInsertSchema(analyses).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, lastLoginAt: true });

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type FaceScanHistory = typeof faceScanHistory.$inferSelect;
export type SavedProduct = typeof savedProducts.$inferSelect;
export type ProductScan = typeof productScans.$inferSelect;
