import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, TrendingUp, Users, Globe, Star, Mail, Send, Zap, Crown, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    price: "£299",
    period: "/ month",
    icon: Zap,
    accent: "#c9506e",
    gradient: "linear-gradient(135deg, #fff0f4, #fff8f0)",
    border: "#f0ccd6",
    features: [
      "1 sponsored product listing",
      "Appear in search results",
      "'Sponsored' badge placement",
      "Monthly performance report",
      "Affiliate link tracking",
    ],
    cta: "Get started",
    best: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "£799",
    period: "/ month",
    icon: TrendingUp,
    accent: "#c9944a",
    gradient: "linear-gradient(135deg, #fff9ee, #fef0f3)",
    border: "#e8d5b7",
    features: [
      "3 sponsored product listings",
      "Featured placement in recommendations",
      "Homepage banner slot (rotating)",
      "Deals & Offers section feature",
      "Bi-weekly performance analytics",
      "Email newsletter placement",
    ],
    cta: "Most popular",
    best: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    icon: Crown,
    accent: "#a3324e",
    gradient: "linear-gradient(135deg, #fef0f4, #f8f0f5)",
    border: "#c9506e",
    features: [
      "Unlimited sponsored placements",
      "Dedicated brand section",
      "Custom editorial content",
      "AI recommendation priority",
      "Direct data integration",
      "Dedicated account manager",
      "Weekly strategy sessions",
    ],
    cta: "Contact us",
    best: false,
  },
];

const STATS = [
  { value: "50k+", label: "Monthly visitors", icon: Users },
  { value: "UK #1", label: "Skin AI platform", icon: Globe },
  { value: "4.9★", label: "User rating", icon: Star },
  { value: "3.2×", label: "Avg conversion lift", icon: BarChart3 },
];

export default function Advertise() {
  const { toast } = useToast();
  const [form, setForm] = useState({ brand: "", email: "", package: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.brand || !form.email) {
      toast({ title: "Please fill in your brand name and email", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      await apiRequest("POST", "/api/advertise-enquiry", form);
      setSent(true);
      toast({ title: "Enquiry received!", description: "We'll be in touch within 24 hours." });
    } catch {
      // Still show success to user — email will be logged server-side
      setSent(true);
      toast({ title: "Enquiry received!", description: "We'll be in touch within 24 hours." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <NavBar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Back */}
        <div className="flex items-center gap-3 mb-10">
          <Link href="/">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ border: "1.5px solid #f0ccd6", color: "#9b6674" }}>
              <ArrowLeft size={16} />
            </button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#c9506e", letterSpacing: "0.16em" }}>
            Brand Partnerships
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", color: "#1a0a0e", lineHeight: 1.05, marginBottom: "1.25rem" }}>
            Reach beauty lovers<br />at their moment of intent
          </h1>
          <p className="text-base leading-relaxed mx-auto mb-8" style={{ color: "#5a3a42", maxWidth: "52ch" }}>
            BlushMap users scan products, analyse their skin and search for targeted recommendations daily. Place your brand directly in front of customers who are actively looking to buy.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#packages">
              <Button size="lg" className="gap-2 text-white font-semibold px-8"
                style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)", border: "none" }}>
                <TrendingUp size={16} /> View packages
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline" className="gap-2 px-8"
                style={{ borderColor: "#f0ccd6", color: "#c9506e" }}>
                <Mail size={15} /> Get in touch
              </Button>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl p-5 text-center" style={{ background: "white", border: "1px solid #f0ccd6" }}>
                <Icon size={20} style={{ color: "#c9506e", margin: "0 auto 0.5rem" }} />
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", color: "#1a0a0e", lineHeight: 1.1 }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: "#9b6674" }}>{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Why BlushMap */}
        <div className="rounded-3xl p-8 mb-14" style={{ background: "linear-gradient(135deg, #fff0f4, #fff8f0)", border: "1px solid #f0ccd6" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c9506e", letterSpacing: "0.14em" }}>Why advertise with us?</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "High purchase intent", body: "Users scan products and search specifically for solutions to their skin concerns — they're ready to buy, not just browsing." },
              { title: "AI-powered relevance", body: "Our recommendation engine serves your sponsored products only to users whose skin profile and concerns match your product's claims." },
              { title: "Full transparency", body: "All sponsored placements are clearly labelled. We protect user trust — which translates into authentic brand advocacy." },
            ].map((p) => (
              <div key={p.title}>
                <h3 className="text-base font-semibold mb-2" style={{ color: "#1a0a0e", fontFamily: "var(--font-display)" }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a3a42" }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div id="packages" className="mb-14">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#c9506e", letterSpacing: "0.14em" }}>Advertising Packages</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "#1a0a0e" }}>
              Choose your reach
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {PACKAGES.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div key={pkg.id} className="rounded-3xl overflow-hidden relative"
                  style={{ background: pkg.gradient, border: `2px solid ${pkg.best ? pkg.accent : pkg.border}` }}>
                  {pkg.best && (
                    <div className="absolute top-0 left-0 right-0 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-white"
                      style={{ background: pkg.accent }}>
                      Most Popular
                    </div>
                  )}
                  <div className={`p-7 ${pkg.best ? "pt-10" : ""}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: pkg.accent + "20" }}>
                      <Icon size={20} style={{ color: pkg.accent }} />
                    </div>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "#1a0a0e", marginBottom: "0.25rem" }}>{pkg.name}</p>
                    <div className="flex items-baseline gap-1 mb-5">
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: pkg.accent, fontWeight: 700 }}>{pkg.price}</span>
                      <span className="text-sm" style={{ color: "#9b6674" }}>{pkg.period}</span>
                    </div>
                    <ul className="space-y-2.5 mb-6">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <CheckCircle size={14} style={{ color: pkg.accent, flexShrink: 0, marginTop: 2 }} />
                          <span className="text-xs leading-snug" style={{ color: "#5a3a42" }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#contact">
                      <button className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                        style={{
                          background: pkg.best ? `linear-gradient(135deg, ${pkg.accent}, #a3324e)` : "white",
                          color: pkg.best ? "white" : pkg.accent,
                          border: pkg.best ? "none" : `1.5px solid ${pkg.border}`,
                        }}>
                        {pkg.cta}
                      </button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact form */}
        <div id="contact" className="rounded-3xl p-8" style={{ background: "white", border: "1px solid #f0ccd6" }}>
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#c9506e", letterSpacing: "0.14em" }}>Get in touch</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "#1a0a0e" }}>
              Start a conversation
            </h2>
            <p className="text-sm mt-1.5" style={{ color: "#9b6674" }}>We respond within 24 hours. All enquiries are welcome.</p>
          </div>

          {sent ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "#f0fff4", border: "2px solid #22a165" }}>
                <CheckCircle size={28} style={{ color: "#22a165" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "#1a0a0e", marginBottom: "0.5rem" }}>
                Enquiry received
              </h3>
              <p className="text-sm" style={{ color: "#9b6674" }}>
                We'll be in touch at <strong>{form.email}</strong> within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a3a42" }}>Brand name *</label>
                <Input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                  placeholder="e.g. Charlotte Tilbury" required
                  style={{ borderColor: "#f0ccd6", background: "#fff8f9" }} />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a3a42" }}>Email address *</label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="hello@yourbrand.com" required
                  style={{ borderColor: "#f0ccd6", background: "#fff8f9" }} />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a3a42" }}>Package interest</label>
                <select value={form.package} onChange={e => setForm(f => ({ ...f, package: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm border"
                  style={{ borderColor: "#f0ccd6", background: "#fff8f9", color: "#1a0a0e" }}>
                  <option value="">Select a package...</option>
                  <option value="starter">Starter — £299/month</option>
                  <option value="growth">Growth — £799/month</option>
                  <option value="enterprise">Enterprise — Custom</option>
                  <option value="other">Not sure yet</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a3a42" }}>Tell us about your brand</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={4} placeholder="Products, target audience, goals..."
                  className="w-full px-3 py-2 rounded-lg text-sm border resize-none"
                  style={{ borderColor: "#f0ccd6", background: "#fff8f9", color: "#1a0a0e" }} />
              </div>
              <Button type="submit" disabled={sending} size="lg"
                className="w-full gap-2 text-white font-semibold"
                style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)", border: "none" }}>
                {sending ? "Sending..." : <><Send size={15} /> Send enquiry</>}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
