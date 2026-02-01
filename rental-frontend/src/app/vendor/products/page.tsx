'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Package, Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  category?: string;
  quantity_on_hand: number;
  is_published: boolean;
  createdAt: string;
  images?: string[];
  description?: string;
  rental_pricing?: {
    hourly?: number;
    daily?: number;
    weekly?: number;
    custom?: {
      price?: number;
      period_days?: number;
    };
  };
  sale_price?: number;
  vendor_id?: {
    _id: string;
    name: string;
    company_name?: string;
  } | string;
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return 'https://placehold.co/400x300/1a1a1a/white?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    // For now, use placeholder images since actual product images don't exist
    return `https://placehold.co/400x300/1a1a1a/white?text=${encodeURIComponent(imagePath.split('.')[0] || 'Product')}`;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized - Please login');
        setLoading(false);
        return;
      }

      console.log('Fetching vendor products...');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch products');
      }

      const data = await res.json();
      console.log('Products fetched:', data);
      setProducts(data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ------------------ */
  /* TOGGLE PUBLISH */
  /* ------------------ */
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
        const err = await res.json();
        throw new Error(err.error || 'Publish toggle failed');
      }

      await fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  /* ------------------ */
  /* DELETE PRODUCT */
  /* ------------------ */
  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

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
        const err = await res.json();
        throw new Error(err.error || 'Delete failed');
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
      <DashboardLayout role="vendor">
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="vendor">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Products
            </h1>
            <p className="text-foreground-secondary">
              Manage your rental inventory
            </p>
          </div>
          <Button
            onClick={() => router.push('/vendor/products/new')}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Product
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
            <p className="font-semibold mb-1">Failed to load products</p>
            <p className="text-sm">Please make sure the backend server is running and try refreshing the page.</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary mb-1">
                    Total Products
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {products.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Package className="text-purple-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary mb-1">
                    Published
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {products.filter(p => p.is_published).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Eye className="text-green-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary mb-1">
                    Total Stock
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {products.reduce((sum, p) => sum + (p.quantity_on_hand || 0), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Package className="text-blue-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <Package className="mx-auto text-foreground-secondary mb-4" size={48} />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Products Yet
              </h3>
              <p className="text-foreground-secondary mb-6">
                Start adding products to your inventory
              </p>
              <Button onClick={() => router.push('/vendor/products/new')}>
                <Plus size={18} className="mr-2" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative h-48 bg-background-tertiary">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="text-foreground-secondary" size={48} />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <StatusBadge active={product.is_published} />
                  </div>
                </div>

                <CardContent className="pt-4">
                  {/* Product Info */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 truncate">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-2">
                    <span className="px-2 py-1 bg-background-tertiary rounded">
                      {product.category || 'Uncategorized'}
                    </span>
                    <span className="px-2 py-1 bg-background-tertiary rounded">
                      Stock: {product.quantity_on_hand || 0}
                    </span>
                  </div>

                  {product.description && (
                    <p className="text-sm text-foreground-secondary mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Pricing */}
                  {(product.rental_pricing || product.sale_price) && (
                    <div className="mb-4">
                      {product.rental_pricing && (
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          {product.rental_pricing.daily && (
                            <span className="text-foreground font-medium">
                              ₹{product.rental_pricing.daily}/day
                            </span>
                          )}
                          {product.rental_pricing.weekly && (
                            <span className="text-foreground-secondary">
                              ₹{product.rental_pricing.weekly}/week
                            </span>
                          )}
                          {product.rental_pricing.hourly && (
                            <span className="text-foreground-secondary text-xs">
                              ₹{product.rental_pricing.hourly}/hr
                            </span>
                          )}
                        </div>
                      )}
                      {product.sale_price && (
                        <div className="text-sm text-foreground-secondary mt-1">
                          Sale: ₹{product.sale_price}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublish(product._id)}
                      disabled={actionLoading === product._id}
                      className="flex-1"
                    >
                      {actionLoading === product._id ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          {product.is_published ? (
                            <EyeOff size={16} className="mr-1" />
                          ) : (
                            <Eye size={16} className="mr-1" />
                          )}
                          {product.is_published ? 'Unpublish' : 'Publish'}
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/vendor/products/${product._id}/edit`)}
                      disabled={actionLoading === product._id}
                    >
                      <Edit size={16} />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProduct(product._id)}
                      disabled={actionLoading === product._id}
                      className="text-error hover:bg-error/10"
                    >
                      {actionLoading === product._id ? (
                        <Spinner size="sm" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ------------------ */
/* Status Badge */
/* ------------------ */
function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? 'bg-green-500 text-white'
          : 'bg-gray-500 text-white'
      }`}
    >
      {active ? 'Published' : 'Unpublished'}
    </span>
  );
}
