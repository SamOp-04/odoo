'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { mockRentalPeriods, mockSystemSettings } from '@/lib/mock-data/admin';
import { RentalPeriod } from '@/lib/types/admin';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function RentalPeriodsPage() {
  const [defaultUnit, setDefaultUnit] = useState<'hourly' | 'daily'>(mockSystemSettings.rentalPeriodType);
  const [customPeriods, setCustomPeriods] = useState<RentalPeriod[]>(mockRentalPeriods);
  const [lateReturnEnabled, setLateReturnEnabled] = useState(true);
  const [gracePeriod, setGracePeriod] = useState(mockSystemSettings.lateReturnGracePeriod);
  const [gracePeriodUnit, setGracePeriodUnit] = useState<'hours' | 'days'>('hours');
  const [lateFeeType, setLateFeeType] = useState<'percentage' | 'flat'>(mockSystemSettings.lateReturnFeeType);
  const [lateFeeValue, setLateFeeValue] = useState(mockSystemSettings.lateReturnFeeValue);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<RentalPeriod | null>(null);
  const [formData, setFormData] = useState({ name: '', duration: 1, durationUnit: 'days' as 'hours' | 'days' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSaveDefaultUnit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    alert('Default rental unit saved successfully!');
  };

  const handleSaveLatePolicy = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    alert('Late return policy saved successfully!');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (formData.duration <= 0) errors.duration = 'Duration must be greater than 0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (period?: RentalPeriod) => {
    if (period) {
      setEditingPeriod(period);
      setFormData({ name: period.name, duration: period.duration, durationUnit: period.durationUnit });
    } else {
      setEditingPeriod(null);
      setFormData({ name: '', duration: 1, durationUnit: 'days' });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleSavePeriod = async () => {
    if (!validateForm()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (editingPeriod) {
      setCustomPeriods(
        customPeriods.map((p) =>
          p.id === editingPeriod.id
            ? { ...p, name: formData.name, duration: formData.duration, durationUnit: formData.durationUnit }
            : p
        )
      );
    } else {
      const newPeriod: RentalPeriod = {
        id: `period-${Date.now()}`,
        name: formData.name,
        duration: formData.duration,
        durationUnit: formData.durationUnit,
        active: true,
        createdAt: new Date().toISOString(),
      };
      setCustomPeriods([...customPeriods, newPeriod]);
    }

    setLoading(false);
    setShowModal(false);
    alert(`Rental period ${editingPeriod ? 'updated' : 'created'} successfully!`);
  };

  const handleToggleActive = (id: string) => {
    setCustomPeriods(customPeriods.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rental period?')) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCustomPeriods(customPeriods.filter((p) => p.id !== id));
    alert('Rental period deleted successfully!');
  };

  return (
    <div>
      <PageHeader
        title="Rental Periods"
        subtitle="Configure default rental units and rules used across the platform"
      />

      <div className="space-y-6">
        {/* Default Rental Unit */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Default Rental Unit</h2>
          <p className="text-gray-400 text-sm mb-6">
            Choose how rental durations are calculated by default across the platform.
          </p>

          <div className="space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                value="hourly"
                checked={defaultUnit === 'hourly'}
                onChange={(e) => setDefaultUnit(e.target.value as 'hourly')}
                className="mt-1 w-4 h-4 text-blue-600"
              />
              <div>
                <div className="text-white font-medium">Per 24 Hours</div>
                <div className="text-gray-400 text-sm">
                  Rentals are calculated in 24-hour cycles (e.g., 10 AM to 10 AM next day)
                </div>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                value="daily"
                checked={defaultUnit === 'daily'}
                onChange={(e) => setDefaultUnit(e.target.value as 'daily')}
                className="mt-1 w-4 h-4 text-blue-600"
              />
              <div>
                <div className="text-white font-medium">Per Calendar Day</div>
                <div className="text-gray-400 text-sm">
                  Rentals are calculated per calendar day (e.g., any time on Monday counts as 1 day)
                </div>
              </div>
            </label>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveDefaultUnit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Custom Rental Periods */}
        <div className="bg-black border border-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Custom Rental Periods</h2>
              <p className="text-gray-400 text-sm mt-1">Create preset rental duration packages</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Period</span>
            </button>
          </div>

          {customPeriods.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No custom rental periods created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Name</th>
                    <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Duration</th>
                    <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Status</th>
                    <th className="text-right text-gray-400 text-sm font-medium py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customPeriods.map((period) => (
                    <tr key={period.id} className="border-b border-gray-800">
                      <td className="py-4 px-4 text-white font-medium">{period.name}</td>
                      <td className="py-4 px-4 text-gray-300">
                        {period.duration} {period.durationUnit}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActive(period.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            period.active ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {period.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenModal(period)}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-gray-400 hover:text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete(period.id)}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Late Return Policy */}
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Late Return Policy</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div>
                <div className="text-white font-medium">Enable Late Return Fees</div>
                <div className="text-gray-400 text-sm">Charge customers for returning items late</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lateReturnEnabled}
                  onChange={(e) => setLateReturnEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {lateReturnEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Grace Period</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={gracePeriod}
                        onChange={(e) => setGracePeriod(parseInt(e.target.value) || 0)}
                        className="flex-1 bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        min="0"
                      />
                      <select
                        value={gracePeriodUnit}
                        onChange={(e) => setGracePeriodUnit(e.target.value as 'hours' | 'days')}
                        className="bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      No fees will be charged during the grace period
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Late Fee Type</label>
                    <select
                      value={lateFeeType}
                      onChange={(e) => setLateFeeType(e.target.value as 'percentage' | 'flat')}
                      className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="percentage">Percentage of Rental Amount</option>
                      <option value="flat">Fixed Fee</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Late Fee Value {lateFeeType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    value={lateFeeValue}
                    onChange={(e) => setLateFeeValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    min="0"
                    step={lateFeeType === 'percentage' ? '0.1' : '1'}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveLatePolicy}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Policy'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Period */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingPeriod ? 'Edit Rental Period' : 'Add Rental Period'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Period Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-black border ${
                    formErrors.name ? 'border-red-500' : 'border-white'
                  } rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="e.g., Weekend Package"
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                    className={`w-full bg-black border ${
                      formErrors.duration ? 'border-red-500' : 'border-white'
                    } rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600`}
                    min="1"
                  />
                  {formErrors.duration && <p className="text-red-500 text-xs mt-1">{formErrors.duration}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Unit</label>
                  <select
                    value={formData.durationUnit}
                    onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value as 'hours' | 'days' })}
                    className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-white text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePeriod}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingPeriod ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
