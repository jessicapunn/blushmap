import { X, ShoppingBag, Trash2, ExternalLink, Plus, Minus, Heart, Package } from "lucide-react";
import { useBasket } from "@/lib/basket";
import { Button } from "@/components/ui/button";

interface Props { open: boolean; onClose: () => void; }

export function BasketDrawer({ open, onClose }: Props) {
  const { items, savedItems, remove, updateQty, unsave, add, total, count } = useBasket();

  // Build a combined affiliate checkout URL (deeplinks open in new tabs)
  function handleCheckout() {
    if (items.length === 0) return;
    // Open each item's affiliate link in sequence with small delay
    items.forEach((item, i) => {
      setTimeout(() => {
        window.open(item.affiliateUrl, "_blank", "noopener,noreferrer");
      }, i * 400);
    });
  }

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
            <ShoppingBag size={18} style={{ color: "#c9506e" }} />
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>
              Your Bag {count > 0 && <span className="text-sm font-normal" style={{ color: "#9b6674" }}>({count} {count === 1 ? "item" : "items"})</span>}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#fef0f3" }}>
                <ShoppingBag size={22} style={{ color: "#f0ccd6" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "#1a0a0e" }}>Your bag is empty</p>
              <p className="text-xs mt-1" style={{ color: "#9b6674" }}>Browse products or try on shades to add items</p>
            </div>
          )}
          {items.map(item => (
            <div key={item.id} className="flex gap-3 p-3.5 rounded-2xl" style={{ background: "#fff", border: "1px solid #f0ccd6" }}>
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50" style={{ border: "1px solid #f0ccd6" }}>
                {item.image
                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <div className="w-full h-full flex items-center justify-center"><Package size={18} style={{ color: "#f0ccd6" }} /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: "#1a0a0e" }}>{item.name}</div>
                <div className="text-xs" style={{ color: "#9b6674" }}>{item.brand}{item.shade ? ` · ${item.shade}` : ""}</div>
                <div className="text-sm font-semibold mt-0.5" style={{ color: "#c9506e" }}>{item.price}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-pink-50" style={{ border: "1px solid #f0ccd6" }}>
                    <Minus size={10} />
                  </button>
                  <span className="text-sm font-medium w-4 text-center" style={{ color: "#1a0a0e" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-pink-50" style={{ border: "1px solid #f0ccd6" }}>
                    <Plus size={10} />
                  </button>
                </div>
              </div>
              <button onClick={() => remove(item.id)} className="self-start text-gray-300 hover:text-red-400 transition-colors mt-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {/* Saved / Wishlist */}
          {savedItems.length > 0 && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "#f0ccd6" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#9b6674" }}>
                <Heart size={11} className="inline mr-1" style={{ color: "#c9506e" }} /> Saved for later
              </p>
              {savedItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ border: "1px solid #f0ccd6" }}>
                    {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <Package size={14} className="m-auto mt-2" style={{ color: "#f0ccd6" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: "#1a0a0e" }}>{item.name}</div>
                    <div className="text-xs" style={{ color: "#9b6674" }}>{item.price}</div>
                  </div>
                  <button onClick={() => { add(item); unsave(item.id); }}
                    className="text-xs px-2.5 py-1 rounded-full font-medium transition-colors hover:opacity-90"
                    style={{ background: "#fef0f3", color: "#c9506e", border: "1px solid #f0ccd6" }}>
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — total + checkout */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t" style={{ borderColor: "#f0ccd6", background: "#fff" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: "#9b6674" }}>Estimated total</span>
              <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "#1a0a0e" }}>£{total.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full gap-2 text-sm text-white font-semibold py-3.5 border-0"
              style={{ background: "linear-gradient(135deg, #c9506e, #a3324e)", boxShadow: "0 6px 20px rgba(201,80,110,0.3)" }}
            >
              <ShoppingBag size={15} /> Shop now — {count} {count === 1 ? "item" : "items"}
              <ExternalLink size={12} className="ml-auto opacity-70" />
            </Button>
            <p className="text-[10px] text-center mt-2" style={{ color: "#c0a0a8" }}>
              Each item opens on Amazon UK with your cart pre-linked. Affiliate links support BlushMap.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
