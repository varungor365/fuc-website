'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useAutoTheme } from './AutoThemeProvider'

interface ThemeToggleProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ThemeToggle({ 
  className = '', 
  showText = true, 
  size = 'md' 
}: ThemeToggleProps) {
  const { theme, autoMode, manualTheme, setManualTheme } = useAutoTheme()

  const handleToggle = () => {
    if (autoMode) {
      // Switch to manual mode with opposite of current auto theme
      setManualTheme(theme === 'light' ? 'dark' : 'light')
    } else if (manualTheme === 'light') {
      // Switch from manual light to manual dark
      setManualTheme('dark')
    } else if (manualTheme === 'dark') {
      // Switch from manual dark back to auto mode
      setManualTheme(null)
    }
  }

  const getIcon = () => {
    if (autoMode) return ClockIcon
    return theme === 'light' ? SunIcon : MoonIcon
  }

  const getLabel = () => {
    if (autoMode) return 'Auto'
    return theme === 'light' ? 'Light' : 'Dark'
  }

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-5 text-lg'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const IconComponent = getIcon()

  return (
    <motion.button
      onClick={handleToggle}
      className={`
        relative flex items-center gap-2 rounded-xl
        bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10
        border border-white/20 dark:border-white/10
        text-gray-900 dark:text-gray-100
        transition-all duration-300 backdrop-blur-sm
        ${sizeClasses[size]}
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Switch theme (currently ${getLabel()})`}
    >
      {/* Icon with animation */}
      <motion.div
        key={getLabel()}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ duration: 0.2 }}
      >
        <IconComponent className={iconSizes[size]} />
      </motion.div>

      {/* Text label */}
      {showText && (
        <AnimatePresence mode="wait">
          <motion.span
            key={getLabel()}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="font-medium"
          >
            {getLabel()}
          </motion.span>
        </AnimatePresence>
      )}

      {/* Auto mode indicator */}
      {autoMode && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 h-3 w-3 bg-accent-500 rounded-full border-2 border-white dark:border-gray-900"
        />
      )}
    </motion.button>
  )
}

// Compact version for mobile/small spaces
export function CompactThemeToggle({ className = '' }: { className?: string }) {
  return (
    <ThemeToggle
      className={`${className}`}
      showText={false}
      size="sm"
    />
  )
}

// Theme toggle with dropdown for advanced options
export function AdvancedThemeToggle({ className = '' }: { className?: string }) {
  const { theme, autoMode, manualTheme, setManualTheme } = useAutoTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  const options = [
    { id: 'auto', label: 'Auto (time-based)', icon: ClockIcon },
    { id: 'light', label: 'Light mode', icon: SunIcon },
    { id: 'dark', label: 'Dark mode', icon: MoonIcon }
  ]

  const handleSelect = (optionId: string) => {
    if (optionId === 'auto') {
      setManualTheme(null)
    } else {
      setManualTheme(optionId as 'light' | 'dark')
    }
    setIsOpen(false)
  }

  const getCurrentOption = () => {
    if (autoMode) return options[0]
    return options.find(opt => opt.id === theme) || options[0]
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 text-gray-900 dark:text-gray-100 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {React.createElement(getCurrentOption().icon, { className: "h-5 w-5" })}
        <span className="text-sm font-medium">{getCurrentOption().label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg z-50 min-w-[200px]"
          >
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                  ${option.id === (autoMode ? 'auto' : theme) ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400' : 'text-gray-700 dark:text-gray-200'}
                  ${option === options[0] ? 'rounded-t-xl' : ''}
                  ${option === options[options.length - 1] ? 'rounded-b-xl' : ''}
                `}
              >
                {React.createElement(option.icon, { className: "h-5 w-5" })}
                <span className="text-sm font-medium">{option.label}</span>
                {option.id === (autoMode ? 'auto' : theme) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto h-2 w-2 bg-accent-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}