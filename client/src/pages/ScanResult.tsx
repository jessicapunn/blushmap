import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, ScanLine, Sparkles, ExternalLink, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AffiliateButton } from "@/components/AffiliateButton";

// Awin affiliate helper (publisher 2854395)
const AWIN_LF = (q: string) => `https://www.awin1.com/cread.php?awinmid=2082&awinaffid=2854395&ued=${encodeURIComponent('https://www.lookfantastic.com/search?q=' + q)}`;

interface Ingredient {
  name: string;
  inci: string;
  role: string;
  rating: "good" | "caution" | "poor";
  concern: string | null;
  detail: string;
}

interface Alternative {
  name: string;
  brand: string;
  reason: string;
  category: string;
  affiliateSearch: string;
}

interface ScanResultData {
  productName: string;
  brand: string;
  score: number;
  scoreLabel: string;
  scoreColour: string;
  summary: string;
  ingredients: Ingredient[];
  redIngredients?: string[];
  greenIngredients?: string[];
  pros: string[];
  cons: string[];
  certifications: string[];
  bestFor: string[];
  avoid: string[];
  fitzpatrickNotes?: string;
  overallVerdict: string;
  alternatives?: Alternative[];
  barcode: string;
  productImage: string | null;
  // enriched OFF data
  ingredientsList?: {name: string; vegan?: boolean; vegetarian?: boolean}[];
  additives?: {code: string; name: string}[];
  allergens?: string;
  labels?: string;
}

function ScoreRing({ score, colour }: { score: number; colour: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative w-36 h-36 flex items-center justify-center mx-auto">
      <svg width="144" height="144" className="-rotate-90">
        <circle cx="72" cy="72" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <circle
          cx="72" cy="72" r={r} fill="none"
          stroke={colour} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color: colour }}>{score}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

function IngredientRatingIcon({ rating }: { rating: string }) {
  if (rating === "good") return <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: "#4CAF50" }} />;
  if (rating === "caution") return <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: "#FF9800" }} />;
  return <XCircle size={16} className="shrink-0 mt-0.5" style={{ color: "#F44336" }} />;
}

function IngredientRow({ ing }: { ing: Ingredient }) {
  const [open, setOpen] = useState(false);
  const bg = ing.rating === "good" ? "hsl(120 20% 97%)" : ing.rating === "caution" ? "hsl(38 30% 97%)" : "hsl(0 30% 97%)";
  const border = ing.rating === "good" ? "hsl(120 30% 85%)" : ing.rating === "caution" ? "hsl(38 50% 82%)" : "hsl(0 50% 85%)";

  return (
    <div
      className="rounded-xl border p-3 cursor-pointer transition-all"
      style={{ background: bg, borderColor: border }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-start gap-2">
        <IngredientRatingIcon rating={ing.rating} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm truncate">{ing.name}</span>
            <div className="flex items-center gap-1 shrink-0">
              {ing.concern && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "hsl(38 70% 92%)", color: "hsl(38 70% 35%)" }}>
                  {ing.concern}
                </span>
              )}
              {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{ing.role}</span>
        </div>
      </div>
      {open && (
        <div className="mt-2 pt-2 border-t text-xs text-muted-foreground pl-6" style={{ borderColor: border }}>
          {ing.inci && ing.inci !== ing.name && <p className="mb-1"><span className="font-medium">INCI:</span> {ing.inci}</p>}
          <p>{ing.detail}</p>
        </div>
      )}
    </div>
  );
}

export default function ScanResult() {
  const [data, setData] = useState<ScanResultData | null>(null);
  const [, setLocation] = useLocation();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("barcodeResult");
    if (!raw) { setLocation("/scanner"); return; }
    try { setData(JSON.parse(raw)); } catch { setLocation("/scanner"); }
  }, []);

  if (!data) return null;

  const goodCount = data.ingredients?.filter(i => i.rating === "good").length || 0;
  const cautionCount = data.ingredients?.filter(i => i.rating === "caution").length || 0;
  const poorCount = data.ingredients?.filter(i => i.rating === "poor").length || 0;
  const visibleIngredients = showAll ? data.ingredients : data.ingredients?.slice(0, 8);

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)", background: "hsl(var(--background))" }}>
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md" style={{ background: "hsl(var(--background) / 0.92)" }}>
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/scanner">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm">Scan another</span>
            </button>
          </Link>
          <div className="flex items-center gap-2 ml-2">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" fill="hsl(340 45% 45%)" />
              <ellipse cx="14" cy="12" rx="5" ry="6" fill="none" stroke="white" strokeWidth="1.5" />
              <path d="M9 18 Q14 22 19 18" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="14" cy="9" r="1.5" fill="hsl(30 60% 80%)" />
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 600 }}>Scan Result</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 max-w-2xl mx-auto space-y-6">

        {/* Product hero card */}
        <div className="rounded-2xl border p-6 text-center" style={{ background: "hsl(340 20% 97%)", borderColor: "hsl(340 30% 88%)" }}>
          {data.productImage && (
            <img src={data.productImage} alt={data.productName} className="w-24 h-24 object-contain mx-auto mb-4 rounded-xl" />
          )}
          <p className="text-sm text-muted-foreground mb-1">{data.brand}</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 600, lineHeight: 1.2, marginBottom: "1.5rem" }}>
            {data.productName}
          </h1>

          <ScoreRing score={data.score} colour={data.scoreColour} />

          <div className="mt-3">
            <span className="text-lg font-semibold" style={{ color: data.scoreColour }}>{data.scoreLabel}</span>
            <p className="text-sm text-muted-foreground mt-1">{data.summary}</p>
          </div>

          {/* Ingredient breakdown pills */}
          <div className="flex justify-center gap-3 mt-5">
            {goodCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm" style={{ background: "hsl(120 30% 93%)", color: "#2E7D32" }}>
                <CheckCircle size={14} /> {goodCount} good
              </div>
            )}
            {cautionCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm" style={{ background: "hsl(38 50% 93%)", color: "#E65100" }}>
                <AlertTriangle size={14} /> {cautionCount} caution
              </div>
            )}
            {poorCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm" style={{ background: "hsl(0 40% 93%)", color: "#B71C1C" }}>
                <XCircle size={14} /> {poorCount} poor
              </div>
            )}
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border p-4" style={{ background: "hsl(120 20% 97%)", borderColor: "hsl(120 30% 85%)" }}>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5" style={{ color: "#2E7D32" }}>
              <CheckCircle size={15} /> Pros
            </h3>
            <ul className="space-y-1.5">
              {(data.pros || []).map((p, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0" style={{ color: "#4CAF50" }}>✓</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border p-4" style={{ background: "hsl(0 20% 97%)", borderColor: "hsl(0 40% 88%)" }}>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5" style={{ color: "#B71C1C" }}>
              <XCircle size={15} /> Cons
            </h3>
            <ul className="space-y-1.5">
              {(data.cons || []).map((c, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0" style={{ color: "#F44336" }}>✕</span> {c}
                </li>
              ))}
              {(!data.cons || data.cons.length === 0) && (
                <li className="text-xs text-muted-foreground">None identified</li>
              )}
            </ul>
          </div>
        </div>

        {/* Best for / Avoid */}
        {((data.bestFor?.length > 0) || (data.avoid?.length > 0)) && (
          <div className="rounded-2xl border p-5 space-y-3" style={{ background: "hsl(var(--card))" }}>
            {data.bestFor?.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Best for</p>
                <div className="flex flex-wrap gap-2">
                  {data.bestFor.map((b, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full border" style={{ background: "hsl(340 30% 94%)", borderColor: "hsl(340 30% 82%)", color: "hsl(340 50% 40%)" }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.avoid?.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Avoid if you have</p>
                <div className="flex flex-wrap gap-2">
                  {data.avoid.map((a, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full border" style={{ background: "hsl(38 30% 95%)", borderColor: "hsl(38 40% 82%)", color: "hsl(38 60% 35%)" }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ingredients list */}
        {data.ingredients?.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>
              Ingredients ({data.ingredients.length})
            </h2>
            <div className="space-y-2">
              {visibleIngredients?.map((ing, i) => (
                <IngredientRow key={i} ing={ing} />
              ))}
            </div>
            {data.ingredients.length > 8 && (
              <button
                className="w-full mt-3 py-2 text-sm text-center rounded-xl border transition-all hover:shadow-sm"
                style={{ color: "hsl(340 45% 45%)", borderColor: "hsl(340 30% 85%)", background: "hsl(340 30% 97%)" }}
                onClick={() => setShowAll(s => !s)}
              >
                {showAll ? "Show fewer" : `Show all ${data.ingredients.length} ingredients`}
              </button>
            )}
          </div>
        )}

        {/* Alternatives — always shown */}
        {data.alternatives && data.alternatives.length > 0 && (
          <div className="rounded-2xl border p-5" style={{ background: "hsl(var(--card))", borderColor: "hsl(340 30% 88%)" }}>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsUp size={16} style={{ color: "#c9506e" }} />
              <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>
                {data.score < 75 ? "Better alternatives" : "Pairs well with"}
              </span>
              {data.score < 75 && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fef0f3", color: "#c9506e", border: "1px solid #f0ccd6" }}>Recommended switch</span>
              )}
            </div>
            <div className="space-y-3">
              {data.alternatives.map((alt, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "hsl(340 20% 97%)", border: "1px solid hsl(340 25% 90%)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold" style={{ background: "#fef0f3", color: "#c9506e" }}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold" style={{ color: "#c9a96e" }}>{alt.brand}</div>
                    <div className="text-sm font-semibold" style={{ color: "#1a0a0e" }}>{alt.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#9b6674" }}>{alt.reason}</div>
                  </div>
                  <AffiliateButton
                    href={AWIN_LF(alt.affiliateSearch || `${alt.brand} ${alt.name}`)}
                    productId={`scan-alt-${i}-${alt.name}`}
                    productName={`${alt.brand} ${alt.name}`}
                    target="_blank" rel="noopener noreferrer sponsored"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 text-white"
                    style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}
                  >
                    Shop <ExternalLink size={10} />
                  </AffiliateButton>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: "#bbb" }}>*Affiliate links — we earn a small commission at no extra cost to you.</p>
          </div>
        )}

        {/* Fitzpatrick notes */}
        {data.fitzpatrickNotes && (
          <div className="rounded-2xl border p-4" style={{ background: "hsl(38 25% 97%)", borderColor: "hsl(38 40% 85%)" }}>
            <p className="text-xs font-bold mb-1" style={{ color: "#c9a96e" }}>Skin tone considerations</p>
            <p className="text-sm" style={{ color: "#6b4226" }}>{data.fitzpatrickNotes}</p>
          </div>
        )}

        {/* Allergen & additive info */}
        {(data.allergens || (data.additives && data.additives.length > 0)) && (
          <div className="rounded-2xl border p-4" style={{ background: "hsl(38 25% 97%)", borderColor: "hsl(38 40% 85%)" }}>
            {data.allergens && (
              <div className="mb-2">
                <p className="text-xs font-bold mb-1" style={{ color: "#c9506e" }}>Allergens</p>
                <p className="text-xs" style={{ color: "#7a4a3a" }}>{data.allergens}</p>
              </div>
            )}
            {data.additives && data.additives.length > 0 && (
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: "#c9506e" }}>Additives ({data.additives.length})</p>
                <div className="flex flex-wrap gap-1">
                  {data.additives.map((a, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fff3cd", color: "#856404", border: "1px solid #ffe69c" }}>{a.code}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Overall verdict */}
        <div className="rounded-2xl border p-5" style={{ background: "linear-gradient(135deg, hsl(340 30% 97%), hsl(30 30% 97%))", borderColor: "hsl(340 30% 88%)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} style={{ color: "hsl(340 45% 45%)" }} />
            <span className="font-semibold text-sm">AI Verdict</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.overallVerdict}</p>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t" style={{ borderColor: "hsl(340 30% 88%)" }}>
            Barcode: {data.barcode} · Data: Open Beauty Facts · AI: Claude · For informational purposes only
          </p>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link href="/scanner">
            <Button variant="outline" className="w-full gap-2">
              <ScanLine size={16} /> Scan another
            </Button>
          </Link>
          <Link href="/analyse">
            <Button className="w-full gradient-rose text-white border-0 hover:opacity-90 gap-2">
              <Sparkles size={16} /> Skin analysis
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
