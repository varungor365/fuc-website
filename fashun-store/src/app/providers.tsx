'use client'

import { createContext, useContext, useEffect, useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion' // Removed for now
import { AuthProvider } from '@/components/auth/AuthProvider'
import SuperTokensProvider from '@/components/auth/SuperTokensProvider'

interface ProvidersProps {
  children: React.ReactNode
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
  const [mounted, setMounted] = useState(false)

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    // Only run on client side
    if (typeof window === 'undefined') return
    
    // FashUn.Co.in is primarily dark theme, but allow system preference override
    const savedTheme = localStorage.getItem('fashun-theme') as 'dark' | 'light' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setTheme(savedTheme || systemTheme || 'dark')
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    // Only run on client side
    if (typeof window === 'undefined') return
    
    localStorage.setItem('fashun-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme, mounted])

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    )
  }

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
      <div className="transition-opacity duration-300 ease-in-out">
        {children}
      </div>
    </PageTransitionContext.Provider>
  )
}

// Combined Providers
export function Providers({ children }: ProvidersProps) {
  return (
    <SuperTokensProvider>
      <AuthProvider>
        <ThemeProvider>
          <PageTransitionProvider>
            {children}
          </PageTransitionProvider>
        </ThemeProvider>
      </AuthProvider>
    </SuperTokensProvider>
  )
}
