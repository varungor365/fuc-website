"use client";

import { motion } from 'framer-motion';
import { ShieldCheckIcon, TruckIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline';

interface TrustBadge {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  stats: string;
  color: string;
}

const trustBadges: TrustBadge[] = [
  {
    id: '1',
    title: 'Secure Payments',
    description: 'Bank-level encryption protects all transactions with 256-bit SSL security',
    icon: ShieldCheckIcon,
    stats: '100% Secure',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: '2',
    title: 'Fast Shipping',
    description: 'Free express delivery on all orders over ₹4,500. Track your package in real-time',
    icon: TruckIcon,
    stats: '2-3 Day Delivery',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: '3',
    title: 'Premium Quality',
    description: 'Each piece is crafted with sustainable materials and undergoes rigorous quality control',
    icon: SparklesIcon,
    stats: '99.8% Quality Score',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: '4',
    title: 'Customer Love',
    description: '30-day return policy with full refund guarantee. Your satisfaction is our priority',
    icon: HeartIcon,
    stats: '4.9★ Rating',
    color: 'from-red-400 to-pink-500'
  }
];

const certifications = [
  {
    name: 'Sustainable Fashion',
    description: 'Certified sustainable materials',
    image: '/certifications/sustainable.png',
    verified: true
  },
  {
    name: 'Carbon Neutral',
    description: 'Zero carbon footprint shipping',
    image: '/certifications/carbon-neutral.png',
    verified: true
  },
  {
    name: 'Fair Trade',
    description: 'Ethical manufacturing practices',
    image: '/certifications/fair-trade.png',
    verified: true
  },
  {
    name: 'OEKO-TEX',
    description: 'Textile safety certification',
    image: '/certifications/oeko-tex.png',
    verified: true
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15
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
    y: [-10, 10, -10],
    rotate: [-2, 2, -2],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function TrustBadges() {
  return (
    <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Geometric Shapes */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 right-20 w-16 h-16 border border-white/20 rounded-lg"
        style={{ transform: 'rotate(45deg)' }}
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full"
        style={{ animationDelay: '2s' }}
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-40 left-1/3 w-8 h-8 border-2 border-blue-500/30 rounded-full"
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
            <ShieldCheckIcon className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-white/80">Trusted by Thousands</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-bold font-montserrat mb-6">
            <span className="bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent">
              Premium Quality Guaranteed
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Your security and satisfaction are our top priorities. Experience premium service with every order.
          </motion.p>
        </motion.div>

        {/* Trust Badges Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300">
                {/* Icon with Gradient Background */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${badge.color} p-0.5 mx-auto`}>
                    <div className="w-full h-full bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <badge.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2">
                    <div className={`bg-gradient-to-r ${badge.color} rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg`}>
                      {badge.stats}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {badge.title}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed text-center">
                  {badge.description}
                </p>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Security Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Bank-Level Security
                </span>
              </h3>
              
              <div className="space-y-6">
                {[
                  {
                    title: '256-bit SSL Encryption',
                    description: 'Military-grade encryption protects all your data',
                    icon: '🔐'
                  },
                  {
                    title: 'PCI DSS Compliant',
                    description: 'Highest standards for payment processing',
                    icon: '💳'
                  },
                  {
                    title: 'Fraud Protection',
                    description: 'Advanced AI monitors every transaction',
                    icon: '🛡️'
                  },
                  {
                    title: 'Secure Checkout',
                    description: 'One-click payments with stored preferences',
                    icon: '⚡'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    className="flex items-start gap-4"
                  >
                    <div className="text-2xl">{feature.icon}</div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                      <p className="text-white/70 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                    <ShieldCheckIcon className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">100% Secure</h4>
                  <p className="text-white/70">Your data is safe with us</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Payment Security</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Data Encryption</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">256-bit</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Fraud Monitoring</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center"
        >
          <motion.h3 variants={itemVariants} className="text-2xl md:text-3xl font-bold text-white mb-4">
            Certified & Verified
          </motion.h3>
          
          <motion.p variants={itemVariants} className="text-white/70 mb-12 max-w-2xl mx-auto">
            We maintain the highest standards in sustainability, quality, and ethical business practices
          </motion.p>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  {/* Certification Badge */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">✓</span>
                    </div>
                    
                    {cert.verified && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <ShieldCheckIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <h4 className="text-white font-semibold text-sm mb-2 group-hover:text-green-400 transition-colors">
                    {cert.name}
                  </h4>
                  
                  <p className="text-white/60 text-xs">
                    {cert.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Score */}
          <motion.div
            variants={itemVariants}
            className="mt-16 inline-flex items-center gap-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-full px-8 py-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Trust Score: 98.7%</span>
            </div>
            
            <div className="w-px h-6 bg-white/20"></div>
            
            <div className="flex items-center gap-2">
              <HeartIcon className="w-5 h-5 text-red-400" />
              <span className="text-white/80">25,000+ Happy Customers</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}