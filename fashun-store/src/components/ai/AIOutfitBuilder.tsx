'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SparklesIcon,
  XMarkIcon,
  HeartIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  SunIcon,
  CloudIcon,
  BoltIcon,
  StarIcon,
  CheckCircleIcon,
  SwatchIcon,
  CpuChipIcon,
  ClockIcon,
  GiftIcon,
  TruckIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  color: string
  brand: string
}

interface OutfitSuggestion {
  id: string
  name: string
  description: string
  occasion: string
  weather: string
  style: string
  confidence: number
  totalPrice: number
  items: Product[]
  styleNotes: string[]
  colorPalette: string[]
}

interface AIOutfitBuilderProps {
  isOpen: boolean
  onClose: () => void
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
  baseProduct,
  userPreferences
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [outfitSuggestions, setOutfitSuggestions] = useState<OutfitSuggestion[]>([])
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitSuggestion | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'casual' | 'work' | 'party' | 'sport'>('casual')
  const [selectedWeather, setSelectedWeather] = useState<'sunny' | 'cloudy' | 'cold' | 'rainy'>('sunny')
  const [budget, setBudget] = useState(5000)

  // Mock product database
  const mockProducts: Product[] = [
    { id: 'h1', name: 'Oversized Graphic Hoodie', price: 2499, image: '/api/placeholder/300/400', category: 'hoodies', color: 'black', brand: 'FUC!' },
    { id: 't1', name: 'Basic Cotton T-Shirt', price: 899, image: '/api/placeholder/300/400', category: 'tshirts', color: 'white', brand: 'FUC!' },
    { id: 'j1', name: 'Distressed Slim Jeans', price: 3499, image: '/api/placeholder/300/400', category: 'jeans', color: 'blue', brand: 'FUC!' },
    { id: 's1', name: 'Classic White Sneakers', price: 4999, image: '/api/placeholder/300/400', category: 'shoes', color: 'white', brand: 'FUC!' },
    { id: 'j2', name: 'Black Leather Jacket', price: 7999, image: '/api/placeholder/300/400', category: 'jackets', color: 'black', brand: 'FUC!' },
    { id: 'p1', name: 'Cotton Chino Pants', price: 2799, image: '/api/placeholder/300/400', category: 'pants', color: 'beige', brand: 'FUC!' },
    { id: 'sh1', name: 'Casual Button Shirt', price: 1999, image: '/api/placeholder/300/400', category: 'shirts', color: 'blue', brand: 'FUC!' },
    { id: 'sw1', name: 'Crew Neck Sweater', price: 3299, image: '/api/placeholder/300/400', category: 'sweaters', color: 'gray', brand: 'FUC!' },
    { id: 's2', name: 'Canvas High-Tops', price: 3999, image: '/api/placeholder/300/400', category: 'shoes', color: 'black', brand: 'FUC!' },
    { id: 'a1', name: 'Classic Denim Jacket', price: 4499, image: '/api/placeholder/300/400', category: 'jackets', color: 'blue', brand: 'FUC!' }
  ]

  useEffect(() => {
    if (isOpen) {
      generateOutfitSuggestions()
    }
  }, [isOpen, activeTab, selectedWeather, budget])

  const generateOutfitSuggestions = async () => {
    setIsLoading(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const suggestions = createOutfitSuggestions()
    setOutfitSuggestions(suggestions)
    setSelectedOutfit(suggestions[0])
    setIsLoading(false)
  }

  const createOutfitSuggestions = (): OutfitSuggestion[] => {
    const outfits: OutfitSuggestion[] = []
    
    // Generate outfits based on occasion and weather
    if (activeTab === 'casual') {
      outfits.push({
        id: 'casual-1',
        name: 'Streetwear Vibes',
        description: 'Perfect for casual hangouts and city exploration',
        occasion: 'casual',
        weather: selectedWeather,
        style: 'streetwear',
        confidence: 94,
        totalPrice: 8997,
        items: [
          mockProducts.find(p => p.id === 'h1')!,
          mockProducts.find(p => p.id === 'j1')!,
          mockProducts.find(p => p.id === 's1')!
        ],
        styleNotes: [
          'Oversized hoodie creates a relaxed silhouette',
          'Distressed jeans add urban edge',
          'White sneakers balance the dark tones'
        ],
        colorPalette: ['#000000', '#2563eb', '#ffffff']
      })

      outfits.push({
        id: 'casual-2',
        name: 'Smart Casual',
        description: 'Elevated casual look for brunch or casual dates',
        occasion: 'casual',
        weather: selectedWeather,
        style: 'smart-casual',
        confidence: 91,
        totalPrice: 8797,
        items: [
          mockProducts.find(p => p.id === 'sh1')!,
          mockProducts.find(p => p.id === 'p1')!,
          mockProducts.find(p => p.id === 's2')!
        ],
        styleNotes: [
          'Button shirt elevates the casual vibe',
          'Chino pants offer comfort with style',
          'Canvas shoes keep it relaxed'
        ],
        colorPalette: ['#2563eb', '#d4a574', '#000000']
      })
    } else if (activeTab === 'work') {
      outfits.push({
        id: 'work-1',
        name: 'Business Casual',
        description: 'Professional yet approachable for office environments',
        occasion: 'work',
        weather: selectedWeather,
        style: 'business-casual',
        confidence: 96,
        totalPrice: 7097,
        items: [
          mockProducts.find(p => p.id === 'sh1')!,
          mockProducts.find(p => p.id === 'p1')!,
          mockProducts.find(p => p.id === 's1')!
        ],
        styleNotes: [
          'Clean button shirt maintains professionalism',
          'Chino pants are office-appropriate',
          'Clean sneakers add modern touch'
        ],
        colorPalette: ['#2563eb', '#d4a574', '#ffffff']
      })
    } else if (activeTab === 'party') {
      outfits.push({
        id: 'party-1',
        name: 'Night Out',
        description: 'Stand out at parties and social events',
        occasion: 'party',
        weather: selectedWeather,
        style: 'party',
        confidence: 89,
        totalPrice: 12498,
        items: [
          mockProducts.find(p => p.id === 'j2')!,
          mockProducts.find(p => p.id === 't1')!,
          mockProducts.find(p => p.id === 's2')!
        ],
        styleNotes: [
          'Leather jacket creates instant cool factor',
          'Classic tee keeps it effortlessly stylish',
          'Black shoes complete the edgy look'
        ],
        colorPalette: ['#000000', '#ffffff', '#000000']
      })
    }

    // Filter by budget
    return outfits.filter(outfit => outfit.totalPrice <= budget)
  }

  const toggleFavorite = (outfitId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(outfitId)) {
        newFavorites.delete(outfitId)
      } else {
        newFavorites.add(outfitId)
      }
      return newFavorites
    })
  }

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny': return <SunIcon className="w-4 h-4" />
      case 'cloudy': return <CloudIcon className="w-4 h-4" />
      case 'cold': return <FireIcon className="w-4 h-4" />
      default: return <SunIcon className="w-4 h-4" />
    }
  }

  const addOutfitToCart = (outfit: OutfitSuggestion) => {
    // Add all items to cart
    console.log('Adding outfit to cart:', outfit.items)
    // In real implementation, this would integrate with cart context
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl">AI Outfit Builder</h3>
                <p className="text-white/80 text-sm">Create perfect looks with AI assistance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex h-[600px]">
            {/* Controls Panel */}
            <div className="w-80 bg-gray-800/50 p-6 border-r border-gray-700">
              <div className="space-y-6">
                {/* Base Product */}
                {baseProduct && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Building Around</h4>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={baseProduct.image}
                        alt={baseProduct.name}
                        width={50}
                        height={60}
                        className="rounded object-cover"
                      />
                      <div>
                        <p className="text-white text-sm font-medium">{baseProduct.name}</p>
                        <p className="text-gray-400 text-xs">₹{baseProduct.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Occasion Tabs */}
                <div>
                  <h4 className="text-white font-medium mb-3">Occasion</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(['casual', 'work', 'party', 'sport'] as const).map((occasion) => (
                      <button
                        key={occasion}
                        onClick={() => setActiveTab(occasion)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          activeTab === occasion
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weather */}
                <div>
                  <h4 className="text-white font-medium mb-3">Weather</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(['sunny', 'cloudy', 'cold', 'rainy'] as const).map((weather) => (
                      <button
                        key={weather}
                        onClick={() => setSelectedWeather(weather)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                          selectedWeather === weather
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {getWeatherIcon(weather)}
                        <span>{weather.charAt(0).toUpperCase() + weather.slice(1)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <h4 className="text-white font-medium mb-3">Budget: ₹{budget.toLocaleString()}</h4>
                  <input
                    type="range"
                    min="2000"
                    max="20000"
                    step="500"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹2k</span>
                    <span>₹20k</span>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateOutfitSuggestions}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <CpuChipIcon className="w-4 h-4" />
                      </motion.div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <BoltIcon className="w-4 h-4" />
                      <span>Generate Outfits</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Outfit Suggestions */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    >
                      <SparklesIcon className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="text-white font-medium">AI is crafting perfect outfits...</p>
                    <p className="text-gray-400 text-sm mt-1">Analyzing style compatibility</p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <h4 className="text-white font-semibold text-lg mb-4">
                    {outfitSuggestions.length} Outfit{outfitSuggestions.length !== 1 ? 's' : ''} Found
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {outfitSuggestions.map((outfit, index) => (
                      <motion.div
                        key={outfit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gray-800/50 rounded-xl p-4 border transition-all cursor-pointer ${
                          selectedOutfit?.id === outfit.id
                            ? 'border-purple-500 bg-purple-900/20'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedOutfit(outfit)}
                      >
                        {/* Outfit Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h5 className="text-white font-medium">{outfit.name}</h5>
                            <p className="text-gray-400 text-sm">{outfit.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(outfit.id)
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              {favorites.has(outfit.id) ? (
                                <HeartSolid className="w-5 h-5 text-red-500" />
                              ) : (
                                <HeartIcon className="w-5 h-5" />
                              )}
                            </button>
                            <span className="text-green-400 text-sm font-medium">
                              {outfit.confidence}% match
                            </span>
                          </div>
                        </div>

                        {/* Outfit Items */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {outfit.items.map((item) => (
                            <div key={item.id} className="text-center">
                              <div className="relative mb-2">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={80}
                                  height={100}
                                  className="rounded-lg object-cover w-full h-20"
                                />
                                <span className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                  ₹{(item.price / 100).toFixed(0)}k
                                </span>
                              </div>
                              <p className="text-xs font-medium text-white truncate">{item.name}</p>
                              <p className="text-xs text-gray-400">{item.category}</p>
                            </div>
                          ))}
                        </div>

                        {/* Outfit Details */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1 text-gray-400">
                              {getWeatherIcon(outfit.weather)}
                              <span>{outfit.weather}</span>
                            </span>
                            <span className="text-gray-400">{outfit.occasion}</span>
                          </div>
                          <div className="text-white font-semibold">
                            ₹{outfit.totalPrice.toLocaleString()}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addOutfitToCart(outfit)
                            }}
                            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <ShoppingBagIcon className="w-4 h-4" />
                            <span>Add All</span>
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-2 border border-purple-500 text-purple-400 rounded-lg text-sm hover:bg-purple-500/10 transition-colors"
                          >
                            <ArrowRightIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AIOutfitBuilder