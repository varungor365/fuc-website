'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import RecommendationEngine, { RECOMMENDATION_REASONS } from './RecommendationEngine';
import VirtualStyleAssistant from './VirtualStyleAssistant';

interface PersonalizedSectionsProps {
  userId?: string;
  userPreferences?: {
    favoriteCategories: string[];
    styleProfile: string;
    sizeProfile: any;
  };
}

const PersonalizedSections: React.FC<PersonalizedSectionsProps> = ({ 
  userId = 'demo-user',
  userPreferences 
}) => {
  const [isStyleAssistantOpen, setIsStyleAssistantOpen] = useState(false)
  
  // Mock user data - in production this would come from user profile/analytics
  const mockUserData = {
    favoriteCategories: ['hoodies', 'tshirts'],
    styleProfile: 'streetwear',
    recentlyViewed: ['product-1', 'product-2'],
    purchaseHistory: ['product-3']
  };

  return (
    <>
      <div className="space-y-16 py-16">
        {/* For You Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <RecommendationEngine
            products={[]} // Will load dynamically
            reason={RECOMMENDATION_REASONS.STYLE_MATCH}
            title="Premium Streetwear Collection"
            subtitle="Handpicked streetwear essentials based on your unique fashion taste"
            userId={userId}
            className="container mx-auto px-4"
          />
        </motion.section>

        {/* Similar Users Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <RecommendationEngine
            products={[]} // Will load dynamically
            reason={RECOMMENDATION_REASONS.SIMILAR_USERS}
            title="Others Like You Loved"
            subtitle="Popular choices among users with similar taste"
            userId={userId}
            className="container mx-auto px-4"
          />
        </motion.section>

        {/* Trending Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <RecommendationEngine
            products={[]} // Will load dynamically
            reason={RECOMMENDATION_REASONS.TRENDING}
            title="Trending Streetwear India"
            subtitle="What's hot in Indian streetwear fashion right now"
            userId={userId}
            className="container mx-auto px-4"
          />
        </motion.section>

        {/* Recently Viewed */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <RecommendationEngine
            products={[]} // Will load dynamically
            reason={RECOMMENDATION_REASONS.BROWSING_HISTORY}
            title="Continue Shopping"
            subtitle="Based on your recent activity"
            userId={userId}
            className="container mx-auto px-4"
          />
        </motion.section>

        {/* AI Style Assistant Call-to-Action */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/50 via-pink-800/50 to-purple-900/50 border border-purple-500/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-20"></div>
            <div className="relative p-8 md:p-12 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block mb-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Meet Luna, Your AI Style Expert
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Get personalized outfit recommendations, style advice, and fashion tips from our intelligent AI assistant. 
                Chat with Luna to discover your perfect look!
              </p>
              
              <motion.button
                onClick={() => setIsStyleAssistantOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                <span>Chat with Luna</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <SparklesIcon className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>
      
      {/* Virtual Style Assistant Modal */}
      <VirtualStyleAssistant
        isOpen={isStyleAssistantOpen}
        onClose={() => setIsStyleAssistantOpen(false)}
      />
    </>
  );
};

export default PersonalizedSections;