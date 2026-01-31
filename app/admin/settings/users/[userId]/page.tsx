'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { mockUsers, mockRoleChangeHistory } from '@/lib/mock-data/admin';
import { User } from '@/lib/types/admin';
import { ArrowLeft, Shield, History, X } from 'lucide-react';

export default function UserDetailPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const userId = params.userId;
  
  const userFromMock = mockUsers.find((u) => u.id === userId);
  const [user, setUser] = useState<User | null>(userFromMock || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedStatus, setEditedStatus] = useState(user?.status || 'Active');
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'vendor' | 'admin'>(user?.role || 'user');
  const [roleChangeReason, setRoleChangeReason] = useState('');

  const roleHistory = mockRoleChangeHistory[userId] || [];

  if (!user) {
    return (
      <div>
        <PageHeader title="User Not Found" />
        <div className="bg-black border border-white rounded-lg p-6 text-center">
          <p className="text-gray-400">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser({ ...user, name: editedName, status: editedStatus as any });
    setLoading(false);
    setIsEditing(false);
    alert('User updated successfully!');
  };

  const handleChangeRole = async () => {
    // Extra warning for admin role changes
    if (newRole === 'admin' || user.role === 'admin') {
      if (!confirm(`Are you sure you want to change this user's role ${newRole === 'admin' ? 'to' : 'from'} Admin?`)) {
        return;
      }
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser({ ...user, role: newRole });
    setLoading(false);
    setShowRoleModal(false);
    alert(`Role changed to ${newRole} successfully!`);
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <PageHeader
        title={user.name}
        subtitle={user.email}
        breadcrumbs={[
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Users', href: '/admin/settings/users' },
          { label: user.name },
        ]}
        actions={
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 px-4 py-2 border border-white text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        }
      />

      <div className="space-y-6">
        {/* User Overview */}
        <div className="bg-black border border-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">User Information</h2>
            {!isEditing && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditedName(user.name);
                  setEditedStatus(user.status);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium"
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <p className="text-white font-medium">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <p className="text-white font-medium">{user.email}</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Phone</label>
              <p className="text-white font-medium">{user.phone || 'Not set'}</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              {isEditing ? (
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value as any)}
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              ) : (
                <StatusBadge status={user.status} />
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Created</label>
              <p className="text-white font-medium">{formatDateTime(user.createdAt)}</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Last Active</label>
              <p className="text-white font-medium">{formatDateTime(user.lastActive)}</p>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-white text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Role Assignment */}
        <div className="bg-black border border-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-white">Role Assignment</h2>
            </div>
            <button
              onClick={() => {
                setNewRole(user.role);
                setRoleChangeReason('');
                setShowRoleModal(true);
              }}
              className="px-4 py-2 border border-blue-600 text-blue-400 rounded-full hover:bg-blue-900 transition-colors font-medium"
            >
              Change Role
            </button>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Current Role</label>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
          </div>

          <div className="mt-4 p-4 bg-gray-900 rounded-lg">
            <p className="text-gray-400 text-sm">
              {user.role === 'admin' && 'This user has full administrative access to the platform.'}
              {user.role === 'vendor' && 'This user can list and manage products for rental.'}
              {user.role === 'user' && 'This user can browse and rent products from vendors.'}
            </p>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Activity Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user.orderCount !== undefined && (
              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="text-gray-400 text-sm">Total Orders</div>
                <div className="text-white text-2xl font-bold mt-2">{user.orderCount}</div>
              </div>
            )}

            {user.productCount !== undefined && (
              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="text-gray-400 text-sm">Total Products</div>
                <div className="text-white text-2xl font-bold mt-2">{user.productCount}</div>
              </div>
            )}

            <div className="p-4 bg-gray-900 rounded-lg">
              <div className="text-gray-400 text-sm">Account Age</div>
              <div className="text-white text-2xl font-bold mt-2">
                {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>
          </div>
        </div>

        {/* Role Change History */}
        {roleHistory.length > 0 && (
          <div className="bg-black border border-white rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <History className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-white">Role Change History</h2>
            </div>

            <div className="space-y-4">
              {roleHistory.map((change) => (
                <div key={change.id} className="p-4 bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRoleBadgeColor(change.fromRole)}`}>
                        {change.fromRole}
                      </span>
                      <span className="text-gray-500">→</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRoleBadgeColor(change.toRole)}`}>
                        {change.toRole}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">{formatDateTime(change.timestamp)}</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Changed by: <span className="text-white">{change.changedByName}</span>
                  </div>
                  {change.reason && (
                    <div className="text-gray-400 text-sm mt-2">
                      Reason: <span className="text-gray-300">{change.reason}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>Change User Role</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Current Role</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
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
                {(newRole === 'admin' || user.role === 'admin') && (
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
                disabled={loading || newRole === user.role}
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
