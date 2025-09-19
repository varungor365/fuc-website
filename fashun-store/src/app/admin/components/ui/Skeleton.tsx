'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'card' | 'text' | 'circle' | 'rectangle'
  animate?: boolean
  style?: React.CSSProperties
}

const Skeleton = ({ 
  className = '', 
  variant = 'rectangle',
  animate = true,
  style
}: SkeletonProps) => {
  const baseClasses = 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded'
  
  const variants = {
    card: 'h-32 rounded-xl',
    text: 'h-4 rounded',
    circle: 'rounded-full aspect-square',
    rectangle: 'h-6 rounded'
  }

  const skeletonClasses = `${baseClasses} ${variants[variant]} ${className}`

  if (animate) {
    return (
      <motion.div
        className={skeletonClasses}
        style={style}
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    )
  }

  return <div className={skeletonClasses} style={style} />
}

// Specialized skeleton components
export const KPICardSkeleton = () => (
  <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <Skeleton className="w-24 h-4" variant="text" />
        <Skeleton className="w-16 h-8" variant="text" />
      </div>
      <Skeleton className="w-10 h-10" variant="circle" />
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="w-12 h-4" variant="text" />
      <Skeleton className="w-20 h-3" variant="text" />
    </div>
  </div>
)

export const ChartSkeleton = () => (
  <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10" variant="circle" />
        <div className="space-y-2">
          <Skeleton className="w-32 h-5" variant="text" />
          <Skeleton className="w-24 h-3" variant="text" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-8 h-6" variant="text" />
        <Skeleton className="w-8 h-6" variant="text" />
        <Skeleton className="w-8 h-6" variant="text" />
      </div>
    </div>
    
    {/* Chart bars */}
    <div className="flex items-end justify-between h-48 gap-2 mb-4">
      {[40, 60, 35, 80, 55, 70].map((height, index) => (
        <Skeleton
          key={index}
          className={`flex-1 max-w-12`}
          style={{ height: `${height}%` }}
          variant="rectangle"
        />
      ))}
    </div>
    
    <div className="flex justify-center gap-6">
      <div className="flex items-center gap-2">
        <Skeleton className="w-3 h-3" variant="rectangle" />
        <Skeleton className="w-16 h-3" variant="text" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="w-3 h-3" variant="rectangle" />
        <Skeleton className="w-12 h-3" variant="text" />
      </div>
    </div>
  </div>
)

export const ListItemSkeleton = () => (
  <div className="p-4 rounded-lg bg-[#0F0F10] border border-gray-800">
    <div className="flex items-start gap-4">
      <Skeleton className="w-12 h-12" variant="circle" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="w-32 h-4" variant="text" />
          <Skeleton className="w-16 h-4" variant="text" />
        </div>
        <Skeleton className="w-24 h-3" variant="text" />
        <div className="flex gap-4">
          <Skeleton className="w-20 h-3" variant="text" />
          <Skeleton className="w-16 h-3" variant="text" />
        </div>
      </div>
    </div>
  </div>
)

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl overflow-hidden">
    {/* Header */}
    <div className="p-4 border-b border-gray-800">
      <div className="grid grid-cols-4 gap-4">
        <Skeleton className="h-4" variant="text" />
        <Skeleton className="h-4" variant="text" />
        <Skeleton className="h-4" variant="text" />
        <Skeleton className="h-4" variant="text" />
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-800">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="p-4">
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8" variant="circle" />
              <Skeleton className="w-24 h-4" variant="text" />
            </div>
            <Skeleton className="w-20 h-4" variant="text" />
            <Skeleton className="w-16 h-4" variant="text" />
            <Skeleton className="w-12 h-4" variant="text" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Hero section skeleton */}
    <div className="relative h-32 rounded-xl overflow-hidden">
      <Skeleton className="absolute inset-0" variant="card" />
      <div className="relative z-10 p-6">
        <Skeleton className="w-48 h-8 mb-2" variant="text" />
        <Skeleton className="w-64 h-4" variant="text" />
      </div>
    </div>

    {/* KPI Grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <KPICardSkeleton key={index} />
      ))}
    </div>

    {/* Main content grid skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Chart component */}
      <div className="xl:col-span-2">
        <ChartSkeleton />
      </div>
      
      {/* Side widget */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ListItemSkeleton key={index} />
        ))}
      </div>
    </div>

    {/* Bottom row skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <ListItemSkeleton key={index} />
        ))}
      </div>
    </div>
  </div>
)

export default Skeleton