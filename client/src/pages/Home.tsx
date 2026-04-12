import { Link } from "wouter";
import { ArrowRight, Camera, Upload, Sparkles, ShieldCheck, Star, ScanLine, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md" style={{ background: "hsl(var(--background) / 0.92)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="BlushMap logo">
              <circle cx="14" cy="14" r="13" fill="hsl(340 45% 45%)" />
              <ellipse cx="14" cy="12" rx="5" ry="6" fill="none" stroke="white" strokeWidth="1.5" />
              <path d="M9 18 Q14 22 19 18" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="14" cy="9" r="1.5" fill="hsl(30 60% 80%)" />
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 600 }}>BlushMap</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/scanner">
              <Button size="sm" variant="outline" className="gap-1.5">
                <ScanLine size={15} /> Scan
              </Button>
            </Link>
            <Link href="/analyse">
              <Button size="sm" className="gradient-rose text-white border-0 hover:opacity-90">
                Analyse skin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6" style={{ background: "linear-gradient(160deg, hsl(30 25% 97%), hsl(340 25% 95%))" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-8 border" style={{ background: "hsl(340 30% 94%)", borderColor: "hsl(340 30% 82%)", color: "hsl(340 50% 40%)" }}>
            <Sparkles size={14} />
            AI-powered skin analysis · personalised just for you
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 6vw, 4.5rem)", lineHeight: 1.1, fontWeight: 600, marginBottom: "1.5rem" }}>
            Your skin, <em>finally understood</em>
          </h1>
          <p className="text-muted-foreground mx-auto mb-10" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: "52ch" }}>
            Upload a selfie or use your phone's camera. Our AI analyses your skin tone, type, and concerns — then recommends the exact products for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/analyse">
              <Button size="lg" className="gradient-rose text-white border-0 hover:opacity-90 gap-2" data-testid="cta-start">
                Analyse my skin <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", textAlign: "center", marginBottom: "3.5rem" }}>
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Camera size={28} />, title: "Capture or upload", desc: "Take a selfie with your camera, use our live RGB face scan, or upload an existing photo." },
              { icon: <Sparkles size={28} />, title: "AI analyses your face", desc: "Our AI examines skin tone, undertone, oiliness, pigmentation, scarring, pores, and more — across every face zone." },
              { icon: <ShieldCheck size={28} />, title: "Get personalised picks", desc: "Receive ranked product recommendations matched to your skin profile and preferences, with a face map showing where to apply each one." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-4 p-8 rounded-2xl border" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <div style={{ color: "var(--color-rose)", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", background: "hsl(340 30% 93%)", borderRadius: "12px" }}>
                  {step.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 600 }}>{step.title}</h3>
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
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: "1.5rem" }}>
                Hyper-advanced face scanning
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                {[
                  "RGB light analysis — like liveness detection, your screen flashes colours to reveal subtle pigmentation changes invisible to normal photography",
                  "Zone-by-zone skin condition mapping across forehead, T-zone, cheeks, under-eyes, and chin",
                  "Detects oiliness, dryness, hyperpigmentation, scarring, pores, fine lines, and redness",
                  "Skin tone and undertone identification for perfectly matched foundation shades",
                ].map((f, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span style={{ color: "var(--color-rose)", flexShrink: 0, marginTop: 2 }}>✦</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl overflow-hidden aspect-square" style={{ background: "linear-gradient(135deg, hsl(340 30% 88%), hsl(30 40% 88%))", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="39" stroke="hsl(340 45% 45%)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <ellipse cx="40" cy="35" rx="14" ry="16" fill="none" stroke="hsl(340 45% 45%)" strokeWidth="1.5" />
                  <path d="M26 55 Q40 65 54 55" stroke="hsl(340 45% 45%)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <circle cx="34" cy="30" r="2" fill="hsl(340 45% 45%)" />
                  <circle cx="46" cy="30" r="2" fill="hsl(340 45% 45%)" />
                  <path d="M10 40 H18 M62 40 H70" stroke="hsl(30 60% 55%)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20 15 L25 22 M60 15 L55 22" stroke="hsl(200 60% 55%)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20 65 L25 58 M60 65 L55 58" stroke="hsl(120 45% 45%)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "hsl(340 40% 40%)", textAlign: "center", maxWidth: "18ch" }}>RGB skin scan in action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preference filters showcase */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: "1rem" }}>
            You decide what matters
          </h2>
          <p className="text-muted-foreground mb-10 mx-auto">Filter recommendations by what matters to you.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Organic", "Cruelty-free", "Vegan", "Korean beauty", "SPF included", "Fragrance-free", "Budget-friendly", "Luxury", "No white cast", "Anti-aging"].map(tag => (
              <span key={tag} className="px-4 py-2 rounded-full text-sm border" style={{ background: "hsl(var(--accent))", borderColor: "hsl(var(--border))", color: "hsl(var(--accent-foreground))" }}>{tag}</span>
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
                <ScanLine size={12} /> New feature
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.15, marginBottom: "1rem" }}>
                Know exactly what's in your products
              </h2>
              <p className="text-muted-foreground mb-6" style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
                Scan any beauty or skincare barcode. Our AI analyses every ingredient, flags harmful chemicals, and gives your product a score out of 100 — just like Yuka.
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
                <div className="mt-4 text-left space-y-1">
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

      {/* CTA footer */}
      <section className="py-20 px-6 text-center gradient-rose text-white">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", marginBottom: "1rem" }}>
          Ready to meet your perfect routine?
        </h2>
        <p style={{ opacity: 0.85, marginBottom: "2rem", fontSize: "1.05rem" }}>Free. No sign-up required. Results in under 30 seconds.</p>
        <Link href="/analyse">
          <Button size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20 gap-2">
            Start your skin analysis <ArrowRight size={18} />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t text-sm text-muted-foreground">
        <p>© 2026 BlushMap · <span className="text-xs">Some product links are affiliate links — we may earn a commission at no extra cost to you.</span></p>
      </footer>
    </div>
  );
}
