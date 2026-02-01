'use client';

import { useEffect, useState } from 'react';
import { Search, UserPlus, Mail, Phone, Building2, Calendar, Shield } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  company_name?: string;
  phone?: string;
  gstin?: string;
  address?: string;
  is_active: boolean;
  createdAt: string;
}

export default function AdminAllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter]);

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
      setFilteredUsers(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.company_name?.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter((user) => user.is_active === isActive);
    }

    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
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

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    vendors: users.filter((u) => u.role === 'vendor').length,
    customers: users.filter((u) => u.role === 'customer').length,
    active: users.filter((u) => u.is_active).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">All Users</h1>
          <p className="text-gray-300 mt-1">Manage all system users - customers, vendors, and admins</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 shadow-sm">
          <p className="text-sm text-gray-300">Total Users</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-purple-900 rounded-lg border border-purple-700 p-4 shadow-sm">
          <p className="text-sm text-purple-300">Admins</p>
          <p className="text-2xl font-bold text-purple-200 mt-1">{stats.admins}</p>
        </div>
        <div className="bg-blue-900 rounded-lg border border-blue-700 p-4 shadow-sm">
          <p className="text-sm text-blue-300">Vendors</p>
          <p className="text-2xl font-bold text-blue-200 mt-1">{stats.vendors}</p>
        </div>
        <div className="bg-green-900 rounded-lg border border-green-700 p-4 shadow-sm">
          <p className="text-sm text-green-300">Customers</p>
          <p className="text-2xl font-bold text-green-200 mt-1">{stats.customers}</p>
        </div>
        <div className="bg-emerald-900 rounded-lg border border-emerald-700 p-4 shadow-sm">
          <p className="text-sm text-emerald-300">Active</p>
          <p className="text-2xl font-bold text-emerald-200 mt-1">{stats.active}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
            <option value="customer">Customer</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Contact</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Company</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Role</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-800 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    {user.phone ? (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {user.phone}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    {user.company_name ? (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        {user.company_name}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <RoleBadge role={user.role} />
                  </td>

                  <td className="py-4 px-6 text-center">
                    <StatusBadge active={user.is_active} />
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                      ? 'No users found matching your filters'
                      : 'No users found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <p>
          Showing <span className="font-semibold text-white">{filteredUsers.length}</span> of{' '}
          <span className="font-semibold text-white">{users.length}</span> users
        </p>
      </div>
    </div>
  );
}

/* ------------------ */
/* Role Badge */
/* ------------------ */
function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { bg: string; text: string; icon: any }> = {
    admin: { bg: 'bg-purple-900 border-purple-700', text: 'text-purple-300', icon: Shield },
    vendor: { bg: 'bg-blue-900 border-blue-700', text: 'text-blue-300', icon: Building2 },
    customer: { bg: 'bg-green-900 border-green-700', text: 'text-green-300', icon: null },
  };

  const roleConfig = config[role] || config.customer;
  const Icon = roleConfig.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleConfig.bg} ${roleConfig.text}`}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
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
      <span className={`w-2 h-2 rounded-full mr-2 ${active ? 'bg-green-400' : 'bg-red-400'}`}></span>
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}
