'use client'

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShareIcon,
  XMarkIcon,
  LinkIcon,
  CheckIcon
} from '@heroicons/24/outline'

interface ShareOption {
  id: string
  name: string
  icon: string
  color: string
  action: (url: string, title: string, text?: string) => void
}

interface ShareButtonProps {
  url?: string
  title?: string
  text?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'floating' | 'minimal'
  showLabel?: boolean
}

export default function ShareButton({
  url,
  title = 'Check out this product!',
  text = '',
  className = '',
  size = 'md',
  variant = 'default',
  showLabel = false
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const shareOptions: ShareOption[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '📱',
      color: 'bg-green-500',
      action: (url, title, text) => {
        const message = encodeURIComponent(`${title}\n${text}\n${url}`)
        window.open(`https://wa.me/?text=${message}`, '_blank')
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600',
      action: (url, title) => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`
        window.open(shareUrl, '_blank', 'width=600,height=400')
      }
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-sky-500',
      action: (url, title, text) => {
        const tweet = encodeURIComponent(`${title} ${text}`)
        const shareUrl = `https://twitter.com/intent/tweet?text=${tweet}&url=${encodeURIComponent(url)}`
        window.open(shareUrl, '_blank', 'width=600,height=400')
      }
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      color: 'bg-pink-500',
      action: () => {
        // Instagram doesn't have direct URL sharing, so we'll copy to clipboard
        copyToClipboard()
      }
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-blue-500',
      action: (url, title, text) => {
        const message = encodeURIComponent(`${title}\n${text}\n${url}`)
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${message}`, '_blank')
      }
    },
    {
      id: 'email',
      name: 'Email',
      icon: '✉️',
      color: 'bg-gray-600',
      action: (url, title, text) => {
        const subject = encodeURIComponent(title)
        const body = encodeURIComponent(`${text}\n\nCheck it out: ${url}`)
        window.open(`mailto:?subject=${subject}&body=${body}`)
      }
    }
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    // Check if native sharing is supported
    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl
        })
        return
      } catch (error) {
        // User cancelled share or share failed
        console.log('Share cancelled or failed:', error)
      }
    }

    // Fallback to custom share menu
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option: ShareOption) => {
    option.action(shareUrl, title, text)
    setIsOpen(false)
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
        return 'bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-purple-600'
      case 'minimal':
        return 'text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
      default:
        return 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-purple-600 hover:border-purple-300 dark:hover:border-purple-600'
    }
  }

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        onClick={handleShare}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          rounded-full
          transition-all duration-200
          transform hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600
          flex items-center justify-center
          ${className}
        `}
        whileTap={{ scale: 0.95 }}
        aria-label="Share product"
      >
        <ShareIcon className={getIconSize()} />
        
        {showLabel && (
          <span className="ml-2 text-sm font-medium">
            Share
          </span>
        )}
      </motion.button>

      {/* Share Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Share Menu */}
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px] z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Share Product
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Copy Link */}
              <div className="mb-4">
                <button
                  onClick={copyToClipboard}
                  className={`w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg transition-all ${
                    copied
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${copied ? 'bg-green-500' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      {copied ? (
                        <CheckIcon className="w-4 h-4 text-white" />
                      ) : (
                        <LinkIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {copied ? 'Copied!' : 'Copy Link'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
                        {shareUrl}
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Social Share Options */}
              <div className="grid grid-cols-3 gap-3">
                {shareOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-10 h-10 ${option.color} rounded-full flex items-center justify-center text-white text-lg mb-2 group-hover:scale-110 transition-transform`}>
                      {option.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                      {option.name}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* QR Code Option (Future Enhancement) */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  className="w-full flex items-center justify-center space-x-2 p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  onClick={() => {
                    // Future: Generate QR code
                    console.log('QR Code sharing - Coming soon!')
                    setIsOpen(false)
                  }}
                >
                  <span>📱</span>
                  <span>Generate QR Code</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast for copy feedback */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center space-x-2">
              <CheckIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Link copied to clipboard!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}