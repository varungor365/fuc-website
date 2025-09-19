'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <section className="py-20 bg-primary-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-lg text-primary-300 max-w-2xl mx-auto mb-8">
            Get exclusive access to new drops, behind-the-scenes content, and special offers
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-primary flex-1"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn-accent px-8 py-3 font-semibold"
                disabled={isSubmitted}
              >
                {isSubmitted ? 'Subscribed!' : 'Subscribe'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
