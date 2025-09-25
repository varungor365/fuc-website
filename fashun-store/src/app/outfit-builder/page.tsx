'use client'

import React from 'react'
import { motion } from 'framer-motion'
import AIOutfitBuilder from '@/components/ai/AIOutfitBuilder'
import TrendingOutfits from '@/components/ai/TrendingOutfits'
import { 
  SparklesIcon,
  SwatchIcon,
  CubeIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export default function OutfitBuilderPage() {
  return (
    <div className="min-h-screen bg-primary-950 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center bg-accent-500/20 rounded-full px-6 py-3 mb-6"
            >
              <SparklesIcon className="w-5 h-5 text-accent-400 mr-2" />
              <span className="text-accent-400 font-medium">Powered by AI</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-hero text-4xl lg:text-5xl text-white mb-6"
            >
              Design Assistant
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-lg max-w-2xl mx-auto mb-8"
            >
              Create stunning outfits with the help of artificial intelligence. 
              Mix, match, and discover new style combinations that perfectly suit your vibe.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center glass-card p-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mb-6">
              <SwatchIcon className="w-8 h-8 text-accent-400" />
            </div>
            <h3 className="font-heading text-white text-xl font-semibold mb-4">
              Smart Color Matching
            </h3>
            <p className="text-white/70">
              Our AI understands color theory and suggests combinations that work perfectly together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center glass-card p-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mb-6">
              <CubeIcon className="w-8 h-8 text-accent-400" />
            </div>
            <h3 className="font-heading text-white text-xl font-semibold mb-4">
              Style Coordination
            </h3>
            <p className="text-white/70">
              Get outfit suggestions based on current trends, weather, and occasions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center glass-card p-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mb-6">
              <HeartIcon className="w-8 h-8 text-accent-400" />
            </div>
            <h3 className="font-heading text-white text-xl font-semibold mb-4">
              Personal Preferences
            </h3>
            <p className="text-white/70">
              The more you use it, the better it gets at understanding your unique style.
            </p>
          </motion.div>
        </div>

        {/* Main Outfit Builder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="glass-card p-8 text-center">
            <h2 className="font-hero text-3xl text-white mb-6">
              Launch Design Assistant
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Our AI-powered outfit builder will help you create the perfect look for any occasion.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
              onClick={() => {
                // This would open the AIOutfitBuilder modal
                alert('AI Outfit Builder would open here!')
              }}
            >
              <SparklesIcon className="mr-2 w-6 h-6" />
              Start Creating
            </motion.button>
          </div>
        </motion.div>

        {/* Trending Outfits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <TrendingOutfits />
        </motion.div>
      </div>
    </div>
  )
}