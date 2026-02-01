// src/store/cart/cartStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/models';

interface CartState {
  items: CartItem[];
  quotationId: string | null;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateItem: (productId: string, updates: Partial<CartItem>, variantId?: string) => void;
  clearCart: () => void;
  setQuotationId: (id: string | null) => void;
  syncQuotation: () => Promise<void>;
  getTotalAmount: () => number;
  getTotalDeposit: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      quotationId: null,

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
        
        // Sync with backend quotation after state update
        setTimeout(() => get().syncQuotation(), 100);
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
        
        // Sync with backend after removal
        setTimeout(() => get().syncQuotation(), 100);
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
        
        // Sync with backend after update
        setTimeout(() => get().syncQuotation(), 100);
      },

      clearCart: () => {
        set({ items: [], quotationId: null });
      },

      setQuotationId: (id) => set({ quotationId: id }),

      syncQuotation: async () => {
        const { items, quotationId } = get();
        
        if (items.length === 0) {
          if (quotationId) {
            // Delete quotation if cart is empty
            try {
              const token = localStorage.getItem('token');
              if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotations/${quotationId}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` },
                });
              }
            } catch (error) {
              console.error('Error deleting quotation:', error);
            }
            set({ quotationId: null });
          }
          return;
        }

        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          // Prepare quotation lines
          const lines = items.map(item => ({
            product_id: item.product._id,
            variant_id: item.variant?._id,
            quantity: item.quantity,
            rental_start_date: item.startDate,
            rental_end_date: item.endDate,
            rental_duration_type: item.durationType || 'daily',
          }));

          if (quotationId) {
            // Update existing quotation
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotations/${quotationId}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ lines }),
            });

            if (!res.ok) {
              throw new Error('Failed to update quotation');
            }
          } else {
            // Create new quotation
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotations`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ lines }),
            });

            if (!res.ok) {
              throw new Error('Failed to create quotation');
            }

            const quotation = await res.json();
            set({ quotationId: quotation._id });
          }
        } catch (error) {
          console.error('Error syncing quotation:', error);
        }
      },

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