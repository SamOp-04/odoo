'use client';

import React, { useState } from 'react';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@odoo.com',
    discord: '@admin_user',
    phone: '+1-234-567-8900',
    companyName: 'Odoo Admin',
    companyAddress: '123 Admin Street, New York, NY 10001',
    gstin: 'Admin-GSTIN-123456',
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = () => {
    setProfile(formData);
    setEditMode(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordChange(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
        <button
          onClick={() => {
            if (editMode) {
              setFormData(profile);
            }
            setEditMode(!editMode);
          }}
          className={`px-4 py-2 rounded-lg transition text-white font-medium ${
            editMode
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-pink-600 hover:bg-pink-700'
          }`}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        <button className="px-6 py-3 border-b-2 border-pink-600 text-white font-medium">
          Profile
        </button>
        <button className="px-6 py-3 border-b-2 border-transparent text-gray-400 hover:text-white transition">
          Work Information
        </button>
        <button className="px-6 py-3 border-b-2 border-transparent text-gray-400 hover:text-white transition">
          Security
        </button>
      </div>

      {/* Profile Form */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center p-8 bg-gray-700 rounded-lg">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center text-white text-4xl font-bold mb-4">
              A
            </div>
            {editMode && (
              <button className="mt-4 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition text-white text-sm">
                Upload Avatar
              </button>
            )}
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
              ) : (
                <p className="text-white text-lg">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Discord</label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
              ) : (
                <p className="text-gray-300">{profile.discord}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              {editMode ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
              ) : (
                <p className="text-gray-300">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              {editMode ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
              ) : (
                <p className="text-gray-300">{profile.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
              ) : (
                <p className="text-gray-300">{profile.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GSTIN</label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
              ) : (
                <p className="text-gray-300">{profile.gstin}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Address</label>
              {editMode ? (
                <textarea
                  value={formData.companyAddress}
                  onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600 h-24 resize-none"
                />
              ) : (
                <p className="text-gray-300">{profile.companyAddress}</p>
              )}
            </div>
          </div>
        </div>

        {/* File Uploads */}
        {editMode && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Uploads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-pink-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GSTIN Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-pink-600"
                />
              </div>
            </div>
          </div>
        )}

        {editMode && (
          <button
            onClick={handleSaveProfile}
            className="px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white font-medium"
          >
            Save Changes
          </button>
        )}
      </div>

      {/* Security Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>

        {/* Role Assignment */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Role Assignment</h3>
          <p className="text-gray-400 text-sm mb-4">
            Note: These settings control page information visibility under the profile section.
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
              <input
                type="radio"
                name="role"
                value="admin"
                defaultChecked
                className="w-4 h-4"
              />
              <span className="text-white font-medium">Administrator</span>
              <span className="ml-auto text-xs text-gray-400">Full system access</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
              <input
                type="radio"
                name="role"
                value="vendor"
                className="w-4 h-4"
              />
              <span className="text-white font-medium">Vendor</span>
              <span className="ml-auto text-xs text-gray-400">Limited access</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
              <input
                type="radio"
                name="role"
                value="customer"
                className="w-4 h-4"
              />
              <span className="text-white font-medium">Customer</span>
              <span className="ml-auto text-xs text-gray-400">View only</span>
            </label>
          </div>
        </div>

        {/* Change Password */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
          {!showPasswordChange ? (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white font-medium"
            >
              🔒 Change Password
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Old Password</label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white font-medium"
                >
                  Update Password
                </button>
                <button
                  onClick={() => setShowPasswordChange(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
