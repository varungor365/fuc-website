'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const products = [
  {
    id: 1,
    name: 'Urban Explorer Hoodie',
    price: 2499,
    originalPrice: 3199,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center',
    colors: ['black', 'white', 'grey'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Bestseller'
  },
  {
    id: 2,
    name: 'Minimalist Graphic Tee',
    price: 1299,
    originalPrice: 1699,
    image: '/api/placeholder/400/500',
    colors: ['black', 'white', 'navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'New'
  },
  {
    id: 3,
    name: 'Oversized Street Polo',
    price: 1899,
    originalPrice: 2299,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&crop=center',
    colors: ['black', 'white', 'olive'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: null
  },
  {
    id: 4,
    name: 'Custom Design Hoodie',
    price: 2799,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&crop=center',
    colors: ['custom'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Customizable'
  }
]

export function ProductShowcase() {
  return (
    <section className="py-20 bg-primary-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Trending Now
          </h2>
          <p className="text-lg text-primary-300 max-w-2xl mx-auto">
            The most popular pieces from our latest collection
          </p>
        </motion.div>

        <div className="product-grid">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="product-card"
            >
              <div className="relative">
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-accent-500 text-primary-900 text-xs font-semibold rounded">
                    {product.badge}
                  </div>
                )}
                
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="product-image"
                  />
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary-100 mb-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xl font-bold text-accent-500">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-primary-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {product.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className={`w-4 h-4 rounded-full border border-primary-600 ${
                          color === 'black' ? 'bg-black' :
                          color === 'white' ? 'bg-white' :
                          color === 'grey' ? 'bg-gray-500' :
                          color === 'navy' ? 'bg-blue-900' :
                          color === 'olive' ? 'bg-green-700' :
                          'bg-gradient-to-r from-accent-500 to-highlight-500'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    Quick Add
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
