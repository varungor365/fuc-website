'use client';

import { motion } from 'framer-motion';

export default function FloatingElements() {
  const shapes = [
    { size: 60, color: 'from-orange-400 to-red-400', delay: 0, duration: 20 },
    { size: 80, color: 'from-pink-400 to-purple-400', delay: 2, duration: 25 },
    { size: 50, color: 'from-yellow-400 to-orange-400', delay: 4, duration: 22 },
    { size: 70, color: 'from-red-400 to-pink-400', delay: 1, duration: 23 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${shape.color} opacity-20 blur-3xl`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
