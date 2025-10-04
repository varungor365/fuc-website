'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  BoltIcon,
  TagIcon,
  GiftIcon,
  HeartIcon,
  ShoppingBagIcon
} from '@heroicons/24/outline'

interface BannerConfig {
  id: string
  type: 'announcement' | 'promotion' | 'shipping' | 'holiday' | 'new-arrival'
  message: string
  subMessage?: string
  ctaText?: string
  ctaUrl?: string
  backgroundColor: string
  textColor: string
  accentColor?: string
  icon?: React.ReactNode
  dismissible?: boolean
  persistent?: boolean
  showTimer?: boolean
  expiresAt?: Date
  priority?: number
}

interface FloatingBannersProps {
  banners?: BannerConfig[]
  maxVisible?: number
  position?: 'top' | 'bottom'
  autoRotate?: boolean
  rotationInterval?: number
}

export default function FloatingBanners({
  banners = [],
  maxVisible = 2,
  position = 'top',
  autoRotate = true,
  rotationInterval = 10000
}: FloatingBannersProps) {
  const [activeBanners, setActiveBanners] = useState<BannerConfig[]>([])
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)

  // Default banners if none provided
  const defaultBanners: BannerConfig[] = [
    {
      id: 'free-shipping',
      type: 'shipping',
      message: '🚚 FREE SHIPPING on orders over ₹1999',
      subMessage: 'Limited time offer',
      ctaText: 'Shop Now',
      ctaUrl: '/collections/all',
      backgroundColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
      textColor: 'text-white',
      accentColor: 'text-green-100',
      icon: <BoltIcon className="w-4 h-4" />,
      dismissible: true,
      priority: 1
    },
    {
      id: 'new-collection',
      type: 'new-arrival',
      message: '✨ New Winter Collection is Here!',
      subMessage: 'Explore the latest trends',
      ctaText: 'Discover',
      ctaUrl: '/collections/new',
      backgroundColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      textColor: 'text-white',
      accentColor: 'text-purple-100',
      icon: <TagIcon className="w-4 h-4" />,
      dismissible: true,
      priority: 2
    },
    {
      id: 'flash-sale',
      type: 'promotion',
      message: '⚡ FLASH SALE: Up to 50% OFF',
      subMessage: 'Ends in 24 hours',
      ctaText: 'Shop Sale',
      ctaUrl: '/sale',
      backgroundColor: 'bg-gradient-to-r from-red-500 to-pink-600',
      textColor: 'text-white',
      accentColor: 'text-red-100',
      icon: <GiftIcon className="w-4 h-4" />,
      dismissible: true,
      showTimer: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      priority: 3
    }
  ]

  const allBanners = banners.length > 0 ? banners : defaultBanners

  // Load dismissed banners from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('fashun_dismissed_banners')
    if (dismissed) {
      try {
        setDismissedBanners(new Set(JSON.parse(dismissed)))
      } catch (error) {
        console.error('Failed to parse dismissed banners:', error)
      }
    }
  }, [])

  // Filter and sort active banners
  useEffect(() => {
    const now = new Date()
    const validBanners = allBanners
      .filter(banner => {
        // Check if banner is dismissed
        if (dismissedBanners.has(banner.id) && !banner.persistent) {
          return false
        }
        
        // Check if banner has expired
        if (banner.expiresAt && banner.expiresAt < now) {
          return false
        }
        
        return true
      })
      .sort((a, b) => (a.priority || 0) - (b.priority || 0))
      .slice(0, maxVisible)

    setActiveBanners(validBanners)
  }, [allBanners, dismissedBanners, maxVisible])

  // Auto-rotate banners
  useEffect(() => {
    if (!autoRotate || activeBanners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length)
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [autoRotate, activeBanners.length, rotationInterval])

  const dismissBanner = (bannerId: string) => {
    const newDismissed = new Set(dismissedBanners)
    newDismissed.add(bannerId)
    setDismissedBanners(newDismissed)
    
    // Save to localStorage
    localStorage.setItem('fashun_dismissed_banners', JSON.stringify([...newDismissed]))
  }

  if (activeBanners.length === 0) {
    return null
  }

  const positionClasses = position === 'top' 
    ? 'top-0' 
    : 'bottom-0'

  return (
    <div className={`fixed left-0 right-0 z-40 ${positionClasses}`}>
      <AnimatePresence mode="wait">
        {activeBanners.slice(currentIndex, currentIndex + 1).map((banner) => (
          <BannerItem
            key={banner.id}
            banner={banner}
            onDismiss={dismissBanner}
          />
        ))}
      </AnimatePresence>

      {/* Banner Indicators */}
      {activeBanners.length > 1 && (
        <div className="flex justify-center space-x-2 pb-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface BannerItemProps {
  banner: BannerConfig
  onDismiss: (bannerId: string) => void
}

function BannerItem({ banner, onDismiss }: BannerItemProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  // Timer countdown
  useEffect(() => {
    if (!banner.showTimer || !banner.expiresAt) return

    const updateTimer = () => {
      const now = new Date()
      const diff = banner.expiresAt!.getTime() - now.getTime()
      
      if (diff <= 0) {
        setTimeLeft('EXPIRED')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [banner.showTimer, banner.expiresAt])

  const handleCTA = () => {
    if (banner.ctaUrl) {
      window.location.href = banner.ctaUrl
    }
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`${banner.backgroundColor} ${banner.textColor} relative`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Left Content */}
          <div className="flex items-center space-x-3 flex-1">
            {banner.icon && (
              <div className="flex-shrink-0">
                {banner.icon}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-semibold text-sm md:text-base">
                    {banner.message}
                  </p>
                  {banner.subMessage && (
                    <p className={`text-xs md:text-sm ${banner.accentColor || 'opacity-90'}`}>
                      {banner.subMessage}
                    </p>
                  )}
                </div>

                {/* Timer */}
                {banner.showTimer && timeLeft && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono bg-black/20 px-2 py-1 rounded">
                      ⏰ {timeLeft}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* CTA Button */}
            {banner.ctaText && (
              <motion.button
                onClick={handleCTA}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                whileTap={{ scale: 0.95 }}
              >
                {banner.ctaText}
              </motion.button>
            )}

            {/* Dismiss Button */}
            {banner.dismissible && (
              <motion.button
                onClick={() => onDismiss(banner.id)}
                className="p-2 text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <XMarkIcon className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
      </div>
    </motion.div>
  )
}

// Hook for managing banners
export function useBanners() {
  const [customBanners, setCustomBanners] = useState<BannerConfig[]>([])

  const addBanner = React.useCallback((banner: Omit<BannerConfig, 'id'>) => {
    const newBanner: BannerConfig = {
      ...banner,
      id: Math.random().toString(36).substr(2, 9)
    }
    setCustomBanners(prev => [...prev, newBanner])
  }, [])

  const removeBanner = React.useCallback((bannerId: string) => {
    setCustomBanners(prev => prev.filter(banner => banner.id !== bannerId))
  }, [])

  const clearBanners = React.useCallback(() => {
    setCustomBanners([])
  }, [])

  // Pre-built banner creators
  const createPromoBanner = React.useCallback((message: string, discount: string, ctaUrl?: string) => {
    addBanner({
      type: 'promotion',
      message: `🎉 ${message}`,
      subMessage: `Save ${discount} - Limited time only`,
      ctaText: 'Shop Now',
      ctaUrl: ctaUrl || '/collections/all',
      backgroundColor: 'bg-gradient-to-r from-red-500 to-pink-600',
      textColor: 'text-white',
      accentColor: 'text-red-100',
      icon: <TagIcon className="w-4 h-4" />,
      dismissible: true,
      priority: 1
    })
  }, [addBanner])

  const createShippingBanner = React.useCallback((threshold: number) => {
    addBanner({
      type: 'shipping',
      message: `🚚 FREE SHIPPING on orders over ₹${threshold.toLocaleString()}`,
      subMessage: 'No minimum purchase required',
      ctaText: 'Start Shopping',
      ctaUrl: '/collections/all',
      backgroundColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
      textColor: 'text-white',
      accentColor: 'text-green-100',
      icon: <BoltIcon className="w-4 h-4" />,
      dismissible: true,
      priority: 2
    })
  }, [addBanner])

  const createNewArrivalBanner = React.useCallback((collection: string, ctaUrl?: string) => {
    addBanner({
      type: 'new-arrival',
      message: `✨ New ${collection} Collection Available!`,
      subMessage: 'Explore the latest trends',
      ctaText: 'Discover',
      ctaUrl: ctaUrl || '/collections/new',
      backgroundColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      textColor: 'text-white',
      accentColor: 'text-purple-100',
      icon: <HeartIcon className="w-4 h-4" />,
      dismissible: true,
      priority: 3
    })
  }, [addBanner])

  return {
    banners: customBanners,
    addBanner,
    removeBanner,
    clearBanners,
    createPromoBanner,
    createShippingBanner,
    createNewArrivalBanner
  }
}