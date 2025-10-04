'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { 
  Monitor, 
  Clock, 
  Zap, 
  Users, 
  Globe, 
  Smartphone, 
  Tablet, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  MousePointer,
  Navigation
} from 'lucide-react';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  
  // Additional metrics
  ttfb: number; // Time to First Byte
  fcp: number; // First Contentful Paint
  
  // Page load metrics
  domContentLoaded: number;
  loadComplete: number;
  
  // Connection info
  connectionType: string;
  effectiveType: string;
  
  // Device info
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browserName: string;
  
  // Viewport
  viewportWidth: number;
  viewportHeight: number;
  
  // URL and timestamp
  url: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export interface UserInteraction {
  type: 'click' | 'scroll' | 'input' | 'navigation' | 'error';
  element?: string;
  timestamp: number;
  url: string;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface RUMData {
  metrics: PerformanceMetrics[];
  interactions: UserInteraction[];
  errors: Array<{
    message: string;
    stack: string;
    url: string;
    timestamp: number;
    sessionId: string;
    userId?: string;
  }>;
}

interface RUMStats {
  averageLCP: number;
  averageFID: number;
  averageCLS: number;
  averagePageLoad: number;
  bounceRate: number;
  sessionDuration: number;
  pageViews: number;
  uniqueUsers: number;
  errorRate: number;
  mobileTraffic: number;
}

interface RUMProviderProps {
  children: React.ReactNode;
  apiEndpoint?: string;
  sampleRate?: number; // 0-1, percentage of sessions to track
  enableAutoTracking?: boolean;
}

// RUM Context for global state management
const RUMContext = React.createContext<{
  trackMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  trackInteraction: (interaction: Omit<UserInteraction, 'timestamp' | 'sessionId'>) => void;
  trackError: (error: Error, additionalInfo?: Record<string, any>) => void;
  sessionId: string;
  userId?: string;
} | null>(null);

export const useRUM = () => {
  const context = React.useContext(RUMContext);
  if (!context) {
    throw new Error('useRUM must be used within RUMProvider');
  }
  return context;
};

// Generate unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Get device type based on user agent and screen size
const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  const userAgent = navigator.userAgent;
  
  if (/tablet|ipad/i.test(userAgent) || (width >= 768 && width <= 1024)) {
    return 'tablet';
  }
  if (/mobile|android|iphone/i.test(userAgent) || width < 768) {
    return 'mobile';
  }
  return 'desktop';
};

// Get browser name
const getBrowserName = (): string => {
  if (typeof window === 'undefined') return 'Unknown';
  
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Other';
};

// Get connection information
const getConnectionInfo = () => {
  if (typeof window === 'undefined' || !('connection' in navigator)) {
    return { connectionType: 'unknown', effectiveType: 'unknown' };
  }
  
  const connection = (navigator as any).connection;
  return {
    connectionType: connection.type || 'unknown',
    effectiveType: connection.effectiveType || 'unknown'
  };
};

export const RUMProvider: React.FC<RUMProviderProps> = ({
  children,
  apiEndpoint = '/api/rum',
  sampleRate = 1.0,
  enableAutoTracking = true
}) => {
  const [sessionId] = useState(() => generateSessionId());
  const [userId, setUserId] = useState<string>();
  const [shouldTrack] = useState(() => Math.random() < sampleRate);

  // Send data to backend
  const sendRUMData = useCallback(async (data: any) => {
    if (!shouldTrack) return;
    
    try {
      await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          sessionId,
          userId,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.warn('Failed to send RUM data:', error);
    }
  }, [apiEndpoint, sessionId, userId, shouldTrack]);

  // Track performance metrics
  const trackMetrics = useCallback((metrics: Partial<PerformanceMetrics>) => {
    const fullMetrics: PerformanceMetrics = {
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
      fcp: 0,
      domContentLoaded: 0,
      loadComplete: 0,
      ...getConnectionInfo(),
      deviceType: getDeviceType(),
      browserName: getBrowserName(),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      url: window.location.href,
      timestamp: Date.now(),
      sessionId,
      userId,
      ...metrics
    };

    sendRUMData({ type: 'metrics', data: fullMetrics });
  }, [sendRUMData, sessionId, userId]);

  // Track user interactions
  const trackInteraction = useCallback((interaction: Omit<UserInteraction, 'timestamp' | 'sessionId'>) => {
    const fullInteraction: UserInteraction = {
      ...interaction,
      timestamp: Date.now(),
      sessionId,
      url: window.location.href,
      userId
    };

    sendRUMData({ type: 'interaction', data: fullInteraction });
  }, [sendRUMData, sessionId, userId]);

  // Track errors
  const trackError = useCallback((error: Error, additionalInfo?: Record<string, any>) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      sessionId,
      userId,
      ...additionalInfo
    };

    sendRUMData({ type: 'error', data: errorData });
  }, [sendRUMData, sessionId, userId]);

  // Auto-track performance metrics
  useEffect(() => {
    if (!enableAutoTracking || typeof window === 'undefined') return;

    // Track page load metrics
    const trackPageLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      trackMetrics({
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart
      });
    };

    // Track Core Web Vitals using Performance Observer
    const trackWebVitals = () => {
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        trackMetrics({ lcp: lastEntry.startTime });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          trackMetrics({ fid: (entry as any).processingStart - entry.startTime });
        }
      }).observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            trackMetrics({ cls: clsValue });
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      // FCP (First Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            trackMetrics({ fcp: entry.startTime });
          }
        }
      }).observe({ entryTypes: ['paint'] });
    };

    // Track user interactions
    const trackClicks = (event: MouseEvent) => {
      const target = event.target as Element;
      trackInteraction({
        type: 'click',
        url: window.location.href,
        element: target.tagName + (target.id ? `#${target.id}` : '') + 
                (target.className ? `.${target.className.split(' ').join('.')}` : ''),
        metadata: {
          x: event.clientX,
          y: event.clientY
        }
      });
    };

    const trackScrolls = () => {
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            trackInteraction({
              type: 'scroll',
              url: window.location.href,
              metadata: {
                scrollY: window.scrollY,
                scrollPercentage: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
              }
            });
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    };

    // Set up tracking
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', trackPageLoad);
    } else {
      trackPageLoad();
    }

    trackWebVitals();
    
    document.addEventListener('click', trackClicks);
    const removeScrollListener = trackScrolls();

    // Track page visibility changes
    const handleVisibilityChange = () => {
      trackInteraction({
        type: 'navigation',
        url: window.location.href,
        metadata: {
          hidden: document.hidden,
          visibilityState: document.visibilityState
        }
      });
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track errors
    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(`Unhandled Promise Rejection: ${event.reason}`));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      document.removeEventListener('DOMContentLoaded', trackPageLoad);
      document.removeEventListener('click', trackClicks);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      removeScrollListener?.();
    };
  }, [enableAutoTracking, trackMetrics, trackInteraction, trackError]);

  const value = {
    trackMetrics,
    trackInteraction,
    trackError,
    sessionId,
    userId
  };

  return (
    <RUMContext.Provider value={value}>
      {children}
    </RUMContext.Provider>
  );
};

// RUM Dashboard Component
interface RUMDashboardProps {
  data?: RUMData;
  timeRange?: '1h' | '24h' | '7d' | '30d';
  className?: string;
}

export const RUMDashboard: React.FC<RUMDashboardProps> = ({
  data,
  timeRange = '24h',
  className = ''
}) => {
  const [stats, setStats] = useState<RUMStats>({
    averageLCP: 2.4,
    averageFID: 85,
    averageCLS: 0.08,
    averagePageLoad: 3200,
    bounceRate: 42.3,
    sessionDuration: 185,
    pageViews: 12450,
    uniqueUsers: 8920,
    errorRate: 0.8,
    mobileTraffic: 68.5
  });

  const [loading, setLoading] = useState(false);

  // Fetch RUM data
  useEffect(() => {
    const fetchRUMStats = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real implementation:
        // const response = await fetch(`/api/rum/stats?timeRange=${timeRange}`);
        // const stats = await response.json();
        // setStats(stats);
        
        console.log('RUM stats updated');
      } catch (error) {
        console.error('Failed to fetch RUM stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRUMStats();
  }, [timeRange]);

  const getWebVitalStatus = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2.5, poor: 4.0 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'needs-improvement': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'poor': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: number | string;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: number;
    icon: React.ReactNode;
    status?: 'good' | 'needs-improvement' | 'poor';
  }> = ({ title, value, unit, trend, trendValue, icon, status }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-accent-500/20 rounded-lg border border-accent-500/30">
          {icon}
        </div>
        {status && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
            {status.replace('-', ' ')}
          </div>
        )}
      </div>
      
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-gray-400 text-sm mb-1">{unit}</span>}
      </div>
      
      {trend && trendValue && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${
          trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-green-400' : 'text-gray-400'
        }`}>
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-3 h-3" />
          ) : null}
          <span>{Math.abs(trendValue)}% vs last period</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent-500/20 rounded-lg border border-accent-500/30">
          <Activity className="w-6 h-6 text-accent-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Real User Monitoring</h2>
          <p className="text-gray-400">Live performance insights from your users</p>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div>
        <h3 className="text-white font-semibold text-lg mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Largest Contentful Paint"
            value={stats.averageLCP}
            unit="seconds"
            icon={<Eye className="w-5 h-5 text-accent-400" />}
            status={getWebVitalStatus('lcp', stats.averageLCP)}
            trend="down"
            trendValue={8.5}
          />
          <MetricCard
            title="First Input Delay"
            value={stats.averageFID}
            unit="ms"
            icon={<MousePointer className="w-5 h-5 text-accent-400" />}
            status={getWebVitalStatus('fid', stats.averageFID)}
            trend="up"
            trendValue={12.3}
          />
          <MetricCard
            title="Cumulative Layout Shift"
            value={stats.averageCLS.toFixed(3)}
            icon={<Navigation className="w-5 h-5 text-accent-400" />}
            status={getWebVitalStatus('cls', stats.averageCLS)}
            trend="stable"
            trendValue={2.1}
          />
        </div>
      </div>

      {/* Performance & User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Average Page Load"
          value={stats.averagePageLoad}
          unit="ms"
          icon={<Clock className="w-5 h-5 text-blue-400" />}
          trend="down"
          trendValue={15.2}
        />
        <MetricCard
          title="Bounce Rate"
          value={stats.bounceRate}
          unit="%"
          icon={<TrendingUp className="w-5 h-5 text-yellow-400" />}
          trend="down"
          trendValue={5.8}
        />
        <MetricCard
          title="Session Duration"
          value={`${Math.floor(stats.sessionDuration / 60)}:${(stats.sessionDuration % 60).toString().padStart(2, '0')}`}
          icon={<Users className="w-5 h-5 text-green-400" />}
          trend="up"
          trendValue={8.9}
        />
        <MetricCard
          title="Error Rate"
          value={stats.errorRate}
          unit="%"
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          trend="down"
          trendValue={22.5}
        />
      </div>

      {/* Traffic Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h4 className="text-white font-semibold text-lg mb-4">Traffic Overview</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">Mobile</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 w-32 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.mobileTraffic}%` }}
                  />
                </div>
                <span className="text-white font-medium w-12 text-right">
                  {stats.mobileTraffic}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">Desktop</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 w-32 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${100 - stats.mobileTraffic - 8.5}%` }}
                  />
                </div>
                <span className="text-white font-medium w-12 text-right">
                  {(100 - stats.mobileTraffic - 8.5).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Tablet</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 w-32 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: '8.5%' }}
                  />
                </div>
                <span className="text-white font-medium w-12 text-right">
                  8.5%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h4 className="text-white font-semibold text-lg mb-4">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {stats.pageViews.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Page Views</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {stats.uniqueUsers.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Unique Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RUMDashboard;