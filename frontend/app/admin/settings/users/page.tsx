'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import { mockUsers } from '@/lib/mock-data/admin';
import { User } from '@/lib/types/admin';
import { Shield, X } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'vendor' | 'admin'>('user');
  const [roleChangeReason, setRoleChangeReason] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleChangeReason('');
    setShowRoleModal(true);
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return;

    // Extra warning for admin role changes
    if (newRole === 'admin' || selectedUser.role === 'admin') {
      if (!confirm(`Are you sure you want to change this user's role ${newRole === 'admin' ? 'to' : 'from'} Admin?`)) {
        return;
      }
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setUsers(
      users.map((user) =>
        user.id === selectedUser.id ? { ...user, role: newRole } : user
      )
    );

    setLoading(false);
    setShowRoleModal(false);
    alert(`Role changed to ${newRole} successfully!`);
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    if (!confirm(`Are you sure you want to ${newStatus === 'Inactive' ? 'deactivate' : 'activate'} this user?`))
      return;

    await new Promise((resolve) => setTimeout(resolve, 500));
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: newStatus as 'Active' | 'Inactive' | 'Suspended' } : u
      )
    );
    alert(`User ${newStatus === 'Inactive' ? 'deactivated' : 'activated'} successfully!`);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-900 text-purple-300';
      case 'vendor':
        return 'bg-blue-900 text-blue-300';
      case 'user':
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage platform users and roles" />

      <div className="bg-black border border-white rounded-lg p-6">
        {/* Filters */}
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by name or email..."
          filters={[
            {
              key: 'role',
              label: 'Role',
              value: roleFilter,
              onChange: setRoleFilter,
              options: [
                { value: '', label: 'All Roles' },
                { value: 'user', label: 'User' },
                { value: 'vendor', label: 'Vendor' },
                { value: 'admin', label: 'Admin' },
              ],
            },
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: '', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Suspended', label: 'Suspended' },
              ],
            },
          ]}
          onClearFilters={() => {
            setSearchQuery('');
            setRoleFilter('');
            setStatusFilter('');
          }}
        />

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No users match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Name</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Email</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Role</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Status</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Created</th>
                  <th className="text-right text-gray-400 text-sm font-medium py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-800 hover:bg-gray-900 cursor-pointer"
                    onClick={() => router.push(`/admin/settings/users/${user.id}`)}
                  >
                    <td className="py-4 px-4">
                      <div className="text-white font-medium">{user.name}</div>
                      {user.phone && <div className="text-gray-500 text-xs mt-1">{user.phone}</div>}
                    </td>
                    <td className="py-4 px-4 text-gray-300">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="py-4 px-4 text-gray-300">{formatDate(user.createdAt)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenRoleModal(user);
                          }}
                          className="px-3 py-1 border border-blue-600 text-blue-400 rounded-full hover:bg-blue-900 transition-colors text-xs font-medium"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(user.id);
                          }}
                          className={`px-3 py-1 rounded-full transition-colors text-xs font-medium ${
                            user.status === 'Active'
                              ? 'border border-orange-600 text-orange-400 hover:bg-orange-900'
                              : 'border border-green-600 text-green-400 hover:bg-green-900'
                          }`}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>Change User Role</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">User</label>
                <div className="text-white font-medium">{selectedUser.name}</div>
                <div className="text-gray-500 text-sm">{selectedUser.email}</div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Current Role</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  New Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'user' | 'vendor' | 'admin')}
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="user">User</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
                {(newRole === 'admin' || selectedUser.role === 'admin') && (
                  <p className="text-orange-400 text-xs mt-2 flex items-start space-x-1">
                    <span>⚠️</span>
                    <span>Changing admin role requires extra confirmation</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Reason (Optional)</label>
                <textarea
                  value={roleChangeReason}
                  onChange={(e) => setRoleChangeReason(e.target.value)}
                  placeholder="Note the reason for this role change..."
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 border border-white text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                disabled={loading || newRole === selectedUser.role}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Changing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
