'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { mockAdminProfile } from '@/lib/mock-data/admin';
import { Lock } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockAdminProfile);
  const [loading, setLoading] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};
    
    if (!currentPassword) errors.currentPassword = 'Current password is required';
    if (!newPassword) errors.newPassword = 'New password is required';
    if (newPassword && newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordForm()) return;

    // Simulate API check for current password
    if (currentPassword !== 'admin123') {
      setPasswordErrors({ currentPassword: 'Current password is incorrect' });
      return;
    }

    setPasswordLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPasswordLoading(false);

    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordErrors({});
    
    alert('Password changed successfully!');
  };

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your account information and security" />

      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-black border border-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <p className="text-white font-medium">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <p className="text-white font-medium">{profile.email}</p>
              <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Role</label>
              <p className="text-white font-medium">{profile.role}</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <p className="text-white font-medium">{profile.phone || 'Not set'}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setProfile(mockAdminProfile);
                }}
                className="px-6 py-2 bg-black border border-white text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-black border border-white rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Change Password</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">Update your password to keep your account secure</p>

          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPasswordErrors({ ...passwordErrors, currentPassword: '' });
                }}
                className={`w-full bg-black border ${
                  passwordErrors.currentPassword ? 'border-red-500' : 'border-white'
                } rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="Enter your current password"
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordErrors({ ...passwordErrors, newPassword: '' });
                }}
                className={`w-full bg-black border ${
                  passwordErrors.newPassword ? 'border-red-500' : 'border-white'
                } rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="Enter your new password"
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordErrors({ ...passwordErrors, confirmPassword: '' });
                }}
                className={`w-full bg-black border ${
                  passwordErrors.confirmPassword ? 'border-red-500' : 'border-white'
                } rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="Confirm your new password"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handlePasswordChange}
                disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium disabled:opacity-50"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
