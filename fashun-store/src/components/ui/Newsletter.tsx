'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

interface NewsletterProps {
  variant?: 'default' | 'compact' | 'popup'
  onSuccess?: () => void
}

export default function Newsletter({ variant = 'default', onSuccess }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate success (in real app, this would be an actual API call)
      setStatus('success')
      setMessage('Welcome to the FASHUN family! Check your inbox for exclusive deals.')
      setEmail('')
      
      // Call success callback if provided
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000)
      }

      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
      
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
      
      // Reset error after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <EnvelopeIcon className="w-5 h-5 text-accent-400" />
          <h3 className="font-semibold text-white">Stay Updated</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 bg-primary-800/30 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-primary-400 text-sm focus:outline-none focus:border-accent-400/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="btn btn-glass text-sm px-4 disabled:opacity-50"
            >
              {status === 'loading' ? '...' : 'Join'}
            </button>
          </div>
          
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xs ${
                status === 'success' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {message}
            </motion.p>
          )}
        </form>
      </motion.div>
    )
  }

  if (variant === 'popup') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-primary-900/95 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md mx-auto"
      >
        <div className="text-center mb-6">
          <div className="bg-accent-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <EnvelopeIcon className="w-8 h-8 text-accent-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Join Our VIP List
          </h2>
          <p className="text-primary-300">
            Get exclusive access to new drops, special discounts, and insider fashion tips.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={status === 'loading' || status === 'success'}
            className="w-full bg-primary-800/30 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 disabled:opacity-50"
          />
          
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full btn btn-glass py-4 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <span>Joining...</span>
            ) : status === 'success' ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                Joined!
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Join VIP List
                <ArrowRightIcon className="w-4 h-4" />
              </span>
            )}
          </button>
          
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm text-center ${
                status === 'success' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {message}
            </motion.p>
          )}
        </form>

        <p className="text-xs text-primary-400 text-center mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </motion.div>
    )
  }

  // Default variant
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-accent-500/10" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-accent-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <EnvelopeIcon className="w-10 h-10 text-accent-400" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Stay Ahead of
            <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              {' '}Fashion Trends
            </span>
          </h2>
          
          <p className="text-xl text-primary-200 mb-12 max-w-2xl mx-auto">
            Join thousands of fashion enthusiasts and get exclusive access to new collections, 
            limited drops, and insider fashion tips delivered to your inbox.
          </p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={status === 'loading' || status === 'success'}
                className="flex-1 bg-primary-900/50 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="btn btn-glass px-8 py-4 whitespace-nowrap disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span>Joining...</span>
                ) : status === 'success' ? (
                  <span className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    Joined!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Join VIP List
                    <ArrowRightIcon className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
            
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl border ${
                  status === 'success'
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {status === 'success' ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    <ExclamationCircleIcon className="w-5 h-5" />
                  )}
                  <span>{message}</span>
                </div>
              </motion.div>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12"
          >
            <p className="text-sm text-primary-400 mb-8">
              Join 10,000+ fashion lovers • No spam, just style • Unsubscribe anytime
            </p>
            
            <div className="flex items-center justify-center gap-8 text-primary-300">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-accent-400" />
                <span className="text-sm">Exclusive Drops</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-accent-400" />
                <span className="text-sm">Special Discounts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-accent-400" />
                <span className="text-sm">Style Tips</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}