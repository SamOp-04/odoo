'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/vendor/PageHeader';
import { mockVendorProfile } from '@/lib/mock-data/vendor';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  const [businessInfo, setBusinessInfo] = useState({
    gstin: mockVendorProfile.gstin || '',
    companyLegalName: mockVendorProfile.companyName,
    defaultRentalUnit: 'per-day',
    defaultDeposit: 'percentage',
    depositPercentage: '20',
  });

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="space-y-6">
        {/* Business Settings */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Business Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Company Legal Name
              </label>
              <input
                type="text"
                name="companyLegalName"
                value={businessInfo.companyLegalName}
                onChange={handleBusinessChange}
                className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                GSTIN / Tax ID
              </label>
              <input
                type="text"
                name="gstin"
                value={businessInfo.gstin}
                onChange={handleBusinessChange}
                placeholder="27AABCU9603R1ZM"
                className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Rental Settings */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Rental Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Default Rental Period Unit
              </label>
              <select
                name="defaultRentalUnit"
                value={businessInfo.defaultRentalUnit}
                onChange={handleBusinessChange}
                className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="per-hour">Per Hour</option>
                <option value="per-day">Per Day</option>
                <option value="per-24-hours">Per 24 Hours</option>
                <option value="per-week">Per Week</option>
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Security Deposit Type
              </label>
              <select
                name="defaultDeposit"
                value={businessInfo.defaultDeposit}
                onChange={handleBusinessChange}
                className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="fixed">Fixed Amount</option>
                <option value="percentage">Percentage of Rental</option>
              </select>
            </div>

            {businessInfo.defaultDeposit === 'percentage' && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Deposit Percentage
                </label>
                <input
                  type="number"
                  name="depositPercentage"
                  value={businessInfo.depositPercentage}
                  onChange={handleBusinessChange}
                  min="0"
                  max="100"
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            )}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div>
                <h3 className="text-white font-medium">Email Notifications</h3>
                <p className="text-gray-400 text-sm">Receive notifications via email</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-white font-medium">In-App Notifications</h3>
                <p className="text-gray-400 text-sm">Receive notifications in the application</p>
              </div>
              <button
                onClick={() => setInAppNotifications(!inAppNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  inAppNotifications ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    inAppNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
