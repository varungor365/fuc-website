/**
 * Automation Admin Dashboard Page
 * /admin/automation
 */

import { Suspense } from 'react';
import AutomationDashboard from '@/components/AutomationDashboard';

export default function AutomationAdminPage() {
  return (
    <div className="min-h-screen">
      <Suspense 
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Loading Dashboard</h2>
              <p className="text-purple-300">Initializing automation controls...</p>
            </div>
          </div>
        }
      >
        <AutomationDashboard />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: 'Automation Dashboard - FASHUN Admin',
  description: 'Monitor and manage automated processes for the FASHUN digital identity platform',
};