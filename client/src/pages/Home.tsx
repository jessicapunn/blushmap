import { Link } from "wouter";
import { ArrowRight, Camera, Upload, Sparkles, ShieldCheck, Star, ScanLine, CheckCircle, AlertTriangle, Leaf, Crown, Banknote, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "15+", label: "Curated products" },
  { value: "4 picks", label: "Per recommendation" },
  { value: "6 zones", label: "Analysed per face" },
  { value: "Free", label: "Always" },
];

const TESTIMONIALS = [
  {
    name: "Priya M.",
    skin: "Combination, medium",
    quote: "The alternatives tab is genius — I chose the organic option and my skin has never been calmer.",
    rating: 5,
  },
  {
    name: "Sophie K.",
    skin: "Dry, fair",
    quote: "I'd wasted hundreds on the wrong products. BlushMap nailed my skin type in 30 seconds.",
    rating: 5,
  },
  {
    name: "Aisha R.",
    skin: "Oily, deep",
    quote: "Finally an app that considers deeper skin tones and actually recommends no-white-cast SPF.",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md" style={{ background: "hsl(var(--background) / 0.92)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-label="BlushMap logo">
              <circle cx="15" cy="15" r="14" fill="hsl(340 45% 45%)" />
              <ellipse cx="15" cy="13" rx="5.5" ry="6.5" fill="none" stroke="white" strokeWidth="1.5" />
              <path d="M9.5 20 Q15 24.5 20.5 20" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="15" cy="9.5" r="1.8" fill="hsl(30 60% 80%)" />
              <circle cx="11.5" cy="11.5" r="1" fill="white" opacity="0.6" />
              <circle cx="18.5" cy="11.5" r="1" fill="white" opacity="0.6" />
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 600 }}>BlushMap</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/scanner">
              <Button size="sm" variant="outline" className="gap-1.5">
                <ScanLine size={15} /> Scan product
              </Button>
            </Link>
            <Link href="/analyse">
              <Button size="sm" className="gradient-rose text-white border-0 hover:opacity-90 gap-1.5">
                <Sparkles size={14} /> Analyse skin
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 relative overflow-hidden" style={{ background: "linear-gradient(160deg, hsl(30 25% 97%), hsl(340 25% 95%))" }}>
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "hsl(340 50% 75%)" }} />
        <div className="absolute bottom-10 left-0 w-96 h-64 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "hsl(30 60% 75%)" }} />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Editorial eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-8 border" style={{ background: "hsl(340 30% 94%)", borderColor: "hsl(340 30% 82%)", color: "hsl(340 50% 40%)" }}>
            <Sparkles size={13} />
            AI-powered · personalised · free
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.6rem, 7vw, 5rem)", lineHeight: 1.07, fontWeight: 600, marginBottom: "1.5rem" }}>
            Your skin,<br /><em style={{ color: "var(--color-rose)" }}>finally understood</em>
          </h1>

          <p className="text-muted-foreground mx-auto mb-3" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: "52ch", lineHeight: 1.7 }}>
            Upload a selfie or use your camera. Our AI analyses your skin tone, type, and every face zone — then recommends the exact products, with budget, luxury, and organic alternatives.
          </p>

          {/* Trust line */}
          <p className="text-xs text-muted-foreground mb-10">
            No sign-up · no subscription · results in under 30 seconds
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link href="/analyse">
              <Button size="lg" className="gradient-rose text-white border-0 hover:opacity-90 gap-2 px-8" data-testid="cta-start">
                Analyse my skin <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/scanner">
              <Button size="lg" variant="outline" className="gap-2 px-8">
                <ScanLine size={16} /> Scan a product
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(stat => (
              <div key={stat.label} className="rounded-2xl border p-4" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <p className="font-semibold mb-0.5" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-rose)" }}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternatives showcase */}
      <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: "var(--color-rose)", letterSpacing: "0.12em" }}>
              What makes BlushMap different
            </span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15, marginBottom: "1rem" }}>
              Every recommendation.<br />Three price points.
            </h2>
            <p className="text-muted-foreground mx-auto" style={{ maxWidth: "48ch", lineHeight: 1.7 }}>
              For every product we recommend, you get our top pick plus budget, luxury, and organic alternatives — all matched to your skin profile.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: Banknote,
                label: "Budget",
                color: "#4a9b6a",
                bg: "hsl(130 25% 95%)",
                desc: "High-quality picks under £15 that punch well above their price point.",
                example: "The Ordinary Niacinamide · £5.90",
              },
              {
                icon: Sparkles,
                label: "Our Pick",
                color: "#b5476a",
                bg: "hsl(340 25% 95%)",
                desc: "The best overall choice for your specific skin type and concerns.",
                example: "La Roche-Posay Anthelios · £19.50",
                featured: true,
              },
              {
                icon: Crown,
                label: "Luxury",
                color: "#c9944a",
                bg: "hsl(30 35% 95%)",
                desc: "Premium formulations worth the investment for visible results.",
                example: "SkinCeuticals C E Ferulic · £166",
              },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`rounded-2xl border p-6 relative ${item.featured ? "ring-2" : ""}`} style={{ background: item.bg, borderColor: item.featured ? item.color : "hsl(var(--border))", ringColor: item.color }}>
                  {item.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: item.color }}>
                      Always included
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}20` }}>
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: item.color }}>{item.label}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.desc}</p>
                  <p className="text-xs font-medium px-3 py-2 rounded-lg" style={{ background: `${item.color}10`, color: item.color }}>
                    e.g. {item.example}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Organic mention */}
          <div className="mt-5 rounded-2xl border p-5 flex items-center gap-4" style={{ background: "hsl(130 20% 96%)", borderColor: "hsl(130 25% 85%)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#5a8a5a20" }}>
              <Leaf size={18} style={{ color: "#5a8a5a" }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#3a6a3a" }}>Organic alternatives</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Every recommendation also comes with a certified organic or natural option for clean beauty enthusiasts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: "var(--color-rose)", letterSpacing: "0.12em" }}>Simple by design</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", textAlign: "center" }}>
              How it works
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: <Camera size={26} />,
                title: "Capture your face",
                desc: "Take a selfie, use our live RGB face scan, or upload an existing photo. No account needed.",
              },
              {
                num: "02",
                icon: <Sparkles size={26} />,
                title: "AI analyses your skin",
                desc: "Our AI examines tone, undertone, type, pores, pigmentation, and more — across every face zone.",
              },
              {
                num: "03",
                icon: <ShieldCheck size={26} />,
                title: "Get your picks",
                desc: "Receive ranked product recommendations with budget, luxury, and organic alternatives for each one.",
              },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col gap-4 p-8 rounded-2xl border" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <span className="text-4xl font-light absolute top-5 right-6 select-none" style={{ fontFamily: "var(--font-display)", color: "hsl(var(--border))" }}>{step.num}</span>
                <div style={{ color: "var(--color-rose)", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", background: "hsl(340 30% 93%)", borderRadius: "12px" }}>
                  {step.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600 }}>{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6" style={{ background: "hsl(var(--muted) / 0.5)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest mb-4 block" style={{ color: "var(--color-rose)", letterSpacing: "0.12em" }}>Advanced technology</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: "1.5rem", lineHeight: 1.15 }}>
                Hyper-advanced face scanning
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                {[
                  "RGB light analysis — your screen flashes colours to reveal subtle pigmentation changes invisible to normal photography",
                  "Zone-by-zone skin condition mapping across forehead, T-zone, cheeks, under-eyes, chin and nose",
                  "Detects oiliness, dryness, hyperpigmentation, scarring, pores, fine lines, and redness",
                  "Skin tone and undertone identification for perfectly matched foundation shades",
                ].map((f, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span style={{ color: "var(--color-rose)", flexShrink: 0, marginTop: 2 }}>✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/analyse">
                  <Button className="gradient-rose text-white border-0 hover:opacity-90 gap-2">
                    Try it now <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden aspect-square" style={{ background: "linear-gradient(135deg, hsl(340 30% 88%), hsl(30 40% 88%))", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <svg width="90" height="90" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="39" stroke="hsl(340 45% 45%)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <ellipse cx="40" cy="35" rx="14" ry="16" fill="none" stroke="hsl(340 45% 45%)" strokeWidth="1.5" />
                  <path d="M26 55 Q40 65 54 55" stroke="hsl(340 45% 45%)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <circle cx="34" cy="30" r="2" fill="hsl(340 45% 45%)" />
                  <circle cx="46" cy="30" r="2" fill="hsl(340 45% 45%)" />
                  <path d="M10 40 H18 M62 40 H70" stroke="hsl(30 60% 55%)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20 15 L25 22 M60 15 L55 22" stroke="hsl(200 60% 55%)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20 65 L25 58 M60 65 L55 58" stroke="hsl(120 45% 45%)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "hsl(340 40% 40%)", textAlign: "center", maxWidth: "18ch" }}>RGB scan in action</p>
                {/* Zone indicators */}
                <div className="flex gap-2 flex-wrap justify-center px-4">
                  {["Forehead", "T-Zone", "Cheeks", "Under-eyes", "Chin"].map(z => (
                    <span key={z} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(181,71,106,0.12)", color: "hsl(340 50% 40%)" }}>{z}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: "var(--color-rose)", letterSpacing: "0.12em" }}>Real results</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
              What our users say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl border p-6" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="var(--color-gold)" style={{ color: "var(--color-gold)" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 text-muted-foreground">"{t.quote}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: "var(--color-rose)" }}>
                    {t.name[0]}
                  </div>
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

      {/* Preference filters showcase */}
      <section className="py-20 px-6" style={{ background: "hsl(var(--muted) / 0.4)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: "var(--color-rose)", letterSpacing: "0.12em" }}>Your preferences, your rules</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: "1rem" }}>
            You decide what matters
          </h2>
          <p className="text-muted-foreground mb-10 mx-auto" style={{ maxWidth: "44ch" }}>Filter recommendations by what's important to you.</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {["Organic", "Cruelty-free", "Vegan", "Korean beauty", "SPF included", "Fragrance-free", "Budget-friendly", "Luxury", "No white cast", "Anti-aging", "Sensitive skin", "Clean beauty"].map(tag => (
              <span key={tag} className="px-4 py-2 rounded-full text-sm border transition-colors cursor-default" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredient Scanner section */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(160deg, hsl(340 25% 96%), hsl(30 25% 97%))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-5 border" style={{ background: "hsl(340 30% 94%)", borderColor: "hsl(340 30% 82%)", color: "hsl(340 50% 40%)" }}>
                <ScanLine size={12} /> Ingredient scanner
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.15, marginBottom: "1rem" }}>
                Know exactly what's in your products
              </h2>
              <p className="text-muted-foreground mb-6" style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
                Scan any beauty or skincare barcode. Our AI analyses every ingredient, flags harmful chemicals, and scores your product out of 100.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { icon: <CheckCircle size={16} style={{ color: "#4CAF50" }} />, text: "Instant ingredient breakdown with safety ratings" },
                  { icon: <CheckCircle size={16} style={{ color: "#4CAF50" }} />, text: "Score from 0–100 based on ingredient quality" },
                  { icon: <AlertTriangle size={16} style={{ color: "#FF9800" }} />, text: "Flags parabens, SLS, allergens & irritants" },
                  { icon: <CheckCircle size={16} style={{ color: "#4CAF50" }} />, text: "Works on makeup, skincare, haircare & more" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {item.icon} <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/scanner">
                <Button size="lg" className="gradient-rose text-white border-0 hover:opacity-90 gap-2">
                  <ScanLine size={18} /> Scan a product
                </Button>
              </Link>
            </div>
            {/* Score demo card */}
            <div className="flex justify-center">
              <div className="w-72 rounded-2xl border shadow-lg p-6 text-center" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <p className="text-xs text-muted-foreground mb-1">CeraVe</p>
                <p className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Moisturising Cream</p>
                <div className="relative w-28 h-28 mx-auto mb-3">
                  <svg width="112" height="112" className="-rotate-90">
                    <circle cx="56" cy="56" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle cx="56" cy="56" r="44" fill="none" stroke="#4CAF50" strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      strokeDashoffset={`${2 * Math.PI * 44 * (1 - 0.82)}`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color: "#4CAF50" }}>82</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <span className="text-sm font-semibold" style={{ color: "#4CAF50" }}>Good</span>
                <div className="flex justify-center gap-2 mt-4">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: "hsl(120 30% 93%)", color: "#2E7D32" }}>12 good</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: "hsl(38 50% 93%)", color: "#E65100" }}>2 caution</span>
                </div>
                <div className="mt-4 text-left space-y-1.5">
                  {[{n:"Ceramides",r:"good"},{n:"Hyaluronic Acid",r:"good"},{n:"Parfum",r:"caution"}].map((ing,i)=>(
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {ing.r==="good" ? <CheckCircle size={12} style={{color:"#4CAF50"}} /> : <AlertTriangle size={12} style={{color:"#FF9800"}} />}
                      <span className="text-muted-foreground">{ing.n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-14 px-6 border-t border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <ShieldCheck size={22} />, label: "Privacy first", desc: "Images never stored beyond your session" },
              { icon: <Sparkles size={22} />, label: "Claude AI", desc: "Powered by Anthropic's Claude Vision" },
              { icon: <Leaf size={22} />, label: "Organic options", desc: "Clean beauty alternatives for every pick" },
              { icon: <Users size={22} />, label: "All skin tones", desc: "Inclusive recommendations for every shade" },
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(340 25% 94%)", color: "var(--color-rose)" }}>
                  {t.icon}
                </div>
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="py-24 px-6 text-center gradient-rose text-white">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest mb-4 block opacity-80" style={{ letterSpacing: "0.12em" }}>
            Start now
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.2rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
            Meet your perfect routine
          </h2>
          <p style={{ opacity: 0.85, marginBottom: "2.5rem", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "42ch", margin: "0 auto 2.5rem" }}>
            Free. No sign-up required. Results in under 30 seconds — with budget, luxury, and organic alternatives for every skin type.
          </p>
          <Link href="/analyse">
            <Button size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20 gap-2 px-10">
              Start your skin analysis <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" fill="hsl(340 45% 45%)" />
              <ellipse cx="14" cy="12" rx="5" ry="6" fill="none" stroke="white" strokeWidth="1.5" />
              <path d="M9 18 Q14 22 19 18" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            <span>© 2026 BlushMap</span>
          </div>
          <p className="text-xs text-center">Some product links are affiliate links — we may earn a commission at no extra cost to you.</p>
        </div>
      </footer>
    </div>
  );
}
