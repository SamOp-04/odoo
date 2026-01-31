'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/vendor/PageHeader';
import StatusBadge from '@/components/vendor/StatusBadge';
import { mockProducts } from '@/lib/mock-data/vendor';
import type { Product } from '@/lib/types/vendor';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStatus = !statusFilter ||
      (statusFilter === 'published' && product.published) ||
      (statusFilter === 'unpublished' && !product.published);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const togglePublish = (productId: string) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, published: !p.published } : p)
    );
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div>
      <PageHeader
        title="Products"
        actions={
          <Link
            href="/vendor/products/new"
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium"
          >
            Add Product
          </Link>
        }
      />

      {/* Filters */}
      <div className="bg-black border border-white rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>
        </div>

        {(searchTerm || categoryFilter || statusFilter) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
              setStatusFilter('');
            }}
            className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-black border border-white rounded-lg overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Image</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Product Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Quantity</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Rental Price</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                    <td className="py-4 px-4">
                      <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">IMG</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white font-medium">{product.name}</div>
                      {product.sku && <div className="text-gray-400 text-sm">{product.sku}</div>}
                    </td>
                    <td className="py-4 px-4 text-white">{product.category}</td>
                    <td className="py-4 px-4">
                      <span className={`text-white ${product.quantityAvailable === 0 ? 'text-red-400' : ''}`}>
                        {product.quantityAvailable} units
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white">₹{product.baseRentalPrice} / Day</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={product.published ? 'Published' : 'Unpublished'} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/vendor/products/${product.id}/edit`}
                          className="px-3 py-1.5 text-xs rounded-full font-medium bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => togglePublish(product.id)}
                          className="px-3 py-1.5 text-xs rounded-full font-medium bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors"
                        >
                          {product.published ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <BoxIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No products found</p>
            <p className="text-gray-500 text-sm mb-6">
              {searchTerm || categoryFilter || statusFilter
                ? 'Try adjusting your filters'
                : 'Get started by adding your first product'}
            </p>
            {!searchTerm && !categoryFilter && !statusFilter && (
              <Link
                href="/vendor/products/new"
                className="inline-block px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium"
              >
                Add Product
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BoxIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
