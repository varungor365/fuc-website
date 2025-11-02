'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, ShoppingBagIcon as ShoppingBagSolidIcon } from '@heroicons/react/24/solid';
import { 
  ShoppingCart, 
  Palette, 
  Shirt, 
  Package, 
  Layers,
  TruckIcon,
  LogIn,
  User
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import CartDrawer from '@/components/cart/CartDrawer';
import { useAuth } from '@/contexts/auth-context';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import {
  TruckIcon as TruckAnimated,
  GiftIcon,
  AnimatedIcon
} from '@/components/icons/AnimatedIcons';

const navigationItems = [
  {
    name: 'Shop',
    href: '/collections/all',
    megaMenu: {
      categories: [
        { name: 'Printed T-Shirts', href: '/collections/printed-tshirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop', badge: 'Popular' },
        { name: 'Full Sleeve T-Shirts', href: '/collections/full-sleeve-tshirts', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=200&h=200&fit=crop', badge: 'Trending' },
        { name: 'Polo T-Shirts', href: '/collections/polo-tshirts', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=200&h=200&fit=crop' },
        { name: "Women's T-Shirts", href: '/collections/womens-tshirts', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200&h=200&fit=crop', badge: 'New' },
        { name: 'Crop Tops', href: '/collections/crop-tops', image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=200&h=200&fit=crop', badge: 'Trending' },
        { name: 'Plus Size T-Shirts', href: '/collections/plus-size-tshirts', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200&h=200&fit=crop' },
        { name: 'Plain T-Shirts & Packs', href: '/collections/plain-tshirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop', badge: 'Value' },
        { name: 'Hoodies', href: '/collections/hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop' },
        { name: 'Oversized Hoodies', href: '/collections/oversized-hoodies', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&h=200&fit=crop', badge: 'Street Style' },
        { name: 'Sweatshirts', href: '/collections/sweatshirts', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=200&h=200&fit=crop' }
      ],
      featured: [
        { name: 'New Arrivals', href: '/collections/new-arrivals', description: 'Latest drops & fresh designs' },
        { name: 'Best Sellers', href: '/collections/best-sellers', description: 'Customer favorites' },
        { name: 'Combo Packs', href: '/collections/combo-packs', description: 'Value deals & bundles' },
        { name: 'Sale Items', href: '/collections/sale', description: 'Up to 50% off' }
      ]
    }
  },
  { name: 'Customize Your Look', href: '/customize', badge: '🎨 NEW' },
  { name: 'Printed Tees', href: '/collections/printed-tshirts' },
  { name: 'Plain & Combos', href: '/collections/plain-tshirts' },
  { name: 'Hoodies', href: '/collections/hoodies' },
  { name: 'Women', href: '/collections/womens-tshirts' }
];

export default function Header() {
  const { user, loading, isAnonymous } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMegaMenu, setShowMegaMenu] = useState<string | null>(null);
  
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setShowMegaMenu(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <motion.header
        ref={headerRef}
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'glass backdrop-blur-xl bg-white/90 shadow-2xl border-b border-white/30 transform scale-[0.98]' 
            : 'bg-white/95 backdrop-blur-sm shadow-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Main Header - Made Smaller */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Logo - Clean and Professional */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center">
                <div className="flex items-center gap-3">
                  {/* Official FASHUN.CO Logo */}
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-lg">F</span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xl font-black text-black tracking-tight">
                      FASHUN.CO
                    </div>
                    <div className="text-xs text-gray-500 leading-none -mt-1">
                      PREMIUM STREETWEAR
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation - Smaller and More Compact */}
            <nav className="hidden lg:flex items-center gap-2">
              {[
                { title: 'Shop', icon: ShoppingCart, href: '/collections/all' },
                { title: 'Customize', icon: Palette, href: '/customize', badge: '🎨' },
                { title: 'Printed Tees', icon: Shirt, href: '/collections/printed-tshirts' },
                { title: 'Hoodies', icon: Package, href: '/collections/hoodies' },
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.title}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                      className={`
                        group relative flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm
                        transition-all duration-300 
                        ${isActive 
                          ? 'bg-black text-white shadow-md' 
                          : 'bg-white/60 backdrop-blur-sm hover:bg-gray-50 text-gray-700 hover:text-black'
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      <span className="whitespace-nowrap">{item.title}</span>
                      {item.badge && (
                        <span className="text-xs">{item.badge}</span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Search Bar - Smaller */}
            <div className="hidden md:flex flex-1 max-w-sm mx-6">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-sm"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              </form>
            </div>

            {/* Action Buttons - Smaller and More Compact */}
            <div className="flex items-center space-x-2">
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center space-x-2">
                <motion.button
                  onClick={() => router.push('/account/wishlist')}
                  className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HeartIcon className="w-5 h-5 text-neutral-700" />
                </motion.button>

                <motion.button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingBagIcon className="w-5 h-5 text-neutral-700" />
                  {itemCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </motion.button>

                {loading ? (
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                ) : user ? (
                  <Link 
                    href="/account" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {isAnonymous ? 'A' : user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link href="/login">
                    <motion.button
                      className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign In
                    </motion.button>
                  </Link>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="flex lg:hidden items-center space-x-2">
                {/* Search (Mobile) */}
                <motion.button
                  onClick={() => setIsSearchOpen(true)}
                  className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MagnifyingGlassIcon className="w-5 h-5 text-neutral-700" />
                </motion.button>

                {/* Cart - Mobile */}
                <motion.button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingBagIcon className="w-5 h-5 text-neutral-700" />
                  {itemCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </motion.button>
              </div>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-5 h-5 text-neutral-700" />
                ) : (
                  <Bars3Icon className="w-5 h-5 text-neutral-700" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden glass border-t border-white/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-6">
                <nav className="space-y-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-2 text-neutral-700 hover:text-primary-600 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      
      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={() => setIsCartDrawerOpen(false)} 
      />
    </>
  );
}
