'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const collections = [
  {
    id: 1,
    name: 'Oversized Hoodies',
    description: 'Premium cotton blend hoodies with custom prints',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop&crop=center',
    href: '/collections/hoodies',
    price: 'From ₹2,499',
    featured: true
  },
  {
    id: 2,
    name: 'Graphic Tees',
    description: 'Bold designs on premium comfort fit tees',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&crop=center',
    href: '/collections/tshirts',
    price: 'From ₹1,299',
    featured: true
  },
  {
    id: 3,
    name: 'Polo Collection',
    description: 'Elevated streetwear polos with unique details',
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=800&fit=crop&crop=center',
    href: '/collections/polos',
    price: 'From ₹1,899',
    featured: false
  },
  {
    id: 4,
    name: 'Custom Designs',
    description: 'Create your own unique apparel',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&crop=center',
    href: '/designer',
    price: 'Design Now',
    featured: true
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export function FeaturedCollections() {
  return (
    <section className="py-20 bg-primary-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Featured Collections
          </h2>
          <p className="text-lg text-primary-300 max-w-2xl mx-auto">
            Discover our curated selection of premium streetwear designed for the modern generation
          </p>
        </motion.div>

        {/* Collections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`group relative overflow-hidden rounded-2xl ${
                collection.featured ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              <Link href={collection.href}>
                <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-primary-800">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes={collection.featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <h3 className={`font-display font-bold text-white mb-2 ${
                        collection.featured ? 'text-2xl lg:text-3xl' : 'text-xl'
                      }`}>
                        {collection.name}
                      </h3>
                      <p className={`text-primary-200 mb-4 ${
                        collection.featured ? 'text-base lg:text-lg' : 'text-sm'
                      }`}>
                        {collection.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-accent-400 ${
                          collection.featured ? 'text-lg' : 'text-base'
                        }`}>
                          {collection.price}
                        </span>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="text-white group-hover:text-accent-400 transition-colors"
                        >
                          <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M17 8l4 4m0 0l-4 4m4-4H3" 
                            />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/collections/all">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary px-8 py-4 text-lg font-semibold"
            >
              View All Collections
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
