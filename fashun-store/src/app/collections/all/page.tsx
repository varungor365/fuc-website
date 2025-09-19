'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// import Image from 'next/image'
// import Link from 'next/link'
import { ProductCard } from '@/components/ui/ProductCard'

// Mock products data - replace with your actual data
const mockProducts = [
  {
    id: 1,
    name: 'Oversized Black Hoodie',
    price: 2999,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&crop=center',
    category: 'hoodies',
    isNew: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: 'Graphic Print Tee',
    price: 1499,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center',
    category: 'tshirts',
    isNew: false,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: 'Premium Cotton Polo',
    price: 2299,
    originalPrice: 2799,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop&crop=center',
    category: 'polos',
    isNew: true,
    rating: 4.9,
    reviews: 156
  },
  {
    id: 4,
    name: 'Urban Streetwear Hoodie',
    price: 3299,
    originalPrice: 4299,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center',
    category: 'hoodies',
    isNew: false,
    rating: 4.7,
    reviews: 203
  },
  {
    id: 5,
    name: 'Vintage Band Tee',
    price: 1799,
    originalPrice: 2299,
    image: '/api/placeholder/400/500',
    category: 'tshirts',
    isNew: true,
    rating: 4.5,
    reviews: 67
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
    reviews: 134
  }
]

const categories = [
  { id: 'all', name: 'All Products', count: 6 },
  { id: 'hoodies', name: 'Hoodies', count: 2 },
  { id: 'tshirts', name: 'T-Shirts', count: 2 },
  { id: 'polos', name: 'Polos', count: 2 }
]

export default function AllCollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)

  useEffect(() => {
    let filtered = mockProducts

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

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
  }, [selectedCategory, sortBy, priceRange])

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
              Premium Collection
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover our curated selection of premium streetwear designed for the modern generation. 
              Quality, style, and comfort in every piece.
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
                
                {/* Categories */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-300 mb-4">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center justify-between w-full p-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-[#E4C590] text-[#0F0F10]'
                            : 'text-gray-400 hover:text-[#E8E8E8] hover:bg-gray-800'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-xs">{category.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-300 mb-4">Price Range</h4>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="5000"
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
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-400">
                Showing {filteredProducts.length} of {mockProducts.length} products
              </p>
              
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
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-[#E8E8E8] mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
