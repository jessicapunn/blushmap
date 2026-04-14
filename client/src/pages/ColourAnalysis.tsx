import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, RefreshCw, Sparkles, Sun, Moon, Leaf, Snowflake, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RETAILERS } from "@/lib/affiliates";

// ── Types ─────────────────────────────────────────────────────────────────────
type Season = "spring" | "summer" | "autumn" | "winter" | null;

interface QuizAnswer {
  veins: string;
  jewellery: string;
  burnOrTan: string;
  naturalHair: string;
  eyeColour: string;
  skinReaction: string;
}

// ── Seasonal Palette Data ─────────────────────────────────────────────────────
const SEASON_DATA = {
  spring: {
    name: "Spring",
    subtitle: "Warm & Light",
    icon: Sun,
    gradient: "linear-gradient(135deg, #fde68a 0%, #fbb6b6 50%, #fcd34d 100%)",
    cardBg: "linear-gradient(135deg, #fff9e6 0%, #fef3f3 100%)",
    accent: "#d97706",
    description:
      "You have a warm, light colouring. Your palette celebrates soft golden tones — think fresh peach, warm ivory, coral and golden yellow. Avoid muddy, dark or cool shades.",
    undertone: "Warm golden",
    characteristics: [
      "Veins appear blue-green",
      "Gold jewellery flatters more",
      "Tans easily, rarely burns",
      "Natural warm golden glow",
    ],
    palette: [
      { name: "Warm Ivory", hex: "#f5ede0" },
      { name: "Peach Blush", hex: "#f7c5a8" },
      { name: "Coral Pink", hex: "#f4845f" },
      { name: "Golden Yellow", hex: "#f6ca45" },
      { name: "Warm Terracotta", hex: "#c67c52" },
      { name: "Olive Green", hex: "#8d9e5b" },
      { name: "Camel", hex: "#c9a06e" },
      { name: "Warm Brown", hex: "#8b6040" },
    ],
    avoid: ["Cool grey", "Black", "Icy blue", "Fuchsia"],
    makeup: {
      foundation: "Warm beige / golden undertone",
      blush: "Peach, coral, warm rose",
      lips: "Coral red, warm nude, peach",
      eyeshadow: "Bronze, warm gold, terracotta, copper",
      highlighter: "Champagne, golden pearl",
    },
    celebrities: ["Jennifer Aniston", "Blake Lively", "Amber Heard"],
    recs: [
      { name: "Pillow Talk Lipstick", brand: "Charlotte Tilbury", q: "Charlotte Tilbury Pillow Talk lipstick" },
      { name: "Orgasm Blush", brand: "NARS", q: "NARS Orgasm blush" },
      { name: "Satin Taupe Eyeshadow", brand: "MAC", q: "MAC Satin Taupe eyeshadow" },
      { name: "Matte Bronzer", brand: "Charlotte Tilbury", q: "Charlotte Tilbury airbrush bronzer" },
    ],
  },
  summer: {
    name: "Summer",
    subtitle: "Cool & Light",
    icon: Snowflake,
    gradient: "linear-gradient(135deg, #bfdbfe 0%, #e9d5ff 50%, #fbcfe8 100%)",
    cardBg: "linear-gradient(135deg, #f0f7ff 0%, #fdf4ff 100%)",
    accent: "#7c3aed",
    description:
      "You have a cool, soft colouring. Your palette lives in muted, powdery tones — think dusty rose, lavender, soft blue and icy pink. Avoid anything too orange, yellow or earthy.",
    undertone: "Cool pink/blue",
    characteristics: [
      "Veins appear blue or purple",
      "Silver jewellery suits best",
      "Burns easily, tans minimally",
      "Skin has pink or rosy undertone",
    ],
    palette: [
      { name: "Icy Pink", hex: "#f5c6d0" },
      { name: "Dusty Rose", hex: "#c8869e" },
      { name: "Lavender", hex: "#c3aed6" },
      { name: "Soft Blue", hex: "#a0c4e0" },
      { name: "Mauve", hex: "#b07090" },
      { name: "Cool Taupe", hex: "#a89090" },
      { name: "Sage Green", hex: "#a0b8a0" },
      { name: "Soft White", hex: "#f4f2f5" },
    ],
    avoid: ["Orange", "Golden yellow", "Warm brown", "Very dark black"],
    makeup: {
      foundation: "Cool pink / neutral undertone",
      blush: "Soft pink, dusty rose, berry",
      lips: "Rose pink, berry, cool nude",
      eyeshadow: "Mauve, dusty pink, cool brown, silver",
      highlighter: "Pearl, icy pink, champagne silver",
    },
    celebrities: ["Nicole Kidman", "Cate Blanchett", "Taylor Swift"],
    recs: [
      { name: "Deep Throat Blush", brand: "NARS", q: "NARS Deep Throat blush" },
      { name: "Myth Lipstick", brand: "MAC", q: "MAC Myth lipstick" },
      { name: "Soft Pinch Blush", brand: "Rare Beauty", q: "Rare Beauty Soft Pinch blush" },
      { name: "Pillow Talk Palette", brand: "Charlotte Tilbury", q: "Charlotte Tilbury Pillow Talk palette" },
    ],
  },
  autumn: {
    name: "Autumn",
    subtitle: "Warm & Deep",
    icon: Leaf,
    gradient: "linear-gradient(135deg, #fed7aa 0%, #fca5a5 50%, #d97706 100%)",
    cardBg: "linear-gradient(135deg, #fff8f0 0%, #fef5ee 100%)",
    accent: "#b45309",
    description:
      "You have a warm, deep colouring. Rich, earthy tones are your power palette — think burnt orange, rust, chocolate brown, olive and mustard. You carry deep shades beautifully.",
    undertone: "Deep warm/golden",
    characteristics: [
      "Veins appear green",
      "Gold jewellery is most flattering",
      "Tans deeply and easily",
      "Rich, earthy skin tone",
    ],
    palette: [
      { name: "Rust", hex: "#c45c3a" },
      { name: "Burnt Sienna", hex: "#a04030" },
      { name: "Mustard", hex: "#c8902a" },
      { name: "Olive", hex: "#6b7a30" },
      { name: "Chocolate", hex: "#5a3020" },
      { name: "Warm Khaki", hex: "#8a7a50" },
      { name: "Deep Teal", hex: "#2a5a58" },
      { name: "Warm Cream", hex: "#f0e0c0" },
    ],
    avoid: ["Pastel pink", "Icy blue", "Cool grey", "Bright white"],
    makeup: {
      foundation: "Warm beige to deep golden",
      blush: "Warm peach, terracotta, brick",
      lips: "Burnt sienna, warm red, nude brown",
      eyeshadow: "Bronze, copper, deep brown, olive, gold",
      highlighter: "Bronze, champagne, warm gold",
    },
    celebrities: ["Beyoncé", "Lupita Nyong'o", "Priyanka Chopra"],
    recs: [
      { name: "Walk of No Shame Lipstick", brand: "Charlotte Tilbury", q: "Charlotte Tilbury Walk of No Shame" },
      { name: "Laguna Bronzer", brand: "NARS", q: "NARS Laguna Bronzer" },
      { name: "Copper Eye Quad", brand: "Charlotte Tilbury", q: "Charlotte Tilbury copper eye quad" },
      { name: "Stunna Lip Paint Uncensored", brand: "Fenty Beauty", q: "Fenty Beauty Stunna Lip Paint Uncensored" },
    ],
  },
  winter: {
    name: "Winter",
    subtitle: "Cool & Deep",
    icon: Moon,
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #be185d 100%)",
    cardBg: "linear-gradient(135deg, #f5f0ff 0%, #fdf4f8 100%)",
    accent: "#6d28d9",
    description:
      "You have a cool, deep colouring. High contrast is your signature — bold jewel tones, true white, black and rich berry shades look stunning. Avoid muted, warm or powdery tones.",
    undertone: "Cool blue/pink",
    characteristics: [
      "Veins appear blue or purple",
      "Silver and platinum jewellery",
      "Rarely tans, burns before tanning",
      "High contrast between features",
    ],
    palette: [
      { name: "True Red", hex: "#cc1a2a" },
      { name: "Royal Purple", hex: "#5a1090" },
      { name: "Deep Navy", hex: "#1a1a50" },
      { name: "Emerald", hex: "#1a6a40" },
      { name: "Fuchsia", hex: "#cc1a70" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Icy White", hex: "#f4f4f8" },
      { name: "Berry", hex: "#8a1a4a" },
    ],
    avoid: ["Orange", "Camel", "Warm beige", "Muted earthy tones"],
    makeup: {
      foundation: "Cool-neutral / pink undertone",
      blush: "Cool pink, berry, deep rose",
      lips: "True red, berry, deep plum",
      eyeshadow: "Charcoal, deep purple, silver, icy pink",
      highlighter: "Icy pearl, cool silver, holographic",
    },
    celebrities: ["Dua Lipa", "Zendaya", "Megan Fox"],
    recs: [
      { name: "Ruby Woo Lipstick", brand: "MAC", q: "MAC Ruby Woo lipstick" },
      { name: "Cruella Lipstick", brand: "NARS", q: "NARS Cruella lipstick" },
      { name: "Love Liberty Blush", brand: "Charlotte Tilbury", q: "Charlotte Tilbury Love Liberty blush" },
      { name: "Smokey Eye Quad", brand: "Charlotte Tilbury", q: "Charlotte Tilbury smoked eye palette" },
    ],
  },
};

// ── Quiz steps ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "veins",
    question: "Look at the veins on your inner wrist. What colour do they appear?",
    options: [
      { label: "Green or yellow-green", value: "green", hint: "Indicates warm undertone" },
      { label: "Blue or purple", value: "blue", hint: "Indicates cool undertone" },
      { label: "Blue-green", value: "blue-green", hint: "Neutral undertone" },
      { label: "Hard to tell", value: "unsure", hint: "Try in natural daylight" },
    ],
  },
  {
    id: "jewellery",
    question: "Which jewellery metal tends to look better on your skin?",
    options: [
      { label: "Gold — it makes me glow", value: "gold", hint: "Warm undertone" },
      { label: "Silver — crisp and sharp", value: "silver", hint: "Cool undertone" },
      { label: "Both suit me equally", value: "both", hint: "Neutral undertone" },
      { label: "I'm not sure", value: "unsure", hint: "" },
    ],
  },
  {
    id: "burnOrTan",
    question: "How does your skin react to sun exposure?",
    options: [
      { label: "I tan quickly and rarely burn", value: "tan", hint: "Warm undertone" },
      { label: "I burn first, then tan gradually", value: "burn-then-tan", hint: "Mixed" },
      { label: "I burn and rarely tan", value: "burn", hint: "Cool undertone" },
      { label: "I have a deep skin tone that doesn't visibly change", value: "deep", hint: "All undertones" },
    ],
  },
  {
    id: "naturalHair",
    question: "What is your natural hair colour?",
    options: [
      { label: "Golden blonde, strawberry blonde or auburn", value: "warm-blonde", hint: "Warm" },
      { label: "Ash blonde, mousy or cool brown", value: "cool-blonde", hint: "Cool" },
      { label: "Deep brown or black with warm tones", value: "warm-dark", hint: "Warm to neutral" },
      { label: "Deep black or dark brown with no warmth", value: "cool-dark", hint: "Cool" },
    ],
  },
  {
    id: "eyeColour",
    question: "What is your eye colour?",
    options: [
      { label: "Blue or grey", value: "blue", hint: "Often cool" },
      { label: "Green or hazel", value: "green", hint: "Often warm or neutral" },
      { label: "Light brown or amber", value: "light-brown", hint: "Often warm" },
      { label: "Dark brown or near-black", value: "dark-brown", hint: "Deep, warm or cool" },
    ],
  },
  {
    id: "skinReaction",
    question: "Which colours make you look most radiant when held near your face?",
    options: [
      { label: "Peach, coral, warm yellow, olive", value: "warm", hint: "→ Spring or Autumn" },
      { label: "Soft pink, lavender, dusty rose", value: "cool-light", hint: "→ Summer" },
      { label: "Bold jewel tones: fuchsia, emerald, cobalt", value: "cool-deep", hint: "→ Winter" },
      { label: "Rich earth tones: rust, mustard, warm brown", value: "deep-warm", hint: "→ Autumn" },
    ],
  },
];

// ── Scoring logic ─────────────────────────────────────────────────────────────
function calculateSeason(answers: Partial<QuizAnswer>): Season {
  let warm = 0, cool = 0, light = 0, deep = 0;

  const v = answers.veins;
  if (v === "green") warm += 2;
  if (v === "blue") cool += 2;
  if (v === "blue-green") { warm += 1; cool += 1; }

  const j = answers.jewellery;
  if (j === "gold") warm += 2;
  if (j === "silver") cool += 2;

  const b = answers.burnOrTan;
  if (b === "tan") { warm += 1; deep += 1; }
  if (b === "burn") { cool += 1; light += 2; }
  if (b === "burn-then-tan") light += 1;
  if (b === "deep") deep += 2;

  const h = answers.naturalHair;
  if (h === "warm-blonde" || h === "warm-dark") warm += 2;
  if (h === "cool-blonde" || h === "cool-dark") cool += 2;
  if (h === "warm-dark" || h === "cool-dark") deep += 1;

  const e = answers.eyeColour;
  if (e === "blue") { cool += 1; light += 1; }
  if (e === "green") warm += 1;
  if (e === "light-brown") { warm += 1; light += 1; }
  if (e === "dark-brown") deep += 2;

  const s = answers.skinReaction;
  if (s === "warm") warm += 3;
  if (s === "cool-light") { cool += 2; light += 2; }
  if (s === "cool-deep") { cool += 2; deep += 2; }
  if (s === "deep-warm") { warm += 1; deep += 2; }

  const isWarm = warm >= cool;
  const isDeep = deep >= light;

  if (isWarm && !isDeep) return "spring";
  if (!isWarm && !isDeep) return "summer";
  if (isWarm && isDeep) return "autumn";
  return "winter";
}

// ── Colour swatch ─────────────────────────────────────────────────────────────
function Swatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-10 h-10 rounded-xl shadow-sm" style={{ background: hex, border: "1.5px solid rgba(0,0,0,0.07)" }} />
      <span className="text-[10px] text-center leading-tight" style={{ color: "#9b6674", maxWidth: "7ch" }}>{name}</span>
    </div>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────
function ResultCard({ season }: { season: Season }) {
  if (!season) return null;
  const data = SEASON_DATA[season];
  const Icon = data.icon;
  const lf = RETAILERS.find(r => r.id === "lookfantastic")!;
  const ct = RETAILERS.find(r => r.id === "charlotte-tilbury")!;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-3xl overflow-hidden text-center p-8" style={{ background: data.cardBg, border: "1.5px solid rgba(0,0,0,0.06)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: data.gradient }}>
          <Icon size={28} style={{ color: "white" }} />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: data.accent }}>
          Your Season
        </p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", color: "#1a0a0e", lineHeight: 1.1 }}>
          {data.name}
        </h2>
        <p className="text-sm font-medium mt-1 mb-3" style={{ color: data.accent }}>{data.subtitle}</p>
        <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: "#5a3a42" }}>{data.description}</p>
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mt-4" style={{ background: data.accent + "18", color: data.accent }}>
          Undertone: {data.undertone}
        </div>
      </div>

      {/* Characteristics */}
      <div className="rounded-2xl p-5" style={{ background: "#fff8f9", border: "1px solid #f0ccd6" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c9506e", letterSpacing: "0.12em" }}>Your Characteristics</p>
        <div className="grid grid-cols-2 gap-3">
          {data.characteristics.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: data.accent }} />
              <p className="text-sm" style={{ color: "#5a3a42" }}>{c}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Colour Palette */}
      <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #f0ccd6" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c9506e", letterSpacing: "0.12em" }}>Your Colour Palette</p>
        <div className="flex flex-wrap gap-4">
          {data.palette.map((c) => <Swatch key={c.name} hex={c.hex} name={c.name} />)}
        </div>
        <div className="mt-5 pt-4 border-t" style={{ borderColor: "#f0ccd6" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "#c9506e" }}>Avoid</p>
          <div className="flex flex-wrap gap-2">
            {data.avoid.map((a) => (
              <span key={a} className="text-xs px-3 py-1 rounded-full" style={{ background: "#f5f0f0", color: "#9b6674", border: "1px solid #f0ccd6" }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Makeup Guide */}
      <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #f0ccd6" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c9506e", letterSpacing: "0.12em" }}>Makeup Guide</p>
        <div className="space-y-3">
          {Object.entries(data.makeup).map(([key, val]) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <p className="text-xs font-semibold capitalize w-28 flex-shrink-0" style={{ color: "#1a0a0e" }}>{key}</p>
              <p className="text-xs text-right" style={{ color: "#5a3a42" }}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Recommendations */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c9506e", letterSpacing: "0.12em" }}>Curated For Your Season</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.recs.map((rec) => (
            <div key={rec.name} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: "white", border: "1px solid #f0ccd6" }}>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#c9944a" }}>{rec.brand}</p>
                <p className="text-sm font-semibold" style={{ color: "#1a0a0e" }}>{rec.name}</p>
              </div>
              <div className="flex gap-2">
                <a href={lf.buildLink(rec.q)} target="_blank" rel="noopener noreferrer sponsored"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}>
                  Shop
                </a>
                <a href={ct.buildLink(rec.q)} target="_blank" rel="noopener noreferrer sponsored"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: "#fef0f3", color: "#c9506e", border: "1px solid #f0ccd6" }}>
                  CT
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Celebrities */}
      <div className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg, #fff0f4, #fff8f0)", border: "1px solid #f0ccd6" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#c9506e" }}>Celebrity {data.name}s</p>
        <p className="text-sm" style={{ color: "#5a3a42" }}>{data.celebrities.join(" · ")}</p>
      </div>

      {/* Shop all palette products */}
      <div className="rounded-2xl p-5" style={{ background: "#fff8f9", border: "1px solid #f0ccd6" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c9506e" }}>Shop Your Full Palette</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RETAILERS.slice(0, 6).map((r) => (
            <a key={r.id}
              href={r.buildLink(`${data.name} season ${data.makeup.lips} makeup`)}
              target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:opacity-90"
              style={{ background: "white", border: "1px solid #f0ccd6", color: "#1a0a0e" }}>
              <span>{r.logo}</span>
              <span className="truncate">{r.name}</span>
              <ExternalLink size={10} style={{ color: "#c9506e", marginLeft: "auto", flexShrink: 0 }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ColourAnalysis() {
  const [step, setStep] = useState(0); // 0 = intro
  const [answers, setAnswers] = useState<Partial<QuizAnswer>>({});
  const [season, setSeason] = useState<Season>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const quizStarted = step > 0 && step <= STEPS.length;
  const quizDone = season !== null;
  const currentStep = STEPS[step - 1];

  function handleAnswer(value: string) {
    const key = currentStep.id as keyof QuizAnswer;
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (step < STEPS.length) {
      setStep(step + 1);
    } else {
      // Last step — compute
      const result = calculateSeason(newAnswers);
      setSeason(result);
      setStep(STEPS.length + 1);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setSeason(null);
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-pink-50"
              style={{ border: "1.5px solid #f0ccd6", color: "#9b6674" }}>
              <ArrowLeft size={16} />
            </button>
          </Link>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "#1a0a0e", lineHeight: 1.1 }}>
              Colour Analysis
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#9b6674" }}>Find your season · discover your perfect palette</p>
          </div>
          {quizDone && (
            <button onClick={reset} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{ background: "#fef0f3", color: "#c9506e", border: "1px solid #f0ccd6" }}>
              <RefreshCw size={11} /> Retake
            </button>
          )}
        </div>

        {/* Intro */}
        {!quizStarted && !quizDone && (
          <div className="space-y-6">
            <div className="rounded-3xl p-8 text-center" style={{ background: "linear-gradient(135deg, #fef0f3 0%, #fff8f0 100%)", border: "1px solid #f0ccd6" }}>
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, #c9506e, #e8a0b0)" }}>
                <Sparkles size={32} style={{ color: "white" }} />
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "#1a0a0e", marginBottom: "0.75rem" }}>
                Discover your colour season
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#5a3a42", maxWidth: "40ch", margin: "0 auto 1.5rem" }}>
                Answer 6 quick questions and we'll identify whether you're a Spring, Summer, Autumn or Winter — then match you with your perfect makeup palette.
              </p>
              <Button onClick={() => setStep(1)} size="lg"
                className="gap-2 text-white font-semibold px-8"
                style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)", border: "none" }}>
                <Sparkles size={15} /> Start my analysis
              </Button>
            </div>

            {/* Season preview cards */}
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(SEASON_DATA) as [Season, typeof SEASON_DATA.spring][]).map(([key, data]) => {
                const Icon = data.icon;
                return (
                  <div key={key} className="rounded-2xl p-5 text-center"
                    style={{ background: data.cardBg, border: "1px solid rgba(0,0,0,0.06)", cursor: "default" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: data.gradient }}>
                      <Icon size={18} style={{ color: "white" }} />
                    </div>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#1a0a0e" }}>{data.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: data.accent }}>{data.subtitle}</p>
                    <div className="flex justify-center gap-1.5 mt-3">
                      {data.palette.slice(0, 4).map(c => (
                        <div key={c.name} className="w-5 h-5 rounded-full" style={{ background: c.hex, border: "1.5px solid rgba(0,0,0,0.08)" }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quiz */}
        {quizStarted && currentStep && (
          <div className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium" style={{ color: "#9b6674" }}>Question {step} of {STEPS.length}</p>
                <p className="text-xs font-medium" style={{ color: "#c9506e" }}>{Math.round((step / STEPS.length) * 100)}%</p>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "#f0ccd6" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(step / STEPS.length) * 100}%`, background: "linear-gradient(90deg, #c9506e, #e8a0b0)" }} />
              </div>
            </div>

            {/* Question */}
            <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid #f0ccd6" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "#1a0a0e", lineHeight: 1.4, marginBottom: "1.5rem" }}>
                {currentStep.question}
              </h2>
              <div className="space-y-2.5">
                {currentStep.options.map((opt) => (
                  <button key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    onMouseEnter={() => setHovered(opt.value)}
                    onMouseLeave={() => setHovered(null)}
                    className="w-full flex items-center justify-between p-4 rounded-xl text-left transition-all"
                    style={{
                      background: hovered === opt.value ? "#fef0f3" : "#fff8f9",
                      border: `1.5px solid ${hovered === opt.value ? "#c9506e" : "#f0ccd6"}`,
                    }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#1a0a0e" }}>{opt.label}</p>
                      {opt.hint && <p className="text-xs mt-0.5" style={{ color: "#9b6674" }}>{opt.hint}</p>}
                    </div>
                    <ChevronRight size={16} style={{ color: "#c9506e", flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>

            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="text-xs flex items-center gap-1" style={{ color: "#9b6674" }}>
                <ArrowLeft size={12} /> Back
              </button>
            )}
          </div>
        )}

        {/* Result */}
        {quizDone && <ResultCard season={season} />}
      </div>
    </div>
  );
}
