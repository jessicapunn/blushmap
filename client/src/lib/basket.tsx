import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface BasketItem {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  affiliateUrl: string;
  category: string;
  shade?: string; // for try-on items
  qty: number;
}

interface BasketCtx {
  items: BasketItem[];
  savedItems: BasketItem[];
  add: (item: Omit<BasketItem, "qty">) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  save: (item: Omit<BasketItem, "qty">) => void;
  unsave: (id: string) => void;
  isSaved: (id: string) => boolean;
  isInBasket: (id: string) => boolean;
  total: number;
  count: number;
  clear: () => void;
}

const Ctx = createContext<BasketCtx | null>(null);

function loadLS(key: string) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}
function saveLS(key: string, data: any) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems]       = useState<BasketItem[]>(() => loadLS("blushmap_basket"));
  const [savedItems, setSaved]  = useState<BasketItem[]>(() => loadLS("blushmap_saved"));

  useEffect(() => saveLS("blushmap_basket", items), [items]);
  useEffect(() => saveLS("blushmap_saved", savedItems), [savedItems]);

  function add(item: Omit<BasketItem, "qty">) {
    setItems(prev => {
      const ex = prev.find(i => i.id === item.id && i.shade === item.shade);
      if (ex) return prev.map(i => (i.id === item.id && i.shade === item.shade) ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function remove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function updateQty(id: string, qty: number) {
    if (qty <= 0) { remove(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }

  function save(item: Omit<BasketItem, "qty">) {
    setSaved(prev => prev.find(i => i.id === item.id) ? prev : [...prev, { ...item, qty: 1 }]);
  }

  function unsave(id: string) {
    setSaved(prev => prev.filter(i => i.id !== id));
  }

  const isSaved    = (id: string) => savedItems.some(i => i.id === id);
  const isInBasket = (id: string) => items.some(i => i.id === id);

  const total = items.reduce((sum, i) => {
    const price = parseFloat(i.price.replace(/[^0-9.]/g, "")) || 0;
    return sum + price * i.qty;
  }, 0);

  const count = items.reduce((s, i) => s + i.qty, 0);

  function clear() { setItems([]); }

  return (
    <Ctx.Provider value={{ items, savedItems, add, remove, updateQty, save, unsave, isSaved, isInBasket, total, count, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useBasket() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBasket must be used inside BasketProvider");
  return ctx;
}
