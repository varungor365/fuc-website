'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  UserIcon,
  CameraIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

interface VirtualStyleAssistantProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

const VirtualStyleAssistant: React.FC<VirtualStyleAssistantProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your virtual style assistant. I can help you find the perfect outfit, suggest styling tips, or help you discover new trends. What would you like to explore today?",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const quickSuggestions = [
    "What's trending now?",
    "Help me style a hoodie",
    "Suggest an outfit for a party",
    "What colors go well together?",
    "Show me winter essentials"
  ]

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now() + '-user',
      text: message,
      isBot: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(message)
      const botMessage: Message = {
        id: Date.now() + '-bot',
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('trending') || lowerMessage.includes('trend')) {
      return "Right now, we're seeing huge trends in cyberpunk aesthetics, neon colors, and tech-wear! Our Cyber Punk collection is really popular. Would you like me to show you some trending pieces?"
    }
    
    if (lowerMessage.includes('hoodie') || lowerMessage.includes('styling')) {
      return "Great choice! Hoodies are super versatile. Try pairing a hoodie with: \n• Cargo pants for a streetwear look\n• Leather jacket for an edgy vibe\n• Denim for casual comfort\n\nWhat style are you going for?"
    }
    
    if (lowerMessage.includes('party') || lowerMessage.includes('event')) {
      return "For parties, you'll want something that stands out! Consider:\n• Graphic tees with statement designs\n• Bold colors like neon or metallic\n• Layering with a jacket or bomber\n\nWhat type of party is it?"
    }
    
    if (lowerMessage.includes('color') || lowerMessage.includes('colours')) {
      return "Color coordination is key! Here are some winning combos:\n• Black + Neon (classic cyberpunk)\n• Navy + White (clean and fresh)\n• Gray + Purple (modern and sleek)\n\nWhat's your favorite color to work with?"
    }
    
    if (lowerMessage.includes('winter') || lowerMessage.includes('cold')) {
      return "Winter essentials for streetwear style:\n• Layered hoodies under jackets\n• Cargo pants in darker colors\n• High-top sneakers or boots\n• Beanies and caps for accessories\n\nNeed specific recommendations?"
    }
    
    return "That's a great question! I'd love to help you with that. Could you tell me more about what you're looking for? Are you shopping for a specific occasion, or just want to upgrade your style?"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-primary-900/95 backdrop-blur-md border border-white/10 rounded-2xl w-full max-w-2xl mx-4 h-[600px] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Style Assistant</h2>
              <p className="text-sm text-primary-200">AI-powered fashion advisor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isBot 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'bg-white/10'
              }`}>
                {message.isBot ? (
                  <SparklesIcon className="w-4 h-4 text-white" />
                ) : (
                  <UserIcon className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`max-w-[80%] ${message.isBot ? '' : 'text-right'}`}>
                <div className={`inline-block p-4 rounded-2xl ${
                  message.isBot
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600'
                }`}>
                  <p className="text-white whitespace-pre-wrap">{message.text}</p>
                </div>
                <p className="text-xs text-primary-400 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="px-6 py-3 border-t border-white/10">
            <p className="text-sm text-primary-200 mb-3">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-3 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-white/10">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                placeholder="Ask me anything about style..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Send
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VirtualStyleAssistant