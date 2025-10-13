'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SparklesIcon,
  HeartIcon,
  ShoppingBagIcon,
  EyeIcon,
  FireIcon,
  StarIcon,
  ArrowRightIcon,
  SunIcon,
  CloudIcon,
  SwatchIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'

interface OutfitItem {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface TrendingOutfit {
  id: string
  name: string
  description: string
  style: string
  occasion: string
  weather: string
  popularity: number
  saves: number
  items: OutfitItem[]
  totalPrice: number
  discount?: number
  trending: boolean
}

interface TrendingOutfitsProps {
  className?: string
  showHeader?: boolean
  limit?: number
}

const TrendingOutfits: React.FC<TrendingOutfitsProps> = ({
  className = '',
  showHeader = true,
  limit = 6
}) => {
  const [outfits, setOutfits] = useState<TrendingOutfit[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'casual' | 'work' | 'party'>('all')

  useEffect(() => {
    loadTrendingOutfits()
  }, [activeFilter])

  const loadTrendingOutfits = async () => {
    setIsLoading(true)
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockOutfits: TrendingOutfit[] = [
      {
        id: 'trend-1',
        name: 'Urban Explorer',
        description: 'Perfect street style for city adventures',
        style: 'streetwear',
        occasion: 'casual',
        weather: 'sunny',
        popularity: 94,
        saves: 2847,
        trending: true,
        items: [
          { id: '1', name: 'Oversized Hoodie', price: 2499, image: '/images/products/hoodies/hoodie-1-main.jpg', category: 'hoodies' },
          { id: '2', name: 'Cargo Pants', price: 3299, image: '/images/products/pants/jeans-1-main.jpg', category: 'pants' },
          { id: '3', name: 'Chunky Sneakers', price: 5999, image: '/images/products/shoes/sneaker-1-main.jpg', category: 'shoes' }
        ],
        totalPrice: 11797,
        discount: 15
      },
      {
        id: 'trend-2',
        name: 'Smart Casual Pro',
        description: 'Elevate your work-from-home style',
        style: 'smart-casual',
        occasion: 'work',
        weather: 'cloudy',
        popularity: 89,
        saves: 1923,
        trending: true,
        items: [
          { id: '4', name: 'Button Shirt', price: 1999, image: '/images/products/t-shirts/tshirt-1-main.jpg', category: 'shirts' },
          { id: '5', name: 'Chino Pants', price: 2799, image: '/images/products/hoodies/hoodie-1-main.jpg', category: 'pants' },
          { id: '6', name: 'Minimalist Sneakers', price: 4499, image: '/images/products/accessories/cap-1-main.jpg', category: 'shoes' }
        ],
        totalPrice: 9297
      },
      {
        id: 'trend-3',
        name: 'Night Owl',
        description: 'Stand out at evening events',
        style: 'party',
        occasion: 'party',
        weather: 'clear',
        popularity: 92,
        saves: 3156,
        trending: true,
        items: [
          { id: '7', name: 'Leather Jacket', price: 7999, image: '/images/products/jackets/jacket-1-main.jpg', category: 'jackets' },
          { id: '8', name: 'Slim Jeans', price: 3499, image: '/images/products/hoodies/hoodie-2-main.jpg', category: 'jeans' },
          { id: '9', name: 'Combat Boots', price: 6499, image: '/images/products/t-shirts/tshirt-2-main.jpg', category: 'shoes' }
        ],
        totalPrice: 17997,
        discount: 20
      },
      {
        id: 'trend-4',
        name: 'Minimalist Zen',
        description: 'Clean lines, maximum impact',
        style: 'minimalist',
        occasion: 'casual',
        weather: 'sunny',
        popularity: 87,
        saves: 1654,
        trending: false,
        items: [
          { id: '10', name: 'Basic Tee', price: 899, image: '/images/products/t-shirts/tshirt-1-front.jpg', category: 'tshirts' },
          { id: '11', name: 'Straight Jeans', price: 2999, image: '/images/products/hoodies/hoodie-1-front.jpg', category: 'jeans' },
          { id: '12', name: 'White Sneakers', price: 3999, image: '/images/products/jackets/jacket-1-front.jpg', category: 'shoes' }
        ],
        totalPrice: 7897
      },
      {
        id: 'trend-5',
        name: 'Cozy Weekend',
        description: 'Comfort meets style',
        style: 'comfortable',
        occasion: 'casual',
        weather: 'cloudy',
        popularity: 85,
        saves: 2234,
        trending: false,
        items: [
          { id: '13', name: 'Knit Sweater', price: 3299, image: '/images/products/hoodies/hoodie-2-front.jpg', category: 'sweaters' },
          { id: '14', name: 'Jogger Pants', price: 2199, image: '/images/products/t-shirts/tshirt-2-front.jpg', category: 'pants' },
          { id: '15', name: 'Slip-on Shoes', price: 2999, image: '/images/products/accessories/cap-1-main.jpg', category: 'shoes' }
        ],
        totalPrice: 8497
      },
      {
        id: 'trend-6',
        name: 'Summer Breeze',
        description: 'Light and airy for hot days',
        style: 'summer',
        occasion: 'casual',
        weather: 'sunny',
        popularity: 91,
        saves: 2789,
        trending: true,
        items: [
          { id: '16', name: 'Linen Shirt', price: 2299, image: '/images/products/t-shirts/tshirt-1-main.jpg', category: 'shirts' },
          { id: '17', name: 'Cotton Shorts', price: 1599, image: '/images/products/hoodies/hoodie-1-back.jpg', category: 'shorts' },
          { id: '18', name: 'Canvas Shoes', price: 2499, image: '/images/products/accessories/cap-1-main.jpg', category: 'shoes' }
        ],
        totalPrice: 6397
      }
    ]

    const filteredOutfits = activeFilter === 'all' 
      ? mockOutfits 
      : mockOutfits.filter(outfit => outfit.occasion === activeFilter)

    setOutfits(filteredOutfits.slice(0, limit))
    setIsLoading(false)
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
      case 'sunny': return <SunIcon className="w-3 h-3" />
      case 'cloudy': return <CloudIcon className="w-3 h-3" />
      default: return <SunIcon className="w-3 h-3" />
    }
  }

  if (isLoading) {
    return (
      <div className={`py-12 ${className}`}>
        {showHeader && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Trending Outfits</h2>
            <p className="text-gray-400">AI-curated looks everyone's loving</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-800/30 rounded-xl p-4 animate-pulse">
              <div className="aspect-[4/5] bg-gray-700 rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`py-12 ${className}`}>
      {showHeader && (
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <SparklesIcon className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Latest Streetwear Fashion Trends</h2>
            <FireIcon className="w-8 h-8 text-orange-400" />
          </div>
          <p className="text-gray-400 mb-6">Curated streetwear outfits trending in India right now</p>
          
          {/* Filter Tabs */}
          <div className="flex justify-center space-x-4 mb-8">
            {(['all', 'casual', 'work', 'party'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {outfits.map((outfit, index) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50 hover:border-gray-600"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white font-semibold">{outfit.name}</h3>
                    {outfit.trending && (
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 rounded-full">
                        <FireIcon className="w-3 h-3 text-white" />
                        <span className="text-xs text-white font-medium">HOT</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(outfit.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {favorites.has(outfit.id) ? (
                      <HeartSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-gray-400 text-sm">{outfit.description}</p>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span className="flex items-center space-x-1">
                      {getWeatherIcon(outfit.weather)}
                      <span>{outfit.weather}</span>
                    </span>
                    <span>{outfit.occasion}</span>
                    <span className="flex items-center space-x-1">
                      <StarIcon className="w-3 h-3 text-yellow-400" />
                      <span>{outfit.popularity}%</span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{outfit.saves.toLocaleString()} saves</span>
                </div>
              </div>

              {/* Outfit Items */}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {outfit.items.map((item, itemIndex) => (
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

                {/* Price and Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">
                        ₹{outfit.discount 
                          ? (outfit.totalPrice * (1 - outfit.discount / 100)).toLocaleString()
                          : outfit.totalPrice.toLocaleString()
                        }
                      </span>
                      {outfit.discount && (
                        <>
                          <span className="text-gray-400 line-through text-sm">
                            ₹{outfit.totalPrice.toLocaleString()}
                          </span>
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                            -{outfit.discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1">
                    <ShoppingBagIcon className="w-4 h-4" />
                    <span>Shop Look</span>
                  </button>
                  <button className="px-3 py-2 border border-gray-600 text-gray-400 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showHeader && (
        <div className="text-center mt-8">
          <Link
            href="/outfits"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <span>Explore All Outfits</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default TrendingOutfits