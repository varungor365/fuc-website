/**
 * Comprehensive Metrics Monitoring Service
 * Provides real-time monitoring, alerting, and performance tracking
 */

export interface MetricsConfig {
  service: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  collectInterval: number; // milliseconds
  alertingEndpoint: string;
  metricsEndpoint: string;
  enableRealTimeAlerts: boolean;
  enablePerformanceMonitoring: boolean;
  enableBusinessMetrics: boolean;
  enableCustomMetrics: boolean;
}

export interface MetricDefinition {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'timer' | 'rate';
  description: string;
  unit: string;
  tags: Record<string, string>;
  thresholds?: {
    warning?: number;
    critical?: number;
    info?: number;
  };
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'p50' | 'p90' | 'p95' | 'p99';
}

export interface MetricValue {
  metricName: string;
  value: number;
  timestamp: Date;
  tags: Record<string, string>;
  unit: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metricName: string;
  condition: {
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'ne';
    threshold: number;
    duration: number; // seconds
  };
  severity: 'info' | 'warning' | 'critical';
  channels: string[]; // notification channels
  enabled: boolean;
  tags?: Record<string, string>;
}

export interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  metricName: string;
  currentValue: number;
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  status: 'firing' | 'resolved';
  triggeredAt: Date;
  resolvedAt?: Date;
  message: string;
  tags: Record<string, string>;
  duration: number; // seconds
}

export interface DashboardWidget {
  id: string;
  type: 'line_chart' | 'bar_chart' | 'gauge' | 'number' | 'table' | 'heatmap';
  title: string;
  metrics: string[];
  timeRange: string; // e.g., '1h', '24h', '7d'
  refreshInterval: number; // seconds
  options: {
    width: number;
    height: number;
    position: { x: number; y: number };
    chartOptions?: Record<string, any>;
  };
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  tags: string[];
  widgets: DashboardWidget[];
  isPublic: boolean;
  createdBy: string;
  lastModified: Date;
}

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  
  // Navigation Timing
  dnsLookup: number;
  tcpConnection: number;
  requestTime: number;
  responseTime: number;
  domProcessing: number;
  resourceLoading: number;
  
  // JavaScript Performance
  jsHeapSize: number;
  jsHeapSizeLimit: number;
  eventLoopLag: number;
  
  // Custom Performance Metrics
  apiResponseTimes: Record<string, number>;
  componentRenderTimes: Record<string, number>;
  bundleSize: number;
  memoryUsage: number;
}

export interface BusinessMetrics {
  // E-commerce Metrics
  conversionRate: number;
  averageOrderValue: number;
  cartAbandonmentRate: number;
  revenuePerVisitor: number;
  customerLifetimeValue: number;
  
  // User Engagement
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  sessionDuration: number;
  bounceRate: number;
  pageViewsPerSession: number;
  
  // Growth Metrics
  userGrowthRate: number;
  churnRate: number;
  retentionRate: number;
  
  // Custom Business Metrics
  customMetrics: Record<string, number>;
}

export interface SystemMetrics {
  // Server Performance
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: number;
  
  // Application Metrics
  requestsPerSecond: number;
  errorRate: number;
  responseTime: number;
  activeConnections: number;
  queueSize: number;
  
  // Database Metrics
  queryTime: number;
  connectionPoolSize: number;
  slowQueries: number;
  
  // Cache Metrics
  cacheHitRate: number;
  cacheMissRate: number;
  cacheSize: number;
}

class MetricsMonitoringService {
  private config: MetricsConfig;
  private metrics: Map<string, MetricDefinition> = new Map();
  private values: Map<string, MetricValue[]> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private activeAlerts: Map<string, Alert> = new Map();
  private dashboards: Map<string, Dashboard> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private performanceObserver: PerformanceObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private websocket: WebSocket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: MetricsConfig) {
    this.config = config;
    this.initializeDefaultMetrics();
    this.initializePerformanceMonitoring();
    this.initializeRealTimeConnection();
    this.startMetricsCollection();
  }

  /**
   * Initialize default system metrics
   */
  private initializeDefaultMetrics(): void {
    // Performance metrics
    this.defineMetric({
      name: 'page_load_time',
      type: 'timer',
      description: 'Time taken to load the page',
      unit: 'ms',
      tags: { category: 'performance' },
      thresholds: { warning: 3000, critical: 5000 }
    });

    this.defineMetric({
      name: 'api_response_time',
      type: 'timer',
      description: 'API response time',
      unit: 'ms',
      tags: { category: 'performance' },
      thresholds: { warning: 1000, critical: 2000 }
    });

    this.defineMetric({
      name: 'error_rate',
      type: 'rate',
      description: 'Application error rate',
      unit: 'percent',
      tags: { category: 'reliability' },
      thresholds: { warning: 1, critical: 5 }
    });

    // Business metrics
    this.defineMetric({
      name: 'conversion_rate',
      type: 'gauge',
      description: 'Conversion rate percentage',
      unit: 'percent',
      tags: { category: 'business' },
      thresholds: { warning: 2, critical: 1 }
    });

    this.defineMetric({
      name: 'revenue_per_hour',
      type: 'gauge',
      description: 'Revenue generated per hour',
      unit: 'currency',
      tags: { category: 'business' }
    });

    // User engagement
    this.defineMetric({
      name: 'active_users',
      type: 'gauge',
      description: 'Number of active users',
      unit: 'count',
      tags: { category: 'engagement' }
    });

    this.defineMetric({
      name: 'session_duration',
      type: 'timer',
      description: 'Average session duration',
      unit: 'seconds',
      tags: { category: 'engagement' }
    });
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (!this.config.enablePerformanceMonitoring || typeof window === 'undefined') return;

    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.handlePerformanceEntry(entry);
        });
      });

      try {
        this.performanceObserver.observe({ 
          entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'resource'] 
        });
      } catch (error) {
        console.warn('Performance monitoring not fully supported:', error);
      }
    }

    // Monitor JavaScript heap
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric('js_heap_size', memory.usedJSHeapSize, { type: 'memory' });
        this.recordMetric('js_heap_limit', memory.jsHeapSizeLimit, { type: 'memory' });
      }, 10000);
    }

    // Monitor resource loading
    window.addEventListener('load', () => {
      this.collectResourceMetrics();
    });

    // Monitor errors
    window.addEventListener('error', (event) => {
      this.recordMetric('javascript_errors', 1, { 
        type: 'error',
        message: event.message,
        source: event.filename
      });
    });

    // Monitor unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.recordMetric('promise_rejections', 1, { 
        type: 'error',
        reason: String(event.reason)
      });
    });
  }

  /**
   * Initialize real-time connection for live updates
   */
  private initializeRealTimeConnection(): void {
    if (typeof window === 'undefined') return;

    try {
      this.websocket = new WebSocket(`${this.config.metricsEndpoint}/ws`);
      
      this.websocket.onopen = () => {
        console.log('Metrics monitoring connection established');
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleRealTimeUpdate(data);
        } catch (error) {
          console.error('Failed to parse real-time metrics data:', error);
        }
      };

      this.websocket.onclose = () => {
        console.log('Metrics monitoring connection closed');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.initializeRealTimeConnection(), 5000);
      };

    } catch (error) {
      console.error('Failed to initialize real-time metrics connection:', error);
    }
  }

  /**
   * Define a new metric
   */
  defineMetric(definition: MetricDefinition): void {
    this.metrics.set(definition.name, definition);
    
    // Initialize values array
    if (!this.values.has(definition.name)) {
      this.values.set(definition.name, []);
    }
  }

  /**
   * Record a metric value
   */
  recordMetric(
    metricName: string,
    value: number,
    tags: Record<string, string> = {},
    timestamp?: Date
  ): void {
    const metric = this.metrics.get(metricName);
    if (!metric) {
      console.warn(`Metric ${metricName} not defined`);
      return;
    }

    const metricValue: MetricValue = {
      metricName,
      value,
      timestamp: timestamp || new Date(),
      tags: { ...metric.tags, ...tags },
      unit: metric.unit
    };

    // Store locally
    const values = this.values.get(metricName) || [];
    values.push(metricValue);
    
    // Keep only last 1000 values
    if (values.length > 1000) {
      values.shift();
    }
    
    this.values.set(metricName, values);

    // Check alert thresholds
    this.checkAlertThresholds(metricName, value, tags);

    // Send to backend if configured
    this.sendMetricToBackend(metricValue);

    // Emit to real-time listeners
    this.emitMetricUpdate(metricValue);
  }

  /**
   * Increment a counter metric
   */
  incrementCounter(metricName: string, tags: Record<string, string> = {}): void {
    const currentValue = this.getLatestValue(metricName) || 0;
    this.recordMetric(metricName, currentValue + 1, tags);
  }

  /**
   * Record timing metric
   */
  recordTiming(metricName: string, duration: number, tags: Record<string, string> = {}): void {
    this.recordMetric(metricName, duration, { ...tags, type: 'timing' });
  }

  /**
   * Time a function execution
   */
  timeFunction<T>(metricName: string, fn: () => T, tags: Record<string, string> = {}): T {
    const startTime = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - startTime;
      this.recordTiming(metricName, duration, tags);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordTiming(metricName, duration, { ...tags, error: 'true' });
      throw error;
    }
  }

  /**
   * Time an async function execution
   */
  async timeAsyncFunction<T>(
    metricName: string,
    fn: () => Promise<T>,
    tags: Record<string, string> = {}
  ): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      this.recordTiming(metricName, duration, tags);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordTiming(metricName, duration, { ...tags, error: 'true' });
      throw error;
    }
  }

  /**
   * Create alert rule
   */
  createAlertRule(rule: Omit<AlertRule, 'id'>): string {
    const id = this.generateId();
    const alertRule: AlertRule = { id, ...rule };
    this.alertRules.set(id, alertRule);
    return id;
  }

  /**
   * Get metrics data for time range
   */
  getMetricsData(
    metricNames: string[],
    timeRange: { start: Date; end: Date },
    aggregation?: 'avg' | 'sum' | 'min' | 'max' | 'count'
  ): Record<string, Array<{ timestamp: Date; value: number }>> {
    const result: Record<string, Array<{ timestamp: Date; value: number }>> = {};

    metricNames.forEach(metricName => {
      const values = this.values.get(metricName) || [];
      const filteredValues = values.filter(
        v => v.timestamp >= timeRange.start && v.timestamp <= timeRange.end
      );

      if (aggregation) {
        // Group by time intervals and aggregate
        const aggregatedValues = this.aggregateValues(filteredValues, aggregation);
        result[metricName] = aggregatedValues;
      } else {
        result[metricName] = filteredValues.map(v => ({
          timestamp: v.timestamp,
          value: v.value
        }));
      }
    });

    return result;
  }

  /**
   * Get real-time metrics summary
   */
  getMetricsSummary(): {
    totalMetrics: number;
    activeAlerts: number;
    performance: PerformanceMetrics;
    business: BusinessMetrics;
    system: SystemMetrics;
  } {
    return {
      totalMetrics: this.metrics.size,
      activeAlerts: Array.from(this.activeAlerts.values()).filter(a => a.status === 'firing').length,
      performance: this.getPerformanceMetrics(),
      business: this.getBusinessMetrics(),
      system: this.getSystemMetrics()
    };
  }

  /**
   * Create dashboard
   */
  createDashboard(dashboard: Omit<Dashboard, 'id' | 'lastModified'>): string {
    const id = this.generateId();
    const newDashboard: Dashboard = {
      id,
      lastModified: new Date(),
      ...dashboard
    };
    this.dashboards.set(id, newDashboard);
    return id;
  }

  /**
   * Get dashboard data
   */
  getDashboard(dashboardId: string): Dashboard | null {
    return this.dashboards.get(dashboardId) || null;
  }

  /**
   * Update dashboard
   */
  updateDashboard(dashboardId: string, updates: Partial<Dashboard>): void {
    const dashboard = this.dashboards.get(dashboardId);
    if (dashboard) {
      Object.assign(dashboard, updates, { lastModified: new Date() });
      this.dashboards.set(dashboardId, dashboard);
    }
  }

  /**
   * Export metrics data
   */
  exportMetrics(
    format: 'json' | 'csv' | 'prometheus',
    metricNames?: string[],
    timeRange?: { start: Date; end: Date }
  ): string {
    const metricsToExport = metricNames || Array.from(this.metrics.keys());
    const data: Record<string, MetricValue[]> = {};

    metricsToExport.forEach(metricName => {
      let values = this.values.get(metricName) || [];
      
      if (timeRange) {
        values = values.filter(
          v => v.timestamp >= timeRange.start && v.timestamp <= timeRange.end
        );
      }
      
      data[metricName] = values;
    });

    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      
      case 'csv':
        return this.exportToCSV(data);
      
      case 'prometheus':
        return this.exportToPrometheus(data);
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Subscribe to metric updates
   */
  subscribe(metricName: string, callback: (value: MetricValue) => void): void {
    if (!this.eventListeners.has(metricName)) {
      this.eventListeners.set(metricName, []);
    }
    this.eventListeners.get(metricName)!.push(callback);
  }

  /**
   * Unsubscribe from metric updates
   */
  unsubscribe(metricName: string, callback: (value: MetricValue) => void): void {
    const listeners = this.eventListeners.get(metricName);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Private helper methods
   */
  private startMetricsCollection(): void {
    // Collect metrics at configured intervals
    const timer = setInterval(() => {
      this.collectSystemMetrics();
      this.collectBusinessMetrics();
      this.collectPerformanceMetrics();
    }, this.config.collectInterval);

    this.timers.set('main_collection', timer);
  }

  private handlePerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        this.recordMetric('dns_lookup_time', navEntry.domainLookupEnd - navEntry.domainLookupStart, { type: 'navigation' });
        this.recordMetric('tcp_connection_time', navEntry.connectEnd - navEntry.connectStart, { type: 'navigation' });
        this.recordMetric('request_time', navEntry.responseStart - navEntry.requestStart, { type: 'navigation' });
        this.recordMetric('response_time', navEntry.responseEnd - navEntry.responseStart, { type: 'navigation' });
        this.recordMetric('dom_processing_time', navEntry.domComplete - navEntry.domContentLoadedEventStart, { type: 'navigation' });
        break;

      case 'paint':
        this.recordMetric(`${entry.name.replace('-', '_')}_time`, entry.startTime, { type: 'paint' });
        break;

      case 'largest-contentful-paint':
        this.recordMetric('largest_contentful_paint', entry.startTime, { type: 'web_vital' });
        break;

      case 'first-input':
        this.recordMetric('first_input_delay', (entry as any).processingStart - entry.startTime, { type: 'web_vital' });
        break;

      case 'layout-shift':
        if (!(entry as any).hadRecentInput) {
          this.recordMetric('cumulative_layout_shift', (entry as any).value, { type: 'web_vital' });
        }
        break;

      case 'resource':
        const resourceEntry = entry as PerformanceResourceTiming;
        this.recordMetric('resource_load_time', resourceEntry.duration, { 
          type: 'resource',
          resource_type: resourceEntry.initiatorType,
          resource_name: entry.name
        });
        break;
    }
  }

  private collectResourceMetrics(): void {
    if (typeof window === 'undefined') return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const totalSize = resources.reduce((sum, resource) => {
      return sum + (resource.transferSize || 0);
    }, 0);

    this.recordMetric('total_resource_size', totalSize, { type: 'resource' });
    
    const resourceTypes = resources.reduce((types, resource) => {
      types[resource.initiatorType] = (types[resource.initiatorType] || 0) + 1;
      return types;
    }, {} as Record<string, number>);

    Object.entries(resourceTypes).forEach(([type, count]) => {
      this.recordMetric('resource_count', count, { type: 'resource', resource_type: type });
    });
  }

  private collectSystemMetrics(): void {
    // These would typically be collected server-side
    // Client-side we can collect limited system info
    if (typeof window !== 'undefined' && 'navigator' in window) {
      this.recordMetric('connection_type', 1, { 
        type: 'system',
        connection: (navigator as any).connection?.effectiveType || 'unknown'
      });

      this.recordMetric('device_memory', (navigator as any).deviceMemory || 0, { type: 'system' });
      this.recordMetric('hardware_concurrency', navigator.hardwareConcurrency || 0, { type: 'system' });
    }
  }

  private collectBusinessMetrics(): void {
    if (!this.config.enableBusinessMetrics) return;

    // These would typically be calculated from business data
    // For demo purposes, using placeholder values
    const conversionRate = this.calculateConversionRate();
    const averageOrderValue = this.calculateAverageOrderValue();

    this.recordMetric('conversion_rate', conversionRate, { type: 'business' });
    this.recordMetric('average_order_value', averageOrderValue, { type: 'business' });
  }

  private collectPerformanceMetrics(): void {
    if (!this.config.enablePerformanceMonitoring) return;

    // Collect current performance metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.recordMetric('page_load_time', navigation.loadEventEnd - navigation.loadEventStart, { type: 'performance' });
        this.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, { type: 'performance' });
      }
    }
  }

  private checkAlertThresholds(metricName: string, value: number, tags: Record<string, string>): void {
    if (!this.config.enableRealTimeAlerts) return;

    const rules = Array.from(this.alertRules.values()).filter(rule => rule.metricName === metricName && rule.enabled);
    
    rules.forEach(rule => {
      const shouldAlert = this.evaluateAlertCondition(rule, value);
      
      if (shouldAlert && !this.activeAlerts.has(rule.id)) {
        this.triggerAlert(rule, value, tags);
      } else if (!shouldAlert && this.activeAlerts.has(rule.id)) {
        this.resolveAlert(rule.id);
      }
    });
  }

  private evaluateAlertCondition(rule: AlertRule, value: number): boolean {
    const { operator, threshold } = rule.condition;
    
    switch (operator) {
      case 'gt': return value > threshold;
      case 'lt': return value < threshold;
      case 'eq': return value === threshold;
      case 'gte': return value >= threshold;
      case 'lte': return value <= threshold;
      case 'ne': return value !== threshold;
      default: return false;
    }
  }

  private triggerAlert(rule: AlertRule, value: number, tags: Record<string, string>): void {
    const alert: Alert = {
      id: this.generateId(),
      ruleId: rule.id,
      ruleName: rule.name,
      metricName: rule.metricName,
      currentValue: value,
      threshold: rule.condition.threshold,
      severity: rule.severity,
      status: 'firing',
      triggeredAt: new Date(),
      message: `${rule.name}: ${rule.metricName} is ${value} (threshold: ${rule.condition.threshold})`,
      tags: { ...rule.tags, ...tags },
      duration: 0
    };

    this.activeAlerts.set(rule.id, alert);
    this.sendAlert(alert);
  }

  private resolveAlert(ruleId: string): void {
    const alert = this.activeAlerts.get(ruleId);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = new Date();
      alert.duration = (alert.resolvedAt.getTime() - alert.triggeredAt.getTime()) / 1000;
      
      this.sendAlert(alert);
      this.activeAlerts.delete(ruleId);
    }
  }

  private async sendAlert(alert: Alert): Promise<void> {
    try {
      await fetch(this.config.alertingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alert)
      });
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }

  private async sendMetricToBackend(metricValue: MetricValue): Promise<void> {
    try {
      await fetch(this.config.metricsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metricValue)
      });
    } catch (error) {
      console.error('Failed to send metric to backend:', error);
    }
  }

  private emitMetricUpdate(metricValue: MetricValue): void {
    const listeners = this.eventListeners.get(metricValue.metricName);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(metricValue);
        } catch (error) {
          console.error('Error in metric listener:', error);
        }
      });
    }
  }

  private handleRealTimeUpdate(data: any): void {
    // Handle real-time updates from server
    if (data.type === 'metric_update') {
      this.emitMetricUpdate(data.value);
    } else if (data.type === 'alert') {
      // Handle real-time alerts
      console.log('Real-time alert:', data.alert);
    }
  }

  private getLatestValue(metricName: string): number | null {
    const values = this.values.get(metricName);
    if (!values || values.length === 0) return null;
    return values[values.length - 1].value;
  }

  private aggregateValues(
    values: MetricValue[],
    aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count'
  ): Array<{ timestamp: Date; value: number }> {
    // Group by time intervals (e.g., 1 minute buckets)
    const buckets = new Map<number, number[]>();
    
    values.forEach(value => {
      const bucketTime = Math.floor(value.timestamp.getTime() / 60000) * 60000; // 1-minute buckets
      if (!buckets.has(bucketTime)) {
        buckets.set(bucketTime, []);
      }
      buckets.get(bucketTime)!.push(value.value);
    });

    return Array.from(buckets.entries()).map(([bucketTime, bucketValues]) => {
      let aggregatedValue: number;
      
      switch (aggregation) {
        case 'avg':
          aggregatedValue = bucketValues.reduce((sum, val) => sum + val, 0) / bucketValues.length;
          break;
        case 'sum':
          aggregatedValue = bucketValues.reduce((sum, val) => sum + val, 0);
          break;
        case 'min':
          aggregatedValue = Math.min(...bucketValues);
          break;
        case 'max':
          aggregatedValue = Math.max(...bucketValues);
          break;
        case 'count':
          aggregatedValue = bucketValues.length;
          break;
        default:
          aggregatedValue = bucketValues[bucketValues.length - 1];
      }

      return {
        timestamp: new Date(bucketTime),
        value: aggregatedValue
      };
    });
  }

  private getPerformanceMetrics(): PerformanceMetrics {
    return {
      lcp: this.getLatestValue('largest_contentful_paint') || 0,
      fid: this.getLatestValue('first_input_delay') || 0,
      cls: this.getLatestValue('cumulative_layout_shift') || 0,
      fcp: this.getLatestValue('first_contentful_paint_time') || 0,
      ttfb: this.getLatestValue('request_time') || 0,
      dnsLookup: this.getLatestValue('dns_lookup_time') || 0,
      tcpConnection: this.getLatestValue('tcp_connection_time') || 0,
      requestTime: this.getLatestValue('request_time') || 0,
      responseTime: this.getLatestValue('response_time') || 0,
      domProcessing: this.getLatestValue('dom_processing_time') || 0,
      resourceLoading: this.getLatestValue('resource_load_time') || 0,
      jsHeapSize: this.getLatestValue('js_heap_size') || 0,
      jsHeapSizeLimit: this.getLatestValue('js_heap_limit') || 0,
      eventLoopLag: 0, // Would require specific measurement
      apiResponseTimes: {},
      componentRenderTimes: {},
      bundleSize: this.getLatestValue('total_resource_size') || 0,
      memoryUsage: this.getLatestValue('js_heap_size') || 0
    };
  }

  private getBusinessMetrics(): BusinessMetrics {
    return {
      conversionRate: this.getLatestValue('conversion_rate') || 0,
      averageOrderValue: this.getLatestValue('average_order_value') || 0,
      cartAbandonmentRate: 0, // Would calculate from cart events
      revenuePerVisitor: 0, // Would calculate from revenue and visitors
      customerLifetimeValue: 0, // Would calculate from customer data
      dailyActiveUsers: this.getLatestValue('active_users') || 0,
      monthlyActiveUsers: 0, // Would calculate from user data
      sessionDuration: this.getLatestValue('session_duration') || 0,
      bounceRate: 0, // Would calculate from session data
      pageViewsPerSession: 0, // Would calculate from pageview data
      userGrowthRate: 0, // Would calculate from user registration data
      churnRate: 0, // Would calculate from user activity data
      retentionRate: 0, // Would calculate from user retention data
      customMetrics: {}
    };
  }

  private getSystemMetrics(): SystemMetrics {
    return {
      cpuUsage: 0, // Server-side metric
      memoryUsage: this.getLatestValue('device_memory') || 0,
      diskUsage: 0, // Server-side metric
      networkTraffic: 0, // Server-side metric
      requestsPerSecond: 0, // Server-side metric
      errorRate: this.getLatestValue('error_rate') || 0,
      responseTime: this.getLatestValue('api_response_time') || 0,
      activeConnections: 0, // Server-side metric
      queueSize: 0, // Server-side metric
      queryTime: 0, // Server-side metric
      connectionPoolSize: 0, // Server-side metric
      slowQueries: 0, // Server-side metric
      cacheHitRate: 0, // Server-side metric
      cacheMissRate: 0, // Server-side metric
      cacheSize: 0 // Server-side metric
    };
  }

  private calculateConversionRate(): number {
    // Placeholder calculation - would use real business logic
    return Math.random() * 5; // 0-5% conversion rate
  }

  private calculateAverageOrderValue(): number {
    // Placeholder calculation - would use real order data
    return 50 + Math.random() * 100; // $50-$150 AOV
  }

  private exportToCSV(data: Record<string, MetricValue[]>): string {
    let csv = 'metric_name,timestamp,value,tags,unit\n';
    
    Object.entries(data).forEach(([metricName, values]) => {
      values.forEach(value => {
        const tags = Object.entries(value.tags).map(([k, v]) => `${k}=${v}`).join(';');
        csv += `${metricName},${value.timestamp.toISOString()},${value.value},"${tags}",${value.unit}\n`;
      });
    });
    
    return csv;
  }

  private exportToPrometheus(data: Record<string, MetricValue[]>): string {
    let prometheus = '';
    
    Object.entries(data).forEach(([metricName, values]) => {
      const latestValue = values[values.length - 1];
      if (latestValue) {
        const tags = Object.entries(latestValue.tags).map(([k, v]) => `${k}="${v}"`).join(',');
        prometheus += `${metricName}{${tags}} ${latestValue.value}\n`;
      }
    });
    
    return prometheus;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup and disconnect
   */
  destroy(): void {
    // Clear all timers
    this.timers.forEach(timer => clearInterval(timer));
    this.timers.clear();

    // Disconnect WebSocket
    if (this.websocket) {
      this.websocket.close();
    }

    // Disconnect performance observer
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    // Disconnect mutation observer
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    // Clear event listeners
    this.eventListeners.clear();
  }
}

export default MetricsMonitoringService;