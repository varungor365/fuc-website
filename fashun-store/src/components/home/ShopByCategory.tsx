'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Shop by Category - Large tiles inspired by Shopify Plus themes
export default function ShopByCategory() {
  const categories = [
    {
      id: 1,
      name: 'Streetwear Essentials',
      description: 'Core pieces every wardrobe needs',
      image: '/images/mock/categories/streetwear-essentials.jpg',
      hoverImage: '/images/mock/categories/streetwear-essentials-hover.jpg',
      productCount: 127,
      trending: true,
      colors: ['from-gray-900', 'to-black'],
      textColor: 'text-white',
      slug: 'streetwear-essentials',
      icon: '🔥',
      position: 'large' // Takes 2 columns
    },
    {
      id: 2,
      name: 'Premium Hoodies',
      description: 'Luxury comfort redefined',
      image: '/images/mock/categories/premium-hoodies.jpg',
      hoverImage: '/images/mock/categories/premium-hoodies-hover.jpg',
      productCount: 89,
      trending: false,
      colors: ['from-purple-600', 'to-pink-600'],
      textColor: 'text-white',
      slug: 'premium-hoodies',
      icon: '👑',
      position: 'medium'
    },
    {
      id: 3,
      name: 'Tech Wear',
      description: 'Future-forward functional fashion',
      image: '/images/mock/categories/tech-wear.jpg',
      hoverImage: '/images/mock/categories/tech-wear-hover.jpg',
      productCount: 64,
      trending: true,
      colors: ['from-blue-600', 'to-cyan-500'],
      textColor: 'text-white',
      slug: 'tech-wear',
      icon: '⚡',
      position: 'medium'
    },
    {
      id: 4,
      name: 'Minimalist Collection',
      description: 'Clean lines, maximum impact',
      image: '/images/mock/categories/minimalist.jpg',
      hoverImage: '/images/mock/categories/minimalist-hover.jpg',
      productCount: 45,
      trending: false,
      colors: ['from-gray-100', 'to-white'],
      textColor: 'text-gray-900',
      slug: 'minimalist-collection',
      icon: '✨',
      position: 'small'
    },
    {
      id: 5,
      name: 'Urban Accessories',
      description: 'Complete your street look',
      image: '/images/mock/categories/accessories.jpg',
      hoverImage: '/images/mock/categories/accessories-hover.jpg',
      productCount: 156,
      trending: true,
      colors: ['from-green-600', 'to-emerald-500'],
      textColor: 'text-white',
      slug: 'urban-accessories',
      icon: '🎯',
      position: 'small'
    },
    {
      id: 6,
      name: 'Limited Drops',
      description: 'Exclusive releases',
      image: '/images/mock/categories/limited-drops.jpg',
      hoverImage: '/images/mock/categories/limited-drops-hover.jpg',
      productCount: 23,
      trending: true,
      colors: ['from-red-600', 'to-orange-500'],
      textColor: 'text-white',
      slug: 'limited-drops',
      icon: '🚀',
      position: 'small'
    }
  ];

  const getCategoryGridClass = (position: string, index: number) => {
    if (position === 'large') return 'md:col-span-2 md:row-span-2';
    if (position === 'medium') return 'md:col-span-1 md:row-span-2';
    return 'col-span-1 row-span-1';
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full mb-6">
            <span className="font-semibold">Curated Collections</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Shop by Style
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our carefully curated categories, each designed to elevate your streetwear game
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px] mb-16">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl ${getCategoryGridClass(category.position, index)}`}
            >
              <Link href={`/collections/${category.slug}`}>
                <div className="relative w-full h-full">
                  {/* Background Images */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <img
                    src={category.hoverImage}
                    alt={`${category.name} hover`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.colors[0]} ${category.colors[1]} opacity-60 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <div className={`${category.textColor} transition-all duration-300 group-hover:transform group-hover:-translate-y-2`}>
                      {/* Trending Badge */}
                      {category.trending && (
                        <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-4">
                          <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></div>
                          Trending
                        </div>
                      )}
                      
                      {/* Category Icon */}
                      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      
                      {/* Category Name */}
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-shadow-lg">
                        {category.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm md:text-base opacity-90 mb-4 group-hover:opacity-100 transition-opacity">
                        {category.description}
                      </p>
                      
                      {/* Product Count */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-75">
                          {category.productCount} products
                        </span>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm font-semibold mr-2">Explore</span>
                          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effects */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Subtle sparkle effect */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping animation-delay-1000"></div>
                    <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-ping animation-delay-2000"></div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-gray-600">Unique Products</div>
            <div className="text-sm text-gray-500 mt-2">Across all categories</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">New Arrivals</div>
            <div className="text-sm text-gray-500 mt-2">Fresh drops weekly</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-gray-600">Authentic</div>
            <div className="text-sm text-gray-500 mt-2">Verified streetwear</div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-16"
        >
          <Link
            href="/collections/all"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold text-lg rounded-full hover:from-gray-800 hover:to-gray-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Browse All Collections
            <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </section>
  );
}