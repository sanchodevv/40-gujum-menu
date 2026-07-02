'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Dish } from '@/lib/supabase';

export type CartItem = {
  dish: Dish;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (dish: Dish) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (dish) => {
        set((state) => {
          const existing = state.items.find((i) => i.dish.id === dish.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { dish, quantity: 1 }] };
        });
      },

      removeItem: (dishId) => {
        set((state) => ({ items: state.items.filter((i) => i.dish.id !== dishId) }));
      },

      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(dishId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.dish.id === dishId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0),
    }),
    { name: 'gavhar-cart' }
  )
);
