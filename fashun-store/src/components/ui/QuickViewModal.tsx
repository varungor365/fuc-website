'use client'

import * as React from 'react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  XMarkIcon, 
  HeartIcon,
  ShareIcon,
  MagnifyingGlassPlusIcon,
  ShoppingBagIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  rating?: number
  reviews?: number
  inStock: boolean
  isNew?: boolean
  isFeatured?: boolean
}

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose
}: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0)
      setSelectedSize('')
      setSelectedColor('')
      setQuantity(1)
      setIsZoomed(false)
      setShowSuccess(false)
    }
  }, [product])

  // Handle image zoom
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return
    
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          handlePreviousImage()
          break
        case 'ArrowRight':
          handleNextImage()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handlePreviousImage = () => {
    if (!product) return
    setCurrentImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    if (!product) return
    setCurrentImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !selectedColor) return
    
    setIsAddingToCart(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsAddingToCart(false)
    setShowSuccess(true)
    
    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist)
  }

  const handleShare = async () => {
    if (!product) return
    
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      })
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (!product) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center"
          >
            <div className="bg-primary-900/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-6xl max-h-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Quick View</h2>
                <button
                  onClick={onClose}
                  className="text-primary-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
                {/* Image Gallery */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div 
                    ref={imageRef}
                    className="relative aspect-square bg-primary-800/30 rounded-xl overflow-hidden cursor-zoom-in group"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                  >
                    <Image
                      src={product.images[currentImageIndex]}
                      alt={product.name}
                      fill
                      className={`object-cover transition-transform duration-300 ${
                        isZoomed ? 'scale-150' : 'scale-100'
                      }`}
                      style={{
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                      }}
                    />
                    
                    {/* Navigation Buttons */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRightIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Zoom Icon */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MagnifyingGlassPlusIcon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            currentImageIndex === index
                              ? 'border-accent-500'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  {/* Product Info */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h1 className="text-2xl font-bold text-white">{product.name}</h1>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleWishlist}
                          className="text-primary-400 hover:text-accent-400 transition-colors"
                        >
                          {isInWishlist ? (
                            <HeartIconSolid className="w-6 h-6 text-red-500" />
                          ) : (
                            <HeartIcon className="w-6 h-6" />
                          )}
                        </button>
                        <button
                          onClick={handleShare}
                          className="text-primary-400 hover:text-accent-400 transition-colors"
                        >
                          <ShareIcon className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-bold text-accent-400">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-primary-400 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating!)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-primary-400'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-primary-300">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-primary-300 mb-6">{product.description}</p>
                  </div>

                  {/* Size Selection */}
                  {product.sizes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">Size</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                              selectedSize === size
                                ? 'border-accent-500 bg-accent-500/20 text-accent-400'
                                : 'border-white/20 hover:border-white/40 text-primary-300 hover:text-white'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  {product.colors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">Color</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                              selectedColor === color
                                ? 'border-accent-500 bg-accent-500/20 text-accent-400'
                                : 'border-white/20 hover:border-white/40 text-primary-300 hover:text-white'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">Quantity</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-white/20 hover:border-white/40 text-primary-300 hover:text-white transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-white font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg border border-white/20 hover:border-white/40 text-primary-300 hover:text-white transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !selectedSize || !selectedColor || !product.inStock}
                    className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Adding to Cart...
                      </div>
                    ) : showSuccess ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckIcon className="w-5 h-5" />
                        Added to Cart!
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <ShoppingBagIcon className="w-5 h-5" />
                        Add to Cart
                      </div>
                    )}
                  </button>

                  {/* Stock Status */}
                  <div className="text-sm">
                    {product.inStock ? (
                      <span className="text-green-400">✓ In Stock</span>
                    ) : (
                      <span className="text-red-400">✗ Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}