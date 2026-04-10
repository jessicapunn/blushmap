import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { analyses, type InsertAnalysis, type Analysis } from "@shared/schema";
import { eq } from "drizzle-orm";

const client = createClient({
  url: process.env.DATABASE_URL || "file:blushmap.db",
});

const db = drizzle(client);

// Create table on startup
async function initDb() {
  await client.execute(`
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
}

// Run init immediately
initDb().catch(console.error);

export interface IStorage {
  createAnalysis(data: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
  updateAnalysis(id: number, data: Partial<InsertAnalysis>): Promise<Analysis | undefined>;
}

export const storage: IStorage = {
  async createAnalysis(data) {
    const result = await db.insert(analyses).values({
      ...data,
      createdAt: Date.now(),
    }).returning();
    return result[0];
  },

  async getAnalysis(id) {
    const result = await db.select().from(analyses).where(eq(analyses.id, id));
    return result[0];
  },

  async updateAnalysis(id, data) {
    const result = await db.update(analyses).set(data).where(eq(analyses.id, id)).returning();
    return result[0];
  },
};
