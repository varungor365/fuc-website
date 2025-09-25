'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

const mockups = [
  {
    id: 1,
    title: 'Urban Explorer',
    category: 'Streetwear',
    image: '/api/placeholder/300/400',
    prompt: 'Urban streetwear with graffiti elements and bold typography',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1']
  },
  {
    id: 2,
    title: 'Minimal Wave',
    category: 'Minimalist',
    image: '/api/placeholder/300/400',
    prompt: 'Clean geometric patterns with modern aesthetic',
    colors: ['#6C5CE7', '#A29BFE', '#FD79A8']
  },
  {
    id: 3,
    title: 'Retro Future',
    category: 'Futuristic',
    image: '/api/placeholder/300/400',
    prompt: 'Synthwave inspired design with neon accents',
    colors: ['#00F5FF', '#FF1493', '#FFD700']
  },
  {
    id: 4,
    title: 'Nature Blend',
    category: 'Organic',
    image: '/api/placeholder/300/400',
    prompt: 'Natural elements with earthy color palette',
    colors: ['#2ECC71', '#F39C12', '#8E44AD']
  }
]

const categories = ['All', 'Streetwear', 'Minimalist', 'Futuristic', 'Organic']

export function AIMockups() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredMockups = selectedCategory === 'All' 
    ? mockups 
    : mockups.filter(mockup => mockup.category === selectedCategory)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-white mb-4">
            AI-Generated<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Design Mockups
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Explore endless design possibilities with our AI-powered mockup generator. 
            Get inspired by unique combinations and styles.
          </p>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating...</span>
              </span>
            ) : (
              'Generate New Mockups'
            )}
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-full p-2">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mockups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredMockups.map((mockup, index) => (
            <motion.div
              key={mockup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                {/* Mockup Image */}
                <div className="aspect-[3/4] bg-gray-800 rounded-xl mb-4 overflow-hidden relative">
                  <Image
                    src={mockup.image}
                    alt={mockup.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs font-medium bg-black/50 text-white rounded-full">
                      {mockup.category}
                    </span>
                  </div>
                </div>

                {/* Mockup Info */}
                <div className="space-y-3">
                  <h3 className="text-xl font-montserrat font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {mockup.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {mockup.prompt}
                  </p>
                  
                  {/* Color Palette */}
                  <div className="flex space-x-2">
                    {mockup.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="w-6 h-6 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <button className="flex-1 px-4 py-2 text-sm font-medium bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                      Use Design
                    </button>
                    <button className="px-4 py-2 text-sm font-medium bg-cyan-600/20 text-cyan-400 rounded-lg hover:bg-cyan-600/30 transition-colors">
                      ♡
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Generation Info */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-montserrat font-bold text-white mb-4">
              How Our AI Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Input Your Ideas</h4>
                <p className="text-gray-400">Describe your vision or select style preferences</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-semibold text-white mb-2">AI Processing</h4>
                <p className="text-gray-400">Our AI analyzes trends and generates unique designs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Get Results</h4>
                <p className="text-gray-400">Receive multiple design variations to choose from</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}