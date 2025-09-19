'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  HeartIcon,
  ShoppingBagIcon,
  XMarkIcon,
  UserIcon,
  CpuChipIcon,
  PhotoIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: Suggestion[]
  outfitRecommendation?: OutfitRecommendation
}

interface Suggestion {
  text: string
  action: () => void
}

interface OutfitRecommendation {
  id: string
  name: string
  items: {
    id: string
    name: string
    price: number
    image: string
    category: string
  }[]
  occasion: string
  weather: string
  style: string
  confidence: number
}

interface VirtualStyleAssistantProps {
  isOpen: boolean
  onClose: () => void
}

const VirtualStyleAssistant: React.FC<VirtualStyleAssistantProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm Luna, your AI style assistant! 👋✨ I'm here to help you discover amazing outfits that match your style. What kind of look are you going for today?",
      timestamp: new Date(),
      suggestions: [
        { text: "Casual everyday wear", action: () => handleSuggestionClick("I'm looking for casual everyday wear") },
        { text: "Office professional", action: () => handleSuggestionClick("I need office professional outfits") },
        { text: "Weekend party outfit", action: () => handleSuggestionClick("I want a weekend party outfit") },
        { text: "Cozy winter style", action: () => handleSuggestionClick("Show me cozy winter style") }
      ]
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [favoriteOutfits, setFavoriteOutfits] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const mockOutfits: OutfitRecommendation[] = [
    {
      id: 'outfit-1',
      name: 'Urban Casual',
      occasion: 'casual',
      weather: 'mild',
      style: 'streetwear',
      confidence: 92,
      items: [
        { id: '1', name: 'Oversized Graphic Hoodie', price: 89, image: '/api/placeholder/300/400', category: 'Hoodies' },
        { id: '2', name: 'Slim Fit Jeans', price: 79, image: '/api/placeholder/300/400', category: 'Jeans' },
        { id: '3', name: 'Classic Sneakers', price: 129, image: '/api/placeholder/300/400', category: 'Shoes' }
      ]
    },
    {
      id: 'outfit-2',
      name: 'Office Professional',
      occasion: 'work',
      weather: 'any',
      style: 'professional',
      confidence: 96,
      items: [
        { id: '4', name: 'Tailored Blazer', price: 149, image: '/api/placeholder/300/400', category: 'Blazers' },
        { id: '5', name: 'Cotton Dress Shirt', price: 69, image: '/api/placeholder/300/400', category: 'Shirts' },
        { id: '6', name: 'Dress Trousers', price: 89, image: '/api/placeholder/300/400', category: 'Trousers' }
      ]
    },
    {
      id: 'outfit-3',
      name: 'Cozy Winter',
      occasion: 'casual',
      weather: 'cold',
      style: 'comfort',
      confidence: 88,
      items: [
        { id: '7', name: 'Chunky Knit Sweater', price: 99, image: '/api/placeholder/300/400', category: 'Sweaters' },
        { id: '8', name: 'Thermal Leggings', price: 49, image: '/api/placeholder/300/400', category: 'Leggings' },
        { id: '9', name: 'Winter Boots', price: 159, image: '/api/placeholder/300/400', category: 'Boots' }
      ]
    }
  ]

  function handleSuggestionClick(suggestionText: string) {
    handleSendMessage(suggestionText)
  }

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()
    
    let response = ""
    let outfit: OutfitRecommendation | undefined
    let suggestions: Suggestion[] = []

    if (lowerMessage.includes('casual') || lowerMessage.includes('everyday')) {
      response = "Perfect! I've curated a stylish casual look that's comfortable yet trendy. This urban casual outfit combines comfort with street style - perfect for everyday wear! 🌟"
      outfit = mockOutfits[0]
      suggestions = [
        { text: "Show me more casual options", action: () => handleSuggestionClick("Show me more casual outfits") },
        { text: "What about colors?", action: () => handleSuggestionClick("What colors work best for this style?") },
        { text: "Size recommendations", action: () => handleSuggestionClick("Help me with sizing") }
      ]
    } else if (lowerMessage.includes('office') || lowerMessage.includes('professional') || lowerMessage.includes('work')) {
      response = "Excellent choice! Here's a sophisticated professional look that will make you feel confident and polished at work. This outfit strikes the perfect balance between professionalism and style! 💼✨"
      outfit = mockOutfits[1]
      suggestions = [
        { text: "More formal options", action: () => handleSuggestionClick("Show me more formal outfits") },
        { text: "Seasonal variations", action: () => handleSuggestionClick("How to adapt this for different seasons?") },
        { text: "Accessories to add", action: () => handleSuggestionClick("What accessories go with this?") }
      ]
    } else if (lowerMessage.includes('winter') || lowerMessage.includes('cozy') || lowerMessage.includes('cold')) {
      response = "Stay warm and stylish! I've selected a cozy winter ensemble that combines comfort with chic aesthetics. Perfect for those chilly days when you want to look effortlessly put-together! ❄️🧥"
      outfit = mockOutfits[2]
      suggestions = [
        { text: "Layering tips", action: () => handleSuggestionClick("Give me layering tips for winter") },
        { text: "Indoor alternatives", action: () => handleSuggestionClick("What about indoor winter outfits?") },
        { text: "Color coordination", action: () => handleSuggestionClick("Help with winter color coordination") }
      ]
    } else if (lowerMessage.includes('party') || lowerMessage.includes('weekend') || lowerMessage.includes('night')) {
      response = "Time to shine! ✨ Let me create some stunning party looks that will make you the center of attention. Would you prefer a glamorous evening look or something more casual-chic?"
      suggestions = [
        { text: "Glamorous evening look", action: () => handleSuggestionClick("Show me glamorous evening outfits") },
        { text: "Casual-chic party style", action: () => handleSuggestionClick("I want casual-chic party outfits") },
        { text: "Accessories for parties", action: () => handleSuggestionClick("What accessories for party outfits?") }
      ]
    } else if (lowerMessage.includes('color') || lowerMessage.includes('colours')) {
      response = "Great question! Color coordination is key to a polished look. For the style you mentioned, I recommend sticking to a cohesive palette. Earth tones and neutrals work beautifully together, while bold colors can be used as accents! 🎨"
      suggestions = [
        { text: "Seasonal color trends", action: () => handleSuggestionClick("What are the current seasonal color trends?") },
        { text: "Colors for my skin tone", action: () => handleSuggestionClick("What colors work best for my skin tone?") },
        { text: "Mix and match tips", action: () => handleSuggestionClick("How to mix and match colors?") }
      ]
    } else if (lowerMessage.includes('size') || lowerMessage.includes('sizing') || lowerMessage.includes('fit')) {
      response = "I'd love to help you find the perfect fit! Our AI size recommendation system analyzes your measurements and purchase history to suggest the best size. For the most accurate recommendations, make sure to check our size guide and consider the fit you prefer! 📏"
      suggestions = [
        { text: "Measure myself properly", action: () => handleSuggestionClick("How do I measure myself properly?") },
        { text: "Different fit styles", action: () => handleSuggestionClick("Explain different fit styles") },
        { text: "Return policy for sizing", action: () => handleSuggestionClick("What's the return policy for wrong sizes?") }
      ]
    } else {
      response = "I'd be happy to help you find the perfect style! Could you tell me more about what you're looking for? Are you shopping for a specific occasion, season, or style preference? 🤔"
      suggestions = [
        { text: "Browse by occasion", action: () => handleSuggestionClick("Help me browse by occasion") },
        { text: "Find my style", action: () => handleSuggestionClick("Help me find my personal style") },
        { text: "What's trending", action: () => handleSuggestionClick("What's trending right now?") }
      ]
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions,
      outfitRecommendation: outfit
    }
  }

  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim()
    if (!message) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Generate AI response
    const aiResponse = generateAIResponse(message)
    setMessages(prev => [...prev, aiResponse])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleFavorite = (outfitId: string) => {
    setFavoriteOutfits(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(outfitId)) {
        newFavorites.delete(outfitId)
      } else {
        newFavorites.add(outfitId)
      }
      return newFavorites
    })
  }

  const getTotalPrice = (items: OutfitRecommendation['items']) => {
    return items.reduce((total, item) => total + item.price, 0)
  }

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'cold': return <CloudIcon className="w-4 h-4" />
      case 'hot': return <SunIcon className="w-4 h-4" />
      default: return <SunIcon className="w-4 h-4" />
    }
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
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Luna - AI Style Assistant</h3>
                <p className="text-white/80 text-sm">Your personal fashion expert</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {/* Avatar */}
                  <div className={`flex items-end space-x-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600'
                    }`}>
                      {message.type === 'user' ? (
                        <UserIcon className="w-5 h-5 text-white" />
                      ) : (
                        <CpuChipIcon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    <div className={`rounded-2xl p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Outfit Recommendation */}
                  {message.outfitRecommendation && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {message.outfitRecommendation.name}
                          </h4>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {message.outfitRecommendation.confidence}% match
                          </span>
                        </div>
                        <button
                          onClick={() => toggleFavorite(message.outfitRecommendation!.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          {favoriteOutfits.has(message.outfitRecommendation.id) ? (
                            <HeartSolid className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400 mb-3">
                        <span className="flex items-center space-x-1">
                          {getWeatherIcon(message.outfitRecommendation.weather)}
                          <span>{message.outfitRecommendation.weather}</span>
                        </span>
                        <span>{message.outfitRecommendation.occasion}</span>
                        <span>{message.outfitRecommendation.style}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {message.outfitRecommendation.items.map((item) => (
                          <div key={item.id} className="text-center">
                            <div className="relative mb-2">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={100}
                                height={120}
                                className="rounded-lg object-cover w-full h-24"
                              />
                              <span className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                ${item.price}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Total: </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ${getTotalPrice(message.outfitRecommendation.items)}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition-colors">
                            View Details
                          </button>
                          <button className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors flex items-center space-x-1">
                            <ShoppingBagIcon className="w-3 h-3" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={suggestion.action}
                          className="block text-left text-xs bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-full transition-colors"
                        >
                          {suggestion.text}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <CpuChipIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about styles, occasions, or specific items..."
                  className="w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button className="text-gray-400 hover:text-purple-600 transition-colors">
                    <PhotoIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VirtualStyleAssistant