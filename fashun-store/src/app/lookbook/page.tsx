'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  PhotoIcon,
  HeartIcon,
  ShareIcon,
  TagIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export default function LookbookPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLook, setSelectedLook] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: 'All Looks', count: 24 },
    { id: 'street', label: 'Street Style', count: 12 },
    { id: 'casual', label: 'Casual', count: 8 },
    { id: 'premium', label: 'Premium', count: 4 }
  ]

  const looks = [
    {
      id: 'look-1',
      title: 'Urban Explorer',
      category: 'street',
      image: '/images/products/hoodies/hoodie-1-main.jpg',
      tags: ['hoodie', 'streetwear', 'casual'],
      likes: 128,
      views: 1240,
      products: [
        { id: 'prod-1', name: 'Urban Hoodie', price: 2499, image: '/images/products/hoodies/hoodie-1-main.jpg' },
        { id: 'prod-2', name: 'Slim Jeans', price: 1899, image: '/images/products/pants/jeans-1-main.jpg' }
      ]
    },
    {
      id: 'look-2',
      title: 'Minimalist Vibe',
      category: 'casual',
      image: '/images/products/t-shirts/tshirt-1-main.jpg',
      tags: ['tshirt', 'minimal', 'clean'],
      likes: 95,
      views: 890,
      products: [
        { id: 'prod-3', name: 'Essential Tee', price: 1299, image: '/images/products/t-shirts/tshirt-1-main.jpg' }
      ]
    },
    {
      id: 'look-3',
      title: 'Premium Street',
      category: 'premium',
      image: '/images/products/hoodies/hoodie-2-main.jpg',
      tags: ['premium', 'luxury', 'exclusive'],
      likes: 203,
      views: 2150,
      products: [
        { id: 'prod-4', name: 'Premium Hoodie', price: 3999, image: '/images/products/hoodies/hoodie-2-main.jpg' }
      ]
    },
    {
      id: 'look-4',
      title: 'Layered Look',
      category: 'street',
      image: '/images/products/t-shirts/tshirt-2-main.jpg',
      tags: ['layering', 'style', 'versatile'],
      likes: 167,
      views: 1580,
      products: [
        { id: 'prod-5', name: 'Graphic Tee', price: 1599, image: '/images/products/t-shirts/tshirt-2-main.jpg' }
      ]
    },
    {
      id: 'look-5',
      title: 'Comfortable Fit',
      category: 'casual',
      image: '/images/products/accessories/cap-1-main.jpg',
      tags: ['comfort', 'relaxed', 'everyday'],
      likes: 84,
      views: 720,
      products: [
        { id: 'prod-6', name: 'Classic Cap', price: 899, image: '/images/products/accessories/cap-1-main.jpg' }
      ]
    },
    {
      id: 'look-6',
      title: 'Sport Luxe',
      category: 'premium',
      image: '/images/products/shoes/sneaker-1-main.jpg',
      tags: ['sport', 'luxury', 'performance'],
      likes: 245,
      views: 2890,
      products: [
        { id: 'prod-7', name: 'Premium Sneakers', price: 5999, image: '/images/products/shoes/sneaker-1-main.jpg' }
      ]
    }
  ]

  const filteredLooks = selectedCategory === 'all' 
    ? looks 
    : looks.filter(look => look.category === selectedCategory)

  const selectedLookData = looks.find(look => look.id === selectedLook)

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        <div className="absolute inset-0 bg-[url('/images/products/hoodies/hoodie-1-main.jpg')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <PhotoIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Style
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Lookbook
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Discover endless styling possibilities with our curated lookbook. 
              Get inspired and shop the complete looks.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-accent-500 text-primary-900'
                    : 'bg-primary-800/30 text-primary-200 hover:bg-primary-700/50 hover:text-white'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Lookbook Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredLooks.map((look, index) => (
            <motion.div
              key={look.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => setSelectedLook(look.id)}
            >
              <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-accent-400/50 transition-all duration-300">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={look.image}
                    alt={look.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Overlay Actions */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
                      <HeartIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
                      <ShareIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="absolute bottom-4 left-4 flex space-x-4 text-white text-sm">
                    <div className="flex items-center space-x-1">
                      <HeartIcon className="w-4 h-4" />
                      <span>{look.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <EyeIcon className="w-4 h-4" />
                      <span>{look.views}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{look.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {look.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-800/50 text-primary-200 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-300 text-sm">
                      {look.products.length} {look.products.length === 1 ? 'item' : 'items'}
                    </span>
                    <button className="text-accent-400 hover:text-accent-300 font-semibold text-sm">
                      View Look →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Look Detail Modal */}
        {selectedLookData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLook(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-primary-900 border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Look Image */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image
                    src={selectedLookData.image}
                    alt={selectedLookData.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Look Details */}
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedLookData.title}</h2>
                      <div className="flex items-center space-x-4 text-primary-300 text-sm">
                        <div className="flex items-center space-x-1">
                          <HeartIcon className="w-4 h-4" />
                          <span>{selectedLookData.likes} likes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <EyeIcon className="w-4 h-4" />
                          <span>{selectedLookData.views} views</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedLook(null)}
                      className="p-2 hover:bg-primary-800/50 rounded-lg transition-colors"
                    >
                      <PlusIcon className="w-6 h-6 text-primary-300 transform rotate-45" />
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedLookData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium flex items-center"
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Products in this look */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Shop This Look</h3>
                    <div className="space-y-4">
                      {selectedLookData.products.map((product) => (
                        <div key={product.id} className="flex items-center space-x-4 p-4 bg-primary-800/30 rounded-xl">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{product.name}</h4>
                            <p className="text-accent-400 font-bold">₹{product.price}</p>
                          </div>
                          <Link
                            href={`/products/${product.id}`}
                            className="btn btn-glass btn-sm"
                          >
                            View Product
                          </Link>
                        </div>
                      ))}
                    </div>

                    {/* Total Price */}
                    <div className="mt-6 p-4 bg-accent-500/10 border border-accent-400/30 rounded-xl">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white font-semibold">Complete Look</span>
                        <span className="text-accent-400 font-bold text-xl">
                          ₹{selectedLookData.products.reduce((total, product) => total + product.price, 0)}
                        </span>
                      </div>
                      <button className="w-full btn btn-glass">
                        Add Complete Look to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Style Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Style Your Way</h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Get personalized styling tips and create your own looks with our AI style assistant. 
            Share your creations with the community and inspire others.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/designer" className="btn btn-glass btn-lg">
              AI Style Assistant
            </Link>
            <button className="btn btn-ghost btn-lg text-white border-white/30 hover:bg-white/10">
              Upload Your Look
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}