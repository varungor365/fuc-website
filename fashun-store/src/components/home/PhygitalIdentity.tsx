'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCodeIcon, SparklesIcon, GlobeAltIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PhygitalIdentity() {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      icon: <QrCodeIcon className="w-8 h-8" />,
      title: "Scan & Connect",
      description: "Every t-shirt comes with a unique QR code linking to your digital identity"
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Global Profile", 
      description: "Showcase your style, connect with fashion enthusiasts worldwide"
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "Exclusive Access",
      description: "Unlock limited drops, behind-the-scenes content, and VIP experiences"
    },
    {
      icon: <DevicePhoneMobileIcon className="w-8 h-8" />,
      title: "Mobile First",
      description: "Optimized for mobile - your fashion identity in your pocket"
    }
  ];

  // Auto-cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-blue-900/20"></div>
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(120, 0, 255, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255, 0, 150, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 50%, rgba(0, 150, 255, 0.3) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Headline */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm"
              >
                <SparklesIcon className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-sm font-medium text-purple-300">The Future of Fashion</span>
              </motion.div>
              
              <h2 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  More Than a T-Shirt.
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  It's Your Digital Identity.
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                Every FASHUN.CO piece connects you to our exclusive digital ecosystem. 
                Scan, connect, and join the future of fashion.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    currentFeature === index 
                      ? 'bg-white/10 border border-purple-400/50 shadow-lg' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/8'
                  }`}
                  onMouseEnter={() => setCurrentFeature(index)}
                >
                  <div className={`transition-colors duration-300 ${
                    currentFeature === index ? 'text-purple-400' : 'text-gray-400'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-semibold mt-2 text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <Link href="https://p.fashun.co.in" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center">
                    <QrCodeIcon className="w-5 h-5 mr-2" />
                    Explore p.fashun.co.in
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Phone Mockup */}
            <div className="relative mx-auto w-80 h-96">
              {/* Phone Frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative">
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                      <div className="text-white font-bold text-lg">FASHUN.CO</div>
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">F</span>
                      </div>
                    </div>
                    
                    {/* QR Code Animation */}
                    <div className="flex items-center justify-center h-40 mt-8">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-32 h-32 bg-white rounded-xl p-4 shadow-lg"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                          <QrCodeIcon className="w-16 h-16 text-white" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Profile Preview */}
                    <div className="px-4 mt-6 space-y-3">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-4 bg-white/20 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                        className="h-3 bg-white/15 rounded-full w-3/4"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                        className="h-3 bg-white/15 rounded-full w-1/2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <SparklesIcon className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  x: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <GlobeAltIcon className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}