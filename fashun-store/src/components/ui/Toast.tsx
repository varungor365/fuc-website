'use client'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/24/outline'

export interface Toast {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProviderProps {
  children: React.ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxToasts?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ 
  children, 
  position = 'top-right', 
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    }

    setToasts(prev => {
      const updated = [newToast, ...prev]
      return updated.slice(0, maxToasts)
    })

    // Auto-remove toast after duration (unless persistent)
    if (!newToast.persistent && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }, [maxToasts])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2'
      case 'top-right':
        return 'top-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2'
      case 'bottom-right':
        return 'bottom-4 right-4'
      default:
        return 'top-4 right-4'
    }
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <div className={`fixed z-50 pointer-events-none ${getPositionClasses()}`}>
        <div className="flex flex-col space-y-2 max-w-sm w-full">
          <AnimatePresence>
            {toasts.map((toast) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                onRemove={() => removeToast(toast.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  )
}

interface ToastItemProps {
  toast: Toast
  onRemove: () => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(true)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!toast.persistent && toast.duration && toast.duration > 0) {
      const progressBar = progressRef.current
      if (progressBar) {
        progressBar.style.animation = `shrink ${toast.duration}ms linear`
      }
    }
  }, [toast.duration, toast.persistent])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(onRemove, 150) // Wait for animation to complete
  }

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          background: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
          icon: <CheckIcon className="w-5 h-5 text-green-500" />,
          iconBg: 'bg-green-100 dark:bg-green-900/50',
          progressColor: 'bg-green-500'
        }
      case 'error':
        return {
          background: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
          icon: <XMarkIcon className="w-5 h-5 text-red-500" />,
          iconBg: 'bg-red-100 dark:bg-red-900/50',
          progressColor: 'bg-red-500'
        }
      case 'warning':
        return {
          background: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
          icon: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />,
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/50',
          progressColor: 'bg-yellow-500'
        }
      case 'info':
      default:
        return {
          background: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
          icon: <InformationCircleIcon className="w-5 h-5 text-blue-500" />,
          iconBg: 'bg-blue-100 dark:bg-blue-900/50',
          progressColor: 'bg-blue-500'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.15 }}
          className={`
            ${styles.background}
            border rounded-lg shadow-lg backdrop-blur-sm
            pointer-events-auto relative overflow-hidden
            max-w-sm w-full
          `}
        >
          {/* Progress Bar */}
          {!toast.persistent && toast.duration && toast.duration > 0 && (
            <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full">
              <div
                ref={progressRef}
                className={`h-full ${styles.progressColor} origin-left`}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={`${styles.iconBg} rounded-full p-1 flex-shrink-0`}>
                {styles.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {toast.title}
                    </h4>
                    {toast.message && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {toast.message}
                      </p>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleRemove}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Action Button */}
                {toast.action && (
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        toast.action?.onClick()
                        handleRemove()
                      }}
                      className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    >
                      {toast.action.label}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Convenience hooks for different toast types
export function useToastHelpers() {
  const { addToast } = useToast()

  const success = React.useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'success',
      title,
      message,
      ...options
    })
  }, [addToast])

  const error = React.useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'error',
      title,
      message,
      ...options
    })
  }, [addToast])

  const warning = React.useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'warning',
      title,
      message,
      ...options
    })
  }, [addToast])

  const info = React.useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'info',
      title,
      message,
      ...options
    })
  }, [addToast])

  return { success, error, warning, info }
}

// CSS for progress bar animation (add to globals.css)
const progressBarCSS = `
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
`

export { progressBarCSS }