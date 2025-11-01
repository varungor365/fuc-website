'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FilterOptions {
  sizes: string[];
  colors: { name: string; hex: string }[];
  productTypes: string[];
  priceRanges: { label: string; min: number; max: number }[];
}

interface ProductFiltersProps {
  options: FilterOptions;
  onFilterChange: (filters: ActiveFilters) => void;
  className?: string;
}

export interface ActiveFilters {
  sizes: string[];
  colors: string[];
  productTypes: string[];
  priceRange: { min: number; max: number } | null;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular';
}

export default function ProductFilters({ options, onFilterChange, className = '' }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    sizes: [],
    colors: [],
    productTypes: [],
    priceRange: null,
    sortBy: 'newest'
  });

  const [expandedSections, setExpandedSections] = useState({
    size: true,
    color: true,
    type: true,
    price: true
  });

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return (
      activeFilters.sizes.length +
      activeFilters.colors.length +
      activeFilters.productTypes.length +
      (activeFilters.priceRange ? 1 : 0)
    );
  }, [activeFilters]);

  const toggleFilter = (category: keyof Omit<ActiveFilters, 'priceRange' | 'sortBy'>, value: string) => {
    const newFilters = { ...activeFilters };
    const currentValues = newFilters[category];
    
    if (currentValues.includes(value)) {
      newFilters[category] = currentValues.filter(v => v !== value);
    } else {
      newFilters[category] = [...currentValues, value];
    }
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const setPriceRange = (range: { min: number; max: number } | null) => {
    const newFilters = { ...activeFilters, priceRange: range };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const setSortBy = (sortBy: ActiveFilters['sortBy']) => {
    const newFilters = { ...activeFilters, sortBy };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters: ActiveFilters = {
      sizes: [],
      colors: [],
      productTypes: [],
      priceRange: null,
      sortBy: 'newest'
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full btn-gradient-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3"
        >
          <Filter className="w-5 h-5" />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Modal */}
      <div className={className}>
        {/* Mobile Backdrop */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
          )}
        </AnimatePresence>

        {/* Filter Panel */}
        <motion.div
          initial={false}
          animate={isOpen ? { x: 0 } : { x: '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className={`
            fixed lg:sticky top-0 left-0 h-screen lg:h-auto
            w-80 lg:w-full
            bg-primary-900/90 lg:bg-transparent
            backdrop-blur-xl lg:backdrop-blur-none
            border-r lg:border-r-0 border-white/10
            z-50 lg:z-0
            overflow-y-auto
            ${isOpen ? 'block' : 'hidden lg:block'}
          `}
        >
          <div className="p-6 glass-gradient-frosted rounded-2xl border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Filter className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-black text-white">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Clear All */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="w-full mb-6 py-3 px-4 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl font-bold transition-all"
              >
                Clear All Filters
              </button>
            )}

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-white font-bold mb-3">Sort By</label>
              <select
                value={activeFilters.sortBy}
                onChange={(e) => setSortBy(e.target.value as ActiveFilters['sortBy'])}
                className="w-full bg-white/5 border border-white/20 text-white rounded-xl px-4 py-3 font-medium focus:border-orange-500 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Size Filter */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <button
                onClick={() => toggleSection('size')}
                className="w-full flex items-center justify-between text-white font-bold mb-3 hover:text-orange-400 transition-colors"
              >
                <span>Size</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.size ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {expandedSections.size && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-3 gap-2"
                  >
                    {options.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleFilter('sizes', size)}
                        className={`
                          py-2 px-4 rounded-lg font-bold transition-all
                          ${activeFilters.sizes.includes(size)
                            ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-gradient-neon'
                            : 'bg-white/5 text-white border border-white/20 hover:border-orange-500'
                          }
                        `}
                      >
                        {size}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Color Filter */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <button
                onClick={() => toggleSection('color')}
                className="w-full flex items-center justify-between text-white font-bold mb-3 hover:text-orange-400 transition-colors"
              >
                <span>Color</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.color ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {expandedSections.color && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-4 gap-3"
                  >
                    {options.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => toggleFilter('colors', color.name)}
                        className={`
                          relative w-12 h-12 rounded-full transition-all
                          ${activeFilters.colors.includes(color.name)
                            ? 'ring-4 ring-orange-500 scale-110'
                            : 'ring-2 ring-white/20 hover:ring-white/40'
                          }
                        `}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {activeFilters.colors.includes(color.name) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <span className="text-black text-xs">✓</span>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Product Type Filter */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <button
                onClick={() => toggleSection('type')}
                className="w-full flex items-center justify-between text-white font-bold mb-3 hover:text-orange-400 transition-colors"
              >
                <span>Product Type</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.type ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {expandedSections.type && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2"
                  >
                    {options.productTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleFilter('productTypes', type)}
                        className={`
                          w-full py-3 px-4 rounded-lg font-bold text-left transition-all
                          ${activeFilters.productTypes.includes(type)
                            ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
                            : 'bg-white/5 text-white border border-white/20 hover:border-orange-500'
                          }
                        `}
                      >
                        {type}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('price')}
                className="w-full flex items-center justify-between text-white font-bold mb-3 hover:text-orange-400 transition-colors"
              >
                <span>Price Range</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {expandedSections.price && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2"
                  >
                    {options.priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => 
                          activeFilters.priceRange?.min === range.min && activeFilters.priceRange?.max === range.max
                            ? setPriceRange(null)
                            : setPriceRange({ min: range.min, max: range.max })
                        }
                        className={`
                          w-full py-3 px-4 rounded-lg font-bold text-left transition-all
                          ${activeFilters.priceRange?.min === range.min && activeFilters.priceRange?.max === range.max
                            ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
                            : 'bg-white/5 text-white border border-white/20 hover:border-orange-500'
                          }
                        `}
                      >
                        {range.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Active Filter Tags */}
            {activeFilterCount > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-3">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleFilter('sizes', size)}
                      className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-orange-500/30 transition-colors"
                    >
                      {size}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  {activeFilters.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleFilter('colors', color)}
                      className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-orange-500/30 transition-colors"
                    >
                      {color}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  {activeFilters.productTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleFilter('productTypes', type)}
                      className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-orange-500/30 transition-colors"
                    >
                      {type}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  {activeFilters.priceRange && (
                    <button
                      onClick={() => setPriceRange(null)}
                      className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-orange-500/30 transition-colors"
                    >
                      ₹{activeFilters.priceRange.min} - ₹{activeFilters.priceRange.max}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
