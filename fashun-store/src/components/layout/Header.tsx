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
        {/* Top Bar - Enhanced with Animated Icons */}
        <div className="border-b border-orange-500/30 gradient-brand-primary relative overflow-hidden">
          <div className="absolute inset-0 pattern-gradient-dots opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between py-3 text-sm text-white">
              <div className="flex items-center space-x-6">
                <span className="font-semibold tracking-wide flex items-center gap-2">
                  <TruckAnimated size={18} />
                  FREE SHIPPING ON ORDERS OVER ₹999
                </span>
                <span className="hidden md:inline text-white/40">|</span>
                <span className="hidden md:inline flex items-center gap-2">
                  <AnimatedIcon icon="shield" animation="pulse" size={18} />
                  30-DAY HASSLE-FREE RETURNS
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/track-order" className="hover:text-orange-400 transition-colors font-medium flex items-center gap-2">
                  <AnimatedIcon icon="package" animation="bounce" size={18} />
                  TRACK ORDER
                </Link>
                <span className="text-white/40">|</span>
                <Link href="/contact" className="hover:text-orange-400 transition-colors font-medium flex items-center gap-2">
                  <AnimatedIcon icon="message" animation="wiggle" size={18} />
                  HELP
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center">
                <div className="relative w-32 h-16">
                  <Image 
                    src="/logo.png" 
                    alt="FASHUN.CO.IN" 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation - Enhanced Buttons */}
            <nav className="hidden lg:flex items-center gap-3">
              {[
                { title: 'Shop', icon: ShoppingCart, href: '/collections/all' },
                { title: 'Customize', icon: Palette, href: '/customize', badge: '🎨' },
                { title: 'Printed Tees', icon: Shirt, href: '/collections/printed-tshirts' },
                { title: 'Plain & Combos', icon: Layers, href: '/collections/plain-tshirts' },
                { title: 'Hoodies', icon: Package, href: '/collections/hoodies' },
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.title}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                      className={`
                        group relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-base
                        transition-all duration-300 shadow-md hover:shadow-xl
                        ${isActive 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                          : 'bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 text-gray-700 hover:text-orange-600'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                      <span className="whitespace-nowrap">{item.title}</span>
                      {item.badge && (
                        <span className="text-sm">{item.badge}</span>
                      )}
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-1 bg-white rounded-full"
                          layoutId="activeNavBar"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Old Navigation - Backup */}
            <nav className="hidden xl:hidden lg:hidden items-center space-x-8">
              {navigationItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.megaMenu && setShowMegaMenu(item.name)}
                  onMouseLeave={() => setShowMegaMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={`font-nav text-neutral-700 hover:text-orange-600 transition-colors relative py-2 flex items-center space-x-2 ${
                      pathname === item.href ? 'text-orange-600' : ''
                    }`}
                  >
                    <span>{item.name}</span>
                    {(item as any).badge && (
                      <span className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full font-bold animate-pulse">
                        {(item as any).badge}
                      </span>
                    )}
                    {pathname === item.href && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary"
                        layoutId="activeNav"
                        initial={false}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {item.megaMenu && showMegaMenu === item.name && (
                      <motion.div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 glass rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-4">
                            {item.megaMenu.categories.map((category) => (
                              <Link
                                key={category.name}
                                href={category.href}
                                className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-200"
                              >
                                <div className="w-12 h-12 rounded-lg overflow-hidden">
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <span className="font-medium text-neutral-800">{category.name}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-white/20 mt-4 pt-4">
                            <div className="flex space-x-4">
                              {item.megaMenu.featured.map((featured) => (
                                <Link
                                  key={featured.name}
                                  href={featured.href}
                                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                  {featured.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              </form>
            </div>

            {/* Action Buttons - Right Side with Expandable Tabs */}
            <div className="flex items-center space-x-4">
              {/* Right Side Actions - Expandable Tabs */}
              <div className="hidden lg:flex">
                <ExpandableTabs
                  tabs={[
                    { title: 'Track Order', icon: TruckIcon },
                    { type: 'separator' },
                    { title: user ? 'Account' : 'Login', icon: user ? User : LogIn },
                  ]}
                  activeColor="text-orange-600"
                  onChange={(index) => {
                    if (index === 0) {
                      router.push('/track-order');
                    } else if (index === 2) {
                      router.push(user ? '/account' : '/login');
                    }
                  }}
                />
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

                {/* Wishlist */}
                <motion.button
                  onClick={() => router.push('/account/wishlist')}
                  className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HeartIcon className="w-5 h-5 text-neutral-700" />
                </motion.button>

                {/* Cart */}
                <motion.button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingBagIcon className="w-5 h-5 text-neutral-700" />
                  {itemCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* User Account - Mobile */}
                <div className="flex items-center">
                  {loading ? (
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  ) : user ? (
                    <Link 
                      href="/account" 
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                    >
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {isAnonymous ? 'A' : user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <motion.button
                        className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <UserIcon className="w-5 h-5 text-neutral-700" />
                      </motion.button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Desktop User Status */}
              <div className="hidden lg:flex items-center space-x-4">
                {loading ? (
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                ) : user ? (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {isAnonymous ? 'A' : user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden xl:inline text-sm font-medium">
                      {isAnonymous ? 'Anonymous User' : (user.user_metadata?.name || user.email?.split('@')[0])}
                    </span>
                    {isAnonymous && (
                      <span className="hidden xl:inline text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Anonymous
                      </span>
                    )}
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="text-gray-700 hover:text-gray-900 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}
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
