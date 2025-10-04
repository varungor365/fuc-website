'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  SparklesIcon,
  SwatchIcon
} from '@heroicons/react/24/outline'
import AIOutfitBuilder from './AIOutfitBuilder'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  color: string
  brand: string
}

interface OutfitBuilderButtonProps {
  product?: Product
  variant?: 'primary' | 'secondary' | 'minimal'
  className?: string
}

const OutfitBuilderButton: React.FC<OutfitBuilderButtonProps> = ({
  product,
  variant = 'primary',
  className = ''
}) => {
  const [isOutfitBuilderOpen, setIsOutfitBuilderOpen] = useState(false)

  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
      case 'secondary':
        return 'bg-gray-800 text-white border border-purple-500 hover:bg-purple-500/10'
      case 'minimal':
        return 'bg-transparent text-purple-400 hover:text-purple-300 hover:bg-purple-500/5'
      default:
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
    }
  }

  const getButtonContent = () => {
    if (variant === 'minimal') {
      return (
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-4 h-4" />
          <span className="text-sm">Complete Look</span>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <SwatchIcon className="w-5 h-5" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
          />
        </div>
        <span className="font-medium">
          {product ? 'Build Outfit' : 'AI Outfit Builder'}
        </span>
        <SparklesIcon className="w-4 h-4" />
      </div>
    )
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOutfitBuilderOpen(true)}
        className={`
          px-6 py-3 rounded-xl font-medium transition-all duration-300 
          shadow-lg hover:shadow-xl
          ${getButtonStyles()}
          ${className}
        `}
      >
        {getButtonContent()}
      </motion.button>

      <AIOutfitBuilder
        isOpen={isOutfitBuilderOpen}
        onClose={() => setIsOutfitBuilderOpen(false)}
        baseProduct={product}
        userPreferences={{
          style: 'casual',
          colors: ['black', 'white', 'blue'],
          budget: 10000,
          occasions: ['casual', 'work']
        }}
      />
    </>
  )
}

export default OutfitBuilderButton