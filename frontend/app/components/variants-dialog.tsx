'use client';

import React, { useState } from 'react';

interface VariantsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

const VariantsDialog = ({ isOpen, onClose, productName = "MacBook Pro" }: VariantsDialogProps) => {
  const [selectedVariant, setSelectedVariant] = useState('variant-2');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Dialog Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-bold text-white">Choose Variant</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Variant Selection Section */}
          <div className="border border-gray-600 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              {/* Variant Image Placeholder */}
              <div className="w-16 h-16 bg-gray-600 border border-gray-500 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>

              {/* Variant Options */}
              <div className="flex-1">
                <h3 className="text-white font-medium mb-3">Configuration</h3>
                <div className="flex space-x-4">
                  {/* Variant Option 1 */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="variant"
                      value="variant-1"
                      checked={selectedVariant === 'variant-1'}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-300 text-sm">8GB / 256GB</span>
                  </label>

                  {/* Variant Option 2 */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="variant"
                      value="variant-2"
                      checked={selectedVariant === 'variant-2'}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-300 text-sm">16GB / 512GB</span>
                  </label>

                  {/* Variant Option 3 */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="variant"
                      value="variant-3"
                      checked={selectedVariant === 'variant-3'}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-300 text-sm">32GB / 1TB</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Add-ons Section */}
          <div className="border border-gray-600 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              {/* Add-ons Image Placeholder */}
              <div className="w-16 h-16 bg-gray-600 border border-gray-500 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>

              {/* Add-on Options */}
              <div className="flex-1">
                <h3 className="text-white font-medium mb-3">Add-ons</h3>
                <div className="space-y-3">
                  {/* Add-on Option 1 */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value="extra-monitor"
                      checked={selectedAddons.includes('extra-monitor')}
                      onChange={() => handleAddonToggle('extra-monitor')}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300 text-sm">Extra Monitor</span>
                  </label>

                  {/* Add-on Option 2 */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value="keyboard-mouse"
                      checked={selectedAddons.includes('keyboard-mouse')}
                      onChange={() => handleAddonToggle('keyboard-mouse')}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300 text-sm">Keyboard + Mouse</span>
                  </label>

                  {/* Add-on Option 3 */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value="extended-warranty"
                      checked={selectedAddons.includes('extended-warranty')}
                      onChange={() => handleAddonToggle('extended-warranty')}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300 text-sm">Extended Warranty</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="p-6 border-t border-gray-600 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Handle add to cart logic here
              console.log('Adding to cart:', { selectedVariant, selectedAddons });
              onClose();
            }}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full border border-white transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantsDialog;