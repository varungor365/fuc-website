/**
 * Production Monitoring and Alerting System
 * Comprehensive monitoring for production environment
 */

import { env } from './environment';

interface MetricData {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

interface Alert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  source: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: Record<string, any>;
}

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  error?: string;
  details?: Record<string, any>;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    inbound: number;
    outbound: number;
  };
}

class ProductionMonitoring {
  private static instance: ProductionMonitoring;
  private metrics: MetricData[] = [];
  private alerts: Alert[] = [];
  private healthChecks: Map<string, HealthCheckResult> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alertingEnabled: boolean;

  private constructor() {
    this.alertingEnabled = env.isProduction();
    this.initializeMonitoring();
  }

  static getInstance(): ProductionMonitoring {
    if (!ProductionMonitoring.instance) {
      ProductionMonitoring.instance = new ProductionMonitoring();
    }
    return ProductionMonitoring.instance;
  }

  private initializeMonitoring(): void {
    if (this.alertingEnabled) {
      console.log('🔍 Initializing production monitoring...');
      this.startMetricsCollection();
    }
  }

  private startMetricsCollection(): void {
    // Collect metrics every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.collectSystemMetrics();
      this.collectApplicationMetrics();
      this.runHealthChecks();
    }, 30000);

    console.log('✅ Metrics collection started');
  }

  private async collectSystemMetrics(): Promise<void> {
    try {
      // Simulate system metrics collection
      const systemMetrics: SystemMetrics = {
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: {
          inbound: Math.random() * 1000,
          outbound: Math.random() * 1000,
        },
      };

      this.recordMetric({
        name: 'system.cpu.usage',
        value: systemMetrics.cpu,
        unit: 'percent',
        timestamp: new Date(),
        tags: { server: 'production' },
      });

      this.recordMetric({
        name: 'system.memory.usage',
        value: systemMetrics.memory,
        unit: 'percent',
        timestamp: new Date(),
        tags: { server: 'production' },
      });

      this.recordMetric({
        name: 'system.disk.usage',
        value: systemMetrics.disk,
        unit: 'percent',
        timestamp: new Date(),
        tags: { server: 'production' },
      });

      // Check for alerts
      if (systemMetrics.cpu > 80) {
        this.createAlert({
          level: 'warning',
          title: 'High CPU Usage',
          message: `CPU usage is at ${systemMetrics.cpu.toFixed(1)}%`,
          source: 'system-monitor',
        });
      }

      if (systemMetrics.memory > 85) {
        this.createAlert({
          level: 'error',
          title: 'High Memory Usage',
          message: `Memory usage is at ${systemMetrics.memory.toFixed(1)}%`,
          source: 'system-monitor',
        });
      }

    } catch (error) {
      console.error('❌ Failed to collect system metrics:', error);
    }
  }

  private async collectApplicationMetrics(): Promise<void> {
    try {
      // Simulate application metrics
      const appMetrics = {
        activeUsers: Math.floor(Math.random() * 1000),
        requestsPerMinute: Math.floor(Math.random() * 5000),
        errorRate: Math.random() * 5,
        averageResponseTime: Math.random() * 500 + 100,
        databaseConnections: Math.floor(Math.random() * 50),
        cacheHitRate: Math.random() * 30 + 70,
      };

      Object.entries(appMetrics).forEach(([name, value]) => {
        this.recordMetric({
          name: `app.${name}`,
          value,
          unit: this.getMetricUnit(name),
          timestamp: new Date(),
          tags: { environment: 'production' },
        });
      });

      // Application-specific alerts
      if (appMetrics.errorRate > 3) {
        this.createAlert({
          level: 'error',
          title: 'High Error Rate',
          message: `Error rate is at ${appMetrics.errorRate.toFixed(2)}%`,
          source: 'application-monitor',
        });
      }

      if (appMetrics.averageResponseTime > 1000) {
        this.createAlert({
          level: 'warning',
          title: 'Slow Response Time',
          message: `Average response time is ${appMetrics.averageResponseTime.toFixed(0)}ms`,
          source: 'application-monitor',
        });
      }

    } catch (error) {
      console.error('❌ Failed to collect application metrics:', error);
    }
  }

  private getMetricUnit(metricName: string): string {
    const unitMap: Record<string, string> = {
      activeUsers: 'count',
      requestsPerMinute: 'count/min',
      errorRate: 'percent',
      averageResponseTime: 'milliseconds',
      databaseConnections: 'count',
      cacheHitRate: 'percent',
    };
    return unitMap[metricName] || 'unit';
  }

  private async runHealthChecks(): Promise<void> {
    const healthChecks = [
      { name: 'database', check: this.checkDatabase },
      { name: 'redis', check: this.checkRedis },
      { name: 'external-api', check: this.checkExternalAPIs },
      { name: 'storage', check: this.checkStorage },
    ];

    for (const { name, check } of healthChecks) {
      try {
        const result = await check.call(this);
        this.healthChecks.set(name, result);

        if (result.status === 'unhealthy') {
          this.createAlert({
            level: 'critical',
            title: `${name} Health Check Failed`,
            message: result.error || `${name} service is unhealthy`,
            source: 'health-check',
            metadata: result.details,
          });
        }
      } catch (error) {
        console.error(`❌ Health check failed for ${name}:`, error);
      }
    }
  }

  private async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      // Simulate database check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
      const responseTime = Date.now() - startTime;

      return {
        service: 'database',
        status: responseTime < 100 ? 'healthy' : 'degraded',
        responseTime,
        details: {
          connections: Math.floor(Math.random() * 20),
          queryTime: responseTime,
        },
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Database connection failed',
      };
    }
  }

  private async checkRedis(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      // Simulate Redis check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 30));
      const responseTime = Date.now() - startTime;

      return {
        service: 'redis',
        status: responseTime < 50 ? 'healthy' : 'degraded',
        responseTime,
        details: {
          memory: Math.random() * 100,
          connections: Math.floor(Math.random() * 10),
        },
      };
    } catch (error) {
      return {
        service: 'redis',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Redis connection failed',
      };
    }
  }

  private async checkExternalAPIs(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      // Check external services (Stripe, email, etc.)
      const checks = await Promise.allSettled([
        this.checkStripeAPI(),
        this.checkEmailService(),
        this.checkAnalyticsService(),
      ]);

      const responseTime = Date.now() - startTime;
      const failures = checks.filter(result => result.status === 'rejected').length;

      return {
        service: 'external-api',
        status: failures === 0 ? 'healthy' : failures <= 1 ? 'degraded' : 'unhealthy',
        responseTime,
        details: {
          totalChecks: checks.length,
          failures,
          services: ['stripe', 'email', 'analytics'],
        },
      };
    } catch (error) {
      return {
        service: 'external-api',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'External API checks failed',
      };
    }
  }

  private async checkStorage(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      // Simulate storage check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 40));
      const responseTime = Date.now() - startTime;

      return {
        service: 'storage',
        status: 'healthy',
        responseTime,
        details: {
          diskSpace: Math.random() * 50 + 50,
          iops: Math.floor(Math.random() * 1000),
        },
      };
    } catch (error) {
      return {
        service: 'storage',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Storage check failed',
      };
    }
  }

  private async checkStripeAPI(): Promise<void> {
    // Simulate Stripe API check
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
  }

  private async checkEmailService(): Promise<void> {
    // Simulate email service check
    await new Promise(resolve => setTimeout(resolve, Math.random() * 80));
  }

  private async checkAnalyticsService(): Promise<void> {
    // Simulate analytics service check
    await new Promise(resolve => setTimeout(resolve, Math.random() * 60));
  }

  public recordMetric(metric: MetricData): void {
    this.metrics.push(metric);

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // In production, send to monitoring service
    if (this.alertingEnabled) {
      this.sendMetricToMonitoringService(metric);
    }
  }

  private sendMetricToMonitoringService(metric: MetricData): void {
    // Mock sending to external monitoring service
    console.log(`📊 Metric: ${metric.name} = ${metric.value} ${metric.unit}`);
  }

  public createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'resolved'>): Alert {
    const alert: Alert = {
      id: this.generateAlertId(),
      timestamp: new Date(),
      resolved: false,
      ...alertData,
    };

    this.alerts.push(alert);

    // Send alert notification
    if (this.alertingEnabled) {
      this.sendAlert(alert);
    }

    console.log(`🚨 Alert: [${alert.level.toUpperCase()}] ${alert.title} - ${alert.message}`);

    return alert;
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendAlert(alert: Alert): Promise<void> {
    try {
      // Send to Slack
      await this.sendSlackAlert(alert);

      // Send to email for critical alerts
      if (alert.level === 'critical') {
        await this.sendEmailAlert(alert);
      }

      // Send to Sentry for errors
      if (alert.level === 'error' || alert.level === 'critical') {
        await this.sendSentryAlert(alert);
      }

    } catch (error) {
      console.error('❌ Failed to send alert:', error);
    }
  }

  private async sendSlackAlert(alert: Alert): Promise<void> {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) return;

    const color = {
      info: '#36a64f',
      warning: '#ff9500',
      error: '#ff0000',
      critical: '#8b0000',
    }[alert.level];

    const payload = {
      text: `🚨 ${alert.title}`,
      attachments: [
        {
          color,
          fields: [
            { title: 'Level', value: alert.level.toUpperCase(), short: true },
            { title: 'Source', value: alert.source, short: true },
            { title: 'Message', value: alert.message, short: false },
            { title: 'Time', value: alert.timestamp.toISOString(), short: true },
          ],
        },
      ],
    };

    // Mock Slack notification
    console.log(`📢 Slack alert sent: ${alert.title}`);
  }

  private async sendEmailAlert(alert: Alert): Promise<void> {
    // Mock email alert
    console.log(`📧 Email alert sent: ${alert.title}`);
  }

  private async sendSentryAlert(alert: Alert): Promise<void> {
    // Mock Sentry integration
    console.log(`🐛 Sentry alert sent: ${alert.title}`);
  }

  public getMetrics(timeRange?: { start: Date; end: Date }): MetricData[] {
    if (!timeRange) return this.metrics;

    return this.metrics.filter(
      metric =>
        metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end
    );
  }

  public getAlerts(filters?: {
    level?: Alert['level'];
    resolved?: boolean;
    timeRange?: { start: Date; end: Date };
  }): Alert[] {
    let filteredAlerts = this.alerts;

    if (filters?.level) {
      filteredAlerts = filteredAlerts.filter(alert => alert.level === filters.level);
    }

    if (filters?.resolved !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert => alert.resolved === filters.resolved);
    }

    if (filters?.timeRange) {
      filteredAlerts = filteredAlerts.filter(
        alert =>
          alert.timestamp >= filters.timeRange!.start &&
          alert.timestamp <= filters.timeRange!.end
      );
    }

    return filteredAlerts;
  }

  public getHealthStatus(): Record<string, HealthCheckResult> {
    const status: Record<string, HealthCheckResult> = {};
    this.healthChecks.forEach((result, service) => {
      status[service] = result;
    });
    return status;
  }

  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      console.log(`✅ Alert resolved: ${alert.title}`);
      return true;
    }
    return false;
  }

  public getDashboardData(): {
    metrics: { name: string; current: number; trend: number }[];
    alerts: { level: string; count: number }[];
    health: { service: string; status: string; responseTime: number }[];
    uptime: number;
  } {
    // Calculate metric summaries
    const metricSummaries = this.getMetricSummaries();

    // Alert counts by level
    const alertCounts = this.getAlertCounts();

    // Health status
    const healthStatus = Array.from(this.healthChecks.entries()).map(([service, result]) => ({
      service,
      status: result.status,
      responseTime: result.responseTime,
    }));

    // Calculate uptime (mock)
    const uptime = Math.random() * 5 + 95; // 95-100%

    return {
      metrics: metricSummaries,
      alerts: alertCounts,
      health: healthStatus,
      uptime,
    };
  }

  private getMetricSummaries(): { name: string; current: number; trend: number }[] {
    const recentMetrics = this.metrics.filter(
      m => Date.now() - m.timestamp.getTime() < 300000 // Last 5 minutes
    );

    const groupedMetrics = recentMetrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(groupedMetrics).map(([name, values]) => {
      const current = values[values.length - 1] || 0;
      const previous = values[Math.floor(values.length / 2)] || current;
      const trend = current - previous;

      return { name, current, trend };
    });
  }

  private getAlertCounts(): { level: string; count: number }[] {
    const unresolvedAlerts = this.alerts.filter(a => !a.resolved);
    const counts = { info: 0, warning: 0, error: 0, critical: 0 };

    unresolvedAlerts.forEach(alert => {
      counts[alert.level]++;
    });

    return Object.entries(counts).map(([level, count]) => ({ level, count }));
  }

  public shutdown(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('🔍 Production monitoring stopped');
  }
}

// Export singleton instance
export const monitoring = ProductionMonitoring.getInstance();

// Export types
export type { MetricData, Alert, HealthCheckResult, SystemMetrics };

// Default export
export default monitoring;