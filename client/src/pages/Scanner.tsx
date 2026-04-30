import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Camera, Keyboard, Search, Loader2, AlertCircle, ScanLine, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "choose" | "camera" | "manual";

// ── Quagga2 scan config ──────────────────────────────────────────────────────
// We try multiple configs in order from most aggressive to most conservative.
const SCAN_CONFIGS = [
  // Pass 1 — high frequency, centre crop (most barcodes)
  {
    frequency: 20,
    area: { top: "20%", right: "5%", left: "5%", bottom: "20%" },
    label: "centre crop",
  },
  // Pass 2 — full frame (barcode near edge or rotated)
  {
    frequency: 15,
    area: { top: "5%", right: "5%", left: "5%", bottom: "5%" },
    label: "full frame",
  },
  // Pass 3 — wide centre strip (common on product sides)
  {
    frequency: 10,
    area: { top: "30%", right: "2%", left: "2%", bottom: "30%" },
    label: "wide strip",
  },
];

const READERS = [
  "ean_reader",        // EAN-13 — most EU beauty products
  "ean_8_reader",      // EAN-8  — small products (nail polish, lip balm)
  "upc_reader",        // UPC-A  — US products
  "upc_e_reader",      // UPC-E  — small US products
  "code_128_reader",   // Code-128 — professional/pharmacy
] as any;  // cast needed: Quagga types accept strings but the TS types are overly strict

export default function Scanner() {
  const [mode, setMode] = useState<Mode>("choose");
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string>("Point at a barcode");
  const [configIdx, setConfigIdx] = useState(0);
  const [, setLocation] = useLocation();

  // Quagga2 renders into this div — it creates its own <video> inside
  const mountedRef = useRef<HTMLDivElement>(null);
  const quaggaRef = useRef<any>(null);
  const detectedCodesRef = useRef<Record<string, number>>({});
  const scanningActiveRef = useRef(false);
  const configTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  // ── Stop everything cleanly ───────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    scanningActiveRef.current = false;
    if (configTimerRef.current) clearTimeout(configTimerRef.current);
    if (quaggaRef.current) {
      try { quaggaRef.current.stop(); } catch {}
      quaggaRef.current = null;
    }
  }, []);

  // ── Init Quagga2 — it opens the camera itself ─────────────────────────────
  const beginQuaggaScan = useCallback(async (cfgIdx: number) => {
    if (cfgIdx === 0) scanningActiveRef.current = true;
    if (!scanningActiveRef.current) return;
    if (!mountedRef.current) return;

    // Stop any previous Quagga instance
    if (quaggaRef.current) {
      try { quaggaRef.current.stop(); } catch {}
      quaggaRef.current = null;
    }

    const cfg = SCAN_CONFIGS[cfgIdx] || SCAN_CONFIGS[0];
    setScanStatus(`Scanning (${cfg.label})…`);

    try {
      const Quagga = (await import("@ericblade/quagga2")).default;
      quaggaRef.current = Quagga;

      await new Promise<void>((resolve, reject) => {
        Quagga.init(
          {
            inputStream: {
              type: "LiveStream",
              // Point at the container div — Quagga creates its own <video> inside
              target: mountedRef.current!,
              constraints: {
                // iOS Safari requires exact "environment" (not {ideal})
                facingMode: "environment",
                width: { min: 640, ideal: 1280 },
                height: { min: 480, ideal: 720 },
              },
              area: cfg.area,
              singleChannel: false,
            },
            decoder: {
              readers: READERS,
              debug: {
                drawBoundingBox: false,
                showFrequency: false,
                drawScanline: false,
                showPattern: false,
              },
              multiple: false,
            },
            locate: true,
            locator: {
              patchSize: "medium",
              halfSample: false,
            },
            numOfWorkers: 2,
            frequency: cfg.frequency,
          },
          (err: any) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      Quagga.start();

      // ── Confidence-voting: require 2 matching hits before accepting ────────
      Quagga.onDetected((result: any) => {
        if (!scanningActiveRef.current) return;
        const code = result?.codeResult?.code;
        const format = result?.codeResult?.format;
        if (!code || code.length < 6) return;

        detectedCodesRef.current[code] = (detectedCodesRef.current[code] || 0) + 1;

        if (detectedCodesRef.current[code] >= 2) {
          scanningActiveRef.current = false;
          setScanStatus(`Detected ${format?.replace("_", "-")}!`);
          stopCamera();
          handleCode(code);
        } else {
          setScanStatus(`Confirming barcode… (${detectedCodesRef.current[code]}/2)`);
        }
      });

      // After 6s with no result, rotate to next config
      configTimerRef.current = setTimeout(() => {
        if (!scanningActiveRef.current) return;
        const next = (cfgIdx + 1) % SCAN_CONFIGS.length;
        setConfigIdx(next);
        detectedCodesRef.current = {};
        beginQuaggaScan(next);
      }, 6000);

    } catch (err: any) {
      console.error("[Scanner] Quagga init failed:", err);
      const msg = err?.name === "NotAllowedError"
        ? "Camera access denied. Please allow camera access and try again, or use manual entry."
        : `Could not start camera (${err?.name ?? "unknown error"}). Please use manual entry.`;
      setError(msg);
      setMode("choose");
    }
  }, [stopCamera]);

  // ── Start scanning ────────────────────────────────────────────────────────
  const startCamera = () => {
    setMode("camera");
    setError(null);
    detectedCodesRef.current = {};
    setConfigIdx(0);
    setScanStatus("Starting camera…");
    // beginQuaggaScan is called after the camera view mounts (see useEffect below)
  };

  // Start Quagga once the camera div is mounted in the DOM
  useEffect(() => {
    if (mode === "camera") {
      // Small delay to ensure the div is rendered and attached
      const t = setTimeout(() => beginQuaggaScan(0), 150);
      return () => clearTimeout(t);
    }
  }, [mode, beginQuaggaScan]);

  // ── Handle a confirmed code ───────────────────────────────────────────────
  const handleCode = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const lookupRes = await fetch(`/api/barcode/${code}`);
      let product: any = null;
      if (lookupRes.ok) product = await lookupRes.json();

      const scoreRes = await fetch("/api/score-ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode: code,
          productName: product?.productName ?? null,
          brand: product?.brand ?? null,
          ingredientsText: product?.ingredientsText ?? null,
          productCategory: product?.productCategory ?? null,
        }),
      });

      if (!scoreRes.ok) {
        const errBody = await scoreRes.json().catch(() => ({}));
        throw new Error(errBody?.detail || errBody?.error || "Scoring failed");
      }
      const scoreData = await scoreRes.json();

      // Merge enriched OFF data (allergens, additives, ingredientsList) into payload
      const payload = {
        ...scoreData,
        barcode: code,
        productImage: product?.image ?? null,
        ingredientsList: product?.ingredientsList ?? null,
        additives: product?.additives ?? null,
        allergens: product?.allergens ?? null,
        labels: product?.labels ?? null,
        quantity: product?.quantity ?? null,
        offUrl: product?.offUrl ?? null,
      };
      sessionStorage.setItem("barcodeResult", JSON.stringify(payload));
      setLocation("/scan-result");
    } catch (err: any) {
      const rawMsg = err.message || "";
      const friendlyMsg = rawMsg.toLowerCase().includes("scoring failed")
        ? "We had trouble analysing this product. Please try again or enter the barcode manually."
        : rawMsg.toLowerCase().includes("product not found") || rawMsg.toLowerCase().includes("not found")
        ? "We couldn't find this product in our databases. Try entering the barcode number manually."
        : rawMsg || "Something went wrong. Please try again.";
      setError(friendlyMsg);
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = manualCode.trim().replace(/\s/g, "");
    if (!code) return;
    stopCamera();
    handleCode(code);
  };

  // ── Config progress pill ──────────────────────────────────────────────────
  const ConfigPills = () => (
    <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5 z-10">
      {SCAN_CONFIGS.map((cfg, i) => (
        <div
          key={i}
          className="h-1 rounded-full transition-all duration-300"
          style={{
            width: i === configIdx ? 24 : 8,
            background: i === configIdx ? "white" : "rgba(255,255,255,0.35)",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)", background: "hsl(var(--background))" }}>
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md" style={{ background: "hsl(var(--background) / 0.92)" }}>
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" onClick={stopCamera}>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm">Back</span>
            </button>
          </Link>
          <div className="flex items-center gap-2 ml-2">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-label="BlushMap logo">
              <circle cx="14" cy="14" r="13" fill="hsl(340 45% 45%)" />
              <ellipse cx="14" cy="12" rx="5" ry="6" fill="none" stroke="white" strokeWidth="1.5" />
              <path d="M9 18 Q14 22 19 18" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="14" cy="9" r="1.5" fill="hsl(30 60% 80%)" />
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600 }}>Product Scanner</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6 max-w-2xl mx-auto">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="relative">
              <div className="w-20 h-20 rounded-full" style={{ background: "hsl(340 30% 94%)" }} />
              <Loader2 className="w-10 h-10 animate-spin absolute inset-0 m-auto" style={{ color: "hsl(340 45% 45%)" }} />
            </div>
            <p className="text-center text-muted-foreground font-medium">Analysing ingredients with AI…</p>
            <p className="text-center text-sm text-muted-foreground">Usually takes about 10 seconds</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mb-6 p-4 rounded-xl border flex items-start gap-3" style={{ background: "hsl(0 30% 97%)", borderColor: "hsl(0 60% 85%)" }}>
            <AlertCircle size={18} className="mt-0.5 shrink-0" style={{ color: "hsl(0 60% 50%)" }} />
            <p className="text-sm" style={{ color: "hsl(0 50% 40%)" }}>{error}</p>
          </div>
        )}

        {/* ── Choose mode ──────────────────────────────────────────────────── */}
        {mode === "choose" && !loading && (
          <div>
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "hsl(340 30% 94%)" }}>
                <ScanLine size={32} style={{ color: "hsl(340 45% 45%)" }} />
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                Scan a product
              </h1>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Scan any makeup, skincare or food product. Point at the barcode and we'll analyse every ingredient — scoring it out of 100 with pros, cons and safer alternatives.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={startCamera}
                data-testid="btn-start-camera"
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md"
                style={{ borderColor: "hsl(340 45% 45%)", background: "hsl(340 30% 97%)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsl(340 45% 45%)" }}>
                  <Camera size={22} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold">Scan barcode</div>
                  <div className="text-sm text-muted-foreground">Makeup · Skincare · Food — camera auto-detects EAN-13, EAN-8, UPC</div>
                </div>
              </button>

              <button
                onClick={() => setMode("manual")}
                data-testid="btn-manual-entry"
                className="w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all hover:shadow-md hover:border-border"
                style={{ background: "hsl(var(--card))" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border" style={{ background: "hsl(var(--muted))" }}>
                  <Keyboard size={22} className="text-muted-foreground" />
                </div>
                <div>
                  <div className="font-semibold">Enter barcode manually</div>
                  <div className="text-sm text-muted-foreground">Type the number printed under any makeup, skincare or food barcode</div>
                </div>
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-8">
              Makeup · Skincare · Food & supplements — EAN-13, EAN-8, UPC-A, UPC-E, Code-128
            </p>
          </div>
        )}

        {/* ── Camera mode ──────────────────────────────────────────────────── */}
        {mode === "camera" && !loading && (
          <div>
            {/* Tip bar */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <ZoomIn size={14} className="text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground leading-snug">
                Hold steady, 10–20 cm away. Keep the barcode within the white frame. Good lighting helps.
              </p>
            </div>

            {/* Viewfinder */}
            <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: "4/3" }}>
              {/* Config progress indicators */}
              <ConfigPills />

              {/* Quagga2 renders its own <video> into this div */}
              <div
                ref={mountedRef}
                className="w-full h-full"
                style={{ position: "relative" }}
              />

              {/* Scan window overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Dim outer areas */}
                <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
                {/* Clear window */}
                <div className="relative z-10" style={{ width: "78%", height: "38%" }}>
                  {/* Animated scan line */}
                  <div
                    className="absolute left-2 right-2 h-0.5 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, hsl(340 45% 65%), transparent)",
                      animation: "scanLine 1.6s ease-in-out infinite",
                      top: "50%",
                    }}
                  />
                  {/* Corner brackets */}
                  {[
                    { corner: "top-0 left-0", borderStyle: { borderTop: "2.5px solid white", borderLeft: "2.5px solid white" } },
                    { corner: "top-0 right-0", borderStyle: { borderTop: "2.5px solid white", borderRight: "2.5px solid white" } },
                    { corner: "bottom-0 left-0", borderStyle: { borderBottom: "2.5px solid white", borderLeft: "2.5px solid white" } },
                    { corner: "bottom-0 right-0", borderStyle: { borderBottom: "2.5px solid white", borderRight: "2.5px solid white" } },
                  ].map(({ corner, borderStyle }, i) => (
                    <div key={i} className={`absolute w-7 h-7 ${corner} rounded-sm`} style={borderStyle} />
                  ))}
                </div>
              </div>

              {/* Status pill */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                <span
                  className="text-white text-sm px-4 py-1.5 rounded-full flex items-center gap-2"
                  style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {scanStatus}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { stopCamera(); setMode("choose"); }}>
                Cancel
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => { stopCamera(); setMode("manual"); }}>
                <Keyboard size={15} className="mr-2" /> Type instead
              </Button>
            </div>

            {/* Troubleshooting tips */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {[
                { tip: "Hold 10–20 cm away from barcode" },
                { tip: "Keep phone still — don't shake" },
                { tip: "Make sure barcode is well-lit" },
                { tip: "Try angling the phone slightly" },
              ].map((t, i) => (
                <div key={i} className="text-xs text-muted-foreground flex items-start gap-1.5 p-3 rounded-xl border" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                  <span style={{ color: "hsl(340 45% 50%)", flexShrink: 0 }}>✦</span>
                  {t.tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Manual entry ─────────────────────────────────────────────────── */}
        {mode === "manual" && !loading && (
          <div>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "hsl(340 30% 94%)" }}>
                <Keyboard size={26} style={{ color: "hsl(340 45% 45%)" }} />
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600 }}>Enter barcode</h2>
              <p className="text-sm text-muted-foreground mt-1">The number printed below the barcode on the product</p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 3337875597388"
                value={manualCode}
                onChange={e => setManualCode(e.target.value.replace(/[^0-9]/g, ""))}
                className="text-center text-lg tracking-widest h-14"
                autoFocus
                data-testid="input-barcode"
              />
              <Button
                type="submit"
                className="w-full h-12 gradient-rose text-white border-0 hover:opacity-90 gap-2"
                disabled={!manualCode.trim()}
                data-testid="btn-analyse-barcode"
              >
                <Search size={18} /> Analyse product
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setMode("choose")}>
                Back
              </Button>
            </form>

            <div className="mt-8 p-4 rounded-xl border text-sm text-muted-foreground" style={{ background: "hsl(var(--muted) / 0.4)" }}>
              <p className="font-medium text-foreground mb-1">Where to find the barcode</p>
              <p>Look on the back or bottom of the product. The number is usually 8–13 digits printed directly below the barcode lines.</p>
            </div>
          </div>
        )}
      </main>

      {/* Scan line animation */}
      <style>{`
        @keyframes scanLine {
          0%   { transform: translateY(-12px); opacity: 0.5; }
          50%  { transform: translateY(12px);  opacity: 1; }
          100% { transform: translateY(-12px); opacity: 0.5; }
        }
        /* Quagga renders a canvas overlay — make sure it fills the container */
        #interactive.viewport canvas,
        #interactive.viewport video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
          position: absolute;
          top: 0; left: 0;
        }
      `}</style>
    </div>
  );
}
