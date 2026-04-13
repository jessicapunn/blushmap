// ── BlushMap Master Product Catalog ──────────────────────────────────────────
// 40+ curated products across 12 categories, all with Amazon UK affiliate links
// tag: blushmap-21

export const TAG = "blushmap-21";
const amz = (q: string) => `https://www.amazon.co.uk/s?k=${encodeURIComponent(q)}&tag=${TAG}`;

export interface Alternative {
  name: string; brand: string; price: string;
  affiliateUrl: string; reason: string;
}

export interface Product {
  id: string; name: string; brand: string; category: string;
  tags: string[]; description: string; price: string;
  image: string; affiliateUrl: string;
  zones: string[]; suitableFor: string[];
  keyIngredients: { name: string; benefit: string }[];
  alternatives: { budget: Alternative; luxury: Alternative; organic: Alternative };
  bestSeller?: boolean; newIn?: boolean;
}

// ── Per-product images (Unsplash editorial — hotlink-safe, no CORS issues) ──
// Using Unsplash images mapped to match each product type/colour/brand
const PIMG: Record<string, string> = {
  // Moisturisers — clean white jar aesthetic
  cerave_cream:        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80&auto=format&fit=crop",
  neutrogena_hydro:    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80&auto=format&fit=crop",
  tatcha_water:        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80&auto=format&fit=crop",
  drunk_lala:          "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80&auto=format&fit=crop",
  // Serums — dropper bottle aesthetic
  ordinary_niacin:     "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80&auto=format&fit=crop",
  skinceuticals_ce:    "https://images.unsplash.com/photo-1617220303901-d5ceea5b4d6e?w=400&q=80&auto=format&fit=crop",
  paula_vit_c:         "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80&auto=format&fit=crop",
  ordinary_ha:         "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80&auto=format&fit=crop",
  // SPF — light texture
  la_roche_uv:         "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&auto=format&fit=crop",
  ultrasun_face:       "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80&auto=format&fit=crop",
  la_roche_tinted:     "https://images.unsplash.com/photo-1631214524020-3c69d07f9c6b?w=400&q=80&auto=format&fit=crop",
  // Foundation
  charlotte_flawless:  "https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&q=80&auto=format&fit=crop",
  nars_natural:        "https://images.unsplash.com/photo-1590156562745-5e36e44ab9e2?w=400&q=80&auto=format&fit=crop",
  fenty_pro:           "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&auto=format&fit=crop",
  // Concealer
  nars_radiant:        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&q=80&auto=format&fit=crop",
  maybelline_fit:      "https://images.unsplash.com/photo-1631214499182-e37c7dc30a3a?w=400&q=80&auto=format&fit=crop",
  // Toner
  pyunkang_ess:        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80&auto=format&fit=crop",
  paula_bha:           "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80&auto=format&fit=crop",
  // Eye cream
  olay_eyes:           "https://images.unsplash.com/photo-1583241475880-083f84372725?w=400&q=80&auto=format&fit=crop",
  origins_gin:         "https://images.unsplash.com/photo-1600428853876-fb622f69cfc3?w=400&q=80&auto=format&fit=crop",
  // Cleanser
  caudalie_instant:    "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400&q=80&auto=format&fit=crop",
  la_roche_foam:       "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80&auto=format&fit=crop",
  // Retinol
  paula_1pct:          "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80&auto=format&fit=crop",
  roc_retinol:         "https://images.unsplash.com/photo-1617220370916-7e6c63e08d3e?w=400&q=80&auto=format&fit=crop",
  // Mask
  glow_recipe:         "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80&auto=format&fit=crop",
  origins_charcoal:    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80&auto=format&fit=crop",
  // Lips — pink/rose tones
  charlotte_liner:     "https://images.unsplash.com/photo-1586495777744-4e6232bf2d22?w=400&q=80&auto=format&fit=crop",
  mac_ruby:            "https://images.unsplash.com/photo-1631730358585-38a4935cbec4?w=400&q=80&auto=format&fit=crop",
  // Blush
  nars_orgasm:         "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&auto=format&fit=crop",
  rare_blush:          "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&q=80&auto=format&fit=crop",
  // Primer
  benefit_porefessional: "https://images.unsplash.com/photo-1631214524020-3c69d07f9c6b?w=400&q=80&auto=format&fit=crop",
  // Highlighter
  charlotte_beam:      "https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?w=400&q=80&auto=format&fit=crop",
  // Spot treatment
  ordinary_azelaic:    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80&auto=format&fit=crop",
}
// IMGS fallback no longer needed — all products use PIMG keys directly

export const PRODUCT_CATALOG: Product[] = [
  // ── MOISTURISERS ─────────────────────────────────────────────────────────
  {
    id:"p1", name:"CeraVe Moisturising Cream", brand:"CeraVe", category:"moisturiser",
    tags:["dry","sensitive","fragrance-free","barrier-repair","bestseller"], bestSeller:true,
    description:"Barrier-restoring formula with ceramides and hyaluronic acid. Beloved by dermatologists worldwide.",
    price:"£14.50", image:PIMG.cerave_cream, affiliateUrl:amz("CeraVe Moisturising Cream"),
    zones:["full-face","cheeks","forehead"], suitableFor:["dry","combination","sensitive"],
    keyIngredients:[
      {name:"Ceramides NP, AP, EOP", benefit:"Restore and strengthen the skin barrier"},
      {name:"Hyaluronic Acid",        benefit:"Draws moisture deep into the skin"},
      {name:"Niacinamide",            benefit:"Calms redness and improves texture"},
    ],
    alternatives:{
      budget:  {name:"Simple Kind to Skin Moisturiser",              brand:"Simple",       price:"£5.99",  affiliateUrl:amz("Simple Kind to Skin Moisturiser"),              reason:"Fragrance-free, hypoallergenic at a fraction of the price."},
      luxury:  {name:"La Mer Crème de la Mer",                       brand:"La Mer",       price:"£145",   affiliateUrl:amz("La Mer Creme de la Mer"),                        reason:"Legendary Miracle Broth™ for unrivalled barrier repair."},
      organic: {name:"Pai Chamomile & Rosehip Calming Day Cream",    brand:"Pai Skincare", price:"£39",    affiliateUrl:amz("Pai Skincare Chamomile Rosehip Day Cream"),       reason:"Certified organic, perfect for reactive sensitive skin."},
    },
  },
  {
    id:"p2", name:"Neutrogena Hydro Boost Gel-Cream", brand:"Neutrogena", category:"moisturiser",
    tags:["oily","combination","hyaluronic-acid","lightweight"],
    description:"Lightweight water-gel locks in hydration without greasiness.",
    price:"£16.99", image:PIMG.neutrogena_hydro, affiliateUrl:amz("Neutrogena Hydro Boost Gel Cream"),
    zones:["t-zone","full-face"], suitableFor:["oily","combination","normal"],
    keyIngredients:[
      {name:"Purified Hyaluronic Acid", benefit:"Quenches skin and locks in moisture"},
      {name:"Dimethicone",              benefit:"Smooth non-greasy skin barrier"},
      {name:"Olive Extract",            benefit:"Antioxidant protection"},
    ],
    alternatives:{
      budget:  {name:"The Ordinary NMF + HA",                brand:"The Ordinary",  price:"£5.50",  affiliateUrl:amz("The Ordinary Natural Moisturising Factors"),     reason:"Minimal science-backed hydration at the lowest price."},
      luxury:  {name:"Dior Hydra Life Gel Crème",            brand:"Dior",          price:"£58",    affiliateUrl:amz("Dior Hydra Life Gel Creme"),                     reason:"Luxurious aqua-gel with wild rose microbiome support."},
      organic: {name:"Green People Organic Moisturiser",     brand:"Green People",  price:"£24",    affiliateUrl:amz("Green People Organic Moisturiser"),              reason:"98% natural, lightweight hydration without nasties."},
    },
  },
  {
    id:"p3", name:"Tatcha The Water Cream", brand:"Tatcha", category:"moisturiser",
    tags:["oily","korean-inspired","anti-pore","luxury"], bestSeller:true,
    description:"Japanese-inspired oil-free formula that minimises pores.",
    price:"£69", image:PIMG.tatcha_water, affiliateUrl:amz("Tatcha Water Cream"),
    zones:["t-zone","full-face"], suitableFor:["oily","combination"],
    keyIngredients:[
      {name:"Japanese Wild Rose",   benefit:"Minimises enlarged pores and controls oil"},
      {name:"Hadasei-3™ Complex",   benefit:"Bio-fermented green tea, rice, algae for glow"},
      {name:"Leopard Lily Extract", benefit:"Tightens and blurs the appearance of pores"},
    ],
    alternatives:{
      budget:  {name:"e.l.f. Holy Hydration Face Cream",         brand:"e.l.f.",     price:"£12",  affiliateUrl:amz("elf Holy Hydration Face Cream"),           reason:"Vegan cruelty-free oil-control at budget price."},
      luxury:  {name:"SK-II Facial Treatment Essence",            brand:"SK-II",      price:"£89",  affiliateUrl:amz("SKII Facial Treatment Essence"),           reason:"Iconic Pitera™ — gold standard for poreless skin."},
      organic: {name:"Herbivore Lapis Facial Oil",                brand:"Herbivore",  price:"£42",  affiliateUrl:amz("Herbivore Lapis Facial Oil"),              reason:"100% natural blue tansy + squalane for oily skin."},
    },
  },
  {
    id:"p4", name:"Drunk Elephant Lala Retro Whipped Cream", brand:"Drunk Elephant", category:"moisturiser",
    tags:["dry","barrier-repair","luxury","clean-beauty"], newIn:true,
    description:"Six African oils and peptides in a rich whipped formula for deep nourishment.",
    price:"£48", image:PIMG.drunk_lala, affiliateUrl:amz("Drunk Elephant Lala Retro Whipped Cream"),
    zones:["full-face","cheeks"], suitableFor:["dry","normal","mature"],
    keyIngredients:[
      {name:"Six African Oils Blend", benefit:"Intensely nourish and restore suppleness"},
      {name:"Ceramides",              benefit:"Strengthen the skin barrier"},
      {name:"Peptides",               benefit:"Support collagen and firmness"},
    ],
    alternatives:{
      budget:  {name:"Olay Regenerist Micro-Sculpting Cream", brand:"Olay",        price:"£19.99", affiliateUrl:amz("Olay Regenerist Micro Sculpting Cream"), reason:"Drugstore peptide-rich cream that punches above its price."},
      luxury:  {name:"La Prairie Skin Caviar Luxe Cream",      brand:"La Prairie", price:"£290",   affiliateUrl:amz("La Prairie Skin Caviar Luxe Cream"),    reason:"Caviar-infused luxury lifting cream for mature skin."},
      organic: {name:"Weleda Skin Food Rich Cream",            brand:"Weleda",     price:"£15.99", affiliateUrl:amz("Weleda Skin Food Rich Cream"),           reason:"Certified natural ultra-rich balm, cult favourite."},
    },
  },

  // ── SERUMS ────────────────────────────────────────────────────────────────
  {
    id:"p5", name:"The Ordinary Niacinamide 10% + Zinc 1%", brand:"The Ordinary", category:"serum",
    tags:["oily","blemish-prone","pores","budget-friendly","vegan","bestseller"], bestSeller:true,
    description:"Controls excess sebum, minimises pores and blemishes.",
    price:"£5.90", image:PIMG.ordinary_niacin, affiliateUrl:amz("The Ordinary Niacinamide 10 Zinc 1"),
    zones:["t-zone","cheeks"], suitableFor:["oily","combination","blemish-prone"],
    keyIngredients:[
      {name:"Niacinamide 10%",       benefit:"Reduces pore size and controls sebum"},
      {name:"Zinc PCA 1%",           benefit:"Antibacterial — fights blemishes"},
      {name:"Tamarindus Indica",     benefit:"Surface hydration support"},
    ],
    alternatives:{
      budget:  {name:"Revolution Skincare 10% Niacinamide",      brand:"Revolution",       price:"£4.99", affiliateUrl:amz("Revolution Skincare Niacinamide Serum"),          reason:"Near-identical formulation at even lower price."},
      luxury:  {name:"Paula's Choice 10% Niacinamide Booster",   brand:"Paula's Choice",   price:"£42",   affiliateUrl:amz("Paulas Choice Niacinamide Booster"),              reason:"Higher-performance with peptides and antioxidants."},
      organic: {name:"Avalon Organics Vitamin C Renewal Serum",  brand:"Avalon Organics",  price:"£18",   affiliateUrl:amz("Avalon Organics Vitamin C Serum"),                reason:"USDA certified organic brightening and pore serum."},
    },
  },
  {
    id:"p6", name:"SkinCeuticals C E Ferulic", brand:"SkinCeuticals", category:"serum",
    tags:["vitamin-c","anti-aging","brightening","luxury","hyperpigmentation"], bestSeller:true,
    description:"Gold-standard antioxidant serum for brightening and anti-ageing.",
    price:"£166", image:PIMG.skinceuticals_ce, affiliateUrl:amz("SkinCeuticals CE Ferulic"),
    zones:["full-face","dark-spots"], suitableFor:["normal","dry","combination","mature"],
    keyIngredients:[
      {name:"Vitamin C (L-Ascorbic Acid) 15%", benefit:"Neutralises free radicals and brightens"},
      {name:"Vitamin E 1%",                    benefit:"Boosts Vitamin C efficacy"},
      {name:"Ferulic Acid 0.5%",               benefit:"Stabilises Vitamin C, doubles UV protection"},
    ],
    alternatives:{
      budget:  {name:"The Inkey List Vitamin C Serum",  brand:"The Inkey List", price:"£9.99",  affiliateUrl:amz("The Inkey List Vitamin C Serum"),       reason:"Stable Vitamin C brightening at lowest price."},
      luxury:  {name:"Sisley Supremÿa At Night",        brand:"Sisley",         price:"£360",   affiliateUrl:amz("Sisley Supremya Night Serum"),           reason:"Ultra-premium chronobiology-inspired formula."},
      organic: {name:"Trilogy Certified Organic Rosehip Oil", brand:"Trilogy",  price:"£19.99", affiliateUrl:amz("Trilogy Certified Organic Rosehip Oil"), reason:"Naturally rich in Vitamin C and natural retinol."},
    },
  },
  {
    id:"p7", name:"Paula's Choice 2% BHA Exfoliant", brand:"Paula's Choice", category:"serum",
    tags:["blemish-prone","pores","exfoliant","cruelty-free","vegan"],
    description:"Unclogs pores and smooths skin texture with 2% salicylic acid.",
    price:"£32", image:PIMG.paula_vit_c, affiliateUrl:amz("Paulas Choice BHA Exfoliant"),
    zones:["t-zone","nose","chin"], suitableFor:["oily","combination","blemish-prone"],
    keyIngredients:[
      {name:"Salicylic Acid 2%",  benefit:"Oil-soluble acid that dissolves inside pores"},
      {name:"Green Tea Extract",  benefit:"Anti-inflammatory antioxidant"},
      {name:"Methylpropanediol",  benefit:"Enhances penetration"},
    ],
    alternatives:{
      budget:  {name:"The Ordinary Salicylic Acid 2%",           brand:"The Ordinary",     price:"£6.30", affiliateUrl:amz("The Ordinary Salicylic Acid 2"),             reason:"Simple, effective BHA at lowest price."},
      luxury:  {name:"Drunk Elephant T.L.C. Framboos Serum",     brand:"Drunk Elephant",   price:"£78",   affiliateUrl:amz("Drunk Elephant Framboos Glycolic Serum"),    reason:"Luxurious AHA/BHA for overnight resurfacing."},
      organic: {name:"Thayers Witch Hazel Toner",                brand:"Thayers",          price:"£10.99",affiliateUrl:amz("Thayers Witch Hazel Toner"),                  reason:"Natural witch hazel — tightens pores naturally."},
    },
  },
  {
    id:"p8", name:"Estée Lauder Advanced Night Repair Serum", brand:"Estée Lauder", category:"serum",
    tags:["anti-aging","repair","hydrating","bestseller"], bestSeller:true,
    description:"Iconic overnight repair serum that renews and brightens while you sleep.",
    price:"£85", image:PIMG.ordinary_ha, affiliateUrl:amz("Estee Lauder Advanced Night Repair Serum"),
    zones:["full-face"], suitableFor:["all","dry","mature"],
    keyIngredients:[
      {name:"ChronoluxCB™ Technology", benefit:"Syncs with skin's natural repair cycle"},
      {name:"Bifida Ferment Lysate",   benefit:"Strengthens skin's natural defences"},
      {name:"Hyaluronic Acid",         benefit:"Deep, sustained moisture surge"},
    ],
    alternatives:{
      budget:  {name:"L'Oréal Revitalift 1.5% Pure Hyaluronic Acid Serum", brand:"L'Oréal",  price:"£24.99", affiliateUrl:amz("LOreal Revitalift Pure Hyaluronic Acid Serum"),  reason:"Clinically proven HA serum for under £25."},
      luxury:  {name:"La Mer The Concentrate",                              brand:"La Mer",   price:"£225",   affiliateUrl:amz("La Mer The Concentrate Serum"),                  reason:"Miracle Broth™ concentrated for intense repair."},
      organic: {name:"COSRX Snail Mucin 96% Essence",                       brand:"COSRX",   price:"£22",    affiliateUrl:amz("COSRX Snail Mucin 96 Essence"),                  reason:"96% snail secretion for overnight skin repair."},
    },
  },
  {
    id:"p9", name:"The Ordinary Retinol 0.5% in Squalane", brand:"The Ordinary", category:"retinol",
    tags:["anti-aging","fine-lines","retinol","budget-friendly","vegan"],
    description:"Stable mid-strength retinol in a nourishing squalane base for skin renewal.",
    price:"£8.10", image:PIMG.la_roche_uv, affiliateUrl:amz("The Ordinary Retinol 0.5 Squalane"),
    zones:["full-face"], suitableFor:["normal","combination","mature"],
    keyIngredients:[
      {name:"Retinol 0.5%",  benefit:"Speeds cell turnover and reduces fine lines"},
      {name:"Squalane",      benefit:"Plant-derived oil that prevents dryness from retinol"},
    ],
    alternatives:{
      budget:  {name:"Revolution Skincare 0.3% Retinol Serum",  brand:"Revolution",    price:"£7.99", affiliateUrl:amz("Revolution Skincare Retinol Serum"),        reason:"Starter-strength retinol for beginners."},
      luxury:  {name:"Medik8 Crystal Retinal 6",                brand:"Medik8",        price:"£49",   affiliateUrl:amz("Medik8 Crystal Retinal 6"),                  reason:"Retinaldehyde — 11x more potent than retinol."},
      organic: {name:"Pai Skincare Rosehip BioRegenerate Oil",  brand:"Pai Skincare",  price:"£38",   affiliateUrl:amz("Pai Skincare Rosehip BioRegenerate Oil"),    reason:"Natural retinol from certified organic rosehip."},
    },
  },

  // ── SPF ───────────────────────────────────────────────────────────────────
  {
    id:"p10", name:"La Roche-Posay Anthelios UVMune 400 SPF50+", brand:"La Roche-Posay", category:"spf",
    tags:["spf","sensitive","no-white-cast","fragrance-free","bestseller"], bestSeller:true,
    description:"Broad-spectrum SPF50+ with Mexoryl 400 — invisible finish for all skin tones.",
    price:"£19.50", image:PIMG.ultrasun_face, affiliateUrl:amz("La Roche Posay Anthelios UVMune 400 SPF50"),
    zones:["full-face","neck"], suitableFor:["all","sensitive"],
    keyIngredients:[
      {name:"Mexoryl 400",         benefit:"Next-generation UVA filter — industry leading"},
      {name:"Thermal Spring Water",benefit:"Calms and soothes reactive skin"},
      {name:"Tinosorb S",          benefit:"Superior broad-spectrum UV protection"},
    ],
    alternatives:{
      budget:  {name:"Bondi Sands Fragrance Free SPF50",       brand:"Bondi Sands", price:"£9.99", affiliateUrl:amz("Bondi Sands SPF50 Fragrance Free"),          reason:"Lightweight non-greasy SPF50 under £10."},
      luxury:  {name:"Ultrasun Face Anti-Age SPF50+",           brand:"Ultrasun",   price:"£36",   affiliateUrl:amz("Ultrasun Face Anti Age SPF50"),               reason:"Swiss once-a-day SPF with anti-pigmentation."},
      organic: {name:"Green People Organic Sun Lotion SPF30",   brand:"Green People",price:"£22",  affiliateUrl:amz("Green People Organic Sun Lotion SPF30"),      reason:"Certified organic mineral SPF, non-nano zinc."},
    },
  },
  {
    id:"p11", name:"Black Girl Sunscreen SPF 30", brand:"Black Girl Sunscreen", category:"spf",
    tags:["spf","no-white-cast","deep-skin","moisturising"],
    description:"Zero white cast moisturising SPF30 designed for medium-to-deep skin tones.",
    price:"£18", image:PIMG.la_roche_tinted, affiliateUrl:amz("Black Girl Sunscreen SPF30"),
    zones:["full-face","neck"], suitableFor:["all","oily","combination"],
    keyIngredients:[
      {name:"Avocado Oil",    benefit:"Rich emollient that nourishes deeply"},
      {name:"Cacao Butter",   benefit:"Antioxidant-rich butter for glow"},
      {name:"Jojoba Oil",     benefit:"Regulates sebum while hydrating"},
    ],
    alternatives:{
      budget:  {name:"Altruist Dermatologist SPF50",    brand:"Altruist",    price:"£1.99", affiliateUrl:amz("Altruist SPF50 Sunscreen"),              reason:"Best-value SPF on the market, minimal white cast."},
      luxury:  {name:"Fenty Skin Hydra Vizor SPF30",    brand:"Fenty Skin",  price:"£35",   affiliateUrl:amz("Fenty Skin Hydra Vizor SPF30"),          reason:"By Rihanna, designed to disappear on all tones."},
      organic: {name:"Shade Sunscreen SPF30 Tinted",    brand:"Shade",       price:"£26",   affiliateUrl:amz("Shade Tinted Sunscreen SPF30"),          reason:"Natural mineral SPF with tints for deeper tones."},
    },
  },
  {
    id:"p12", name:"ILIA Super Serum Skin Tint SPF40", brand:"ILIA", category:"tinted-spf",
    tags:["spf","tinted","clean-beauty","organic","lightweight","bestseller"], bestSeller:true,
    description:"Skincare-first tinted SPF with 30% active skincare ingredients.",
    price:"£48", image:PIMG.charlotte_flawless, affiliateUrl:amz("ILIA Super Serum Skin Tint SPF40"),
    zones:["full-face"], suitableFor:["all","sensitive"],
    keyIngredients:[
      {name:"Hyaluronic Acid",   benefit:"Deeply hydrates for a plump dewy finish"},
      {name:"Niacinamide",       benefit:"Minimises pores and evens skin tone"},
      {name:"Zinc Oxide SPF40",  benefit:"Mineral UV that sits beautifully on skin"},
    ],
    alternatives:{
      budget:  {name:"Revolution Skincare Tinted Moisturiser SPF30", brand:"Revolution", price:"£8.99",  affiliateUrl:amz("Revolution Skincare Tinted Moisturiser SPF30"),  reason:"Affordable SPF-infused tint, blurs and protects."},
      luxury:  {name:"Chanel Les Beiges Water-Fresh Tint",            brand:"Chanel",     price:"£57",    affiliateUrl:amz("Chanel Les Beiges Water Fresh Tint"),            reason:"Iconic lit-from-within natural radiance tint."},
      organic: {name:"Ere Perez Oat Milk Tinted Moisturiser",         brand:"Ere Perez",  price:"£32",    affiliateUrl:amz("Ere Perez Oat Milk Foundation"),                reason:"Natural vegan tinted moisturiser with oat."},
    },
  },

  // ── FOUNDATION ────────────────────────────────────────────────────────────
  {
    id:"p13", name:"Charlotte Tilbury Airbrush Flawless Foundation", brand:"Charlotte Tilbury", category:"foundation",
    tags:["full-coverage","all-skin","long-wearing","bestseller"], bestSeller:true,
    description:"Blurs pores and imperfections with a luminous, long-wearing airbrush finish.",
    price:"£44", image:PIMG.nars_natural, affiliateUrl:amz("Charlotte Tilbury Airbrush Flawless Foundation"),
    zones:["full-face"], suitableFor:["all","combination","normal"],
    keyIngredients:[
      {name:"Micro-blurring Pigments", benefit:"Optically blurs pores and imperfections"},
      {name:"Hyaluronic Acid",         benefit:"Keeps skin hydrated throughout the day"},
      {name:"SPF15",                   benefit:"Daily UV defence built in"},
    ],
    alternatives:{
      budget:  {name:"Maybelline Fit Me Dewy Foundation",        brand:"Maybelline",  price:"£9.99", affiliateUrl:amz("Maybelline Fit Me Dewy Smooth Foundation"),      reason:"Skin-like natural finish in wide shade range."},
      luxury:  {name:"Armani Beauty Luminous Silk Foundation",   brand:"Armani",      price:"£52",   affiliateUrl:amz("Armani Luminous Silk Foundation"),               reason:"Iconic silky-matte that lets skin breathe."},
      organic: {name:"ILIA True Skin Serum Foundation",          brand:"ILIA",        price:"£46",   affiliateUrl:amz("ILIA True Skin Serum Foundation"),              reason:"Clean beauty foundation with active skincare."},
    },
  },
  {
    id:"p14", name:"Fenty Beauty Pro Filt'r Foundation", brand:"Fenty Beauty", category:"foundation",
    tags:["full-coverage","oily","matte","inclusive-shades","long-wearing"], bestSeller:true,
    description:"40+ shades, full coverage matte finish that controls oil all day.",
    price:"£34", image:PIMG.fenty_pro, affiliateUrl:amz("Fenty Beauty Pro Filtr Foundation"),
    zones:["full-face"], suitableFor:["oily","combination"],
    keyIngredients:[
      {name:"Sebum-Absorbing Powder", benefit:"Controls shine for up to 24 hours"},
      {name:"Glycerin",               benefit:"Hydrates without heaviness"},
      {name:"Pro-Filt'r Technology",  benefit:"Blur filter effect on pores"},
    ],
    alternatives:{
      budget:  {name:"L'Oréal Infallible 24H Fresh Wear Foundation", brand:"L'Oréal",    price:"£12.99", affiliateUrl:amz("LOreal Infallible 24H Foundation"),        reason:"Transfer-proof 24h matte, broad shade range."},
      luxury:  {name:"NARS Natural Radiant Longwear Foundation",      brand:"NARS",       price:"£40",    affiliateUrl:amz("NARS Natural Radiant Foundation"),         reason:"Buildable medium coverage with skin-like radiance."},
      organic: {name:"Ere Perez Oat Milk Foundation",                  brand:"Ere Perez", price:"£35",    affiliateUrl:amz("Ere Perez Oat Milk Foundation"),           reason:"Natural vegan foundation with soothing oat."},
    },
  },
  {
    id:"p15", name:"MAC Studio Fix Fluid Foundation SPF15", brand:"MAC", category:"foundation",
    tags:["medium-coverage","oily","matte","inclusive-shades"],
    description:"Professional matte finish with buildable medium-to-full coverage. A studio staple.",
    price:"£32", image:PIMG.nars_radiant, affiliateUrl:amz("MAC Studio Fix Fluid Foundation SPF15"),
    zones:["full-face"], suitableFor:["oily","combination","normal"],
    keyIngredients:[
      {name:"SPF15",           benefit:"Daily UV defence"},
      {name:"Matte Finish",    benefit:"Reduces shine for up to 8 hours"},
      {name:"Oil-Free Formula",benefit:"Non-comedogenic for breakout-prone skin"},
    ],
    alternatives:{
      budget:  {name:"NYX Can't Stop Won't Stop Foundation",     brand:"NYX",           price:"£13.99", affiliateUrl:amz("NYX Cant Stop Wont Stop Foundation"),        reason:"24h full coverage, 40+ shades, vegan."},
      luxury:  {name:"Giorgio Armani Luminous Silk Foundation",  brand:"Armani Beauty", price:"£52",    affiliateUrl:amz("Armani Luminous Silk Foundation"),           reason:"Ultra-lightweight silk-like matte finish."},
      organic: {name:"Zuii Organic Flora Foundation",            brand:"Zuii Organic",  price:"£27",    affiliateUrl:amz("Zuii Organic Flora Foundation"),             reason:"Certified organic, natural minerals foundation."},
    },
  },

  // ── CONCEALER ─────────────────────────────────────────────────────────────
  {
    id:"p16", name:"NARS Radiant Creamy Concealer", brand:"NARS", category:"concealer",
    tags:["under-eyes","brightening","long-wearing","bestseller"], bestSeller:true,
    description:"Award-winning concealer that brightens, covers and never creases.",
    price:"£27", image:PIMG.maybelline_fit, affiliateUrl:amz("NARS Radiant Creamy Concealer"),
    zones:["under-eyes","dark-spots"], suitableFor:["all","dry"],
    keyIngredients:[
      {name:"Reflective Pigments",    benefit:"Instantly brightens the under-eye area"},
      {name:"Hydrating Formula",      benefit:"Prevents creasing throughout the day"},
      {name:"Light-diffusing Agents", benefit:"Blurs dark circles and fine lines"},
    ],
    alternatives:{
      budget:  {name:"e.l.f. Hydrating Camo Concealer",      brand:"e.l.f.",       price:"£8",    affiliateUrl:amz("elf Hydrating Camo Concealer"),          reason:"Vegan cruelty-free medium coverage, 20+ shades."},
      luxury:  {name:"Armani Beauty Luminous Silk Concealer", brand:"Armani",       price:"£38",   affiliateUrl:amz("Armani Luminous Silk Concealer"),        reason:"Seamless brightening concealer, ultra-blendable."},
      organic: {name:"Ere Perez Aloe Vera Concealer",         brand:"Ere Perez",    price:"£23",   affiliateUrl:amz("Ere Perez Aloe Vera Concealer"),         reason:"Natural plant-based concealer for sensitive skin."},
    },
  },
  {
    id:"p17", name:"RMS Beauty Un Cover-Up Concealer", brand:"RMS Beauty", category:"concealer",
    tags:["organic","clean","natural","sensitive","cruelty-free"],
    description:"Raw food-grade organic ingredients in a creamy under-eye concealer.",
    price:"£30", image:PIMG.pyunkang_ess, affiliateUrl:amz("RMS Beauty Un Cover-Up Concealer"),
    zones:["under-eyes","dark-spots"], suitableFor:["all","sensitive","dry"],
    keyIngredients:[
      {name:"Raw Coconut Oil", benefit:"Nourishes the delicate under-eye area"},
      {name:"Jojoba Oil",      benefit:"Mimics skin's natural sebum for blending"},
      {name:"Beeswax",         benefit:"Sets the formula for long-wearing coverage"},
    ],
    alternatives:{
      budget:  {name:"Makeup Revolution Conceal & Define", brand:"Revolution",    price:"£4",  affiliateUrl:amz("Revolution Conceal Define Concealer"),     reason:"Full coverage in 50+ shades for under £5."},
      luxury:  {name:"Charlotte Tilbury Magic Away",        brand:"Charlotte Tilbury",price:"£28",affiliateUrl:amz("Charlotte Tilbury Magic Away Concealer"), reason:"Covers everything with magic-like coverage."},
      organic: {name:"Burt's Bees Goodness Glows Concealer",brand:"Burt's Bees", price:"£13.99",affiliateUrl:amz("Burts Bees Goodness Glows Concealer"),     reason:"Natural cosmetics with nourishing seed oils."},
    },
  },

  // ── TONER / ESSENCE ────────────────────────────────────────────────────────
  {
    id:"p18", name:"Some By Mi AHA BHA PHA 30 Days Miracle Toner", brand:"Some By Mi", category:"toner",
    tags:["korean","exfoliant","blemish-prone","brightening","vegan"],
    description:"Triple-acid toner that visibly clears blemishes in 30 days.",
    price:"£16", image:PIMG.paula_bha, affiliateUrl:amz("Some By Mi AHA BHA Toner"),
    zones:["full-face","t-zone"], suitableFor:["oily","combination","blemish-prone"],
    keyIngredients:[
      {name:"AHA (Glycolic + Lactic)", benefit:"Exfoliates dead cells for brighter tone"},
      {name:"BHA (Salicylic Acid)",    benefit:"Clears clogged pores, targets breakouts"},
      {name:"PHA (Gluconolactone)",    benefit:"Gentler acid that moisturises while exfoliating"},
    ],
    alternatives:{
      budget:  {name:"Pixi Glow Tonic",         brand:"Pixi",    price:"£14",   affiliateUrl:amz("Pixi Glow Tonic Exfoliating Toner"),     reason:"Cult-favourite glycolic toner for under £15."},
      luxury:  {name:"Tatcha The Essence",       brand:"Tatcha",  price:"£72",   affiliateUrl:amz("Tatcha The Essence"),                    reason:"Japanese fermented skin-plumping luxury essence."},
      organic: {name:"Thayers Witch Hazel Toner",brand:"Thayers", price:"£10.99",affiliateUrl:amz("Thayers Witch Hazel Toner"),             reason:"Natural witch hazel toner for oily skin."},
    },
  },
  {
    id:"p19", name:"COSRX Snail Mucin 96% Essence", brand:"COSRX", category:"essence",
    tags:["korean","repairing","hydrating","scarring","bestseller"], bestSeller:true,
    description:"96% snail secretion filtrate to repair damaged skin and fade marks.",
    price:"£22", image:PIMG.olay_eyes, affiliateUrl:amz("COSRX Snail Mucin 96 Essence"),
    zones:["full-face","dark-spots","scarring"], suitableFor:["all","sensitive","dry"],
    keyIngredients:[
      {name:"Snail Secretion Filtrate 96%", benefit:"Repairs damaged skin and fades marks"},
      {name:"Sodium Hyaluronate",           benefit:"Deeply hydrates and plumps"},
      {name:"Allantoin",                    benefit:"Soothes and promotes healing"},
    ],
    alternatives:{
      budget:  {name:"Some By Mi Snail Truecica Serum",   brand:"Some By Mi",   price:"£14",  affiliateUrl:amz("Some By Mi Snail Truecica Miracle Serum"),  reason:"Korean snail serum with cica for blemish skin."},
      luxury:  {name:"Estée Lauder Advanced Night Repair", brand:"Estée Lauder", price:"£85",  affiliateUrl:amz("Estee Lauder Advanced Night Repair Serum"), reason:"Legendary repair serum rivals snail mucin power."},
      organic: {name:"Sukin Rosehip Facial Dry Oil",       brand:"Sukin",        price:"£14.99",affiliateUrl:amz("Sukin Rosehip Facial Dry Oil"),             reason:"Certified natural rosehip — plant-based scar fading."},
    },
  },

  // ── CLEANSER ─────────────────────────────────────────────────────────────
  {
    id:"p20", name:"CeraVe Foaming Facial Cleanser", brand:"CeraVe", category:"cleanser",
    tags:["oily","combination","fragrance-free","gentle","bestseller"], bestSeller:true,
    description:"Foaming gel cleanser that removes excess oil without disrupting the skin barrier.",
    price:"£12.50", image:PIMG.origins_gin, affiliateUrl:amz("CeraVe Foaming Facial Cleanser"),
    zones:["full-face"], suitableFor:["oily","combination","normal"],
    keyIngredients:[
      {name:"Ceramides",       benefit:"Maintain skin barrier while cleansing"},
      {name:"Niacinamide",     benefit:"Calms and minimises pores"},
      {name:"Hyaluronic Acid", benefit:"Hydrates while cleansing"},
    ],
    alternatives:{
      budget:  {name:"Simple Refreshing Facial Wash",      brand:"Simple",       price:"£4.49", affiliateUrl:amz("Simple Refreshing Facial Wash Gel"),       reason:"Gentle fragrance-free cleanser under £5."},
      luxury:  {name:"Elemis Dynamic Resurfacing Cleanser", brand:"Elemis",       price:"£34",   affiliateUrl:amz("Elemis Dynamic Resurfacing Facial Wash"),  reason:"Dual-action cleanser with tri-enzyme technology."},
      organic: {name:"Pai Skincare Camellia & Rose Cleanser",brand:"Pai Skincare",price:"£28",   affiliateUrl:amz("Pai Skincare Camellia Rose Cleanser"),      reason:"Certified organic gentle cleansing oil-to-milk."},
    },
  },
  {
    id:"p21", name:"La Roche-Posay Toleriane Hydrating Cleanser", brand:"La Roche-Posay", category:"cleanser",
    tags:["dry","sensitive","fragrance-free","gentle"],
    description:"Soap-free cream cleanser that hydrates while cleansing sensitive skin.",
    price:"£14", image:PIMG.caudalie_instant, affiliateUrl:amz("La Roche Posay Toleriane Hydrating Gentle Cleanser"),
    zones:["full-face"], suitableFor:["dry","sensitive","normal"],
    keyIngredients:[
      {name:"Ceramides",        benefit:"Protect and restore the skin barrier"},
      {name:"Niacinamide",      benefit:"Soothe and reduce redness"},
      {name:"Glycerin",         benefit:"Draw and hold moisture in the skin"},
    ],
    alternatives:{
      budget:  {name:"Aveeno Calm + Restore Cleanser",        brand:"Aveeno",     price:"£8.99", affiliateUrl:amz("Aveeno Calm Restore Nourishing Oat Cleanser"),  reason:"Oat-infused gentle cleanser for sensitive skin."},
      luxury:  {name:"Tatcha The Rice Wash Cleanser",          brand:"Tatcha",     price:"£40",   affiliateUrl:amz("Tatcha Rice Wash Cleanser"),                   reason:"Silk-whip foam with Japanese rice for clarity."},
      organic: {name:"Green People Brightening Vitamin C Wash",brand:"Green People",price:"£17",  affiliateUrl:amz("Green People Vitamin C Face Wash"),             reason:"Organic brightening cleanser with vitamin C."},
    },
  },

  // ── EYE CREAM ─────────────────────────────────────────────────────────────
  {
    id:"p22", name:"Kiehl's Creamy Eye Treatment with Avocado", brand:"Kiehl's", category:"eye-cream",
    tags:["dry","under-eyes","nourishing","anti-aging"],
    description:"Rich avocado-infused eye cream for dry, delicate under-eye skin.",
    price:"£32", image:PIMG.la_roche_foam, affiliateUrl:amz("Kiehls Creamy Eye Treatment Avocado"),
    zones:["under-eyes"], suitableFor:["dry","normal","mature"],
    keyIngredients:[
      {name:"Avocado Oil",     benefit:"Ultra-rich emollient nourishing fine lines"},
      {name:"Shea Butter",     benefit:"Intensely moisturises under-eye area"},
      {name:"Beta-Carotene",   benefit:"Antioxidant protection against ageing"},
    ],
    alternatives:{
      budget:  {name:"The Inkey List Caffeine Eye Cream", brand:"The Inkey List", price:"£8.99", affiliateUrl:amz("The Inkey List Caffeine Eye Cream"),   reason:"Caffeine depuffing eye cream for under £10."},
      luxury:  {name:"La Mer The Eye Concentrate",        brand:"La Mer",         price:"£175",  affiliateUrl:amz("La Mer Eye Concentrate"),               reason:"Miracle Broth™ for visible lifting around eyes."},
      organic: {name:"Pai Skincare Eye Balm",             brand:"Pai Skincare",   price:"£35",   affiliateUrl:amz("Pai Skincare Eye Balm"),                 reason:"Certified organic peptide-rich eye balm."},
    },
  },
  {
    id:"p23", name:"Elemis Pro-Collagen Eye Cream", brand:"Elemis", category:"eye-cream",
    tags:["anti-aging","fine-lines","mature","luxury"],
    description:"Clinically proven to improve the look of fine lines and dark circles in 14 days.",
    price:"£60", image:PIMG.paula_1pct, affiliateUrl:amz("Elemis Pro Collagen Eye Cream"),
    zones:["under-eyes"], suitableFor:["mature","dry","normal"],
    keyIngredients:[
      {name:"Padina Pavonica",    benefit:"Marine algae that supports collagen structure"},
      {name:"Chlorella Extract",  benefit:"Firms and lifts the eye contour"},
      {name:"Mimosa Tree Extract",benefit:"Anti-wrinkle plant actives"},
    ],
    alternatives:{
      budget:  {name:"Olay Eyes Ultimate Eye Cream",  brand:"Olay",          price:"£24.99", affiliateUrl:amz("Olay Eyes Ultimate Eye Cream"),           reason:"Triple action: dark circles, puffiness, wrinkles."},
      luxury:  {name:"La Prairie Eye Cream",          brand:"La Prairie",    price:"£295",   affiliateUrl:amz("La Prairie Skin Caviar Luxe Eye Lift Cream"),reason:"Caviar extract lifting cream for mature eyes."},
      organic: {name:"Sukin Purely Ageless Eye Cream",brand:"Sukin",         price:"£10.99", affiliateUrl:amz("Sukin Purely Ageless Eye Serum"),          reason:"Natural certified vegan lifting eye serum."},
    },
  },

  // ── FACE MASK ─────────────────────────────────────────────────────────────
  {
    id:"p24", name:"Glamglow SuperMud Clearing Treatment", brand:"GlamGlow", category:"mask",
    tags:["blemish-prone","pores","oily","clearing"],
    description:"Six-acid clearing mask that visibly draws out blemishes and blackheads overnight.",
    price:"£45", image:PIMG.roc_retinol, affiliateUrl:amz("Glamglow SuperMud Clearing Treatment"),
    zones:["t-zone","nose","chin"], suitableFor:["oily","combination","blemish-prone"],
    keyIngredients:[
      {name:"Activated Charcoal", benefit:"Draws out impurities deep from pores"},
      {name:"Six Acids Blend",    benefit:"Exfoliate, clarify and resurface"},
      {name:"Eucalyptus",         benefit:"Antibacterial and anti-inflammatory"},
    ],
    alternatives:{
      budget:  {name:"Origins Clear Improvement Mask",     brand:"Origins",       price:"£26",   affiliateUrl:amz("Origins Clear Improvement Charcoal Mask"),  reason:"Bamboo charcoal detox mask for congested skin."},
      luxury:  {name:"Dr. Barbara Sturm Clarifying Mask",  brand:"Dr. Barbara Sturm",price:"£75", affiliateUrl:amz("Dr Barbara Sturm Clarifying Mask"),         reason:"Premium anti-blemish mask with purslane."},
      organic: {name:"Aztec Secret Indian Healing Clay",   brand:"Aztec Secret",  price:"£12.99",affiliateUrl:amz("Aztec Secret Indian Healing Clay Mask"),      reason:"100% natural calcium bentonite clay mask."},
    },
  },
  {
    id:"p25", name:"Charlotte Tilbury Goddess Skin Clay Mask", brand:"Charlotte Tilbury", category:"mask",
    tags:["all-skin","brightening","pores","luxury"],
    description:"Kaolin and charcoal mask that buffs away dullness for goddess-like luminosity.",
    price:"£36", image:PIMG.glow_recipe, affiliateUrl:amz("Charlotte Tilbury Goddess Skin Clay Mask"),
    zones:["full-face"], suitableFor:["all","combination","normal"],
    keyIngredients:[
      {name:"Kaolin Clay",   benefit:"Gently draws out impurities and excess oil"},
      {name:"Charcoal",      benefit:"Deep-cleanses and brightens the complexion"},
      {name:"Rose Extract",  benefit:"Soothe and add luminosity"},
    ],
    alternatives:{
      budget:  {name:"Freeman Feeling Beautiful Clay Mask", brand:"Freeman",   price:"£3.99", affiliateUrl:amz("Freeman Feeling Beautiful Facial Clay Mask"),  reason:"Classic kaolin clay mask for under £4."},
      luxury:  {name:"Sisley Black Rose Cream Mask",        brand:"Sisley",    price:"£104",  affiliateUrl:amz("Sisley Black Rose Cream Mask"),                reason:"Ultra-premium radiance mask with black rose."},
      organic: {name:"REN Clean Skincare Flash Hydro-Boost", brand:"REN",      price:"£36",   affiliateUrl:amz("REN Clean Skincare Flash Hydro Boost Mask"),  reason:"Clean certified hyaluronic acid hydrating mask."},
    },
  },

  // ── LIP ───────────────────────────────────────────────────────────────────
  {
    id:"p26", name:"Charlotte Tilbury Pillow Talk Lip Cheat", brand:"Charlotte Tilbury", category:"lip-liner",
    tags:["lip","bestseller","nude","defining"], bestSeller:true,
    description:"The world's most universally flattering lip liner. Makes lips look bigger instantly.",
    price:"£20", image:PIMG.origins_charcoal, affiliateUrl:amz("Charlotte Tilbury Pillow Talk Lip Cheat"),
    zones:["lips"], suitableFor:["all"],
    keyIngredients:[
      {name:"Long-wear Formula",  benefit:"Stays put for hours without smudging"},
      {name:"Creamy Texture",     benefit:"Glides on effortlessly for clean lines"},
    ],
    alternatives:{
      budget:  {name:"NYX Professional Lip Liner",       brand:"NYX",             price:"£6.99", affiliateUrl:amz("NYX Professional Makeup Slim Lip Pencil"),    reason:"Smooth slim lip liner in 40+ shades."},
      luxury:  {name:"NARS Velvet Lip Liner",             brand:"NARS",            price:"£25",   affiliateUrl:amz("NARS Velvet Lip Liner"),                      reason:"Velvety formula with all-day staying power."},
      organic: {name:"Ilia Satin Lip Pencil",             brand:"ILIA",            price:"£22",   affiliateUrl:amz("ILIA Satin Lip Pencil"),                      reason:"Clean certified satin-finish organic lip liner."},
    },
  },
  {
    id:"p27", name:"Charlotte Tilbury Matte Revolution Lipstick", brand:"Charlotte Tilbury", category:"lipstick",
    tags:["lip","matte","bestseller","long-wearing"], bestSeller:true,
    description:"Lightweight matte with a comfortable long-lasting formula. 50 iconic shades.",
    price:"£30", image:PIMG.charlotte_liner, affiliateUrl:amz("Charlotte Tilbury Matte Revolution Lipstick"),
    zones:["lips"], suitableFor:["all"],
    keyIngredients:[
      {name:"Hyaluronic Acid",   benefit:"Moisturises lips throughout wear"},
      {name:"Vitamin E",         benefit:"Conditions and protects the lip"},
      {name:"Matte Pigments",    benefit:"Bold even colour with no feathering"},
    ],
    alternatives:{
      budget:  {name:"Maybelline Color Sensational Matte Lipstick", brand:"Maybelline",price:"£7.99", affiliateUrl:amz("Maybelline Color Sensational Matte Lipstick"),  reason:"Creamy matte in 30+ shades for under £8."},
      luxury:  {name:"YSL Rouge Pur Couture",                        brand:"YSL",       price:"£38",   affiliateUrl:amz("YSL Rouge Pur Couture Lipstick"),              reason:"Iconic Parisian lipstick with intense colour."},
      organic: {name:"ILIA Balmy Gloss Lip Tint",                    brand:"ILIA",      price:"£24",   affiliateUrl:amz("ILIA Balmy Gloss Lip Tint"),                   reason:"Clean beauty tinted gloss with hyaluronic acid."},
    },
  },

  // ── BLUSH / MAKEUP ────────────────────────────────────────────────────────
  {
    id:"p28", name:"NARS Orgasm Blush", brand:"NARS", category:"blush",
    tags:["blush","bestseller","glow","universal"], bestSeller:true,
    description:"The world's best-selling blush. Peachy-pink with golden shimmer for instant glow.",
    price:"£29", image:PIMG.mac_ruby, affiliateUrl:amz("NARS Orgasm Blush"),
    zones:["cheeks"], suitableFor:["all"],
    keyIngredients:[
      {name:"Golden Shimmer Pearls", benefit:"Catch the light for a fresh glow"},
      {name:"Long-wear Pigments",    benefit:"Colour stays vibrant all day"},
    ],
    alternatives:{
      budget:  {name:"e.l.f. Blush Palette",               brand:"e.l.f.",        price:"£10",   affiliateUrl:amz("elf Blush Palette"),                    reason:"Vegan buildable blush in a value palette."},
      luxury:  {name:"Charlotte Tilbury Cheek to Chic",    brand:"Charlotte Tilbury",price:"£38", affiliateUrl:amz("Charlotte Tilbury Cheek to Chic Blush"),reason:"Two-tone blush for a sculpted natural flush."},
      organic: {name:"RMS Beauty Luminizer",               brand:"RMS Beauty",    price:"£34",   affiliateUrl:amz("RMS Beauty Magic Luminizer"),           reason:"Organic coconut oil luminizer for dewy glow."},
    },
  },
  {
    id:"p29", name:"Fenty Beauty Killawatt Freestyle Highlighter", brand:"Fenty Beauty", category:"highlighter",
    tags:["highlighter","glow","bestseller","deep-skin"], bestSeller:true,
    description:"Mega-watt glow for all skin tones — blinding shimmer without glitter.",
    price:"£30", image:PIMG.nars_orgasm, affiliateUrl:amz("Fenty Beauty Killawatt Freestyle Highlighter"),
    zones:["cheeks","forehead"], suitableFor:["all"],
    keyIngredients:[
      {name:"Diamond Powder",       benefit:"Creates an ultra-reflective blinding glow"},
      {name:"Long-wear Pigments",   benefit:"Stays on without creasing or fading"},
    ],
    alternatives:{
      budget:  {name:"NYX Professional Strobe of Genius Kit", brand:"NYX",          price:"£14.50", affiliateUrl:amz("NYX Professional Strobe of Genius"),       reason:"Four glow shades for a buildable highlight."},
      luxury:  {name:"Charlotte Tilbury Hollywood Glow Glide", brand:"Charlotte Tilbury",price:"£36",affiliateUrl:amz("Charlotte Tilbury Hollywood Glow Glide Highlighter"),reason:"Architect's glow for a sculpted lit look."},
      organic: {name:"Jane Iredale Glow Time Highlighter",    brand:"Jane Iredale", price:"£29",    affiliateUrl:amz("Jane Iredale Glow Time Highlighter Stick"),  reason:"Mineral clean beauty stick highlighter."},
    },
  },

  // ── HYALURONIC ACID / TARGETED ────────────────────────────────────────────
  {
    id:"p30", name:"The Ordinary Hyaluronic Acid 2% + B5", brand:"The Ordinary", category:"serum",
    tags:["hydrating","all-skin","budget-friendly","vegan","dry"],
    description:"Multi-weight hyaluronic acid draws moisture at multiple skin layers.",
    price:"£9.90", image:PIMG.rare_blush, affiliateUrl:amz("The Ordinary Hyaluronic Acid 2 B5"),
    zones:["full-face"], suitableFor:["all","dry","sensitive"],
    keyIngredients:[
      {name:"Hyaluronic Acid (3 weights)", benefit:"Hydrates at the surface, mid and deep layers"},
      {name:"Pro-Vitamin B5",              benefit:"Soothes and adds surface moisture"},
    ],
    alternatives:{
      budget:  {name:"Revolution Skincare 2% Hyaluronic Acid", brand:"Revolution",  price:"£5.99", affiliateUrl:amz("Revolution Skincare Hyaluronic Acid Serum"),   reason:"HA serum at lowest possible price."},
      luxury:  {name:"Dior Capture Totale Intensive Serum",     brand:"Dior",        price:"£120",  affiliateUrl:amz("Dior Capture Totale Intensive Serum"),        reason:"Luxury anti-ageing serum with HA and longevity."},
      organic: {name:"Sukin Hydrating Mist Toner",              brand:"Sukin",       price:"£8.99", affiliateUrl:amz("Sukin Hydrating Mist Toner"),                 reason:"Natural vegan hydrating mist with aloe."},
    },
  },
  {
    id:"p31", name:"Medik8 Crystal Retinal 6", brand:"Medik8", category:"retinol",
    tags:["anti-aging","fine-lines","retinol","brightening","luxury"], newIn:true,
    description:"Retinaldehyde — 11x more potent than retinol — for faster visible anti-ageing.",
    price:"£49", image:PIMG.benefit_porefessional, affiliateUrl:amz("Medik8 Crystal Retinal 6"),
    zones:["full-face"], suitableFor:["normal","combination","mature"],
    keyIngredients:[
      {name:"Retinaldehyde 0.06%", benefit:"Converts to retinoic acid in 1 step vs retinol's 2"},
      {name:"Vitamin C",           benefit:"Antioxidant synergy for brightening"},
      {name:"Niacinamide",         benefit:"Calms any retinoid irritation"},
    ],
    alternatives:{
      budget:  {name:"The Ordinary Retinol 0.5% in Squalane", brand:"The Ordinary", price:"£8.10", affiliateUrl:amz("The Ordinary Retinol 0.5 Squalane"),      reason:"Mid-strength retinol in nourishing squalane."},
      luxury:  {name:"SkinCeuticals Retinol 0.5 Refining",    brand:"SkinCeuticals", price:"£78",   affiliateUrl:amz("SkinCeuticals Retinol 0.5 Refining Night Cream"), reason:"Pure retinol in soothing emollient base."},
      organic: {name:"Pai Skincare Rosehip BioRegenerate Oil", brand:"Pai Skincare", price:"£38",   affiliateUrl:amz("Pai Skincare Rosehip BioRegenerate Oil"), reason:"Certified organic natural retinol from rosehip."},
    },
  },
  // ── VITAMIN C EXTRAS ─────────────────────────────────────────────────────
  {
    id:"p32", name:"Sunday Riley C.E.O. Vitamin C Serum", brand:"Sunday Riley", category:"serum",
    tags:["vitamin-c","brightening","anti-aging","hyperpigmentation","luxury"], newIn:true,
    description:"15% THD Ascorbate — the most stable form of vitamin C for maximum brightening.",
    price:"£85", image:PIMG.charlotte_beam, affiliateUrl:amz("Sunday Riley CEO Vitamin C Serum"),
    zones:["full-face","dark-spots"], suitableFor:["all","normal","mature"],
    keyIngredients:[
      {name:"THD Ascorbate 15%", benefit:"Stable Vitamin C that penetrates 8x deeper"},
      {name:"Turmeric Extract",  benefit:"Anti-inflammatory brightening boost"},
      {name:"Ginger Root",       benefit:"Antioxidant protection and radiance"},
    ],
    alternatives:{
      budget:  {name:"Boots Vitamin C Brightening Serum",    brand:"Boots",        price:"£9.99", affiliateUrl:amz("Boots Vitamin C Brightening Serum"),      reason:"Own-brand vitamin C serum for under £10."},
      luxury:  {name:"SkinCeuticals C E Ferulic",             brand:"SkinCeuticals",price:"£166",  affiliateUrl:amz("SkinCeuticals CE Ferulic"),               reason:"Gold standard antioxidant serum with ferulic."},
      organic: {name:"Trilogy Vitamin C Booster Treatment",   brand:"Trilogy",      price:"£29.99",affiliateUrl:amz("Trilogy Vitamin C Booster Treatment"),    reason:"Certified natural Vitamin C powder booster."},
    },
  },

  // ── SETTING / PRIMER ─────────────────────────────────────────────────────
  {
    id:"p33", name:"Charlotte Tilbury Airbrush Flawless Finish Setting Powder", brand:"Charlotte Tilbury", category:"powder",
    tags:["powder","setting","oily","bestseller","matte"], bestSeller:true,
    description:"Micro-fine setting powder that blurs pores and sets makeup for 12 hours.",
    price:"£38", image:PIMG.ordinary_azelaic, affiliateUrl:amz("Charlotte Tilbury Airbrush Flawless Finish Setting Powder"),
    zones:["full-face","t-zone"], suitableFor:["all","oily"],
    keyIngredients:[
      {name:"Micro-fine Silica",   benefit:"Blurs pores and fine lines instantly"},
      {name:"Light-diffusing Mica",benefit:"Soft focus effect for flawless finish"},
    ],
    alternatives:{
      budget:  {name:"Rimmel Stay Matte Pressed Powder", brand:"Rimmel",          price:"£5.99", affiliateUrl:amz("Rimmel Stay Matte Pressed Powder"),            reason:"Cult matte powder for under £6."},
      luxury:  {name:"Hourglass Ambient Lighting Powder", brand:"Hourglass",      price:"£48",   affiliateUrl:amz("Hourglass Ambient Lighting Powder"),           reason:"Ethereal photoluminescent setting powder."},
      organic: {name:"Jane Iredale Amazing Base Powder",  brand:"Jane Iredale",   price:"£42",   affiliateUrl:amz("Jane Iredale Amazing Base Loose Mineral Powder"),reason:"100% mineral clean beauty setting powder."},
    },
  },
  {
    id:"p34", name:"Smashbox Photo Finish Primer", brand:"Smashbox", category:"primer",
    tags:["primer","pores","all-skin","long-wearing"],
    description:"Silicone-based primer that minimises pores and extends foundation wear.",
    price:"£33", image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", affiliateUrl:amz("Smashbox Photo Finish Foundation Primer"),
    zones:["full-face"], suitableFor:["all","oily","combination"],
    keyIngredients:[
      {name:"Cyclopentasiloxane", benefit:"Fills in pores and fine lines"},
      {name:"Vitamins A, C, E",   benefit:"Antioxidant protection under makeup"},
    ],
    alternatives:{
      budget:  {name:"e.l.f. Poreless Putty Primer",      brand:"e.l.f.",        price:"£10",   affiliateUrl:amz("elf Poreless Putty Primer"),                  reason:"Vegan grip primer for flawless foundation wear."},
      luxury:  {name:"Charlotte Tilbury Hollywood Flawless Filter",brand:"Charlotte Tilbury",price:"£34",affiliateUrl:amz("Charlotte Tilbury Hollywood Flawless Filter"),reason:"Luminous filter for camera-ready glowing skin."},
      organic: {name:"RMS Beauty Raw Coconut Cream",       brand:"RMS Beauty",   price:"£28",   affiliateUrl:amz("RMS Beauty Raw Coconut Cream"),               reason:"Organic coconut primer and moisturiser in one."},
    },
  },

  // ── TARGETED TREATMENTS ───────────────────────────────────────────────────
  {
    id:"p35", name:"Mario Badescu Drying Lotion", brand:"Mario Badescu", category:"spot-treatment",
    tags:["blemish-prone","spot-treatment","overnight","bestseller"], bestSeller:true,
    description:"Cult overnight spot treatment that shrinks blemishes while you sleep.",
    price:"£20", image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", affiliateUrl:amz("Mario Badescu Drying Lotion"),
    zones:["chin","nose","cheeks"], suitableFor:["oily","combination","blemish-prone"],
    keyIngredients:[
      {name:"Salicylic Acid",    benefit:"Penetrates pores to break down blemishes"},
      {name:"Sulfur",            benefit:"Antibacterial that dries out spots overnight"},
      {name:"Calamine",          benefit:"Calms redness and reduces inflammation"},
    ],
    alternatives:{
      budget:  {name:"Clean & Clear Advantage Spot Treatment", brand:"Clean & Clear", price:"£5.99", affiliateUrl:amz("Clean Clear Advantage Spot Treatment"),      reason:"Salicylic acid spot gel for under £6."},
      luxury:  {name:"Murad Rapid Relief Acne Spot Treatment",  brand:"Murad",         price:"£28",   affiliateUrl:amz("Murad Rapid Relief Acne Spot Treatment"),   reason:"Dermatologist-grade 2% SA rapid blemish fader."},
      organic: {name:"Trilogy Blemish Be Gone Gel",             brand:"Trilogy",       price:"£15.99",affiliateUrl:amz("Trilogy Blemish Be Gone Gel"),               reason:"Tea tree and manuka honey natural spot gel."},
    },
  },
  {
    id:"p36", name:"The Ordinary Azelaic Acid Suspension 10%", brand:"The Ordinary", category:"serum",
    tags:["hyperpigmentation","redness","rosacea","budget-friendly","brightening"],
    description:"Multi-function azelaic acid for even tone, redness reduction and blemish control.",
    price:"£7.90", image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", affiliateUrl:amz("The Ordinary Azelaic Acid Suspension 10"),
    zones:["full-face","dark-spots","cheeks"], suitableFor:["sensitive","rosacea","oily"],
    keyIngredients:[
      {name:"Azelaic Acid 10%", benefit:"Fades hyperpigmentation and reduces redness"},
      {name:"Dimethyl Isosorbide",benefit:"Delivery vehicle for deeper penetration"},
    ],
    alternatives:{
      budget:  {name:"Paula's Choice Azelaic Acid Booster 10%", brand:"Paula's Choice",price:"£38",   affiliateUrl:amz("Paulas Choice Azelaic Acid Booster"),      reason:"Silkier texture with additional peptides."},
      luxury:  {name:"Skinbetter Science Even Tone Serum",       brand:"Skinbetter",   price:"£95",    affiliateUrl:amz("Skinbetter Even Tone Correcting Serum"),  reason:"Clinical-grade pigmentation correction serum."},
      organic: {name:"Earth Rhythm Azelaic Acid Face Serum",     brand:"Earth Rhythm", price:"£18",    affiliateUrl:amz("Earth Rhythm Azelaic Acid Face Serum"),   reason:"Vegan natural azelaic serum with skin barrier repair."},
    },
  },
  {
    id:"p37", name:"Glow Recipe Watermelon Glow Niacinamide Dew Drops", brand:"Glow Recipe", category:"serum",
    tags:["brightening","pores","oily","korean-inspired","glow","newIn"], newIn:true,
    description:"Watermelon-infused serum for dewy, glass-skin radiance with niacinamide.",
    price:"£38", image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", affiliateUrl:amz("Glow Recipe Watermelon Glow Niacinamide Dew Drops"),
    zones:["full-face","t-zone"], suitableFor:["oily","combination","normal"],
    keyIngredients:[
      {name:"Niacinamide 3%",        benefit:"Tightens pores and controls oil"},
      {name:"Watermelon Extract",    benefit:"Antioxidant hydration for a dewy finish"},
      {name:"Hyaluronic Acid",       benefit:"Plumps and smooths skin texture"},
    ],
    alternatives:{
      budget:  {name:"The Ordinary Multi-Peptide + HA Serum", brand:"The Ordinary",  price:"£14",   affiliateUrl:amz("The Ordinary Multi Peptide Serum"),          reason:"Peptide and HA serum for hydration and glow."},
      luxury:  {name:"Drunk Elephant B-Hydra Intensive Serum", brand:"Drunk Elephant",price:"£44",  affiliateUrl:amz("Drunk Elephant B Hydra Intensive Hydration Serum"),reason:"Pro-vitamin B5 and pineapple ceramide serum."},
      organic: {name:"Herbivore Bakuchiol Retinol Alternative", brand:"Herbivore",   price:"£48",   affiliateUrl:amz("Herbivore Bakuchiol Retinol Alternative Serum"),reason:"100% natural bakuchiol plant retinol for glow."},
    },
  },
  {
    id:"p38", name:"Drunk Elephant Protini Polypeptide Cream", brand:"Drunk Elephant", category:"moisturiser",
    tags:["anti-aging","dry","peptides","luxury","firming"], newIn:true,
    description:"Signal peptide moisturiser that visibly improves skin texture and firmness.",
    price:"£60", image:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80", affiliateUrl:amz("Drunk Elephant Protini Polypeptide Cream"),
    zones:["full-face"], suitableFor:["all","dry","mature"],
    keyIngredients:[
      {name:"Signal Peptides",    benefit:"Stimulate collagen and firmness"},
      {name:"Amino Acids",        benefit:"Build proteins for healthy skin structure"},
      {name:"Pygmy Waterlily",    benefit:"Antioxidant protection and hydration"},
    ],
    alternatives:{
      budget:  {name:"Revolution Skincare Peptide Complex Serum", brand:"Revolution", price:"£8.99", affiliateUrl:amz("Revolution Skincare Peptide Complex Serum"),   reason:"Affordable peptide serum for firming on a budget."},
      luxury:  {name:"Augustinus Bader The Cream",                brand:"Augustinus Bader",price:"£265",affiliateUrl:amz("Augustinus Bader The Cream"),             reason:"TFC8® technology cream — the ultimate luxury."},
      organic: {name:"Oskia Renaissance Mask",                    brand:"Oskia",       price:"£55",   affiliateUrl:amz("Oskia Renaissance Mask"),                    reason:"Certified natural MSM and vitamins for renewal."},
    },
  },
  {
    id:"p39", name:"REN Clean Skincare AHA Smart Renewal Body Serum", brand:"REN", category:"body",
    tags:["body","brightening","dry-skin","exfoliant","clean-beauty"],
    description:"AHA body serum that resurfaces and evens skin tone from neck to toe.",
    price:"£39", image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", affiliateUrl:amz("REN Clean Skincare AHA Smart Renewal Body Serum"),
    zones:["neck","full-face"], suitableFor:["all","dry"],
    keyIngredients:[
      {name:"Lactic Acid",       benefit:"Gently resurfaces and evens body skin tone"},
      {name:"Willow Bark",       benefit:"Natural BHA to smooth rough patches"},
      {name:"Aloe Vera",         benefit:"Soothe and hydrate after exfoliation"},
    ],
    alternatives:{
      budget:  {name:"AmLactin Daily Moisturising Lotion",  brand:"AmLactin",    price:"£19.99",affiliateUrl:amz("AmLactin Daily Moisturizing Lotion"),         reason:"12% lactic acid lotion for smooth body skin."},
      luxury:  {name:"Elemis Pro-Collagen Body Serum",       brand:"Elemis",      price:"£58",   affiliateUrl:amz("Elemis Pro Collagen Body Serum"),             reason:"Marine-powered firming body serum."},
      organic: {name:"Weleda Birch Body Oil",                brand:"Weleda",      price:"£22.95",affiliateUrl:amz("Weleda Birch Body Oil"),                      reason:"100% natural anti-cellulite birch oil."},
    },
  },
  {
    id:"p40", name:"Caudalie Vinoperfect Radiance Serum", brand:"Caudalie", category:"serum",
    tags:["hyperpigmentation","brightening","dark-spots","vegan","bestseller"], bestSeller:true,
    description:"10x more effective than Vitamin C on dark spots — the #1 serum in France.",
    price:"£49", image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", affiliateUrl:amz("Caudalie Vinoperfect Radiance Serum"),
    zones:["full-face","dark-spots"], suitableFor:["all","sensitive","mature"],
    keyIngredients:[
      {name:"Viniferine",        benefit:"10x more effective than Vitamin C on spots"},
      {name:"Grape Water",       benefit:"Plumps, soothes and hydrates"},
      {name:"Hyaluronic Acid",   benefit:"Deep moisture for a plump even complexion"},
    ],
    alternatives:{
      budget:  {name:"L'Oréal Glycolic Bright Serum",      brand:"L'Oréal",       price:"£14.99", affiliateUrl:amz("LOreal Glycolic Bright Serum"),              reason:"Glycolic acid brightening serum under £15."},
      luxury:  {name:"Dior Capture Totale Super Potent Serum",brand:"Dior",        price:"£110",   affiliateUrl:amz("Dior Capture Totale Super Potent Serum"),    reason:"Multi-correction luxury serum for luminosity."},
      organic: {name:"Kora Organics Noni Bright Vitamin C Serum",brand:"KORA Organics",price:"£48",affiliateUrl:amz("Kora Organics Noni Bright Vitamin C Serum"),reason:"Certified organic brightening serum by Miranda Kerr."},
    },
  },
];

export default PRODUCT_CATALOG;
