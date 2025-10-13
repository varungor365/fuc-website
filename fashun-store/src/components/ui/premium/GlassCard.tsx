'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: 'default' | 'blur' | 'frost' | 'crystal';
  glowColor?: 'purple' | 'blue' | 'cyan' | 'pink' | 'white';
  className?: string;
}

const variants = {
  default: 'backdrop-blur-xl bg-white/10 border border-white/20',
  blur: 'backdrop-blur-2xl bg-white/5 border border-white/10',
  frost: 'backdrop-blur-md bg-gradient-to-br from-white/20 to-white/5 border border-white/30',
  crystal: 'backdrop-blur-3xl bg-gradient-to-br from-white/15 to-transparent border border-white/25'
};

const glowColors = {
  purple: 'shadow-[0_8px_32px_rgba(139,92,246,0.3)] hover:shadow-[0_8px_60px_rgba(139,92,246,0.4)]',
  blue: 'shadow-[0_8px_32px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_60px_rgba(59,130,246,0.4)]',
  cyan: 'shadow-[0_8px_32px_rgba(34,211,238,0.3)] hover:shadow-[0_8px_60px_rgba(34,211,238,0.4)]',
  pink: 'shadow-[0_8px_32px_rgba(236,72,153,0.3)] hover:shadow-[0_8px_60px_rgba(236,72,153,0.4)]',
  white: 'shadow-[0_8px_32px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_60px_rgba(255,255,255,0.3)]'
};

const GlassCard = ({ 
  children, 
  variant = 'default',
  glowColor = 'white',
  className = '',
  ...props 
}: GlassCardProps) => {
  const baseClasses = [
    variants[variant],
    glowColors[glowColor],
    'rounded-2xl transition-all duration-500 relative overflow-hidden',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={baseClasses}
      whileHover={{ 
        y: -5,
        background: variant === 'default' ? 'rgba(255,255,255,0.15)' : undefined,
        transition: { duration: 0.3 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full animate-shimmer" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Enhanced border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default GlassCard;