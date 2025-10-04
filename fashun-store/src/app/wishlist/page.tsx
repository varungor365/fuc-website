'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  StarIcon,
  TagIcon,
  SparklesIcon,
  GiftIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export default function WishlistPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('dateAdded')
  
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 'prod-1',
      name: 'Urban Explorer Hoodie',
      price: 2499,
      originalPrice: 3499,
      image: '/images/products/hoodies/hoodie-1-main.jpg',
      category: 'Hoodies',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Grey'],
      rating: 4.8,
      reviews: 156,
      dateAdded: '2024-10-01',
      inStock: true,
      sale: true,
      discount: 29
    },
    {
      id: 'prod-2',
      name: 'Essential Crew Tee',
      price: 1299,
      originalPrice: 1299,
      image: '/images/products/t-shirts/tshirt-1-main.jpg',
      category: 'T-Shirts',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Black', 'Grey', 'Navy'],
      rating: 4.6,
      reviews: 89,
      dateAdded: '2024-09-28',
      inStock: true,
      sale: false,
      discount: 0
    },
    {
      id: 'prod-3',
      name: 'Premium Leather Sneakers',
      price: 5999,
      originalPrice: 5999,
      image: '/images/products/shoes/sneaker-1-main.jpg',
      category: 'Footwear',
      sizes: ['7', '8', '9', '10', '11'],
      colors: ['White', 'Black'],
      rating: 4.9,
      reviews: 234,
      dateAdded: '2024-09-25',
      inStock: false,
      sale: false,
      discount: 0
    },
    {
      id: 'prod-4',
      name: 'Minimalist Cap',
      price: 899,
      originalPrice: 1199,
      image: '/images/products/accessories/cap-1-main.jpg',
      category: 'Accessories',
      sizes: ['One Size'],
      colors: ['Black', 'White', 'Navy'],
      rating: 4.4,
      reviews: 67,
      dateAdded: '2024-09-20',
      inStock: true,
      sale: true,
      discount: 25
    },
    {
      id: 'prod-5',
      name: 'Graphic Statement Tee',
      price: 1599,
      originalPrice: 1599,
      image: '/images/products/t-shirts/tshirt-2-main.jpg',
      category: 'T-Shirts',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White'],
      rating: 4.7,
      reviews: 123,
      dateAdded: '2024-09-15',
      inStock: true,
      sale: false,
      discount: 0
    },
    {
      id: 'prod-6',
      name: 'Comfort Fit Joggers',
      price: 2299,
      originalPrice: 2799,
      image: '/images/products/pants/joggers-1-main.jpg',
      category: 'Bottoms',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Grey', 'Navy'],
      rating: 4.5,
      reviews: 91,
      dateAdded: '2024-09-10',
      inStock: true,
      sale: true,
      discount: 18
    }
  ])

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId))
  }

  const moveToCart = (productId: string) => {
    // Handle move to cart logic
    console.log('Moving to cart:', productId)
  }

  const shareWishlist = () => {
    // Handle share wishlist logic
    console.log('Sharing wishlist')
  }

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0)
  const totalSavings = wishlistItems.reduce((sum, item) => {
    return sum + (item.originalPrice - item.price)
  }, 0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeartSolidIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Your
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Wishlist
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Save your favorite items and never miss out on the styles you love.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Wishlist Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <HeartSolidIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{wishlistItems.length}</div>
              <div className="text-primary-300 text-sm">Saved Items</div>
            </div>
            
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <TagIcon className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">₹{totalValue.toLocaleString()}</div>
              <div className="text-primary-300 text-sm">Total Value</div>
            </div>
            
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <SparklesIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">₹{totalSavings.toLocaleString()}</div>
              <div className="text-primary-300 text-sm">Total Savings</div>
            </div>
            
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <GiftIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{wishlistItems.filter(item => item.sale).length}</div>
              <div className="text-primary-300 text-sm">On Sale</div>
            </div>
          </div>
        </motion.div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
              <HeartIcon className="w-24 h-24 text-primary-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Your Wishlist is Empty</h2>
              <p className="text-primary-200 mb-8 max-w-md mx-auto">
                Start browsing and save items you love. They'll appear here for easy access later.
              </p>
              <Link href="/products" className="btn btn-glass">
                Start Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-primary-800/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-accent-400/50"
                  >
                    <option value="dateAdded">Recently Added</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="name">Name A-Z</option>
                  </select>
                  
                  <div className="flex bg-primary-800/30 border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        viewMode === 'grid' ? 'bg-accent-500 text-primary-900' : 'text-primary-300'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        viewMode === 'list' ? 'bg-accent-500 text-primary-900' : 'text-primary-300'
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={shareWishlist}
                    className="btn btn-ghost text-white border-white/30 hover:bg-white/10 btn-sm"
                  >
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share
                  </button>
                  <button className="btn btn-glass btn-sm">
                    <ShoppingBagIcon className="w-4 h-4 mr-2" />
                    Add All to Cart
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Wishlist Items */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' 
                : 'space-y-6'
            }`}>
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-accent-400/50 transition-all group ${
                    viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    /* Grid View */
                    <>
                      <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3">
                          {item.sale && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{item.discount}%
                            </span>
                          )}
                        </div>
                        
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-primary-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Out of Stock
                            </span>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/products/${item.id}`}
                            className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-accent-400 text-sm font-medium">{item.category}</span>
                          <div className="flex items-center text-yellow-400 text-sm">
                            <StarIcon className="w-4 h-4 fill-current" />
                            <span className="ml-1">{item.rating}</span>
                            <span className="text-primary-400 ml-1">({item.reviews})</span>
                          </div>
                        </div>
                        
                        <h3 className="text-white font-bold text-lg mb-3 group-hover:text-accent-400 transition-colors">
                          <Link href={`/products/${item.id}`}>
                            {item.name}
                          </Link>
                        </h3>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-accent-400 font-bold text-lg">₹{item.price.toLocaleString()}</span>
                            {item.sale && (
                              <span className="text-primary-400 line-through text-sm">₹{item.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => moveToCart(item.id)}
                            disabled={!item.inStock}
                            className={`flex-1 btn btn-sm ${
                              item.inStock 
                                ? 'btn-glass' 
                                : 'btn-ghost opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingBagIcon className="w-4 h-4 mr-1" />
                            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* List View */
                    <>
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden mr-6 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        {item.sale && (
                          <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded">
                            -{item.discount}%
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
                            <p className="text-accent-400 text-sm mb-2">{item.category}</p>
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-accent-400 font-bold">₹{item.price.toLocaleString()}</span>
                                {item.sale && (
                                  <span className="text-primary-400 line-through text-sm">₹{item.originalPrice.toLocaleString()}</span>
                                )}
                              </div>
                              <div className="flex items-center text-yellow-400 text-sm">
                                <StarIcon className="w-4 h-4 fill-current" />
                                <span className="ml-1">{item.rating} ({item.reviews})</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => moveToCart(item.id)}
                              disabled={!item.inStock}
                              className={`btn btn-sm ${
                                item.inStock 
                                  ? 'btn-glass' 
                                  : 'btn-ghost opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <ShoppingBagIcon className="w-4 h-4 mr-1" />
                              {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="btn btn-ghost text-red-400 border-red-400/30 hover:bg-red-500/10 btn-sm"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-8 text-center"
        >
          <SparklesIcon className="w-12 h-12 text-accent-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Discover Similar Styles</h2>
          <p className="text-primary-200 mb-6 max-w-2xl mx-auto">
            Based on your wishlist, we think you'll love these hand-picked recommendations 
            from our latest collection.
          </p>
          <Link href="/recommendations" className="btn btn-glass">
            View Recommendations
          </Link>
        </motion.div>
      </div>
    </main>
  )
}