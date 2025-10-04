'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Trending Products - AI Curated selection inspired by Prestige, Basel themes
export default function TrendingProducts() {
  const trendingProducts = [
    {
      id: 1,
      name: 'AI Curated Urban Flex Hoodie',
      price: 2799,
      originalPrice: 3599,
      image: '/images/mock/products/hoodies/trending-hoodie.jpg',
      hoverImage: '/images/mock/products/hoodies/trending-hoodie-2.jpg',
      badge: 'AI Pick',
      trendScore: 98,
      weeklyViews: 1247,
      addedToCart: 89,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['#1A1A1A', '#FF6B6B', '#4ECDC4', '#FFE66D'],
      slug: 'ai-curated-urban-flex-hoodie'
    },
    {
      id: 2,
      name: 'Smart Tech Cargo Shorts',
      price: 1899,
      originalPrice: 2399,
      image: '/images/mock/products/shorts/tech-cargo.jpg',
      hoverImage: '/images/mock/products/shorts/tech-cargo-2.jpg',
      badge: 'Viral',
      trendScore: 95,
      weeklyViews: 2156,
      addedToCart: 142,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#2C3E50', '#95A5A6', '#E74C3C'],
      slug: 'smart-tech-cargo-shorts'
    },
    {
      id: 3,
      name: 'Neo Street Jacket',
      price: 4499,
      originalPrice: 5999,
      image: '/images/mock/products/jackets/neo-street.jpg',
      hoverImage: '/images/mock/products/jackets/neo-street-2.jpg',
      badge: 'Hot',
      trendScore: 92,
      weeklyViews: 987,
      addedToCart: 67,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['#000000', '#8E44AD', '#3498DB'],
      slug: 'neo-street-jacket'
    },
    {
      id: 4,
      name: 'Minimalist Daily Tee',
      price: 999,
      originalPrice: 1299,
      image: '/images/mock/products/tshirts/minimalist-tee.jpg',
      hoverImage: '/images/mock/products/tshirts/minimalist-tee-2.jpg',
      badge: 'Rising',
      trendScore: 88,
      weeklyViews: 3421,
      addedToCart: 198,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['#FFFFFF', '#000000', '#F39C12', '#27AE60'],
      slug: 'minimalist-daily-tee'
    },
    {
      id: 5,
      name: 'Future Denim Jeans',
      price: 3299,
      originalPrice: 4199,
      image: '/images/mock/products/jeans/future-denim.jpg',
      hoverImage: '/images/mock/products/jeans/future-denim-2.jpg',
      badge: 'Trending',
      trendScore: 90,
      weeklyViews: 1678,
      addedToCart: 112,
      sizes: ['28', '30', '32', '34', '36', '38'],
      colors: ['#34495E', '#2C3E50', '#5D6D7E'],
      slug: 'future-denim-jeans'
    },
    {
      id: 6,
      name: 'Cyber Punk Sneakers',
      price: 5999,
      originalPrice: 7999,
      image: '/images/mock/products/shoes/cyber-sneakers.jpg',
      hoverImage: '/images/mock/products/shoes/cyber-sneakers-2.jpg',
      badge: 'Limited',
      trendScore: 96,
      weeklyViews: 2834,
      addedToCart: 156,
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['#E74C3C', '#F39C12', '#9B59B6'],
      slug: 'cyber-punk-sneakers'
    }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'AI Pick': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Viral': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'Hot': return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'Rising': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Trending': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'Limited': return 'bg-gradient-to-r from-gray-800 to-gray-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full mb-6 shadow-lg">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Smart Insights Curated</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Trending Now
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Intelligent Insights analyze customer behavior, social buzz, and style forecasts to bring you the hottest streetwear pieces
          </p>
          
          {/* Live Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span>Live tracking active</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Updated hourly</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
              </svg>
              <span>Global trend analysis</span>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {trendingProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-1 border border-gray-100">
                  {/* Trend Score Indicator */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-gray-800">{product.trendScore}% trend</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Image Container */}
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Hover Image */}
                    <img
                      src={product.hoverImage}
                      alt={`${product.name} alternate view`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Badge */}
                    <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg ${getBadgeColor(product.badge)}`}>
                      {product.badge}
                    </div>

                    {/* Quick Stats Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="grid grid-cols-2 gap-4 text-white text-sm">
                        <div>
                          <div className="font-semibold">{product.weeklyViews.toLocaleString()}</div>
                          <div className="text-gray-300 text-xs">Views this week</div>
                        </div>
                        <div>
                          <div className="font-semibold">{product.addedToCart}</div>
                          <div className="text-gray-300 text-xs">Added to cart</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white/95 hover:bg-white text-gray-900 font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Colors & Sizes */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {product.colors.slice(0, 3).map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-6 h-6 rounded-full border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition-all duration-200 hover:scale-110"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        {product.colors.length > 3 && (
                          <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.sizes.length} sizes
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      {product.originalPrice > product.price && (
                        <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-30 translate-y-30"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Want more trending picks?
              </h3>
              <p className="text-xl mb-8 text-purple-100">
                Get personalized recommendations based on your style preferences
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/collections/trending"
                  className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Explore All Trending
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <button className="inline-flex items-center px-8 py-4 bg-purple-500/30 text-white font-bold rounded-full border-2 border-white/30 hover:bg-purple-500/50 transform hover:scale-105 transition-all duration-300">
                  <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Get My Picks
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}