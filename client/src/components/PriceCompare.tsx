import { useState } from "react";
import { Heart, ExternalLink, TrendingDown, CheckCircle2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPricesForProduct,
  getBestPrice,
  getSavings,
  type RetailerPrice,
} from "@/lib/retailerPrices";

interface PriceCompareProps {
  productId: string;
  productName: string;
  brand: string;
  catalogPrice: string;
  /** If true, shows a compact horizontal strip (for product cards / quick-view) */
  compact?: boolean;
}

export default function PriceCompare({
  productId,
  productName,
  brand,
  catalogPrice,
  compact = false,
}: PriceCompareProps) {
  const [saved, setSaved] = useState(false);
  const retailers = getPricesForProduct(productId, productName, brand, catalogPrice);
  const best = getBestPrice(retailers);
  const savings = getSavings(retailers);
  const sorted = [...retailers].sort((a, b) => a.priceNum - b.priceNum);

  if (compact) {
    // ── Compact strip for cards / quick-view ───────────────────────────────────
    return (
      <div className="mt-3 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-rose)] mb-1">
          Compare prices
        </p>
        <div className="flex flex-wrap gap-2">
          {sorted.slice(0, 4).map((r) => (
            <a
              key={r.retailerId}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all hover:scale-105 ${
                best?.retailerId === r.retailerId
                  ? "border-[var(--color-rose)] bg-[var(--color-rose)]/10 text-[var(--color-rose-deep)]"
                  : "border-[var(--color-champagne)] bg-white text-stone-700 hover:border-[var(--color-blush)]"
              }`}
              data-testid={`price-compact-${r.retailerId}`}
            >
              <span>{r.logo}</span>
              <span>{r.price}</span>
              {best?.retailerId === r.retailerId && (
                <span className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--color-rose)]">
                  Best
                </span>
              )}
            </a>
          ))}
        </div>
        {savings > 0 && (
          <p className="text-[0.65rem] text-stone-500 flex items-center gap-1">
            <TrendingDown size={10} className="text-emerald-500" />
            Save up to £{savings.toFixed(2)} by choosing the best price
          </p>
        )}
      </div>
    );
  }

  // ── Full price comparison panel ────────────────────────────────────────────
  return (
    <div className="mt-6 rounded-2xl border border-[var(--color-champagne)] bg-white/70 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-champagne)] bg-[var(--color-nude)]/60">
        <div className="flex items-center gap-2">
          <TrendingDown size={16} className="text-[var(--color-rose)]" />
          <h3 className="text-sm font-semibold text-stone-800 tracking-wide">
            Price Comparison
          </h3>
          <Badge
            variant="secondary"
            className="text-[0.6rem] bg-[var(--color-rose)]/10 text-[var(--color-rose-deep)] border-0 px-1.5 py-0.5"
          >
            {retailers.length} retailers
          </Badge>
        </div>

        {savings > 0 && (
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <TrendingDown size={11} className="text-emerald-600" />
            <span className="text-[0.65rem] font-semibold text-emerald-700">
              Save up to £{savings.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Retailer rows */}
      <div className="divide-y divide-[var(--color-champagne)]/60">
        {sorted.map((r, idx) => {
          const isBest = best?.retailerId === r.retailerId;
          const isCheapest = idx === 0;

          return (
            <div
              key={r.retailerId}
              data-testid={`price-row-${r.retailerId}`}
              className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${
                isBest
                  ? "bg-[var(--color-rose)]/5"
                  : "hover:bg-[var(--color-nude)]/40"
              }`}
            >
              {/* Logo + retailer name */}
              <span className="text-xl w-7 shrink-0">{r.logo}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-medium text-stone-800 truncate">
                    {r.retailer}
                  </span>
                  {isBest && (
                    <span className="inline-flex items-center gap-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-rose)] bg-[var(--color-rose)]/10 px-1.5 py-0.5 rounded-full">
                      <CheckCircle2 size={9} />
                      Best Price
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {r.freeDeliveryThreshold && (
                    <span className="flex items-center gap-0.5 text-[0.6rem] text-stone-400">
                      <Package size={9} />
                      Free delivery over {r.freeDeliveryThreshold}
                    </span>
                  )}
                  {r.loyaltyPoints && (
                    <span className="text-[0.6rem] text-amber-600 font-medium">
                      {r.loyaltyPoints}
                    </span>
                  )}
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-sm font-bold tabular-nums ${
                    isCheapest ? "text-emerald-600" : "text-stone-700"
                  }`}
                >
                  {r.inStock ? r.price : "OOS"}
                </span>

                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`price-buy-${r.retailerId}`}
                  className={`inline-flex items-center gap-1 text-[0.65rem] font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105 ${
                    isBest
                      ? "bg-[var(--color-rose)] text-white hover:bg-[var(--color-rose-deep)]"
                      : "bg-[var(--color-champagne)] text-stone-700 hover:bg-[var(--color-blush)] hover:text-white"
                  }`}
                >
                  Buy
                  <ExternalLink size={9} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer — save + affiliate disclosure */}
      <div className="flex items-center justify-between px-5 py-3 bg-[var(--color-nude)]/40 border-t border-[var(--color-champagne)]">
        <button
          onClick={() => setSaved(!saved)}
          data-testid="price-save-btn"
          className={`flex items-center gap-1.5 text-xs font-medium transition-all ${
            saved
              ? "text-[var(--color-rose)]"
              : "text-stone-500 hover:text-[var(--color-rose)]"
          }`}
        >
          <Heart
            size={13}
            className={saved ? "fill-[var(--color-rose)]" : ""}
          />
          {saved ? "Saved to wishlist" : "Save to wishlist"}
        </button>

        <p className="text-[0.55rem] text-stone-400 text-right max-w-[200px]">
          BlushMap earns a commission when you shop via these links, at no extra cost to you.
        </p>
      </div>
    </div>
  );
}
