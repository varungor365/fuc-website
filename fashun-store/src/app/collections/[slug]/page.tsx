'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowRightIcon,
  XMarkIcon,
  ChevronDownIcon,
  HeartIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import QuickViewModal from '@/components/ui/QuickViewModal'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import SmartFilters from '@/components/ai/SmartFilters'
import { products, categories } from '@/data/products'

type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest' | 'best-selling' | 'rating'
type ViewMode = 'grid' | 'list'

export const dynamicParams = false

export default function CollectionPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [gridColumns, setGridColumns] = useState(3)
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [showQuickView, setShowQuickView] = useState(false)
  
  const itemsPerPage = 24
  
  // Get collection data
  const collection = categories[slug as keyof typeof categories]
  
  // Filter products by collection
  const collectionProducts = useMemo(() => {
    return products.filter(product => {
      // Match by category
      const matchesCategory = product.category === slug
      
      if (!matchesCategory) return false
      
      // Apply filters
      if (Object.keys(activeFilters).length === 0) return true
      
      // Price filter
      if (activeFilters.price) {
        const priceRanges = {
          '0-1000': [0, 1000],
          '1000-2500': [1000, 2500],
          '2500-5000': [2500, 5000],
          '5000-10000': [5000, 10000],
          '10000+': [10000, Infinity]
        }
        
        const matchesPrice = activeFilters.price.some((range: string) => {
          const [min, max] = priceRanges[range as keyof typeof priceRanges] || [0, Infinity]
          return product.price >= min && product.price <= max
        })
        
        if (!matchesPrice) return false
      }
      
      // Size filter
      if (activeFilters.size) {
        const matchesSize = activeFilters.size.some((size: string) =>
          product.sizes.some(productSize => productSize.name.toUpperCase() === size.toUpperCase())
        )
        if (!matchesSize) return false
      }
      
      // Color filter
      if (activeFilters.color) {
        const matchesColor = activeFilters.color.some((color: string) =>
          product.colors.some(productColor =>
            productColor.name.toLowerCase().includes(color.toLowerCase())
          )
        )
        if (!matchesColor) return false
      }
      
      return true
    })
  }, [slug, collection, activeFilters])
  
  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...collectionProducts]
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price)
      case 'newest':
        return sorted.sort((a, b) => b.id.localeCompare(a.id))
      case 'best-selling':
        return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'featured':
      default:
        return sorted.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0))
    }
  }, [collectionProducts, sortBy])
  
  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedProducts, currentPage])
  
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'best-selling', label: 'Best Selling' },
    { value: 'rating', label: 'Highest Rated' }
  ]
  
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev)
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId)
      } else {
        newWishlist.add(productId)
      }
      return newWishlist
    })
  }

  const openQuickView = (product: any) => {
    setQuickViewProduct(product)
    setShowQuickView(true)
  }

  const closeQuickView = () => {
    setShowQuickView(false)
    setQuickViewProduct(null)
  }
  
  const removeFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category]?.filter((v: string) => v !== value) || []
    }))
  }
  
  const clearAllFilters = () => {
    setActiveFilters({})
  }
  
  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Collection Not Found</h1>
          <p className="text-primary-200 mb-8">The collection you're looking for doesn't exist.</p>
          <Link href="/collections" className="btn btn-glass">
            Browse Collections
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Collection Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2 text-sm text-primary-400 mb-8"
          >
            <Link href="/" className="hover:text-accent-400 transition-colors">
              Home
            </Link>
            <ArrowRightIcon className="w-4 h-4" />
            <Link href="/collections" className="hover:text-accent-400 transition-colors">
              Collections
            </Link>
            <ArrowRightIcon className="w-4 h-4" />
            <span className="text-white">{collection.name}</span>
          </motion.nav>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              {collection.name}
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto mb-8">
              {collection.description}
            </p>
            <div className="text-primary-300">
              {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
            </div>
          </motion.div>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="lg:w-80 hidden lg:block">
            <div className="sticky top-8">
              <SmartFilters
                onFiltersChange={setActiveFilters}
                selectedFilters={activeFilters}
              />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden btn btn-outline flex items-center gap-2"
                >
                  <FunnelIcon className="w-4 h-4" />
                  Filters
                  {Object.keys(activeFilters).length > 0 && (
                    <span className="bg-accent-500 text-primary-900 text-xs px-2 py-1 rounded-full">
                      {Object.values(activeFilters).flat().length}
                    </span>
                  )}
                </button>
                
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-primary-800/30 border border-white/10 rounded-xl px-4 py-2 pr-10 text-white text-sm focus:outline-none focus:border-accent-400/50"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center bg-primary-800/30 border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-accent-500 text-primary-900'
                          : 'text-primary-400 hover:text-white'
                      }`}
                    >
                      <Squares2X2Icon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-accent-500 text-primary-900'
                          : 'text-primary-400 hover:text-white'
                      }`}
                    >
                      <ListBulletIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Active Filters */}
              {Object.keys(activeFilters).length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-primary-200">Active Filters:</span>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-accent-400 hover:text-accent-300"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([category, values]) =>
                      (values as string[]).map(value => (
                        <span
                          key={`${category}-${value}`}
                          className="bg-primary-700/30 text-primary-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {category}: {value}
                          <button
                            onClick={() => removeFilter(category, value)}
                            className="text-primary-400 hover:text-white"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {paginatedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden group-hover:border-accent-400/30 transition-all group-hover:scale-105">
                        {/* Image */}
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent z-10" />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                            {product.inStock && product.stockCount && product.stockCount < 10 && (
                              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                Limited Stock
                              </span>
                            )}
                            {product.originalPrice && (
                              <span className="bg-accent-500 text-primary-900 px-2 py-1 rounded text-xs font-bold">
                                Sale
                              </span>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                            {/* Quick View Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                openQuickView(product)
                              }}
                              className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors"
                              title="Quick View"
                            >
                              <EyeIcon className="w-4 h-4 text-white" />
                            </button>
                            
                            {/* Wishlist Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                toggleWishlist(product.id)
                              }}
                              className="bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors"
                              title={wishlist.has(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                              {wishlist.has(product.id) ? (
                                <HeartSolid className="w-4 h-4 text-red-500" />
                              ) : (
                                <HeartIcon className="w-4 h-4 text-white" />
                              )}
                            </button>
                          </div>
                          
                          <div className="absolute inset-0 bg-gradient-to-br from-accent-400/5 to-primary-600/5" />
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-white font-semibold mb-2 group-hover:text-accent-400 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          
                          {/* Rating */}
                          {product.rating && (
                            <div className="flex items-center gap-1 mb-2">
                              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-primary-200">{product.rating}</span>
                              {product.reviewCount && (
                                <span className="text-xs text-primary-400">({product.reviewCount})</span>
                              )}
                            </div>
                          )}
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-accent-400 font-bold">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-primary-400 text-sm line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          
                          {/* Stock Status */}
                          <div className="text-xs">
                            {product.inStock ? (
                              <span className="text-green-400">In Stock</span>
                            ) : (
                              <span className="text-red-400">Out of Stock</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // No Products Found
              <div className="text-center py-20">
                <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
                  <h3 className="text-xl font-semibold text-white mb-4">No Products Found</h3>
                  <p className="text-primary-300 mb-8">
                    No products match your current filters. Try adjusting your criteria.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="btn btn-glass"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-16 flex justify-center items-center gap-2"
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-accent-500 text-primary-900 font-semibold'
                          : 'bg-primary-800/30 text-primary-300 hover:bg-primary-700/30 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-primary-900/80 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-primary-900 border-l border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-primary-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto h-full pb-20">
              <SmartFilters
                onFiltersChange={setActiveFilters}
                selectedFilters={activeFilters}
              />
            </div>
          </div>
        </div>
      )}

      {/* QuickView Modal */}
      {showQuickView && quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={showQuickView}
          onClose={closeQuickView}
        />
      )}
    </main>
  )
}
