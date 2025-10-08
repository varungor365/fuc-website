'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ProductCardAnimationProps {
  children: ReactNode;
  index: number;
}

export default function ProductCardAnimation({ children, index }: ProductCardAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -10,
        transition: { duration: 0.3 },
      }}
      className="group"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
