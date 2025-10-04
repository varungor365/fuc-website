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
} from '@heroicons/24/outline'
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/24/solid'

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

interface QuickViewProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (productId: string, size: string, color: string) => void
  onToggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export default function ProductQuickView({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist
}: QuickViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
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

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handlePreviousImage = () => {
    if (!product) return
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    if (!product) return
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return
    
    setIsAddingToCart(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      onAddToCart(product.id, selectedSize, selectedColor)
      setShowSuccess(true)
      
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleShare = async () => {
    if (!product) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: `/products/${product.id}`
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback - copy to clipboard
      const url = `${window.location.origin}/products/${product.id}`
      navigator.clipboard.writeText(url)
    }
  }

  if (!product) return null

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Quick View
                </h2>
                {product.isNew && (
                  <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                    NEW
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                    -{discount}%
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  {isInWishlist(product.id) ? (
                    <HeartIconSolid className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
              {/* Image Gallery */}
              <div className="lg:w-1/2 relative">
                {/* Main Image */}
                <div 
                  ref={imageRef}
                  className="relative h-64 lg:h-full bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-zoom-in"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  <Image
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    fill
                    className={`object-cover transition-transform duration-300 ${
                      isZoomed ? 'scale-150' : 'scale-100'
                    }`}
                    style={isZoomed ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                    } : {}}
                  />
                  
                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePreviousImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-900 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-900 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4">
                    <MagnifyingGlassPlusIcon className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                {product.images.length > 1 && (
                  <div className="flex space-x-2 p-4 bg-gray-50 dark:bg-gray-800">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-purple-500 ring-2 ring-purple-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="lg:w-1/2 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Product Info */}
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h1>
                    
                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            star <= product.rating! ? (
                              <StarIconSolid key={star} className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <StarIcon key={star} className="w-4 h-4 text-gray-300" />
                            )
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({product.reviews || 0} reviews)
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Size Selection */}
                  {product.sizes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Size
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                              selectedSize === size
                                ? 'border-purple-500 bg-purple-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-300'
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Color: {selectedColor}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-full border-2 ${
                              selectedColor === color
                                ? 'border-purple-500 ring-2 ring-purple-200'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          >
                            {selectedColor === color && (
                              <CheckIcon className="w-4 h-4 text-white mx-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Quantity
                    </h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[40px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || !selectedSize || !product.inStock}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                        !product.inStock
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isAddingToCart
                          ? 'bg-purple-400 text-white cursor-wait'
                          : selectedSize
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isAddingToCart ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Adding to Cart...</span>
                        </>
                      ) : showSuccess ? (
                        <>
                          <CheckIcon className="w-5 h-5" />
                          <span>Added to Cart!</span>
                        </>
                      ) : !product.inStock ? (
                        <span>Out of Stock</span>
                      ) : !selectedSize ? (
                        <span>Please Select Size</span>
                      ) : (
                        <>
                          <ShoppingBagIcon className="w-5 h-5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    {/* Stock Status */}
                    {product.inStock && (
                      <p className="text-sm text-green-600 dark:text-green-400 text-center">
                        ✓ In Stock - Ready to ship
                      </p>
                    )}
                  </div>

                  {/* Product Features */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Features
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Premium quality materials</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Free shipping on orders over ₹1999</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>30-day return policy</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Secure payment options</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}