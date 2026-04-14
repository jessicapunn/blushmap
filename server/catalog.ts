// ── BlushMap product catalog ──────────────────────────────────────────────────
// 100 top-rated makeup & skincare products
// Images: Cult Beauty CDN (static.thcdn.com) for confirmed products, else Unsplash/brand CDN

export interface Product {
  id: string; name: string; brand: string; category: string;
  tags: string[]; description: string; price: string;
  image: string; affiliateUrl: string;
  zones: string[]; suitableFor: string[];
  keyIngredients: { name: string; benefit: string }[];
  alternatives: { budget: AltProduct; luxury: AltProduct; organic: AltProduct };
  bestSeller?: boolean; newIn?: boolean;
  sponsored?: boolean; sponsorLabel?: string;
}

interface AltProduct { name: string; brand: string; price: string; affiliateUrl: string; }

// ── Awin Publisher ID: 2854395 ────────────────────────────────────────────────
const AWIN_PID = "2854395";
function awin(mid: string, url: string) {
  return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${AWIN_PID}&ued=${encodeURIComponent(url)}`;
}

const amz    = (q: string) => `https://www.amazon.co.uk/s?k=${encodeURIComponent(q)}&tag=blushmap-21`;
const lf     = (q: string) => awin("2082",  `https://www.lookfantastic.com/search?q=${encodeURIComponent(q)}`);
const cult   = (q: string) => awin("29063", `https://www.cultbeauty.co.uk/search?query=${encodeURIComponent(q)}`);
const boots  = (q: string) => awin("2041",  `https://www.boots.com/search?q=${encodeURIComponent(q)}`);
const ctLink = (q: string) => awin("13611", `https://www.charlottetilbury.com/uk/search?q=${encodeURIComponent(q)}`);
const sep    = (q: string) => awin("15718", `https://www.sephora.co.uk/search?q=${encodeURIComponent(q)}`);
const snk    = (q: string) => awin("59805", `https://www.spacenk.com/uk/search#q=${encodeURIComponent(q)}`);

// primary() — routes to highest-commission retailer per brand
function primary(brand: string, q: string): string {
  const b = brand.toLowerCase();
  if (b.includes("charlotte tilbury"))                                              return ctLink(q);
  if (["nars","mac","estée lauder","estee lauder","clinique","la prairie",
       "augustinus bader","sisley","tatcha","fresh","murad","kiehl",
       "sunday riley","medik8","elemis","clarins","lancôme"].some(x => b.includes(x))) return lf(q);
  if (["the ordinary","paula's choice","cerave","neutrogena","garnier",
       "simple","la roche-posay","ultrasun","drunk elephant",
       "roc","olay","revolution"].some(x => b.includes(x)))                        return boots(q);
  if (["rare beauty","fenty","kylie","too faced","urban decay",
       "huda","benefit","nyx"].some(x => b.includes(x)))                           return sep(q);
  return lf(q); // default: LOOKFANTASTIC
}

// ── Cult Beauty direct product links (confirmed) ──────────────────────────────
const cultDirect = (pid: string, url: string) => awin("29063", url);

export const CATALOG: Product[] = [

  // ════════════════════════════════════════════════════════════
  // MOISTURISERS (p1–p8)
  // ════════════════════════════════════════════════════════════

  {
    id: "p1", name: "Moisturising Cream 340g", brand: "CeraVe", category: "moisturiser",
    tags: ["hydration","barrier","ceramides","fragrance-free","sensitive"],
    description: "A dermatologist-developed moisturiser with three essential ceramides and hyaluronic acid. Restores and maintains the skin's natural protective barrier while delivering 24-hour hydration. MVE technology releases ingredients slowly throughout the day. Non-comedogenic and fragrance-free — the gold standard for sensitive, dry or compromised skin.",
    price: "£14.00",
    image: "https://static.thcdn.com/productimg/original/13187076-1905317607695014.jpg",
    affiliateUrl: boots("CeraVe Moisturising Cream"),
    zones: ["cheeks","forehead","chin","neck"],
    suitableFor: ["dry","sensitive","eczema-prone","all"],
    keyIngredients: [
      { name: "Ceramides 1, 3, 6-II", benefit: "Replenish and reinforce the skin barrier" },
      { name: "Hyaluronic Acid", benefit: "Draws moisture deep into the skin" },
      { name: "MVE Technology", benefit: "Controlled time-release of ingredients for 24hr hydration" }
    ],
    alternatives: {
      budget: { name: "Simple Kind to Skin Moisturiser", brand: "Simple", price: "£5.99", affiliateUrl: boots("Simple moisturiser") },
      luxury: { name: "Crème de la Mer", brand: "La Mer", price: "£185.00", affiliateUrl: lf("La Mer Creme de la Mer") },
      organic: { name: "Weleda Skin Food", brand: "Weleda", price: "£9.50", affiliateUrl: boots("Weleda Skin Food") }
    },
    bestSeller: true
  },

  {
    id: "p2", name: "Hydro Boost Water Gel", brand: "Neutrogena", category: "moisturiser",
    tags: ["hydration","gel","lightweight","oily-skin","oil-free"],
    description: "An ultra-lightweight gel moisturiser that instantly quenches skin and keeps it hydrated all day. Its hyaluronic acid gel matrix retains water and releases it slowly to continuously hydrate throughout the day. Oil-free, non-comedogenic and absorbs instantly — perfect for oily or combination skin.",
    price: "£13.99",
    image: "https://static.thcdn.com/productimg/original/11433774-1995319455128950.jpg",
    affiliateUrl: boots("Neutrogena Hydro Boost Water Gel"),
    zones: ["cheeks","forehead","t-zone"],
    suitableFor: ["oily","combination","normal"],
    keyIngredients: [
      { name: "Hyaluronic Acid", benefit: "Hydrates and plumps without greasiness" },
      { name: "Glycerin", benefit: "Draws moisture to the skin surface" }
    ],
    alternatives: {
      budget: { name: "Hydrating Toner 200ml", brand: "The Ordinary", price: "£7.90", affiliateUrl: boots("The Ordinary Hyaluronic Acid Toner") },
      luxury: { name: "Dynamic Skin Recovery SPF50", brand: "Dermalogica", price: "£89.00", affiliateUrl: lf("Dermalogica Dynamic Skin Recovery SPF50") },
      organic: { name: "Aloe Vera Gel", brand: "Hollowed Lands", price: "£8.00", affiliateUrl: amz("organic aloe vera gel face") }
    }
  },

  {
    id: "p3", name: "Water Cream 50ml", brand: "Tatcha", category: "moisturiser",
    tags: ["hydration","pore-refining","oil-control","luxury","japanese"],
    description: "An oil-free, water-based moisturiser inspired by Japanese beauty rituals. Contains wild rose, leopard lily and hadasei-3 — a trio of anti-ageing superfoods. Melts instantly into skin, visibly minimising pores and controlling oil for up to 8 hours. A cult favourite for that blurred, filter-like finish.",
    price: "£74.00",
    image: "https://static.thcdn.com/productimg/original/14979949-1015325096703413.jpg",
    affiliateUrl: snk("Tatcha Water Cream"),
    zones: ["t-zone","forehead","cheeks"],
    suitableFor: ["oily","combination","normal"],
    keyIngredients: [
      { name: "Hadasei-3", benefit: "Japanese anti-ageing superfood complex" },
      { name: "Wild Rose", benefit: "Brightens and evens skin tone" },
      { name: "Leopard Lily", benefit: "Controls excess sebum production" }
    ],
    alternatives: {
      budget: { name: "Hydro Boost Water Gel", brand: "Neutrogena", price: "£13.99", affiliateUrl: boots("Neutrogena Hydro Boost") },
      luxury: { name: "Immortelle Precious Cream", brand: "L'Occitane", price: "£105.00", affiliateUrl: lf("L Occitane Immortelle Precious Cream") },
      organic: { name: "Youth Dew Concentrate", brand: "Pai Skincare", price: "£52.00", affiliateUrl: lf("Pai Skincare Youth Dew") }
    }
  },

  {
    id: "p4", name: "Lala Retro Whipped Moisturiser 50ml", brand: "Drunk Elephant", category: "moisturiser",
    tags: ["hydration","ceramides","barrier","luxury","nourishing"],
    description: "A rich yet non-greasy moisturiser packed with six ceramides, omega fatty acids and antioxidants. Restores the skin barrier, reduces redness and delivers intense nourishment. The whipped formula melts on contact, suitable for dry and very dry skin types. Free from silicone, essential oils and fragrance.",
    price: "£58.00",
    image: "https://static.thcdn.com/productimg/original/13310264-8115189032581051.jpg",
    affiliateUrl: cultDirect("13310264", "https://www.cultbeauty.co.uk/p/drunk-elephant-lala-retro-ceramide-face-moisturiser-50ml/13310264/"),
    zones: ["cheeks","jaw","neck","décolletage"],
    suitableFor: ["dry","very-dry","mature","sensitive"],
    keyIngredients: [
      { name: "Ceramide Complex (6 types)", benefit: "Rebuilds and reinforces the lipid barrier" },
      { name: "Omega Fatty Acids", benefit: "Deep nourishment and suppleness" },
      { name: "Pygmy Waterlily", benefit: "Antioxidant protection against environmental stress" }
    ],
    alternatives: {
      budget: { name: "Moisturising Cream", brand: "CeraVe", price: "£14.00", affiliateUrl: boots("CeraVe Moisturising Cream") },
      luxury: { name: "Augustinus Bader The Rich Cream", brand: "Augustinus Bader", price: "£265.00", affiliateUrl: lf("Augustinus Bader The Rich Cream") },
      organic: { name: "Organic Rosehip Seed Oil", brand: "Trilogy", price: "£24.00", affiliateUrl: boots("Trilogy Rosehip Oil") }
    },
    bestSeller: true
  },

  {
    id: "p4b", name: "Magic Cream 50ml", brand: "Charlotte Tilbury", category: "moisturiser",
    tags: ["luxury","anti-ageing","glow","hydration","plumping"],
    description: "The iconic backstage secret of supermodels and Hollywood stars. This award-winning moisturiser is infused with vitamins C and E, hyaluronic acid and peptides to plump, firm and illuminate skin in 10 seconds. Worn alone or under makeup, it creates that signature Charlotte Tilbury radiant glow. Eight innovative skincare technologies in one pot.",
    price: "£79.00",
    image: "https://static.thcdn.com/productimg/original/17638977-8095316825438462.jpg",
    affiliateUrl: cultDirect("17638977", "https://www.cultbeauty.co.uk/p/charlotte-tilbury-charlotte-s-magic-cream-2026-50ml/17638977/"),
    zones: ["full-face","neck","décolletage"],
    suitableFor: ["all","dry","mature","dull"],
    keyIngredients: [
      { name: "Hyaluronic Acid Complex", benefit: "Multi-depth hydration and plumping" },
      { name: "Vitamin C & E", benefit: "Brightening antioxidant protection" },
      { name: "Magic Matrix Peptides", benefit: "Firms and tightens over time" }
    ],
    alternatives: {
      budget: { name: "Olay Regenerist Microsculpting Cream", brand: "Olay", price: "£22.99", affiliateUrl: boots("Olay Regenerist Moisturiser") },
      luxury: { name: "La Prairie Skin Caviar Luxe Cream", brand: "La Prairie", price: "£450.00", affiliateUrl: lf("La Prairie Skin Caviar Luxe Cream") },
      organic: { name: "Organic Facial Oil No.7", brand: "REN Clean Skincare", price: "£44.00", affiliateUrl: lf("REN Clean Skincare Facial Oil") }
    },
    bestSeller: true, sponsored: true, sponsorLabel: "Charlotte Tilbury"
  },

  {
    id: "p4c", name: "The Rich Cream 50ml", brand: "Augustinus Bader", category: "moisturiser",
    tags: ["luxury","anti-ageing","regenerative","TFC8","healing"],
    description: "Developed by Professor Augustinus Bader, a world-renowned expert in stem cell biology. Powered by TFC8 technology, this luxurious cream directs the skin's own repair mechanisms to restore youthfulness. Clinical studies show visible reduction in fine lines in 4 weeks. The pinnacle of science-led skincare.",
    price: "£265.00",
    image: "https://static.thcdn.com/productimg/original/13315097-1065322014262339.jpg",
    affiliateUrl: lf("Augustinus Bader The Rich Cream"),
    zones: ["full-face","neck"],
    suitableFor: ["mature","dry","all"],
    keyIngredients: [
      { name: "TFC8 Technology", benefit: "Triggers skin's own regenerative processes" },
      { name: "Urea", benefit: "Binds moisture and softens the skin" },
      { name: "Vitamins B, C & E", benefit: "Antioxidant protection and brightening" }
    ],
    alternatives: {
      budget: { name: "Lala Retro Whipped Moisturiser", brand: "Drunk Elephant", price: "£58.00", affiliateUrl: cult("Drunk Elephant Lala Retro") },
      luxury: { name: "Revitalizing Supreme+", brand: "Estée Lauder", price: "£125.00", affiliateUrl: lf("Estee Lauder Revitalizing Supreme") },
      organic: { name: "Wild Rose Beauty Balm", brand: "Dr. Hauschka", price: "£38.00", affiliateUrl: boots("Dr Hauschka Wild Rose Beauty Balm") }
    },
    newIn: false
  },

  {
    id: "p4d", name: "Clearly Corrective Dark Spot Correcting Glow Moisturiser", brand: "Kiehl's", category: "moisturiser",
    tags: ["brightening","dark-spots","SPF","vitamin-c","glow"],
    description: "A dual-action moisturiser that hydrates and visibly corrects dark spots simultaneously. Fortified with activated vitamin C and activated C-Activator at 10% total concentration — clinically proven to reduce the look of dark spots in 4 weeks. SPF 30 ensures daily protection. Lightweight texture suitable for all skin tones.",
    price: "£49.00",
    image: "https://static.thcdn.com/productimg/original/12916133-1174853889600705.jpg",
    affiliateUrl: lf("Kiehls Clearly Corrective Dark Spot Moisturiser"),
    zones: ["cheeks","forehead","t-zone"],
    suitableFor: ["all","combination","normal","dull"],
    keyIngredients: [
      { name: "Activated Vitamin C 10%", benefit: "Visibly reduces dark spots and uneven tone" },
      { name: "White Birch Extract", benefit: "Brightens and evens complexion" },
      { name: "SPF 30", benefit: "Broad-spectrum UV protection" }
    ],
    alternatives: {
      budget: { name: "Vitamin C Daily Brightening Solution", brand: "The Ordinary", price: "£8.90", affiliateUrl: boots("The Ordinary Vitamin C") },
      luxury: { name: "C E Ferulic Serum", brand: "SkinCeuticals", price: "£166.00", affiliateUrl: lf("SkinCeuticals CE Ferulic") },
      organic: { name: "C+ Corrective Complex", brand: "Pai Skincare", price: "£39.00", affiliateUrl: lf("Pai Skincare C Corrective") }
    }
  },

  {
    id: "p4e", name: "Super Fluid Daily Defence SPF50+ 40ml", brand: "Murad", category: "moisturiser",
    tags: ["SPF","lightweight","oil-control","blue-light","anti-pollution"],
    description: "A feather-light, oil-free daily moisturiser with broad-spectrum SPF50+ protection. Shields against UVA, UVB, blue light and pollution — the four main causes of premature ageing. The invisible finish wears beautifully under makeup and won't clog pores. Dermatologist-tested for sensitive skin.",
    price: "£60.00",
    image: "https://static.thcdn.com/productimg/original/12564736-1275172214262106.jpg",
    affiliateUrl: lf("Murad Super Fluid Daily Defence SPF50"),
    zones: ["full-face","neck"],
    suitableFor: ["oily","combination","sensitive","all"],
    keyIngredients: [
      { name: "Broad-Spectrum SPF50+", benefit: "Blocks UVA and UVB rays" },
      { name: "Blue Light Filter", benefit: "Shields from digital device radiation" },
      { name: "Licorice Root Extract", benefit: "Calms inflammation and brightens" }
    ],
    alternatives: {
      budget: { name: "Anthelios UVMune 400 SPF50+", brand: "La Roche-Posay", price: "£20.00", affiliateUrl: boots("La Roche-Posay Anthelios") },
      luxury: { name: "Invisible Sun Veil SPF50+", brand: "Sisley", price: "£110.00", affiliateUrl: lf("Sisley Invisible Sun Veil") },
      organic: { name: "Antioxidant Superfluid SPF30", brand: "Pai Skincare", price: "£39.00", affiliateUrl: lf("Pai SPF30") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // SERUMS (p5–p8, p5b–p5e)
  // ════════════════════════════════════════════════════════════

  {
    id: "p5", name: "Niacinamide 10% + Zinc 1% 30ml", brand: "The Ordinary", category: "serum",
    tags: ["pores","oil-control","brightening","niacinamide","budget"],
    description: "The cult serum that made high-performance skincare accessible to all. A high-strength 10% niacinamide formula with zinc PCA visibly minimises pores, reduces blemishes and regulates sebum production. Improves uneven skin tone and texture over 4–8 weeks of consistent use. Fragrance-free and vegan.",
    price: "£5.00",
    image: "https://static.thcdn.com/productimg/original/13187076-1075328241433880.jpg",
    affiliateUrl: cultDirect("13187076", "https://www.cultbeauty.co.uk/p/the-ordinary-niacinamide-10-zinc-1-serum-30ml/13187076/"),
    zones: ["t-zone","forehead","nose","chin"],
    suitableFor: ["oily","combination","blemish-prone","normal"],
    keyIngredients: [
      { name: "Niacinamide 10%", benefit: "Minimises pores and regulates oil production" },
      { name: "Zinc PCA 1%", benefit: "Reduces sebum, calms blemishes" }
    ],
    alternatives: {
      budget: { name: "Niacinamide Serum", brand: "Inkey List", price: "£6.99", affiliateUrl: cult("Inkey List Niacinamide") },
      luxury: { name: "Pore Minimising Booster", brand: "Paula's Choice", price: "£42.00", affiliateUrl: boots("Paula's Choice Pore Minimising Booster") },
      organic: { name: "Willow Bark Blemish Serum", brand: "Pai Skincare", price: "£35.00", affiliateUrl: lf("Pai Skincare Willow Bark") }
    },
    bestSeller: true
  },

  {
    id: "p6", name: "C E Ferulic Serum 30ml", brand: "SkinCeuticals", category: "serum",
    tags: ["vitamin-c","antioxidant","brightening","anti-ageing","luxury"],
    description: "The gold standard of vitamin C serums — clinically proven and dermatologist-endorsed globally. A patented combination of 15% pure vitamin C, 1% vitamin E and 0.5% ferulic acid provides eight times the natural photoprotection of untreated skin. Visibly brightens, firms and reduces the appearance of fine lines and wrinkles. A true skincare investment.",
    price: "£166.00",
    image: "https://static.thcdn.com/productimg/original/11705727-4725323826126148.jpg",
    affiliateUrl: lf("SkinCeuticals C E Ferulic Serum"),
    zones: ["full-face","neck","décolletage"],
    suitableFor: ["normal","dry","mature","all"],
    keyIngredients: [
      { name: "Vitamin C 15%", benefit: "Powerful brightening and antioxidant protection" },
      { name: "Vitamin E 1%", benefit: "Neutralises free radicals" },
      { name: "Ferulic Acid 0.5%", benefit: "Amplifies effectiveness of vitamins C and E" }
    ],
    alternatives: {
      budget: { name: "CEO Vitamin C Serum", brand: "Sunday Riley", price: "£85.00", affiliateUrl: lf("Sunday Riley CEO Vitamin C") },
      luxury: { name: "Bright Skin Serum", brand: "La Prairie", price: "£380.00", affiliateUrl: lf("La Prairie Bright Skin Serum") },
      organic: { name: "C+ Corrective Complex 20%", brand: "Pai Skincare", price: "£39.00", affiliateUrl: lf("Pai C Corrective Complex") }
    }
  },

  {
    id: "p8", name: "Advanced Night Repair Serum 50ml", brand: "Estée Lauder", category: "serum",
    tags: ["anti-ageing","repair","hyaluronic-acid","night","classic"],
    description: "The iconic ANR serum, trusted for over 40 years. Powered by Chronolux Power Signal Technology and hyaluronic acid, it synchronises with the skin's natural night-time repair rhythms. Visibly reduces the look of multiple signs of ageing — lines, wrinkles and uneven tone — in as little as four weeks. Suitable for all skin types and skin tones.",
    price: "£100.00",
    image: "https://static.thcdn.com/productimg/original/13924834-1784976743956681.jpg",
    affiliateUrl: lf("Estee Lauder Advanced Night Repair Serum"),
    zones: ["full-face","neck"],
    suitableFor: ["all","mature","dry","normal"],
    keyIngredients: [
      { name: "Chronolux Power Signal Technology", benefit: "Amplifies skin's natural nighttime renewal" },
      { name: "Hyaluronic Acid Complex", benefit: "Intense hydration and plumping" },
      { name: "Bifidus Extract", benefit: "Strengthens skin barrier and defences" }
    ],
    alternatives: {
      budget: { name: "Buffet Multi-Technology Peptide Serum", brand: "The Ordinary", price: "£15.90", affiliateUrl: cult("The Ordinary Buffet") },
      luxury: { name: "Midnight Recovery Concentrate", brand: "Kiehl's", price: "£51.00", affiliateUrl: lf("Kiehls Midnight Recovery Concentrate") },
      organic: { name: "Rosehip BioRegenerate Oil", brand: "REN Clean Skincare", price: "£38.00", affiliateUrl: lf("REN Rosehip Oil") }
    },
    bestSeller: true
  },

  {
    id: "p5b", name: "Hyaluronic Acid 2% + B5 Serum 30ml", brand: "The Ordinary", category: "serum",
    tags: ["hydration","plumping","hyaluronic-acid","budget","all-skin"],
    description: "A multi-molecular weight hyaluronic acid serum that delivers surface and deep hydration simultaneously. Combined with vitamin B5 (panthenol) to improve moisture retention and support barrier function. Fragrance-free, vegan and suitable for all skin types. Layer under moisturiser for maximum plumping effect.",
    price: "£7.90",
    image: "https://static.thcdn.com/productimg/original/15061690-1585328238824312.jpg",
    affiliateUrl: boots("The Ordinary Hyaluronic Acid 2% B5"),
    zones: ["full-face"],
    suitableFor: ["all","dry","dehydrated","sensitive"],
    keyIngredients: [
      { name: "Hyaluronic Acid (3 weights)", benefit: "Deep, surface and binding hydration" },
      { name: "Vitamin B5", benefit: "Improves moisture retention and barrier function" }
    ],
    alternatives: {
      budget: { name: "Hydrating Serum", brand: "Revolution Skincare", price: "£5.00", affiliateUrl: boots("Revolution Skincare Hyaluronic Acid Serum") },
      luxury: { name: "Pro-Filler Serum", brand: "Clarins", price: "£75.00", affiliateUrl: lf("Clarins Pro Filler Serum") },
      organic: { name: "Hydra Vit C Serum", brand: "OSEA", price: "£52.00", affiliateUrl: amz("OSEA Hydra Vit C Serum") }
    }
  },

  {
    id: "p5c", name: "Retinol 0.2% in Squalane 30ml", brand: "The Ordinary", category: "serum",
    tags: ["retinol","anti-ageing","renewal","beginner","budget"],
    description: "An accessible entry point into retinol for beginners. Suspended in squalane — a lightweight, skin-identical oil — to minimise irritation while delivering proven anti-ageing benefits. At 0.2%, this is the ideal starting concentration: effective enough to stimulate cell turnover without the dryness and flaking of higher-strength formulas.",
    price: "£8.00",
    image: "https://static.thcdn.com/productimg/original/11638501-1665328246956931.jpg",
    affiliateUrl: boots("The Ordinary Retinol Squalane"),
    zones: ["full-face","neck"],
    suitableFor: ["all","normal","mature","beginners"],
    keyIngredients: [
      { name: "Retinol 0.2%", benefit: "Stimulates cell turnover and collagen production" },
      { name: "Squalane", benefit: "Buffers irritation, leaves skin supple" }
    ],
    alternatives: {
      budget: { name: "Retinol Serum", brand: "Inkey List", price: "£9.99", affiliateUrl: cult("Inkey List Retinol") },
      luxury: { name: "A-Passioni Retinol Cream", brand: "Drunk Elephant", price: "£68.00", affiliateUrl: cult("Drunk Elephant A-Passioni") },
      organic: { name: "Bakuchiol Reface Pads", brand: "Pai Skincare", price: "£42.00", affiliateUrl: lf("Pai Bakuchiol Pads") }
    }
  },

  {
    id: "p18", name: "Snail Mucin 96% Power Repairing Essence 100ml", brand: "COSRX", category: "serum",
    tags: ["snail","repair","hydration","K-beauty","soothing"],
    description: "A K-beauty hero essence that has earned global cult status. A concentrated 96% snail secretion filtrate delivers intense hydration, speeds skin repair and fades blemish marks. The lightweight, water-like texture layers seamlessly under moisturiser. Ideal after extractions, skin trauma or to maintain a smooth, glass-skin appearance.",
    price: "£22.00",
    image: "https://static.thcdn.com/productimg/original/11401174-1415322543059229.jpg",
    affiliateUrl: boots("COSRX Snail Mucin 96% Essence"),
    zones: ["full-face"],
    suitableFor: ["all","blemish-prone","dry","sensitive"],
    keyIngredients: [
      { name: "Snail Secretion Filtrate 96%", benefit: "Repairs, hydrates and fades pigmentation" },
      { name: "Betaine", benefit: "Moisturises and protects the skin" }
    ],
    alternatives: {
      budget: { name: "Skin1004 Snail Essence", brand: "Skin1004", price: "£12.00", affiliateUrl: amz("Skin1004 Snail Essence") },
      luxury: { name: "Crème de La Mer", brand: "La Mer", price: "£185.00", affiliateUrl: lf("La Mer Creme") },
      organic: { name: "Bakuchiol Booster", brand: "Herbivore", price: "£38.00", affiliateUrl: amz("Herbivore Bakuchiol Booster") }
    }
  },

  {
    id: "p35", name: "CEO Vitamin C Rich Resurfacing Treatment", brand: "Sunday Riley", category: "serum",
    tags: ["vitamin-c","brightening","resurfacing","glow","luxury"],
    description: "A high-potency vitamin C serum featuring 15% stable vitamin C complex (THD ascorbate) combined with lactic acid for a dual brightening and resurfacing effect. THD ascorbate is oil-soluble, penetrating deeper into skin than water-soluble forms. Visibly reduces dark spots, evens tone and boosts collagen production. Bright, glassy skin in weeks.",
    price: "£85.00",
    image: "https://static.thcdn.com/productimg/original/11588282-5745191359166704.jpg",
    affiliateUrl: lf("Sunday Riley CEO Vitamin C Serum"),
    zones: ["full-face","neck"],
    suitableFor: ["all","dull","hyperpigmentation","mature"],
    keyIngredients: [
      { name: "THD Ascorbate 15%", benefit: "Stable, oil-soluble vitamin C for deep brightening" },
      { name: "Lactic Acid", benefit: "Gentle resurfacing and tone-evening" },
      { name: "Turmeric", benefit: "Anti-inflammatory and antioxidant" }
    ],
    alternatives: {
      budget: { name: "Ascorbyl Glucoside Solution 12%", brand: "The Ordinary", price: "£12.50", affiliateUrl: boots("The Ordinary Ascorbyl Glucoside") },
      luxury: { name: "C E Ferulic Serum", brand: "SkinCeuticals", price: "£166.00", affiliateUrl: lf("SkinCeuticals CE Ferulic") },
      organic: { name: "Vitamin C Serum", brand: "Medik8", price: "£55.00", affiliateUrl: lf("Medik8 Vitamin C Serum") }
    }
  },

  {
    id: "p37", name: "Watermelon Glow Niacinamide Dew Drops 15ml", brand: "Glow Recipe", category: "serum",
    tags: ["niacinamide","hydration","glow","hyaluronic-acid","dewy"],
    description: "A triple-action serum-essence hybrid that blurs, hydrates and shields simultaneously. Watermelon extract, niacinamide and hyaluronic acid combine to deliver a dewy, lit-from-within complexion. The gel-serum texture sits beautifully under makeup or alone for a glassy, glass-skin finish. Vegan and cruelty-free.",
    price: "£32.00",
    image: "https://static.thcdn.com/productimg/original/16777061-9505323571298789.jpg",
    affiliateUrl: cult("Glow Recipe Watermelon Dew Drops"),
    zones: ["full-face"],
    suitableFor: ["oily","combination","dull","all"],
    keyIngredients: [
      { name: "Niacinamide", benefit: "Minimises pores and balances oil" },
      { name: "Watermelon Extract", benefit: "Soothes and provides antioxidant protection" },
      { name: "Hyaluronic Acid", benefit: "Hydrates and plumps" }
    ],
    alternatives: {
      budget: { name: "Niacinamide 10% + Zinc 1%", brand: "The Ordinary", price: "£5.00", affiliateUrl: boots("The Ordinary Niacinamide") },
      luxury: { name: "Phloretin CF Serum", brand: "SkinCeuticals", price: "£160.00", affiliateUrl: lf("SkinCeuticals Phloretin CF") },
      organic: { name: "Sea Buckthorn Oil", brand: "Pai Skincare", price: "£34.00", affiliateUrl: lf("Pai Sea Buckthorn Oil") }
    }
  },

  {
    id: "p5d", name: "Peptide Moisturiser PM Treatment", brand: "RoC", category: "serum",
    tags: ["peptides","anti-ageing","firmness","collagen","budget"],
    description: "A clinically-proven formula delivering visible anti-ageing results in 12 weeks. Multi-peptide complex stimulates collagen production and improves skin elasticity. Night-use formula maximises the skin's natural repair window. Fragrance-free and suitable for sensitive skin — excellent value for a peptide-based treatment.",
    price: "£24.99",
    image: "https://static.thcdn.com/productimg/original/13447853-1865318444474448.jpg",
    affiliateUrl: boots("RoC Retinol Correxion Serum"),
    zones: ["full-face","neck"],
    suitableFor: ["mature","dry","sensitive","all"],
    keyIngredients: [
      { name: "Multi-Peptide Complex", benefit: "Stimulates collagen synthesis" },
      { name: "Retinol", benefit: "Resurfaces and smooths fine lines" }
    ],
    alternatives: {
      budget: { name: "Multi-Peptide + HA Serum", brand: "The Ordinary", price: "£14.20", affiliateUrl: boots("The Ordinary Multi-Peptide") },
      luxury: { name: "SmartTargeting Moisturiser", brand: "La Mer", price: "£160.00", affiliateUrl: lf("La Mer Moisturizer") },
      organic: { name: "Youth Activating Oil", brand: "Pai Skincare", price: "£44.00", affiliateUrl: lf("Pai Youth Activating Oil") }
    }
  },

  {
    id: "p5e", name: "Midnight Recovery Concentrate 30ml", brand: "Kiehl's", category: "serum",
    tags: ["night-oil","repair","lavender","anti-ageing","restoring"],
    description: "A nightly facial oil that works with the skin's biological repair process to dramatically restore skin's appearance by morning. Squalane and evening primrose oil replenish lipids while lavender essential oil provides a calming, sleep-inducing scent. Skin appears visibly smoother, firmer and radiant after just one night.",
    price: "£51.00",
    image: "https://static.thcdn.com/productimg/original/12916110-1244853890914849.jpg",
    affiliateUrl: lf("Kiehls Midnight Recovery Concentrate"),
    zones: ["full-face","neck"],
    suitableFor: ["dry","mature","dull","normal"],
    keyIngredients: [
      { name: "Evening Primrose Oil", benefit: "Rich in omega-6 fatty acids for deep nourishment" },
      { name: "Squalane", benefit: "Locks in moisture and restores suppleness" },
      { name: "Lavender Essential Oil", benefit: "Calming and antioxidant" }
    ],
    alternatives: {
      budget: { name: "Rosehip Seed Oil", brand: "The Ordinary", price: "£10.00", affiliateUrl: boots("The Ordinary Rosehip Oil") },
      luxury: { name: "Midnight Recovery Omega Rich Cloud Cream", brand: "Kiehl's", price: "£62.00", affiliateUrl: lf("Kiehls Midnight Recovery Cream") },
      organic: { name: "Organic Rosehip Oil", brand: "Trilogy", price: "£24.00", affiliateUrl: boots("Trilogy Rosehip Oil") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // SPF / TINTED SPF (p9–p11)
  // ════════════════════════════════════════════════════════════

  {
    id: "p9", name: "Anthelios UVMune 400 Invisible Fluid SPF50+ 50ml", brand: "La Roche-Posay", category: "spf",
    tags: ["SPF50+","UV","anti-ageing","invisible","daily"],
    description: "Award-winning next-generation sun protection featuring patented Mexoryl 400 technology — the first filter proven to block ultra-long UVA rays linked to photoageing. Ultra-light fluid formula with no white cast, suitable for all skin tones. Tested on post-procedure and sensitive skin. The benchmark for daily facial sun protection.",
    price: "£20.00",
    image: "https://static.thcdn.com/productimg/original/13494906-3035227179966603.jpg",
    affiliateUrl: boots("La Roche-Posay Anthelios UVMune 400"),
    zones: ["full-face","neck"],
    suitableFor: ["all","sensitive","post-procedure","mature"],
    keyIngredients: [
      { name: "Mexoryl 400", benefit: "Blocks ultra-long UVA rays causing photoageing" },
      { name: "Tinosorb M & S", benefit: "Broad-spectrum UVA/UVB filter combination" }
    ],
    alternatives: {
      budget: { name: "Hydro Boost Water Gel Lotion SPF30", brand: "Neutrogena", price: "£12.99", affiliateUrl: boots("Neutrogena Hydro Boost SPF") },
      luxury: { name: "Urban Environment UV Protection Cream SPF50", brand: "Shiseido", price: "£44.00", affiliateUrl: lf("Shiseido Urban Environment SPF50") },
      organic: { name: "Antioxidant Superfluid SPF30", brand: "Pai Skincare", price: "£39.00", affiliateUrl: lf("Pai Skincare SPF") }
    },
    bestSeller: true
  },

  {
    id: "p10", name: "Face Sun Lotion SPF50 40ml", brand: "Ultrasun", category: "spf",
    tags: ["SPF50","once-a-day","anti-pigmentation","sensitive","no-white-cast"],
    description: "A once-a-day SPF50 that provides up to 12 hours of protection. Unique formula prevents photostimulation of melanin, making it ideal for those prone to pigmentation and melasma. Doubles as an anti-ageing treatment with antioxidants to combat free-radical damage. No perfume, preservatives or emulsifiers.",
    price: "£23.50",
    image: "https://static.thcdn.com/productimg/original/12461159-1834934544073998.jpg",
    affiliateUrl: boots("Ultrasun Face SPF50"),
    zones: ["full-face"],
    suitableFor: ["sensitive","hyperpigmentation","all","mature"],
    keyIngredients: [
      { name: "Broad-Spectrum SPF50 Filters", benefit: "Comprehensive UVA/UVB protection" },
      { name: "Anti-Pigmentation Complex", benefit: "Prevents melanin stimulation by UV" }
    ],
    alternatives: {
      budget: { name: "SPF30 Daily Moisturiser", brand: "Simple", price: "£7.99", affiliateUrl: boots("Simple SPF30 Moisturiser") },
      luxury: { name: "Super Screen Daily Moisturiser SPF40", brand: "Paula's Choice", price: "£39.00", affiliateUrl: boots("Paula's Choice Super Screen SPF40") },
      organic: { name: "Green Screen SPF30", brand: "Aether Beauty", price: "£36.00", affiliateUrl: amz("Aether Beauty SPF30") }
    }
  },

  {
    id: "p11", name: "Anthelios Tinted Mineral Ultra-Light Fluid SPF50+", brand: "La Roche-Posay", category: "tinted-spf",
    tags: ["tinted","SPF50+","mineral","coverage","sensitive"],
    description: "A tinted mineral sunscreen that acts as a lightweight, buildable BB cream. Iron oxides provide visible light protection (important for hyperpigmentation sufferers) while a sheer tint evening and adds a subtle glow. Reef-safe mineral formula suitable for the most sensitive and reactive skin.",
    price: "£22.00",
    image: "https://static.thcdn.com/productimg/original/13494908-8634932952103553.jpg",
    affiliateUrl: boots("La Roche-Posay Anthelios Tinted SPF50+"),
    zones: ["full-face"],
    suitableFor: ["sensitive","hyperpigmentation","rosacea","all"],
    keyIngredients: [
      { name: "Titanium Dioxide", benefit: "Physical broad-spectrum UV blocker" },
      { name: "Iron Oxides", benefit: "Provides visible light protection and tint" }
    ],
    alternatives: {
      budget: { name: "CC Cream SPF50+", brand: "IT Cosmetics", price: "£14.99", affiliateUrl: boots("IT Cosmetics CC Cream SPF50") },
      luxury: { name: "Tone Up Honey Mist SPF50+", brand: "Laneige", price: "£38.00", affiliateUrl: sep("Laneige Tone Up Honey Mist") },
      organic: { name: "Mineral Sunscreen SPF50", brand: "Drunk Elephant", price: "£38.00", affiliateUrl: cult("Drunk Elephant Umbra Tinte SPF30") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // FOUNDATION (p12–p14)
  // ════════════════════════════════════════════════════════════

  {
    id: "p12", name: "Airbrush Flawless Foundation 30ml", brand: "Charlotte Tilbury", category: "foundation",
    tags: ["full-coverage","long-wear","airbrush","buildable","luxury"],
    description: "Charlotte Tilbury's bestselling foundation, worn on red carpets worldwide. A weightless liquid formula that delivers flawless, full-coverage results in one layer — adapting to your skin to smooth texture and conceal imperfections. Sweat-proof and humidity-proof. Available in 44 shades to suit every complexion from lightest to deepest.",
    price: "£36.00",
    image: "https://static.thcdn.com/productimg/original/17767851-2075323330736925.jpg",
    affiliateUrl: ctLink("Airbrush Flawless Foundation"),
    zones: ["full-face"],
    suitableFor: ["all","combination","oily","normal"],
    keyIngredients: [
      { name: "Micro-Correcting Sphere Powder", benefit: "Blurs pores and imperfections" },
      { name: "Vitamin E", benefit: "Antioxidant protection and skin conditioning" }
    ],
    alternatives: {
      budget: { name: "Fit Me Matte + Poreless Foundation", brand: "Maybelline", price: "£11.99", affiliateUrl: boots("Maybelline Fit Me Foundation") },
      luxury: { name: "Armani Luminous Silk Foundation", brand: "Giorgio Armani", price: "£47.00", affiliateUrl: lf("Giorgio Armani Luminous Silk Foundation") },
      organic: { name: "Skin Tint SPF30", brand: "ILIA", price: "£48.00", affiliateUrl: sep("ILIA Skin Tint") }
    },
    bestSeller: true, sponsored: true, sponsorLabel: "Charlotte Tilbury"
  },

  {
    id: "p13", name: "Natural Radiant Longwear Foundation 30ml", brand: "NARS", category: "foundation",
    tags: ["medium-coverage","radiant","long-wear","buildable","glow"],
    description: "A medium-to-full coverage foundation with a luminous, natural finish that mimics your skin at its very best. Buildable coverage stays fresh for up to 16 hours. Hyaluronic acid and vitamin E keep skin hydrated throughout the day. Available in 45 shades. The cult choice of makeup artists for a photogenic, skin-perfecting result.",
    price: "£43.50",
    image: "https://static.thcdn.com/productimg/original/11640950-1525231269628658.jpg",
    affiliateUrl: cultDirect("11640948", "https://www.cultbeauty.co.uk/p/nars-natural-radiant-longwear-foundation-various-shades/11640948/"),
    zones: ["full-face"],
    suitableFor: ["normal","dry","combination","all"],
    keyIngredients: [
      { name: "Hyaluronic Acid", benefit: "Keeps skin hydrated during wear" },
      { name: "Vitamin E", benefit: "Conditions and protects" },
      { name: "Photo-Optimising Complex", benefit: "Optimises colour accuracy in all lighting" }
    ],
    alternatives: {
      budget: { name: "True Match Foundation", brand: "L'Oréal Paris", price: "£12.99", affiliateUrl: boots("L'Oreal Paris True Match Foundation") },
      luxury: { name: "Estée Lauder Double Wear Foundation", brand: "Estée Lauder", price: "£46.00", affiliateUrl: lf("Estee Lauder Double Wear Foundation") },
      organic: { name: "True Skin Serum Foundation", brand: "ILIA", price: "£49.00", affiliateUrl: sep("ILIA True Skin Foundation") }
    }
  },

  {
    id: "p14", name: "Pro Filt'r Soft-Matte Longwear Foundation 32ml", brand: "Fenty Beauty", category: "foundation",
    tags: ["matte","full-coverage","long-wear","inclusive","diverse-shades"],
    description: "The foundation that changed the industry. 50 shades launched on day one — Rihanna's commitment to inclusivity that forced every beauty brand to expand shade ranges. A soft-matte formula that controls shine and covers imperfections without looking cakey. Sweat-proof, transfer-proof and comfortable for 24 hours.",
    price: "£35.00",
    image: "https://static.thcdn.com/productimg/original/15654354-2895210265210993.jpg",
    affiliateUrl: cultDirect("15654346", "https://www.cultbeauty.co.uk/p/fenty-beauty-pro-filt-r-soft-matte-longwear-foundation-32ml-various-shades/15654346/"),
    zones: ["full-face"],
    suitableFor: ["oily","combination","all","darker-tones"],
    keyIngredients: [
      { name: "Comfort Flex Technology", benefit: "Foundation flexes and moves with skin" },
      { name: "Vitamin E", benefit: "Antioxidant conditioning" }
    ],
    alternatives: {
      budget: { name: "Fit Me Matte + Poreless", brand: "Maybelline", price: "£11.99", affiliateUrl: boots("Maybelline Fit Me Matte Foundation") },
      luxury: { name: "Airbrush Flawless Foundation", brand: "Charlotte Tilbury", price: "£36.00", affiliateUrl: ctLink("Airbrush Flawless Foundation") },
      organic: { name: "BB Tinted Moisturiser SPF30", brand: "bareMinerals", price: "£34.00", affiliateUrl: lf("bareMinerals BB Tinted Moisturiser") }
    },
    bestSeller: true
  },

  {
    id: "p12b", name: "Double Wear Stay-in-Place Foundation 30ml", brand: "Estée Lauder", category: "foundation",
    tags: ["full-coverage","24-hour","matte","long-wear","classic"],
    description: "The beauty industry's most award-winning foundation. A 24-hour wear formula that delivers full, natural-looking coverage that won't slip, fade or streak. Available in 56 shades. Ideal for long days, events and anyone who demands all-day flawless coverage. Sweat-resistant and humidity-resistant.",
    price: "£46.00",
    image: "https://static.thcdn.com/productimg/original/17622272-8945303345083635.jpg",
    affiliateUrl: lf("Estee Lauder Double Wear Foundation"),
    zones: ["full-face"],
    suitableFor: ["oily","combination","all"],
    keyIngredients: [
      { name: "Extended Wear Technology", benefit: "24-hour transfer-resistant wear" },
      { name: "Oil-Control Complex", benefit: "Manages sebum production throughout the day" }
    ],
    alternatives: {
      budget: { name: "Infallible 24H Matte Foundation", brand: "L'Oréal Paris", price: "£13.99", affiliateUrl: boots("L'Oreal Infallible Foundation") },
      luxury: { name: "Armani Luminous Silk Foundation", brand: "Giorgio Armani", price: "£47.00", affiliateUrl: lf("Giorgio Armani Luminous Silk") },
      organic: { name: "BB Cream SPF35", brand: "ILIA", price: "£46.00", affiliateUrl: sep("ILIA BB Cream") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // CONCEALER (p15–p16)
  // ════════════════════════════════════════════════════════════

  {
    id: "p15", name: "Radiant Creamy Concealer", brand: "NARS", category: "concealer",
    tags: ["coverage","brightening","creamy","long-wear","under-eye"],
    description: "The concealer that broke the internet — sold every few seconds worldwide. A creamy, full-coverage formula with a radiant finish that conceals blemishes, dark circles and imperfections. Buildable coverage stays put for 16 hours. Caffeine reduces puffiness while optical brighteners reflect light for a well-rested, luminous look.",
    price: "£30.00",
    image: "https://static.thcdn.com/productimg/original/10785712-1785249197799430.jpg",
    affiliateUrl: lf("NARS Radiant Creamy Concealer"),
    zones: ["under-eye","blemishes","nose","chin"],
    suitableFor: ["all","dry","normal","combination"],
    keyIngredients: [
      { name: "Caffeine", benefit: "Reduces puffiness around the eye area" },
      { name: "Optical Brighteners", benefit: "Reflect light to brighten dark circles" }
    ],
    alternatives: {
      budget: { name: "Fit Me Concealer", brand: "Maybelline", price: "£7.99", affiliateUrl: boots("Maybelline Fit Me Concealer") },
      luxury: { name: "Shape Tape Ultra Creamy Concealer", brand: "Tarte", price: "£27.00", affiliateUrl: sep("Tarte Shape Tape Concealer") },
      organic: { name: "Pure Pressed Powder", brand: "Jane Iredale", price: "£55.00", affiliateUrl: lf("Jane Iredale Concealer") }
    },
    bestSeller: true
  },

  {
    id: "p16", name: "Fit Me Concealer", brand: "Maybelline", category: "concealer",
    tags: ["coverage","budget","natural","buildable","drugstore"],
    description: "One of the best-selling concealers in the world — and for good reason. Provides medium, buildable coverage with a natural, skin-like finish. Crease-resistant formula blends seamlessly and stays comfortable all day. Available in 40 shades. The ultimate drugstore concealer that consistently outperforms products at five times the price.",
    price: "£7.99",
    image: "https://static.thcdn.com/productimg/original/11705438-1315247599309085.jpg",
    affiliateUrl: boots("Maybelline Fit Me Concealer"),
    zones: ["under-eye","blemishes"],
    suitableFor: ["all","combination","oily"],
    keyIngredients: [
      { name: "Micro-Corrective Pigments", benefit: "Adapts to and corrects skin tone naturally" }
    ],
    alternatives: {
      budget: { name: "Revolution Conceal & Define Concealer", brand: "Revolution", price: "£5.00", affiliateUrl: boots("Revolution Concealer") },
      luxury: { name: "Radiant Creamy Concealer", brand: "NARS", price: "£30.00", affiliateUrl: lf("NARS Radiant Creamy Concealer") },
      organic: { name: "Fruit Pigmented Coverage Foundation", brand: "100% Pure", price: "£34.00", affiliateUrl: amz("100% Pure concealer") }
    }
  },

  {
    id: "p15b", name: "Touche Éclat Radiant Touch", brand: "YSL Beauty", category: "concealer",
    tags: ["brightening","radiance","iconic","highlighter","pen"],
    description: "The iconic luminous pen that created the brightening concealer category. Used backstage at Paris Fashion Week for over 30 years. A light-reflecting formula with a built-in brush that instantly illuminates fatigue, lines and shadows. Not a heavy concealer — a radiance-boosting transformer that catches light beautifully.",
    price: "£34.50",
    image: "https://static.thcdn.com/productimg/original/11794791-2095294817104262.jpg",
    affiliateUrl: lf("YSL Touche Eclat Radiant Touch"),
    zones: ["under-eye","inner-corner","cheekbones","brow-bone"],
    suitableFor: ["all","mature","dull","normal"],
    keyIngredients: [
      { name: "Light-Reflecting Particles", benefit: "Bounces light to erase shadows and fatigue" }
    ],
    alternatives: {
      budget: { name: "True Match Eye Cream Concealer", brand: "L'Oréal Paris", price: "£12.99", affiliateUrl: boots("L'Oreal True Match Concealer") },
      luxury: { name: "Airbrush Brightening Pen", brand: "Charlotte Tilbury", price: "£29.00", affiliateUrl: ctLink("Charlotte Tilbury Brightening Pen") },
      organic: { name: "Serum Foundation", brand: "RMS Beauty", price: "£42.00", affiliateUrl: sep("RMS Beauty Serum Foundation") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // TONER (p7, p17)
  // ════════════════════════════════════════════════════════════

  {
    id: "p7", name: "Skin Perfecting 2% BHA Liquid Exfoliant 118ml", brand: "Paula's Choice", category: "toner",
    tags: ["BHA","exfoliant","pores","blackheads","salicylic-acid"],
    description: "The exfoliant that earned a 10-year waitlist and changed how we think about pores. A leave-on 2% salicylic acid solution that penetrates deep inside pores to dissolve blackheads, reduce their appearance and smooth skin texture. Consistently rated the world's best chemical exfoliant. Fragrance-free, non-abrasive and suitable for all skin types.",
    price: "£35.00",
    image: "https://static.thcdn.com/productimg/original/11174178-1315212874248044.jpg",
    affiliateUrl: cultDirect("11174178", "https://www.cultbeauty.co.uk/p/paula-s-choice-skin-perfecting-2-bha-liquid-exfoliant-118ml/11174178/"),
    zones: ["t-zone","nose","forehead","chin"],
    suitableFor: ["oily","combination","blemish-prone","all"],
    keyIngredients: [
      { name: "Salicylic Acid 2%", benefit: "Dissolves blackheads and clears congestion" },
      { name: "Green Tea Extract", benefit: "Antioxidant protection and soothing" }
    ],
    alternatives: {
      budget: { name: "Salicylic Acid 2% Solution", brand: "The Ordinary", price: "£7.00", affiliateUrl: boots("The Ordinary Salicylic Acid") },
      luxury: { name: "Daily Microfoliant", brand: "Dermalogica", price: "£64.00", affiliateUrl: lf("Dermalogica Daily Microfoliant") },
      organic: { name: "BHA+ Pore-Minimising Toner", brand: "Glow Recipe", price: "£32.00", affiliateUrl: cult("Glow Recipe BHA Toner") }
    },
    bestSeller: true
  },

  {
    id: "p17", name: "Essence Toner 200ml", brand: "Pyunkang Yul", category: "toner",
    tags: ["hydration","K-beauty","astragalus","soothing","minimalist"],
    description: "Formulated with 91.3% astragalus root extract — a deeply hydrating and healing ingredient used in Korean medicine for millennia. One of the simplest and most effective hydrating toners available: no alcohol, no fragrance, no fillers. Pat into skin after cleansing to flood cells with moisture and prep for serums.",
    price: "£18.00",
    image: "https://static.thcdn.com/productimg/original/14866957-1695322004448622.jpg",
    affiliateUrl: cult("Pyunkang Yul Essence Toner"),
    zones: ["full-face"],
    suitableFor: ["dry","sensitive","all","dehydrated"],
    keyIngredients: [
      { name: "Astragalus Root Extract 91.3%", benefit: "Deep long-lasting hydration with soothing properties" }
    ],
    alternatives: {
      budget: { name: "Hyaluronic Acid Toner", brand: "The Inkey List", price: "£9.99", affiliateUrl: cult("Inkey List Hyaluronic Acid Toner") },
      luxury: { name: "Glow Tonic", brand: "Pixi Beauty", price: "£18.00", affiliateUrl: boots("Pixi Glow Tonic") },
      organic: { name: "Rosehip Toning Water", brand: "Antipodes", price: "£22.00", affiliateUrl: lf("Antipodes Rosehip Toning Water") }
    }
  },

  {
    id: "p17b", name: "Glycolic Acid 7% Toning Solution 240ml", brand: "The Ordinary", category: "toner",
    tags: ["glycolic-acid","AHA","exfoliant","brightening","budget"],
    description: "A cult-favourite exfoliating toning solution at an unbeatable price. 7% glycolic acid removes dead skin cells, smooths texture and improves brightness with consistent use. Also contains amino acids, aloe vera and ginseng to support and balance the skin post-exfoliation. Use on cotton pad 3–4 nights per week.",
    price: "£11.80",
    image: "https://static.thcdn.com/productimg/original/17767850-1015323330585356.jpg",
    affiliateUrl: boots("The Ordinary Glycolic Acid 7% Toning Solution"),
    zones: ["full-face","back","chest"],
    suitableFor: ["oily","combination","normal","hyperpigmentation"],
    keyIngredients: [
      { name: "Glycolic Acid 7%", benefit: "Exfoliates dead skin for brighter, smoother texture" },
      { name: "Aloe Vera", benefit: "Soothes and hydrates post-exfoliation" }
    ],
    alternatives: {
      budget: { name: "AHA Toner", brand: "Revolution Skincare", price: "£6.00", affiliateUrl: boots("Revolution Skincare AHA Toner") },
      luxury: { name: "Glow Tonic", brand: "Pixi Beauty", price: "£18.00", affiliateUrl: boots("Pixi Glow Tonic") },
      organic: { name: "Glycolic Acid Solution", brand: "REN Clean Skincare", price: "£32.00", affiliateUrl: lf("REN Glycolic Acid Solution") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // EYE CREAM (p19–p20)
  // ════════════════════════════════════════════════════════════

  {
    id: "p19", name: "Eyes are the Story Retinol Eye Cream", brand: "Olay", category: "eye-cream",
    tags: ["retinol","anti-ageing","firmness","eye","budget"],
    description: "A breakthrough retinol eye treatment that delivers visible results at a fraction of the price of luxury alternatives. A dual-chamber applicator keeps retinol stable until the moment of application. Clinically proven to reduce the appearance of crow's feet and dark circles in 28 days. Gentle enough for the delicate eye area.",
    price: "£39.99",
    image: "https://static.thcdn.com/productimg/original/12435689-2115324588700873.jpg",
    affiliateUrl: boots("Olay Retinol Eye Cream"),
    zones: ["eye-area","crow's-feet","under-eye"],
    suitableFor: ["mature","all","normal","dry"],
    keyIngredients: [
      { name: "Retinol", benefit: "Stimulates collagen and reduces fine lines" },
      { name: "Niacinamide", benefit: "Brightens dark circles and strengthens barrier" }
    ],
    alternatives: {
      budget: { name: "Caffeine Solution 5% + EGCG", brand: "The Ordinary", price: "£6.90", affiliateUrl: boots("The Ordinary Caffeine Eye Serum") },
      luxury: { name: "Advanced Night Repair Eye", brand: "Estée Lauder", price: "£70.00", affiliateUrl: lf("Estee Lauder ANR Eye Cream") },
      organic: { name: "Brightening Eye Elixir", brand: "Omorovicza", price: "£90.00", affiliateUrl: lf("Omorovicza Eye Elixir") }
    }
  },

  {
    id: "p20", name: "Creamy Eye Treatment with Avocado 14ml", brand: "Kiehl's", category: "eye-cream",
    tags: ["hydration","avocado","nourishing","eye","classic"],
    description: "Kiehl's bestselling eye cream for over 30 years. A rich, concentrated treatment enriched with avocado oil and beta-carotene. Intensely nourishes the delicate periorbital area, reducing dryness and the appearance of fine lines. The rich texture and distinctive pot make it one of the most gifted beauty products in the world.",
    price: "£40.00",
    image: "https://static.thcdn.com/productimg/original/12916107-1555129688365991.jpg",
    affiliateUrl: lf("Kiehls Creamy Eye Treatment Avocado"),
    zones: ["eye-area","under-eye","crow's-feet"],
    suitableFor: ["dry","mature","all","sensitive"],
    keyIngredients: [
      { name: "Avocado Oil", benefit: "Rich nourishment for dry, sensitive eye area" },
      { name: "Beta-Carotene", benefit: "Antioxidant protection" },
      { name: "Shea Butter", benefit: "Softens and conditions the skin" }
    ],
    alternatives: {
      budget: { name: "Caffeine Eye Serum", brand: "The Ordinary", price: "£6.90", affiliateUrl: boots("The Ordinary Caffeine Eye") },
      luxury: { name: "Eye Balm", brand: "Sisley", price: "£149.00", affiliateUrl: lf("Sisley Eye Balm") },
      organic: { name: "Frankincense Intense Eye Cream", brand: "Neal's Yard Remedies", price: "£41.00", affiliateUrl: lf("Neals Yard Eye Cream") }
    }
  },

  {
    id: "p20b", name: "Advanced Night Repair Eye Supercharged Complex", brand: "Estée Lauder", category: "eye-cream",
    tags: ["anti-ageing","repair","dark-circles","puffiness","luxury"],
    description: "The most powerful ANR formula for the eye area. Features the proprietary Chronolux Power Signal Technology enhanced for the delicate periorbital zone. Visibly reduces the appearance of multiple eye concerns: dark circles, puffiness, fine lines and loss of firmness. Peptides and hyaluronic acid deliver instant and long-term results.",
    price: "£70.00",
    image: "https://static.thcdn.com/productimg/original/13924834-1784976743956681.jpg",
    affiliateUrl: lf("Estee Lauder ANR Eye Supercharged"),
    zones: ["eye-area","under-eye","crow's-feet"],
    suitableFor: ["mature","all","dry","normal"],
    keyIngredients: [
      { name: "Chronolux Power Signal Technology", benefit: "Enhances eye area nighttime repair" },
      { name: "ChronoPeptide Technology", benefit: "Firms and reduces visible sagging" },
      { name: "Hyaluronic Acid", benefit: "Plumps and hydrates fine lines" }
    ],
    alternatives: {
      budget: { name: "Retinol Eye Cream", brand: "Olay", price: "£39.99", affiliateUrl: boots("Olay Retinol Eye Cream") },
      luxury: { name: "Anti-Age Eye Contour Balm", brand: "Sisley", price: "£149.00", affiliateUrl: lf("Sisley Eye Balm") },
      organic: { name: "Edelweiss Eye Contour Serum", brand: "Sisley", price: "£109.00", affiliateUrl: lf("Sisley Edelweiss Eye Serum") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // CLEANSER (p21–p22)
  // ════════════════════════════════════════════════════════════

  {
    id: "p21", name: "Foaming Facial Cleanser 473ml", brand: "CeraVe", category: "cleanser",
    tags: ["foaming","ceramides","normal","oily","fragrance-free"],
    description: "A gentle, foaming cleanser developed with dermatologists. Removes excess oil, dirt and makeup while maintaining the skin's natural barrier. Three essential ceramides and niacinamide work in synergy to cleanse without stripping. Non-comedogenic, fragrance-free and suitable for normal to oily skin — the staple of every evidence-based skincare routine.",
    price: "£14.50",
    image: "https://static.thcdn.com/productimg/original/11798697-1005324620847859.jpg",
    affiliateUrl: boots("CeraVe Foaming Facial Cleanser"),
    zones: ["full-face"],
    suitableFor: ["oily","combination","normal"],
    keyIngredients: [
      { name: "Ceramides 1, 3, 6-II", benefit: "Protects skin barrier during cleansing" },
      { name: "Niacinamide", benefit: "Calms and minimises pores" }
    ],
    alternatives: {
      budget: { name: "Simple Refreshing Facial Wash", brand: "Simple", price: "£3.99", affiliateUrl: boots("Simple facial wash") },
      luxury: { name: "Purity Made Simple Cleanser", brand: "Philosophy", price: "£25.00", affiliateUrl: lf("Philosophy Purity Cleanser") },
      organic: { name: "Ultra Mild Facial Cleanser", brand: "Pai Skincare", price: "£26.00", affiliateUrl: lf("Pai Skincare Cleanser") }
    },
    bestSeller: true
  },

  {
    id: "p22", name: "Toleriane Hydrating Gentle Cleanser 400ml", brand: "La Roche-Posay", category: "cleanser",
    tags: ["gentle","sensitive","soothing","non-stripping","ceramides"],
    description: "The number one dermatologist-recommended cleanser for sensitive and reactive skin in France. A soap-free formula with prebiotic thermal water, ceramides and niacinamide that cleanses without compromising the microbiome. No fragrance, no preservatives, no parabens. Rinse off or leave on as a mask for extra soothing effect.",
    price: "£15.00",
    image: "https://static.thcdn.com/productimg/original/12631146-2044801019221119.jpg",
    affiliateUrl: boots("La Roche-Posay Toleriane Hydrating Cleanser"),
    zones: ["full-face"],
    suitableFor: ["sensitive","dry","rosacea","eczema-prone"],
    keyIngredients: [
      { name: "Prebiotic Thermal Water", benefit: "Soothes and supports the skin microbiome" },
      { name: "Ceramide NP", benefit: "Restores and protects the skin barrier" }
    ],
    alternatives: {
      budget: { name: "Ultra Sensitive Cleansing Cream", brand: "Garnier", price: "£6.99", affiliateUrl: boots("Garnier Sensitive Cleansing Cream") },
      luxury: { name: "Soothing Facial Cleanser", brand: "First Aid Beauty", price: "£22.00", affiliateUrl: lf("First Aid Beauty Soothing Cleanser") },
      organic: { name: "Chamomile Cleansing Balm", brand: "Emma Hardie", price: "£42.00", affiliateUrl: lf("Emma Hardie Cleansing Balm") }
    }
  },

  {
    id: "p21b", name: "Elemis Pro-Collagen Cleansing Balm 100g", brand: "Elemis", category: "cleanser",
    tags: ["balm","luxury","anti-ageing","double-cleanse","nourishing"],
    description: "A cult cleansing balm that dissolves makeup — including waterproof mascara — while delivering intensive anti-ageing care. Egyptian rose, mimosa and elderberry blossom oils nourish and protect. The pearlescent balm melts on skin and transforms to a milky fluid when emulsified with water. Leaves skin visibly smoother and radiant.",
    price: "£49.00",
    image: "https://static.thcdn.com/productimg/original/14940276-8845326900691604.jpg",
    affiliateUrl: lf("Elemis Pro-Collagen Cleansing Balm"),
    zones: ["full-face"],
    suitableFor: ["all","dry","mature","sensitive"],
    keyIngredients: [
      { name: "Egyptian Rose Oil", benefit: "Soothes and nourishes while cleansing" },
      { name: "Mimosa Wax", benefit: "Melts makeup effortlessly" },
      { name: "Elderberry Blossom Extract", benefit: "Antioxidant protection" }
    ],
    alternatives: {
      budget: { name: "Melting Cleansing Balm", brand: "Clinique", price: "£25.00", affiliateUrl: lf("Clinique Cleansing Balm") },
      luxury: { name: "Radiance Cleansing Balm", brand: "Charlotte Tilbury", price: "£41.00", affiliateUrl: ctLink("Charlotte Tilbury Cleansing Balm") },
      organic: { name: "Organic Cleansing Balm", brand: "Dr. Organic", price: "£12.99", affiliateUrl: boots("Dr Organic Cleansing Balm") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // RETINOL (p23–p24)
  // ════════════════════════════════════════════════════════════

  {
    id: "p23", name: "Crystal Retinal 6 30ml", brand: "Medik8", category: "retinol",
    tags: ["retinal","anti-ageing","advanced","overnight","firmness"],
    description: "Retinal (retinaldehyde) is 11× more potent than retinol but gentler than prescription tretinoin — and Crystal Retinal is the best-formulated version on the market. The 0.06% retinal concentration is encapsulated in a time-release system to minimise irritation. Skin appears visibly smoother, firmer and more youthful in 4 weeks. Use nightly, gradually.",
    price: "£49.00",
    image: "https://static.thcdn.com/productimg/original/11899386-8785323840805661.jpg",
    affiliateUrl: lf("Medik8 Crystal Retinal 6"),
    zones: ["full-face","neck"],
    suitableFor: ["mature","normal","combination","experienced-retinol-users"],
    keyIngredients: [
      { name: "Retinaldehyde 0.06%", benefit: "11× more potent than retinol for faster anti-ageing results" },
      { name: "Vitamin B12", benefit: "Soothes and calms retinoid-related irritation" },
      { name: "Hyaluronic Acid", benefit: "Counteracts dryness associated with retinoids" }
    ],
    alternatives: {
      budget: { name: "Retinol 0.2% in Squalane", brand: "The Ordinary", price: "£8.00", affiliateUrl: boots("The Ordinary Retinol Squalane") },
      luxury: { name: "A-Passioni Retinol Cream", brand: "Drunk Elephant", price: "£68.00", affiliateUrl: cult("Drunk Elephant A-Passioni Retinol") },
      organic: { name: "Bakuchiol Reface Serum", brand: "Pai Skincare", price: "£46.00", affiliateUrl: lf("Pai Bakuchiol Serum") }
    }
  },

  {
    id: "p24", name: "Retinol Correxion Line Smoothing Serum 30ml", brand: "RoC", category: "retinol",
    tags: ["retinol","anti-ageing","fine-lines","budget","classic"],
    description: "A dermatologist-trusted retinol serum that delivers clinically proven results at a high-street price. Pure stabilised retinol combined with an exclusive mineral complex visibly reduces fine lines and wrinkles in 12 weeks. One of the most researched retinol formulas available without prescription. Fragrance-free.",
    price: "£28.99",
    image: "https://static.thcdn.com/productimg/original/17692035-1815316062266431.jpg",
    affiliateUrl: boots("RoC Retinol Correxion Serum"),
    zones: ["full-face","neck","eye-area"],
    suitableFor: ["mature","all","normal","dry"],
    keyIngredients: [
      { name: "Pure Stabilised Retinol", benefit: "Smooths and resurfaces with proven efficacy" },
      { name: "Mineral Complex", benefit: "Helps stabilise retinol and improve delivery" }
    ],
    alternatives: {
      budget: { name: "Retinol 0.5% in Squalane", brand: "The Ordinary", price: "£9.00", affiliateUrl: boots("The Ordinary Retinol 0.5") },
      luxury: { name: "Crystal Retinal 6", brand: "Medik8", price: "£49.00", affiliateUrl: lf("Medik8 Crystal Retinal 6") },
      organic: { name: "Bakuchiol Serum", brand: "Herbivore", price: "£48.00", affiliateUrl: amz("Herbivore Bakuchiol Serum") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // MASKS (p25–p26)
  // ════════════════════════════════════════════════════════════

  {
    id: "p25", name: "Watermelon Glow Sleeping Mask 80ml", brand: "Glow Recipe", category: "mask",
    tags: ["overnight","hydration","brightening","K-beauty","AHA"],
    description: "Wake up to visibly plumper, more luminous skin. This overnight sleeping mask delivers a powerhouse blend of watermelon extract, hyaluronic acid and AHAs that work while you sleep to exfoliate, hydrate and repair. The cool gel texture soothes as it sinks in — no rinse required. Consistently ranked among the world's best overnight masks.",
    price: "£38.00",
    image: "https://static.thcdn.com/productimg/original/15620122-5155321770268880.jpg",
    affiliateUrl: cult("Glow Recipe Watermelon Sleeping Mask"),
    zones: ["full-face"],
    suitableFor: ["oily","combination","dull","all"],
    keyIngredients: [
      { name: "Watermelon Extract", benefit: "Soothes and provides antioxidant defence" },
      { name: "AHAs", benefit: "Gentle overnight exfoliation for renewed radiance" },
      { name: "Hyaluronic Acid", benefit: "Seals in overnight moisture" }
    ],
    alternatives: {
      budget: { name: "Overnight Sleeping Mask", brand: "Laneige", price: "£25.00", affiliateUrl: sep("Laneige Sleeping Mask") },
      luxury: { name: "Advanced Night Repair Concentrated Recovery Sleeping Mask", brand: "Estée Lauder", price: "£65.00", affiliateUrl: lf("Estee Lauder Sleeping Mask") },
      organic: { name: "Pink Cloud Rosewater Moisture Cream", brand: "Herbivore", price: "£45.00", affiliateUrl: amz("Herbivore Pink Cloud Cream") }
    }
  },

  {
    id: "p26", name: "Goddess Skin Clay Mask 75ml", brand: "Charlotte Tilbury", category: "mask",
    tags: ["clay","pore-cleansing","luxury","glow","kaolin"],
    description: "A luxurious clay mask that deep-cleanses pores while maintaining a radiant, goddess-like glow. Unlike stripping clay masks, this formula includes skin-loving rosehip oil and vitamin E to counterbalance the purifying effect. Apply as a mask for 10 minutes or blend a thin layer overnight for an intensive treatment. Skin looks cleansed, refined and luminous.",
    price: "£42.00",
    image: "https://static.thcdn.com/productimg/original/13313632-4884896616595484.jpg",
    affiliateUrl: ctLink("Goddess Skin Clay Mask"),
    zones: ["t-zone","forehead","nose","chin"],
    suitableFor: ["oily","combination","all"],
    keyIngredients: [
      { name: "Kaolin Clay", benefit: "Draws out impurities and absorbs excess oil" },
      { name: "Rosehip Oil", benefit: "Nourishes and prevents over-drying" },
      { name: "Vitamin E", benefit: "Antioxidant skin conditioning" }
    ],
    alternatives: {
      budget: { name: "Aztec Secret Indian Healing Clay", brand: "Aztec Secret", price: "£8.99", affiliateUrl: amz("Aztec Secret Indian Healing Clay") },
      luxury: { name: "Rare Earth Deep Pore Cleansing Masque", brand: "Kiehl's", price: "£42.00", affiliateUrl: lf("Kiehls Rare Earth Clay Mask") },
      organic: { name: "Radiance Mask with Rose", brand: "Dr. Hauschka", price: "£30.00", affiliateUrl: boots("Dr Hauschka Radiance Mask") }
    }
  },

  {
    id: "p26b", name: "Overnight Lip Sleeping Mask", brand: "Laneige", category: "mask",
    tags: ["lip","overnight","hydration","K-beauty","plumping"],
    description: "The world's bestselling lip mask — a viral K-beauty phenomenon for good reason. A concentrated barrier of shea butter, vitamin C and antioxidants repairs and plumps lips while you sleep. Wakes up fine lines and flakiness to reveal soft, smooth, pillowy lips by morning. Available in multiple delicious scents.",
    price: "£22.00",
    image: "https://static.thcdn.com/productimg/original/16950328-1485325098287626.jpg",
    affiliateUrl: sep("Laneige Lip Sleeping Mask"),
    zones: ["lips"],
    suitableFor: ["all","dry","chapped"],
    keyIngredients: [
      { name: "Moisture Wrap Technology", benefit: "Creates a barrier to prevent lip moisture loss overnight" },
      { name: "Vitamin C", benefit: "Brightens lip pigmentation" },
      { name: "Shea Butter", benefit: "Deeply nourishes dry, chapped lips" }
    ],
    alternatives: {
      budget: { name: "Vaseline Lip Therapy", brand: "Vaseline", price: "£2.99", affiliateUrl: boots("Vaseline Lip Therapy") },
      luxury: { name: "Charlotte's Lip Magic", brand: "Charlotte Tilbury", price: "£20.00", affiliateUrl: ctLink("Charlotte Tilbury Lip Magic") },
      organic: { name: "Organic Lip Balm", brand: "Burt's Bees", price: "£4.99", affiliateUrl: boots("Burts Bees Lip Balm") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // LIP (p27–p28)
  // ════════════════════════════════════════════════════════════

  {
    id: "p27", name: "Lip Cheat Lip Liner — Pillow Talk", brand: "Charlotte Tilbury", category: "lip",
    tags: ["lip-liner","pillow-talk","defining","nude-pink","bestseller"],
    description: "The lip liner that launched a thousand dupes. Pillow Talk — a universally flattering nude-pink with a hint of rose — has become a beauty icon in its own right. The chubby, creamy texture defines and shapes the lip with precision, preventing feathering. Can be used to fill in the entire lip as a base, extending lipstick wear.",
    price: "£27.00",
    image: "https://static.thcdn.com/productimg/original/13323128-1604896486875481.jpg",
    affiliateUrl: ctLink("Charlotte Tilbury Lip Cheat Pillow Talk"),
    zones: ["lips"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Creamy Wax Formula", benefit: "Glides on smoothly without pulling or tugging" }
    ],
    alternatives: {
      budget: { name: "Lasting Finish Lip Liner", brand: "Rimmel", price: "£4.99", affiliateUrl: boots("Rimmel Lasting Finish Lip Liner") },
      luxury: { name: "Iconic Lip Liner", brand: "Pat McGrath Labs", price: "£28.00", affiliateUrl: sep("Pat McGrath Lip Liner") },
      organic: { name: "Lip Liner", brand: "ILIA", price: "£24.00", affiliateUrl: sep("ILIA Lip Liner") }
    },
    bestSeller: true
  },

  {
    id: "p28", name: "Matte Revolution Lipstick — Pillow Talk", brand: "Charlotte Tilbury", category: "lip",
    tags: ["lipstick","matte","pillow-talk","long-wear","luxury"],
    description: "The world's most beloved lipstick shade. Pillow Talk — a dreamy nude-pink — flatters every skin tone from the fairest to the deepest. The matte formula delivers intense, long-wearing colour with a comfortable, non-drying finish thanks to skin-nourishing rose wax and vitamin E. A single swipe delivers full opacity.",
    price: "£32.00",
    image: "https://static.thcdn.com/productimg/original/13323151-6965255641860615.jpg",
    affiliateUrl: cultDirect("13323147", "https://www.cultbeauty.co.uk/p/charlotte-tilbury-matte-revolution/13323147/"),
    zones: ["lips"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Rose Wax", benefit: "Delivers comfort and wear without dryness" },
      { name: "Vitamin E", benefit: "Conditions lips during wear" }
    ],
    alternatives: {
      budget: { name: "Long-Lasting Moisturising Matte Lipstick", brand: "NYX", price: "£9.50", affiliateUrl: boots("NYX Matte Lipstick") },
      luxury: { name: "Iconic Lip Color", brand: "Pat McGrath Labs", price: "£36.00", affiliateUrl: sep("Pat McGrath Lipstick") },
      organic: { name: "Lipstick Balm", brand: "ILIA", price: "£32.00", affiliateUrl: sep("ILIA Lipstick") }
    },
    bestSeller: true, sponsored: true, sponsorLabel: "Charlotte Tilbury"
  },

  {
    id: "p28b", name: "Comfort Matte Liquid Lipstick", brand: "Huda Beauty", category: "lip",
    tags: ["liquid-lipstick","matte","long-wear","full-coverage","dramatic"],
    description: "A revolutionary liquid-to-matte formula that delivers the most comfortable long-wearing matte lipstick experience. Infused with hyaluronic acid and vitamin E, it keeps lips hydrated and plump throughout wear. 24-hour transfer-proof formula available in 40 stunning shades from nudes to deep berries.",
    price: "£28.00",
    image: "https://static.thcdn.com/productimg/original/13798792-2105271996253596.jpg",
    affiliateUrl: sep("Huda Beauty Comfort Matte Lipstick"),
    zones: ["lips"],
    suitableFor: ["all","mature","dry"],
    keyIngredients: [
      { name: "Hyaluronic Acid", benefit: "Keeps lips plumped and comfortable during wear" },
      { name: "Vitamin E", benefit: "Conditions and protects" }
    ],
    alternatives: {
      budget: { name: "Soft Matte Lip Cream", brand: "NYX", price: "£8.50", affiliateUrl: boots("NYX Soft Matte Lip Cream") },
      luxury: { name: "Matte Revolution", brand: "Charlotte Tilbury", price: "£32.00", affiliateUrl: ctLink("Charlotte Tilbury Matte Revolution") },
      organic: { name: "Multi-Stick", brand: "RMS Beauty", price: "£36.00", affiliateUrl: sep("RMS Beauty Multi Stick") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // BLUSH (p29–p30)
  // ════════════════════════════════════════════════════════════

  {
    id: "p29", name: "Orgasm Blush 8g", brand: "NARS", category: "blush",
    tags: ["blush","peachy-pink","shimmer","buildable","iconic"],
    description: "Possibly the most famous blush in the world. A perfect peachy-pink with golden shimmer that illuminates and adds a natural flush to cheeks. The universally flattering shade works on every skin tone — from fairest to deepest. Finely milled pigments blend effortlessly and last all day. The blush non-makeup lovers reach for.",
    price: "£30.00",
    image: "https://static.thcdn.com/productimg/1600/1600/12117521-9044682298968649.jpg",
    affiliateUrl: cultDirect("12117521", "https://www.cultbeauty.co.uk/p/nars-cosmetics-blush-orgasm-8g/12117521/"),
    zones: ["cheeks","temples"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Ultra-Fine Pigments", benefit: "Seamless buildable colour payoff" },
      { name: "Golden Shimmer", benefit: "Illuminates and lifts the face" }
    ],
    alternatives: {
      budget: { name: "Bourjois Little Round Pot Blush", brand: "Bourjois", price: "£8.99", affiliateUrl: boots("Bourjois Round Pot Blush") },
      luxury: { name: "Sheer Cheek Gelee", brand: "Armani Beauty", price: "£42.00", affiliateUrl: lf("Giorgio Armani Sheer Cheek") },
      organic: { name: "Cheek Tint", brand: "Honest Beauty", price: "£18.00", affiliateUrl: amz("Honest Beauty Cheek Tint") }
    },
    bestSeller: true
  },

  {
    id: "p30", name: "Soft Pinch Liquid Blush", brand: "Rare Beauty", category: "blush",
    tags: ["liquid-blush","blendable","buildable","long-wear","natural"],
    description: "Selena Gomez's beauty brand created one of the decade's most talked-about products. A concentrated liquid blush that requires just one drop for a natural-looking flush — two drops for something bolder. The lightweight formula blends in seconds and lasts all day. Available in 20 shades, from the softest peachy nudes to vivid berries.",
    price: "£22.00",
    image: "https://static.thcdn.com/productimg/original/15810712-7665323813719003.jpg",
    affiliateUrl: sep("Rare Beauty Soft Pinch Liquid Blush"),
    zones: ["cheeks","temples","nose","lips"],
    suitableFor: ["all","oily","combination"],
    keyIngredients: [
      { name: "Micro-Pigment Complex", benefit: "Intensely pigmented for minimal product use" }
    ],
    alternatives: {
      budget: { name: "Colour Correcting Blush", brand: "Revolution", price: "£5.00", affiliateUrl: boots("Revolution Blush") },
      luxury: { name: "Glow Blush", brand: "NARS", price: "£35.00", affiliateUrl: lf("NARS Glow Blush") },
      organic: { name: "Cream Blush", brand: "RMS Beauty", price: "£32.00", affiliateUrl: sep("RMS Beauty Cream Blush") }
    },
    bestSeller: true, newIn: false
  },

  {
    id: "p30b", name: "Cheek Kiss Blush Stick", brand: "Charlotte Tilbury", category: "blush",
    tags: ["cream-blush","stick","buildable","glow","travel-friendly"],
    description: "A feather-light cream blush in a sleek bullet format. Swipe onto cheeks for an effortless, natural flush of colour that mimics the skin-from-within glow of good health. The sheer, blendable formula can be built up for more drama or sheered out for a barely-there tint. No brush needed — blend with fingertips in seconds.",
    price: "£32.00",
    image: "https://static.thcdn.com/productimg/original/13798776-8634958926784037.jpg",
    affiliateUrl: ctLink("Charlotte Tilbury Cheek Kiss Blush"),
    zones: ["cheeks"],
    suitableFor: ["all","dry","mature"],
    keyIngredients: [
      { name: "Buildable Pigments", benefit: "Sheers out or builds up for versatile coverage" },
      { name: "Vitamin E", benefit: "Conditions and nourishes skin during wear" }
    ],
    alternatives: {
      budget: { name: "Cream Blush Stick", brand: "e.l.f. Cosmetics", price: "£8.00", affiliateUrl: boots("elf Cream Blush Stick") },
      luxury: { name: "Soft Pinch Liquid Blush", brand: "Rare Beauty", price: "£22.00", affiliateUrl: sep("Rare Beauty Soft Pinch") },
      organic: { name: "Cream Blush Stick", brand: "ILIA", price: "£30.00", affiliateUrl: sep("ILIA Cream Blush") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // PRIMER (p31)
  // ════════════════════════════════════════════════════════════

  {
    id: "p31", name: "POREfessional Face Primer", brand: "Benefit Cosmetics", category: "primer",
    tags: ["pore-minimising","silky","long-wear","oil-control","classic"],
    description: "A globally bestselling primer that instantly minimises the look of pores and fine lines for a smooth, perfected canvas. The weightless, balm-to-silicone formula fills imperfections on contact and extends foundation wear by up to 8 hours. Works under foundation, on its own or mixed into foundation. A makeup artist staple.",
    price: "£31.50",
    image: "https://static.thcdn.com/productimg/original/10552666-1265325375025611.jpg",
    affiliateUrl: boots("Benefit POREfessional Face Primer"),
    zones: ["full-face","t-zone"],
    suitableFor: ["oily","combination","normal","all"],
    keyIngredients: [
      { name: "Vitamin E", benefit: "Conditions skin and aids product adhesion" },
      { name: "Silicone Complex", benefit: "Fills pores and lines for a smooth base" }
    ],
    alternatives: {
      budget: { name: "Baby Skin Pore Eraser", brand: "Maybelline", price: "£8.99", affiliateUrl: boots("Maybelline Baby Skin Primer") },
      luxury: { name: "Armani Luminous Silk Primer", brand: "Giorgio Armani", price: "£42.00", affiliateUrl: lf("Giorgio Armani Primer") },
      organic: { name: "Skin Tint Primer SPF 30", brand: "Tarte", price: "£34.00", affiliateUrl: sep("Tarte Primer SPF30") }
    }
  },

  {
    id: "p31b", name: "Flexi-Hold Perfecting Primer", brand: "Charlotte Tilbury", category: "primer",
    tags: ["primer","long-wear","flexible","glow","luxury"],
    description: "A primer that flexes with facial movements for all-day wear without cracking. Flexi-hold technology grips foundation and prevents movement throughout the day while hyaluronic acid keeps skin hydrated underneath. A subtle illuminating finish imparts a radiant base beneath any foundation finish.",
    price: "£35.00",
    image: "https://static.thcdn.com/productimg/original/13313743-5795257983812988.jpg",
    affiliateUrl: ctLink("Charlotte Tilbury Flexi-Hold Primer"),
    zones: ["full-face"],
    suitableFor: ["all","dry","normal"],
    keyIngredients: [
      { name: "Flexi-Hold Technology", benefit: "Extends foundation wear while moving with the face" },
      { name: "Hyaluronic Acid", benefit: "Hydrates beneath makeup all day" }
    ],
    alternatives: {
      budget: { name: "e.l.f. Poreless Putty Primer", brand: "e.l.f. Cosmetics", price: "£12.00", affiliateUrl: boots("elf Poreless Putty Primer") },
      luxury: { name: "Hourglass Veil Mineral Primer", brand: "Hourglass Cosmetics", price: "£53.00", affiliateUrl: sep("Hourglass Veil Mineral Primer") },
      organic: { name: "Skin Veil SPF30 Base", brand: "ILIA", price: "£46.00", affiliateUrl: sep("ILIA Skin Veil") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // HIGHLIGHTER (p32)
  // ════════════════════════════════════════════════════════════

  {
    id: "p32", name: "Filmstar Bronze & Glow Palette", brand: "Charlotte Tilbury", category: "highlighter",
    tags: ["bronze","contour","highlighter","duo","luxury"],
    description: "The two-in-one palette that sculpts and illuminates like a Hollywood lighting team. One side holds Charlotte's iconic bronze sculpting powder, the other a champagne-gold highlighter. Used to contour, bronzing and add a blinding glow — described as having the best lighting filter permanently attached to your face. A perennial bestseller.",
    price: "£67.00",
    image: "https://static.thcdn.com/productimg/original/13322990-2094896481880610.jpg",
    affiliateUrl: ctLink("Charlotte Tilbury Filmstar Bronze Glow"),
    zones: ["cheekbones","temples","forehead","nose","chin"],
    suitableFor: ["all","medium","deep","light"],
    keyIngredients: [
      { name: "Micro-Pearl Powders", benefit: "Reflects light for a dimensional, lifted glow" }
    ],
    alternatives: {
      budget: { name: "Highlight & Contour Palette", brand: "Revolution", price: "£8.00", affiliateUrl: boots("Revolution Highlight Contour Palette") },
      luxury: { name: "Becca Shimmering Skin Perfector", brand: "Becca Cosmetics", price: "£38.00", affiliateUrl: lf("Becca Shimmering Skin Perfector") },
      organic: { name: "Living Luminizer", brand: "RMS Beauty", price: "£38.00", affiliateUrl: sep("RMS Beauty Living Luminizer") }
    },
    bestSeller: true, sponsored: true, sponsorLabel: "Charlotte Tilbury"
  },

  {
    id: "p32b", name: "Fenty Glow Heat Highlighter Palette", brand: "Fenty Beauty", category: "highlighter",
    tags: ["highlighter","inclusive","buildable","glow","diverse"],
    description: "A highlighter palette designed to flatter all skin tones. Six shades range from the palest champagne to the deepest bronze, allowing for precise colour-matching and multi-dimensional highlighting. The finely-milled pigments deliver a lit-from-within glow without chalkiness or fallout — even on deeper skin tones.",
    price: "£38.00",
    image: "https://static.thcdn.com/productimg/original/15654108-1555257727558919.jpg",
    affiliateUrl: sep("Fenty Beauty Glow Heat Highlighter Palette"),
    zones: ["cheekbones","brow-bone","nose","cupid's-bow"],
    suitableFor: ["all","deeper-tones","medium","fair"],
    keyIngredients: [
      { name: "Ultra-Fine Shimmer Pigments", benefit: "Buildable glow that flatters all skin tones" }
    ],
    alternatives: {
      budget: { name: "Revolution Chrome Lights Highlighter", brand: "Revolution", price: "£6.00", affiliateUrl: boots("Revolution Chrome Lights Highlighter") },
      luxury: { name: "Sundisk Highlighting Palette", brand: "Tom Ford Beauty", price: "£75.00", affiliateUrl: lf("Tom Ford Highlighting Palette") },
      organic: { name: "Master Radiance Base", brand: "RMS Beauty", price: "£40.00", affiliateUrl: sep("RMS Beauty Master Radiance Base") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // SPOT TREATMENT (p33)
  // ════════════════════════════════════════════════════════════

  {
    id: "p33", name: "Azelaic Acid Suspension 10% 30ml", brand: "The Ordinary", category: "spot-treatment",
    tags: ["azelaic-acid","brightening","rosacea","blemishes","budget"],
    description: "An effective, multi-tasking treatment for blemishes, rosacea and hyperpigmentation. 10% azelaic acid inhibits tyrosinase (the enzyme responsible for dark spot formation) and targets the bacteria that cause spots. The smooth suspension formula applies evenly and dries to a matte finish. Fragrance-free and suitable for sensitive skin.",
    price: "£10.50",
    image: "https://static.thcdn.com/productimg/original/15236645-1715328242172465.jpg",
    affiliateUrl: boots("The Ordinary Azelaic Acid Suspension 10%"),
    zones: ["t-zone","blemishes","cheeks"],
    suitableFor: ["oily","blemish-prone","rosacea","sensitive"],
    keyIngredients: [
      { name: "Azelaic Acid 10%", benefit: "Reduces blemishes, redness and dark spots" }
    ],
    alternatives: {
      budget: { name: "On-the-Spot Blemish Treatment", brand: "Neutrogena", price: "£9.99", affiliateUrl: boots("Neutrogena On the Spot Treatment") },
      luxury: { name: "Effaclar Duo+ SPF30", brand: "La Roche-Posay", price: "£16.50", affiliateUrl: boots("La Roche-Posay Effaclar Duo") },
      organic: { name: "Bakuchiol Serum", brand: "Pai Skincare", price: "£46.00", affiliateUrl: lf("Pai Bakuchiol Serum") }
    }
  },

  {
    id: "p33b", name: "Effaclar Duo+ 40ml", brand: "La Roche-Posay", category: "spot-treatment",
    tags: ["salicylic-acid","blemish","anti-acne","niacinamide","targeted"],
    description: "France's #1 anti-acne moisturiser — a dual-action treatment that targets blemishes while preventing new ones. Salicylic acid unclogs pores and reduces existing spots; niacinamide calms redness; procerad prevents scarring. Lightweight and non-comedogenic. Used by millions of teens and adults globally as a daily anti-blemish moisturiser.",
    price: "£16.50",
    image: "https://static.thcdn.com/productimg/original/11091821-6925227169727024.jpg",
    affiliateUrl: boots("La Roche-Posay Effaclar Duo+"),
    zones: ["t-zone","blemishes","cheeks"],
    suitableFor: ["oily","blemish-prone","combination","sensitive"],
    keyIngredients: [
      { name: "Salicylic Acid", benefit: "Unclogs pores and reduces visible spots" },
      { name: "Niacinamide", benefit: "Calms redness and regulates sebum" },
      { name: "Procerad", benefit: "Helps prevent post-acne marks and scarring" }
    ],
    alternatives: {
      budget: { name: "Salicylic Acid 2% Solution", brand: "The Ordinary", price: "£7.00", affiliateUrl: boots("The Ordinary Salicylic Acid") },
      luxury: { name: "Acne Control Clearing Treatment", brand: "Paula's Choice", price: "£37.00", affiliateUrl: boots("Paula's Choice Acne Treatment") },
      organic: { name: "Willow Bark Skin Salve", brand: "Pai Skincare", price: "£35.00", affiliateUrl: lf("Pai Skincare Willow Bark") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // POWDER (p34)
  // ════════════════════════════════════════════════════════════

  {
    id: "p34", name: "Airbrush Flawless Finish Setting Powder", brand: "Charlotte Tilbury", category: "powder",
    tags: ["setting-powder","matte","long-wear","pore-blurring","luxury"],
    description: "An ultra-fine loose setting powder that blurs, perfects and extends foundation wear all day. Micro-sieve particles fill fine lines and pores for an airbrush-like finish. Available in two shades: Fair and Medium. Humidity and sweat-proof — ideal for oily skin or long events. The finishing touch that makes makeup last 16+ hours.",
    price: "£39.00",
    image: "https://static.thcdn.com/productimg/original/14681054-1565257730307036.jpg",
    affiliateUrl: ctLink("Charlotte Tilbury Airbrush Flawless Setting Powder"),
    zones: ["t-zone","full-face"],
    suitableFor: ["oily","combination","all"],
    keyIngredients: [
      { name: "Micro-Sieve Blurring Technology", benefit: "Fills pores and fine lines for an airbrushed finish" }
    ],
    alternatives: {
      budget: { name: "Fit Me Loose Finishing Powder", brand: "Maybelline", price: "£9.99", affiliateUrl: boots("Maybelline Fit Me Loose Powder") },
      luxury: { name: "La Mer Translucent Pressed Powder", brand: "La Mer", price: "£79.00", affiliateUrl: lf("La Mer Translucent Powder") },
      organic: { name: "Mineral Loose Finishing Powder", brand: "bareMinerals", price: "£25.00", affiliateUrl: lf("bareMinerals Loose Powder") }
    },
    sponsored: true, sponsorLabel: "Charlotte Tilbury"
  },

  {
    id: "p34b", name: "Transcendence Pressed Powder", brand: "Hourglass Cosmetics", category: "powder",
    tags: ["pressed-powder","luxury","vegan","setting","glow"],
    description: "A luxurious pressed powder that sets makeup with a soft, luminous finish. The ultra-fine formula is 100% vegan and cruelty-free, made without talc, parabens or phthalates. Delivers buildable coverage and a semi-matte, natural skin finish. One of the cleanest luxury face powders available.",
    price: "£56.00",
    image: "https://static.thcdn.com/productimg/original/11219598-9215318375319099.jpg",
    affiliateUrl: sep("Hourglass Transcendence Pressed Powder"),
    zones: ["t-zone","full-face"],
    suitableFor: ["all","sensitive","oily","dry"],
    keyIngredients: [
      { name: "Talc-Free Mineral Complex", benefit: "Silky-smooth application without irritation" }
    ],
    alternatives: {
      budget: { name: "Studio Fix Powder + Foundation", brand: "MAC", price: "£28.50", affiliateUrl: lf("MAC Studio Fix Powder") },
      luxury: { name: "Airbrush Flawless Finish Setting Powder", brand: "Charlotte Tilbury", price: "£39.00", affiliateUrl: ctLink("Charlotte Tilbury Setting Powder") },
      organic: { name: "Mineral Powder Foundation", brand: "bareMinerals", price: "£28.00", affiliateUrl: lf("bareMinerals Foundation") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // BODY (p36)
  // ════════════════════════════════════════════════════════════

  {
    id: "p36", name: "Retinol Correxion Body Lotion", brand: "RoC", category: "body",
    tags: ["body","retinol","firming","anti-ageing","budget"],
    description: "A targeted body lotion that brings retinol's proven anti-ageing benefits to the body. Clinically proven to visibly reduce the appearance of cellulite, sagging and crepey skin texture on body areas prone to ageing. The fast-absorbing formula is suitable for daily use on arms, thighs, décolletage and beyond.",
    price: "£19.99",
    image: "https://static.thcdn.com/productimg/original/13447856-1825318441823951.jpg",
    affiliateUrl: boots("RoC Retinol Correxion Body Lotion"),
    zones: ["body","décolletage","arms","thighs"],
    suitableFor: ["all","mature","dry"],
    keyIngredients: [
      { name: "Stabilised Retinol", benefit: "Improves skin texture, firmness and elasticity" },
      { name: "Shea Butter", benefit: "Deeply moisturises and softens" }
    ],
    alternatives: {
      budget: { name: "Palmer's Skin Therapy Oil", brand: "Palmer's", price: "£8.99", affiliateUrl: boots("Palmers Skin Therapy Oil") },
      luxury: { name: "Body Concentrate", brand: "La Mer", price: "£125.00", affiliateUrl: lf("La Mer Body Concentrate") },
      organic: { name: "Rosehip Body Oil", brand: "Trilogy", price: "£22.00", affiliateUrl: boots("Trilogy Rosehip Body Oil") }
    }
  },

  {
    id: "p36b", name: "Firming Body Lotion", brand: "Elemis", category: "body",
    tags: ["firming","body","luxury","lifting","nourishing"],
    description: "A targeted firming lotion that visibly tightens and improves skin elasticity. Seaweed extracts and hop leaf extract work synergistically with shea butter to firm, hydrate and smooth. Clinical results show measurable improvement in skin firmness after 4 weeks. Absorbs quickly without greasiness.",
    price: "£42.00",
    image: "https://static.thcdn.com/productimg/original/15151963-6735320425073956.jpg",
    affiliateUrl: lf("Elemis Body Firm Lotion"),
    zones: ["body","thighs","abdomen","arms"],
    suitableFor: ["all","mature","dry"],
    keyIngredients: [
      { name: "Seaweed Extract", benefit: "Firms and tones skin with mineral-rich nutrients" },
      { name: "Shea Butter", benefit: "Deep nourishment and smoothing" }
    ],
    alternatives: {
      budget: { name: "Palmer's Cocoa Butter Body Lotion", brand: "Palmer's", price: "£5.99", affiliateUrl: boots("Palmers Cocoa Butter Lotion") },
      luxury: { name: "La Mer Body Lotion", brand: "La Mer", price: "£145.00", affiliateUrl: lf("La Mer Body Lotion") },
      organic: { name: "Organic Body Oil", brand: "Pai Skincare", price: "£38.00", affiliateUrl: lf("Pai Body Oil") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // EYESHADOW (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p38", name: "Smokey Eye Palette", brand: "Charlotte Tilbury", category: "eyeshadow",
    tags: ["eyeshadow","smoky","luxury","palette","wearable"],
    description: "Charlotte's signature palette featuring a curated range of warm neutrals, deep smokes and illuminating shimmers. Each shade is expertly formulated to blend effortlessly, with long-wearing pigments that resist creasing. The universally flattering colour story creates Charlotte's iconic smoky eye in minutes — for day drama or night glamour.",
    price: "£55.00",
    image: "https://static.thcdn.com/productimg/original/13313677-1694896607551432.jpg",
    affiliateUrl: ctLink("Charlotte Tilbury Smokey Eye Palette"),
    zones: ["eyes"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Long-Wear Pigment Complex", benefit: "12-hour colour payoff without creasing" }
    ],
    alternatives: {
      budget: { name: "Urban Decay Basics Palette", brand: "Urban Decay", price: "£19.00", affiliateUrl: sep("Urban Decay Basics Palette") },
      luxury: { name: "Narsissist Wanted Eyeshadow Palette", brand: "NARS", price: "£58.00", affiliateUrl: lf("NARS Eyeshadow Palette") },
      organic: { name: "Mineral Eyeshadow Palette", brand: "bareMinerals", price: "£34.00", affiliateUrl: lf("bareMinerals Eyeshadow Palette") }
    }
  },

  {
    id: "p39", name: "Naked3 Eyeshadow Palette", brand: "Urban Decay", category: "eyeshadow",
    tags: ["eyeshadow","rose-gold","neutral","wearable","long-wear"],
    description: "A 12-pan rose-gold neutral palette that became a global phenomenon. Buttery formulas in matte, satin and shimmer finishes deliver buildable colour payoff. The rosy-warm tones complement all eye colours and skin tones. Includes shades from champagne sheers to deep burgundies for versatile everyday to evening looks.",
    price: "£43.00",
    image: "https://static.thcdn.com/productimg/original/11560452-2095322793640130.jpg",
    affiliateUrl: sep("Urban Decay Naked3 Eyeshadow Palette"),
    zones: ["eyes"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Polybutene Blend", benefit: "Smooth application and long-wear adhesion" }
    ],
    alternatives: {
      budget: { name: "Revolution Re-Loaded Palette", brand: "Revolution", price: "£8.00", affiliateUrl: boots("Revolution Eyeshadow Palette") },
      luxury: { name: "Eye Palette", brand: "Tom Ford Beauty", price: "£94.00", affiliateUrl: lf("Tom Ford Eye Palette") },
      organic: { name: "Eyeshadow Quad", brand: "ILIA", price: "£38.00", affiliateUrl: sep("ILIA Eyeshadow Quad") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // MASCARA (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p40", name: "Better Than Sex Mascara", brand: "Too Faced", category: "mascara",
    tags: ["mascara","volumising","lengthening","long-wear","bestseller"],
    description: "The world's bestselling mascara — and the name says it all. A film-forming formula with a unique hourglass-shaped brush that wraps each lash in intense black pigment, delivering immediate volume and length. Buildable from natural to dramatic. Collagen-infused for flexible, flexible, all-day wear without clumping or flaking.",
    price: "£28.00",
    image: "https://static.thcdn.com/productimg/original/10949847-8885320553285145.jpg",
    affiliateUrl: sep("Too Faced Better Than Sex Mascara"),
    zones: ["eyes"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Collagen-Infused Formula", benefit: "Flexible, non-flaking wear all day" },
      { name: "Film-Forming Polymers", benefit: "Intense colour and volume payoff" }
    ],
    alternatives: {
      budget: { name: "Lash Sensational Multiplying Effect Mascara", brand: "Maybelline", price: "£10.99", affiliateUrl: boots("Maybelline Lash Sensational Mascara") },
      luxury: { name: "Hypnôse Mascara", brand: "Lancôme", price: "£31.00", affiliateUrl: lf("Lancome Hypnose Mascara") },
      organic: { name: "Lengthening Mascara", brand: "ILIA", price: "£28.00", affiliateUrl: sep("ILIA Mascara") }
    },
    bestSeller: true
  },

  {
    id: "p41", name: "Lash Paradise Mascara", brand: "L'Oréal Paris", category: "mascara",
    tags: ["mascara","volumising","budget","wand","feathery"],
    description: "A voluminising mascara that delivers salon-worthy lashes at a drugstore price. The oversized, dome-shaped wand is packed with over 200 bristles to catch every lash and load on product for maximum volume. Soft, feathery lashes without clumping — buildable from natural to full glam. Consistently beats luxury competitors in blind tests.",
    price: "£13.99",
    image: "https://static.thcdn.com/productimg/original/15009389-1115256171455859.jpg",
    affiliateUrl: boots("L'Oreal Paris Lash Paradise Mascara"),
    zones: ["eyes"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Rose Extract", benefit: "Conditions lashes during wear" },
      { name: "Vitamin E", benefit: "Antioxidant nourishment for lash health" }
    ],
    alternatives: {
      budget: { name: "Colossal Mascara", brand: "Maybelline", price: "£10.99", affiliateUrl: boots("Maybelline Colossal Mascara") },
      luxury: { name: "Better Than Sex Mascara", brand: "Too Faced", price: "£28.00", affiliateUrl: sep("Too Faced Better Than Sex Mascara") },
      organic: { name: "Clean Lash Mascara", brand: "Ere Perez", price: "£20.00", affiliateUrl: lf("Ere Perez Mascara") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // BROW (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p42", name: "Precisely, My Brow Pencil", brand: "Benefit Cosmetics", category: "brow",
    tags: ["brow","defining","micro-tip","buildable","long-wear"],
    description: "A ultra-fine brow pencil with a micro-precision tip that replicates individual hair strokes for a natural, filled-in look. The angled micro-tip allows for precise, controlled application and buildable intensity — from barely-there definition to bold, sculpted arches. Includes a spoolie to blend and groom.",
    price: "£25.50",
    image: "https://static.thcdn.com/productimg/original/11277199-9755231050659726.jpg",
    affiliateUrl: boots("Benefit Precisely My Brow Pencil"),
    zones: ["brows"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Micro-Wax Binder", benefit: "Hair-like strokes that stay in place all day" }
    ],
    alternatives: {
      budget: { name: "Brow Maker Pencil", brand: "Maybelline", price: "£7.99", affiliateUrl: boots("Maybelline Brow Pencil") },
      luxury: { name: "Arch & Define Brow Pencil", brand: "Charlotte Tilbury", price: "£28.00", affiliateUrl: ctLink("Charlotte Tilbury Brow Pencil") },
      organic: { name: "Brow Tint", brand: "Ere Perez", price: "£24.00", affiliateUrl: lf("Ere Perez Brow Tint") }
    }
  },

  {
    id: "p43", name: "Soap Brow", brand: "Esum", category: "brow",
    tags: ["brow","soap","lamination","setting","affordable"],
    description: "The OG brow soap that launched the laminated-brow trend. Creates the brushed-up, fluffy brow look without the permanent commitment of brow lamination. Simply wet the spoolie and swipe through the clear soap, then brush hairs upward. Holds all day. The professional secret weapon that costs a fraction of in-salon brow treatments.",
    price: "£18.00",
    image: "https://static.thcdn.com/productimg/original/15810719-1735323806847041.jpg",
    affiliateUrl: cult("Soap Brow lamination"),
    zones: ["brows"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Glycerine-Based Soap", benefit: "Provides hold without stiffness or flaking" }
    ],
    alternatives: {
      budget: { name: "Clear Brow Gel", brand: "e.l.f. Cosmetics", price: "£6.00", affiliateUrl: boots("elf Clear Brow Gel") },
      luxury: { name: "Grooming Service Brow Gel", brand: "Charlotte Tilbury", price: "£26.00", affiliateUrl: ctLink("Charlotte Tilbury Brow Gel") },
      organic: { name: "Natural Brow Shaper", brand: "Ere Perez", price: "£18.00", affiliateUrl: lf("Ere Perez Brow Shaper") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // EYELINER (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p44", name: "Pro Longwear Waterproof Eyeliner", brand: "MAC", category: "eyeliner",
    tags: ["eyeliner","waterproof","long-wear","kohl","smudge-proof"],
    description: "MAC's most reliable waterproof eyeliner — a professional staple that withstands sweat, tears and humidity. The ultra-smooth, kohl formula glides on effortlessly and sets to a long-wearing finish that won't budge. Available in shades from carbon black to navy, deep plum and bronze. Sharpens to a precision point for tight-line or flick application.",
    price: "£20.00",
    image: "https://static.thcdn.com/productimg/original/11471155-6365322232255758.jpg",
    affiliateUrl: lf("MAC Pro Longwear Waterproof Eyeliner"),
    zones: ["eyes"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Waterproof Film", benefit: "Locks colour in place even in heat and humidity" }
    ],
    alternatives: {
      budget: { name: "Scandal Eyes Liner", brand: "Rimmel", price: "£5.99", affiliateUrl: boots("Rimmel Scandal Eyes Liner") },
      luxury: { name: "Crayon Khôl", brand: "Chanel Beauty", price: "£27.00", affiliateUrl: lf("Chanel Crayon Khol") },
      organic: { name: "Clean Kajal Eyeliner", brand: "Ere Perez", price: "£22.00", affiliateUrl: lf("Ere Perez Kajal Eyeliner") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // MIST / SETTING SPRAY (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p45", name: "Fix+ Makeup Setting Spray", brand: "MAC", category: "setting-spray",
    tags: ["setting-spray","long-wear","hydrating","natural-finish","staple"],
    description: "The professional's setting spray of choice. A weightless mist of green tea, chamomile and cucumber that locks makeup in place and adds a dewy, skin-like finish. Also works as a hydrating face mist, brush cleaner or mixing medium for powder products. The final step in every makeup artist's kit worldwide.",
    price: "£24.50",
    image: "https://static.thcdn.com/productimg/original/15361331-1225326721820939.jpg",
    affiliateUrl: lf("MAC Fix+ Setting Spray"),
    zones: ["full-face"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Green Tea Extract", benefit: "Antioxidant and soothing properties" },
      { name: "Cucumber Extract", benefit: "Hydrates and cools on application" }
    ],
    alternatives: {
      budget: { name: "All Nighter Long Lasting Makeup Setting Spray", brand: "Urban Decay", price: "£31.00", affiliateUrl: sep("Urban Decay All Nighter Setting Spray") },
      luxury: { name: "The Setting Spray", brand: "Charlotte Tilbury", price: "£28.00", affiliateUrl: ctLink("Charlotte Tilbury Setting Spray") },
      organic: { name: "Hydra-Mist Set & Refresh Spray", brand: "NYX Professional Makeup", price: "£12.00", affiliateUrl: boots("NYX Setting Spray") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // EXFOLIANT (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p46", name: "Daily Microfoliant 74g", brand: "Dermalogica", category: "exfoliant",
    tags: ["exfoliant","gentle","brightening","enzyme","daily"],
    description: "A rice bran-based daily exfoliating powder that activates upon contact with water. Salicylic acid, papain and phytic acid work together to gently resurface skin with each use, revealing brighter and smoother skin. The innovative powder format allows you to control the intensity. Suitable for daily use even on sensitised skin.",
    price: "£64.00",
    image: "https://static.thcdn.com/productimg/original/11480968-1895131029041412.jpg",
    affiliateUrl: lf("Dermalogica Daily Microfoliant"),
    zones: ["full-face"],
    suitableFor: ["all","sensitive","combination","dry"],
    keyIngredients: [
      { name: "Rice Bran Enzyme", benefit: "Gentle brightening exfoliation for daily use" },
      { name: "Salicylic Acid", benefit: "Unclogs pores and smooths texture" },
      { name: "Phytic Acid", benefit: "Inhibits excess melanin for brighter skin" }
    ],
    alternatives: {
      budget: { name: "Glycolic Acid 7% Toning Solution", brand: "The Ordinary", price: "£11.80", affiliateUrl: boots("The Ordinary Glycolic Acid Toning") },
      luxury: { name: "Power Peel Facial Resurfacing System", brand: "Elemis", price: "£135.00", affiliateUrl: lf("Elemis Power Peel") },
      organic: { name: "Bamboo & Charcoal Polishing Powder", brand: "Bamford", price: "£36.00", affiliateUrl: amz("Bamford Polishing Powder") }
    }
  },

  {
    id: "p47", name: "AHA 30% + BHA 2% Peeling Solution 30ml", brand: "The Ordinary", category: "exfoliant",
    tags: ["AHA","BHA","chemical-peel","brightening","budget"],
    description: "The viral red solution that sold out globally within days of launch. A professional-grade 30% AHA (glycolic, lactic, tartaric and citric acids) combined with 2% BHA exfoliates both the skin surface and inside pores. Results are visible after a single 10-minute use. Use weekly — not daily — to avoid over-exfoliation.",
    price: "£8.70",
    image: "https://static.thcdn.com/productimg/original/11429304-6155328245430621.jpg",
    affiliateUrl: boots("The Ordinary AHA 30% BHA 2% Peeling Solution"),
    zones: ["full-face"],
    suitableFor: ["oily","combination","hyperpigmentation","experienced-users"],
    keyIngredients: [
      { name: "Glycolic Acid 30% AHA Blend", benefit: "Surface exfoliation for brightness and texture" },
      { name: "Salicylic Acid 2% BHA", benefit: "Deep pore exfoliation and blackhead removal" },
      { name: "Hyaluronic Acid", benefit: "Counteracts dryness post-exfoliation" }
    ],
    alternatives: {
      budget: { name: "Glycolic Acid Toning Pads", brand: "Revolution Skincare", price: "£7.00", affiliateUrl: boots("Revolution Skincare Glycolic Pads") },
      luxury: { name: "Skin Perfecting 8% AHA Gel", brand: "Paula's Choice", price: "£33.00", affiliateUrl: boots("Paula's Choice AHA Gel") },
      organic: { name: "Glycolic Facial Exfoliator", brand: "REN Clean Skincare", price: "£32.00", affiliateUrl: lf("REN Glycolic Exfoliator") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // SUNSCREEN / SPF (additional)
  // ════════════════════════════════════════════════════════════

  {
    id: "p48", name: "Invisible Shield Daily Mineral SPF35", brand: "Youth To The People", category: "spf",
    tags: ["mineral","SPF35","clean","no-white-cast","antioxidant"],
    description: "A clean-formula mineral SPF that absorbs invisibly without the chalky finish of traditional mineral sunscreens. Powered by hyaluronic acid, superberry extracts and an antioxidant blend. Reef-safe and free from oxybenzone, octinoxate and avobenzone. Perfect for clean beauty enthusiasts who want effective sun protection.",
    price: "£38.00",
    image: "https://static.thcdn.com/productimg/original/15237890-1495319192747264.jpg",
    affiliateUrl: sep("Youth To The People Invisible Shield SPF35"),
    zones: ["full-face"],
    suitableFor: ["all","sensitive","clean-beauty"],
    keyIngredients: [
      { name: "Zinc Oxide (Mineral)", benefit: "Broad-spectrum UVA/UVB protection" },
      { name: "Hyaluronic Acid", benefit: "Hydrates under the SPF layer" },
      { name: "Superberry Blend", benefit: "Antioxidant defence against free radicals" }
    ],
    alternatives: {
      budget: { name: "Anthelios UVMune 400 SPF50+", brand: "La Roche-Posay", price: "£20.00", affiliateUrl: boots("La Roche-Posay Anthelios SPF50") },
      luxury: { name: "Unseen Sunscreen SPF40", brand: "Supergoop!", price: "£38.00", affiliateUrl: sep("Supergoop Unseen Sunscreen") },
      organic: { name: "Green Screen SPF30", brand: "Aether Beauty", price: "£36.00", affiliateUrl: amz("Aether Beauty Green Screen") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // FRAGRANCE / BODY MIST (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p49", name: "Flowerbomb EDP 50ml", brand: "Viktor & Rolf", category: "fragrance",
    tags: ["fragrance","floral","luxury","signature","bestseller"],
    description: "One of the world's bestselling feminine fragrances. An explosive bouquet of jasmine, rose, freesia, cattleya orchid and patchouli — rich, warm and addictive. The iconic grenade-shaped bottle has become a collector's piece. Wear it layered with the matching shower gel and body lotion for an all-day fragrance experience.",
    price: "£78.00",
    image: "https://static.thcdn.com/productimg/original/12740377-1525318376323394.jpg",
    affiliateUrl: lf("Viktor Rolf Flowerbomb EDP"),
    zones: ["pulse-points"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Jasmine Sambac", benefit: "Romantic, heady floral heart" },
      { name: "Rose de Mai", benefit: "Premium May rose absolute" },
      { name: "Patchouli", benefit: "Warm, earthy base that extends longevity" }
    ],
    alternatives: {
      budget: { name: "Miss Dior Blooming Bouquet EDT", brand: "Dior", price: "£55.00", affiliateUrl: lf("Dior Miss Dior Blooming Bouquet") },
      luxury: { name: "N°5 L'EAU Spray", brand: "Chanel", price: "£108.00", affiliateUrl: lf("Chanel No5 LEau") },
      organic: { name: "Wild Rose Body Wash", brand: "Dr. Hauschka", price: "£19.95", affiliateUrl: boots("Dr Hauschka Wild Rose") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // CONTOUR / BRONZER (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p50", name: "Hoola Matte Bronzer", brand: "Benefit Cosmetics", category: "bronzer",
    tags: ["bronzer","matte","contour","buildable","classic"],
    description: "The bronzer that taught the world how to contour. A matte, skin-like bronzer with a finely-milled powder that blends seamlessly without patchiness. Available in four shades to suit all skin tones. The classic round pot with oversized brush is a beauty icon. Use to add warmth, depth and dimension to the face.",
    price: "£32.50",
    image: "https://static.thcdn.com/productimg/original/12434491-1895325378749250.jpg",
    affiliateUrl: boots("Benefit Hoola Matte Bronzer"),
    zones: ["cheekbones","forehead","jawline","temples"],
    suitableFor: ["all","fair","medium"],
    keyIngredients: [
      { name: "Ultra-Fine Matte Pigments", benefit: "Natural-looking warmth without shimmer" }
    ],
    alternatives: {
      budget: { name: "Bourjois Délice de Poudre Bronzer", brand: "Bourjois", price: "£9.99", affiliateUrl: boots("Bourjois Bronzer") },
      luxury: { name: "Guerlain Terracotta Bronzing Powder", brand: "Guerlain", price: "£45.00", affiliateUrl: lf("Guerlain Terracotta Bronzing Powder") },
      organic: { name: "Bronzing Baked Powder", brand: "Jane Iredale", price: "£43.00", affiliateUrl: lf("Jane Iredale Bronzing Powder") }
    },
    bestSeller: true
  },

  {
    id: "p51", name: "Sun Stalk'r Instant Warmth Bronzer", brand: "Fenty Beauty", category: "bronzer",
    tags: ["bronzer","inclusive","buildable","deeper-tones","natural"],
    description: "A fan-favourite bronzer formulated to work across the full spectrum of skin tones — from the palest ivory to the richest ebony. The buttery, blendable formula delivers natural-looking warmth without ashiness on darker tones. Six shades, each with a warm undertone that mimics sun-kissed skin. Finely-milled and buildable.",
    price: "£28.00",
    image: "https://static.thcdn.com/productimg/original/15654112-1545257480917234.jpg",
    affiliateUrl: sep("Fenty Beauty Sun Stalker Bronzer"),
    zones: ["cheekbones","temples","forehead","jawline"],
    suitableFor: ["all","deeper-tones","medium"],
    keyIngredients: [
      { name: "Skin-Tone-True Pigments", benefit: "Warm tones calibrated to avoid ashiness" }
    ],
    alternatives: {
      budget: { name: "Barry M Cosmetics Bronzing Powder", brand: "Barry M", price: "£5.49", affiliateUrl: boots("Barry M Bronzer") },
      luxury: { name: "Hoola Matte Bronzer", brand: "Benefit Cosmetics", price: "£32.50", affiliateUrl: boots("Benefit Hoola Bronzer") },
      organic: { name: "Mineral Bronzer", brand: "bareMinerals", price: "£30.00", affiliateUrl: lf("bareMinerals Bronzer") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // LIP GLOSS (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p52", name: "Lipsync Gloss — Pillow Talk", brand: "Charlotte Tilbury", category: "lip",
    tags: ["lip-gloss","pillow-talk","plumping","glossy","luxury"],
    description: "A high-shine, plumping lip gloss in the iconic Pillow Talk shade. The comfortable formula delivers a juicy, full-lipped look with a hint of rose-pink tint and light-reflecting shimmer particles. Formulated with hyaluronic acid and collagen to hydrate and visibly plump lips over time. Packaging doubles as a mirror.",
    price: "£28.00",
    image: "https://static.thcdn.com/productimg/original/17165067-7005274316245756.jpg",
    affiliateUrl: ctLink("Charlotte Tilbury Lipsync Gloss Pillow Talk"),
    zones: ["lips"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Hyaluronic Acid", benefit: "Plumps and hydrates lips during wear" },
      { name: "Light-Reflect Complex", benefit: "Creates a high-shine, full-lip illusion" }
    ],
    alternatives: {
      budget: { name: "Lip Injection Extreme Lip Plumper", brand: "Too Faced", price: "£19.00", affiliateUrl: sep("Too Faced Lip Injection") },
      luxury: { name: "Dior Addict Lip Maximizer", brand: "Dior", price: "£30.00", affiliateUrl: lf("Dior Addict Lip Maximizer") },
      organic: { name: "Glossy Lip Balm", brand: "ILIA", price: "£26.00", affiliateUrl: sep("ILIA Lip Gloss") }
    },
    bestSeller: true
  },

  // ════════════════════════════════════════════════════════════
  // VITAMIN C BRIGHTENING (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p53", name: "Super Glow Serum SPF30", brand: "Charlotte Tilbury", category: "serum",
    tags: ["vitamin-c","SPF","glow","brightening","luxury"],
    description: "A two-in-one brightening serum and SPF30 that reduces dark spots while protecting against further UV-induced pigmentation. Stabilised vitamin C combined with retinol-alternative bakuchiol works synergistically to even skin tone. Lightweight texture and a subtle luminous finish make this the ideal daily serum-SPF hybrid.",
    price: "£54.00",
    image: "https://static.thcdn.com/productimg/original/17638978-8095316825438463.jpg",
    affiliateUrl: ctLink("Charlotte Tilbury Super Glow Serum SPF30"),
    zones: ["full-face"],
    suitableFor: ["all","dull","hyperpigmentation","mature"],
    keyIngredients: [
      { name: "Stable Vitamin C", benefit: "Brightens and evens skin tone" },
      { name: "Bakuchiol", benefit: "Natural retinol alternative for gentle anti-ageing" },
      { name: "SPF30 Filters", benefit: "Prevents new UV-induced pigmentation" }
    ],
    alternatives: {
      budget: { name: "CEO Vitamin C Serum", brand: "Sunday Riley", price: "£85.00", affiliateUrl: lf("Sunday Riley CEO Vitamin C") },
      luxury: { name: "C E Ferulic Serum", brand: "SkinCeuticals", price: "£166.00", affiliateUrl: lf("SkinCeuticals CE Ferulic") },
      organic: { name: "Vitamin C Beauty Fluid", brand: "Pai Skincare", price: "£39.00", affiliateUrl: lf("Pai Vitamin C") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // HAIR / SCALP (new — beauty adjacent)
  // ════════════════════════════════════════════════════════════

  {
    id: "p54", name: "Olaplex No.3 Hair Perfector 100ml", brand: "Olaplex", category: "hair",
    tags: ["hair","bond-repair","treatment","damaged","professional"],
    description: "The at-home treatment from the professional bond-building system used in salons worldwide. A weekly pre-shampoo treatment that reconnects broken disulfide bonds in the hair structure to improve strength and reduce breakage. Clinically proven to reduce damage and transform hair health in as few as three uses. The gold standard of hair repair.",
    price: "£28.00",
    image: "https://static.thcdn.com/productimg/original/17649955-8275313218407536.jpg",
    affiliateUrl: cult("Olaplex No 3 Hair Perfector"),
    zones: ["hair"],
    suitableFor: ["all","damaged","colour-treated","bleached"],
    keyIngredients: [
      { name: "Bis-Aminopropyl Diglycol Dimaleate", benefit: "Rebuilds broken disulfide bonds in hair" }
    ],
    alternatives: {
      budget: { name: "Bondoran Hair Oil Treatment", brand: "Redken", price: "£18.50", affiliateUrl: lf("Redken Bond Repair Treatment") },
      luxury: { name: "Hair Serum Silk Infusion", brand: "Sisley", price: "£170.00", affiliateUrl: lf("Sisley Hair Serum") },
      organic: { name: "Repair & Restore Argan Oil", brand: "OGX", price: "£8.99", affiliateUrl: boots("OGX Argan Oil") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // SHEET MASK (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p55", name: "Pure Source Sheet Mask — Hyaluronic Acid", brand: "Garnier", category: "mask",
    tags: ["sheet-mask","budget","hydration","hyaluronic-acid","instant"],
    description: "A budget-hero sheet mask that delivers visible hydration in just 15 minutes. Saturated with a hyaluronic acid serum, the cellulose bio-material sheet adheres to every contour of the face for maximum ingredient absorption. Skin is visibly plumper and glowing immediately after. An accessible introduction to the Korean sheet mask ritual.",
    price: "£3.99",
    image: "https://static.thcdn.com/productimg/original/11919605-5945290381168359.jpg",
    affiliateUrl: boots("Garnier Pure Source Sheet Mask Hyaluronic Acid"),
    zones: ["full-face"],
    suitableFor: ["all","dry","dehydrated"],
    keyIngredients: [
      { name: "Hyaluronic Acid", benefit: "Instant plumping and hydration" }
    ],
    alternatives: {
      budget: { name: "Essence Sheet Mask", brand: "COSRX", price: "£4.00", affiliateUrl: amz("COSRX Sheet Mask") },
      luxury: { name: "Pearl Infusion Mask", brand: "SK-II", price: "£15.00", affiliateUrl: lf("SK-II Pearl Infusion Mask") },
      organic: { name: "Organic Cotton Sheet Mask", brand: "Antipodes", price: "£9.00", affiliateUrl: lf("Antipodes Sheet Mask") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // COLOUR CORRECTION (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p56", name: "Pure Color Envy Sculpting Blush 7g", brand: "Estée Lauder", category: "blush",
    tags: ["blush","sculpting","buildable","long-wear","luxury"],
    description: "A sophisticated sculpting blush with a unique pressed texture that delivers buildable colour with a velvety finish. The universally flattering shades blend and layer seamlessly for precise cheek definition. Infused with skin-conditioning ingredients for a comfortable, all-day wear experience.",
    price: "£38.00",
    image: "https://static.thcdn.com/productimg/original/11141180-3835252042107449.jpg",
    affiliateUrl: lf("Estee Lauder Pure Color Envy Blush"),
    zones: ["cheeks"],
    suitableFor: ["all","dry","mature"],
    keyIngredients: [
      { name: "Skin-Conditioning Complex", benefit: "Comfortable all-day blush wear" }
    ],
    alternatives: {
      budget: { name: "NARS Orgasm Blush", brand: "NARS", price: "£30.00", affiliateUrl: lf("NARS Orgasm Blush") },
      luxury: { name: "Blush Harmony Palette", brand: "Tom Ford Beauty", price: "£68.00", affiliateUrl: lf("Tom Ford Blush Harmony") },
      organic: { name: "Multi-Use Dew Pot", brand: "Glossier", price: "£20.00", affiliateUrl: amz("Glossier Multi-Use Dew Pot") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // FACE OIL (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p57", name: "Rosehip BioRegenerate Oil", brand: "REN Clean Skincare", category: "serum",
    tags: ["face-oil","rosehip","clean","anti-ageing","dry"],
    description: "A clean, cold-pressed rosehip oil that delivers a potent dose of omega fatty acids and natural retinol precursors (trans-retinoic acid esters). Proven to reduce fine lines, dark spots and improve skin elasticity. 100% organic rosehip cold-pressed oil in its purest form — maximum efficacy, zero unnecessary ingredients.",
    price: "£38.00",
    image: "https://static.thcdn.com/productimg/original/10528440-9815323031407323.jpg",
    affiliateUrl: lf("REN Clean Skincare Rosehip BioRegenerate Oil"),
    zones: ["full-face","neck"],
    suitableFor: ["dry","mature","sensitive","normal"],
    keyIngredients: [
      { name: "Cold-Pressed Rosehip Oil", benefit: "Omega fatty acids restore elasticity and glow" },
      { name: "Trans-Retinoic Acid Esters", benefit: "Natural vitamin A activity for anti-ageing" }
    ],
    alternatives: {
      budget: { name: "Rosehip Seed Oil", brand: "The Ordinary", price: "£10.00", affiliateUrl: boots("The Ordinary Rosehip Oil") },
      luxury: { name: "Midnight Recovery Concentrate", brand: "Kiehl's", price: "£51.00", affiliateUrl: lf("Kiehls Midnight Recovery Concentrate") },
      organic: { name: "Organic Rosehip Oil", brand: "Trilogy", price: "£24.00", affiliateUrl: boots("Trilogy Rosehip Oil") }
    }
  },

  {
    id: "p58", name: "Facial Dry Oil 30ml", brand: "Clarins", category: "serum",
    tags: ["face-oil","dry-oil","glow","non-greasy","luxury"],
    description: "A luxurious, multi-benefiting dry facial oil that absorbs instantly without any greasiness. A blend of plant-based oils including hazelnut, jojoba and camellia nourishes and replenishes while leaving skin with a lit-from-within satin finish. Use alone as a night treatment, or blend with moisturiser for a daily glow boost.",
    price: "£39.00",
    image: "https://static.thcdn.com/productimg/original/11798688-6525322246259146.jpg",
    affiliateUrl: lf("Clarins Facial Dry Oil"),
    zones: ["full-face","neck"],
    suitableFor: ["dry","normal","mature","dull"],
    keyIngredients: [
      { name: "Hazelnut Oil", benefit: "Nourishes and protects without greasiness" },
      { name: "Jojoba Oil", benefit: "Regulates natural oil production" },
      { name: "Camellia Oil", benefit: "Softens and adds radiance" }
    ],
    alternatives: {
      budget: { name: "Rosehip Oil", brand: "The Ordinary", price: "£10.00", affiliateUrl: boots("The Ordinary Rosehip Oil") },
      luxury: { name: "Huile Prodigieuse", brand: "Nuxe", price: "£40.00", affiliateUrl: boots("Nuxe Huile Prodigieuse") },
      organic: { name: "Rosehip BioRegenerate Oil", brand: "REN Clean Skincare", price: "£38.00", affiliateUrl: lf("REN Rosehip Oil") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // VITAMIN C SERUM ADDITIONAL
  // ════════════════════════════════════════════════════════════

  {
    id: "p59", name: "Brightening Vitamin C Serum 30ml", brand: "Medik8", category: "serum",
    tags: ["vitamin-c","stable","professional","brightening","anti-ageing"],
    description: "A professional-grade vitamin C serum formulated for maximum stability. The innovative oil-soluble form of vitamin C (tetrahexyldecyl ascorbate) penetrates deeper than standard ascorbic acid, providing superior brightening and antioxidant protection. 30% concentration delivers measurable results in fine lines and dark spots within 4 weeks.",
    price: "£55.00",
    image: "https://static.thcdn.com/productimg/original/11795619-6425323839366129.jpg",
    affiliateUrl: lf("Medik8 Vitamin C Serum"),
    zones: ["full-face"],
    suitableFor: ["all","dull","mature","hyperpigmentation"],
    keyIngredients: [
      { name: "THD Ascorbate 30%", benefit: "Deep-penetrating oil-soluble vitamin C" },
      { name: "Vitamin E", benefit: "Synergistic antioxidant protection" }
    ],
    alternatives: {
      budget: { name: "CEO Vitamin C Rich Resurfacing Treatment", brand: "Sunday Riley", price: "£85.00", affiliateUrl: lf("Sunday Riley CEO Vitamin C") },
      luxury: { name: "C E Ferulic Serum", brand: "SkinCeuticals", price: "£166.00", affiliateUrl: lf("SkinCeuticals CE Ferulic") },
      organic: { name: "C-Firma Fresh Day Serum", brand: "Drunk Elephant", price: "£80.00", affiliateUrl: cult("Drunk Elephant C-Firma") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // PEPTIDE / ANTI-AGEING ADVANCED
  // ════════════════════════════════════════════════════════════

  {
    id: "p60", name: "Multi-Peptide Booster 30ml", brand: "Huxley", category: "serum",
    tags: ["peptides","anti-ageing","firming","Korean","luxury"],
    description: "A high-performance peptide serum from Korean clean beauty brand Huxley, formulated with nine types of collagen-stimulating peptides. Targets multiple signs of ageing simultaneously — fine lines, loss of firmness and uneven texture — with visible results in 4 weeks. The lightweight, fast-absorbing formula is suitable for all skin types.",
    price: "£42.00",
    image: "https://static.thcdn.com/productimg/original/17538813-1975324587011972.jpg",
    affiliateUrl: amz("Huxley Multi-Peptide Serum"),
    zones: ["full-face","neck"],
    suitableFor: ["all","mature","normal","dry"],
    keyIngredients: [
      { name: "9-Peptide Complex", benefit: "Multi-target collagen stimulation and firming" }
    ],
    alternatives: {
      budget: { name: "Matrixyl 10% + HA Serum", brand: "The Ordinary", price: "£12.80", affiliateUrl: boots("The Ordinary Matrixyl") },
      luxury: { name: "Pro-Filler Serum", brand: "Clarins", price: "£75.00", affiliateUrl: lf("Clarins Pro Filler Serum") },
      organic: { name: "Youth Activating Oil", brand: "Pai Skincare", price: "£44.00", affiliateUrl: lf("Pai Youth Activating Oil") }
    }
  },

  {
    id: "p61", name: "Instant Plump Serum 30ml", brand: "Elemis", category: "serum",
    tags: ["plumping","hyaluronic-acid","anti-ageing","luxury","firming"],
    description: "A next-generation hyaluronic acid serum that harnesses four different molecular weights of hyaluronic acid plus bio-fermented hyaluronic acid for unparalleled multi-depth hydration. Clinical trials show a visible reduction in the depth of wrinkles in 24 hours. Skin appears visibly plumper, smoother and more youthful.",
    price: "£75.00",
    image: "https://static.thcdn.com/productimg/original/14843751-1535222193400986.jpg",
    affiliateUrl: lf("Elemis Pro-Collagen Instant Plump Serum"),
    zones: ["full-face","neck"],
    suitableFor: ["dry","mature","dehydrated","all"],
    keyIngredients: [
      { name: "Hyaluronic Acid (4 weights)", benefit: "Multi-depth hydration from surface to deep dermis" },
      { name: "Bio-Fermented HA", benefit: "Enhanced bioavailability and skin penetration" }
    ],
    alternatives: {
      budget: { name: "Hyaluronic Acid 2% + B5", brand: "The Ordinary", price: "£7.90", affiliateUrl: boots("The Ordinary Hyaluronic Acid") },
      luxury: { name: "Advanced Night Repair Serum", brand: "Estée Lauder", price: "£100.00", affiliateUrl: lf("Estee Lauder ANR Serum") },
      organic: { name: "Hydra Vit C Serum", brand: "OSEA", price: "£52.00", affiliateUrl: amz("OSEA Hydra Vit C") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // SKINCARE TOOLS (new)
  // ════════════════════════════════════════════════════════════

  {
    id: "p62", name: "NuFACE Trinity Facial Toning Device", brand: "NuFACE", category: "tool",
    tags: ["microcurrent","lifting","toning","anti-ageing","device"],
    description: "The world's leading microcurrent facial toning device, FDA-cleared and clinically proven. Sends low-level electrical currents through the skin to tone, lift and contour — the effect has been described as a non-invasive facelift. 5-minute daily treatment shows visible results in 60 days. The device endorsed by A-list celebrities and dermatologists worldwide.",
    price: "£319.00",
    image: "https://static.thcdn.com/productimg/original/13837547-1765319172745928.jpg",
    affiliateUrl: lf("NuFACE Trinity Facial Toning Device"),
    zones: ["jawline","cheeks","forehead","neck"],
    suitableFor: ["mature","all"],
    keyIngredients: [
      { name: "Microcurrent Technology", benefit: "Re-educates facial muscles for a lifted appearance" }
    ],
    alternatives: {
      budget: { name: "Gua Sha Tool", brand: "Mount Lai", price: "£38.00", affiliateUrl: amz("Mount Lai Gua Sha") },
      luxury: { name: "ZIIP GX Electrical Facial Device", brand: "ZIIP", price: "£425.00", affiliateUrl: amz("ZIIP GX Device") },
      organic: { name: "Jade Roller", brand: "Herbivore", price: "£30.00", affiliateUrl: amz("Herbivore Jade Roller") }
    }
  },

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL SKINCARE ESSENTIALS
  // ════════════════════════════════════════════════════════════

  {
    id: "p63", name: "Barrier Restore Serum 30ml", brand: "Paula's Choice", category: "serum",
    tags: ["barrier","ceramides","peptides","soothing","repair"],
    description: "A restorative serum that repairs a compromised skin barrier after over-exfoliation, harsh cleansers or environmental stress. A trio of ceramides, peptides and fatty acids rebuilds the skin's defensive layer while soothing redness and tightness. Essential for anyone using actives (retinoids, AHAs, BHAs) in their routine.",
    price: "£49.00",
    image: "https://static.thcdn.com/productimg/original/13310310-1305177668937349.jpg",
    affiliateUrl: boots("Paula's Choice Barrier Restore Serum"),
    zones: ["full-face"],
    suitableFor: ["sensitive","compromised-barrier","dry","all"],
    keyIngredients: [
      { name: "Ceramide Complex", benefit: "Rebuilds the skin barrier at the cellular level" },
      { name: "Peptide Blend", benefit: "Signals skin to produce more barrier lipids" },
      { name: "Oat Extract", benefit: "Soothes inflammation and redness" }
    ],
    alternatives: {
      budget: { name: "CeraVe Moisturising Cream", brand: "CeraVe", price: "£14.00", affiliateUrl: boots("CeraVe Moisturising Cream") },
      luxury: { name: "Cicaplast Baume B5 SPF50", brand: "La Roche-Posay", price: "£15.50", affiliateUrl: boots("La Roche-Posay Cicaplast Baume B5") },
      organic: { name: "Instant Calm Redness Serum", brand: "Pai Skincare", price: "£49.00", affiliateUrl: lf("Pai Skincare Redness Serum") }
    }
  },

  {
    id: "p64", name: "Cicaplast Baume B5+ 100ml", brand: "La Roche-Posay", category: "moisturiser",
    tags: ["repair","soothing","sensitive","barrier","centella"],
    description: "The go-to recovery balm recommended by French dermatologists for irritated, post-procedure and sensitised skin. Centella asiatica, madecassoside and vitamin B5 accelerate skin repair, soothe redness and restore the barrier. Suitable for face and body, even on babies. A medicine cabinet essential that doubles as a lip balm, cuticle cream and healing ointment.",
    price: "£15.50",
    image: "https://static.thcdn.com/productimg/original/15066464-1855116494567966.jpg",
    affiliateUrl: boots("La Roche-Posay Cicaplast Baume B5"),
    zones: ["full-face","body","lips"],
    suitableFor: ["sensitive","post-procedure","eczema-prone","all"],
    keyIngredients: [
      { name: "Centella Asiatica", benefit: "Accelerates healing and reduces redness" },
      { name: "Madecassoside", benefit: "Soothes inflammation and repairs skin barrier" },
      { name: "Vitamin B5", benefit: "Enhances moisture retention and skin regeneration" }
    ],
    alternatives: {
      budget: { name: "Hydromol Ointment", brand: "Hydromol", price: "£6.99", affiliateUrl: boots("Hydromol Ointment") },
      luxury: { name: "Heal Gel Intensive", brand: "HealGel", price: "£58.00", affiliateUrl: lf("HealGel Intensive") },
      organic: { name: "Organic Calendula Salve", brand: "Neal's Yard Remedies", price: "£17.00", affiliateUrl: boots("Neals Yard Calendula Salve") }
    }
  },

  {
    id: "p65", name: "Marine Collagen Eye Masks", brand: "Essy Beauty", category: "eye-cream",
    tags: ["eye-patches","collagen","plumping","depuffing","instant"],
    description: "Professional-grade under-eye patches infused with marine collagen and hyaluronic acid. A 20-minute treatment that visibly reduces puffiness, dark circles and fine lines — the ultimate pre-event rescue. The bio-cellulose material locks ingredients against skin with minimal evaporation for maximum absorption.",
    price: "£24.00",
    image: "https://static.thcdn.com/productimg/original/11432737-1565319916080837.jpg",
    affiliateUrl: amz("Marine Collagen Under Eye Patches"),
    zones: ["under-eye"],
    suitableFor: ["all","mature","tired-looking"],
    keyIngredients: [
      { name: "Marine Collagen", benefit: "Firms and plumps the delicate under-eye area" },
      { name: "Hyaluronic Acid", benefit: "Immediate hydration for a refreshed appearance" }
    ],
    alternatives: {
      budget: { name: "Gold Eye Mask", brand: "MaskerAide", price: "£12.00", affiliateUrl: amz("MaskerAide Gold Eye Mask") },
      luxury: { name: "Fringe Benefits Eye Mask", brand: "111 Skin", price: "£50.00", affiliateUrl: lf("111SKIN Eye Mask") },
      organic: { name: "Organic Green Tea Eye Patches", brand: "True Botanicals", price: "£38.00", affiliateUrl: amz("True Botanicals Eye Patches") }
    }
  },

  {
    id: "p66", name: "No.1 Phytoharmony Cream 50ml", brand: "Sisley Paris", category: "moisturiser",
    tags: ["luxury","plant-based","anti-ageing","firming","French"],
    description: "Sisley Paris's most advanced anti-ageing moisturiser, formulated with a concentrated complex of seven plant-based actives that mimic the effects of skin's own regulatory hormones. Clinical results demonstrate measurable improvement in firmness, radiance and hydration after four weeks. A prestige skincare experience from one of France's most respected laboratories.",
    price: "£295.00",
    image: "https://static.thcdn.com/productimg/original/16818015-3915257713146145.jpg",
    affiliateUrl: lf("Sisley Paris No1 Phytoharmony Cream"),
    zones: ["full-face","neck"],
    suitableFor: ["mature","dry","all"],
    keyIngredients: [
      { name: "Phytoharmony Complex", benefit: "Plant-based hormonal regulation for balanced skin" },
      { name: "Tithonia Extract", benefit: "Visibly firms and lifts" }
    ],
    alternatives: {
      budget: { name: "Charlotte's Magic Cream", brand: "Charlotte Tilbury", price: "£79.00", affiliateUrl: ctLink("Charlotte Tilbury Magic Cream") },
      luxury: { name: "Crème de la Mer", brand: "La Mer", price: "£185.00", affiliateUrl: lf("La Mer Creme") },
      organic: { name: "Wild Rose Beauty Balm SPF15", brand: "Dr. Hauschka", price: "£38.00", affiliateUrl: boots("Dr Hauschka Wild Rose Beauty Balm") }
    }
  },

  {
    id: "p67", name: "Bakuchiol Peptides Moisturiser 50ml", brand: "Inkey List", category: "moisturiser",
    tags: ["bakuchiol","retinol-alternative","peptides","anti-ageing","clean"],
    description: "A gentle yet effective anti-ageing moisturiser combining bakuchiol (a plant-based retinol alternative from babchi plant seeds) with a collagen-stimulating peptide complex. Delivers retinol-comparable results in fine line reduction and skin renewal without the irritation, dryness or sun sensitivity associated with retinol. Ideal for sensitive skin or daytime use.",
    price: "£15.99",
    image: "https://static.thcdn.com/productimg/original/14272888-1655324594263410.jpg",
    affiliateUrl: cult("Inkey List Bakuchiol Moisturiser"),
    zones: ["full-face","neck"],
    suitableFor: ["sensitive","dry","all","retinol-intolerant"],
    keyIngredients: [
      { name: "Bakuchiol 1%", benefit: "Retinol-alternative with anti-ageing benefits without irritation" },
      { name: "Matrixyl Peptides", benefit: "Stimulates collagen production" }
    ],
    alternatives: {
      budget: { name: "Retinol 0.2% in Squalane", brand: "The Ordinary", price: "£8.00", affiliateUrl: boots("The Ordinary Retinol") },
      luxury: { name: "Youth Surge SPF15 Moisturiser", brand: "Clinique", price: "£52.00", affiliateUrl: lf("Clinique Youth Surge Moisturiser") },
      organic: { name: "Bakuchiol Reface Pads", brand: "Pai Skincare", price: "£42.00", affiliateUrl: lf("Pai Bakuchiol Pads") }
    }
  },

  {
    id: "p68", name: "Peeling Solution Treatment Pads", brand: "Elemis", category: "exfoliant",
    tags: ["exfoliant","glycolic-acid","pads","brightening","luxury"],
    description: "Pre-soaked glycolic and lactic acid pads that resurface and brighten skin without the mess of a liquid exfoliant. The dual-textured pad exfoliates with one side and smooths with the other. Rose water and aloe vera soothe post-exfoliation. A luxurious spa-like treatment experience at home, recommended 3 nights per week.",
    price: "£45.00",
    image: "https://static.thcdn.com/productimg/original/14209149-5685326900207668.jpg",
    affiliateUrl: lf("Elemis Peeling Solution"),
    zones: ["full-face","neck"],
    suitableFor: ["all","dull","hyperpigmentation","mature"],
    keyIngredients: [
      { name: "Glycolic Acid", benefit: "Surface exfoliation for brightness and smooth texture" },
      { name: "Lactic Acid", benefit: "Gentle resurfacing with hydrating properties" },
      { name: "Rose Water", benefit: "Soothes and balances post-exfoliation" }
    ],
    alternatives: {
      budget: { name: "Glycolic Acid 7% Toning Solution", brand: "The Ordinary", price: "£11.80", affiliateUrl: boots("The Ordinary Glycolic Acid") },
      luxury: { name: "Exfoliation Accelerator", brand: "La Prairie", price: "£150.00", affiliateUrl: lf("La Prairie Exfoliation Accelerator") },
      organic: { name: "AHA Brightening Toner", brand: "Pai Skincare", price: "£34.00", affiliateUrl: lf("Pai AHA Toner") }
    }
  },

  {
    id: "p69", name: "Iconic Lip Color — Obsession", brand: "Pat McGrath Labs", category: "lip",
    tags: ["lipstick","luxury","pigmented","iconic","bold"],
    description: "From the Godmother of Makeup herself — a richly pigmented lipstick in a stunning jewelled packaging that is worth collecting. The ultra-nourishing formula delivers full, opaque colour in a single swipe with a creamy, comfortable finish. Available in Pat's signature bold, fashion-forward shades. The lipstick preferred by every major fashion house.",
    price: "£36.00",
    image: "https://static.thcdn.com/productimg/original/13951184-9775250505251498.jpg",
    affiliateUrl: sep("Pat McGrath Labs Iconic Lip Color"),
    zones: ["lips"],
    suitableFor: ["all"],
    keyIngredients: [
      { name: "Ultra-Pigment Complex", benefit: "Full opaque colour in one swipe" },
      { name: "Conditioning Emollients", benefit: "Comfortable, creamy wear" }
    ],
    alternatives: {
      budget: { name: "Matte Revolution Lipstick", brand: "Charlotte Tilbury", price: "£32.00", affiliateUrl: ctLink("Charlotte Tilbury Matte Revolution") },
      luxury: { name: "Rouge Allure Velvet", brand: "Chanel", price: "£40.00", affiliateUrl: lf("Chanel Rouge Allure Velvet") },
      organic: { name: "Lipstick", brand: "ILIA", price: "£32.00", affiliateUrl: sep("ILIA Lipstick") }
    }
  },

  {
    id: "p70", name: "Hyaluronic Acid Serum 2% + B5", brand: "Inkey List", category: "serum",
    tags: ["hyaluronic-acid","hydration","budget","plumping","dehydrated"],
    description: "An effective budget hyaluronic acid serum that delivers results at an accessible price point. Three molecular weights of hyaluronic acid penetrate to different depths for comprehensive hydration. Vitamin B5 enhances moisture retention and barrier recovery. Simple, transparent formulation with no unnecessary fillers or fragrance.",
    price: "£7.99",
    image: "https://static.thcdn.com/productimg/original/15312300-1425324590559190.jpg",
    affiliateUrl: cult("Inkey List Hyaluronic Acid Serum"),
    zones: ["full-face"],
    suitableFor: ["all","dehydrated","dry","sensitive"],
    keyIngredients: [
      { name: "Hyaluronic Acid (3 weights)", benefit: "Multi-depth surface-to-deep hydration" },
      { name: "Vitamin B5", benefit: "Enhanced moisture retention" }
    ],
    alternatives: {
      budget: { name: "Hyaluronic Acid 2% + B5", brand: "The Ordinary", price: "£7.90", affiliateUrl: boots("The Ordinary Hyaluronic Acid") },
      luxury: { name: "Plump & Plim Serum", brand: "Medik8", price: "£55.00", affiliateUrl: lf("Medik8 Plump and Plim") },
      organic: { name: "Hyaluronic Face Fluid", brand: "Weleda", price: "£16.00", affiliateUrl: boots("Weleda Hyaluronic Face Fluid") }
    }
  },

  {
    id: "p71", name: "CC+ Cream with SPF50 32ml", brand: "IT Cosmetics", category: "tinted-spf",
    tags: ["CC-cream","SPF50","full-coverage","anti-ageing","dermatologist-approved"],
    description: "The bestselling CC cream in the US — developed with plastic surgeons for full coverage with skincare benefits. SPF50 broad-spectrum protection, physical pigments and an anti-ageing complex of collagen, hyaluronic acid, peptides and antioxidants deliver flawless coverage while treating skin simultaneously. Available in 50 shades.",
    price: "£34.00",
    image: "https://static.thcdn.com/productimg/original/12920739-1205245015932249.jpg",
    affiliateUrl: boots("IT Cosmetics CC Cream SPF50"),
    zones: ["full-face"],
    suitableFor: ["all","sensitive","mature","combination"],
    keyIngredients: [
      { name: "Collagen & Peptide Complex", benefit: "Anti-ageing treatment within coverage" },
      { name: "SPF50 Physical Filters", benefit: "Broad-spectrum sun protection" },
      { name: "Hyaluronic Acid", benefit: "Hydrates throughout the day" }
    ],
    alternatives: {
      budget: { name: "Dream BB Fresh Skin Fresh", brand: "Maybelline", price: "£8.99", affiliateUrl: boots("Maybelline Dream BB Cream") },
      luxury: { name: "Sheer Beauty Fluid SPF30", brand: "Armani Beauty", price: "£46.00", affiliateUrl: lf("Armani Beauty Sheer Beauty Fluid") },
      organic: { name: "Skin Tint SPF30", brand: "ILIA", price: "£48.00", affiliateUrl: sep("ILIA Skin Tint SPF30") }
    }
  },

  {
    id: "p72", name: "Daily Microfoliant Sensitive 74g", brand: "Dermalogica", category: "exfoliant",
    tags: ["sensitive","gentle","exfoliant","calming","daily"],
    description: "A gentle variant of the cult Daily Microfoliant specifically formulated for sensitised and reactive skin. Oat flour, allantoin and colloidal oat soothe as the enzyme and rice-bran exfoliants resurface skin softly. No abrasive particles — just enzymatic and mild chemical action for polished, calm skin. Suitable for rosacea-prone skin.",
    price: "£64.00",
    image: "https://static.thcdn.com/productimg/original/11480968-1895131029041412.jpg",
    affiliateUrl: lf("Dermalogica Daily Microfoliant Sensitive"),
    zones: ["full-face"],
    suitableFor: ["sensitive","rosacea","dry","mature"],
    keyIngredients: [
      { name: "Rice Bran Enzyme", benefit: "Gentle brightening exfoliation" },
      { name: "Oat Flour", benefit: "Soothes and calms sensitive skin" },
      { name: "Allantoin", benefit: "Anti-irritant that supports healing" }
    ],
    alternatives: {
      budget: { name: "Gentle Exfoliating Wash", brand: "La Roche-Posay", price: "£13.00", affiliateUrl: boots("La Roche-Posay Gentle Exfoliating Wash") },
      luxury: { name: "Brightening Enzyme Mask", brand: "Omorovicza", price: "£75.00", affiliateUrl: lf("Omorovicza Brightening Enzyme Mask") },
      organic: { name: "Probiotic Exfoliating Toner", brand: "Pai Skincare", price: "£38.00", affiliateUrl: lf("Pai Skincare Probiotic Toner") }
    }
  },

  {
    id: "p73", name: "Cushion Foundation SPF50+", brand: "IOPE", category: "foundation",
    tags: ["cushion","K-beauty","SPF50+","dewy","lightweight"],
    description: "The Korean cushion foundation that started a global beauty revolution. Buildable, skin-like coverage with SPF50+ in a convenient cushion format. Hyaluronic acid, ceramides and a brightening complex deliver skincare benefits with every application. The hygienic cushion compact stays fresh and mess-free for on-the-go touch-ups.",
    price: "£38.00",
    image: "https://static.thcdn.com/productimg/original/15395612-1865234366254053.jpg",
    affiliateUrl: amz("IOPE Cushion Foundation SPF50+"),
    zones: ["full-face"],
    suitableFor: ["normal","dry","combination","dewy-lovers"],
    keyIngredients: [
      { name: "Hyaluronic Acid", benefit: "Hydrates skin throughout wear" },
      { name: "SPF50+ Filters", benefit: "Broad-spectrum daily UV protection" },
      { name: "Ceramides", benefit: "Supports skin barrier" }
    ],
    alternatives: {
      budget: { name: "BB Cushion SPF50+", brand: "Maybelline", price: "£14.99", affiliateUrl: boots("Maybelline Cushion Foundation") },
      luxury: { name: "Lancôme Teint Idole Cushion", brand: "Lancôme", price: "£47.00", affiliateUrl: lf("Lancome Teint Idole Cushion") },
      organic: { name: "Tinted Daily Moisturiser SPF25", brand: "ILIA", price: "£48.00", affiliateUrl: sep("ILIA Tinted Moisturiser") }
    }
  },


  {
    id: "p74", name: "Vital Perfection Uplifting & Firming Cream 50ml", brand: "Shiseido", category: "moisturiser",
    tags: ["firming","lifting","anti-aging","luxury","peptides"],
    description: "Shiseido's flagship firming moisturiser powered by KOMBU-Bounce Complex and Forest Berry Stem Cells. Clinically proven to improve skin firmness, elasticity and definition in 4 weeks. The rich yet non-greasy cream replenishes moisture at multiple skin layers while visibly lifting facial contours. A Japanese skincare icon.",
    price: "£85.00",
    image: "https://static.thcdn.com/productimg/original/17234626-1335323876971168.jpg",
    affiliateUrl: lf("Shiseido Vital Perfection Uplifting Firming Cream"),
    zones: ["full-face","cheeks","jawline"],
    suitableFor: ["mature","normal","dry","combination"],
    keyIngredients: [
      { name: "KOMBU-Bounce Complex", benefit: "Marine algae that boosts skin elasticity and lift" },
      { name: "Forest Berry Stem Cells", benefit: "Protects skin's vitality and renews cell function" },
      { name: "ReNeura Technology+", benefit: "Accelerates skin sensing and moisture response" }
    ],
    alternatives: {
      budget: { name: "Regenerist Micro-Sculpting Cream", brand: "Olay", price: "£29.99", affiliateUrl: boots("Olay Regenerist Micro-Sculpting Cream") },
      luxury: { name: "Crème de La Mer 60ml", brand: "La Mer", price: "£320.00", affiliateUrl: lf("La Mer Creme de La Mer") },
      organic: { name: "Probiotic Radiance Cream", brand: "Tata Harper", price: "£98.00", affiliateUrl: lf("Tata Harper Probiotic Radiance Cream") }
    }
  },

  {
    id: "p75", name: "High Lip Color — Matte 603 Savage", brand: "MAC", category: "lip",
    tags: ["matte","long-lasting","lip","bold","iconic"],
    description: "MAC's legendary Matte lipstick in the cult Savage shade — a warm brick-red nude that flatters all skin tones. Intensely pigmented and long-wearing with a velvety matte finish that doesn't dry out lips. Enriched with Vitamin E and sunflower oil wax, this is the lipstick that built MAC's reputation. A perennial best-seller for 30+ years.",
    price: "£20.00",
    image: "https://static.thcdn.com/productimg/original/15063861-2735260283790426.jpg",
    affiliateUrl: lf("MAC Matte Lipstick Savage"),
    zones: ["lips"],
    suitableFor: ["all-skin-types"],
    keyIngredients: [
      { name: "Vitamin E", benefit: "Antioxidant that prevents lip moisture loss" },
      { name: "Sunflower Wax", benefit: "Smooths and conditions lips under matte pigment" },
      { name: "High-Pigment Complex", benefit: "Rich matte colour with 8hr wear" }
    ],
    alternatives: {
      budget: { name: "Superstay Matte Ink Liquid Lipstick", brand: "Maybelline", price: "£11.99", affiliateUrl: boots("Maybelline Superstay Matte Ink") },
      luxury: { name: "Rouge Coco Flash Lipstick", brand: "Chanel", price: "£40.00", affiliateUrl: lf("Chanel Rouge Coco Flash") },
      organic: { name: "Long Wear Lipstick", brand: "Ilia", price: "£26.00", affiliateUrl: sep("ILIA Long Wear Lipstick") }
    }
  },

  {
    id: "p76", name: "Lash Sensational Sky High Mascara", brand: "Maybelline", category: "mascara",
    tags: ["mascara","lengthening","drugstore","volumising","buildable"],
    description: "The mascara that broke the internet — over 1 million units sold in its first month. The flexible fibre brush bends to coat every single lash from root to tip, creating runway-worthy length and lift. Infused with bamboo extract and fibre technology for buildable volume without clumping. Waterproof formula locks in curl all day.",
    price: "£12.99",
    image: "https://static.thcdn.com/productimg/original/13027919-6505318441708292.jpg",
    affiliateUrl: boots("Maybelline Sky High Mascara"),
    zones: ["eyes"],
    suitableFor: ["all-skin-types"],
    keyIngredients: [
      { name: "Bamboo Extract", benefit: "Strengthens lashes and supports length" },
      { name: "Flexitube Fibres", benefit: "Coats and extends each lash individually" },
      { name: "Waterproof Polymers", benefit: "Lock in volume and curl for 24hr wear" }
    ],
    bestSeller: true,
    alternatives: {
      budget: { name: "Lash Sensational Washable Mascara", brand: "Maybelline", price: "£9.99", affiliateUrl: boots("Maybelline Lash Sensational Mascara") },
      luxury: { name: "Black Honey Absolute Mascara", brand: "Hourglass", price: "£30.00", affiliateUrl: snk("Hourglass Black Honey Mascara") },
      organic: { name: "Tubing Mascara", brand: "Ilia", price: "£29.00", affiliateUrl: sep("ILIA Tubing Mascara") }
    }
  },

  {
    id: "p77", name: "Advantage Anti-Blemish Skincare & Makeup Set", brand: "Clinique", category: "spot-treatment",
    tags: ["acne","blemish","salicylic-acid","clinical","oily"],
    description: "Clinique's dermatologist-developed anti-blemish system combining targeted salicylic acid treatment with lightweight coverage. The 3-step system (cleanser, clarifying lotion, oil-control moisturiser) clears existing blemishes while preventing new ones. The lightweight gel-cream formula is non-comedogenic and fragrance-free — safe for even the most reactive, spot-prone skin.",
    price: "£28.00",
    image: "https://static.thcdn.com/productimg/original/11316226-1735231033531028.jpg",
    affiliateUrl: lf("Clinique Anti-Blemish Solutions"),
    zones: ["forehead","chin","nose","cheeks"],
    suitableFor: ["oily","acne-prone","combination","sensitive"],
    keyIngredients: [
      { name: "Salicylic Acid 0.5%", benefit: "Penetrates pores to dissolve sebum and reduce breakouts" },
      { name: "Zinc PCA", benefit: "Regulates excess oil production at the source" },
      { name: "Eucalyptus Leaf Extract", benefit: "Antibacterial botanical that soothes inflamed spots" }
    ],
    alternatives: {
      budget: { name: "Skin Clearing Oil-Free Moisturiser", brand: "Neutrogena", price: "£11.99", affiliateUrl: boots("Neutrogena Skin Clearing Moisturiser") },
      luxury: { name: "Blemish + Age Defence Serum", brand: "SkinCeuticals", price: "£105.00", affiliateUrl: lf("SkinCeuticals Blemish Age Defence") },
      organic: { name: "Clarifying Serum", brand: "Pai Skincare", price: "£42.00", affiliateUrl: lf("Pai Skincare Clarifying Serum") }
    }
  },

  {
    id: "p78", name: "Glow Drops Liquid Highlighter", brand: "Charlotte Tilbury", category: "highlighter",
    tags: ["liquid-highlighter","glow","dewy","strobe","versatile"],
    description: "Charlotte Tilbury's coveted liquid highlighter delivers a lit-from-within glow that works as a standalone product or mixed into foundation. The ultra-fine pearl pigments catch light without chunky glitter, creating a natural luminosity reminiscent of professional studio lighting. Apply to cheekbones, cupid's bow, inner corners and décolletage for instant radiance.",
    price: "£38.00",
    image: "https://static.thcdn.com/productimg/original/13313657-1925257983798201.jpg",
    affiliateUrl: ctLink("Charlotte Tilbury Glow Drops Liquid Highlighter"),
    zones: ["cheeks","brow-bone","nose-bridge"],
    suitableFor: ["all-skin-types","mature","dull-skin"],
    keyIngredients: [
      { name: "Ultra-Fine Pearl Pigments", benefit: "Scatter light to create skin-like luminosity" },
      { name: "Hyaluronic Acid", benefit: "Plumps skin while delivering radiance" },
      { name: "Vitamin E", benefit: "Antioxidant that keeps skin looking healthy and bright" }
    ],
    alternatives: {
      budget: { name: "True Match Lumi Glotion", brand: "L'Oréal", price: "£12.99", affiliateUrl: boots("L'Oréal True Match Lumi Glotion") },
      luxury: { name: "Brightening Fluid", brand: "Armani Beauty", price: "£54.00", affiliateUrl: lf("Armani Beauty Brightening Fluid") },
      organic: { name: "Dewy Skin Mist", brand: "Tatcha", price: "£42.00", affiliateUrl: lf("Tatcha Dewy Skin Mist") }
    }
  },

  {
    id: "p79", name: "Power Bronzer Powder 10g", brand: "Hourglass", category: "bronzer",
    tags: ["bronzer","luxury","powder","sculpting","buildable"],
    description: "Hourglass's vegan powder bronzer in an ultra-silky, talc-free formula that blends like a dream. The eight interconnected dome-shaped pans of pressed powder provide multiple shading options for hyper-natural contouring and bronzing. Oil-free and long-wearing with a skin-true finish that photographs beautifully. Cruelty-free and 100% vegan.",
    price: "£58.00",
    image: "https://static.thcdn.com/productimg/original/13317826-1494897436620434.jpg",
    affiliateUrl: snk("Hourglass Ambient Lighting Bronzer"),
    zones: ["cheeks","temples","forehead","jawline"],
    suitableFor: ["all-skin-types","oily","combination"],
    keyIngredients: [
      { name: "Photoluminescent Technology", benefit: "Diffuses light for a natural bronzed effect" },
      { name: "Talc-Free Powder Base", benefit: "Ultra-fine silky texture without pore-clogging" },
      { name: "Skin-True Pigments", benefit: "Warm bronze tones that complement all skin tones" }
    ],
    alternatives: {
      budget: { name: "Sculpted Bronzer", brand: "NYX", price: "£11.00", affiliateUrl: boots("NYX Matte Bronzer") },
      luxury: { name: "Soleil Tan de Chanel", brand: "Chanel", price: "£48.00", affiliateUrl: lf("Chanel Soleil Tan de Chanel Bronzer") },
      organic: { name: "Sun Bronzer", brand: "RMS Beauty", price: "£40.00", affiliateUrl: lf("RMS Beauty Sun Bronzer") }
    }
  },

  {
    id: "p80", name: "Micro Precision Brow Pencil", brand: "Anastasia Beverly Hills", category: "brow",
    tags: ["brow","micro-precision","long-wearing","natural","defining"],
    description: "The brow pencil that redefined the industry. ABH's ultra-fine 0.085mm tip mimics real hair strokes for a hyper-realistic, feathery brow that lasts up to 24 hours. The triangular tip can create both hairstrokes and fills depending on how you angle it. Pairs with a spoolie brush for a polished, natural finish. Available in 13 shades.",
    price: "£24.00",
    image: "https://static.thcdn.com/productimg/original/12275825-1185281036949292.jpg",
    affiliateUrl: cult("Anastasia Beverly Hills Micro Precision Brow Pencil"),
    zones: ["brows"],
    suitableFor: ["all-skin-types"],
    keyIngredients: [
      { name: "Micro-Precision Tip 0.085mm", benefit: "Creates hyper-realistic hair strokes" },
      { name: "Long-Wear Wax Formula", benefit: "Sweat and humidity resistant for 24hr wear" },
      { name: "Conditioning Polymers", benefit: "Smooth glide without skipping or dragging" }
    ],
    bestSeller: true,
    alternatives: {
      budget: { name: "Brow Ultra Slim Pencil", brand: "NYX", price: "£8.99", affiliateUrl: boots("NYX Brow Ultra Slim Pencil") },
      luxury: { name: "Brow Tech Moulding Paste", brand: "Armani Beauty", price: "£36.00", affiliateUrl: lf("Armani Beauty Brow Tech Moulding Paste") },
      organic: { name: "Natural Brow Pencil", brand: "Ere Perez", price: "£22.00", affiliateUrl: amz("Ere Perez Natural Brow Pencil") }
    }
  },

  {
    id: "p81", name: "Invisible Shield Daily Sunscreen SPF35", brand: "Supergoop!", category: "spf",
    tags: ["SPF35","mineral","clean","invisible","daily"],
    description: "Supergoop!'s breakthrough invisible sunscreen that disappears completely into skin with no white cast, greasiness or sunscreen smell. The water-gel formula is powered by Blue Sea Kale and Meadowfoam Seed Oil that protect skin from UV, pollution and blue light. Wears beautifully under makeup and doesn't pill. A fan favourite for those who hate traditional sunscreen textures.",
    price: "£34.00",
    image: "https://static.thcdn.com/productimg/original/15839824-1905319203884650.jpg",
    affiliateUrl: cult("Supergoop Invisible Shield SPF35"),
    zones: ["full-face"],
    suitableFor: ["all-skin-types","oily","sensitive","darker-skin-tones"],
    keyIngredients: [
      { name: "Blue Sea Kale", benefit: "Antioxidant protection against environmental aggressors" },
      { name: "Meadowfoam Seed Oil", benefit: "Locks in moisture without heaviness" },
      { name: "Zinc + Chemical Blend", benefit: "Broad-spectrum UVA/UVB protection SPF35" }
    ],
    newIn: true,
    alternatives: {
      budget: { name: "Ambre Solaire UV Gel Face SPF50+", brand: "Garnier", price: "£9.99", affiliateUrl: boots("Garnier Ambre Solaire UV Gel Face SPF50") },
      luxury: { name: "UV Sense Daily Invisible Sunscreen SPF100+", brand: "La Roche-Posay", price: "£38.00", affiliateUrl: boots("La Roche-Posay UV Sense SPF100") },
      organic: { name: "Mineral Sunscreen Lotion SPF50", brand: "Tata Harper", price: "£58.00", affiliateUrl: lf("Tata Harper Mineral Sunscreen") }
    }
  },

  {
    id: "p82", name: "Soft Matte Complete Powder", brand: "NARS", category: "powder",
    tags: ["powder","matte","setting","transfer-proof","buildable"],
    description: "NARS's universally flattering setting powder with a buildable, skin-perfecting matte finish. Ultra-fine micro-powders blur pores, control shine and set foundation for up to 16 hours of wear without cakiness. The talc-free formula absorbs excess sebum instantly and holds up under heat, humidity and long days. Available in 8 shades from translucent to deep.",
    price: "£40.00",
    image: "https://static.thcdn.com/productimg/original/14292106-4235231283691773.jpg",
    affiliateUrl: lf("NARS Soft Matte Complete Powder"),
    zones: ["full-face","t-zone","under-eyes"],
    suitableFor: ["oily","combination","normal","mature"],
    keyIngredients: [
      { name: "Ultra-Fine Micro-Powders", benefit: "Blur imperfections and smooth texture" },
      { name: "Talc-Free Absorbing Base", benefit: "Mattifies without heaviness or chalkiness" },
      { name: "Long-Wear Binders", benefit: "Transfer-proof hold for 16+ hours" }
    ],
    alternatives: {
      budget: { name: "Fit Me Matte + Poreless Powder", brand: "Maybelline", price: "£8.99", affiliateUrl: boots("Maybelline Fit Me Matte Poreless Powder") },
      luxury: { name: "Poudre Universelle Libre", brand: "Chanel", price: "£45.00", affiliateUrl: lf("Chanel Poudre Universelle Libre") },
      organic: { name: "Translucent Setting Powder", brand: "ILIA", price: "£34.00", affiliateUrl: sep("ILIA Translucent Powder") }
    }
  },

  {
    id: "p83", name: "Lash Paradise Mascara", brand: "L'Oréal", category: "mascara",
    tags: ["mascara","drugstore","volumising","buildable","fluffy"],
    description: "L'Oréal's bestselling Lash Paradise mascara delivers luxurious, voluminous lashes at an accessible price point. The wavy bristle brush grips and coats every lash from root to tip, building intense volume without clumping or flaking. Castor oil conditions lashes while the formula builds up to five times the volume. The closest drugstore dupe to luxury mascaras.",
    price: "£13.99",
    image: "https://static.thcdn.com/productimg/original/15009389-1115256171455859.jpg",
    affiliateUrl: boots("L'Oréal Lash Paradise Mascara"),
    zones: ["eyes"],
    suitableFor: ["all-skin-types"],
    keyIngredients: [
      { name: "Castor Oil", benefit: "Conditions and strengthens lashes with wear" },
      { name: "Volume-Boost Polymers", benefit: "Builds up to 5x volume without clumping" },
      { name: "Wavy Bristle Brush", benefit: "Grips and coats every lash from root to tip" }
    ],
    bestSeller: true,
    alternatives: {
      budget: { name: "The Falsies Surreal Mascara", brand: "Maybelline", price: "£11.99", affiliateUrl: boots("Maybelline The Falsies Mascara") },
      luxury: { name: "Better Than Sex Mascara", brand: "Too Faced", price: "£27.00", affiliateUrl: sep("Too Faced Better Than Sex Mascara") },
      organic: { name: "Night Owl Mascara", brand: "RMS Beauty", price: "£26.00", affiliateUrl: lf("RMS Beauty Night Owl Mascara") }
    }
  },

  {
    id: "p84", name: "Vitamin C Brightening Eye Cream 15ml", brand: "Ole Henriksen", category: "eye-cream",
    tags: ["eye-cream","vitamin-c","brightening","dark-circles","caffeine"],
    description: "Ole Henriksen's cult Banana Bright Eye Crème brightens dark circles with a patented Banana Bright Complex — a cocktail of high-potency Vitamin C, collagen-boosting peptides and banana powder that mimics the colour-correcting effect of banana-toned concealer. Caffeine depuffs while optical diffusers create an instant wide-awake effect.",
    price: "£40.00",
    image: "https://static.thcdn.com/productimg/original/14887411-2085128685018292.jpg",
    affiliateUrl: cult("Ole Henriksen Banana Bright Eye Crème"),
    zones: ["eye-area","under-eyes"],
    suitableFor: ["all-skin-types","mature","dull-skin"],
    keyIngredients: [
      { name: "Vitamin C Complex", benefit: "Brightens dark circles and evens skin tone" },
      { name: "Caffeine", benefit: "Reduces puffiness and tightens the eye area" },
      { name: "Banana Powder", benefit: "Colour-corrects and minimises shadows" }
    ],
    alternatives: {
      budget: { name: "Vitamin C Brightening Eye Cream", brand: "Garnier", price: "£9.99", affiliateUrl: boots("Garnier Vitamin C Eye Cream") },
      luxury: { name: "Bright Future Eye Cream", brand: "Paula's Choice", price: "£48.00", affiliateUrl: boots("Paula's Choice Bright Future Eye Cream") },
      organic: { name: "Restorative Eye Cream", brand: "Pai Skincare", price: "£42.00", affiliateUrl: lf("Pai Skincare Eye Cream") }
    }
  },

  {
    id: "p85", name: "Youth Surge SPF30 Age Decelerating Day Moisturiser", brand: "Clinique", category: "moisturiser",
    tags: ["SPF30","anti-aging","moisturiser","peptides","daily"],
    description: "Clinique's award-winning Youth Surge uses Sirtuin technology — a cellular anti-aging innovation — to slow visible skin aging at the source. The multi-tasking day cream hydrates, fights free radicals, firms and provides SPF30 broad-spectrum protection in a single step. Oil-free and allergy-tested, it suits all skin types including oily and sensitive.",
    price: "£60.00",
    image: "https://static.thcdn.com/productimg/original/12849046-1415231036491176.jpg",
    affiliateUrl: lf("Clinique Youth Surge SPF30 Moisturiser"),
    zones: ["full-face"],
    suitableFor: ["all-skin-types","mature","sensitive","oily"],
    keyIngredients: [
      { name: "Sirtuin Technology", benefit: "Activates skin's natural anti-aging genes" },
      { name: "SPF30 Filters", benefit: "Daily broad-spectrum UV protection" },
      { name: "Chia Seed Extract", benefit: "Long-term hydration with antioxidant support" }
    ],
    alternatives: {
      budget: { name: "Complete Protect & Renew SPF30", brand: "Olay", price: "£19.99", affiliateUrl: boots("Olay Complete Protect Renew SPF30") },
      luxury: { name: "Crème Ancienne Supreme Face Cream", brand: "Fresh", price: "£210.00", affiliateUrl: lf("Fresh Creme Ancienne Supreme") },
      organic: { name: "Elixir Vitae Supreme Face Cream", brand: "Eminence Organics", price: "£88.00", affiliateUrl: amz("Eminence Organics Elixir Vitae") }
    }
  },

  {
    id: "p86", name: "Phyto-C Brightening Serum 30ml", brand: "Sisley", category: "serum",
    tags: ["vitamin-c","brightening","luxury","serum","anti-aging"],
    description: "Sisley's luxury vitamin C brightening serum harnesses botanical intelligence — Phyto-Vitamin C (a plant-derived, highly stable form of ascorbic acid) combined with Peony Extract and Camellia Oil. The formula visibly corrects dark spots and uneven skin tone in four weeks while improving radiance and firmness. Ultra-sensorial texture absorbs instantly without stickiness.",
    price: "£195.00",
    image: "https://static.thcdn.com/productimg/original/16288094-5825323848696243.jpg",
    affiliateUrl: lf("Sisley Phyto-C Brightening Serum"),
    zones: ["full-face","cheeks","forehead"],
    suitableFor: ["all-skin-types","mature","dull-skin","hyperpigmentation"],
    keyIngredients: [
      { name: "Phyto-Vitamin C", benefit: "Stable plant-derived brightening without irritation" },
      { name: "Peony Extract", benefit: "Inhibits melanin synthesis to fade dark spots" },
      { name: "Camellia Oil", benefit: "Rich in fatty acids that nourish and protect" }
    ],
    alternatives: {
      budget: { name: "Vitamin C Suspension 23% + HA Spheres 2%", brand: "The Ordinary", price: "£6.30", affiliateUrl: cult("The Ordinary Vitamin C Suspension") },
      luxury: { name: "Absolue Revitalising Eye Cream", brand: "Lancôme", price: "£115.00", affiliateUrl: lf("Lancome Absolue Eye Cream") },
      organic: { name: "Vitamin C Youth Activator", brand: "Tata Harper", price: "£98.00", affiliateUrl: lf("Tata Harper Vitamin C Youth Activator") }
    }
  },

  {
    id: "p87", name: "Airbrush Brightening Finishing Powder", brand: "Dior", category: "powder",
    tags: ["luxury","finishing","brightening","photography","highlighter"],
    description: "Dior's iconic loose powder with light-diffusing micro-pearls for a flawless, airbrushed complexion finish. The translucent formula blurs pores and imperfections while imparting a subtle luminosity that photographs beautifully. Beloved by makeup artists worldwide as the final step on any red-carpet look. The pink-beige tint suits all skin tones.",
    price: "£52.00",
    image: "https://static.thcdn.com/productimg/original/12908485-2074858815715932.jpg",
    affiliateUrl: lf("Dior Diorskin Forever Cushion Powder"),
    zones: ["full-face","under-eyes","t-zone"],
    suitableFor: ["all-skin-types","mature","normal"],
    keyIngredients: [
      { name: "Light-Diffusing Micro-Pearls", benefit: "Reflect light to visually erase fine lines" },
      { name: "Pink-Beige Pigments", benefit: "Warm universal tone that flatters all complexions" },
      { name: "Smoothing Film-Forming Polymer", benefit: "Blurs pores and creates a soft-focus finish" }
    ],
    alternatives: {
      budget: { name: "Stay Matte Pressed Powder", brand: "Rimmel", price: "£5.99", affiliateUrl: boots("Rimmel Stay Matte Pressed Powder") },
      luxury: { name: "Poudre Universelle Libre", brand: "Chanel", price: "£45.00", affiliateUrl: lf("Chanel Poudre Universelle Libre") },
      organic: { name: "Setting Powder", brand: "Ere Perez", price: "£28.00", affiliateUrl: amz("Ere Perez Setting Powder") }
    }
  },

  {
    id: "p88", name: "Youth To The People Superfood Cleanser 237ml", brand: "Youth To The People", category: "cleanser",
    tags: ["cleanser","superfood","vitamin-c","green-tea","vegan"],
    description: "The cult superfood gel cleanser that cleansed its way to viral fame. Kale, spinach and green tea deliver antioxidant protection while Vitamin C brightens with each wash. The pH-balanced gel formula dissolves makeup, excess oil and environmental debris without stripping the skin barrier. Vegan, cruelty-free and packaged in 100% recyclable glass.",
    price: "£38.00",
    image: "https://static.thcdn.com/productimg/original/13324148-1175121624564591.jpg",
    affiliateUrl: cult("Youth To The People Superfood Cleanser"),
    zones: ["full-face"],
    suitableFor: ["all-skin-types","normal","combination","oily"],
    keyIngredients: [
      { name: "Kale Extract", benefit: "Rich in vitamins A, C, K for antioxidant protection" },
      { name: "Green Tea Extract", benefit: "Powerful anti-inflammatory and antioxidant properties" },
      { name: "Vitamin C", benefit: "Brightens and evens skin tone with every wash" }
    ],
    newIn: false,
    bestSeller: true,
    alternatives: {
      budget: { name: "Gentle Exfoliating Wash", brand: "CeraVe", price: "£9.50", affiliateUrl: boots("CeraVe Gentle Exfoliating Wash") },
      luxury: { name: "The Cleansing Cloth", brand: "La Mer", price: "£75.00", affiliateUrl: lf("La Mer The Cleansing Cloth") },
      organic: { name: "Camellia & Rose Gentle Hydrating Cleanser", brand: "Pai Skincare", price: "£32.00", affiliateUrl: lf("Pai Skincare Camellia Cleanser") }
    }
  },

  {
    id: "p89", name: "Eye Khôl in Rock 'n' Kohl", brand: "Charlotte Tilbury", category: "eyeliner",
    tags: ["eyeliner","kohl","smoky","long-lasting","iconic"],
    description: "Charlotte Tilbury's Rock 'n' Kohl Eyeliner delivers the smudged, sexy eye of your dreams. The ultra-smooth, waterproof formula glides on effortlessly and can be blended immediately for a smoky effect or left to set for 24-hour intense colour. The creamy yet long-lasting texture never crumbles or flakes. Available in 12 shades from classic black to vivid colour.",
    price: "£24.00",
    image: "https://static.thcdn.com/productimg/original/16303570-5365240318790522.jpg",
    affiliateUrl: ctLink("Charlotte Tilbury Rock 'n' Kohl Eyeliner"),
    zones: ["eyes","waterline","lash-line"],
    suitableFor: ["all-skin-types"],
    keyIngredients: [
      { name: "Waterproof Polymers", benefit: "Lock-in pigment for 24hr smudge-proof wear" },
      { name: "Creamy Wax Binders", benefit: "Allow seamless blending before set" },
      { name: "Ultra-Fine Pigments", benefit: "Intense, buildable colour in a single stroke" }
    ],
    alternatives: {
      budget: { name: "Kohl Eyeliner", brand: "Maybelline", price: "£5.99", affiliateUrl: boots("Maybelline Kohl Eyeliner") },
      luxury: { name: "Eye Kohl Pencil", brand: "Bobbi Brown", price: "£26.00", affiliateUrl: lf("Bobbi Brown Eye Kohl Pencil") },
      organic: { name: "Natural Eye Liner", brand: "Ere Perez", price: "£24.00", affiliateUrl: amz("Ere Perez Eye Liner") }
    }
  },

  {
    id: "p90", name: "Rapid Firming Peptide Eye Cream 15ml", brand: "Paula's Choice", category: "eye-cream",
    tags: ["peptides","firming","eye-cream","anti-aging","clinical"],
    description: "Paula's Choice's clinical-grade peptide eye cream targets all major signs of eye area aging — crow's feet, loss of firmness, dark circles and puffiness — with a proven peptide complex and retinol alternative. The fragrance-free, ophthalmologist-tested formula is gentle enough for contact lens wearers and delivers measurable tightening and brightening results within 4 weeks.",
    price: "£55.00",
    image: "https://static.thcdn.com/productimg/original/14886924-7055305148500260.jpg",
    affiliateUrl: lf("Paula's Choice Rapid Firming Peptide Eye Cream"),
    zones: ["eye-area","under-eyes","crow's-feet"],
    suitableFor: ["all-skin-types","mature","sensitive"],
    keyIngredients: [
      { name: "Matrixyl 3000", benefit: "Clinically proven peptide complex for wrinkle reduction" },
      { name: "Bakuchiol", benefit: "Retinol alternative that firms without irritation" },
      { name: "Caffeine + Niacinamide", benefit: "Depuffs and brightens dark circles" }
    ],
    alternatives: {
      budget: { name: "Anti-Wrinkle Eye Cream", brand: "RoC", price: "£14.99", affiliateUrl: boots("RoC Anti-Wrinkle Eye Cream") },
      luxury: { name: "Eye Contour Firming Serum", brand: "Augustinus Bader", price: "£195.00", affiliateUrl: lf("Augustinus Bader Eye Contour Serum") },
      organic: { name: "Restorative Eye Cream", brand: "Pai Skincare", price: "£42.00", affiliateUrl: lf("Pai Skincare Restorative Eye Cream") }
    }
  },

  {
    id: "p91", name: "Flawless Filter Complexion Booster", brand: "Charlotte Tilbury", category: "primer",
    tags: ["filter","glow","primer","highlighter","versatile"],
    description: "Charlotte Tilbury's iconic Flawless Filter is the multi-tasking complexion booster that works as a primer, highlighter or standalone glow base. The award-winning formula filters skin with prismatic, pearl-infused pigments for an instant Instagram-filter effect without the filter. Blurs imperfections, smooths texture and imparts a lit-from-within luminosity. Worn alone or mixed into foundation.",
    price: "£40.00",
    image: "https://static.thcdn.com/productimg/original/14996140-1845247120926250.jpg",
    affiliateUrl: ctLink("Charlotte Tilbury Flawless Filter"),
    zones: ["full-face","cheeks","brow-bone"],
    suitableFor: ["all-skin-types","mature","dull-skin"],
    keyIngredients: [
      { name: "Prismatic Micro-Pearls", benefit: "Diffuse light for a soft-focus glow" },
      { name: "Skin-Tone Pigments", benefit: "Even complexion without full coverage" },
      { name: "Hyaluronic Acid", benefit: "Plumps and hydrates as a skincare base" }
    ],
    bestSeller: true,
    alternatives: {
      budget: { name: "True Match Lumi Glotion", brand: "L'Oréal", price: "£12.99", affiliateUrl: boots("L'Oréal True Match Lumi Glotion") },
      luxury: { name: "Luminizing Fluid Foundation", brand: "Armani Beauty", price: "£54.00", affiliateUrl: lf("Armani Beauty Luminizing Fluid Foundation") },
      organic: { name: "Dewy Skin Serum Primer", brand: "ILIA", price: "£38.00", affiliateUrl: sep("ILIA Dewy Skin Serum Primer") }
    }
  },

  {
    id: "p92", name: "Lip Plumping Gloss", brand: "Dior", category: "lip",
    tags: ["lip-gloss","plumping","hydrating","luxury","shine"],
    description: "Dior's Addict Lip Maximizer delivers instant volume and lasting hydration with a dazzling, cushiony shine. Hyaluronic acid provides instant plumping as collagen-boosting peptides work long-term to define the lip contour. The comfortable, non-sticky formula is enriched with cherry oil for a nourishing wear experience. Available in 16 buildable shades from nudes to corals.",
    price: "£34.00",
    image: "https://static.thcdn.com/productimg/original/15065622-2035161797961518.jpg",
    affiliateUrl: lf("Dior Addict Lip Maximizer Plumping Gloss"),
    zones: ["lips"],
    suitableFor: ["all-skin-types","dry-lips"],
    keyIngredients: [
      { name: "Hyaluronic Acid", benefit: "Instant volumising plumping effect" },
      { name: "Cherry Oil", benefit: "Nourishes and conditions lip tissue" },
      { name: "Collagen Peptides", benefit: "Long-term lip definition and fullness" }
    ],
    alternatives: {
      budget: { name: "Lip Injection Extreme", brand: "Too Faced", price: "£21.00", affiliateUrl: sep("Too Faced Lip Injection Extreme") },
      luxury: { name: "Lip Comfort Oil", brand: "Clarins", price: "£28.00", affiliateUrl: lf("Clarins Lip Comfort Oil") },
      organic: { name: "Lip2Cheek Cream Blush + Lip Color", brand: "RMS Beauty", price: "£32.00", affiliateUrl: lf("RMS Beauty Lip2Cheek") }
    }
  },

  {
    id: "p93", name: "Holy Grail Dewy Skin Tint SPF30", brand: "Trinny London", category: "tinted-spf",
    tags: ["skin-tint","SPF30","dewy","buildable","natural"],
    description: "Trinny London's BFF Cream provides SPF30 protection with buildable, skin-like coverage that adapts to your skin tone. The ultra-lightweight texture blurs and evens while the cushion-effect formula adds a healthy glow. Hyaluronic acid and niacinamide work as skincare actives within the formula. Loved for giving the 'your skin but better' finish without foundation feel.",
    price: "£38.00",
    image: "https://static.thcdn.com/productimg/original/12866107-2075322027441651.jpg",
    affiliateUrl: lf("Trinny London BFF De-Stress Cream SPF30"),
    zones: ["full-face"],
    suitableFor: ["all-skin-types","normal","dry","combination"],
    keyIngredients: [
      { name: "SPF30 Filters", benefit: "Daily UVA/UVB protection" },
      { name: "Hyaluronic Acid", benefit: "24-hour hydration for a dewy, cushioned finish" },
      { name: "Niacinamide", benefit: "Pore-refining and skin-tone evening" }
    ],
    newIn: true,
    alternatives: {
      budget: { name: "True Match Lumi Glotion SPF20", brand: "L'Oréal", price: "£12.99", affiliateUrl: boots("L'Oréal True Match Lumi Glotion SPF20") },
      luxury: { name: "Skin Tint SPF30", brand: "Charlotte Tilbury", price: "£44.00", affiliateUrl: ctLink("Charlotte Tilbury Beautiful Skin Tint") },
      organic: { name: "Super Serum Skin Tint SPF40", brand: "ILIA", price: "£48.00", affiliateUrl: sep("ILIA Super Serum Skin Tint SPF40") }
    }
  },

  {
    id: "p94", name: "Phytodefiant Glowing Serum 30ml", brand: "Fresh", category: "serum",
    tags: ["serum","glow","anti-aging","adaptogen","luxury"],
    description: "Fresh's advanced adaptogen serum defends against urban stress and visible aging using a 5-mushroom complex. Chaga, Lion's Mane, Reishi, Shiitake and Cordyceps each bring unique antioxidant and anti-fatigue properties, while Vitamin C brightens and Glycerin deeply hydrates. Skin is visibly more luminous, firm and even-toned in 2 weeks. A luxury wellbeing treatment for skin.",
    price: "£95.00",
    image: "https://static.thcdn.com/productimg/original/13127445-1314876948653555.jpg",
    affiliateUrl: lf("Fresh Phytodefiant Glowing Serum"),
    zones: ["full-face"],
    suitableFor: ["all-skin-types","mature","dull-skin","stressed-skin"],
    keyIngredients: [
      { name: "5-Mushroom Adaptogen Complex", benefit: "Protects against oxidative stress and skin fatigue" },
      { name: "Vitamin C", benefit: "Brightens and corrects uneven skin tone" },
      { name: "Glycerin", benefit: "Draws moisture into skin for lasting hydration" }
    ],
    alternatives: {
      budget: { name: "Multi-Peptide Serum for Hair Density", brand: "The Ordinary", price: "£12.90", affiliateUrl: cult("The Ordinary Multi-Peptide Serum") },
      luxury: { name: "Rose Immortelle Precious Serum", brand: "L'Occitane", price: "£84.00", affiliateUrl: lf("L'Occitane Rose Immortelle Serum") },
      organic: { name: "Beautifying Face Oil", brand: "Tata Harper", price: "£118.00", affiliateUrl: lf("Tata Harper Beautifying Face Oil") }
    }
  },

  {
    id: "p95", name: "Brilliant Future Eye Cream 15ml", brand: "Origins", category: "eye-cream",
    tags: ["eye-cream","brightening","vitamin-c","drugstore","anti-aging"],
    description: "Origins' award-winning Ginzing Brightening Eye Cream is the ultimate morning rescue for tired, puffy eyes. Coffee extract energises sluggish circulation to deflate puffiness while Optical Brighteners create an instant lightening effect. Ginger Root boosts micro-circulation and Vitamin C addresses dark circles over time. Refresh mode in a tube — lightweight, fast-absorbing, instantly transformative.",
    price: "£30.00",
    image: "https://static.thcdn.com/productimg/original/14229325-9815328212619315.jpg",
    affiliateUrl: lf("Origins GinZing Brightening Eye Cream"),
    zones: ["eye-area","under-eyes"],
    suitableFor: ["all-skin-types","normal","combination"],
    keyIngredients: [
      { name: "Coffee Bean Extract", benefit: "Stimulates circulation and reduces puffiness" },
      { name: "Ginger Root", benefit: "Anti-inflammatory that soothes and brightens" },
      { name: "Optical Brighteners", benefit: "Instant luminosity under eyes" }
    ],
    alternatives: {
      budget: { name: "Caffeine Eye Serum", brand: "The Ordinary", price: "£6.80", affiliateUrl: cult("The Ordinary Caffeine Solution 5%") },
      luxury: { name: "Advanced Night Repair Eye Supercharged Complex", brand: "Estée Lauder", price: "£70.00", affiliateUrl: lf("Estée Lauder Advanced Night Repair Eye") },
      organic: { name: "Eye Love You Eye Cream", brand: "Pai Skincare", price: "£42.00", affiliateUrl: lf("Pai Skincare Eye Love You") }
    }
  },

  {
    id: "p96", name: "Skin Caviar Luxe Cream 50ml", brand: "La Prairie", category: "moisturiser",
    tags: ["luxury","caviar","firming","anti-aging","iconic"],
    description: "La Prairie's legendary Skin Caviar Luxe Cream is the ultimate luxury anti-aging moisturiser. Charged with Caviar Absolute — a proprietary concentration of Caviar Extract — it activates cellular energy renewal while a lifting complex visibly firms and restructures facial contours. Swiss technology meets marine biology in an ultra-sensorial cream that transforms skin density overnight. The ultimate indulgence.",
    price: "£490.00",
    image: "https://static.thcdn.com/productimg/original/14920801-4765310615871989.jpg",
    affiliateUrl: lf("La Prairie Skin Caviar Luxe Cream"),
    zones: ["full-face","neck","décolletage"],
    suitableFor: ["mature","dry","normal"],
    keyIngredients: [
      { name: "Caviar Absolute", benefit: "Activates cellular energy and renewal pathways" },
      { name: "Exclusive Lifting Complex", benefit: "Firms and restructures facial contours visibly" },
      { name: "Swiss Glacier Water", benefit: "Ultra-pure hydration that plumps and smooths" }
    ],
    alternatives: {
      budget: { name: "Retinol Anti-Wrinkle Night Cream", brand: "RoC", price: "£24.99", affiliateUrl: boots("RoC Retinol Anti-Wrinkle Night Cream") },
      luxury: { name: "Crème de La Mer 60ml", brand: "La Mer", price: "£320.00", affiliateUrl: lf("La Mer Creme de La Mer 60ml") },
      organic: { name: "Probiotic Moisturiser", brand: "Tata Harper", price: "£110.00", affiliateUrl: lf("Tata Harper Probiotic Moisturiser") }
    }
  },

  {
    id: "p97", name: "Wild Rose Beauty Balm SPF15", brand: "Neal's Yard Remedies", category: "moisturiser",
    tags: ["organic","natural","rosehip","SPF15","balm"],
    description: "Neal's Yard Remedies' flagship beauty balm is a certified organic, multi-award-winning moisturiser powered by the highest concentration of wild rose hip and rosehip seed oil. The rich, nourishing balm protects with SPF15 while delivering intense hydration and radiance. Free from synthetic fragrances, parabens and SLS — a gold standard for clean, organic skincare.",
    price: "£42.00",
    image: "https://static.thcdn.com/productimg/original/13938508-1485227181179494.jpg",
    affiliateUrl: lf("Neals Yard Remedies Wild Rose Beauty Balm"),
    zones: ["full-face"],
    suitableFor: ["dry","sensitive","mature","all-skin-types"],
    keyIngredients: [
      { name: "Wild Rose Hip Oil", benefit: "Certified organic source of Vitamin C and essential fatty acids" },
      { name: "Rosehip Seed Oil", benefit: "Regenerates and brightens while deeply nourishing" },
      { name: "SPF15 Natural Filters", benefit: "Mineral daily UV protection" }
    ],
    alternatives: {
      budget: { name: "Rosehip Seed Oil", brand: "The Ordinary", price: "£9.90", affiliateUrl: cult("The Ordinary Rosehip Seed Oil") },
      luxury: { name: "Midnight Recovery Concentrate", brand: "Kiehl's", price: "£58.00", affiliateUrl: lf("Kiehl's Midnight Recovery Concentrate") },
      organic: { name: "Beautifying Face Oil", brand: "Tata Harper", price: "£118.00", affiliateUrl: lf("Tata Harper Beautifying Face Oil") }
    }
  },

  {
    id: "p98", name: "Advanced Génifique Youth Activating Serum 30ml", brand: "Lancôme", category: "serum",
    tags: ["serum","anti-aging","microbiome","prebiotics","luxury"],
    description: "Lancôme's iconic Génifique serum has been refomulated with 7 Fermented Ingredients and Bifidus Extract to target the skin's microbiome — the first luxury serum to do so clinically. Hyaluronic acid fragments penetrate at multiple skin layers while vitamin Cg brightens and Vitamin E protects. In 7 days, skin is visibly more radiant, smooth and youthful. Over 1 serum sold every 5 seconds globally.",
    price: "£58.00",
    image: "https://static.thcdn.com/productimg/original/15452165-2005169051380055.jpg",
    affiliateUrl: lf("Lancome Advanced Genifique Youth Activating Serum"),
    zones: ["full-face"],
    suitableFor: ["all-skin-types","mature","dull-skin"],
    keyIngredients: [
      { name: "Bifidus Extract", benefit: "Strengthens skin's microbiome for resilience" },
      { name: "7 Fermented Ingredients", benefit: "Improve skin renewal and luminosity" },
      { name: "Hyaluronic Acid Fragments", benefit: "Multi-level hydration and plumping" }
    ],
    bestSeller: true,
    alternatives: {
      budget: { name: "Niacinamide 10% + Zinc 1%", brand: "The Ordinary", price: "£5.00", affiliateUrl: cult("The Ordinary Niacinamide 10%") },
      luxury: { name: "Augustinus Bader The Serum", brand: "Augustinus Bader", price: "£295.00", affiliateUrl: lf("Augustinus Bader The Serum") },
      organic: { name: "Resurfacing Serum", brand: "Tata Harper", price: "£120.00", affiliateUrl: lf("Tata Harper Resurfacing Serum") }
    }
  },

  {
    id: "p99", name: "No7 Future Renew Serum 30ml", brand: "No7", category: "serum",
    tags: ["drugstore","peptides","anti-aging","accessible","UK-favourite"],
    description: "No7's groundbreaking Future Renew Serum became the fastest-selling beauty product in UK history, selling out in 72 hours at launch. Powered by a patented UV shield peptide complex backed by 10 years of research, it visibly reverses signs of UV damage and aging. Clinically proven to reduce wrinkles and improve skin texture in 4 weeks. Award-winning, dermatologist-approved and accessible to all.",
    price: "£34.95",
    image: "https://static.thcdn.com/productimg/original/13494904-2074935001507137.jpg",
    affiliateUrl: boots("No7 Future Renew Serum"),
    zones: ["full-face"],
    suitableFor: ["all-skin-types","mature","sensitive","combination"],
    keyIngredients: [
      { name: "UV Shield Peptide Complex", benefit: "Patented ingredient that reverses UV skin damage" },
      { name: "Hyaluronic Acid", benefit: "Deep hydration for plumper, smoother skin" },
      { name: "Vitamin B Complex", benefit: "Improves skin tone, texture and brightness" }
    ],
    bestSeller: true,
    alternatives: {
      budget: { name: "Skin Active Serum", brand: "Garnier", price: "£12.99", affiliateUrl: boots("Garnier Skin Active Serum") },
      luxury: { name: "Advanced Night Repair Serum", brand: "Estée Lauder", price: "£100.00", affiliateUrl: lf("Estée Lauder Advanced Night Repair Serum") },
      organic: { name: "Resurfacing Serum", brand: "Tata Harper", price: "£120.00", affiliateUrl: lf("Tata Harper Resurfacing Serum") }
    }
  },

  {
    id: "p100", name: "The Dewy Dream Moisturiser 50ml", brand: "Glow Recipe", category: "moisturiser",
    tags: ["hyaluronic-acid","dewy","plumping","brightening","vegan"],
    description: "Glow Recipe's Plum Plump Hyaluronic Acid Serum-in-Moisturiser delivers plump, bouncy, glass-skin hydration with five forms of hyaluronic acid working at different molecular weights. Plum extract provides antioxidant protection and a natural pink tint that imparts a healthy glow. Polyglutamic acid holds 2x more moisture than standard HA for lasting dewiness. K-beauty inspired, globally adored.",
    price: "£39.00",
    image: "https://static.thcdn.com/productimg/original/14512691-1005321768111667.jpg",
    affiliateUrl: cult("Glow Recipe Plum Plump Hyaluronic Acid Moisturiser"),
    zones: ["full-face"],
    suitableFor: ["all-skin-types","dry","dehydrated","combination"],
    keyIngredients: [
      { name: "5 Forms of Hyaluronic Acid", benefit: "Multi-depth hydration from surface to dermis" },
      { name: "Polyglutamic Acid", benefit: "Holds 2x more moisture than standard HA" },
      { name: "Plum Extract", benefit: "Antioxidant-rich and naturally brightening" }
    ],
    newIn: true,
    alternatives: {
      budget: { name: "Hydro Boost Water Cream", brand: "Neutrogena", price: "£19.99", affiliateUrl: boots("Neutrogena Hydro Boost Water Cream") },
      luxury: { name: "Water Cream 50ml", brand: "Tatcha", price: "£79.00", affiliateUrl: snk("Tatcha Water Cream") },
      organic: { name: "Organic Hyaluronic Hydration Serum", brand: "Pai Skincare", price: "£38.00", affiliateUrl: lf("Pai Skincare Hyaluronic Hydration Serum") }
    }
  },

];

export default CATALOG;
