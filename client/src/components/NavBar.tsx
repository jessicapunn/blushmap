import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  ScanLine, Sparkles, Search, Heart, User as UserIcon,
  LogIn, Wand2, Menu, X, Tag, Star
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useBasket } from "@/lib/basket";
import { fetchPoints } from "@/lib/points";
import { BlushMapLogoInline } from "@/components/BlushMapLogo";
import { AuthModal } from "@/components/AuthModal";
import { BasketDrawer } from "@/components/BasketDrawer";
import { SideMenu } from "@/components/SideMenu";

// ── Rotating announcement banner ──────────────────────────────────────────────
const BANNERS = [
  {
    text: "✦ LOOKFANTASTIC — Up to 30% off skincare this week",
    cta: "Shop now",
    href: "https://www.awin1.com/cread.php?awinmid=2082&awinaffid=2854395&ued=https%3A%2F%2Fwww.lookfantastic.com%2Foffers%2F",
    bg: "linear-gradient(90deg, #a3324e, #c9506e)",
  },
  {
    text: "✦ Cult Beauty — Vitamin C edit: brighten & protect",
    cta: "Explore",
    href: "https://www.awin1.com/cread.php?awinmid=29063&awinaffid=2854395&ued=https%3A%2F%2Fwww.cultbeauty.co.uk%2Fvitamin-c.list",
    bg: "linear-gradient(90deg, #7a2a42, #a3324e)",
  },
  {
    text: "✦ Boots — 3 for 2 across selected skincare",
    cta: "See deals",
    href: "https://www.awin1.com/cread.php?awinmid=2041&awinaffid=2854395&ued=https%3A%2F%2Fwww.boots.com%2Foffers%2F3-for-2",
    bg: "linear-gradient(90deg, #1a0a0e, #3a1520)",
  },
  {
    text: "✦ Space NK — In-store event: meet your skin experts",
    cta: "Book",
    href: "https://www.awin1.com/cread.php?awinmid=59805&awinaffid=2854395&ued=https%3A%2F%2Fwww.spacenk.com%2Fuk%2Fevents",
    bg: "linear-gradient(90deg, #c9944a, #a3744e)",
  },
  {
    text: "✦ Sephora — K-beauty bestsellers now on BlushMap",
    cta: "Discover",
    href: "https://www.awin1.com/cread.php?awinmid=15718&awinaffid=2854395&ued=https%3A%2F%2Fwww.sephora.co.uk%2Fkorean-beauty",
    bg: "linear-gradient(90deg, #6b3060, #a3324e)",
  },
  {
    text: "✦ Join BlushMap — save scans, track your skin journey",
    cta: "Sign up free",
    href: "/#newsletter",
    bg: "linear-gradient(90deg, #c9506e, #e8a0b0)",
    isSignup: true,
  },
];

function AnnouncementBanner({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % BANNERS.length);
        setAnimating(false);
      }, 350);
    }, 4200);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const banner = BANNERS[idx];

  function handleClick(e: React.MouseEvent) {
    if (banner.isSignup) {
      e.preventDefault();
      onOpenAuth();
    }
  }

  return (
    <div
      className="w-full flex items-center justify-center gap-2 px-4 text-white relative overflow-hidden"
      style={{ background: banner.bg, minHeight: "30px", transition: "background 0.5s ease" }}
    >
      <a
        href={banner.isSignup ? "#" : banner.href}
        target={banner.isSignup ? undefined : "_blank"}
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-2 no-underline py-1.5"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateX(40px)" : "translateX(0)",
          transition: "opacity 0.32s ease, transform 0.32s ease",
          whiteSpace: "nowrap",
        }}
      >
        <span className="text-[11px] font-medium tracking-wide">{banner.text}</span>
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}
        >
          {banner.cta}
        </span>
      </a>
    </div>
  );
}

// ── Main NavBar ───────────────────────────────────────────────────────────────
export function NavBar() {
  const { user } = useAuth();
  const { savedItems } = useBasket();
  const savedCount = savedItems.length;
  const [showAuth,   setShowAuth]   = useState(false);
  const [showBasket, setShowBasket] = useState(false);
  const [showMenu,   setShowMenu]   = useState(false);
  const [points,     setPoints]     = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchPoints().then(p => { if (p) setPoints(p.totalPoints); });
    } else {
      setPoints(null);
    }
  }, [user]);

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <BasketDrawer open={showBasket} onClose={() => setShowBasket(false)} />
      <SideMenu open={showMenu} onClose={() => setShowMenu(false)} onOpenAuth={() => setShowAuth(true)} />

      <header className="sticky top-0 z-50" style={{ background: "rgba(255,248,250,0.98)", backdropFilter: "blur(24px)" }}>
        {/* Rotating announcement banner */}
        <AnnouncementBanner onOpenAuth={() => setShowAuth(true)} />

        {/* Hairline separator */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #f0ccd6 20%, #f0ccd6 80%, transparent)" }} />

        {/* Main nav bar */}
        <div
          className="max-w-7xl mx-auto px-4 flex items-center gap-3"
          style={{ height: "52px" }}
        >
          {/* Left: Hamburger */}
          <button
            onClick={() => setShowMenu(true)}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors hover:bg-pink-50 shrink-0"
            style={{ border: "1.5px solid #f0ccd6", color: "#9b6674" }}
            aria-label="Open menu"
          >
            <Menu size={17} />
          </button>

          {/* Logo — brand name always visible */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer shrink-0">
              <BlushMapLogoInline size={26} />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  color: "#1a0a0e",
                  whiteSpace: "nowrap",
                }}
              >
                BlushMap
              </span>
            </div>
          </Link>

          {/* Centre nav pills — desktop */}
          <nav className="hidden md:flex items-center gap-1.5 flex-1 justify-center">
            <Link href="/scanner">
              <span
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-[11px] font-bold tracking-wider cursor-pointer hover:opacity-90 transition-all uppercase"
                style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)", letterSpacing: "0.08em" }}
              >
                <ScanLine size={12} /> Scan Product
              </span>
            </Link>
            <Link href="/analyse">
              <span
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-[11px] font-bold cursor-pointer hover:opacity-90 transition-all uppercase"
                style={{ background: "linear-gradient(135deg, #c9944a, #b07830)", letterSpacing: "0.08em" }}
              >
                <Sparkles size={12} /> Analyse
              </span>
            </Link>
            <Link href="/try-on">
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium cursor-pointer hover:bg-pink-50 transition-colors uppercase"
                style={{ color: "#9b6674", letterSpacing: "0.06em" }}
              >
                <Wand2 size={12} /> Try-On
              </span>
            </Link>
            <Link href="/search">
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium cursor-pointer hover:bg-pink-50 transition-colors uppercase"
                style={{ color: "#9b6674", letterSpacing: "0.06em" }}
              >
                <Search size={12} /> Products
              </span>
            </Link>
          </nav>

          {/* Spacer on mobile */}
          <div className="flex-1 md:hidden" />

          {/* Right side actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile: scan + analyse pills */}
            <Link href="/scanner">
              <span
                className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wide"
                style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}
              >
                <ScanLine size={11} /> Scan
              </span>
            </Link>
            <Link href="/analyse">
              <span
                className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wide"
                style={{ background: "linear-gradient(135deg, #c9944a, #b07830)" }}
              >
                <Sparkles size={11} /> Analyse
              </span>
            </Link>

            {/* Profile / Login — appears before basket */}
            {user ? (
              <Link href="/profile">
                <button
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold hover:bg-pink-50 transition-colors"
                  style={{ color: "var(--color-rose)", border: "1.5px solid #f0ccd6" }}
                >
                  <UserIcon size={12} />
                  <span className="uppercase tracking-wide" style={{ letterSpacing: "0.05em" }}>
                    {user.name?.split(" ")[0] || "Profile"}
                  </span>
                  {points !== null && (
                    <span
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                      style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)", color: "#fff", marginLeft: 2 }}
                    >
                      <Star size={8} fill="white" color="white" />
                      {points}
                    </span>
                  )}
                </button>
              </Link>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold hover:bg-pink-50 transition-colors uppercase tracking-wide"
                style={{ color: "#9b6674", border: "1.5px solid #f0ccd6", letterSpacing: "0.05em" }}
              >
                <LogIn size={12} /> Sign in
              </button>
            )}

            {/* Wish List — rightmost */}
            <button
              onClick={() => setShowBasket(true)}
              className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-pink-50 transition-colors"
              style={{ border: "1.5px solid #f0ccd6" }}
              aria-label="Open wish list"
            >
              <Heart size={15} style={{ color: "#c9506e" }} fill={savedCount > 0 ? "#c9506e" : "none"} />
              {savedCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center text-[9px] font-bold text-white rounded-full"
                  style={{ background: "#c9506e", minWidth: 16, height: 16, padding: "0 3px" }}
                >
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom hairline */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #f0ccd6 20%, #f0ccd6 80%, transparent)" }} />
      </header>
    </>
  );
}
