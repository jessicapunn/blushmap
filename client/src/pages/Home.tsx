import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Search, ScanLine, Sparkles, ShieldCheck, Star, CheckCircle, AlertTriangle, Leaf, Crown, Banknote, Users, ExternalLink, ShoppingBag, Zap, TrendingUp, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// ── BlushMap Gemini constellation logo ───────────────────────────────────────
// Gemini star map: Castor (left twin) + Pollux (right twin) with connecting lines
// Stars: Castor=top-left head, Pollux=top-right head, then shoulders, waists, feet crossing
function BlushMapLogo({ size = 36 }: { size?: number }) {
  const r = "var(--color-rose)";
  const g = "var(--color-gold)";
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-label="BlushMap — Gemini">
      {/* ── Subtle outer circle ── */}
      <circle cx="22" cy="22" r="20" stroke="var(--color-rose)" strokeWidth="0.6" opacity="0.2" />

      {/* ── Gemini constellation lines ── */}
      {/* Left twin (Castor side): head → shoulder → waist → foot */}
      <line x1="10" y1="5"  x2="10" y2="13" stroke={r} strokeWidth="1" opacity="0.55" strokeLinecap="round"/>
      <line x1="10" y1="13" x2="8"  y2="21" stroke={r} strokeWidth="1" opacity="0.55" strokeLinecap="round"/>
      <line x1="8"  y1="21" x2="10" y2="30" stroke={r} strokeWidth="1" opacity="0.55" strokeLinecap="round"/>
      <line x1="10" y1="30" x2="12" y2="38" stroke={r} strokeWidth="1" opacity="0.55" strokeLinecap="round"/>

      {/* Right twin (Pollux side): head → shoulder → waist → foot */}
      <line x1="34" y1="5"  x2="34" y2="13" stroke={r} strokeWidth="1" opacity="0.55" strokeLinecap="round"/>
      <line x1="34" y1="13" x2="36" y2="21" stroke={r} strokeWidth="1" opacity="0.55" strokeLinecap="round"/>
      <line x1="36" y1="21" x2="34" y2="30" stroke={r} strokeWidth="1" opacity="0.55" strokeLinecap="round"/>
      <line x1="34" y1="30" x2="32" y2="38" stroke={r} strokeWidth="1" opacity="0.55" strokeLinecap="round"/>

      {/* Connecting bridge lines (twins joined at shoulder + waist) */}
      <line x1="10" y1="13" x2="34" y2="13" stroke={r} strokeWidth="0.9" opacity="0.45" strokeLinecap="round"/>
      <line x1="8"  y1="21" x2="36" y2="21" stroke={r} strokeWidth="0.9" opacity="0.45" strokeLinecap="round"/>

      {/* ── Star nodes ── */}
      {/* Castor — bright, gold (α Gem) */}
      <circle cx="10" cy="5"  r="2.2" fill={g} />
      <circle cx="10" cy="5"  r="3.5" fill={g} opacity="0.15" />
      {/* Pollux — bright, rose (β Gem, slightly brighter in reality) */}
      <circle cx="34" cy="5"  r="2.4" fill={r} />
      <circle cx="34" cy="5"  r="3.8" fill={r} opacity="0.15" />
      {/* Shoulders */}
      <circle cx="10" cy="13" r="1.5" fill={r} opacity="0.8" />
      <circle cx="34" cy="13" r="1.5" fill={r} opacity="0.8" />
      {/* Waists */}
      <circle cx="8"  cy="21" r="1.2" fill={r} opacity="0.65" />
      <circle cx="36" cy="21" r="1.2" fill={r} opacity="0.65" />
      {/* Knees / lower */}
      <circle cx="10" cy="30" r="1.2" fill={r} opacity="0.55" />
      <circle cx="34" cy="30" r="1.2" fill={r} opacity="0.55" />
      {/* Feet */}
      <circle cx="12" cy="38" r="1"   fill={r} opacity="0.45" />
      <circle cx="32" cy="38" r="1"   fill={r} opacity="0.45" />
    </svg>
  );
}

// ── Affiliate offers (curated, updated regularly) ────────────────────────────
const OFFERS = [
  {
    id: 1, brand: "LOOKFANTASTIC",
    title: "Up to 30% off skincare",
    desc: "Hundreds of premium skincare brands on sale. La Roche-Posay, Elemis, Paula's Choice and more.",
    badge: "30% OFF", badgeColor: "#c9506e",
    url: "https://www.lookfantastic.com/sale.list?affil=blushmap",
    concern: "all skin types",
  },
  {
    id: 2, brand: "CULT BEAUTY",
    title: "New In: Vitamin C Edits",
    desc: "The best new vitamin C serums, brightening toners and glow-boosting treatments just dropped.",
    badge: "NEW IN", badgeColor: "#7c3aed",
    url: "https://www.cultbeauty.co.uk/vitamin-c.list?affil=blushmap",
    concern: "hyperpigmentation, dullness",
  },
  {
    id: 3, brand: "BOOTS",
    title: "3 for 2 on skincare",
    desc: "Mix and match across hundreds of skincare products. CeraVe, No7, Simple and more included.",
    badge: "3 FOR 2", badgeColor: "#2563eb",
    url: "https://www.boots.com/offers/skincare?affil=blushmap",
    concern: "budget-conscious",
  },
  {
    id: 4, brand: "SPACE NK",
    title: "Luxury beauty event",
    desc: "Earn points on every purchase. Charlotte Tilbury, Drunk Elephant, Tatcha — all included.",
    badge: "POINTS", badgeColor: "#c9944a",
    url: "https://www.spacenk.com/uk/promotions/gifts-with-purchase.html?affil=blushmap",
    concern: "luxury skincare",
  },
  {
    id: 5, brand: "SEPHORA UK",
    title: "Korean beauty favourites",
    desc: "COSRX, Some By Mi, Glow Recipe and more K-beauty bestsellers with free delivery over £30.",
    badge: "K-BEAUTY", badgeColor: "#059669",
    url: "https://www.sephora.co.uk/i/best-sellers-korean-beauty?affil=blushmap",
    concern: "oily, blemish-prone",
  },
  {
    id: 6, brand: "FEELUNIQUE",
    title: "SPF essentials edit",
    desc: "Sun protection for every skin tone. Mineral, tinted and invisible finishes — all SPF50+.",
    badge: "SPF50+", badgeColor: "#ea580c",
    url: "https://www.feelunique.com/c/Sun-Protection?affil=blushmap",
    concern: "daily sun protection",
  },
];

function OfferCard({ offer }: { offer: typeof OFFERS[0] }) {
  return (
    <a
      href={offer.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex flex-col rounded-2xl border overflow-hidden card-hover"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      <div className="px-5 pt-5 pb-3 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-xs font-bold tracking-widest" style={{ color: "var(--color-gold)", letterSpacing: "0.15em" }}>
            {offer.brand}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white shrink-0" style={{ background: offer.badgeColor }}>
            {offer.badge}
          </span>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500, marginBottom: "0.4rem", lineHeight: 1.25 }}>
          {offer.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{offer.desc}</p>
        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          <span style={{ color: "var(--color-rose)", fontWeight: 600 }}>✦</span> Best for: {offer.concern}
        </p>
      </div>
      <div className="px-5 pb-5">
        <div className="flex items-center gap-1.5 text-sm font-semibold transition-colors group-hover:opacity-80" style={{ color: "var(--color-rose)" }}>
          Shop now <ExternalLink size={13} />
        </div>
      </div>
    </a>
  );
}

function BestSellerStrip() {
  const { data } = useQuery({
    queryKey: ["/api/search", "bestseller-strip"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/search?bestseller=true");
      return res.json();
    },
  });
  const products = (data?.results || []).slice(0, 5);
  if (!products.length) return null;

  return (
    <div className="overflow-x-auto pb-1 scrollbar-hide -mx-6 px-6">
      <div className="flex gap-4" style={{ width: "max-content" }}>
        {products.map((p: any) => (
          <div key={p.id} className="w-52 rounded-2xl border overflow-hidden card-hover shrink-0" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
            <div className="h-28 overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(350 30% 94%), hsl(345 25% 91%))" }}>
              <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-80" loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--color-gold)" }}>{p.brand}</p>
              <p className="text-xs font-semibold leading-snug mb-2 line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>{p.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: "var(--color-rose)" }}>{p.price}</span>
                <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                  className="text-xs px-2 py-1 rounded-full text-white" style={{ background: "var(--color-rose)" }}>
                  <ShoppingBag size={10} className="inline" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  { name: "Priya M.", skin: "Combination, medium", quote: "The alternatives tab is genius — I chose organic and my skin has never been calmer.", rating: 5 },
  { name: "Sophie K.", skin: "Dry, fair", quote: "I wasted hundreds on the wrong products. BlushMap nailed my skin type in 30 seconds.", rating: 5 },
  { name: "Aisha R.", skin: "Oily, deep", quote: "Finally an app that considers deeper skin tones and actually recommends no-white-cast SPF.", rating: 5 },
];

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroLoaded(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)", background: "hsl(var(--background))" }}>

      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "rgba(255,248,250,0.92)", backdropFilter: "blur(16px)", borderColor: "hsl(var(--border))" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <BlushMapLogo size={34} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, letterSpacing: "-0.01em", color: "var(--color-black)" }}>
                BlushMap
              </span>
            </div>
          </Link>
          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
            <Link href="/search"><span className="hover:text-foreground transition-colors cursor-pointer">Products</span></Link>
            <Link href="/scanner"><span className="hover:text-foreground transition-colors cursor-pointer">Scan</span></Link>
            <Link href="/analyse"><span className="hover:text-foreground transition-colors cursor-pointer">Analyse</span></Link>
          </nav>
          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link href="/search">
              <Button size="sm" variant="ghost" className="gap-1.5 text-sm">
                <Search size={14} />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </Link>
            <Link href="/scanner">
              <Button size="sm" variant="outline" className="gap-1.5 text-sm hidden sm:flex">
                <ScanLine size={14} /> Scan
              </Button>
            </Link>
            <Link href="/analyse">
              <Button size="sm" className="gap-1.5 text-sm text-white border-0" style={{ background: "var(--color-rose)" }}>
                <Sparkles size={13} /> Analyse skin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{
        paddingTop: "9rem", paddingBottom: "7rem",
        background: "linear-gradient(170deg, #fff8f9 0%, #fde8ed 40%, #f9dde6 100%)",
      }}>
        {/* Decorative constellation bg */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }} aria-hidden="true">
          <circle cx="15%" cy="30%" r="1.5" fill="#c9506e"/>
          <circle cx="25%" cy="65%" r="1" fill="#c9506e"/>
          <circle cx="78%" cy="20%" r="2" fill="#c9506e"/>
          <circle cx="85%" cy="55%" r="1.5" fill="#c9506e"/>
          <circle cx="60%" cy="75%" r="1" fill="#c9506e"/>
          <circle cx="45%" cy="15%" r="1.5" fill="#c9506e"/>
          <line x1="15%" y1="30%" x2="25%" y2="65%" stroke="#c9506e" strokeWidth="0.5"/>
          <line x1="78%" y1="20%" x2="85%" y2="55%" stroke="#c9506e" strokeWidth="0.5"/>
          <line x1="60%" y1="75%" x2="85%" y2="55%" stroke="#c9506e" strokeWidth="0.5"/>
          <line x1="45%" y1="15%" x2="78%" y2="20%" stroke="#c9506e" strokeWidth="0.5"/>
        </svg>

        {/* Large blush blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(232,160,176,0.4) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(201,80,110,0.12) 0%, transparent 70%)" }} />

        <div className={`max-w-5xl mx-auto px-6 text-center relative transition-all duration-700 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8 border" style={{ background: "rgba(255,255,255,0.7)", borderColor: "hsl(345 40% 82%)", color: "var(--color-rose)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <BlushMapLogo size={14} /> AI skin analysis · free forever
          </div>

          <h1 className="display-hero mb-6" style={{ color: "var(--color-black)" }}>
            Your skin,<br />
            <em style={{ color: "var(--color-rose)", fontStyle: "italic" }}>finally mapped.</em>
          </h1>

          <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "hsl(0 0% 40%)", maxWidth: "50ch", margin: "0 auto 2rem", lineHeight: 1.75 }}>
            Upload a selfie and our AI reads your skin tone, type, and every face zone — then builds your personal beauty routine with budget, luxury and organic options.
          </p>

          <p className="text-xs mb-10" style={{ color: "hsl(0 0% 58%)", letterSpacing: "0.05em" }}>
            No sign-up · No subscription · Results in under 30 seconds
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link href="/analyse">
              <Button size="lg" className="gap-2 px-10 text-white border-0 shadow-lg font-semibold" style={{ background: "var(--color-rose)", boxShadow: "var(--shadow-pink)", fontSize: "1rem" }}>
                Analyse my skin <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="gap-2 px-8 font-semibold" style={{ fontSize: "1rem" }}>
                <Search size={16} /> Browse products
              </Button>
            </Link>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { value: "40+", label: "Curated products" },
              { value: "4 picks", label: "Per recommendation" },
              { value: "6 zones", label: "Face analysis" },
              { value: "Free", label: "Always" },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl border px-4 py-3 text-center" style={{ background: "rgba(255,255,255,0.75)", borderColor: "hsl(345 35% 86%)" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--color-rose)", fontWeight: 600 }}>{stat.value}</p>
                <p className="text-xs" style={{ color: "hsl(0 0% 52%)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers Strip ── */}
      <section className="py-14 px-6 border-b" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="label-eyebrow mb-1">Most loved</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>Best Sellers</h2>
            </div>
            <Link href="/search?bestseller=true">
              <Button variant="ghost" size="sm" className="gap-1.5 text-sm" style={{ color: "var(--color-rose)" }}>
                View all <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
          <BestSellerStrip />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-eyebrow mb-3">Simple by design</p>
            <h2 className="display-section">How BlushMap works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Capture your face", desc: "Upload a photo, take a selfie, or use our RGB face scan. No account needed, no data stored." },
              { num: "02", title: "AI maps your skin", desc: "Claude Vision AI analyses your tone, undertone, type, pores, and 6 face zones in seconds." },
              { num: "03", title: "Get your edit", desc: "Receive ranked product picks — each with budget, luxury, and organic alternatives tailored to you." },
            ].map((s, i) => (
              <div key={i} className="relative rounded-2xl border p-8" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <span className="absolute top-6 right-7 select-none" style={{ fontFamily: "var(--font-display)", fontSize: "3.5rem", color: "hsl(var(--border))", lineHeight: 1 }}>{s.num}</span>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "hsl(345 40% 93%)" }}>
                  <BlushMapLogo size={24} />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three price points ── */}
      <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-eyebrow mb-3">Every recommendation</p>
            <h2 className="display-section">Three price points.<br />One skin profile.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Banknote, label: "Budget",   color: "#4a9b6a", bg: "hsl(130 25% 96%)", desc: "The best under-£15 products that genuinely work — chosen by ingredient quality, not marketing spend.", example: "The Ordinary Niacinamide · £5.90" },
              { icon: Sparkles, label: "Our Pick",  color: "#c9506e", bg: "hsl(345 30% 97%)", desc: "The single best product for your exact skin profile, chosen from 40+ curated options.", example: "La Roche-Posay Anthelios · £19.50", featured: true },
              { icon: Crown,    label: "Luxury",   color: "#c9944a", bg: "hsl(36 40% 96%)",  desc: "Premium formulations worth the investment — dermatologist-favourite and clinically proven.", example: "SkinCeuticals C E Ferulic · £166" },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`rounded-2xl border p-6 relative ${item.featured ? "ring-2" : ""}`} style={{ background: item.bg, borderColor: (item as any).featured ? item.color : "hsl(var(--border))", ["--tw-ring-color" as any]: item.color }}>
                  {(item as any).featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: item.color }}>Always included</div>}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}18` }}>
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: item.color, marginBottom: "0.5rem" }}>{item.label}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.desc}</p>
                  <p className="text-xs font-medium px-3 py-2 rounded-lg" style={{ background: `${item.color}12`, color: item.color }}>e.g. {item.example}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-2xl border p-5 flex gap-4 items-center" style={{ background: "hsl(130 20% 97%)", borderColor: "hsl(130 25% 85%)" }}>
            <Leaf size={20} style={{ color: "#5a8a5a", flexShrink: 0 }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#3a6a3a" }}>Organic alternatives — always included</p>
              <p className="text-xs text-muted-foreground mt-0.5">Every recommendation comes with a certified organic or clean beauty option.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Offers & Deals ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label-eyebrow mb-2">Partner offers</p>
              <h2 className="display-section">Current deals & offers</h2>
              <p className="text-sm text-muted-foreground mt-2" style={{ maxWidth: "42ch" }}>
                Hand-picked offers from trusted retailers — matched to common skin concerns.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border" style={{ background: "hsl(345 30% 96%)", borderColor: "hsl(345 35% 85%)", color: "var(--color-rose)" }}>
              <Tag size={11} /> Affiliate links
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFFERS.map(offer => <OfferCard key={offer.id} offer={offer} />)}
          </div>
          <p className="text-xs text-muted-foreground mt-5 text-center">
            These are affiliate links — we may earn a small commission if you purchase, at no extra cost to you.
          </p>
        </div>
      </section>

      {/* ── Scan feature ── */}
      <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="label-eyebrow mb-4">Know what's in it</p>
            <h2 className="display-section mb-5">Ingredient scanner</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed" style={{ fontSize: "1.05rem" }}>
              Scan any beauty barcode. Our AI rates every ingredient, flags harmful chemicals, and gives your product a score from 0 to 100. Like Yuka — but built for beauty.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                { icon: <CheckCircle size={15} style={{ color: "#4CAF50" }} />, text: "Full ingredient breakdown with safety ratings" },
                { icon: <CheckCircle size={15} style={{ color: "#4CAF50" }} />, text: "Score 0–100 based on formulation quality" },
                { icon: <AlertTriangle size={15} style={{ color: "#FF9800" }} />, text: "Flags parabens, SLS, allergens & irritants" },
                { icon: <CheckCircle size={15} style={{ color: "#4CAF50" }} />, text: "Works on makeup, skincare, haircare & more" },
              ].map((item, i) => <li key={i} className="flex items-center gap-3 text-sm">{item.icon}{item.text}</li>)}
            </ul>
            <Link href="/scanner">
              <Button size="lg" className="gap-2 text-white border-0" style={{ background: "var(--color-rose)" }}>
                <ScanLine size={18} /> Scan a product
              </Button>
            </Link>
          </div>
          {/* Score demo */}
          <div className="flex justify-center">
            <div className="w-68 rounded-2xl border shadow-lg p-6 text-center" style={{ background: "white", borderColor: "hsl(var(--border))", maxWidth: 280 }}>
              <p className="text-xs text-muted-foreground mb-0.5">CeraVe</p>
              <p className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>Moisturising Cream</p>
              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg width="112" height="112" className="-rotate-90">
                  <circle cx="56" cy="56" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle cx="56" cy="56" r="44" fill="none" stroke="#4CAF50" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 44}`} strokeDashoffset={`${2 * Math.PI * 44 * 0.18}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: "#4CAF50" }}>82</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              <span className="text-sm font-bold" style={{ color: "#4CAF50" }}>Good</span>
              <div className="flex justify-center gap-2 mt-3">
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "hsl(120 30% 93%)", color: "#2E7D32" }}>12 good</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "hsl(38 50% 93%)", color: "#E65100" }}>2 caution</span>
              </div>
              <div className="mt-3 text-left space-y-1.5">
                {[{n:"Ceramides",r:"good"},{n:"Hyaluronic Acid",r:"good"},{n:"Parfum",r:"caution"}].map((ing,i)=>(
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {ing.r==="good"?<CheckCircle size={12} style={{color:"#4CAF50"}}/>:<AlertTriangle size={12} style={{color:"#FF9800"}}/>}
                    <span className="text-muted-foreground">{ing.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="label-eyebrow mb-3">Real results</p>
            <h2 className="display-section">What our users say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl border p-6" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} fill="var(--color-gold)" style={{ color: "var(--color-gold)" }} />)}
                </div>
                <p className="text-sm leading-relaxed mb-5 text-muted-foreground">"{t.quote}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--color-rose)" }}>{t.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.skin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section className="py-14 px-6 border-t border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <ShieldCheck size={20}/>, label: "Privacy first",    desc: "Images never stored beyond your session" },
            { icon: <Sparkles size={20}/>,   label: "Claude AI",         desc: "Powered by Anthropic's Claude Vision" },
            { icon: <Leaf size={20}/>,       label: "Organic options",   desc: "Clean beauty alternatives for every pick" },
            { icon: <Users size={20}/>,      label: "All skin tones",    desc: "Inclusive picks for every shade" },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(345 35% 93%)", color: "var(--color-rose)" }}>{t.icon}</div>
              <p className="text-sm font-semibold">{t.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 px-6 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #c9506e 0%, #e8a0b0 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.08 }}>
          <svg width="100%" height="100%">
            <circle cx="20%" cy="30%" r="2" fill="white"/>
            <circle cx="80%" cy="25%" r="1.5" fill="white"/>
            <circle cx="65%" cy="70%" r="2" fill="white"/>
            <line x1="20%" y1="30%" x2="80%" y2="25%" stroke="white" strokeWidth="0.5"/>
            <line x1="80%" y1="25%" x2="65%" y2="70%" stroke="white" strokeWidth="0.5"/>
          </svg>
        </div>
        <div className="max-w-2xl mx-auto relative">
          <BlushMapLogo size={48} />
          <div className="mx-auto w-12 mb-6" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", color: "white", lineHeight: 1.08, marginBottom: "1.2rem" }}>
            Meet your perfect routine.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "2.5rem", fontSize: "1.1rem", lineHeight: 1.75, maxWidth: "40ch", margin: "0 auto 2.5rem" }}>
            Free. No sign-up. Results in under 30 seconds — with budget, luxury and organic alternatives for every skin type.
          </p>
          <Link href="/analyse">
            <Button size="lg" variant="outline" className="font-semibold px-10 gap-2" style={{ background: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.4)", color: "white", fontSize: "1rem" }}>
              Start your analysis <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <BlushMapLogo size={22} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--color-black)" }}>BlushMap</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/search"><span className="hover:text-foreground cursor-pointer transition-colors">Products</span></Link>
            <Link href="/scanner"><span className="hover:text-foreground cursor-pointer transition-colors">Scanner</span></Link>
            <Link href="/analyse"><span className="hover:text-foreground cursor-pointer transition-colors">Analyse</span></Link>
          </div>
          <p className="text-xs text-center sm:text-right" style={{ maxWidth: "32ch" }}>
            Some links are affiliate links — we may earn a small commission at no extra cost to you. © 2026 BlushMap
          </p>
        </div>
      </footer>
    </div>
  );
}
