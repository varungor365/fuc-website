'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  SparklesIcon,
  EyeIcon,
  SwatchIcon,
  UserCircleIcon,
  CameraIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  BoltIcon,
  CubeIcon
} from '@heroicons/react/24/outline'

export default function AIFeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      id: 'recommendations',
      name: 'Smart Recommendations',
      description: 'AI analyzes your style preferences and browsing history to suggest products you\'ll love',
      icon: SparklesIcon,
      color: 'from-purple-500 to-pink-500',
      demo: '/search?demo=recommendations',
      benefits: ['Personalized shopping', 'Discover new styles', 'Save time'],
      accuracy: '94%'
    },
    {
      id: 'visual-search',
      name: 'Visual Search',
      description: 'Upload any fashion image and find similar products instantly using computer vision',
      icon: CameraIcon,
      color: 'from-blue-500 to-cyan-500',
      demo: '/search?mode=visual',
      benefits: ['Find exact matches', 'Discover alternatives', 'Style inspiration'],
      accuracy: '89%'
    },
    {
      id: 'style-assistant',
      name: 'Virtual Style Assistant',
      description: 'Chat with AI for personalized fashion advice, styling tips, and outfit recommendations',
      icon: UserCircleIcon,
      color: 'from-green-500 to-emerald-500',
      demo: '/dashboard',
      benefits: ['24/7 style help', 'Personalized advice', 'Fashion expertise'],
      accuracy: '96%'
    },
    {
      id: 'outfit-builder',
      name: 'AI Outfit Builder',
      description: 'Create perfect outfit combinations with AI-powered style coordination and color matching',
      icon: SwatchIcon,
      color: 'from-orange-500 to-red-500',
      demo: '/outfit-builder',
      benefits: ['Perfect combinations', 'Color coordination', 'Style harmony'],
      accuracy: '91%'
    },
    {
      id: 'size-finder',
      name: 'Smart Size Finder',
      description: 'Get accurate size recommendations based on your measurements and fit preferences',
      icon: ChartBarIcon,
      color: 'from-indigo-500 to-purple-500',
      demo: '/products/1',
      benefits: ['Perfect fit', 'Reduce returns', 'Size confidence'],
      accuracy: '97%'
    },
    {
      id: 'intelligent-search',
      name: 'Intelligent Search',
      description: 'Natural language search that understands context, intent, and fashion terminology',
      icon: MagnifyingGlassIcon,
      color: 'from-pink-500 to-rose-500',
      demo: '/search',
      benefits: ['Natural queries', 'Better results', 'Smart suggestions'],
      accuracy: '93%'
    }
  ]

  const stats = [
    { label: 'AI-Powered Features', value: '6+' },
    { label: 'Average Accuracy', value: '93%' },
    { label: 'Style Preferences Analyzed', value: '10K+' },
    { label: 'Outfit Combinations Generated', value: '50K+' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-primary-900/75 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              FASHUN
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/collections" className="text-white/80 hover:text-white transition-colors">
                Collections
              </Link>
              <Link href="/search" className="text-white/80 hover:text-white transition-colors">
                Search
              </Link>
              <Link href="/outfit-builder" className="text-white/80 hover:text-white transition-colors">
                Outfit Builder
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-purple-500/20 rounded-full px-6 py-3 mb-6">
            <BoltIcon className="h-5 w-5 text-purple-400 mr-2" />
            <span className="text-purple-400 font-medium">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            The Future of
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Fashion Technology
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Experience the next generation of fashion e-commerce with our AI-powered features 
            that understand your style, preferences, and help you look your best.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            AI-Powered Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{feature.name}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{feature.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Accuracy</span>
                  <span className="text-sm font-semibold text-green-400">{feature.accuracy}</span>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Benefits:</div>
                  <div className="flex flex-wrap gap-2">
                    {feature.benefits.map((benefit, i) => (
                      <span key={i} className="bg-white/10 px-2 py-1 rounded-full text-xs text-gray-300">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link
                  href={feature.demo}
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center py-3 rounded-xl font-semibold transition-all duration-300 group-hover:scale-105"
                >
                  Try It Now
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Experience AI-Powered Fashion?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of fashion enthusiasts who are already using our AI features 
              to discover their perfect style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/collections"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full text-lg font-semibold text-white transition-all duration-300 transform hover:scale-105"
              >
                Start Shopping
              </Link>
              <Link
                href="/dashboard"
                className="border border-white/20 hover:border-white/40 px-8 py-4 rounded-full text-lg font-semibold text-white transition-all duration-300 backdrop-blur-sm"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}