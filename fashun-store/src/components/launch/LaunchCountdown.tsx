'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlameIcon, 
  RocketIcon, 
  SparklesIcon,
  BellIcon,
  AnimatedIcon 
} from '@/components/icons/AnimatedIcons';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const teaserImages = [
  '/images/products/t-shirts/tshirt-1-main.jpg',
  '/images/products/hoodies/hoodie-1-main.jpg',
  '/images/products/t-shirts/tshirt-2-main.jpg',
  '/images/products/hoodies/hoodie-2-main.jpg',
  '/images/products/jackets/jacket-1-main.jpg',
  '/images/products/accessories/cap-1-main.jpg'
];

export default function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(247); // Initial count for social proof

  // Launch date: October 28, 2025 at midnight
  const launchDate = new Date('2025-10-28T00:00:00').getTime();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % teaserImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Check localStorage for duplicate (local check)
      const existingEmails = JSON.parse(localStorage.getItem('waitlistEmails') || '[]');
      
      if (existingEmails.includes(email)) {
        setError('This email is already on the waitlist!');
        setIsLoading(false);
        return;
      }

      // Store in localStorage immediately (primary storage for now)
      existingEmails.push(email);
      localStorage.setItem('waitlistEmails', JSON.stringify(existingEmails));
      
      // Try to send to Google Sheets via API (background operation)
      try {
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        if (response.ok) {
          console.log('Email saved to Google Sheets successfully!');
        } else {
          console.warn('Google Sheets save failed, but email is in localStorage');
        }
      } catch (apiError) {
        console.warn('API error (email saved locally):', apiError);
      }

      // Show success regardless of API result
      setIsSubmitted(true);
      setTotalSubscribers(prev => prev + 1);
      
    } catch (err) {
      console.error('Waitlist error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Admin Sign In & Instagram - Top Right */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <a 
          href="https://instagram.com/fashun.co.in"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-gradient-frosted px-6 py-3 rounded-full text-white font-semibold hover:shadow-gradient-neon transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-pink-500"
        >
          <AnimatedIcon icon="heart" animation="pulse" size={20} />
          Follow @fashun.co.in
        </a>
        <a 
          href="/admin/login"
          className="glass-gradient-frosted px-6 py-3 rounded-full text-white font-semibold hover:shadow-gradient-neon transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-orange-500"
        >
          <AnimatedIcon icon="user" animation="pulse" size={20} />
          Admin
        </a>
      </div>

      {/* Animated Background Layers */}
      <div className="absolute inset-0 gradient-hero-cosmic"></div>
      <div className="absolute inset-0 mesh-gradient-1 opacity-40"></div>
      <div className="absolute inset-0 pattern-gradient-dots opacity-20"></div>

      {/* Mysterious Image Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            <div 
              className="w-full h-full bg-cover bg-center blur-sm"
              style={{ 
                backgroundImage: `url(${teaserImages[currentImageIndex]})`,
                filter: 'blur(8px) brightness(0.4)'
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl w-full">
          {/* Logo and Brand */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <SparklesIcon size={40} />
              <h1 className="text-6xl md:text-8xl font-black text-gradient-primary gradient-text-shine">
                FASHUN.CO.IN
              </h1>
              <SparklesIcon size={40} />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white mb-4">
              India's Premium Streetwear Revolution
            </p>
            <div className="flex items-center justify-center gap-3 text-orange-400">
              <FlameIcon size={24} />
              <p className="text-lg font-semibold">
                Something Epic is Coming...
              </p>
              <FlameIcon size={24} />
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                LAUNCHING IN
              </h2>
              <div className="flex items-center justify-center gap-2">
                <AnimatedIcon icon="rocket" animation="float" size={24} gradient />
                <p className="text-gray-400 text-lg">Get ready for the drop</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' }
              ].map((unit, index) => (
                <motion.div
                  key={unit.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="glass-gradient-dark rounded-3xl p-6 md:p-8 shadow-gradient-neon border-gradient-primary hover-gradient-lift will-change-gradient"
                >
                  <motion.div
                    key={unit.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-5xl md:text-7xl font-black text-gradient-fire mb-2"
                  >
                    {String(unit.value).padStart(2, '0')}
                  </motion.div>
                  <div className="text-sm md:text-base font-bold text-gray-400 uppercase tracking-wider">
                    {unit.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Email Waitlist Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            {!isSubmitted ? (
              <div className="glass-gradient-frosted rounded-3xl p-8 md:p-12 shadow-gradient-glow border-gradient-primary">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <BellIcon size={32} />
                    <h3 className="text-2xl md:text-3xl font-black text-white">
                      Join the Waitlist
                    </h3>
                  </div>
                  <p className="text-gray-300 text-lg">
                    Be the first to know when we launch & get exclusive early access deals!
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      disabled={isLoading}
                      className="w-full px-6 py-5 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 text-lg focus:outline-none focus:border-orange-500 transition-all disabled:opacity-50"
                    />
                    {error && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                        <AnimatedIcon icon="alert" animation="shake" size={16} />
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-gradient-primary shadow-gradient-neon py-5 text-xl font-black rounded-2xl text-white hover-gradient-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <AnimatedIcon icon="clock" animation="spin" size={24} />
                        Joining...
                      </>
                    ) : (
                      <>
                        <RocketIcon size={24} />
                        Notify Me at Launch
                        <SparklesIcon size={24} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    🎉 <span className="text-gradient-gold font-bold">{totalSubscribers}+</span> fashion enthusiasts already joined!
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-gradient-frosted rounded-3xl p-8 md:p-12 shadow-gradient-glow border-gradient-primary text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="w-24 h-24 mx-auto rounded-full gradient-brand-primary flex items-center justify-center shadow-gradient-neon">
                    <AnimatedIcon icon="check" animation="pop" size={48} />
                  </div>
                </motion.div>

                <h3 className="text-3xl font-black text-white mb-4">
                  You're on the List! 🎉
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  We'll send you an exclusive notification when we launch on <span className="text-gradient-gold font-bold">October 28th</span>!
                </p>
                <div className="flex items-center justify-center gap-2 text-orange-400">
                  <SparklesIcon size={20} />
                  <p className="font-semibold">
                    Get ready for something extraordinary
                  </p>
                  <SparklesIcon size={20} />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Social Proof & Features Teaser */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { icon: 'flame', label: 'Exclusive Designs' },
              { icon: 'rocket', label: 'Premium Quality' },
              { icon: 'shield', label: 'Secure Checkout' },
              { icon: 'gift', label: 'Launch Deals' }
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="glass-gradient-light rounded-2xl p-4 text-center"
              >
                <div className="flex justify-center mb-2">
                  <AnimatedIcon 
                    icon={feature.icon as any} 
                    animation="bounce" 
                    size={32} 
                    gradient 
                  />
                </div>
                <p className="text-white font-semibold text-sm">{feature.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-16 text-center text-gray-500 text-sm"
          >
            <p>© 2025 FASHUN.CO - Premium Streetwear Coming Soon</p>
            <p className="mt-2">Follow us for sneak peeks and updates</p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <a href="#" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                <AnimatedIcon icon="heart" animation="pulse" size={18} />
                Instagram
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                <AnimatedIcon icon="star" animation="pop" size={18} />
                Twitter
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
