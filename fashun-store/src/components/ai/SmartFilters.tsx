'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  CheckIcon,
  SparklesIcon,
  SwatchIcon,
  CurrencyDollarIcon,
  TagIcon,
  StarIcon,
  FireIcon,
  TruckIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

interface FilterOption {
  id: string
  label: string
  value: string | number
  count?: number
  trending?: boolean
  recommended?: boolean
}

interface FilterCategory {
  id: string
  name: string
  type: 'checkbox' | 'radio' | 'range' | 'color' | 'size'
  options: FilterOption[]
  aiSuggested?: boolean
  description?: string
}

interface SmartFiltersProps {
  isOpen: boolean
  onClose: () => void
  onFiltersChange: (filters: any) => void
  initialFilters?: any
  searchQuery?: string
  className?: string
}

const SmartFilters: React.FC<SmartFiltersProps> = ({
  isOpen,
  onClose,
  onFiltersChange,
  initialFilters = {},
  searchQuery = '',
  className = ''
}) => {
  const [activeFilters, setActiveFilters] = useState<any>(initialFilters)
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['category', 'price']))

  const filterCategories: FilterCategory[] = [
    {
      id: 'category',
      name: 'Category',
      type: 'checkbox',
      options: [
        { id: 'hoodies', label: 'Hoodies', value: 'hoodies', count: 156, trending: true },
        { id: 'tshirts', label: 'T-Shirts', value: 'tshirts', count: 234, recommended: true },
        { id: 'jeans', label: 'Jeans', value: 'jeans', count: 89 },
        { id: 'shirts', label: 'Shirts', value: 'shirts', count: 167 },
        { id: 'jackets', label: 'Jackets', value: 'jackets', count: 78, trending: true },
        { id: 'shoes', label: 'Shoes', value: 'shoes', count: 145 }
      ]
    },
    {
      id: 'price',
      name: 'Price Range',
      type: 'checkbox',
      aiSuggested: true,
      description: 'AI-optimized price ranges based on your search',
      options: [
        { id: 'under-1000', label: 'Under ₹1,000', value: '0-1000', count: 45 },
        { id: '1000-2000', label: '₹1,000 - ₹2,000', value: '1000-2000', count: 89, recommended: true },
        { id: '2000-5000', label: '₹2,000 - ₹5,000', value: '2000-5000', count: 234 },
        { id: '5000-10000', label: '₹5,000 - ₹10,000', value: '5000-10000', count: 123 },
        { id: 'above-10000', label: 'Above ₹10,000', value: '10000+', count: 67 }
      ]
    },
    {
      id: 'color',
      name: 'Colors',
      type: 'color',
      options: [
        { id: 'black', label: 'Black', value: 'black', count: 234 },
        { id: 'white', label: 'White', value: 'white', count: 189 },
        { id: 'blue', label: 'Blue', value: 'blue', count: 156 },
        { id: 'gray', label: 'Gray', value: 'gray', count: 145 },
        { id: 'red', label: 'Red', value: 'red', count: 78 },
        { id: 'green', label: 'Green', value: 'green', count: 67 }
      ]
    },
    {
      id: 'size',
      name: 'Size',
      type: 'checkbox',
      options: [
        { id: 'xs', label: 'XS', value: 'xs', count: 45 },
        { id: 's', label: 'S', value: 's', count: 89, recommended: true },
        { id: 'm', label: 'M', value: 'm', count: 234 },
        { id: 'l', label: 'L', value: 'l', count: 198 },
        { id: 'xl', label: 'XL', value: 'xl', count: 156 },
        { id: 'xxl', label: 'XXL', value: 'xxl', count: 78 }
      ]
    },
    {
      id: 'style',
      name: 'Style',
      type: 'checkbox',
      aiSuggested: true,
      description: 'Styles that match your search intent',
      options: [
        { id: 'casual', label: 'Casual', value: 'casual', count: 345, recommended: true },
        { id: 'formal', label: 'Formal', value: 'formal', count: 123 },
        { id: 'streetwear', label: 'Streetwear', value: 'streetwear', count: 234, trending: true },
        { id: 'vintage', label: 'Vintage', value: 'vintage', count: 89 },
        { id: 'minimalist', label: 'Minimalist', value: 'minimalist', count: 156 }
      ]
    },
    {
      id: 'features',
      name: 'Features',
      type: 'checkbox',
      options: [
        { id: 'organic', label: 'Organic Cotton', value: 'organic', count: 78 },
        { id: 'sustainable', label: 'Sustainable', value: 'sustainable', count: 123, trending: true },
        { id: 'limited', label: 'Limited Edition', value: 'limited', count: 34 },
        { id: 'bestseller', label: 'Best Seller', value: 'bestseller', count: 89, recommended: true }
      ]
    }
  ]

  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      generateAISuggestions()
    }
  }, [searchQuery])

  const generateAISuggestions = async () => {
    setIsGeneratingAI(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const suggestions = [
      {
        type: 'smart_filter',
        title: 'Based on your search',
        description: 'AI detected you might be looking for casual wear',
        filters: { style: ['casual'], price: ['2000-5000'] },
        confidence: 89
      },
      {
        type: 'trending',
        title: 'Trending combinations',
        description: 'Popular filter combinations this week',
        filters: { category: ['hoodies'], color: ['black'], style: ['streetwear'] },
        confidence: 94
      },
      {
        type: 'personalized',
        title: 'Recommended for you',
        description: 'Based on your browsing history',
        filters: { size: ['m', 'l'], features: ['sustainable'] },
        confidence: 76
      }
    ]
    
    setAiSuggestions(suggestions)
    setIsGeneratingAI(false)
  }

  const toggleFilter = (categoryId: string, optionValue: string) => {
    setActiveFilters((prev: any) => {
      const updated = { ...prev }
      if (!updated[categoryId]) {
        updated[categoryId] = []
      }
      
      const index = updated[categoryId].indexOf(optionValue)
      if (index > -1) {
        updated[categoryId].splice(index, 1)
      } else {
        updated[categoryId].push(optionValue)
      }
      
      if (updated[categoryId].length === 0) {
        delete updated[categoryId]
      }
      
      return updated
    })
  }

  const applyAISuggestion = (suggestion: any) => {
    setActiveFilters((prev: any) => ({
      ...prev,
      ...suggestion.filters
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({})
  }

  const getActiveFiltersCount = () => {
    return Object.values(activeFilters).reduce((total: number, values: any) => total + values.length, 0)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const updated = new Set(prev)
      if (updated.has(categoryId)) {
        updated.delete(categoryId)
      } else {
        updated.add(categoryId)
      }
      return updated
    })
  }

  const getColorStyle = (colorValue: string) => {
    const colorMap: { [key: string]: string } = {
      black: '#000000',
      white: '#FFFFFF',
      blue: '#3B82F6',
      gray: '#6B7280',
      red: '#EF4444',
      green: '#10B981'
    }
    return { backgroundColor: colorMap[colorValue] || colorValue }
  }

  useEffect(() => {
    onFiltersChange(activeFilters)
  }, [activeFilters, onFiltersChange])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-md bg-gray-900 h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AdjustmentsHorizontalIcon className="w-6 h-6 text-purple-400" />
              <h3 className="text-white font-semibold text-lg">Smart Filters</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
              </span>
              <button
                onClick={clearAllFilters}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* AI Suggestions */}
          {searchQuery && (
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-700/50">
              <div className="flex items-center space-x-2 mb-3">
                <SparklesIcon className="w-5 h-5 text-purple-400" />
                <h4 className="text-white font-medium">AI Suggestions</h4>
              </div>
              
              {isGeneratingAI ? (
                <div className="text-center py-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"
                  />
                  <p className="text-gray-400 text-sm">Analyzing your search...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => applyAISuggestion(suggestion)}
                      className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium text-sm">{suggestion.title}</span>
                        <span className="text-green-400 text-xs">{suggestion.confidence}%</span>
                      </div>
                      <p className="text-gray-400 text-xs">{suggestion.description}</p>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Filter Categories */}
          {filterCategories.map((category) => (
            <div key={category.id} className="border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{category.name}</span>
                  {category.aiSuggested && (
                    <div className="flex items-center space-x-1 bg-purple-600 px-2 py-1 rounded-full">
                      <BoltIcon className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">AI</span>
                    </div>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: expandedCategories.has(category.id) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedCategories.has(category.id) && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-gray-800/30">
                      {category.description && (
                        <p className="text-gray-400 text-xs mb-3">{category.description}</p>
                      )}
                      
                      <div className={`grid gap-2 ${
                        category.type === 'color' ? 'grid-cols-6' : 'grid-cols-1'
                      }`}>
                        {category.options.map((option) => {
                          const isSelected = activeFilters[category.id]?.includes(option.value)
                          
                          if (category.type === 'color') {
                            return (
                              <button
                                key={option.id}
                                onClick={() => toggleFilter(category.id, option.value as string)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                  isSelected ? 'border-white ring-2 ring-purple-500' : 'border-gray-600'
                                }`}
                                style={getColorStyle(option.value as string)}
                                title={option.label}
                              />
                            )
                          }

                          return (
                            <button
                              key={option.id}
                              onClick={() => toggleFilter(category.id, option.value as string)}
                              className={`flex items-center justify-between p-2 rounded-lg text-sm transition-all ${
                                isSelected
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                                  isSelected ? 'border-white bg-white' : 'border-gray-400'
                                }`}>
                                  {isSelected && <CheckIcon className="w-3 h-3 text-purple-600" />}
                                </div>
                                <span>{option.label}</span>
                                {option.trending && <FireIcon className="w-3 h-3 text-orange-400" />}
                                {option.recommended && <StarIcon className="w-3 h-3 text-yellow-400" />}
                              </div>
                              {option.count && (
                                <span className="text-xs text-gray-400">({option.count})</span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Add missing import
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default SmartFilters