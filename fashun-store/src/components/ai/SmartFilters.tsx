'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterCategory {
  id: string
  name: string
  options: FilterOption[]
  type: 'checkbox' | 'radio' | 'range' | 'color'
}

interface SmartFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void
  selectedFilters: Record<string, any>
}

export default function SmartFilters({ onFiltersChange, selectedFilters }: SmartFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filterCategories: FilterCategory[] = [
    {
      id: 'category',
      name: 'Category',
      type: 'checkbox',
      options: [
        { id: 'hoodies', label: 'Hoodies', count: 124 },
        { id: 'tshirts', label: 'T-Shirts', count: 89 },
        { id: 'jeans', label: 'Jeans', count: 67 },
        { id: 'sneakers', label: 'Sneakers', count: 156 },
        { id: 'jackets', label: 'Jackets', count: 45 }
      ]
    },
    {
      id: 'price',
      name: 'Price Range',
      type: 'range',
      options: [
        { id: '0-1000', label: 'Under ₹1,000' },
        { id: '1000-2500', label: '₹1,000 - ₹2,500' },
        { id: '2500-5000', label: '₹2,500 - ₹5,000' },
        { id: '5000-10000', label: '₹5,000 - ₹10,000' },
        { id: '10000+', label: 'Above ₹10,000' }
      ]
    },
    {
      id: 'brand',
      name: 'Brand',
      type: 'checkbox',
      options: [
        { id: 'nike', label: 'Nike', count: 45 },
        { id: 'adidas', label: 'Adidas', count: 38 },
        { id: 'puma', label: 'Puma', count: 29 },
        { id: 'reebok', label: 'Reebok', count: 22 },
        { id: 'vans', label: 'Vans', count: 31 }
      ]
    },
    {
      id: 'size',
      name: 'Size',
      type: 'checkbox',
      options: [
        { id: 'xs', label: 'XS', count: 12 },
        { id: 's', label: 'S', count: 45 },
        { id: 'm', label: 'M', count: 67 },
        { id: 'l', label: 'L', count: 56 },
        { id: 'xl', label: 'XL', count: 34 },
        { id: 'xxl', label: 'XXL', count: 23 }
      ]
    },
    {
      id: 'color',
      name: 'Color',
      type: 'color',
      options: [
        { id: 'black', label: 'Black' },
        { id: 'white', label: 'White' },
        { id: 'navy', label: 'Navy' },
        { id: 'gray', label: 'Gray' },
        { id: 'red', label: 'Red' },
        { id: 'blue', label: 'Blue' }
      ]
    }
  ]

  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    navy: '#1E3A8A',
    gray: '#6B7280',
    red: '#EF4444',
    blue: '#3B82F6'
  }

  const handleFilterChange = (categoryId: string, optionId: string, checked: boolean) => {
    const newFilters = { ...selectedFilters }
    
    if (!newFilters[categoryId]) {
      newFilters[categoryId] = []
    }

    if (checked) {
      if (!newFilters[categoryId].includes(optionId)) {
        newFilters[categoryId] = [...newFilters[categoryId], optionId]
      }
    } else {
      newFilters[categoryId] = newFilters[categoryId].filter((id: string) => id !== optionId)
      if (newFilters[categoryId].length === 0) {
        delete newFilters[categoryId]
      }
    }

    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).reduce((count, filters: any) => {
      return count + (Array.isArray(filters) ? filters.length : filters ? 1 : 0)
    }, 0)
  }

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-800/30 border border-white/10 rounded-xl text-white hover:bg-primary-700/30 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FunnelIcon className="w-4 h-4" />
        <span>Filters</span>
        {getActiveFiltersCount() > 0 && (
          <span className="bg-accent-500 text-primary-900 text-xs px-2 py-1 rounded-full font-medium">
            {getActiveFiltersCount()}
          </span>
        )}
      </motion.button>

      {/* Filter Panel */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-primary-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl z-50 min-w-[300px] max-w-[600px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-accent-400" />
              <h3 className="text-lg font-semibold text-white">Smart Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-primary-700/30 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-primary-400" />
              </button>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="space-y-6">
            {filterCategories.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className="flex items-center justify-between w-full text-left mb-3"
                >
                  <span className="text-white font-medium">{category.name}</span>
                  <motion.div
                    animate={{ rotate: activeCategory === category.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AdjustmentsHorizontalIcon className="w-4 h-4 text-primary-400" />
                  </motion.div>
                </button>

                {(activeCategory === category.id || activeCategory === null) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {category.type === 'color' ? (
                      <div className="flex flex-wrap gap-2">
                        {category.options.map((option) => {
                          const isSelected = selectedFilters[category.id]?.includes(option.id)
                          return (
                            <button
                              key={option.id}
                              onClick={() => handleFilterChange(category.id, option.id, !isSelected)}
                              className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                                isSelected
                                  ? 'border-accent-400 scale-110'
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                              style={{ backgroundColor: colorMap[option.id] }}
                              title={option.label}
                            >
                              {isSelected && (
                                <CheckIcon className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      category.options.map((option) => {
                        const isSelected = selectedFilters[category.id]?.includes(option.id)
                        return (
                          <label
                            key={option.id}
                            className="flex items-center justify-between p-2 hover:bg-primary-700/20 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleFilterChange(category.id, option.id, e.target.checked)}
                                className="w-4 h-4 text-accent-500 bg-primary-800/30 border-white/20 rounded focus:ring-accent-400/20"
                              />
                              <span className="text-primary-200 text-sm">{option.label}</span>
                            </div>
                            {option.count && (
                              <span className="text-primary-400 text-xs">({option.count})</span>
                            )}
                          </label>
                        )
                      })
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}