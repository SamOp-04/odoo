'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { ArrowLeft, Save, Package, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  quantity_on_hand: number;
  cost_price: number;
  rental_pricing: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  security_deposit: number;
  is_published: boolean;
}

const categories = [
  'Electronics',
  'Furniture',
  'Tools',
  'Audio/Video',
  'Cameras',
  'Computers',
  'Sports',
  'Events',
  'Other'
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    quantity_on_hand: 1,
    cost_price: 0,
    rental_pricing: {
      hourly: 0,
      daily: 0,
      weekly: 0,
    },
    security_deposit: 0,
    is_published: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('rental_')) {
      const pricingField = name.replace('rental_', '');
      setFormData({
        ...formData,
        rental_pricing: {
          ...formData.rental_pricing,
          [pricingField]: value === '' ? 0 : parseFloat(value),
        },
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + imageFiles.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return;
      }
      
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setImageFiles([...imageFiles, ...validFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (formData.quantity_on_hand < 0) {
      toast.error('Quantity cannot be negative');
      return;
    }
    if (formData.rental_pricing.daily === 0 && formData.rental_pricing.weekly === 0) {
      toast.error('Please set at least daily or weekly rental price');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized - Please login');
        router.push('/auth/login');
        return;
      }

      // Step 1: Create the product
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          rental_pricing: {
            ...(formData.rental_pricing.hourly > 0 && { hourly: formData.rental_pricing.hourly }),
            ...(formData.rental_pricing.daily > 0 && { daily: formData.rental_pricing.daily }),
            ...(formData.rental_pricing.weekly > 0 && { weekly: formData.rental_pricing.weekly }),
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const product = await res.json();
      
      // Step 2: Upload images if any
      if (imageFiles.length > 0) {
        const formDataImages = new FormData();
        imageFiles.forEach((file) => {
          formDataImages.append('images', file);
        });

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}/images`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataImages,
          }
        );

        if (!uploadRes.ok) {
          console.error('Failed to upload images, but product was created');
          toast.success('Product created, but some images failed to upload');
        } else {
          toast.success('Product created successfully with images!');
        }
      } else {
        toast.success('Product created successfully!');
      }
      
      router.push('/vendor/products');
    } catch (err: any) {
      console.error('Error creating product:', err);
      toast.error(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/vendor/products')}
              disabled={loading}
            >
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
              <p className="text-foreground-secondary mt-1">
                Create a new product for rental
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 4K LED Projector"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe your product..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category <span className="text-error">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Upload Images (Max 10, 5MB each)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                      <Upload size={18} />
                      Choose Images
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={loading || imageFiles.length >= 10}
                      />
                    </label>
                    <span className="text-sm text-foreground-secondary">
                      {imageFiles.length} / 10 images selected
                    </span>
                  </div>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-foreground-secondary/20"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {imagePreviews.length === 0 && (
                  <div className="border-2 border-dashed border-foreground-secondary/20 rounded-lg p-8 text-center">
                    <Upload size={48} className="mx-auto text-foreground-secondary mb-2" />
                    <p className="text-foreground-secondary">
                      No images selected. Click "Choose Images" to add product photos.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quantity Available <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity_on_hand"
                    value={formData.quantity_on_hand}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Cost Price */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    name="cost_price"
                    value={formData.cost_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-foreground-secondary mt-1">
                    Your purchase cost (for internal tracking)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Pricing */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rental Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Hourly Rate (₹)
                  </label>
                  <input
                    type="number"
                    name="rental_hourly"
                    value={formData.rental_pricing.hourly}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Daily Rate (₹) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="rental_daily"
                    value={formData.rental_pricing.daily}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Weekly Rate (₹)
                  </label>
                  <input
                    type="number"
                    name="rental_weekly"
                    value={formData.rental_pricing.weekly}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <p className="text-xs text-foreground-secondary mt-3">
                Set at least one rental rate (daily recommended)
              </p>
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Security Deposit */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    name="security_deposit"
                    value={formData.security_deposit}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-foreground-secondary mt-1">
                    Refundable deposit amount
                  </p>
                </div>

                {/* Publish Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_published"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={handleCheckbox}
                    className="w-4 h-4 rounded border-foreground-secondary/20"
                  />
                  <label htmlFor="is_published" className="text-sm text-foreground cursor-pointer">
                    Publish immediately (make visible to customers)
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/vendor/products')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Create Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
