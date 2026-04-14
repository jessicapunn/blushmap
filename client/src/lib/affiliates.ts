// ── BlushMap Affiliate Network ────────────────────────────────────────────────
// Awin Publisher ID: 2854395
// Deep link format: https://www.awin1.com/cread.php?awinmid=ADVERTISER_ID&awinaffid=2854395&ued=DESTINATION_URL
// Amazon Associates tag: blushmap-21

const AWIN_PID = "2854395";

// ── Awin deep link builder ────────────────────────────────────────────────────
function awin(advertiserId: string, destinationUrl: string): string {
  return `https://www.awin1.com/cread.php?awinmid=${advertiserId}&awinaffid=${AWIN_PID}&ued=${encodeURIComponent(destinationUrl)}`;
}

// ── Per-retailer search link builders ────────────────────────────────────────

// LOOKFANTASTIC — Awin #2082 — up to 10% commission (content creators), 30-day cookie
export const lf = (q: string) =>
  awin("2082", `https://www.lookfantastic.com/search?q=${encodeURIComponent(q)}`);

// Cult Beauty — Awin #29063 — up to 15% commission, 30-day cookie
export const cult = (q: string) =>
  awin("29063", `https://www.cultbeauty.co.uk/search?query=${encodeURIComponent(q)}`);

// Space NK — Awin #59805 — 7% new / 2% existing, 30-day cookie
export const spaceNK = (q: string) =>
  awin("59805", `https://www.spacenk.com/uk/search#q=${encodeURIComponent(q)}`);

// Boots — Awin #2041 — up to 10% skincare / 8% beauty, 30-day cookie
export const boots = (q: string) =>
  awin("2041", `https://www.boots.com/search?q=${encodeURIComponent(q)}`);

// Charlotte Tilbury — Awin #13611 — ~8-10% commission, 30-day cookie
export const ct = (q: string) =>
  awin("13611", `https://www.charlottetilbury.com/uk/search?q=${encodeURIComponent(q)}`);

// Sephora UK — Awin #15718 — ~5-8% commission, 30-day cookie
export const sephora = (q: string) =>
  awin("15718", `https://www.sephora.co.uk/search?q=${encodeURIComponent(q)}`);

// John Lewis — Awin #2995 — 2-5% commission, 30-day cookie
export const jl = (q: string) =>
  awin("2995", `https://www.johnlewis.com/search?search-term=${encodeURIComponent(q)}`);

// Notino — Awin #20754 — 5-10% commission, 30-day cookie
export const notino = (q: string) =>
  awin("20754", `https://www.notino.co.uk/search/?phrase=${encodeURIComponent(q)}`);

// Debenhams Beauty — Awin #6659 — ~5% commission
export const debenhams = (q: string) =>
  awin("6659", `https://www.debenhams.com/beauty?q=${encodeURIComponent(q)}`);

// Amazon UK — Amazon Associates tag (separate programme)
export const amz = (q: string) =>
  `https://www.amazon.co.uk/s?k=${encodeURIComponent(q)}&tag=blushmap-21`;

// ── Retailer directory ────────────────────────────────────────────────────────
export interface AffiliateRetailer {
  id: string;
  name: string;
  logo: string;
  commission: string;
  network: string;
  cookieDays: number;
  color: string;
  url: string;
  buildLink: (query: string) => string;
}

export const RETAILERS: AffiliateRetailer[] = [
  {
    id: "lookfantastic",
    name: "LOOKFANTASTIC",
    logo: "✨",
    commission: "Up to 10%",
    network: "Awin #2082",
    cookieDays: 30,
    color: "#000000",
    url: awin("2082", "https://www.lookfantastic.com"),
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
    url: awin("29063", "https://www.cultbeauty.co.uk"),
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
    url: awin("59805", "https://www.spacenk.com/uk"),
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
    url: awin("2041", "https://www.boots.com/beauty"),
    buildLink: boots,
  },
  {
    id: "charlotte-tilbury",
    name: "Charlotte Tilbury",
    logo: "🌹",
    commission: "8-10%",
    network: "Awin #13611",
    cookieDays: 30,
    color: "#b5644e",
    url: awin("13611", "https://www.charlottetilbury.com/uk"),
    buildLink: ct,
  },
  {
    id: "sephora",
    name: "Sephora",
    logo: "🖤",
    commission: "5-8%",
    network: "Awin #15718",
    cookieDays: 30,
    color: "#000000",
    url: awin("15718", "https://www.sephora.co.uk"),
    buildLink: sephora,
  },
  {
    id: "john-lewis",
    name: "John Lewis",
    logo: "🛍️",
    commission: "2-5%",
    network: "Awin #2995",
    cookieDays: 30,
    color: "#1a5276",
    url: awin("2995", "https://www.johnlewis.com/beauty"),
    buildLink: jl,
  },
  {
    id: "notino",
    name: "Notino",
    logo: "🌸",
    commission: "5-10%",
    network: "Awin #20754",
    cookieDays: 30,
    color: "#e75480",
    url: awin("20754", "https://www.notino.co.uk"),
    buildLink: notino,
  },
  {
    id: "debenhams",
    name: "Debenhams Beauty",
    logo: "👜",
    commission: "5%",
    network: "Awin #6659",
    cookieDays: 30,
    color: "#8b0000",
    url: awin("6659", "https://www.debenhams.com/beauty"),
    buildLink: debenhams,
  },
  {
    id: "amazon",
    name: "Amazon UK",
    logo: "📦",
    commission: "3-5%",
    network: "Amazon Associates",
    cookieDays: 1,
    color: "#ff9900",
    url: "https://www.amazon.co.uk/beauty?tag=blushmap-21",
    buildLink: amz,
  },
];

// ── Smart primary link ─────────────────────────────────────────────────────────
// Routes to highest-commission retailer that stocks the brand
export function primaryLink(brand: string, query: string): string {
  const b = brand.toLowerCase();
  if (b.includes("charlotte tilbury"))                                              return ct(query);
  if (["nars","mac","estée lauder","estee lauder","clinique","la prairie",
       "augustinus bader","sisley","tatcha","fresh","murad","kiehl"].some(x => b.includes(x))) return lf(query);
  if (["the ordinary","paula's choice","cerave","neutrogena","garnier",
       "simple","la roche-posay","ultrasun","drunk elephant"].some(x => b.includes(x)))        return boots(query);
  if (["rare beauty","fenty","kylie","too faced","urban decay"].some(x => b.includes(x)))      return sephora(query);
  return lf(query); // default: LOOKFANTASTIC (highest general commission)
}

// ── Multi-retailer buy links for a product ────────────────────────────────────
export function buildBuyLinks(productName: string, brand: string) {
  const q = `${brand} ${productName}`;
  return RETAILERS.map(r => ({
    retailer: r.name,
    logo: r.logo,
    url: r.buildLink(q),
    color: r.color,
    commission: r.commission,
  }));
}

// ── Live Deals ────────────────────────────────────────────────────────────────
export interface Deal {
  id: string;
  retailer: string;
  title: string;
  description: string;
  discount: string;
  url: string;
  category?: string;
}

export const LIVE_DEALS: Deal[] = [
  {
    id: "d1",
    retailer: "LOOKFANTASTIC",
    title: "Up to 30% off Skincare",
    description: "Save on La Roche-Posay, CeraVe, The Ordinary and more",
    discount: "30% OFF",
    url: awin("2082", "https://www.lookfantastic.com/offers/"),
    category: "skincare",
  },
  {
    id: "d2",
    retailer: "Cult Beauty",
    title: "Free Gift with Charlotte Tilbury",
    description: "Spend £60+ on Charlotte Tilbury and receive a free deluxe gift",
    discount: "FREE GIFT",
    url: awin("29063", "https://www.cultbeauty.co.uk/charlotte-tilbury.list"),
    category: "makeup",
  },
  {
    id: "d3",
    retailer: "Boots",
    title: "3 for 2 on Selected Skincare",
    description: "Mix and match across premium skincare brands",
    discount: "3 FOR 2",
    url: awin("2041", "https://www.boots.com/beauty/skincare"),
    category: "skincare",
  },
  {
    id: "d4",
    retailer: "Space NK",
    title: "Luxury Discovery Kits",
    description: "Curated luxury travel kits from top brands at exclusive prices",
    discount: "UP TO 40% OFF",
    url: awin("59805", "https://www.spacenk.com/uk/offers"),
    category: "luxury",
  },
  {
    id: "d5",
    retailer: "Sephora",
    title: "New In: Rare Beauty",
    description: "Explore the latest Rare Beauty launches, exclusive to Sephora",
    discount: "NEW IN",
    url: awin("15718", "https://www.sephora.co.uk/brands/rare-beauty"),
    category: "makeup",
  },
  {
    id: "d6",
    retailer: "John Lewis",
    title: "Premium Skincare Event",
    description: "Clinique, Estée Lauder & La Prairie — with complimentary samples",
    discount: "FREE SAMPLES",
    url: awin("2995", "https://www.johnlewis.com/beauty/skincare"),
    category: "skincare",
  },
  {
    id: "d7",
    retailer: "Notino",
    title: "Fragrance & Beauty Sets",
    description: "Luxury gift sets from CHANEL, Dior, YSL at reduced prices",
    discount: "UP TO 25% OFF",
    url: awin("20754", "https://www.notino.co.uk/offers/"),
    category: "fragrance",
  },
  {
    id: "d8",
    retailer: "Amazon UK",
    title: "Subscribe & Save on Skincare",
    description: "Save an extra 15% when you subscribe to repeat deliveries",
    discount: "15% EXTRA",
    url: `https://www.amazon.co.uk/s?k=skincare&rh=n%3A66280031&tag=blushmap-21`,
    category: "skincare",
  },
];
