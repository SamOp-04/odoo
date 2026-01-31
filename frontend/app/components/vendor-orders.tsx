'use client';

import React, { useState } from 'react';

const VendorOrders = () => {
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  const orders = [
    {
      id: 'ORD-1001',
      customer: 'John Doe',
      product: 'MacBook Pro 16"',
      rentalPeriod: 'Feb 1-15, 2026',
      amount: 4600,
      status: 'confirmed'
    },
    {
      id: 'ORD-1002',
      customer: 'Jane Smith',
      product: 'Canon EOS R5',
      rentalPeriod: 'Feb 5-10, 2026',
      amount: 880,
      status: 'with-customer'
    },
    {
      id: 'ORD-1003',
      customer: 'Mike Johnson',
      product: 'iPad Pro 12.9"',
      rentalPeriod: 'Feb 3-12, 2026',
      amount: 1815,
      status: 'returned'
    },
    {
      id: 'ORD-1004',
      customer: 'Sarah Wilson',
      product: 'Gaming Console',
      rentalPeriod: 'Feb 7-14, 2026',
      amount: 525,
      status: 'confirmed'
    },
    {
      id: 'ORD-1005',
      customer: 'Tom Brown',
      product: 'Smart TV 55"',
      rentalPeriod: 'Feb 6-20, 2026',
      amount: 1680,
      status: 'with-customer'
    },
    {
      id: 'ORD-1006',
      customer: 'Lisa Davis',
      product: 'Wireless Speaker',
      rentalPeriod: 'Feb 4-6, 2026',
      amount: 90,
      status: 'cancelled'
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      'confirmed': 'bg-green-600 border-green-500 text-green-100',
      'with-customer': 'bg-orange-600 border-orange-500 text-orange-100',
      'returned': 'bg-blue-600 border-blue-500 text-blue-100',
      'cancelled': 'bg-red-600 border-red-500 text-red-100'
    };
    
    const labels = {
      'confirmed': 'Confirmed',
      'with-customer': 'With Customer',
      'returned': 'Returned',
      'cancelled': 'Cancelled'
    };

    return (
      <span className={`px-3 py-1 rounded-full border text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getActionButton = (status: string, orderId: string) => {
    if (status === 'confirmed') {
      return (
        <button className="px-3 py-1 bg-orange-600 border border-orange-500 text-orange-100 rounded text-sm hover:bg-orange-500 transition-colors">
          Mark as Picked Up
        </button>
      );
    } else if (status === 'with-customer') {
      return (
        <button className="px-3 py-1 bg-blue-600 border border-blue-500 text-blue-100 rounded text-sm hover:bg-blue-500 transition-colors">
          Mark as Returned
        </button>
      );
    } else {
      return (
        <span className="px-3 py-1 text-gray-500 text-sm">No action</span>
      );
    }
  };

  const getColumnOrders = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  const getColumnCount = (status: string) => {
    return getColumnOrders(status).length;
  };

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="text-left py-4 px-4 text-gray-300 font-medium">Order ID</th>
            <th className="text-left py-4 px-4 text-gray-300 font-medium">Customer</th>
            <th className="text-left py-4 px-4 text-gray-300 font-medium">Product</th>
            <th className="text-left py-4 px-4 text-gray-300 font-medium">Rental Period</th>
            <th className="text-left py-4 px-4 text-gray-300 font-medium">Amount</th>
            <th className="text-left py-4 px-4 text-gray-300 font-medium">Status</th>
            <th className="text-left py-4 px-4 text-gray-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-750">
              <td className="py-4 px-4 text-white font-medium">{order.id}</td>
              <td className="py-4 px-4 text-white">{order.customer}</td>
              <td className="py-4 px-4 text-white">{order.product}</td>
              <td className="py-4 px-4 text-gray-300">{order.rentalPeriod}</td>
              <td className="py-4 px-4 text-white">${order.amount}</td>
              <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
              <td className="py-4 px-4">{getActionButton(order.status, order.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderKanbanView = () => (
    <div className="grid grid-cols-4 gap-6">
      {/* Confirmed Column */}
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-2">
          <h3 className="text-white font-medium">Confirmed</h3>
          <span className="text-sm text-gray-400">{getColumnCount('confirmed')}</span>
        </div>
        <div className="space-y-3">
          {getColumnOrders('confirmed').map((order) => (
            <div key={order.id} className="bg-gray-800 border border-gray-600 rounded-lg p-3">
              <div className="text-white font-medium text-sm mb-1">{order.customer}</div>
              <div className="text-gray-400 text-xs mb-1">{order.id}</div>
              <div className="text-gray-300 text-xs mb-2">{order.product}</div>
              <div className="text-gray-400 text-xs mb-2">{order.rentalPeriod}</div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">${order.amount}</span>
                {getStatusBadge(order.status)}
              </div>
              <button className="w-full mt-2 px-2 py-1 bg-orange-600 border border-orange-500 text-orange-100 rounded text-xs hover:bg-orange-500 transition-colors">
                Mark as Picked Up
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* With Customer Column */}
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-2">
          <h3 className="text-white font-medium">With Customer</h3>
          <span className="text-sm text-gray-400">{getColumnCount('with-customer')}</span>
        </div>
        <div className="space-y-3">
          {getColumnOrders('with-customer').map((order) => (
            <div key={order.id} className="bg-gray-800 border border-gray-600 rounded-lg p-3">
              <div className="text-white font-medium text-sm mb-1">{order.customer}</div>
              <div className="text-gray-400 text-xs mb-1">{order.id}</div>
              <div className="text-gray-300 text-xs mb-2">{order.product}</div>
              <div className="text-gray-400 text-xs mb-2">{order.rentalPeriod}</div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">${order.amount}</span>
                {getStatusBadge(order.status)}
              </div>
              <button className="w-full mt-2 px-2 py-1 bg-blue-600 border border-blue-500 text-blue-100 rounded text-xs hover:bg-blue-500 transition-colors">
                Mark as Returned
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Returned Column */}
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-2">
          <h3 className="text-white font-medium">Returned</h3>
          <span className="text-sm text-gray-400">{getColumnCount('returned')}</span>
        </div>
        <div className="space-y-3">
          {getColumnOrders('returned').map((order) => (
            <div key={order.id} className="bg-gray-800 border border-gray-600 rounded-lg p-3">
              <div className="text-white font-medium text-sm mb-1">{order.customer}</div>
              <div className="text-gray-400 text-xs mb-1">{order.id}</div>
              <div className="text-gray-300 text-xs mb-2">{order.product}</div>
              <div className="text-gray-400 text-xs mb-2">{order.rentalPeriod}</div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">${order.amount}</span>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancelled Column */}
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-2">
          <h3 className="text-white font-medium">Cancelled</h3>
          <span className="text-sm text-gray-400">{getColumnCount('cancelled')}</span>
        </div>
        <div className="space-y-3">
          {getColumnOrders('cancelled').map((order) => (
            <div key={order.id} className="bg-gray-800 border border-gray-600 rounded-lg p-3">
              <div className="text-white font-medium text-sm mb-1">{order.customer}</div>
              <div className="text-gray-400 text-xs mb-1">{order.id}</div>
              <div className="text-gray-300 text-xs mb-2">{order.product}</div>
              <div className="text-gray-400 text-xs mb-2">{order.rentalPeriod}</div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">${order.amount}</span>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <header className="bg-gray-800 border-b border-gray-600 px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Menu */}
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold">Your Logo</div>
            <nav className="flex space-x-6">
              <a href="#" className="text-white font-medium">Orders</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Reports</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Settings</a>
            </nav>
          </div>

          {/* Right: Vendor Info */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Vendor Name</span>
            <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-sm font-semibold">
              V
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Vertical Menu */}
        <aside className="w-64 bg-gray-900 border-r border-gray-600 min-h-screen">
          <nav className="p-6 space-y-2">
            <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Dashboard</a>
            <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Products</a>
            <a href="#" className="block px-4 py-2 bg-pink-600 text-white rounded-lg font-medium">Orders</a>
            <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Invoices</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
              
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4">
                <h1 className="text-2xl font-bold text-white">Vendor Orders</h1>
                
                {/* View Switcher */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded ${
                      viewMode === 'table' 
                        ? 'bg-pink-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:text-white'
                    } transition-colors`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 rounded ${
                      viewMode === 'kanban' 
                        ? 'bg-pink-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:text-white'
                    } transition-colors`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              {viewMode === 'table' ? renderTableView() : renderKanbanView()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorOrders;