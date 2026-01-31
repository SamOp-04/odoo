'use client';

import React, { useState } from 'react';

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
    { id: 'monthly', name: 'Monthly', duration: 1, unit: 'Months' },
    { id: 'quarterly', name: 'Quarterly', duration: 3, unit: 'Months' },
    { id: 'yearly', name: 'Yearly', duration: 1, unit: 'Years' }
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

  const handlePeriodDataChange = (field: string, value: string | number) => {
    setPeriodData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredPeriods = periods.filter(period =>
    period.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Profile</a>
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Change password</a>
              <a href="#" className="block px-4 py-2 bg-pink-600 text-white rounded-lg font-medium">Rental period</a>
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Attributes</a>
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Users</a>
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Admin settings</a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-8">
              
              {/* Left Card - Rental Periods */}
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4">
                  <h2 className="text-xl font-bold text-white">Rental periods</h2>
                  <button className="bg-pink-600 hover:bg-pink-700 text-white text-sm py-1 px-4 rounded-full border border-white transition-colors">
                    New
                  </button>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search periods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Periods Table */}
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

              {/* Right Card - Period Details */}
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
                      onChange={(e) => handlePeriodDataChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Duration</label>
                    <input
                      type="number"
                      min="1"
                      value={periodData.duration}
                      onChange={(e) => handlePeriodDataChange('duration', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Unit</label>
                    <select
                      value={periodData.unit}
                      onChange={(e) => handlePeriodDataChange('unit', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  {/* Unit Options as List */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Available Units</label>
                    <div className="bg-gray-700 border border-gray-600 rounded p-3 max-h-32 overflow-y-auto">
                      <div className="space-y-1 text-sm">
                        {units.map((unit) => (
                          <div
                            key={unit}
                            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                              periodData.unit === unit
                                ? 'bg-pink-600 text-white'
                                : 'text-gray-300 hover:bg-gray-600'
                            }`}
                            onClick={() => handlePeriodDataChange('unit', unit)}
                          >
                            {unit}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-full border border-white transition-colors">
                      Save Period
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RentalPeriodsPage;