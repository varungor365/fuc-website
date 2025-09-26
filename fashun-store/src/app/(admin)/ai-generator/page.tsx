'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ImageGenerator from '@/components/admin/ImageGenerator';
import { FiImage, FiZap, FiSettings, FiInfo } from 'react-icons/fi';

export default function AIImageGeneratorPage() {
  const handleImageGenerated = (imageUrl: string, metadata: any) => {
    console.log('New image generated:', { imageUrl, metadata });
    // Here you could save to database, update gallery, etc.
  };

  const features = [
    {
      icon: FiZap,
      title: 'AI-Powered Generation',
      description: 'Uses Google Gemini AI to create high-quality, custom images for your fashion brand.'
    },
    {
      icon: FiImage,
      title: 'Multiple Styles',
      description: 'Choose from realistic, artistic, minimal, or fashion-focused styles to match your brand.'
    },
    {
      icon: FiSettings,
      title: 'Customizable Options',
      description: 'Control aspect ratios, quality settings, and generation parameters for perfect results.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Image Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Transform your fashion content with AI-generated images. Create custom, professional-quality 
            visuals that perfectly match your brand aesthetic.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <feature.icon className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Usage Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <FiInfo className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                How to Use
              </h3>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
                <li>• Describe the image you want to generate in detail</li>
                <li>• Choose your preferred style and aspect ratio</li>
                <li>• Click "Generate Image" and wait for AI processing</li>
                <li>• Download or copy your generated image</li>
                <li>• Use the automated workflow script to replace stock images</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Main Image Generator Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ImageGenerator onImageGenerated={handleImageGenerated} />
        </motion.div>

        {/* Workflow Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Automated Workflow
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Use our AI-powered automation script to scan your entire codebase, identify stock images, 
            and replace them with custom AI-generated content.
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm">
            <div className="text-gray-600 dark:text-gray-400 mb-2"># Run the automated replacement workflow:</div>
            <div className="text-green-600 dark:text-green-400">node scripts/ai-image-replacement.js</div>
            <div className="text-gray-600 dark:text-gray-400 mt-2"># Dry run (preview only):</div>
            <div className="text-green-600 dark:text-green-400">node scripts/ai-image-replacement.js --dry-run</div>
            <div className="text-gray-600 dark:text-gray-400 mt-2"># Verbose output:</div>
            <div className="text-green-600 dark:text-green-400">node scripts/ai-image-replacement.js --verbose</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}