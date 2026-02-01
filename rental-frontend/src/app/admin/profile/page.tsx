'use client';

import { useEffect, useState } from 'react';
import { User, Lock, Save, X, Upload, Search } from 'lucide-react';
import { useAuthStore } from '@/store/auth/authStore';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  gstin?: string;
  address?: string;
  role: string;
}

export default function AdminProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'work' | 'security'>('work');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }

      console.log('Fetching profile from database...');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await res.json();
      console.log('Profile data from DB:', data);
      
      // Set all profile data from database
      setProfile({
        _id: data._id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        company_name: data.company_name || '',
        gstin: data.gstin || '',
        address: data.address || '',
        role: data.role || 'admin',
      });
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      console.log('Updating profile with data:', {
        name: profile.name,
        company_name: profile.company_name,
        gstin: profile.gstin,
        phone: profile.phone,
        address: profile.address,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile.name,
            company_name: profile.company_name,
            gstin: profile.gstin,
            phone: profile.phone,
            address: profile.address,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedData = await res.json();
      console.log('Profile updated successfully:', updatedData);
      
      // Update local state with response from server
      setProfile({
        ...profile,
        ...updatedData,
      });

      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/change-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

    // Refetch profile data from database to reset form
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to change password');
      }

      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    fetchProfile();
    setLogo(null);
    setLogoPreview('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 font-medium">{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-gray-300 mt-1">Manage your account information and security</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
          <span className="text-sm font-medium text-gray-300">Role:</span>
          <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
            {profile.role === 'admin' ? 'Admin' : profile.role}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-sm">
        {/* Search and Settings Header */}
        <div className="border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search settings..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <h2 className="text-xl font-bold text-white">Settings</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('work')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'work'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Work Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'security'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Security
            </button>
          </div>

          {/* Work Information Tab */}
          {activeTab === 'work' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={profile.company_name || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, company_name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 border-2 border-gray-700 rounded-lg flex items-center justify-center bg-gray-800">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-500" />
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg inline-block transition-colors">
                          Upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GST IN
                    </label>
                    <input
                      type="text"
                      value={profile.gstin || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, gstin: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address
                    </label>
                    <textarea
                      value={profile.address || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* User Info Box */}
                  <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-300 mb-2">User</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{profile.name}</p>
                        <p className="text-sm text-gray-300">{profile.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="pt-6 border-t border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Role:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={profile.role === 'admin'}
                      disabled
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Admin</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
                    <input
                      type="radio"
                      name="role"
                      disabled
                      className="w-4 h-4"
                    />
                    <span className="text-gray-400">Vendor</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
                    <input
                      type="radio"
                      name="role"
                      disabled
                      className="w-4 h-4"
                    />
                    <span className="text-gray-400">Customer</span>
                  </label>
                </div>
              </div>

              {/* Note */}
              <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-300 mb-2">Note</p>
                <ul className="text-sm text-blue-200 space-y-1 list-disc list-inside">
                  <li>Settings should only be visible to Admin user</li>
                  <li>For all the non-admin users this user information page should only be visible under profile section</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleDiscard}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Discard
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  placeholder="Enter your current password"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="Enter your new password"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-200">
                  <strong>Password Requirements:</strong>
                </p>
                <ul className="text-sm text-yellow-200 mt-2 space-y-1 list-disc list-inside">
                  <li>Minimum 6 characters long</li>
                  <li>Use a strong, unique password</li>
                </ul>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
