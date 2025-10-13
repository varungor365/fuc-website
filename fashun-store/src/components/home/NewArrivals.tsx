'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getImagePath } from '@/lib/imageUtils';

// New Arrivals - Inspired by Empire, Dawn themes
export default function NewArrivals() {
  const newProducts = [
    {
      id: 1,
      name: 'Premium Cotton Oversized Tee',
      price: 1299,
      originalPrice: 1699,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=85',
      hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop&q=85',
      badge: 'New',
      colors: ['#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4'],
      rating: 4.8,
      reviews: 24,
      slug: 'premium-cotton-oversized-tee'
    },
    {
      id: 2,
      name: 'Streetwear Cargo Pants',
      price: 2499,
      originalPrice: 3199,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=85',
      hoverImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop&q=85',
      badge: 'Trending',
      colors: ['#2D3748', '#68D391', '#F6AD55'],
      rating: 4.9,
      reviews: 18,
      slug: 'streetwear-cargo-pants'
    },
    {
      id: 3,
      name: 'Classic Bomber Jacket',
      price: 3999,
      originalPrice: 4999,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop&q=85',
      hoverImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop&q=85',
      badge: 'Sale',
      colors: ['#1A202C', '#2D3748', '#4A5568'],
      rating: 4.7,
      reviews: 32,
      slug: 'classic-bomber-jacket'
    },
    {
      id: 4,
      name: 'Urban Hoodie Collection',
      price: 2199,
      originalPrice: 2799,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop&q=85',
      hoverImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=85',
      badge: 'Limited',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      rating: 4.6,
      reviews: 41,
      slug: 'urban-hoodie-collection'
    }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'New': return 'bg-green-500';
      case 'Sale': return 'bg-red-500';
      case 'Trending': return 'bg-purple-500';
      case 'Limited': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
            <span className="text-sm font-medium text-purple-700">✨ Fresh Drops</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            New Arrivals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Be the first to get your hands on our latest streetwear pieces
          </p>
        </motion.div>

        {/* Products Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2">
                    {/* Product Image */}
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
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${getBadgeColor(product.badge)}`}>
                        {product.badge}
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex flex-col space-y-2">
                          <button 
                            onClick={() => {
                              // Add to wishlist functionality
                              const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                              const productExists = existingWishlist.find((item: any) => item.id === product.id);
                              if (!productExists) {
                                existingWishlist.push(product);
                                localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
                                alert('Added to wishlist!');
                              } else {
                                alert('Already in wishlist!');
                              }
                            }}
                            className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 cursor-pointer"
                          >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => window.location.href = `/products/${product.id}`}
                            className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 cursor-pointer"
                          >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Quick Add to Cart */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => {
                            // Add to cart functionality
                            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
                            const cartItem = {
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              quantity: 1,
                              size: 'M', // Default size
                              color: product.colors?.[0] || 'Default'
                            };
                            existingCart.push(cartItem);
                            localStorage.setItem('cart', JSON.stringify(existingCart));
                            alert('Added to cart!');
                          }}
                          className="w-full bg-white text-gray-900 font-semibold py-3 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                          Quick Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* Colors */}
                      <div className="flex items-center space-x-2 mb-4">
                        {product.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-5 h-5 rounded-full border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition-colors"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">+{product.colors.length} colors</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                        {product.originalPrice > product.price && (
                          <span className="text-sm font-medium text-green-600">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/collections/new-arrivals"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold rounded-full hover:from-gray-800 hover:to-gray-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Shop All New Arrivals
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}