'use client';

import { useState } from 'react';
import { SparklesIcon, BoltIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import PhygitalUpgradeModal from './PhygitalUpgradeModal';

interface PhygitalUpgradeButtonProps {
  productName: string;
  productPrice: number;
  onAddToCart: (isPhygital: boolean) => void;
  className?: string;
}

export default function PhygitalUpgradeButton({
  productName,
  productPrice,
  onAddToCart,
  className = ""
}: PhygitalUpgradeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpgrade = (isPhygital: boolean) => {
    onAddToCart(isPhygital);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Content */}
        <div className="relative flex items-center justify-center gap-3">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <SparklesIcon className="w-6 h-6" />
          </motion.div>
          
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-lg">Add to Cart</span>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold"
              >
                FREE UPGRADE
              </motion.div>
            </div>
            <div className="text-sm opacity-90 flex items-center gap-1">
              <BoltIcon className="w-4 h-4" />
              Unlock Phygital Experience
            </div>
          </div>
        </div>

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 3,
          }}
        />
      </motion.button>

      <PhygitalUpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={productName}
        productPrice={productPrice}
        onUpgrade={handleUpgrade}
      />
    </>
  );
}