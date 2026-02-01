// src/components/layout/CustomerSidebar.tsx

'use client';

import React, { useState } from 'react';
import { 
  Menu, 
  X
} from 'lucide-react';

const CustomerSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(50000);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const brands = ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer'];
  
  const colors = [
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Yellow', hex: '#F59E0B' },
  ];

  const durations = [
    { label: '1 Week', value: '1week' },
    { label: '2 Weeks', value: '2weeks' },
    { label: '3 Weeks', value: '3weeks' },
    { label: '1 Month', value: '1month' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-background-secondary rounded-lg shadow-lg text-foreground"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-background-secondary border-r border-foreground-secondary/10
          transition-all duration-300 z-40
          ${isOpen ? 'w-64' : 'w-0 lg:w-20'}
          overflow-hidden
        `}
      >
        <div className="h-full flex flex-col">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 pt-8">
            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                All Brands
              </h3>
              {isOpen && (
                <ul className="space-y-2">
                  {brands.map((brand) => (
                    <li key={brand}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded border-foreground-secondary/30 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">{brand}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Color Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Color
              </h3>
              {isOpen && (
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className={`
                        w-8 h-8 rounded-full border-2 transition-all
                        ${selectedColors.includes(color.name)
                          ? 'border-foreground scale-110'
                          : 'border-transparent hover:scale-105'
                        }
                      `}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Duration Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Duration
              </h3>
              {isOpen && (
                <ul className="space-y-2">
                  {durations.map((duration) => (
                    <li key={duration.value}>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="duration"
                            value={duration.value}
                            checked={selectedDuration === duration.value}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-foreground">{duration.label}</span>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Price Range
              </h3>
              {isOpen && (
                <div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-foreground-secondary mt-2">
                    <span>₹0</span>
                    <span>₹{priceRange.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default CustomerSidebar;
