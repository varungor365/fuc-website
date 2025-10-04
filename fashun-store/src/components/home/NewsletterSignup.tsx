"use client";

import { motion } from 'framer-motion';
import { EnvelopeIcon, GiftIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-15, 15, -15],
    rotate: [-3, 3, -3],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 2000);
  };

  const benefits = [
    {
      icon: '🎨',
      title: 'Exclusive Drops',
      description: 'First access to limited collections'
    },
    {
      icon: '💎',
      title: 'VIP Discounts',
      description: 'Member-only deals up to 40% off'
    },
    {
      icon: '🔮',
      title: 'Style Insights',
      description: 'AI-powered trend predictions'
    },
    {
      icon: '⚡',
      title: 'Early Access',
      description: '48h head start on new releases'
    }
  ];

  if (isSubscribed) {
    return (
      <section className="py-24 bg-gradient-to-br from-purple-900 via-black to-blue-900 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4">
              Welcome to the Inner Circle! 🎉
            </h3>
            
            <p className="text-white/80 text-lg mb-8">
              You're now part of an exclusive community of 25,000+ fashion innovators. 
              Check your inbox for your welcome gift!
            </p>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full px-6 py-3">
              <GiftIcon className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">20% OFF waiting in your inbox</span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-purple-900 via-black to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 right-20 w-20 h-20 border-2 border-purple-400/30 rounded-full"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg rotate-45"
        style={{ animationDelay: '2s' }}
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-40 left-1/4 w-12 h-12 border-2 border-blue-500/30 rounded-lg rotate-12"
        style={{ animationDelay: '4s' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
            <EnvelopeIcon className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-white/80">Join the Community</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-bold font-montserrat mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Stay Ahead of Trends
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
            Join 25,000+ fashion innovators getting exclusive access to drops, insights, and member-only perks
          </motion.p>

          {/* Newsletter Form */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to unlock exclusive access"
                    className="w-full bg-transparent pl-12 pr-4 py-4 text-white placeholder-white/50 focus:outline-none text-lg"
                    required
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-2 justify-center min-w-[140px]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Join Now</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Unsubscribe anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Weekly insights</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 h-full">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                  {benefit.title}
                </h3>
                
                <p className="text-white/70 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                What Our Community Says
              </h3>
              
              <div className="space-y-6">
                {[
                  {
                    quote: "The insider access is incredible. I got the limited holographic collection before it sold out!",
                    name: "Alex Chen",
                    role: "Fashion Blogger"
                  },
                  {
                    quote: "The AI trend predictions helped me stay ahead of every major fashion wave this year.",
                    name: "Jordan Kim", 
                    role: "Style Influencer"
                  },
                  {
                    quote: "VIP discounts saved me over ₹15,000 this year. Best fashion newsletter I've ever subscribed to.",
                    name: "Taylor Smith",
                    role: "Creative Director"
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    variants={itemVariants}
                    className="flex items-start gap-4"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white/80 italic mb-2">"{testimonial.quote}"</p>
                      <div>
                        <span className="text-white font-medium">{testimonial.name}</span>
                        <span className="text-white/60 text-sm"> - {testimonial.role}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <div className="text-6xl mb-4">📧</div>
                
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">25K+</div>
                    <div className="text-white/60 text-sm">Subscribers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">98%</div>
                    <div className="text-white/60 text-sm">Open Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">4.9★</div>
                    <div className="text-white/60 text-sm">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">Weekly</div>
                    <div className="text-white/60 text-sm">Updates</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/80 text-sm">Join the most engaged fashion community</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-full px-8 py-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">2,847 people joined this week</span>
            </div>
            
            <div className="w-px h-6 bg-white/20"></div>
            
            <div className="flex items-center gap-2">
              <GiftIcon className="w-5 h-5 text-purple-400" />
              <span className="text-white/80">Get 20% off instantly</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}