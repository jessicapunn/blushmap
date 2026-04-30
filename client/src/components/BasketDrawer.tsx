import { X, Heart, Trash2, ExternalLink, ShoppingBag, Package } from "lucide-react";
import { getProductImage } from "@/lib/productImages";
import { useBasket } from "@/lib/basket";
import { Button } from "@/components/ui/button";
import { AffiliateButton } from "./AffiliateButton";

interface Props { open: boolean; onClose: () => void; }

export function BasketDrawer({ open, onClose }: Props) {
  const { savedItems, unsave, add } = useBasket();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[400] flex justify-end" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      {/* Drawer */}
      <div className="relative w-full max-w-md h-full flex flex-col shadow-2xl" style={{ background: "#fff8f9" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#f0ccd6" }}>
          <div className="flex items-center gap-2">
            <Heart size={18} fill="#c9506e" style={{ color: "#c9506e" }} />
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>
              Wish List
              {savedItems.length > 0 && (
                <span className="text-sm font-normal ml-1.5" style={{ color: "#9b6674" }}>({savedItems.length})</span>
              )}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Saved Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {savedItems.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#fef0f3" }}>
                <Heart size={24} style={{ color: "#f0ccd6" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "#1a0a0e" }}>Your wish list is empty</p>
              <p className="text-xs mt-1" style={{ color: "#9b6674" }}>Heart products to save them here</p>
            </div>
          )}
          {savedItems.map(item => (
            <div key={item.id} className="flex gap-3 p-3.5 rounded-2xl" style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50" style={{ border: "1px solid #f0ccd6" }}>
                {item.image
                  ? <img src={getProductImage(item.id, item.image)} alt={item.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <div className="w-full h-full flex items-center justify-center"><Package size={18} style={{ color: "#f0ccd6" }} /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: "#1a0a0e" }}>{item.name}</div>
                <div className="text-xs" style={{ color: "#9b6674" }}>{item.brand}</div>
                <div className="text-sm font-semibold mt-0.5" style={{ color: "#c9506e" }}>{item.price}</div>
                <div className="flex items-center gap-2 mt-2.5">
                  <AffiliateButton
                    href={item.affiliateUrl}
                    productId={item.id}
                    productName={item.name}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)" }}
                  >
                    <ShoppingBag size={11} /> Buy now <ExternalLink size={9} />
                  </AffiliateButton>
                  <button onClick={() => unsave(item.id)} className="text-gray-300 hover:text-red-400 transition-colors ml-auto">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {savedItems.length > 0 && (
          <div className="px-6 py-4 border-t" style={{ borderColor: "#f0ccd6", background: "#fff" }}>
            <p className="text-[11px] text-center" style={{ color: "#c0a0a8" }}>
              Tap “Buy now” on any item to shop via our affiliate link — at no extra cost to you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
