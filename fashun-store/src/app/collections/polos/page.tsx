'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ui/ProductCard'

// Mock polos data
const polosData = [
  {
    id: 3,
    name: 'Premium Cotton Polo',
    price: 2299,
    originalPrice: 2799,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop&crop=center',
    category: 'polos',
    isNew: true,
    rating: 4.9,
    reviews: 156,
    colors: ['#000000', '#FFFFFF', '#2F4F4F', '#8B4513'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 6,
    name: 'Classic Polo Shirt',
    price: 1999,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&crop=center',
    category: 'polos',
    isNew: false,
    rating: 4.8,
    reviews: 134,
    colors: ['#FFFFFF', '#000000', '#808080'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 15,
    name: 'FUC! Signature Polo',
    price: 2599,
    originalPrice: 3199,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&crop=center',
    category: 'polos',
    isNew: true,
    rating: 4.7,
    reviews: 89,
    colors: ['#E4C590', '#000000', '#FFFFFF', '#2F4F4F'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 16,
    name: 'Luxury Pique Polo',
    price: 2899,
    originalPrice: 3599,
    image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&h=500&fit=crop&crop=center',
    category: 'polos',
    isNew: false,
    rating: 4.6,
    reviews: 203,
    colors: ['#000000', '#2D2D2D', '#808080', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 17,
    name: 'Slim Fit Polo',
    price: 2199,
    originalPrice: 2699,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop&crop=center',
    category: 'polos',
    isNew: true,
    rating: 4.5,
    reviews: 167,
    colors: ['#FFFFFF', '#000000', '#E4C590'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 18,
    name: 'Vintage Wash Polo',
    price: 2399,
    originalPrice: 2899,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&crop=center',
    category: 'polos',
    isNew: false,
    rating: 4.8,
    reviews: 145,
    colors: ['#8B4513', '#2D2D2D', '#2F4F4F'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  }
]

export default function PolosPage() {
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 4000])
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(polosData)

  // Get all unique colors and sizes
  const allColors = Array.from(new Set(polosData.flatMap(p => p.colors || [])))
  const allSizes = Array.from(new Set(polosData.flatMap(p => p.sizes || [])))

  useEffect(() => {
    let filtered = polosData

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Filter by color
    if (selectedColor) {
      filtered = filtered.filter(product => 
        product.colors?.includes(selectedColor)
      )
    }

    // Filter by size
    if (selectedSize) {
      filtered = filtered.filter(product => 
        product.sizes?.includes(selectedSize)
      )
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [sortBy, priceRange, selectedColor, selectedSize])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F10] pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#E4C590]/10 to-transparent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-[#E8E8E8] mb-6">
              Premium Polos
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Elevate your wardrobe with our sophisticated collection of premium polo shirts. 
              Perfect blend of comfort, style, and versatility for any occasion.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-[#E8E8E8] mb-6">Filters</h3>
                
                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-300 mb-4">Price Range</h4>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="4000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-[#E4C590]"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>₹0</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-300 mb-4">Colors</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setSelectedColor('')}
                      className={`p-2 rounded-lg text-xs border ${
                        !selectedColor 
                          ? 'border-[#E4C590] bg-[#E4C590]/10 text-[#E4C590]' 
                          : 'border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      All
                    </button>
                    {allColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                        className={`w-8 h-8 rounded-lg border-2 ${
                          selectedColor === color 
                            ? 'border-[#E4C590]' 
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-300 mb-4">Sizes</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {allSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                        className={`p-2 rounded-lg text-sm border transition-colors ${
                          selectedSize === size
                            ? 'border-[#E4C590] bg-[#E4C590]/10 text-[#E4C590]'
                            : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-[#E8E8E8]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-4">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-[#E8E8E8] text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedColor('')
                    setSelectedSize('')
                    setPriceRange([0, 4000])
                    setSortBy('featured')
                  }}
                  className="w-full mt-6 p-2 border border-gray-700 rounded-lg text-gray-400 hover:text-[#E8E8E8] hover:border-gray-600 transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#E8E8E8] mb-2">Polos Collection</h2>
                <p className="text-gray-400">
                  Showing {filteredProducts.length} of {polosData.length} polo shirts
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">View:</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-[#E4C590] text-[#0F0F10] rounded">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#E8E8E8] rounded">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">👔</div>
                <h3 className="text-xl font-semibold text-[#E8E8E8] mb-2">No polo shirts found</h3>
                <p className="text-gray-400">Try adjusting your filters or search criteria</p>
                <button
                  onClick={() => {
                    setSelectedColor('')
                    setSelectedSize('')
                    setPriceRange([0, 4000])
                  }}
                  className="mt-4 px-6 py-2 bg-[#E4C590] text-[#0F0F10] rounded-lg hover:bg-[#E4C590]/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
