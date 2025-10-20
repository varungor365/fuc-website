import React from 'react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <AnalyticsDashboard />
    </main>
  );
}

export const metadata = {
  title: 'Analytics Dashboard | Profile Analytics',
  description: 'Track your profile performance and visitor insights with comprehensive analytics',
};