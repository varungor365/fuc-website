'use client'

import { useSearchParams } from 'next/navigation'
import AffiliateDashboard from '@/components/AffiliateDashboard'

export default function AffiliateDashboardPage() {
  const searchParams = useSearchParams()
  const affiliateId = searchParams.get('id') || 'aff-1' // Default for demo

  return <AffiliateDashboard affiliateId={affiliateId} />
}