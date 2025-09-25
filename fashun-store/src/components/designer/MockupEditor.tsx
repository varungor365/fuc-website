'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Mockup templates from Unblast-style resources
const mockupTemplates = [
  {
    id: 1,
    name: 'Classic T-Shirt Front',
    category: 'tshirts',
    image: '/mockups/tshirt-front.jpg',
    designArea: { x: 30, y: 25, width: 40, height: 50 },
    premium: false
  },
  {
    id: 2,
    name: 'Oversized Hoodie',
    category: 'hoodies',
    image: '/mockups/hoodie-front.jpg',
    designArea: { x: 25, y: 30, width: 50, height: 40 },
    premium: true
  },
  {
    id: 3,
    name: 'Polo Shirt Classic',
    category: 'polos',
    image: '/mockups/polo-front.jpg',
    designArea: { x: 35, y: 20, width: 30, height: 40 },
    premium: false
  },
  {
    id: 4,
    name: 'Tank Top Summer',
    category: 'tanks',
    image: '/mockups/tank-front.jpg',
    designArea: { x: 30, y: 25, width: 40, height: 50 },
    premium: true
  },
  {
    id: 5,
    name: 'Crewneck Sweatshirt',
    category: 'sweatshirts',
    image: '/mockups/crewneck-front.jpg',
    designArea: { x: 28, y: 28, width: 44, height: 44 },
    premium: false
  },
  {
    id: 6,
    name: 'Zip Hoodie Urban',
    category: 'hoodies',
    image: '/mockups/zip-hoodie.jpg',
    designArea: { x: 32, y: 25, width: 36, height: 50 },
    premium: true
  }
]

// Stock images from Lummi-style AI generated content
const stockImages = [
  {
    id: 1,
    url: '/stock/urban-street.jpg',
    category: 'urban',
    tags: ['street', 'city', 'modern'],
    premium: false
  },
  {
    id: 2,
    url: '/stock/abstract-waves.jpg',
    category: 'abstract',
    tags: ['waves', 'fluid', 'modern'],
    premium: true
  },
  {
    id: 3,
    url: '/stock/geometric-pattern.jpg',
    category: 'geometric',
    tags: ['shapes', 'minimal', 'clean'],
    premium: false
  },
  {
    id: 4,
    url: '/stock/graffiti-art.jpg',
    category: 'street-art',
    tags: ['graffiti', 'colorful', 'urban'],
    premium: true
  },
  {
    id: 5,
    url: '/stock/nature-texture.jpg',
    category: 'nature',
    tags: ['organic', 'texture', 'earth'],
    premium: false
  },
  {
    id: 6,
    url: '/stock/neon-cyber.jpg',
    category: 'futuristic',
    tags: ['neon', 'cyber', 'glow'],
    premium: true
  }
]

// Design graphics from Unblast-style resources
const designGraphics = [
  {
    id: 1,
    name: 'Skull Vector',
    url: '/graphics/skull-vector.svg',
    category: 'illustrations',
    premium: false
  },
  {
    id: 2,
    name: 'Typography Set',
    url: '/graphics/typography-set.svg',
    category: 'typography',
    premium: true
  },
  {
    id: 3,
    name: 'Geometric Shapes',
    url: '/graphics/geometric-shapes.svg',
    category: 'shapes',
    premium: false
  },
  {
    id: 4,
    name: 'Vintage Badge',
    url: '/graphics/vintage-badge.svg',
    category: 'badges',
    premium: true
  },
  {
    id: 5,
    name: 'Abstract Lines',
    url: '/graphics/abstract-lines.svg',
    category: 'abstract',
    premium: false
  },
  {
    id: 6,
    name: 'Logo Elements',
    url: '/graphics/logo-elements.svg',
    category: 'logos',
    premium: true
  }
]

interface MockupEditorProps {
  onSave?: (designData: any) => void
}

export function MockupEditor({ onSave }: MockupEditorProps) {
  const [selectedMockup, setSelectedMockup] = useState(mockupTemplates[0])
  const [activeTab, setActiveTab] = useState<'mockups' | 'images' | 'graphics' | 'text'>('mockups')
  const [selectedDesign, setSelectedDesign] = useState<any>(null)
  const [designPosition, setDesignPosition] = useState({ x: 50, y: 50 })
  const [designSize, setDesignSize] = useState(100)
  const [designRotation, setDesignRotation] = useState(0)
  const [textContent, setTextContent] = useState('')
  const [textStyle, setTextStyle] = useState({
    fontSize: 24,
    fontFamily: 'Arial',
    color: '#000000',
    fontWeight: 'normal',
    fontStyle: 'normal'
  })
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)

  const categories = {
    mockups: ['tshirts', 'hoodies', 'polos', 'tanks', 'sweatshirts'],
    images: ['urban', 'abstract', 'geometric', 'street-art', 'nature', 'futuristic'],
    graphics: ['illustrations', 'typography', 'shapes', 'badges', 'abstract', 'logos']
  }

  const handleResourceSelect = (resource: any, type: 'image' | 'graphic') => {
    if (resource.premium) {
      setShowPremiumModal(true)
      return
    }
    
    setSelectedDesign({ ...resource, type })
  }

  const handleMockupSelect = (mockup: any) => {
    if (mockup.premium) {
      setShowPremiumModal(true)
      return
    }
    
    setSelectedMockup(mockup)
  }

  const handleSaveDesign = () => {
    const designData = {
      mockup: selectedMockup,
      design: selectedDesign,
      position: designPosition,
      size: designSize,
      rotation: designRotation,
      text: textContent,
      textStyle,
      timestamp: new Date().toISOString()
    }
    
    onSave?.(designData)
    
    // Save to localStorage for persistence
    const savedDesigns = JSON.parse(localStorage.getItem('fashun-designs') || '[]')
    savedDesigns.push(designData)
    localStorage.setItem('fashun-designs', JSON.stringify(savedDesigns))
  }

  const renderResourceGrid = () => {
    switch (activeTab) {
      case 'mockups':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mockupTemplates.map((mockup) => (
              <div
                key={mockup.id}
                onClick={() => handleMockupSelect(mockup)}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedMockup.id === mockup.id
                    ? 'border-purple-500 shadow-lg'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="aspect-square bg-gray-100 relative">
                  <Image
                    src={mockup.image}
                    alt={mockup.name}
                    fill
                    className="object-cover"
                  />
                  {mockup.premium && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                      Pro
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {mockup.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'images':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stockImages.map((image) => (
              <div
                key={image.id}
                onClick={() => handleResourceSelect(image, 'image')}
                className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-gray-300 hover:border-purple-300 transition-all"
              >
                <div className="aspect-square bg-gray-100 relative">
                  <Image
                    src={image.url}
                    alt={image.category}
                    fill
                    className="object-cover"
                  />
                  {image.premium && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                      Pro
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <div className="flex flex-wrap gap-1">
                    {image.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'graphics':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {designGraphics.map((graphic) => (
              <div
                key={graphic.id}
                onClick={() => handleResourceSelect(graphic, 'graphic')}
                className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-gray-300 hover:border-purple-300 transition-all"
              >
                <div className="aspect-square bg-gray-100 relative flex items-center justify-center">
                  <Image
                    src={graphic.url}
                    alt={graphic.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                  {graphic.premium && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                      Pro
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {graphic.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={textStyle.fontSize}
                  onChange={(e) => setTextStyle({...textStyle, fontSize: parseInt(e.target.value)})}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{textStyle.fontSize}px</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={textStyle.color}
                  onChange={(e) => setTextStyle({...textStyle, color: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={textStyle.fontFamily}
                onChange={(e) => setTextStyle({...textStyle, fontFamily: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Impact">Impact</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
              </select>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Resources */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {(['mockups', 'images', 'graphics', 'text'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Resource Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {renderResourceGrid()}
        </div>
      </div>

      {/* Center Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Design Editor
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveDesign}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Save Design
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-8 flex items-center justify-center bg-gray-100">
          <div
            ref={canvasRef}
            className="relative bg-white rounded-lg shadow-lg overflow-hidden"
            style={{ width: '400px', height: '500px' }}
          >
            {/* Mockup Background */}
            <Image
              src={selectedMockup.image}
              alt={selectedMockup.name}
              fill
              className="object-cover"
            />
            
            {/* Design Overlay */}
            {selectedDesign && (
              <div
                className="absolute cursor-move"
                style={{
                  left: `${designPosition.x}%`,
                  top: `${designPosition.y}%`,
                  transform: `translate(-50%, -50%) rotate(${designRotation}deg) scale(${designSize / 100})`,
                  transformOrigin: 'center'
                }}
              >
                {selectedDesign.type === 'image' ? (
                  <Image
                    src={selectedDesign.url}
                    alt="Design"
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                ) : (
                  <Image
                    src={selectedDesign.url}
                    alt={selectedDesign.name}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                )}
              </div>
            )}
            
            {/* Text Overlay */}
            {textContent && (
              <div
                className="absolute cursor-move"
                style={{
                  left: `${designPosition.x}%`,
                  top: `${designPosition.y + 20}%`,
                  transform: `translate(-50%, -50%)`,
                  fontSize: `${textStyle.fontSize}px`,
                  fontFamily: textStyle.fontFamily,
                  color: textStyle.color,
                  fontWeight: textStyle.fontWeight,
                  fontStyle: textStyle.fontStyle
                }}
              >
                {textContent}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Controls */}
      <div className="w-64 bg-white border-l border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Design Controls
        </h3>
        
        {selectedDesign && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position X
              </label>
              <input
                type="range"
                min="10"
                max="90"
                value={designPosition.x}
                onChange={(e) => setDesignPosition({...designPosition, x: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Y
              </label>
              <input
                type="range"
                min="10"
                max="90"
                value={designPosition.y}
                onChange={(e) => setDesignPosition({...designPosition, y: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size ({designSize}%)
              </label>
              <input
                type="range"
                min="20"
                max="200"
                value={designSize}
                onChange={(e) => setDesignSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation ({designRotation}°)
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={designRotation}
                onChange={(e) => setDesignRotation(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">⭐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Premium Resource
                </h3>
                <p className="text-gray-600 mb-6">
                  This resource requires a premium subscription to access high-quality mockups and graphics.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPremiumModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}