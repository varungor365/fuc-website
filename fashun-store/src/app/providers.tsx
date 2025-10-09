'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/providers/AuthProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

// Theme Provider
const ThemeContext = createContext<{
  theme: 'dark' | 'light'
  toggleTheme: () => void
}>({
  theme: 'dark',
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

function ThemeProvider({ children }: ProvidersProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    // FashUn.Co.in is primarily dark theme, but allow system preference override
    const savedTheme = localStorage.getItem('fashun-theme') as 'dark' | 'light' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setTheme(savedTheme || systemTheme || 'dark')
  }, [])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    localStorage.setItem('fashun-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Page Transition Provider
const PageTransitionContext = createContext<{
  isTransitioning: boolean
  startTransition: () => void
}>({
  isTransitioning: false,
  startTransition: () => {},
})

export const usePageTransition = () => useContext(PageTransitionContext)

function PageTransitionProvider({ children }: ProvidersProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const startTransition = () => {
    setIsTransitioning(true)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, startTransition }}>
      <AnimatePresence mode="wait">
        <motion.div
          key="page-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.22, 1, 0.36, 1] // Custom easing for smooth transitions
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PageTransitionContext.Provider>
  )
}

// Combined Providers
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <PageTransitionProvider>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </PageTransitionProvider>
    </ThemeProvider>
  );
}
