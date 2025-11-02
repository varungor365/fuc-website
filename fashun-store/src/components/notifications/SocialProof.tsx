'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Purchase {
  name: string;
  product: string;
  location: string;
  time: string;
  action: string;
  emoji: string;
}

export default function SocialProof() {
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);
  const [show, setShow] = useState(false);

  const purchases: Purchase[] = [
    { 
      name: 'Aarav Sharma', 
      product: 'Classic Oversized Hoodie', 
      location: 'Connaught Place, Delhi', 
      time: '1 min ago',
      action: 'just ordered',
      emoji: '🔥'
    },
    { 
      name: 'Ananya Reddy', 
      product: 'Vintage Graphic Tee', 
      location: 'Banjara Hills, Hyderabad', 
      time: '3 min ago',
      action: 'purchased',
      emoji: '✨'
    },
    { 
      name: 'Kartik Mehta', 
      product: 'Streetwear Cargo Pants', 
      location: 'Linking Road, Mumbai', 
      time: '4 min ago',
      action: 'bought',
      emoji: '🚀'
    },
    { 
      name: 'Diya Patel', 
      product: 'Cropped Denim Jacket', 
      location: 'Commercial Street, Bangalore', 
      time: '6 min ago',
      action: 'just grabbed',
      emoji: '💫'
    },
    { 
      name: 'Rohit Joshi', 
      product: 'Urban Bomber Jacket', 
      location: 'Park Street, Kolkata', 
      time: '8 min ago',
      action: 'ordered',
      emoji: '⚡'
    },
    { 
      name: 'Kavya Singh', 
      product: 'High-Waisted Mom Jeans', 
      location: 'City Palace Road, Jaipur', 
      time: '9 min ago',
      action: 'purchased',
      emoji: '🌟'
    },
    { 
      name: 'Aryan Gupta', 
      product: 'Tie-Dye Oversized Tee', 
      location: 'Mall Road, Shimla', 
      time: '11 min ago',
      action: 'just bought',
      emoji: '🎨'
    },
    { 
      name: 'Ishita Agarwal', 
      product: 'Cropped Tank Top', 
      location: 'MG Road, Pune', 
      time: '12 min ago',
      action: 'snagged',
      emoji: '💝'
    },
    { 
      name: 'Vedant Kumar', 
      product: 'Distressed Skinny Jeans', 
      location: 'Gangtok Main Market, Sikkim', 
      time: '14 min ago',
      action: 'ordered',
      emoji: '🔥'
    },
    { 
      name: 'Riya Chopra', 
      product: 'Aesthetic Crop Hoodie', 
      location: 'Sector 17, Chandigarh', 
      time: '16 min ago',
      action: 'just purchased',
      emoji: '💖'
    },
    { 
      name: 'Harsh Verma', 
      product: 'Tech Fleece Joggers', 
      location: 'Hazratganj, Lucknow', 
      time: '18 min ago',
      action: 'bought',
      emoji: '⚡'
    },
    { 
      name: 'Tanya Sood', 
      product: 'Minimalist Tote Bag', 
      location: 'Mall Road, Dehradun', 
      time: '19 min ago',
      action: 'grabbed',
      emoji: '✨'
    },
    { 
      name: 'Yash Thakur', 
      product: 'Retro Track Pants', 
      location: 'Gandhi Nagar, Bhopal', 
      time: '21 min ago',
      action: 'just ordered',
      emoji: '🚀'
    },
    { 
      name: 'Pooja Nair', 
      product: 'Statement Earrings Set', 
      location: 'Marine Drive, Kochi', 
      time: '23 min ago',
      action: 'purchased',
      emoji: '💫'
    },
    { 
      name: 'Aman Singh', 
      product: 'Utility Vest', 
      location: 'Lal Chowk, Srinagar', 
      time: '25 min ago',
      action: 'bought',
      emoji: '🌟'
    },
    { 
      name: 'Nidhi Jain', 
      product: 'Boyfriend Blazer', 
      location: 'Paltan Bazaar, Guwahati', 
      time: '27 min ago',
      action: 'just got',
      emoji: '🔥'
    },
    { 
      name: 'Akshay Rao', 
      product: 'Graphic Print Shorts', 
      location: 'Brigade Road, Bangalore', 
      time: '29 min ago',
      action: 'ordered',
      emoji: '⚡'
    },
    { 
      name: 'Shreya Malhotra', 
      product: 'Embroidered Kurta Top', 
      location: 'Sarojini Nagar, Delhi', 
      time: '31 min ago',
      action: 'purchased',
      emoji: '✨'
    },
    { 
      name: 'Siddharth Mishra', 
      product: 'Street Style Sneakers', 
      location: 'Janpath, New Delhi', 
      time: '33 min ago',
      action: 'just copped',
      emoji: '👟'
    },
    { 
      name: 'Myra Shah', 
      product: 'Chunky Gold Chain', 
      location: 'Linking Road, Mumbai', 
      time: '35 min ago',
      action: 'snagged',
      emoji: '💝'
    }
  ];

  // Generate more realistic timing intervals (12-25 seconds minimum)
  const getRandomInterval = () => {
    return Math.floor(Math.random() * 13000) + 12000; // 12-25 seconds (12000-25000ms)
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const showNextNotification = () => {
      if (show) return; // Don't show if already showing

      const randomPurchase = purchases[Math.floor(Math.random() * purchases.length)];
      setCurrentPurchase(randomPurchase);
      setShow(true);

      // Hide after 4-6 seconds
      const hideTimeout = Math.floor(Math.random() * 2000) + 4000;
      setTimeout(() => setShow(false), hideTimeout);

      // Schedule next notification
      timeoutId = setTimeout(showNextNotification, getRandomInterval());
    };

    // Start first notification after 2 seconds
    timeoutId = setTimeout(showNextNotification, 2000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && currentPurchase && (
        <motion.div
          initial={{ x: -400, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -400, opacity: 0, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            damping: 15, 
            stiffness: 200 
          }}
          className="fixed bottom-8 left-8 z-50 bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-4 shadow-2xl max-w-sm hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setShow(false)}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-xl shadow-lg">
              {currentPurchase.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-white text-sm">{currentPurchase.name}</p>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-200">
                <span className="text-yellow-300 font-medium">{currentPurchase.action}</span>{' '}
                <span className="text-pink-300 font-semibold">{currentPurchase.product}</span>
              </p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-gray-300">📍 {currentPurchase.location}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-purple-300">⏰ {currentPurchase.time}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShow(false);
              }}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              ✕
            </button>
          </div>
          
          {/* Subtle animation bar */}
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-pink-500"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
