import type { Express } from "express";
import { storage } from "./storage";
import Anthropic from "@anthropic-ai/sdk";
import multer from "multer";
import { Jimp } from "jimp";

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
const PRODUCT_CATALOG = [
  {
    id: "p1", name: "CeraVe Moisturising Cream", brand: "CeraVe", category: "moisturiser",
    tags: ["dry", "sensitive", "fragrance-free", "dermatologist-tested"],
    description: "Barrier-restoring formula with ceramides and hyaluronic acid.",
    price: "£14.50", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=CeraVe+Moisturising+Cream&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "cheeks", "forehead"],
    suitableFor: ["dry", "combination", "sensitive"],
    keyIngredients: [
      { name: "Ceramides NP, AP, EOP", benefit: "Restore and strengthen the skin barrier" },
      { name: "Hyaluronic Acid", benefit: "Draws moisture deep into the skin" },
      { name: "Niacinamide", benefit: "Calms redness and improves skin texture" },
    ],
    alternatives: {
      budget: {
        name: "Simple Kind to Skin Moisturiser", brand: "Simple", price: "£5.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Simple+Kind+to+Skin+Moisturiser&tag=${AFFILIATE_TAG}`,
        reason: "Fragrance-free, hypoallergenic formula at a fraction of the price.",
      },
      luxury: {
        name: "La Mer Crème de la Mer", brand: "La Mer", price: "£145.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=La+Mer+Creme+de+la+Mer&tag=${AFFILIATE_TAG}`,
        reason: "Legendary Miracle Broth™ delivers unrivalled barrier repair and radiance.",
      },
      organic: {
        name: "Pai Skincare Chamomile & Rosehip Calming Day Cream", brand: "Pai Skincare", price: "£39.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Pai+Skincare+Chamomile+Rosehip+Day+Cream&tag=${AFFILIATE_TAG}`,
        reason: "Certified organic, perfect for reactive and sensitive skin types.",
      },
    },
  },
  {
    id: "p2", name: "Neutrogena Hydro Boost Gel-Cream", brand: "Neutrogena", category: "moisturiser",
    tags: ["oily", "combination", "hyaluronic-acid", "lightweight"],
    description: "Lightweight water-gel locks in hydration without greasiness.",
    price: "£16.99", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Neutrogena+Hydro+Boost+Gel+Cream&tag=${AFFILIATE_TAG}`,
    zones: ["t-zone", "full-face"],
    suitableFor: ["oily", "combination", "normal"],
    keyIngredients: [
      { name: "Purified Hyaluronic Acid", benefit: "Quenches skin and locks in moisture" },
      { name: "Dimethicone", benefit: "Creates a smooth, non-greasy skin barrier" },
      { name: "Olive Extract", benefit: "Antioxidant protection for daily hydration" },
    ],
    alternatives: {
      budget: {
        name: "The Ordinary Natural Moisturising Factors", brand: "The Ordinary", price: "£5.50",
        affiliateUrl: `https://www.amazon.co.uk/s?k=The+Ordinary+Natural+Moisturising+Factors&tag=${AFFILIATE_TAG}`,
        reason: "Minimal, science-backed hydration without the premium price tag.",
      },
      luxury: {
        name: "Dior Hydra Life Gel Crème", brand: "Dior", price: "£58.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Dior+Hydra+Life+Gel+Creme&tag=${AFFILIATE_TAG}`,
        reason: "Luxurious aqua-gel texture with wild rose microbiome support.",
      },
      organic: {
        name: "Green People Moisturiser", brand: "Green People", price: "£24.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Green+People+Organic+Moisturiser&tag=${AFFILIATE_TAG}`,
        reason: "98% natural, certified organic — lightweight hydration without nasties.",
      },
    },
  },
  {
    id: "p3", name: "Tatcha The Water Cream", brand: "Tatcha", category: "moisturiser",
    tags: ["oily", "korean-inspired", "anti-pore", "luxury"],
    description: "Japanese-inspired oil-free formula that minimises the look of pores.",
    price: "£69.00", image: "https://images.unsplash.com/photo-1591106840545-9e5a3b3b9e10?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Tatcha+Water+Cream&tag=${AFFILIATE_TAG}`,
    zones: ["t-zone", "full-face"],
    suitableFor: ["oily", "combination"],
    keyIngredients: [
      { name: "Japanese Wild Rose", benefit: "Minimises enlarged pores and controls oil" },
      { name: "Hadasei-3™ Complex", benefit: "Bio-fermented green tea, rice, algae for glow" },
      { name: "Leopard Lily Extract", benefit: "Tightens and blurs the appearance of pores" },
    ],
    alternatives: {
      budget: {
        name: "e.l.f. Holy Hydration Face Cream", brand: "e.l.f.", price: "£12.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=elf+Holy+Hydration+Face+Cream&tag=${AFFILIATE_TAG}`,
        reason: "Vegan, cruelty-free oil-control moisturiser at a budget-friendly price.",
      },
      luxury: {
        name: "SK-II Facial Treatment Essence", brand: "SK-II", price: "£89.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=SKII+Facial+Treatment+Essence&tag=${AFFILIATE_TAG}`,
        reason: "Iconic Pitera™ essence — the gold standard for luminous, poreless skin.",
      },
      organic: {
        name: "Herbivore Botanicals Lapis Facial Oil", brand: "Herbivore", price: "£42.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Herbivore+Lapis+Facial+Oil&tag=${AFFILIATE_TAG}`,
        reason: "100% natural, blue tansy + squalane oil for balancing oily skin.",
      },
    },
  },
  {
    id: "p4", name: "The Ordinary Niacinamide 10% + Zinc 1%", brand: "The Ordinary", category: "serum",
    tags: ["oily", "blemish-prone", "pores", "budget-friendly", "vegan"],
    description: "Controls excess sebum, minimises pores and blemishes.",
    price: "£5.90", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=The+Ordinary+Niacinamide+10&tag=${AFFILIATE_TAG}`,
    zones: ["t-zone", "cheeks"],
    suitableFor: ["oily", "combination", "blemish-prone"],
    keyIngredients: [
      { name: "Niacinamide 10%", benefit: "Reduces pore size and controls sebum production" },
      { name: "Zinc PCA 1%", benefit: "Antibacterial — fights blemishes and balances oil" },
      { name: "Tamarindus Indica", benefit: "Polysaccharide that supports surface hydration" },
    ],
    alternatives: {
      budget: {
        name: "Revolution Skincare 10% Niacinamide", brand: "Revolution Skincare", price: "£4.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Revolution+Skincare+Niacinamide&tag=${AFFILIATE_TAG}`,
        reason: "Near-identical formulation at an even lower price point.",
      },
      luxury: {
        name: "Paula's Choice 10% Niacinamide Booster", brand: "Paula's Choice", price: "£42.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Paulas+Choice+Niacinamide+Booster&tag=${AFFILIATE_TAG}`,
        reason: "Higher-performance formula with skin-smoothing peptides and antioxidants.",
      },
      organic: {
        name: "Avalon Organics Vitamin C Renewal Serum", brand: "Avalon Organics", price: "£18.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Avalon+Organics+Vitamin+C+Serum&tag=${AFFILIATE_TAG}`,
        reason: "USDA certified organic serum for brightening and pore refinement.",
      },
    },
  },
  {
    id: "p5", name: "SkinCeuticals C E Ferulic", brand: "SkinCeuticals", category: "serum",
    tags: ["vitamin-c", "anti-aging", "hyperpigmentation", "luxury", "brightening"],
    description: "Gold-standard antioxidant serum for brightening and anti-ageing.",
    price: "£166.00", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=SkinCeuticals+CE+Ferulic&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "dark-spots"],
    suitableFor: ["normal", "dry", "combination", "mature"],
    keyIngredients: [
      { name: "Vitamin C (L-Ascorbic Acid) 15%", benefit: "Neutralises free radicals and visibly brightens" },
      { name: "Vitamin E (Alpha-Tocopherol) 1%", benefit: "Antioxidant that boosts Vitamin C efficacy" },
      { name: "Ferulic Acid 0.5%", benefit: "Stabilises Vitamin C and doubles photoprotection" },
    ],
    alternatives: {
      budget: {
        name: "The Inkey List Vitamin C Serum", brand: "The Inkey List", price: "£9.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=The+Inkey+List+Vitamin+C+Serum&tag=${AFFILIATE_TAG}`,
        reason: "Delivers stable Vitamin C brightening at a fraction of the luxury price.",
      },
      luxury: {
        name: "Sisley Supremÿa At Night", brand: "Sisley", price: "£360.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Sisley+Supremya+Night+Serum&tag=${AFFILIATE_TAG}`,
        reason: "Ultra-premium anti-ageing serum with chronobiology-inspired formula.",
      },
      organic: {
        name: "Trilogy Rosehip Oil", brand: "Trilogy", price: "£19.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Trilogy+Certified+Organic+Rosehip+Oil&tag=${AFFILIATE_TAG}`,
        reason: "Certified organic rosehip oil — naturally rich in Vitamin C and retinol.",
      },
    },
  },
  {
    id: "p6", name: "Paula's Choice BHA Exfoliant", brand: "Paula's Choice", category: "serum",
    tags: ["blemish-prone", "pores", "exfoliant", "cruelty-free", "vegan"],
    description: "Unclogs pores and smooths skin texture with 2% salicylic acid.",
    price: "£32.00", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Paulas+Choice+BHA+Exfoliant&tag=${AFFILIATE_TAG}`,
    zones: ["t-zone", "nose", "chin"],
    suitableFor: ["oily", "combination", "blemish-prone"],
    keyIngredients: [
      { name: "Salicylic Acid 2%", benefit: "Oil-soluble acid that dissolves inside pores" },
      { name: "Green Tea Extract", benefit: "Anti-inflammatory antioxidant to calm blemishes" },
      { name: "Methylpropanediol", benefit: "Enhances penetration for deeper exfoliation" },
    ],
    alternatives: {
      budget: {
        name: "The Ordinary Salicylic Acid 2% Solution", brand: "The Ordinary", price: "£6.30",
        affiliateUrl: `https://www.amazon.co.uk/s?k=The+Ordinary+Salicylic+Acid+2&tag=${AFFILIATE_TAG}`,
        reason: "Simple, effective BHA at the lowest possible price point.",
      },
      luxury: {
        name: "Drunk Elephant T.L.C. Framboos Glycolic Night Serum", brand: "Drunk Elephant", price: "£78.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Drunk+Elephant+Framboos+Glycolic+Serum&tag=${AFFILIATE_TAG}`,
        reason: "A luxurious AHA/BHA blend for overnight resurfacing and brightening.",
      },
      organic: {
        name: "Acnecide Face Wash with Willow Bark", brand: "Acnecide", price: "£14.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=willow+bark+natural+BHA+cleanser&tag=${AFFILIATE_TAG}`,
        reason: "Willow bark extract — the natural source of salicin (BHA precursor).",
      },
    },
  },
  {
    id: "p7", name: "La Roche-Posay Anthelios SPF 50+", brand: "La Roche-Posay", category: "spf",
    tags: ["spf", "sensitive", "fragrance-free", "no-white-cast"],
    description: "Broad-spectrum SPF50+ with invisible finish for all skin tones.",
    price: "£19.50", image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=La+Roche+Posay+Anthelios+SPF50&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "neck"],
    suitableFor: ["all", "sensitive"],
    keyIngredients: [
      { name: "Mexoryl SX & XL", benefit: "La Roche-Posay's patented broad-spectrum UV filters" },
      { name: "Thermal Spring Water", benefit: "Calms and soothes sensitive or reactive skin" },
      { name: "Tinosorb S", benefit: "Next-generation UVA filter for superior protection" },
    ],
    alternatives: {
      budget: {
        name: "Bondi Sands Fragrance Free SPF 50", brand: "Bondi Sands", price: "£9.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Bondi+Sands+SPF50+Fragrance+Free&tag=${AFFILIATE_TAG}`,
        reason: "Lightweight, non-greasy SPF50 at a supermarket-friendly price.",
      },
      luxury: {
        name: "Ultrasun Face Anti-Age SPF50+", brand: "Ultrasun", price: "£36.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Ultrasun+Face+Anti+Age+SPF50&tag=${AFFILIATE_TAG}`,
        reason: "Swiss-engineered once-a-day SPF with anti-pigmentation actives.",
      },
      organic: {
        name: "Green People Organic Sun Lotion SPF30", brand: "Green People", price: "£22.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Green+People+Organic+Sun+Lotion&tag=${AFFILIATE_TAG}`,
        reason: "Certified organic mineral SPF using non-nano zinc oxide only.",
      },
    },
  },
  {
    id: "p8", name: "Black Girl Sunscreen SPF 30", brand: "Black Girl Sunscreen", category: "spf",
    tags: ["spf", "dark-skin", "no-white-cast", "moisturising"],
    description: "Zero white cast, moisturising SPF30 for medium-to-deep skin tones.",
    price: "£18.00", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Black+Girl+Sunscreen+SPF30&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "neck"],
    suitableFor: ["all", "oily", "combination"],
    keyIngredients: [
      { name: "Avocado Oil", benefit: "Rich emollient that nourishes and moisturises deeply" },
      { name: "Cacao Butter", benefit: "Antioxidant-rich butter that enhances glow" },
      { name: "Jojoba Oil", benefit: "Regulates sebum while providing lightweight hydration" },
    ],
    alternatives: {
      budget: {
        name: "Altruist Dermatologist SPF50", brand: "Altruist", price: "£1.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Altruist+SPF50+Sunscreen&tag=${AFFILIATE_TAG}`,
        reason: "One of the best-value SPFs on the market with minimal white cast.",
      },
      luxury: {
        name: "Fenty Skin Hydra Vizor SPF30", brand: "Fenty Skin", price: "£35.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Fenty+Skin+Hydra+Vizor+SPF30&tag=${AFFILIATE_TAG}`,
        reason: "Universal finish SPF by Rihanna, designed to disappear on all skin tones.",
      },
      organic: {
        name: "Shade Sunscreen SPF30 Tinted", brand: "Shade", price: "£26.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Shade+Tinted+Sunscreen+SPF30&tag=${AFFILIATE_TAG}`,
        reason: "Natural mineral SPF with earthy tints that complement deeper skin tones.",
      },
    },
  },
  {
    id: "p9", name: "NARS Natural Radiant Longwear Foundation", brand: "NARS", category: "foundation",
    tags: ["medium-coverage", "radiant", "long-wearing", "inclusive-shades"],
    description: "Buildable medium coverage with a natural, skin-like radiance.",
    price: "£40.00", image: "https://images.unsplash.com/photo-1590156562745-5e36e44ab9e2?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=NARS+Natural+Radiant+Foundation&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "under-eyes"],
    suitableFor: ["normal", "dry", "combination"],
    keyIngredients: [
      { name: "Amino Acid Complex", benefit: "Conditions skin for a healthy, plump appearance" },
      { name: "SPF 12", benefit: "Low-level UV protection built into the formula" },
      { name: "Light-diffusing Pigments", benefit: "Scatter light to blur imperfections" },
    ],
    alternatives: {
      budget: {
        name: "Maybelline Fit Me Dewy + Smooth Foundation", brand: "Maybelline", price: "£9.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Maybelline+Fit+Me+Dewy+Foundation&tag=${AFFILIATE_TAG}`,
        reason: "Skin-like natural finish in a wide shade range for under £10.",
      },
      luxury: {
        name: "Charlotte Tilbury Airbrush Flawless Foundation", brand: "Charlotte Tilbury", price: "£44.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Charlotte+Tilbury+Airbrush+Foundation&tag=${AFFILIATE_TAG}`,
        reason: "Blurs pores and imperfections with a luminous, long-wearing finish.",
      },
      organic: {
        name: "ILIA True Skin Serum Foundation", brand: "ILIA", price: "£46.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=ILIA+True+Skin+Serum+Foundation&tag=${AFFILIATE_TAG}`,
        reason: "Clean beauty foundation with active skincare ingredients in every drop.",
      },
    },
  },
  {
    id: "p10", name: "Fenty Beauty Pro Filt'r Foundation", brand: "Fenty Beauty", category: "foundation",
    tags: ["full-coverage", "oily", "matte", "inclusive-shades", "long-wearing"],
    description: "40+ shades, full coverage matte finish that controls oil all day.",
    price: "£34.00", image: "https://images.unsplash.com/photo-1590156562745-5e36e44ab9e2?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Fenty+Beauty+Pro+Filtr+Foundation&tag=${AFFILIATE_TAG}`,
    zones: ["full-face"],
    suitableFor: ["oily", "combination"],
    keyIngredients: [
      { name: "Sebum-Absorbing Powder", benefit: "Controls shine for up to 24 hours" },
      { name: "Glycerin", benefit: "Hydrates without adding heaviness or grease" },
      { name: "Pro-Filt'r Technology", benefit: "Blur filter effect that softens pores and lines" },
    ],
    alternatives: {
      budget: {
        name: "L'Oréal Infallible 24H Fresh Wear Foundation", brand: "L'Oréal", price: "£12.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=LOreal+Infallible+24H+Foundation&tag=${AFFILIATE_TAG}`,
        reason: "Transfer-proof, 24-hour matte formula with a broad shade range.",
      },
      luxury: {
        name: "Armani Beauty Luminous Silk Foundation", brand: "Armani Beauty", price: "£52.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Armani+Luminous+Silk+Foundation&tag=${AFFILIATE_TAG}`,
        reason: "Iconic silky-matte finish that lets skin breathe while looking flawless.",
      },
      organic: {
        name: "Ere Perez Oat Milk Foundation", brand: "Ere Perez", price: "£35.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Ere+Perez+Oat+Milk+Foundation&tag=${AFFILIATE_TAG}`,
        reason: "Natural, vegan foundation with soothing oat extract and a semi-matte finish.",
      },
    },
  },
  {
    id: "p11", name: "RMS Beauty Un Cover-Up Concealer", brand: "RMS Beauty", category: "concealer",
    tags: ["organic", "clean", "natural", "sensitive", "cruelty-free"],
    description: "Raw, food-grade organic ingredients in a creamy under-eye concealer.",
    price: "£30.00", image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=RMS+Beauty+Concealer&tag=${AFFILIATE_TAG}`,
    zones: ["under-eyes", "dark-spots"],
    suitableFor: ["all", "sensitive", "dry"],
    keyIngredients: [
      { name: "Raw Coconut Oil", benefit: "Nourishes and softens the delicate under-eye area" },
      { name: "Jojoba Oil", benefit: "Mimics skin's natural sebum for seamless blending" },
      { name: "Beeswax", benefit: "Sets the formula for long-wearing coverage" },
    ],
    alternatives: {
      budget: {
        name: "e.l.f. Hydrating Camo Concealer", brand: "e.l.f.", price: "£8.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=elf+Hydrating+Camo+Concealer&tag=${AFFILIATE_TAG}`,
        reason: "Vegan, cruelty-free medium coverage concealer in 20+ shades.",
      },
      luxury: {
        name: "NARS Radiant Creamy Concealer", brand: "NARS", price: "£27.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=NARS+Radiant+Creamy+Concealer&tag=${AFFILIATE_TAG}`,
        reason: "Award-winning concealer that brightens, covers, and never creases.",
      },
      organic: {
        name: "Ere Perez Aloe Vera Concealer", brand: "Ere Perez", price: "£23.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Ere+Perez+Aloe+Vera+Concealer&tag=${AFFILIATE_TAG}`,
        reason: "Natural, plant-based concealer with soothing aloe for sensitive skin.",
      },
    },
  },
  {
    id: "p12", name: "ILIA Super Serum Skin Tint SPF 40", brand: "ILIA", category: "tinted-spf",
    tags: ["organic", "clean", "spf", "natural", "tinted", "lightweight"],
    description: "Skincare-first tinted SPF with 30% skincare actives and buildable coverage.",
    price: "£48.00", image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=ILIA+Super+Serum+Skin+Tint&tag=${AFFILIATE_TAG}`,
    zones: ["full-face"],
    suitableFor: ["all", "sensitive"],
    keyIngredients: [
      { name: "Hyaluronic Acid", benefit: "Intensely hydrates for a plump, dewy finish" },
      { name: "Niacinamide", benefit: "Minimises the appearance of pores and even skin tone" },
      { name: "Zinc Oxide SPF 40", benefit: "Mineral UV protection that sits beautifully on skin" },
    ],
    alternatives: {
      budget: {
        name: "Revolution Skincare Tinted Moisturiser SPF30", brand: "Revolution", price: "£8.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Revolution+Skincare+Tinted+Moisturiser+SPF30&tag=${AFFILIATE_TAG}`,
        reason: "Affordable SPF-infused tint that blurs and protects in one step.",
      },
      luxury: {
        name: "Chanel Les Beiges Water-Fresh Tint", brand: "Chanel", price: "£57.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Chanel+Les+Beiges+Water+Fresh+Tint&tag=${AFFILIATE_TAG}`,
        reason: "Iconic skin tint that gives a lit-from-within natural radiance.",
      },
      organic: {
        name: "Pai Skincare Tinted Lip & Cheek Balm", brand: "Pai Skincare", price: "£22.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Pai+Skincare+Tinted+Balm&tag=${AFFILIATE_TAG}`,
        reason: "Certified organic multi-use balm for a natural, no-makeup makeup look.",
      },
    },
  },
  {
    id: "p13", name: "COSRX Snail Mucin 96% Power Repairing Essence", brand: "COSRX", category: "essence",
    tags: ["korean", "hydrating", "scarring", "repair", "sensitive", "cruelty-free"],
    description: "96% snail secretion filtrate to repair and hydrate damaged skin.",
    price: "£22.00", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=COSRX+Snail+Mucin+96&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "scarring", "dark-spots"],
    suitableFor: ["all", "sensitive", "dry"],
    keyIngredients: [
      { name: "Snail Secretion Filtrate 96%", benefit: "Repairs damaged skin and fades post-acne marks" },
      { name: "Sodium Hyaluronate", benefit: "Deeply hydrates and plumps skin cells" },
      { name: "Allantoin", benefit: "Soothes irritation and promotes skin healing" },
    ],
    alternatives: {
      budget: {
        name: "Some By Mi Snail Truecica Miracle Repair Serum", brand: "Some By Mi", price: "£14.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Some+By+Mi+Snail+Repair+Serum&tag=${AFFILIATE_TAG}`,
        reason: "Korean snail serum with cica and tea tree for blemish-prone skin.",
      },
      luxury: {
        name: "Estée Lauder Advanced Night Repair Serum", brand: "Estée Lauder", price: "£85.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Estee+Lauder+Advanced+Night+Repair+Serum&tag=${AFFILIATE_TAG}`,
        reason: "Legendary overnight repair serum that rivals snail mucin's regenerative power.",
      },
      organic: {
        name: "Sukin Rosehip Facial Dry Oil", brand: "Sukin", price: "£14.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Sukin+Rosehip+Facial+Dry+Oil&tag=${AFFILIATE_TAG}`,
        reason: "Certified natural rosehip oil — a plant-based route to scar fading.",
      },
    },
  },
  {
    id: "p14", name: "Some By Mi AHA BHA PHA 30 Days Miracle Toner", brand: "Some By Mi", category: "toner",
    tags: ["korean", "exfoliant", "blemish-prone", "brightening", "vegan"],
    description: "Triple-acid exfoliating toner that visibly clears blemishes in 30 days.",
    price: "£16.00", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Some+By+Mi+AHA+BHA+Toner&tag=${AFFILIATE_TAG}`,
    zones: ["full-face", "t-zone"],
    suitableFor: ["oily", "combination", "blemish-prone"],
    keyIngredients: [
      { name: "AHA (Glycolic + Lactic Acid)", benefit: "Exfoliates surface dead cells for a brighter tone" },
      { name: "BHA (Salicylic Acid)", benefit: "Clears clogged pores and targets breakouts" },
      { name: "PHA (Gluconolactone)", benefit: "Gentler acid that moisturises while exfoliating" },
    ],
    alternatives: {
      budget: {
        name: "Pixi Glow Tonic", brand: "Pixi", price: "£14.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Pixi+Glow+Tonic+Exfoliating+Toner&tag=${AFFILIATE_TAG}`,
        reason: "Cult-favourite glycolic toner that brightens and smooths for under £15.",
      },
      luxury: {
        name: "Tatcha The Essence", brand: "Tatcha", price: "£72.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Tatcha+The+Essence&tag=${AFFILIATE_TAG}`,
        reason: "Japanese fermented ingredients in a luxurious skin-plumping essence.",
      },
      organic: {
        name: "Thayers Witch Hazel Toner", brand: "Thayers", price: "£10.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Thayers+Witch+Hazel+Toner&tag=${AFFILIATE_TAG}`,
        reason: "Natural witch hazel toner that tightens pores and balances oily skin.",
      },
    },
  },
  {
    id: "p15", name: "Kiehl's Creamy Eye Treatment with Avocado", brand: "Kiehl's", category: "eye-cream",
    tags: ["dry", "under-eyes", "nourishing", "anti-aging"],
    description: "Rich avocado-infused eye cream for dry, delicate under-eye skin.",
    price: "£32.00", image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&q=80",
    affiliateUrl: `https://www.amazon.co.uk/s?k=Kiehls+Creamy+Eye+Treatment&tag=${AFFILIATE_TAG}`,
    zones: ["under-eyes"],
    suitableFor: ["dry", "normal", "mature"],
    keyIngredients: [
      { name: "Avocado Oil", benefit: "Ultra-rich emollient that deeply nourishes fine lines" },
      { name: "Shea Butter", benefit: "Intensely moisturises and softens the under-eye area" },
      { name: "Beta-Carotene", benefit: "Antioxidant protection against environmental ageing" },
    ],
    alternatives: {
      budget: {
        name: "The Inkey List Caffeine Eye Cream", brand: "The Inkey List", price: "£8.99",
        affiliateUrl: `https://www.amazon.co.uk/s?k=The+Inkey+List+Caffeine+Eye+Cream&tag=${AFFILIATE_TAG}`,
        reason: "Caffeine-powered depuffing eye cream for under a tenner.",
      },
      luxury: {
        name: "La Mer Eye Concentrate", brand: "La Mer", price: "£175.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=La+Mer+Eye+Concentrate&tag=${AFFILIATE_TAG}`,
        reason: "The ultimate luxury eye treatment with Miracle Broth™ for visible lifting.",
      },
      organic: {
        name: "Pai Skincare Eye Balm", brand: "Pai Skincare", price: "£35.00",
        affiliateUrl: `https://www.amazon.co.uk/s?k=Pai+Skincare+Eye+Balm&tag=${AFFILIATE_TAG}`,
        reason: "Certified organic peptide-rich eye balm for sensitive under-eye skin.",
      },
    },
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

  // Product catalog
  app.get("/api/products", (_req, res) => {
    res.json(PRODUCT_CATALOG);
  });

  // ── Barcode lookup ──
  app.get("/api/barcode/:code", async (req, res) => {
    const { code } = req.params;
    try {
      // Fetch from Open Beauty Facts
      const response = await fetch(`https://world.openbeautyfacts.org/api/v2/product/${code}.json`);
      const data = await response.json() as any;

      if (!data || data.status === 0) {
        return res.status(404).json({ error: "Product not found", code });
      }

      const p = data.product || {};
      res.json({
        barcode: code,
        productName: p.product_name || p.product_name_en || null,
        brand: p.brands || null,
        ingredientsText: p.ingredients_text || p.ingredients_text_en || null,
        image: p.image_front_url || p.image_url || null,
        categories: p.categories || null,
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
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: "Scoring failed", detail: err.message });
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

scoreLabel: "Excellent" | "Good" | "Average" | "Poor" | "Hazardous"

For ingredient rating: "good" | "caution" | "poor"

Score based on:
- Presence of known irritants/harmful ingredients (parabens, SLS, formaldehyde releasers, certain alcohols)
- Quality of beneficial actives
- Fragrance/allergen risk
- Overall formulation standard

Return ONLY the JSON object, no markdown.`;
