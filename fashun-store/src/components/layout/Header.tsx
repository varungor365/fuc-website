'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
import { useCart } from '@/hooks/useCart';

const navigationItems = [
  {
    name: 'Shop',
    href: '/collections/all',
    megaMenu: {
      categories: [
        { name: 'Printed T-Shirts', href: '/collections/printed-tshirts', image: '/images/products/t-shirts/tshirt-1-main.jpg', badge: 'Popular' },
        { name: 'Full Sleeve T-Shirts', href: '/collections/full-sleeve-tshirts', image: '/images/products/t-shirts/tshirt-2-main.jpg', badge: 'Trending' },
        { name: 'Polo T-Shirts', href: '/collections/polo-tshirts', image: '/images/products/t-shirts/tshirt-1-front.jpg' },
        { name: "Women's T-Shirts", href: '/collections/womens-tshirts', image: '/images/products/t-shirts/tshirt-2-front.jpg', badge: 'New' },
        { name: 'Crop Tops', href: '/collections/crop-tops', image: '/images/products/accessories/cap-1-main.jpg', badge: 'Trending' },
        { name: 'Plus Size T-Shirts', href: '/collections/plus-size-tshirts', image: '/images/products/jackets/jacket-1-main.jpg' },
        { name: 'Plain T-Shirts & Packs', href: '/collections/plain-tshirts', image: '/images/products/t-shirts/tshirt-1-main.jpg', badge: 'Value' },
        { name: 'Hoodies', href: '/collections/hoodies', image: '/images/products/hoodies/hoodie-1-main.jpg' },
        { name: 'Oversized Hoodies', href: '/collections/oversized-hoodies', image: '/images/products/hoodies/hoodie-2-main.jpg', badge: 'Street Style' },
        { name: 'Sweatshirts', href: '/collections/sweatshirts', image: '/images/products/jackets/jacket-1-main.jpg' }
      ],
      featured: [
        { name: 'New Arrivals', href: '/collections/new-arrivals', description: 'Latest drops & fresh designs' },
        { name: 'Best Sellers', href: '/collections/best-sellers', description: 'Customer favorites' },
        { name: 'Combo Packs', href: '/collections/combo-packs', description: 'Value deals & bundles' },
        { name: 'Sale Items', href: '/collections/sale', description: 'Up to 50% off' }
      ]
    }
  },
  { name: 'Printed Tees', href: '/collections/printed-tshirts' },
  { name: 'Plain & Combos', href: '/collections/plain-tshirts' },
  { name: 'Hoodies', href: '/collections/hoodies' },
  { name: 'Women', href: '/collections/womens-tshirts' }
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass backdrop-blur-xl bg-white/80 shadow-lg border-b border-white/20' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Top Bar */}
        <div className="border-b border-neutral-200/50 bg-gradient-primary">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2 text-sm text-white">
              <div className="flex items-center space-x-6">
                <span>Free shipping on orders over ₹2,999</span>
                <span className="hidden md:inline">|</span>
                <span className="hidden md:inline">30-day returns</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/track" className="hover:text-primary-200 transition-colors">
                  Track Order
                </Link>
                <span>|</span>
                <Link href="/contact" className="hover:text-primary-200 transition-colors">
                  Help
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
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    FASHUN.CO.IN
                  </h1>
                  <p className="text-xs text-neutral-600 -mt-1">Premium Streetwear</p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.megaMenu && setShowMegaMenu(item.name)}
                  onMouseLeave={() => setShowMegaMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={`text-neutral-700 hover:text-primary-600 transition-colors font-medium relative py-2 ${
                      pathname === item.href ? 'text-primary-600' : ''
                    }`}
                  >
                    {item.name}
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

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
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
                onClick={() => router.push('/cart')}
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

              {/* User Account */}
              <motion.button
                onClick={() => router.push('/account')}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserIcon className="w-5 h-5 text-neutral-700" />
              </motion.button>

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
    </>
  );
}

export default Header;
