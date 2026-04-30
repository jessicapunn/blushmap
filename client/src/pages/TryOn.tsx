import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Camera, Upload, ShoppingBag, Heart, Check, Video, VideoOff, RotateCcw, X, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBasket } from "@/lib/basket";
import { NavBar } from "@/components/NavBar";
import { RETAILERS } from "@/lib/affiliates";
import { getProductImage } from "@/lib/productImages";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Shade { name: string; hex: string; }
interface TryProduct {
  id: string; name: string; brand: string; price: string;
  category: "lipstick" | "lip-liner" | "blush" | "eyeshadow" | "highlighter" | "bronzer";
  shades: Shade[];
  image: string; affiliateUrl: string;
  bestseller?: boolean; newIn?: boolean;
}

// ── Affiliate helpers (Awin publisher 2854395) ────────────────────────────────
const AWIN = (mid: string, url: string) =>
  `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=2854395&ued=${encodeURIComponent(url)}`;
const lf   = (q: string) => AWIN("2082",  `https://www.lookfantastic.com/search?q=${encodeURIComponent(q)}`);
const cult = (q: string) => AWIN("29063", `https://www.cultbeauty.co.uk/search?query=${encodeURIComponent(q)}`);
const ctLink = (q: string) => AWIN("13611", `https://www.charlottetilbury.com/uk/search?q=${encodeURIComponent(q)}`);

// ── Makeup catalogue ───────────────────────────────────────────────────────────
const MAKEUP: TryProduct[] = [
  { id:"kl-lip-1", name:"Kylie Lip Kit", brand:"Kylie Cosmetics", price:"£35", category:"lipstick",
    image:"https://images.unsplash.com/photo-1631730358585-38a4935cbec4?w=400&q=80",
    affiliateUrl: lf("Kylie Cosmetics Lip Kit"), bestseller: true,
    shades:[{name:"Dolce K",hex:"#c1694f"},{name:"Candy K",hex:"#db7c6e"},{name:"True Brown K",hex:"#8b5e4e"},{name:"22",hex:"#8b2020"},{name:"Posie K",hex:"#d4826e"},{name:"Koko K",hex:"#e8b4a0"}]},
  { id:"ct-lip-1", name:"Pillow Talk Lipstick", brand:"Charlotte Tilbury", price:"£29", category:"lipstick",
    image:"https://images.unsplash.com/photo-1586495777744-4e6232bf2d22?w=400&q=80",
    affiliateUrl: ctLink("Charlotte Tilbury Pillow Talk lipstick"), bestseller: true,
    shades:[{name:"Pillow Talk",hex:"#d4927e"},{name:"Walk of No Shame",hex:"#b5463a"},{name:"Love Liberty",hex:"#c96878"},{name:"Superstar",hex:"#9b3030"},{name:"Very Victoria",hex:"#b88070"},{name:"Pinkgasm",hex:"#e0a090"}]},
  { id:"nars-lip-1", name:"Satin Lipstick", brand:"NARS", price:"£27", category:"lipstick",
    image:"https://images.unsplash.com/photo-1631214499182-e37c7dc30a3a?w=400&q=80",
    affiliateUrl: cult("NARS satin lipstick"),
    shades:[{name:"Dolce Vita",hex:"#c07068"},{name:"Heat Wave",hex:"#c84040"},{name:"Cruella",hex:"#8b1a1a"},{name:"Catfight",hex:"#d48070"},{name:"Dragon Girl",hex:"#cc2222"},{name:"Barbara",hex:"#cc4060"}]},
  { id:"mac-lip-1", name:"Matte Lipstick", brand:"MAC", price:"£22", category:"lipstick",
    image:"https://images.unsplash.com/photo-1631214499182-e37c7dc30a3a?w=400&q=80",
    affiliateUrl: lf("MAC matte lipstick"),
    shades:[{name:"Ruby Woo",hex:"#c0272d"},{name:"Velvet Teddy",hex:"#a07060"},{name:"Whirl",hex:"#907060"},{name:"Chili",hex:"#a03030"},{name:"Candy Yum-Yum",hex:"#f060a0"},{name:"Mocha",hex:"#906050"}]},
  { id:"fenty-lip-1", name:"Stunna Lip Paint", brand:"Fenty Beauty", price:"£22", category:"lipstick",
    image:"https://images.unsplash.com/photo-1631730358585-38a4935cbec4?w=400&q=80",
    affiliateUrl: lf("Fenty Stunna Lip Paint"), newIn: true,
    shades:[{name:"Uncensored",hex:"#c02020"},{name:"Undefeated",hex:"#d08070"},{name:"Unlocked",hex:"#b06050"},{name:"Uninvited",hex:"#d0a090"},{name:"Unlinked",hex:"#c04060"},{name:"Universal",hex:"#a03050"}]},
  { id:"nars-blush-1", name:"Orgasm Blush", brand:"NARS", price:"£31", category:"blush",
    image:"https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?w=400&q=80",
    affiliateUrl: cult("NARS Orgasm blush"), bestseller: true,
    shades:[{name:"Orgasm",hex:"#d4826e"},{name:"Deep Throat",hex:"#e0a8a0"},{name:"Goulue",hex:"#c87060"},{name:"Amour",hex:"#c06070"},{name:"Sin",hex:"#9b3040"}]},
  { id:"rare-blush-1", name:"Soft Pinch Liquid Blush", brand:"Rare Beauty", price:"£23", category:"blush",
    image:"https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&q=80",
    affiliateUrl: lf("Rare Beauty Soft Pinch blush"), bestseller: true, newIn: true,
    shades:[{name:"Happy",hex:"#e07870"},{name:"Joy",hex:"#d06870"},{name:"Lucky",hex:"#d09070"},{name:"Love",hex:"#c85060"},{name:"Grateful",hex:"#c07060"},{name:"Bliss",hex:"#e09080"}]},
  { id:"ct-blush-1", name:"Cheek to Chic Blush", brand:"Charlotte Tilbury", price:"£33", category:"blush",
    image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    affiliateUrl: ctLink("Charlotte Tilbury Cheek to Chic"),
    shades:[{name:"Love is the Drug",hex:"#d0806a"},{name:"Pillow Talk",hex:"#d0907e"},{name:"Super Nudes",hex:"#c8a090"},{name:"First Love",hex:"#d07070"}]},
  { id:"kl-eye-1", name:"Kyshadow Palette", brand:"Kylie Cosmetics", price:"£40", category:"eyeshadow",
    image:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80",
    affiliateUrl: lf("Kylie Cosmetics Kyshadow"), bestseller: true,
    shades:[{name:"Bronze",hex:"#8b5e3c"},{name:"Rose Gold",hex:"#c9835c"},{name:"Burgundy",hex:"#6b2030"},{name:"Nude",hex:"#c8a480"},{name:"Smoky",hex:"#504050"},{name:"Gold",hex:"#c9944a"}]},
  { id:"ct-eye-1", name:"Luxury Palette", brand:"Charlotte Tilbury", price:"£65", category:"eyeshadow",
    image:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80",
    affiliateUrl: ctLink("Charlotte Tilbury eyeshadow palette"), newIn: true,
    shades:[{name:"The Bella Sofia",hex:"#a06858"},{name:"Pillow Talk",hex:"#d0907e"},{name:"Walk of No Shame",hex:"#c84838"},{name:"Golden Goddess",hex:"#c8904a"},{name:"Vintage Vamp",hex:"#7b3040"}]},
  { id:"ct-high-1", name:"Beam Highlighter", brand:"Charlotte Tilbury", price:"£38", category:"highlighter",
    image:"https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&q=80", bestseller: true,
    affiliateUrl: ctLink("Charlotte Tilbury Beam Highlighter"),
    shades:[{name:"Moonbeam",hex:"#e8d8b8"},{name:"Pink Venus",hex:"#e8b8b8"},{name:"Ice Goddess",hex:"#dce8e8"},{name:"Bronze Venus",hex:"#c8a870"}]},
  { id:"fenty-high-1", name:"Killawatt Highlighter", brand:"Fenty Beauty", price:"£28", category:"highlighter",
    image:"https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?w=400&q=80",
    affiliateUrl: lf("Fenty Killawatt highlighter"),
    shades:[{name:"Trophy Wife",hex:"#c8a830"},{name:"Moscow Mule",hex:"#c8b898"},{name:"Lightning Dust",hex:"#e0d0b0"},{name:"Ginger Binge",hex:"#c09060"}]},
  { id:"ct-bronzer-1", name:"Filmstar Bronze & Glow", brand:"Charlotte Tilbury", price:"£55", category:"bronzer",
    image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    affiliateUrl: ctLink("Charlotte Tilbury Filmstar Bronze"), bestseller: true,
    shades:[{name:"Fair/Light",hex:"#c89060"},{name:"Light/Medium",hex:"#b87040"},{name:"Medium",hex:"#a86030"},{name:"Medium/Dark",hex:"#985030"}]},
];

const BRANDS = ["All Brands", "Kylie Cosmetics", "Charlotte Tilbury", "NARS", "MAC", "Fenty Beauty", "Rare Beauty"];
const CATS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "lipstick", label: "Lips" },
  { id: "blush", label: "Blush" },
  { id: "eyeshadow", label: "Eyes" },
  { id: "highlighter", label: "Highlight" },
  { id: "bronzer", label: "Bronzer" },
];

// ── hex → rgba helper ──────────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── MediaPipe landmark indices ─────────────────────────────────────────────────
// Lip outline (upper + lower combined, 478-point model)
const UPPER_LIP = [61,185,40,39,37,0,267,269,270,409,291,308,415,310,311,312,13,82,81,80,191,78];
const LOWER_LIP = [61,146,91,181,84,17,314,405,321,375,291,308,324,318,402,317,14,87,178,88,95,78];
// Blush zones (cheek area landmarks)
const LEFT_CHEEK  = [116,123,147,187,207,213,192,214,210,211,212,202];
const RIGHT_CHEEK = [345,352,376,411,427,433,411,434,430,431,432,422];
// Left/Right eyelid area for eyeshadow
const LEFT_EYE_UPPER  = [246,161,160,159,158,157,173,133,155,154,153,145,144,163,7,33];
const RIGHT_EYE_UPPER = [466,388,387,386,385,384,398,362,382,381,380,374,373,390,249,263];
// Forehead highlight zone (approx)
const FOREHEAD_ZONE = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];

// ── Canvas makeup rendering ────────────────────────────────────────────────────
function renderMakeup(
  ctx: CanvasRenderingContext2D,
  landmarks: {x: number; y: number; z: number}[],
  w: number,
  h: number,
  category: string,
  hex: string,
  intensity: number,
  mirror: boolean
) {
  const px = (lm: {x: number; y: number}) => ({
    x: mirror ? w - lm.x * w : lm.x * w,
    y: lm.y * h,
  });

  ctx.save();

  if (category === "lipstick" || category === "lip-liner") {
    // Draw lips using fill path
    const alpha = 0.65 + intensity * 0.25;
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = alpha;
    ctx.fillStyle = hex;

    // Upper lip
    ctx.beginPath();
    const ul = UPPER_LIP.map(i => px(landmarks[i]));
    ctx.moveTo(ul[0].x, ul[0].y);
    for (let i = 1; i < ul.length; i++) ctx.lineTo(ul[i].x, ul[i].y);
    ctx.closePath();
    ctx.fill();

    // Lower lip
    ctx.beginPath();
    const ll = LOWER_LIP.map(i => px(landmarks[i]));
    ctx.moveTo(ll[0].x, ll[0].y);
    for (let i = 1; i < ll.length; i++) ctx.lineTo(ll[i].x, ll[i].y);
    ctx.closePath();
    ctx.fill();

    // Add gloss highlight
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#ffffff";
    const lip_center = px(landmarks[13]);
    const gradH = ctx.createRadialGradient(lip_center.x, lip_center.y - 3, 1, lip_center.x, lip_center.y, 12);
    gradH.addColorStop(0, "rgba(255,255,255,0.9)");
    gradH.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradH;
    ctx.beginPath();
    ctx.arc(lip_center.x, lip_center.y - 3, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  if (category === "blush") {
    const alpha = 0.3 + intensity * 0.3;
    ctx.globalCompositeOperation = "multiply";

    // Left cheek
    const lc = LEFT_CHEEK.map(i => px(landmarks[i]));
    const lcCx = lc.reduce((s, p) => s + p.x, 0) / lc.length;
    const lcCy = lc.reduce((s, p) => s + p.y, 0) / lc.length;
    const lcR = Math.max(...lc.map(p => Math.hypot(p.x - lcCx, p.y - lcCy))) * 1.4;
    const lgL = ctx.createRadialGradient(lcCx, lcCy, 0, lcCx, lcCy, lcR);
    lgL.addColorStop(0, hexToRgba(hex, alpha));
    lgL.addColorStop(1, hexToRgba(hex, 0));
    ctx.fillStyle = lgL;
    ctx.beginPath();
    ctx.ellipse(lcCx, lcCy, lcR, lcR * 0.65, -0.25, 0, Math.PI * 2);
    ctx.fill();

    // Right cheek
    const rc = RIGHT_CHEEK.map(i => px(landmarks[i]));
    const rcCx = rc.reduce((s, p) => s + p.x, 0) / rc.length;
    const rcCy = rc.reduce((s, p) => s + p.y, 0) / rc.length;
    const rcR = Math.max(...rc.map(p => Math.hypot(p.x - rcCx, p.y - rcCy))) * 1.4;
    const lgR = ctx.createRadialGradient(rcCx, rcCy, 0, rcCx, rcCy, rcR);
    lgR.addColorStop(0, hexToRgba(hex, alpha));
    lgR.addColorStop(1, hexToRgba(hex, 0));
    ctx.fillStyle = lgR;
    ctx.beginPath();
    ctx.ellipse(rcCx, rcCy, rcR, rcR * 0.65, 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  if (category === "eyeshadow") {
    const alpha = 0.45 + intensity * 0.35;
    ctx.globalCompositeOperation = "multiply";

    for (const zone of [LEFT_EYE_UPPER, RIGHT_EYE_UPPER]) {
      const pts = zone.map(i => px(landmarks[i]));
      const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length - 4;
      const rx = Math.max(...pts.map(p => Math.abs(p.x - cx))) * 1.3;
      const ry = rx * 0.5;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
      grad.addColorStop(0, hexToRgba(hex, alpha));
      grad.addColorStop(0.6, hexToRgba(hex, alpha * 0.5));
      grad.addColorStop(1, hexToRgba(hex, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (category === "highlighter") {
    const alpha = 0.25 + intensity * 0.3;
    ctx.globalCompositeOperation = "screen";

    // T-zone + cheekbones
    const pts = FOREHEAD_ZONE.map(i => px(landmarks[i]));
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    const r = Math.max(...pts.map(p => Math.hypot(p.x - cx, p.y - cy)));

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.5);
    grad.addColorStop(0, hexToRgba(hex, alpha * 1.5));
    grad.addColorStop(1, hexToRgba(hex, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.45, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cheekbone highlights
    for (const zone of [LEFT_CHEEK, RIGHT_CHEEK]) {
      const zPts = zone.map(i => px(landmarks[i]));
      const zcx = zPts.reduce((s, p) => s + p.x, 0) / zPts.length;
      const zcy = zPts.reduce((s, p) => s + p.y, 0) / zPts.length - 8;
      const zg = ctx.createRadialGradient(zcx, zcy, 0, zcx, zcy, 20);
      zg.addColorStop(0, hexToRgba(hex, alpha * 1.2));
      zg.addColorStop(1, hexToRgba(hex, 0));
      ctx.fillStyle = zg;
      ctx.beginPath();
      ctx.ellipse(zcx, zcy, 20, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (category === "bronzer") {
    const alpha = 0.2 + intensity * 0.25;
    ctx.globalCompositeOperation = "multiply";

    for (const zone of [LEFT_CHEEK, RIGHT_CHEEK]) {
      const pts = zone.map(i => px(landmarks[i]));
      const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
      const r = Math.max(...pts.map(p => Math.hypot(p.x - cx, p.y - cy))) * 1.6;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, hexToRgba(hex, alpha));
      grad.addColorStop(1, hexToRgba(hex, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

type Mode = "camera" | "upload";

export default function TryOn() {
  const { save, unsave, isSaved, add } = useBasket();
  const [category,    setCategory]    = useState("all");
  const [brand,       setBrand]       = useState("All Brands");
  const [selected,    setSelected]    = useState<TryProduct | null>(null);
  const [activeShade, setActiveShade] = useState<Shade | null>(null);
  const [intensity,   setIntensity]   = useState(0.55);
  const [faceImg,     setFaceImg]     = useState<string | null>(null);
  const [added,       setAdded]       = useState<Set<string>>(new Set());
  const [mode,        setMode]        = useState<Mode>("camera");
  const [cameraOn,    setCameraOn]    = useState(false);
  const [cameraErr,   setCameraErr]   = useState<string | null>(null);
  const [mpStatus,    setMpStatus]    = useState<"loading" | "ready" | "error" | "idle">("idle");
  const [faceDetected, setFaceDetected] = useState(false);

  const fileRef    = useRef<HTMLInputElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const streamRef  = useRef<MediaStream | null>(null);
  const rafRef     = useRef<number | null>(null);
  const faceLandmarkerRef = useRef<any>(null);
  const lastVideoTimeRef  = useRef(-1);

  const filtered = MAKEUP.filter(p =>
    (category === "all" || p.category === category) &&
    (brand === "All Brands" || p.brand === brand)
  );

  // ── Load MediaPipe Face Landmarker ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function loadMP() {
      try {
        setMpStatus("loading");
        const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        const fl = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          outputFaceBlendshapes: false,
          runningMode: "VIDEO",
          numFaces: 1,
        });
        if (!cancelled) {
          faceLandmarkerRef.current = fl;
          setMpStatus("ready");
        }
      } catch (e) {
        console.warn("MediaPipe load failed:", e);
        if (!cancelled) setMpStatus("error");
      }
    }
    loadMP();
    return () => { cancelled = true; };
  }, []);

  // ── Camera helpers ─────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraErr(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraOn(true);
      setFaceImg(null);
    } catch (err: any) {
      setCameraErr(err?.message || "Camera permission denied. Please allow camera access.");
      setCameraOn(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
    setFaceDetected(false);
  }, []);

  useEffect(() => {
    if (mode === "camera") startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [mode]);

  // ── AR render loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!cameraOn || mode !== "camera") return;

    const video   = videoRef.current;
    const canvas  = canvasRef.current;
    if (!video || !canvas) return;

    const fl = faceLandmarkerRef.current;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (video.readyState < 2) return;

      const w = video.videoWidth  || canvas.offsetWidth;
      const h = video.videoHeight || canvas.offsetHeight;
      if (canvas.width !== w)  canvas.width  = w;
      if (canvas.height !== h) canvas.height = h;

      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, w, h);

      if (!fl || mpStatus !== "ready" || !selected || !activeShade) return;
      if (video.currentTime === lastVideoTimeRef.current) return;
      lastVideoTimeRef.current = video.currentTime;

      try {
        const result = fl.detectForVideo(video, performance.now());
        if (result.faceLandmarks && result.faceLandmarks.length > 0) {
          setFaceDetected(true);
          renderMakeup(ctx, result.faceLandmarks[0], w, h, selected.category, activeShade.hex, intensity, true);
        } else {
          setFaceDetected(false);
        }
      } catch {/* frame skip */}
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [cameraOn, mode, selected, activeShade, intensity, mpStatus]);

  // ── Upload mode: render on static image ──────────────────────────────────
  useEffect(() => {
    if (mode !== "upload" || !faceImg || !selected || !activeShade) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fl = faceLandmarkerRef.current;
    if (!fl) return;

    const img = new Image();
    img.onload = async () => {
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      try {
        // Switch to IMAGE mode for static detect
        const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        const flImg = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "IMAGE",
          numFaces: 1,
        });
        const result = flImg.detect(img);
        if (result.faceLandmarks?.length > 0) {
          setFaceDetected(true);
          renderMakeup(ctx, result.faceLandmarks[0], canvas.width, canvas.height,
            selected.category, activeShade.hex, intensity, false);
        } else {
          setFaceDetected(false);
        }
        flImg.close();
      } catch (e) {
        console.warn("Upload face detect failed:", e);
      }
    };
    img.src = faceImg;
  }, [faceImg, selected, activeShade, intensity, mode, mpStatus]);

  // ── Basket helpers ─────────────────────────────────────────────────────────
  function handleAddToBasket(product: TryProduct) {
    if (!activeShade) return;
    add({ id: `${product.id}-${activeShade.name}`, name: product.name, brand: product.brand,
          price: product.price, image: product.image, affiliateUrl: product.affiliateUrl,
          category: product.category, shade: activeShade.name });
    setAdded(prev => new Set([...Array.from(prev), product.id]));
    setTimeout(() => setAdded(prev => { const n = new Set(prev); n.delete(product.id); return n; }), 2000);
  }

  function handleSave(product: TryProduct) {
    const item = { id: product.id, name: product.name, brand: product.brand, price: product.price,
                   image: product.image, affiliateUrl: product.affiliateUrl, category: product.category };
    if (isSaved(product.id)) unsave(product.id); else save(item);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setFaceImg(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen" style={{ background: "#fff8f9" }}>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Link href="/"><button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ border: "1px solid #f0ccd6", color: "#9b6674" }}><ArrowLeft size={14} /></button></Link>
            <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>Virtual Try-On</h1>
          </div>
          <p className="text-sm" style={{ color: "#9b6674", maxWidth: "42ch", margin: "0 auto" }}>
            AI-powered face tracking. Try shades live on camera or upload a photo — then shop with one tap.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center mb-5">
          <div className="flex p-1 rounded-2xl gap-1" style={{ background: "#fef0f3", border: "1.5px solid #f0ccd6" }}>
            {(["camera", "upload"] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); if (m === "upload") setFaceImg(null); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: mode === m ? "linear-gradient(135deg, #c9506e, #a3324e)" : "transparent",
                         color: mode === m ? "white" : "#9b6674" }}>
                {m === "camera" ? <Camera size={15} /> : <Upload size={15} />}
                {m === "camera" ? "Live Camera" : "Upload Photo"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* ── Left: face view ─────────────────────────────────────────────── */}
          <div>
            <div className="relative rounded-3xl overflow-hidden"
              style={{ background: "#111", border: "1px solid #f0ccd6", aspectRatio: "3/4", minHeight: 320 }}>

              {/* VIDEO (camera mode) */}
              {mode === "camera" && (
                <video ref={videoRef} autoPlay playsInline muted
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }} />
              )}

              {/* UPLOAD image */}
              {mode === "upload" && faceImg && (
                <img src={faceImg} alt="Your face"
                  className="absolute inset-0 w-full h-full object-cover" />
              )}

              {/* CANVAS overlay (AR makeup) — always on top */}
              <canvas ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{
                  transform: mode === "camera" ? "scaleX(-1)" : "none",
                  pointerEvents: "none",
                  mixBlendMode: "multiply",
                }} />

              {/* Camera prompts */}
              {mode === "camera" && !cameraOn && !cameraErr && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#2a0a10" }}>
                    <Video size={24} style={{ color: "#f0ccd6" }} />
                  </div>
                  <p className="text-sm text-center px-8" style={{ color: "#f0ccd6" }}>Starting camera…</p>
                </div>
              )}
              {mode === "camera" && cameraErr && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 z-10">
                  <VideoOff size={28} style={{ color: "#f0ccd6" }} />
                  <p className="text-sm text-center" style={{ color: "#f0ccd6" }}>{cameraErr}</p>
                  <Button onClick={startCamera} size="sm" className="text-white gap-2"
                    style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)", border: "none" }}>
                    <RotateCcw size={12} /> Try again
                  </Button>
                  <button onClick={() => setMode("upload")} className="text-xs underline" style={{ color: "#c0a0a8" }}>
                    Upload a photo instead
                  </button>
                </div>
              )}

              {/* Upload prompts */}
              {mode === "upload" && !faceImg && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#fef0f3" }}>
                    <Camera size={32} style={{ color: "#f0ccd6" }} />
                  </div>
                  <p className="text-sm font-medium text-center px-8" style={{ color: "#9b6674", maxWidth: "22ch" }}>
                    Upload a straight-on photo for best results
                  </p>
                  <Button onClick={() => fileRef.current?.click()}
                    className="gap-2 text-sm text-white border-0"
                    style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}>
                    <Upload size={14} /> Upload photo
                  </Button>
                </div>
              )}
              {mode === "upload" && faceImg && (
                <>
                  <button onClick={() => { setFaceImg(null); setFaceDetected(false); }}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full z-10"
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
                    <X size={14} style={{ color: "white" }} />
                  </button>
                  <button onClick={() => fileRef.current?.click()}
                    className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white z-10"
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
                    <Upload size={11} /> Change photo
                  </button>
                </>
              )}

              {/* Status badges */}
              {mode === "camera" && cameraOn && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white z-10"
                  style={{ background: "rgba(201,80,110,0.85)", backdropFilter: "blur(6px)" }}>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> LIVE
                </div>
              )}
              {mpStatus === "loading" && (
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold z-10"
                  style={{ background: "rgba(0,0,0,0.55)", color: "#f0ccd6", backdropFilter: "blur(6px)" }}>
                  <Sparkles size={11} className="animate-pulse" /> Loading AI face tracking…
                </div>
              )}
              {mpStatus === "ready" && faceDetected && cameraOn && (
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold z-10"
                  style={{ background: "rgba(50,180,100,0.8)", color: "white", backdropFilter: "blur(6px)" }}>
                  <span className="w-2 h-2 rounded-full bg-white" /> Face tracked
                </div>
              )}
              {mpStatus === "error" && (
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs z-10"
                  style={{ background: "rgba(0,0,0,0.55)", color: "#f0ccd6", backdropFilter: "blur(6px)" }}>
                  Select a shade to try on
                </div>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

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
                  style={{ accentColor: "#c9506e",
                           background: `linear-gradient(to right, #c9506e ${intensity * 100}%, #f0ccd6 ${intensity * 100}%)` }}
                />
              </div>
            )}

            {/* Active selection card */}
            {selected && activeShade && (
              <div className="mt-4 p-4 rounded-2xl flex items-center gap-3"
                style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0"
                  style={{ background: activeShade.hex, border: "2px solid rgba(0,0,0,0.08)" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: "#1a0a0e" }}>{selected.name}</div>
                  <div className="text-xs" style={{ color: "#9b6674" }}>{selected.brand} · {activeShade.name}</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: "#c9506e" }}>{selected.price}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSave(selected)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl"
                    style={{ background: isSaved(selected.id) ? "#fef0f3" : "#f9f5f0", border: "1px solid #f0ccd6" }}>
                    <Heart size={15} style={{ color: isSaved(selected.id) ? "#c9506e" : "#c0a0a8",
                                              fill: isSaved(selected.id) ? "#c9506e" : "none" }} />
                  </button>
                  <a href={selected.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}>
                    <ShoppingBag size={12} /> Buy now
                  </a>
                </div>
              </div>
            )}

            {/* Multi-retailer links */}
            {selected && (
              <div className="mt-3 p-4 rounded-2xl" style={{ background: "white", border: "1px solid #f0ccd6" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#c9506e", letterSpacing: "0.12em" }}>
                  Also available at
                </p>
                <div className="flex flex-wrap gap-2">
                  {RETAILERS.slice(0, 5).map(r => (
                    <a key={r.id}
                      href={r.buildLink(`${selected.brand} ${selected.name}`)}
                      target="_blank" rel="noopener noreferrer sponsored"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                      style={{ background: "#fef0f3", color: "#9b6674", border: "1px solid #f0ccd6" }}>
                      {r.name} <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ color: "#bbb" }}>
                  *Affiliate links — we may earn a small commission at no extra cost to you.
                </p>
              </div>
            )}
          </div>

          {/* ── Right: product selector ──────────────────────────────────────── */}
          <div>
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-4">
              {CATS.map(c => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{ background: category === c.id ? "linear-gradient(135deg, #c9506e, #a3324e)" : "#fef0f3",
                           color: category === c.id ? "white" : "#9b6674",
                           border: `1px solid ${category === c.id ? "transparent" : "#f0ccd6"}` }}>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Brand filter */}
            <div className="flex gap-2 flex-wrap mb-4 overflow-x-auto pb-1">
              {BRANDS.map(b => (
                <button key={b} onClick={() => setBrand(b)}
                  className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0"
                  style={{ background: brand === b ? "#fef0f3" : "transparent",
                           color: brand === b ? "#c9506e" : "#9b6674",
                           border: `1px solid ${brand === b ? "#f0ccd6" : "#f0ccd6"}`,
                           fontWeight: brand === b ? 700 : 400 }}>
                  {b}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
              {filtered.map(p => (
                <div key={p.id}
                  onClick={() => { setSelected(p); if (p.shades.length > 0) setActiveShade(p.shades[0]); }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ border: selected?.id === p.id ? "2px solid #c9506e" : "1px solid #f0ccd6",
                           background: "white", boxShadow: selected?.id === p.id ? "0 0 0 3px rgba(201,80,110,0.12)" : "none" }}>
                  {p.bestseller && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)", fontSize: "0.6rem" }}>
                      BESTSELLER
                    </div>
                  )}
                  {p.newIn && !p.bestseller && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ background: "#7c3aed", fontSize: "0.6rem" }}>
                      NEW
                    </div>
                  )}
                  <div className="h-24 overflow-hidden" style={{ background: "#fef0f3" }}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="p-2">
                    <div className="text-xs font-bold truncate" style={{ color: "#9b6674", fontSize: "0.65rem" }}>{p.brand}</div>
                    <div className="text-xs font-semibold truncate" style={{ color: "#1a0a0e", fontSize: "0.75rem", lineHeight: 1.3 }}>{p.name}</div>
                    <div className="text-xs font-bold mt-0.5" style={{ color: "#c9506e" }}>{p.price}</div>
                    {/* Shade swatches */}
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {p.shades.slice(0, 6).map(s => (
                        <button key={s.name}
                          onClick={e => { e.stopPropagation(); setSelected(p); setActiveShade(s); }}
                          title={s.name}
                          className="rounded-full transition-all"
                          style={{
                            width: 14, height: 14,
                            background: s.hex,
                            border: activeShade?.hex === s.hex && selected?.id === p.id
                              ? "2px solid #c9506e"
                              : "1.5px solid rgba(0,0,0,0.12)",
                            transform: activeShade?.hex === s.hex && selected?.id === p.id ? "scale(1.3)" : "scale(1)",
                          }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-4 p-4 rounded-2xl" style={{ background: "#fef8fa", border: "1px solid #f0ccd6" }}>
              <p className="text-xs font-bold mb-2" style={{ color: "#c9506e" }}>Tips for best results</p>
              <ul className="space-y-1">
                {[
                  "Face the camera straight-on in good lighting",
                  "Keep your face centred — the green badge confirms face tracking",
                  "Adjust intensity slider for a natural or bold look",
                  "Try multiple shades by tapping the swatches",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#9b6674" }}>
                    <span style={{ color: "#c9506e", flexShrink: 0 }}>·</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
