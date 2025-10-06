'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getImagePath } from '@/lib/imageUtils';

// Featured Collections - Inspired by Prestige, Empire themes
export default function FeaturedCollections() {
  const collections = [
    {
      id: 1,
      name: 'Premium Streetwear',
      description: 'Urban fashion meets premium quality',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=80',
      productCount: 45,
      slug: 'streetwear',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 2,
      name: 'Essential Basics',
      description: 'Timeless pieces for everyday wear',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=80',
      productCount: 32,
      slug: 'basics',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      id: 3,
      name: 'Limited Edition',
      description: 'Exclusive drops you won\'t find anywhere else',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop&q=80',
      productCount: 18,
      slug: 'limited-edition',
      gradient: 'from-green-600 to-teal-600'
    },
    {
      id: 4,
      name: 'Seasonal Collection',
      description: 'Perfect for the current season',
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop&q=80',
      productCount: 28,
      slug: 'seasonal',
      gradient: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Curated Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked collections designed to elevate your style
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <Link href={`/collections/${collection.slug}`}>
                <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-4">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${collection.image})`
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient} opacity-40 group-hover:opacity-50 transition-opacity duration-300`} />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-white/90 mb-3">
                        {collection.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {collection.productCount} Products
                        </span>
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Hover Effect - Shimmer */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>

                {/* Collection Info */}
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {collection.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Shop Collection →
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Collections Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/collections"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Collections
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}