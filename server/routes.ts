import type { Express } from "express";
import { storage } from "./storage";
import Anthropic from "@anthropic-ai/sdk";
import multer from "multer";
import { Jimp } from "jimp";
import PRODUCT_CATALOG from "./catalog";
import { SKIN_ANALYSIS_PROMPT, buildRecommendationPrompt, INGREDIENT_SCORE_PROMPT } from "./derma-prompts";

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
// All prompts imported from ./derma-prompts (clinical-grade dermatology standards)

// buildRecommendationPrompt imported from ./derma-prompts

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

      const preferences: string[] = (() => {
        const p = req.body.preferences;
        if (!p) return [];
        if (Array.isArray(p)) return p;
        try { return JSON.parse(p); } catch { return []; }
      })();
      const focus: string = req.body.focus || "skincare"; // default to skincare-first
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
        // Note: using [^]* instead of .* with s flag for ES2017 compatibility
        const match = dataUrl.match(/^data:(image\/[\w+]+);base64,([^]+)$/);
        if (!match) {
          const err = classifyError(new Error("no image"));
          return res.status(err.httpStatus).json({ ...err, ...(process.env.NODE_ENV !== "production" && { debugLog }) });
        }
        originalMimetype = match[1];
        rawBuffer = Buffer.from(match[2], "base64");
        log(`Base64 image received: ${rawBuffer.length} bytes, type=${originalMimetype}`);
      } else {
        const err = classifyError(new Error("no image"));
        return res.status(err.httpStatus).json({ ...err, ...(process.env.NODE_ENV !== "production" && { debugLog }) });
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
        return res.status(err.httpStatus).json({ ...err, ...(process.env.NODE_ENV !== "production" && { debugLog }) });
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
          max_tokens: 4096,
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
        return res.status(err.httpStatus).json({ ...err, ...(process.env.NODE_ENV !== "production" && { debugLog }) });
      }

      // ── Step 5: Parse skin analysis ──
      let skinAnalysis: any;
      try {
        const rawText = (analysisMsg.content[0] as any).text.trim();
        const cleaned = rawText.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
        // Try direct parse first
        try {
          skinAnalysis = JSON.parse(cleaned);
        } catch {
          // Attempt to recover truncated JSON by extracting up to last valid }
          const lastBrace = cleaned.lastIndexOf("}");
          if (lastBrace > 0) {
            const recovered = cleaned.substring(0, lastBrace + 1);
            skinAnalysis = JSON.parse(recovered);
          } else {
            throw new Error("No closing brace found");
          }
        }
        log(`Skin analysis parsed OK: tone=${skinAnalysis.skinTone}, type=${skinAnalysis.skinType}`);
      } catch (parseErr: any) {
        log(`Skin analysis parse failed: ${parseErr.message}`);
        const err = classifyError(new Error("parse failed"));
        return res.status(err.httpStatus).json({ ...err, ...(process.env.NODE_ENV !== "production" && { debugLog }) });
      }

      // ── Step 6: Product recommendations ──
      log("Calling Claude for product recommendations...");
      let recMsg: any;
      try {
        recMsg = await anthropic.messages.create({
          model: "claude-sonnet-4-5",
          max_tokens: 8000,
          messages: [{ role: "user", content: buildRecommendationPrompt(skinAnalysis, preferences, focus, PRODUCT_CATALOG as any[]) }],
        });
        log("Recommendations response received");
      } catch (recErr: any) {
        log(`Recommendations call failed: ${recErr.message}`);
        const err = classifyError(recErr);
        return res.status(err.httpStatus).json({ ...err, ...(process.env.NODE_ENV !== "production" && { debugLog }) });
      }

      // ── Step 7: Parse recommendations ──
      let recommendations: any;
      try {
        const rawText = (recMsg.content[0] as any).text.trim();
        // Strip markdown code fences if present
        const cleaned = rawText.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

        const tryRepairJSON = (text: string): any => {
          // Attempt 1: direct parse
          try { return JSON.parse(text); } catch {}
          // Attempt 2: extract first { ... } block
          const jsonMatch = text.match(/\{[\s\S]*/);
          const candidate = jsonMatch ? jsonMatch[0] : text;
          // Attempt 3: find last complete product object — truncate to last },\n  ]
          // Cut to last complete } inside recommendedProducts array
          const lastProductEnd = candidate.lastIndexOf('"clinicalBenefit"');
          let truncated = candidate;
          if (lastProductEnd > 0) {
            // Find closing } after last clinicalBenefit
            const closingBrace = candidate.indexOf('}', lastProductEnd);
            if (closingBrace > 0) {
              // Close the array and outer object
              truncated = candidate.substring(0, closingBrace + 1) + '\n  ],\n  "routineOrder": [],\n  "skinSummary": { "headline": "Analysis complete", "bulletPoints": [], "detailedAnalysis": "", "skinHealthScore": "B", "quickWins": [] },\n  "topConcernToAddress": "",\n  "clinicalWarnings": []\n}';
            }
          }
          // Attempt 4: try truncated
          try { return JSON.parse(truncated); } catch {}
          // Attempt 5: last resort — find last } and close
          const lastBrace = candidate.lastIndexOf('}');
          if (lastBrace > 0) {
            try { return JSON.parse(candidate.substring(0, lastBrace + 1) + '}'); } catch {}
            try { return JSON.parse(candidate.substring(0, lastBrace + 1)); } catch {}
          }
          throw new Error('All JSON repair attempts failed');
        }

        recommendations = tryRepairJSON(cleaned);
        // Ensure required fields exist
        if (!recommendations.recommendedProducts) recommendations.recommendedProducts = [];
        if (!recommendations.skinSummary) recommendations.skinSummary = { headline: 'Analysis complete', bulletPoints: [], detailedAnalysis: '', skinHealthScore: 'B', quickWins: [] };
        if (!recommendations.routineOrder) recommendations.routineOrder = [];
        if (!recommendations.clinicalWarnings) recommendations.clinicalWarnings = [];
        log(`Recommendations parsed OK: ${recommendations.recommendedProducts?.length} products`);
      } catch (parseErr: any) {
        log(`Recommendations parse failed: ${parseErr.message}`);
        const err = classifyError(new Error("parse failed"));
        return res.status(err.httpStatus).json({ ...err, ...(process.env.NODE_ENV !== "production" && { debugLog }) });
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
        ...(process.env.NODE_ENV !== "production" && { debugLog }),
      });

    } catch (err: any) {
      console.error("[BlushMap] Unhandled error:", err);
      debugLog.push(`Unhandled: ${err?.message}`);
      const classified = classifyError(err);
      res.status(classified.httpStatus).json({
        ...classified,
        ...(process.env.NODE_ENV !== "production" && { debugLog }),
      });
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
  // ── Detect product type from barcode prefix ──
  function detectProductType(code: string): "cosmetic" | "food" | "unknown" {
    // Korean beauty / cosmetic GS1 prefixes: 880 (South Korea)
    if (code.startsWith("880")) return "cosmetic";
    // Japanese: 45x, 49x — often cosmetic
    if (code.startsWith("45") || code.startsWith("49")) return "cosmetic";
    return "unknown";
  }

  app.get("/api/barcode/:code", async (req, res) => {
    const { code } = req.params;
    try {
      const productType = detectProductType(code);

      // ── Try multiple databases & URL formats ──
      const beautyUrls = [
        `https://world.openbeautyfacts.org/api/v2/product/${code}.json`,
        `https://world.openbeautyfacts.org/api/v0/product/${code}.json`,
        `https://uk.openbeautyfacts.org/api/v2/product/${code}.json`,
        `https://fr.openbeautyfacts.org/api/v2/product/${code}.json`,
      ];
      const foodUrls = [
        `https://world.openfoodfacts.org/api/v2/product/${code}.json`,
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`,
        `https://uk.openfoodfacts.org/api/v2/product/${code}.json`,
      ];
      const generalUrls = [
        `https://world.openproductsfacts.org/api/v2/product/${code}.json`,
        `https://world.openproductsfacts.org/api/v0/product/${code}.json`,
      ];

      const tryFetch = async (url: string) => {
        try {
          const r = await fetch(url, {
            signal: AbortSignal.timeout(6000),
            headers: { "User-Agent": "BlushMap/1.0 (blushmap.com; contact: blushmap@gmail.com)" },
          });
          if (!r.ok) return null;
          const d = await r.json() as any;
          if (d?.status === 1 && d.product) return d.product;
          if (d?.product && (d.product.product_name || d.product.ingredients_text)) return d.product;
          return null;
        } catch {
          return null;
        }
      };

      // Try beauty DBs in parallel first (fast path for cosmetics)
      let productData: any = null;
      const beautyResults = await Promise.allSettled(beautyUrls.map(tryFetch));
      for (const r of beautyResults) {
        if (r.status === "fulfilled" && r.value) { productData = r.value; break; }
      }
      // If not found in beauty, try food + general in parallel
      if (!productData) {
        const remainingResults = await Promise.allSettled([...foodUrls, ...generalUrls].map(tryFetch));
        for (const r of remainingResults) {
          if (r.status === "fulfilled" && r.value) { productData = r.value; break; }
        }
      }

      // ── UPCitemdb fallback — free tier, no auth, 100 lookups/day ──
      let upcFallback: { productName: string; brand: string; description: string; image: string | null; inferredCategoryHint: string } | null = null;
      if (!productData) {
        try {
          const upcRes = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`, {
            signal: AbortSignal.timeout(5000),
            headers: { "User-Agent": "BlushMap/1.0 (blushmap.com)" },
          });
          if (upcRes.ok) {
            const upcData = await upcRes.json() as any;
            const item = upcData?.items?.[0];
            if (item && item.title) {
              const titleLower = (item.title || "").toLowerCase();
              const descLower = (item.description || "").toLowerCase();
              let catHint = "skincare";
              if (titleLower.includes("cleanser") || titleLower.includes("cleansing") || descLower.includes("cleanser")) catHint = "cleanser";
              else if (titleLower.includes("serum") || descLower.includes("serum")) catHint = "serum";
              else if (titleLower.includes("moisturis") || titleLower.includes("cream") || titleLower.includes("lotion")) catHint = "moisturiser";
              else if (titleLower.includes("toner")) catHint = "toner";
              else if (titleLower.includes("sunscreen") || titleLower.includes("spf") || titleLower.includes("sun")) catHint = "sunscreen";
              else if (titleLower.includes("foundation") || titleLower.includes("concealer") || titleLower.includes("mascara") || titleLower.includes("blush") || titleLower.includes("lipstick")) catHint = "makeup";
              else if (titleLower.includes("shampoo") || titleLower.includes("conditioner") || titleLower.includes("hair")) catHint = "haircare";
              else if (titleLower.includes("food") || titleLower.includes("snack") || titleLower.includes("drink")) catHint = "food";
              upcFallback = {
                productName: item.title,
                brand: item.brand || "",
                description: item.description || "",
                image: item.images?.[0] || null,
                inferredCategoryHint: catHint,
              };
            }
          }
        } catch { /* UPC lookup failed — carry on */ }
      }

      if (!productData && !upcFallback) {
        return res.status(404).json({
          error: "Product not found",
          code,
          message: "We couldn't find this product in our databases. Try entering the ingredients manually or search by product name.",
        });
      }

      // ── Infer product category from database tags ──
      const rawCategories: string = productData?.categories || productData?.food_groups || "";
      const catLower = rawCategories.toLowerCase();
      let inferredCategory = upcFallback?.inferredCategoryHint || "skincare"; // default for beauty
      if (catLower.includes("foundation") || catLower.includes("concealer") || catLower.includes("mascara") ||
          catLower.includes("lipstick") || catLower.includes("eyeshadow") || catLower.includes("blush") ||
          catLower.includes("makeup") || catLower.includes("cosmetic")) {
        inferredCategory = "makeup";
      } else if (catLower.includes("shampoo") || catLower.includes("conditioner") || catLower.includes("hair")) {
        inferredCategory = "haircare";
      } else if (catLower.includes("food") || catLower.includes("drink") || catLower.includes("beverage") ||
                 catLower.includes("snack") || catLower.includes("dairy") || productType === "food") {
        inferredCategory = "food";
      } else if (catLower.includes("serum") || catLower.includes("moisturis") || catLower.includes("cleanser") ||
                 catLower.includes("toner") || catLower.includes("sunscreen") || catLower.includes("spf") ||
                 catLower.includes("skincare")) {
        inferredCategory = "skincare";
      }

      const p = productData || {}; // may be null when using UPC fallback

      // ── Build enriched ingredient list like Yuka ──
      const ingredientsList: {name: string; id: string; percent?: number; vegan?: boolean; vegetarian?: boolean}[] = [];
      if (p.ingredients && Array.isArray(p.ingredients)) {
        for (const ing of p.ingredients) {
          ingredientsList.push({
            name: ing.text || ing.id || "",
            id: ing.id || "",
            percent: ing.percent_estimate || ing.percent || undefined,
            vegan: ing.vegan === "yes" ? true : ing.vegan === "no" ? false : undefined,
            vegetarian: ing.vegetarian === "yes" ? true : ing.vegetarian === "no" ? false : undefined,
          });
        }
      }

      // ── Additive analysis (like Yuka) ──
      const additivesList: {code: string; name: string; riskLevel?: string}[] = [];
      if (p.additives_tags && Array.isArray(p.additives_tags)) {
        for (const tag of p.additives_tags) {
          const code = tag.replace("en:", "").toUpperCase();
          const riskTag = p.additives_original_tags?.find((t: string) => t.includes(code.toLowerCase()));
          additivesList.push({ code, name: code, riskLevel: undefined });
        }
      }

      res.json({
        barcode: code,
        productName: p.product_name || p.product_name_en || p.generic_name || upcFallback?.productName || null,
        brand: p.brands || upcFallback?.brand || null,
        ingredientsText: p.ingredients_text || p.ingredients_text_en || null,
        // Pass UPC description to Claude as extra context when no ingredient list is found
        ingredientsHint: (!p.ingredients_text && !p.ingredients_text_en && upcFallback?.description) ? upcFallback.description : null,
        ingredientsList: ingredientsList.slice(0, 50),
        image: p.image_front_url || p.image_url || p.image_small_url || upcFallback?.image || null,
        imageNutrition: p.image_nutrition_url || null,
        categories: p.categories || p.food_groups || null,
        productCategory: inferredCategory,
        labels: p.labels || null,
        quantity: p.quantity || null,
        // Yuka-equivalent scores
        nutriScore: p.nutriscore_grade || null,
        ecoScore: p.ecoscore_grade || null,
        novaGroup: p.nova_group || null,
        // Cosmetic-specific fields
        cosmeticScore: p.cosmetics_score || null,
        // Allergens
        allergens: p.allergens || p.allergens_from_ingredients || null,
        traceAllergens: p.traces || null,
        // Palm oil
        ingredientsFromPalmOil: p.ingredients_from_palm_oil_n || 0,
        // Additives
        additives: additivesList,
        additiveCount: additivesList.length,
        // Environmental
        packagingMaterials: p.packaging || null,
        // OFF-specific metadata
        offUrl: `https://world.openbeautyfacts.org/product/${code}`,
      });
    } catch (err: any) {
      res.status(500).json({ error: "Lookup failed", detail: err.message });
    }
  });

  // ── Ingredient score via Claude ──
  app.post("/api/score-ingredients", async (req, res) => {
    const { productName, brand, ingredientsText, ingredientsHint, barcode, productCategory } = req.body;

    // Allow scoring with barcode alone — Claude will do best-effort analysis
    if (!ingredientsText && !productName && !barcode) {
      return res.status(400).json({ error: "At least a barcode, product name, or ingredients are required" });
    }

    try {
      const anthropic = getAnthropicClient();
      // Build ingredients context: use full list if available, fall back to product description hint
      let ingredientsContext: string;
      if (ingredientsText) {
        ingredientsContext = ingredientsText;
      } else if (ingredientsHint) {
        ingredientsContext = `Full ingredient list not available. Product description from retailer: "${ingredientsHint}". Use this description to infer the product type, likely key ingredients, and formulation standards.`;
      } else {
        ingredientsContext = "Not available — score based on product name and brand reputation only";
      }
      const userContent = `Product: ${productName || "Unknown"}
Brand: ${brand || "Unknown"}
Barcode: ${barcode || "Unknown"}
Product Category: ${productCategory || "unknown — infer from product name"}
Ingredients: ${ingredientsContext}`;

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

  // ── Advertise enquiry ───────────────────────────────────────────────────
  app.post("/api/advertise-enquiry", async (req, res) => {
    try {
      const { brand, email, package: pkg, message } = req.body as {
        brand: string; email: string; package?: string; message?: string;
      };
      if (!brand || !email) {
        return res.status(400).json({ error: "Brand and email required" });
      }
      // Log enquiry (could send to Resend / CRM in production)
      console.log(`[ADVERTISE ENQUIRY] Brand: ${brand} | Email: ${email} | Package: ${pkg || 'TBD'} | Message: ${message || '-'}`);
      // Store as a subscriber tag for now
      await storage.subscribeEmail(email, brand, `advertise-enquiry:${pkg || 'general'}`).catch(() => {});
      return res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: "Enquiry failed", detail: err.message });
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

// INGREDIENT_SCORE_PROMPT imported from ./derma-prompts (clinical-grade EU Cosmetics Regulation standard)
