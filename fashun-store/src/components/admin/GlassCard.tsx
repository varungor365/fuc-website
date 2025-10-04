import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  border?: 'none' | 'light' | 'medium' | 'heavy'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  onClick?: () => void
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = false,
  gradient = false,
  border = 'medium',
  blur = 'xl',
  onClick
}) => {
  const borderClasses = {
    none: 'border-0',
    light: 'border border-white/10',
    medium: 'border border-white/20',
    heavy: 'border-2 border-white/30'
  }

  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }

  const baseClasses = cn(
    // Base glass styling
    'bg-white/10',
    blurClasses[blur],
    borderClasses[border],
    'rounded-2xl',
    'shadow-xl',
    'p-6',
    
    // Gradient overlay
    gradient && 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10',
    
    // Hover effects
    hover && [
      'hover:bg-white/15',
      'hover:border-white/30',
      'hover:shadow-2xl',
      'hover:scale-[1.02]',
      'transition-all duration-300 ease-out',
      'cursor-pointer'
    ],
    
    // Clickable
    onClick && 'cursor-pointer',
    
    // Focus styles for accessibility
    'focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:outline-none',
    
    className
  )

  const CardWrapper = onClick ? motion.div : 'div'

  return (
    <CardWrapper
      className={baseClasses}
      onClick={onClick}
      {...(onClick && {
        whileHover: { scale: hover ? 1.02 : 1 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 }
      })}
    >
      {children}
    </CardWrapper>
  )
}

export default GlassCard