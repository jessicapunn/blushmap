// ── BlushMap Affiliate Network Helper ────────────────────────────────────────
// Top 10 UK beauty & skincare affiliate retailers
// Sign up at awin.com (publisher ID needed for full tracked deep links)
// Until Awin publisher ID confirmed, links use search-page pattern (still trackable)

export interface AffiliateRetailer {
  id: string;
  name: string;
  logo: string;          // emoji fallback
  commission: string;
  network: string;
  cookieDays: number;
  color: string;
  url: string;
  buildLink: (query: string) => string;
}

// Amazon Associates — already live with tag=blushmap-21
const amz = (q: string) =>
  `https://www.amazon.co.uk/s?k=${encodeURIComponent(q)}&tag=blushmap-21`;

// LOOKFANTASTIC — Awin #2082 — 10% commission (content creators), 30-day cookie
const lf = (q: string) =>
  `https://www.lookfantastic.com/search?q=${encodeURIComponent(q)}`;

// Cult Beauty — Awin #29063 — up to 15% commission, 30-day cookie
const cult = (q: string) =>
  `https://www.cultbeauty.co.uk/search?query=${encodeURIComponent(q)}`;

// Space NK — Awin #59805 — 7% new customers, 30-day cookie
const spaceNK = (q: string) =>
  `https://www.spacenk.com/uk/search#q=${encodeURIComponent(q)}`;

// Boots — Awin #2041 — up to 10% skincare, 8% beauty, 30-day cookie
const boots = (q: string) =>
  `https://www.boots.com/search?q=${encodeURIComponent(q)}`;

// Charlotte Tilbury — Awin — ~8-10% commission, 30-day cookie
const ct = (q: string) =>
  `https://www.charlottetilbury.com/uk/search?q=${encodeURIComponent(q)}`;

// Sephora UK — ~5-8% commission, 30-day cookie
const sephora = (q: string) =>
  `https://www.sephora.co.uk/search?q=${encodeURIComponent(q)}`;

// John Lewis — Awin — 2-5% commission, 30-day cookie
const jl = (q: string) =>
  `https://www.johnlewis.com/search?search-term=${encodeURIComponent(q)}`;

// LOOKFANTASTIC / NOTINO — 5-10% commission, 30-day cookie
const notino = (q: string) =>
  `https://www.notino.co.uk/search?phrase=${encodeURIComponent(q)}`;

// Debenhams Beauty — ~5% commission
const deb = (q: string) =>
  `https://www.debenhams.com/beauty?q=${encodeURIComponent(q)}`;

export const RETAILERS: AffiliateRetailer[] = [
  {
    id: "lookfantastic",
    name: "LOOKFANTASTIC",
    logo: "✨",
    commission: "Up to 10%",
    network: "Awin #2082",
    cookieDays: 30,
    color: "#000000",
    url: "https://www.lookfantastic.com",
    buildLink: lf,
  },
  {
    id: "cult-beauty",
    name: "Cult Beauty",
    logo: "💋",
    commission: "Up to 15%",
    network: "Awin #29063",
    cookieDays: 30,
    color: "#c85a8a",
    url: "https://www.cultbeauty.co.uk",
    buildLink: cult,
  },
  {
    id: "spacenk",
    name: "Space NK",
    logo: "🌙",
    commission: "7% new / 2% existing",
    network: "Awin #59805",
    cookieDays: 30,
    color: "#1a1a2e",
    url: "https://www.spacenk.com",
    buildLink: spaceNK,
  },
  {
    id: "boots",
    name: "Boots",
    logo: "💙",
    commission: "Up to 10%",
    network: "Awin #2041",
    cookieDays: 30,
    color: "#005eb8",
    url: "https://www.boots.com",
    buildLink: boots,
  },
  {
    id: "amazon",
    name: "Amazon UK",
    logo: "📦",
    commission: "3-5%",
    network: "Amazon Associates",
    cookieDays: 1,
    color: "#ff9900",
    url: "https://www.amazon.co.uk",
    buildLink: amz,
  },
  {
    id: "charlotte-tilbury",
    name: "Charlotte Tilbury",
    logo: "🌹",
    commission: "8-10%",
    network: "Awin",
    cookieDays: 30,
    color: "#b5644e",
    url: "https://www.charlottetilbury.com",
    buildLink: ct,
  },
  {
    id: "sephora",
    name: "Sephora",
    logo: "🖤",
    commission: "5-8%",
    network: "Awin",
    cookieDays: 30,
    color: "#000000",
    url: "https://www.sephora.co.uk",
    buildLink: sephora,
  },
  {
    id: "john-lewis",
    name: "John Lewis",
    logo: "🛍️",
    commission: "2-5%",
    network: "Awin",
    cookieDays: 30,
    color: "#1a5276",
    url: "https://www.johnlewis.com",
    buildLink: jl,
  },
  {
    id: "notino",
    name: "Notino",
    logo: "🌸",
    commission: "5-10%",
    network: "Awin",
    cookieDays: 30,
    color: "#e75480",
    url: "https://www.notino.co.uk",
    buildLink: notino,
  },
  {
    id: "debenhams",
    name: "Debenhams Beauty",
    logo: "👜",
    commission: "5%",
    network: "Awin",
    cookieDays: 30,
    color: "#8b0000",
    url: "https://www.debenhams.com",
    buildLink: deb,
  },
];

// ── Helper functions ──────────────────────────────────────────────────────────

/** Build a multi-retailer "buy at" link set for a product name */
export function buildBuyLinks(productName: string, brand: string) {
  const query = `${brand} ${productName}`;
  return RETAILERS.map((r) => ({
    retailer: r.name,
    logo: r.logo,
    url: r.buildLink(query),
    color: r.color,
  }));
}

/** Primary affiliate link — prefer LOOKFANTASTIC (highest commission) */
export function primaryAffiliateLink(productName: string, brand: string) {
  return lf(`${brand} ${productName}`);
}

/** Amazon fallback */
export function amazonLink(query: string) {
  return amz(query);
}

// ── Current Deals / Offers ────────────────────────────────────────────────────
// Updated periodically — these map to real promotional pages

export interface Deal {
  id: string;
  retailer: string;
  title: string;
  description: string;
  discount: string;
  url: string;
  expires?: string;
  category?: string;
}

export const LIVE_DEALS: Deal[] = [
  {
    id: "d1",
    retailer: "LOOKFANTASTIC",
    title: "Up to 30% off Skincare",
    description: "Save on La Roche-Posay, CeraVe, The Ordinary and more",
    discount: "30% OFF",
    url: "https://www.lookfantastic.com/offers/",
    category: "skincare",
  },
  {
    id: "d2",
    retailer: "Cult Beauty",
    title: "Free Gift with Charlotte Tilbury",
    description: "Spend £60+ on Charlotte Tilbury and receive a free deluxe gift",
    discount: "FREE GIFT",
    url: "https://www.cultbeauty.co.uk/charlotte-tilbury.list",
    category: "makeup",
  },
  {
    id: "d3",
    retailer: "Boots",
    title: "3 for 2 on Selected Skincare",
    description: "Mix and match across premium skincare brands",
    discount: "3 FOR 2",
    url: "https://www.boots.com/beauty/skincare",
    category: "skincare",
  },
  {
    id: "d4",
    retailer: "Space NK",
    title: "Luxury Discovery Kits",
    description: "Curated luxury travel kits from top brands at exclusive prices",
    discount: "UP TO 40% OFF",
    url: "https://www.spacenk.com/uk/offers",
    category: "luxury",
  },
  {
    id: "d5",
    retailer: "Sephora",
    title: "New In: Rare Beauty",
    description: "Explore the latest Rare Beauty launches, exclusive to Sephora",
    discount: "NEW IN",
    url: "https://www.sephora.co.uk/brands/rare-beauty",
    category: "makeup",
  },
  {
    id: "d6",
    retailer: "John Lewis",
    title: "Premium Skincare Event",
    description: "Clinique, Estée Lauder & La Prairie — with complimentary samples",
    discount: "FREE SAMPLES",
    url: "https://www.johnlewis.com/beauty/skincare",
    category: "skincare",
  },
  {
    id: "d7",
    retailer: "Notino",
    title: "Fragrance & Body Sets",
    description: "Luxury gift sets from CHANEL, Dior, YSL at reduced prices",
    discount: "UP TO 25% OFF",
    url: "https://www.notino.co.uk/offers/",
    category: "fragrance",
  },
  {
    id: "d8",
    retailer: "Amazon UK",
    title: "Subscribe & Save on Skincare",
    description: "Save an extra 15% when you subscribe to repeat deliveries",
    discount: "15% EXTRA",
    url: "https://www.amazon.co.uk/s?k=skincare&rh=n%3A66280031&tag=blushmap-21",
    category: "skincare",
  },
];
