'use client';

import React, { useState } from 'react';

interface AttributeValue {
  id: string;
  value: string;
  color: string;
}

interface Attribute {
  id: string;
  name: string;
  displayType: 'checkbox' | 'radio' | 'pill';
  values: AttributeValue[];
}

const AdminAttributes = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([
    {
      id: '1',
      name: 'Brand',
      displayType: 'radio',
      values: [
        { id: 'v1', value: 'Apple', color: '#000000' },
        { id: 'v2', value: 'Samsung', color: '#1428A0' },
      ],
    },
    {
      id: '2',
      name: 'Color',
      displayType: 'pill',
      values: [
        { id: 'v3', value: 'Red', color: '#EF4444' },
        { id: 'v4', value: 'Blue', color: '#3B82F6' },
        { id: 'v5', value: 'Green', color: '#10B981' },
      ],
    },
    {
      id: '3',
      name: 'New',
      displayType: 'checkbox',
      values: [
        { id: 'v6', value: 'Refurbished', color: '#F59E0B' },
        { id: 'v7', value: 'Used', color: '#EF4444' },
      ],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Attribute>>({
    displayType: 'radio',
    values: [],
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [newValue, setNewValue] = useState({ value: '', color: '#3B82F6' });

  const handleAddAttribute = () => {
    if (!formData.name || !formData.displayType) return;

    if (editId) {
      setAttributes(attributes.map(a => a.id === editId ? { ...formData as Attribute, id: editId } : a));
      setEditId(null);
    } else {
      setAttributes([...attributes, {
        ...formData as Attribute,
        id: Date.now().toString(),
        values: formData.values || [],
      }]);
    }

    setFormData({ displayType: 'radio', values: [] });
    setShowForm(false);
  };

  const handleAddValue = () => {
    if (!newValue.value) return;
    const currentValues = formData.values || [];
    setFormData({
      ...formData,
      values: [...currentValues, { id: Date.now().toString(), ...newValue }],
    });
    setNewValue({ value: '', color: '#3B82F6' });
  };

  const handleRemoveValue = (valueId: string) => {
    setFormData({
      ...formData,
      values: (formData.values || []).filter(v => v.id !== valueId),
    });
  };

  const handleEdit = (attribute: Attribute) => {
    setFormData(attribute);
    setEditId(attribute.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAttributes(attributes.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Attributes Management</h1>
        <button
          onClick={() => {
            setFormData({ displayType: 'radio', values: [] });
            setEditId(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white font-medium"
        >
          {showForm ? 'Cancel' : '+ Add Attribute'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">{editId ? 'Edit' : 'Add New'} Attribute</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Attribute Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Brand"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display Type</label>
              <select
                value={formData.displayType || 'radio'}
                onChange={(e) => setFormData({ ...formData, displayType: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-pink-600"
              >
                <option value="checkbox">Checkbox</option>
                <option value="radio">Radio</option>
                <option value="pill">Pill</option>
              </select>
            </div>
          </div>

          {/* Add Attribute Values */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Attribute Values</h3>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newValue.value}
                onChange={(e) => setNewValue({ ...newValue, value: e.target.value })}
                placeholder="Value name"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-600"
              />
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Color</label>
                <input
                  type="color"
                  value={newValue.color}
                  onChange={(e) => setNewValue({ ...newValue, color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
              </div>
              <button
                onClick={handleAddValue}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white font-medium"
              >
                Add Line
              </button>
            </div>

            {/* Values List */}
            {(formData.values || []).length > 0 && (
              <div className="space-y-2">
                {formData.values.map((value) => (
                  <div key={value.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-lg"
                        style={{ backgroundColor: value.color }}
                      />
                      <span className="text-white">{value.value}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveValue(value.id)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleAddAttribute}
            className="px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white font-medium"
          >
            {editId ? 'Update Attribute' : 'Save Attribute'}
          </button>
        </div>
      )}

      {/* Attributes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attributes.map((attribute) => (
          <div key={attribute.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{attribute.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(attribute)}
                  className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(attribute.id)}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 transition text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-600 text-purple-100 capitalize">
                {attribute.displayType}
              </span>
            </div>

            <div className="space-y-2">
              {attribute.values.map((value) => (
                <div key={value.id} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: value.color }}
                  />
                  <span className="text-gray-300 text-sm">{value.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Visualization Preview */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Data Visualization Preview</h2>
        <div className="bg-gray-700 rounded-lg p-8 h-48 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <polyline points="0,150 50,120 100,100 150,80 200,70 250,75 300,60 350,50 400,40" fill="none" stroke="#EC4899" strokeWidth="2" />
            </svg>
          </div>
          <div className="text-center relative z-10">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-400">InfluxDB Data Trends</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttributes;
