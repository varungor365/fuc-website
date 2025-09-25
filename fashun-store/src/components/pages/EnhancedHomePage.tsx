'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRightIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  SparklesIcon,
  CubeIcon,
  ShoppingBagIcon,
  UserIcon,
  PlayIcon,
  EyeIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import PersonalizedSections from '@/components/ai/PersonalizedSections'
import RecommendationEngine, { RECOMMENDATION_REASONS } from '@/components/ai/RecommendationEngine'
import StyleAssistantButton from '@/components/ai/StyleAssistantButton'
import OutfitBuilderButton from '@/components/ai/OutfitBuilderButton'
import InstagramFeed from '@/components/social/InstagramFeed'
import CartDrawer from '@/components/cart/CartDrawer'
import LoginModal from '@/components/auth/LoginModal'
import PremiumPricing, { PricingDisplay } from '@/components/pricing/PremiumPricing'
import { pagefonts } from '@/lib/simpleFonts'
import { mockupData, getAllMockups, formatPrice } from '@/lib/mockupData'

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  category: string;
}

const EnhancedHomePage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Mock featured products from our mockup data
  const featuredProducts = getAllMockups().slice(0, 8);
  const trendingProducts = getAllMockups().slice(8, 16);

  const handleAddToCart = (product: any, size: string = 'M', color: string = 'Black') => {
    const newItem: CartItem = {
      id: `${product.id}-${size}-${color}`,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size,
      color,
      quantity: 1,
      category: product.category
    };

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveToWishlist = (id: string) => {
    // Implementation for wishlist functionality
    console.log('Move to wishlist:', id);
  };

  const handleLogin = async (email: string, password: string) => {
    // Implementation for login
    console.log('Login:', email);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    // Implementation for registration
    console.log('Register:', name, email);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    // Implementation for social login
    console.log('Social login:', provider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section with Enhanced Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background with Stock Image */}
        <div className="absolute inset-0">
          <Image
            src="/stock/hero-background.jpg"
            alt="Premium Streetwear Collection Background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
          
          {/* Logo Pattern Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-10 gap-8 h-full p-8">
              {Array.from({ length: 100 }).map((_, i) => (
                <motion.div 
                  key={i} 
                  className="relative w-6 h-6"
                  animate={{ 
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.1 
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className={`${pagefonts.homepage.primary.className} text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight`}>
              <motion.span 
                className="block bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                FASHUN
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-purple-500 via-pink-400 to-orange-400 bg-clip-text text-transparent"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                REVOLUTION
              </motion.span>
            </h1>
            
            <motion.p 
              className={`${pagefonts.homepage.secondary.className} text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Where AI meets streetwear. Discover personalized fashion with cutting-edge technology, 
              premium quality, and trending styles that define the future of street culture.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <motion.button
                onClick={() => setIsLoginOpen(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold text-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center space-x-2">
                  <UserIcon className="w-5 h-5" />
                  <span>Join FASHUN</span>
                  <SparklesIcon className="w-5 h-5" />
                </span>
              </motion.button>

              <motion.button
                onClick={() => setIsCartOpen(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <ShoppingBagIcon className="w-5 h-5" />
                  <span>Explore Collections</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                <div className="text-gray-400 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-400 text-sm">Unique Designs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">98%</div>
                <div className="text-gray-400 text-sm">Satisfaction Rate</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`${pagefonts.collections.primary.className} text-4xl md:text-6xl font-bold text-white mb-4`}>
              TRENDING NOW
            </h2>
            <p className={`${pagefonts.collections.secondary.className} text-xl text-gray-400 max-w-2xl mx-auto`}>
              AI-curated collection based on global street fashion trends
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <EyeIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className={`${pagefonts.products.primary.className} font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors`}>
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  
                  <PricingDisplay
                    price={product.price}
                    originalPrice={product.originalPrice}
                    size="md"
                    variant="gradient"
                  />
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`${pagefonts.tech.primary.className} text-4xl md:text-6xl font-bold text-white mb-4`}>
              AI-POWERED FASHION
            </h2>
            <p className={`${pagefonts.tech.secondary.className} text-xl text-gray-400 max-w-3xl mx-auto`}>
              Experience the future of fashion with our intelligent recommendation system
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                <SparklesIcon className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Recommendations</h3>
              <p className="text-gray-400">AI analyzes your style preferences to suggest perfect matches</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-pink-500/30 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6">
                <CubeIcon className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Virtual Try-On</h3>
              <p className="text-gray-400">See how clothes look on you before buying with AR technology</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
                <FireIcon className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Trend Forecasting</h3>
              <p className="text-gray-400">Stay ahead with AI-predicted fashion trends and style insights</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`${pagefonts.special.primary.className} text-4xl md:text-6xl font-bold text-white mb-4`}>
              Follow Our Journey
            </h2>
            <p className={`${pagefonts.special.secondary.className} text-xl text-gray-400`}>
              Stay connected with the latest drops and behind-the-scenes content
            </p>
          </motion.div>

          <InstagramFeed 
            autoSlide={true}
            slideInterval={5000}
            showControls={true}
          />
        </div>
      </section>

      {/* Premium Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-black/40 to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <PremiumPricing showSubscriptions={true} />
        </div>
      </section>

      {/* AI Components Integration */}
      <PersonalizedSections 
        userId="demo-user"
        userPreferences={{
          favoriteCategories: ['hoodies', 'tshirts'],
          styleProfile: 'streetwear',
          sizeProfile: { size: 'M', fit: 'regular' }
        }}
      />

      {/* Floating Action Buttons */}
      <StyleAssistantButton />
      <OutfitBuilderButton 
        product={{
          id: 'featured-1',
          name: 'Premium Hoodie',
          price: 2999,
          image: '/api/placeholder/400/500',
          category: 'hoodies',
          color: 'Black',
          brand: 'FASHUN'
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onMoveToWishlist={handleMoveToWishlist}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSocialLogin={handleSocialLogin}
      />
    </div>
  )
}

export default EnhancedHomePage