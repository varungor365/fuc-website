"use client";

import { motion } from 'framer-motion';
import { StarIcon, UserIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  location: string;
  verified: boolean;
  purchasedItem: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    role: 'Creative Director',
    company: 'Urban Studios',
    content: 'The quality is absolutely insane! The AI-powered design recommendations helped me find pieces that perfectly match my style. Every item exceeded my expectations.',
    rating: 5,
    avatar: '/testimonials/marcus.jpg',
    location: 'Los Angeles, CA',
    verified: true,
    purchasedItem: 'Ethereal Glow Hoodie'
  },
  {
    id: '2',
    name: 'Zara Chen',
    role: 'Fashion Blogger',
    company: 'Style Forward',
    content: 'FASHUN has revolutionized my wardrobe. The sustainable materials and cutting-edge designs make every piece a statement. My followers always ask where I get my fits!',
    rating: 5,
    avatar: '/testimonials/zara.jpg',
    location: 'New York, NY',
    verified: true,
    purchasedItem: 'Quantum Mesh Jacket'
  },
  {
    id: '3',
    name: 'Alex Rivera',
    role: 'Photographer',
    company: 'Lens & Light Co.',
    content: 'As someone who\'s always on set, I need clothes that look amazing and perform. FASHUN delivers on both fronts. The attention to detail is phenomenal.',
    rating: 5,
    avatar: '/testimonials/alex.jpg',
    location: 'Miami, FL',
    verified: true,
    purchasedItem: 'Neon Dreams Cargo Set'
  },
  {
    id: '4',
    name: 'Taylor Kim',
    role: 'Music Producer',
    company: 'Sonic Wave Records',
    content: 'The limited drops are pure fire! I\'ve copped every collection since launch. The community aspect and exclusive designs make it feel like a lifestyle brand.',
    rating: 5,
    avatar: '/testimonials/taylor.jpg',
    location: 'Atlanta, GA',
    verified: true,
    purchasedItem: 'Holographic Tech Tee'
  },
  {
    id: '5',
    name: 'Jordan Lee',
    role: 'Content Creator',
    company: '@streetvibes',
    content: 'FASHUN isn\'t just clothing, it\'s wearable art. The AI styling suggestions are spot-on, and the customer service is unmatched. 100% recommend!',
    rating: 5,
    avatar: '/testimonials/jordan.jpg',
    location: 'Chicago, IL',
    verified: true,
    purchasedItem: 'Prismatic Bomber Jacket'
  },
  {
    id: '6',
    name: 'Sam Patel',
    role: 'Tech Entrepreneur',
    company: 'NextGen Innovations',
    content: 'Finally found a brand that gets it. The intersection of technology and fashion is executed flawlessly. Each piece feels like it\'s from the future.',
    rating: 5,
    avatar: '/testimonials/sam.jpg',
    location: 'San Francisco, CA',
    verified: true,
    purchasedItem: 'Cyber Punk Hoodie Set'
  }
];

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

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-white/80">Customer Stories</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-bold font-montserrat mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Loved by Creators
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Join thousands of creatives who've elevated their style with our AI-powered fashion platform
          </motion.p>
        </motion.div>

        {/* Main Testimonial Display */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <div className="relative">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar and Info */}
                <div className="flex-shrink-0 text-center md:text-left">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 p-1">
                      <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <UserIcon className="w-12 h-12 text-white/80" />
                      </div>
                    </div>
                    {testimonials[activeTestimonial].verified && (
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-black">
                        <CheckBadgeIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-xl font-semibold text-white mb-1">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-purple-300 text-sm mb-1">
                    {testimonials[activeTestimonial].role}
                  </p>
                  <p className="text-white/50 text-sm mb-2">
                    {testimonials[activeTestimonial].company}
                  </p>
                  <p className="text-white/40 text-xs">
                    {testimonials[activeTestimonial].location}
                  </p>
                </div>

                {/* Testimonial Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-4 justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg md:text-xl text-white/90 leading-relaxed mb-6 text-center md:text-left">
                    "{testimonials[activeTestimonial].content}"
                  </blockquote>
                  
                  <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-white/70">
                      Purchased: {testimonials[activeTestimonial].purchasedItem}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300 group"
            >
              <svg className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300 group"
            >
              <svg className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Testimonial Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setActiveTestimonial(index)}
              className={`cursor-pointer transition-all duration-300 ${
                index === activeTestimonial
                  ? 'ring-2 ring-purple-400 bg-white/10'
                  : 'bg-white/5 hover:bg-white/10'
              } backdrop-blur-sm border border-white/10 rounded-2xl p-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 p-0.5">
                  <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white/80" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium text-sm">
                      {testimonial.name}
                    </h4>
                    {testimonial.verified && (
                      <CheckBadgeIcon className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-white/50 text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                {testimonial.content}
              </p>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-white/50">
                  Purchased: {testimonial.purchasedItem}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Happy Customers', value: '25,000+', icon: '😊' },
              { label: 'Average Rating', value: '4.9/5', icon: '⭐' },
              { label: 'Repeat Customers', value: '87%', icon: '🔄' },
              { label: 'Countries Served', value: '45+', icon: '🌍' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}