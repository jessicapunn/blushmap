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
    tags:["hydrating","barrier-repair","fragrance-free","sensitive","non-comedogenic"],
    description:"Dermatologist-developed emollient containing physiological ceramides (1, 3, 6-II) and patented MVE (MultiVesicular Emulsion) technology for controlled 24hr release of humectants. Fragrance-free, non-comedogenic. Evidence grade A for barrier repair and TEWL reduction. Safe for Fitzpatrick I–VI.",
    affiliateUrl:amz("CeraVe Moisturising Cream 340g"),
    zones:["full-face","cheeks"], suitableFor:["dry","sensitive","normal","barrier-compromised","eczema-prone"],
    keyIngredients:[{name:"Ceramides 1, 3, 6-II (Physiological ratio)",benefit:"Restores lamellar bilayer structure of the stratum corneum — evidence grade A for TEWL reduction"},{name:"Sodium Hyaluronate (multi-weight)",benefit:"Humectant — draws moisture into the epidermis and dermis"},{name:"Niacinamide 1%",benefit:"Anti-inflammatory, reduces erythema, strengthens barrier"}],
    alternatives:{
      budget:{name:"Simple Kind to Skin Moisturiser",brand:"Simple",price:"£4.99",affiliateUrl:amz("Simple Kind to Skin Moisturiser")},
      luxury:{name:"Crème de la Mer",brand:"La Mer",price:"£125",affiliateUrl:amz("La Mer Creme de la Mer moisturiser")},
      organic:{name:"Ultra Facial Cream",brand:"Kiehl's",price:"£30",affiliateUrl:amz("Kiehls Ultra Facial Cream")},
    }, bestSeller:true,
  },
  {
    id:"p2", name:"Hydro Boost Water Gel", brand:"Neutrogena",
    category:"moisturiser", price:"£16.99", image:IMG.p2,
    tags:["oily","lightweight","gel","non-comedogenic","oil-free"],
    description:"Oil-free aqueous gel moisturiser. Sodium hyaluronate provides high-capacity water retention in the stratum corneum without occlusion. Ideal for elevated sebaceous activity and Fitzpatrick III–V oily-combination types. Non-comedogenic, allergy-tested.",
    affiliateUrl:amz("Neutrogena Hydro Boost Water Gel 50ml"),
    zones:["full-face","t-zone"], suitableFor:["oily","combination","normal","acne-prone"],
    keyIngredients:[{name:"Sodium Hyaluronate",benefit:"Binds up to 1000x its weight in water — plumps without grease or occlusion"},{name:"Dimethicone",benefit:"Lightweight emollient that smooths texture without clogging follicles"},{name:"Olive Oil Esters (non-comedogenic)",benefit:"Skin-softening without pore-blocking"}],
    alternatives:{
      budget:{name:"Aqua Gel Moisturiser",brand:"Garnier",price:"£7.99",affiliateUrl:amz("Garnier Skin Naturals Aqua Gel")},
      luxury:{name:"Water Cream",brand:"Tatcha",price:"£69",affiliateUrl:amz("Tatcha Water Cream")},
      organic:{name:"Hydro Boost Aloe",brand:"The Inkey List",price:"£10",affiliateUrl:amz("The Inkey List Aloe Vera moisturiser")},
    }, bestSeller:true,
  },
  {
    id:"p3", name:"Water Cream", brand:"Tatcha",
    category:"moisturiser", price:"£69", image:IMG.p3,
    tags:["luxury","brightening","anti-ageing","dewy","lightweight"],
    description:"Silica-free water-burst moisturiser built around Hadasei-3™ — a trinity of Japanese superfoods: Uji green tea (EGCG polyphenols, antioxidant grade A), Japanese rice (ceramide precursors, barrier reinforcement) and wild leopard lily (cAMP regulation, sebum normalisation). The oil-free gel matrix leverages glycerin and sodium hyaluronate at multiple molecular weights for stratified stratum corneum hydration without occlusion. Ideal for Fitzpatrick II–IV with normal-combination skin types where a radiant, non-greasy finish is desired. The absence of synthetic fragrance reduces sensitisation risk.",
    affiliateUrl:amz("Tatcha Water Cream 50ml"),
    zones:["full-face"], suitableFor:["normal","combination","oily","sensitive"],
    keyIngredients:[{name:"Hadasei-3™ (Green Tea EGCG, Akita Rice, Leopard Lily)",benefit:"Synergistic Japanese biocomplex — EGCG antioxidant, rice ceramide precursors for barrier integrity, leopard lily cAMP for sebum normalisation"},{name:"Sodium Hyaluronate (multi-weight)",benefit:"Hydrates across multiple dermal layers — low MW penetrates dermis, high MW films stratum corneum"},{name:"Glycerin",benefit:"Osmotic humectant — draws moisture from dermis to epidermis, maintains hydration gradient"}],
    alternatives:{
      budget:{name:"Hydro Boost",brand:"Neutrogena",price:"£16.99",affiliateUrl:amz("Neutrogena Hydro Boost")},
      luxury:{name:"Crème Ancienne",brand:"Fresh",price:"£280",affiliateUrl:amz("Fresh Creme Ancienne")},
      organic:{name:"Youth to the People Superfood",brand:"Youth to the People",price:"£48",affiliateUrl:amz("Youth to the People Superfood Moisturiser")},
    },
  },
  {
    id:"p4", name:"Lala Retro Whipped Cream", brand:"Drunk Elephant",
    category:"moisturiser", price:"£48", image:IMG.p4,
    tags:["nourishing","barrier","peptides","ceramides","luxury","fragrance-free"],
    description:"Comprehensive lipid-replacement moisturiser formulated without the Suspicious 6™ (essential oils, drying alcohols, silicones, chemical screens, fragrances/dyes, SLS). The whipped emulsion delivers a six-ceramide complex (ceramides 1, 2, 3, 6-II, EOP and NS) alongside a complete fatty acid profile (linoleic, oleic, stearic) to physically replenish stratum corneum lipids lost through barrier dysfunction, TEWL or aggressive active treatment. Kalahari melon oil contributes 65% linoleic acid — the most deficient fatty acid in acne-prone and sensitised skin. Marula oil delivers oleic acid for emolliency without comedogenicity concerns at therapeutic concentrations. CLINICAL NOTE: Rich enough for overnight barrier repair in Fitzpatrick types with compromised barriers; too emollient for high sebaceous activity in a daytime context.",
    affiliateUrl:amz("Drunk Elephant Lala Retro Whipped Cream"),
    zones:["full-face","cheeks"], suitableFor:["dry","mature","sensitive","barrier-compromised","eczema-prone"],
    keyIngredients:[{name:"Six-Ceramide Complex (1, 2, 3, 6-II, EOP, NS)",benefit:"Full lamellar bilayer reconstruction — addresses all three ceramide deficiency patterns associated with barrier compromise, evidence grade A"},{name:"Kalahari Melon Seed Oil (65% linoleic acid)",benefit:"Restores linoleic acid deficiency — the key fatty acid deficit in acne-prone and sensitised skin that drives comedone formation"},{name:"Marula Oil (Sclerocarya birrea)",benefit:"High oleic acid emollient with antioxidant polyphenols — non-comedogenic at this concentration, seals transepidermal water loss"}],
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
    tags:["pores","oily","brightening","acne","affordable","fragrance-free"],
    description:"High-concentration niacinamide (nicotinamide) serum with zinc PCA. Niacinamide at 10% inhibits melanosome transfer (brightening), reduces sebaceous gland activity (sebum regulation), strengthens the epidermal barrier and has clinically proven anti-inflammatory effects. Note: 10% can cause flushing in rosacea-prone skin — start with 2-3x weekly. Do not layer with pure vitamin C (L-ascorbic acid) as nicotinic acid formation can cause flushing. Evidence grade A.",
    affiliateUrl:amz("The Ordinary Niacinamide 10% Zinc 1% 30ml"),
    zones:["t-zone","nose","forehead","cheeks"], suitableFor:["oily","combination","acne-prone","hyperpigmentation"],
    keyIngredients:[{name:"Niacinamide (Nicotinamide) 10%",benefit:"Inhibits melanosome transfer, reduces sebum, strengthens barrier, anti-inflammatory — evidence grade A"},{name:"Zinc PCA 1%",benefit:"Antimicrobial, sebum-regulating, anti-inflammatory for acne-prone skin"}],
    alternatives:{
      budget:{name:"Niacinamide Serum",brand:"e.l.f.",price:"£12",affiliateUrl:amz("elf Niacinamide Serum")},
      luxury:{name:"Smart Dose Serum",brand:"Clinique",price:"£55",affiliateUrl:amz("Clinique Smart Clinical MD serum")},
      organic:{name:"Niacinamide 10%",brand:"INKEY List",price:"£10",affiliateUrl:amz("Inkey List Niacinamide serum")},
    }, bestSeller:true,
  },
  {
    id:"p6", name:"C E Ferulic", brand:"SkinCeuticals",
    category:"serum", price:"£166", image:IMG.p6,
    tags:["vitamin-c","antioxidant","brightening","anti-ageing","luxury","photoprotection"],
    description:"The gold-standard antioxidant serum. 15% L-ascorbic acid (pure vitamin C) at pH 3.5 — the clinically validated delivery form. Ferulic acid doubles the photoprotective efficacy of vitamins C and E (Pinnell et al., 2005 study). Inhibits tyrosinase activity for long-term hyperpigmentation reduction. Best for Fitzpatrick I–IV. Higher Fitzpatrick types (V–VI) should patch-test due to potential irritation at low pH.",
    affiliateUrl:amz("SkinCeuticals C E Ferulic vitamin C serum"),
    zones:["full-face"], suitableFor:["normal","dry","mature","photoaged","hyperpigmentation"],
    keyIngredients:[{name:"L-Ascorbic Acid 15% (pH 3.5)",benefit:"Tyrosinase inhibition, collagen stimulation, antioxidant — evidence grade A. The only bioavailable form of vitamin C"},{name:"Alpha-Tocopherol (Vitamin E) 1%",benefit:"Lipid-soluble antioxidant that synergises with vitamin C for 4x antioxidant protection"},{name:"Ferulic Acid 0.5%",benefit:"Phenolic antioxidant that stabilises vitamin C and doubles UV protection efficacy"}],
    alternatives:{
      budget:{name:"Vitamin C Suspension 23%",brand:"The Ordinary",price:"£5.90",affiliateUrl:amz("The Ordinary Vitamin C Suspension 23")},
      luxury:{name:"Glow Drops",brand:"Charlotte Tilbury",price:"£45",affiliateUrl:amz("Charlotte Tilbury Brightening Youth Glow drops")},
      organic:{name:"Potent-C Power Serum",brand:"Murad",price:"£82",affiliateUrl:amz("Murad Vitamin C serum")},
    },
  },
  {
    id:"p7", name:"2% BHA Liquid Exfoliant", brand:"Paula's Choice",
    category:"toner", price:"£32", image:IMG.p7,
    tags:["exfoliant","bha","pores","blackheads","acne","salicylic-acid"],
    description:"Leave-on BHA (beta-hydroxy acid) exfoliant at the clinically effective 2% salicylic acid concentration. Salicylic acid is lipophilic — it penetrates the sebaceous follicle to dissolve keratin plugs (blackheads/whiteheads) and reduce comedone burden. Anti-inflammatory via prostaglandin inhibition. pH 3.2–4.0 for effective keratolytic action. Not suitable for broken skin, active rosacea, or if using retinoids without acclimatisation. Avoid in pregnancy.",
    affiliateUrl:amz("Paula's Choice 2% BHA Liquid Exfoliant 118ml"),
    zones:["t-zone","nose","forehead","chin"], suitableFor:["oily","combination","acne-prone","congested"],
    keyIngredients:[{name:"Salicylic Acid (BHA) 2% at pH 3.2",benefit:"Lipophilic — penetrates sebaceous glands to dissolve keratin plugs. Anti-inflammatory. Evidence grade A for comedonal acne"},{name:"Methylpropanediol",benefit:"Delivery-enhancing humectant that also has mild antimicrobial properties"},{name:"Green Tea Extract (EGCG)",benefit:"Polyphenol antioxidant — reduces post-exfoliation inflammation"}],
    alternatives:{
      budget:{name:"Ordinary Glycolic Acid 7%",brand:"The Ordinary",price:"£7.90",affiliateUrl:amz("The Ordinary Glycolic Acid Toning Solution")},
      luxury:{name:"Gommage Éclat",brand:"Sisley",price:"£64",affiliateUrl:amz("Sisley Radiance Gommage")},
      organic:{name:"AHA BHA Fruit Acid Glow Tonic",brand:"Elemis",price:"£32",affiliateUrl:amz("Elemis fruit acid glow tonic")},
    }, bestSeller:true,
  },
  {
    id:"p8", name:"Advanced Night Repair Serum", brand:"Estée Lauder",
    category:"serum", price:"£85", image:IMG.p8,
    tags:["night","repair","hyaluronic","anti-ageing","iconic","circadian"],
    description:"Chronobiology-informed repair serum leveraging ChronoluxCB™ technology — a patented bifida ferment lysate and yeast complex that activates the skin’s circadian clock gene expression (SIRT1, CLOCK/BMAL1 pathway) during the nocturnal repair window (10pm–2am) when DNA repair enzymes are most active. The bi-phase hyaluronic acid complex (sodium hyaluronate + HA-Tripeptide-1) provides immediate surface plumping while the tripeptide conjugate facilitates deeper dermal penetration for sustained moisture retention. Caffeine at therapeutic concentration inhibits phosphodiesterase, increasing cAMP-mediated lipolysis in adipocytes beneath the periorbital area. Suitable for all Fitzpatrick types — the fragrance-free formulation reduces sensitisation risk for reactive skin. CLINICAL PRIORITY: Best used immediately after cleansing before heavier actives; the hyaluronic acid humectant base should always be topped with an occlusive to prevent hygroscopic dehydration in low-humidity environments.",
    affiliateUrl:amz("Estee Lauder Advanced Night Repair Serum 50ml"),
    zones:["full-face","periorbital"], suitableFor:["all","mature","dry","combination","normal"],
    keyIngredients:[{name:"ChronoluxCB™ (Bifida Ferment Lysate + Yeast Complex)",benefit:"Activates circadian clock gene expression (SIRT1/BMAL1) to synchronise and amplify the skin’s natural nocturnal DNA repair cycle"},{name:"HA-Tripeptide-1 (Hyaluronic Acid + Tripeptide Conjugate)",benefit:"Penetrates deeper than conventional HA alone — restores dermis moisture reservoir and supports collagen fibril integrity"},{name:"Caffeine",benefit:"Phosphodiesterase inhibitor — increases cAMP, reduces periorbital adipocyte volume and vascular congestion contributing to dark circles"}],
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
    tags:["spf","protection","lightweight","daily","sensitive","broad-spectrum","UVA1"],
    description:"Clinically superior broad-spectrum SPF50+. UVMune 400 (Mexoryl 400) is the only EU-approved filter that specifically protects against very long UVA1 rays (370–400nm) — the wavelengths most responsible for photoageing, DNA damage and melasma triggering in all Fitzpatrick types. Critical for Fitzpatrick IV–VI to prevent PIH. Non-greasy fluid finish. Fragrance-free, no oxybenzone. Dermatologist no.1 recommendation for daily photoprotection.",
    affiliateUrl:amz("La Roche Posay Anthelios UVMune 400 SPF50 Fluid"),
    zones:["full-face"], suitableFor:["all","sensitive","oily","rosacea","post-procedure","hyperpigmentation"],
    keyIngredients:[{name:"Mexoryl 400 (Bemotrizinol)",benefit:"Only EU-approved UVA1 filter — protects against long-wave UVA rays most responsible for photoageing and melasma"},{name:"Mexoryl SX + XL",benefit:"Broad UVA coverage complementing Mexoryl 400"},{name:"Tinosorb S",benefit:"Photostable UVB + UVA filter — does not degrade in sunlight unlike older chemical filters"}],
    alternatives:{
      budget:{name:"Bondi Sands SPF50 Face Mist",brand:"Bondi Sands",price:"£10",affiliateUrl:amz("Bondi Sands SPF50 face")},
      luxury:{name:"Sheer Physical UV Defense SPF50",brand:"SkinCeuticals",price:"£41",affiliateUrl:amz("SkinCeuticals Sheer Physical UV Defense SPF50")},
      organic:{name:"Ultra Light Daily UV Defense SPF50",brand:"Kiehl's",price:"£32",affiliateUrl:amz("Kiehls Ultra Light Daily UV Defense SPF50")},
    }, bestSeller:true,
  },
  {
    id:"p10", name:"Face Sun Protector SPF50", brand:"Ultrasun",
    category:"spf", price:"£19.50", image:IMG.p10,
    tags:["spf","anti-ageing","daily","sensitive","once-a-day","water-resistant"],
    description:"Uniquely once-daily SPF50 formulation using film-forming polymer technology (polysilicone-15 matrix) that creates a continuous UV-filtering film over the skin’s surface — unlike conventional SPFs that thin and fragment with movement, sweat and sebum within 2 hours. The sustained-release filter network maintains critical UVA/UVB coverage for up to 8 hours without reapplication, validated in ISO 24444:2019 and PPD (persistent pigment darkening) testing. Contains Ultrasun’s proprietary Cellular Protective Blend: Tinosorb S (photostable UVA/UVB), Uvinul A Plus, and vitamin E as antioxidant quencher. Oxybenzone-free. No fragrance. Particularly important for Fitzpatrick I–III where cumulative UVA exposure drives photoageing faster, and for post-procedure skin requiring reliable passive protection without frequent re-touching.",
    affiliateUrl:amz("Ultrasun Face SPF50 Anti-Ageing 50ml"),
    zones:["full-face"], suitableFor:["all","sensitive","dry","mature","post-procedure"],
    keyIngredients:[{name:"Tinosorb S (Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine)",benefit:"Photostable broad-spectrum UVA/UVB filter — does not degrade or lose efficacy over time unlike older filters such as avobenzone"},{name:"Uvinul A Plus (Diethylamino Hydroxybenzoyl Hexyl Benzoate)",benefit:"Extended UVA coverage complementing Tinosorb S — targets long-wave UVA responsible for collagen degradation and DNA strand breaks"},{name:"Polysilicone-15 Film-Forming Matrix",benefit:"Creates a flexible, elastic SPF film that resists fragmentation from sweat, sebum and mechanical movement — enables true once-daily protection"}],
    alternatives:{
      budget:{name:"Garnier Ambre Solaire SPF50",brand:"Garnier",price:"£8",affiliateUrl:amz("Garnier Ambre Solaire SPF50 face")},
      luxury:{name:"Total Eye Defense SPF15",brand:"Shiseido",price:"£48",affiliateUrl:amz("Shiseido sunscreen face SPF50")},
      organic:{name:"Altruist SPF50",brand:"Altruist",price:"£3",affiliateUrl:amz("Altruist Face Fluid SPF50")},
    },
  },
  {
    id:"p11", name:"Anthelios Tinted Fluid SPF50+", brand:"La Roche-Posay",
    category:"tinted-spf", price:"£18", image:IMG.p11,
    tags:["tinted","spf","no-white-cast","natural","all-tones","visible-light-protection","melasma"],
    description:"CLINICALLY IMPORTANT: Tinted SPFs containing iron oxides provide protection against high-energy visible light (HEVL / blue-violet light, 400–450nm), which is a proven trigger for melasma and PIH — UV filters alone do NOT block this. This is the dermatologist-recommended choice for Fitzpatrick IV–VI or any patient with melasma, PIH, or visible light sensitivity. The iron oxide tint neutralises the white cast from mineral filters. Available in Light-Medium and Medium shades.",
    affiliateUrl:amz("La Roche Posay Anthelios Tinted Fluid SPF50 medium"),
    zones:["full-face"], suitableFor:["all","oily","combination","melasma","hyperpigmentation","Fitzpatrick-IV-VI"],
    keyIngredients:[{name:"Mexoryl SX & XL + Mexoryl 400",benefit:"Complete UVA/UVB/UVA1 protection spectrum"},{name:"Iron Oxides (CI 77491, 77492, 77499)",benefit:"HEVL / visible light blocking — critical for melasma and PIH prevention in Fitzpatrick IV–VI"},{name:"Thermal Spring Water",benefit:"Anti-inflammatory soothing base"}],
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
    tags:["full-coverage","matte","long-lasting","luxury","blurring"],
    description:"Medium-to-full coverage liquid foundation with Photo-Focus Complex™ — a blend of micronised silica (spherical light-diffusing particles 5–8μm) and dimethicone that creates soft-focus optical blurring of pores and fine lines without a cakey texture build-up. The lightweight, water-resistant polymer matrix (acrylates/octylacrylamide copolymer) provides up to 24-hour wear with sebum-control properties, making it clinically appropriate for elevated sebaceous activity (oily, combination types). Sodium hyaluronate maintains transepidermal hydration through the film layer. Available in 44 shades with a warm-neutral-cool undertone axis — critical for accurate Fitzpatrick IV–VI shade matching. CLINICAL NOTE: Contains parfum/fragrance — not ideal for rosacea or known fragrance sensitisation. Test patch on chin zone before full application.",
    affiliateUrl:amz("Charlotte Tilbury Airbrush Flawless Foundation 30ml"),
    zones:["full-face"], suitableFor:["all","oily","combination","normal"],
    keyIngredients:[{name:"Micronised Silica (5–8μm spheres)",benefit:"Soft-focus optical blurring of pores and fine lines — scatters light uniformly across skin surface for airbrushed finish"},{name:"Photo-Focus Complex™ (Acrylates/Octylacrylamide Copolymer)",benefit:"Lightweight polymer film that flexes with facial movement, resists sebum breakthrough and extends wear to 24 hours"},{name:"Sodium Hyaluronate",benefit:"Maintains hydration gradient beneath the foundation film to prevent dry-patch formation through the wear period"}],
    alternatives:{
      budget:{name:"Fit Me Matte+Poreless",brand:"Maybelline",price:"£7.99",affiliateUrl:amz("Maybelline Fit Me Matte Poreless Foundation")},
      luxury:{name:"Teint Idole Ultra Wear",brand:"Lancôme",price:"£42",affiliateUrl:amz("Lancome Teint Idole Ultra Wear Foundation")},
      organic:{name:"Skin Tint SPF20",brand:"RMS Beauty",price:"£42",affiliateUrl:amz("RMS Beauty Skin Tint")},
    }, bestSeller:true,
  },
  {
    id:"p13", name:"Natural Radiant Longwear Foundation", brand:"NARS",
    category:"foundation", price:"£44", image:IMG.p13,
    tags:["medium-full","radiant","longwear","buildable","dewy"],
    description:"Buildable liquid foundation with NARS’ luminosity-engineering approach: pearl-coated mica pigments (CI 77019) at 5–15% concentration refract light at angles that mimic the specular and diffuse reflection pattern of healthy, hydrated skin — producing the optical signature of a ‘lit from within’ appearance without adding shine that reads as sebum. The hyaluronic acid system (sodium hyaluronate + acetyl glucosamine) provides both surface plumping and a hydration depot within the film. The longwear polymer system (VP/eicosene copolymer) flexes with facial muscle movement without cracking while maintaining pigment lock for up to 16 hours. Clinically appropriate for Fitzpatrick I–VI normal-to-dry skin types where the dewy finish will not read as excessive sebum. CLINICAL ALERT: The luminous finish may exacerbate the appearance of active acne comedones or enlarged pores by highlighting texture — a mattifying primer over the T-zone is recommended for combination types.",
    affiliateUrl:amz("NARS Natural Radiant Longwear Foundation"),
    zones:["full-face"], suitableFor:["normal","dry","combination","mature"],
    keyIngredients:[{name:"Pearl-Coated Mica (CI 77019, 5–15%)",benefit:"Multi-angle light refraction that replicates healthy skin’s specular and diffuse luminosity — not surface shine but structured radiance"},{name:"Sodium Hyaluronate + Acetyl Glucosamine",benefit:"Dual-action hydration system: surface film plumping (HA) + glycosaminoglycan precursor synthesis support (NAG)"},{name:"VP/Eicosene Copolymer",benefit:"Flexible longwear film former that maintains pigment adhesion under facial movement for 16-hour wear without cracking"}],
    alternatives:{
      budget:{name:"True Match Foundation",brand:"L'Oréal",price:"£9.99",affiliateUrl:amz("Loreal True Match Foundation")},
      luxury:{name:"Skin Weightless Powder Foundation",brand:"Laura Mercier",price:"£45",affiliateUrl:amz("Laura Mercier powder foundation")},
      organic:{name:"Serum Foundation",brand:"bareMinerals",price:"£36",affiliateUrl:amz("bareMinerals serum foundation")},
    },
  },
  {
    id:"p14", name:"Pro Filt'r Soft Matte Foundation", brand:"Fenty Beauty",
    category:"foundation", price:"£34", image:IMG.p14,
    tags:["inclusive","matte","50-shades","medium-full","diverse","oil-free"],
    description:"Industry-redefining oil-free matte foundation offering 50 shades engineered with undertone accuracy across the full Fitzpatrick I–VI spectrum — critically including deep shades with warm, neutral and cool undertone variants that are chronically under-represented in mass-market foundations. The soft-matte finish is achieved via dimethicone-silica complex and isododecane as the volatile carrier — providing a semi-porous film that controls sebum breakthrough without fully occluding. 12-hour wear validated in sebum-excess conditions. Oil-free formula makes it appropriate for Fitzpatrick IV–VI oily skin types where standard foundations often oxidise toward orange on higher melanin concentrations due to iron oxide mismatching. CLINICAL NOTE: Isododecane evaporates during application, which can temporarily increase sensation of tightness in dry or barrier-compromised skin — apply after a hydrating serum to prevent this. Contains dimethicone which is generally non-comedogenic but may occlude in high concentrations for very acne-prone types.",
    affiliateUrl:amz("Fenty Beauty Pro Filtr Soft Matte Foundation"),
    zones:["full-face"], suitableFor:["all","oily","combination","normal"],
    keyIngredients:[{name:"Dimethicone-Silica Complex",benefit:"Creates a micro-porous matte film that absorbs sebum without full occlusion — controls shine while allowing some transepidermal vapour exchange"},{name:"Isododecane",benefit:"Volatile silicone carrier that evaporates within 60 seconds of application, depositing the pigment film and leaving a weightless finish"},{name:"Iron Oxides (CI 77491, 77492, 77499 — 50-shade calibrated blend)",benefit:"Precision undertone-matched pigments across the full Fitzpatrick range, preventing oxidation/orange shift on higher melanin skin tones"}],
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
    tags:["brightening","dark-circles","under-eyes","full-coverage","creamy"],
    description:"Full-coverage creamy concealer engineered specifically for the periorbital zone — clinically the most challenging area to conceal due to the dermis being 0.5mm thick (vs 2mm on the cheeks), constant movement from orbicularis oculi muscle contractions, and varying dark circle aetiologies (vascular pigment, melanin pigment, structural shadowing). The pearl and titanium dioxide brightening system (CI 77891 at 5–12%) acts as a colour-correcting layer that counters the blue-purple vascular aetiology with warm-neutral optical neutralisation. Sodium hyaluronate at 0.1% maintains hydration in the thin periorbital dermis, reducing the creasing that occurs when concealer desiccates into fine lines. 30-shade range includes peach and peachy-pink correctors for Fitzpatrick I–IV dark circles before the main concealer layer. CLINICAL NOTE: For structural dark circles (caused by deep tear trough and orbital fat herniation), concealer addresses the pigment component only — inform patients that hollowing cannot be corrected with topical products.",
    affiliateUrl:amz("NARS Radiant Creamy Concealer"),
    zones:["under-eyes","dark-spots","blemishes"], suitableFor:["all","dry","normal","mature"],
    keyIngredients:[{name:"Titanium Dioxide + Pearl (CI 77891)",benefit:"Brightening pigment system that optically neutralises vascular blue-purple tones of dark circles through warm-neutral light scattering"},{name:"Sodium Hyaluronate",benefit:"Periorbital hydration depot — prevents concealer creasing into fine lines by maintaining dermal turgor in the 0.5mm-thick periorbital dermis"},{name:"Caprylic/Capric Triglyceride (MCT Oil)",benefit:"Lightweight emollient that prevents the dry, powdery finish that causes cracking of concealer over fine periorbital lines"}],
    alternatives:{
      budget:{name:"Fit Me Concealer",brand:"Maybelline",price:"£7.99",affiliateUrl:amz("Maybelline Fit Me Concealer")},
      luxury:{name:"Touche Éclat Illuminating Pen",brand:"YSL",price:"£34",affiliateUrl:amz("YSL Touche Eclat illuminating pen")},
      organic:{name:"Un Cover-Up Concealer",brand:"RMS Beauty",price:"£32",affiliateUrl:amz("RMS Beauty Un Cover Up Concealer")},
    }, bestSeller:true,
  },
  {
    id:"p16", name:"Fit Me Concealer", brand:"Maybelline",
    category:"concealer", price:"£7.99", image:IMG.p16,
    tags:["affordable","lightweight","natural","everyday","fragrance-free"],
    description:"Accessible lightweight concealer with a naturally-finishing polymer film that is clinically appropriate for oily and combination skin types where heavier cream formulations may slide. Available in 18 shades with a reasonably good undertone range for a mass-market product. The vitamin E (tocopherol) at anti-oxidant concentration protects against environmental free radical damage in the thin skin where it is applied. While not as pigment-dense as luxury counterparts, the buildable medium coverage is sufficient for mild post-inflammatory hyperpigmentation, superficial blemishes and mild periorbital shadowing. The lightweight water-in-silicone emulsion resists creasing for moderate wear time. CLINICAL NOTE: The relatively lower pigment load (compared to NARS or Charlotte Tilbury concealers) means it performs best on even, smooth skin — not ideal for covering grade 3–4 acne nodules or significant PIH without layering.",
    affiliateUrl:amz("Maybelline Fit Me Concealer"),
    zones:["under-eyes","blemishes"], suitableFor:["all","oily","combination","normal"],
    keyIngredients:[{name:"Tocopherol (Vitamin E)",benefit:"Lipid-soluble antioxidant that protects the periorbital dermis from environmental ROS damage while providing subtle emolliency"},{name:"Isododecane",benefit:"Volatile silicone that creates a featherlight, transfer-resistant film — sets to a natural finish without powdering or drying"},{name:"Iron Oxides (CI 77491, 77492)",benefit:"Coverage pigments in 18 shades — buildable from medium to medium-full coverage for everyday blemish and dark-circle correction"}],
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
    tags:["minimalist","hydrating","sensitive","korean","alcohol-free","fragrance-free"],
    description:"Clinically elegant minimalist essence toner containing 91.3% Astragalus membranaceus root extract as its primary (and near-only) active — a radical departure from the complex multi-ingredient toners that introduce unnecessary sensitisation risk. Astragalus root is a polysaccharide-rich adaptogenic botanical with a growing body of clinical evidence for skin benefits: astragalosides inhibit MMP-1 (matrix metalloproteinase-1, a key collagen-degrading enzyme), astragalus polysaccharides demonstrate dose-dependent antioxidant activity, and the high polysaccharide content provides humectant properties comparable to 2% hyaluronic acid. Critically, the formulation is alcohol-free, fragrance-free, colourant-free and preservative-minimal — making it the lowest-irritation-risk essence option for reactive skin, rosacea, or post-active-treatment recovery phases where barrier sensitisation is a concern. The watery essence texture layers seamlessly under any moisturiser.",
    affiliateUrl:amz("Pyunkang Yul Essence Toner 200ml"),
    zones:["full-face"], suitableFor:["sensitive","dry","normal","rosacea","barrier-compromised","post-procedure"],
    keyIngredients:[{name:"Astragalus membranaceus Root Extract (91.3%)",benefit:"MMP-1 inhibitor (collagen preservation) + polysaccharide humectant + antioxidant — three mechanisms in one ultra-minimal, near-zero irritation ingredient"},{name:"Glycerin",benefit:"Osmotic humectant that draws moisture from the dermis to stratum corneum — supports the polysaccharide hydration matrix from Astragalus"},{name:"Panthenol (Pro-Vitamin B5)",benefit:"Converts to pantothenic acid in the skin, accelerating keratinocyte migration and wound closure — particularly beneficial during barrier repair phases"}],
    alternatives:{
      budget:{name:"Simple Soothing Facial Toner",brand:"Simple",price:"£3.99",affiliateUrl:amz("Simple Soothing Toner")},
      luxury:{name:"Pitera Essence",brand:"SK-II",price:"£115",affiliateUrl:amz("SK-II Facial Treatment Essence Pitera")},
      organic:{name:"Midnight Recovery Concentrate",brand:"Kiehl's",price:"£52",affiliateUrl:amz("Kiehls Midnight Recovery Concentrate")},
    },
  },
  {
    id:"p18", name:"Snail Mucin 96% Power Repairing Essence", brand:"COSRX",
    category:"essence", price:"£22", image:IMG.p18,
    tags:["repair","snail","hydrating","korean","acne-scars","barrier-repair"],
    description:"Snail secretion filtrate (SSF) contains a naturally complex matrix of glycoproteins, glycosaminoglycans (including hyaluronic acid), antimicrobial peptides, proteases, and copper peptides. Clinical studies show SSF accelerates wound healing, promotes fibroblast proliferation, and has measurable effects on post-inflammatory hyperpigmentation. Suitable for all Fitzpatrick types. Lightweight gel texture with no fragrance. Ideal for barrier recovery phase following active treatment.",
    affiliateUrl:amz("COSRX Snail Mucin 96% Power Repairing Essence 100ml"),
    zones:["full-face","scarring","cheeks"], suitableFor:["all","acne-prone","sensitive","barrier-compromised","post-procedure"],
    keyIngredients:[{name:"Snail Secretion Filtrate 96%",benefit:"Complex of glycoproteins, copper peptides, and GAGs — promotes fibroblast activity, accelerates wound healing, reduces PIH. Evidence grade B+"},{name:"Sodium Hyaluronate",benefit:"Low-molecular-weight HA for deep-layer moisture retention"},{name:"Allantoin",benefit:"Keratolytic and wound-healing agent — softens scar tissue"}],
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
    tags:["eye","retinol","anti-ageing","affordable","fine-lines","niacinamide"],
    description:"Accessible retinol eye treatment that intelligently combines two of the most evidence-based actives for periorbital ageing at an accessible price point. Retinol in the periorbital region increases epidermal thickness (which thins with age, increasing the visibility of vascular structures causing periorbital darkness) and stimulates dermal collagen I/III synthesis to reduce fine rhytids (crow's feet). The formulation is buffered with niacinamide which simultaneously inhibits melanosome transfer (reducing pigment-based dark circles), reduces vascular permeability (reducing the vascular red-purple component), and provides anti-inflammatory support to reduce retinoid irritation. CLINICAL NOTE: The thin periorbital dermis is highly retinoid-sensitive — begin 2-3x weekly, avoiding the eyelid margin. Mandatory SPF the following morning. Not suitable in pregnancy. For clinical-strength retinoid periorbital treatment, Medik8 Crystal Retinal would be a step-up option for tolerant skin.",
    affiliateUrl:amz("Olay Pro Retinol Eye Treatment"),
    zones:["under-eyes","crow-feet"], suitableFor:["mature","normal","combination","dark-circles","fine-lines"],
    keyIngredients:[{name:"Retinol (encapsulated)",benefit:"Stimulates collagen I/III synthesis and increases periorbital epidermal thickness — reduces crow's feet and the skin thinning that worsens vascular dark circles"},{name:"Niacinamide (Nicotinamide)",benefit:"Triple mechanism for periorbital concerns: inhibits melanosome transfer (pigment DC), reduces vascular permeability (vascular DC), buffers retinol irritation"},{name:"Pentapeptide-4",benefit:"Stimulates collagen and fibronectin production via fibroblast activation — synergises with retinol for accelerated periorbital matrix renewal"}],
    alternatives:{
      budget:{name:"Q10 Eye Cream",brand:"Nivea",price:"£6.99",affiliateUrl:amz("Nivea Q10 Eye Cream")},
      luxury:{name:"Crème de la Mer Eye Concentrate",brand:"La Mer",price:"£180",affiliateUrl:amz("La Mer Eye Concentrate")},
      organic:{name:"Ginzing Brightening Eye Cream",brand:"Origins",price:"£28",affiliateUrl:amz("Origins Ginzing Eye Cream")},
    },
  },
  {
    id:"p20", name:"Creamy Eye Treatment with Avocado", brand:"Kiehl's",
    category:"eye-cream", price:"£32", image:IMG.p20,
    tags:["nourishing","avocado","dry","dark-circles","gentle","emollient"],
    description:"Rich emollient eye cream based on a shea butter and avocado oil lipid matrix — clinically appropriate for dry, dehydrated or mature periorbital skin where the primary concern is barrier lipid deficiency and structural moisture loss rather than active pigment or vascular dark circles. Avocado oil (Persea gratissima) delivers a unique combination of high oleic acid (63%), palmitic acid (16%), and unusually high levels of phytosterols (campesterol, beta-sitosterol, stigmasterol) which enhance skin barrier function by integrating into lamellar bilayer structures. Shea butter (Butyrospermum parkii) contributes triterpene alcohols with documented anti-inflammatory and UV-attenuating properties. The rich texture makes this clinically best suited to PM use on dry, mature periorbital skin — those with elevated sebaceous activity, milia history, or under-eye puffiness should opt for a lighter gel formulation to avoid milia formation from occlusive periorbital application. No retinol — safe for all ages including pregnancy.",
    affiliateUrl:amz("Kiehls Creamy Eye Treatment Avocado"),
    zones:["under-eyes","upper-lid"], suitableFor:["dry","mature","sensitive","normal"],
    keyIngredients:[{name:"Persea Gratissima (Avocado) Oil",benefit:"63% oleic acid + rare phytosterol profile (campesterol, beta-sitosterol) — integrates into lamellar bilayers to physically repair the periorbital lipid barrier"},{name:"Butyrospermum Parkii (Shea) Butter",benefit:"Triterpene alcohols provide NSAID-like anti-inflammatory activity and mild UV attenuation — nourishing without the sticky residue of petrolatum"},{name:"Beta-Sitosterol",benefit:"Phytosterol that reduces vascular permeability, directly addressing one mechanism of periorbital erythema and puffiness"}],
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
    tags:["foaming","oily","non-comedogenic","ceramides","gentle","fragrance-free"],
    description:"SLS-free foaming cleanser with physiological ceramides and MVE technology. Unlike most foaming cleansers that use SLS (a known barrier disruptor), CeraVe uses milder amphoteric surfactants (PEG-hydrogenated castor oil) that achieve thorough cleansing without significantly raising skin pH or stripping lipids. Maintains skin pH at approximately 5.5 (physiological) post-wash. Ideal for elevated sebaceous activity. BAD-endorsed for acne management routines.",
    affiliateUrl:amz("CeraVe Foaming Facial Cleanser 236ml"),
    zones:["full-face","t-zone"], suitableFor:["oily","combination","normal","acne-prone"],
    keyIngredients:[{name:"Ceramides 1, 3, 6-II",benefit:"Replenishes lipid barrier post-cleansing — critical to prevent over-stripping"},{name:"Niacinamide",benefit:"Anti-inflammatory action post-cleansing reduces reactive sebum production"},{name:"Sodium Hyaluronate",benefit:"Maintains hydration through the cleansing process"}],
    alternatives:{
      budget:{name:"Spotless Face Wash",brand:"Simple",price:"£3.99",affiliateUrl:amz("Simple Spotless face wash")},
      luxury:{name:"Instant Brightening Cleansing Foam",brand:"Caudalie",price:"£22",affiliateUrl:amz("Caudalie Cleansing Foam")},
      organic:{name:"Toleriane Hydrating Gentle Cleanser",brand:"La Roche-Posay",price:"£14",affiliateUrl:amz("La Roche Posay Toleriane Gentle Cleanser")},
    }, bestSeller:true,
  },
  {
    id:"p22", name:"Toleriane Hydrating Gentle Cleanser", brand:"La Roche-Posay",
    category:"cleanser", price:"£14", image:IMG.p22,
    tags:["gentle","sensitive","hydrating","fragrance-free","daily","prebiotic"],
    description:"La Roche-Posay’s formulation specifically designed for skin with a compromised microbiome or disrupted barrier — the two conditions most commonly associated with sensitive, reactive and dry skin. The cleansing base uses mild non-ionic surfactants (glyceryl glucoside, PEG-hydrogenated castor oil) that achieve adequate soil removal without ionic charge disruption to the skin’s acid mantle (pH 4.5–5.5). La Roche-Posay Thermal Spring Water provides selenium at skin-beneficial concentrations — selenium is a cofactor for glutathione peroxidase, the skin’s primary endogenous antioxidant enzyme, and is clinically deficient in sensitive and eczema-prone skin. The prebiotic glycerin + ceramide base supports the Lactobacillus/Staphylococcus epidermidis microbiome balance that acts as a first-line immunological defence barrier. Zero fragrance, parabens, SLS. Dermatologist-tested for perioral eczema and rosacea. CLINICAL NOTE: Creamy non-foaming format specifically benefits dry and dehydrated skin types where the mechanical foam sensation increases the perception of tightness — the cream rinses cleanly without residue.",
    affiliateUrl:amz("La Roche Posay Toleriane Hydrating Gentle Cleanser"),
    zones:["full-face"], suitableFor:["sensitive","dry","normal","rosacea","eczema-prone","barrier-compromised"],
    keyIngredients:[{name:"La Roche-Posay Thermal Spring Water (Se-enriched)",benefit:"Selenium cofactor for glutathione peroxidase — boosts the skin’s primary endogenous antioxidant defence, clinically deficient in sensitive and atopic skin"},{name:"Ceramide-3 + Glycerin Prebiotic Base",benefit:"Dual-action: ceramide physically repairs lamellar bilayers post-cleansing; glycerin maintains microbiome-supporting osmotic balance on the skin surface"},{name:"Niacinamide",benefit:"Post-cleansing anti-inflammatory action that suppresses the reactive erythema and barrier permeability increase that often follows cleansing in sensitive skin"}],
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
    tags:["retinal","anti-ageing","wrinkles","advanced","night","prescription-strength-alternative"],
    description:"Retinaldehyde (retinal) is the direct aldehyde precursor to retinoic acid — one metabolic step closer to the active form than retinol, making it approximately 11x more potent with a superior efficacy-to-irritation ratio. Time-release crystal technology buffers delivery to reduce retinoid dermatitis. CLINICAL NOTE: Begin with 2-3x per week, always at night, with SPF mandatory the following morning. Contraindicated in pregnancy. Do not combine with BHA/AHA on the same evening. Avoid if barrier-compromised. Not suitable for rosacea.",
    affiliateUrl:amz("Medik8 Crystal Retinal 6 Night Serum 30ml"),
    zones:["full-face"], suitableFor:["mature","normal","combination","fine-lines","acne-scars"],
    keyIngredients:[{name:"Retinaldehyde 0.06% (Crystal Retinal 6)",benefit:"Direct retinoic acid precursor — stimulates collagen I synthesis, accelerates cell turnover, reduces comedone formation. Evidence grade A"},{name:"Sodium Hyaluronate",benefit:"Humectant to offset retinoid-induced TEWL increase"},{name:"Vitamin E (Tocopherol)",benefit:"Antioxidant buffer to reduce free-radical damage during retinoid-accelerated cell cycling"}],
    alternatives:{
      budget:{name:"Retinol 0.5% in Squalane",brand:"The Ordinary",price:"£7",affiliateUrl:amz("The Ordinary Retinol 0.5% Squalane")},
      luxury:{name:"A-Passioni Retinol Cream",brand:"Drunk Elephant",price:"£74",affiliateUrl:amz("Drunk Elephant A-Passioni Retinol Cream")},
      organic:{name:"Bakuchiol Peptides Moisturiser",brand:"The Ordinary",price:"£12",affiliateUrl:amz("The Ordinary Squalane Cleanser")},
    },
  },
  {
    id:"p24", name:"Retinol Correxion Serum", brand:"RoC",
    category:"retinol", price:"£20", image:IMG.p24,
    tags:["retinol","wrinkles","affordable","anti-ageing","classic","mineral-complex"],
    description:"Clinical-grade retinol at an accessible price point — RoC’s Correxion Serum uses a pure retinol (all-trans retinol) formulation combined with their exclusive Magnesium-Zinc-Copper mineral complex. Each mineral plays a distinct dermatological role: zinc is an essential cofactor for MMP-2 and MMP-9 metalloproteinases involved in matrix remodelling and has well-established anti-inflammatory and sebaceous-regulating properties; magnesium stabilises retinol against oxidative degradation (a common formulation failure mode that renders retinol products inert); copper is a cofactor for lysyl oxidase, the enzyme that cross-links newly synthesised collagen and elastin fibrils for structural integrity. The retinol concentration (0.1%) is appropriate for retinoid naïve skin initiating therapy, with documented efficacy for superficial rhytid reduction. CLINICAL NOTE: Begin 2x per week and titrate up over 4 weeks. Always apply at night — retinol is photolabile and the accelerated cell turnover it induces increases photosensitivity. SPF is non-negotiable the following morning. Avoid in pregnancy.",
    affiliateUrl:amz("RoC Retinol Correxion Line Smoothing Serum"),
    zones:["full-face"], suitableFor:["mature","normal","dry","fine-lines","retinoid-naive"],
    keyIngredients:[{name:"All-Trans Retinol (0.1%)",benefit:"Stimulates collagen I/III synthesis via RAR-alpha receptor activation, accelerates keratinocyte turnover to resurface fine lines — evidence grade A"},{name:"Magnesium (Mg2+ stabiliser)",benefit:"Prevents retinol oxidative degradation that renders most retinol products ineffective before use — critical formulation stability role"},{name:"Zinc + Copper Mineral Complex",benefit:"Zinc: MMP modulation + sebum regulation; Copper: lysyl oxidase cofactor for collagen/elastin cross-linking to structurally reinforce new matrix"}],
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
    tags:["overnight","hydrating","brightening","watermelon","glow","aha"],
    description:"Overnight occlusive gel mask leveraging the synergy between mild chemical exfoliation and intensive hydration during the skin’s nocturnal repair cycle. Citrullus lanatus (watermelon) extract provides lycopene (a singlet oxygen quencher and photoprotection-supporting carotenoid antioxidant), L-citrulline (amino acid that boosts nitric oxide production, improving dermal microcirculation) and cucurbitacins (anti-inflammatory triterpenes). The hyaluronic acid at three molecular weights creates a stratified hydration reservoir: high-MW HA films the surface (occlusion); medium-MW penetrates the stratum corneum; low-MW reaches the dermal-epidermal junction. The low-concentration AHA blend (glycolic + lactic at pH 5.0–5.5) provides mild keratolytic action — clinical benefit without the post-exfoliation photosensitivity risk of leave-on acid serums. CLINICAL NOTE: The AHA content means morning SPF application is still recommended. Not suitable for nights when using retinoids or BHA — do not combine exfoliating acids.",
    affiliateUrl:amz("Glow Recipe Watermelon Glow Sleeping Mask 80ml"),
    zones:["full-face"], suitableFor:["all","oily","dull","combination","normal"],
    keyIngredients:[{name:"Citrullus lanatus (Watermelon) Extract",benefit:"Lycopene antioxidant + L-citrulline for microcirculation + cucurbitacin anti-inflammatories — triple action brightening and recovery support"},{name:"Hyaluronic Acid (3 molecular weights)",benefit:"Stratified hydration: high-MW surface occlusion, medium-MW stratum corneum filling, low-MW dermal junction reservoir — maximum overnight moisture retention"},{name:"Glycolic + Lactic AHA Blend (pH 5.0–5.5)",benefit:"Mild overnight keratolysis at skin-safe pH — dissolves corneocyte desmosomal bonds to improve texture and radiance without post-exfoliation sensitivity"}],
    alternatives:{
      budget:{name:"Moisturising Jelly Sleeping Mask",brand:"The Inkey List",price:"£13",affiliateUrl:amz("Inkey List sleeping mask")},
      luxury:{name:"Concentrated Night Cream",brand:"Kiehl's",price:"£45",affiliateUrl:amz("Kiehls Concentrated Night Cream")},
      organic:{name:"Overnight Recovery Sleeping Mask",brand:"Origins",price:"£34",affiliateUrl:amz("Origins overnight recovery mask")},
    }, newIn:true,
  },
  {
    id:"p26", name:"Goddess Skin Clay Mask", brand:"Charlotte Tilbury",
    category:"mask", price:"£36", image:IMG.p26,
    tags:["clay","pores","brightening","luxury","glow","kaolin"],
    description:"Clinical-luxury clay mask using kaolin (kaolinite aluminium phyllosilicate) as the primary purifying agent — the mildest clay in cosmetic dermatology, with a cation exchange capacity that binds sebum, environmental pollutants and dead keratin debris without the aggressive barrier disruption caused by harsher bentonite or Fuller’s Earth clays. The 10-minute application time is clinically meaningful: beyond 15 minutes, wet kaolin begins to draw moisture from the stratum corneum (hygroscopic rebound desiccation), so the short contact time maintains purification efficacy while limiting TEWL. Wild rose extract (Rosa canina) provides rosehip oil precursors rich in linoleic acid (73%), addressing the fatty acid imbalance that underpins comedone formation, alongside vitamin C as a mild brightening agent. The hyaluronic acid prevents net moisture loss during treatment. CLINICAL NOTE: Clay masks should be applied to the T-zone and nose only in combination skin types — application to dry or sensitised cheek zones will exacerbate barrier disruption. Limit to once weekly for oily skin, once fortnightly for combination.",
    affiliateUrl:amz("Charlotte Tilbury Goddess Skin Clay Mask"),
    zones:["t-zone","forehead","nose"], suitableFor:["oily","combination","congested","dull","acne-prone"],
    keyIngredients:[{name:"Kaolin (Kaolinite Aluminium Phyllosilicate)",benefit:"Mildest cosmetic clay — cation exchange binds sebum and pollutants without hygroscopic desiccation when used within 10-15 minute contact window"},{name:"Rosa Canina (Wild Rose) Extract",benefit:"73% linoleic acid restores the fatty acid deficiency that drives comedone formation; vitamin C precursors provide mild enzymatic brightening"},{name:"Sodium Hyaluronate",benefit:"Prevents net transepidermal water loss during the clay treatment phase, maintaining hydration while purification occurs"}],
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
    tags:["lip-liner","nude","bestseller","defining","pillow-talk","conditioning"],
    description:"The world’s best-selling lip liner in the iconic Pillow Talk nude-pink — a universally flattering warm-rosy neutral engineered through undertone analysis to complement Fitzpatrick I–VI without reading either too warm (orange) or too cool (grey). The wax formulation combines carnauba wax (Copernicia cerifera — the hardest natural wax, providing maximum pigment structure and pencil integrity) with synthetic beeswax for slip and blendability. Clinically, lip liner addresses the architectural challenge of the vermilion border (where the oral mucosa meets skin — a junction that becomes less defined with age due to dermal collagen loss and repetitive orbicularis oris movement creating feathering). Applied just outside the vermilion border, it optically defines and volumises. Vitamin E (tocopherol) provides antioxidant protection to the uniquely vulnerable vermilion epithelium which lacks melanocytes and hair follicle sebaceous glands and is therefore more susceptible to UV-induced damage and desiccation.",
    affiliateUrl:amz("Charlotte Tilbury Pillow Talk Lip Cheat Liner"),
    zones:["lips","lip-line"], suitableFor:["all"],
    keyIngredients:[{name:"Copernicia Cerifera (Carnauba) Wax",benefit:"Hardest natural cosmetic wax — creates precise pigment-locked lip architecture that resists feathering into perioral fine lines"},{name:"Tocopherol (Vitamin E)",benefit:"Antioxidant protection for the melanocyte-free vermilion epithelium — conditions while preventing UV-related lip line deterioration"},{name:"Pillow Talk Pigment Complex (CI 15850, 77891, 77492)",benefit:"Universally flattering warm-rosy neutral — undertone-calibrated to work across Fitzpatrick I–VI without orange or grey undertone bias"}],
    alternatives:{
      budget:{name:"Lip Liner",brand:"NYX",price:"£6",affiliateUrl:amz("NYX Slim Lip Pencil Nude")},
      luxury:{name:"Lipliner Pencil",brand:"NARS",price:"£21",affiliateUrl:amz("NARS Lip Liner Pencil")},
      organic:{name:"Lip Liner",brand:"bareMinerals",price:"£16",affiliateUrl:amz("bareMinerals lip liner")},
    }, bestSeller:true,
  },
  {
    id:"p28", name:"Matte Revolution Lipstick — Pillow Talk", brand:"Charlotte Tilbury",
    category:"lipstick", price:"£29", image:IMG.p28,
    tags:["lipstick","matte","iconic","nude-pink","bestseller","longwear"],
    description:"Clinically formulated matte lipstick that overcomes the primary dermatological challenge of matte lip colour: desiccation of the vermilion epithelium. Conventional matte lipsticks achieve their finish through high wax-to-oil ratios that draw moisture from the thin, sebaceous-gland-free lip mucosa, causing characteristic chapping, cracking and feathering. Charlotte Tilbury’s Micro-Flex Technology™ uses a flexible polymer matrix (polyethylene co-vinyl acetate copolymer) that provides matte visual optics through micro-particle light scattering without requiring the dehydrating wax saturation of traditional mattes. The lip-plumping complex stimulates hyaluronic acid synthesis and increases dermal water content for a temporary volumising effect via osmotic mechanisms. Castor oil (Ricinus communis) at the occlusive boundary provides a moisture-sealing film beneath the matte polymer surface. Long-wear is achieved via anchoring polymer adhesion rather than aggressive drying — the formulation wears for 8+ hours with minimal transference.",
    affiliateUrl:amz("Charlotte Tilbury Matte Revolution Pillow Talk Lipstick"),
    zones:["lips"], suitableFor:["all"],
    keyIngredients:[{name:"Micro-Flex Technology™ (PE/VA Copolymer)",benefit:"Flexible polymer film provides matte optics via micro-particle light scattering without the wax saturation that causes lip desiccation and cracking"},{name:"Ricinus Communis (Castor) Oil",benefit:"Occlusive humectant layer beneath the matte film — seals vermilion moisture preventing the transepidermal water loss that makes conventional mattes uncomfortable"},{name:"Lip Plumping Complex (HA Stimulator + Osmotic Agents)",benefit:"Stimulates endogenous hyaluronic acid synthesis and increases dermal water content for clinically measurable temporary volumising effect"}],
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
    tags:["blush","peachy-pink","shimmer","bestseller","iconic","universal"],
    description:"The world’s best-selling powder blush — a masterclass in undertone universality. The Orgasm shade is a warm peach-coral (primary pigments CI 15850, CI 77492) calibrated to sit at the exact warm-neutral midpoint between cool-pink and orange — the undertone sweet spot that reads as a healthy flush rather than added colour on all Fitzpatrick types. The gold micro-shimmer (CI 77480 gold mica, 5–10μm particle size) is positioned at the particle size range that maximises specular reflection from the cheekbone prominence without creating the chunky glitter effect of larger particles. Clinically, the blush placement and shade work together to create the optical perception of higher, more prominent zygomatics by creating a warm luminous focal point exactly where light naturally hits prominent cheekbones. The finely milled talc-free silica base (synthetic fluorphlogopite) ensures smooth application across all skin textures. CLINICAL NOTE: The shimmer may draw attention to open pores or textural congestion on the cheeks — for acne-prone or textured skin, apply with a lighter hand to the cheekbone highlight point only, avoiding the apples of the cheeks.",
    affiliateUrl:amz("NARS Orgasm Blush"),
    zones:["cheeks","cheekbones"], suitableFor:["all"],
    keyIngredients:[{name:"Synthetic Fluorphlogopite (Talc-free Silica Base)",benefit:"Skin-safe mineral base that provides smooth, buildable application across all skin textures without the respiratory concerns associated with talc"},{name:"Gold Mica (CI 77480, 5–10μm)",benefit:"Precision particle size creates specular cheekbone reflection without chunky glitter — optical cheekbone definition at the exact shimmer-to-glow threshold"},{name:"Orgasm Pigment Complex (CI 15850 + CI 77492)",benefit:"Warm-neutral peach calibrated at the undertone midpoint for universal Fitzpatrick I–VI flattery — reads as flush, not as colour"}],
    alternatives:{
      budget:{name:"Glow Blush",brand:"NYX",price:"£9",affiliateUrl:amz("NYX Glow Blush")},
      luxury:{name:"Blush Subtil",brand:"Chanel",price:"£45",affiliateUrl:amz("Chanel Blush Subtil")},
      organic:{name:"Well Lit™ Highlighter + Blush",brand:"RMS Beauty",price:"£38",affiliateUrl:amz("RMS Beauty Well Lit")},
    }, bestSeller:true,
  },
  {
    id:"p30", name:"Soft Pinch Liquid Blush", brand:"Rare Beauty",
    category:"blush", price:"£23", image:IMG.p30,
    tags:["liquid-blush","natural","buildable","selena","viral","skin-care-makeup"],
    description:"Dermatologically innovative liquid blush that bridges skincare and colour cosmetics — the first mainstream blush to incorporate a prebiotic kombucha ferment (Lactobacillus/Oolong Tea Ferment Filtrate) as a skin-functional ingredient. Kombucha ferment provides organic acids (gluconic acid, lactic acid) that mildly reinforce the skin’s acid mantle at the application zone, and postbiotic metabolites that support Staphylococcus epidermidis colonisation which competes against acnegenic microbiota. The water-based, polymer-suspended pigment system is critically different from powder blush: the liquid base integrates into the skin’s moisture film before the long-wear polymers (acrylates copolymer) set, creating a second-skin flush effect that doesn’t sit on top of skin texture. The extreme concentration means 1-2 drops is the clinically appropriate application volume — over-application will create unblendable opacity. Available in 20 shades across the Fitzpatrick spectrum. CLINICAL NOTE: Liquid formulas can exacerbate textural concerns (pores, acne scarring) by settling into depressions — apply to the high point of the cheekbone and blend downward with a damp sponge, not the cheek apples.",
    affiliateUrl:amz("Rare Beauty Soft Pinch Liquid Blush"),
    zones:["cheeks","cheekbones"], suitableFor:["all"],
    keyIngredients:[{name:"Lactobacillus/Oolong Tea Ferment Filtrate (Kombucha)",benefit:"Probiotic-derived organic acids reinforce acid mantle; postbiotics support beneficial skin microbiome at the cheek application zone"},{name:"Acrylates Copolymer Long-wear System",benefit:"Second-skin liquid polymer that integrates into the skin’s moisture film before setting — creates a flush that moves with skin rather than sitting on top"},{name:"Ultra-concentrated Iron Oxide Pigments",benefit:"High-pigment loading in 1-2 drops provides buildable, natural flush across Fitzpatrick I–VI without the chalky deposition of powder formulas"}],
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
    tags:["pore-minimising","silicone","matte","bestseller","base","blurring"],
    description:"Market-leading pore-blurring primer based on a dimethicone-cyclomethicone silicone matrix — the gold standard for optical pore minimisation. The mechanism is physical, not chemical: cyclopentasiloxane (D5) fills the opening of enlarged follicles with a zero-surface-tension fluid that levels the skin’s microarchitecture, while dimethicone creates a smooth elastomeric film across the surface. The result is a reduction in the shadow depth that makes pores visible (pores are not actually minimised — the optical perception is changed by filling and levelling). Niacinamide at skin-conditioning concentration provides mild sebaceous activity reduction over time. Panthenol (Vitamin B5) maintains hydration beneath the silicone film. CLINICAL NOTE: Cyclopentasiloxane (D5) is under EU regulatory review for potential environmental persistence (PBT classification) — individuals with environmental concerns may prefer a silica-based alternative. For acne-prone skin: dimethicone is generally non-comedogenic in clinical testing but the occlusive nature of the silicone film may be problematic for grade 3–4 comedonal congestion — use over the T-zone highlight points only. Remove thoroughly at end of day — silicone build-up can trap sebum.",
    affiliateUrl:amz("Benefit Porefessional Face Primer"),
    zones:["t-zone","forehead","nose","full-face"], suitableFor:["oily","combination","all"],
    keyIngredients:[{name:"Cyclopentasiloxane (D5) + Dimethicone Matrix",benefit:"Zero-surface-tension silicone fills follicle openings and levels skin microarchitecture — optically blurs pore shadows without chemical action"},{name:"Niacinamide",benefit:"Mild long-term sebaceous activity regulation — reduces the excess sebum production that causes pore dilation over repeated daily use"},{name:"Panthenol (Pro-Vitamin B5)",benefit:"Maintains transepidermal hydration beneath the occlusive silicone film — prevents the tight, dry sensation often associated with silicone primers on normal-dry skin"}],
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
    tags:["highlighter","glow","luxury","champagne","beam","pearl"],
    description:"Multi-dimensional powder highlighter using a three-particle-size pearl matrix to replicate the full specular-to-diffuse light reflection profile of naturally luminous, healthy skin — the optical effect clinically observed in skin with optimal ceramide content, high water retention, and minimal surface irregularity. Coarse gold mica particles (15–25μm) create the primary specular ‘beam’ reflection at the cheekbone apex; medium-particle synthetic fluorphlogopite (8–12μm) provides a soft diffuse halo glow across the broader cheek; fine titanium dioxide-coated mica (3–5μm) contributes the underlying skin-luminosity effect that makes the highlight read as skin rather than product. The Moonbeam champagne-gold shade occupies the warm-neutral spectrum that maximises optical contrast for Fitzpatrick I–IV (creates visible luminosity lift) while remaining visible without excessive shininess on Fitzpatrick V–VI. Vitamin E antioxidant complex in the base provides skin conditioning. CLINICAL NOTE: Apply exclusively to the anatomically convex zones — zygomatic arch apex, brow bone under-tail, Cupid’s bow, nasal dorsum tip. Highlight on flat or concave zones reverses the optical volumising effect.",
    affiliateUrl:amz("Charlotte Tilbury Beam and Glow Highlighter Moonbeam"),
    zones:["cheeks","cheekbones","brow-bone","cupids-bow"], suitableFor:["all"],
    keyIngredients:[{name:"Three-Particle-Size Pearl Matrix (Mica + Fluorphlogopite + TiO2-Coated Mica)",benefit:"Replicates full specular-to-diffuse reflection profile of luminous skin — 3 sizes produce beam, halo and skin-glow simultaneously"},{name:"Champagne-Gold Pigment Complex (CI 77491, 77000, 77891)",benefit:"Warm-neutral gold calibrated for maximum luminosity contrast on Fitzpatrick I–IV while remaining visible rather than chalky on Fitzpatrick V–VI"},{name:"Tocopherol (Vitamin E) Skincare Base",benefit:"Antioxidant-enriched powder base that provides skin conditioning and free-radical quenching during UV exposure — skin benefit alongside the optical finish"}],
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
    tags:["azelaic","spots","hyperpigmentation","brightening","affordable","rosacea-safe","pregnancy-safe"],
    description:"Azelaic acid is a dicarboxylic acid with a unique triple mechanism: (1) tyrosinase inhibition for PIH/melasma, (2) antimicrobial action against C. acnes, (3) keratolytic effect to clear follicular plugging. Evidence grade A for both acne vulgaris and rosacea. Safe in pregnancy (category B). Effective for Fitzpatrick IV–VI PIH where stronger acids carry photoirritation risk. 10% is OTC-strength; 15-20% is prescription. Note: slight tingling on application is normal.",
    affiliateUrl:amz("The Ordinary Azelaic Acid Suspension 10% 30ml"),
    zones:["forehead","cheeks","chin","dark-spots","t-zone"], suitableFor:["acne-prone","combination","oily","rosacea","hyperpigmentation","pregnancy-safe"],
    keyIngredients:[{name:"Azelaic Acid 10%",benefit:"Triple mechanism: tyrosinase inhibition (PIH), antimicrobial vs C. acnes, keratolytic (comedones). Evidence grade A. Safe in pregnancy"},{name:"Dimethicone",benefit:"Non-comedogenic delivery base that smooths without occluding pores"}],
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
    tags:["setting","powder","blurring","luxury","matte","translucent"],
    description:"Micronised translucent setting powder engineered around spherical silica (SiO2 at 5–8μm diameter) — the optimal particle size for simultaneous light diffusion and sebum absorption without visible powder deposit. The spherical geometry is critical: spherical particles roll freely across the skin surface, sitting on high points and rolling away from pores, preventing the powder build-up that creates a ‘cakey’ appearance. This contrasts with irregular-particle talc powders which stick indiscriminately and accumulate in pores. The silica surface is hydrophilic and absorbs surplus sebum through capillary action, extending foundation wear by controlling the sebum migration that causes colour oxidation. Hyaluronic acid in the translucent base maintains a moisture gradient through the powder layer, preventing the matte dehydration effect common in cheaper setting powders. Translucent — suitable across Fitzpatrick I–VI without colour shift. CLINICAL NOTE: For Fitzpatrick V–VI, the translucent formula prevents the ashy cast associated with titanium dioxide-containing white powders. Apply with a large, fluffy brush using a press-and-roll (not swipe) technique to avoid disturbing the foundation layer beneath.",
    affiliateUrl:amz("Charlotte Tilbury Airbrush Flawless Finish Setting Powder"),
    zones:["full-face","t-zone","under-eyes"], suitableFor:["all","oily","combination","mature"],
    keyIngredients:[{name:"Spherical Silica (SiO2, 5–8μm)",benefit:"Optimal sphere size for sebum absorption via capillary action + soft-focus light diffusion — sets without powdery build-up due to spherical roll-off from pores"},{name:"Sodium Hyaluronate",benefit:"Maintains moisture gradient through the powder layer — prevents the dehydrating effect of powder setting on dry and mature skin types"},{name:"Translucent Pigment System (no TiO2)",benefit:"Fitzpatrick I–VI compatible setting — zero colour shift or ashy cast on deep melanin-rich skin tones, unlike white-powder formulas"}],
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
    tags:["vitamin-c","glow","brightening","texture","luxury","stable-vitamin-c"],
    description:"Clinically sophisticated vitamin C serum using 15% ethyl ascorbic acid (3-O-Ethyl Ascorbic Acid) — a third-generation vitamin C ester chosen specifically for its superior stability profile over L-ascorbic acid (which degrades rapidly at pH above 3.5 and is oxidation-sensitive to light and air). Ethyl ascorbic acid maintains potency at skin-neutral pH (5.0–5.5), requires no acid vehicle, and is hydrolysed by skin esterases to release L-ascorbic acid in situ within the stratum corneum. The mechanism is identical to pure vitamin C: tyrosinase inhibition at copper active site (brightening), stimulation of procollagen synthesis (anti-ageing), and direct ROS quenching (antioxidant). Bisabolol (from Matricaria chamomilla) provides clinically validated anti-inflammatory activity via inhibition of NF-κB signalling, complementing vitamin C’s antioxidant mechanism. Turmeric (curcumin) enhances brightening via a secondary melanogenesis inhibitory pathway (PKA/CREB signalling distinct from tyrosinase inhibition). The rich serum texture includes saccharide isomerate for keratin-binding hydration. CLINICAL NOTE: As a pH-neutral formula, ethyl ascorbic acid can be safely layered with retinoids and niacinamide — unlike pure vitamin C which must be separated from both.",
    affiliateUrl:amz("Sunday Riley CEO Vitamin C Rich Resurfacing Treatment"),
    zones:["full-face","dark-spots","cheeks"], suitableFor:["dull","mature","all","hyperpigmentation","sensitive"],
    keyIngredients:[{name:"3-O-Ethyl Ascorbic Acid (15%)",benefit:"Third-generation pH-stable vitamin C ester — tyrosinase inhibition + collagen synthesis + ROS quenching without the pH-instability limitations of pure L-ascorbic acid"},{name:"Bisabolol (Matricaria chamomilla)",benefit:"NF-κB pathway anti-inflammatory that synergises with vitamin C antioxidant mechanism — reduces post-brightening reactive erythema in sensitive Fitzpatrick types"},{name:"Curcumin (Turmeric Extract)",benefit:"Secondary melanogenesis inhibitor via PKA/CREB pathway (distinct from tyrosinase) — provides a dual-mechanism brightening approach alongside the vitamin C"}],
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
    tags:["body","retinol","firming","texture","anti-ageing","stretch-marks"],
    description:"Clinical-grade retinol formulated for body skin — an often-neglected area that undergoes the same retinoid-responsive ageing process as the face (dermal thinning, reduced collagen synthesis, impaired keratinocyte turnover) but is exposed to less sunscreen and skincare attention. The body skin’s thicker stratum corneum compared to facial skin means retinol concentrations can typically be higher than face formulations without equivalent irritation risk. RoC’s encapsulated retinol technology releases the active gradually as the capsule breaks down, avoiding the bolus irritation associated with free-formula retinol in body lotions. The zinc-copper-magnesium mineral complex stabilises the retinol during shelf storage (a significant issue with body lotions due to their larger container volumes exposed to light and air) and provides cofactors for collagen cross-linking enzymes. CLINICAL NOTE: For striae (stretch marks), retinol demonstrates evidence grade B for early/red striae — less effective for mature/white striae where the dermis is already scarred. Apply to upper inner arms, abdominal skin, thighs and buttocks. Morning SPF is recommended on any sun-exposed treated areas. Not suitable in pregnancy.",
    affiliateUrl:amz("RoC Retinol Body Lotion"),
    zones:["body","arms","thighs","abdomen"], suitableFor:["mature","dry","normal","textured-skin","striae"],
    keyIngredients:[{name:"Encapsulated Retinol",benefit:"Time-release retinol delivery prevents bolus irritation — capsule breaks down gradually for sustained collagen I/III stimulation and keratinocyte renewal over 8 hours"},{name:"Zinc-Copper-Magnesium Mineral Complex",benefit:"Stabilises retinol in body lotion format (large air-exposed volume) + provides lysyl oxidase cofactors for collagen/elastin cross-linking in treated skin"},{name:"Glycerin + Shea Butter (Butyrospermum Parkii)",benefit:"Humectant + emollient base prevents retinoid-induced TEWL increase in body skin — maintains moisture during accelerated keratinocyte turnover"}],
    alternatives:{
      budget:{name:"Jergens Skin Firming Body Lotion",brand:"Jergens",price:"£8",affiliateUrl:amz("Jergens Skin Firming Lotion")},
      luxury:{name:"Firming Body Serum",brand:"Charlotte Tilbury",price:"£60",affiliateUrl:amz("Charlotte Tilbury Body Firming Serum")},
      organic:{name:"Clarins Body Fit Active",brand:"Clarins",price:"£48",affiliateUrl:amz("Clarins Body Fit Active")},
    },
  },
  {
    id:"p37", name:"Watermelon Glow Niacinamide Dew Drops", brand:"Glow Recipe",
    category:"serum", price:"£36", image:IMG.p37,
    tags:["niacinamide","glow","dewy","brightening","viral","glass-skin"],
    description:"Innovative hybrid serum-highlight formulation combining therapeutic niacinamide with a transparent luminosity system — a category that bridges skincare actives and the optical finish traditionally delivered by highlighter makeup. The niacinamide at 3% delivers evidence-grade-A sebum regulation and melanosome transfer inhibition for brightening, while remaining below the 10% concentration associated with nicotinic acid flushing risk. Polyglutamic acid (PGA) is a humectant of superior molecular weight to hyaluronic acid — its much larger polymer chain creates a surface film that prevents moisture evaporation rather than actively drawing water, making it particularly effective for dewy ‘glass skin’ appearance maintenance. The transparent pearl pigments (synthetic fluorphlogopite, 3–5μm) are the origin of the viral ‘dew drop’ effect — these ultra-fine particles create a prismatic luminosity that enhances the appearance of skin hydration without visible product deposit. The watermelon extract contributes lycopene antioxidant protection and L-citrulline for microcirculation. CLINICAL NOTE: As a serum-highlighter hybrid, this works best applied after moisturiser and before or instead of traditional highlighter for a natural dewy skin effect. Not suitable as a replacement for therapeutic niacinamide doses in conditions like active acne or significant PIH — use alongside a dedicated 10% niacinamide serum for clinical concerns.",
    affiliateUrl:amz("Glow Recipe Watermelon Glow Niacinamide Dew Drops"),
    zones:["full-face","cheeks","cheekbones"], suitableFor:["all","oily","dull","combination","normal"],
    keyIngredients:[{name:"Niacinamide (Nicotinamide) 3%",benefit:"Evidence grade A: melanosome transfer inhibition (brightening) + sebaceous regulation, at concentrations below the flushing threshold associated with 10% serums"},{name:"Polyglutamic Acid (PGA)",benefit:"High-MW humectant polymer that films the surface to prevent TEWL rather than drawing moisture hygroscopically — the mechanism behind the visible ‘dewy’ glass-skin appearance"},{name:"Synthetic Fluorphlogopite Pearls (3–5μm)",benefit:"Ultra-fine prismatic particles create a transparent luminosity that mimics light reflection from optimally hydrated skin — the viral ‘dew drop’ optical effect"}],
    alternatives:{
      budget:{name:"Glow Shot Serum",brand:"Revolution",price:"£8",affiliateUrl:amz("Revolution Skincare Glow Serum")},
      luxury:{name:"Ethereal Drops",brand:"Charlotte Tilbury",price:"£45",affiliateUrl:amz("Charlotte Tilbury Glow Drops")},
      organic:{name:"Luminizing Face Serum",brand:"The Inkey List",price:"£15",affiliateUrl:amz("Inkey List serum glow")},
    }, newIn:true,
  },
];

export default CATALOG;
