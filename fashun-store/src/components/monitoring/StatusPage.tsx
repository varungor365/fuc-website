'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Server, 
  Globe, 
  Database, 
  Zap,
  CreditCard,
  Search,
  ShoppingCart,
  Users,
  Activity,
  RefreshCw,
  ExternalLink,
  Calendar,
  TrendingUp,
  Wifi,
  Shield
} from 'lucide-react';

export type ServiceStatus = 'operational' | 'degraded' | 'partial-outage' | 'major-outage' | 'maintenance';

export interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  uptime: number; // percentage
  responseTime: number; // in milliseconds
  lastChecked: string;
  icon: React.ReactNode;
  category: 'core' | 'payment' | 'infrastructure' | 'third-party';
  dependencies?: string[];
  incidents?: Incident[];
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedServices: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  message: string;
  status: Incident['status'];
  timestamp: string;
  author: string;
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  status: ServiceStatus;
}

interface StatusPageProps {
  className?: string;
  showMetrics?: boolean;
  showIncidentHistory?: boolean;
}

const StatusPage: React.FC<StatusPageProps> = ({
  className = '',
  showMetrics = true,
  showIncidentHistory = true
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [overallStatus, setOverallStatus] = useState<ServiceStatus>('operational');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchStatusData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockServices: Service[] = [
          {
            id: 'website',
            name: 'Website',
            description: 'Main e-commerce website and storefront',
            status: 'operational',
            uptime: 99.98,
            responseTime: 342,
            lastChecked: new Date(Date.now() - 30000).toISOString(),
            icon: <Globe className="w-5 h-5" />,
            category: 'core'
          },
          {
            id: 'api',
            name: 'API Services',
            description: 'Backend API and microservices',
            status: 'operational',
            uptime: 99.95,
            responseTime: 156,
            lastChecked: new Date(Date.now() - 45000).toISOString(),
            icon: <Server className="w-5 h-5" />,
            category: 'core'
          },
          {
            id: 'database',
            name: 'Database',
            description: 'Primary database cluster',
            status: 'operational',
            uptime: 99.99,
            responseTime: 89,
            lastChecked: new Date(Date.now() - 20000).toISOString(),
            icon: <Database className="w-5 h-5" />,
            category: 'infrastructure'
          },
          {
            id: 'cdn',
            name: 'CDN & Static Assets',
            description: 'Content delivery network and image hosting',
            status: 'degraded',
            uptime: 98.75,
            responseTime: 567,
            lastChecked: new Date(Date.now() - 60000).toISOString(),
            icon: <Zap className="w-5 h-5" />,
            category: 'infrastructure'
          },
          {
            id: 'payments',
            name: 'Payment Processing',
            description: 'Stripe payment gateway and checkout',
            status: 'operational',
            uptime: 99.97,
            responseTime: 234,
            lastChecked: new Date(Date.now() - 15000).toISOString(),
            icon: <CreditCard className="w-5 h-5" />,
            category: 'payment'
          },
          {
            id: 'search',
            name: 'Search Service',
            description: 'Product search and filtering',
            status: 'operational',
            uptime: 99.92,
            responseTime: 178,
            lastChecked: new Date(Date.now() - 25000).toISOString(),
            icon: <Search className="w-5 h-5" />,
            category: 'core'
          },
          {
            id: 'cart',
            name: 'Shopping Cart',
            description: 'Cart management and session handling',
            status: 'operational',
            uptime: 99.96,
            responseTime: 123,
            lastChecked: new Date(Date.now() - 35000).toISOString(),
            icon: <ShoppingCart className="w-5 h-5" />,
            category: 'core'
          },
          {
            id: 'auth',
            name: 'Authentication',
            description: 'User login and account management',
            status: 'operational',
            uptime: 99.94,
            responseTime: 198,
            lastChecked: new Date(Date.now() - 40000).toISOString(),
            icon: <Users className="w-5 h-5" />,
            category: 'core'
          },
          {
            id: 'monitoring',
            name: 'Monitoring & Analytics',
            description: 'Application performance monitoring',
            status: 'operational',
            uptime: 99.85,
            responseTime: 289,
            lastChecked: new Date(Date.now() - 50000).toISOString(),
            icon: <Activity className="w-5 h-5" />,
            category: 'infrastructure'
          },
          {
            id: 'email',
            name: 'Email Service',
            description: 'Transactional emails and notifications',
            status: 'operational',
            uptime: 99.88,
            responseTime: 445,
            lastChecked: new Date(Date.now() - 55000).toISOString(),
            icon: <Wifi className="w-5 h-5" />,
            category: 'third-party'
          }
        ];

        const mockIncidents: Incident[] = [
          {
            id: 'inc-001',
            title: 'Intermittent CDN Slowdowns',
            description: 'Some users experiencing slower image loading times due to CDN performance issues.',
            status: 'monitoring',
            severity: 'medium',
            affectedServices: ['cdn'],
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date(Date.now() - 600000).toISOString(),
            updates: [
              {
                id: 'upd-001',
                message: 'We have identified the issue and are working with our CDN provider to resolve it.',
                status: 'identified',
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                author: 'DevOps Team'
              },
              {
                id: 'upd-002',
                message: 'Performance improvements have been implemented. Monitoring for stability.',
                status: 'monitoring',
                timestamp: new Date(Date.now() - 600000).toISOString(),
                author: 'DevOps Team'
              }
            ]
          }
        ];

        const mockMetrics: Metric[] = [
          {
            name: 'Response Time',
            value: 245,
            unit: 'ms',
            trend: 'down',
            trendPercentage: 8.5,
            status: 'operational'
          },
          {
            name: 'Error Rate',
            value: 0.02,
            unit: '%',
            trend: 'down',
            trendPercentage: 15.2,
            status: 'operational'
          },
          {
            name: 'Uptime',
            value: 99.96,
            unit: '%',
            trend: 'stable',
            trendPercentage: 0.1,
            status: 'operational'
          },
          {
            name: 'Active Users',
            value: 1247,
            unit: '',
            trend: 'up',
            trendPercentage: 12.8,
            status: 'operational'
          }
        ];

        setServices(mockServices);
        setIncidents(mockIncidents);
        setMetrics(mockMetrics);

        // Determine overall status
        const hasOutage = mockServices.some(s => s.status === 'major-outage');
        const hasPartialOutage = mockServices.some(s => s.status === 'partial-outage');
        const hasDegraded = mockServices.some(s => s.status === 'degraded');

        if (hasOutage) {
          setOverallStatus('major-outage');
        } else if (hasPartialOutage) {
          setOverallStatus('partial-outage');
        } else if (hasDegraded) {
          setOverallStatus('degraded');
        } else {
          setOverallStatus('operational');
        }

        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch status data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchStatusData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'partial-outage':
        return <XCircle className="w-5 h-5 text-orange-400" />;
      case 'major-outage':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'maintenance':
        return <Clock className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'degraded':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'partial-outage':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'major-outage':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'maintenance':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getStatusMessage = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return 'All systems operational';
      case 'degraded':
        return 'Some systems experiencing issues';
      case 'partial-outage':
        return 'Partial system outage';
      case 'major-outage':
        return 'Major system outage';
      case 'maintenance':
        return 'Scheduled maintenance';
    }
  };

  const getSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'low':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'high':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'critical':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
    }
  };

  const getIncidentStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'investigating':
        return 'text-red-400';
      case 'identified':
        return 'text-yellow-400';
      case 'monitoring':
        return 'text-blue-400';
      case 'resolved':
        return 'text-green-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const groupedServices = services.reduce((groups, service) => {
    if (!groups[service.category]) {
      groups[service.category] = [];
    }
    groups[service.category].push(service);
    return groups;
  }, {} as Record<string, Service[]>);

  const categoryNames = {
    core: 'Core Services',
    payment: 'Payment Services',
    infrastructure: 'Infrastructure',
    'third-party': 'Third-party Services'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className={`p-3 rounded-full border ${getStatusColor(overallStatus)}`}>
            {getStatusIcon(overallStatus)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">FASHUN.CO Status</h1>
            <p className="text-xl text-gray-400">{getStatusMessage(overallStatus)}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Last updated: {formatTimestamp(lastUpdated.toISOString())}</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Current Incidents */}
      {incidents.filter(i => i.status !== 'resolved').length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Active Incidents
          </h2>
          
          <div className="space-y-4">
            {incidents.filter(i => i.status !== 'resolved').map(incident => (
              <div key={incident.id} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{incident.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{incident.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                    <span className={`text-sm font-medium ${getIncidentStatusColor(incident.status)}`}>
                      {incident.status.toUpperCase().replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Latest Update */}
                {incident.updates.length > 0 && (
                  <div className="border-t border-white/10 pt-3">
                    <div className="text-sm text-gray-300">
                      <strong>Latest Update:</strong> {incident.updates[incident.updates.length - 1].message}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(incident.updates[incident.updates.length - 1].timestamp)} by {incident.updates[incident.updates.length - 1].author}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Overview */}
      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map(metric => (
            <div key={metric.name} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2">{metric.name}</h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white">
                  {metric.value}
                </span>
                <span className="text-gray-400 text-sm mb-1">{metric.unit}</span>
              </div>
              <div className={`flex items-center gap-1 mt-2 text-sm ${
                metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                <TrendingUp className={`w-3 h-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                <span>{Math.abs(metric.trendPercentage)}% vs last hour</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Services Status */}
      <div className="space-y-6">
        {Object.entries(groupedServices).map(([category, categoryServices]) => (
          <div key={category} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {categoryNames[category as keyof typeof categoryNames]}
            </h2>
            
            <div className="space-y-3">
              {categoryServices.map(service => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{service.name}</h3>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Uptime */}
                    <div className="text-center">
                      <div className="text-white font-semibold">{service.uptime}%</div>
                      <div className="text-gray-400 text-xs">Uptime</div>
                    </div>

                    {/* Response Time */}
                    <div className="text-center">
                      <div className="text-white font-semibold">{service.responseTime}ms</div>
                      <div className="text-gray-400 text-xs">Response</div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {getStatusIcon(service.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                        {service.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Last Checked */}
                    <div className="text-right">
                      <div className="text-gray-400 text-xs">Last checked</div>
                      <div className="text-white text-sm">{formatTimestamp(service.lastChecked)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Incident History */}
      {showIncidentHistory && incidents.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Incident History</h2>
            <button className="flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm">
              View all incidents
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {incidents.map(incident => (
              <div key={incident.id} className="border-l-4 border-accent-500 pl-6 py-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold">{incident.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`text-sm font-medium ${getIncidentStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-3">{incident.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Started: {formatTimestamp(incident.createdAt)}
                  </span>
                  {incident.resolvedAt && (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Resolved: {formatTimestamp(incident.resolvedAt)}
                    </span>
                  )}
                  <span>Affected: {incident.affectedServices.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-6 border-t border-white/10">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <a href="/status" className="hover:text-white transition-colors">
            Status Page
          </a>
          <a href="/status/history" className="hover:text-white transition-colors">
            Incident History
          </a>
          <a href="/support" className="hover:text-white transition-colors">
            Support
          </a>
          <a href="https://twitter.com/fashunco" className="hover:text-white transition-colors">
            @fashunco
          </a>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          This page is refreshed automatically every 30 seconds
        </div>
      </div>
    </div>
  );
};

export default StatusPage;