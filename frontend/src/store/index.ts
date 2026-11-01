import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  itemCount: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((item) => item.product.id === product.id);
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
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((item) => item.product.id !== productId) });
        } else {
          set({
            items: get().items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
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
          set({ items: [...get().items, product] });
        }
      },
      removeItem: (productId) => {
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
      logout: () => set({ user: null, isAuthenticated: false }),
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
        set({ messages: [...get().messages, { role, content, timestamp: new Date() }] });
      },
      clearMessages: () => set({ messages: [] }),
    }),
    { name: 'himalaya-ai-chat' }
  )
);