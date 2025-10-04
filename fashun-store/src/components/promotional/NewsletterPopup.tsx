'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { X, Mail, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsletterPopupProps {
  onClose?: () => void;
}

const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('fashun-newsletter-popup-seen');
    const lastShownTime = localStorage.getItem('fashun-newsletter-popup-time');
    
    if (!hasSeenPopup || !lastShownTime) {
      // Show popup after 10 seconds for new visitors
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);
      
      return () => clearTimeout(timer);
    } else {
      // For returning visitors, show popup every 7 days
      const lastShown = new Date(lastShownTime);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      if (lastShown < sevenDaysAgo) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 30000); // Show after 30 seconds for returning visitors
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('fashun-newsletter-popup-seen', 'true');
    localStorage.setItem('fashun-newsletter-popup-time', new Date().toISOString());
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to subscribe user
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, make actual API call to your newsletter service
      // await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      setIsSubmitted(true);
      
      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 3000);
      
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Popup */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="relative p-8">
                {!isSubmitted ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Gift className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Get 15% Off Your First Order
                      </h2>
                      <p className="text-gray-300">
                        Join our exclusive streetwear community and be the first to know about new drops, sales, and limited releases.
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                        <span>15% discount on your first purchase</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                        <span>Exclusive access to limited drops</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                        <span>Early sale notifications</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                        <span>Style tips and outfit inspiration</span>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:bg-white/15 transition-colors"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Subscribing...
                          </>
                        ) : (
                          <>
                            Get My 15% Off
                            <Gift className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-white/10 text-center">
                      <p className="text-xs text-gray-400">
                        By subscribing, you agree to our{' '}
                        <a href="/privacy" className="text-primary-400 hover:text-primary-300 underline">
                          Privacy Policy
                        </a>
                        {' '}and{' '}
                        <a href="/terms" className="text-primary-400 hover:text-primary-300 underline">
                          Terms of Service
                        </a>
                        . Unsubscribe at any time.
                      </p>
                    </div>
                  </>
                ) : (
                  /* Success State */
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Welcome to the Family!
                    </h2>
                    <p className="text-gray-300 mb-4">
                      Check your email for your 15% discount code. It should arrive within a few minutes.
                    </p>
                    <div className="bg-primary-600/20 border border-primary-500/30 rounded-lg p-4">
                      <p className="text-sm text-primary-300">
                        <strong>FASHUN15</strong> - Use this code at checkout for 15% off your first order
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;