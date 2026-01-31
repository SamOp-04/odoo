'use client';

import React, { useState } from 'react';

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
    { 
      id: 'size', 
      name: 'Size', 
      type: 'string', 
      values: ['XS', 'S', 'M', 'L', 'XL'] 
    },
    { 
      id: 'color', 
      name: 'Color', 
      type: 'string', 
      values: ['Red', 'Blue', 'Green', 'Yellow', 'Black'] 
    },
    { 
      id: 'material', 
      name: 'Material', 
      type: 'string', 
      values: ['Cotton', 'Leather', 'Plastic', 'Metal'] 
    },
    { 
      id: 'weight', 
      name: 'Weight', 
      type: 'number', 
      values: ['0.5kg', '1kg', '2kg', '5kg'] 
    },
    { 
      id: 'brand', 
      name: 'Brand', 
      type: 'string', 
      values: ['Nike', 'Adidas', 'Sony', 'Samsung'] 
    },
    { 
      id: 'category', 
      name: 'Category', 
      type: 'string', 
      values: ['Electronics', 'Clothing', 'Sports', 'Home'] 
    }
  ];

  const attributeTypes = ['string', 'number', 'boolean', 'date'];

  const handleAttributeSelect = (attributeId: string) => {
    setSelectedAttribute(attributeId);
    const attribute = attributes.find(a => a.id === attributeId);
    if (attribute) {
      setAttributeData({
        name: attribute.name,
        type: attribute.type,
        values: attribute.values
      });
    }
  };

  const handleAttributeDataChange = (field: string, value: string | string[]) => {
    setAttributeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Rental period</a>
              <a href="#" className="block px-4 py-2 bg-pink-600 text-white rounded-lg font-medium">Attributes</a>
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Users</a>
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Admin settings</a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-8">
              
              {/* Left Card - Attributes */}
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4">
                  <h2 className="text-xl font-bold text-white">Attributes</h2>
                  <button className="bg-pink-600 hover:bg-pink-700 text-white text-sm py-1 px-4 rounded-full border border-white transition-colors">
                    New
                  </button>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search attributes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Attributes Table */}
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
                          onClick={() => handleAttributeSelect(attribute.id)}
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

              {/* Right Card - Attribute Details */}
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
                      onChange={(e) => handleAttributeDataChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Type</label>
                    <select
                      value={attributeData.type}
                      onChange={(e) => handleAttributeDataChange('type', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {attributeTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Values</label>
                    
                    {/* Add New Value */}
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

                    {/* Values List */}
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

                  {/* Value Count Info */}
                  <div className="bg-gray-700 border border-gray-600 rounded p-3">
                    <div className="text-sm text-gray-300">
                      Total Values: <span className="text-white font-medium">{attributeData.values.length}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Type: <span className="capitalize">{attributeData.type}</span>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-full border border-white transition-colors">
                      Save Attribute
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

export default AttributesPage;