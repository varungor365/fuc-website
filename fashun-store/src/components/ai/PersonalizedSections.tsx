'use client';

import { motion } from 'framer-motion';
import { SparklesIcon, HeartIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface PersonalizedSectionsProps {
  userId: string;
}

interface PersonalizedRecommendation {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  originalPrice?: string;
  category: string;
  confidence: number;
  reason: string;
}

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

export default function PersonalizedSections({ userId }: PersonalizedSectionsProps) {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI recommendation loading
    setTimeout(() => {
      setRecommendations([
        {
          id: '1',
          title: 'Neon Cyberpunk Hoodie',
          description: 'Perfect match for your tech-forward style',
          image: '/products/cyberpunk-hoodie.jpg',
          price: '₹3,299',
          originalPrice: '₹4,199',
          category: 'Hoodies',
          confidence: 94,
          reason: 'Based on your love for tech aesthetics'
        },
        {
          id: '2',
          title: 'Holographic Bomber Jacket',
          description: 'Trending in your style category',
          image: '/products/holo-bomber.jpg',
          price: '₹4,599',
          category: 'Jackets',
          confidence: 89,
          reason: 'Popular with similar taste profiles'
        },
        {
          id: '3',
          title: 'Minimal Tech Tee',
          description: 'Minimalist design you\'ll love',
          image: '/products/tech-tee.jpg',
          price: '₹1,899',
          originalPrice: '₹2,399',
          category: 'T-Shirts',
          confidence: 92,
          reason: 'Matches your preference for clean designs'
        },
        {
          id: '4',
          title: 'Future Cargo Pants',
          description: 'Complete your streetwear look',
          image: '/products/cargo-pants.jpg',
          price: '₹3,799',
          category: 'Bottoms',
          confidence: 87,
          reason: 'Complements your current wardrobe'
        }
      ]);
      setIsLoading(false);
    }, 1500);
  }, [userId]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
              <SparklesIcon className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-sm font-medium text-white/80">Intelligent Curation</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Analyzing Your Style...
              </span>
            </h2>
            <p className="text-white/70 text-lg">
              Our intelligent system is curating personalized recommendations just for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 animate-pulse">
                <div className="w-full h-48 bg-white/10 rounded-xl mb-4"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-white/80">Intelligent Curation</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Curated Just For You
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-white/70 text-lg max-w-2xl mx-auto">
            Our intelligent system analyzed your preferences to find pieces that match your unique style
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {recommendations.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 h-full">
                {/* Confidence Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {item.confidence}% match
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-xl flex items-center justify-center">
                    <div className="text-6xl">👕</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="space-y-2 mb-4">
                  <h3 className="text-white font-semibold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-lg">{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-white/50 text-sm line-through">{item.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-white/5 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <SparklesIcon className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-medium text-purple-400">Smart Match</span>
                  </div>
                  <p className="text-white/80 text-xs">{item.reason}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm">
                    Add to Cart
                  </button>
                  <button className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <HeartIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Style Insights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-6 h-6 text-purple-400" />
                Your Style Profile
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Tech-Forward Aesthetic</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-20 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-purple-400 text-sm font-medium">85%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Minimalist Design</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-18 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                    </div>
                    <span className="text-green-400 text-sm font-medium">78%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Premium Quality</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-22 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                    </div>
                    <span className="text-blue-400 text-sm font-medium">91%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">94%</div>
              <div className="text-white/70 text-sm mb-4">Average Match Score</div>
              
              <Link href="/collections/all" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300">
                <SparklesIcon className="w-5 h-5" />
                Explore More Matches
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}