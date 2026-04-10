import { Link } from "wouter";
import { ArrowRight, Camera, Upload, Sparkles, ShieldCheck, Star } from "lucide-react";
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
          <Link href="/analyse">
            <Button size="sm" className="gradient-rose text-white border-0 hover:opacity-90">
              Try for free
            </Button>
          </Link>
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
