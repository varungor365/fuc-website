'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { checkAllAPIs, APIStatus } from '@/lib/api-health-monitor';

export default function SystemHealthPage() {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadHealthData();
    const interval = setInterval(loadHealthData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadHealthData() {
    setLoading(true);
    const statuses = await checkAllAPIs();
    setApiStatuses(statuses);

    const { data: alertsData } = await supabase
      .from('admin_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    setAlerts(alertsData || []);
    setLoading(false);
  }

  async function dismissAlert(id: string) {
    await supabase.from('admin_alerts').update({ dismissed: true }).eq('id', id);
    setAlerts(alerts.filter(a => a.id !== id));
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">System Health Monitor</h1>

        {alerts.filter(a => !a.dismissed).length > 0 && (
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl font-bold text-red-500">🚨 Active Alerts</h2>
            {alerts.filter(a => !a.dismissed).map(alert => (
              <div key={alert.id} className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{alert.title}</h3>
                    <p className="text-gray-300 mt-2">{alert.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {apiStatuses.map(api => (
            <div key={api.name} className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{api.name}</h3>
                <div className={`w-4 h-4 rounded-full ${getStatusColor(api.status)}`} />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-bold ${
                    api.status === 'healthy' ? 'text-green-500' :
                    api.status === 'degraded' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {api.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Response Time:</span>
                  <span>{api.responseTime}ms</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Checked:</span>
                  <span>{new Date(api.lastChecked).toLocaleTimeString()}</span>
                </div>
                
                {api.errorMessage && (
                  <div className="mt-4 p-2 bg-red-900/20 rounded text-red-400 text-xs">
                    {api.errorMessage}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">System Controls</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={loadHealthData}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
            >
              Refresh Status
            </button>
            <button
              onClick={() => window.location.href = '/admin/settings'}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
            >
              API Settings
            </button>
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold"
            >
              Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/admin/orders'}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-bold"
            >
              Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
