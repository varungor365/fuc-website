'use client'

import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import Skeleton, { 
  KPICardSkeleton, 
  ChartSkeleton, 
  ListItemSkeleton, 
  TableSkeleton 
} from './Skeleton'
import ErrorBoundary, { 
  ComponentErrorFallback, 
  ChartErrorFallback 
} from './ErrorBoundary'

interface LoadingWrapperProps {
  children: React.ReactNode
  loading?: boolean
  error?: Error | null
  skeleton?: 'card' | 'chart' | 'list' | 'table' | 'custom'
  skeletonCount?: number
  className?: string
  onRetry?: () => void
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  children,
  loading = false,
  error = null,
  skeleton = 'card',
  skeletonCount = 1,
  className = '',
  onRetry
}) => {
  // Error state
  if (error) {
    return (
      <div className={className}>
        <ComponentErrorFallback 
          error={error} 
          resetError={onRetry || (() => window.location.reload())}
        />
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className={className}>
        {skeleton === 'card' && (
          <div className="grid gap-6">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <KPICardSkeleton key={index} />
            ))}
          </div>
        )}
        
        {skeleton === 'chart' && <ChartSkeleton />}
        
        {skeleton === 'list' && (
          <div className="space-y-3">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <ListItemSkeleton key={index} />
            ))}
          </div>
        )}
        
        {skeleton === 'table' && <TableSkeleton rows={skeletonCount} />}
        
        {skeleton === 'custom' && (
          <Skeleton className="h-32 w-full" variant="card" />
        )}
      </div>
    )
  }

  // Success state
  return <div className={className}>{children}</div>
}

// Specialized loading wrappers
export const KPILoader: React.FC<{ 
  children: React.ReactNode
  loading?: boolean
  count?: number 
}> = ({ children, loading, count = 6 }) => (
  <LoadingWrapper
    loading={loading}
    skeleton="card"
    skeletonCount={count}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
  >
    {children}
  </LoadingWrapper>
)

export const ChartLoader: React.FC<{ 
  children: React.ReactNode
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
}> = ({ children, loading, error, onRetry }) => (
  <ErrorBoundary fallback={ChartErrorFallback}>
    <LoadingWrapper
      loading={loading}
      error={error}
      skeleton="chart"
      onRetry={onRetry}
    >
      {children}
    </LoadingWrapper>
  </ErrorBoundary>
)

export const ListLoader: React.FC<{ 
  children: React.ReactNode
  loading?: boolean
  count?: number
}> = ({ children, loading, count = 5 }) => (
  <LoadingWrapper
    loading={loading}
    skeleton="list"
    skeletonCount={count}
  >
    {children}
  </LoadingWrapper>
)

// Async component loader with error boundary
export const AsyncComponent: React.FC<{
  children: React.ReactNode
  fallback?: React.ReactNode
  errorFallback?: React.ComponentType<any>
}> = ({ 
  children, 
  fallback = <Skeleton className="h-32 w-full" variant="card" />,
  errorFallback 
}) => (
  <ErrorBoundary fallback={errorFallback}>
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  </ErrorBoundary>
)

// Loading overlay for full-screen loading states
export const LoadingOverlay: React.FC<{
  visible: boolean
  message?: string
  transparent?: boolean
}> = ({ 
  visible, 
  message = 'Loading...', 
  transparent = false 
}) => {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        transparent ? 'bg-black/20' : 'bg-[#0F0F10]/90'
      } backdrop-blur-sm`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-8 text-center max-w-sm mx-4"
      >
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#E4C590] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#E8E8E8] font-medium">{message}</p>
      </motion.div>
    </motion.div>
  )
}

// Progressive loading hook
export const useProgressiveLoading = (steps: string[]) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const nextStep = () => {
    setCurrentStep(prev => {
      const next = prev + 1
      if (next >= steps.length) {
        setIsComplete(true)
        return prev
      }
      return next
    })
  }

  const reset = () => {
    setCurrentStep(0)
    setIsComplete(false)
  }

  return {
    currentStep,
    currentStepName: steps[currentStep],
    isComplete,
    progress: (currentStep / steps.length) * 100,
    nextStep,
    reset
  }
}

export default LoadingWrapper