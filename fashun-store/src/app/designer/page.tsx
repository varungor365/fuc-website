'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  SparklesIcon, 
  PhotoIcon, 
  SwatchIcon, 
  PaintBrushIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  // MagnifyingGlassIcon,
  // XMarkIcon
} from '@heroicons/react/24/outline'

// Mock design templates
const templates = [
  {
    id: 1,
    name: 'Minimalist Text',
    category: 'Text',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop&crop=center',
    premium: false
  },
  {
    id: 2,
    name: 'Abstract Art',
    category: 'Graphics',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop&crop=center',
    premium: true
  },
  {
    id: 3,
    name: 'Vintage Badge',
    category: 'Badges',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=300&fit=crop&crop=center',
    premium: false
  },
  {
    id: 4,
    name: 'Geometric Pattern',
    category: 'Patterns',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=300&h=300&fit=crop&crop=center',
    premium: true
  },
  {
    id: 5,
    name: 'Typography Bold',
    category: 'Text',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center',
    premium: false
  },
  {
    id: 6,
    name: 'Nature Inspired',
    category: 'Graphics',
    image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=300&h=300&fit=crop&crop=center',
    premium: true
  }
]

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'
]

const aiPrompts = [
  'Create a bold streetwear design with urban elements',
  'Design a minimalist logo with geometric shapes',
  'Generate an abstract pattern with flowing lines',
  'Create a vintage-inspired graphic with retro colors',
  'Design a futuristic tech-themed graphic',
  'Generate a nature-inspired organic pattern'
]

export default function DesignerPage() {
  const [activeProduct, setActiveProduct] = useState('hoodie')
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState('#FF6B6B')
  const [designText, setDesignText] = useState('YOUR TEXT')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')
  const canvasRef = useRef<HTMLDivElement>(null)

  const products = [
    { 
      id: 'hoodie', 
      name: 'Hoodie', 
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&crop=center',
      mockup: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=700&fit=crop&crop=center'
    },
    { 
      id: 'tshirt', 
      name: 'T-Shirt', 
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center',
      mockup: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=700&fit=crop&crop=center'
    },
    { 
      id: 'polo', 
      name: 'Polo', 
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop&crop=center',
      mockup: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=700&fit=crop&crop=center'
    }
  ]

  const categories = ['All', 'Text', 'Graphics', 'Badges', 'Patterns']

  const filteredTemplates = filterCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === filterCategory)

  const handleGenerateAI = () => {
    if (!aiPrompt.trim()) return
    
    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      // In a real implementation, this would generate actual designs
      console.log('Generated design for prompt:', aiPrompt)
    }, 3000)
  }

  const handleDownload = () => {
    // In a real implementation, this would generate and download the design
    console.log('Downloading design...')
  }

  const handleAddToCart = () => {
    // In a real implementation, this would add the custom design to cart
    console.log('Adding custom design to cart...')
  }

  return (
    <div className="min-h-screen bg-primary-950 text-white pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              AI Designer Tool
            </h1>
            <p className="text-xl text-primary-300 max-w-2xl mx-auto">
              Create unique, personalized designs with our AI-powered design tool. 
              Choose templates, customize colors, or generate completely new designs.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Panel - Tools */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Product Selection */}
            <div className="bg-primary-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Choose Product</h3>
              <div className="grid grid-cols-3 gap-3">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setActiveProduct(product.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      activeProduct === product.id 
                        ? 'border-accent-400 ring-2 ring-accent-400/20' 
                        : 'border-primary-700 hover:border-primary-600'
                    }`}
                  >
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end">
                      <span className="text-white text-xs font-medium p-2">{product.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generation */}
            <div className="bg-primary-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-accent-400" />
                AI Design Generator
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Describe your design
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full bg-primary-800 border border-primary-700 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400 resize-none"
                    rows={3}
                    placeholder="E.g., Create a bold street art design with graffiti style text..."
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <p className="text-sm text-primary-400">Quick prompts:</p>
                  {aiPrompts.slice(0, 3).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setAiPrompt(prompt)}
                      className="text-left text-sm text-accent-400 hover:text-accent-300 transition-colors"
                    >
                      &quot;{prompt}&quot;
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleGenerateAI}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-600 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5" />
                      Generate Design
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Text Customization */}
            <div className="bg-primary-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Text & Colors</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Custom Text
                  </label>
                  <input
                    type="text"
                    value={designText}
                    onChange={(e) => setDesignText(e.target.value)}
                    className="w-full bg-primary-800 border border-primary-700 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400"
                    placeholder="Enter your text"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Color Palette
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="w-full flex items-center gap-3 bg-primary-800 border border-primary-700 rounded-lg px-4 py-3 hover:border-primary-600 transition-colors"
                    >
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white"
                        style={{ backgroundColor: selectedColor }}
                      />
                      <span className="text-white">Choose Color</span>
                    </button>
                    
                    {showColorPicker && (
                      <div className="absolute top-full left-0 mt-2 p-4 bg-primary-800 border border-primary-700 rounded-lg z-10">
                        <div className="grid grid-cols-6 gap-2">
                          {colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => {
                                setSelectedColor(color)
                                setShowColorPicker(false)
                              }}
                              className="w-8 h-8 rounded-full border-2 border-white hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="w-full bg-primary-800 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                Download Design
              </button>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-accent-500 hover:bg-accent-600 text-black py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Add to Cart - ₹2,999
              </button>
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="xl:col-span-1">
            <div className="bg-primary-900 rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Design Preview</h3>
              
              <div ref={canvasRef} className="relative aspect-square bg-primary-800 rounded-lg overflow-hidden">
                <Image 
                  src={products.find(p => p.id === activeProduct)?.mockup || products[0].mockup} 
                  alt="Product Mockup" 
                  fill 
                  className="object-cover" 
                />
                
                {/* Design Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="text-2xl font-bold px-4 py-2 rounded-lg bg-black/20 backdrop-blur-sm"
                    style={{ color: selectedColor }}
                  >
                    {designText}
                  </div>
                </div>
                
                {selectedTemplate && (
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-lg overflow-hidden border-2 border-accent-400">
                    <Image 
                      src={templates.find(t => t.id === selectedTemplate)?.image || ''}
                      alt="Template"
                      fill
                      className="object-cover opacity-80"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Templates */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Template Filter */}
            <div className="bg-primary-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Design Templates</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterCategory === category
                        ? 'bg-accent-500 text-black'
                        : 'bg-primary-800 text-primary-300 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${
                      selectedTemplate === template.id
                        ? 'border-accent-400 ring-2 ring-accent-400/20'
                        : 'border-primary-700 hover:border-primary-600'
                    }`}
                  >
                    <Image src={template.image} alt={template.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium text-center px-2">
                        {template.name}
                      </span>
                    </div>
                    {template.premium && (
                      <div className="absolute top-2 right-2 bg-accent-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                        PRO
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Design Tips */}
            <div className="bg-primary-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Design Tips</h3>
              <div className="space-y-3 text-sm text-primary-300">
                <div className="flex items-start gap-2">
                  <SparklesIcon className="h-4 w-4 text-accent-400 mt-0.5 flex-shrink-0" />
                  <span>Use high contrast colors for better visibility</span>
                </div>
                <div className="flex items-start gap-2">
                  <PaintBrushIcon className="h-4 w-4 text-accent-400 mt-0.5 flex-shrink-0" />
                  <span>Keep text short and impactful for best results</span>
                </div>
                <div className="flex items-start gap-2">
                  <SwatchIcon className="h-4 w-4 text-accent-400 mt-0.5 flex-shrink-0" />
                  <span>Try different templates to find your style</span>
                </div>
                <div className="flex items-start gap-2">
                  <PhotoIcon className="h-4 w-4 text-accent-400 mt-0.5 flex-shrink-0" />
                  <span>AI generator works best with detailed prompts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
