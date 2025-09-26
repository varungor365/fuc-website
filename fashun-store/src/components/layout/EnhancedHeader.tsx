'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  UserIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { pagefonts } from '@/lib/simpleFonts';
import { NavigationItem } from './MegaMenu';

interface NavItem {
  name: string;
  href: string;
  featured?: boolean;
}

const navItems: NavItem[] = [
  { name: 'T-Shirts', href: '/collections/t-shirts' },
  { name: 'Hoodies', href: '/collections/hoodies' },
  { name: 'Shirts', href: '/collections/shirts' },
  { name: 'Pants', href: '/collections/pants' },
  { name: 'Jackets', href: '/collections/jackets' },
  { name: 'New Arrivals', href: '/collections/new-arrivals', featured: true },
  { name: 'Sale', href: '/collections/sale', featured: true },
];

const EnhancedHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-primary-900/90 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative w-12 h-12"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image
                  src="/logo.png"
                  alt="FASHUN.CO Logo"
                  fill
                  className="object-contain"
                />
              </motion.div>
              <motion.h1 
                className={`${pagefonts.headers.primary.className} text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-pink-300 group-hover:to-orange-300 transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
              >
                FASHUN.CO
              </motion.h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <NavigationItem name="T-Shirts" href="/collections/t-shirts" hasDropdown={true} />
              <NavigationItem name="Hoodies" href="/collections/hoodies" hasDropdown={true} />
              <NavigationItem name="Shirts" href="/collections/shirts" />
              <NavigationItem name="Pants" href="/collections/pants" />
              <NavigationItem name="Jackets" href="/collections/jackets" />
              <Link
                href="/collections/new-arrivals"
                className={`relative group ${pagefonts.homepage.secondary.className} font-medium transition-all duration-300 text-blue-400 hover:text-blue-300`}
              >
                New Arrivals
                <SparklesIcon className="absolute -top-2 -right-2 w-4 h-4 text-blue-400 animate-pulse" />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/collections/sale"
                className={`relative group ${pagefonts.homepage.secondary.className} font-medium transition-all duration-300 text-red-400 hover:text-red-300`}
              >
                Sale
                <SparklesIcon className="absolute -top-2 -right-2 w-4 h-4 text-red-400 animate-pulse" />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.button
                onClick={() => setIsSearchOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
              >
                {isDarkMode ? (
                  <SunIcon className="w-5 h-5 text-yellow-400" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-purple-400" />
                )}
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hidden sm:flex w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center hover:bg-white/20 transition-all duration-300 relative"
              >
                <HeartIcon className="w-5 h-5 text-white" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                <ShoppingBagIcon className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* User Account */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hidden sm:flex w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center hover:bg-white/20 transition-all duration-300"
              >
                <UserIcon className="w-5 h-5 text-white" />
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-5 h-5 text-white" />
                ) : (
                  <Bars3Icon className="w-5 h-5 text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-primary-900/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-3 px-4 rounded-xl transition-all duration-300 ${
                      item.featured
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={pagefonts.homepage.secondary.className}>
                        {item.name}
                      </span>
                      {item.featured && (
                        <SparklesIcon className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                  </Link>
                ))}
                
                {/* Mobile Actions */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <button className="w-full py-3 px-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-3">
                    <UserIcon className="w-5 h-5" />
                    <span>Account</span>
                  </button>
                  <button className="w-full py-3 px-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-3">
                    <HeartIcon className="w-5 h-5" />
                    <span>Wishlist</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="bg-primary-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4 mb-6">
                <MagnifyingGlassIcon className="w-8 h-8 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search for products, styles, or trends..."
                  className="flex-1 bg-transparent text-white text-xl placeholder-gray-400 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {/* Quick Search Suggestions */}
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Hoodies', 'Streetwear', 'AI Recommendations', 'New Arrivals', 'Trending'].map((term) => (
                    <button
                      key={term}
                      className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
};

export default EnhancedHeader;