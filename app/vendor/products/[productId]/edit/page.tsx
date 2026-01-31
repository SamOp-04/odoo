'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/vendor/PageHeader';
import { mockProducts } from '@/lib/mock-data/vendor';
import { Product } from '@/lib/types/vendor';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    sku: '',
    quantity: '',
    basePrice: '',
    deposit: '',
    hourlyRate: '',
    dailyRate: '',
    weeklyRate: '',
    isRentable: true,
    isPublished: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    // Simulate fetching product data
    const fetchProduct = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundProduct = mockProducts.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setFormData({
          name: foundProduct.name,
          category: foundProduct.category,
          description: foundProduct.description,
          sku: foundProduct.sku || '',
          quantity: foundProduct.quantityAvailable.toString(),
          basePrice: foundProduct.baseRentalPrice.toString(),
          deposit: foundProduct.securityDeposit.toString(),
          hourlyRate: '',
          dailyRate: '',
          weeklyRate: '',
          isRentable: true,
          isPublished: foundProduct.published,
        });
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.quantity || parseInt(formData.quantity) < 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.basePrice || parseFloat(formData.basePrice) < 0) newErrors.basePrice = 'Valid base price is required';
    if (!formData.deposit || parseFloat(formData.deposit) < 0) newErrors.deposit = 'Valid deposit is required';

    if (formData.isRentable) {
      if (!formData.hourlyRate || parseFloat(formData.hourlyRate) < 0) newErrors.hourlyRate = 'Valid hourly rate is required';
      if (!formData.dailyRate || parseFloat(formData.dailyRate) < 0) newErrors.dailyRate = 'Valid daily rate is required';
      if (!formData.weeklyRate || parseFloat(formData.weeklyRate) < 0) newErrors.weeklyRate = 'Valid weekly rate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    alert('Product updated successfully!');
    router.push('/vendor/products');
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    router.push('/vendor/products');
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Edit Product"
          breadcrumbs={[
            { label: 'Products', href: '/vendor/products' },
            { label: 'Edit Product' },
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <PageHeader
          title="Edit Product"
          breadcrumbs={[
            { label: 'Products', href: '/vendor/products' },
            { label: 'Edit Product' },
          ]}
        />
        <div className="bg-black border border-white rounded-lg p-8 text-center">
          <p className="text-red-400 text-lg">Product not found</p>
          <button
            onClick={() => router.push('/vendor/products')}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Edit Product: ${product.name}`}
        breadcrumbs={[
          { label: 'Products', href: '/vendor/products' },
          { label: product.name },
        ]}
      />

      <div className="bg-black border border-white rounded-lg p-8">
        <form className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={`w-full bg-black border ${errors.name ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full bg-black border ${errors.category ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600`}
                >
                  <option value="">Select category</option>
                  <option value="Cameras">Cameras</option>
                  <option value="Drones">Drones</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Audio">Audio</option>
                  <option value="Accessories">Accessories</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={4}
                  className={`w-full bg-black border ${errors.description ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Inventory & Pricing */}
          <div className="pt-8 border-t border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Inventory & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                  className={`w-full bg-black border ${errors.sku ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600`}
                />
                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  min="0"
                  className={`w-full bg-black border ${errors.quantity ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600`}
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Base Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder="Enter base price"
                  min="0"
                  step="0.01"
                  className={`w-full bg-black border ${errors.basePrice ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600`}
                />
                {errors.basePrice && <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Deposit (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  placeholder="Enter deposit"
                  min="0"
                  step="0.01"
                  className={`w-full bg-black border ${errors.deposit ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600`}
                />
                {errors.deposit && <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>}
              </div>
            </div>
          </div>

          {/* Rental Pricing */}
          <div className="pt-8 border-t border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Rental Pricing</h3>
              <label className="flex items-center space-x-3 cursor-pointer">
                <span className="text-gray-400">Enable Rentals</span>
                <input
                  type="checkbox"
                  name="isRentable"
                  checked={formData.isRentable}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white bg-black checked:bg-purple-600 focus:ring-2 focus:ring-purple-600"
                />
              </label>
            </div>

            {formData.isRentable && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Hourly Rate (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    placeholder="Enter hourly rate"
                    min="0"
                    step="0.01"
                    className={`w-full bg-black border ${errors.hourlyRate ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600`}
                  />
                  {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Daily Rate (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="dailyRate"
                    value={formData.dailyRate}
                    onChange={handleChange}
                    placeholder="Enter daily rate"
                    min="0"
                    step="0.01"
                    className={`w-full bg-black border ${errors.dailyRate ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600`}
                  />
                  {errors.dailyRate && <p className="text-red-500 text-sm mt-1">{errors.dailyRate}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Weekly Rate (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="weeklyRate"
                    value={formData.weeklyRate}
                    onChange={handleChange}
                    placeholder="Enter weekly rate"
                    min="0"
                    step="0.01"
                    className={`w-full bg-black border ${errors.weeklyRate ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600`}
                  />
                  {errors.weeklyRate && <p className="text-red-500 text-sm mt-1">{errors.weeklyRate}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Product Status */}
          <div className="pt-8 border-t border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Product Status</h3>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white bg-black checked:bg-purple-600 focus:ring-2 focus:ring-purple-600"
              />
              <span className="text-white">Publish this product (visible to customers)</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-black border border-white text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black border border-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Discard Changes?</h3>
            <p className="text-gray-400 mb-6">
              You have unsaved changes. Are you sure you want to leave this page?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-6 py-2 bg-black border border-white text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
              >
                Keep Editing
              </button>
              <button
                onClick={confirmCancel}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors font-medium"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
