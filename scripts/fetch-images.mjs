/**
 * Fetches real product images from LOOKFANTASTIC for each product.
 * Uses the thcdn.com CDN which is the same as Cult Beauty.
 * Run: node scripts/fetch-images.mjs
 */

import https from "https";
import http from "http";

function fetchUrl(url, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, timeout).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (c) => { data += c; if (data.length > 500000) req.destroy(); });
      res.on("end", () => resolve(data));
    });
    req.setTimeout(timeout, () => { req.destroy(); reject(new Error("timeout")); });
    req.on("error", reject);
  });
}

// Extract first product image from LOOKFANTASTIC HTML
function extractLFImage(html) {
  // thcdn.com CDN image URLs
  const m = html.match(/https?:\/\/static\.thcdn\.com\/productimg\/[^"'\s]+\.jpg/);
  if (m) return m[0].replace(/\/\d+\/\d+\//, "/original/");
  // Also try data-src or srcset patterns
  const m2 = html.match(/https?:\/\/static\.thcdn\.com\/[^"'\s]+\.(jpg|png|webp)/);
  if (m2) return m2[0];
  return null;
}

// Extract image from Cult Beauty HTML  
function extractCBImage(html) {
  const m = html.match(/https?:\/\/static\.thcdn\.com\/productimg\/[^"'\s]+\.jpg/);
  if (m) return m[0].replace(/\/\d+\/\d+\//, "/original/");
  return null;
}

// Products needing real images — (id, searchTerm, preferredSite)
const PRODUCTS = [
  // Moisturisers / Creams
  { id: "p2",  q: "neutrogena-hydro-boost-water-gel",    site: "lf" },
  { id: "p3",  q: "tatcha-the-water-cream",              site: "lf" },
  { id: "p4c", q: "augustinus-bader-the-rich-cream",     site: "lf" },
  { id: "p4d", q: "kiehls-clearly-corrective-dark-spot-correcting-glow-moisturiser", site: "lf" },
  { id: "p4e", q: "murad-essential-c-daily-renewal-complex-spf30", site: "lf" },
  { id: "p5d", q: "roc-retinol-correxion-eye-cream",     site: "lf" },
  { id: "p5e", q: "kiehls-midnight-recovery-concentrate", site: "lf" },
  { id: "p74", q: "shiseido-vital-perfection-uplifting-firming-cream", site: "lf" },
  { id: "p85", q: "clinique-moisture-surge-72-hour-auto-replenishing",  site: "lf" },
  { id: "p96", q: "la-prairie-skin-caviar-luxe-cream",   site: "lf" },
  { id: "p97", q: "neals-yard-remedies-wild-rose-beauty-balm", site: "lf" },
  // Serums
  { id: "p6",  q: "skinceuticals-ce-ferulic",            site: "lf" },
  { id: "p8",  q: "estee-lauder-advanced-night-repair-serum", site: "lf" },
  { id: "p5b", q: "the-ordinary-hyaluronic-acid-2-b5",   site: "lf" },
  { id: "p5c", q: "the-ordinary-retinol-0-2-in-squalane", site: "lf" },
  { id: "p18", q: "cosrx-advanced-snail-96-mucin-power-essence", site: "lf" },
  { id: "p35", q: "sunday-riley-ceo-vitamin-c-cream",    site: "lf" },
  { id: "p37", q: "glow-recipe-watermelon-glow-niacinamide-dew-drops", site: "lf" },
  { id: "p59", q: "medik8-c-tetra-serum",                site: "lf" },
  { id: "p60", q: "the-inkey-list-q10-serum",             site: "lf" },
  { id: "p61", q: "elemis-pro-collagen-super-serum",      site: "lf" },
  { id: "p63", q: "paulas-choice-resist-anti-aging-super-antioxidant-serum", site: "lf" },
  { id: "p70", q: "the-inkey-list-hyaluronic-acid-serum", site: "lf" },
  { id: "p86", q: "sisley-phyto-c-brightening-serum",    site: "lf" },
  { id: "p94", q: "fresh-vitamin-nectar-aglow-facial-treatment", site: "lf" },
  { id: "p98", q: "lancome-advanced-genifique-serum",     site: "lf" },
  { id: "p99", q: "no7-future-renew-serum",               site: "lf" },
  { id: "p100",q: "glow-recipe-plum-plump-hyaluronic-cream", site: "lf" },
  // SPFs / Tinted
  { id: "p9",  q: "la-roche-posay-anthelios-uvmune-400-invisible-fluid", site: "lf" },
  { id: "p10", q: "ultrasun-face-spf50",                  site: "lf" },
  { id: "p11", q: "la-roche-posay-anthelios-tinted-mineral-fluid", site: "lf" },
  { id: "p71", q: "it-cosmetics-cc-cream-spf50",          site: "lf" },
  { id: "p81", q: "supergoop-invisible-shield-spf35",     site: "lf" },
  { id: "p93", q: "trinny-london-bff-cream-spf30",        site: "lf" },
  // Foundations / Concealers
  { id: "p12", q: "charlotte-tilbury-airbrush-flawless-foundation", site: "lf" },
  { id: "p12b",q: "estee-lauder-double-wear-foundation",  site: "lf" },
  { id: "p15", q: "nars-radiant-creamy-concealer",        site: "lf" },
  { id: "p16", q: "maybelline-fit-me-concealer",          site: "lf" },
  { id: "p15b",q: "ysl-touche-eclat-radiant-touch",       site: "lf" },
  { id: "p73", q: "iope-air-cushion-spf50",               site: "lf" },
  // Toners / Exfoliants
  { id: "p17", q: "pyunkang-yul-essence-toner",           site: "lf" },
  { id: "p17b",q: "the-ordinary-glycolic-acid-7-toning-solution", site: "lf" },
  { id: "p46", q: "dermalogica-daily-microfoliant",       site: "lf" },
  { id: "p47", q: "the-ordinary-aha-30-bha-2-peeling-solution", site: "lf" },
  { id: "p68", q: "elemis-papaya-enzyme-peel",            site: "lf" },
  { id: "p72", q: "dermalogica-daily-microfoliant",       site: "lf" },
  // Eye creams
  { id: "p19", q: "olay-eyes-pro-retinol-eye-treatment",  site: "lf" },
  { id: "p20", q: "kiehls-creamy-eye-treatment-avocado",  site: "lf" },
  { id: "p20b",q: "estee-lauder-advanced-night-repair-eye-supercharged", site: "lf" },
  { id: "p65", q: "111skin-meso-infusion-overnight-micro-mask", site: "lf" },
  { id: "p84", q: "ole-henriksen-banana-bright-eye-creme", site: "lf" },
  { id: "p90", q: "paulas-choice-peptide-eye-cream",      site: "lf" },
  { id: "p95", q: "origins-ginzing-brightening-eye-cream", site: "lf" },
  // Cleansers
  { id: "p21", q: "cerave-foaming-facial-cleanser",       site: "lf" },
  { id: "p22", q: "la-roche-posay-toleriane-hydrating-gentle-cleanser", site: "lf" },
  { id: "p21b",q: "elemis-pro-collagen-cleansing-balm",   site: "lf" },
  { id: "p88", q: "youth-to-the-people-superfood-antioxidant-cleanser", site: "lf" },
  // Retinols
  { id: "p23", q: "medik8-crystal-retinal-6",             site: "lf" },
  { id: "p24", q: "roc-retinol-correxion-line-smoothing-serum", site: "lf" },
  // Masks
  { id: "p25", q: "glow-recipe-watermelon-glow-sleeping-mask", site: "lf" },
  { id: "p26", q: "charlotte-tilbury-goddess-skin-clay-mask", site: "lf" },
  { id: "p26b",q: "laneige-lip-sleeping-mask",            site: "lf" },
  { id: "p55", q: "garnier-hyaluronic-acid-face-mask",    site: "lf" },
  // Lips
  { id: "p27", q: "charlotte-tilbury-lip-cheat-liner-pillow-talk", site: "lf" },
  { id: "p28b",q: "huda-beauty-liquid-matte-lipstick",   site: "lf" },
  { id: "p52", q: "charlotte-tilbury-collagen-lip-bath", site: "lf" },
  { id: "p69", q: "pat-mcgrath-mothership-lip-gloss",    site: "lf" },
  { id: "p75", q: "mac-matte-lipstick",                  site: "lf" },
  { id: "p92", q: "dior-addict-lip-maximizer",           site: "lf" },
  // Blush / Cheek
  { id: "p30", q: "rare-beauty-soft-pinch-liquid-blush", site: "lf" },
  { id: "p30b",q: "charlotte-tilbury-cheek-kiss-blush-stick", site: "lf" },
  { id: "p56", q: "estee-lauder-pure-color-envy-sculpting-blush", site: "lf" },
  // Primers
  { id: "p31", q: "benefit-porefessional-primer",         site: "lf" },
  { id: "p31b",q: "charlotte-tilbury-magic-primer",       site: "lf" },
  // Highlighters / Bronze / Glow
  { id: "p32", q: "charlotte-tilbury-filmstar-bronze-glow", site: "lf" },
  { id: "p32b",q: "fenty-beauty-killawatt-highlighter",   site: "lf" },
  { id: "p50", q: "benefit-hoola-bronzer",                site: "lf" },
  { id: "p51", q: "fenty-beauty-sun-stalkr-bronzer",      site: "lf" },
  { id: "p79", q: "hourglass-ambient-lighting-bronzer",   site: "lf" },
  { id: "p87", q: "dior-forever-powder",                  site: "lf" },
  // Spot / Acne
  { id: "p33", q: "the-ordinary-azelaic-acid-suspension-10", site: "lf" },
  { id: "p33b",q: "la-roche-posay-effaclar-duo-plus",     site: "lf" },
  { id: "p77", q: "clinique-anti-blemish-solutions-liquid-makeup", site: "lf" },
  // Powders
  { id: "p34", q: "charlotte-tilbury-airbrush-flawless-finish-setting-powder", site: "lf" },
  { id: "p34b",q: "hourglass-veil-translucent-setting-powder", site: "lf" },
  { id: "p82", q: "nars-light-reflecting-setting-powder",  site: "lf" },
  // Eyes / Palettes / Liners
  { id: "p38", q: "charlotte-tilbury-luxury-palette-the-golden-goddess", site: "lf" },
  { id: "p39", q: "urban-decay-naked-palette",            site: "lf" },
  { id: "p44", q: "mac-pro-longwear-fluidline",           site: "lf" },
  { id: "p89", q: "charlotte-tilbury-rock-n-kohl-eyeliner", site: "lf" },
  // Mascaras
  { id: "p40", q: "too-faced-better-than-sex-mascara",   site: "lf" },
  { id: "p41", q: "loreal-lash-paradise-mascara",         site: "lf" },
  { id: "p76", q: "maybelline-sky-high-mascara",          site: "lf" },
  { id: "p83", q: "loreal-lash-paradise-mascara",         site: "lf" },
  // Brows
  { id: "p42", q: "benefit-precisely-my-brow-pencil",    site: "lf" },
  { id: "p43", q: "anastasia-beverly-hills-dipbrow-pomade", site: "lf" },
  { id: "p80", q: "anastasia-beverly-hills-brow-wiz",    site: "lf" },
  // Setting sprays
  { id: "p45", q: "mac-fix-plus",                        site: "lf" },
  // Oils / Body
  { id: "p36", q: "roc-retinol-correxion-body-lotion",   site: "lf" },
  { id: "p36b",q: "elemis-body-cream",                   site: "lf" },
  { id: "p57", q: "ren-clean-skincare-rosehip-bioregenerate-oil", site: "lf" },
  { id: "p58", q: "clarins-tonic-body-treatment-oil",    site: "lf" },
  // Devices / Tools
  { id: "p62", q: "nuface-trinity-facial-toning-device", site: "lf" },
  // Fragrance
  { id: "p49", q: "viktor-rolf-flowerbomb-edp",          site: "lf" },
  // Hair
  { id: "p54", q: "olaplex-no3-hair-perfector",          site: "lf" },
  // Other skincare
  { id: "p48", q: "supergoop-invisible-shield-spf35",    site: "lf" },
  { id: "p53", q: "charlotte-tilbury-magic-cream-light",  site: "lf" },
  { id: "p64", q: "la-roche-posay-cicaplast-baume-b5",   site: "lf" },
  { id: "p66", q: "sisley-phytobiotic-body-oil",          site: "lf" },
  { id: "p67", q: "the-inkey-list-bakuchiol-moisturiser", site: "lf" },
  { id: "p91", q: "charlotte-tilbury-flawless-filter",    site: "lf" },
  { id: "p78", q: "charlotte-tilbury-glow-drops",         site: "lf" },
];

async function fetchLFProductImage(slug) {
  // Try direct product URL pattern first
  const url = `https://www.lookfantastic.com/${slug}/11363456.html`;
  // Fall back to search
  const searchUrl = `https://www.lookfantastic.com/brands.list?autocomplete_suggestion=${encodeURIComponent(slug.replace(/-/g, " "))}`;
  
  // Use LOOKFANTASTIC search API
  const apiUrl = `https://www.lookfantastic.com/napi/search?q=${encodeURIComponent(slug.replace(/-/g, " "))}&pageSize=1`;
  try {
    const data = await fetchUrl(apiUrl);
    const json = JSON.parse(data);
    // Extract first product image
    const products = json?.products?.products || json?.results || [];
    if (products.length > 0) {
      const p = products[0];
      const img = p?.productImageUrl || p?.imageUrl || p?.images?.[0]?.url;
      if (img) return img.includes("thcdn") ? img.replace(/\/\d+\/\d+\//, "/original/") : img;
    }
  } catch (e) {}
  return null;
}

async function fetchHTMLImage(slug) {
  // Try LOOKFANTASTIC search page HTML
  const url = `https://www.lookfantastic.com/search?q=${encodeURIComponent(slug.replace(/-/g, " "))}&pageSize=1`;
  try {
    const html = await fetchUrl(url);
    return extractLFImage(html);
  } catch (e) {}
  return null;
}

// Batched fetching with concurrency limit
async function batchFetch(items, fn, concurrency = 5) {
  const results = {};
  const queue = [...items];
  const workers = Array(Math.min(concurrency, queue.length)).fill(null).map(async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      try {
        results[item.id] = await fn(item);
        process.stdout.write(`✓ ${item.id} (${item.q.substring(0,30)})\n`);
      } catch (e) {
        results[item.id] = null;
        process.stdout.write(`✗ ${item.id}: ${e.message}\n`);
      }
    }
  });
  await Promise.all(workers);
  return results;
}

const results = await batchFetch(PRODUCTS, async (item) => {
  const img = await fetchHTMLImage(item.q);
  return img;
}, 8);

// Print results
console.log("\n\n=== RESULTS ===");
console.log(JSON.stringify(results, null, 2));

// Stats
const found = Object.values(results).filter(Boolean).length;
console.log(`\nFound: ${found}/${PRODUCTS.length}`);
