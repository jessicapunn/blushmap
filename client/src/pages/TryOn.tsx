import { useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft, Camera, Upload, ShoppingBag, Heart, ScanLine, Check, ChevronDown, ChevronRight, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBasket } from "@/lib/basket";
import { BlushMapLogoInline } from "@/components/BlushMapLogo";
import { NavBar } from "@/components/NavBar";

// ── Product data ──────────────────────────────────────────────────────────────
interface Shade { name: string; hex: string; swatchImg?: string; }
interface TryProduct {
  id: string; name: string; brand: string; price: string;
  category: "lipstick" | "lip-liner" | "blush" | "eyeshadow" | "highlighter" | "bronzer";
  shades: Shade[];
  image: string; affiliateUrl: string;
  bestseller?: boolean; newIn?: boolean;
}

const amz = (q: string) => `https://www.amazon.co.uk/s?k=${encodeURIComponent(q)}&tag=blushmap-21`;

const MAKEUP: TryProduct[] = [
  // ── Lipsticks ──
  { id:"kl-lip-1", name:"Kylie Lip Kit", brand:"Kylie Cosmetics", price:"£35", category:"lipstick",
    image:"https://images.unsplash.com/photo-1631730358585-38a4935cbec4?w=400&q=80",
    affiliateUrl: amz("Kylie Cosmetics Lip Kit"),
    bestseller: true,
    shades:[
      {name:"Dolce K",hex:"#c1694f"},{name:"Candy K",hex:"#db7c6e"},{name:"True Brown K",hex:"#8b5e4e"},
      {name:"22",hex:"#8b2020"},{name:"Posie K",hex:"#d4826e"},{name:"Koko K",hex:"#e8b4a0"},
    ]},
  { id:"ct-lip-1", name:"Pillow Talk Lipstick", brand:"Charlotte Tilbury", price:"£29",  category:"lipstick",
    image:"https://images.unsplash.com/photo-1586495777744-4e6232bf2d22?w=400&q=80",
    affiliateUrl: amz("Charlotte Tilbury Pillow Talk lipstick"),
    bestseller: true,
    shades:[
      {name:"Pillow Talk",hex:"#d4927e"},{name:"Walk of No Shame",hex:"#b5463a"},{name:"Love Liberty",hex:"#c96878"},
      {name:"Superstar",hex:"#9b3030"},{name:"Very Victoria",hex:"#b88070"},{name:"Pinkgasm",hex:"#e0a090"},
    ]},
  { id:"nars-lip-1", name:"Satin Lipstick", brand:"NARS", price:"£27", category:"lipstick",
    image:"https://images.unsplash.com/photo-1631730358585-38a4935cbec4?w=400&q=80",
    affiliateUrl: amz("NARS satin lipstick"),
    shades:[
      {name:"Dolce Vita",hex:"#c07068"},{name:"Heat Wave",hex:"#c84040"},{name:"Cruella",hex:"#8b1a1a"},
      {name:"Catfight",hex:"#d48070"},{name:"Dragon Girl",hex:"#cc2222"},{name:"Barbara",hex:"#cc4060"},
    ]},
  { id:"mac-lip-1", name:"Matte Lipstick", brand:"MAC", price:"£22", category:"lipstick",
    image:"https://images.unsplash.com/photo-1631214499182-e37c7dc30a3a?w=400&q=80",
    affiliateUrl: amz("MAC matte lipstick"),
    shades:[
      {name:"Ruby Woo",hex:"#c0272d"},{name:"Velvet Teddy",hex:"#a07060"},{name:"Whirl",hex:"#907060"},
      {name:"Chili",hex:"#a03030"},{name:"Candy Yum-Yum",hex:"#f060a0"},{name:"Mocha",hex:"#906050"},
    ]},
  { id:"fenty-lip-1", name:"Stunna Lip Paint", brand:"Fenty Beauty", price:"£22", category:"lipstick",
    image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    newIn: true,
    affiliateUrl: amz("Fenty Stunna Lip Paint"),
    shades:[
      {name:"Uncensored",hex:"#c02020"},{name:"Undefeated",hex:"#d08070"},{name:"Unlocked",hex:"#b06050"},
      {name:"Uninvited",hex:"#d0a090"},{name:"Unlinked",hex:"#c04060"},{name:"Universal",hex:"#a03050"},
    ]},
  // ── Blush ──
  { id:"nars-blush-1", name:"Orgasm Blush", brand:"NARS", price:"£31", category:"blush",
    image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    bestseller: true,
    affiliateUrl: amz("NARS Orgasm blush"),
    shades:[
      {name:"Orgasm",hex:"#d4826e"},{name:"Deep Throat",hex:"#e0a8a0"},{name:"Goulue",hex:"#c87060"},
      {name:"Amour",hex:"#c06070"},{name:"Sin",hex:"#9b3040"},
    ]},
  { id:"rare-blush-1", name:"Soft Pinch Liquid Blush", brand:"Rare Beauty", price:"£23", category:"blush",
    image:"https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&q=80",
    bestseller: true, newIn: true,
    affiliateUrl: amz("Rare Beauty Soft Pinch liquid blush"),
    shades:[
      {name:"Happy",hex:"#e07870"},{name:"Joy",hex:"#d06870"},{name:"Lucky",hex:"#d09070"},
      {name:"Love",hex:"#c85060"},{name:"Grateful",hex:"#c07060"},{name:"Bliss",hex:"#e09080"},
    ]},
  { id:"ct-blush-1", name:"Cheek to Chic Blush", brand:"Charlotte Tilbury", price:"£33", category:"blush",
    image:"https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?w=400&q=80",
    affiliateUrl: amz("Charlotte Tilbury Cheek to Chic"),
    shades:[
      {name:"Love is the Drug",hex:"#d0806a"},{name:"Pillow Talk",hex:"#d0907e"},{name:"Super Nudes",hex:"#c8a090"},
      {name:"First Love",hex:"#d07070"},
    ]},
  // ── Eyeshadow ──
  { id:"kl-eye-1", name:"Kyshadow Palette", brand:"Kylie Cosmetics", price:"£40", category:"eyeshadow",
    image:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80",
    bestseller: true,
    affiliateUrl: amz("Kylie Cosmetics Kyshadow"),
    shades:[
      {name:"Bronze",hex:"#8b5e3c"},{name:"Rose Gold",hex:"#c9835c"},{name:"Burgundy",hex:"#6b2030"},
      {name:"Nude",hex:"#c8a480"},{name:"Smoky",hex:"#504050"},{name:"Gold",hex:"#c9944a"},
    ]},
  { id:"ct-eye-1", name:"Luxury Palette", brand:"Charlotte Tilbury", price:"£65", category:"eyeshadow",
    image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    newIn: true,
    affiliateUrl: amz("Charlotte Tilbury eyeshadow palette"),
    shades:[
      {name:"The Bella Sofia",hex:"#a06858"},{name:"Pillow Talk",hex:"#d0907e"},{name:"Walk of No Shame",hex:"#c84838"},
      {name:"Golden Goddess",hex:"#c8904a"},{name:"The Vintage Vamp",hex:"#7b3040"},
    ]},
  { id:"nars-eye-1", name:"Eyeshadow Palette", brand:"NARS", price:"£55", category:"eyeshadow",
    image:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80",
    affiliateUrl: amz("NARS eyeshadow palette"),
    shades:[
      {name:"Suede",hex:"#907068"},{name:"Astoria",hex:"#c8a080"},{name:"Charade",hex:"#5a4040"},
      {name:"Bliss",hex:"#b07868"},{name:"Ignition",hex:"#a85040"},
    ]},
  // ── Highlighter ──
  { id:"ct-high-1", name:"Beam Highlighter", brand:"Charlotte Tilbury", price:"£38", category:"highlighter",
    image:"https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?w=400&q=80",
    bestseller: true,
    affiliateUrl: amz("Charlotte Tilbury Beam Highlighter"),
    shades:[
      {name:"Moonbeam",hex:"#e8d8b8"},{name:"Pink Venus",hex:"#e8b8b8"},{name:"Ice Goddess",hex:"#dce8e8"},
      {name:"Bronze Venus",hex:"#c8a870"},
    ]},
  { id:"fenty-high-1", name:"Killawatt Highlighter", brand:"Fenty Beauty", price:"£28", category:"highlighter",
    image:"https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&q=80",
    affiliateUrl: amz("Fenty Killawatt highlighter"),
    shades:[
      {name:"Trophy Wife",hex:"#c8a830"},{name:"Moscow Mule",hex:"#c8b898"},{name:"Lightning Dust",hex:"#e0d0b0"},
      {name:"Ginger Binge",hex:"#c09060"},
    ]},
  // ── Bronzer ──
  { id:"ct-bron-1", name:"Film Star Bronze & Glow", brand:"Charlotte Tilbury", price:"£55", category:"bronzer",
    image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    affiliateUrl: amz("Charlotte Tilbury Film Star Bronze Glow"),
    shades:[
      {name:"Light/Medium",hex:"#c8906858"},{name:"Medium/Dark",hex:"#a87048"},{name:"Fair",hex:"#d8a880"},
    ]},
];

const CATEGORIES = [
  { id: "all",         label: "All" },
  { id: "lipstick",   label: "Lip Colours" },
  { id: "blush",      label: "Blush" },
  { id: "eyeshadow",  label: "Eye" },
  { id: "highlighter",label: "Highlight" },
  { id: "bronzer",    label: "Bronzer" },
];

const BRANDS = ["All Brands", "Kylie Cosmetics", "Charlotte Tilbury", "NARS", "MAC", "Fenty Beauty", "Rare Beauty"];

// ── Overlay blend modes by category ──────────────────────────────────────────
function getOverlayStyle(category: string, hex: string, opacity: number) {
  const base = { position: "absolute" as const, pointerEvents: "none" as const, transition: "all 0.3s ease" };
  switch (category) {
    case "lipstick":
    case "lip-liner":
      return { ...base, bottom: "28%", left: "50%", transform: "translateX(-50%)", width: "32%", height: "9%",
               background: hex, borderRadius: "50% 50% 45% 45%", opacity, mixBlendMode: "multiply" as const };
    case "blush":
      return { ...base, top: "48%", left: "20%", width: "24%", height: "14%",
               background: hex, borderRadius: "50%", opacity: opacity * 0.7, filter: "blur(10px)", mixBlendMode: "multiply" as const };
    case "eyeshadow":
      return { ...base, top: "30%", left: "30%", width: "40%", height: "12%",
               background: `linear-gradient(180deg, ${hex}cc, ${hex}44)`, borderRadius: "50%", opacity: opacity * 0.8, filter: "blur(4px)", mixBlendMode: "multiply" as const };
    case "highlighter":
      return { ...base, top: "38%", left: "28%", width: "44%", height: "20%",
               background: hex, borderRadius: "50%", opacity: opacity * 0.4, filter: "blur(12px)", mixBlendMode: "screen" as const };
    case "bronzer":
      return { ...base, top: "30%", left: "15%", width: "70%", height: "45%",
               background: hex, borderRadius: "50%", opacity: opacity * 0.25, filter: "blur(20px)", mixBlendMode: "multiply" as const };
    default:
      return { ...base, opacity: 0 };
  }
}

export default function TryOn() {
  const { add, save, unsave, isSaved, isInBasket } = useBasket();
  const [category,    setCategory]    = useState("all");
  const [brand,       setBrand]       = useState("All Brands");
  const [selected,    setSelected]    = useState<TryProduct | null>(null);
  const [activeShade, setActiveShade] = useState<Shade | null>(null);
  const [intensity,   setIntensity]   = useState(0.6);
  const [faceImg,     setFaceImg]     = useState<string | null>(null);
  const [added,       setAdded]       = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = MAKEUP.filter(p =>
    (category === "all" || p.category === category) &&
    (brand === "All Brands" || p.brand === brand)
  );

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setFaceImg(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleAddToBasket(product: TryProduct) {
    if (!activeShade) return;
    add({
      id: `${product.id}-${activeShade.name}`,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      affiliateUrl: product.affiliateUrl,
      category: product.category,
      shade: activeShade.name,
    });
    setAdded(prev => new Set([...Array.from(prev), product.id]));
    setTimeout(() => setAdded(prev => { const n = new Set(prev); n.delete(product.id); return n; }), 2000);
  }

  function handleSave(product: TryProduct) {
    const item = { id: product.id, name: product.name, brand: product.brand, price: product.price,
      image: product.image, affiliateUrl: product.affiliateUrl, category: product.category };
    if (isSaved(product.id)) unsave(product.id);
    else save(item);
  }

  return (
    <div className="min-h-screen" style={{ background: "#fff8f9" }}>
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>Virtual Try-On</h1>
          <p className="text-sm" style={{ color: "#9b6674", maxWidth: "38ch", margin: "0 auto" }}>
            Upload your photo, pick a shade and see how it looks on you — then add to bag in one tap.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left: face canvas */}
          <div>
            <div className="relative rounded-3xl overflow-hidden" style={{ background: "#fff", border: "1px solid #f0ccd6", aspectRatio: "3/4", minHeight: 320 }}>
              {faceImg ? (
                <>
                  <img src={faceImg} alt="Your face" className="absolute inset-0 w-full h-full object-cover" />
                  {/* Shade overlay */}
                  {selected && activeShade && (
                    <div style={getOverlayStyle(selected.category, activeShade.hex, intensity)} />
                  )}
                  {/* Second overlay for blush (right side mirror) */}
                  {selected?.category === "blush" && activeShade && (
                    <div style={{ ...getOverlayStyle("blush", activeShade.hex, intensity), left: "auto", right: "20%" }} />
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#fef0f3" }}>
                    <Camera size={32} style={{ color: "#f0ccd6" }} />
                  </div>
                  <p className="text-sm font-medium text-center px-8" style={{ color: "#9b6674", maxWidth: "22ch" }}>
                    Upload a straight-on photo for the best try-on result
                  </p>
                  <Button onClick={() => fileRef.current?.click()}
                    className="gap-2 text-sm text-white border-0"
                    style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}>
                    <Upload size={14} /> Upload photo
                  </Button>
                </div>
              )}
              {faceImg && (
                <button onClick={() => fileRef.current?.click()}
                  className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
                  <Upload size={11} /> Change photo
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

            {/* Intensity slider */}
            {selected && activeShade && (
              <div className="mt-4 px-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: "#9b6674" }}>Intensity</span>
                  <span className="text-xs" style={{ color: "#c9506e" }}>{Math.round(intensity * 100)}%</span>
                </div>
                <input type="range" min={10} max={90} value={Math.round(intensity * 100)}
                  onChange={e => setIntensity(Number(e.target.value) / 100)}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "#c9506e", background: `linear-gradient(to right, #c9506e ${intensity * 100}%, #f0ccd6 ${intensity * 100}%)` }}
                />
              </div>
            )}

            {/* Active selection */}
            {selected && activeShade && (
              <div className="mt-4 p-4 rounded-2xl flex items-center gap-3" style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: activeShade.hex, border: "2px solid rgba(0,0,0,0.08)" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: "#1a0a0e" }}>{selected.name}</div>
                  <div className="text-xs" style={{ color: "#9b6674" }}>{selected.brand} · {activeShade.name}</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: "#c9506e" }}>{selected.price}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSave(selected)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                    style={{ background: isSaved(selected.id) ? "#fef0f3" : "#f9f5f0", border: "1px solid #f0ccd6" }}>
                    <Heart size={15} style={{ color: isSaved(selected.id) ? "#c9506e" : "#c0a0a8", fill: isSaved(selected.id) ? "#c9506e" : "none" }} />
                  </button>
                  <button onClick={() => handleAddToBasket(selected)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: added.has(selected.id) ? "#22a165" : "linear-gradient(135deg, #c9506e, #a3324e)" }}>
                    {added.has(selected.id) ? <><Check size={13} /> Added!</> : <><ShoppingBag size={13} /> Add to bag</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: products */}
          <div>
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: category === c.id ? "linear-gradient(135deg, #c9506e, #a3324e)" : "#fff",
                    color: category === c.id ? "#fff" : "#9b6674",
                    border: `1.5px solid ${category === c.id ? "transparent" : "#f0ccd6"}`,
                  }}>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Brand filter */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
              {BRANDS.map(b => (
                <button key={b} onClick={() => setBrand(b)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all"
                  style={{
                    background: brand === b ? "#fef0f3" : "transparent",
                    color: brand === b ? "#c9506e" : "#9b6674",
                    border: `1px solid ${brand === b ? "#f0ccd6" : "#e8e0e0"}`,
                  }}>
                  {b}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
              {filtered.map(product => (
                <div key={product.id}
                  className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-md"
                  style={{
                    background: "#fff",
                    border: `2px solid ${selected?.id === product.id ? "#c9506e" : "#f0ccd6"}`,
                    transform: selected?.id === product.id ? "scale(1.02)" : "scale(1)",
                  }}
                  onClick={() => { setSelected(product); setActiveShade(product.shades[0]); }}>
                  <div className="relative" style={{ aspectRatio: "1" }}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    {product.bestseller && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white"
                        style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}>BESTSELLER</span>
                    )}
                    {product.newIn && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold"
                        style={{ background: "#fef0f3", color: "#c9506e", border: "1px solid #f0ccd6" }}>NEW</span>
                    )}
                    <button onClick={e => { e.stopPropagation(); handleSave(product); }}
                      className="absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center rounded-full"
                      style={{ background: "rgba(255,248,250,0.9)", backdropFilter: "blur(4px)" }}>
                      <Heart size={12} style={{ color: isSaved(product.id) ? "#c9506e" : "#c0a0a8", fill: isSaved(product.id) ? "#c9506e" : "none" }} />
                    </button>
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] font-medium uppercase tracking-wider mb-0.5" style={{ color: "#9b6674" }}>{product.brand}</div>
                    <div className="text-xs font-semibold leading-tight" style={{ color: "#1a0a0e" }}>{product.name}</div>
                    <div className="text-xs font-bold mt-1" style={{ color: "#c9506e" }}>{product.price}</div>
                    {/* Shade row */}
                    {selected?.id === product.id && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {product.shades.map(s => (
                          <button key={s.name} onClick={e => { e.stopPropagation(); setActiveShade(s); }}
                            title={s.name}
                            className="transition-all"
                            style={{
                              width: 18, height: 18, borderRadius: "50%",
                              background: s.hex,
                              border: `2.5px solid ${activeShade?.name === s.name ? "#c9506e" : "rgba(0,0,0,0.1)"}`,
                              boxShadow: activeShade?.name === s.name ? "0 0 0 2px #fff, 0 0 0 4px #c9506e" : "none",
                              transform: activeShade?.name === s.name ? "scale(1.25)" : "scale(1)",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it works strip */}
        <div className="rounded-3xl p-6 text-center" style={{ background: "linear-gradient(135deg, #fef0f3, #fff8f9)", border: "1px solid #f0ccd6" }}>
          <h3 className="text-lg mb-4" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>How it works</h3>
          <div className="grid grid-cols-3 gap-6">
            {[
              { n: "01", t: "Upload your photo", d: "A straight-on selfie works best" },
              { n: "02", t: "Pick a product & shade", d: "Try lipstick, blush, eyeshadow and more" },
              { n: "03", t: "Add to bag & shop", d: "All links go to Amazon UK via your affiliate cart" },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "#c9506e", opacity: 0.4 }}>{s.n}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: "#1a0a0e" }}>{s.t}</div>
                <div className="text-xs" style={{ color: "#9b6674" }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
