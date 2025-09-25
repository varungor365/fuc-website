'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedHomePage from '@/components/pages/EnhancedHomePage';
import InstagramFeed from '@/components/social/InstagramFeed';
import CartDrawer from '@/components/cart/CartDrawer';
import LoginModal from '@/components/auth/LoginModal';
import PremiumPricing, { PricingDisplay } from '@/components/pricing/PremiumPricing';
import OptimizedImage from '@/components/ui/OptimizedImage';
import AnalyticsDashboard from '@/components/ui/AnalyticsDashboard';
import QRMockupGenerator from '@/components/ui/QRMockupGenerator';
import { mockupData, getAllProducts } from '@/lib/enhancedMockupData';
import { TRANSFORM_PRESETS } from '@/lib/imagekit';
import { pagefonts } from '@/lib/simpleFonts';
import {
  SparklesIcon,
  ShoppingBagIcon,
  UserIcon,
  StarIcon,
  HeartIcon,
  EyeIcon,
  CreditCardIcon,
  ChartBarIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

const TestShowcasePage: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');

  // Sample cart items for demo
  const sampleCartItems = [
    {
      id: '1',
      name: 'Premium Hoodie',
      price: 89.99,
      image: '/placeholder-image.jpg',
      size: 'M',
      color: 'Black',
      quantity: 2,
      category: 'hoodies'
    },
    {
      id: '2',
      name: 'Designer T-Shirt',
      price: 45.99,
      image: '/placeholder-image.jpg',
      size: 'L',
      color: 'White',
      quantity: 1,
      category: 'tshirts'
    }
  ];

  // Mock functions for cart operations
  const handleCartUpdate = (id: string, quantity: number) => {
    console.log('Update cart item:', id, quantity);
  };

  const handleCartRemove = (id: string) => {
    console.log('Remove cart item:', id);
  };

  const handleMoveToWishlist = (id: string) => {
    console.log('Move to wishlist:', id);
  };

  // Mock functions for login operations
  const handleLogin = (email: string, password: string) => {
    console.log('Login:', email);
  };

  const handleRegister = (email: string, password: string, name: string) => {
    console.log('Register:', email, name);
  };

  const handleSocialLogin = (provider: string) => {
    console.log('Social login:', provider);
  };

  const sections = [
    { id: 'home', name: 'Enhanced Homepage', icon: SparklesIcon },
    { id: 'mockups', name: 'Product Mockups', icon: EyeIcon },
    { id: 'qr-mockups', name: 'QR Code Mockups', icon: QrCodeIcon },
    { id: 'instagram', name: 'Instagram Feed', icon: HeartIcon },
    { id: 'cart', name: 'Premium Cart', icon: ShoppingBagIcon },
    { id: 'login', name: 'Login System', icon: UserIcon },
    { id: 'pricing', name: 'Pricing Tiers', icon: CreditCardIcon },
    { id: 'analytics', name: 'Analytics Dashboard', icon: ChartBarIcon },
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <EnhancedHomePage />;
      
      case 'mockups':
        return (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className={`${pagefonts.headers.primary.className} text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6`}>
                Premium Product Mockups
              </h2>
              <p className={`${pagefonts.homepage.secondary.className} text-xl text-gray-300 max-w-3xl mx-auto`}>
                Over 36 carefully curated products across 6 categories with stunning visuals and detailed information.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getAllProducts()
                .slice(0, 9)
                .map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="aspect-square bg-gradient-to-br from-purple-900/50 to-pink-900/50 relative overflow-hidden">
                      <OptimizedImage
                        src={product.image}
                        alt={product.name}
                        transformations={TRANSFORM_PRESETS.productCard}
                        className="w-full h-full object-cover"
                        width={400}
                        height={400}
                      />
                      {product.isNew && (
                        <div className="absolute top-4 left-4 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          NEW
                        </div>
                      )}
                      {product.isFeatured && (
                        <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          FEATURED
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className={`${pagefonts.headers.secondary.className} text-xl font-semibold text-white mb-2`}>
                        {product.name}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <PricingDisplay price={product.price} originalPrice={product.originalPrice} />
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <StarIcon className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-400">({product.reviewCount})</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        );
      
      case 'qr-mockups':
        return <QRMockupGenerator />;
      
      case 'instagram':
        return (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className={`${pagefonts.headers.primary.className} text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6`}>
                Auto-Sliding Instagram Feed
              </h2>
              <p className={`${pagefonts.homepage.secondary.className} text-xl text-gray-300 max-w-3xl mx-auto mb-8`}>
                Live Instagram integration with auto-sliding carousel, engagement stats, and direct linking.
              </p>
            </div>
            <InstagramFeed />
          </div>
        );
      
      case 'cart':
        return (
          <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className={`${pagefonts.headers.primary.className} text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6`}>
                Premium Shopping Cart
              </h2>
              <p className={`${pagefonts.homepage.secondary.className} text-xl text-gray-300 max-w-3xl mx-auto mb-8`}>
                Advanced cart system with quantity controls, promo codes, order summary, and wishlist integration.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <h3 className={`${pagefonts.headers.secondary.className} text-2xl font-semibold text-white mb-6`}>
                Cart Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Quantity Controls</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Promo Code System</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Order Summary</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Wishlist Integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Smooth Animations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Responsive Design</span>
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={() => setShowCart(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>Open Cart Demo</span>
              </motion.button>
            </div>
          </div>
        );
      
      case 'login':
        return (
          <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className={`${pagefonts.headers.primary.className} text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6`}>
                Multi-Modal Authentication
              </h2>
              <p className={`${pagefonts.homepage.secondary.className} text-xl text-gray-300 max-w-3xl mx-auto mb-8`}>
                Complete authentication system with login, registration, password recovery, and social login integration.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <h3 className={`${pagefonts.headers.secondary.className} text-2xl font-semibold text-white mb-6`}>
                Authentication Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Login Modal</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Registration Form</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Password Recovery</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Social Login</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Form Validation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Animated Transitions</span>
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={() => setShowLogin(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <UserIcon className="w-5 h-5" />
                <span>Open Login Demo</span>
              </motion.button>
            </div>
          </div>
        );
      
      case 'pricing':
        return (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className={`${pagefonts.headers.primary.className} text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6`}>
                Premium Pricing System
              </h2>
              <p className={`${pagefonts.homepage.secondary.className} text-xl text-gray-300 max-w-3xl mx-auto mb-8`}>
                Flexible pricing components with subscription tiers, discount calculations, and FAQ sections.
              </p>
            </div>
            <PremiumPricing />
          </div>
        );
      
      case 'analytics':
        return <AnalyticsDashboard />;
      
      default:
        return <EnhancedHomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Navigation Tabs */}
      <div className="sticky top-20 z-40 bg-primary-900/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide space-x-1 py-4">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  currentSection === section.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span className={`${pagefonts.homepage.secondary.className} font-medium`}>
                  {section.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderSection()}
      </motion.div>

      {/* Modals */}
      <CartDrawer 
        isOpen={showCart} 
        onClose={() => setShowCart(false)}
        items={sampleCartItems}
        onUpdateQuantity={handleCartUpdate}
        onRemoveItem={handleCartRemove}
        onMoveToWishlist={handleMoveToWishlist}
      />
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSocialLogin={handleSocialLogin}
      />

      {/* Stats Overlay */}
      <div className="fixed bottom-4 left-4 z-40 bg-primary-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
        <h4 className={`${pagefonts.headers.secondary.className} text-sm font-semibold text-white mb-2`}>
          Platform Stats
        </h4>
        <div className="space-y-1 text-xs text-gray-300">
          <div>✅ Logo Integration</div>
          <div>✅ 36+ Product Mockups</div>
          <div>✅ Instagram Auto-Slide</div>
          <div>✅ Premium Cart System</div>
          <div>✅ Multi-Modal Login</div>
          <div>✅ 12+ Font Families</div>
          <div>✅ Pricing Components</div>
          <div>✅ Google Analytics</div>
          <div>✅ ImageKit Integration</div>
        </div>
      </div>
    </div>
  );
};

export default TestShowcasePage;