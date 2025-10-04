'use client'

import * as React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ShoppingBagIcon,
  HeartIcon,
  StarIcon as StarOutline
} from '@heroicons/24/outline'
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/24/solid'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  rating?: number
  reviews?: number
  isNew?: boolean
  isFeatured?: boolean
  isLimited?: boolean
  inStock: boolean
}

interface ProductCarouselProps {
  products: Product[]
  title?: string
  subtitle?: string
  itemsPerView?: number
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  className?: string
  onProductClick?: (product: Product) => void
  onAddToCart?: (productId: string) => void
  onToggleWishlist?: (productId: string) => void
  isInWishlist?: (productId: string) => boolean
}

export default function ProductCarousel({
  products,
  title,
  subtitle,
  itemsPerView = 4,
  autoPlay = false,
  autoPlayInterval = 4000,
  showDots = true,
  showArrows = true,
  className = '',
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = () => false
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const maxIndex = Math.max(0, products.length - itemsPerView)

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && products.length > itemsPerView) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1))
      }, autoPlayInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, maxIndex, autoPlayInterval, itemsPerView, products.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
  }, [maxIndex])

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    setIsDragging(false)
    const threshold = 50
    
    if (info.offset.x > threshold) {
      goToPrevious()
    } else if (info.offset.x < -threshold) {
      goToNext()
    }
  }, [goToPrevious, goToNext])

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev)
  }

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false)
  }

  const resumeAutoPlay = () => {
    if (autoPlay) setIsAutoPlaying(true)
  }

  // Responsive items per view
  const getResponsiveItemsPerView = () => {
    if (typeof window === 'undefined') return itemsPerView
    
    const width = window.innerWidth
    if (width < 640) return 1
    if (width < 768) return 2
    if (width < 1024) return 3
    return itemsPerView
  }

  const [responsiveItemsPerView, setResponsiveItemsPerView] = useState(itemsPerView)

  useEffect(() => {
    const handleResize = () => {
      setResponsiveItemsPerView(getResponsiveItemsPerView())
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [itemsPerView])

  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No products to display</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Carousel Container */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={pauseAutoPlay}
        onMouseLeave={resumeAutoPlay}
      >
        {/* Navigation Arrows */}
        {showArrows && products.length > responsiveItemsPerView && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous products"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next products"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Auto-play Toggle */}
        {autoPlay && (
          <button
            onClick={toggleAutoPlay}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full shadow-lg transition-all duration-200"
            aria-label={isAutoPlaying ? 'Pause autoplay' : 'Resume autoplay'}
          >
            {isAutoPlaying ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Products Grid */}
        <motion.div
          className="flex transition-transform duration-300 ease-out"
          animate={{
            x: `-${currentIndex * (100 / responsiveItemsPerView)}%`
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{
            width: `${(products.length / responsiveItemsPerView) * 100}%`
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className={`flex-shrink-0 px-2`}
              style={{ width: `${100 / products.length}%` }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {product.isNew && (
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                    {product.isLimited && (
                      <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        LIMITED
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-opacity duration-200 ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        onToggleWishlist?.(product.id)
                      }}
                      className="p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      {isInWishlist(product.id) ? (
                        <HeartSolid className="w-4 h-4 text-red-500" />
                      ) : (
                        <HeartIcon className="w-4 h-4" />
                      )}
                    </button>

                    {/* Quick Add to Cart */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        onAddToCart?.(product.id)
                      }}
                      disabled={!product.inStock}
                      className={`p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
                        product.inStock
                          ? 'bg-purple-500 hover:bg-purple-600 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBagIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wide">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          star <= product.rating! ? (
                            <StarSolid key={star} className="w-3 h-3 text-yellow-400" />
                          ) : (
                            <StarOutline key={star} className="w-3 h-3 text-gray-300" />
                          )
                        ))}
                      </div>
                      {product.reviews && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({product.reviews})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/products/${product.id}`}
                    onClick={() => onProductClick?.(product)}
                    className="block w-full"
                  >
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      {showDots && products.length > responsiveItemsPerView && (
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-purple-600 w-8'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar (for auto-play) */}
      {isAutoPlaying && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: autoPlayInterval / 1000,
                ease: 'linear',
                repeat: Infinity
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}