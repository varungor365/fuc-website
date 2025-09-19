'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  MicrophoneIcon,
  CameraIcon,
  XMarkIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  FireIcon,
  StarIcon,
  TagIcon,
  SwatchIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface SearchSuggestion {
  id: string
  type: 'product' | 'category' | 'trend' | 'intent' | 'recent'
  text: string
  description?: string
  image?: string
  popularity?: number
  count?: number
}

interface SearchResult {
  id: string
  name: string
  price: number
  image: string
  category: string
  confidence: number
  relevance: number
  tags: string[]
}

interface IntelligentSearchProps {
  onSearch?: (query: string, filters?: any) => void
  onClose?: () => void
  placeholder?: string
  className?: string
  isExpanded?: boolean
}

const IntelligentSearch: React.FC<IntelligentSearchProps> = ({
  onSearch,
  onClose,
  placeholder = "Search with AI: 'black hoodie for winter' or 'outfit for date night'",
  className = '',
  isExpanded = false
}) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [nlpResults, setNlpResults] = useState<any>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
    loadRecentSearches()
    loadTrendingSuggestions()
  }, [isExpanded])

  useEffect(() => {
    if (query.length > 0) {
      const debounceTimer = setTimeout(() => {
        generateIntelligentSuggestions(query)
        analyzeSearchIntent(query)
      }, 300)
      return () => clearTimeout(debounceTimer)
    } else {
      setSuggestions([])
      setNlpResults(null)
    }
  }, [query])

  const loadRecentSearches = () => {
    const recent = [
      'black hoodie oversized',
      'summer casual outfit',
      'formal shirt white',
      'sneakers under 3000',
      'denim jacket vintage'
    ]
    setRecentSearches(recent)
  }

  const loadTrendingSuggestions = () => {
    const trending: SearchSuggestion[] = [
      {
        id: 'trend-1',
        type: 'trend',
        text: 'oversized hoodies',
        description: 'Trending this week',
        popularity: 94,
        count: 247
      },
      {
        id: 'trend-2',
        type: 'trend',
        text: 'vintage denim',
        description: 'Popular searches',
        popularity: 89,
        count: 189
      },
      {
        id: 'category-1',
        type: 'category',
        text: 'streetwear collection',
        description: 'Browse category',
        count: 156
      }
    ]
    setSuggestions(trending)
  }

  const analyzeSearchIntent = async (searchQuery: string) => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const intent = extractSearchIntent(searchQuery)
    setNlpResults(intent)
    setIsAnalyzing(false)
  }

  const extractSearchIntent = (query: string): any => {
    const lowerQuery = query.toLowerCase()
    
    // Color detection
    const colors = ['black', 'white', 'blue', 'red', 'green', 'gray', 'navy', 'beige']
    const detectedColors = colors.filter(color => lowerQuery.includes(color))
    
    // Category detection
    const categories = ['hoodie', 'tshirt', 'shirt', 'jeans', 'pants', 'shoes', 'jacket', 'sweater']
    const detectedCategories = categories.filter(cat => lowerQuery.includes(cat))
    
    // Occasion detection
    const occasions = {
      'casual': ['casual', 'everyday', 'relaxed', 'comfort'],
      'formal': ['formal', 'office', 'work', 'business', 'professional'],
      'party': ['party', 'night out', 'club', 'evening', 'date'],
      'sport': ['gym', 'workout', 'running', 'athletic', 'sport'],
      'winter': ['winter', 'cold', 'warm', 'cozy'],
      'summer': ['summer', 'hot', 'light', 'breathable']
    }
    
    let detectedOccasion = null
    for (const [occasion, keywords] of Object.entries(occasions)) {
      if (keywords.some(keyword => lowerQuery.includes(keyword))) {
        detectedOccasion = occasion
        break
      }
    }
    
    // Price detection
    const priceMatch = lowerQuery.match(/under\s+(\d+)|below\s+(\d+)|less\s+than\s+(\d+)/)
    const maxPrice = priceMatch ? parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]) : null
    
    // Style detection
    const styles = {
      'oversized': ['oversized', 'loose', 'baggy'],
      'fitted': ['fitted', 'slim', 'tight'],
      'vintage': ['vintage', 'retro', 'classic'],
      'minimal': ['minimal', 'simple', 'clean', 'basic']
    }
    
    let detectedStyle = null
    for (const [style, keywords] of Object.entries(styles)) {
      if (keywords.some(keyword => lowerQuery.includes(keyword))) {
        detectedStyle = style
        break
      }
    }

    return {
      originalQuery: query,
      confidence: 85 + Math.random() * 10,
      extractedFilters: {
        colors: detectedColors,
        categories: detectedCategories,
        occasion: detectedOccasion,
        maxPrice,
        style: detectedStyle
      },
      suggestions: [
        detectedColors.length > 0 && `Looking for ${detectedColors.join(', ')} items`,
        detectedCategories.length > 0 && `Found ${detectedCategories.join(', ')} in your search`,
        detectedOccasion && `Perfect for ${detectedOccasion} occasions`,
        detectedStyle && `${detectedStyle} style detected`,
        maxPrice && `Budget under ₹${maxPrice.toLocaleString()}`
      ].filter(Boolean)
    }
  }

  const generateIntelligentSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) return

    const smartSuggestions: SearchSuggestion[] = [
      {
        id: 'ai-1',
        type: 'intent',
        text: `${searchQuery} for men`,
        description: 'AI suggestion',
        popularity: 92
      },
      {
        id: 'ai-2',
        type: 'intent', 
        text: `${searchQuery} trending`,
        description: 'Popular now',
        popularity: 88
      },
      {
        id: 'ai-3',
        type: 'product',
        text: `${searchQuery} under ₹3000`,
        description: 'Budget-friendly',
        popularity: 85
      }
    ]

    setSuggestions(prev => [...smartSuggestions, ...prev.filter(s => s.type === 'trend')])
    setShowSuggestions(true)
  }

  const handleSearch = (searchText?: string) => {
    const searchQuery = searchText || query
    if (!searchQuery.trim()) return

    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5)
      return updated
    })

    // Perform search with extracted filters
    onSearch?.(searchQuery, nlpResults?.extractedFilters)
    setShowSuggestions(false)
  }

  const startVoiceSearch = () => {
    setIsListening(true)
    // Mock voice search
    setTimeout(() => {
      setQuery('black hoodie oversized')
      setIsListening(false)
    }, 2000)
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'trend': return <ArrowTrendingUpIcon className="w-4 h-4 text-orange-400" />
      case 'recent': return <ClockIcon className="w-4 h-4 text-gray-400" />
      case 'category': return <TagIcon className="w-4 h-4 text-blue-400" />
      case 'intent': return <SparklesIcon className="w-4 h-4 text-purple-400" />
      default: return <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Search Input */}
      <div className="relative">
        <div className={`relative flex items-center ${
          isExpanded 
            ? 'bg-gray-800 border-2 border-purple-500 rounded-xl shadow-2xl'
            : 'bg-gray-800/50 border border-gray-600 rounded-lg hover:border-gray-500'
        } transition-all duration-300`}>
          <MagnifyingGlassIcon className="absolute left-4 w-5 h-5 text-gray-400" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className={`w-full pl-12 pr-20 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none ${
              isExpanded ? 'text-lg' : 'text-base'
            }`}
          />

          {/* Action Buttons */}
          <div className="absolute right-2 flex items-center space-x-2">
            {isAnalyzing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-purple-400"
              >
                <SparklesIcon className="w-5 h-5" />
              </motion.div>
            )}
            
            <button
              onClick={startVoiceSearch}
              className={`p-2 rounded-lg transition-all ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>

            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
              <CameraIcon className="w-5 h-5" />
            </button>

            {isExpanded && onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* AI Analysis Results */}
        <AnimatePresence>
          {nlpResults && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg p-4 z-50"
            >
              <div className="flex items-center space-x-2 mb-3">
                <SparklesIcon className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">AI Analysis</span>
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                  {Math.round(nlpResults.confidence)}% confidence
                </span>
              </div>
              
              {nlpResults.suggestions && nlpResults.suggestions.length > 0 && (
                <div className="space-y-2">
                  {nlpResults.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => handleSearch()}
                className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Search with AI Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-40 max-h-96 overflow-y-auto"
            >
              {/* Recent Searches */}
              {query.length === 0 && recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-700">
                  <h4 className="text-gray-400 text-sm font-medium mb-3 flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>Recent Searches</span>
                  </h4>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search)
                          handleSearch(search)
                        }}
                        className="w-full text-left text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Smart Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-4">
                  <div className="space-y-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => {
                          setQuery(suggestion.text)
                          handleSearch(suggestion.text)
                        }}
                        className="w-full flex items-center justify-between p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          {getSuggestionIcon(suggestion.type)}
                          <div className="text-left">
                            <div className="font-medium">{suggestion.text}</div>
                            {suggestion.description && (
                              <div className="text-xs text-gray-400">{suggestion.description}</div>
                            )}
                          </div>
                        </div>
                        
                        {suggestion.popularity && (
                          <div className="flex items-center space-x-2">
                            <FireIcon className="w-3 h-3 text-orange-400" />
                            <span className="text-xs text-gray-400">{suggestion.popularity}%</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click overlay to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
}

export default IntelligentSearch