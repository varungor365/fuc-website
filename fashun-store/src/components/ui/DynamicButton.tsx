'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface DynamicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function DynamicButton({ 
  children, 
  onClick, 
  href, 
  variant = 'primary',
  size = 'md',
  className = ''
}: DynamicButtonProps) {
  const baseStyles = 'font-bold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700',
    outline: 'bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const ButtonContent = (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={buttonClasses}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );

  if (href) {
    return (
      <a href={href}>
        {ButtonContent}
      </a>
    );
  }

  return ButtonContent;
}
