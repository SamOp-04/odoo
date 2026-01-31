'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { mockAttributes } from '@/lib/mock-data/admin';
import { Attribute } from '@/lib/types/admin';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export default function AttributesPage() {
  const [attributes, setAttributes] = useState<Attribute[]>(mockAttributes);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    key: string;
    type: 'text' | 'number' | 'boolean' | 'single-select' | 'multi-select';
    required: boolean;
    options: string[];
    newOption: string;
  }>({
    name: '',
    key: '',
    type: 'text',
    required: false,
    options: [],
    newOption: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredAttributes = attributes.filter(
    (attr) =>
      attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attr.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateKey = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.key.trim()) errors.key = 'Key is required';
    
    // Check key uniqueness
    const isDuplicate = attributes.some(
      (attr) => attr.key === formData.key && attr.id !== editingAttribute?.id
    );
    if (isDuplicate) errors.key = 'Key must be unique';

    if ((formData.type === 'single-select' || formData.type === 'multi-select') && formData.options.length === 0) {
      errors.options = 'At least one option is required for select types';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (attribute?: Attribute) => {
    if (attribute) {
      setEditingAttribute(attribute);
      setFormData({
        name: attribute.name,
        key: attribute.key,
        type: attribute.type,
        required: attribute.required,
        options: attribute.options || [],
        newOption: '',
      });
    } else {
      setEditingAttribute(null);
      setFormData({
        name: '',
        key: '',
        type: 'text',
        required: false,
        options: [],
        newOption: '',
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleSaveAttribute = async () => {
    if (!validateForm()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (editingAttribute) {
      setAttributes(
        attributes.map((attr) =>
          attr.id === editingAttribute.id
            ? {
                ...attr,
                name: formData.name,
                key: formData.key,
                type: formData.type,
                required: formData.required,
                options: formData.options.length > 0 ? formData.options : undefined,
              }
            : attr
        )
      );
    } else {
      const newAttribute: Attribute = {
        id: `attr-${Date.now()}`,
        name: formData.name,
        key: formData.key,
        type: formData.type,
        required: formData.required,
        options: formData.options.length > 0 ? formData.options : undefined,
        status: 'Active',
        usageCount: 0,
        createdAt: new Date().toISOString(),
      };
      setAttributes([...attributes, newAttribute]);
    }

    setLoading(false);
    setShowModal(false);
    alert(`Attribute ${editingAttribute ? 'updated' : 'created'} successfully!`);
  };

  const handleAddOption = () => {
    if (formData.newOption.trim() && !formData.options.includes(formData.newOption.trim())) {
      setFormData({ ...formData, options: [...formData.options, formData.newOption.trim()], newOption: '' });
    }
  };

  const handleRemoveOption = (option: string) => {
    setFormData({ ...formData, options: formData.options.filter((o) => o !== option) });
  };

  const handleDelete = async (id: string) => {
    const attribute = attributes.find((a) => a.id === id);
    if (!attribute) return;

    if (attribute.usageCount > 0) {
      if (!confirm(`This attribute is used by ${attribute.usageCount} products. Are you sure you want to delete it?`))
        return;
    } else {
      if (!confirm('Are you sure you want to delete this attribute?')) return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setAttributes(attributes.filter((attr) => attr.id !== id));
    alert('Attribute deleted successfully!');
  };

  const handleToggleStatus = (id: string) => {
    setAttributes(
      attributes.map((attr) =>
        attr.id === id ? { ...attr, status: attr.status === 'Active' ? 'Inactive' : 'Active' } : attr
      )
    );
  };

  const typeLabels = {
    text: 'Text',
    number: 'Number',
    boolean: 'Boolean',
    'single-select': 'Single Select',
    'multi-select': 'Multi Select',
  };

  return (
    <div>
      <PageHeader
        title="Attributes"
        subtitle="Define reusable attributes for products across the platform"
        actions={
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Attribute</span>
          </button>
        }
      />

      <div className="bg-black border border-white rounded-lg p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search attributes by name or key..."
              className="w-full bg-black border border-white rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Attributes Table */}
        {filteredAttributes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {searchQuery ? 'No attributes match your search.' : 'No attributes created yet.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Name</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Key</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Type</th>
                  <th className="text-center text-gray-400 text-sm font-medium py-3 px-4">Required</th>
                  <th className="text-center text-gray-400 text-sm font-medium py-3 px-4">Usage</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Status</th>
                  <th className="text-right text-gray-400 text-sm font-medium py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttributes.map((attribute) => (
                  <tr key={attribute.id} className="border-b border-gray-800 hover:bg-gray-900">
                    <td className="py-4 px-4">
                      <div className="text-white font-medium">{attribute.name}</div>
                      {attribute.options && (
                        <div className="text-gray-500 text-xs mt-1">
                          Options: {attribute.options.slice(0, 2).join(', ')}
                          {attribute.options.length > 2 && ` +${attribute.options.length - 2} more`}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-gray-400 text-sm bg-gray-900 px-2 py-1 rounded">{attribute.key}</code>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{typeLabels[attribute.type]}</td>
                    <td className="py-4 px-4 text-center">
                      {attribute.required ? (
                        <span className="text-orange-400 text-sm">Yes</span>
                      ) : (
                        <span className="text-gray-500 text-sm">No</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-300">{attribute.usageCount}</span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(attribute.id)}
                        className="cursor-pointer"
                      >
                        <StatusBadge status={attribute.status} />
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal(attribute)}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(attribute.id)}
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

      {/* Modal for Add/Edit Attribute */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-black border border-white rounded-lg p-6 max-w-lg w-full my-8">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingAttribute ? 'Edit Attribute' : 'Add Attribute'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({ ...formData, name, key: generateKey(name) });
                  }}
                  className={`w-full bg-black border ${
                    formErrors.name ? 'border-red-500' : 'border-white'
                  } rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="e.g., Color"
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Key / Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className={`w-full bg-black border ${
                    formErrors.key ? 'border-red-500' : 'border-white'
                  } rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="e.g., color"
                />
                {formErrors.key && <p className="text-red-500 text-xs mt-1">{formErrors.key}</p>}
                <p className="text-gray-500 text-xs mt-1">
                  Used as the attribute identifier in the system (auto-generated from name)
                </p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as any,
                      options: e.target.value.includes('select') ? formData.options : [],
                    })
                  }
                  className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="single-select">Single Select</option>
                  <option value="multi-select">Multi Select</option>
                </select>
              </div>

              {(formData.type === 'single-select' || formData.type === 'multi-select') && (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Options <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={formData.newOption}
                      onChange={(e) => setFormData({ ...formData, newOption: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                      className="flex-1 bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Add an option"
                    />
                    <button
                      onClick={handleAddOption}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                  {formErrors.options && <p className="text-red-500 text-xs mb-2">{formErrors.options}</p>}
                  <div className="flex flex-wrap gap-2">
                    {formData.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-gray-900 px-3 py-1 rounded-full"
                      >
                        <span className="text-white text-sm">{option}</span>
                        <button onClick={() => handleRemoveOption(option)} className="text-gray-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={formData.required}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="required" className="text-white text-sm cursor-pointer">
                  Required attribute
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-white text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAttribute}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingAttribute ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
