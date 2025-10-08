'use client';

import { motion } from 'framer-motion';

export default function MorphingShape() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M500,200 Q700,300 600,500 T500,800 Q300,700 400,500 T500,200"
          fill="url(#gradient1)"
          initial={{ d: "M500,200 Q700,300 600,500 T500,800 Q300,700 400,500 T500,200" }}
          animate={{
            d: [
              "M500,200 Q700,300 600,500 T500,800 Q300,700 400,500 T500,200",
              "M500,250 Q650,350 550,500 T500,750 Q350,650 450,500 T500,250",
              "M500,200 Q700,300 600,500 T500,800 Q300,700 400,500 T500,200",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.circle
          cx="500"
          cy="500"
          r="150"
          fill="none"
          stroke="rgba(249, 115, 22, 0.3)"
          strokeWidth="2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}
