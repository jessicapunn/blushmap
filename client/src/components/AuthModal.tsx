import { useState } from "react";
import { X, Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { BlushMapLogoInline } from "./BlushMapLogo";

interface Props { onClose: () => void; defaultMode?: "login" | "register"; }

export function AuthModal({ onClose, defaultMode = "login" }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [email, setEmail] = useState("");
  const [name, setName]   = useState("");
  const [pw, setPw]       = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (mode === "register") await register(email, name, pw);
      else await login(email, pw);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm rounded-2xl p-8 shadow-2xl" style={{ background: "#fff8f9", border: "1px solid #f0ccd6" }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>

        {/* Logo + heading */}
        <div className="text-center mb-7">
          <div className="flex justify-center mb-3"><BlushMapLogoInline size={52} /></div>
          <h2 className="text-2xl" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-xs mt-1" style={{ color: "#9b6674" }}>
            {mode === "login" ? "Log in to your BlushMap profile" : "Save scans, track your skin & get curated picks"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#c0a0a8" }} />
              <input
                type="text" placeholder="Your name" value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "#fff", border: "1.5px solid #f0ccd6", color: "#1a0a0e" }}
              />
            </div>
          )}
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#c0a0a8" }} />
            <input
              type="email" placeholder="Email address" value={email} required
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "#fff", border: "1.5px solid #f0ccd6", color: "#1a0a0e" }}
            />
          </div>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#c0a0a8" }} />
            <input
              type={showPw ? "text" : "password"} placeholder="Password" value={pw} required
              onChange={e => setPw(e.target.value)}
              className="w-full pl-9 pr-10 py-3 rounded-xl text-sm outline-none"
              style={{ background: "#fff", border: "1.5px solid #f0ccd6", color: "#1a0a0e" }}
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && <p className="text-xs px-1" style={{ color: "#c9506e" }}>{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60 mt-1"
            style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: "#9b6674" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="font-semibold underline underline-offset-2" style={{ color: "var(--color-rose)" }}
          >
            {mode === "login" ? "Sign up free" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
