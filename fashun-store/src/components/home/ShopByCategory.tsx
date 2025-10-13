'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Category data for the shop by category section
const categories = [
  {
    id: 'hoodies',
    name: 'Hoodies',
    slug: 'hoodies',
    description: 'Premium streetwear hoodies',
    image: '/api/placeholder/400/500',
    productCount: 24,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 't-shirts',
    name: 'T-Shirts',
    slug: 't-shirts', 
    description: 'Trendy graphic tees',
    image: '/api/placeholder/400/500',
    productCount: 36,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'jackets',
    name: 'Jackets',
    slug: 'jackets',
    description: 'Urban outerwear collection',
    image: '/api/placeholder/400/500', 
    productCount: 18,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'pants',
    name: 'Pants',
    slug: 'pants',
    description: 'Comfortable streetwear pants',
    image: '/api/placeholder/400/500',
    productCount: 22,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'shoes',
    name: 'Shoes',
    slug: 'shoes', 
    description: 'Street-ready footwear',
    image: '/api/placeholder/400/500',
    productCount: 15,
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Complete your look',
    image: '/api/placeholder/400/500',
    productCount: 28,
    gradient: 'from-pink-500 to-rose-500'
  }
];

const ShopByCategory = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-900/50 to-primary-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Shop by
            <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-xl text-primary-200 max-w-3xl mx-auto">
            Discover our curated collections of premium streetwear essentials
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/collections/${category.slug}`}>
                <div className="group relative overflow-hidden rounded-3xl bg-primary-900/30 backdrop-blur-sm border border-white/10 hover:border-accent-400/50 transition-all duration-500 hover:scale-105">
                  {/* Background Image */}
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  {/* Category Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-primary-200 text-sm mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-300 text-sm">
                        {category.productCount} items
                      </span>
                      <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 group-hover:bg-accent-500 transition-all">
                        <svg 
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Elements */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Categories Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-primary-900 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent-500/25"
          >
            View All Categories
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopByCategory;