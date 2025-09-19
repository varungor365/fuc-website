'use client';

import React, { useState, useEffect } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'

interface FilterOption {
  id: string
  label: string
  count?: number
  color?: string // For color filters
}

interface FilterGroup {
  id: string
  label: string
  type: 'checkbox' | 'radio' | 'range' | 'color'
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
}

interface ProductFiltersProps {
  filterGroups: FilterGroup[]
  onFiltersChange: (filters: Record<string, any>) => void
  className?: string
}

export function ProductFilters({ filterGroups, onFiltersChange, className = '' }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['price', 'category']))
  const [filters, setFilters] = useState<Record<string, any>>({})

  const toggleGroup = (groupId: string) => {
    const newOpenGroups = new Set(openGroups)
    if (newOpenGroups.has(groupId)) {
      newOpenGroups.delete(groupId)
    } else {
      newOpenGroups.add(groupId)
    }
    setOpenGroups(newOpenGroups)
  }

  const updateFilters = (groupId: string, value: any) => {
    const newFilters = { ...filters, [groupId]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFiltersChange({})
  }

  const handleCheckboxChange = (groupId: string, optionId: string, checked: boolean) => {
    const currentValues = filters[groupId] || []
    let newValues
    
    if (checked) {
      newValues = [...currentValues, optionId]
    } else {
      newValues = currentValues.filter((id: string) => id !== optionId)
    }
    
    updateFilters(groupId, newValues.length > 0 ? newValues : undefined)
  }

  const handleRadioChange = (groupId: string, optionId: string) => {
    updateFilters(groupId, optionId)
  }

  const handleRangeChange = (groupId: string, min: number, max: number) => {
    updateFilters(groupId, { min, max })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className={`bg-white ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Filter Content */}
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
        {/* Active Filters & Clear */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Active Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([groupId, value]) => {
                if (!value) return null
                const group = filterGroups.find(g => g.id === groupId)
                if (!group) return null

                if (Array.isArray(value)) {
                  return value.map(optionId => {
                    const option = group.options?.find(o => o.id === optionId)
                    return option ? (
                      <span
                        key={`${groupId}-${optionId}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-sm rounded-full"
                      >
                        {option.label}
                        <button
                          onClick={() => handleCheckboxChange(groupId, optionId, false)}
                          className="hover:bg-gray-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null
                  })
                } else if (typeof value === 'object' && value.min !== undefined) {
                  return (
                    <span
                      key={groupId}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-sm rounded-full"
                    >
                      ₹{value.min} - ₹{value.max}
                      <button
                        onClick={() => updateFilters(groupId, undefined)}
                        className="hover:bg-gray-700 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )
                } else {
                  const option = group.options?.find(o => o.id === value)
                  return option ? (
                    <span
                      key={groupId}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-sm rounded-full"
                    >
                      {option.label}
                      <button
                        onClick={() => updateFilters(groupId, undefined)}
                        className="hover:bg-gray-700 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null
                }
              })}
            </div>
          </div>
        )}

        {/* Filter Groups */}
        <div className="space-y-6">
          {filterGroups.map((group) => (
            <div key={group.id} className="border-b border-gray-200 pb-6">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h3 className="font-medium text-gray-900">{group.label}</h3>
                {openGroups.has(group.id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {openGroups.has(group.id) && (
                <div className="space-y-3">
                  {group.type === 'checkbox' && group.options && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {group.options.map((option) => (
                        <label key={option.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={(filters[group.id] || []).includes(option.id)}
                            onChange={(e) => handleCheckboxChange(group.id, option.id, e.target.checked)}
                            className="rounded border-gray-300 text-black focus:ring-black"
                          />
                          <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                          {option.count !== undefined && (
                            <span className="text-xs text-gray-500">({option.count})</span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  {group.type === 'radio' && group.options && (
                    <div className="space-y-2">
                      {group.options.map((option) => (
                        <label key={option.id} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={group.id}
                            checked={filters[group.id] === option.id}
                            onChange={() => handleRadioChange(group.id, option.id)}
                            className="border-gray-300 text-black focus:ring-black"
                          />
                          <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                          {option.count !== undefined && (
                            <span className="text-xs text-gray-500">({option.count})</span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  {group.type === 'color' && group.options && (
                    <div className="grid grid-cols-6 gap-2">
                      {group.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            const isSelected = (filters[group.id] || []).includes(option.id)
                            handleCheckboxChange(group.id, option.id, !isSelected)
                          }}
                          className={`w-8 h-8 rounded-full border-2 ${
                            (filters[group.id] || []).includes(option.id)
                              ? 'border-black'
                              : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: option.color }}
                          title={option.label}
                        />
                      ))}
                    </div>
                  )}

                  {group.type === 'range' && (
                    <PriceRangeFilter
                      min={group.min || 0}
                      max={group.max || 10000}
                      step={group.step || 100}
                      value={filters[group.id]}
                      onChange={(min, max) => handleRangeChange(group.id, min, max)}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface PriceRangeFilterProps {
  min: number
  max: number
  step: number
  value?: { min: number; max: number }
  onChange: (min: number, max: number) => void
}

function PriceRangeFilter({ min, max, step, value, onChange }: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(value?.min || min)
  const [localMax, setLocalMax] = useState(value?.max || max)

  useEffect(() => {
    if (value) {
      setLocalMin(value.min)
      setLocalMax(value.max)
    }
  }, [value])

  const handleApply = () => {
    if (localMin !== min || localMax !== max) {
      onChange(localMin, localMax)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Min Price</label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Max Price</label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMin}
          onChange={(e) => setLocalMin(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMax}
          onChange={(e) => setLocalMax(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <button
        onClick={handleApply}
        className="w-full bg-black text-white py-2 px-4 rounded-md text-sm hover:bg-gray-800 transition-colors"
      >
        Apply Price Range
      </button>
    </div>
  )
}