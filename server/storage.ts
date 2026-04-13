import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { eq, desc, and } from "drizzle-orm";
import { analyses, users, faceScanHistory, savedProducts, productScans, subscribers } from "@shared/schema";
import type {
  InsertAnalysis, Analysis, InsertUser, User,
  FaceScanHistory, SavedProduct, ProductScan,
} from "@shared/schema";
import bcrypt from "bcryptjs";

const client = createClient({
  url: process.env.DATABASE_URL || "file:blushmap.db",
});
const db = drizzle(client);

// ── Init tables ───────────────────────────────────────────────────────────────
async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      user_id INTEGER,
      image_data TEXT,
      capture_method TEXT NOT NULL DEFAULT 'upload',
      skin_tone TEXT, undertone TEXT, skin_type TEXT,
      concerns TEXT, face_shape TEXT, face_zones TEXT,
      preferences TEXT, analysis_result TEXT, recommendations TEXT,
      created_at INTEGER NOT NULL DEFAULT 0
    )`);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      password_hash TEXT,
      avatar TEXT,
      skin_type TEXT,
      skin_concerns TEXT,
      created_at INTEGER NOT NULL DEFAULT 0,
      last_login_at INTEGER
    )`);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS face_scan_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      analysis_id INTEGER,
      image_thumb TEXT,
      skin_score INTEGER,
      skin_tone TEXT,
      skin_type TEXT,
      concerns TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL DEFAULT 0
    )`);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS saved_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_brand TEXT,
      product_image TEXT,
      affiliate_url TEXT,
      category TEXT,
      status TEXT NOT NULL DEFAULT 'saved',
      notes TEXT,
      saved_at INTEGER NOT NULL DEFAULT 0
    )`);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS product_scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      barcode TEXT NOT NULL,
      product_name TEXT,
      brand TEXT,
      category TEXT,
      score INTEGER,
      score_label TEXT,
      ingredients TEXT,
      scan_result TEXT,
      created_at INTEGER NOT NULL DEFAULT 0
    )`);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      skin_concerns TEXT,
      created_at INTEGER NOT NULL DEFAULT 0
    )`);
}
initDb().catch(console.error);

// ── Auth helpers ──────────────────────────────────────────────────────────────
export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 12);
}
export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

// ── Storage interface ─────────────────────────────────────────────────────────
export const storage = {
  // ── Analyses ──
  async createAnalysis(data: InsertAnalysis): Promise<Analysis> {
    const result = await db.insert(analyses).values({ ...data, createdAt: Date.now() }).returning();
    return result[0];
  },
  async getAnalysis(id: number): Promise<Analysis | undefined> {
    const result = await db.select().from(analyses).where(eq(analyses.id, id));
    return result[0];
  },
  async updateAnalysis(id: number, data: Partial<InsertAnalysis>): Promise<Analysis | undefined> {
    const result = await db.update(analyses).set(data).where(eq(analyses.id, id)).returning();
    return result[0];
  },
  async getUserAnalyses(userId: number): Promise<Analysis[]> {
    return db.select().from(analyses)
      .where(eq(analyses.userId, userId))
      .orderBy(desc(analyses.createdAt))
      .limit(20);
  },

  // ── Users ──
  async createUser(email: string, name: string, password: string): Promise<User> {
    const passwordHash = await hashPassword(password);
    const result = await db.insert(users).values({
      email: email.toLowerCase().trim(), name, passwordHash, createdAt: Date.now(),
    }).returning();
    return result[0];
  },
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
    return result[0];
  },
  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  },
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  },
  async touchLogin(id: number) {
    await db.update(users).set({ lastLoginAt: Date.now() }).where(eq(users.id, id));
  },

  // ── Face scan history ──
  async addFaceScan(userId: number, data: {
    analysisId?: number; imageThumb?: string; skinScore?: number;
    skinTone?: string; skinType?: string; concerns?: string; notes?: string;
  }): Promise<FaceScanHistory> {
    const result = await db.insert(faceScanHistory).values({
      userId, createdAt: Date.now(), ...data,
    }).returning();
    return result[0];
  },
  async getFaceScanHistory(userId: number): Promise<FaceScanHistory[]> {
    return db.select().from(faceScanHistory)
      .where(eq(faceScanHistory.userId, userId))
      .orderBy(desc(faceScanHistory.createdAt))
      .limit(50);
  },

  // ── Saved products ──
  async saveProduct(userId: number, data: {
    productId: string; productName: string; productBrand?: string;
    productImage?: string; affiliateUrl?: string; category?: string;
  }): Promise<SavedProduct> {
    // Upsert: if already saved, update timestamp
    const existing = await db.select().from(savedProducts)
      .where(and(eq(savedProducts.userId, userId), eq(savedProducts.productId, data.productId)));
    if (existing.length > 0) {
      const result = await db.update(savedProducts)
        .set({ savedAt: Date.now(), status: "saved" })
        .where(eq(savedProducts.id, existing[0].id))
        .returning();
      return result[0];
    }
    const result = await db.insert(savedProducts).values({
      userId, savedAt: Date.now(), status: "saved", ...data,
    }).returning();
    return result[0];
  },
  async getSavedProducts(userId: number): Promise<SavedProduct[]> {
    return db.select().from(savedProducts)
      .where(eq(savedProducts.userId, userId))
      .orderBy(desc(savedProducts.savedAt));
  },
  async updateSavedProductStatus(id: number, userId: number, status: string): Promise<void> {
    await db.update(savedProducts).set({ status }).where(
      and(eq(savedProducts.id, id), eq(savedProducts.userId, userId))
    );
  },
  async removeSavedProduct(id: number, userId: number): Promise<void> {
    await db.delete(savedProducts).where(
      and(eq(savedProducts.id, id), eq(savedProducts.userId, userId))
    );
  },

  // ── Product scan history ──
  async saveProductScan(data: {
    userId?: number; barcode: string; productName?: string; brand?: string;
    category?: string; score?: number; scoreLabel?: string;
    ingredients?: string; scanResult?: string;
  }): Promise<ProductScan> {
    const result = await db.insert(productScans).values({
      ...data, createdAt: Date.now(),
    }).returning();
    return result[0];
  },
  async getProductScanHistory(userId: number): Promise<ProductScan[]> {
    return db.select().from(productScans)
      .where(eq(productScans.userId, userId))
      .orderBy(desc(productScans.createdAt))
      .limit(30);
  },

  // ── Subscribers ──
  async subscribeEmail(email: string, name?: string, skinConcerns?: string) {
    const existing = await client.execute({
      sql: "SELECT id, email FROM subscribers WHERE email = ?",
      args: [email.toLowerCase().trim()],
    });
    if (existing.rows.length > 0) {
      return { id: Number(existing.rows[0][0]), email: String(existing.rows[0][1]), alreadySubscribed: true };
    }
    const result = await client.execute({
      sql: "INSERT INTO subscribers (email, name, skin_concerns, created_at) VALUES (?, ?, ?, ?) RETURNING id, email",
      args: [email.toLowerCase().trim(), name || null, skinConcerns || null, Date.now()],
    });
    return { id: Number(result.rows[0][0]), email: String(result.rows[0][1]), alreadySubscribed: false };
  },
};
