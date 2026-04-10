import type { Express } from "express";
import { storage } from "./storage";
import Anthropic from "@anthropic-ai/sdk";
import multer from "multer";
import sharp from "sharp";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

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
  const status = err?.status || err?.statusCode || 500;

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
  // Resize to max 800px on longest side, convert to JPEG for consistency
  const processed = await sharp(buffer)
    .rotate() // auto-orient from EXIF
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 88 })
    .toBuffer();

  return {
    base64: processed.toString("base64"),
    mediaType: "image/jpeg",
  };
}

// ---------- Product catalog ----------
const PRODUCT_CATALOG = [
  {
    id: "p1", name: "CeraVe Moisturising Cream", brand: "CeraVe", category: "moisturiser",
    tags: ["dry", "sensitive", "fragrance-free", "dermatologist-tested"],
    description: "Barrier-restoring formula with ceramides and hyaluronic acid.",
    price: "£14.50", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=CeraVe+Moisturising+Cream&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "cheeks", "forehead"],
    suitableFor: ["dry", "combination", "sensitive"],
  },
  {
    id: "p2", name: "Neutrogena Hydro Boost Gel-Cream", brand: "Neutrogena", category: "moisturiser",
    tags: ["oily", "combination", "hyaluronic-acid", "lightweight"],
    description: "Lightweight water-gel locks in hydration without greasiness.",
    price: "£16.99", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Neutrogena+Hydro+Boost+Gel+Cream&tag=${AFFILIATE_TAG}`,
    zones: ["t-zone", "full-face"],
    suitableFor: ["oily", "combination", "normal"],
  },
  {
    id: "p3", name: "Tatcha The Water Cream", brand: "Tatcha", category: "moisturiser",
    tags: ["oily", "korean-inspired", "anti-pore", "luxury"],
    description: "Japanese-inspired oil-free formula that minimises the look of pores.",
    price: "£69.00", image: "https://images.unsplash.com/photo-1591106840545-9e5a3b3b9e10?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Tatcha+Water+Cream&tag=${AFFILIATE_TAG}`,
    zones: ["t-zone", "full-face"],
    suitableFor: ["oily", "combination"],
  },
  {
    id: "p4", name: "The Ordinary Niacinamide 10% + Zinc 1%", brand: "The Ordinary", category: "serum",
    tags: ["oily", "blemish-prone", "pores", "budget-friendly", "vegan"],
    description: "Controls excess sebum, minimises pores and blemishes.",
    price: "£5.90", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=The+Ordinary+Niacinamide+10&tag=${AFFILIATE_TAG}`,
    zones: ["t-zone", "cheeks"],
    suitableFor: ["oily", "combination", "blemish-prone"],
  },
  {
    id: "p5", name: "SkinCeuticals C E Ferulic", brand: "SkinCeuticals", category: "serum",
    tags: ["vitamin-c", "anti-aging", "hyperpigmentation", "luxury", "brightening"],
    description: "Gold-standard antioxidant serum for brightening and anti-ageing.",
    price: "£166.00", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=SkinCeuticals+CE+Ferulic&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "dark-spots"],
    suitableFor: ["normal", "dry", "combination", "mature"],
  },
  {
    id: "p6", name: "Paula's Choice BHA Exfoliant", brand: "Paula's Choice", category: "serum",
    tags: ["blemish-prone", "pores", "exfoliant", "cruelty-free", "vegan"],
    description: "Unclogs pores and smooths skin texture with 2% salicylic acid.",
    price: "£32.00", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Paulas+Choice+BHA+Exfoliant&tag=${AFFILIATE_TAG}`,
    zones: ["t-zone", "nose", "chin"],
    suitableFor: ["oily", "combination", "blemish-prone"],
  },
  {
    id: "p7", name: "La Roche-Posay Anthelios SPF 50+", brand: "La Roche-Posay", category: "spf",
    tags: ["spf", "sensitive", "fragrance-free", "no-white-cast"],
    description: "Broad-spectrum SPF50+ with invisible finish for all skin tones.",
    price: "£19.50", image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=La+Roche+Posay+Anthelios+SPF50&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "neck"],
    suitableFor: ["all", "sensitive"],
  },
  {
    id: "p8", name: "Black Girl Sunscreen SPF 30", brand: "Black Girl Sunscreen", category: "spf",
    tags: ["spf", "dark-skin", "no-white-cast", "moisturising"],
    description: "Zero white cast, moisturising SPF30 for medium-to-deep skin tones.",
    price: "£18.00", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Black+Girl+Sunscreen+SPF30&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "neck"],
    suitableFor: ["all", "oily", "combination"],
  },
  {
    id: "p9", name: "NARS Natural Radiant Longwear Foundation", brand: "NARS", category: "foundation",
    tags: ["medium-coverage", "radiant", "long-wearing", "inclusive-shades"],
    description: "Buildable medium coverage with a natural, skin-like radiance.",
    price: "£40.00", image: "https://images.unsplash.com/photo-1590156562745-5e36e44ab9e2?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=NARS+Natural+Radiant+Foundation&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "under-eyes"],
    suitableFor: ["normal", "dry", "combination"],
  },
  {
    id: "p10", name: "Fenty Beauty Pro Filt'r Foundation", brand: "Fenty Beauty", category: "foundation",
    tags: ["full-coverage", "oily", "matte", "inclusive-shades", "long-wearing"],
    description: "40+ shades, full coverage matte finish that controls oil all day.",
    price: "£34.00", image: "https://images.unsplash.com/photo-1590156562745-5e36e44ab9e2?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Fenty+Beauty+Pro+Filtr+Foundation&tag=${AFFILIATE_TAG}`,
    zones: ["full-face"],
    suitableFor: ["oily", "combination"],
  },
  {
    id: "p11", name: "RMS Beauty Un Cover-Up Concealer", brand: "RMS Beauty", category: "concealer",
    tags: ["organic", "clean", "natural", "sensitive", "cruelty-free"],
    description: "Raw, food-grade organic ingredients in a creamy under-eye concealer.",
    price: "£30.00", image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=RMS+Beauty+Concealer&tag=${AFFILIATE_TAG}`,
    zones: ["under-eyes", "dark-spots"],
    suitableFor: ["all", "sensitive", "dry"],
  },
  {
    id: "p12", name: "ILIA Super Serum Skin Tint SPF 40", brand: "ILIA", category: "tinted-spf",
    tags: ["organic", "clean", "spf", "natural", "tinted", "lightweight"],
    description: "Skincare-first tinted SPF with 30% skincare actives and buildable coverage.",
    price: "£48.00", image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=ILIA+Super+Serum+Skin+Tint&tag=${AFFILIATE_TAG}`,
    zones: ["full-face"],
    suitableFor: ["all", "sensitive"],
  },
  {
    id: "p13", name: "COSRX Snail Mucin 96% Power Repairing Essence", brand: "COSRX", category: "essence",
    tags: ["korean", "hydrating", "scarring", "repair", "sensitive", "cruelty-free"],
    description: "96% snail secretion filtrate to repair and hydrate damaged skin.",
    price: "£22.00", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=COSRX+Snail+Mucin+96&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "scarring", "dark-spots"],
    suitableFor: ["all", "sensitive", "dry"],
  },
  {
    id: "p14", name: "Some By Mi AHA BHA PHA 30 Days Miracle Toner", brand: "Some By Mi", category: "toner",
    tags: ["korean", "exfoliant", "blemish-prone", "brightening", "vegan"],
    description: "Triple-acid exfoliating toner that visibly clears blemishes in 30 days.",
    price: "£16.00", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Some+By+Mi+AHA+BHA+Toner&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "t-zone"],
    suitableFor: ["oily", "combination", "blemish-prone"],
  },
  {
    id: "p15", name: "Kiehl's Creamy Eye Treatment with Avocado", brand: "Kiehl's", category: "eye-cream",
    tags: ["dry", "under-eyes", "nourishing", "anti-aging"],
    description: "Rich avocado-infused eye cream for dry, delicate under-eye skin.",
    price: "£32.00", image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Kiehls+Creamy+Eye+Treatment&tag=${AFFILIATE_TAG}`,
    zones: ["under-eyes"],
    suitableFor: ["dry", "normal", "mature"],
  },
];

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
  app.post("/api/analyse", upload.single("image"), async (req, res) => {
    const debugLog: string[] = [];
    const log = (msg: string) => { console.log(`[BlushMap] ${msg}`); debugLog.push(msg); };

    try {
      log("Request received");

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
      const record = storage.createAnalysis({
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

      storage.updateAnalysis(record.id, {
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
  app.get("/api/analysis/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const record = storage.getAnalysis(id);
    if (!record) return res.status(404).json({ error: "Not found" });
    res.json(record);
  });

  // Product catalog
  app.get("/api/products", (_req, res) => {
    res.json(PRODUCT_CATALOG);
  });
}
