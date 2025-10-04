/**
 * Error Tracking Utility for FASHUN.CO
 * 
 * This utility provides comprehensive error tracking, performance monitoring,
 * and user context collection for debugging and monitoring purposes.
 */

interface ErrorContext {
  userId?: string
  sessionId: string
  userAgent: string
  url: string
  timestamp: string
}

interface Breadcrumb {
  timestamp: string
  category: 'navigation' | 'user' | 'api' | 'system' | 'error' | 'performance'
  message: string
  data?: any
  level?: 'info' | 'warning' | 'error'
}

interface UserContext {
  userId?: string
  email?: string
  name?: string
  role?: string
}

interface DeviceInfo {
  browser: string
  os: string
  screenSize: string
  viewport: string
  userAgent: string
}

interface PerformanceMetrics {
  loadTime?: number
  apiResponseTime?: number
  renderTime?: number
  memoryUsage?: number
}

class ErrorTracker {
  private breadcrumbs: Breadcrumb[] = []
  private userContext: UserContext = {}
  private deviceInfo: DeviceInfo
  private sessionId: string
  private isInitialized = false

  constructor() {
    this.sessionId = this.generateSessionId()
    this.deviceInfo = this.collectDeviceInfo()
    this.initialize()
  }

  /**
   * Initialize error tracking
   */
  private initialize() {
    if (typeof window === 'undefined') return

    // Global error handler
    window.addEventListener('error', this.handleGlobalError.bind(this))
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this))
    
    // Performance monitoring
    if ('performance' in window) {
      this.monitorPerformance()
    }

    this.isInitialized = true
    console.log('FASHUN Error Tracker initialized')
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }

  /**
   * Collect device and browser information
   */
  private collectDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        browser: 'Unknown',
        os: 'Unknown',
        screenSize: 'Unknown',
        viewport: 'Unknown',
        userAgent: 'Server'
      }
    }

    const ua = navigator.userAgent
    
    // Browser detection
    let browser = 'Unknown'
    if (ua.includes('Chrome/')) browser = 'Chrome'
    else if (ua.includes('Firefox/')) browser = 'Firefox'
    else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari'
    else if (ua.includes('Edge/')) browser = 'Edge'

    // OS detection
    let os = 'Unknown'
    if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac OS')) os = 'macOS'
    else if (ua.includes('Linux')) os = 'Linux'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iOS')) os = 'iOS'

    return {
      browser,
      os,
      screenSize: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: ua
    }
  }

  /**
   * Handle global JavaScript errors
   */
  private handleGlobalError(event: ErrorEvent) {
    this.logError(event.error || new Error(event.message), {
      type: 'javascript',
      url: event.filename || window.location.href,
      line: event.lineno,
      column: event.colno
    })
  }

  /**
   * Handle unhandled promise rejections
   */
  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    this.logError(new Error(event.reason), {
      type: 'promise',
      url: window.location.href
    })
  }

  /**
   * Monitor performance metrics
   */
  private monitorPerformance() {
    if (typeof window === 'undefined') return

    // Page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart
          if (loadTime > 3000) { // Alert for slow loads
            this.addBreadcrumb('performance', `Slow page load: ${loadTime}ms`, { loadTime })
          }
        }
      }, 1000)
    })

    // Monitor Core Web Vitals
    this.monitorWebVitals()
  }

  /**
   * Monitor Core Web Vitals (LCP, FID, CLS)
   */
  private monitorWebVitals() {
    // This is a simplified version - in production, use web-vitals library
    if (typeof window === 'undefined') return

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (lastEntry.startTime > 2500) {
        this.addBreadcrumb('performance', `Poor LCP: ${lastEntry.startTime}ms`, { 
          lcp: lastEntry.startTime 
        })
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] })
  }

  /**
   * Set user context for error tracking
   */
  setUserContext(userId: string, email?: string, name?: string, role?: string) {
    this.userContext = { userId, email, name, role }
  }

  /**
   * Add breadcrumb trail
   */
  addBreadcrumb(category: Breadcrumb['category'], message: string, data?: any, level: Breadcrumb['level'] = 'info') {
    const breadcrumb: Breadcrumb = {
      timestamp: new Date().toISOString(),
      category,
      message,
      data: this.sanitizeData(data),
      level
    }

    this.breadcrumbs.push(breadcrumb)

    // Keep only last 50 breadcrumbs
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs = this.breadcrumbs.slice(-50)
    }
  }

  /**
   * Capture and log an error
   */
  logError(error: Error, context?: any) {
    if (!error) return

    const severity = this.determineSeverity(error, context)
    
    const errorData = {
      type: context?.type || 'javascript',
      message: error.message,
      stack: error.stack || '',
      url: context?.url || (typeof window !== 'undefined' ? window.location.href : ''),
      userAgent: this.deviceInfo.userAgent,
      userId: this.userContext.userId,
      sessionId: this.sessionId,
      severity,
      metadata: {
        breadcrumbs: this.breadcrumbs.slice(-10), // Last 10 breadcrumbs
        userContext: this.userContext,
        deviceInfo: this.deviceInfo,
        performanceMetrics: this.getPerformanceMetrics(),
        ...context
      }
    }

    // Send to logging endpoint
    this.sendErrorLog(errorData)

    // Store in localStorage as backup
    this.storeErrorLocally(errorData)

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Tracked')
      console.error('Error:', error)
      console.log('Context:', context)
      console.log('Breadcrumbs:', this.breadcrumbs.slice(-5))
      console.groupEnd()
    }
  }

  /**
   * Capture API errors
   */
  captureAPIError(response: Response, request: Request | string) {
    const url = typeof request === 'string' ? request : request.url
    const error = new Error(`API Error: ${response.status} ${response.statusText}`)
    
    this.logError(error, {
      type: 'api',
      apiEndpoint: url,
      statusCode: response.status,
      url: typeof window !== 'undefined' ? window.location.href : url
    })
  }

  /**
   * Capture custom messages
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', data?: any) {
    const error = new Error(message)
    this.logError(error, {
      type: 'message',
      level,
      data: this.sanitizeData(data)
    })
  }

  /**
   * Determine error severity
   */
  private determineSeverity(error: Error, context?: any): 'critical' | 'high' | 'medium' | 'low' {
    if (context?.statusCode >= 500) return 'critical'
    if (context?.type === 'api' && context?.statusCode >= 400) return 'high'
    if (error.message.includes('ChunkLoadError')) return 'medium'
    if (error.message.includes('TypeError')) return 'high'
    if (error.message.includes('ReferenceError')) return 'high'
    return 'medium'
  }

  /**
   * Get current performance metrics
   */
  private getPerformanceMetrics(): PerformanceMetrics {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return {}
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const memory = (performance as any).memory

    return {
      loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : undefined,
      renderTime: navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : undefined,
      memoryUsage: memory ? memory.usedJSHeapSize : undefined
    }
  }

  /**
   * Sanitize sensitive data
   */
  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') return data

    const sanitized = { ...data }
    const sensitiveKeys = ['password', 'token', 'apikey', 'secret', 'authorization']

    for (const [key, value] of Object.entries(sanitized)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]'
      } else if (typeof value === 'string' && value.includes('@')) {
        sanitized[key] = value.replace(/(.{2}).*(@.*)/, '$1***$2')
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value)
      }
    }

    return sanitized
  }

  /**
   * Send error log to server
   */
  private async sendErrorLog(errorData: any) {
    try {
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
      })
    } catch (error) {
      console.error('Failed to send error log:', error)
    }
  }

  /**
   * Store error locally as backup
   */
  private storeErrorLocally(errorData: any) {
    if (typeof localStorage === 'undefined') return

    try {
      const stored = localStorage.getItem('fashun_errors') || '[]'
      const errors = JSON.parse(stored)
      errors.push({
        ...errorData,
        timestamp: Date.now()
      })

      // Keep only last 10 errors
      if (errors.length > 10) {
        errors.splice(0, errors.length - 10)
      }

      localStorage.setItem('fashun_errors', JSON.stringify(errors))
    } catch (error) {
      console.error('Failed to store error locally:', error)
    }
  }
}

// Create global instance
const errorTracker = new ErrorTracker()

// Export functions for use throughout the app
export const logError = (error: Error, context?: any) => errorTracker.logError(error, context)
export const captureException = (error: Error, additionalData?: any) => errorTracker.logError(error, additionalData)
export const captureMessage = (message: string, level?: 'info' | 'warning' | 'error', data?: any) => errorTracker.captureMessage(message, level, data)
export const setUserContext = (userId: string, email?: string, name?: string, role?: string) => errorTracker.setUserContext(userId, email, name, role)
export const addBreadcrumb = (category: 'navigation' | 'user' | 'api' | 'system' | 'error' | 'performance', message: string, data?: any) => errorTracker.addBreadcrumb(category, message, data)
export const captureAPIError = (response: Response, request: Request | string) => errorTracker.captureAPIError(response, request)

// React Hook for error tracking
export function useErrorTracking() {
  return {
    logError,
    captureException,
    captureMessage,
    setUserContext,
    addBreadcrumb,
    captureAPIError
  }
}

export default errorTracker