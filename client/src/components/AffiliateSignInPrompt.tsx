/**
 * Modal shown when a guest clicks an affiliate link.
 * Prompts them to sign up to earn points, with a "Continue without account" fallback.
 */
import { Link } from "wouter";
import { X, Star, Gift, TrendingUp, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  productName?: string;
  affiliateUrl: string;
  onClose: () => void;
}

export function AffiliateSignInPrompt({ productName, affiliateUrl, onClose }: Props) {
  function continueAsGuest() {
    window.open(affiliateUrl, "_blank", "noopener");
    onClose();
  }

  const perks = [
    { icon: Star,       label: "Earn 10 points every time you shop a link" },
    { icon: Gift,       label: "Unlock rewards and exclusive offers" },
    { icon: TrendingUp, label: "Track your skin journey over time" },
    { icon: ShoppingBag,label: "Save products and build your wishlist" },
  ];

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(26,10,14,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: "#fff", boxShadow: "0 8px 48px rgba(201,80,110,0.22)" }}
      >
        {/* Header gradient */}
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{ background: "linear-gradient(135deg, #fde8ee 0%, #fff8f9 100%)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ background: "#f5e0e5", color: "#9b6674" }}
          >
            <X size={16} />
          </button>

          {/* Coin icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)", boxShadow: "0 4px 20px rgba(201,80,110,0.35)" }}
          >
            <Star size={28} fill="white" color="white" />
          </div>

          <h2
            className="text-xl font-bold mb-1"
            style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}
          >
            Earn BlushMap Points
          </h2>
          <p className="text-sm" style={{ color: "#9b6674" }}>
            {productName
              ? <>Sign in to earn <strong>10 points</strong> when you shop <em>{productName}</em></>
              : <>Sign in to earn <strong>10 points</strong> on every affiliate link you click</>
            }
          </p>
        </div>

        {/* Perks list */}
        <div className="px-6 py-4 space-y-3">
          {perks.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: "#fef0f3" }}
              >
                <Icon size={15} style={{ color: "#c9506e" }} />
              </div>
              <p className="text-sm" style={{ color: "#3d1a24" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="px-6 pb-6 space-y-3">
          <Link href="/profile" onClick={onClose}>
            <Button
              className="w-full font-semibold"
              style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)", color: "#fff", border: "none" }}
            >
              Sign in / Create account
            </Button>
          </Link>
          <button
            onClick={continueAsGuest}
            className="w-full text-sm text-center py-2 rounded-xl transition-colors hover:bg-pink-50"
            style={{ color: "#9b6674" }}
          >
            Continue without an account →
          </button>
        </div>
      </div>
    </div>
  );
}
