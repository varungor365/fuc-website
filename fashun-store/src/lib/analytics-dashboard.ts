/**
 * Real-Time Analytics Dashboard Service
 * Provides comprehensive analytics tracking and real-time dashboard functionality
 */

export interface AnalyticsConfig {
  trackingId: string;
  apiUrl: string;
  realTimeEndpoint: string;
  batchSize: number;
  flushInterval: number;
  enableRealTime: boolean;
  enableHeatmaps: boolean;
  enableUserJourney: boolean;
  enableConversionTracking: boolean;
  enablePerformanceMonitoring: boolean;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  duration: number;
  referrer?: string;
  userAgent: string;
  location: {
    country?: string;
    city?: string;
    region?: string;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
    screenResolution: string;
  };
  conversionGoals: string[];
  totalValue: number;
}

export interface AnalyticsEvent {
  eventId: string;
  sessionId: string;
  userId?: string;
  timestamp: Date;
  eventType: 'pageview' | 'click' | 'purchase' | 'signup' | 'search' | 'custom';
  eventName: string;
  eventCategory: string;
  eventData: Record<string, any>;
  value?: number;
  currency?: string;
  page: {
    url: string;
    title: string;
    referrer?: string;
  };
  user: {
    isNew: boolean;
    segment?: string;
    cohort?: string;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
  };
  location: {
    country?: string;
    city?: string;
    timezone?: string;
  };
}

export interface ConversionFunnel {
  id: string;
  name: string;
  steps: Array<{
    name: string;
    condition: {
      eventType: string;
      properties?: Record<string, any>;
    };
    conversionRate: number;
    dropOffRate: number;
    averageTime: number;
  }>;
  totalConversions: number;
  conversionRate: number;
}

export interface AnalyticsDashboardData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    pageViews: number;
    uniquePageViews: number;
    averageSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    revenue: number;
  };
  realTime: {
    activeUsers: number;
    pageViewsPerMinute: number;
    topPages: Array<{
      url: string;
      title: string;
      activeUsers: number;
    }>;
    recentEvents: AnalyticsEvent[];
    geographicDistribution: Record<string, number>;
  };
  userJourney: {
    commonPaths: Array<{
      path: string[];
      users: number;
      conversionRate: number;
    }>;
    entryPages: Array<{
      url: string;
      users: number;
      bounceRate: number;
    }>;
    exitPages: Array<{
      url: string;
      users: number;
      exitRate: number;
    }>;
  };
  conversionFunnels: ConversionFunnel[];
  performance: {
    averageLoadTime: number;
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
    };
    errorRate: number;
    apiResponseTimes: Record<string, number>;
  };
  demographics: {
    ageGroups: Record<string, number>;
    genders: Record<string, number>;
    interests: Record<string, number>;
    devices: Record<string, number>;
    browsers: Record<string, number>;
    operatingSystems: Record<string, number>;
  };
  ecommerce: {
    totalRevenue: number;
    averageOrderValue: number;
    transactionCount: number;
    topProducts: Array<{
      id: string;
      name: string;
      revenue: number;
      quantity: number;
    }>;
    abandonedCarts: number;
    checkoutFunnelData: ConversionFunnel;
  };
}

export interface HeatmapData {
  pageUrl: string;
  clickData: Array<{
    x: number;
    y: number;
    element: string;
    clicks: number;
  }>;
  scrollData: Array<{
    depth: number;
    percentage: number;
  }>;
  attentionData: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    duration: number;
  }>;
}

export interface PerformanceMetrics {
  timestamp: Date;
  metrics: {
    pageLoadTime: number;
    domContentLoaded: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
    timeToFirstByte: number;
  };
  resources: Array<{
    name: string;
    type: string;
    size: number;
    loadTime: number;
  }>;
  errors: Array<{
    message: string;
    source: string;
    line: number;
    column: number;
    stack?: string;
  }>;
}

class RealTimeAnalyticsService {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private currentSession: UserSession | null = null;
  private flushTimer: NodeJS.Timeout | null = null;
  private websocket: WebSocket | null = null;
  private performanceObserver: PerformanceObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.initializeSession();
    this.initializeRealTimeConnection();
    this.initializePerformanceMonitoring();
    this.initializeEventTracking();
    this.startBatchProcessing();
  }

  /**
   * Initialize user session tracking
   */
  private initializeSession(): void {
    if (typeof window === 'undefined') return;

    const sessionId = this.generateSessionId();
    const existingSession = localStorage.getItem('analytics-session');
    
    if (existingSession) {
      try {
        this.currentSession = JSON.parse(existingSession);
        if (this.currentSession) {
          this.currentSession.lastActivity = new Date();
          this.currentSession.pageViews++;
        }
      } catch (error) {
        console.error('Failed to parse existing session:', error);
        this.currentSession = null;
      }
    }

    if (!this.currentSession) {
      this.currentSession = {
        sessionId,
        startTime: new Date(),
        lastActivity: new Date(),
        pageViews: 1,
        duration: 0,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        location: {},
        device: this.getDeviceInfo(),
        conversionGoals: [],
        totalValue: 0
      };
    }

    this.updateSessionStorage();
    this.trackPageView();
  }

  /**
   * Initialize real-time WebSocket connection
   */
  private initializeRealTimeConnection(): void {
    if (!this.config.enableRealTime || typeof window === 'undefined') return;

    try {
      this.websocket = new WebSocket(this.config.realTimeEndpoint);
      
      this.websocket.onopen = () => {
        console.log('Real-time analytics connection established');
        this.sendHeartbeat();
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleRealTimeUpdate(data);
        } catch (error) {
          console.error('Failed to parse real-time data:', error);
        }
      };

      this.websocket.onclose = () => {
        console.log('Real-time analytics connection closed');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.initializeRealTimeConnection(), 5000);
      };

      this.websocket.onerror = (error) => {
        console.error('Real-time analytics connection error:', error);
      };

    } catch (error) {
      console.error('Failed to initialize real-time connection:', error);
    }
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (!this.config.enablePerformanceMonitoring || typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.trackPerformanceMetric(entry);
        });
      });

      try {
        this.performanceObserver.observe({ 
          entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] 
        });
      } catch (error) {
        console.warn('Performance monitoring not fully supported:', error);
      }
    }

    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        source: 'Promise',
        line: 0,
        column: 0
      });
    });
  }

  /**
   * Initialize automatic event tracking
   */
  private initializeEventTracking(): void {
    if (typeof window === 'undefined') return;

    // Track clicks
    document.addEventListener('click', (event) => {
      this.trackClick(event);
    }, true);

    // Track form submissions
    document.addEventListener('submit', (event) => {
      this.trackFormSubmission(event);
    }, true);

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        this.trackScrollDepth(scrollDepth);
      }
    });

    // Track time on page
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackTimeOnPage();
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackTimeOnPage();
      this.flushEvents();
    });
  }

  /**
   * Track custom event
   */
  trackEvent(
    eventName: string,
    eventCategory: string,
    eventData: Record<string, any> = {},
    value?: number
  ): void {
    const event: AnalyticsEvent = {
      eventId: this.generateEventId(),
      sessionId: this.currentSession?.sessionId || 'unknown',
      userId: this.currentSession?.userId,
      timestamp: new Date(),
      eventType: 'custom',
      eventName,
      eventCategory,
      eventData,
      value,
      page: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer
      },
      user: {
        isNew: this.isNewUser(),
        segment: this.getUserSegment(),
        cohort: this.getUserCohort()
      },
      device: this.getDeviceInfo(),
      location: this.getLocationInfo()
    };

    this.addToQueue(event);
  }

  /**
   * Track page view
   */
  trackPageView(customData?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      eventId: this.generateEventId(),
      sessionId: this.currentSession?.sessionId || 'unknown',
      userId: this.currentSession?.userId,
      timestamp: new Date(),
      eventType: 'pageview',
      eventName: 'page_view',
      eventCategory: 'navigation',
      eventData: {
        path: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        ...customData
      },
      page: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer
      },
      user: {
        isNew: this.isNewUser(),
        segment: this.getUserSegment(),
        cohort: this.getUserCohort()
      },
      device: this.getDeviceInfo(),
      location: this.getLocationInfo()
    };

    this.addToQueue(event);
  }

  /**
   * Track ecommerce purchase
   */
  trackPurchase(
    transactionId: string,
    items: Array<{
      productId: string;
      productName: string;
      category: string;
      quantity: number;
      price: number;
    }>,
    totalValue: number,
    currency: string = 'USD',
    additionalData?: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      eventId: this.generateEventId(),
      sessionId: this.currentSession?.sessionId || 'unknown',
      userId: this.currentSession?.userId,
      timestamp: new Date(),
      eventType: 'purchase',
      eventName: 'purchase',
      eventCategory: 'ecommerce',
      eventData: {
        transactionId,
        items,
        ...additionalData
      },
      value: totalValue,
      currency,
      page: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer
      },
      user: {
        isNew: this.isNewUser(),
        segment: this.getUserSegment(),
        cohort: this.getUserCohort()
      },
      device: this.getDeviceInfo(),
      location: this.getLocationInfo()
    };

    this.addToQueue(event);

    // Update session total value
    if (this.currentSession) {
      this.currentSession.totalValue += totalValue;
      this.currentSession.conversionGoals.push('purchase');
      this.updateSessionStorage();
    }
  }

  /**
   * Track conversion goal
   */
  trackConversion(goalName: string, goalValue?: number, additionalData?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      eventId: this.generateEventId(),
      sessionId: this.currentSession?.sessionId || 'unknown',
      userId: this.currentSession?.userId,
      timestamp: new Date(),
      eventType: 'custom',
      eventName: 'conversion',
      eventCategory: 'goals',
      eventData: {
        goalName,
        ...additionalData
      },
      value: goalValue,
      page: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer
      },
      user: {
        isNew: this.isNewUser(),
        segment: this.getUserSegment(),
        cohort: this.getUserCohort()
      },
      device: this.getDeviceInfo(),
      location: this.getLocationInfo()
    };

    this.addToQueue(event);

    // Update session conversion goals
    if (this.currentSession) {
      this.currentSession.conversionGoals.push(goalName);
      if (goalValue) {
        this.currentSession.totalValue += goalValue;
      }
      this.updateSessionStorage();
    }
  }

  /**
   * Get real-time dashboard data
   */
  async getDashboardData(timeframe: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<AnalyticsDashboardData> {
    try {
      const response = await fetch(`${this.config.apiUrl}/dashboard?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${this.config.trackingId}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      return this.getEmptyDashboardData();
    }
  }

  /**
   * Get heatmap data for a specific page
   */
  async getHeatmapData(pageUrl: string, timeframe: 'day' | 'week' | 'month' = 'week'): Promise<HeatmapData | null> {
    if (!this.config.enableHeatmaps) return null;

    try {
      const response = await fetch(`${this.config.apiUrl}/heatmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.trackingId}`
        },
        body: JSON.stringify({ pageUrl, timeframe })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch heatmap data: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
      return null;
    }
  }

  /**
   * Get user journey data
   */
  async getUserJourneyData(userId?: string): Promise<Array<{
    timestamp: Date;
    page: string;
    event: string;
    duration: number;
  }>> {
    if (!this.config.enableUserJourney) return [];

    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);

      const response = await fetch(`${this.config.apiUrl}/user-journey?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.config.trackingId}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user journey data: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Failed to fetch user journey data:', error);
      return [];
    }
  }

  /**
   * Create custom conversion funnel
   */
  async createConversionFunnel(
    name: string,
    steps: Array<{
      name: string;
      condition: {
        eventType: string;
        properties?: Record<string, any>;
      };
    }>
  ): Promise<string> {
    try {
      const response = await fetch(`${this.config.apiUrl}/conversion-funnel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.trackingId}`
        },
        body: JSON.stringify({ name, steps })
      });

      if (!response.ok) {
        throw new Error(`Failed to create conversion funnel: ${response.statusText}`);
      }

      const result = await response.json();
      return result.funnelId;

    } catch (error) {
      console.error('Failed to create conversion funnel:', error);
      return '';
    }
  }

  /**
   * Set user identifier
   */
  setUserId(userId: string): void {
    if (this.currentSession) {
      this.currentSession.userId = userId;
      this.updateSessionStorage();
    }

    this.trackEvent('user_identified', 'user', { userId });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>): void {
    this.trackEvent('user_properties', 'user', properties);
  }

  /**
   * Subscribe to real-time updates
   */
  subscribe(eventType: string, callback: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe(eventType: string, callback: Function): void {
    const listeners = this.eventListeners.get(eventType);
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
  private addToQueue(event: AnalyticsEvent): void {
    this.eventQueue.push(event);

    // Send to real-time endpoint if connected
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(event));
    }

    // Flush if queue is full
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flushEvents();
    }
  }

  private startBatchProcessing(): void {
    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, this.config.flushInterval);
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await fetch(`${this.config.apiUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.trackingId}`
        },
        body: JSON.stringify({ events })
      });

      if (!response.ok) {
        console.error('Failed to send analytics events:', response.statusText);
        // Re-add events to queue for retry
        this.eventQueue.unshift(...events);
      }

    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-add events to queue for retry
      this.eventQueue.unshift(...events);
    }
  }

  private trackClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target) return;

    const tagName = target.tagName.toLowerCase();
    const elementData: Record<string, any> = {
      tagName,
      className: target.className,
      id: target.id,
      text: target.textContent?.trim().substring(0, 100),
      href: (target as HTMLAnchorElement).href,
      x: event.clientX,
      y: event.clientY
    };

    this.trackEvent('click', 'interaction', elementData);
  }

  private trackFormSubmission(event: Event): void {
    const form = event.target as HTMLFormElement;
    if (!form) return;

    const formData: Record<string, any> = {
      formId: form.id,
      formName: form.name,
      action: form.action,
      method: form.method,
      fieldCount: form.elements.length
    };

    this.trackEvent('form_submit', 'interaction', formData);
  }

  private trackScrollDepth(depth: number): void {
    // Only track at 25%, 50%, 75%, and 100%
    if ([25, 50, 75, 100].includes(depth)) {
      this.trackEvent('scroll_depth', 'engagement', { depth });
    }
  }

  private trackTimeOnPage(): void {
    if (!this.currentSession) return;

    const timeOnPage = Date.now() - this.currentSession.lastActivity.getTime();
    this.trackEvent('time_on_page', 'engagement', { duration: timeOnPage });
  }

  private trackPerformanceMetric(entry: PerformanceEntry): void {
    const metricData: Record<string, any> = {
      entryType: entry.entryType,
      name: entry.name,
      startTime: entry.startTime,
      duration: entry.duration
    };

    // Add specific properties based on entry type
    if (entry.entryType === 'navigation') {
      const navEntry = entry as PerformanceNavigationTiming;
      metricData.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
      metricData.loadComplete = navEntry.loadEventEnd - navEntry.loadEventStart;
    }

    this.trackEvent('performance_metric', 'performance', metricData);
  }

  private trackError(error: {
    message: string;
    source: string;
    line: number;
    column: number;
    stack?: string;
  }): void {
    this.trackEvent('javascript_error', 'error', error);
  }

  private handleRealTimeUpdate(data: any): void {
    const listeners = this.eventListeners.get(data.type);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  private sendHeartbeat(): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      setInterval(() => {
        this.websocket!.send(JSON.stringify({ type: 'heartbeat', timestamp: new Date() }));
      }, 30000); // Send heartbeat every 30 seconds
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo(): UserSession['device'] {
    if (typeof window === 'undefined') {
      return { type: 'desktop', os: 'unknown', browser: 'unknown', screenResolution: 'unknown' };
    }

    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (screenWidth < 768) deviceType = 'mobile';
    else if (screenWidth < 1024) deviceType = 'tablet';

    return {
      type: deviceType,
      os: this.detectOS(userAgent),
      browser: this.detectBrowser(userAgent),
      screenResolution: `${window.screen.width}x${window.screen.height}`
    };
  }

  private detectOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private detectBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getLocationInfo(): AnalyticsEvent['location'] {
    // This would typically be enriched server-side with IP geolocation
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  private isNewUser(): boolean {
    return !localStorage.getItem('analytics-returning-user');
  }

  private getUserSegment(): string | undefined {
    return localStorage.getItem('user-segment') || undefined;
  }

  private getUserCohort(): string | undefined {
    return localStorage.getItem('user-cohort') || undefined;
  }

  private updateSessionStorage(): void {
    if (this.currentSession && typeof window !== 'undefined') {
      localStorage.setItem('analytics-session', JSON.stringify(this.currentSession));
      localStorage.setItem('analytics-returning-user', 'true');
    }
  }

  private getEmptyDashboardData(): AnalyticsDashboardData {
    return {
      overview: {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        pageViews: 0,
        uniquePageViews: 0,
        averageSessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0,
        revenue: 0
      },
      realTime: {
        activeUsers: 0,
        pageViewsPerMinute: 0,
        topPages: [],
        recentEvents: [],
        geographicDistribution: {}
      },
      userJourney: {
        commonPaths: [],
        entryPages: [],
        exitPages: []
      },
      conversionFunnels: [],
      performance: {
        averageLoadTime: 0,
        coreWebVitals: { lcp: 0, fid: 0, cls: 0 },
        errorRate: 0,
        apiResponseTimes: {}
      },
      demographics: {
        ageGroups: {},
        genders: {},
        interests: {},
        devices: {},
        browsers: {},
        operatingSystems: {}
      },
      ecommerce: {
        totalRevenue: 0,
        averageOrderValue: 0,
        transactionCount: 0,
        topProducts: [],
        abandonedCarts: 0,
        checkoutFunnelData: {
          id: '',
          name: '',
          steps: [],
          totalConversions: 0,
          conversionRate: 0
        }
      }
    };
  }

  /**
   * Cleanup and disconnect
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    if (this.websocket) {
      this.websocket.close();
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    this.flushEvents();
  }
}

export default RealTimeAnalyticsService;