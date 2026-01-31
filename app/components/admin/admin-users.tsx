'use client';

import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  companyAddress: string;
  gstin: string;
  role: 'admin' | 'vendor' | 'customer';
  companyLogo?: string;
  gstinLogo?: string;
  avatar?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1-234-567-8900',
      company: 'Tech Solutions',
      companyAddress: '123 Main St, New York',
      gstin: '12ABCDE1234F1Z0',
      role: 'vendor',
      avatar: 'JS',
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1-987-654-3210',
      company: 'Rentals Co',
      companyAddress: '456 Oak Ave, Los Angeles',
      gstin: '34GHIJK5678G2Z1',
      role: 'vendor',
      avatar: 'JD',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1-555-123-4567',
      company: 'Personal',
      companyAddress: 'N/A',
      gstin: 'N/A',
      role: 'customer',
      avatar: 'MJ',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    role: 'customer',
  });
  const [editId, setEditId] = useState<string | null>(null);

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.role) return;

    if (editId) {
      setUsers(users.map(u => u.id === editId ? { ...formData as User, id: editId } : u));
      setEditId(null);
    } else {
      setUsers([...users, {
        ...formData as User,
        id: Date.now().toString(),
        avatar: formData.name?.split(' ').map(n => n[0]).join('') || '',
      }]);
    }

    setFormData({ role: 'customer' });
    setShowForm(false);
  };

  const handleEdit = (user: User) => {
    setFormData(user);
    setEditId(user.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-600 text-red-100';
      case 'vendor': return 'bg-orange-600 text-orange-100';
      case 'customer': return 'bg-blue-600 text-blue-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Users Management</h1>
        <button
          onClick={() => {
            setFormData({ role: 'customer' });
            setEditId(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white font-medium"
        >
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">{editId ? 'Edit' : 'Add New'} User</h2>
          
          <div className="space-y-6">
            {/* Profile Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone"
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
                <select
                  value={formData.role || 'customer'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-pink-600"
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Name"
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
                <input
                  type="text"
                  value={formData.companyAddress || ''}
                  onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                  placeholder="Company Address"
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
                <input
                  type="text"
                  value={formData.gstin || ''}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  placeholder="GSTIN"
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
              </div>
            </div>

            {/* File Uploads */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Uploads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Company Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-pink-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">GSTIN Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-pink-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddUser}
            className="mt-6 px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white font-medium"
          >
            {editId ? 'Update User' : 'Save User'}
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">All Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Email</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Phone</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Company</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Role</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white text-sm font-bold">
                        {user.avatar || user.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{user.email}</td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{user.phone}</td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{user.company}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)} capitalize`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white text-sm mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 transition text-white text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
