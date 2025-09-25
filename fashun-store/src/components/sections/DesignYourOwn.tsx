'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

const features = [
  {
    title: 'Custom Graphics',
    description: 'Upload your own designs or choose from our library',
    icon: '🎨'
  },
  {
    title: 'AI-Powered Generation',
    description: 'Generate unique designs with AI assistance',
    icon: '🤖'
  },
  {
    title: '3D Preview',
    description: 'See your design on realistic product mockups',
    icon: '👕'
  }
]

export function DesignYourOwn() {
  const [selectedTool, setSelectedTool] = useState('graphics')

  return (
    <section className="py-20 bg-gradient-to-br from-primary-800 to-primary-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-white mb-4">
            Design Your Own<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Unique Style
            </span>
          </h2>
          <p className="text-lg text-primary-300 max-w-3xl mx-auto">
            Use our advanced design tool to create custom apparel that's uniquely yours. 
            From graphics to text, position everything exactly where you want it.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-montserrat font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-primary-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Design Canvas Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Canvas */}
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <h3 className="text-2xl font-montserrat font-bold text-white mb-6 text-center">
                Design Canvas
              </h3>
              
              {/* Mock Canvas */}
              <div className="aspect-square bg-gray-800 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Your Design</span>
                    </div>
                    <p className="text-white/70">Drop your design here</p>
                  </div>
                </div>
              </div>

              {/* Canvas Tools */}
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={() => setSelectedTool('graphics')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTool === 'graphics' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Graphics
                </button>
                <button
                  onClick={() => setSelectedTool('text')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTool === 'text' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Text
                </button>
                <button
                  onClick={() => setSelectedTool('ai')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTool === 'ai' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  AI Generate
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-montserrat font-bold text-white mb-4">
                Professional Design Tools
              </h3>
              <p className="text-primary-300 mb-6">
                Create stunning designs with our intuitive drag-and-drop interface. 
                No design experience required.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">High-Quality Printing</h4>
                  <p className="text-primary-300 text-sm">DTG printing for vibrant, long-lasting designs</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Multiple Products</h4>
                  <p className="text-primary-300 text-sm">Apply your design to hoodies, tees, polos, and more</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Instant Preview</h4>
                  <p className="text-primary-300 text-sm">See exactly how your design will look before ordering</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/designer">
                <button className="w-full px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                  Start Designing
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}