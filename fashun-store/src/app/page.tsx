'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SparklesIcon, StarIcon, TruckIcon, ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
// import PersonalizedSections from '@/components/ai/PersonalizedSections';
import TrendingOutfits from '@/components/ai/TrendingOutfits';

// Import all new homepage sections
import AnnouncementBar from '@/components/home/AnnouncementBar';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import NewArrivals from '@/components/home/NewArrivals';
import TrendingProducts from '@/components/home/TrendingProducts';
import ShopByCategory from '@/components/home/ShopByCategory';
import BrandStory from '@/components/home/BrandStory';
import InstagramFeed from '@/components/home/InstagramFeed';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import TrustBadges from '@/components/home/TrustBadges';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import CountdownTimer from '@/components/promotional/CountdownTimer';
import DealOfTheDay from '@/components/promotional/DealOfTheDay';

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/images/products/hoodies/hoodie-1-main.jpg')] bg-cover bg-center opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 bg-white/10 rounded-full blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent-500/20 to-pink-500/20 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-accent-400/50 shadow-2xl shadow-accent-500/25"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
          >
            <SparklesIcon className="w-6 h-6 text-accent-400 animate-pulse" />
            <span className="text-base font-bold bg-gradient-to-r from-accent-400 to-pink-400 bg-clip-text text-transparent">
              🔥 TRENDY & FRESH 🔥
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <motion.span 
              className="block bg-gradient-to-r from-white via-accent-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              STREETWEAR
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-pink-400 via-accent-400 to-white bg-clip-text text-transparent drop-shadow-2xl"
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 80 }}
            >
              REVOLUTION
            </motion.span>
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-accent-500 to-pink-500 rounded-full shadow-lg shadow-accent-500/50"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-semibold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
              India's Hottest T-Shirt Brand! 🚀 From Printed Tees to Oversized Hoodies - 
              We've Got Your Streetwear Game Covered. Premium Quality, Killer Designs, Unbeatable Vibes! 
            </span>
            <motion.span 
              className="block mt-2 text-lg text-accent-300 font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ Express Yourself. Stay Fresh. Be Iconic. ✨
            </motion.span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link 
                href="/collections/printed-tshirts" 
                className="relative inline-flex items-center gap-3 bg-gradient-to-r from-accent-500 to-pink-500 hover:from-accent-400 hover:to-pink-400 text-black font-black text-lg px-8 py-4 rounded-2xl shadow-2xl shadow-accent-500/40 transition-all duration-300 group overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
                <span className="relative z-10">🛍️ SHOP NOW</span>
                <ArrowRightIcon className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link 
                href="/collections/all" 
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-accent-400 hover:border-pink-400 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 group"
              >
                <span>🎨 EXPLORE ALL</span>
                <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <motion.div 
              className="flex flex-col items-center space-y-2 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-accent-400/30 hover:border-accent-400 transition-all group"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="bg-gradient-to-r from-accent-500 to-pink-500 p-3 rounded-full">
                <TruckIcon className="w-6 h-6 text-black" />
              </div>
              <span className="text-white font-semibold text-center">FREE SHIPPING</span>
              <span className="text-accent-300 text-xs text-center">On orders ₹999+</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center space-y-2 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-accent-400/30 hover:border-accent-400 transition-all group"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                <ShieldCheckIcon className="w-6 h-6 text-black" />
              </div>
              <span className="text-white font-semibold text-center">100% AUTHENTIC</span>
              <span className="text-accent-300 text-xs text-center">Original designs</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center space-y-2 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-accent-400/30 hover:border-accent-400 transition-all group"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full">
                <StarIcon className="w-6 h-6 text-black" />
              </div>
              <span className="text-white font-semibold text-center">4.9★ REVIEWS</span>
              <span className="text-accent-300 text-xs text-center">10k+ happy customers</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center space-y-2 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-accent-400/30 hover:border-accent-400 transition-all group"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                <SparklesIcon className="w-6 h-6 text-black animate-pulse" />
              </div>
              <span className="text-white font-semibold text-center">TRENDING STYLES</span>
              <span className="text-accent-300 text-xs text-center">Latest drops weekly</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

// Main Homepage Component
export default function HomePage() {
  return (
    <main className="overflow-hidden">
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Collections */}
      <FeaturedCollections />
      
      {/* New Arrivals */}
      <NewArrivals />
      
      {/* Shop by Category */}
      <ShopByCategory />
      
      {/* Deal of the Day */}
      <DealOfTheDay />
      
      {/* Trending Products with AI */}
      <TrendingProducts />
      
      {/* AI-Powered Personalized Sections */}
      {/* <PersonalizedSections userId="demo-user" /> */}
      
      {/* Trending AI-Curated Outfits */}
      <section className="bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <TrendingOutfits 
            showHeader={true}
            limit={6}
            className="py-16"
          />
        </div>
      </section>
      
      {/* Brand Story */}
      <BrandStory />
      
      {/* Instagram Feed */}
      <InstagramFeed />
      
      {/* Customer Testimonials */}
      <TestimonialsSection />
      
      {/* Trust Badges */}
      <TrustBadges />

      {/* SEO Content Section - Streetwear Fashion in India */}
      <section className="bg-gray-800/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              India's Premier Streetwear Fashion Destination
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Premium Streetwear Collection</h3>
                <p className="text-gray-300 mb-4">
                  FASHUN.CO is India's leading streetwear fashion platform, offering an exclusive collection of premium 
                  hoodies, graphic t-shirts, and custom apparel. Our curated streetwear essentials combine contemporary 
                  urban design with superior quality materials, perfect for fashion-forward individuals who appreciate 
                  authentic street style.
                </p>
                <p className="text-gray-300">
                  From oversized hoodies and vintage-inspired graphic tees to custom streetwear pieces, every item in our 
                  collection represents the pinnacle of urban fashion. We specialize in bringing international streetwear 
                  trends to the Indian market while maintaining affordability and premium quality standards.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Custom Apparel & Design Services</h3>
                <p className="text-gray-300 mb-4">
                  Our intelligent design platform allows customers to create personalized streetwear that reflects their 
                  unique style. Whether you're looking for custom graphic designs, personalized prints, or bespoke 
                  streetwear pieces, our advanced customization tools make it easy to bring your vision to life.
                </p>
                <p className="text-gray-300">
                  Experience the future of fashion retail with our smart recommendation system that understands your 
                  style preferences and suggests the perfect streetwear combinations. From casual street style to bold 
                  urban statements, discover clothing that speaks to your individual fashion sense.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <NewsletterSignup />
    </main>
  );
}
