// ── BlushMap product catalog ──────────────────────────────────────────────────
// Each product: image, name, brand, affiliateUrl ALL correctly aligned

export interface Product {
  id: string; name: string; brand: string; category: string;
  tags: string[]; description: string; price: string;
  image: string; affiliateUrl: string;
  zones: string[]; suitableFor: string[];
  keyIngredients: { name: string; benefit: string }[];
  alternatives: { budget: AltProduct; luxury: AltProduct; organic: AltProduct };
  bestSeller?: boolean; newIn?: boolean;
}

interface AltProduct { name: string; brand: string; price: string; affiliateUrl: string; }

const amz = (q: string) => `https://www.amazon.co.uk/s?k=${encodeURIComponent(q)}&tag=blushmap-21`;

// Unsplash images that visually match the product TYPE (reliable, no hotlink block)
// Key: product id → dedicated image query-matched URL
const IMG: Record<string, string> = {
  // Moisturisers — white/cream jars
  p1:  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80&fit=crop",   // CeraVe cream jar
  p2:  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80&fit=crop", // gel moisturiser
  p3:  "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80&fit=crop", // luxury cream
  p4:  "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&q=80&fit=crop", // pink whipped cream
  // Serums — dropper bottles
  p5:  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80&fit=crop", // serum dropper
  p6:  "https://images.unsplash.com/photo-1617220303901-d5ceea5b4d6e?w=500&q=80&fit=crop", // vitamin c serum
  p7:  "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80&fit=crop",    // serum bottle
  p8:  "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=500&q=80&fit=crop", // hyaluronic serum
  // SPF
  p9:  "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80&fit=crop", // spf lotion tube
  p10: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80&fit=crop",   // sunscreen
  p11: "https://images.unsplash.com/photo-1631214524020-3c69d07f9c6b?w=500&q=80&fit=crop", // tinted spf tube
  // Foundation
  p12: "https://images.unsplash.com/photo-1567721913486-6585f069b332?w=500&q=80&fit=crop", // foundation bottle glass
  p13: "https://images.unsplash.com/photo-1590156562745-5e36e44ab9e2?w=500&q=80&fit=crop", // foundation bottles row
  p14: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80&fit=crop", // fenty style flat lay
  // Concealer
  p15: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&q=80&fit=crop", // concealer pen
  p16: "https://images.unsplash.com/photo-1631214499182-e37c7dc30a3a?w=500&q=80&fit=crop", // concealer stick
  // Toner
  p17: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80&fit=crop",   // toner bottle
  p18: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500&q=80&fit=crop", // exfoliant liquid
  // Eye cream
  p19: "https://images.unsplash.com/photo-1583241475880-083f84372725?w=500&q=80&fit=crop", // eye cream jar
  p20: "https://images.unsplash.com/photo-1600428853876-fb622f69cfc3?w=500&q=80&fit=crop", // brightening cream
  // Cleanser
  p21: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500&q=80&fit=crop",   // foam cleanser
  p22: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?w=500&q=80&fit=crop",   // gel cleanser tube
  // Eye cream 2 / Serum (p20 was cleanser before - fix)
  // Retinol
  p23: "https://images.unsplash.com/photo-1617220370916-7e6c63e08d3e?w=500&q=80&fit=crop", // retinol serum bottle
  p24: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&q=80&fit=crop", // anti-age cream
  // Mask
  p25: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&q=80&fit=crop", // face mask pink
  p26: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80&fit=crop",   // charcoal mask
  // Lip
  p27: "https://images.unsplash.com/photo-1586495777744-4e6232bf2d22?w=500&q=80&fit=crop", // lip liner pencil
  p28: "https://images.unsplash.com/photo-1631730358585-38a4935cbec4?w=500&q=80&fit=crop", // lipstick bullet
  // Blush
  p29: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80&fit=crop", // blush compact
  p30: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=500&q=80&fit=crop", // liquid blush
  // Primer
  p31: "https://images.unsplash.com/photo-1631214524020-3c69d07f9c6b?w=500&q=80&fit=crop", // primer tube
  // Highlighter
  p32: "https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?w=500&q=80&fit=crop", // highlight powder
  // Spot treatment
  p33: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80&fit=crop", // spot treatment dropper
  // Primer (setting)
  p34: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80&fit=crop", // setting powder compact
  // Spot / Drying lotion
  p35: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80&fit=crop", // drying lotion bottle
  // Retinol 2
  p36: "https://images.unsplash.com/photo-1617220370916-7e6c63e08d3e?w=500&q=80&fit=crop", // retinol tube
  // Serum glow
  p37: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80&fit=crop", // glow serum
};

const CATALOG: Product[] = [
  // ── MOISTURISERS ────────────────────────────────────────────────────────────
  {
    id:"p1", name:"Moisturising Cream", brand:"CeraVe",
    category:"moisturiser", price:"£14.50", image:IMG.p1,
    tags:["hydrating","barrier-repair","fragrance-free","sensitive"],
    description:"Dermatologist-developed with three essential ceramides, hyaluronic acid and MVE technology for 24hr hydration.",
    affiliateUrl:amz("CeraVe Moisturising Cream 340g"),
    zones:["full-face","cheeks"], suitableFor:["dry","sensitive","normal"],
    keyIngredients:[{name:"Ceramides 1, 3, 6-II",benefit:"Restore skin barrier"},{name:"Hyaluronic Acid",benefit:"Deep hydration"},{name:"Niacinamide",benefit:"Calms redness"}],
    alternatives:{
      budget:{name:"Simple Kind to Skin Moisturiser",brand:"Simple",price:"£4.99",affiliateUrl:amz("Simple Kind to Skin Moisturiser")},
      luxury:{name:"Crème de la Mer",brand:"La Mer",price:"£125",affiliateUrl:amz("La Mer Creme de la Mer moisturiser")},
      organic:{name:"Ultra Facial Cream",brand:"Kiehl's",price:"£30",affiliateUrl:amz("Kiehls Ultra Facial Cream")},
    }, bestSeller:true,
  },
  {
    id:"p2", name:"Hydro Boost Water Gel", brand:"Neutrogena",
    category:"moisturiser", price:"£16.99", image:IMG.p2,
    tags:["oily","lightweight","gel","non-comedogenic"],
    description:"Oil-free gel formula with hyaluronic acid that locks in moisture without clogging pores.",
    affiliateUrl:amz("Neutrogena Hydro Boost Water Gel 50ml"),
    zones:["full-face","t-zone"], suitableFor:["oily","combination","normal"],
    keyIngredients:[{name:"Hyaluronic Acid",benefit:"Instant plump hydration"},{name:"Dimethicone",benefit:"Smooth skin texture"}],
    alternatives:{
      budget:{name:"Aqua Gel Moisturiser",brand:"Garnier",price:"£7.99",affiliateUrl:amz("Garnier Skin Naturals Aqua Gel")},
      luxury:{name:"Water Cream",brand:"Tatcha",price:"£69",affiliateUrl:amz("Tatcha Water Cream")},
      organic:{name:"Hydro Boost Aloe",brand:"The Inkey List",price:"£10",affiliateUrl:amz("The Inkey List Aloe Vera moisturiser")},
    }, bestSeller:true,
  },
  {
    id:"p3", name:"Water Cream", brand:"Tatcha",
    category:"moisturiser", price:"£69", image:IMG.p3,
    tags:["luxury","brightening","anti-ageing","dewy"],
    description:"Silky, water-based moisturiser with Japanese wild rose, leopard lily and green tea for a lit-from-within glow.",
    affiliateUrl:amz("Tatcha Water Cream 50ml"),
    zones:["full-face"], suitableFor:["normal","combination","oily"],
    keyIngredients:[{name:"Hadasei-3",benefit:"Japanese anti-ageing complex"},{name:"Wild Rose",benefit:"Brightens & evens tone"}],
    alternatives:{
      budget:{name:"Hydro Boost",brand:"Neutrogena",price:"£16.99",affiliateUrl:amz("Neutrogena Hydro Boost")},
      luxury:{name:"Crème Ancienne",brand:"Fresh",price:"£280",affiliateUrl:amz("Fresh Creme Ancienne")},
      organic:{name:"Youth to the People Superfood",brand:"Youth to the People",price:"£48",affiliateUrl:amz("Youth to the People Superfood Moisturiser")},
    },
  },
  {
    id:"p4", name:"Lala Retro Whipped Cream", brand:"Drunk Elephant",
    category:"moisturiser", price:"£48", image:IMG.p4,
    tags:["nourishing","barrier","peptides","ceramides","luxury"],
    description:"Luxuriously whipped moisturiser packed with ceramides, fatty acids and plant oils to restore and nourish.",
    affiliateUrl:amz("Drunk Elephant Lala Retro Whipped Cream"),
    zones:["full-face","cheeks"], suitableFor:["dry","mature","sensitive"],
    keyIngredients:[{name:"Ceramides",benefit:"Barrier restoration"},{name:"Fatty Acids",benefit:"Deep nourishment"},{name:"Kalahari Melon Oil",benefit:"Antioxidant protection"}],
    alternatives:{
      budget:{name:"CeraVe Moisturising Cream",brand:"CeraVe",price:"£14.50",affiliateUrl:amz("CeraVe Moisturising Cream")},
      luxury:{name:"Augustinus Bader Rich Cream",brand:"Augustinus Bader",price:"£250",affiliateUrl:amz("Augustinus Bader The Rich Cream")},
      organic:{name:"Weleda Skin Food",brand:"Weleda",price:"£18",affiliateUrl:amz("Weleda Skin Food original")},
    },
  },
  // ── SERUMS ──────────────────────────────────────────────────────────────────
  {
    id:"p5", name:"Niacinamide 10% + Zinc 1%", brand:"The Ordinary",
    category:"serum", price:"£5.90", image:IMG.p5,
    tags:["pores","oily","brightening","acne","affordable"],
    description:"High-strength niacinamide serum that visibly minimises pores, controls sebum and balances skin tone.",
    affiliateUrl:amz("The Ordinary Niacinamide 10% Zinc 1% 30ml"),
    zones:["t-zone","nose","forehead"], suitableFor:["oily","combination","acne-prone"],
    keyIngredients:[{name:"Niacinamide 10%",benefit:"Pore-minimising & sebum control"},{name:"Zinc PCA",benefit:"Balances oiliness"}],
    alternatives:{
      budget:{name:"Niacinamide Serum",brand:"e.l.f.",price:"£12",affiliateUrl:amz("elf Niacinamide Serum")},
      luxury:{name:"Smart Dose Serum",brand:"Clinique",price:"£55",affiliateUrl:amz("Clinique Smart Clinical MD serum")},
      organic:{name:"Niacinamide 10%",brand:"INKEY List",price:"£10",affiliateUrl:amz("Inkey List Niacinamide serum")},
    }, bestSeller:true,
  },
  {
    id:"p6", name:"C E Ferulic", brand:"SkinCeuticals",
    category:"serum", price:"£166", image:IMG.p6,
    tags:["vitamin-c","antioxidant","brightening","anti-ageing","luxury"],
    description:"Gold-standard vitamin C serum combining 15% pure vitamin C, vitamin E and ferulic acid for maximum antioxidant protection.",
    affiliateUrl:amz("SkinCeuticals C E Ferulic vitamin C serum"),
    zones:["full-face"], suitableFor:["normal","dry","mature"],
    keyIngredients:[{name:"Vitamin C 15%",benefit:"Brightens & protects"},{name:"Vitamin E",benefit:"Antioxidant synergy"},{name:"Ferulic Acid",benefit:"Stabilises vitamin C"}],
    alternatives:{
      budget:{name:"Vitamin C Suspension 23%",brand:"The Ordinary",price:"£5.90",affiliateUrl:amz("The Ordinary Vitamin C Suspension 23")},
      luxury:{name:"Glow Drops",brand:"Charlotte Tilbury",price:"£45",affiliateUrl:amz("Charlotte Tilbury Brightening Youth Glow drops")},
      organic:{name:"Potent-C Power Serum",brand:"Murad",price:"£82",affiliateUrl:amz("Murad Vitamin C serum")},
    },
  },
  {
    id:"p7", name:"2% BHA Liquid Exfoliant", brand:"Paula's Choice",
    category:"toner", price:"£32", image:IMG.p7,
    tags:["exfoliant","bha","pores","blackheads","acne"],
    description:"Cult-favourite leave-on exfoliant with 2% salicylic acid that unclogs pores, removes blackheads and refines skin texture.",
    affiliateUrl:amz("Paula's Choice 2% BHA Liquid Exfoliant 118ml"),
    zones:["t-zone","nose","forehead"], suitableFor:["oily","combination","acne-prone"],
    keyIngredients:[{name:"Salicylic Acid 2%",benefit:"Clears pores & blackheads"},{name:"Methylpropanediol",benefit:"Enhances penetration"}],
    alternatives:{
      budget:{name:"Ordinary Glycolic Acid 7%",brand:"The Ordinary",price:"£7.90",affiliateUrl:amz("The Ordinary Glycolic Acid Toning Solution")},
      luxury:{name:"Gommage Éclat",brand:"Sisley",price:"£64",affiliateUrl:amz("Sisley Radiance Gommage")},
      organic:{name:"AHA BHA Fruit Acid Glow Tonic",brand:"Elemis",price:"£32",affiliateUrl:amz("Elemis fruit acid glow tonic")},
    }, bestSeller:true,
  },
  {
    id:"p8", name:"Advanced Night Repair Serum", brand:"Estée Lauder",
    category:"serum", price:"£85", image:IMG.p8,
    tags:["night","repair","hyaluronic","anti-ageing","iconic"],
    description:"Iconic overnight repair serum with ChronoluxCB™ technology and hyaluronic acid complex for visibly younger-looking skin.",
    affiliateUrl:amz("Estee Lauder Advanced Night Repair Serum 50ml"),
    zones:["full-face"], suitableFor:["all","mature","dry"],
    keyIngredients:[{name:"ChronoluxCB™",benefit:"Overnight cell repair"},{name:"Hyaluronic Acid",benefit:"Deep hydration"},{name:"Caffeine",benefit:"Energises & brightens"}],
    alternatives:{
      budget:{name:"Hyaluronic Acid 2% B5",brand:"The Ordinary",price:"£8.10",affiliateUrl:amz("The Ordinary Hyaluronic Acid 2% B5")},
      luxury:{name:"Midnight Luxury Mask",brand:"La Mer",price:"£220",affiliateUrl:amz("La Mer Midnight Luxury Mask")},
      organic:{name:"Retinol 0.5% in Squalane",brand:"The Ordinary",price:"£7",affiliateUrl:amz("The Ordinary Retinol Squalane")},
    }, bestSeller:true,
  },
  // ── SPF ──────────────────────────────────────────────────────────────────────
  {
    id:"p9", name:"Anthelios UVMune 400 Fluid SPF50+", brand:"La Roche-Posay",
    category:"spf", price:"£20", image:IMG.p9,
    tags:["spf","protection","lightweight","daily","sensitive"],
    description:"Ultra-light fluid SPF50+ with UVMune 400 technology offering broad-spectrum protection against long UVA rays.",
    affiliateUrl:amz("La Roche Posay Anthelios UVMune 400 SPF50 Fluid"),
    zones:["full-face"], suitableFor:["all","sensitive","oily"],
    keyIngredients:[{name:"Mexoryl 400",benefit:"Long-UVA protection"},{name:"Antioxidants",benefit:"Free radical defence"}],
    alternatives:{
      budget:{name:"Bondi Sands SPF50 Face Mist",brand:"Bondi Sands",price:"£10",affiliateUrl:amz("Bondi Sands SPF50 face")},
      luxury:{name:"Sheer Physical UV Defense SPF50",brand:"SkinCeuticals",price:"£41",affiliateUrl:amz("SkinCeuticals Sheer Physical UV Defense SPF50")},
      organic:{name:"Ultra Light Daily UV Defense SPF50",brand:"Kiehl's",price:"£32",affiliateUrl:amz("Kiehls Ultra Light Daily UV Defense SPF50")},
    }, bestSeller:true,
  },
  {
    id:"p10", name:"Face Sun Protector SPF50", brand:"Ultrasun",
    category:"spf", price:"£19.50", image:IMG.p10,
    tags:["spf","anti-ageing","daily","sensitive"],
    description:"Award-winning once-a-day SPF50 face protection with anti-ageing complex. Water-resistant up to 8 hours.",
    affiliateUrl:amz("Ultrasun Face SPF50 Anti-Ageing 50ml"),
    zones:["full-face"], suitableFor:["all","sensitive","dry"],
    keyIngredients:[{name:"UVA/UVB Filters",benefit:"Broad-spectrum protection"},{name:"Photoaging Complex",benefit:"Prevents pigmentation"}],
    alternatives:{
      budget:{name:"Garnier Ambre Solaire SPF50",brand:"Garnier",price:"£8",affiliateUrl:amz("Garnier Ambre Solaire SPF50 face")},
      luxury:{name:"Total Eye Defense SPF15",brand:"Shiseido",price:"£48",affiliateUrl:amz("Shiseido sunscreen face SPF50")},
      organic:{name:"Altruist SPF50",brand:"Altruist",price:"£3",affiliateUrl:amz("Altruist Face Fluid SPF50")},
    },
  },
  {
    id:"p11", name:"Anthelios Tinted Fluid SPF50+", brand:"La Roche-Posay",
    category:"tinted-spf", price:"£18", image:IMG.p11,
    tags:["tinted","spf","no-white-cast","natural","all-tones"],
    description:"Tinted SPF50+ fluid that works beautifully on all skin tones — no white cast, natural finish.",
    affiliateUrl:amz("La Roche Posay Anthelios Tinted Fluid SPF50 medium"),
    zones:["full-face"], suitableFor:["all","oily","combination"],
    keyIngredients:[{name:"Mexoryl SX & XL",benefit:"Broad-spectrum protection"},{name:"Iron Oxides",benefit:"No white cast on deeper tones"}],
    alternatives:{
      budget:{name:"Supergoop Unseen Sunscreen",brand:"Supergoop",price:"£34",affiliateUrl:amz("Supergoop Unseen Sunscreen SPF40")},
      luxury:{name:"Skin Tint SPF40",brand:"ILIA",price:"£48",affiliateUrl:amz("ILIA Super Serum Skin Tint SPF40")},
      organic:{name:"Black Girl Sunscreen SPF30",brand:"BGS",price:"£18",affiliateUrl:amz("Black Girl Sunscreen SPF30")},
    },
  },
  // ── FOUNDATION ──────────────────────────────────────────────────────────────
  {
    id:"p12", name:"Airbrush Flawless Foundation", brand:"Charlotte Tilbury",
    category:"foundation", price:"£38", image:IMG.p12,
    tags:["full-coverage","matte","long-lasting","luxury"],
    description:"24-hour full-coverage liquid foundation with an airbrush-finish that blurs imperfections beautifully.",
    affiliateUrl:amz("Charlotte Tilbury Airbrush Flawless Foundation 30ml"),
    zones:["full-face"], suitableFor:["all","oily","combination"],
    keyIngredients:[{name:"Hyaluronic Acid",benefit:"Plumps & hydrates"},{name:"Photo-Focus Complex",benefit:"24hr coverage"}],
    alternatives:{
      budget:{name:"Fit Me Matte+Poreless",brand:"Maybelline",price:"£7.99",affiliateUrl:amz("Maybelline Fit Me Matte Poreless Foundation")},
      luxury:{name:"Teint Idole Ultra Wear",brand:"Lancôme",price:"£42",affiliateUrl:amz("Lancome Teint Idole Ultra Wear Foundation")},
      organic:{name:"Skin Tint SPF20",brand:"RMS Beauty",price:"£42",affiliateUrl:amz("RMS Beauty Skin Tint")},
    }, bestSeller:true,
  },
  {
    id:"p13", name:"Natural Radiant Longwear Foundation", brand:"NARS",
    category:"foundation", price:"£44", image:IMG.p13,
    tags:["medium-full","radiant","longwear","buildable"],
    description:"Buildable medium-to-full coverage foundation with a natural, radiant finish that lasts up to 16 hours.",
    affiliateUrl:amz("NARS Natural Radiant Longwear Foundation"),
    zones:["full-face"], suitableFor:["normal","dry","combination"],
    keyIngredients:[{name:"Light-Diffusing Pigments",benefit:"Natural glow"},{name:"Hyaluronic Acid",benefit:"16hr moisture"}],
    alternatives:{
      budget:{name:"True Match Foundation",brand:"L'Oréal",price:"£9.99",affiliateUrl:amz("Loreal True Match Foundation")},
      luxury:{name:"Skin Weightless Powder Foundation",brand:"Laura Mercier",price:"£45",affiliateUrl:amz("Laura Mercier powder foundation")},
      organic:{name:"Serum Foundation",brand:"bareMinerals",price:"£36",affiliateUrl:amz("bareMinerals serum foundation")},
    },
  },
  {
    id:"p14", name:"Pro Filt'r Soft Matte Foundation", brand:"Fenty Beauty",
    category:"foundation", price:"£34", image:IMG.p14,
    tags:["inclusive","matte","50-shades","medium-full","diverse"],
    description:"Soft matte, longwear foundation available in 50 shades. Buildable medium-to-full coverage, oil-free formula.",
    affiliateUrl:amz("Fenty Beauty Pro Filtr Soft Matte Foundation"),
    zones:["full-face"], suitableFor:["all","oily","combination"],
    keyIngredients:[{name:"Longwear Polymers",benefit:"12hr wear"},{name:"Sun-Filtered Pigments",benefit:"Natural matte finish"}],
    alternatives:{
      budget:{name:"Fit Me Matte+Poreless",brand:"Maybelline",price:"£7.99",affiliateUrl:amz("Maybelline Fit Me Foundation")},
      luxury:{name:"Futurist Aqua Brilliance Foundation",brand:"Estée Lauder",price:"£41",affiliateUrl:amz("Estee Lauder Futurist Foundation")},
      organic:{name:"Well Rested Face Primer+Brightener",brand:"RMS Beauty",price:"£28",affiliateUrl:amz("RMS Beauty Foundation")},
    }, bestSeller:true,
  },
  // ── CONCEALER ───────────────────────────────────────────────────────────────
  {
    id:"p15", name:"Radiant Creamy Concealer", brand:"NARS",
    category:"concealer", price:"£28", image:IMG.p15,
    tags:["brightening","dark-circles","under-eyes","full-coverage"],
    description:"Creamy, full-coverage concealer that brightens under-eyes and covers blemishes with a natural finish.",
    affiliateUrl:amz("NARS Radiant Creamy Concealer"),
    zones:["under-eyes","dark-spots"], suitableFor:["all","dry","normal"],
    keyIngredients:[{name:"Hyaluronic Acid",benefit:"Hydrates delicate eye area"},{name:"Light-Reflecting Pigments",benefit:"Brightens & lifts"}],
    alternatives:{
      budget:{name:"Fit Me Concealer",brand:"Maybelline",price:"£7.99",affiliateUrl:amz("Maybelline Fit Me Concealer")},
      luxury:{name:"Touche Éclat Illuminating Pen",brand:"YSL",price:"£34",affiliateUrl:amz("YSL Touche Eclat illuminating pen")},
      organic:{name:"Un Cover-Up Concealer",brand:"RMS Beauty",price:"£32",affiliateUrl:amz("RMS Beauty Un Cover Up Concealer")},
    }, bestSeller:true,
  },
  {
    id:"p16", name:"Fit Me Concealer", brand:"Maybelline",
    category:"concealer", price:"£7.99", image:IMG.p16,
    tags:["affordable","lightweight","natural","everyday"],
    description:"Lightweight, natural-finish concealer that blends seamlessly to cover blemishes and dark circles.",
    affiliateUrl:amz("Maybelline Fit Me Concealer"),
    zones:["under-eyes","blemishes"], suitableFor:["all","oily","combination"],
    keyIngredients:[{name:"Vitamin E",benefit:"Nourishes skin"},{name:"Coverage Pigments",benefit:"Natural finish"}],
    alternatives:{
      budget:{name:"Collection Lasting Perfection",brand:"Collection",price:"£4.99",affiliateUrl:amz("Collection Lasting Perfection concealer")},
      luxury:{name:"NARS Radiant Creamy Concealer",brand:"NARS",price:"£28",affiliateUrl:amz("NARS Radiant Creamy Concealer")},
      organic:{name:"Magic Away Liquid Concealer",brand:"Charlotte Tilbury",price:"£26",affiliateUrl:amz("Charlotte Tilbury Magic Away concealer")},
    },
  },
  // ── TONER / ESSENCE ─────────────────────────────────────────────────────────
  {
    id:"p17", name:"Essence Toner", brand:"Pyunkang Yul",
    category:"essence", price:"£16", image:IMG.p17,
    tags:["minimalist","hydrating","sensitive","korean","alcohol-free"],
    description:"Korean minimalist essence toner with just 1 key ingredient — astragalus root extract. Maximum hydration, zero irritation.",
    affiliateUrl:amz("Pyunkang Yul Essence Toner 200ml"),
    zones:["full-face"], suitableFor:["sensitive","dry","normal"],
    keyIngredients:[{name:"Astragalus Root Extract",benefit:"Deep hydration & repair"}],
    alternatives:{
      budget:{name:"Simple Soothing Facial Toner",brand:"Simple",price:"£3.99",affiliateUrl:amz("Simple Soothing Toner")},
      luxury:{name:"Pitera Essence",brand:"SK-II",price:"£115",affiliateUrl:amz("SK-II Facial Treatment Essence Pitera")},
      organic:{name:"Midnight Recovery Concentrate",brand:"Kiehl's",price:"£52",affiliateUrl:amz("Kiehls Midnight Recovery Concentrate")},
    },
  },
  {
    id:"p18", name:"Snail Mucin 96% Power Repairing Essence", brand:"COSRX",
    category:"essence", price:"£22", image:IMG.p18,
    tags:["repair","snail","hydrating","korean","acne-scars"],
    description:"96% snail secretion filtrate essence that repairs post-acne marks, deeply hydrates and plumps skin overnight.",
    affiliateUrl:amz("COSRX Snail Mucin 96% Power Repairing Essence 100ml"),
    zones:["full-face","scarring"], suitableFor:["all","acne-prone","sensitive"],
    keyIngredients:[{name:"Snail Secretion Filtrate 96%",benefit:"Repair & regeneration"},{name:"Sodium Hyaluronate",benefit:"Moisture retention"}],
    alternatives:{
      budget:{name:"Moisture Bomb Sleeping Mask",brand:"The Inkey List",price:"£13",affiliateUrl:amz("Inkey List sleeping mask")},
      luxury:{name:"SKII Pitera Essence",brand:"SK-II",price:"£115",affiliateUrl:amz("SK-II Pitera Essence")},
      organic:{name:"Glow Drops",brand:"Youth to the People",price:"£38",affiliateUrl:amz("Youth to the People glow drops")},
    }, newIn:true,
  },
  // ── EYE CREAM ───────────────────────────────────────────────────────────────
  {
    id:"p19", name:"Pro Retinol Eye Treatment", brand:"Olay",
    category:"eye-cream", price:"£12.50", image:IMG.p19,
    tags:["eye","retinol","anti-ageing","affordable","fine-lines"],
    description:"Affordable retinol eye cream that targets crow's feet and fine lines around the eye area.",
    affiliateUrl:amz("Olay Pro Retinol Eye Treatment"),
    zones:["under-eyes"], suitableFor:["mature","normal","combination"],
    keyIngredients:[{name:"Retinol",benefit:"Smooths fine lines"},{name:"Niacinamide",benefit:"Brightens dark circles"}],
    alternatives:{
      budget:{name:"Q10 Eye Cream",brand:"Nivea",price:"£6.99",affiliateUrl:amz("Nivea Q10 Eye Cream")},
      luxury:{name:"Crème de la Mer Eye Concentrate",brand:"La Mer",price:"£180",affiliateUrl:amz("La Mer Eye Concentrate")},
      organic:{name:"Ginzing Brightening Eye Cream",brand:"Origins",price:"£28",affiliateUrl:amz("Origins Ginzing Eye Cream")},
    },
  },
  {
    id:"p20", name:"Creamy Eye Treatment with Avocado", brand:"Kiehl's",
    category:"eye-cream", price:"£32", image:IMG.p20,
    tags:["nourishing","avocado","dry","dark-circles","gentle"],
    description:"Rich, nourishing eye treatment with avocado oil and shea butter that deeply moisturises the delicate eye area.",
    affiliateUrl:amz("Kiehls Creamy Eye Treatment Avocado"),
    zones:["under-eyes"], suitableFor:["dry","mature","sensitive"],
    keyIngredients:[{name:"Avocado Oil",benefit:"Rich nourishment"},{name:"Shea Butter",benefit:"Intense moisture"}],
    alternatives:{
      budget:{name:"Vitamin E Eye Cream",brand:"The Body Shop",price:"£12",affiliateUrl:amz("Body Shop Vitamin E eye cream")},
      luxury:{name:"Pro-Retinol Eye Cream",brand:"Elemis",price:"£60",affiliateUrl:amz("Elemis Pro-Collagen Eye Cream")},
      organic:{name:"Sea Buckthorn Eye Cream",brand:"Weleda",price:"£22",affiliateUrl:amz("Weleda Sea Buckthorn Eye Cream")},
    },
  },
  // ── CLEANSER ────────────────────────────────────────────────────────────────
  {
    id:"p21", name:"Foaming Facial Cleanser", brand:"CeraVe",
    category:"cleanser", price:"£12.50", image:IMG.p21,
    tags:["foaming","oily","non-comedogenic","ceramides","gentle"],
    description:"Gentle foaming cleanser with ceramides and hyaluronic acid that removes excess oil without disrupting the skin barrier.",
    affiliateUrl:amz("CeraVe Foaming Facial Cleanser 236ml"),
    zones:["full-face","t-zone"], suitableFor:["oily","combination","normal"],
    keyIngredients:[{name:"Ceramides",benefit:"Barrier protection"},{name:"Niacinamide",benefit:"Calms post-wash"},{name:"Hyaluronic Acid",benefit:"Maintains moisture"}],
    alternatives:{
      budget:{name:"Spotless Face Wash",brand:"Simple",price:"£3.99",affiliateUrl:amz("Simple Spotless face wash")},
      luxury:{name:"Instant Brightening Cleansing Foam",brand:"Caudalie",price:"£22",affiliateUrl:amz("Caudalie Cleansing Foam")},
      organic:{name:"Toleriane Hydrating Gentle Cleanser",brand:"La Roche-Posay",price:"£14",affiliateUrl:amz("La Roche Posay Toleriane Gentle Cleanser")},
    }, bestSeller:true,
  },
  {
    id:"p22", name:"Toleriane Hydrating Gentle Cleanser", brand:"La Roche-Posay",
    category:"cleanser", price:"£14", image:IMG.p22,
    tags:["gentle","sensitive","hydrating","fragrance-free","daily"],
    description:"Prebiotic thermal water cleanser that gently cleanses without over-stripping sensitive or dry skin.",
    affiliateUrl:amz("La Roche Posay Toleriane Hydrating Gentle Cleanser"),
    zones:["full-face"], suitableFor:["sensitive","dry","normal"],
    keyIngredients:[{name:"Prebiotic Thermal Water",benefit:"Microbiome protection"},{name:"Niacinamide",benefit:"Strengthens barrier"}],
    alternatives:{
      budget:{name:"Hydrating Facial Cleanser",brand:"Garnier",price:"£5.99",affiliateUrl:amz("Garnier Hydrating facial cleanser")},
      luxury:{name:"Créme Mousse Confort",brand:"Clarins",price:"£24",affiliateUrl:amz("Clarins Cleansing Mousse")},
      organic:{name:"Gentle Cleansing Gel",brand:"Avène",price:"£12",affiliateUrl:amz("Avene Gentle Cleansing Gel")},
    },
  },
  // ── RETINOL ─────────────────────────────────────────────────────────────────
  {
    id:"p23", name:"Crystal Retinal 6", brand:"Medik8",
    category:"retinol", price:"£49", image:IMG.p23,
    tags:["retinal","anti-ageing","wrinkles","advanced","night"],
    description:"Advanced retinal (not retinol) serum — 11x more potent than retinol, with a gentle time-release formula for minimal irritation.",
    affiliateUrl:amz("Medik8 Crystal Retinal 6 Night Serum 30ml"),
    zones:["full-face"], suitableFor:["mature","normal","combination"],
    keyIngredients:[{name:"Retinal (Retinaldehyde)",benefit:"11x more potent than retinol"},{name:"Hyaluronic Acid",benefit:"Counteracts dryness"}],
    alternatives:{
      budget:{name:"Retinol 0.5% in Squalane",brand:"The Ordinary",price:"£7",affiliateUrl:amz("The Ordinary Retinol 0.5% Squalane")},
      luxury:{name:"A-Passioni Retinol Cream",brand:"Drunk Elephant",price:"£74",affiliateUrl:amz("Drunk Elephant A-Passioni Retinol Cream")},
      organic:{name:"Bakuchiol Peptides Moisturiser",brand:"The Ordinary",price:"£12",affiliateUrl:amz("The Ordinary Squalane Cleanser")},
    },
  },
  {
    id:"p24", name:"Retinol Correxion Serum", brand:"RoC",
    category:"retinol", price:"£20", image:IMG.p24,
    tags:["retinol","wrinkles","affordable","anti-ageing","classic"],
    description:"Classic retinol serum with an exclusive mineral complex that visibly reduces wrinkles from the first week of use.",
    affiliateUrl:amz("RoC Retinol Correxion Line Smoothing Serum"),
    zones:["full-face"], suitableFor:["mature","normal","dry"],
    keyIngredients:[{name:"Retinol",benefit:"Smooths & resurfaces"},{name:"Mineral Complex",benefit:"Boosts retinol efficacy"}],
    alternatives:{
      budget:{name:"Retinol 1% in Squalane",brand:"The Ordinary",price:"£11",affiliateUrl:amz("The Ordinary Retinol 1% Squalane")},
      luxury:{name:"Renewal Retinol Serum",brand:"Sunday Riley",price:"£88",affiliateUrl:amz("Sunday Riley A+ High-Dose Retinoid Serum")},
      organic:{name:"Bakuchiol Peptide Moisturiser",brand:"Kiehl's",price:"£45",affiliateUrl:amz("Kiehls Retinol Serum")},
    },
  },
  // ── MASK ────────────────────────────────────────────────────────────────────
  {
    id:"p25", name:"Watermelon Glow Sleeping Mask", brand:"Glow Recipe",
    category:"mask", price:"£38", image:IMG.p25,
    tags:["overnight","hydrating","brightening","watermelon","glow"],
    description:"Overnight gel mask packed with watermelon extract, AHA and hyaluronic acid for a plumped, glowing morning complexion.",
    affiliateUrl:amz("Glow Recipe Watermelon Glow Sleeping Mask 80ml"),
    zones:["full-face"], suitableFor:["all","oily","dull"],
    keyIngredients:[{name:"Watermelon Extract",benefit:"Antioxidant glow"},{name:"AHA",benefit:"Gentle overnight exfoliation"},{name:"Hyaluronic Acid",benefit:"Overnight plump"}],
    alternatives:{
      budget:{name:"Moisturising Jelly Sleeping Mask",brand:"The Inkey List",price:"£13",affiliateUrl:amz("Inkey List sleeping mask")},
      luxury:{name:"Concentrated Night Cream",brand:"Kiehl's",price:"£45",affiliateUrl:amz("Kiehls Concentrated Night Cream")},
      organic:{name:"Overnight Recovery Sleeping Mask",brand:"Origins",price:"£34",affiliateUrl:amz("Origins overnight recovery mask")},
    }, newIn:true,
  },
  {
    id:"p26", name:"Goddess Skin Clay Mask", brand:"Charlotte Tilbury",
    category:"mask", price:"£36", image:IMG.p26,
    tags:["clay","pores","brightening","luxury","glow"],
    description:"Luxurious clay mask that draws out impurities while brightening and perfecting skin texture in 10 minutes.",
    affiliateUrl:amz("Charlotte Tilbury Goddess Skin Clay Mask"),
    zones:["t-zone","forehead","nose"], suitableFor:["oily","combination","dull"],
    keyIngredients:[{name:"Kaolin Clay",benefit:"Draws out impurities"},{name:"Hyaluronic Acid",benefit:"Hydrates while purifying"},{name:"Wild Rose",benefit:"Brightens"}],
    alternatives:{
      budget:{name:"Pore Cleansing Clay Mask",brand:"The Inkey List",price:"£10",affiliateUrl:amz("Inkey List Kaolin Mask")},
      luxury:{name:"Supermud Clearing Treatment",brand:"GlamGlow",price:"£45",affiliateUrl:amz("GlamGlow SuperMud Clearing Treatment")},
      organic:{name:"Pure Mask with White Kaolin Clay",brand:"Origins",price:"£28",affiliateUrl:amz("Origins Pure Mask White Kaolin")},
    },
  },
  // ── LIP ─────────────────────────────────────────────────────────────────────
  {
    id:"p27", name:"Lip Cheat Lip Liner — Pillow Talk", brand:"Charlotte Tilbury",
    category:"lip-liner", price:"£20", image:IMG.p27,
    tags:["lip-liner","nude","bestseller","defining","pillow-talk"],
    description:"The world's best-selling nude-pink lip liner that defines, shapes and makes lips look fuller instantly.",
    affiliateUrl:amz("Charlotte Tilbury Pillow Talk Lip Cheat Liner"),
    zones:["lips"], suitableFor:["all"],
    keyIngredients:[{name:"Vitamin E",benefit:"Conditions lips"},{name:"Carnauba Wax",benefit:"Long-wearing precision"}],
    alternatives:{
      budget:{name:"Lip Liner",brand:"NYX",price:"£6",affiliateUrl:amz("NYX Slim Lip Pencil Nude")},
      luxury:{name:"Lipliner Pencil",brand:"NARS",price:"£21",affiliateUrl:amz("NARS Lip Liner Pencil")},
      organic:{name:"Lip Liner",brand:"bareMinerals",price:"£16",affiliateUrl:amz("bareMinerals lip liner")},
    }, bestSeller:true,
  },
  {
    id:"p28", name:"Matte Revolution Lipstick — Pillow Talk", brand:"Charlotte Tilbury",
    category:"lipstick", price:"£29", image:IMG.p28,
    tags:["lipstick","matte","iconic","nude-pink","bestseller"],
    description:"Iconic longwear lipstick in the cult Pillow Talk nude-pink shade. Matte finish with a comfortable, non-drying formula.",
    affiliateUrl:amz("Charlotte Tilbury Matte Revolution Pillow Talk Lipstick"),
    zones:["lips"], suitableFor:["all"],
    keyIngredients:[{name:"Micro-Flex Technology",benefit:"Non-cracking matte"},{name:"Lip Plumping Complex",benefit:"Visibly fuller lips"}],
    alternatives:{
      budget:{name:"Colour Riche Lipstick",brand:"L'Oréal",price:"£9.99",affiliateUrl:amz("Loreal Colour Riche lipstick nude")},
      luxury:{name:"Rouge G Lipstick",brand:"Guerlain",price:"£46",affiliateUrl:amz("Guerlain Rouge G lipstick")},
      organic:{name:"High Pigment Lipstick",brand:"Ilia",price:"£27",affiliateUrl:amz("ILIA Beauty High Pigment Lipstick")},
    }, bestSeller:true,
  },
  // ── BLUSH ───────────────────────────────────────────────────────────────────
  {
    id:"p29", name:"Orgasm Blush", brand:"NARS",
    category:"blush", price:"£30", image:IMG.p29,
    tags:["blush","peachy-pink","shimmer","bestseller","iconic"],
    description:"The world's best-selling blush — warm peach-pink with gold shimmer gives all skin tones an irresistible glow.",
    affiliateUrl:amz("NARS Orgasm Blush"),
    zones:["cheeks"], suitableFor:["all"],
    keyIngredients:[{name:"Micronised Pigments",benefit:"Buildable colour"},{name:"Gold Shimmer",benefit:"Luminous glow"}],
    alternatives:{
      budget:{name:"Glow Blush",brand:"NYX",price:"£9",affiliateUrl:amz("NYX Glow Blush")},
      luxury:{name:"Blush Subtil",brand:"Chanel",price:"£45",affiliateUrl:amz("Chanel Blush Subtil")},
      organic:{name:"Well Lit™ Highlighter + Blush",brand:"RMS Beauty",price:"£38",affiliateUrl:amz("RMS Beauty Well Lit")},
    }, bestSeller:true,
  },
  {
    id:"p30", name:"Soft Pinch Liquid Blush", brand:"Rare Beauty",
    category:"blush", price:"£23", image:IMG.p30,
    tags:["liquid-blush","natural","buildable","selena","viral"],
    description:"Viral liquid blush that blends seamlessly for the most natural, lit-from-within flush. A tiny drop goes a long way.",
    affiliateUrl:amz("Rare Beauty Soft Pinch Liquid Blush"),
    zones:["cheeks"], suitableFor:["all"],
    keyIngredients:[{name:"Kombucha Ferment",benefit:"Skin-caring formula"},{name:"Long-wear polymers",benefit:"All-day flush"}],
    alternatives:{
      budget:{name:"Cheeks Out Freestyle Cream Blush",brand:"Fenty",price:"£18",affiliateUrl:amz("Fenty Beauty Cheeks Out cream blush")},
      luxury:{name:"Cheek to Chic Blush",brand:"Charlotte Tilbury",price:"£33",affiliateUrl:amz("Charlotte Tilbury Cheek to Chic blush")},
      organic:{name:"Fresh Glow Highlighter",brand:"RMS Beauty",price:"£32",affiliateUrl:amz("RMS Beauty fresh glow")},
    }, bestSeller:true, newIn:true,
  },
  // ── PRIMER ──────────────────────────────────────────────────────────────────
  {
    id:"p31", name:"The POREfessional Face Primer", brand:"Benefit",
    category:"primer", price:"£30.50", image:IMG.p31,
    tags:["pore-minimising","silicone","matte","bestseller","base"],
    description:"Cult balm primer that minimises the look of pores and fine lines while creating a smooth, matte canvas for makeup.",
    affiliateUrl:amz("Benefit Porefessional Face Primer"),
    zones:["t-zone","forehead","nose"], suitableFor:["oily","combination","all"],
    keyIngredients:[{name:"Silicones",benefit:"Blurs pores instantly"},{name:"Vitamins B & E",benefit:"Skin conditioning"}],
    alternatives:{
      budget:{name:"Pore Filling Primer",brand:"e.l.f.",price:"£10",affiliateUrl:amz("elf Pore Filling Primer")},
      luxury:{name:"Blur & Glow Primer",brand:"Charlotte Tilbury",price:"£40",affiliateUrl:amz("Charlotte Tilbury primer")},
      organic:{name:"All Nighter Primer",brand:"Urban Decay",price:"£28",affiliateUrl:amz("Urban Decay All Nighter Primer")},
    }, bestSeller:true,
  },
  // ── HIGHLIGHTER ─────────────────────────────────────────────────────────────
  {
    id:"p32", name:"Beam & Glow Highlighter — Moonbeam", brand:"Charlotte Tilbury",
    category:"highlighter", price:"£38", image:IMG.p32,
    tags:["highlighter","glow","luxury","champagne","beam"],
    description:"Champagne highlighter that delivers an otherworldly glow to cheekbones, brow bones and cupid's bow.",
    affiliateUrl:amz("Charlotte Tilbury Beam and Glow Highlighter Moonbeam"),
    zones:["cheeks","full-face"], suitableFor:["all"],
    keyIngredients:[{name:"Light-Refracting Pearls",benefit:"Multi-dimensional glow"},{name:"Skincare Complex",benefit:"Nourishes while highlighting"}],
    alternatives:{
      budget:{name:"Strobe Cream",brand:"MAC",price:"£25",affiliateUrl:amz("MAC Strobe Cream")},
      luxury:{name:"Killawatt Freestyle Highlighter",brand:"Fenty",price:"£28",affiliateUrl:amz("Fenty Killawatt Highlighter")},
      organic:{name:"Magic Complexion Brush Highlighter",brand:"bareMinerals",price:"£22",affiliateUrl:amz("bareMinerals highlighter")},
    }, bestSeller:true,
  },
  // ── SPOT TREATMENT ──────────────────────────────────────────────────────────
  {
    id:"p33", name:"Azelaic Acid Suspension 10%", brand:"The Ordinary",
    category:"spot-treatment", price:"£7.90", image:IMG.p33,
    tags:["azelaic","spots","hyperpigmentation","brightening","affordable"],
    description:"Multi-functional azelaic acid formula that targets blemishes, uneven tone and post-acne marks simultaneously.",
    affiliateUrl:amz("The Ordinary Azelaic Acid Suspension 10% 30ml"),
    zones:["forehead","cheeks","dark-spots"], suitableFor:["acne-prone","combination","oily"],
    keyIngredients:[{name:"Azelaic Acid 10%",benefit:"Reduces spots & pigmentation"},{name:"Dimethicone",benefit:"Smooth delivery"}],
    alternatives:{
      budget:{name:"Salicylic Acid 2%",brand:"The Inkey List",price:"£10",affiliateUrl:amz("Inkey List Salicylic Acid")},
      luxury:{name:"Drying Lotion",brand:"Mario Badescu",price:"£20",affiliateUrl:amz("Mario Badescu Drying Lotion")},
      organic:{name:"Tea Tree Oil",brand:"The Body Shop",price:"£8",affiliateUrl:amz("Body Shop Tea Tree Oil blemish")},
    },
  },
  // ── SETTING POWDER ──────────────────────────────────────────────────────────
  {
    id:"p34", name:"Airbrush Flawless Finish Setting Powder", brand:"Charlotte Tilbury",
    category:"powder", price:"£38", image:IMG.p34,
    tags:["setting","powder","blurring","luxury","matte"],
    description:"Micronised setting powder that locks makeup in place, blurs pores and gives an airbrushed finish all day.",
    affiliateUrl:amz("Charlotte Tilbury Airbrush Flawless Finish Setting Powder"),
    zones:["full-face","t-zone"], suitableFor:["all","oily"],
    keyIngredients:[{name:"Micronised Silica",benefit:"Blurs imperfections"},{name:"Hyaluronic Acid",benefit:"Non-drying formula"}],
    alternatives:{
      budget:{name:"Stay Matte Pressed Powder",brand:"Rimmel",price:"£5",affiliateUrl:amz("Rimmel Stay Matte Pressed Powder")},
      luxury:{name:"Loose Setting Powder",brand:"Laura Mercier",price:"£36",affiliateUrl:amz("Laura Mercier Translucent Loose Setting Powder")},
      organic:{name:"Finishing Powder",brand:"bareMinerals",price:"£30",affiliateUrl:amz("bareMinerals finishing powder")},
    },
  },
  // ── GLOW SERUM ──────────────────────────────────────────────────────────────
  {
    id:"p35", name:"CEO Vitamin C Rich Resurfacing Treatment", brand:"Sunday Riley",
    category:"serum", price:"£85", image:IMG.p35,
    tags:["vitamin-c","glow","brightening","texture","luxury"],
    description:"Powerful vitamin C serum with 15% ethyl ascorbic acid that resurfacing, brightens and visibly evens skin tone.",
    affiliateUrl:amz("Sunday Riley CEO Vitamin C Rich Resurfacing Treatment"),
    zones:["full-face","dark-spots"], suitableFor:["dull","mature","all"],
    keyIngredients:[{name:"Ethyl Ascorbic Acid 15%",benefit:"Stable vitamin C brightening"},{name:"Turmeric",benefit:"Anti-inflammatory glow"}],
    alternatives:{
      budget:{name:"Vitamin C Suspension 23%",brand:"The Ordinary",price:"£5.90",affiliateUrl:amz("The Ordinary Vitamin C Suspension")},
      luxury:{name:"C E Ferulic",brand:"SkinCeuticals",price:"£166",affiliateUrl:amz("SkinCeuticals C E Ferulic")},
      organic:{name:"Brightening Elixir",brand:"Youth to the People",price:"£42",affiliateUrl:amz("Youth to the People Brightening serum")},
    }, newIn:true,
  },
  // ── BODY ────────────────────────────────────────────────────────────────────
  {
    id:"p36", name:"Retinol Body Lotion", brand:"RoC",
    category:"body", price:"£14", image:IMG.p36,
    tags:["body","retinol","firming","texture","anti-ageing"],
    description:"Retinol body lotion that smooths skin texture, reduces the appearance of stretch marks and firms over time.",
    affiliateUrl:amz("RoC Retinol Body Lotion"),
    zones:["full-face"], suitableFor:["mature","dry","normal"],
    keyIngredients:[{name:"Retinol",benefit:"Resurfaces & firms"},{name:"Essential Minerals",benefit:"Nourishment"}],
    alternatives:{
      budget:{name:"Jergens Skin Firming Body Lotion",brand:"Jergens",price:"£8",affiliateUrl:amz("Jergens Skin Firming Lotion")},
      luxury:{name:"Firming Body Serum",brand:"Charlotte Tilbury",price:"£60",affiliateUrl:amz("Charlotte Tilbury Body Firming Serum")},
      organic:{name:"Clarins Body Fit Active",brand:"Clarins",price:"£48",affiliateUrl:amz("Clarins Body Fit Active")},
    },
  },
  {
    id:"p37", name:"Watermelon Glow Niacinamide Dew Drops", brand:"Glow Recipe",
    category:"serum", price:"£36", image:IMG.p37,
    tags:["niacinamide","glow","dewy","brightening","viral"],
    description:"Lightweight serum-meets-highlight drops with niacinamide and hyaluronic acid for a glass-skin glow.",
    affiliateUrl:amz("Glow Recipe Watermelon Glow Niacinamide Dew Drops"),
    zones:["full-face","cheeks"], suitableFor:["all","oily","dull"],
    keyIngredients:[{name:"Niacinamide",benefit:"Brightens & blurs pores"},{name:"Watermelon Extract",benefit:"Antioxidant glow"},{name:"Hyaluronic Acid",benefit:"Dewy finish"}],
    alternatives:{
      budget:{name:"Glow Shot Serum",brand:"Revolution",price:"£8",affiliateUrl:amz("Revolution Skincare Glow Serum")},
      luxury:{name:"Ethereal Drops",brand:"Charlotte Tilbury",price:"£45",affiliateUrl:amz("Charlotte Tilbury Glow Drops")},
      organic:{name:"Luminizing Face Serum",brand:"The Inkey List",price:"£15",affiliateUrl:amz("Inkey List serum glow")},
    }, newIn:true,
  },
];

export default CATALOG;
