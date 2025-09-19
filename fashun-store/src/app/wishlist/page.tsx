'use client'

import { Suspense } from 'react'
import Wishlist from '@/components/Wishlist'

export default function WishlistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    }>
      <Wishlist userId="user1" />
    </Suspense>
  )
}