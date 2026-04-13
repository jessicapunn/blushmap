import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import {
  ScanLine, Sparkles, Star, CheckCircle, AlertTriangle, Leaf,
  Crown, Banknote, ExternalLink, ShoppingBag, Tag, Mail, X, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { NavBar } from "@/components/NavBar";
import { BlushMapLogoInline } from "@/components/BlushMapLogo";


// ── Email signup modal ────────────────────────────────────────────────────────
function EmailSignupModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [email, setEmail] = useState("");
  const [name, setName]   = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const CONCERN_OPTIONS = [
    "Acne & Blemishes", "Dryness", "Oiliness", "Sensitivity",
    "Hyperpigmentation", "Anti-ageing", "Dullness", "Redness",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, skinConcerns: concerns.join(", ") }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setStep("success");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl" style={{ background: "#fff8f9", border: "1px solid #f0ccd6" }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>

        {step === "success" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "linear-gradient(135deg, #f9d0dc, #e8a0b0)" }}>
              <Star size={28} style={{ color: "#c9506e" }} />
            </div>
            <h3 className="text-2xl mb-2" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>You&apos;re on the list</h3>
            <p className="text-sm" style={{ color: "#9b6674" }}>Curated offers and personalised picks, straight to your inbox.</p>
            <button onClick={onClose} className="mt-6 w-full py-3 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90" style={{ background: "var(--color-rose)" }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <BlushMapLogoInline size={44} />
              <h3 className="text-2xl mt-3 mb-1" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>Stay in the glow</h3>
              <p className="text-sm" style={{ color: "#9b6674" }}>Personalised picks, exclusive deals and scan results — delivered.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text" placeholder="First name (optional)" value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "#fff", border: "1.5px solid #f0ccd6", color: "#1a0a0e" }}
              />
              <input
                type="email" placeholder="Your email address" value={email} required
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "#fff", border: "1.5px solid #f0ccd6", color: "#1a0a0e" }}
              />
              <div>
                <p className="text-xs mb-2 font-medium" style={{ color: "#9b6674" }}>Skin concerns (optional)</p>
                <div className="flex flex-wrap gap-2">
                  {CONCERN_OPTIONS.map(c => (
                    <button
                      key={c} type="button"
                      onClick={() => setConcerns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        background: concerns.includes(c) ? "var(--color-rose)" : "#fff",
                        color:      concerns.includes(c) ? "#fff" : "#9b6674",
                        border:     `1.5px solid ${concerns.includes(c) ? "var(--color-rose)" : "#f0ccd6"}`,
                      }}
                    >{c}</button>
                  ))}
                </div>
              </div>
              {error && <p className="text-xs" style={{ color: "#c9506e" }}>{error}</p>}
              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={15} />}
                {loading ? "Signing you up…" : "Join the BlushMap edit"}
              </button>
              <p className="text-xs text-center" style={{ color: "#c0a0a8" }}>No spam. Unsubscribe anytime.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── Offers ────────────────────────────────────────────────────────────────────
const OFFERS = [
  { id: 1, brand: "LOOKFANTASTIC", title: "Up to 30% off skincare", badge: "30% OFF", badgeColor: "#c9506e", url: "https://www.lookfantastic.com/sale.list?affil=blushmap", concern: "all skin types" },
  { id: 2, brand: "CULT BEAUTY",   title: "New In: Vitamin C Edits",  badge: "NEW IN",  badgeColor: "#7c3aed", url: "https://www.cultbeauty.co.uk/vitamin-c.list?affil=blushmap", concern: "hyperpigmentation & dullness" },
  { id: 3, brand: "BOOTS",         title: "3 for 2 on skincare",      badge: "3 FOR 2", badgeColor: "#2563eb", url: "https://www.boots.com/offers/skincare?affil=blushmap", concern: "budget-conscious" },
  { id: 4, brand: "SPACE NK",      title: "Luxury beauty event",      badge: "POINTS",  badgeColor: "#c9944a", url: "https://www.spacenk.com/uk/promotions/gifts-with-purchase.html?affil=blushmap", concern: "luxury skincare" },
  { id: 5, brand: "SEPHORA UK",    title: "K-beauty favourites",      badge: "K-BEAUTY",badgeColor: "#059669", url: "https://www.sephora.co.uk/i/best-sellers-korean-beauty?affil=blushmap", concern: "oily & blemish-prone" },
  { id: 6, brand: "FEELUNIQUE",    title: "SPF essentials edit",      badge: "SPF50+",  badgeColor: "#ea580c", url: "https://www.feelunique.com/c/Sun-Protection?affil=blushmap", concern: "daily sun protection" },
];

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
          <div key={p.id} className="w-48 rounded-2xl border overflow-hidden card-hover shrink-0" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
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
  const [showSignup, setShowSignup] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroLoaded(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)", background: "hsl(var(--background))" }}>
      <NavBar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{
        paddingTop: "5rem", paddingBottom: "6rem",
        background: "linear-gradient(170deg, #fff8f9 0%, #fde8ed 40%, #f9dde6 100%)",
      }}>
        {/* Constellation bg */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }} aria-hidden="true">
          <circle cx="15%" cy="30%" r="1.5" fill="#c9506e"/>
          <circle cx="25%" cy="65%" r="1" fill="#c9506e"/>
          <circle cx="78%" cy="20%" r="2" fill="#c9506e"/>
          <circle cx="85%" cy="55%" r="1.5" fill="#c9506e"/>
          <circle cx="45%" cy="15%" r="1.5" fill="#c9506e"/>
          <line x1="15%" y1="30%" x2="25%" y2="65%" stroke="#c9506e" strokeWidth="0.5"/>
          <line x1="78%" y1="20%" x2="85%" y2="55%" stroke="#c9506e" strokeWidth="0.5"/>
          <line x1="45%" y1="15%" x2="78%" y2="20%" stroke="#c9506e" strokeWidth="0.5"/>
        </svg>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(232,160,176,0.4) 0%, transparent 70%)" }} />

        <div className={`max-w-4xl mx-auto px-6 text-center relative transition-all duration-700 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-7 border" style={{ background: "rgba(255,255,255,0.7)", borderColor: "hsl(345 40% 82%)", color: "var(--color-rose)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <BlushMapLogoInline size={13} /> AI skin analysis · free forever
          </div>

          <h1 className="display-hero mb-5" style={{ color: "var(--color-black)" }}>
            Your skin,<br />
            <em style={{ color: "var(--color-rose)", fontStyle: "italic" }}>finally mapped.</em>
          </h1>

          <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "hsl(0 0% 42%)", maxWidth: "42ch", margin: "0 auto 1.75rem", lineHeight: 1.7 }}>
            One selfie. AI reads your tone, type and every face zone — then builds your personal routine.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 flex-wrap">
            <Link href="/analyse">
              <Button size="lg" className="gap-2 px-10 text-white border-0 shadow-lg font-semibold" style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)", fontSize: "1rem" }}>
                <Sparkles size={17} /> Analyse my skin
              </Button>
            </Link>
            <Link href="/scanner">
              <Button size="lg" variant="outline" className="gap-2 px-8 font-semibold" style={{ fontSize: "1rem", borderColor: "var(--color-rose)", color: "var(--color-rose)" }}>
                <ScanLine size={16} /> Scan a product
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {[
              { v: "40+", l: "curated products" },
              { v: "6", l: "face zones analysed" },
              { v: "3", l: "price points per rec" },
              { v: "Free", l: "always" },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", color: "var(--color-rose)", fontWeight: 600, lineHeight: 1 }}>{s.v}</p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(0 0% 55%)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="py-14 px-6 border-b" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="label-eyebrow mb-1">Most loved</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem" }}>Best Sellers</h2>
            </div>
            <Link href="/search?bestseller=true">
              <span className="text-sm font-semibold" style={{ color: "var(--color-rose)" }}>View all →</span>
            </Link>
          </div>
          <BestSellerStrip />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="label-eyebrow mb-2">Three steps</p>
            <h2 className="display-section">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: "01", title: "Capture", desc: "Upload a selfie or use our live RGB face scan. No account required." },
              { num: "02", title: "Analyse", desc: "Claude Vision AI maps your tone, type, undertone and 6 face zones." },
              { num: "03", title: "Shop", desc: "Get ranked picks — budget, luxury and organic — with direct purchase links." },
            ].map((s) => (
              <div key={s.num} className="relative rounded-2xl border p-7" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <span className="absolute top-5 right-6 select-none" style={{ fontFamily: "var(--font-display)", fontSize: "3rem", color: "hsl(var(--border))", lineHeight: 1 }}>{s.num}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 600, marginBottom: "0.4rem" }}>{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Price points ── */}
      <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="label-eyebrow mb-2">Every recommendation</p>
            <h2 className="display-section">Three picks. One profile.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Banknote, label: "Budget",   color: "#4a9b6a", bg: "hsl(130 25% 96%)", ex: "The Ordinary Niacinamide · £5.90" },
              { icon: Sparkles, label: "Our Pick",  color: "#c9506e", bg: "hsl(345 30% 97%)", ex: "La Roche-Posay Anthelios · £19.50", featured: true },
              { icon: Crown,    label: "Luxury",   color: "#c9944a", bg: "hsl(36 40% 96%)",  ex: "SkinCeuticals C E Ferulic · £166" },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`rounded-2xl border p-5 relative ${(item as any).featured ? "ring-2" : ""}`} style={{ background: item.bg, borderColor: (item as any).featured ? item.color : "hsl(var(--border))", ["--tw-ring-color" as any]: item.color }}>
                  {(item as any).featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: item.color }}>Always included</div>}
                  <Icon size={18} style={{ color: item.color, marginBottom: "0.75rem" }} />
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: item.color, marginBottom: "0.4rem" }}>{item.label}</h3>
                  <p className="text-xs font-medium px-3 py-2 rounded-lg mt-3" style={{ background: `${item.color}12`, color: item.color }}>e.g. {item.ex}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-2xl border p-4 flex gap-3 items-center" style={{ background: "hsl(130 20% 97%)", borderColor: "hsl(130 25% 85%)" }}>
            <Leaf size={18} style={{ color: "#5a8a5a", flexShrink: 0 }} />
            <p className="text-sm" style={{ color: "#3a6a3a" }}>
              <span className="font-semibold">Organic options always included</span>
              <span className="text-xs text-muted-foreground ml-2">— certified clean beauty for every recommendation.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Ingredient Scanner ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="label-eyebrow mb-3">Know what's in it</p>
            <h2 className="display-section mb-4">Ingredient scanner</h2>
            <p className="text-muted-foreground mb-5 leading-relaxed">
              Scan any beauty barcode. Scores 0–100 based on ingredient quality. Flags harmful chemicals. Like Yuka — built for beauty.
            </p>
            <ul className="space-y-2.5 mb-7">
              {[
                { icon: <CheckCircle size={14} style={{ color: "#4CAF50" }} />, text: "Full ingredient breakdown" },
                { icon: <CheckCircle size={14} style={{ color: "#4CAF50" }} />, text: "Safety score 0–100" },
                { icon: <AlertTriangle size={14} style={{ color: "#FF9800" }} />, text: "Flags parabens, SLS & allergens" },
                { icon: <CheckCircle size={14} style={{ color: "#4CAF50" }} />, text: "Works on skincare, makeup & food" },
              ].map((item, i) => <li key={i} className="flex items-center gap-3 text-sm">{item.icon}{item.text}</li>)}
            </ul>
            <Link href="/scanner">
              <Button size="lg" className="gap-2 text-white border-0" style={{ background: "var(--color-rose)" }}>
                <ScanLine size={17} /> Scan a product
              </Button>
            </Link>
          </div>
          {/* Score demo */}
          <div className="flex justify-center">
            <div className="rounded-2xl border shadow-md p-6 text-center" style={{ background: "white", borderColor: "hsl(var(--border))", maxWidth: 260, width: "100%" }}>
              <p className="text-xs text-muted-foreground mb-0.5">CeraVe</p>
              <p className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}>Moisturising Cream</p>
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

      {/* ── Current Offers ── */}
      <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="label-eyebrow mb-2">Partner offers</p>
              <h2 className="display-section">Current deals</h2>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border" style={{ background: "hsl(345 30% 96%)", borderColor: "hsl(345 35% 85%)", color: "var(--color-rose)" }}>
              <Tag size={11} /> Affiliate links
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFFERS.map(offer => (
              <a key={offer.id} href={offer.url} target="_blank" rel="noopener noreferrer sponsored"
                className="group rounded-2xl border p-5 flex flex-col gap-3 card-hover"
                style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold tracking-widest" style={{ color: "var(--color-gold)", letterSpacing: "0.14em" }}>{offer.brand}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white shrink-0" style={{ background: offer.badgeColor }}>{offer.badge}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, lineHeight: 1.25 }}>{offer.title}</h3>
                <p className="text-xs text-muted-foreground mt-auto">Best for: {offer.concern}</p>
                <div className="flex items-center gap-1 text-sm font-semibold group-hover:opacity-80 transition-opacity" style={{ color: "var(--color-rose)" }}>
                  Shop now <ExternalLink size={12} />
                </div>
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">Affiliate links — we earn a small commission if you purchase, at no extra cost to you.</p>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="label-eyebrow mb-2">Real results</p>
            <h2 className="display-section">What users say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl border p-6" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={12} fill="var(--color-gold)" style={{ color: "var(--color-gold)" }} />)}
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

      {/* ── Final CTA ── */}
      <section className="py-24 px-6 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #c9506e 0%, #e8a0b0 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.07 }}>
          <svg width="100%" height="100%">
            <circle cx="20%" cy="30%" r="2" fill="white"/>
            <circle cx="80%" cy="25%" r="1.5" fill="white"/>
            <circle cx="65%" cy="70%" r="2" fill="white"/>
            <line x1="20%" y1="30%" x2="80%" y2="25%" stroke="white" strokeWidth="0.5"/>
            <line x1="80%" y1="25%" x2="65%" y2="70%" stroke="white" strokeWidth="0.5"/>
          </svg>
        </div>
        <div className="max-w-xl mx-auto relative">
          <BlushMapLogoInline size={44} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.4rem)", color: "white", lineHeight: 1.1, marginTop: "1.25rem", marginBottom: "1rem" }}>
            Meet your perfect routine.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.82)", marginBottom: "2.25rem", fontSize: "1rem", lineHeight: 1.7 }}>
            Scan. Analyse. Shop — free, forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/analyse">
              <Button size="lg" className="font-semibold px-10 gap-2" style={{ background: "white", color: "var(--color-rose)", fontSize: "1rem" }}>
                <Sparkles size={17} /> Analyse my skin
              </Button>
            </Link>
            <button onClick={() => setShowSignup(true)} className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.35)", color: "white", fontSize: "1rem" }}>
              <Mail size={15} /> Join for free offers
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <BlushMapLogoInline size={22} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--color-black)" }}>BlushMap</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/scanner"><span className="hover:text-foreground cursor-pointer transition-colors font-semibold" style={{ color: "var(--color-rose)" }}>Scan</span></Link>
            <Link href="/analyse"><span className="hover:text-foreground cursor-pointer transition-colors">Analyse</span></Link>
            <Link href="/search"><span className="hover:text-foreground cursor-pointer transition-colors">Products</span></Link>
            <Link href="/try-on"><span className="hover:text-foreground cursor-pointer transition-colors">Try-On</span></Link>
            <button onClick={() => setShowSignup(true)} className="hover:text-foreground transition-colors" style={{ color: "var(--color-rose)", fontWeight: 500 }}>Join</button>
          </div>
          <p className="text-xs text-center sm:text-right" style={{ maxWidth: "30ch" }}>
            Affiliate links may earn us a commission. © 2026 BlushMap
          </p>
        </div>
      </footer>

      {showSignup && <EmailSignupModal onClose={() => setShowSignup(false)} />}
    </div>
  );
}
