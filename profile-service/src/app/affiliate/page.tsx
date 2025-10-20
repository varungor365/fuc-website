/**
 * Affiliate Dashboard Page
 * /affiliate
 */

import { Suspense } from 'react';
import AffiliateDashboard from '@/components/AffiliateDashboard';

export default function AffiliatePage({ 
  searchParams 
}: { 
  searchParams: { userId?: string } 
}) {
  // In a real app, you'd get the userId from auth context
  const userId = searchParams.userId || 'demo-user-id';

  return (
    <div className="min-h-screen">
      <Suspense 
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Loading Creator Dashboard</h2>
              <p className="text-purple-300">Preparing your affiliate portal...</p>
            </div>
          </div>
        }
      >
        <AffiliateDashboard userId={userId} />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: 'Creator Dashboard - FASHUN Affiliate Program',
  description: 'Track your referrals, commissions, and performance as a FASHUN creator',
};