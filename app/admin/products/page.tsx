'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/admin/PageHeader';
import FilterBar from '@/components/admin/FilterBar';
import DataTable, { Column } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { mockAdminProducts } from '@/lib/mock-data/admin';
import { AdminProduct } from '@/lib/types/admin';

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter products
  const filteredProducts = mockAdminProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStatus = !statusFilter || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'baseRentalPrice',
      label: 'Rental Price',
      sortable: true,
      render: (value) => `₹${value}`,
    },
    {
      key: 'totalRentals',
      label: 'Rentals',
      sortable: true,
    },
    {
      key: 'totalRevenue',
      label: 'Revenue',
      sortable: true,
      render: (value) => `₹${(value / 1000).toFixed(0)}K`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setStatusFilter('');
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="All products listed by vendors"
      />

      <FilterBar
        searchPlaceholder="Search by product name, vendor, or SKU..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            key: 'category',
            label: 'All Categories',
            options: [
              { label: 'Cameras', value: 'Cameras' },
              { label: 'Drones', value: 'Drones' },
              { label: 'Lighting', value: 'Lighting' },
              { label: 'Audio', value: 'Audio' },
            ],
            value: categoryFilter,
            onChange: setCategoryFilter,
          },
          {
            key: 'status',
            label: 'All Statuses',
            options: [
              { label: 'Published', value: 'Published' },
              { label: 'Unpublished', value: 'Unpublished' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        onClearFilters={handleClearFilters}
      />

      <DataTable
        columns={columns}
        data={filteredProducts}
        onRowClick={(product: AdminProduct) => router.push(`/admin/products/${product.id}`)}
        emptyMessage="No products found"
      />
    </div>
  );
}
