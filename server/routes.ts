import type { Express } from "express";
import { storage } from "./storage";
import Anthropic from "@anthropic-ai/sdk";
import multer from "multer";
import { Jimp } from "jimp";
import PRODUCT_CATALOG from "./catalog";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize:  20 * 1024 * 1024,  // 20 MB for file uploads
    fieldSize: 25 * 1024 * 1024,  // 25 MB for base64 imageData text fields
    fields: 20,
  },
});

// Initialise Anthropic client lazily so token errors surface at request time, not boot time
function getAnthropicClient() {
  return new Anthropic();
}

const AFFILIATE_TAG = "blushmap-21";

// ---------- Error classification ----------
interface GlowError {
  code: string;
  title: string;
  detail: string;
  suggestion: string;
  httpStatus: number;
}

function classifyError(err: any): GlowError {
  const msg = (err?.message || err?.toString() || "").toLowerCase();

  if (msg.includes("401") || msg.includes("authentication") || msg.includes("invalid or expired")) {
    return {
      code: "AUTH_EXPIRED",
      title: "API session expired",
      detail: "The AI service token has expired. This happens when the server has been idle. The server needs to be restarted with fresh credentials.",
      suggestion: "Please refresh the page and try again. If the problem persists, the server needs to be restarted.",
      httpStatus: 503,
    };
  }
  if (msg.includes("rate") || msg.includes("429")) {
    return {
      code: "RATE_LIMITED",
      title: "Too many requests",
      detail: "The AI service is temporarily rate-limited.",
      suggestion: "Wait 30 seconds and try again.",
      httpStatus: 429,
    };
  }
  if (msg.includes("image") || msg.includes("media") || msg.includes("could not process")) {
    return {
      code: "IMAGE_REJECTED",
      title: "Image could not be processed",
      detail: "The AI could not read the image. It may be corrupted, in an unsupported format, or have no visible face.",
      suggestion: "Try a different photo — ideally a clear, well-lit selfie in JPEG or PNG format.",
      httpStatus: 422,
    };
  }
  if (msg.includes("parse") || msg.includes("json")) {
    return {
      code: "PARSE_FAILED",
      title: "AI response was malformed",
      detail: "The AI returned an unexpected response format. This is usually transient.",
      suggestion: "Try submitting again — this usually resolves on a second attempt.",
      httpStatus: 502,
    };
  }
  if (msg.includes("timeout") || msg.includes("econnreset") || msg.includes("network")) {
    return {
      code: "NETWORK_ERROR",
      title: "Network timeout",
      detail: "The request to the AI service timed out.",
      suggestion: "Check your connection and try again.",
      httpStatus: 504,
    };
  }
  if (msg.includes("no image") || msg.includes("no file")) {
    return {
      code: "NO_IMAGE",
      title: "No image received",
      detail: "The server did not receive an image. The upload may have been interrupted.",
      suggestion: "Try uploading again. Make sure the file is a JPEG or PNG.",
      httpStatus: 400,
    };
  }
  return {
    code: "UNKNOWN_ERROR",
    title: "Unexpected error",
    detail: err?.message || "An unknown error occurred in the analysis pipeline.",
    suggestion: "Try again. If this keeps happening, try a different photo.",
    httpStatus: 500,
  };
}

// ---------- Image preprocessing ----------
async function preprocessImage(buffer: Buffer, mimetype: string): Promise<{ base64: string; mediaType: string }> {
  try {
    const image = await Jimp.read(buffer);
    // Resize to max 800px on longest side
    if (image.width > 800 || image.height > 800) {
      image.scaleToFit({ w: 800, h: 800 });
    }
    const processed = await image.getBuffer("image/jpeg");
    return {
      base64: processed.toString("base64"),
      mediaType: "image/jpeg",
    };
  } catch {
    // If jimp fails, return original as-is
    return {
      base64: buffer.toString("base64"),
      mediaType: "image/jpeg",
    };
  }
}

// ---------- Product catalog ----------
// Each product now includes: keyIngredients[] and alternatives { budget, luxury, organic }
// ---------- AI Prompts ----------
const SKIN_ANALYSIS_PROMPT = `You are an expert cosmetic skin analyst and makeup artist. You will analyse a face image and provide a structured JSON assessment.

Analyse the face image and return ONLY valid JSON (no markdown, no code blocks) with exactly this structure:

{
  "skinTone": "fair|light|medium|tan|deep|rich",
  "undertone": "cool|warm|neutral|olive",
  "skinType": "dry|oily|combination|normal|sensitive",
  "concerns": ["hyperpigmentation", "acne", "redness", "dryness", "oiliness", "scarring", "dark-circles", "fine-lines", "uneven-texture"],
  "faceShape": "oval|round|square|heart|oblong",
  "faceZones": {
    "forehead": "description of visible skin condition in this zone",
    "tZone": "description of T-zone (forehead + nose) condition",
    "cheeks": "description of cheek condition",
    "underEyes": "description of under-eye area",
    "chin": "description of chin/jaw area",
    "nose": "description of nose/pore condition",
    "overall": "overall skin condition summary"
  },
  "rgbAnalysis": {
    "dominantTone": "brief description of the colour balance observed",
    "warmthLevel": "cool|neutral|warm",
    "luminosity": "dull|average|radiant"
  },
  "confidence": "high|medium|low",
  "notes": "Any additional observations about the skin that would inform product selection"
}

Only include concerns that are visibly present. Return ONLY the JSON object.`;

function buildRecommendationPrompt(analysis: any, preferences: string[]): string {
  return `You are a professional makeup artist and skincare consultant. Based on this skin analysis and user preferences, select the most appropriate products from the provided catalog.

SKIN ANALYSIS:
${JSON.stringify(analysis, null, 2)}

USER PREFERENCES: ${preferences.join(", ")}

PRODUCT CATALOG:
${JSON.stringify(PRODUCT_CATALOG, null, 2)}

Return ONLY valid JSON (no markdown) with this structure:
{
  "recommendedProducts": [
    {
      "productId": "p1",
      "priority": 1,
      "reason": "Why this product suits their specific skin profile",
      "applicationZone": "which face zone to apply",
      "usageTip": "specific application tip for their skin type"
    }
  ],
  "routineOrder": ["step1 product name", "step2", "step3"],
  "skinSummary": "2-3 sentence plain English summary of their skin profile",
  "topConcernToAddress": "the single most important skin concern to tackle first"
}

Select 4-7 products. Prioritise by impact. Match to user preferences when possible. Return ONLY the JSON.`;
}

// ---------- Routes ----------
export async function registerRoutes(httpServer: any, app: Express) {

  // Health check — frontend pings this before submitting
  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      apiKeyPresent: !!process.env.ANTHROPIC_API_KEY,
    });
  });

  // Analyse skin from image
  // Handle both JSON (base64 imageData) and multipart (file upload)
  const analyseMiddleware = (req: any, res: any, next: any) => {
    const ct = req.headers["content-type"] || "";
    if (ct.startsWith("multipart/")) {
      return upload.single("image")(req, res, next);
    }
    // JSON body — already parsed by express.json
    next();
  };

  app.post("/api/analyse", analyseMiddleware, async (req, res) => {
    const debugLog: string[] = [];
    const log = (msg: string) => { console.log(`[BlushMap] ${msg}`); debugLog.push(msg); };

    try {
      log("Request received");
      log(`Content-Type: ${req.headers["content-type"]?.substring(0, 80)}`);
      log(`req.file present: ${!!req.file}`);
      log(`req.body keys: ${Object.keys(req.body || {}).join(",")}`);
      const imageDataLen = req.body?.imageData?.length || 0;
      log(`imageData length: ${imageDataLen}`);

      const preferences: string[] = req.body.preferences ? JSON.parse(req.body.preferences) : [];
      const captureMethod: string = req.body.captureMethod || "upload";
      const sessionId = req.body.sessionId || `session_${Date.now()}`;
      log(`captureMethod=${captureMethod}, preferences=${preferences.join(",")}`);

      // ── Step 1: Extract image ──
      let rawBuffer: Buffer;
      let originalMimetype: string;

      if (req.file) {
        rawBuffer = req.file.buffer;
        originalMimetype = req.file.mimetype || "image/jpeg";
        log(`File upload received: ${rawBuffer.length} bytes, type=${originalMimetype}`);
      } else if (req.body.imageData) {
        const dataUrl: string = req.body.imageData;
        const match = dataUrl.match(/^data:(image\/[\w+]+);base64,(.+)$/s);
        if (!match) {
          const err = classifyError(new Error("no image"));
          return res.status(err.httpStatus).json({ ...err, debugLog });
        }
        originalMimetype = match[1];
        rawBuffer = Buffer.from(match[2], "base64");
        log(`Base64 image received: ${rawBuffer.length} bytes, type=${originalMimetype}`);
      } else {
        const err = classifyError(new Error("no image"));
        return res.status(err.httpStatus).json({ ...err, debugLog });
      }

      // ── Step 2: Preprocess (resize + auto-orient) ──
      log("Preprocessing image (resize, orient, compress)...");
      let imageBase64: string;
      let mediaType: string;
      try {
        const processed = await preprocessImage(rawBuffer, originalMimetype);
        imageBase64 = processed.base64;
        mediaType = processed.mediaType;
        log(`Preprocessed: ${Buffer.from(imageBase64, "base64").length} bytes`);
      } catch (preprocessErr: any) {
        log(`Preprocessing failed: ${preprocessErr.message}`);
        const err = classifyError(new Error("image could not process"));
        return res.status(err.httpStatus).json({ ...err, debugLog });
      }

      // ── Step 3: Save initial record ──
      const record = await storage.createAnalysis({
        sessionId,
        captureMethod,
        preferences: JSON.stringify(preferences),
        imageData: `data:${mediaType};base64,${imageBase64}`,
      });
      log(`DB record created: id=${record.id}`);

      // ── Step 4: Skin analysis via Claude Vision ──
      log("Calling Claude Vision for skin analysis...");
      const anthropic = getAnthropicClient();
      let analysisMsg: any;
      try {
        analysisMsg = await anthropic.messages.create({
          model: "claude-sonnet-4-5",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType as any, data: imageBase64 },
              },
              { type: "text", text: SKIN_ANALYSIS_PROMPT },
            ],
          }],
        });
        log("Claude Vision response received");
      } catch (aiErr: any) {
        log(`Claude Vision call failed: ${aiErr.message}`);
        const err = classifyError(aiErr);
        return res.status(err.httpStatus).json({ ...err, debugLog });
      }

      // ── Step 5: Parse skin analysis ──
      let skinAnalysis: any;
      try {
        const rawText = (analysisMsg.content[0] as any).text.trim();
        const cleaned = rawText.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
        skinAnalysis = JSON.parse(cleaned);
        log(`Skin analysis parsed OK: tone=${skinAnalysis.skinTone}, type=${skinAnalysis.skinType}`);
      } catch (parseErr: any) {
        log(`Skin analysis parse failed: ${parseErr.message}`);
        const err = classifyError(new Error("parse failed"));
        return res.status(err.httpStatus).json({ ...err, debugLog });
      }

      // ── Step 6: Product recommendations ──
      log("Calling Claude for product recommendations...");
      let recMsg: any;
      try {
        recMsg = await anthropic.messages.create({
          model: "claude-sonnet-4-5",
          max_tokens: 2000,
          messages: [{ role: "user", content: buildRecommendationPrompt(skinAnalysis, preferences) }],
        });
        log("Recommendations response received");
      } catch (recErr: any) {
        log(`Recommendations call failed: ${recErr.message}`);
        const err = classifyError(recErr);
        return res.status(err.httpStatus).json({ ...err, debugLog });
      }

      // ── Step 7: Parse recommendations ──
      let recommendations: any;
      try {
        const rawText = (recMsg.content[0] as any).text.trim();
        const cleaned = rawText.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
        recommendations = JSON.parse(cleaned);
        log(`Recommendations parsed OK: ${recommendations.recommendedProducts?.length} products`);
      } catch (parseErr: any) {
        log(`Recommendations parse failed: ${parseErr.message}`);
        const err = classifyError(new Error("parse failed"));
        return res.status(err.httpStatus).json({ ...err, debugLog });
      }

      // ── Step 8: Enrich + save ──
      const enrichedProducts = recommendations.recommendedProducts.map((rec: any) => {
        const product = PRODUCT_CATALOG.find(p => p.id === rec.productId);
        return { ...rec, product };
      }).filter((r: any) => r.product);

      await storage.updateAnalysis(record.id, {
        skinTone: skinAnalysis.skinTone,
        undertone: skinAnalysis.undertone,
        skinType: skinAnalysis.skinType,
        concerns: JSON.stringify(skinAnalysis.concerns),
        faceShape: skinAnalysis.faceShape,
        faceZones: JSON.stringify(skinAnalysis.faceZones),
        analysisResult: JSON.stringify(skinAnalysis),
        recommendations: JSON.stringify({ ...recommendations, recommendedProducts: enrichedProducts }),
      });
      log("Analysis complete and saved");

      res.json({
        id: record.id,
        skinAnalysis,
        recommendations: { ...recommendations, recommendedProducts: enrichedProducts },
        affiliateDisclosure: "Some links on this page are affiliate links. We may earn a small commission at no extra cost to you.",
        debugLog,
      });

    } catch (err: any) {
      console.error("[BlushMap] Unhandled error:", err);
      debugLog.push(`Unhandled: ${err?.message}`);
      const classified = classifyError(err);
      res.status(classified.httpStatus).json({ ...classified, debugLog });
    }
  });

  // Get a saved analysis
  app.get("/api/analysis/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const record = await storage.getAnalysis(id);
    if (!record) return res.status(404).json({ error: "Not found" });
    res.json(record);
  });

  // Full product catalog
  app.get("/api/products", (_req, res) => {
    res.json(PRODUCT_CATALOG);
  });

  // Product search — query, category, concern, bestseller, newIn
  // ── Single product by ID ──
  app.get("/api/products/:id", (req, res) => {
    const product = PRODUCT_CATALOG.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  });

  app.get("/api/search", (req, res) => {
    const q = ((req.query.q as string) || "").toLowerCase().trim();
    const category = (req.query.category as string || "").toLowerCase();
    const concern = (req.query.concern as string || "").toLowerCase();
    const bestseller = req.query.bestseller === "true";
    const newIn = req.query.newIn === "true";

    let results = [...PRODUCT_CATALOG];

    if (bestseller) results = results.filter(p => p.bestSeller);
    if (newIn)      results = results.filter(p => p.newIn);
    if (category)   results = results.filter(p => p.category === category);

    if (concern) {
      results = results.filter(p =>
        p.tags.some(t => t.includes(concern)) ||
        p.suitableFor.some(s => s.includes(concern)) ||
        p.description.toLowerCase().includes(concern)
      );
    }

    if (q) {
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q)) ||
        p.keyIngredients.some(i => i.name.toLowerCase().includes(q) || i.benefit.toLowerCase().includes(q))
      );
    }

    res.json({ results, total: results.length });
  });

  // ── Barcode lookup — tries Open Beauty Facts then Open Food Facts ──
  app.get("/api/barcode/:code", async (req, res) => {
    const { code } = req.params;
    try {
      // Try beauty first, then food
      let productData: any = null;
      const sources = [
        `https://world.openbeautyfacts.org/api/v2/product/${code}.json`,
        `https://world.openfoodfacts.org/api/v2/product/${code}.json`,
        `https://world.openproductsfacts.org/api/v2/product/${code}.json`,
      ];
      for (const url of sources) {
        try {
          const r = await fetch(url, { signal: AbortSignal.timeout(4000) });
          const d = await r.json() as any;
          if (d && d.status === 1 && d.product) { productData = d.product; break; }
        } catch { /* try next */ }
      }

      if (!productData) {
        return res.status(404).json({ error: "Product not found", code });
      }

      const p = productData;
      res.json({
        barcode: code,
        productName: p.product_name || p.product_name_en || p.generic_name || null,
        brand: p.brands || null,
        ingredientsText: p.ingredients_text || p.ingredients_text_en || null,
        image: p.image_front_url || p.image_url || null,
        categories: p.categories || p.food_groups || null,
        nutriScore: p.nutriscore_grade || null,
        ecoScore: p.ecoscore_grade || null,
        novaGroup: p.nova_group || null,
      });
    } catch (err: any) {
      res.status(500).json({ error: "Lookup failed", detail: err.message });
    }
  });

  // ── Ingredient score via Claude ──
  app.post("/api/score-ingredients", async (req, res) => {
    const { productName, brand, ingredientsText, barcode } = req.body;

    if (!ingredientsText && !productName) {
      return res.status(400).json({ error: "ingredientsText or productName required" });
    }

    try {
      const anthropic = getAnthropicClient();
      const userContent = `Product: ${productName || "Unknown"}
Brand: ${brand || "Unknown"}
Barcode: ${barcode || "Unknown"}
Ingredients: ${ingredientsText || "Not available — score based on product name and brand reputation only"}`;

      const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 3000,
        messages: [{ role: "user", content: `${INGREDIENT_SCORE_PROMPT}\n\n${userContent}` }],
      });

      const rawText = (msg.content[0] as any).text.trim();
      const cleaned = rawText.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
      const result = JSON.parse(cleaned);

      // Save scan to user history if authenticated
      const uid = (req.session as any)?.userId;
      await storage.saveProductScan({
        userId: uid || undefined,
        barcode: barcode || "",
        productName: productName || "",
        brand: brand || "",
        score: result.score,
        scoreLabel: result.scoreLabel,
        ingredients: ingredientsText?.substring(0, 1000),
        scanResult: JSON.stringify(result).substring(0, 2000),
      }).catch(() => {});

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: "Scoring failed", detail: err.message });
    }
  });

  // ── Email signup ──────────────────────────────────────────────────────────
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email, name, skinConcerns } = req.body as { email: string; name?: string; skinConcerns?: string };
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        return res.status(400).json({ error: "Please enter a valid email address." });
      }
      const result = await storage.subscribeEmail(email, name, skinConcerns);
      if (result.alreadySubscribed) {
        return res.json({ ok: true, message: "You're already on the list — we'll keep you posted." });
      }
      return res.json({ ok: true, message: "You're on the list! Expect curated offers and recommendations in your inbox." });
    } catch (err: any) {
      res.status(500).json({ error: "Signup failed", detail: err.message });
    }
  });
}

// ─────────────────────────────────────────────
// BARCODE SCANNER — ingredient scoring
// ─────────────────────────────────────────────

const INGREDIENT_SCORE_PROMPT = `You are an expert cosmetic chemist and clean beauty analyst, similar to the Yuka app.

Given the following cosmetic/beauty product information, analyse the ingredients and return ONLY valid JSON with this exact structure:

{
  "productName": "full product name",
  "brand": "brand name",
  "score": 73,
  "scoreLabel": "Good",
  "scoreColour": "#4CAF50",
  "summary": "2-3 sentence plain English overview of this product's ingredient quality",
  "ingredients": [
    {
      "name": "Aqua",
      "inci": "Water",
      "role": "Solvent",
      "rating": "good",
      "concern": null,
      "detail": "Universal solvent — safe and essential"
    },
    {
      "name": "Parfum",
      "inci": "Fragrance",
      "role": "Fragrance",
      "rating": "caution",
      "concern": "Potential allergen",
      "detail": "Synthetic fragrance blend — can trigger reactions in sensitive skin"
    }
  ],
  "pros": ["Fragrance-free", "Rich in ceramides", "Dermatologist tested"],
  "cons": ["Contains parabens", "High alcohol content"],
  "certifications": ["cruelty-free", "vegan"],
  "bestFor": ["dry skin", "sensitive skin"],
  "avoid": ["rosacea", "fragrance allergy"],
  "overallVerdict": "A well-formulated moisturiser with strong barrier-repair ingredients. Suitable for most skin types."
}

Score guide:
- 85-100: Excellent (dark green) #2E7D32
- 70-84: Good (green) #4CAF50  
- 50-69: Average (amber) #FF9800
- 25-49: Poor (orange-red) #F44336
- 0-24: Hazardous (red) #B71C1C

scoreLabel: "Excellent" | "Good" | "Average" | "Poor" | "Hazardous",
  cleanCertified: true/false — true only if score >= 75 with no red ingredients,
  redIngredients: ["any harmful/concerning ingredients found"],
  greenIngredients: ["top 3 hero beneficial ingredients"]

For ingredient rating: "good" | "caution" | "poor"

Score based on:
- Presence of known irritants/harmful ingredients (parabens, SLS, formaldehyde releasers, certain alcohols)
- Quality of beneficial actives
- Fragrance/allergen risk
- Overall formulation standard

Return ONLY the JSON object, no markdown.`;
