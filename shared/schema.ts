import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analyses = sqliteTable("analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  imageData: text("image_data"), // base64 of uploaded/captured image
  captureMethod: text("capture_method").notNull().default("upload"), // "upload" | "camera" | "live-rgb"
  skinTone: text("skin_tone"),
  undertone: text("undertone"),
  skinType: text("skin_type"),
  concerns: text("concerns"), // JSON array
  faceShape: text("face_shape"),
  faceZones: text("face_zones"), // JSON object with zone-specific analysis
  preferences: text("preferences"), // JSON array of user prefs
  analysisResult: text("analysis_result"), // Full AI analysis JSON
  recommendations: text("recommendations"), // JSON array of product recs
  createdAt: integer("created_at").notNull().default(0),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;
