// ── BlushMap Retailer Price Comparison ─────────────────────────────────────────
// Per-product price data across major UK retailers
// Awin Publisher ID: 2854395 — all links are tracked affiliate links

const AWIN_PID = "2854395";
function awin(mid: string, url: string) {
  return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${AWIN_PID}&ued=${encodeURIComponent(url)}`;
}
const amz = (q: string) => `https://www.amazon.co.uk/s?k=${encodeURIComponent(q)}&tag=blushmap-21`;

export interface RetailerPrice {
  retailer: string;
  retailerId: string;
  price: string;
  priceNum: number;        // numeric for sorting/best-price logic
  inStock: boolean;
  url: string;
  logo: string;            // emoji or brand icon
  color: string;           // brand hex color
  freeDeliveryThreshold?: string;
  loyaltyPoints?: string;  // e.g. "4× Boots points"
}

export interface ProductPrices {
  productId: string;
  retailers: RetailerPrice[];
}

// Helper — find best-priced in-stock retailer
export function getBestPrice(retailers: RetailerPrice[]): RetailerPrice | null {
  const inStock = retailers.filter(r => r.inStock);
  if (!inStock.length) return null;
  return inStock.reduce((best, r) => (r.priceNum < best.priceNum ? r : best));
}

// Helper — savings vs most expensive
export function getSavings(retailers: RetailerPrice[]): number {
  const inStock = retailers.filter(r => r.inStock);
  if (inStock.length < 2) return 0;
  const max = Math.max(...inStock.map(r => r.priceNum));
  const min = Math.min(...inStock.map(r => r.priceNum));
  return parseFloat((max - min).toFixed(2));
}

// ── Price data per product ─────────────────────────────────────────────────────
// Keys match catalog product IDs (p1, p2, ... p100)

export const RETAILER_PRICES: Record<string, RetailerPrice[]> = {

  // p1 — CeraVe Moisturising Cream 340g
  p1: [
    { retailer: "Boots", retailerId: "boots", price: "£14.00", priceNum: 14.00, inStock: true, url: awin("2041", "https://www.boots.com/cerave-moisturising-cream-340g-10330668"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "14× Boots points" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£14.99", priceNum: 14.99, inStock: true, url: awin("2082", "https://www.lookfantastic.com/cerave-moisturising-cream-340g/11623940.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£13.49", priceNum: 13.49, inStock: true, url: amz("CeraVe Moisturising Cream 340g"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£14.50", priceNum: 14.50, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/cerave-moisturising-cream-340ml/13187076/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "John Lewis", retailerId: "john-lewis", price: "£15.00", priceNum: 15.00, inStock: true, url: awin("2995", "https://www.johnlewis.com/search?search-term=CeraVe+Moisturising+Cream"), logo: "🛍️", color: "#1a5276", freeDeliveryThreshold: "£50" },
  ],

  // p2 — Neutrogena Hydro Boost Water Gel
  p2: [
    { retailer: "Boots", retailerId: "boots", price: "£19.99", priceNum: 19.99, inStock: true, url: awin("2041", "https://www.boots.com/neutrogena-hydro-boost-water-gel-50ml-10256736"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "19× Boots points" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£17.49", priceNum: 17.49, inStock: true, url: amz("Neutrogena Hydro Boost Water Gel"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£19.99", priceNum: 19.99, inStock: true, url: awin("2082", "https://www.lookfantastic.com/neutrogena-hydro-boost-water-gel-50ml/11363196.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "John Lewis", retailerId: "john-lewis", price: "£20.00", priceNum: 20.00, inStock: true, url: awin("2995", "https://www.johnlewis.com/search?search-term=Neutrogena+Hydro+Boost"), logo: "🛍️", color: "#1a5276", freeDeliveryThreshold: "£50" },
  ],

  // p3 — Tatcha Water Cream
  p3: [
    { retailer: "Space NK", retailerId: "spacenk", price: "£79.00", priceNum: 79.00, inStock: true, url: awin("59805", "https://www.spacenk.com/uk/skincare/moisturisers/moisturiser/the-water-cream-MUK200027539.html"), logo: "🌙", color: "#1a1a2e", freeDeliveryThreshold: "£30" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£74.00", priceNum: 74.00, inStock: true, url: amz("Tatcha Water Cream moisturiser"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£79.00", priceNum: 79.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/tatcha-the-water-cream/12398282.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "John Lewis", retailerId: "john-lewis", price: "£80.00", priceNum: 80.00, inStock: true, url: awin("2995", "https://www.johnlewis.com/search?search-term=Tatcha+Water+Cream"), logo: "🛍️", color: "#1a5276", freeDeliveryThreshold: "£50" },
  ],

  // p4 — Drunk Elephant Lala Retro Whipped Moisturiser
  p4: [
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£58.00", priceNum: 58.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/drunk-elephant-lala-retro-ceramide-face-moisturiser-50ml/13310264/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£58.00", priceNum: 58.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/drunk-elephant-lala-retro-whipped-cream/11623960.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Space NK", retailerId: "spacenk", price: "£59.00", priceNum: 59.00, inStock: true, url: awin("59805", "https://www.spacenk.com/uk/skincare/moisturisers/moisturiser/lala-retro-whipped-cream-MUK200026834.html"), logo: "🌙", color: "#1a1a2e", freeDeliveryThreshold: "£30" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£54.00", priceNum: 54.00, inStock: true, url: amz("Drunk Elephant Lala Retro Whipped Cream"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "Boots", retailerId: "boots", price: "£58.00", priceNum: 58.00, inStock: true, url: awin("2041", "https://www.boots.com/drunk-elephant-lala-retro-ceramide-whipped-cream"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "58× Boots points" },
  ],

  // p5 — The Ordinary Niacinamide 10% + Zinc 1% 30ml
  p5: [
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£5.00", priceNum: 5.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/the-ordinary-niacinamide-10-zinc-1-serum-30ml/13187076/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£5.50", priceNum: 5.50, inStock: true, url: awin("2082", "https://www.lookfantastic.com/the-ordinary-niacinamide-10-zinc-1-serum-30ml/11363268.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Boots", retailerId: "boots", price: "£5.49", priceNum: 5.49, inStock: true, url: awin("2041", "https://www.boots.com/the-ordinary-niacinamide-10-zinc-1-30ml-10316764"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "5× Boots points" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£4.89", priceNum: 4.89, inStock: true, url: amz("The Ordinary Niacinamide 10% Zinc 30ml"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
  ],

  // p6 — SkinCeuticals C E Ferulic
  p6: [
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£169.00", priceNum: 169.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/skinceuticals-c-e-ferulic-30ml/11363267.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Space NK", retailerId: "spacenk", price: "£169.00", priceNum: 169.00, inStock: true, url: awin("59805", "https://www.spacenk.com/uk/skincare/serums/serum/c-e-ferulic-serum-MUK200027540.html"), logo: "🌙", color: "#1a1a2e", freeDeliveryThreshold: "£30" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£155.00", priceNum: 155.00, inStock: true, url: amz("SkinCeuticals CE Ferulic serum"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "John Lewis", retailerId: "john-lewis", price: "£169.00", priceNum: 169.00, inStock: true, url: awin("2995", "https://www.johnlewis.com/search?search-term=SkinCeuticals+CE+Ferulic"), logo: "🛍️", color: "#1a5276", freeDeliveryThreshold: "£50" },
  ],

  // p7 — Paula's Choice 2% BHA Liquid Exfoliant 118ml
  p7: [
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£35.00", priceNum: 35.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/paula-s-choice-skin-perfecting-2-bha-liquid-exfoliant-118ml/11174178/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£35.00", priceNum: 35.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/paulas-choice-skin-perfecting-2-bha-liquid-exfoliant-118ml/11363456.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Boots", retailerId: "boots", price: "£35.00", priceNum: 35.00, inStock: true, url: awin("2041", "https://www.boots.com/paulas-choice-skin-perfecting-2-bha-liquid-exfoliant-118ml"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "35× Boots points" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£32.00", priceNum: 32.00, inStock: true, url: amz("Paula's Choice 2% BHA Liquid Exfoliant 118ml"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "Space NK", retailerId: "spacenk", price: "£35.00", priceNum: 35.00, inStock: true, url: awin("59805", "https://www.spacenk.com/uk/skincare/toners/toner/2-bha-liquid-exfoliant-MUK200027541.html"), logo: "🌙", color: "#1a1a2e", freeDeliveryThreshold: "£30" },
  ],

  // p8 — Estée Lauder Advanced Night Repair Serum
  p8: [
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£65.00", priceNum: 65.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/estee-lauder-advanced-night-repair-30ml/11363457.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Boots", retailerId: "boots", price: "£65.00", priceNum: 65.00, inStock: true, url: awin("2041", "https://www.boots.com/estee-lauder-advanced-night-repair-synchronized-multi-recovery-complex-30ml-10136773"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "65× Boots points" },
    { retailer: "John Lewis", retailerId: "john-lewis", price: "£65.00", priceNum: 65.00, inStock: true, url: awin("2995", "https://www.johnlewis.com/estee-lauder-advanced-night-repair-synchronized-multi-recovery-complex-serum/p231598482"), logo: "🛍️", color: "#1a5276", freeDeliveryThreshold: "£50" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£59.00", priceNum: 59.00, inStock: true, url: amz("Estee Lauder Advanced Night Repair serum 30ml"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "Space NK", retailerId: "spacenk", price: "£65.00", priceNum: 65.00, inStock: true, url: awin("59805", "https://www.spacenk.com/uk/skincare/serums/serum/advanced-night-repair-MUK200027542.html"), logo: "🌙", color: "#1a1a2e", freeDeliveryThreshold: "£30" },
  ],

  // p9 — La Roche-Posay Anthelios UVMune 400 SPF50+
  p9: [
    { retailer: "Boots", retailerId: "boots", price: "£20.00", priceNum: 20.00, inStock: true, url: awin("2041", "https://www.boots.com/la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf50-50ml-10330660"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "20× Boots points" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£20.00", priceNum: 20.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/la-roche-posay-anthelios-invisible-fluid-spf50-50ml/11364000.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£18.50", priceNum: 18.50, inStock: true, url: amz("La Roche-Posay Anthelios UVMune 400 SPF50+"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£20.00", priceNum: 20.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf50/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
  ],

  // p12 — Charlotte Tilbury Airbrush Flawless Foundation
  p12: [
    { retailer: "Charlotte Tilbury", retailerId: "charlotte-tilbury", price: "£36.00", priceNum: 36.00, inStock: true, url: awin("13611", "https://www.charlottetilbury.com/uk/product/airbrush-flawless-foundation"), logo: "🌹", color: "#b5644e", freeDeliveryThreshold: "£30" },
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£36.00", priceNum: 36.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/charlotte-tilbury-airbrush-flawless-foundation/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "Boots", retailerId: "boots", price: "£36.00", priceNum: 36.00, inStock: true, url: awin("2041", "https://www.boots.com/charlotte-tilbury-airbrush-flawless-foundation"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "36× Boots points" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£36.00", priceNum: 36.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/charlotte-tilbury-airbrush-flawless-foundation/11363460.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£34.00", priceNum: 34.00, inStock: true, url: amz("Charlotte Tilbury Airbrush Flawless Foundation"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
  ],

  // p13 — NARS Natural Radiant Longwear Foundation
  p13: [
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£43.50", priceNum: 43.50, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/nars-natural-radiant-longwear-foundation-various-shades/11640948/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£43.50", priceNum: 43.50, inStock: true, url: awin("2082", "https://www.lookfantastic.com/nars-natural-radiant-longwear-foundation/11363800.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Space NK", retailerId: "spacenk", price: "£44.00", priceNum: 44.00, inStock: true, url: awin("59805", "https://www.spacenk.com/uk/makeup/face/foundation/natural-radiant-longwear-foundation-MUK200027543.html"), logo: "🌙", color: "#1a1a2e", freeDeliveryThreshold: "£30" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£40.00", priceNum: 40.00, inStock: true, url: amz("NARS Natural Radiant Longwear Foundation"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
  ],

  // p14 — Fenty Beauty Pro Filt'r Foundation
  p14: [
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£35.00", priceNum: 35.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/fenty-beauty-pro-filt-r-soft-matte-longwear-foundation-32ml-various-shades/15654346/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "Sephora", retailerId: "sephora", price: "£35.00", priceNum: 35.00, inStock: true, url: awin("15718", "https://www.sephora.co.uk/p/fenty-beauty-pro-filtR-soft-matte-longwear-foundation"), logo: "🖤", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£35.00", priceNum: 35.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/fenty-beauty-pro-filtr-foundation/11363802.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£32.00", priceNum: 32.00, inStock: true, url: amz("Fenty Beauty Pro Filtr Soft Matte Foundation"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
  ],

  // p28 — Charlotte Tilbury Matte Revolution Lipstick Pillow Talk
  p28: [
    { retailer: "Charlotte Tilbury", retailerId: "charlotte-tilbury", price: "£32.00", priceNum: 32.00, inStock: true, url: awin("13611", "https://www.charlottetilbury.com/uk/product/matte-revolution-pillow-talk"), logo: "🌹", color: "#b5644e", freeDeliveryThreshold: "£30" },
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£32.00", priceNum: 32.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/charlotte-tilbury-matte-revolution/13323147/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "Boots", retailerId: "boots", price: "£32.00", priceNum: 32.00, inStock: true, url: awin("2041", "https://www.boots.com/charlotte-tilbury-matte-revolution-lipstick-pillow-talk"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "32× Boots points" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£30.00", priceNum: 30.00, inStock: true, url: amz("Charlotte Tilbury Matte Revolution Pillow Talk lipstick"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£32.00", priceNum: 32.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/charlotte-tilbury-matte-revolution-lipstick/11363804.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
  ],

  // p29 — NARS Orgasm Blush
  p29: [
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£30.00", priceNum: 30.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/nars-cosmetics-blush-orgasm-8g/12117521/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£30.00", priceNum: 30.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/nars-blush-orgasm/11363806.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Space NK", retailerId: "spacenk", price: "£30.00", priceNum: 30.00, inStock: true, url: awin("59805", "https://www.spacenk.com/uk/makeup/cheeks/blush/blush-MUK200027544.html"), logo: "🌙", color: "#1a1a2e", freeDeliveryThreshold: "£30" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£27.50", priceNum: 27.50, inStock: true, url: amz("NARS Orgasm Blush 8g"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "Boots", retailerId: "boots", price: "£30.00", priceNum: 30.00, inStock: true, url: awin("2041", "https://www.boots.com/nars-blush-orgasm-10330665"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "30× Boots points" },
  ],

  // p23 — Medik8 Crystal Retinal 6
  p23: [
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£55.00", priceNum: 55.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/medik8-crystal-retinal-6/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£55.00", priceNum: 55.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/medik8-crystal-retinal-6/11363808.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Space NK", retailerId: "spacenk", price: "£55.00", priceNum: 55.00, inStock: true, url: awin("59805", "https://www.spacenk.com/uk/skincare/serums/serum/crystal-retinal-6-MUK200027545.html"), logo: "🌙", color: "#1a1a2e", freeDeliveryThreshold: "£30" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£51.00", priceNum: 51.00, inStock: true, url: amz("Medik8 Crystal Retinal 6"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
  ],

  // p25 — Glow Recipe Watermelon Sleeping Mask
  p25: [
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£38.00", priceNum: 38.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/glow-recipe-watermelon-glow-sleeping-mask/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "Sephora", retailerId: "sephora", price: "£38.00", priceNum: 38.00, inStock: true, url: awin("15718", "https://www.sephora.co.uk/p/glow-recipe-watermelon-sleeping-mask"), logo: "🖤", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£38.00", priceNum: 38.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/glow-recipe-watermelon-sleeping-mask/11363810.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£35.00", priceNum: 35.00, inStock: true, url: amz("Glow Recipe Watermelon Sleeping Mask"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
  ],

  // p91 — Charlotte Tilbury Flawless Filter
  p91: [
    { retailer: "Charlotte Tilbury", retailerId: "charlotte-tilbury", price: "£40.00", priceNum: 40.00, inStock: true, url: awin("13611", "https://www.charlottetilbury.com/uk/product/flawless-filter"), logo: "🌹", color: "#b5644e", freeDeliveryThreshold: "£30" },
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£40.00", priceNum: 40.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/charlotte-tilbury-flawless-filter/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "Boots", retailerId: "boots", price: "£40.00", priceNum: 40.00, inStock: true, url: awin("2041", "https://www.boots.com/charlotte-tilbury-flawless-filter"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "40× Boots points" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£40.00", priceNum: 40.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/charlotte-tilbury-flawless-filter/11363812.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£37.00", priceNum: 37.00, inStock: true, url: amz("Charlotte Tilbury Flawless Filter complexion booster"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
  ],

  // p98 — Lancôme Advanced Génifique Serum
  p98: [
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£58.00", priceNum: 58.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/lancome-advanced-genifique-serum-30ml/11363814.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Boots", retailerId: "boots", price: "£58.00", priceNum: 58.00, inStock: true, url: awin("2041", "https://www.boots.com/lancome-advanced-genifique-youth-activating-serum-30ml"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "58× Boots points" },
    { retailer: "John Lewis", retailerId: "john-lewis", price: "£58.00", priceNum: 58.00, inStock: true, url: awin("2995", "https://www.johnlewis.com/search?search-term=Lancome+Advanced+Genifique+Serum"), logo: "🛍️", color: "#1a5276", freeDeliveryThreshold: "£50" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£52.00", priceNum: 52.00, inStock: true, url: amz("Lancome Advanced Genifique Youth Activating Serum 30ml"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "Space NK", retailerId: "spacenk", price: "£59.00", priceNum: 59.00, inStock: true, url: awin("59805", "https://www.spacenk.com/uk/skincare/serums/serum/advanced-genifique-serum-MUK200027546.html"), logo: "🌙", color: "#1a1a2e", freeDeliveryThreshold: "£30" },
  ],

  // p99 — No7 Future Renew Serum
  p99: [
    { retailer: "Boots", retailerId: "boots", price: "£34.95", priceNum: 34.95, inStock: true, url: awin("2041", "https://www.boots.com/no7-future-renew-serum-30ml-10337010"), logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25", loyaltyPoints: "34× Boots points" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£34.95", priceNum: 34.95, inStock: true, url: awin("2082", "https://www.lookfantastic.com/no7-future-renew-serum/11363820.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£31.99", priceNum: 31.99, inStock: true, url: amz("No7 Future Renew Serum 30ml"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "John Lewis", retailerId: "john-lewis", price: "£34.95", priceNum: 34.95, inStock: true, url: awin("2995", "https://www.johnlewis.com/search?search-term=No7+Future+Renew+Serum"), logo: "🛍️", color: "#1a5276", freeDeliveryThreshold: "£50" },
  ],

  // p100 — Glow Recipe Plum Plump Moisturiser
  p100: [
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: "£39.00", priceNum: 39.00, inStock: true, url: awin("29063", "https://www.cultbeauty.co.uk/p/glow-recipe-plum-plump-hyaluronic-acid-serum-moisturiser/"), logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "Sephora", retailerId: "sephora", price: "£39.00", priceNum: 39.00, inStock: true, url: awin("15718", "https://www.sephora.co.uk/p/glow-recipe-plum-plump-moisturiser"), logo: "🖤", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: "£39.00", priceNum: 39.00, inStock: true, url: awin("2082", "https://www.lookfantastic.com/glow-recipe-plum-plump-moisturiser/11363822.html"), logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Amazon UK", retailerId: "amazon", price: "£36.00", priceNum: 36.00, inStock: true, url: amz("Glow Recipe Plum Plump Hyaluronic Acid Moisturiser"), logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
  ],
};

// Fallback: generate generic search links for products not in the lookup table
export function getFallbackPrices(productName: string, brand: string, catalogPrice: string): RetailerPrice[] {
  const q = encodeURIComponent(`${brand} ${productName}`);
  const priceNum = parseFloat(catalogPrice.replace(/[^0-9.]/g, "")) || 0;
  return [
    { retailer: "LOOKFANTASTIC", retailerId: "lookfantastic", price: catalogPrice, priceNum, inStock: true, url: `https://www.awin1.com/cread.php?awinmid=2082&awinaffid=2854395&ued=https%3A%2F%2Fwww.lookfantastic.com%2Fsearch%3Fq%3D${q}`, logo: "✨", color: "#000000", freeDeliveryThreshold: "£25" },
    { retailer: "Cult Beauty", retailerId: "cult-beauty", price: catalogPrice, priceNum, inStock: true, url: `https://www.awin1.com/cread.php?awinmid=29063&awinaffid=2854395&ued=https%3A%2F%2Fwww.cultbeauty.co.uk%2Fsearch%3Fquery%3D${q}`, logo: "💋", color: "#c85a8a", freeDeliveryThreshold: "£25" },
    { retailer: "Boots", retailerId: "boots", price: catalogPrice, priceNum, inStock: true, url: `https://www.awin1.com/cread.php?awinmid=2041&awinaffid=2854395&ued=https%3A%2F%2Fwww.boots.com%2Fsearch%3Fq%3D${q}`, logo: "💙", color: "#005eb8", freeDeliveryThreshold: "£25" },
    { retailer: "Amazon UK", retailerId: "amazon", price: catalogPrice, priceNum, inStock: true, url: `https://www.amazon.co.uk/s?k=${q}&tag=blushmap-21`, logo: "📦", color: "#ff9900", freeDeliveryThreshold: "£25 or Prime" },
    { retailer: "Space NK", retailerId: "spacenk", price: catalogPrice, priceNum, inStock: true, url: `https://www.awin1.com/cread.php?awinmid=59805&awinaffid=2854395&ued=https%3A%2F%2Fwww.spacenk.com%2Fuk%2Fsearch%23q%3D${q}`, logo: "🌙", color: "#1a1a2e", freeDeliveryThreshold: "£30" },
  ];
}

// Get prices for a product (specific or fallback)
export function getPricesForProduct(productId: string, productName: string, brand: string, catalogPrice: string): RetailerPrice[] {
  return RETAILER_PRICES[productId] ?? getFallbackPrices(productName, brand, catalogPrice);
}
