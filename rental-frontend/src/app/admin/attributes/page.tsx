'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AttributeValue {
  value: string;
  extraPrice?: number;
}

interface Attribute {
  _id: string;
  name: string;
  display_type: 'radio' | 'pills' | 'color';
  values: AttributeValue[];
  createdAt: string;
}

export default function AdminAttributesPage() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    display_type: 'radio' as 'radio' | 'pills' | 'color',
    values: [] as AttributeValue[],
  });
  const [newValueInput, setNewValueInput] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState('');

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/settings/attributes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch attributes');
      }

      const data = await res.json();
      setAttributes(data);
      if (data.length > 0 && !selectedAttribute) {
        setSelectedAttribute(data[0]);
        setFormData({
          name: data[0].name,
          display_type: data[0].display_type || 'radio',
          values: data[0].values || [],
        });
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAttribute = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/settings/attributes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          display_type: formData.display_type,
          values: formData.values,
        }),
      });

      if (res.ok) {
        await fetchAttributes();
        setShowNewModal(false);
        resetForm();
      }
    } catch (err) {
      console.error('Error creating attribute:', err);
    }
  };

  const handleUpdateAttribute = async () => {
    if (!selectedAttribute) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/settings/attributes/${selectedAttribute._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          display_type: formData.display_type,
          values: formData.values,
        }),
      });

      if (res.ok) {
        await fetchAttributes();
      }
    } catch (err) {
      console.error('Error updating attribute:', err);
    }
  };

  const handleDeleteAttribute = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attribute?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/settings/attributes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchAttributes();
        if (selectedAttribute?._id === id) {
          setSelectedAttribute(null);
          resetForm();
        }
      }
    } catch (err) {
      console.error('Error deleting attribute:', err);
    }
  };

  const handleAddValue = () => {
    if (!newValueInput.trim()) return;

    const newValue: AttributeValue = {
      value: newValueInput.trim(),
      ...(newExtraPrice && { extraPrice: parseFloat(newExtraPrice) }),
    };

    setFormData({
      ...formData,
      values: [...formData.values, newValue],
    });

    setNewValueInput('');
    setNewExtraPrice('');
  };

  const handleRemoveValue = (index: number) => {
    setFormData({
      ...formData,
      values: formData.values.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      display_type: 'radio',
      values: [],
    });
    setNewValueInput('');
    setNewExtraPrice('');
  };

  const selectAttribute = (attr: Attribute) => {
    setSelectedAttribute(attr);
    setFormData({
      name: attr.name,
      display_type: attr.display_type || 'radio',
      values: attr.values || [],
    });
  };

  const filteredAttributes = attributes.filter((attr) =>
    attr.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading attributes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Product Attributes</h1>
        <p className="text-gray-300 mt-1">Manage product variants and attributes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Attributes List */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Attributes</h2>
            <button
              onClick={() => {
                setShowNewModal(true);
                resetForm();
              }}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attributes..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Attributes List */}
          <div className="space-y-2">
            {filteredAttributes.map((attr) => (
              <div
                key={attr._id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedAttribute?._id === attr._id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
                onClick={() => selectAttribute(attr)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedAttribute?._id === attr._id}
                    onChange={() => selectAttribute(attr)}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{attr.name}</p>
                    <p className={`text-xs ${selectedAttribute?._id === attr._id ? 'text-blue-200' : 'text-gray-500'}`}>
                      {attr.display_type || 'Radio'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAttribute(attr._id);
                  }}
                  className="flex-shrink-0 p-2 hover:bg-red-600/20 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            ))}

            {filteredAttributes.length === 0 && (
              <p className="text-center text-gray-500 py-8">No attributes found</p>
            )}
          </div>
        </div>

        {/* Right Panel - Attribute Details */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-700 p-6">
          {selectedAttribute ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Attribute Details</h2>

              {/* Attribute Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attribute Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Brand, Color, Size"
                />
              </div>

              {/* Display Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Type
                </label>
                <select
                  value={formData.display_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_type: e.target.value as 'radio' | 'pills' | 'color',
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="radio">Radio Buttons</option>
                  <option value="pills">Pills</option>
                  <option value="color">Color Picker</option>
                </select>
              </div>

              {/* Attribute Values */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attribute Values
                </label>

                {/* Values List */}
                <div className="mb-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-white px-2 pb-2">
                    <div>Value</div>
                    <div>Extra Price</div>
                    <div></div>
                  </div>
                  {formData.values.map((val, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-2 items-center p-2 bg-gray-800 rounded-lg"
                    >
                      <div className="text-white font-medium">{val.value}</div>
                      <div className="text-white">
                        {val.extraPrice ? `₹${val.extraPrice}` : '-'}
                      </div>
                      <div className="text-right">
                        <button
                          onClick={() => handleRemoveValue(index)}
                          className="p-1 hover:bg-red-600/20 rounded transition-colors"
                        >
                          <X className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Value */}
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newValueInput}
                      onChange={(e) => setNewValueInput(e.target.value)}
                      placeholder="Value name"
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                    />
                    <input
                      type="number"
                      value={newExtraPrice}
                      onChange={(e) => setNewExtraPrice(e.target.value)}
                      placeholder="Extra price"
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                    />
                    <button
                      onClick={handleAddValue}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateAttribute}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Save Changes
                </button>
                <button
                  onClick={() => selectAttribute(selectedAttribute)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-lg">Select an attribute to view details</p>
                <p className="text-sm mt-2">or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Attribute Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Attribute</h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Attribute Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attribute Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Brand, Color, Size"
                />
              </div>

              {/* Display Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Type
                </label>
                <select
                  value={formData.display_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_type: e.target.value as 'radio' | 'pills' | 'color',
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="radio">Radio Buttons</option>
                  <option value="pills">Pills</option>
                  <option value="color">Color Picker</option>
                </select>
              </div>

              {/* Attribute Values */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attribute Values
                </label>

                {/* Values List */}
                <div className="mb-3 space-y-2">
                  {formData.values.map((val, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1 text-white font-medium">{val.value}</div>
                      {val.extraPrice && (
                        <div className="text-white">₹{val.extraPrice}</div>
                      )}
                      <button
                        onClick={() => handleRemoveValue(index)}
                        className="p-1 hover:bg-red-600/20 rounded transition-colors"
                      >
                        <X className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Value */}
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newValueInput}
                    onChange={(e) => setNewValueInput(e.target.value)}
                    placeholder="Value name"
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                  />
                  <input
                    type="number"
                    value={newExtraPrice}
                    onChange={(e) => setNewExtraPrice(e.target.value)}
                    placeholder="Extra price"
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                  />
                  <button
                    onClick={handleAddValue}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateAttribute}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Create Attribute
                </button>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
