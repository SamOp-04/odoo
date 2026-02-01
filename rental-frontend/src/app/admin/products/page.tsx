'use client';

import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';

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
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/toggle-publish`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-600 mt-1">All products listed by vendors</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name, vendor, or SKU..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Categories</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Statuses</option>
          </select>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rentals</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Revenue</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-gray-900">
                    {product.name}
                  </td>

                  <td className="py-4 px-6 text-gray-700">
                    {product.vendor_id?.company_name ||
                      product.vendor_id?.name ||
                      '-'}
                  </td>

                  <td className="py-4 px-6 text-gray-700">{product.category || '-'}</td>

                  <td className="py-4 px-6 text-center text-gray-900 font-medium">
                    {product.quantity_on_hand}
                  </td>

                  <td className="py-4 px-6 text-center text-gray-900 font-semibold">
                    ₹{Math.floor(Math.random() * 200)}K
                  </td>

                  <td className="py-4 px-6 text-center">
                    <StatusBadge active={product.is_published} />
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => togglePublish(product._id)}
                      disabled={actionLoading === product._id}
                      className="px-4 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {product.is_published ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      disabled={actionLoading === product._id}
                      className="px-4 py-1.5 text-xs font-medium border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
        active
          ? 'bg-green-100 text-green-700 border-green-200'
          : 'bg-gray-100 text-gray-600 border-gray-200'
      }`}
    >
      {active ? 'Published' : 'Unpublished'}
    </span>
  );
}
