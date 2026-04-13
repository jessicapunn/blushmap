import { useState } from "react";
import { Link } from "wouter";
import { ScanLine, Sparkles, Search, ShoppingCart, User as UserIcon, LogIn, Wand2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useBasket } from "@/lib/basket";
import { BlushMapLogoInline } from "@/components/BlushMapLogo";
import { AuthModal } from "@/components/AuthModal";
import { BasketDrawer } from "@/components/BasketDrawer";

export function NavBar() {
  const { user } = useAuth();
  const { count } = useBasket();
  const [showAuth,   setShowAuth]   = useState(false);
  const [showBasket, setShowBasket] = useState(false);

  return (
    <>
      {showAuth    && <AuthModal onClose={() => setShowAuth(false)} />}
      <BasketDrawer open={showBasket} onClose={() => setShowBasket(false)} />

      <header className="sticky top-0 z-50 border-b" style={{ background: "rgba(255,248,250,0.96)", backdropFilter: "blur(20px)", borderColor: "#f0ccd6" }}>
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center gap-2">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer mr-2">
              <BlushMapLogoInline size={30} />
              <span className="hidden sm:block" style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 500, color: "#1a0a0e" }}>BlushMap</span>
            </div>
          </Link>

          {/* Main nav */}
          <nav className="hidden md:flex items-center gap-1.5 flex-1">
            <Link href="/scanner">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-bold tracking-wide cursor-pointer hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}>
                <ScanLine size={12} /> SCAN
              </span>
            </Link>
            <Link href="/analyse">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-bold tracking-wide cursor-pointer hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg, #c9944a, #b07830)" }}>
                <Sparkles size={12} /> ANALYSE
              </span>
            </Link>
            <Link href="/try-on">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer hover:bg-pink-50 transition-colors"
                style={{ color: "#9b6674" }}>
                <Wand2 size={12} /> Try-On
              </span>
            </Link>
            <Link href="/search">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer hover:bg-pink-50 transition-colors"
                style={{ color: "#9b6674" }}>
                <Search size={12} /> Products
              </span>
            </Link>
          </nav>

          <div className="flex-1 md:flex-none" />

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Mobile: scan + analyse */}
            <Link href="/scanner">
              <span className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full text-white text-[11px] font-bold"
                style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}>
                <ScanLine size={11} /> Scan
              </span>
            </Link>
            <Link href="/analyse">
              <span className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full text-white text-[11px] font-bold"
                style={{ background: "linear-gradient(135deg, #c9944a, #b07830)" }}>
                <Sparkles size={11} /> Analyse
              </span>
            </Link>

            {user ? (
              <Link href="/profile">
                <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-pink-50 transition-colors"
                  style={{ color: "var(--color-rose)", border: "1.5px solid #f0ccd6" }}>
                  <UserIcon size={12} /> {user.name?.split(" ")[0] || "Profile"}
                </button>
              </Link>
            ) : (
              <button onClick={() => setShowAuth(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-pink-50 transition-colors"
                style={{ color: "#9b6674", border: "1.5px solid #f0ccd6" }}>
                <LogIn size={12} /> Log in
              </button>
            )}

            {/* Basket */}
            <button onClick={() => setShowBasket(true)}
              className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-pink-50 transition-colors"
              style={{ border: "1.5px solid #f0ccd6" }}>
              <ShoppingCart size={14} style={{ color: "#c9506e" }} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center text-[9px] font-bold text-white rounded-full"
                  style={{ background: "#c9506e", minWidth: 15, height: 15, padding: "0 2px" }}>
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
