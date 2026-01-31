'use client';

import React, { useState } from 'react';

type SettingsPage = 'profile' | 'password' | 'rental-periods' | 'attributes' | 'admin';

const SettingsApp = () => {
  const [activePage, setActivePage] = useState<SettingsPage>('profile');

  const UserProfilePage = () => {
    const [userProfile, setUserProfile] = useState({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
    });

    const handleInputChange = (field: string, value: string) => {
      setUserProfile(prev => ({
        ...prev,
        [field]: value
      }));
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
          <div className="mb-8 border-b border-gray-600 pb-6">
            <h1 className="text-2xl font-bold text-white">User Profile</h1>
            <p className="text-gray-400 mt-2">Manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {userProfile.firstName[0]}{userProfile.lastName[0]}
                </div>
                <button className="bg-pink-600 hover:bg-pink-700 text-white text-sm py-2 px-4 rounded-full border border-white transition-colors">
                  Change Avatar
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={userProfile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={userProfile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={userProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  value={userProfile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    value={userProfile.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">State</label>
                  <input
                    type="text"
                    value={userProfile.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={userProfile.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Bio</label>
                <textarea
                  value={userProfile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-8 border-t border-gray-600 mt-8">
            <button className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-6 rounded-full border border-gray-500 transition-colors">
              Discard
            </button>
            <button className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-full border border-white transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ChangePasswordPage = () => {
    const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const handlePasswordChange = (field: string, value: string) => {
      setPasswordData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
          <div className="mb-8 border-b border-gray-600 pb-6 text-center">
            <h1 className="text-2xl font-bold text-white">Change Password</h1>
            <p className="text-gray-400 mt-2">Ensure your account security with a strong password</p>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="pt-6">
              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-full border border-white transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RentalPeriodsPage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('daily');
    const [periodData, setPeriodData] = useState({
      name: 'Daily',
      duration: 1,
      unit: 'Days'
    });
    const [searchTerm, setSearchTerm] = useState('');

    const periods = [
      { id: 'hourly', name: 'Hourly', duration: 1, unit: 'Hours' },
      { id: 'daily', name: 'Daily', duration: 1, unit: 'Days' },
      { id: 'weekly', name: 'Weekly', duration: 1, unit: 'Weeks' },
      { id: 'monthly', name: 'Monthly', duration: 1, unit: 'Months' }
    ];

    const units = ['Hours', 'Days', 'Weeks', 'Months', 'Years'];

    const handlePeriodSelect = (periodId: string) => {
      setSelectedPeriod(periodId);
      const period = periods.find(p => p.id === periodId);
      if (period) {
        setPeriodData({
          name: period.name,
          duration: period.duration,
          unit: period.unit
        });
      }
    };

    const filteredPeriods = periods.filter(period =>
      period.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4">
              <h2 className="text-xl font-bold text-white">Rental periods</h2>
              <button className="bg-pink-600 hover:bg-pink-700 text-white text-sm py-1 px-4 rounded-full border border-white transition-colors">
                New
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search periods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">Name</th>
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">Duration</th>
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPeriods.map((period) => (
                    <tr
                      key={period.id}
                      onClick={() => handlePeriodSelect(period.id)}
                      className={`border-b border-gray-700 cursor-pointer hover:bg-gray-750 ${
                        selectedPeriod === period.id ? 'bg-gray-750' : ''
                      }`}
                    >
                      <td className="py-3 px-2 text-white">{period.name}</td>
                      <td className="py-3 px-2 text-gray-300">{period.duration}</td>
                      <td className="py-3 px-2 text-gray-300">{period.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <div className="mb-6 border-b border-gray-600 pb-4">
              <h2 className="text-xl font-bold text-white">Period Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={periodData.name}
                  onChange={(e) => setPeriodData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Duration</label>
                <input
                  type="number"
                  min="1"
                  value={periodData.duration}
                  onChange={(e) => setPeriodData(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Unit</label>
                <select
                  value={periodData.unit}
                  onChange={(e) => setPeriodData(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-full border border-white transition-colors">
                  Save Period
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AttributesPage = () => {
    const [selectedAttribute, setSelectedAttribute] = useState('size');
    const [attributeData, setAttributeData] = useState({
      name: 'Size',
      type: 'string',
      values: ['XS', 'S', 'M', 'L', 'XL']
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [newValue, setNewValue] = useState('');

    const attributes = [
      { id: 'size', name: 'Size', type: 'string', values: ['XS', 'S', 'M', 'L', 'XL'] },
      { id: 'color', name: 'Color', type: 'string', values: ['Red', 'Blue', 'Green', 'Yellow', 'Black'] },
      { id: 'material', name: 'Material', type: 'string', values: ['Cotton', 'Leather', 'Plastic', 'Metal'] }
    ];

    const attributeTypes = ['string', 'number', 'boolean', 'date'];

    const addNewValue = () => {
      if (newValue.trim() && !attributeData.values.includes(newValue.trim())) {
        setAttributeData(prev => ({
          ...prev,
          values: [...prev.values, newValue.trim()]
        }));
        setNewValue('');
      }
    };

    const removeValue = (valueToRemove: string) => {
      setAttributeData(prev => ({
        ...prev,
        values: prev.values.filter(value => value !== valueToRemove)
      }));
    };

    const filteredAttributes = attributes.filter(attribute =>
      attribute.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4">
              <h2 className="text-xl font-bold text-white">Attributes</h2>
              <button className="bg-pink-600 hover:bg-pink-700 text-white text-sm py-1 px-4 rounded-full border border-white transition-colors">
                New
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search attributes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">Name</th>
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">Values</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttributes.map((attribute) => (
                    <tr
                      key={attribute.id}
                      onClick={() => setSelectedAttribute(attribute.id)}
                      className={`border-b border-gray-700 cursor-pointer hover:bg-gray-750 ${
                        selectedAttribute === attribute.id ? 'bg-gray-750' : ''
                      }`}
                    >
                      <td className="py-3 px-2 text-white">{attribute.name}</td>
                      <td className="py-3 px-2 text-gray-300">{attribute.type}</td>
                      <td className="py-3 px-2 text-gray-300 text-xs">
                        {attribute.values.slice(0, 2).join(', ')}
                        {attribute.values.length > 2 && '...'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <div className="mb-6 border-b border-gray-600 pb-4">
              <h2 className="text-xl font-bold text-white">Attribute Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={attributeData.name}
                  onChange={(e) => setAttributeData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Type</label>
                <select
                  value={attributeData.type}
                  onChange={(e) => setAttributeData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {attributeTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Values</label>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add new value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addNewValue()}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    onClick={addNewValue}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded border border-white transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded p-3 max-h-48 overflow-y-auto">
                  {attributeData.values.length > 0 ? (
                    <div className="space-y-2">
                      {attributeData.values.map((value, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-600 px-3 py-2 rounded"
                        >
                          <span className="text-white text-sm">{value}</span>
                          <button
                            onClick={() => removeValue(value)}
                            className="text-red-400 hover:text-red-300 text-xs ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-4">
                      No values added yet
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-full border border-white transition-colors">
                  Save Attribute
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdminSettingsPage = () => {
    const [gstSettings, setGstSettings] = useState({
      enabled: true,
      percentage: 18
    });

    const [companyInfo, setCompanyInfo] = useState({
      name: 'Your Company Name',
      email: 'admin@company.com',
      phone: '+1 234 567 8900',
      address: '123 Business Street, City, State 12345'
    });

    const [users] = useState([
      { id: 1, name: 'John Doe', email: 'john@company.com', role: 'admin', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'vendor', status: 'active' },
      { id: 3, name: 'Bob Johnson', email: 'bob@company.com', role: 'user', status: 'inactive' }
    ]);

    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {/* GST Settings Card */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <div className="mb-6 border-b border-gray-600 pb-4">
              <h2 className="text-xl font-bold text-white">GST Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Enable GST</span>
                <button
                  onClick={() => setGstSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`w-12 h-6 rounded-full border border-gray-500 transition-colors ${
                    gstSettings.enabled ? 'bg-pink-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    gstSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">GST Percentage</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gstSettings.percentage}
                  onChange={(e) => setGstSettings(prev => ({ ...prev, percentage: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-full border border-white transition-colors">
                Save GST Settings
              </button>
            </div>
          </div>

          {/* Company Information Card */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <div className="mb-6 border-b border-gray-600 pb-4">
              <h2 className="text-xl font-bold text-white">Company Info</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Company Name</label>
                <input
                  type="text"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-full border border-white transition-colors">
                Update Company Info
              </button>
            </div>
          </div>

          {/* User Management Card */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <div className="mb-6 border-b border-gray-600 pb-4">
              <h2 className="text-xl font-bold text-white">User Management</h2>
            </div>

            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-700 p-3 rounded border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-sm font-medium">{user.name}</div>
                      <div className="text-gray-400 text-xs">{user.email}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded ${
                        user.role === 'admin' ? 'bg-red-600 text-white' :
                        user.role === 'vendor' ? 'bg-blue-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {user.role}
                      </div>
                      <div className={`text-xs mt-1 ${
                        user.status === 'active' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {user.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-full border border-white transition-colors">
              Manage Users
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'profile':
        return <UserProfilePage />;
      case 'password':
        return <ChangePasswordPage />;
      case 'rental-periods':
        return <RentalPeriodsPage />;
      case 'attributes':
        return <AttributesPage />;
      case 'admin':
        return <AdminSettingsPage />;
      default:
        return <UserProfilePage />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold">Your Logo</div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Orders</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Reports</a>
              <a href="#" className="text-white font-medium">Settings</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Admin User</span>
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Settings Menu */}
        <aside className="w-64 bg-gray-900 border-r border-gray-600 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">Settings</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActivePage('profile')}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activePage === 'profile' ? 'bg-pink-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActivePage('password')}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activePage === 'password' ? 'bg-pink-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Change password
              </button>
              <button
                onClick={() => setActivePage('rental-periods')}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activePage === 'rental-periods' ? 'bg-pink-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Rental periods
              </button>
              <button
                onClick={() => setActivePage('attributes')}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activePage === 'attributes' ? 'bg-pink-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Attributes
              </button>
              <button
                onClick={() => setActivePage('admin')}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activePage === 'admin' ? 'bg-pink-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Admin settings
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default SettingsApp;