'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

interface WebVitalMetric extends Metric {
  rating: 'good' | 'needs-improvement' | 'poor';
}

export default function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Function to send vitals to analytics
    function sendToAnalytics(metric: WebVitalMetric) {
      const body = JSON.stringify(metric);
      
      // Send to Google Analytics (if available)
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_label: metric.id,
          non_interaction: true,
        });
      }

      // Send to console for development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Web Vital:', {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          target: getTargetValue(metric.name),
          status: getStatus(metric.name, metric.value)
        });
      }

      // Send to custom analytics endpoint (optional)
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/web-vitals', body);
      } else {
        fetch('/api/analytics/web-vitals', {
          body,
          method: 'POST',
          keepalive: true,
        }).catch(console.error);
      }
    }

    // Helper function to get target values for metrics
    function getTargetValue(metricName: string): number {
      switch (metricName) {
        case 'CLS': return 0.1;
        case 'INP': return 200; // INP target is 200ms (replaces FID)
        case 'FCP': return 1800;
        case 'LCP': return 2500;
        case 'TTFB': return 600;
        default: return 0;
      }
    }

    // Helper function to get status based on value
    function getStatus(metricName: string, value: number): string {
      const target = getTargetValue(metricName);
      if (metricName === 'CLS') {
        if (value <= 0.1) return '✅ Good';
        if (value <= 0.25) return '⚠️ Needs Improvement';
        return '❌ Poor';
      }
      
      const percentage = (value / target) * 100;
      if (percentage <= 100) return '✅ Good';
      if (percentage <= 150) return '⚠️ Needs Improvement';
      return '❌ Poor';
    }

    // Initialize Web Vitals monitoring with proper v5 API
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // INP replaces FID in web-vitals v5
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);

    // Additional performance monitoring
    const reportPerformance = () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (perfData) {
          const timing = {
            'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
            'TCP Connection': perfData.connectEnd - perfData.connectStart,
            'TLS Handshake': perfData.connectEnd - perfData.secureConnectionStart,
            'Request': perfData.responseStart - perfData.requestStart,
            'Response': perfData.responseEnd - perfData.responseStart,
            'DOM Processing': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            'Page Load': perfData.loadEventEnd - perfData.loadEventStart,
          };

          if (process.env.NODE_ENV === 'development') {
            console.log('🚀 Performance Timing:', timing);
          }
        }

        // Resource loading performance
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter((resource: PerformanceEntry) => 
          (resource as PerformanceResourceTiming).duration > 1000
        );

        if (slowResources.length > 0 && process.env.NODE_ENV === 'development') {
          console.warn('🐌 Slow Resources (>1s):', slowResources.map(r => ({
            name: r.name,
            duration: (r as PerformanceResourceTiming).duration
          })));
        }
      }
    };

    // Report performance after page load
    if (document.readyState === 'complete') {
      reportPerformance();
    } else {
      window.addEventListener('load', reportPerformance);
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', reportPerformance);
    };
  }, []);

  return null; // This component doesn't render anything
}

// Optional: Export a hook for manual Web Vitals reporting
export function useWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onMetric = (metric: Metric) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`${metric.name}: ${metric.value}`);
      }
    };

    // Use the same functions as the component
    onCLS(onMetric);
    onINP(onMetric); // Updated to INP
    onFCP(onMetric);
    onLCP(onMetric);
    onTTFB(onMetric);
  }, []);
}