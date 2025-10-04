'use client'

import { motion } from 'framer-motion'

export function MockupGallery() {
  return (
    <section className="py-20 bg-primary-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            AI-Generated Mockups
          </h2>
          <p className="text-lg text-primary-300 max-w-2xl mx-auto">
            See your designs come to life with our AI-powered mockup generation
          </p>
        </motion.div>
        
        <div className="text-center">
          <p className="text-primary-400">Mockup gallery component will be implemented here</p>
        </div>
      </div>
    </section>
  )
}
