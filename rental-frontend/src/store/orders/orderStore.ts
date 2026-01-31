import { create } from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface OrderLine {
  product_id?: string;
  product_name: string;
  quantity: number;
  subtotal: number;
  product_image?: string;
}

export interface Order {
  _id: string;
  order_number: string;
  status: string;
  total_amount: number;
  createdAt: string;
  return_date?: string;
  customer_id?: {
    name: string;
    company_name?: string;
  };
  vendor_id?: {
    name: string;
    company_name?: string;
  };
  lines: OrderLine[];
}

interface OrderStore {
  orders: Order[];
  loading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  markPickedUp: (orderId: string) => Promise<void>;
  markReturned: (orderId: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  /* ------------------ */
  /* FETCH ORDERS */
  /* ------------------ */
  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      const res = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch orders');
      }

      const data = await res.json();
      set({ orders: data });
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong' });
    } finally {
      set({ loading: false });
    }
  },

  /* ------------------ */
  /* CANCEL ORDER (CUSTOMER) */
  /* ------------------ */
  cancelOrder: async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      const res = await fetch(
        `${API_URL}/api/orders/${orderId}/cancel`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Cancel failed');
      }

      // Refresh list
      await get().fetchOrders();
    } catch (err: any) {
      set({ error: err.message || 'Cancel failed' });
      throw err;
    }
  },

  /* ------------------ */
  /* MARK PICKED UP (VENDOR) */
  /* ------------------ */
  markPickedUp: async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      const res = await fetch(
        `${API_URL}/api/orders/${orderId}/pickup`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Pickup failed');
      }

      await get().fetchOrders();
    } catch (err: any) {
      set({ error: err.message || 'Pickup failed' });
      throw err;
    }
  },

  /* ------------------ */
  /* MARK RETURNED (VENDOR) */
  /* ------------------ */
  markReturned: async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      const res = await fetch(
        `${API_URL}/api/orders/${orderId}/return`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            actualReturnDate: new Date().toISOString(),
            conditionNotes: 'Returned in good condition',
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Return failed');
      }

      await get().fetchOrders();
    } catch (err: any) {
      set({ error: err.message || 'Return failed' });
      throw err;
    }
  },
}));
