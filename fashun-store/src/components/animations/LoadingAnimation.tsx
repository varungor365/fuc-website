'use client';

import { motion } from 'framer-motion';

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-20 h-20">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-4 border-orange-500 rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeOut',
            }}
          />
        ))}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
