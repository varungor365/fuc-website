'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function WishlistButton({ productId }: { productId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.includes(productId));
  }, [productId]);

  function toggleWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isWishlisted) {
      const updated = wishlist.filter((id: string) => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setIsWishlisted(false);
    } else {
      wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    }
  }

  return (
    <motion.button
      onClick={toggleWishlist}
      animate={animate ? { scale: [1, 1.3, 1] } : {}}
      className={`p-3 rounded-full transition ${
        isWishlisted
          ? 'bg-red-500 text-white'
          : 'bg-white/10 text-gray-400 hover:bg-white/20'
      }`}
    >
      {isWishlisted ? '❤️' : '🤍'}
    </motion.button>
  );
}
