'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

interface WishlistButtonProps {
  productId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  variant?: 'default' | 'floating' | 'minimal'
  onWishlistChange?: (productId: string, isInWishlist: boolean) => void
}

export default function WishlistButton({
  productId,
  className = '',
  size = 'md',
  showLabel = false,
  variant = 'default',
  onWishlistChange
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  // Load wishlist state from localStorage
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('fashun_wishlist') || '[]')
    setIsInWishlist(wishlist.includes(productId))
  }, [productId])

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)
    setShowAnimation(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))

      const wishlist = JSON.parse(localStorage.getItem('fashun_wishlist') || '[]')
      let newWishlist: string[]

      if (isInWishlist) {
        // Remove from wishlist
        newWishlist = wishlist.filter((id: string) => id !== productId)
      } else {
        // Add to wishlist
        newWishlist = [...wishlist, productId]
      }

      localStorage.setItem('fashun_wishlist', JSON.stringify(newWishlist))
      setIsInWishlist(!isInWishlist)
      
      // Call callback if provided
      onWishlistChange?.(productId, !isInWishlist)

      // Reset animation after a delay
      setTimeout(() => {
        setShowAnimation(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to update wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6 p-1'
      case 'lg':
        return 'w-12 h-12 p-3'
      default:
        return 'w-8 h-8 p-2'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'lg':
        return 'w-6 h-6'
      default:
        return 'w-4 h-4'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'floating':
        return `bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white shadow-lg hover:shadow-xl ${
          isInWishlist 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-600 hover:text-red-500'
        }`
      case 'minimal':
        return `${
          isInWishlist 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-red-500'
        } hover:bg-red-50 dark:hover:bg-red-900/20`
      default:
        return `border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-red-300 dark:hover:border-red-600 ${
          isInWishlist 
            ? 'text-red-500 border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
            : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
        }`
    }
  }

  return (
    <motion.button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`
        ${getSizeClasses()}
        ${getVariantClasses()}
        rounded-full
        transition-all duration-200
        transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-600
        relative
        ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
        ${className}
      `}
      whileTap={{ scale: 0.95 }}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`${getIconSize()} animate-spin`}
          >
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="32"
                strokeDashoffset="32"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="32;0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </motion.div>
        ) : isInWishlist ? (
          <motion.div
            key="filled"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <HeartIconSolid className={`${getIconSize()} text-red-500`} />
          </motion.div>
        ) : (
          <motion.div
            key="outline"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <HeartIcon className={getIconSize()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hearts animation */}
      <AnimatePresence>
        {showAnimation && isInWishlist && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0.5, 
                  x: 0, 
                  y: 0,
                  rotate: 0 
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 1.5, 
                  x: (Math.random() - 0.5) * 40,
                  y: -30 - Math.random() * 20,
                  rotate: (Math.random() - 0.5) * 90
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.1,
                  ease: 'easeOut'
                }}
                className="absolute inset-0 pointer-events-none"
              >
                <HeartIconSolid className="w-3 h-3 text-red-500 mx-auto" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Pulse effect for added to wishlist */}
      <AnimatePresence>
        {showAnimation && isInWishlist && (
          <motion.div
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 border-2 border-red-500 rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Label */}
      {showLabel && (
        <motion.span 
          className="ml-2 text-sm font-medium"
          animate={{ 
            color: isInWishlist ? '#ef4444' : 'currentColor' 
          }}
          transition={{ duration: 0.2 }}
        >
          {isInWishlist ? 'Saved' : 'Save'}
        </motion.span>
      )}

      {/* Tooltip for minimal variant */}
      {variant === 'minimal' && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          whileHover={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10"
        >
          {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </motion.div>
      )}
    </motion.button>
  )
}

// Hook for wishlist management
export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    // Load wishlist from localStorage on mount
    const stored = localStorage.getItem('fashun_wishlist')
    if (stored) {
      try {
        setWishlist(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error)
        setWishlist([])
      }
    }

    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fashun_wishlist' && e.newValue) {
        try {
          setWishlist(JSON.parse(e.newValue))
        } catch (error) {
          console.error('Failed to parse wishlist from storage event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const addToWishlist = (productId: string) => {
    const newWishlist = [...wishlist, productId]
    setWishlist(newWishlist)
    localStorage.setItem('fashun_wishlist', JSON.stringify(newWishlist))
  }

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter(id => id !== productId)
    setWishlist(newWishlist)
    localStorage.setItem('fashun_wishlist', JSON.stringify(newWishlist))
  }

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }

  const isInWishlist = (productId: string) => wishlist.includes(productId)
  
  const clearWishlist = () => {
    setWishlist([])
    localStorage.removeItem('fashun_wishlist')
  }

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length
  }
}