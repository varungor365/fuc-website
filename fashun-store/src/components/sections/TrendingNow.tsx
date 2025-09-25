'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const trendingProducts = [
  {
    id: 1,
    name: 'Urban Explorer Hoodie',
    price: 2499,
    originalPrice: 3199,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center',
    badge: 'New',
    badgeColor: 'bg-green-500'
  },
  {
    id: 2,
    name: 'Minimalist Graphic Tee',
    price: 1299,
    originalPrice: 1699,
    image: '/api/placeholder/400/500',
    badge: '',
    badgeColor: ''
  },
  {
    id: 3,
    name: 'Oversized Street Polo',
    price: 1899,
    originalPrice: 2299,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&crop=center',
    badge: 'Bestseller',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 4,
    name: 'Custom Design Hoodie',
    price: 2799,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&crop=center',
    badge: 'Customizable',
    badgeColor: 'bg-purple-500'
  }
]

export function TrendingNow() {
  return (
    <section className="py-20 bg-primary-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-white mb-4">
            Trending Now
          </h2>
          <p className="text-lg text-primary-300 max-w-2xl mx-auto">
            The most popular pieces from our latest collection
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                {/* Product Image */}
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium ${product.badgeColor}`}>
                      {product.badge}
                    </div>
                  )}

                  {/* Quick Add Button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                      Quick Add
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-montserrat text-lg font-bold text-white mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-green-400">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link href="/collections/all">
            <button className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}