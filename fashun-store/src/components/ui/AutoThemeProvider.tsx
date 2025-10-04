'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AutoThemeContextType {
  theme: 'light' | 'dark'
  autoMode: boolean
  manualTheme: 'light' | 'dark' | null
  setManualTheme: (theme: 'light' | 'dark' | null) => void
  getTimeBasedTheme: () => 'light' | 'dark'
}

const AutoThemeContext = createContext<AutoThemeContextType | undefined>(undefined)

interface AutoThemeProviderProps {
  children: React.ReactNode
  darkHourStart?: number // Default: 19 (7 PM)
  lightHourStart?: number // Default: 6 (6 AM)
}

export function AutoThemeProvider({ 
  children, 
  darkHourStart = 19, 
  lightHourStart = 6 
}: AutoThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [autoMode, setAutoMode] = useState(true)
  const [manualTheme, setManualTheme] = useState<'light' | 'dark' | null>(null)

  // Function to determine theme based on local time
  const getTimeBasedTheme = (): 'light' | 'dark' => {
    try {
      const now = new Date()
      const currentHour = now.getHours()
      
      // Get user's timezone for better accuracy
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const userTime = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        hour12: false
      }).format(now)
      
      const userHour = parseInt(userTime, 10)
      
      // Dark theme: 7 PM (19:00) to 6 AM (06:00)
      // Light theme: 6 AM (06:00) to 7 PM (19:00)
      if (userHour >= darkHourStart || userHour < lightHourStart) {
        return 'dark'
      } else {
        return 'light'
      }
    } catch (error) {
      // Fallback to system time if timezone detection fails
      console.warn('Timezone detection failed, using system time:', error)
      const hour = new Date().getHours()
      return (hour >= darkHourStart || hour < lightHourStart) ? 'dark' : 'light'
    }
  }

  // Load saved preferences from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const savedManualTheme = localStorage.getItem('fashun-manual-theme')
      const savedAutoMode = localStorage.getItem('fashun-auto-mode')
      
      if (savedAutoMode !== null) {
        setAutoMode(JSON.parse(savedAutoMode))
      }
      
      if (savedManualTheme && savedManualTheme !== 'null') {
        setManualTheme(savedManualTheme as 'light' | 'dark')
      }
    } catch (error) {
      console.warn('Failed to load theme preferences:', error)
    }
  }, [])

  // Update theme based on auto mode or manual selection
  useEffect(() => {
    const updateTheme = () => {
      let newTheme: 'light' | 'dark'

      if (manualTheme && !autoMode) {
        newTheme = manualTheme
      } else {
        newTheme = getTimeBasedTheme()
      }

      setTheme(newTheme)
      
      // Apply theme to document
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
        document.documentElement.setAttribute('data-theme', newTheme)
      }
    }

    updateTheme()

    // Set up interval to check time every minute
    const interval = setInterval(updateTheme, 60000)

    return () => clearInterval(interval)
  }, [manualTheme, autoMode, darkHourStart, lightHourStart])

  // Handle manual theme setting
  const handleSetManualTheme = (newManualTheme: 'light' | 'dark' | null) => {
    setManualTheme(newManualTheme)
    setAutoMode(newManualTheme === null)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fashun-manual-theme', JSON.stringify(newManualTheme))
        localStorage.setItem('fashun-auto-mode', JSON.stringify(newManualTheme === null))
      } catch (error) {
        console.warn('Failed to save theme preferences:', error)
      }
    }
  }

  const contextValue: AutoThemeContextType = {
    theme,
    autoMode,
    manualTheme,
    setManualTheme: handleSetManualTheme,
    getTimeBasedTheme
  }

  return (
    <AutoThemeContext.Provider value={contextValue}>
      {children}
    </AutoThemeContext.Provider>
  )
}

// Hook to use the auto theme context
export function useAutoTheme() {
  const context = useContext(AutoThemeContext)
  if (context === undefined) {
    throw new Error('useAutoTheme must be used within an AutoThemeProvider')
  }
  return context
}

// Component to display current time and theme info
export function ThemeDebugInfo() {
  const { theme, autoMode, getTimeBasedTheme } = useAutoTheme()
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const timeBasedTheme = getTimeBasedTheme()
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 backdrop-blur">
      <div>Current Theme: <span className="text-accent-400">{theme}</span></div>
      <div>Auto Mode: <span className="text-accent-400">{autoMode ? 'ON' : 'OFF'}</span></div>
      <div>Time-based: <span className="text-accent-400">{timeBasedTheme}</span></div>
      <div>Local Time: <span className="text-accent-400">{currentTime.toLocaleTimeString()}</span></div>
      <div>Timezone: <span className="text-accent-400">{timeZone}</span></div>
    </div>
  )
}