'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SmartImage, { 
  StreetWearImage, 
  TShirtImage, 
  HoodieImage, 
  AccessoryImage, 
  FashionModelImage, 
  LifestyleImage 
} from '@/components/ui/SmartImage';
import { 
  FASHION_CATEGORIES, 
  FALLBACK_SOURCES, 
  ERROR_CODES, 
  getSystemReliability,
  getFashionSearchTerm 
} from '@/lib/freepikApi';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  PhotoIcon,
  CpuChipIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ReliabilityDemo = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('streetwear');
  const [testMode, setTestMode] = useState<'normal' | 'force_fallback'>('normal');
  const [showFallbackInfo, setShowFallbackInfo] = useState(true);
  const [loadingStats, setLoadingStats] = useState<Record<string, any>>({});

  const systemInfo = getSystemReliability();

  const handleImageLoad = (source: string, category: string) => {
    setLoadingStats(prev => ({
      ...prev,
      [category]: { source, status: 'success', timestamp: new Date() }
    }));
  };

  const handleImageError = (error: string, category: string) => {
    setLoadingStats(prev => ({
      ...prev,
      [category]: { error, status: 'error', timestamp: new Date() }
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default: return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case FALLBACK_SOURCES.PRIMARY: return 'text-green-600 bg-green-100';
      case FALLBACK_SOURCES.SECONDARY: return 'text-blue-600 bg-blue-100';
      case FALLBACK_SOURCES.TERTIARY: return 'text-orange-600 bg-orange-100';
      case FALLBACK_SOURCES.FINAL: return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold mb-6"
          >
            <ShieldCheckIcon className="w-6 h-6" />
            Reliability Features Demo
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            🔄 4-Tier Fallback System
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Comprehensive image loading with automatic fallbacks, error handling, and fashion-optimized searches.
            Never see a broken image again!
          </motion.p>
        </div>

        {/* System Overview */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-green-200 dark:border-green-800">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🎨</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Tier 1: Freepik</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Premium AI-generated fashion images</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">📷</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Tier 2: Pexels</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">High-quality free stock photos</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-teal-200 dark:border-teal-800">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">📸</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Tier 3: Unsplash</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Community-driven photography</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-orange-200 dark:border-orange-800">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🖼️</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Tier 4: Picsum</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Random placeholder images</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🎭</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Tier 5: SVG</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generated fallback graphics</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Test Controls</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fashion Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.keys(FASHION_CATEGORIES).map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Search: "{getFashionSearchTerm(selectedCategory)}"
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Test Mode
              </label>
              <select
                value={testMode}
                onChange={(e) => setTestMode(e.target.value as 'normal' | 'force_fallback')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="normal">Normal Operation</option>
                <option value="force_fallback">Force Fallback (Simulate Failures)</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showFallbackInfo}
                  onChange={(e) => setShowFallbackInfo(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Show Fallback Info</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Demo Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Live Fallback Demo</h3>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Streetwear</h4>
              <StreetWearImage
                searchTerm="urban fashion"
                alt="Streetwear fashion"
                className="w-full h-32 object-cover rounded-lg shadow"
                showFallbackInfo={showFallbackInfo}
                onLoad={(source) => handleImageLoad(source, 'streetwear')}
                onError={(error) => handleImageError(error, 'streetwear')}
              />
              {loadingStats.streetwear && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  {getStatusIcon(loadingStats.streetwear.status)}
                  <span className={`text-xs px-2 py-1 rounded-full ${getSourceColor(loadingStats.streetwear.source)}`}>
                    {loadingStats.streetwear.source}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">T-Shirts</h4>
              <TShirtImage
                searchTerm="t-shirt mockup"
                alt="T-shirt design"
                className="w-full h-32 object-cover rounded-lg shadow"
                showFallbackInfo={showFallbackInfo}
                onLoad={(source) => handleImageLoad(source, 'tshirts')}
                onError={(error) => handleImageError(error, 'tshirts')}
              />
              {loadingStats.tshirts && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  {getStatusIcon(loadingStats.tshirts.status)}
                  <span className={`text-xs px-2 py-1 rounded-full ${getSourceColor(loadingStats.tshirts.source)}`}>
                    {loadingStats.tshirts.source}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Hoodies</h4>
              <HoodieImage
                searchTerm="hoodie fashion"
                alt="Hoodie design"
                className="w-full h-32 object-cover rounded-lg shadow"
                showFallbackInfo={showFallbackInfo}
                onLoad={(source) => handleImageLoad(source, 'hoodies')}
                onError={(error) => handleImageError(error, 'hoodies')}
              />
              {loadingStats.hoodies && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  {getStatusIcon(loadingStats.hoodies.status)}
                  <span className={`text-xs px-2 py-1 rounded-full ${getSourceColor(loadingStats.hoodies.source)}`}>
                    {loadingStats.hoodies.source}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Accessories</h4>
              <AccessoryImage
                searchTerm="fashion accessories"
                alt="Fashion accessories"
                className="w-full h-32 object-cover rounded-lg shadow"
                showFallbackInfo={showFallbackInfo}
                onLoad={(source) => handleImageLoad(source, 'accessories')}
                onError={(error) => handleImageError(error, 'accessories')}
              />
              {loadingStats.accessories && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  {getStatusIcon(loadingStats.accessories.status)}
                  <span className={`text-xs px-2 py-1 rounded-full ${getSourceColor(loadingStats.accessories.source)}`}>
                    {loadingStats.accessories.source}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Models</h4>
              <FashionModelImage
                searchTerm="fashion model"
                alt="Fashion model"
                className="w-full h-32 object-cover rounded-lg shadow"
                showFallbackInfo={showFallbackInfo}
                onLoad={(source) => handleImageLoad(source, 'models')}
                onError={(error) => handleImageError(error, 'models')}
              />
              {loadingStats.models && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  {getStatusIcon(loadingStats.models.status)}
                  <span className={`text-xs px-2 py-1 rounded-full ${getSourceColor(loadingStats.models.source)}`}>
                    {loadingStats.models.source}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Lifestyle</h4>
              <LifestyleImage
                searchTerm="lifestyle fashion"
                alt="Lifestyle photography"
                className="w-full h-32 object-cover rounded-lg shadow"
                showFallbackInfo={showFallbackInfo}
                onLoad={(source) => handleImageLoad(source, 'lifestyle')}
                onError={(error) => handleImageError(error, 'lifestyle')}
              />
              {loadingStats.lifestyle && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  {getStatusIcon(loadingStats.lifestyle.status)}
                  <span className={`text-xs px-2 py-1 rounded-full ${getSourceColor(loadingStats.lifestyle.source)}`}>
                    {loadingStats.lifestyle.source}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">System Reliability Information</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h4>
              <ul className="space-y-2">
                {systemInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Error Handling</h4>
              <div className="space-y-2">
                {Object.entries(ERROR_CODES).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">{key}:</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">{value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Fashion Categories Available</h4>
            <div className="flex flex-wrap gap-2">
              {systemInfo.fashion_categories.map((category) => (
                <span 
                  key={category} 
                  className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-600"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReliabilityDemo;