'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 'hoodies',
    name: 'Hoodies',
    description: 'Premium streetwear hoodies',
    image: '/images/products/hoodies/hoodie-1-main.jpg',
    href: '/collections/hoodies',
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: 't-shirts',
    name: 'T-Shirts',
    description: 'Graphic tees and basics',
    image: '/images/products/t-shirts/tshirt-1-main.jpg',
    href: '/collections/t-shirts',
    color: 'from-pink-500 to-red-500'
  },
  {
    id: 'jackets',
    name: 'Jackets',
    description: 'Bomber jackets and outerwear',
    image: '/images/products/jackets/jacket-1-main.jpg',
    href: '/collections/jackets',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Caps, bags, and more',
    image: '/images/products/accessories/cap-1-main.jpg',
    href: '/collections/accessories',
    color: 'from-yellow-500 to-orange-500'
  }
];

export default function ShopByCategory() {
  return (
    <section className="py-16 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Shop by Category
          </motion.h2>
          <motion.p
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover our curated collections of premium streetwear
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link href={category.href}>
                <div className="relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="aspect-square relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-30 group-hover:opacity-40 transition-opacity`} />
                  </div>
                  
                  <div className="absolute inset-0 flex items-end">
                    <div className="p-6 w-full">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}