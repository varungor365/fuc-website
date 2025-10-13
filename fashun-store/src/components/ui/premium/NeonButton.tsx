'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glowIntensity?: 'low' | 'medium' | 'high' | 'extreme';
  animated?: boolean;
  ripple?: boolean;
  className?: string;
}

const variants = {
  primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500/50',
  secondary: 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-cyan-500/50',
  ghost: 'bg-transparent text-purple-400 border-purple-400/50 hover:bg-purple-400/10',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500/50'
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl'
};

const glowIntensities = {
  low: 'shadow-[0_0_10px_rgba(139,92,246,0.3)]',
  medium: 'shadow-[0_0_20px_rgba(139,92,246,0.4)]',
  high: 'shadow-[0_0_30px_rgba(139,92,246,0.5)]',
  extreme: 'shadow-[0_0_40px_rgba(139,92,246,0.6)]'
};

const NeonButton = ({
  children,
  variant = 'primary',
  size = 'md',
  glowIntensity = 'medium',
  animated = true,
  ripple = true,
  className = '',
  ...props
}: NeonButtonProps) => {
  const baseClasses = [
    'relative overflow-hidden rounded-xl border-2 font-semibold transition-all duration-300',
    'focus:outline-none focus:ring-4 focus:ring-purple-500/50',
    'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
    'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
    'backdrop-blur-sm',
    variants[variant],
    sizes[size],
    glowIntensities[glowIntensity],
    className
  ].filter(Boolean).join(' ');

  const buttonVariants = {
    idle: { 
      scale: 1,
      boxShadow: glowIntensities[glowIntensity].replace('shadow-[', '').replace(']', '')
    },
    hover: { 
      scale: 1.05,
      boxShadow: glowIntensities[glowIntensity].replace('shadow-[', '').replace(']', '').replace('0.3', '0.6').replace('0.4', '0.7').replace('0.5', '0.8').replace('0.6', '0.9')
    },
    tap: { 
      scale: 0.95
    }
  };

  return (
    <motion.button
      className={baseClasses}
      variants={animated ? buttonVariants : undefined}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      transition={{
        duration: 0.2,
        ease: "easeInOut"
      }}
      {...props}
    >
      {/* Ripple effect */}
      {ripple && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
        </div>
      )}
      
      {/* Holographic border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 animate-aurora" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Neon glow animation */}
      {animated && (
        <div className="absolute inset-0 rounded-xl animate-neon-pulse opacity-30" />
      )}
    </motion.button>
  );
};

export default NeonButton;