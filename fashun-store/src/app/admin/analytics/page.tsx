'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    profileViews: 0,
    linkClicks: 0,
    topProfiles: [],
    topLinks: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    
    const channel = supabase
      .channel('analytics-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'analytics' }, () => {
        loadAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAnalytics = async () => {
    try {
      // Get total views
      const { count: viewsCount } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'view');

      // Get total clicks
      const { count: clicksCount } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'click');

      // Get top profiles by views
      const { data: topProfiles } = await supabase
        .from('analytics')
        .select('profile_id, profiles(username, display_name)')
        .eq('event_type', 'view')
        .limit(10);

      // Get recent activity
      const { data: recentActivity } = await supabase
        .from('analytics')
        .select('*, profiles(username, display_name), links(title)')
        .order('timestamp', { ascending: false })
        .limit(20);

      setAnalytics({
        profileViews: viewsCount || 0,
        linkClicks: clicksCount || 0,
        topProfiles: topProfiles || [],
        topLinks: [],
        recentActivity: recentActivity || [],
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <Link href="/admin/dashboard" className="text-purple-600 hover:text-purple-700">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Profile Views</div>
            <div className="text-4xl font-bold text-blue-600">{analytics.profileViews}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Link Clicks</div>
            <div className="text-4xl font-bold text-green-600">{analytics.linkClicks}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.recentActivity.map((activity: any) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.event_type === 'view' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {activity.event_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {activity.profiles?.display_name || activity.profiles?.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {activity.links?.title || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(activity.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
