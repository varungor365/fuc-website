'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRightIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  SparklesIcon,
  CubeIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import PersonalizedSections from '@/components/ai/PersonalizedSections'
import RecommendationEngine from '@/components/ai/RecommendationEngine'
import StyleAssistantButton from '@/components/ai/StyleAssistantButton'
import OutfitBuilderButton from '@/components/ai/OutfitBuilderButton'

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-hero text-5xl md:text-7xl lg:text-8xl text-white mb-6">
            REDEFINE
            <br />
            <span className="text-accent-400">STREETWEAR</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto font-light">
            Where premium design meets street culture. Every piece crafted to tell your story.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/collections/new-arrivals" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                Shop New Arrivals
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <OutfitBuilderButton 
                variant="secondary"
                className="text-lg px-8 py-4 inline-flex items-center"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}

// Featured Products Component
const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Urban Legends Hoodie",
      price: 89,
      originalPrice: 120,
      image: "/api/placeholder/400/500",
      badge: "Best Seller",
      rating: 4.8,
      reviews: 324
    },
    {
      id: 2,
      name: "Street Dreams Tee",
      price: 45,
      image: "/api/placeholder/400/500",
      badge: "New",
      rating: 4.9,
      reviews: 156
    },
    {
      id: 3,
      name: "Midnight Polo",
      price: 65,
      image: "/api/placeholder/400/500",
      rating: 4.7,
      reviews: 89
    },
    {
      id: 4,
      name: "Future Classic Hoodie",
      price: 95,
      image: "/api/placeholder/400/500",
      badge: "Limited",
      rating: 5.0,
      reviews: 45
    }
  ]

  return (
    <section className="py-24 bg-primary-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-hero text-4xl lg:text-5xl text-white mb-6"
          >
            Featured Drops
          </motion.h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover our most coveted pieces, crafted for those who dare to stand out.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
                {/* Product Image */}
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <div className="aspect-[4/5] bg-gradient-to-br from-accent-500/20 to-accent-600/20 flex items-center justify-center">
                    <div className="text-white/40 text-6xl font-hero">F</div>
                  </div>
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.badge === 'New' ? 'bg-green-500 text-white' :
                      product.badge === 'Best Seller' ? 'bg-accent-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {product.badge}
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <HeartIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                {/* Product Info */}
                <div>
                  <h3 className="font-heading text-white text-lg font-semibold mb-2">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIconSolid 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400' 
                              : 'text-gray-600'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-white/60 text-sm ml-2">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold text-xl">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-white/50 line-through text-sm">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/collections/all" className="btn-secondary px-8 py-4 inline-flex items-center">
            View All Products
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Trust Indicators Component
const TrustIndicators = () => {
  const features = [
    {
      icon: TruckIcon,
      title: "Free Shipping",
      description: "On orders over $75 worldwide"
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Payment",
      description: "256-bit SSL encryption"
    },
    {
      icon: StarIcon,
      title: "Premium Quality",
      description: "Ethically sourced materials"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-accent-500/10 to-accent-600/10 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="font-heading text-white text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-white/70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// AI Features Section
const AIFeaturesSection = () => {
  const aiFeatures = [
    {
      icon: SparklesIcon,
      title: "Smart Recommendations",
      description: "Get personalized product suggestions based on your style",
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: CubeIcon,
      title: "Design Assistant",
      description: "Create complete outfits with our intelligent styling tools",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: StarIcon,
      title: "Perfect Fit",
      description: "AI-powered size recommendations for the ideal fit",
      color: "from-green-500/20 to-emerald-500/20"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-primary-900 to-primary-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-hero text-4xl lg:text-5xl text-white mb-6"
          >
            Intelligent Fashion
          </motion.h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Experience the future of streetwear with our advanced styling technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-8 text-center bg-gradient-to-br ${feature.color}`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mb-6">
                <feature.icon className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="font-heading text-white text-xl font-semibold mb-4">
                {feature.title}
              </h3>
              <p className="text-white/70 mb-6">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main Homepage Component
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PersonalizedSections />
      <FeaturedProducts />
      <AIFeaturesSection />
      <RecommendationEngine 
        title="Recommended For You"
        subtitle="Curated picks based on your style"
        products={[]}
        reason={{ type: 'style_match', text: 'Based on your preferences', icon: SparklesIcon }}
      />
      <TrustIndicators />
      <StyleAssistantButton />
    </div>
  )
}