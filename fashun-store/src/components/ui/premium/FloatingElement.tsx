'use client';

import { motion, useScroll, useTransform, HTMLMotionProps } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface FloatingElementProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  floatIntensity?: 'gentle' | 'medium' | 'strong' | 'extreme';
  rotateOnHover?: boolean;
  glowEffect?: boolean;
  magneticEffect?: boolean;
  parallaxStrength?: number;
  className?: string;
}

const floatVariants = {
  gentle: {
    y: [-5, 5, -5],
    rotate: [-1, 1, -1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  medium: {
    y: [-10, 10, -10],
    rotate: [-2, 2, -2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  strong: {
    y: [-15, 15, -15],
    rotate: [-3, 3, -3],
    x: [-2, 2, -2],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  extreme: {
    y: [-20, 20, -20],
    rotate: [-5, 5, -5],
    x: [-5, 5, -5],
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const FloatingElement = ({
  children,
  floatIntensity = 'medium',
  rotateOnHover = true,
  glowEffect = false,
  magneticEffect = false,
  parallaxStrength = 0.5,
  className = '',
  ...props
}: FloatingElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * parallaxStrength]);

  const baseClasses = [
    'relative',
    glowEffect ? 'hover:shadow-neon-purple transition-shadow duration-500' : '',
    className
  ].filter(Boolean).join(' ');

  const hoverVariants = {
    hover: {
      scale: magneticEffect ? 1.05 : 1.02,
      rotate: rotateOnHover ? 5 : 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={baseClasses}
      style={{ y }}
      animate={floatVariants[floatIntensity]}
      whileHover="hover"
      variants={hoverVariants}
      {...props}
    >
      {/* Glow effect */}
      {glowEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse-slow opacity-0 hover:opacity-100 transition-opacity duration-500" />
      )}
      
      {/* Magnetic field effect */}
      {magneticEffect && (
        <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 animate-aurora" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-particle-float opacity-60" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-particle-float delay-1000 opacity-60" />
        <div className="absolute bottom-1/4 left-3/4 w-1 h-1 bg-cyan-400 rounded-full animate-particle-float delay-2000 opacity-60" />
      </div>
    </motion.div>
  );
};

export default FloatingElement;