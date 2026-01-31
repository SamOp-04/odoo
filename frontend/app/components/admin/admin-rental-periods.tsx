'use client';

import React, { useState } from 'react';

interface RentalPeriod {
  id: string;
  name: string;
  duration: number;
  unit: 'hourly' | 'daily' | 'weekly' | 'monthly';
  description: string;
}

const AdminRentalPeriods = () => {
  const [periods, setPeriods] = useState<RentalPeriod[]>([
    { id: '1', name: 'Hourly Rental', duration: 1, unit: 'hourly', description: 'Equipment rental per hour' },
    { id: '2', name: 'Daily Rental', duration: 1, unit: 'daily', description: 'Equipment rental per day' },
    { id: '3', name: 'Weekly Rental', duration: 7, unit: 'daily', description: 'Equipment rental per week' },
    { id: '4', name: 'Monthly Rental', duration: 30, unit: 'daily', description: 'Equipment rental per month' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<RentalPeriod>>({});
  const [editId, setEditId] = useState<string | null>(null);

  const handleAddPeriod = () => {
    if (!formData.name || !formData.duration || !formData.unit) return;

    if (editId) {
      setPeriods(periods.map(p => p.id === editId ? { ...formData as RentalPeriod, id: editId } : p));
      setEditId(null);
    } else {
      setPeriods([...periods, { ...formData as RentalPeriod, id: Date.now().toString() }]);
    }
    
    setFormData({});
    setShowForm(false);
  };

  const handleEdit = (period: RentalPeriod) => {
    setFormData(period);
    setEditId(period.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setPeriods(periods.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Rental Periods Configuration</h1>
        <button
          onClick={() => {
            setFormData({});
            setEditId(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white font-medium"
        >
          {showForm ? 'Cancel' : '+ Add Period'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">{editId ? 'Edit' : 'Add New'} Rental Period</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Period Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Hourly Rental"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
              <input
                type="number"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                placeholder="e.g., 1"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Unit</label>
              <select
                value={formData.unit || 'daily'}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-pink-600"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Equipment rental per day"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
              />
            </div>
          </div>
          <button
            onClick={handleAddPeriod}
            className="mt-6 px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white font-medium"
          >
            {editId ? 'Update Period' : 'Save Period'}
          </button>
        </div>
      )}

      {/* Periods Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Configured Periods</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Period Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Duration</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Unit</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Description</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr key={period.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="py-3 px-4 text-white font-medium">{period.name}</td>
                  <td className="py-3 px-4 text-gray-300">{period.duration}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-blue-100 capitalize">
                      {period.unit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{period.description}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEdit(period)}
                      className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white text-sm mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(period.id)}
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

      {/* Data Aggregation Preview */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Data Aggregation Preview</h2>
        <p className="text-gray-300 mb-4">
          These rental periods control how raw time-series data is grouped and summarized in dashboards. 
          Choose how metrics are aggregated: hourly, daily, weekly, or monthly intervals.
        </p>
        <div className="bg-gray-700 rounded-lg p-4 h-48 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-400">Data aggregation graph will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRentalPeriods;
