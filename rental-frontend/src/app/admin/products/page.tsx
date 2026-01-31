'use client';

import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  category?: string;
  quantity_on_hand: number;
  is_published: boolean;
  vendor_id?: {
    name: string;
    company_name?: string;
  };
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const togglePublish = async (productId: string) => {
    try {
      setActionLoading(productId);

      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/toggle-publish`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to update publish status');
      }

      await fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteProduct = async (productId: string) => {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      setActionLoading(productId);

      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading products…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Products</h1>

      <div className="rounded bg-white p-4 shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Product</th>
              <th>Category</th>
              <th>Vendor</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="py-2 font-medium">
                  {product.name}
                </td>

                <td>{product.category || '-'}</td>

                <td>
                  {product.vendor_id?.company_name ||
                    product.vendor_id?.name ||
                    '-'}
                </td>

                <td>{product.quantity_on_hand}</td>

                <td>
                  <StatusBadge
                    active={product.is_published}
                  />
                </td>

                <td className="text-right space-x-2">
                  <button
                    onClick={() => togglePublish(product._id)}
                    disabled={actionLoading === product._id}
                    className="rounded border px-3 py-1 text-xs"
                  >
                    {product.is_published ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    disabled={actionLoading === product._id}
                    className="rounded border border-red-300 px-3 py-1 text-xs text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 text-center text-gray-500"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------ */
/* Status Badge */
/* ------------------ */
function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-medium ${
        active
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      {active ? 'Published' : 'Unpublished'}
    </span>
  );
}
