import { NavBar } from "@/components/NavBar";
import { Link } from "wouter";
import { Sparkles, ScanLine, ShoppingBag, Brain, Microscope, Star, Mail, Shield } from "lucide-react";

const steps = [
  {
    icon: ScanLine,
    step: "01",
    title: "Scan your face",
    body: "Upload a clear photo or use your camera. Our AI analyses over 40 facial landmarks and skin zones to build a clinical-grade profile of your skin.",
    accent: "#c9506e",
  },
  {
    icon: Brain,
    step: "02",
    title: "Get clinical analysis",
    body: "Claude Vision AI processes texture, tone, hydration markers, pigmentation patterns and sensitivity indicators — the same dimensions a dermatologist would assess.",
    accent: "#c9a96e",
  },
  {
    icon: ShoppingBag,
    step: "03",
    title: "Shop your personalised routine",
    body: "Receive a curated product routine ranked by ingredient compatibility with your specific skin profile, with price comparisons across leading UK retailers.",
    accent: "#c9506e",
  },
];

const techPillars = [
  {
    icon: Brain,
    title: "Claude Vision AI",
    body: "We use Anthropic's Claude Vision model to perform multi-dimensional facial analysis, identifying skin type, concerns, undertones and condition markers from a single photograph.",
  },
  {
    icon: Microscope,
    title: "Ingredient Scoring",
    body: "Every product in our database is scored against your skin profile. Active ingredients, potential irritants and synergistic combinations are all factored into our compatibility score.",
  },
  {
    icon: Star,
    title: "Continuous Learning",
    body: "As more users interact with BlushMap, our recommendation models refine ingredient-to-skin-type correlations — making every recommendation more precise over time.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <NavBar />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #fff0f4 0%, #fff9f5 50%, #fdf5ff 100%)",
          borderBottom: "1px solid #f0ccd6",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#c9506e", letterSpacing: "0.18em" }}
          >
            Our Story
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 6vw, 4.4rem)",
              color: "#1a0a0e",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            About BlushMap
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              color: "#c9506e",
              marginBottom: "1.25rem",
              fontStyle: "italic",
            }}
          >
            Where clinical science meets beauty
          </p>
          <p
            className="text-base leading-relaxed mx-auto"
            style={{ color: "#5a3a42", maxWidth: "56ch" }}
          >
            BlushMap is a UK-based AI skin analysis platform that puts dermatologist-grade insight into everyone's hands — no appointment needed, no guesswork.
          </p>
        </div>

        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(232,160,176,0.18) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(201,169,110,0.14) 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">

        {/* Mission */}
        <section>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#c9506e", letterSpacing: "0.16em" }}
          >
            Our Mission
          </p>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  color: "#1a0a0e",
                  lineHeight: 1.1,
                  marginBottom: "1rem",
                }}
              >
                Dermatologist-grade skincare, democratised
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#5a3a42" }}>
                A personalised skincare consultation from a dermatologist typically costs £150–£300 — and can take weeks to book. BlushMap exists to close that gap. Using AI-powered face analysis, we provide every user with a clinically-informed skin profile and a product routine matched precisely to their skin's needs.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#5a3a42" }}>
                We believe that understanding your skin shouldn't be a privilege. Whether you're managing acne, navigating hyperpigmentation or simply building a first routine, BlushMap gives you the foundation of knowledge to make genuinely good decisions about your skin.
              </p>
            </div>
            <div
              className="rounded-3xl p-8"
              style={{ background: "linear-gradient(135deg, #fff0f4, #fff8f0)", border: "1px solid #f0ccd6" }}
            >
              <div className="space-y-5">
                {[
                  { label: "AI-Powered Analysis", value: "40+ skin markers assessed per scan" },
                  { label: "Product Database", value: "Thousands of UK-stocked products scored" },
                  { label: "Skin Types Covered", value: "Dry, oily, combination, sensitive, mature & more" },
                  { label: "Retailers Compared", value: "LOOKFANTASTIC, Boots, Cult Beauty, Space NK & more" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#c9506e" }}>
                      {item.label}
                    </span>
                    <span className="text-sm" style={{ color: "#1a0a0e" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#c9506e", letterSpacing: "0.16em" }}
            >
              How It Works
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                color: "#1a0a0e",
                lineHeight: 1.1,
              }}
            >
              Three steps to your perfect routine
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(({ icon: Icon, step, title, body, accent }) => (
              <div
                key={step}
                className="rounded-3xl p-7 relative overflow-hidden"
                style={{ background: "white", border: "1px solid #f0ccd6" }}
              >
                <span
                  className="absolute top-5 right-6 text-6xl font-bold pointer-events-none select-none"
                  style={{ color: "#f0ccd6", fontFamily: "var(--font-display)", lineHeight: 1 }}
                >
                  {step}
                </span>
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${accent}18`, color: accent }}
                >
                  <Icon size={20} />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a3a42" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology */}
        <section>
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#c9a96e", letterSpacing: "0.16em" }}
            >
              The Technology
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                color: "#1a0a0e",
                lineHeight: 1.1,
              }}
            >
              Built on world-class AI
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {techPillars.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-3xl p-7"
                style={{ background: "linear-gradient(135deg, #fff9ee, #fff0f4)", border: "1px solid #f0ccd6" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "#c9a96e20", color: "#c9a96e" }}
                >
                  <Icon size={18} />
                </div>
                <h3
                  className="text-base font-semibold mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a3a42" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Affiliate Disclosure */}
        <section>
          <div
            className="rounded-3xl p-8"
            style={{ background: "linear-gradient(135deg, #fff8f0, #fff0f4)", border: "1.5px solid #e8d5b7" }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "#c9a96e20", color: "#c9a96e" }}
              >
                <Shield size={18} />
              </div>
              <div>
                <h3
                  className="text-base font-semibold mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}
                >
                  Affiliate Disclosure
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a3a42" }}>
                  We earn a small commission on purchases made via our links at no extra cost to you. This never influences our recommendations — we only feature products our AI analysis genuinely recommends for your specific skin profile. Our product scoring is entirely algorithm-driven and independent of any commercial relationship.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: "#5a3a42" }}>
                  BlushMap participates in the Awin affiliate network (Publisher ID: 2854395). When you click a product link and make a purchase, we may receive a small referral fee from the retailer. This supports the development of BlushMap and keeps the service free to use.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#c9506e", letterSpacing: "0.16em" }}
          >
            Get in Touch
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              color: "#1a0a0e",
              marginBottom: "1rem",
            }}
          >
            We'd love to hear from you
          </h2>
          <p className="text-sm mb-6" style={{ color: "#5a3a42" }}>
            Questions, feedback or partnership enquiries — reach us directly.
          </p>
          <a
            href="mailto:contactus@blushmap.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}
          >
            <Mail size={15} />
            contactus@blushmap.com
          </a>
        </section>

        {/* Legal links */}
        <footer style={{ borderTop: "1px solid #f0ccd6", paddingTop: "2rem" }}>
          <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: "#9b6674" }}>
            <Link href="/privacy">
              <span className="hover:underline cursor-pointer" style={{ color: "#c9506e" }}>
                Privacy Policy
              </span>
            </Link>
            <span style={{ color: "#f0ccd6" }}>·</span>
            <Link href="/terms">
              <span className="hover:underline cursor-pointer" style={{ color: "#c9506e" }}>
                Terms &amp; Conditions
              </span>
            </Link>
            <span style={{ color: "#f0ccd6" }}>·</span>
            <Link href="/">
              <span className="hover:underline cursor-pointer" style={{ color: "#c9506e" }}>
                Home
              </span>
            </Link>
          </div>
          <p className="text-center text-[11px] mt-4" style={{ color: "#c9b0b8" }}>
            © {new Date().getFullYear()} BlushMap · blushmap.com · contactus@blushmap.com
          </p>
        </footer>
      </div>
    </div>
  );
}
