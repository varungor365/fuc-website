import { NextRequest, NextResponse } from 'next/server';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
  description: string;
  responseTime: number;
  uptime: number;
  lastChecked: string;
  incidents?: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    resolvedAt?: string;
  }>;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    incoming: number;
    outgoing: number;
  };
}

async function checkServiceHealth(serviceName: string, url: string): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    // Mock health check - in production, make actual HTTP requests
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    
    const responseTime = Date.now() - startTime;
    const uptime = 99.5 + Math.random() * 0.5; // Mock uptime between 99.5-100%
    
    return {
      name: serviceName,
      status: uptime > 99.9 ? 'operational' : uptime > 99 ? 'degraded' : 'partial_outage',
      description: uptime > 99.9 ? 'All systems operational' : 'Some degraded performance',
      responseTime,
      uptime: Number(uptime.toFixed(2)),
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    return {
      name: serviceName,
      status: 'major_outage',
      description: 'Service unreachable',
      responseTime: 0,
      uptime: 0,
      lastChecked: new Date().toISOString()
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const detailed = url.searchParams.get('detailed') === 'true';

    // Check core services
    const services = await Promise.all([
      checkServiceHealth('Website', 'https://fashun.co'),
      checkServiceHealth('API Gateway', 'https://api.fashun.co'),
      checkServiceHealth('Database', 'internal://database'),
      checkServiceHealth('Payment Processing', 'https://api.stripe.com'),
      checkServiceHealth('Image CDN', 'https://cdn.fashun.co'),
      checkServiceHealth('Email Service', 'https://api.sendgrid.com'),
      checkServiceHealth('Analytics', 'https://analytics.fashun.co')
    ]);

    // Calculate overall status
    const criticalServices = services.filter(s => s.name === 'Website' || s.name === 'API Gateway' || s.name === 'Database');
    const hasMajorOutage = criticalServices.some(s => s.status === 'major_outage');
    const hasPartialOutage = services.some(s => s.status === 'partial_outage');
    const hasDegraded = services.some(s => s.status === 'degraded');

    let overallStatus: string;
    if (hasMajorOutage) {
      overallStatus = 'major_outage';
    } else if (hasPartialOutage) {
      overallStatus = 'partial_outage';
    } else if (hasDegraded) {
      overallStatus = 'degraded_performance';
    } else {
      overallStatus = 'all_systems_operational';
    }

    // Mock system metrics
    const systemMetrics: SystemMetrics = {
      cpu: 35 + Math.random() * 30, // 35-65% CPU usage
      memory: 45 + Math.random() * 25, // 45-70% memory usage
      disk: 60 + Math.random() * 15, // 60-75% disk usage
      network: {
        incoming: Math.random() * 1000, // MB/s
        outgoing: Math.random() * 500 // MB/s
      }
    };

    // Mock recent incidents
    const recentIncidents = [
      {
        id: 'inc-001',
        title: 'Intermittent API slowness',
        status: 'resolved',
        impact: 'minor',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        resolvedAt: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(), // Resolved 1 hour later
        description: 'Some users experienced slower API response times',
        affectedServices: ['API Gateway']
      },
      {
        id: 'inc-002',
        title: 'Scheduled maintenance',
        status: 'resolved',
        impact: 'minor',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
        resolvedAt: new Date(Date.now() - 86400000 * 7 + 7200000).toISOString(), // 2 hours maintenance
        description: 'Routine database optimization',
        affectedServices: ['Database', 'API Gateway']
      }
    ];

    // Calculate average response time and uptime
    const avgResponseTime = services.reduce((sum, s) => sum + s.responseTime, 0) / services.length;
    const avgUptime = services.reduce((sum, s) => sum + s.uptime, 0) / services.length;

    const response = {
      overall: {
        status: overallStatus,
        lastUpdated: new Date().toISOString(),
        description: getStatusDescription(overallStatus)
      },
      services,
      metrics: {
        averageResponseTime: Math.round(avgResponseTime),
        averageUptime: Number(avgUptime.toFixed(2)),
        totalServices: services.length,
        operationalServices: services.filter(s => s.status === 'operational').length
      },
      ...(detailed && {
        systemMetrics,
        recentIncidents,
        maintenanceSchedule: [
          {
            id: 'maint-001',
            title: 'Database optimization',
            scheduledStart: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
            estimatedDuration: 120, // minutes
            affectedServices: ['Database', 'API Gateway'],
            impact: 'minor'
          }
        ]
      })
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching system status:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch system status',
        overall: {
          status: 'unknown',
          description: 'Unable to determine system status',
          lastUpdated: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

function getStatusDescription(status: string): string {
  switch (status) {
    case 'all_systems_operational':
      return 'All systems are operating normally';
    case 'degraded_performance':
      return 'Some systems are experiencing degraded performance';
    case 'partial_outage':
      return 'Some systems are experiencing outages';
    case 'major_outage':
      return 'Multiple systems are experiencing major outages';
    default:
      return 'System status unknown';
  }
}