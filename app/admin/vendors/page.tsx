'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/admin/PageHeader';
import FilterBar from '@/components/admin/FilterBar';
import DataTable, { Column } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { mockVendors } from '@/lib/mock-data/admin';
import { Vendor } from '@/lib/types/admin';

export default function VendorsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('');

  // Filter vendors
  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort vendors
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (sortFilter === 'revenue') return b.totalRevenue - a.totalRevenue;
    if (sortFilter === 'orders') return b.totalOrders - a.totalOrders;
    if (sortFilter === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Vendor Name',
      sortable: true,
    },
    {
      key: 'companyName',
      label: 'Company',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'totalRevenue',
      label: 'Revenue',
      sortable: true,
      render: (value) => `₹${(value / 100000).toFixed(1)}L`,
    },
    {
      key: 'totalOrders',
      label: 'Orders',
      sortable: true,
    },
    {
      key: 'activeProducts',
      label: 'Products',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setSortFilter('');
  };

  return (
    <div>
      <PageHeader
        title="Vendors"
        subtitle="Manage vendors, their status, and performance"
        actions={
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium">
            Add Vendor
          </button>
        }
      />

      <FilterBar
        searchPlaceholder="Search by name, company, or email..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            key: 'status',
            label: 'All Statuses',
            options: [
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
              { label: 'Suspended', value: 'Suspended' },
              { label: 'Pending', value: 'Pending' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            key: 'sort',
            label: 'Sort By',
            options: [
              { label: 'Revenue', value: 'revenue' },
              { label: 'Orders', value: 'orders' },
              { label: 'Name', value: 'name' },
            ],
            value: sortFilter,
            onChange: setSortFilter,
          },
        ]}
        onClearFilters={handleClearFilters}
      />

      <DataTable
        columns={columns}
        data={sortedVendors}
        onRowClick={(vendor: Vendor) => router.push(`/admin/vendors/${vendor.id}`)}
        emptyMessage="No vendors found"
      />
    </div>
  );
}
