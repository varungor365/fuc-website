'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  UserIcon,
  HeartIcon,
  ShoppingBagIcon,
  Bars3Icon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useCartStore, useWishlistStore, useUIStore } from '@/stores'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const cartItemCount = useCartStore(state => state.getItemCount())
  const wishlistItems = useWishlistStore(state => state.items)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-primary-900/95 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="font-hero text-2xl lg:text-3xl text-white">
              FASHUN
              <span className="text-accent-500">.CO</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link href="/collections/new-arrivals" className="text-white/80 hover:text-white font-medium">
              New Arrivals
            </Link>
            <Link href="/collections/t-shirts" className="text-white/80 hover:text-white font-medium">
              T-Shirts
            </Link>
            <Link href="/collections/hoodies" className="text-white/80 hover:text-white font-medium">
              Hoodies
            </Link>
            <Link href="/outfit-builder" className="text-accent-400 hover:text-accent-300 font-medium flex items-center">
              <SparklesIcon className="w-4 h-4 mr-1" />
              AI Assistant
            </Link>
            <Link href="/search" className="text-white/80 hover:text-white font-medium">
              Search
            </Link>
            <Link href="/collections/sale" className="text-accent-400 font-accent text-sm font-medium">
              Sale
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="btn-ghost p-2">
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
            <Link href="/auth/login" className="btn-ghost p-2">
              <UserIcon className="w-6 h-6" />
            </Link>
            <Link href="/wishlist" className="btn-ghost p-2 relative">
              <HeartIcon className="w-6 h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-400 text-primary-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <button className="btn-ghost p-2 relative">
              <ShoppingBagIcon className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-400 text-primary-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}