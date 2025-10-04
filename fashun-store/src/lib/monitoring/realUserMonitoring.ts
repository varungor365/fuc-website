// Real User Monitoring (RUM) Library
// Tracks Core Web Vitals and user experience metrics

interface RUMConfig {
  apiEndpoint?: string;
  sampleRate?: number;
  enableAutoTracking?: boolean;
}

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent: string;
  sessionId: string;
}

interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  value?: number;
  rating?: string;
}

class RealUserMonitoring {
  private config: RUMConfig;
  private sessionId: string;
  private metrics: Metric[] = [];
  private isEnabled: boolean = false;

  constructor(config: RUMConfig = {}) {
    this.config = {
      apiEndpoint: '/api/monitoring/rum',
      sampleRate: 1.0,
      enableAutoTracking: true,
      ...config
    };
    
    this.sessionId = this.generateSessionId();
    this.isEnabled = typeof window !== 'undefined' && Math.random() <= (this.config.sampleRate || 1);
    
    if (this.isEnabled) {
      this.init();
    }
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    this.trackCoreWebVitals();
    
    // Track navigation timing
    this.trackNavigationTiming();
    
    // Track resource loading
    this.trackResourceTiming();
    
    // Track errors
    this.trackErrors();
    
    // Track user interactions
    this.trackUserInteractions();

    // Send metrics periodically
    setInterval(() => {
      this.sendMetrics();
    }, 30000); // Send every 30 seconds

    // Send metrics before page unload
    window.addEventListener('beforeunload', () => {
      this.sendMetrics();
    });
  }

  private generateSessionId(): string {
    return `rum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', (entry: any) => {
      this.recordMetric('LCP', entry.startTime, this.getLCPRating(entry.startTime));
    });

    // First Input Delay (FID)
    this.observePerformanceEntry('first-input', (entry: any) => {
      this.recordMetric('FID', entry.processingStart - entry.startTime, this.getFIDRating(entry.processingStart - entry.startTime));
    });

    // Cumulative Layout Shift (CLS)
    this.observePerformanceEntry('layout-shift', (entry: any) => {
      if (!entry.hadRecentInput) {
        this.recordMetric('CLS', entry.value, this.getCLSRating(entry.value));
      }
    });

    // First Contentful Paint (FCP)
    this.observePerformanceEntry('paint', (entry: any) => {
      if (entry.name === 'first-contentful-paint') {
        this.recordMetric('FCP', entry.startTime, this.getFCPRating(entry.startTime));
      }
    });
  }

  private observePerformanceEntry(type: string, callback: (entry: any) => void) {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      observer.observe({ type, buffered: true });
    } catch (error) {
      console.warn('Failed to observe performance entries:', error);
    }
  }

  private trackNavigationTiming() {
    if (typeof window === 'undefined' || !window.performance) return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      
      if (navigation) {
        // DNS lookup time
        this.recordMetric('DNS', navigation.domainLookupEnd - navigation.domainLookupStart);
        
        // TCP connection time
        this.recordMetric('TCP', navigation.connectEnd - navigation.connectStart);
        
        // Server response time
        this.recordMetric('TTFB', navigation.responseStart - navigation.requestStart);
        
        // Page load time
        this.recordMetric('Load', navigation.loadEventEnd - navigation.navigationStart);
        
        // DOM ready time
        this.recordMetric('DOMReady', navigation.domContentLoadedEventEnd - navigation.navigationStart);
      }
    });
  }

  private trackResourceTiming() {
    if (typeof window === 'undefined' || !window.performance) return;

    setInterval(() => {
      const resources = performance.getEntriesByType('resource');
      resources.forEach((resource: any) => {
        if (resource.duration > 0) {
          this.recordMetric(`Resource_${resource.initiatorType}`, resource.duration);
        }
      });
      performance.clearResourceTimings();
    }, 10000);
  }

  private trackErrors() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.recordMetric('JSError', 1, 'poor');
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.recordMetric('PromiseRejection', 1, 'poor');
    });
  }

  private trackUserInteractions() {
    if (typeof window === 'undefined') return;

    ['click', 'scroll', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.recordMetric(`Interaction_${eventType}`, performance.now());
      }, { passive: true });
    });
  }

  private recordMetric(name: string, value: number, rating?: 'good' | 'needs-improvement' | 'poor') {
    if (!this.isEnabled) return;

    const metric: Metric = {
      name,
      value: Math.round(value * 100) / 100, // Round to 2 decimal places
      rating: rating || this.getGenericRating(name, value),
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      sessionId: this.sessionId
    };

    this.metrics.push(metric);
    
    // Limit metrics array size
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }
  }

  private async sendMetrics() {
    if (!this.isEnabled || this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      if (this.config.apiEndpoint) {
        await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metrics: metricsToSend })
        });
      }
    } catch (error) {
      console.warn('Failed to send RUM metrics:', error);
      // Re-add metrics back to queue for retry
      this.metrics.unshift(...metricsToSend.slice(-50)); // Keep last 50 metrics
    }
  }

  // Rating helpers
  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private getFCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }

  private getGenericRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    // Generic rating based on common performance thresholds
    if (name.includes('Error') || name.includes('Rejection')) return 'poor';
    if (name.includes('Load') || name.includes('DNS') || name.includes('TCP')) {
      if (value <= 1000) return 'good';
      if (value <= 3000) return 'needs-improvement';
      return 'poor';
    }
    return 'good';
  }

  // Public methods
  public trackCustomMetric(name: string, value: number, rating?: 'good' | 'needs-improvement' | 'poor') {
    this.recordMetric(`Custom_${name}`, value, rating);
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public enable() {
    this.isEnabled = true;
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public disable() {
    this.isEnabled = false;
  }
}

// Singleton instance
let rumInstance: RealUserMonitoring | null = null;

export function initRUM(config?: RUMConfig): RealUserMonitoring {
  if (!rumInstance) {
    rumInstance = new RealUserMonitoring(config);
  }
  return rumInstance;
}

export function getRUM(): RealUserMonitoring | null {
  return rumInstance;
}

export default RealUserMonitoring;