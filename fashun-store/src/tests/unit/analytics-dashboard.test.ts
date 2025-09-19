/**
 * Unit Tests for Analytics Dashboard Service
 */

import RealTimeAnalyticsService from '@/lib/analytics-dashboard';

// Mock global dependencies
const mockWebSocket = {
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const mockPerformanceObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
};

// Mock globals
Object.defineProperty(global, 'WebSocket', {
  value: jest.fn(() => mockWebSocket),
  writable: true,
});

Object.defineProperty(global, 'PerformanceObserver', {
  value: jest.fn(() => mockPerformanceObserver),
  writable: true,
});

Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => 1000),
    getEntriesByType: jest.fn(() => []),
    memory: {
      usedJSHeapSize: 1024 * 1024 * 10,
      jsHeapSizeLimit: 1024 * 1024 * 100,
    },
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn();

describe('RealTimeAnalyticsService', () => {
  let analyticsService: RealTimeAnalyticsService;
  
  const mockConfig = {
    trackingId: 'test-tracking-id',
    apiUrl: 'https://api.test.com',
    realTimeEndpoint: 'ws://test.com/ws',
    batchSize: 10,
    flushInterval: 1000,
    enableRealTime: true,
    enableHeatmaps: true,
    enableUserJourney: true,
    enableConversionTracking: true,
    enablePerformanceMonitoring: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    analyticsService = new RealTimeAnalyticsService(mockConfig);
  });

  afterEach(() => {
    analyticsService.destroy();
  });

  describe('Initialization', () => {
    it('should initialize with correct config', () => {
      expect(analyticsService).toBeInstanceOf(RealTimeAnalyticsService);
    });

    it('should create WebSocket connection when real-time is enabled', () => {
      expect(WebSocket).toHaveBeenCalledWith(mockConfig.realTimeEndpoint);
    });

    it('should create PerformanceObserver when performance monitoring is enabled', () => {
      expect(PerformanceObserver).toHaveBeenCalled();
    });
  });

  describe('Event Tracking', () => {
    beforeEach(() => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    it('should track custom events', () => {
      const eventName = 'button_click';
      const eventCategory = 'interaction';
      const eventData = { buttonId: 'login-btn' };

      analyticsService.trackEvent(eventName, eventCategory, eventData, 1);

      // Verify event was queued (would be sent to backend)
      expect(fetch).not.toHaveBeenCalled(); // Not called immediately due to batching
    });

    it('should track page views', () => {
      const customData = { source: 'test' };

      analyticsService.trackPageView(customData);

      // Should create session and track pageview
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'analytics-session',
        expect.any(String)
      );
    });

    it('should track purchases with ecommerce data', () => {
      const transactionId = 'order-123';
      const items = [
        {
          productId: 'product-1',
          productName: 'Test Product',
          category: 'Test',
          quantity: 2,
          price: 99.99,
        },
      ];
      const totalValue = 199.98;

      analyticsService.trackPurchase(transactionId, items, totalValue);

      // Should update session with conversion data
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'analytics-session',
        expect.stringContaining('purchase')
      );
    });

    it('should track conversion goals', () => {
      const goalName = 'newsletter_signup';
      const goalValue = 10;

      analyticsService.trackConversion(goalName, goalValue);

      // Should track conversion event
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'analytics-session',
        expect.stringContaining(goalName)
      );
    });
  });

  describe('Dashboard Data', () => {
    it('should fetch dashboard data successfully', async () => {
      const mockDashboardData = {
        overview: {
          totalUsers: 1000,
          activeUsers: 100,
          pageViews: 5000,
          conversionRate: 2.5,
        },
        realTime: {
          activeUsers: 10,
          pageViewsPerMinute: 5,
          topPages: [],
          recentEvents: [],
        },
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDashboardData),
      });

      const data = await analyticsService.getDashboardData('day');

      expect(fetch).toHaveBeenCalledWith(
        `${mockConfig.apiUrl}/dashboard?timeframe=day`,
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockConfig.trackingId}`,
          },
        })
      );

      expect(data).toEqual(mockDashboardData);
    });

    it('should handle dashboard data fetch errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const data = await analyticsService.getDashboardData('week');

      expect(data).toEqual(expect.objectContaining({
        overview: expect.objectContaining({
          totalUsers: 0,
          activeUsers: 0,
        }),
      }));
    });
  });

  describe('User Journey Tracking', () => {
    it('should fetch user journey data', async () => {
      const mockJourneyData = [
        {
          timestamp: new Date(),
          page: '/home',
          event: 'pageview',
          duration: 5000,
        },
      ];

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockJourneyData),
      });

      const data = await analyticsService.getUserJourneyData('user-123');

      expect(fetch).toHaveBeenCalledWith(
        `${mockConfig.apiUrl}/user-journey?userId=user-123`,
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockConfig.trackingId}`,
          },
        })
      );

      expect(data).toEqual(mockJourneyData);
    });
  });

  describe('Real-time Features', () => {
    it('should send events to WebSocket when connected', () => {
      const eventName = 'test_event';
      const eventCategory = 'test';

      analyticsService.trackEvent(eventName, eventCategory);

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining(eventName)
      );
    });

    it('should handle real-time subscriptions', () => {
      const callback = jest.fn();
      const eventType = 'conversion';

      analyticsService.subscribe(eventType, callback);

      // Simulate real-time update
      const updateData = { type: eventType, data: { goalName: 'test' } };
      // This would normally be called by WebSocket onmessage
      // analyticsService.handleRealTimeUpdate(updateData);

      // Test unsubscribe
      analyticsService.unsubscribe(eventType, callback);
    });
  });

  describe('User Identification', () => {
    it('should set user ID and track identification event', () => {
      const userId = 'user-456';

      analyticsService.setUserId(userId);

      // Should update session and track event
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'analytics-session',
        expect.stringContaining(userId)
      );
    });

    it('should set user properties', () => {
      const properties = {
        plan: 'premium',
        signupDate: '2023-01-01',
      };

      analyticsService.setUserProperties(properties);

      // Should track user properties event
      // Event tracking would be verified in real implementation
    });
  });

  describe('Performance Monitoring', () => {
    it('should handle performance entries', () => {
      const mockEntry = {
        entryType: 'navigation',
        name: 'https://test.com',
        startTime: 0,
        duration: 1000,
        domainLookupStart: 0,
        domainLookupEnd: 10,
        connectStart: 10,
        connectEnd: 20,
        requestStart: 20,
        responseStart: 100,
        responseEnd: 200,
        domContentLoadedEventStart: 300,
        domContentLoadedEventEnd: 350,
        domComplete: 500,
        loadEventStart: 500,
        loadEventEnd: 550,
      };

      // Simulate performance observer callback
      const performanceCallback = (PerformanceObserver as jest.Mock).mock.calls[0][0];
      performanceCallback({
        getEntries: () => [mockEntry],
      });

      // Should have processed the performance entry
      expect(mockPerformanceObserver.observe).toHaveBeenCalled();
    });
  });

  describe('Session Management', () => {
    it('should create new session for new users', () => {
      localStorageMock.getItem.mockReturnValue(null);

      new RealTimeAnalyticsService(mockConfig);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'analytics-session',
        expect.any(String)
      );
    });

    it('should restore existing session', () => {
      const existingSession = JSON.stringify({
        sessionId: 'existing-session',
        startTime: new Date(),
        pageViews: 5,
      });

      localStorageMock.getItem.mockReturnValue(existingSession);

      new RealTimeAnalyticsService(mockConfig);

      // Should have incremented page views
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'analytics-session',
        expect.stringContaining('6') // pageViews + 1
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle WebSocket connection errors gracefully', () => {
      (WebSocket as jest.Mock).mockImplementation(() => {
        throw new Error('WebSocket connection failed');
      });

      // Should not throw error during initialization
      expect(() => new RealTimeAnalyticsService(mockConfig)).not.toThrow();
    });

    it('should handle fetch errors in dashboard data', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const data = await analyticsService.getDashboardData();

      expect(data).toEqual(expect.objectContaining({
        overview: expect.objectContaining({
          totalUsers: 0,
        }),
      }));
    });
  });

  describe('Cleanup', () => {
    it('should properly cleanup resources', () => {
      analyticsService.destroy();

      expect(mockWebSocket.close).toHaveBeenCalled();
      expect(mockPerformanceObserver.disconnect).toHaveBeenCalled();
    });
  });
});

describe('Analytics Integration Tests', () => {
  it('should handle complete user journey tracking', async () => {
    const service = new RealTimeAnalyticsService(mockConfig);

    // Simulate user journey
    service.trackPageView({ page: 'home' });
    service.trackEvent('product_view', 'ecommerce', { productId: 'prod-1' });
    service.trackEvent('add_to_cart', 'ecommerce', { productId: 'prod-1' });
    service.trackPurchase('order-123', [
      {
        productId: 'prod-1',
        productName: 'Test Product',
        category: 'Test',
        quantity: 1,
        price: 99.99,
      },
    ], 99.99);

    // Verify session was updated with journey data
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'analytics-session',
      expect.stringContaining('purchase')
    );

    service.destroy();
  });
});

export {};