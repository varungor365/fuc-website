'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, FireIcon, SparklesIcon, ChartBarIcon as TrendingUpIcon } from '@heroicons/react/24/outline'
import { categories } from '@/data/products'

export default function CollectionsPage() {
  // Collection images mapping
  const collectionImages = {
    hoodies: '/images/products/hoodies/hoodie-1-main.jpg',
    't-shirts': '/images/products/t-shirts/tshirt-1-main.jpg',
    jackets: '/images/products/jackets/jacket-1-main.jpg',
    accessories: '/images/products/accessories/cap-1-main.jpg',
    streetwear: '/images/products/hoodies/hoodie-2-main.jpg',
    premium: '/images/products/t-shirts/tshirt-2-main.jpg'
  };

  // Transform categories data for display
  const collections = Object.entries(categories).map(([key, category], index) => ({
    slug: key,
    name: category.name,
    description: category.description,
    image: collectionImages[key as keyof typeof collectionImages] || '/images/products/hoodies/hoodie-1-main.jpg',
    productCount: Math.floor(Math.random() * 50) + 20, // Mock product count
    trending: index < 3, // First 3 are trending
    new: index < 2, // First 2 are new
    colors: ['bg-gradient-to-br from-purple-500 to-pink-500', 'bg-gradient-to-br from-blue-500 to-cyan-500', 'bg-gradient-to-br from-green-500 to-emerald-500', 'bg-gradient-to-br from-orange-500 to-red-500', 'bg-gradient-to-br from-indigo-500 to-purple-500', 'bg-gradient-to-br from-pink-500 to-rose-500']
  }))

  const featuredCollections = collections.filter(c => c.trending).slice(0, 3)
  const regularCollections = collections.filter(c => !c.trending)

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SparklesIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Shop by
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Collection
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated collections of streetwear essentials. 
              From trending styles to timeless classics, find your perfect look.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-2 text-sm text-primary-400 mb-12"
        >
          <Link href="/" className="hover:text-accent-400 transition-colors">
            Home
          </Link>
          <ArrowRightIcon className="w-4 h-4" />
          <span className="text-white">Collections</span>
        </motion.nav>

        {/* Featured Collections */}
        {featuredCollections.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <FireIcon className="w-6 h-6 text-accent-400" />
              <h2 className="text-2xl font-bold text-white">Trending Collections</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featuredCollections.map((collection, index) => (
                <motion.div
                  key={collection.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-primary-900/30 backdrop-blur-sm border border-white/10 hover:border-accent-400/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                      {/* Image */}
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <div className={`absolute inset-0 ${collection.colors[index % collection.colors.length]} opacity-20`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent" />
                        
                        {/* Badge */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-accent-500 text-primary-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <TrendingUpIcon className="w-3 h-3" />
                            Trending
                          </span>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-400 transition-colors">
                            {collection.name}
                          </h3>
                          <p className="text-primary-200 text-sm mb-4 line-clamp-2">
                            {collection.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-primary-300 text-sm">
                              {collection.productCount} products
                            </span>
                            <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 group-hover:bg-accent-500 transition-all">
                              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* All Collections */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white mb-8">All Collections</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularCollections.map((collection, index) => (
              <motion.div
                key={collection.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/collections/${collection.slug}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-primary-900/30 backdrop-blur-sm border border-white/10 hover:border-accent-400/30 transition-all duration-300 group-hover:scale-105">
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <div className={`absolute inset-0 ${collection.colors[index % collection.colors.length]} opacity-15`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent" />
                      
                      {/* Badges */}
                      {collection.new && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            New
                          </span>
                        </div>
                      )}

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-accent-400 transition-colors">
                          {collection.name}
                        </h3>
                        <p className="text-primary-300 text-sm mb-3 line-clamp-2">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-400 text-xs">
                            {collection.productCount} items
                          </span>
                          <ArrowRightIcon className="w-4 h-4 text-accent-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-12">
            <SparklesIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-primary-200 max-w-2xl mx-auto mb-8">
              Explore our entire catalog or use our AI-powered search to discover 
              products that match your unique style and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="btn btn-glass"
              >
                Browse All Products
              </Link>
              <Link
                href="/search"
                className="btn btn-outline"
              >
                AI-Powered Search
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  )
}
