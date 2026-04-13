import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { BlushMapLogoInline } from "@/components/BlushMapLogo";
import { NavBar } from "@/components/NavBar";
import {
  Heart, ShoppingBag, ScanLine, TrendingUp, User, LogOut,
  Camera, Clock, Sparkles, ChevronRight, Star, CheckCircle,
  Package, ExternalLink, Trash2, Tag, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = "overview" | "skin-history" | "saved" | "scans";

export default function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab]               = useState<Tab>("overview");
  const [faceScanHistory, setFSH]   = useState<any[]>([]);
  const [savedProducts, setSP]      = useState<any[]>([]);
  const [productScans, setPS]       = useState<any[]>([]);
  const [analyses, setAN]           = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);

  useEffect(() => { if (user) loadAll(); }, [user]);

  async function loadAll() {
    setLoading(true);
    try {
      const [fsh, sp, ps, an] = await Promise.all([
        fetch("/api/profile/face-scans").then(r => r.json()),
        fetch("/api/profile/saved-products").then(r => r.json()),
        fetch("/api/profile/product-scans").then(r => r.json()),
        fetch("/api/profile/analyses").then(r => r.json()),
      ]);
      setFSH(fsh.history || []);
      setSP(sp.products || []);
      setPS(ps.scans || []);
      setAN(an.analyses || []);
    } finally { setLoading(false); }
  }

  async function removeProduct(id: number) {
    await fetch(`/api/profile/saved-products/${id}`, { method: "DELETE" });
    setSP(prev => prev.filter(p => p.id !== id));
  }

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/profile/saved-products/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSP(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fff8f9" }}>
        <div className="text-center">
          <BlushMapLogoInline size={52} />
          <h2 className="text-2xl mt-4 mb-2" style={{ fontFamily: "var(--font-display)" }}>Sign in to your profile</h2>
          <p className="text-sm mb-6" style={{ color: "#9b6674" }}>Save your scans, track your skin journey and get personalised picks.</p>
          <Link href="/"><Button style={{ background: "var(--color-rose)", color: "#fff" }}>Back to home</Button></Link>
        </div>
      </div>
    );
  }

  const initials = user.name ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : user.email[0].toUpperCase();
  const latestScan = faceScanHistory[0];

  const TABS: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "overview",     label: "Overview",     icon: TrendingUp },
    { id: "skin-history", label: "Skin history",  icon: Camera, count: faceScanHistory.length },
    { id: "saved",        label: "Saved",          icon: Heart, count: savedProducts.length },
    { id: "scans",        label: "Scanned",        icon: ScanLine, count: productScans.length },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#fff8f9" }}>
      <NavBar />

      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Profile header */}
        <div className="flex items-start gap-5 mb-8 p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #f0ccd6", boxShadow: "0 2px 16px rgba(201,80,110,0.07)" }}>
          <div className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>
              {user.name || "BlushMap Member"}
            </h1>
            <p className="text-sm" style={{ color: "#9b6674" }}>{user.email}</p>
            {user.skinType && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#fef0f3", color: "#c9506e", border: "1px solid #f0ccd6" }}>
                  {user.skinType}
                </span>
                {user.skinConcerns?.split(",").map(c => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#f9f5f0", color: "#9b6674", border: "1px solid #ede5dc" }}>
                    {c.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/analyse">
              <Button size="sm" className="gap-1.5 text-xs text-white border-0" style={{ background: "var(--color-rose)" }}>
                <Camera size={12} /> New scan
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Skin analyses", value: analyses.length, icon: Sparkles, color: "#c9506e" },
            { label: "Face scans", value: faceScanHistory.length, icon: Camera, color: "#c9944a" },
            { label: "Saved products", value: savedProducts.length, icon: Heart, color: "#e87a9b" },
            { label: "Products scanned", value: productScans.length, icon: ScanLine, color: "#a3324e" },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl" style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
              <s.icon size={18} style={{ color: s.color }} className="mb-2" />
              <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>{s.value}</div>
              <div className="text-xs" style={{ color: "#9b6674" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: tab === t.id ? "linear-gradient(135deg, #c9506e, #a3324e)" : "transparent",
                color: tab === t.id ? "#fff" : "#9b6674",
              }}>
              <t.icon size={13} />
              <span className="hidden sm:inline">{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{ background: tab === t.id ? "rgba(255,255,255,0.25)" : "#f0ccd6", color: tab === t.id ? "#fff" : "#c9506e" }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "overview" && (
          <div className="space-y-4">
            {latestScan ? (
              <div className="p-5 rounded-2xl" style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#1a0a0e" }}>
                  <TrendingUp size={14} style={{ color: "#c9506e" }} /> Latest skin snapshot
                </h3>
                <div className="flex items-center gap-4">
                  {latestScan.imageThumb && (
                    <img src={latestScan.imageThumb} className="w-16 h-16 rounded-xl object-cover" style={{ border: "2px solid #f0ccd6" }} />
                  )}
                  <div>
                    {latestScan.skinScore != null && (
                      <div className="text-3xl font-bold mb-0.5" style={{ fontFamily: "var(--font-display)", color: "#c9506e" }}>
                        {latestScan.skinScore}<span className="text-sm font-normal">/100</span>
                      </div>
                    )}
                    <div className="text-xs" style={{ color: "#9b6674" }}>{latestScan.skinType} · {new Date(latestScan.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                    {latestScan.concerns && <div className="text-xs mt-1" style={{ color: "#c9506e" }}>{latestScan.concerns}</div>}
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/analyse">
                <div className="p-5 rounded-2xl cursor-pointer hover:shadow-md transition-shadow" style={{ background: "linear-gradient(135deg, #fef0f3, #fff8f9)", border: "1.5px dashed #f0ccd6" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-rose)" }}>
                      <Camera size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#1a0a0e" }}>Start your skin journey</div>
                      <div className="text-xs" style={{ color: "#9b6674" }}>Analyse your skin — track changes over time</div>
                    </div>
                    <ChevronRight size={16} style={{ color: "#c9506e" }} className="ml-auto" />
                  </div>
                </div>
              </Link>
            )}

            {/* Recent saved */}
            {savedProducts.length > 0 && (
              <div className="p-5 rounded-2xl" style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "#1a0a0e" }}>
                    <Heart size={14} style={{ color: "#c9506e" }} /> Recently saved
                  </h3>
                  <button onClick={() => setTab("saved")} className="text-xs" style={{ color: "var(--color-rose)" }}>View all</button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {savedProducts.slice(0, 5).map(p => (
                    <a key={p.id} href={p.affiliateUrl || "#"} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 w-20 text-center group">
                      <div className="w-20 h-20 rounded-xl overflow-hidden mb-1.5 bg-gray-50" style={{ border: "1px solid #f0ccd6" }}>
                        {p.productImage ? <img src={p.productImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package size={20} style={{ color: "#f0ccd6" }} /></div>}
                      </div>
                      <div className="text-[10px] leading-tight line-clamp-2" style={{ color: "#9b6674" }}>{p.productName}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Recent product scans */}
            {productScans.length > 0 && (
              <div className="p-5 rounded-2xl" style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "#1a0a0e" }}>
                    <ScanLine size={14} style={{ color: "#c9506e" }} /> Recent scans
                  </h3>
                  <button onClick={() => setTab("scans")} className="text-xs" style={{ color: "var(--color-rose)" }}>View all</button>
                </div>
                <div className="space-y-2">
                  {productScans.slice(0, 3).map(s => (
                    <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: "#fff8f9" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: scoreColor(s.score) + "20", color: scoreColor(s.score) }}>
                        <span className="text-xs font-bold">{s.score ?? "?"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate" style={{ color: "#1a0a0e" }}>{s.productName || s.barcode}</div>
                        <div className="text-[10px]" style={{ color: "#9b6674" }}>{s.scoreLabel} · {s.brand}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "skin-history" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>Skin journey</h2>
              <Link href="/analyse">
                <Button size="sm" className="gap-1.5 text-xs text-white border-0" style={{ background: "var(--color-rose)" }}>
                  <Camera size={12} /> New analysis
                </Button>
              </Link>
            </div>
            {faceScanHistory.length === 0 ? (
              <EmptyState icon={Camera} title="No skin scans yet" desc="Analyse your face to start tracking your skin health over time." cta="Analyse my skin" href="/analyse" />
            ) : (
              <div className="space-y-3">
                {faceScanHistory.map((s, i) => (
                  <div key={s.id} className="flex gap-4 p-4 rounded-2xl" style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
                    {s.imageThumb && <img src={s.imageThumb} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs" style={{ color: "#9b6674" }}>
                            {new Date(s.createdAt).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                            {i === 0 && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px]" style={{ background: "#fef0f3", color: "#c9506e" }}>Latest</span>}
                          </div>
                          <div className="text-sm font-medium mt-0.5" style={{ color: "#1a0a0e" }}>{s.skinType || "—"}</div>
                          {s.concerns && <div className="text-xs mt-1" style={{ color: "#c9506e" }}>{s.concerns}</div>}
                        </div>
                        {s.skinScore != null && (
                          <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: scoreColor(s.skinScore) }}>
                            {s.skinScore}<span className="text-xs font-normal" style={{ color: "#9b6674" }}>/100</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "saved" && (
          <div>
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>Saved products</h2>
            {savedProducts.length === 0 ? (
              <EmptyState icon={Heart} title="Nothing saved yet" desc="Heart products from the catalogue or your recommendations." cta="Browse products" href="/search" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedProducts.map(p => (
                  <div key={p.id} className="flex gap-3 p-4 rounded-2xl" style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50" style={{ border: "1px solid #f0ccd6" }}>
                      {p.productImage ? <img src={p.productImage} className="w-full h-full object-cover" /> : <Package size={20} className="m-auto mt-4" style={{ color: "#f0ccd6" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: "#1a0a0e" }}>{p.productName}</div>
                      <div className="text-xs mb-2" style={{ color: "#9b6674" }}>{p.productBrand}</div>
                      <div className="flex items-center gap-2">
                        <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)}
                          className="text-[10px] rounded-lg px-2 py-1 outline-none"
                          style={{ background: "#fef0f3", color: "#c9506e", border: "none" }}>
                          <option value="saved">Saved</option>
                          <option value="purchased">Purchased</option>
                          <option value="tried">Tried it</option>
                        </select>
                        {p.affiliateUrl && (
                          <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] flex items-center gap-0.5 px-2 py-1 rounded-lg" style={{ background: "#c9506e", color: "#fff" }}>
                            <ExternalLink size={9} /> Shop
                          </a>
                        )}
                        <button onClick={() => removeProduct(p.id)} className="ml-auto text-gray-300 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "scans" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>Scanned products</h2>
              <Link href="/scanner">
                <Button size="sm" className="gap-1.5 text-xs text-white border-0" style={{ background: "var(--color-rose)" }}>
                  <ScanLine size={12} /> Scan product
                </Button>
              </Link>
            </div>
            {productScans.length === 0 ? (
              <EmptyState icon={ScanLine} title="No product scans yet" desc="Scan the barcode of any makeup, skincare or food product for an instant ingredient breakdown." cta="Scan a product" href="/scanner" />
            ) : (
              <div className="space-y-3">
                {productScans.map(s => (
                  <div key={s.id} className="flex gap-3 p-4 rounded-2xl" style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-lg"
                      style={{ background: scoreColor(s.score) + "15", color: scoreColor(s.score), fontFamily: "var(--font-display)" }}>
                      {s.score ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: "#1a0a0e" }}>{s.productName || "Unknown product"}</div>
                      <div className="text-xs" style={{ color: "#9b6674" }}>{s.brand} · {s.scoreLabel}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "#c0a0a8" }}>
                        {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · Barcode: {s.barcode}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center">
                      <span className="text-[10px] px-2 py-1 rounded-full font-medium"
                        style={{ background: scoreColor(s.score) + "15", color: scoreColor(s.score) }}>
                        {s.scoreLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function scoreColor(score: number | null) {
  if (!score) return "#9b6674";
  if (score >= 75) return "#22a165";
  if (score >= 50) return "#c9944a";
  if (score >= 25) return "#e87a4e";
  return "#c9506e";
}

function EmptyState({ icon: Icon, title, desc, cta, href }: any) {
  return (
    <div className="text-center py-12">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#fef0f3" }}>
        <Icon size={22} style={{ color: "#c9506e" }} />
      </div>
      <h3 className="text-base font-semibold mb-1" style={{ color: "#1a0a0e" }}>{title}</h3>
      <p className="text-sm mb-4" style={{ color: "#9b6674", maxWidth: "24ch", margin: "0 auto 1rem" }}>{desc}</p>
      <Link href={href}>
        <Button size="sm" className="gap-1.5 text-xs text-white border-0" style={{ background: "var(--color-rose)" }}>
          {cta} <ChevronRight size={12} />
        </Button>
      </Link>
    </div>
  );
}
