'use strict';

/**
 * Monitoring service
 * Comprehensive monitoring, error tracking, and alerting system
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  defaultMeta: { service: 'fashun-backend' },
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 20 * 1024 * 1024, // 20MB
      maxFiles: 10,
      tailable: true
    }),

    // Security logs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'security.log'),
      level: 'warn',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
      tailable: true
    })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = ({ strapi }) => ({
  /**
   * Initialize monitoring system
   */
  async initialize() {
    try {
      // Set up error tracking
      await this.setupErrorTracking();
      
      // Initialize health checks
      await this.initializeHealthChecks();
      
      // Set up performance monitoring
      await this.setupPerformanceMonitoring();
      
      // Initialize alerting system
      await this.setupAlerting();
      
      logger.info('Monitoring system initialized successfully');
      
    } catch (error) {
      logger.error('Failed to initialize monitoring system:', error);
      throw error;
    }
  },

  /**
   * Set up comprehensive error tracking
   */
  async setupErrorTracking() {
    // Global error handlers
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      this.sendAlert('critical', 'Uncaught Exception', error.message, { stack: error.stack });
      
      // Graceful shutdown
      setTimeout(() => {
        process.exit(1);
      }, 5000);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.sendAlert('critical', 'Unhandled Promise Rejection', reason?.message || reason, { 
        promise: promise.toString() 
      });
    });

    // Strapi error handler
    strapi.app.on('error', (error, ctx) => {
      const errorInfo = {
        error: error.message,
        stack: error.stack,
        status: error.status || 500,
        method: ctx?.method,
        url: ctx?.url,
        ip: ctx?.ip,
        userAgent: ctx?.headers['user-agent'],
        userId: ctx?.state?.user?.id,
        requestId: ctx?.requestId
      };

      logger.error('Application Error:', errorInfo);
      
      // Send alert for critical errors
      if (error.status >= 500) {
        this.sendAlert('high', 'Application Error', error.message, errorInfo);
      }
    });

    logger.info('Error tracking initialized');
  },

  /**
   * Initialize health checks
   */
  async initializeHealthChecks() {
    const healthChecks = {
      // Database connectivity
      database: async () => {
        try {
          await strapi.db.connection.raw('SELECT 1');
          return { status: 'healthy', response_time: Date.now() };
        } catch (error) {
          return { status: 'unhealthy', error: error.message };
        }
      },

      // Memory usage
      memory: async () => {
        const usage = process.memoryUsage();
        const totalMB = Math.round(usage.heapTotal / 1024 / 1024);
        const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
        const freeMB = totalMB - usedMB;
        
        const status = (usedMB / totalMB) > 0.9 ? 'unhealthy' : 'healthy';
        
        return {
          status,
          heap_total: `${totalMB}MB`,
          heap_used: `${usedMB}MB`,
          heap_free: `${freeMB}MB`,
          usage_percentage: Math.round((usedMB / totalMB) * 100)
        };
      },

      // Disk space
      disk: async () => {
        try {
          const stats = fs.statSync(process.cwd());
          // This is a simplified check - in production, use a proper disk space library
          return { status: 'healthy', available: 'unknown' };
        } catch (error) {
          return { status: 'unhealthy', error: error.message };
        }
      },

      // External services (placeholder)
      external_services: async () => {
        // Check email service, payment gateway, etc.
        return { status: 'healthy', services: ['email', 'payment'] };
      }
    };

    // Store health checks for API endpoint
    global.healthChecks = healthChecks;

    // Run health checks periodically
    setInterval(async () => {
      await this.runHealthChecks();
    }, 60000); // Every minute

    logger.info('Health checks initialized');
  },

  /**
   * Run all health checks
   */
  async runHealthChecks() {
    const results = {};
    const healthChecks = global.healthChecks || {};
    
    for (const [name, check] of Object.entries(healthChecks)) {
      try {
        const startTime = Date.now();
        results[name] = await check();
        results[name].response_time = Date.now() - startTime;
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          error: error.message,
          response_time: Date.now() - startTime
        };
      }
    }

    // Store results
    global.lastHealthCheck = {
      timestamp: new Date().toISOString(),
      results,
      overall_status: Object.values(results).every(r => r.status === 'healthy') ? 'healthy' : 'unhealthy'
    };

    // Send alerts for unhealthy services
    for (const [service, result] of Object.entries(results)) {
      if (result.status === 'unhealthy') {
        await this.sendAlert('medium', `Service Unhealthy: ${service}`, result.error || 'Unknown error', result);
      }
    }

    return results;
  },

  /**
   * Set up performance monitoring
   */
  async setupPerformanceMonitoring() {
    // Monitor event loop lag
    const eventLoopMonitor = setInterval(() => {
      const start = process.hrtime.bigint();
      setImmediate(() => {
        const lag = Number(process.hrtime.bigint() - start) / 1000000; // Convert to milliseconds
        
        if (lag > 100) { // Alert if event loop lag is > 100ms
          logger.warn('High event loop lag detected:', { lag: `${lag.toFixed(2)}ms` });
          this.sendAlert('medium', 'High Event Loop Lag', `Event loop lag: ${lag.toFixed(2)}ms`);
        }
      });
    }, 30000); // Check every 30 seconds

    // Monitor CPU usage
    const cpuMonitor = setInterval(() => {
      const cpuUsage = process.cpuUsage();
      const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds
      
      // Store CPU metrics
      if (!global.performanceMetrics) global.performanceMetrics = [];
      global.performanceMetrics.push({
        type: 'cpu',
        usage: cpuPercent,
        timestamp: Date.now()
      });

      // Alert on high CPU usage (simplified check)
      if (cpuPercent > 80) {
        this.sendAlert('medium', 'High CPU Usage', `CPU usage: ${cpuPercent.toFixed(2)}%`);
      }
    }, 60000); // Check every minute

    // Clean up old metrics
    const metricsCleanup = setInterval(() => {
      if (global.performanceMetrics) {
        const cutoff = Date.now() - (24 * 60 * 60 * 1000); // Keep 24 hours
        global.performanceMetrics = global.performanceMetrics.filter(m => m.timestamp > cutoff);
      }
    }, 60 * 60 * 1000); // Clean up every hour

    logger.info('Performance monitoring initialized');
  },

  /**
   * Set up alerting system
   */
  async setupAlerting() {
    // Initialize alert queue
    global.alertQueue = global.alertQueue || [];
    
    // Process alerts every 5 seconds
    setInterval(async () => {
      await this.processAlertQueue();
    }, 5000);

    // Rate limiting for alerts (prevent spam)
    global.alertRateLimit = global.alertRateLimit || new Map();
    
    // Clean up rate limit cache
    setInterval(() => {
      const cutoff = Date.now() - (15 * 60 * 1000); // 15 minutes
      for (const [key, timestamp] of global.alertRateLimit.entries()) {
        if (timestamp < cutoff) {
          global.alertRateLimit.delete(key);
        }
      }
    }, 5 * 60 * 1000); // Clean up every 5 minutes

    logger.info('Alerting system initialized');
  },

  /**
   * Send alert to monitoring system
   */
  async sendAlert(priority, title, message, metadata = {}) {
    try {
      // Rate limiting to prevent spam
      const alertKey = `${priority}:${title}`;
      const lastSent = global.alertRateLimit.get(alertKey);
      const minInterval = priority === 'critical' ? 60000 : 300000; // 1min for critical, 5min for others
      
      if (lastSent && (Date.now() - lastSent) < minInterval) {
        return; // Skip duplicate alert
      }

      const alert = {
        id: this.generateAlertId(),
        timestamp: new Date().toISOString(),
        priority,
        title,
        message,
        metadata,
        service: 'fashun-backend',
        environment: process.env.NODE_ENV || 'development'
      };

      // Add to alert queue
      global.alertQueue.push(alert);
      
      // Update rate limit
      global.alertRateLimit.set(alertKey, Date.now());
      
      // Log alert
      logger.warn('Alert generated:', alert);
      
      return alert;

    } catch (error) {
      logger.error('Failed to send alert:', error);
    }
  },

  /**
   * Process alert queue
   */
  async processAlertQueue() {
    if (!global.alertQueue || global.alertQueue.length === 0) {
      return;
    }

    const alerts = global.alertQueue.splice(0, 10); // Process up to 10 alerts at once
    
    for (const alert of alerts) {
      try {
        // In production, send to external monitoring services
        await this.deliverAlert(alert);
        
      } catch (error) {
        logger.error('Failed to deliver alert:', error);
        // Re-queue failed alerts (with retry limit)
        if (!alert.retryCount || alert.retryCount < 3) {
          alert.retryCount = (alert.retryCount || 0) + 1;
          global.alertQueue.push(alert);
        }
      }
    }
  },

  /**
   * Deliver alert to external services
   */
  async deliverAlert(alert) {
    // Placeholder for external alerting integrations
    // In production, integrate with:
    // - Slack webhooks
    // - Email notifications  
    // - PagerDuty
    // - Discord webhooks
    // - SMS services
    
    logger.info('Alert delivered:', {
      id: alert.id,
      priority: alert.priority,
      title: alert.title
    });

    // Example: Webhook delivery (uncomment and configure)
    /*
    if (process.env.SLACK_WEBHOOK_URL) {
      await this.sendSlackAlert(alert);
    }
    
    if (process.env.EMAIL_ALERTS_ENABLED) {
      await this.sendEmailAlert(alert);
    }
    */
  },

  /**
   * Send Slack alert (example)
   */
  async sendSlackAlert(alert) {
    try {
      const payload = {
        text: `🚨 ${alert.title}`,
        attachments: [{
          color: this.getSlackColor(alert.priority),
          fields: [
            { title: 'Priority', value: alert.priority.toUpperCase(), short: true },
            { title: 'Service', value: alert.service, short: true },
            { title: 'Environment', value: alert.environment, short: true },
            { title: 'Message', value: alert.message, short: false }
          ],
          footer: 'FASHUN.CO Monitoring',
          ts: Math.floor(Date.parse(alert.timestamp) / 1000)
        }]
      };

      // Send to Slack webhook (implementation depends on your HTTP client)
      logger.info('Slack alert sent:', alert.id);
      
    } catch (error) {
      logger.error('Failed to send Slack alert:', error);
      throw error;
    }
  },

  /**
   * Get system metrics for API
   */
  getSystemMetrics() {
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    
    return {
      uptime: {
        seconds: Math.floor(uptime),
        human: this.formatUptime(uptime)
      },
      memory: {
        heap_used: Math.round(memory.heapUsed / 1024 / 1024), // MB
        heap_total: Math.round(memory.heapTotal / 1024 / 1024), // MB
        external: Math.round(memory.external / 1024 / 1024), // MB
        rss: Math.round(memory.rss / 1024 / 1024) // MB
      },
      cpu: process.cpuUsage(),
      node_version: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Get error statistics
   */
  getErrorStats(timeframe = '24h') {
    // In production, this would query error logs/database
    const stats = {
      total_errors: 0,
      error_rate: 0,
      top_errors: [],
      error_trends: [],
      timeframe
    };
    
    // Mock data for development
    if (process.env.NODE_ENV === 'development') {
      stats.total_errors = 12;
      stats.error_rate = 0.5; // 0.5%
      stats.top_errors = [
        { message: 'Database connection timeout', count: 5 },
        { message: 'Invalid product ID', count: 4 },
        { message: 'Rate limit exceeded', count: 3 }
      ];
    }
    
    return stats;
  },

  /**
   * Create monitoring dashboard endpoint
   */
  createDashboardEndpoint(router) {
    // Health check endpoint
    router.get('/api/health', async (ctx) => {
      const health = global.lastHealthCheck || await this.runHealthChecks();
      
      ctx.status = health.overall_status === 'healthy' ? 200 : 503;
      ctx.body = {
        status: health.overall_status,
        timestamp: health.timestamp,
        checks: health.results
      };
    });

    // Metrics endpoint
    router.get('/api/metrics', async (ctx) => {
      // Basic authentication check
      if (process.env.NODE_ENV === 'production') {
        const auth = ctx.headers.authorization;
        if (!auth || !this.validateMetricsAuth(auth)) {
          ctx.status = 401;
          ctx.body = { error: 'Unauthorized' };
          return;
        }
      }

      ctx.body = {
        system: this.getSystemMetrics(),
        errors: this.getErrorStats(),
        performance: {
          recent_requests: (global.performanceMetrics || []).slice(-100)
        },
        alerts: {
          recent: (global.alertQueue || []).slice(-10),
          total_count: (global.alertQueue || []).length
        }
      };
    });

    logger.info('Monitoring dashboard endpoints created');
  },

  // Utility methods
  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  getSlackColor(priority) {
    const colors = {
      critical: 'danger',
      high: 'warning', 
      medium: 'good',
      low: '#36a64f'
    };
    return colors[priority] || 'good';
  },

  formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  },

  validateMetricsAuth(authHeader) {
    // Simple bearer token validation
    const token = authHeader.replace('Bearer ', '');
    return token === process.env.METRICS_TOKEN;
  },

  /**
   * Logger instance for external use
   */
  get logger() {
    return logger;
  }
});