import { useEffect, useReducer } from "react";

const STORAGE_KEY = "market-lane-cart-v1";
const EMPTY_CART = { items: [], couponCode: null };

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && Array.isArray(parsed.items)) {
      return { items: parsed.items, couponCode: parsed.couponCode ?? null };
    }
  } catch {
    // Corrupted storage: start with an empty cart.
  }
  return EMPTY_CART;
}

function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const p = action.product;
      if (p.stock < 1) return state;
      const existing = state.items.find((i) => i.id === p.id);
      if (existing) {
        if (existing.qty >= p.stock) return state;
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === p.id ? { ...i, qty: i.qty + 1, stock: p.stock } : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { id: p.id, name: p.name, price: p.price, emoji: p.emoji, stock: p.stock, qty: 1 },
        ],
      };
    }
    case "setQty":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: Math.max(1, Math.min(action.qty, i.stock)) } : i
        ),
      };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "syncStock": {
      // Keeps cart prices, names and stock in line with the latest catalogue.
      const byId = new Map(action.products.map((p) => [p.id, p]));
      const items = state.items
        .map((i) => {
          const p = byId.get(i.id);
          if (!p) return null;
          return { ...i, name: p.name, price: p.price, emoji: p.emoji, stock: p.stock, qty: Math.min(i.qty, p.stock) };
        })
        .filter((i) => i && i.qty > 0);
      return { ...state, items };
    }
    case "applyCoupon":
      return { ...state, couponCode: action.code };
    case "removeCoupon":
      return { ...state, couponCode: null };
    case "clear":
      return EMPTY_CART;
    default:
      return state;
  }
}

export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, dispatch];
}
