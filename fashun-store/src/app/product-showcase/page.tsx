'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ContainerScroll, ScrollProgress } from '@/components/ui/container-scroll';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { GradientText } from '@/components/ui/gradient-text';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { SparklesBadge } from '@/components/ui/sparkles';
import Link from 'next/link';
import { 
  SparklesIcon, 
  FireIcon, 
  BoltIcon,
  ShieldCheckIcon,
  TruckIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';

export default function ProductShowcasePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <ScrollProgress />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SparklesBadge className="mb-6 text-lg">
              Limited Edition Drop
            </SparklesBadge>
            
            <h1 className="text-6xl lg:text-8xl font-black mb-6">
              <GradientText animate className="block mb-4">
                Cyber Punk
              </GradientText>
              <span className="text-white">Neon Collection</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the future of streetwear with our AI-enhanced, glow-in-the-dark premium collection
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="#story">
                <RainbowButton className="px-8 py-4 text-lg">
                  Discover the Story
                </RainbowButton>
              </Link>
              <Link href="/products">
                <button className="px-8 py-4 text-lg font-bold text-white border-2 border-white/20 rounded-xl hover:bg-white/10 transition-all">
                  Shop Now
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Container Scroll Section */}
      <section id="story">
        <ContainerScroll
          titleComponent={
            <div className="text-center mb-12">
              <GradientText className="text-5xl lg:text-7xl font-black">
                The Making Of
              </GradientText>
              <p className="text-xl text-gray-300 mt-4">
                Scroll to explore our design process
              </p>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <SpotlightCard className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    AI-Enhanced Design
                  </h3>
                  <p className="text-gray-300">
                    Our intelligent design system analyzes thousands of streetwear trends to create unique, 
                    eye-catching patterns that resonate with modern fashion enthusiasts.
                  </p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl">
                  <FireIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Glow-in-the-Dark Tech
                  </h3>
                  <p className="text-gray-300">
                    Premium phosphorescent inks that charge under any light source and glow for hours, 
                    making you stand out in any crowd, day or night.
                  </p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-orange-500 rounded-xl">
                  <BoltIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Lightning Fast Production
                  </h3>
                  <p className="text-gray-300">
                    State-of-the-art manufacturing process that maintains premium quality while ensuring 
                    rapid delivery. Your style, on your schedule.
                  </p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Premium Quality Guarantee
                  </h3>
                  <p className="text-gray-300">
                    Every piece undergoes rigorous quality control. If you're not 100% satisfied, 
                    we'll make it right with our 30-day guarantee.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </ContainerScroll>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <GradientText className="text-4xl lg:text-6xl font-black mb-4">
              Why Choose FASHUN
            </GradientText>
            <p className="text-xl text-gray-300">
              More than just clothing - it's a lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TruckIcon,
                title: 'Free Express Shipping',
                description: 'On all orders above ₹2,999. Get your style delivered fast.',
              },
              {
                icon: ShieldCheckIcon,
                title: '100% Authentic',
                description: 'Original designs crafted with premium materials.',
              },
              {
                icon: HeartIcon,
                title: '50K+ Happy Customers',
                description: 'Join our community of streetwear enthusiasts.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <SpotlightCard className="p-8 text-center h-full">
                  <div className="mb-4 inline-block p-4 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-2xl">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <SpotlightCard className="p-12">
            <SparklesBadge className="mb-6 text-lg">
              Exclusive Launch Offer
            </SparklesBadge>
            
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">
              Ready to Make a <GradientText animate>Statement?</GradientText>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of trendsetters who've already upgraded their wardrobe. 
              Limited quantities available.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <RainbowButton className="px-12 py-5 text-xl">
                  Shop Collection
                </RainbowButton>
              </Link>
              <Link href="/studio">
                <button className="px-12 py-5 text-xl font-bold text-white border-2 border-white/20 rounded-xl hover:bg-white/10 transition-all">
                  Design Your Own
                </button>
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </main>
  );
}
