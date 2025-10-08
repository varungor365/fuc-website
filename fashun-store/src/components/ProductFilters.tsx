'use client'

import { useState } from 'react'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface FilterProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  categories: string[]
  sortBy: string
}

export default function ProductFilters({ onFilterChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    sizes: [],
    colors: [],
    priceRange: [0, 10000],
    categories: [],
    sortBy: 'featured'
  })

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink']
  const categories = ['T-Shirts', 'Hoodies', 'Jeans', 'Jackets', 'Sneakers', 'Accessories']

  const toggleFilter = (type: keyof FilterState, value: string) => {
    const updated = { ...filters }
    const arr = updated[type] as string[]
    
    if (arr.includes(value)) {
      updated[type] = arr.filter(v => v !== value) as any
    } else {
      updated[type] = [...arr, value] as any
    }
    
    setFilters(updated)
    onFilterChange(updated)
  }

  const updatePriceRange = (min: number, max: number) => {
    const updated = { ...filters, priceRange: [min, max] as [number, number] }
    setFilters(updated)
    onFilterChange(updated)
  }

  const clearFilters = () => {
    const cleared: FilterState = {
      sizes: [],
      colors: [],
      priceRange: [0, 10000],
      categories: [],
      sortBy: 'featured'
    }
    setFilters(cleared)
    onFilterChange(cleared)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-700"
      >
        <FunnelIcon className="w-5 h-5" />
        Filters
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-md bg-primary-900 p-6 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Filters</h2>
              <button onClick={() => setIsOpen(false)}>
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleFilter('sizes', size)}
                      className={`px-4 py-2 rounded-lg ${
                        filters.sizes.includes(size)
                          ? 'bg-accent-500 text-white'
                          : 'bg-primary-800 text-primary-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => toggleFilter('colors', color)}
                      className={`px-4 py-2 rounded-lg ${
                        filters.colors.includes(color)
                          ? 'bg-accent-500 text-white'
                          : 'bg-primary-800 text-primary-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={filters.priceRange[1]}
                    onChange={e => updatePriceRange(0, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-primary-300">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 text-primary-300">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(cat)}
                        onChange={() => toggleFilter('categories', cat)}
                        className="rounded"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full py-3 bg-primary-800 text-white rounded-lg hover:bg-primary-700"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
