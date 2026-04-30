/**
 * Affiliate points helpers
 * Call trackAffiliateClick() instead of navigating directly to affiliate URLs.
 * It awards 10 pts (deduplicated per product per day), then opens the link.
 */

export interface PointsBalance {
  totalPoints: number;
  lifetimePoints: number;
}

/** Award points + open link. Returns null if user is not signed in. */
export async function trackAffiliateClick(opts: {
  url: string;
  productId?: string;
  productName?: string;
  retailer?: string;
}): Promise<{ awarded: number; totalPoints: number } | null> {
  try {
    const res = await fetch("/api/affiliate/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        productId: opts.productId,
        productName: opts.productName,
        retailer: opts.retailer,
        affiliateUrl: opts.url,
      }),
    });
    if (res.status === 401) return null; // not signed in
    const data = await res.json();
    return { awarded: data.awarded ?? 0, totalPoints: data.totalPoints ?? 0 };
  } catch {
    return null;
  }
}

export async function fetchPoints(): Promise<PointsBalance | null> {
  try {
    const res = await fetch("/api/profile/points", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.points ?? null;
  } catch {
    return null;
  }
}

export async function fetchPointsHistory() {
  try {
    const res = await fetch("/api/profile/points/history", { credentials: "include" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.history ?? [];
  } catch {
    return [];
  }
}

/** Detect retailer name from an Awin URL */
export function retailerFromUrl(url: string): string {
  if (url.includes("awinmid=2082")) return "LOOKFANTASTIC";
  if (url.includes("awinmid=29063")) return "Cult Beauty";
  if (url.includes("awinmid=59805")) return "Space NK";
  if (url.includes("awinmid=2041")) return "Boots";
  if (url.includes("awinmid=20754")) return "Notino";
  if (url.includes("lookfantastic")) return "LOOKFANTASTIC";
  if (url.includes("cultbeauty")) return "Cult Beauty";
  if (url.includes("spacenk")) return "Space NK";
  if (url.includes("boots.com")) return "Boots";
  return "Partner";
}
