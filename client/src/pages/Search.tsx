import { useState, useCallback } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Search, SlidersHorizontal, ExternalLink, ShoppingBag, ShoppingCart, Star, Sparkles, TrendingUp, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ── Quick-access filters ──────────────────────────────────────────────────────
const QUICK_CONCERNS = [
  { label: "Acne & Blemishes",   concern: "blemish",     emoji: "🔴" },
  { label: "Dark Spots",         concern: "hyperpigmentation", emoji: "🟤" },
  { label: "Anti-Ageing",        concern: "anti-aging",  emoji: "⏳" },
  { label: "Dryness",            concern: "dry",         emoji: "💧" },
  { label: "Oily Skin",          concern: "oily",        emoji: "✨" },
  { label: "Sensitive Skin",     concern: "sensitive",   emoji: "🌸" },
  { label: "Pores",              concern: "pores",       emoji: "🔍" },
  { label: "Redness",            concern: "redness",     emoji: "🌹" },
  { label: "Fine Lines",         concern: "fine-lines",  emoji: "〰️" },
  { label: "Dark Circles",       concern: "under-eyes",  emoji: "👁️" },
  { label: "Brightening",        concern: "brightening", emoji: "🌟" },
  { label: "SPF Protection",     concern: "spf",         emoji: "☀️" },
];

const CATEGORIES = [
  { label: "Moisturiser",   value: "moisturiser" },
  { label: "Serum",         value: "serum" },
  { label: "SPF",           value: "spf" },
  { label: "Foundation",    value: "foundation" },
  { label: "Concealer",     value: "concealer" },
  { label: "Cleanser",      value: "cleanser" },
  { label: "Eye Cream",     value: "eye-cream" },
  { label: "Retinol",       value: "retinol" },
  { label: "Toner",         value: "toner" },
  { label: "Mask",          value: "mask" },
  { label: "Lip",           value: "lipstick" },
  { label: "Blush",         value: "blush" },
];

function ProductCard({ product }: { product: any }) {
  return (
    <div className="rounded-2xl border overflow-hidden card-hover relative" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
      {product.bestSeller && (
        <div className="ribbon-bestseller">Best Seller</div>
      )}
      {product.newIn && !product.bestSeller && (
        <div className="ribbon-bestseller" style={{ background: "#7c3aed" }}>New In</div>
      )}
      <div className="h-36 overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(350 30% 94%), hsl(345 25% 92%))" }}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80" loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      </div>
      <div className="p-4">
        <p className="text-xs mb-0.5" style={{ color: "var(--color-gold)", fontWeight: 600 }}>{product.brand}</p>
        <h3 className="font-semibold text-sm leading-snug mb-1" style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem" }}>
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="badge-pink">{tag.replace(/-/g, " ")}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold" style={{ color: "var(--color-rose)", fontFamily: "var(--font-display)", fontSize: "1rem" }}>
            {product.price}
          </span>
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-rose)" }}
          >
            <ShoppingBag size={11} /> Buy <ExternalLink size={9} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeConcern, setActiveConcern] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [newIn, setNewIn] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Build API params
  const params = new URLSearchParams();
  if (query.trim())     params.set("q", query.trim());
  if (activeConcern)    params.set("concern", activeConcern);
  if (activeCategory)   params.set("category", activeCategory);
  if (bestseller)       params.set("bestseller", "true");
  if (newIn)            params.set("newIn", "true");
  const paramStr = params.toString();

  const { data, isLoading } = useQuery({
    queryKey: ["/api/search", paramStr],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/search?${paramStr}`);
      return res.json();
    },
  });

  const results: any[] = data?.results || [];
  const hasFilters = query || activeConcern || activeCategory || bestseller || newIn;

  const clearAll = useCallback(() => {
    setQuery("");
    setActiveConcern("");
    setActiveCategory("");
    setBestseller(false);
    setNewIn(false);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))", fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick filter pills */}
        <div className="mb-6">
          {/* Bestseller / New In toggles */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => { setBestseller(b => !b); setNewIn(false); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: bestseller ? "var(--color-rose)" : "hsl(var(--card))",
                borderColor: bestseller ? "var(--color-rose)" : "hsl(var(--border))",
                color: bestseller ? "white" : "hsl(var(--foreground))",
              }}
            >
              <Star size={13} fill={bestseller ? "white" : "none"} /> Best Sellers
            </button>
            <button
              onClick={() => { setNewIn(n => !n); setBestseller(false); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: newIn ? "#7c3aed" : "hsl(var(--card))",
                borderColor: newIn ? "#7c3aed" : "hsl(var(--border))",
                color: newIn ? "white" : "hsl(var(--foreground))",
              }}
            >
              <Zap size={13} /> New In
            </button>
            <button
              onClick={() => { setQuery("vitamin c"); setActiveConcern(""); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-all"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              <TrendingUp size={13} style={{ color: "var(--color-rose)" }} /> Trending: Vitamin C
            </button>
            {hasFilters && (
              <button onClick={clearAll} className="flex items-center gap-1 px-3 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X size={13} /> Clear all
              </button>
            )}
          </div>

          {/* Category row */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(c => c === cat.value ? "" : cat.value)}
                className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={{
                  background: activeCategory === cat.value ? "var(--color-rose)" : "hsl(var(--card))",
                  borderColor: activeCategory === cat.value ? "var(--color-rose)" : "hsl(var(--border))",
                  color: activeCategory === cat.value ? "white" : "hsl(var(--foreground))",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skin concern filter panel */}
        {showFilters && (
          <div className="mb-6 p-5 rounded-2xl border" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-rose)", letterSpacing: "0.12em" }}>
              Filter by skin concern
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_CONCERNS.map(c => (
                <button
                  key={c.concern}
                  onClick={() => setActiveConcern(a => a === c.concern ? "" : c.concern)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all"
                  style={{
                    background: activeConcern === c.concern ? "hsl(345 40% 93%)" : "hsl(var(--background))",
                    borderColor: activeConcern === c.concern ? "hsl(345 50% 75%)" : "hsl(var(--border))",
                    color: activeConcern === c.concern ? "var(--color-rose)" : "hsl(var(--foreground))",
                    fontWeight: activeConcern === c.concern ? 600 : 400,
                  }}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results header */}
        {(hasFilters || data) && (
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Searching…" : `${data?.total ?? 0} products found`}
                {activeConcern && <span className="ml-1">for <span style={{ color: "var(--color-rose)", fontWeight: 600 }}>{activeConcern.replace(/-/g, " ")}</span></span>}
                {query && <span className="ml-1">matching "<span style={{ color: "var(--color-rose)", fontWeight: 600 }}>{query}</span>"</span>}
              </p>
            </div>
          </div>
        )}

        {/* Results grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="skeleton h-36" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-4 w-4/5" />
                  <div className="skeleton h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : hasFilters ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🔍</p>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "0.5rem" }}>No results found</h3>
            <p className="text-muted-foreground text-sm mb-4">Try a different search term or clear your filters.</p>
            <Button variant="outline" onClick={clearAll}>Clear all filters</Button>
          </div>
        ) : (
          /* Empty state — show skin concern grid */
          <div>
            <div className="text-center mb-10">
              <p className="label-eyebrow mb-3">Explore by concern</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: "0.5rem" }}>
                What's your skin goal?
              </h2>
              <p className="text-muted-foreground text-sm">Pick a concern to see curated product recommendations.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-12">
              {QUICK_CONCERNS.map(c => (
                <button
                  key={c.concern}
                  onClick={() => { setActiveConcern(c.concern); setShowFilters(false); }}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all card-hover"
                  style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="text-xs font-semibold leading-snug">{c.label}</span>
                </button>
              ))}
            </div>

            {/* Best sellers preview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="label-eyebrow mb-1">Most loved</p>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem" }}>Best Sellers</h2>
                </div>
                <button
                  onClick={() => setBestseller(true)}
                  className="text-sm flex items-center gap-1 font-medium"
                  style={{ color: "var(--color-rose)" }}
                >
                  View all <ExternalLink size={12} />
                </button>
              </div>
              <BestSellerPreview />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function BestSellerPreview() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/search", "bestseller"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/search?bestseller=true");
      return res.json();
    },
  });

  if (isLoading) return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="skeleton h-32" />
          <div className="p-3 space-y-1.5"><div className="skeleton h-3 w-2/3" /><div className="skeleton h-4 w-full" /></div>
        </div>
      ))}
    </div>
  );

  const products = (data?.results || []).slice(0, 4);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
