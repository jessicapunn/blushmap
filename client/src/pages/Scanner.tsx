import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Camera, Keyboard, Search, Loader2, AlertCircle, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Mode = "choose" | "camera" | "manual";

export default function Scanner() {
  const [mode, setMode] = useState<Mode>("choose");
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // Load ZXing dynamically
  const zxingRef = useRef<any>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    cancelAnimationFrame(animFrameRef.current);
    scanningRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setMode("camera");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      beginScan();
    } catch (err: any) {
      setError("Camera access denied. Use manual entry instead.");
      setMode("choose");
    }
  };

  const beginScan = useCallback(async () => {
    // Dynamically load @zxing/library
    if (!zxingRef.current) {
      try {
        const zxing = await import("@zxing/library");
        const hints = new Map();
        hints.set(2, [zxing.BarcodeFormat.EAN_13, zxing.BarcodeFormat.EAN_8,
          zxing.BarcodeFormat.UPC_A, zxing.BarcodeFormat.UPC_E,
          zxing.BarcodeFormat.CODE_128, zxing.BarcodeFormat.QR_CODE]);
        const reader = new zxing.MultiFormatReader();
        reader.setHints(hints);
        zxingRef.current = { reader, DecodeHintType: zxing.DecodeHintType, RGBLuminanceSource: zxing.RGBLuminanceSource, BinaryBitmap: zxing.BinaryBitmap, HybridBinarizer: zxing.HybridBinarizer };
      } catch {
        setError("Barcode scanner failed to load. Use manual entry.");
        return;
      }
    }

    scanningRef.current = true;
    const tick = () => {
      if (!scanningRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      try {
        const { reader, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } = zxingRef.current;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const src = new RGBLuminanceSource(imageData.data, canvas.width, canvas.height);
        const bitmap = new BinaryBitmap(new HybridBinarizer(src));
        const result = reader.decode(bitmap);
        if (result) {
          scanningRef.current = false;
          stopCamera();
          handleCode(result.getText());
          return;
        }
      } catch {
        // No barcode found this frame — keep scanning
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const handleCode = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Look up product
      const lookupRes = await fetch(`/api/barcode/${code}`);
      let product: any = null;
      if (lookupRes.ok) {
        product = await lookupRes.json();
      }

      // 2. Score ingredients
      const scoreRes = await fetch("/api/score-ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode: code,
          productName: product?.productName || null,
          brand: product?.brand || null,
          ingredientsText: product?.ingredientsText || null,
        }),
      });

      if (!scoreRes.ok) throw new Error("Scoring failed");
      const scoreData = await scoreRes.json();

      // Store in sessionStorage and navigate
      const payload = { ...scoreData, barcode: code, productImage: product?.image || null };
      sessionStorage.setItem("barcodeResult", JSON.stringify(payload));
      setLocation("/scan-result");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
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
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600 }}>Ingredient Scanner</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6 max-w-2xl mx-auto">

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="relative">
              <div className="w-20 h-20 rounded-full" style={{ background: "hsl(340 30% 94%)" }} />
              <Loader2 className="w-10 h-10 animate-spin absolute inset-0 m-auto" style={{ color: "hsl(340 45% 45%)" }} />
            </div>
            <p className="text-center text-muted-foreground">Analysing ingredients with AI…</p>
            <p className="text-center text-sm text-muted-foreground">This takes about 10 seconds</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mb-6 p-4 rounded-xl border flex items-start gap-3" style={{ background: "hsl(0 30% 97%)", borderColor: "hsl(0 60% 85%)" }}>
            <AlertCircle size={18} className="mt-0.5 shrink-0" style={{ color: "hsl(0 60% 50%)" }} />
            <p className="text-sm" style={{ color: "hsl(0 50% 40%)" }}>{error}</p>
          </div>
        )}

        {/* Choose mode */}
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
                Point at a barcode or enter it manually. We'll analyse every ingredient and give it a score out of 100.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={startCamera}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md"
                style={{ borderColor: "hsl(340 45% 45%)", background: "hsl(340 30% 97%)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsl(340 45% 45%)" }}>
                  <Camera size={22} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold">Scan barcode</div>
                  <div className="text-sm text-muted-foreground">Use your camera to scan a product barcode</div>
                </div>
              </button>

              <button
                onClick={() => setMode("manual")}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all hover:shadow-md hover:border-border"
                style={{ background: "hsl(var(--card))" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border" style={{ background: "hsl(var(--muted))" }}>
                  <Keyboard size={22} className="text-muted-foreground" />
                </div>
                <div>
                  <div className="font-semibold">Enter barcode manually</div>
                  <div className="text-sm text-muted-foreground">Type the barcode number from the product</div>
                </div>
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-8">
              Works with EAN-13, EAN-8, UPC-A barcodes on most beauty & skincare products
            </p>
          </div>
        )}

        {/* Camera mode */}
        {mode === "camera" && !loading && (
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: "4/3" }}>
              <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-40">
                  {/* Corner brackets */}
                  {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
                    <div key={i} className={`absolute w-6 h-6 ${pos}`} style={{
                      borderTop: i < 2 ? "2px solid white" : "none",
                      borderBottom: i >= 2 ? "2px solid white" : "none",
                      borderLeft: i % 2 === 0 ? "2px solid white" : "none",
                      borderRight: i % 2 === 1 ? "2px solid white" : "none",
                    }} />
                  ))}
                  {/* Scanning line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-rose-400 animate-pulse" style={{ top: "50%" }} />
                </div>
              </div>

              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-white text-sm px-3 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.5)" }}>
                  Point at barcode
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { stopCamera(); setMode("choose"); }}>
                Cancel
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => { stopCamera(); setMode("manual"); }}>
                <Keyboard size={16} className="mr-2" /> Enter manually
              </Button>
            </div>
          </div>
        )}

        {/* Manual entry */}
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
                onChange={e => setManualCode(e.target.value)}
                className="text-center text-lg tracking-widest h-14"
                autoFocus
              />
              <Button
                type="submit"
                className="w-full h-12 gradient-rose text-white border-0 hover:opacity-90 gap-2"
                disabled={!manualCode.trim()}
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
    </div>
  );
}
