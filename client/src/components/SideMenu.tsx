import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  X, ScanLine, Sparkles, Wand2, Search, User, ShoppingBag,
  ChevronRight, Droplets, Sun, Zap, Shield, Leaf, Star,
  FlaskConical, Palette, Package, BookOpen, Home, Heart,
  Tag, Mail
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { BlushMapLogoInline } from "@/components/BlushMapLogo";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

const skinTypes = [
  { icon: Droplets,   label: "Dry Skin",          slug: "dry" },
  { icon: Sun,        label: "Oily Skin",          slug: "oily" },
  { icon: Zap,        label: "Combination",        slug: "combination" },
  { icon: Shield,     label: "Sensitive",          slug: "sensitive" },
  { icon: Leaf,       label: "Mature Skin",        slug: "mature" },
  { icon: FlaskConical, label: "Acne-Prone",       slug: "acne-prone" },
  { icon: Star,       label: "Normal Skin",        slug: "normal" },
];

const navLinks = [
  { icon: Home,       label: "Home",               href: "/" },
  { icon: ScanLine,   label: "Scan a Product",     href: "/scanner",  accent: "#c9506e" },
  { icon: Sparkles,   label: "Analyse My Skin",    href: "/analyse",  accent: "#c9944a" },
  { icon: Wand2,      label: "Virtual Try-On",     href: "/try-on" },
  { icon: Search,     label: "Shop Products",      href: "/search" },
  { icon: User,       label: "My Profile",         href: "/profile" },
];

const productCategories = [
  { label: "Moisturisers",   slug: "moisturiser" },
  { label: "Serums",         slug: "serum" },
  { label: "SPF & Protection", slug: "spf" },
  { label: "Foundations",    slug: "foundation" },
  { label: "Concealers",     slug: "concealer" },
  { label: "Lip Colours",    slug: "lipstick" },
  { label: "Blush & Glow",   slug: "blush" },
  { label: "Eye Products",   slug: "eye-cream" },
  { label: "Cleansers",      slug: "cleanser" },
  { label: "Masks & Treats", slug: "mask" },
];

export function SideMenu({ open, onClose, onOpenAuth }: SideMenuProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [skinExpanded, setSkinExpanded] = useState(false);
  const [catExpanded, setCatExpanded]   = useState(false);

  // Close on route change
  useEffect(() => { onClose(); }, [location]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Collapse sub-menus when closed
      setSkinExpanded(false);
      setCatExpanded(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[90] transition-opacity duration-300"
        style={{
          background: "rgba(10,4,6,0.55)",
          backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed top-0 left-0 h-full z-[100] flex flex-col"
        style={{
          width: "min(320px, 88vw)",
          background: "#fff9fb",
          borderRight: "1px solid #f0ccd6",
          boxShadow: "8px 0 40px rgba(180,60,90,0.12)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 340ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid #f5dce4" }}
        >
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <BlushMapLogoInline size={28} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 500, color: "#1a0a0e" }}>
                BlushMap
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-pink-50"
            style={{ color: "#9b6674" }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Auth strip */}
        {!user ? (
          <div className="px-5 py-3 shrink-0" style={{ borderBottom: "1px solid #f5dce4", background: "linear-gradient(to right, #fff5f7, #fff9fb)" }}>
            <button
              onClick={() => { onClose(); onOpenAuth?.(); }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}
            >
              Sign in / Create Account
            </button>
          </div>
        ) : (
          <Link href="/profile">
            <div
              className="flex items-center gap-3 px-5 py-3.5 cursor-pointer shrink-0"
              style={{ borderBottom: "1px solid #f5dce4", background: "linear-gradient(to right, #fff5f7, #fff9fb)" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}
              >
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1a0a0e" }}>{user.name}</p>
                <p className="text-[11px]" style={{ color: "#9b6674" }}>View profile →</p>
              </div>
            </div>
          </Link>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain py-2">

          {/* Main nav links */}
          <nav aria-label="Main navigation">
            <p className="px-5 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#c9506e" }}>
              Explore
            </p>
            {navLinks.map(({ icon: Icon, label, href, accent }) => (
              <Link key={href} href={href}>
                <div
                  className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors hover:bg-pink-50 group"
                  style={{ borderLeft: location === href ? "3px solid #c9506e" : "3px solid transparent" }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: accent ? `${accent}18` : "#f5dce4", color: accent ?? "#c9506e" }}
                  >
                    <Icon size={14} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#1a0a0e" }}>{label}</span>
                  {accent && (
                    <span
                      className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: accent }}
                    >
                      {label.includes("Scan") ? "NEW" : "AI"}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </nav>

          {/* Skin types */}
          <div>
            <button
              onClick={() => setSkinExpanded(p => !p)}
              className="w-full flex items-center justify-between px-5 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] hover:opacity-80 transition-opacity"
              style={{ color: "#c9506e" }}
            >
              <span>Shop by Skin Type</span>
              <ChevronRight
                size={14}
                style={{ transform: skinExpanded ? "rotate(90deg)" : "none", transition: "transform 200ms", color: "#c9a96e" }}
              />
            </button>
            {skinExpanded && (
              <div>
                {skinTypes.map(({ icon: Icon, label, slug }) => (
                  <Link key={slug} href={`/search?skinType=${slug}`}>
                    <div className="flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-colors hover:bg-pink-50">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: "#f5dce4", color: "#c9506e" }}>
                        <Icon size={12} />
                      </div>
                      <span className="text-sm" style={{ color: "#3a1520" }}>{label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Product categories */}
          <div>
            <button
              onClick={() => setCatExpanded(p => !p)}
              className="w-full flex items-center justify-between px-5 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] hover:opacity-80 transition-opacity"
              style={{ color: "#c9506e" }}
            >
              <span>Product Categories</span>
              <ChevronRight
                size={14}
                style={{ transform: catExpanded ? "rotate(90deg)" : "none", transition: "transform 200ms", color: "#c9a96e" }}
              />
            </button>
            {catExpanded && (
              <div>
                {productCategories.map(({ label, slug }) => (
                  <Link key={slug} href={`/search?category=${slug}`}>
                    <div className="flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-colors hover:bg-pink-50">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#e8a0b0" }} />
                      <span className="text-sm" style={{ color: "#3a1520" }}>{label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Editorial links */}
          <div>
            <p className="px-5 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#c9506e" }}>
              Editorial
            </p>
            {[
              { icon: BookOpen, label: "Skin Guides",        href: "/search?q=guide" },
              { icon: Tag,      label: "Current Offers",     href: "/search?q=offers" },
              { icon: Heart,    label: "Best Sellers",       href: "/search?q=bestseller" },
              { icon: Leaf,     label: "Clean Beauty",       href: "/search?q=clean" },
              { icon: Star,     label: "Luxury Picks",       href: "/search?q=luxury" },
              { icon: Package,  label: "Budget Friendly",    href: "/search?q=budget" },
            ].map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href}>
                <div className="flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-colors hover:bg-pink-50">
                  <Icon size={13} style={{ color: "#c9a96e", flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: "#3a1520" }}>{label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter CTA at bottom */}
          <div className="px-5 py-5 mt-2">
            <div
              className="rounded-2xl p-4 text-center"
              style={{ background: "linear-gradient(135deg, #fff0f4, #fce8ef)", border: "1px solid #f0ccd6" }}
            >
              <Mail size={20} className="mx-auto mb-2" style={{ color: "#c9506e" }} />
              <p className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>
                Get personalised picks
              </p>
              <p className="text-[11px] mb-3" style={{ color: "#9b6674" }}>
                Weekly curated beauty edits for your skin type
              </p>
              <Link href="/#newsletter">
                <span
                  className="inline-block w-full py-2 rounded-xl text-xs font-bold text-white cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}
                >
                  Join Free
                </span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
