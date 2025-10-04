'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Brand Story - Editorial section inspired by premium Shopify themes
export default function BrandStory() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 blur-xl"></div>
            
            <div className="relative z-10">
              {/* Section Tag */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-8">
                <span className="text-sm font-semibold text-gray-700">Our Story</span>
              </div>
              
              {/* Main Heading */}
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                <span className="block">Redefining</span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Streetwear
                </span>
                <span className="block">Culture</span>
              </h2>
              
              {/* Story Content */}
              <div className="space-y-6 text-lg text-gray-600 mb-10">
                <p>
                  Born from the streets and inspired by the digital revolution, FASHUN.CO represents 
                  a new era of streetwear that seamlessly blends cutting-edge fashion with intelligent technology.
                </p>
                
                <p>
                  Our mission is simple yet revolutionary: to create premium streetwear that not only 
                  looks incredible but also understands you. Every piece in our collection is crafted 
                  with meticulous attention to detail and enhanced with smart insights to elevate your style.
                </p>
                
                <p>
                  From concept to creation, we obsess over quality, authenticity, and innovation. 
                  Our designs speak to the fearless, the creative, and the trendsetters who aren't 
                  afraid to make a statement.
                </p>
              </div>
              
              {/* Key Values */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200">
                  <div className="text-3xl mb-3">🎨</div>
                  <h3 className="font-bold text-gray-900 mb-2">Creative</h3>
                  <p className="text-sm text-gray-600">Pushing boundaries in design and innovation</p>
                </div>
                
                <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="font-bold text-gray-900 mb-2">Authentic</h3>
                  <p className="text-sm text-gray-600">True to streetwear culture and values</p>
                </div>
                
                <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="font-bold text-gray-900 mb-2">Future-Ready</h3>
                  <p className="text-sm text-gray-600">Embracing tomorrow's fashion today</p>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-full hover:from-gray-800 hover:to-gray-900 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Learn Our Story
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <Link
                  href="/collections/signature"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:border-gray-900 hover:text-gray-900 transform hover:scale-105 transition-all duration-300"
                >
                  Shop Signature Collection
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Brand Image */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="/images/mock/brand/story-hero.jpg"
                alt="FASHUN.CO Brand Story"
                className="w-full h-[600px] object-cover"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Stats Overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">2019</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wider">Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">50K+</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wider">Community</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">100+</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wider">Designs</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-xl flex items-center justify-center"
            >
              <span className="text-4xl">👑</span>
            </motion.div>
            
            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl flex items-center justify-center"
            >
              <span className="text-2xl">⚡</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-relaxed">
              "Fashion is not just about clothes. It's about expressing who you are, 
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}and we're here to amplify that expression.
              </span>"
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <img
                src="/images/mock/team/founder.jpg"
                alt="Founder"
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              />
              <div className="text-left">
                <div className="font-bold text-gray-900">Alex Rodriguez</div>
                <div className="text-gray-600">Founder & Creative Director</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}