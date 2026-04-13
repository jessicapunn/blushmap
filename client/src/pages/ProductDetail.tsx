import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { NavBar } from "@/components/NavBar";
import {
  ArrowLeft, ShoppingBag, ExternalLink, Star, Leaf, Crown, Banknote,
  Sparkles, Heart, ShoppingCart, CheckCircle, ChevronRight, Package
} from "lucide-react";
import { useState } from "react";
import { useBasket } from "@/lib/basket";
import { useAuth } from "@/lib/auth";

// Multi-retailer affiliate links for each product
function buildRetailerLinks(productName: string, brand: string) {
  const q = encodeURIComponent(`${brand} ${productName}`);
  return [
    {
      name: "Amazon UK",
      url: `https://www.amazon.co.uk/s?k=${q}&tag=blushmap-21`,
      color: "#FF9900",
      bg: "#fff8ee",
      border: "#ffd280",
      note: "Free delivery Prime",
    },
    {
      name: "LOOKFANTASTIC",
      url: `https://www.lookfantastic.com/search?q=${q}`,
      color: "#1a1a2e",
      bg: "#f0f0f8",
      border: "#c8c8e8",
      note: "Often lowest price",
      badge: "Best price",
    },
    {
      name: "Cult Beauty",
      url: `https://www.cultbeauty.co.uk/search?q=${q}`,
      color: "#2d2d2d",
      bg: "#fafafa",
      border: "#e0e0e0",
      note: "Points & gifts",
    },
    {
      name: "Boots",
      url: `https://www.boots.com/search?text=${q}`,
      color: "#004B87",
      bg: "#eef4ff",
      border: "#b8d0ee",
      note: "Advantage card points",
    },
    {
      name: "Space NK",
      url: `https://www.spacenk.com/uk/search?searchTerm=${q}`,
      color: "#1a1a1a",
      bg: "#f8f8f8",
      border: "#ddd",
      note: "Luxury beauty specialist",
    },
  ];
}

const INGREDIENT_COLORS = [
  { bg: "hsl(340 30% 93%)", text: "hsl(340 55% 35%)" },
  { bg: "hsl(30 40% 92%)",  text: "hsl(30 55% 30%)"  },
  { bg: "hsl(270 25% 91%)", text: "hsl(270 45% 35%)" },
  { bg: "hsl(200 30% 90%)", text: "hsl(200 50% 30%)" },
  { bg: "hsl(130 25% 89%)", text: "hsl(130 40% 28%)" },
];

const ALT_CONFIG = [
  { key: "budget",  label: "Budget Pick",   Icon: Banknote,  color: "#4a9b6a", bg: "#eef8f2" },
  { key: "luxury",  label: "Luxury Pick",   Icon: Crown,     color: "#c9944a", bg: "#fdf6ec" },
  { key: "organic", label: "Clean & Organic", Icon: Leaf,    color: "#5a8a5a", bg: "#f0f7f0" },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { add } = useBasket();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", id],
    queryFn: () => apiRequest("GET", `/api/products/${id}`).then(r => r.json()),
    enabled: !!id,
  });

  function handleAddToBasket() {
    if (!product) return;
    add({ id: product.id, name: product.name, brand: product.brand, price: product.price, image: product.image, affiliateUrl: product.affiliateUrl, category: product.category || "skincare" });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
        <NavBar />
        <div className="max-w-3xl mx-auto px-5 py-16 text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 skeleton" />
          <div className="h-6 w-48 mx-auto rounded skeleton mb-2" />
          <div className="h-4 w-32 mx-auto rounded skeleton" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
        <NavBar />
        <div className="max-w-3xl mx-auto px-5 py-16 text-center">
          <Package size={48} className="mx-auto mb-4" style={{ color: "#f0ccd6" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Product not found</h1>
          <Link href="/search"><span className="text-sm underline mt-2 block" style={{ color: "var(--color-rose)" }}>Browse all products →</span></Link>
        </div>
      </div>
    );
  }

  const retailers = buildRetailerLinks(product.name, product.brand);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "#9b6674" }}>
          <Link href="/"><span className="hover:underline cursor-pointer">Home</span></Link>
          <ChevronRight size={12} />
          <Link href="/search"><span className="hover:underline cursor-pointer">Products</span></Link>
          <ChevronRight size={12} />
          <span style={{ color: "#1a0a0e" }} className="capitalize">{product.category?.replace(/-/g, " ")}</span>
        </div>

        {/* Hero card */}
        <div className="rounded-3xl overflow-hidden mb-6" style={{ background: "#fff9fb", border: "1px solid #f0ccd6", boxShadow: "0 4px 32px rgba(180,60,90,0.08)" }}>
          <div className="flex flex-col sm:flex-row gap-0">

            {/* Product image */}
            <div className="sm:w-80 shrink-0 relative" style={{ background: "linear-gradient(135deg, #fff0f5, #fce8ef)", minHeight: 280 }}>
              {!imgError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: 320 }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 280 }}>
                  <Package size={64} style={{ color: "#f0ccd6" }} />
                </div>
              )}
              {product.bestSeller && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}>
                  ★ Best Seller
                </div>
              )}
              {product.newIn && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold text-white" style={{ background: "#7c3aed" }}>
                  New In
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--color-gold)" }}>{product.brand}</p>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 3vw, 2rem)", lineHeight: 1.15, color: "#1a0a0e", marginBottom: "0.5rem" }}>
                {product.name}
              </h1>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#5a3040" }}>{product.description}</p>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-rose)" }}>{product.price}</span>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13} fill={s <= 4 ? "#c9a96e" : "none"} style={{ color: "#c9a96e" }} />
                  ))}
                  <span className="text-xs ml-1" style={{ color: "#9b6674" }}>4.5 (120+ reviews)</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {(product.tags || []).slice(0, 5).map((tag: string) => (
                  <span key={tag} className="badge-pink capitalize">{tag.replace(/-/g, " ")}</span>
                ))}
              </div>

              {/* CTA row */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleAddToBasket}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: added ? "#4a9b6a" : "linear-gradient(135deg, #c9506e, #a3324e)" }}
                >
                  {added ? <><CheckCircle size={15} /> Added!</> : <><ShoppingCart size={15} /> Add to Basket</>}
                </button>
                <button
                  onClick={() => setSaved(s => !s)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all"
                  style={{ border: "1.5px solid #f0ccd6", color: saved ? "#c9506e" : "#9b6674", background: saved ? "#fff0f4" : "transparent" }}
                >
                  <Heart size={14} fill={saved ? "#c9506e" : "none"} />
                  {saved ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column: ingredients + benefits */}
          <div className="lg:col-span-2 space-y-5">

            {/* Key Ingredients */}
            {product.keyIngredients?.length > 0 && (
              <section className="rounded-2xl p-6" style={{ background: "#fff9fb", border: "1px solid #f0ccd6" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "#1a0a0e", marginBottom: "1rem" }}>
                  Key Ingredients
                </h2>
                <div className="space-y-3">
                  {product.keyIngredients.map((ing: { name: string; benefit: string }, i: number) => {
                    const col = INGREDIENT_COLORS[i % INGREDIENT_COLORS.length];
                    return (
                      <div key={ing.name} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: col.bg, border: `1px solid ${col.text}20` }}>
                        <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: col.text }} />
                        <div>
                          <p className="text-sm font-semibold" style={{ color: col.text }}>{ing.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#5a3040" }}>{ing.benefit}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Suitable for */}
            {product.suitableFor?.length > 0 && (
              <section className="rounded-2xl p-6" style={{ background: "#fff9fb", border: "1px solid #f0ccd6" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "#1a0a0e", marginBottom: "1rem" }}>
                  Best For
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.suitableFor.map((s: string) => (
                    <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize" style={{ background: "#fce8ef", color: "#a3324e", border: "1px solid #f0ccd6" }}>
                      <CheckCircle size={12} /> {s.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Alternatives */}
            {product.alternatives && (
              <section className="rounded-2xl p-6" style={{ background: "#fff9fb", border: "1px solid #f0ccd6" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "#1a0a0e", marginBottom: "1rem" }}>
                  Alternative Picks
                </h2>
                <div className="grid gap-3">
                  {ALT_CONFIG.map(({ key, label, Icon, color, bg }) => {
                    const alt = product.alternatives[key];
                    if (!alt) return null;
                    return (
                      <div key={key} className="rounded-xl p-4" style={{ background: bg, border: `1px solid ${color}25` }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon size={14} style={{ color }} />
                          <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs" style={{ color: "#9b6674" }}>{alt.brand}</p>
                            <p className="text-sm font-semibold" style={{ color: "#1a0a0e" }}>{alt.name}</p>
                          </div>
                          <span className="text-sm font-bold shrink-0" style={{ color }}>{alt.price}</span>
                        </div>
                        <a
                          href={alt.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                          style={{ background: color }}
                        >
                          <ShoppingBag size={11} /> Shop <ExternalLink size={10} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right column: where to buy */}
          <div className="space-y-5">
            <section className="rounded-2xl p-5 sticky top-20" style={{ background: "#fff9fb", border: "1px solid #f0ccd6" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "#1a0a0e", marginBottom: "0.25rem" }}>
                Where to Buy
              </h2>
              <p className="text-xs mb-4" style={{ color: "#9b6674" }}>Prices may vary — check each site for the best deal.</p>

              <div className="space-y-2.5">
                {retailers.map((r, i) => (
                  <a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center justify-between gap-3 p-3 rounded-xl transition-all hover:shadow-sm group"
                    style={{ background: r.bg, border: `1px solid ${r.border}`, textDecoration: "none" }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold" style={{ background: r.color }}>
                        {r.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: "#1a0a0e" }}>{r.name}</p>
                        <p className="text-[10px] truncate" style={{ color: "#9b6674" }}>{r.note}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {r.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "#4a9b6a" }}>
                          {r.badge}
                        </span>
                      )}
                      <ExternalLink size={12} style={{ color: "#c9506e" }} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </a>
                ))}
              </div>

              <p className="text-[10px] mt-4 text-center" style={{ color: "#c4a0aa" }}>
                BlushMap earns a small commission at no extra cost to you.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
