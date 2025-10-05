'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  SparklesIcon,
  PhotoIcon,
  SwatchIcon,
  CubeIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  color?: string
  brand?: string
}

interface AIOutfitBuilderProps {
  isOpen: boolean
  onClose: () => void
  onOutfitGenerated?: (products: Product[]) => void
  baseProduct?: Product
  userPreferences?: {
    style: string
    colors: string[]
    budget: number
    occasions: string[]
  }
}

const AIOutfitBuilder: React.FC<AIOutfitBuilderProps> = ({
  isOpen,
  onClose,
  onOutfitGenerated,
  baseProduct,
  userPreferences
}) => {
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedOccasion, setSelectedOccasion] = useState('')
  const [colorPreference, setColorPreference] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedOutfit, setGeneratedOutfit] = useState<Product[]>([])

  const styles = [
    { id: 'streetwear', name: 'Streetwear', icon: '🏙️' },
    { id: 'casual', name: 'Casual', icon: '👕' },
    { id: 'formal', name: 'Formal', icon: '👔' },
    { id: 'sporty', name: 'Sporty', icon: '🏃' },
    { id: 'vintage', name: 'Vintage', icon: '📻' },
    { id: 'minimalist', name: 'Minimalist', icon: '⚪' }
  ]

  const occasions = [
    { id: 'daily', name: 'Daily Wear' },
    { id: 'party', name: 'Party' },
    { id: 'work', name: 'Work' },
    { id: 'date', name: 'Date Night' },
    { id: 'travel', name: 'Travel' },
    { id: 'gym', name: 'Gym' }
  ]

  const colors = [
    { id: 'black', name: 'Black', value: '#000000' },
    { id: 'white', name: 'White', value: '#ffffff' },
    { id: 'navy', name: 'Navy', value: '#1e293b' },
    { id: 'gray', name: 'Gray', value: '#6b7280' },
    { id: 'blue', name: 'Blue', value: '#3b82f6' },
    { id: 'green', name: 'Green', value: '#10b981' }
  ]

  const handleGenerateOutfit = async () => {
    if (!selectedStyle || !selectedOccasion) return

    setIsGenerating(true)
    
    // Simulate AI outfit generation
    setTimeout(() => {
      const mockOutfit: Product[] = [
        {
          id: '1',
          name: 'Urban Streetwear Hoodie',
          price: 2999,
          image: '/images/products/hoodies/hoodie-1-main.jpg',
          category: 'Hoodies',
          color: colorPreference || 'black',
          brand: 'FASHUN'
        },
        {
          id: '2',
          name: 'Cargo Pants',
          price: 2499,
          image: '/images/products/pants/pants-1.jpg',
          category: 'Pants',
          color: colorPreference || 'black',
          brand: 'FASHUN'
        },
        {
          id: '3',
          name: 'High-Top Sneakers',
          price: 4999,
          image: '/images/products/shoes/shoes-1.jpg',
          category: 'Shoes',
          color: colorPreference || 'black',
          brand: 'FASHUN'
        }
      ]
      
      setGeneratedOutfit(mockOutfit)
      setIsGenerating(false)
      onOutfitGenerated?.(mockOutfit)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-primary-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">AI Outfit Builder</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {!generatedOutfit.length ? (
          <div className="space-y-6">
            {/* Style Selection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Choose Your Style</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedStyle === style.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <div className="text-white font-medium">{style.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion Selection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Select Occasion</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {occasions.map((occasion) => (
                  <button
                    key={occasion.id}
                    onClick={() => setSelectedOccasion(occasion.id)}
                    className={`p-3 rounded-xl border transition-all ${
                      selectedOccasion === occasion.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="text-white font-medium">{occasion.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Preference */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Color Preference</h3>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setColorPreference(color.id)}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      colorPreference === color.id
                        ? 'border-purple-500 scale-110'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerateOutfit}
              disabled={!selectedStyle || !selectedOccasion || isGenerating}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Your Perfect Outfit...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <SparklesIcon className="w-5 h-5" />
                  Generate AI Outfit
                </div>
              )}
            </motion.button>
          </div>
        ) : (
          /* Generated Outfit Display */
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Your Perfect Outfit</h3>
              <p className="text-primary-200">Curated just for you by AI</p>
            </div>

            <div className="grid gap-4">
              {generatedOutfit.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                    <CubeIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{item.name}</h4>
                    <p className="text-primary-200">{item.category}</p>
                    <p className="text-purple-400 font-medium">₹{item.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setGeneratedOutfit([])}
                className="flex-1 py-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white hover:opacity-90 transition-opacity"
              >
                Save Outfit
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AIOutfitBuilder