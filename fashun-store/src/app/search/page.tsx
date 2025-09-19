'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  SparklesIcon,
  EyeIcon,
  BoltIcon,
  PhotoIcon,
  AdjustmentsHorizontalIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import IntelligentSearch from '@/components/ai/IntelligentSearch'
import SmartFilters from '@/components/ai/SmartFilters'
import VisualSearch from '@/components/ai/VisualSearch'

// Enhanced mock products data with AI-friendly attributes
const products = [
  {
    id: 1,
    name: 'Oversized Black Hoodie',
    price: 2999,
    originalPrice: 3999,
    image: '/api/placeholder/400/500',
    category: 'hoodies',
    color: 'black',
    size: ['S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviews: 124,
    tags: ['oversized', 'streetwear', 'casual', 'black', 'hoodie'],
    style: 'streetwear',
    material: 'cotton',
    occasion: 'casual',
    season: 'winter',
    trending: true,
    aiScore: 94
  },
  {
    id: 2,
    name: 'Graphic Print Tee',
    price: 1499,
    originalPrice: 1999,
    image: '/api/placeholder/400/500',
    category: 'tshirts',
    color: 'white',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.6,
    reviews: 89,
    tags: ['graphic', 'trendy', 'cool', 'white', 'tshirt'],
    style: 'casual',
    material: 'cotton',
    occasion: 'casual',
    season: 'summer',
    trending: false,
    aiScore: 87
  },
  {
    id: 3,
    name: 'Classic Polo Shirt',
    price: 1899,
    originalPrice: 2499,
    image: '/api/placeholder/400/500',
    category: 'polos',
    color: 'navy',
    size: ['S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviews: 156,
    tags: ['classic', 'formal', 'business', 'navy', 'polo'],
    style: 'formal',
    material: 'cotton',
    occasion: 'work',
    season: 'all',
    trending: false,
    aiScore: 91
  },
  {
    id: 4,
    name: 'Distressed Denim Jacket',
    price: 3499,
    originalPrice: 4299,
    image: '/api/placeholder/400/500',
    category: 'jackets',
    color: 'blue',
    size: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviews: 203,
    tags: ['denim', 'vintage', 'distressed', 'blue', 'jacket'],
    style: 'vintage',
    material: 'denim',
    occasion: 'casual',
    season: 'spring',
    trending: true,
    aiScore: 96
  },
  {
    id: 5,
    name: 'Athletic Shorts',
    price: 1299,
    originalPrice: 1699,
    image: '/api/placeholder/400/500',
    category: 'shorts',
    color: 'gray',
    size: ['S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviews: 78,
    tags: ['athletic', 'sport', 'comfortable', 'gray', 'shorts'],
    style: 'athletic',
    material: 'polyester',
    occasion: 'sport',
    season: 'summer',
    trending: false,
    aiScore: 83
  },
  {
    id: 6,
    name: 'Minimalist White Sneakers',
    price: 4999,
    originalPrice: 5999,
    image: '/api/placeholder/400/500',
    category: 'shoes',
    color: 'white',
    size: ['7', '8', '9', '10', '11'],
    rating: 4.8,
    reviews: 245,
    tags: ['minimalist', 'white', 'sneakers', 'clean', 'modern'],
    style: 'minimalist',
    material: 'leather',
    occasion: 'casual',
    season: 'all',
    trending: true,
    aiScore: 98
  }
]

export default function EnhancedSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<any>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showVisualSearch, setShowVisualSearch] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [isAnalyzingQuery, setIsAnalyzingQuery] = useState(false)

  // AI-powered search logic
  const filteredProducts = useMemo(() => {
    let filtered: any[] = [...products]
    
    // Text search with AI scoring
    if (searchQuery) {
      filtered = filtered.filter(product => {
        const searchTerms = searchQuery.toLowerCase().split(' ')
        const productText = `${product.name} ${product.tags.join(' ')} ${product.category} ${product.color} ${product.style} ${product.occasion}`.toLowerCase()
        
        return searchTerms.every(term => productText.includes(term))
      }).map(product => ({
        ...product,
        relevanceScore: calculateRelevanceScore(product, searchQuery)
      }))
    }

    // Apply filters
    Object.entries(filters).forEach(([key, values]: [string, any]) => {
      if (values && values.length > 0) {
        filtered = filtered.filter(product => {
          switch (key) {
            case 'category':
              return values.includes(product.category)
            case 'color':
              return values.includes(product.color)
            case 'style':
              return values.includes(product.style)
            case 'price':
              return values.some((range: string) => {
                const [min, max] = range.split('-').map(Number)
                return max ? (product.price >= min && product.price <= max) : product.price >= min
              })
            default:
              return true
          }
        })
      }
    })

    // Sort results
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'trending':
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
        break
      case 'ai_score':
        filtered.sort((a, b) => b.aiScore - a.aiScore)
        break
      default:
        // Relevance (AI scoring)
        if (searchQuery) {
          filtered.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        } else {
          filtered.sort((a, b) => b.aiScore - a.aiScore)
        }
    }

    return filtered
  }, [searchQuery, filters, sortBy])

  const calculateRelevanceScore = (product: any, query: string): number => {
    let score = 0
    const queryLower = query.toLowerCase()
    const productText = `${product.name} ${product.tags.join(' ')}`.toLowerCase()
    
    // Exact matches get higher scores
    if (product.name.toLowerCase().includes(queryLower)) score += 50
    if (product.category.includes(queryLower)) score += 30
    if (product.color.includes(queryLower)) score += 20
    
    // Tag matches
    product.tags.forEach((tag: string) => {
      if (tag.includes(queryLower)) score += 15
    })
    
    // AI score contribution
    score += product.aiScore * 0.3
    
    return score
  }

  const handleSearch = (query: string, extractedFilters?: any) => {
    setSearchQuery(query)
    if (extractedFilters) {
      setFilters((prev: any) => ({ ...prev, ...extractedFilters }))
      generateAIInsights(query, extractedFilters)
    }
  }

  const generateAIInsights = async (query: string, filters: any) => {
    setIsAnalyzingQuery(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const insights = {
      query,
      totalResults: filteredProducts.length,
      topCategories: ['hoodies', 'tshirts', 'jackets'],
      suggestedFilters: {
        priceRange: '₹2,000 - ₹5,000',
        popularColors: ['black', 'white', 'blue'],
        trending: ['streetwear', 'casual', 'minimalist']
      },
      recommendations: [
        'Most users looking for similar items also viewed hoodies',
        'Consider checking out our trending streetwear collection',
        'Based on your search, you might like vintage-style items'
      ]
    }
    
    setAiInsights(insights)
    setIsAnalyzingQuery(false)
  }

  const clearAllFilters = () => {
    setFilters({})
    setSearchQuery('')
    setAiInsights(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Enhanced Header with AI Search */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            {/* Main Search Bar */}
            <IntelligentSearch
              onSearch={handleSearch}
              placeholder="Search with AI: 'black hoodie for winter' or 'outfit for date night'"
              className="w-full"
              isExpanded={true}
            />

            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowVisualSearch(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PhotoIcon className="w-4 h-4" />
                  <span>Visual Search</span>
                </button>
                
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                  <span>Smart Filters</span>
                  {Object.keys(filters).length > 0 && (
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      {Object.values(filters).flat().length}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="ai_score">AI Score</option>
                  <option value="trending">Trending</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* AI Insights Panel */}
        <AnimatePresence>
          {aiInsights && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 mb-8 border border-purple-700/50"
            >
              <div className="flex items-center space-x-2 mb-4">
                <SparklesIcon className="w-6 h-6 text-purple-400" />
                <h3 className="text-white font-semibold text-lg">AI Search Insights</h3>
                {isAnalyzingQuery && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"
                  />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-2">Search Analysis</h4>
                  <p className="text-gray-300 text-sm mb-2">Found {aiInsights.totalResults} products</p>
                  <p className="text-gray-400 text-sm">Query: "{aiInsights.query}"</p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Smart Suggestions</h4>
                  <div className="space-y-1">
                    <p className="text-gray-300 text-sm">Price: {aiInsights.suggestedFilters.priceRange}</p>
                    <p className="text-gray-300 text-sm">Colors: {aiInsights.suggestedFilters.popularColors.join(', ')}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">AI Recommendations</h4>
                  <ul className="space-y-1">
                    {aiInsights.recommendations.slice(0, 2).map((rec: string, index: number) => (
                      <li key={index} className="text-gray-400 text-xs flex items-start space-x-1">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold text-xl">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h2>
            <p className="text-gray-400 text-sm">
              {filteredProducts.length} products found
              {sortBy === 'ai_score' && ' • Sorted by AI relevance score'}
            </p>
          </div>

          {(searchQuery || Object.keys(filters).length > 0) && (
            <button
              onClick={clearAllFilters}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-gray-600 group"
              >
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={500}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* AI Score Badge */}
                  {sortBy === 'ai_score' && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <BoltIcon className="w-3 h-3" />
                      <span>{product.aiScore}% AI</span>
                    </div>
                  )}
                  
                  {/* Trending Badge */}
                  {product.trending && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full">
                      🔥 Trending
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.originalPrice > product.price && (
                    <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium text-sm truncate flex-1 mr-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <StarSolid className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400 text-xs">{product.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-xs mb-2 capitalize">
                    {product.category} • {product.style}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-gray-400 text-sm line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 group"
                  >
                    <span>View Product</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium text-lg mb-2">No products found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearAllFilters}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* AI Components */}
      <SmartFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={setFilters}
        initialFilters={filters}
        searchQuery={searchQuery}
      />

      <VisualSearch
        isOpen={showVisualSearch}
        onClose={() => setShowVisualSearch(false)}
        onSearchResults={(results) => {
          // Handle visual search results
          console.log('Visual search results:', results)
        }}
      />
    </div>
  )
}