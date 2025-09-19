// Real-User Monitoring and Error Tracking Service
import { NextRequest } from 'next/server';

interface ErrorEvent {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  userId?: string;
  sessionId: string;
}

interface PerformanceEvent {
  type: 'navigation' | 'resource' | 'paint' | 'interaction';
  name: string;
  value: number;
  timestamp: number;
  url: string;
  sessionId: string;
}

class MonitoringService {
  private static instance: MonitoringService;
  private errorQueue: ErrorEvent[] = [];
  private performanceQueue: PerformanceEvent[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandling();
    this.setupPerformanceObserver();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandling() {
    if (typeof window !== 'undefined') {
      // Capture unhandled errors
      window.addEventListener('error', (event) => {
        this.captureError({
          message: event.message,
          stack: event.error?.stack,
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          sessionId: this.sessionId
        });
      });

      // Capture unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError({
          message: `Unhandled Promise Rejection: ${event.reason}`,
          stack: event.reason?.stack,
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          sessionId: this.sessionId
        });
      });
    }
  }

  private setupPerformanceObserver() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.capturePerformance({
            type: entry.entryType as any,
            name: entry.name,
            value: entry.duration || (entry as any).value,
            timestamp: Date.now(),
            url: window.location.href,
            sessionId: this.sessionId
          });
        }
      });

      // Observe different performance metrics
      try {
        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
      } catch (e) {
        console.warn('Performance Observer not fully supported');
      }
    }
  }

  captureError(error: ErrorEvent) {
    this.errorQueue.push(error);
    this.flush();
  }

  capturePerformance(perf: PerformanceEvent) {
    this.performanceQueue.push(perf);
    this.flush();
  }

  captureUserInteraction(action: string, element: string, value?: any) {
    if (typeof window !== 'undefined') {
      this.capturePerformance({
        type: 'interaction',
        name: `${action}:${element}`,
        value: value || 1,
        timestamp: Date.now(),
        url: window.location.href,
        sessionId: this.sessionId
      });
    }
  }

  private async flush() {
    if (this.errorQueue.length > 0 || this.performanceQueue.length > 0) {
      try {
        await fetch('/api/monitoring/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            errors: [...this.errorQueue],
            performance: [...this.performanceQueue]
          })
        });

        // Clear queues after successful send
        this.errorQueue = [];
        this.performanceQueue = [];
      } catch (error) {
        console.warn('Failed to send monitoring data:', error);
      }
    }
  }

  // Session replay functionality
  startSessionRecording() {
    if (typeof window !== 'undefined') {
      // This would integrate with LogRocket or similar service
      // For now, we'll implement basic DOM change tracking
      this.observeDOMChanges();
    }
  }

  private observeDOMChanges() {
    if (typeof window !== 'undefined' && 'MutationObserver' in window) {
      const observer = new MutationObserver((mutations) => {
        const changes = mutations.map(mutation => ({
          type: mutation.type,
          target: mutation.target.nodeName,
          timestamp: Date.now()
        }));

        // Store significant DOM changes for session replay
        this.capturePerformance({
          type: 'interaction',
          name: 'dom_changes',
          value: changes.length,
          timestamp: Date.now(),
          url: window.location.href,
          sessionId: this.sessionId
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }
  }

  // Performance budgeting
  checkPerformanceBudget(metrics: { [key: string]: number }) {
    const budgets = {
      firstContentfulPaint: 1500, // 1.5s
      largestContentfulPaint: 2500, // 2.5s
      firstInputDelay: 100, // 100ms
      cumulativeLayoutShift: 0.1, // 0.1
      totalBlockingTime: 200 // 200ms
    };

    const violations = [];
    for (const [metric, value] of Object.entries(metrics)) {
      if (budgets[metric as keyof typeof budgets] && value > budgets[metric as keyof typeof budgets]) {
        violations.push({ metric, value, budget: budgets[metric as keyof typeof budgets] });
      }
    }

    if (violations.length > 0) {
      this.captureError({
        message: `Performance Budget Violation: ${violations.map(v => `${v.metric}: ${v.value}ms > ${v.budget}ms`).join(', ')}`,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      });
    }

    return violations;
  }
}

export default MonitoringService;