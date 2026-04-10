import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ExternalLink, ShoppingBag, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Zone positions on the face SVG map (relative to 200x260 viewBox)
const ZONE_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  forehead: { x: 100, y: 45, label: "Forehead" },
  "t-zone": { x: 100, y: 110, label: "T-Zone" },
  "t_zone": { x: 100, y: 110, label: "T-Zone" },
  tzone: { x: 100, y: 110, label: "T-Zone" },
  cheeks: { x: 60, y: 145, label: "Cheeks" },
  "under-eyes": { x: 72, y: 118, label: "Under-eyes" },
  "underEyes": { x: 72, y: 118, label: "Under-eyes" },
  under_eyes: { x: 72, y: 118, label: "Under-eyes" },
  nose: { x: 100, y: 145, label: "Nose" },
  chin: { x: 100, y: 210, label: "Chin" },
  "full-face": { x: 148, y: 130, label: "Full face" },
  "full_face": { x: 148, y: 130, label: "Full face" },
  "dark-spots": { x: 138, y: 100, label: "Dark spots" },
  "dark_spots": { x: 138, y: 100, label: "Dark spots" },
  scarring: { x: 52, y: 165, label: "Scarring" },
  neck: { x: 100, y: 240, label: "Neck" },
};

const ZONE_COLORS: Record<string, string> = {
  forehead: "#b5476a",
  "t-zone": "#c9944a",
  "t_zone": "#c9944a",
  tzone: "#c9944a",
  cheeks: "#d06090",
  "under-eyes": "#7a9b9b",
  underEyes: "#7a9b9b",
  under_eyes: "#7a9b9b",
  nose: "#c9944a",
  chin: "#8a7ab5",
  "full-face": "#7a9b7a",
  "full_face": "#7a9b7a",
  "dark-spots": "#9b7a5a",
  "dark_spots": "#9b7a5a",
  scarring: "#b57a7a",
  neck: "#9b9b7a",
};

const SKIN_TONE_SWATCH: Record<string, string> = {
  fair: "#f8e8db",
  light: "#f0d0b0",
  medium: "#d4a070",
  tan: "#b87040",
  deep: "#7a4020",
  rich: "#3a1a0a",
};

function SkinToneChip({ tone }: { tone: string }) {
  const color = SKIN_TONE_SWATCH[tone] || "#c4906a";
  return (
    <span className="flex items-center gap-2 text-sm capitalize">
      <span className="w-4 h-4 rounded-full border border-black/10 inline-block" style={{ background: color }} />
      {tone}
    </span>
  );
}

function FaceZoneMap({ recommendations }: { recommendations: any }) {
  const zones: string[] = [];
  if (recommendations?.recommendedProducts) {
    recommendations.recommendedProducts.forEach((r: any) => {
      if (r.applicationZone) {
        const zKey = r.applicationZone.toLowerCase().replace(/\s+/g, "-");
        if (!zones.includes(zKey)) zones.push(zKey);
      }
      if (r.product?.zones) {
        r.product.zones.forEach((z: string) => {
          if (!zones.includes(z)) zones.push(z);
        });
      }
    });
  }

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 270" width="220" height="290" aria-label="Face zone map">
        {/* Face outline */}
        <ellipse cx="100" cy="130" rx="75" ry="100" fill="hsl(30 30% 93%)" stroke="hsl(30 20% 75%)" strokeWidth="1" />
        {/* Eye guides */}
        <ellipse cx="75" cy="108" rx="12" ry="7" fill="none" stroke="hsl(30 20% 70%)" strokeWidth="0.8" />
        <ellipse cx="125" cy="108" rx="12" ry="7" fill="none" stroke="hsl(30 20% 70%)" strokeWidth="0.8" />
        {/* Nose guide */}
        <path d="M96 120 Q90 145 86 150 Q100 158 114 150 Q110 145 104 120" fill="none" stroke="hsl(30 20% 70%)" strokeWidth="0.8" />
        {/* Mouth guide */}
        <path d="M82 175 Q100 185 118 175" fill="none" stroke="hsl(30 20% 70%)" strokeWidth="0.8" />
        {/* Zone dots */}
        {zones.map((zone, i) => {
          const pos = Object.entries(ZONE_POSITIONS).find(([k]) => {
            const zNorm = zone.toLowerCase().replace(/[\s-]/g, "");
            const kNorm = k.toLowerCase().replace(/[\s-_]/g, "");
            return kNorm === zNorm;
          });
          if (!pos) return null;
          const [key, p] = pos;
          const color = ZONE_COLORS[key] || ZONE_COLORS[zone] || "#b5476a";
          return (
            <g key={`${zone}-${i}`}>
              <circle cx={p.x} cy={p.y} r="8" fill={color} opacity="0.85" />
              <circle cx={p.x} cy={p.y} r="12" fill={color} opacity="0.2" />
            </g>
          );
        })}
        {/* Legend connector lines */}
        {zones.slice(0, 3).map((zone, i) => {
          const pos = Object.entries(ZONE_POSITIONS).find(([k]) => {
            const zNorm = zone.toLowerCase().replace(/[\s-]/g, "");
            const kNorm = k.toLowerCase().replace(/[\s-_]/g, "");
            return kNorm === zNorm;
          });
          if (!pos) return null;
          const [, p] = pos;
          const color = ZONE_COLORS[zone] || "#b5476a";
          return (
            <line key={`line-${i}`} x1={p.x} y1={p.y} x2="185" y2={70 + i * 30} stroke={color} strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
          );
        })}
      </svg>
      {zones.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {zones.map(zone => (
            <span key={zone} className="text-xs px-2 py-1 rounded-full" style={{
              background: `${ZONE_COLORS[zone] || "#b5476a"}22`,
              color: ZONE_COLORS[zone] || "#b5476a",
            }}>
              {ZONE_POSITIONS[zone]?.label || zone.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ rec, index }: { rec: any; index: number }) {
  const { product, reason, usageTip } = rec;
  if (!product) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border transition-shadow hover:shadow-md" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} data-testid={`product-card-${index}`}>
      {/* Product image */}
      <div className="shrink-0 w-full sm:w-24 h-36 sm:h-24 rounded-xl overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
          <div>
            <p className="text-xs text-muted-foreground">{product.brand}</p>
            <h3 className="font-medium leading-tight">{product.name}</h3>
          </div>
          <span className="text-sm font-semibold shrink-0" style={{ color: "var(--color-rose)" }}>{product.price}</span>
        </div>

        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
        <p className="text-xs mb-3 leading-relaxed" style={{ color: "hsl(var(--foreground) / 0.75)" }}>
          <span className="font-medium">Why for you: </span>{reason}
        </p>
        {usageTip && (
          <p className="text-xs italic text-muted-foreground mb-3">Tip: {usageTip}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {product.zones?.slice(0, 2).map((z: string) => (
            <Badge key={z} variant="secondary" className="text-xs">Apply: {z.replace(/-/g, " ")}</Badge>
          ))}
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            data-testid={`buy-link-${index}`}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-white font-medium transition-opacity hover:opacity-90"
            style={{ background: "var(--color-rose)" }}
          >
            <ShoppingBag size={13} /> Buy now <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Results() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/analysis", id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/analysis/${id}`);
      const record = await res.json();
      return {
        skinAnalysis: record.analysisResult ? JSON.parse(record.analysisResult) : null,
        recommendations: record.recommendations ? JSON.parse(record.recommendations) : null,
        imageData: record.imageData,
        captureMethod: record.captureMethod,
      };
    },
    enabled: !!id && id > 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--background))" }}>
        <div className="text-center">
          <div className="skeleton w-32 h-32 rounded-full mx-auto mb-6" />
          <div className="skeleton h-6 w-48 mx-auto mb-3" />
          <div className="skeleton h-4 w-36 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !data?.skinAnalysis) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "hsl(var(--background))" }}>
        <div className="text-center max-w-sm">
          <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "0.5rem" }}>Results not found</h2>
          <p className="text-muted-foreground text-sm mb-6">We couldn't load your analysis. Please try again.</p>
          <Link href="/analyse"><Button className="gradient-rose text-white border-0">Try again</Button></Link>
        </div>
      </div>
    );
  }

  const { skinAnalysis, recommendations, imageData } = data;
  const concerns: string[] = skinAnalysis.concerns || [];
  const products = recommendations?.recommendedProducts || [];

  return (
    <div className="min-h-screen pb-20" style={{ background: "hsl(var(--background))" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ background: "hsl(var(--background) / 0.9)", borderColor: "hsl(var(--border))" }}>
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/analyse">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft size={16} /> New analysis
            </button>
          </Link>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Your Results</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* Summary hero */}
        <div className="rounded-3xl overflow-hidden mb-8 p-6 sm:p-8 relative" style={{ background: "linear-gradient(135deg, hsl(340 30% 94%), hsl(30 35% 93%))" }}>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {imageData && (
              <img src={imageData} alt="Your analysed photo" className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shrink-0 shadow-md" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} style={{ color: "var(--color-rose)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--color-rose)" }}>AI Skin Profile</span>
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 3vw, 2rem)", marginBottom: "0.75rem" }}>
                {recommendations?.skinSummary || `${skinAnalysis.skinType} skin with ${skinAnalysis.undertone} undertone`}
              </h1>
              <div className="flex flex-wrap gap-3">
                <div className="text-xs bg-white/60 px-3 py-1.5 rounded-full">
                  <SkinToneChip tone={skinAnalysis.skinTone} />
                </div>
                <span className="text-xs bg-white/60 px-3 py-1.5 rounded-full capitalize">
                  {skinAnalysis.undertone} undertone
                </span>
                <span className="text-xs bg-white/60 px-3 py-1.5 rounded-full capitalize">
                  {skinAnalysis.skinType} skin
                </span>
                {skinAnalysis.faceShape && (
                  <span className="text-xs bg-white/60 px-3 py-1.5 rounded-full capitalize">
                    {skinAnalysis.faceShape} face shape
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout: Face map + Zone breakdown */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {/* Face map */}
          <div className="rounded-2xl border p-6 flex flex-col items-center" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1rem" }}>Application zones</h2>
            <FaceZoneMap recommendations={recommendations} />
          </div>

          {/* Skin concerns + zones */}
          <div className="rounded-2xl border p-6" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1rem" }}>Skin concerns detected</h2>
            {concerns.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {concerns.map(c => (
                  <Badge key={c} variant="outline" className="capitalize text-xs">{c.replace(/-/g, " ")}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">No major concerns detected — great skin!</p>
            )}

            {recommendations?.topConcernToAddress && (
              <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: "hsl(340 30% 93%)", color: "hsl(340 45% 35%)" }}>
                <span className="font-medium">Top priority: </span>{recommendations.topConcernToAddress}
              </div>
            )}

            {/* Zone analysis */}
            {skinAnalysis.faceZones && (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Zone analysis</p>
                <div className="space-y-2">
                  {Object.entries(skinAnalysis.faceZones as Record<string, string>).filter(([k]) => k !== "overall").slice(0, 4).map(([zone, desc]) => (
                    <div key={zone} className="text-xs">
                      <span className="font-medium capitalize">{zone.replace(/([A-Z])/g, " $1").toLowerCase()}: </span>
                      <span className="text-muted-foreground">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Routine order */}
        {recommendations?.routineOrder && recommendations.routineOrder.length > 0 && (
          <div className="rounded-2xl border p-6 mb-8" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1rem" }}>Suggested routine order</h2>
            <ol className="flex flex-wrap gap-3">
              {recommendations.routineOrder.map((step: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: "var(--color-rose)" }}>{i + 1}</span>
                  {step}
                  {i < recommendations.routineOrder.length - 1 && <span className="text-muted-foreground hidden sm:inline">→</span>}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}>
              Recommended for you
            </h2>
            <span className="text-xs text-muted-foreground">{products.length} products</span>
          </div>

          <div className="space-y-4">
            {products.map((rec: any, i: number) => (
              <ProductCard key={rec.productId || i} rec={rec} index={i} />
            ))}
          </div>
        </div>

        {/* Affiliate disclosure */}
        <div className="mt-8 p-4 rounded-xl text-xs text-muted-foreground" style={{ background: "hsl(var(--muted) / 0.5)", borderLeft: "3px solid hsl(var(--border))" }}>
          <strong>Affiliate disclosure:</strong> Some product links on this page are affiliate links. We may earn a small commission if you make a purchase, at no extra cost to you. This helps keep BlushMap free.
        </div>

        {/* Retake CTA */}
        <div className="mt-8 text-center">
          <Link href="/analyse">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={16} /> Analyse a different photo
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
