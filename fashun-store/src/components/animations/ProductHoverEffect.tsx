'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ProductHoverEffectProps {
  children: ReactNode;
}

export default function ProductHoverEffect({ children }: ProductHoverEffectProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -10,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl opacity-0 blur-xl"
        whileHover={{ opacity: 0.5 }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
