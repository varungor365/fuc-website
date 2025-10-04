'use client'

import { motion } from 'framer-motion'

export function InstagramFeed() {
  return (
    <section className="py-20 bg-primary-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            @fashun.co
          </h2>
          <p className="text-lg text-primary-300 max-w-2xl mx-auto">
            Follow us for the latest drops and style inspiration
          </p>
        </motion.div>
        
        <div className="text-center">
          <p className="text-primary-400">Instagram feed component will be implemented here</p>
        </div>
      </div>
    </section>
  )
}
