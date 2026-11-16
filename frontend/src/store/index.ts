import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';
import { trackEvent } from '@/lib/analytics';

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
  description: string;
}

interface CartState {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getTotal: () => number;
  getDiscount: () => number;
  getFinalTotal: () => number;
  getItemCount: () => number;
  itemCount: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((item) => item.product.id === product.id);

        trackEvent({
          type: 'add_to_cart',
          productId: product.id,
          name: product.name,
          quantity,
          price: product.price,
        });

        if (existing) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { id: Date.now(), product, quantity, price: product.price }] });
        }
      },

      removeItem: (productId) => {
        trackEvent({
          type: 'remove_from_cart',
          productId,
        });
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          });
        }
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      applyCoupon: (code: string) => {
        const normalized = code.trim().toUpperCase();
        // Supported coupons (matches backend & marketing promotions)
        const validCoupons: Record<string, { percent: number; desc: string }> = {
          HIMALAYA10: { percent: 10, desc: '10% Harvest Discount' },
          FRESH20: { percent: 20, desc: '20% Orchard Welcome Discount' },
          KINNAUR15: { percent: 15, desc: '15% Kinnaur Valley Special' },
        };

        if (validCoupons[normalized]) {
          const promo = validCoupons[normalized];
          const coupon: AppliedCoupon = {
            code: normalized,
            discountPercent: promo.percent,
            description: promo.desc,
          };
          set({ appliedCoupon: coupon });
          return { success: true, message: `Coupon ${normalized} applied (${promo.percent}% off)!` };
        }

        return { success: false, message: 'Invalid or expired coupon code. Try HIMALAYA10 or FRESH20.' };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),

      getDiscount: () => {
        const total = get().getTotal();
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        return Math.round((total * coupon.discountPercent) / 100);
      },

      getFinalTotal: () => {
        const subtotal = get().getTotal();
        const discount = get().getDiscount();
        return Math.max(0, subtotal - discount);
      },

      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
      get itemCount() { return get().items.reduce((count, item) => count + item.quantity, 0); },
    }),
    { name: 'himalaya-cart' }
  )
);

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (!get().isInWishlist(product.id)) {
          trackEvent({ type: 'wishlist_toggle', productId: product.id, inWishlist: true });
          set({ items: [...get().items, product] });
        }
      },
      removeItem: (productId) => {
        trackEvent({ type: 'wishlist_toggle', productId, inWishlist: false });
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      isInWishlist: (productId: number) => get().items.some((item) => item.id === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'himalaya-wishlist' }
  )
);

interface AuthState {
  user: { id: number; email: string; name: string; avatar?: string } | null;
  isAuthenticated: boolean;
  login: (user: { id: number; email: string; name: string; avatar?: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'himalaya-auth' }
  )
);

interface AIChatState {
  isOpen: boolean;
  messages: { role: 'user' | 'assistant'; content: string; timestamp: Date }[];
  openChat: () => void;
  closeChat: () => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
}

export const useAIChatStore = create<AIChatState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      messages: [],
      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),
      addMessage: (role, content) => {
        trackEvent({ type: 'ai_chat_interaction', message: content, role });
        set({ messages: [...get().messages, { role, content, timestamp: new Date() }] });
      },
      clearMessages: () => set({ messages: [] }),
    }),
    { name: 'himalaya-ai-chat' }
  )
);
