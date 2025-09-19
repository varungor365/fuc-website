'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AffiliateDashboard from '@/components/AffiliateDashboard'

function AffiliateDashboardContent() {
  const searchParams = useSearchParams()
  const affiliateId = searchParams.get('id') || 'aff-1' // Default for demo

  return <AffiliateDashboard affiliateId={affiliateId} />
}

export default function AffiliateDashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="text-white">Loading affiliate dashboard...</div>
    </div>}>
      <AffiliateDashboardContent />
    </Suspense>
  )
}