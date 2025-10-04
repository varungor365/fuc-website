'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PaintBrushIcon, SparklesIcon, CubeIcon } from '@heroicons/react/24/outline'

export function CustomizerSection() {
  return (
    <section className="py-20 bg-primary-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Design Your Own
              <span className="block text-accent-500">Unique Style</span>
            </h2>
            
            <p className="text-lg text-primary-300 mb-8">
              Use our advanced design tool to create custom apparel that&apos;s uniquely yours. 
              From graphics to text, position everything exactly where you want it.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                  <PaintBrushIcon className="h-6 w-6 text-accent-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Custom Graphics</h3>
                  <p className="text-primary-300">Upload your own designs or choose from our library</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="h-6 w-6 text-accent-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">AI-Powered Generation</h3>
                  <p className="text-primary-300">Generate unique designs with AI assistance</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                  <CubeIcon className="h-6 w-6 text-accent-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">3D Preview</h3>
                  <p className="text-primary-300">See your design on realistic product mockups</p>
                </div>
              </div>
            </div>
            
            <Link href="/designer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-accent px-8 py-4 text-lg font-semibold"
              >
                Start Designing
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Design Tool Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-primary-800 rounded-2xl p-8 border border-primary-700">
              {/* Mock Design Interface */}
              <div className="bg-primary-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">Design Canvas</h4>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                {/* Mock Hoodie */}
                <div className="bg-primary-600 rounded-lg p-8 text-center">
                  <div className="w-32 h-40 mx-auto bg-black rounded-lg relative">
                    <div className="absolute inset-4 border-2 border-dashed border-accent-500/50 rounded flex items-center justify-center">
                      <span className="text-accent-500 text-xs">Your Design</span>
                    </div>
                  </div>
                </div>
                
                {/* Tools */}
                <div className="flex justify-center space-x-3 mt-4">
                  <div className="w-8 h-8 bg-accent-500 rounded"></div>
                  <div className="w-8 h-8 bg-primary-500 rounded"></div>
                  <div className="w-8 h-8 bg-highlight-500 rounded"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
