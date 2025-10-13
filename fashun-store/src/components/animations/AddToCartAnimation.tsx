'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface AddToCartAnimationProps {
  show: boolean;
}

export default function AddToCartAnimation({ show }: AddToCartAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-full p-8 shadow-2xl"
          >
            <CheckCircleIcon className="w-24 h-24 text-green-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-4"
          >
            <p className="text-white text-xl font-bold bg-black/50 backdrop-blur-sm px-6 py-2 rounded-full">
              Added to Cart!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
