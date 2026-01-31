'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/admin/PageHeader';
import FilterBar from '@/components/admin/FilterBar';
import DataTable, { Column } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { mockAdminOrders } from '@/lib/mock-data/admin';
import { AdminOrder } from '@/lib/types/admin';

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter orders
  const filteredOrders = mockAdminOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column[] = [
    {
      key: 'orderNumber',
      label: 'Order ID',
      sortable: true,
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      sortable: true,
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'rentalPeriod',
      label: 'Rental Period',
      render: (value) => `${value.start} - ${value.end}`,
    },
    {
      key: 'pricing',
      label: 'Total Amount',
      sortable: true,
      render: (value) => `₹${value.total.toLocaleString()}`,
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
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="System-wide order management"
      />

      <FilterBar
        searchPlaceholder="Search by order ID, customer, or vendor..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            key: 'status',
            label: 'All Statuses',
            options: [
              { label: 'Confirmed', value: 'Confirmed' },
              { label: 'With Customer', value: 'With Customer' },
              { label: 'Returned', value: 'Returned' },
              { label: 'Canceled', value: 'Canceled' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        onClearFilters={handleClearFilters}
      />

      <DataTable
        columns={columns}
        data={filteredOrders}
        onRowClick={(order: AdminOrder) => router.push(`/admin/orders/${order.id}`)}
        emptyMessage="No orders found"
      />
    </div>
  );
}
