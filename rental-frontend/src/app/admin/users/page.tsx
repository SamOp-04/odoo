'use client';

import { useEffect, useState } from 'react';
import { Search, UserPlus } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  company_name?: string;
  is_active: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Unauthorized');
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading vendors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const vendors = users.filter(u => u.role === 'vendor');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Vendors</h1>
          <p className="text-gray-300 mt-1">Manage vendors, their status, and performance</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, company, or email..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Sort By</option>
            <option>Name</option>
            <option>Revenue</option>
            <option>Orders</option>
          </select>
          <button className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Vendor Name</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Company</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Revenue</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Orders</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Products</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {vendors.map((user) => (
                <tr key={user._id} className="hover:bg-gray-800 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    {user.name}
                  </td>

                  <td className="py-4 px-6 text-gray-300">{user.company_name || '-'}</td>

                  <td className="py-4 px-6 text-gray-300">{user.email}</td>

                  <td className="py-4 px-6 text-right font-semibold text-white">
                    ₹{Math.floor(Math.random() * 30) + 5}.{Math.floor(Math.random() * 10)}L
                  </td>

                  <td className="py-4 px-6 text-center text-white font-medium">
                    {Math.floor(Math.random() * 150) + 30}
                  </td>

                  <td className="py-4 px-6 text-center text-white font-medium">
                    {Math.floor(Math.random() * 25) + 8}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <StatusBadge active={user.is_active} />
                  </td>
                </tr>
              ))}

              {vendors.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-400"
                  >
                    No vendors found
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
          ? 'bg-green-900 text-green-300 border-green-700'
          : 'bg-red-900 text-red-300 border-red-700'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}
