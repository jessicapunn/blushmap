import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Upload, Camera, Zap, ArrowLeft, ArrowRight, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PREFERENCES = [
  { id: "organic", label: "Organic", emoji: "🌿" },
  { id: "cruelty-free", label: "Cruelty-free", emoji: "🐰" },
  { id: "vegan", label: "Vegan", emoji: "🌱" },
  { id: "korean", label: "Korean beauty", emoji: "🇰🇷" },
  { id: "spf", label: "Include SPF", emoji: "☀️" },
  { id: "fragrance-free", label: "Fragrance-free", emoji: "🚫" },
  { id: "budget", label: "Budget-friendly", emoji: "💰" },
  { id: "luxury", label: "Luxury", emoji: "✨" },
  { id: "no-white-cast", label: "No white cast", emoji: "🎨" },
  { id: "anti-aging", label: "Anti-aging", emoji: "⏳" },
  { id: "acne-prone", label: "Acne-prone skin", emoji: "💊" },
  { id: "brightening", label: "Brightening", emoji: "🌟" },
];

type CaptureMode = "choose" | "upload" | "camera" | "live-rgb";
type Step = "capture" | "preferences" | "analysing";

export default function Analyse() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("capture");
  const [captureMode, setCaptureMode] = useState<CaptureMode>("choose");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [focus, setFocus] = useState<"skincare" | "makeup" | "both">("skincare");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("Initialising...");
  const [videoReady, setVideoReady] = useState(false);
  const [rgbPhase, setRgbPhase] = useState<"idle" | "red" | "green" | "blue" | "normal" | "done">("idle");
  const [rgbFrames, setRgbFrames] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setVideoReady(false);
    setRgbPhase("idle");
    setRgbFrames([]);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    setVideoReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for actual video dimensions before allowing capture
        await new Promise<void>((resolve) => {
          const v = videoRef.current!;
          const check = () => {
            if (v.videoWidth > 0 && v.videoHeight > 0) {
              resolve();
            } else {
              v.addEventListener("loadedmetadata", check, { once: true });
              v.addEventListener("canplay", check, { once: true });
            }
          };
          check();
        });
        await videoRef.current.play();
      }
      setVideoReady(true);
    } catch {
      toast({
        title: "Camera unavailable",
        description: "Please allow camera access or use file upload instead.",
        variant: "destructive",
      });
      setCaptureMode("choose");
    }
  }, [toast]);

  // captureFrame must be declared BEFORE runRGBSequence which depends on it
  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return null;

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.92);
  }, []);

  const startRGBScan = useCallback(async () => {
    setRgbPhase("idle");
    setRgbFrames([]);
    await startCamera();
  }, [startCamera]);

  const runRGBSequence = useCallback(async () => {
    const phases: Array<"red" | "green" | "blue" | "normal"> = ["red", "green", "blue", "normal"];
    const capturedFrames: string[] = [];
    for (const phase of phases) {
      setRgbPhase(phase);
      await new Promise(r => setTimeout(r, 1200));
      const frame = captureFrame();
      if (frame) capturedFrames.push(frame);
      await new Promise(r => setTimeout(r, 400));
    }
    setRgbPhase("done");
    setRgbFrames(capturedFrames);
    const primary = capturedFrames[capturedFrames.length - 1];
    setImageData(primary);
    stopCamera();
    setTimeout(() => setStep("preferences"), 800);
  }, [captureFrame, stopCamera]);

  const handleCameraCapture = useCallback(() => {
    const frame = captureFrame();
    if (frame) {
      setImageData(frame);
      stopCamera();
      setStep("preferences");
    } else {
      toast({ title: "Capture failed", description: "Camera not ready yet — please wait a moment and try again.", variant: "destructive" });
    }
  }, [captureFrame, stopCamera, toast]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => {
      setImageData(ev.target?.result as string);
      setStep("preferences");
    };
    reader.readAsDataURL(file);
  }, []);

  const togglePref = (id: string) => {
    setSelectedPrefs(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const submitAnalysis = async () => {
    if (!imageData) return;
    setStep("analysing");

    const messages = [
      "Detecting face regions...",
      "Analysing skin tone and undertone...",
      "Scanning for concerns...",
      "Running zone-by-zone assessment...",
      "Matching products to your profile...",
      "Finalising recommendations...",
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      setAnalysisProgress(prev => Math.min(prev + 14, 92));
      if (msgIdx < messages.length - 1) {
        msgIdx++;
        setProgressMsg(messages[msgIdx]);
      }
    }, 1400);

    try {
      let res: Response;
      const sessionId = `session_${Date.now()}`;

      if (imageFile && captureMode === "upload") {
        const formData = new FormData();
        formData.append("preferences", JSON.stringify(selectedPrefs));
        formData.append("focus", focus);
        formData.append("captureMethod", "upload");
        formData.append("sessionId", sessionId);
        formData.append("image", imageFile);
        res = await fetch("/api/analyse", { method: "POST", body: formData });
      } else {
        res = await fetch("/api/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageData,
            preferences: selectedPrefs,
            focus,
            captureMethod: captureMode === "live-rgb" ? "live-rgb" : "camera",
            sessionId,
          }),
        });
      }

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) {
        toast({
          title: data.title || "Analysis failed",
          description: `${data.detail || data.error || "Unknown error"} — ${data.suggestion || "Please try again."}`,
          variant: "destructive",
          duration: 10000,
        });
        setStep("preferences");
        setAnalysisProgress(0);
        setProgressMsg("Initialising...");
        return;
      }

      setAnalysisProgress(100);
      setProgressMsg("Done!");
      setTimeout(() => navigate(`/results/${data.id}`), 600);
    } catch (err: any) {
      clearInterval(interval);
      toast({
        title: "Could not reach the server",
        description: err.message || "A network error occurred. Check your connection and try again.",
        variant: "destructive",
        duration: 10000,
      });
      setStep("preferences");
      setAnalysisProgress(0);
      setProgressMsg("Initialising...");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ background: "hsl(var(--background) / 0.9)", borderColor: "hsl(var(--border))" }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft size={16} /> Back
            </button>
          </Link>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Face Mapping</span>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className={step === "capture" ? "text-foreground font-medium" : ""}>1 Capture</span>
            <span>›</span>
            <span className={step === "preferences" ? "text-foreground font-medium" : ""}>2 Preferences</span>
            <span>›</span>
            <span className={step === "analysing" ? "text-foreground font-medium" : ""}>3 Analysis</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">

        {/* ---- STEP 1: CAPTURE ---- */}
        {step === "capture" && (
          <div>
            {captureMode === "choose" && (
              <div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2rem)", marginBottom: "0.5rem" }}>
                  How would you like to share your selfie?
                </h1>
                <p className="text-muted-foreground text-sm mb-8">
                  Choose the method that works best. For best results, ensure good lighting and face the camera directly.
                </p>
                <div className="grid gap-4">
                  {[
                    {
                      mode: "upload" as CaptureMode,
                      icon: <Upload size={24} />,
                      title: "Upload a photo",
                      desc: "Select a selfie from your camera roll or files.",
                    },
                    {
                      mode: "camera" as CaptureMode,
                      icon: <Camera size={24} />,
                      title: "Take a selfie",
                      desc: "Use your device camera to capture a live photo now.",
                    },
                    {
                      mode: "live-rgb" as CaptureMode,
                      icon: <Zap size={24} />,
                      title: "Advanced RGB scan",
                      desc: "Your screen flashes red, green, then blue light to reveal hidden skin details.",
                      badge: "Most detailed",
                    },
                  ].map((opt: any) => (
                    <button
                      key={opt.mode}
                      onClick={async () => {
                        setCaptureMode(opt.mode);
                        if (opt.mode === "camera") await startCamera();
                        if (opt.mode === "live-rgb") await startRGBScan();
                        if (opt.mode === "upload") fileInputRef.current?.click();
                      }}
                      className="text-left p-6 rounded-2xl border hover:border-primary transition-all flex gap-5 items-start"
                      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                    >
                      <span style={{ color: "var(--color-rose)", background: "hsl(340 30% 93%)", padding: 12, borderRadius: 12, display: "flex", flexShrink: 0 }}>
                        {opt.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{opt.title}</span>
                          {opt.badge && (
                            <span className="text-xs px-2 py-0.5 rounded-full gradient-rose text-white">{opt.badge}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFileUpload} />
              </div>
            )}

            {/* Camera / RGB view */}
            {(captureMode === "camera" || captureMode === "live-rgb") && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  {captureMode === "live-rgb" ? "RGB Skin Scan" : "Take your selfie"}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {captureMode === "live-rgb"
                    ? (rgbPhase === "idle" ? "Position your face in the frame, then press Start Scan."
                       : rgbPhase === "done" ? "Scan complete! Redirecting…"
                       : `Capturing under ${rgbPhase.toUpperCase()} light — hold still…`)
                    : "Position your face in the oval guide, ensure good lighting, then press Capture."}
                </p>

                <div className="relative rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: "4/3", background: "#111" }}>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    autoPlay
                    style={{ transform: "scaleX(-1)" }}
                  />
                  {/* Face guide oval */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg width="55%" height="75%" viewBox="0 0 200 260" fill="none">
                      <ellipse cx="100" cy="130" rx="90" ry="120" stroke="white" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
                    </svg>
                  </div>
                  {/* RGB colour overlay */}
                  {captureMode === "live-rgb" && (
                    <div
                      className="absolute inset-0 transition-colors duration-300 pointer-events-none mix-blend-multiply"
                      style={{ background: {
                        idle: "transparent", red: "rgba(255,0,0,0.22)",
                        green: "rgba(0,255,0,0.22)", blue: "rgba(0,80,255,0.22)",
                        normal: "transparent", done: "transparent",
                      }[rgbPhase] }}
                    />
                  )}
                  {/* RGB phase dots */}
                  {captureMode === "live-rgb" && rgbPhase !== "idle" && rgbPhase !== "done" && (
                    <div className="absolute top-4 left-4 right-4 flex justify-center">
                      {["red","green","blue","normal"].map(p => (
                        <div key={p} className="w-6 h-6 rounded-full mx-1 border-2 border-white/50 transition-all" style={{
                          background: p==="red"?"#ff3030":p==="green"?"#30ff30":p==="blue"?"#3060ff":"#fff",
                          opacity: rgbPhase === p ? 1 : 0.3,
                          transform: rgbPhase === p ? "scale(1.3)" : "scale(1)",
                        }} />
                      ))}
                    </div>
                  )}
                  {/* Starting indicator */}
                  {!videoReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-sm px-4 py-2 rounded-full" style={{ background: "rgba(0,0,0,0.6)" }}>
                        Starting camera…
                      </span>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => { stopCamera(); setCaptureMode("choose"); }} className="flex-1">
                    <X size={16} className="mr-2" /> Cancel
                  </Button>
                  {captureMode === "camera" && (
                    <Button
                      onClick={handleCameraCapture}
                      className="flex-1 gradient-rose text-white border-0"
                      disabled={!videoReady}
                    >
                      <Camera size={16} className="mr-2" /> Capture
                    </Button>
                  )}
                  {captureMode === "live-rgb" && rgbPhase === "idle" && (
                    <Button
                      onClick={runRGBSequence}
                      className="flex-1 gradient-rose text-white border-0"
                      disabled={!videoReady}
                    >
                      <Zap size={16} className="mr-2" /> Start scan
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---- STEP 2: PREFERENCES ---- */}
        {step === "preferences" && (
          <div>
            {imageData && (
              <div className="flex gap-4 items-center mb-8 p-4 rounded-2xl border" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <img src={imageData} alt="Your selfie" className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <p className="font-medium text-sm">Photo captured</p>
                  <p className="text-xs text-muted-foreground mt-0.5">via {captureMode === "upload" ? "file upload" : "camera"}</p>
                  <button
                    className="text-xs underline text-muted-foreground mt-1"
                    onClick={() => { setImageData(null); setImageFile(null); setCaptureMode("choose"); setStep("capture"); }}
                  >
                    Change photo
                  </button>
                </div>
                <CheckCircle2 size={20} className="ml-auto" style={{ color: "var(--color-sage)" }} />
              </div>
            )}

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 3vw, 1.8rem)", marginBottom: "0.4rem" }}>
              What matters to you?
            </h2>
            <p className="text-muted-foreground text-sm mb-7">
              Tell us what you'd like recommendations for, then refine with any preferences below.
            </p>

            {/* Focus selector */}
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#9b6674", letterSpacing: "0.1em" }}>I want recommendations for</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: "skincare", label: "Skincare", emoji: "✨", desc: "Serums, SPF, moisturisers" },
                  { key: "makeup",   label: "Makeup",   emoji: "💄", desc: "Foundation, blush, lips" },
                  { key: "both",     label: "Both",     emoji: "🌟", desc: "Full routine" },
                ] as const).map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setFocus(opt.key)}
                    className="flex flex-col items-center gap-1.5 px-3 py-4 rounded-2xl border text-center transition-all"
                    style={{
                      background: focus === opt.key ? "var(--color-rose)" : "hsl(var(--card))",
                      borderColor: focus === opt.key ? "var(--color-rose)" : "hsl(var(--border))",
                      color: focus === opt.key ? "white" : "hsl(var(--foreground))",
                      boxShadow: focus === opt.key ? "0 4px 18px rgba(201,80,110,0.22)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "1.4rem" }}>{opt.emoji}</span>
                    <span className="text-sm font-semibold">{opt.label}</span>
                    <span className="text-xs opacity-70 leading-tight">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 mb-8">
              {PREFERENCES.map(pref => {
                const selected = selectedPrefs.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    onClick={() => togglePref(pref.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-all"
                    style={{
                      background: selected ? "var(--color-rose)" : "hsl(var(--card))",
                      borderColor: selected ? "var(--color-rose)" : "hsl(var(--border))",
                      color: selected ? "white" : "hsl(var(--foreground))",
                      fontWeight: selected ? 500 : 400,
                    }}
                  >
                    <span>{pref.emoji}</span> {pref.label}
                    {selected && <CheckCircle2 size={13} />}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setCaptureMode("choose"); setStep("capture"); }}>
                <ArrowLeft size={16} className="mr-2" /> Back
              </Button>
              <Button
                onClick={submitAnalysis}
                className="flex-1 gradient-rose text-white border-0 gap-2"
                data-testid="submit-analysis"
              >
                Analyse my skin <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ---- STEP 3: ANALYSING ---- */}
        {step === "analysing" && (
          <div className="text-center py-16">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 96 96" fill="none">
                <circle cx="48" cy="48" r="44" stroke="hsl(var(--muted))" strokeWidth="3" />
                <path d="M48 4 A44 44 0 0 1 92 48" stroke="var(--color-rose)" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-4 flex items-center justify-center rounded-full" style={{ background: "hsl(340 30% 93%)" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <ellipse cx="16" cy="14" rx="7" ry="8" fill="none" stroke="var(--color-rose)" strokeWidth="1.5" />
                  <path d="M9 23 Q16 28 23 23" stroke="var(--color-rose)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <circle cx="13" cy="12" r="1.2" fill="var(--color-rose)" />
                  <circle cx="19" cy="12" r="1.2" fill="var(--color-rose)" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "0.5rem" }}>Mapping your face</h2>
            <p className="text-muted-foreground text-sm mb-6">{progressMsg}</p>
            <div className="w-full max-w-xs mx-auto rounded-full overflow-hidden" style={{ height: 6, background: "hsl(var(--muted))" }}>
              <div className="h-full rounded-full gradient-rose transition-all duration-700" style={{ width: `${analysisProgress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-3">{analysisProgress}%</p>
          </div>
        )}
      </main>
    </div>
  );
}
