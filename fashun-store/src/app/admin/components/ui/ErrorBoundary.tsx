'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  HomeIcon 
} from '@heroicons/react/24/outline'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorFallbackProps {
  error?: Error
  resetError: () => void
  title?: string
  message?: string
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent 
          error={this.state.error}
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-64 flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"
        >
          <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-semibold text-[#E8E8E8] mb-2"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 mb-6"
        >
          {message}
        </motion.p>

        {process.env.NODE_ENV === 'development' && error && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-left"
          >
            <summary className="cursor-pointer text-gray-500 text-sm mb-2">
              Error Details (Development)
            </summary>
            <div className="bg-[#0F0F10] border border-gray-800 rounded-lg p-3 text-xs text-red-400 font-mono overflow-auto max-h-32">
              {error.message}
            </div>
          </motion.details>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetError}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#E4C590] text-black rounded-lg font-medium hover:bg-[#E4C590]/90 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Try Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/admin'}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1C1C1E] text-gray-400 border border-gray-700 rounded-lg font-medium hover:text-[#E8E8E8] hover:border-gray-600 transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            Go to Dashboard
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Specialized error fallbacks
export const ComponentErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError 
}) => (
  <div className="bg-[#1C1C1E] border border-red-500/20 rounded-xl p-6 text-center">
    <ExclamationTriangleIcon className="w-8 h-8 text-red-400 mx-auto mb-3" />
    <h3 className="text-lg font-medium text-[#E8E8E8] mb-2">
      Component Error
    </h3>
    <p className="text-gray-400 text-sm mb-4">
      This component failed to load properly.
    </p>
    <button
      onClick={resetError}
      className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
    >
      Retry Component
    </button>
  </div>
)

export const ChartErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError 
}) => (
  <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 h-64 flex items-center justify-center">
    <div className="text-center">
      <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-[#E8E8E8] mb-2">
        Chart Loading Error
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Unable to load chart data. Please try again.
      </p>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg text-sm hover:bg-yellow-500/20 transition-colors"
      >
        Reload Chart
      </button>
    </div>
  </div>
)

// Hook for handling async errors
export const useAsyncError = () => {
  const [, setError] = React.useState()
  return React.useCallback((error: Error) => {
    setError(() => {
      throw error
    })
  }, [])
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

export default ErrorBoundary