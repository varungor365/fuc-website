'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';

interface HolographicTextProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: 'rainbow' | 'cyber' | 'aurora' | 'crystal';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  intensity?: 'subtle' | 'medium' | 'strong' | 'extreme';
  animated?: boolean;
  shimmer?: boolean;
  className?: string;
}

const variants = {
  rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
  cyber: 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500',
  aurora: 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600',
  crystal: 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'
};

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl'
};

const intensities = {
  subtle: 'opacity-80',
  medium: 'opacity-90',
  strong: 'opacity-100',
  extreme: 'opacity-100 brightness-110'
};

const HolographicText = ({
  children,
  variant = 'cyber',
  size = 'md',
  intensity = 'medium',
  animated = true,
  shimmer = true,
  className = '',
  ...props
}: HolographicTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !textRef.current) return;

    const text = textRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            text.style.animationPlayState = 'running';
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(text);
    return () => observer.unobserve(text);
  }, [animated]);

  const baseClasses = [
    'relative inline-block font-bold leading-tight',
    'bg-clip-text text-transparent',
    variants[variant],
    sizes[size],
    intensities[intensity],
    animated ? 'animate-hologram' : '',
    className
  ].filter(Boolean).join(' ');

  const textVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      filter: 'blur(10px) hue-rotate(0deg)'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px) hue-rotate(0deg)',
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      filter: 'blur(0px) hue-rotate(90deg)',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      ref={textRef}
      className={baseClasses}
      variants={animated ? textVariants : undefined}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      {...props}
    >
      {/* Main text */}
      <span className="relative z-10">
        {children}
      </span>

      {/* Shimmer effect */}
      {shimmer && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shimmer opacity-0 hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      {/* Holographic glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 blur-xl animate-aurora opacity-50" />
      
      {/* Text shadow layers for depth */}
      <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 blur-sm opacity-50 animate-pulse-slow" />
      
      {/* Prismatic effect */}
      <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 opacity-30 animate-neon-pulse" />

      {/* Scanning line effect */}
      {animated && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-levitate opacity-60" />
        </div>
      )}
    </motion.div>
  );
};

export default HolographicText;