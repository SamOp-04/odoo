'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/vendor/PageHeader';
import { mockVendorProfile } from '@/lib/mock-data/vendor';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(mockVendorProfile);
  const [changePassword, setChangePassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePassword(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleUpdatePassword = async () => {
    if (changePassword.new !== changePassword.confirm) {
      alert('New passwords do not match!');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setChangePassword({ current: '', new: '', confirm: '' });
    alert('Password updated successfully!');
  };

  return (
    <div>
      <PageHeader title="Vendor Profile" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black border border-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Vendor Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                ) : (
                  <p className="text-white font-medium">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Company Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="companyName"
                    value={profile.companyName}
                    onChange={handleProfileChange}
                    className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                ) : (
                  <p className="text-white font-medium">{profile.companyName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                ) : (
                  <p className="text-white font-medium">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                ) : (
                  <p className="text-white font-medium">{profile.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    rows={3}
                    className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                  />
                ) : (
                  <p className="text-white font-medium">{profile.address}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setProfile(mockVendorProfile);
                  }}
                  className="px-6 py-2 bg-black border border-white text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="bg-black border border-white rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Current Password</label>
                <input
                  type="password"
                  name="current"
                  value={changePassword.current}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">New Password</label>
                <input
                  type="password"
                  name="new"
                  value={changePassword.new}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={changePassword.confirm}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleUpdatePassword}
                disabled={loading || !changePassword.current || !changePassword.new || !changePassword.confirm}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-black border border-white rounded-lg p-6 sticky top-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {profile.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-white">{profile.name}</h3>
              <p className="text-gray-400">{profile.companyName}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <EmailIcon className="w-5 h-5 text-gray-400" />
                <span className="text-white text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <span className="text-white text-sm">{profile.phone}</span>
              </div>
              <div className="flex items-start space-x-3">
                <LocationIcon className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-white text-sm">{profile.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function LocationIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
