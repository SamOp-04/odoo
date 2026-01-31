// src/store/cart/cartStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/models';

interface CartState {
  items: CartItem[];
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateItem: (productId: string, updates: Partial<CartItem>, variantId?: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalDeposit: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Check if item already exists
          const existingIndex = state.items.findIndex(
            (i) =>
              i.product._id === item.product._id &&
              i.variant?._id === item.variant?._id
          );

          if (existingIndex > -1) {
            // Update existing item
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + item.quantity,
            };
            return { items: newItems };
          } else {
            // Add new item
            return { items: [...state.items, item] };
          }
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product._id === productId &&
                (!variantId || item.variant?._id === variantId)
              )
          ),
        }));
      },

      updateItem: (productId, updates, variantId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId &&
            (!variantId || item.variant?._id === variantId)
              ? { ...item, ...updates }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalAmount: () => {
        return get().items.reduce((total, item) => total + item.pricing.subtotal, 0);
      },

      getTotalDeposit: () => {
        return get().items.reduce((total, item) => total + item.pricing.deposit, 0);
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;