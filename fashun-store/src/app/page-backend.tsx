'use client';

import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon, SparklesIcon, FireIcon, StarIcon } from '@heroicons/react/24/outline'
import PersonalizedSections from '@/components/ai/PersonalizedSections'
import StyleAssistantButton from '@/components/ai/StyleAssistantButton'
import TrendingOutfits from '@/components/ai/TrendingOutfits'
import { EnhancedButton } from '@/components/ui/AdvancedUIProvider'

// Mock data for featured products and categories
const featuredProducts = [
  {
    id: 1,
    name: 'Urban Streetwear Hoodie',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    image: '/api/placeholder/300/400',
    badge: 'BESTSELLER',
    rating: 4.8,
    reviews: 1247
  },
  {
    id: 2,
    name: 'Graphic Oversized Tee',
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    image: '/api/placeholder/300/400',
    badge: 'NEW',
    rating: 4.6,
    reviews: 856
  },
  {
    id: 3,
    name: 'Designer Cargo Pants',
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    image: '/api/placeholder/300/400',
    badge: 'TRENDING',
    rating: 4.7,
    reviews: 623
  },
  {
    id: 4,
    name: 'Premium Denim Jacket',
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    image: '/api/placeholder/300/400',
    badge: 'EXCLUSIVE',
    rating: 4.9,
    reviews: 432
  }
];

const categories = [
  {
    name: 'T-Shirts',
    image: '/api/placeholder/200/250',
    count: '2500+ styles',
    href: '/collections/t-shirts'
  },
  {
    name: 'Hoodies',
    image: '/api/placeholder/200/250',
    count: '800+ styles',
    href: '/collections/hoodies'
  },
  {
    name: 'Shirts',
    image: '/api/placeholder/200/250',
    count: '1200+ styles',
    href: '/collections/shirts'
  },
  {
    name: 'Pants',
    image: '/api/placeholder/200/250',
    count: '900+ styles',
    href: '/collections/pants'
  },
  {
    name: 'Jackets',
    image: '/api/placeholder/200/250',
    count: '600+ styles',
    href: '/collections/jackets'
  },
  {
    name: 'Accessories',
    image: '/api/placeholder/200/250',
    count: '400+ styles',
    href: '/collections/accessories'
  }
];

const trendingBrands = [
  'FASHUN Originals',
  'Street Culture',
  'Urban Vibes',
  'Next Gen',
  'Bold Graphics'
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Hero Section with Sale Banner */}
      <section className="relative overflow-hidden">
        {/* Sale Banner */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-center py-2 text-sm font-medium">
          🔥 MEGA SALE: Up to 70% OFF + Extra 10% on ₹1999+ | Use Code: MEGA10 🔥
        </div>

        {/* Main Hero */}
        <div className="relative min-h-[80vh] flex items-center">
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-r from-black via-black/50 to-transparent z-10 absolute"></div>
            <div className="w-full h-full bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30"></div>
          </div>
          
          <div className="relative z-20 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2 text-purple-400">
                <SparklesIcon className="w-5 h-5" />
                <span className="text-sm font-medium">TRENDING NOW</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  STREET
                </span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  FASHION
                </span>
                <span className="block text-white text-3xl md:text-4xl font-bold mt-2">
                  REVOLUTION
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-lg">
                Discover India's hottest streetwear collection. From oversized hoodies to graphic tees - express your style, your way.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/collections">
                  <EnhancedButton 
                    variant="primary" 
                    size="lg" 
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
                  >
                    Shop Now
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </EnhancedButton>
                </Link>
                <Link href="/collections/new-arrivals">
                  <EnhancedButton 
                    variant="secondary" 
                    size="lg" 
                    className="px-8 py-4 border-2 border-white/20 hover:border-purple-400 text-white"
                  >
                    New Arrivals
                  </EnhancedButton>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex space-x-8 pt-4">
                <div>
                  <div className="text-2xl font-bold text-purple-400">50K+</div>
                  <div className="text-sm text-gray-400">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-400">5000+</div>
                  <div className="text-sm text-gray-400">Products</div>
                </div>
                <div>
                  <div className="flex items-center text-2xl font-bold text-yellow-400">
                    4.8 <StarIcon className="w-5 h-5 ml-1 fill-yellow-400" />
                  </div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Featured Product */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8 overflow-hidden">
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  30% OFF
                </div>
                <div className="aspect-[3/4] bg-gray-800 rounded-2xl mb-6 flex items-center justify-center">
                  <div className="text-gray-500 text-8xl">👕</div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Urban Streetwear Hoodie</h3>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-purple-400">₹2,499</span>
                    <span className="text-lg text-gray-400 line-through">₹3,499</span>
                  </div>
                  <Link href="/products/1">
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
                      Buy Now
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-300">
              Find your perfect style from our trending collections
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={category.href} className="group block">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                    <div className="aspect-[4/5] bg-gray-800 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                      <div className="text-gray-500 text-4xl">👔</div>
                    </div>
                    <h3 className="font-bold text-center mb-1 group-hover:text-purple-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-400 text-center">
                      {category.count}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Trending Now
              </h2>
              <p className="text-xl text-gray-300">
                Most loved styles by our customers
              </p>
            </div>
            <Link href="/collections" className="hidden md:flex items-center text-purple-400 hover:text-purple-300 transition-colors font-medium">
              View All <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/products/${product.id}`} className="group block">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                    {/* Product Image */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <div className="text-gray-500 text-6xl">👕</div>
                      </div>
                      
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          product.badge === 'BESTSELLER' ? 'bg-green-500 text-white' :
                          product.badge === 'NEW' ? 'bg-blue-500 text-white' :
                          product.badge === 'TRENDING' ? 'bg-red-500 text-white' :
                          'bg-purple-500 text-white'
                        }`}>
                          {product.badge}
                        </span>
                      </div>

                      {/* Discount */}
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.discount}% OFF
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                          ♡
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center text-yellow-400 mr-2">
                          <StarIcon className="w-4 h-4 fill-yellow-400" />
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-white">₹{product.price}</span>
                          <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                        </div>
                        
                        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <FireIcon className="w-8 h-8 text-yellow-400 mr-2" />
                <span className="text-2xl font-bold text-yellow-400">HOT DEALS</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-4 text-white">
                FLAT 50% OFF
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                On selected streetwear collection. Limited time offer!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/collections/sale">
                  <button className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors">
                    Shop Sale Items
                  </button>
                </Link>
                <Link href="/collections">
                  <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-purple-600 transition-colors">
                    View All Collections
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-400">On orders above ₹999</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-2xl">↩️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-400">15-day hassle-free returns</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-400">100% authentic products</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Delivery</h3>
              <p className="text-gray-400">2-3 days across India</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Personalized Sections */}
      <PersonalizedSections userId="demo-user" />

      {/* Trending Outfits */}
      <TrendingOutfits />

      {/* Style Assistant Button */}
      <StyleAssistantButton />
    </div>
  );
}