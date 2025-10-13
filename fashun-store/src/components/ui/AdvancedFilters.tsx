'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  StarIcon,
  CurrencyDollarIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

export interface FilterOptions {
  categories: string[]
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  brands: string[]
  materials: string[]
  fits: string[]
}

interface ActiveFilters {
  category?: string
  size?: string[]
  color?: string[]
  priceRange?: [number, number]
  brand?: string[]
  material?: string[]
  fit?: string[]
  sortBy?: string
}

interface AdvancedFiltersProps {
  isOpen: boolean
  onClose: () => void
  filters: ActiveFilters
  onFiltersChange: (filters: ActiveFilters) => void
  filterOptions: FilterOptions
}

export default function AdvancedFilters({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  filterOptions
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ActiveFilters>(filters)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['category', 'price']))

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const handleFilterChange = (key: keyof ActiveFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleArrayFilterToggle = (key: keyof ActiveFilters, value: string) => {
    const currentArray = (localFilters[key] as string[]) || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    handleFilterChange(key, newArray.length > 0 ? newArray : undefined)
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const clearAllFilters = () => {
    const clearedFilters: ActiveFilters = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(value => {
      if (Array.isArray(value)) return value.length > 0
      if (value === null || value === undefined) return false
      return true
    }).length
  }

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name A-Z' }
  ]

  const priceRanges = [
    { label: 'Under ₹500', value: [0, 500] as [number, number] },
    { label: '₹500 - ₹1000', value: [500, 1000] as [number, number] },
    { label: '₹1000 - ₹2000', value: [1000, 2000] as [number, number] },
    { label: '₹2000 - ₹3000', value: [2000, 3000] as [number, number] },
    { label: '₹3000 - ₹5000', value: [3000, 5000] as [number, number] },
    { label: 'Above ₹5000', value: [5000, 100000] as [number, number] }
  ]

  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Gray': '#6B7280',
    'Navy': '#1E3A8A',
    'Blue': '#3B82F6',
    'Red': '#EF4444',
    'Green': '#10B981',
    'Yellow': '#F59E0B',
    'Purple': '#8B5CF6',
    'Pink': '#EC4899',
    'Orange': '#F97316',
    'Brown': '#A3671A'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex items-center space-x-3">
                  <FunnelIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Filters
                  </h2>
                  {getActiveFilterCount() > 0 && (
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-semibold px-2 py-1 rounded-full">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Sort By */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('sort')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Sort By
                    </h3>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSections.has('sort') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedSections.has('sort') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {sortOptions.map(option => (
                        <label key={option.value} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="sortBy"
                            value={option.value}
                            checked={localFilters.sortBy === option.value}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('category')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Category
                    </h3>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSections.has('category') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedSections.has('category') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {filterOptions.categories.map(category => (
                        <label key={category} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={localFilters.category === category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300 capitalize">{category}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('price')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Price Range
                    </h3>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSections.has('price') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedSections.has('price') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {priceRanges.map((range, index) => (
                        <label key={index} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={
                              localFilters.priceRange?.[0] === range.value[0] &&
                              localFilters.priceRange?.[1] === range.value[1]
                            }
                            onChange={() => handleFilterChange('priceRange', range.value)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">{range.label}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Sizes */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('size')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Size
                    </h3>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSections.has('size') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedSections.has('size') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="grid grid-cols-3 gap-2"
                    >
                      {filterOptions.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => handleArrayFilterToggle('size', size)}
                          className={`p-2 text-sm font-medium border rounded-lg transition-all ${
                            (localFilters.size || []).includes(size)
                              ? 'border-purple-500 bg-purple-500 text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Colors */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('color')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Color
                    </h3>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSections.has('color') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedSections.has('color') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="grid grid-cols-4 gap-3"
                    >
                      {filterOptions.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => handleArrayFilterToggle('color', color)}
                          className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                            (localFilters.color || []).includes(color)
                              ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800'
                              : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                          }`}
                          style={{ backgroundColor: colorMap[color] || color.toLowerCase() }}
                          title={color}
                        >
                          {(localFilters.color || []).includes(color) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                            </div>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Brand */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('brand')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Brand
                    </h3>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSections.has('brand') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedSections.has('brand') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {filterOptions.brands.map(brand => (
                        <label key={brand} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={(localFilters.brand || []).includes(brand)}
                            onChange={() => handleArrayFilterToggle('brand', brand)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">{brand}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Material */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('material')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Material
                    </h3>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSections.has('material') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedSections.has('material') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {filterOptions.materials.map(material => (
                        <label key={material} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={(localFilters.material || []).includes(material)}
                            onChange={() => handleArrayFilterToggle('material', material)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">{material}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Fit */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('fit')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Fit
                    </h3>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSections.has('fit') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedSections.has('fit') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {filterOptions.fits.map(fit => (
                        <label key={fit} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={(localFilters.fit || []).includes(fit)}
                            onChange={() => handleArrayFilterToggle('fit', fit)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">{fit}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex space-x-3">
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}