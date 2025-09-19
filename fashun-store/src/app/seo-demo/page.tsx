'use client'

// AI SEO Integration Example - Demonstrates autonomous SEO optimization
import React, { useState } from 'react'
import { motion } from 'framer-motion'
// TEMPORARILY DISABLED AI SEO IMPORTS
// import { SEODashboard, SEOWidget, SEOProgress, seoUtils } from '@/lib/ai-seo'
// import type { ContentInput } from '@/lib/ai-seo'

// Mock types for demo purposes
type ContentInput = {
  title: string
  description: string
  content: string
  url: string
  type: string
}

export default function SEOExamplePage() {
  const [selectedContent, setSelectedContent] = useState<ContentInput>({
    title: 'Premium Streetwear Collection - FashUn.Co.in',
    description: 'Discover premium streetwear at FashUn.Co.in. Custom hoodies, t-shirts and more for Gen-Z fashion enthusiasts.',
    content: 'Our premium streetwear collection features custom designs, superior quality materials, and unique aesthetics perfect for the modern fashion-forward individual.',
    url: 'https://fashun.co.in/collections/streetwear',
    type: 'collection'
  })

  const [optimizedContent, setOptimizedContent] = useState<ContentInput | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const handleOptimizeContent = async () => {
    setIsOptimizing(true)
    try {
      // TEMPORARILY DISABLED - AI SEO optimization
      // const optimized = await seoUtils.optimizePage(selectedContent)
      
      // Mock optimization for demo
      const optimized = {
        ...selectedContent,
        title: selectedContent.title + ' - Optimized',
        description: selectedContent.description + ' (AI optimized for better SEO)'
      }
      setOptimizedContent(optimized)
    } catch (error) {
      console.error('Optimization failed:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const exampleContents = [
    {
      title: 'Premium Hoodies Collection - FashUn.Co.in',
      description: 'Shop premium hoodies and streetwear at FashUn.Co.in',
      content: 'Our hoodie collection features premium materials and custom designs.',
      url: 'https://fashun.co.in/collections/hoodies',
      type: 'collection' as const
    },
    {
      title: 'Custom Graphic T-Shirt - Urban Style',
      description: 'Custom graphic t-shirt with unique urban design for streetwear lovers',
      content: 'Premium cotton t-shirt with custom graphic design perfect for urban streetwear style.',
      url: 'https://fashun.co.in/products/custom-graphic-tee',
      type: 'product' as const
    },
    {
      title: 'Streetwear Fashion Trends 2024 - Complete Guide',
      description: 'Ultimate guide to streetwear fashion trends in 2024',
      content: 'Discover the latest streetwear trends, styling tips, and fashion insights for 2024. Complete guide to urban fashion.',
      url: 'https://fashun.co.in/blog/streetwear-trends-2024',
      type: 'blog' as const
    }
  ]

  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#E8E8E8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#E4C590] to-[#E8E8E8] bg-clip-text text-transparent">
            AI SEO Optimization Center
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience autonomous SEO optimization powered by AI. Real-time analysis, 
            automatic improvements, and comprehensive monitoring for FashUn.Co.in
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Content Editor & SEO Widget */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/50 rounded-lg p-6 border border-gray-800"
            >
              <h2 className="text-xl font-semibold mb-4">Content Editor</h2>
              
              {/* Example Content Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {exampleContents.map((content, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedContent(content)}
                    className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                  >
                    {content.type === 'product' && '📦'} 
                    {content.type === 'collection' && '📂'} 
                    {content.type === 'blog' && '📝'} 
                    {content.title.split(' - ')[0]}
                  </button>
                ))}
              </div>

              {/* Content Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={selectedContent.title || ''}
                    onChange={(e) => setSelectedContent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#E4C590] focus:border-transparent"
                    placeholder="Enter page title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={selectedContent.description || ''}
                    onChange={(e) => setSelectedContent(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#E4C590] focus:border-transparent"
                    placeholder="Enter meta description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    value={selectedContent.content || ''}
                    onChange={(e) => setSelectedContent(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#E4C590] focus:border-transparent"
                    placeholder="Enter page content..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">URL</label>
                    <input
                      type="url"
                      value={selectedContent.url || ''}
                      onChange={(e) => setSelectedContent(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#E4C590] focus:border-transparent"
                      placeholder="https://fashun.co.in/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={selectedContent.type || 'page'}
                      onChange={(e) => setSelectedContent(prev => ({ ...prev, type: e.target.value as 'page' | 'product' | 'collection' | 'blog' }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#E4C590] focus:border-transparent"
                    >
                      <option value="page">Page</option>
                      <option value="product">Product</option>
                      <option value="collection">Collection</option>
                      <option value="blog">Blog</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Manual Optimize Button */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <button
                  onClick={handleOptimizeContent}
                  disabled={isOptimizing}
                  className="px-4 py-2 bg-[#E4C590] text-[#0F0F10] rounded-lg font-medium hover:bg-[#E4C590]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOptimizing ? 'Optimizing...' : '🚀 Manual Optimize'}
                </button>
              </div>

              {/* Optimized Content Display */}
              {optimizedContent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <h3 className="text-green-400 font-medium mb-2">✅ Optimized Content</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Title:</span>
                      <div className="text-green-300">{optimizedContent.title}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Description:</span>
                      <div className="text-green-300">{optimizedContent.description}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* SEO Dashboard - TEMPORARILY DISABLED */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-primary-100 mb-2">AI SEO Dashboard</h3>
                <p className="text-primary-300">AI SEO Module temporarily disabled</p>
                <div className="mt-4 p-4 bg-gray-800/50 rounded border border-gray-700">
                  <p className="text-sm text-gray-400">Dashboard functionality will be restored soon</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - SEO Widget & Metrics */}
          <div className="space-y-6">
            {/* Real-time SEO Widget - TEMPORARILY DISABLED */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <div className="text-center py-6">
                <h3 className="text-lg font-semibold text-primary-100 mb-2">SEO Widget</h3>
                <p className="text-primary-300 mb-4">Real-time optimization temporarily disabled</p>
                <div className="p-4 bg-gray-800/50 rounded border border-gray-700">
                  <p className="text-sm text-gray-400">Widget functionality will be restored soon</p>
                </div>
              </div>
            </motion.div>

            {/* SEO Progress Indicators */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 rounded-lg p-6 border border-gray-800"
            >
              <h3 className="text-lg font-semibold mb-4">SEO Metrics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Overall Score</span>
                  {/* SEOProgress temporarily disabled */}
                  <div className="text-[#E4C590] font-semibold">85/100</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Title Optimization</span>
                    <span className="text-[#E4C590]">Good</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Meta Description</span>
                    <span className="text-yellow-400">Needs Work</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Keywords</span>
                    <span className="text-green-400">Excellent</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Readability</span>
                    <span className="text-[#E4C590]">Good</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#E4C590]/10 to-transparent rounded-lg p-6 border border-[#E4C590]/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E4C590] rounded-full flex items-center justify-center">
                  <span className="text-[#0F0F10] font-bold">AI</span>
                </div>
                <div>
                  <div className="font-semibold text-[#E8E8E8]">SEO AI Active</div>
                  <div className="text-xs text-gray-400">Continuous optimization</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-400">Real-time analysis enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#E4C590] rounded-full"></div>
                  <span className="text-gray-400">Auto-optimization active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-400">Performance monitoring</span>
                </div>
              </div>
            </motion.div>

            {/* Integration Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 rounded-lg p-6 border border-gray-800"
            >
              <h3 className="text-lg font-semibold mb-4">Integration Guide</h3>
              
              <div className="space-y-3 text-sm">
                <div className="border border-gray-700 rounded p-3 bg-gray-800/50">
                  <div className="text-[#E4C590] font-mono text-xs mb-1">Import</div>
                  <code className="text-gray-300">
                    import {`{ SEOWidget, seoUtils }`} from &apos;@/lib/ai-seo&apos;
                  </code>
                </div>
                
                <div className="border border-gray-700 rounded p-3 bg-gray-800/50">
                  <div className="text-[#E4C590] font-mono text-xs mb-1">Usage</div>
                  <code className="text-gray-300">
                    &lt;SEOWidget content={`{content}`} /&gt;
                  </code>
                </div>
                
                <div className="border border-gray-700 rounded p-3 bg-gray-800/50">
                  <div className="text-[#E4C590] font-mono text-xs mb-1">Auto-optimize</div>
                  <code className="text-gray-300">
                    await seoUtils.optimizePage(content)
                  </code>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-gray-400 text-sm"
        >
          <p>
            AI SEO Module for FashUn.Co.in - Autonomous optimization powered by advanced AI
          </p>
        </motion.div>
      </div>
    </div>
  )
}
