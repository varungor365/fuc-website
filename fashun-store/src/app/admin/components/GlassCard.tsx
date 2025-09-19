'use client'

import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  border?: 'light' | 'medium' | 'strong'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
}

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = true,
  border = 'medium',
  blur = 'xl'
}: GlassCardProps) => {
  const borderStyles = {
    light: 'border-white/10',
    medium: 'border-white/20', 
    strong: 'border-white/30'
  }

  const blurStyles = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }

  return (
    <div className={`
      relative overflow-hidden rounded-2xl 
      ${gradient 
        ? 'bg-gradient-to-br from-white/15 to-white/5' 
        : 'bg-white/10'
      }
      ${blurStyles[blur]}
      border ${borderStyles[border]}
      shadow-2xl
      ${hover ? 'hover:shadow-3xl hover:scale-[1.02] hover:border-white/30 transition-all duration-500' : ''}
      ${className}
    `}>
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-2xl shadow-inner shadow-white/10"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default GlassCard