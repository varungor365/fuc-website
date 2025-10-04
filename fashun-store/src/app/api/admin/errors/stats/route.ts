import { NextRequest, NextResponse } from 'next/server';

// Mock error store
let errorStore: any[] = [
  {
    id: '1',
    severity: 'error',
    status: 'open',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    severity: 'error',
    status: 'investigating',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    severity: 'critical',
    status: 'resolved',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  }
];

function isAdminAuthenticated(request: NextRequest): boolean {
  return true; // TODO: Implement proper admin auth
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate statistics
    const totalErrors = errorStore.length;
    
    const errorsByStatus = {
      open: errorStore.filter(e => e.status === 'open').length,
      investigating: errorStore.filter(e => e.status === 'investigating').length,
      resolved: errorStore.filter(e => e.status === 'resolved').length,
      ignored: errorStore.filter(e => e.status === 'ignored').length
    };

    const errorsBySeverity = {
      critical: errorStore.filter(e => e.severity === 'critical').length,
      error: errorStore.filter(e => e.severity === 'error').length,
      warning: errorStore.filter(e => e.severity === 'warning').length,
      info: errorStore.filter(e => e.severity === 'info').length
    };

    const recentErrors = {
      last24Hours: errorStore.filter(e => new Date(e.timestamp) >= last24Hours).length,
      last7Days: errorStore.filter(e => new Date(e.timestamp) >= last7Days).length
    };

    // Error trends (mock data for demonstration)
    const errorTrends = {
      daily: [
        { date: '2024-01-01', count: 12 },
        { date: '2024-01-02', count: 8 },
        { date: '2024-01-03', count: 15 },
        { date: '2024-01-04', count: 6 },
        { date: '2024-01-05', count: 9 },
        { date: '2024-01-06', count: 11 },
        { date: '2024-01-07', count: 4 }
      ],
      hourly: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: Math.floor(Math.random() * 5)
      }))
    };

    // Top error categories
    const categories = errorStore.reduce((acc: Record<string, number>, error) => {
      const category = error.category || 'Unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const topCategories = Object.entries(categories)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // Response time and performance metrics (mock)
    const performanceMetrics = {
      averageResponseTime: 245,
      errorRate: 2.3,
      uptime: 99.7,
      throughput: 1247
    };

    return NextResponse.json({
      summary: {
        totalErrors,
        errorsByStatus,
        errorsBySeverity,
        recentErrors
      },
      trends: errorTrends,
      topCategories,
      performance: performanceMetrics,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching error stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch error statistics' },
      { status: 500 }
    );
  }
}