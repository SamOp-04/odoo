import { create } from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  rental_price: number;
  quantity_on_hand: number;
  is_published: boolean;
  images?: string[];
  vendor_id?: {
    name: string;
    company_name?: string;
  };
  createdAt: string;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  togglePublish: (productId: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  /* ------------------ */
  /* FETCH PRODUCTS */
  /* ------------------ */
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/products`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch products');
      }

      const data = await res.json();
      set({ products: data });
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong' });
    } finally {
      set({ loading: false });
    }
  },

  /* ------------------ */
  /* TOGGLE PUBLISH */
  /* ------------------ */
  togglePublish: async (productId: string) => {
    try {
      set({ error: null });

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      const res = await fetch(
        `${API_URL}/api/products/${productId}/toggle-publish`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Publish toggle failed');
      }

      await get().fetchProducts();
    } catch (err: any) {
      set({ error: err.message || 'Publish toggle failed' });
      throw err;
    }
  },

  /* ------------------ */
  /* DELETE PRODUCT */
  /* ------------------ */
  deleteProduct: async (productId: string) => {
    try {
      set({ error: null });

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      const res = await fetch(
        `${API_URL}/api/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Delete failed');
      }

      set((state) => ({
        products: state.products.filter(
          (p) => p._id !== productId
        ),
      }));
    } catch (err: any) {
      set({ error: err.message || 'Delete failed' });
      throw err;
    }
  },
}));
