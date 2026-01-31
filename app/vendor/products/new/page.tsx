'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/vendor/PageHeader';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rentable, setRentable] = useState(true);
  const [published, setPublished] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    sku: '',
    quantityAvailable: 0,
    baseRentalPrice: 0,
    securityDeposit: 0,
    hourlyPrice: 0,
    dailyPrice: 0,
    weeklyPrice: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.quantityAvailable < 0) newErrors.quantityAvailable = 'Quantity cannot be negative';
    if (formData.baseRentalPrice <= 0) newErrors.baseRentalPrice = 'Rental price must be greater than 0';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    
    // Show success toast (implement toast system)
    alert('Product created successfully!');
    router.push('/vendor/products');
  };

  const handleCancel = () => {
    if (Object.values(formData).some(val => val !== '' && val !== 0)) {
      if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
        router.push('/vendor/products');
      }
    } else {
      router.push('/vendor/products');
    }
  };

  return (
    <div>
      <PageHeader
        title="Add Product"
        breadcrumbs={[
          { label: 'Vendor', href: '/vendor/dashboard' },
          { label: 'Products', href: '/vendor/products' },
          { label: 'Add Product' },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div className="bg-black border border-white rounded-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>

              {/* Product Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
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
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full bg-black border ${errors.category ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600`}
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  SKU / Product Code
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pricing & Quantity</h3>

              {/* Quantity Available */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Quantity on Hand <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantityAvailable"
                  value={formData.quantityAvailable}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={`w-full bg-black border ${errors.quantityAvailable ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600`}
                />
                {errors.quantityAvailable && <p className="text-red-500 text-xs mt-1">{errors.quantityAvailable}</p>}
              </div>

              {/* Base Rental Price */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Base Rental Price (per day) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="baseRentalPrice"
                  value={formData.baseRentalPrice}
                  onChange={handleChange}
                  placeholder="₹0.00"
                  min="0"
                  step="0.01"
                  className={`w-full bg-black border ${errors.baseRentalPrice ? 'border-red-500' : 'border-white'} rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600`}
                />
                {errors.baseRentalPrice && <p className="text-red-500 text-xs mt-1">{errors.baseRentalPrice}</p>}
              </div>

              {/* Security Deposit */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Security Deposit
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="₹0.00"
                  min="0"
                  step="0.01"
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <p className="text-gray-400 text-xs mt-1">Optional refundable deposit amount</p>
              </div>

              {/* Rentable Toggle */}
              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Rentable
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setRentable(!rentable)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      rentable ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        rentable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="ml-3 text-gray-400 text-sm">{rentable ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {/* Rental Pricing Options */}
              {rentable && (
                <div className="border-l-2 border-purple-600 pl-4 space-y-4">
                  <label className="block text-white text-sm font-medium mb-3">
                    Additional Rental Pricing
                  </label>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Hourly Price</label>
                    <input
                      type="number"
                      name="hourlyPrice"
                      value={formData.hourlyPrice}
                      onChange={handleChange}
                      placeholder="₹0.00"
                      min="0"
                      step="0.01"
                      className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Daily Price</label>
                    <input
                      type="number"
                      name="dailyPrice"
                      value={formData.dailyPrice}
                      onChange={handleChange}
                      placeholder="₹0.00"
                      min="0"
                      step="0.01"
                      className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Weekly Price</label>
                    <input
                      type="number"
                      name="weeklyPrice"
                      value={formData.weeklyPrice}
                      onChange={handleChange}
                      placeholder="₹0.00"
                      min="0"
                      step="0.01"
                      className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              )}

              {/* Publish Toggle */}
              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Publish Status
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setPublished(!published)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      published ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        published ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="ml-3 text-gray-400 text-sm">{published ? 'Published' : 'Unpublished'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Product Images</h3>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-600 transition-colors cursor-pointer">
              <UploadIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
              <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-8 border-t border-gray-700 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-2.5 bg-black border border-white text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function UploadIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}
