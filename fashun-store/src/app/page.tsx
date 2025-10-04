'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SparklesIcon, StarIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
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

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20"></div>
      
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
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SparklesIcon className="w-5 h-5 text-white" />
            <span className="text-sm font-medium">AI-Powered Styling</span>
          </motion.div>

          <motion.h1
            className="heading-1 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Premium Streetwear & Custom
            <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Apparel India
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-white/50 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              />
            </span>
          </motion.h1>

          <motion.p
            className="body-large mb-8 max-w-2xl mx-auto text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Discover India's finest streetwear collection with intelligent style recommendations that understand your unique fashion preferences. 
            Handcrafted designs, sustainable materials, and smart fashion assistance for the next generation of streetwear enthusiasts.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link href="/collections/all" className="btn btn-glass btn-lg">
              Shop Collection
            </Link>
            <Link href="/designer" className="btn btn-ghost btn-lg text-white border-white/30 hover:bg-white/10">
              AI Style Assistant
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center justify-center space-x-8 mt-12 text-sm text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="flex items-center space-x-2">
              <TruckIcon className="w-5 h-5" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>100% Authentic</span>
            </div>
            <div className="flex items-center space-x-2">
              <StarIcon className="w-5 h-5" />
              <span>4.9★ Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-5 h-5" />
              <span>AI-Powered</span>
            </div>
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
