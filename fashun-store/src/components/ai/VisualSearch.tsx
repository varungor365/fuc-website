'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CameraIcon,
  PhotoIcon,
  XMarkIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  CloudArrowUpIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface VisualSearchResult {
  id: string
  name: string
  price: number
  image: string
  similarity: number
  category: string
  brand: string
  inStock: boolean
}

interface AnalysisResult {
  dominantColors: string[]
  detectedItems: string[]
  style: string
  category: string
  confidence: number
  suggestions: string[]
}

interface VisualSearchProps {
  isOpen: boolean
  onClose: () => void
  onSearchResults?: (results: VisualSearchResult[]) => void
  className?: string
}

const VisualSearch: React.FC<VisualSearchProps> = ({
  isOpen,
  onClose,
  onSearchResults,
  className = ''
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [searchResults, setSearchResults] = useState<VisualSearchResult[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [step, setStep] = useState<'upload' | 'analyzing' | 'results'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setUploadedImage(result)
      startAnalysis(result)
    }
    reader.readAsDataURL(file)
  }

  const startAnalysis = async (imageData: string) => {
    setStep('analyzing')
    setIsAnalyzing(true)

    // Simulate AI image analysis
    await new Promise(resolve => setTimeout(resolve, 3000))

    const mockAnalysis: AnalysisResult = {
      dominantColors: ['#000000', '#FFFFFF', '#3B82F6'],
      detectedItems: ['hoodie', 'casual wear', 'streetwear'],
      style: 'streetwear',
      category: 'hoodies',
      confidence: 92,
      suggestions: [
        'Black oversized hoodie detected',
        'Casual streetwear style identified',
        'Found similar products in our collection'
      ]
    }

    const mockResults: VisualSearchResult[] = [
      {
        id: '1',
        name: 'Oversized Black Hoodie',
        price: 2499,
        image: '/api/placeholder/300/400',
        similarity: 94,
        category: 'hoodies',
        brand: 'FUC!',
        inStock: true
      },
      {
        id: '2',
        name: 'Classic Streetwear Hoodie',
        price: 2299,
        image: '/api/placeholder/300/400',
        similarity: 89,
        category: 'hoodies',
        brand: 'FUC!',
        inStock: true
      },
      {
        id: '3',
        name: 'Urban Style Pullover',
        price: 2799,
        image: '/api/placeholder/300/400',
        similarity: 85,
        category: 'hoodies',
        brand: 'FUC!',
        inStock: false
      },
      {
        id: '4',
        name: 'Graphic Print Hoodie',
        price: 2599,
        image: '/api/placeholder/300/400',
        similarity: 82,
        category: 'hoodies',
        brand: 'FUC!',
        inStock: true
      }
    ]

    setAnalysisResult(mockAnalysis)
    setSearchResults(mockResults)
    setIsAnalyzing(false)
    setStep('results')
    onSearchResults?.(mockResults)
  }

  const resetSearch = () => {
    setUploadedImage(null)
    setAnalysisResult(null)
    setSearchResults([])
    setStep('upload')
  }

  const openCamera = () => {
    // In a real implementation, this would open the device camera
    alert('Camera functionality would be implemented here')
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
          className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl">Visual Search</h3>
                <p className="text-white/80 text-sm">Find products using images</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {step === 'upload' && (
              <div className="space-y-6">
                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                      <PhotoIcon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium text-lg mb-2">Drop an image or click to upload</h4>
                      <p className="text-gray-400 text-sm">
                        Upload a photo of clothing to find similar products
                      </p>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <CloudArrowUpIcon className="w-5 h-5" />
                        <span>Choose File</span>
                      </button>
                      
                      <button
                        onClick={openCamera}
                        className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center space-x-2"
                      >
                        <CameraIcon className="w-5 h-5" />
                        <span>Camera</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-3 flex items-center space-x-2">
                    <SparklesIcon className="w-5 h-5 text-purple-400" />
                    <span>Pro Tips</span>
                  </h5>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Use clear, well-lit photos for best results</li>
                    <li>• Focus on the main item you want to find</li>
                    <li>• Avoid cluttered backgrounds</li>
                    <li>• High-resolution images work better</li>
                  </ul>
                </div>
              </div>
            )}

            {step === 'analyzing' && (
              <div className="text-center py-12">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <SparklesIcon className="w-10 h-10 text-white" />
                </motion.div>
                
                <h4 className="text-white font-semibold text-xl mb-2">Analyzing your image...</h4>
                <p className="text-gray-400 mb-6">Our AI is identifying products and finding matches</p>
                
                {uploadedImage && (
                  <div className="relative w-48 h-64 mx-auto rounded-lg overflow-hidden">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded image"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}

                <div className="mt-6 space-y-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto max-w-xs"
                  />
                  <p className="text-gray-400 text-sm">Processing image...</p>
                </div>
              </div>
            )}

            {step === 'results' && analysisResult && (
              <div className="space-y-6">
                {/* Analysis Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    {uploadedImage && (
                      <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                        <Image
                          src={uploadedImage}
                          alt="Uploaded image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <button
                      onClick={resetSearch}
                      className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Search Another Image
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        <h5 className="text-white font-medium">Analysis Complete</h5>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                          {analysisResult.confidence}% confidence
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Detected Category</p>
                          <p className="text-white capitalize">{analysisResult.category}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Style</p>
                          <p className="text-white capitalize">{analysisResult.style}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Dominant Colors</p>
                          <div className="flex space-x-2">
                            {analysisResult.dominantColors.map((color, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full border border-gray-600"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-900/30 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-2">AI Insights</h5>
                      <ul className="space-y-1">
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Search Results */}
                <div>
                  <h4 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    <span>Similar Products ({searchResults.length})</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800 transition-all border border-gray-700 hover:border-gray-600"
                      >
                        <div className="relative">
                          <Image
                            src={result.image}
                            alt={result.name}
                            width={300}
                            height={400}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            {result.similarity}% match
                          </div>
                          {!result.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">Out of Stock</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3">
                          <h6 className="text-white font-medium text-sm mb-1 truncate">{result.name}</h6>
                          <p className="text-gray-400 text-xs mb-2">{result.brand}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold">₹{result.price.toLocaleString()}</span>
                            <button className="bg-purple-600 text-white text-xs px-3 py-1 rounded hover:bg-purple-700 transition-colors">
                              View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VisualSearch