import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { analyses, type InsertAnalysis, type Analysis } from "@shared/schema";
import { eq } from "drizzle-orm";

const sqlite = new Database("blushmap.db");
const db = drizzle(sqlite);

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    image_data TEXT,
    capture_method TEXT NOT NULL DEFAULT 'upload',
    skin_tone TEXT,
    undertone TEXT,
    skin_type TEXT,
    concerns TEXT,
    face_shape TEXT,
    face_zones TEXT,
    preferences TEXT,
    analysis_result TEXT,
    recommendations TEXT,
    created_at INTEGER NOT NULL DEFAULT 0
  )
`);

export interface IStorage {
  createAnalysis(data: InsertAnalysis): Analysis;
  getAnalysis(id: number): Analysis | undefined;
  updateAnalysis(id: number, data: Partial<InsertAnalysis>): Analysis | undefined;
}

export const storage: IStorage = {
  createAnalysis(data) {
    return db.insert(analyses).values({
      ...data,
      createdAt: Date.now(),
    }).returning().get();
  },

  getAnalysis(id) {
    return db.select().from(analyses).where(eq(analyses.id, id)).get();
  },

  updateAnalysis(id, data) {
    return db.update(analyses).set(data).where(eq(analyses.id, id)).returning().get();
  },
};
