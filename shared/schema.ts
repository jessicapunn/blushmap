import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analyses = sqliteTable("analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
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

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;
