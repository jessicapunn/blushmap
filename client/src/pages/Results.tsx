import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ExternalLink, ShoppingBag, AlertCircle, Sparkles, Leaf, Crown, Banknote, ChevronRight, Heart, User as UserIcon, ChevronDown, ChevronUp, Zap, ShieldCheck } from "lucide-react";
import { getProductImage } from "@/lib/productImages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

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

// Ingredient tag colours
const INGREDIENT_COLORS = [
  { bg: "hsl(340 30% 93%)", text: "hsl(340 55% 35%)" },
  { bg: "hsl(30 40% 92%)", text: "hsl(30 55% 30%)" },
  { bg: "hsl(270 25% 91%)", text: "hsl(270 45% 35%)" },
  { bg: "hsl(200 30% 90%)", text: "hsl(200 50% 30%)" },
  { bg: "hsl(130 25% 89%)", text: "hsl(130 40% 28%)" },
];

type AlternativeTab = "our-pick" | "budget" | "luxury" | "organic";

const TAB_CONFIG: { key: AlternativeTab; label: string; icon: any; color: string }[] = [
  { key: "our-pick", label: "Our Pick", icon: Sparkles, color: "#b5476a" },
  { key: "budget", label: "Budget", icon: Banknote, color: "#4a9b6a" },
  { key: "luxury", label: "Luxury", icon: Crown, color: "#c9944a" },
  { key: "organic", label: "Organic", icon: Leaf, color: "#5a8a5a" },
];

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
      <svg viewBox="0 0 200 270" width="200" height="265" aria-label="Face zone map">
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
              <circle cx={p.x} cy={p.y} r="14" fill={color} opacity="0.18" />
            </g>
          );
        })}
      </svg>
      {zones.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-3">
          {zones.map(zone => (
            <span key={zone} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{
              background: `${ZONE_COLORS[zone] || "#b5476a"}18`,
              color: ZONE_COLORS[zone] || "#b5476a",
              border: `1px solid ${ZONE_COLORS[zone] || "#b5476a"}30`,
            }}>
              {ZONE_POSITIONS[zone]?.label || zone.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function KeyIngredientChips({ ingredients }: { ingredients: Array<{ name: string; benefit: string }> }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  if (!ingredients || ingredients.length === 0) return null;
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(340 35% 50%)", letterSpacing: "0.1em" }}>
        Key Ingredients
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ingredients.map((ing, i) => {
          const color = INGREDIENT_COLORS[i % INGREDIENT_COLORS.length];
          const isOpen = expandedIdx === i;
          return (
            <button
              key={ing.name}
              onClick={() => setExpandedIdx(isOpen ? null : i)}
              className="text-xs px-2.5 py-1 rounded-full transition-all text-left"
              style={{ background: color.bg, color: color.text, border: `1px solid ${color.text}25` }}
            >
              {ing.name}
              {isOpen && (
                <span className="ml-1.5 opacity-80">— {ing.benefit}</span>
              )}
            </button>
          );
        })}
      </div>
      {expandedIdx === null && (
        <p className="text-xs text-muted-foreground mt-1.5">Tap an ingredient to learn more</p>
      )}
    </div>
  );
}

const SCORE_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  "A+": { bg: "#e8f5e9", text: "#1b5e20", ring: "#4caf50" },
  "A":  { bg: "#e8f5e9", text: "#2e7d32", ring: "#66bb6a" },
  "B+": { bg: "#fff8e1", text: "#e65100", ring: "#ffa726" },
  "B":  { bg: "#fff3e0", text: "#e65100", ring: "#ff9800" },
  "C":  { bg: "#fbe9e7", text: "#bf360c", ring: "#ff7043" },
  "D":  { bg: "#ffebee", text: "#b71c1c", ring: "#ef5350" },
};

function SkinSummaryCard({ skinAnalysis, recommendations, imageData }: { skinAnalysis: any; recommendations: any; imageData: string | null }) {
  const [showDetail, setShowDetail] = useState(false);

  // Support both old string format and new structured format
  const summary = recommendations?.skinSummary;
  const isStructured = summary && typeof summary === "object" && summary.headline;

  const headline = isStructured
    ? summary.headline
    : (typeof summary === "string" ? summary : `${skinAnalysis.skinType} skin with ${skinAnalysis.undertone} undertone`);
  const bullets: string[] = isStructured ? (summary.bulletPoints || []) : [];
  const detailedAnalysis: string = isStructured ? (summary.detailedAnalysis || "") : (typeof summary === "string" ? summary : "");
  const score: string = isStructured ? (summary.skinHealthScore || "") : "";
  const quickWins: string[] = isStructured ? (summary.quickWins || []) : [];
  const scoreStyle = SCORE_COLORS[score] || SCORE_COLORS["B+"];

  return (
    <div className="rounded-3xl overflow-hidden mb-8" style={{ background: "linear-gradient(135deg, hsl(340 30% 94%), hsl(30 35% 93%))" }}>
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {imageData && (
            <div className="relative shrink-0">
              <img src={imageData} alt="Your analysed photo" className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md" />
              <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--color-rose)" }}>
                <Sparkles size={14} color="white" />
              </div>
            </div>
          )}
          <div className="flex-1">
            {/* Label + score badge row */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-rose)", letterSpacing: "0.12em" }}>
                AI Skin Profile
              </span>
              {score && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: scoreStyle.bg, color: scoreStyle.text, border: `1.5px solid ${scoreStyle.ring}` }}
                >
                  Skin Score: {score}
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 3vw, 1.9rem)", marginBottom: "0.75rem", lineHeight: 1.25 }}>
              {headline}
            </h1>

            {/* Skin type chips */}
            <div className="flex flex-wrap gap-2 mb-4">
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
                  {skinAnalysis.faceShape} face
                </span>
              )}
            </div>

            {/* Key bullet points */}
            {bullets.length > 0 && (
              <ul className="space-y-2 mb-4">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <ShieldCheck size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-rose)" }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Quick wins */}
            {quickWins.length > 0 && (
              <div className="rounded-xl p-3.5 mb-4" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(201,80,110,0.12)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={13} style={{ color: "var(--color-gold)" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-gold)", letterSpacing: "0.08em" }}>Quick wins</span>
                </div>
                <ul className="space-y-1.5">
                  {quickWins.map((tip, i) => (
                    <li key={i} className="text-xs leading-relaxed text-foreground/80 pl-5 relative">
                      <span className="absolute left-0">{'\u2022'}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Read more toggle */}
            {detailedAnalysis && (
              <div>
                <button
                  onClick={() => setShowDetail(!showDetail)}
                  className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--color-rose)" }}
                >
                  {showDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {showDetail ? "Show less" : "Read full analysis"}
                </button>
                {showDetail && (
                  <div className="mt-3 p-4 rounded-xl text-sm leading-relaxed" style={{ background: "rgba(255,255,255,0.5)", borderLeft: "2px solid var(--color-rose)" }}>
                    {detailedAnalysis}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top concern banner */}
      {recommendations?.topConcernToAddress && (
        <div className="px-6 sm:px-8 pb-5">
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(181,71,106,0.08)", border: "1px solid rgba(181,71,106,0.15)" }}>
            <ChevronRight size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-rose)" }} />
            <span><span className="font-semibold" style={{ color: "var(--color-rose)" }}>Top priority: </span>{recommendations.topConcernToAddress}</span>
          </div>
        </div>
      )}

      {/* Clinical warnings */}
      {recommendations?.clinicalWarnings && recommendations.clinicalWarnings.length > 0 && (
        <div className="px-6 sm:px-8 pb-6">
          <div className="rounded-xl p-3.5" style={{ background: "rgba(244,67,54,0.05)", border: "1px solid rgba(244,67,54,0.12)" }}>
            <p className="text-xs font-semibold mb-1.5" style={{ color: "#c62828" }}>Things to avoid</p>
            <ul className="space-y-1">
              {recommendations.clinicalWarnings.map((w: string, i: number) => (
                <li key={i} className="text-xs leading-relaxed" style={{ color: "#5d4037" }}>
                  <AlertCircle size={10} className="inline mr-1.5" style={{ color: "#e53935" }} />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function AlternativeCard({ alt, type }: { alt: any; type: "budget" | "luxury" | "organic" }) {
  const config = TAB_CONFIG.find(t => t.key === type)!;
  const Icon = config.icon;
  return (
    <div className="rounded-xl p-4 border" style={{ background: "hsl(var(--muted) / 0.4)", borderColor: "hsl(var(--border))" }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-xs text-muted-foreground">{alt.brand}</p>
          <p className="font-medium text-sm leading-snug">{alt.name}</p>
        </div>
        <span className="text-sm font-semibold shrink-0" style={{ color: config.color }}>{alt.price}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{alt.reason}</p>
      <a
        href={alt.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90"
        style={{ background: config.color }}
      >
        <ShoppingBag size={11} /> Shop on Amazon <ExternalLink size={10} />
      </a>
    </div>
  );
}

function ProductCard({ rec, index, user, savedIds, saveProduct }: { rec: any; index: number; user: any; savedIds: Set<string>; saveProduct: (p: any) => void }) {
  const { product, reason, usageTip } = rec;
  const [activeTab, setActiveTab] = useState<AlternativeTab>("our-pick");
  if (!product) return null;

  const hasAlternatives = product.alternatives && (product.alternatives.budget || product.alternatives.luxury || product.alternatives.organic);

  return (
    <article
      className="rounded-2xl border overflow-hidden transition-shadow hover:shadow-md"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
      data-testid={`product-card-${index}`}
    >
      {/* Category label strip */}
      <div className="px-5 pt-4 pb-0 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(var(--muted-foreground))", letterSpacing: "0.12em" }}>
          {product.category?.replace(/-/g, " ")}
        </span>
        <Link href={`/product/${product.id}`}>
          <span className="text-xs font-semibold hover:underline cursor-pointer" style={{ color: "var(--color-rose)" }}>
            View details →
          </span>
        </Link>
      </div>

      {/* Main product row */}
      <div className="flex flex-col sm:flex-row gap-5 p-5">
        {/* Product image */}
        <div className="shrink-0 w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
          <img
            src={getProductImage(product.id, product.image)}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--color-gold)" }}>{product.brand}</p>
              <h3 className="font-semibold leading-tight text-base">{product.name}</h3>
            </div>
            <span className="text-sm font-bold shrink-0" style={{ color: "var(--color-rose)" }}>{product.price}</span>
          </div>

          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{product.description}</p>

          {/* Why for you */}
          <div className="mb-3 p-3 rounded-xl text-xs leading-relaxed" style={{ background: "hsl(340 25% 95%)", borderLeft: "2px solid var(--color-rose)" }}>
            <span className="font-semibold" style={{ color: "var(--color-rose)" }}>Why for you: </span>
            <span>{reason}</span>
          </div>

          {usageTip && (
            <p className="text-xs italic text-muted-foreground mb-3">
              <span className="not-italic font-medium">Tip:</span> {usageTip}
            </p>
          )}

          {/* Key ingredients */}
          {product.keyIngredients && <KeyIngredientChips ingredients={product.keyIngredients} />}

          {/* Buy button */}
          <div className="flex items-center gap-2 flex-wrap mt-3">
            {product.zones?.slice(0, 2).map((z: string) => (
              <Badge key={z} variant="secondary" className="text-xs">
                {z.replace(/-/g, " ")}
              </Badge>
            ))}
            <div className="ml-auto flex items-center gap-2">
              {user && (
                <button onClick={() => saveProduct(product)}
                  className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 transition-colors"
                  style={{ background: savedIds.has(product.id || product.name) ? "#fef0f3" : "#f9f5f0", border: "1px solid #f0ccd6" }}
                  title="Save to profile">
                  <Heart size={14} style={{ color: savedIds.has(product.id || product.name) ? "#c9506e" : "#c0a0a8", fill: savedIds.has(product.id || product.name) ? "#c9506e" : "none" }} />
                </button>
              )}
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                data-testid={`buy-link-${index}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-white font-medium transition-opacity hover:opacity-90"
                style={{ background: "var(--color-rose)" }}
              >
                <ShoppingBag size={13} /> Buy now <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Alternatives section */}
      {hasAlternatives && (
        <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: "hsl(var(--border))" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--muted-foreground))", letterSpacing: "0.1em" }}>
            Also consider
          </p>
          {/* Tab bar */}
          <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
            {TAB_CONFIG.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              const isAvailable = tab.key === "our-pick" || !!product.alternatives?.[tab.key];
              if (!isAvailable) return null;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: isActive ? "hsl(var(--background))" : "transparent",
                    color: isActive ? tab.color : "hsl(var(--muted-foreground))",
                    boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  <Icon size={11} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {activeTab === "our-pick" && (
            <div className="rounded-xl p-4 border" style={{ background: "hsl(340 25% 97%)", borderColor: "hsl(340 30% 88%)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} style={{ color: "var(--color-rose)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-rose)" }}>Editor's pick — best overall</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This is our top recommendation for your skin profile. {product.description}
              </p>
            </div>
          )}
          {activeTab === "budget" && product.alternatives?.budget && (
            <AlternativeCard alt={product.alternatives.budget} type="budget" />
          )}
          {activeTab === "luxury" && product.alternatives?.luxury && (
            <AlternativeCard alt={product.alternatives.luxury} type="luxury" />
          )}
          {activeTab === "organic" && product.alternatives?.organic && (
            <AlternativeCard alt={product.alternatives.organic} type="organic" />
          )}
        </div>
      )}
    </article>
  );
}

export default function Results() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");

  // ALL hooks must be declared before any conditional return
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

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

  const skinAnalysis = data?.skinAnalysis;
  const recommendations = data?.recommendations;
  const imageData = data?.imageData;

  // Auto-save face scan to profile after analysis loads
  useEffect(() => {
    if (!user || !skinAnalysis || !id) return;
    fetch("/api/profile/face-scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analysisId: id,
        skinScore: skinAnalysis.overallScore || null,
        skinTone: skinAnalysis.skinTone,
        skinType: skinAnalysis.skinType,
        concerns: Array.isArray(skinAnalysis.skinConcerns) ? skinAnalysis.skinConcerns.join(", ") : skinAnalysis.skinConcerns,
      }),
    }).catch(() => {});
  }, [user, skinAnalysis?.skinType, id]);

  async function saveProduct(p: any) {
    if (!user) return;
    try {
      await fetch("/api/profile/save-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: p.id || p.name,
          productName: p.name,
          productBrand: p.brand,
          productImage: p.image,
          affiliateUrl: p.affiliateUrl,
          category: p.category,
        }),
      });
      setSavedIds(prev => new Set([...Array.from(prev), p.id || p.name]));
    } catch {}
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--background))" }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 skeleton" />
          <div className="skeleton h-5 w-48 mx-auto mb-3" />
          <div className="skeleton h-4 w-36 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !skinAnalysis) {
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

  const concerns: string[] = skinAnalysis.concerns || [];
  const products = recommendations?.recommendedProducts || [];

  return (
    <div className="min-h-screen pb-24" style={{ background: "hsl(var(--background))" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ background: "hsl(var(--background) / 0.92)", borderColor: "hsl(var(--border))" }}>
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/analyse">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft size={16} /> New analysis
            </button>
          </Link>
          <span className="ml-auto" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Your Results</span>
          <Link href="/">
            <span className="text-xs text-muted-foreground hover:text-foreground transition-colors">BlushMap</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* Login nudge if not authenticated */}
        {!user && (
          <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: "#fef0f3", border: "1px solid #f0ccd6" }}>
            <UserIcon size={14} style={{ color: "#c9506e", flexShrink: 0 }} />
            <p className="text-xs flex-1" style={{ color: "#9b6674" }}>
              <Link href="/profile"><span className="font-semibold underline cursor-pointer" style={{ color: "#c9506e" }}>Create a free account</span></Link> to save these results, track your skin over time and heart products.
            </p>
          </div>
        )}

        {/* Hero profile card — friendly summary */}
        <SkinSummaryCard
          skinAnalysis={skinAnalysis}
          recommendations={recommendations}
          imageData={imageData}
        />

        {/* Two-column: Face map + Zone breakdown */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {/* Face map */}
          <div className="rounded-2xl border p-6 flex flex-col items-center" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
            <h2 className="mb-1" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Application zones</h2>
            <p className="text-xs text-muted-foreground mb-4 text-center">Where to apply each product</p>
            <FaceZoneMap recommendations={recommendations} />
          </div>

          {/* Skin concerns */}
          <div className="rounded-2xl border p-6" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "0.25rem" }}>Skin concerns</h2>
            <p className="text-xs text-muted-foreground mb-4">Detected from your analysis</p>
            {concerns.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {concerns.map(c => (
                  <Badge key={c} variant="outline" className="capitalize text-xs">{c.replace(/-/g, " ")}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">No major concerns detected — great skin!</p>
            )}

            {/* Zone analysis */}
            {skinAnalysis.faceZones && (
              <div className="mt-2">
                <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: "hsl(var(--muted-foreground))", letterSpacing: "0.1em" }}>Zone analysis</p>
                <div className="space-y-2.5">
                  {Object.entries(skinAnalysis.faceZones as Record<string, string>).filter(([k]) => k !== "overall").slice(0, 4).map(([zone, desc]) => (
                    <div key={zone} className="text-xs leading-relaxed">
                      <span className="font-semibold capitalize" style={{ color: "hsl(var(--foreground))" }}>{zone.replace(/([A-Z])/g, " $1").toLowerCase()}: </span>
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
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "0.25rem" }}>Your routine order</h2>
            <p className="text-xs text-muted-foreground mb-5">Apply in this sequence for best results</p>
            <ol className="flex flex-wrap gap-3 items-center">
              {recommendations.routineOrder.map((step: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "var(--color-rose)" }}>{i + 1}</span>
                  <span className="font-medium">{step}</span>
                  {i < recommendations.routineOrder.length - 1 && (
                    <ChevronRight size={14} className="text-muted-foreground hidden sm:block" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Products */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}>
                Recommended for you
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {products.length} products, each curated for your skin profile
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {products.map((rec: any, i: number) => (
              <ProductCard key={rec.productId || i} rec={rec} index={i} user={user} savedIds={savedIds} saveProduct={saveProduct} />
            ))}
          </div>
        </div>

        {/* Affiliate disclosure */}
        <div className="mt-10 p-4 rounded-xl text-xs text-muted-foreground" style={{ background: "hsl(var(--muted) / 0.5)", borderLeft: "3px solid hsl(var(--border))" }}>
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
