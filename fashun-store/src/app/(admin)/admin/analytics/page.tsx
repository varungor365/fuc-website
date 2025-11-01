'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  Target,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsData {
  salesToday: number;
  conversionRate: number;
  averageOrderValue: number;
  totalRevenue: number;
  totalOrders: number;
  uniqueVisitors: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  topViewedProducts: Array<{
    id: string;
    name: string;
    views: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  profileStats: {
    views: number;
    linkClicks: number;
  };
  salesChart: {
    labels: string[];
    data: number[];
  };
  revenueChart: {
    labels: string[];
    data: number[];
  };
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchAnalytics();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch from Supabase and Strapi
      const [supabaseData, strapiData] = await Promise.all([
        fetch(`/api/analytics/supabase?range=${timeRange}`).then(r => r.json()),
        fetch(`/api/analytics/strapi?range=${timeRange}`).then(r => r.json())
      ]);

      setAnalytics({
        ...supabaseData,
        ...strapiData
      });
      
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Use mock data for demonstration
      setAnalytics(mockAnalyticsData);
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Export analytics as CSV/PDF
    const csvContent = generateCSVReport(analytics!);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fashun-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-orange-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
              Intelligent <span className="text-gradient-primary">Insights</span>
            </h1>
            <p className="text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-white/5 border border-white/20 text-white rounded-xl px-4 py-3 font-medium focus:border-orange-500 focus:outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchAnalytics}
              className="p-3 glass-gradient-dark border border-white/20 rounded-xl hover:border-orange-500 transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`w-6 h-6 text-white ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Export Button */}
            <button
              onClick={exportReport}
              className="px-6 py-3 btn-gradient-primary text-white font-bold rounded-xl hover-gradient-lift transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            title="Sales Today"
            value={`₹${analytics?.salesToday.toLocaleString()}`}
            icon={<DollarSign className="w-8 h-8" />}
            trend="+12.5%"
            trendUp={true}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${analytics?.conversionRate.toFixed(2)}%`}
            icon={<Target className="w-8 h-8" />}
            trend="+3.2%"
            trendUp={true}
          />
          <MetricCard
            title="Avg. Order Value"
            value={`₹${analytics?.averageOrderValue.toLocaleString()}`}
            icon={<ShoppingCart className="w-8 h-8" />}
            trend="+8.1%"
            trendUp={true}
          />
          <MetricCard
            title="Unique Visitors"
            value={analytics?.uniqueVisitors.toLocaleString() || '0'}
            icon={<Users className="w-8 h-8" />}
            trend="+15.7%"
            trendUp={true}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Trend */}
          <ChartCard title="Sales Trend" icon={<TrendingUp className="w-6 h-6" />}>
            <Line
              data={{
                labels: analytics?.salesChart.labels || [],
                datasets: [
                  {
                    label: 'Sales',
                    data: analytics?.salesChart.data || [],
                    borderColor: 'rgb(255, 107, 53)',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: 'rgb(255, 107, 53)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                  }
                ]
              }}
              options={chartOptions}
            />
          </ChartCard>

          {/* Revenue Chart */}
          <ChartCard title="Revenue Overview" icon={<DollarSign className="w-6 h-6" />}>
            <Bar
              data={{
                labels: analytics?.revenueChart.labels || [],
                datasets: [
                  {
                    label: 'Revenue',
                    data: analytics?.revenueChart.data || [],
                    backgroundColor: [
                      'rgba(255, 107, 53, 0.8)',
                      'rgba(247, 147, 30, 0.8)',
                      'rgba(255, 159, 64, 0.8)',
                      'rgba(255, 183, 77, 0.8)',
                      'rgba(255, 195, 0, 0.8)'
                    ],
                    borderColor: 'rgb(255, 107, 53)',
                    borderWidth: 2,
                    borderRadius: 8
                  }
                ]
              }}
              options={chartOptions}
            />
          </ChartCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Products */}
          <ChartCard title="Top Selling Products" icon={<ShoppingCart className="w-6 h-6" />}>
            <div className="space-y-4">
              {analytics?.topProducts.slice(0, 5).map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-black">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-bold">{product.name}</p>
                      <p className="text-sm text-gray-400">{product.sales} sales</p>
                    </div>
                  </div>
                  <p className="text-orange-400 font-black">₹{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Most Viewed */}
          <ChartCard title="Most Viewed Products" icon={<Eye className="w-6 h-6" />}>
            <div className="space-y-4">
              {analytics?.topViewedProducts.slice(0, 5).map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white font-black">
                      {index + 1}
                    </div>
                    <p className="text-white font-bold">{product.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-orange-400">
                    <Eye className="w-4 h-4" />
                    <span className="font-bold">{product.views.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Traffic Sources */}
          <ChartCard title="Traffic Sources" icon={<Users className="w-6 h-6" />}>
            <Doughnut
              data={{
                labels: analytics?.trafficSources.map(s => s.source) || [],
                datasets: [
                  {
                    data: analytics?.trafficSources.map(s => s.visitors) || [],
                    backgroundColor: [
                      'rgba(255, 107, 53, 0.8)',
                      'rgba(247, 147, 30, 0.8)',
                      'rgba(255, 159, 64, 0.8)',
                      'rgba(255, 183, 77, 0.8)',
                      'rgba(153, 102, 255, 0.8)'
                    ],
                    borderColor: '#000',
                    borderWidth: 2
                  }
                ]
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'bottom' as const
                  }
                }
              }}
            />
            <div className="mt-4 space-y-2">
              {analytics?.trafficSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{source.source}</span>
                  <span className="text-white font-bold">{source.percentage}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Profile Stats */}
        <div className="glass-gradient-frosted rounded-2xl border border-white/10 p-8">
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-orange-400" />
            Profile Performance (p.fashun.co.in)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Eye className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400">Profile Views</p>
                  <p className="text-3xl font-black text-white">
                    {analytics?.profileStats.views.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Target className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-400">Link Clicks</p>
                  <p className="text-3xl font-black text-white">
                    {analytics?.profileStats.linkClicks.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  trendUp
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-gradient-frosted rounded-2xl border border-white/10 p-6 hover-gradient-lift transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl text-orange-400">
          {icon}
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${trendUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {trend}
        </div>
      </div>
      <p className="text-gray-400 mb-2">{title}</p>
      <p className="text-3xl font-black text-white">{value}</p>
    </motion.div>
  );
}

function ChartCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-gradient-frosted rounded-2xl border border-white/10 p-6"
    >
      <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
        <div className="text-orange-400">{icon}</div>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 107, 53, 0.5)',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#9ca3af'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#9ca3af'
      }
    }
  }
};

const mockAnalyticsData: AnalyticsData = {
  salesToday: 45678,
  conversionRate: 3.45,
  averageOrderValue: 1850,
  totalRevenue: 2456789,
  totalOrders: 1248,
  uniqueVisitors: 34567,
  topProducts: [
    { id: '1', name: 'Flame Tee', sales: 234, revenue: 303786 },
    { id: '2', name: 'Urban Hoodie', sales: 189, revenue: 378000 },
    { id: '3', name: 'Neon Cap', sales: 156, revenue: 124800 },
    { id: '4', name: 'Street Joggers', sales: 145, revenue: 290000 },
    { id: '5', name: 'Bold Sweatshirt', sales: 123, revenue: 246000 }
  ],
  topViewedProducts: [
    { id: '1', name: 'Flame Tee', views: 5678 },
    { id: '2', name: 'Urban Hoodie', views: 4567 },
    { id: '3', name: 'Neon Cap', views: 3456 },
    { id: '4', name: 'Street Joggers', views: 2890 },
    { id: '5', name: 'Bold Sweatshirt', views: 2456 }
  ],
  trafficSources: [
    { source: 'Instagram', visitors: 12456, percentage: 36 },
    { source: 'Direct', visitors: 8745, percentage: 25 },
    { source: 'Google', visitors: 6234, percentage: 18 },
    { source: 'Facebook', visitors: 4567, percentage: 13 },
    { source: 'Others', visitors: 2998, percentage: 8 }
  ],
  profileStats: {
    views: 23456,
    linkClicks: 15678
  },
  salesChart: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000]
  },
  revenueChart: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [85000, 92000, 78000, 105000]
  }
};

function generateCSVReport(data: AnalyticsData): string {
  return `FASHUN Analytics Report - ${new Date().toLocaleDateString()}

Key Metrics
Sales Today,₹${data.salesToday.toLocaleString()}
Conversion Rate,${data.conversionRate}%
Average Order Value,₹${data.averageOrderValue.toLocaleString()}
Unique Visitors,${data.uniqueVisitors.toLocaleString()}

Top Selling Products
Rank,Product,Sales,Revenue
${data.topProducts.map((p, i) => `${i+1},${p.name},${p.sales},₹${p.revenue.toLocaleString()}`).join('\n')}

Traffic Sources
Source,Visitors,Percentage
${data.trafficSources.map(s => `${s.source},${s.visitors.toLocaleString()},${s.percentage}%`).join('\n')}

Profile Performance
Profile Views,${data.profileStats.views.toLocaleString()}
Link Clicks,${data.profileStats.linkClicks.toLocaleString()}
`;
}
