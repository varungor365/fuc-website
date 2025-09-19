/**
 * Advanced CDN Optimization Service
 * Provides intelligent content delivery, caching strategies, and global performance optimization
 */

export interface CDNConfig {
  provider: 'cloudflare' | 'aws_cloudfront' | 'fastly' | 'custom';
  endpoints: {
    primary: string;
    fallback: string[];
    regions: Record<string, string>;
  };
  caching: {
    defaultTTL: number;
    maxTTL: number;
    rules: CacheRule[];
  };
  optimization: {
    compression: boolean;
    imageOptimization: boolean;
    minification: boolean;
    brotliCompression: boolean;
  };
  security: {
    ddosProtection: boolean;
    wafEnabled: boolean;
    rateLimiting: boolean;
    hotlinkProtection: boolean;
  };
}

export interface CacheRule {
  pattern: string;
  contentType: string[];
  ttl: number;
  purgeOnUpdate: boolean;
  varyHeaders: string[];
  conditions: {
    userAgent?: string[];
    geography?: string[];
    timeOfDay?: { start: number; end: number };
  };
}

export interface CDNPerformanceMetrics {
  cacheHitRatio: number;
  averageResponseTime: number;
  bandwidthSaved: number;
  requestsServed: number;
  edgeLocations: number;
  globalLatency: Record<string, number>;
  errorRate: number;
  purgeOperations: number;
}

export interface ContentOptimization {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  format: string;
  quality: number;
  transformations: string[];
  cacheKey: string;
  metadata: Record<string, any>;
}

export interface CDNAnalytics {
  timeframe: 'hour' | 'day' | 'week' | 'month';
  performance: CDNPerformanceMetrics;
  topContent: Array<{ url: string; requests: number; bandwidth: number }>;
  geoDistribution: Record<string, { requests: number; bandwidth: number }>;
  userAgentDistribution: Record<string, number>;
  errorAnalysis: {
    statusCodes: Record<string, number>;
    errorsByRegion: Record<string, number>;
    errorTrends: Array<{ timestamp: Date; errors: number }>;
  };
}

export interface PurgeRequest {
  urls?: string[];
  tags?: string[];
  patterns?: string[];
  wildcard?: boolean;
  instant?: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface EdgeFunction {
  name: string;
  code: string;
  triggers: {
    events: ('request' | 'response' | 'fetch')[];
    patterns: string[];
    conditions: Record<string, any>;
  };
  resources: {
    memory: number;
    timeout: number;
    kvNamespaces?: string[];
  };
}

class CDNOptimizationService {
  private config: CDNConfig;
  private baseUrl = '/api/cdn';
  private performanceCache: Map<string, CDNPerformanceMetrics> = new Map();
  private edgeFunctions: Map<string, EdgeFunction> = new Map();
  private cacheInvalidationQueue: PurgeRequest[] = [];

  constructor(config?: Partial<CDNConfig>) {
    this.config = {
      provider: 'cloudflare',
      endpoints: {
        primary: 'https://cdn.fashun.co',
        fallback: ['https://cdn2.fashun.co', 'https://static.fashun.co'],
        regions: {
          'us-east': 'https://us-east.cdn.fashun.co',
          'us-west': 'https://us-west.cdn.fashun.co',
          'eu': 'https://eu.cdn.fashun.co',
          'asia': 'https://asia.cdn.fashun.co'
        }
      },
      caching: {
        defaultTTL: 3600, // 1 hour
        maxTTL: 31536000, // 1 year
        rules: []
      },
      optimization: {
        compression: true,
        imageOptimization: true,
        minification: true,
        brotliCompression: true
      },
      security: {
        ddosProtection: true,
        wafEnabled: true,
        rateLimiting: true,
        hotlinkProtection: true
      },
      ...config
    };

    this.initializeDefaultCacheRules();
    this.startPerformanceMonitoring();
  }

  /**
   * Optimize content delivery for a specific URL
   */
  async optimizeContent(
    url: string,
    options?: {
      priority?: 'low' | 'medium' | 'high';
      format?: 'webp' | 'avif' | 'auto';
      quality?: number;
      resize?: { width?: number; height?: number; fit?: 'contain' | 'cover' | 'fill' };
      cache?: { ttl?: number; tags?: string[] };
    }
  ): Promise<{
    optimizedUrl: string;
    optimization: ContentOptimization;
    cacheStatus: 'hit' | 'miss' | 'stale';
    region: string;
  }> {
    try {
      const optimizationParams = this.buildOptimizationParams(options);
      
      // Check if content is already optimized and cached
      const cacheKey = this.generateCacheKey(url, optimizationParams);
      const cached = await this.getCachedContent(cacheKey);
      
      if (cached) {
        return {
          optimizedUrl: cached.url,
          optimization: cached.optimization,
          cacheStatus: 'hit',
          region: cached.region
        };
      }

      // Optimize content
      const response = await fetch(`${this.baseUrl}/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          params: optimizationParams,
          cacheKey
        })
      });

      if (!response.ok) {
        throw new Error(`CDN optimization failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Cache the optimized content
      await this.cacheOptimizedContent(cacheKey, result, options?.cache);

      return {
        optimizedUrl: result.url,
        optimization: result.optimization,
        cacheStatus: 'miss',
        region: result.region || 'auto'
      };

    } catch (error) {
      console.error('Content optimization failed:', error);
      
      // Fallback to original URL
      return {
        optimizedUrl: url,
        optimization: {
          originalSize: 0,
          optimizedSize: 0,
          compressionRatio: 1,
          format: 'original',
          quality: 100,
          transformations: [],
          cacheKey: '',
          metadata: {}
        },
        cacheStatus: 'miss',
        region: 'fallback'
      };
    }
  }

  /**
   * Intelligent cache warming
   */
  async warmCache(
    urls: string[],
    priority: 'low' | 'medium' | 'high' = 'medium',
    regions?: string[]
  ): Promise<{
    successful: number;
    failed: number;
    results: Array<{
      url: string;
      status: 'success' | 'failed';
      region: string;
      responseTime: number;
    }>;
  }> {
    try {
      const warmingRequests = urls.map(url => ({
        url,
        priority,
        regions: regions || Object.keys(this.config.endpoints.regions)
      }));

      const response = await fetch(`${this.baseUrl}/warm-cache`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: warmingRequests,
          batchSize: 50 // Process in batches
        })
      });

      if (!response.ok) {
        throw new Error(`Cache warming failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        successful: result.results.filter((r: any) => r.status === 'success').length,
        failed: result.results.filter((r: any) => r.status === 'failed').length,
        results: result.results
      };

    } catch (error) {
      console.error('Cache warming failed:', error);
      return {
        successful: 0,
        failed: urls.length,
        results: urls.map(url => ({
          url,
          status: 'failed' as const,
          region: 'unknown',
          responseTime: 0
        }))
      };
    }
  }

  /**
   * Smart cache purging with strategies
   */
  async purgeCache(request: PurgeRequest): Promise<{
    success: boolean;
    purgedItems: number;
    regions: string[];
    estimatedPropagationTime: number;
  }> {
    try {
      // Add to purge queue for batch processing
      this.cacheInvalidationQueue.push(request);

      // Process immediately for high priority requests
      if (request.priority === 'critical' || request.priority === 'high') {
        return await this.processPurgeRequest(request);
      }

      // Schedule batch processing for lower priority requests
      this.scheduleBatchPurge();

      return {
        success: true,
        purgedItems: this.estimatePurgeCount(request),
        regions: Object.keys(this.config.endpoints.regions),
        estimatedPropagationTime: this.estimatePropagationTime(request.priority)
      };

    } catch (error) {
      console.error('Cache purge failed:', error);
      return {
        success: false,
        purgedItems: 0,
        regions: [],
        estimatedPropagationTime: 0
      };
    }
  }

  /**
   * Deploy edge function for dynamic content processing
   */
  async deployEdgeFunction(edgeFunction: EdgeFunction): Promise<{
    success: boolean;
    deploymentId: string;
    regions: string[];
    coldStartTime: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/edge-function`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(edgeFunction)
      });

      if (!response.ok) {
        throw new Error(`Edge function deployment failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Store function locally for management
      this.edgeFunctions.set(edgeFunction.name, edgeFunction);

      return {
        success: true,
        deploymentId: result.deploymentId,
        regions: result.regions,
        coldStartTime: result.coldStartTime
      };

    } catch (error) {
      console.error('Edge function deployment failed:', error);
      return {
        success: false,
        deploymentId: '',
        regions: [],
        coldStartTime: 0
      };
    }
  }

  /**
   * Get CDN performance analytics
   */
  async getPerformanceAnalytics(
    timeframe: 'hour' | 'day' | 'week' | 'month' = 'day',
    regions?: string[]
  ): Promise<CDNAnalytics> {
    try {
      const response = await fetch(
        `${this.baseUrl}/analytics?timeframe=${timeframe}&regions=${regions?.join(',') || 'all'}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch CDN analytics: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Failed to fetch CDN analytics:', error);
      
      // Return empty analytics
      return {
        timeframe,
        performance: {
          cacheHitRatio: 0,
          averageResponseTime: 0,
          bandwidthSaved: 0,
          requestsServed: 0,
          edgeLocations: 0,
          globalLatency: {},
          errorRate: 0,
          purgeOperations: 0
        },
        topContent: [],
        geoDistribution: {},
        userAgentDistribution: {},
        errorAnalysis: {
          statusCodes: {},
          errorsByRegion: {},
          errorTrends: []
        }
      };
    }
  }

  /**
   * Optimize images with intelligent format selection
   */
  async optimizeImage(
    imageUrl: string,
    options?: {
      quality?: number;
      format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
      resize?: {
        width?: number;
        height?: number;
        fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
      };
      effects?: {
        blur?: number;
        sharpen?: number;
        brightness?: number;
        contrast?: number;
      };
    }
  ): Promise<{
    optimizedUrl: string;
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    format: string;
    dimensions: { width: number; height: number };
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: imageUrl,
          options: {
            quality: options?.quality || 85,
            format: options?.format || 'auto',
            resize: options?.resize,
            effects: options?.effects
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Image optimization failed: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Image optimization failed:', error);
      
      // Return original image
      return {
        optimizedUrl: imageUrl,
        originalSize: 0,
        optimizedSize: 0,
        compressionRatio: 1,
        format: 'original',
        dimensions: { width: 0, height: 0 }
      };
    }
  }

  /**
   * Implement smart preloading based on user behavior
   */
  async implementSmartPreloading(
    userBehavior: {
      currentPage: string;
      scrollPosition: number;
      timeOnPage: number;
      previousPages: string[];
      deviceType: 'mobile' | 'tablet' | 'desktop';
      connectionSpeed: 'slow' | 'medium' | 'fast';
    }
  ): Promise<{
    recommendations: Array<{
      url: string;
      priority: 'low' | 'medium' | 'high';
      reason: string;
      prefetchType: 'dns' | 'preconnect' | 'preload' | 'prefetch';
    }>;
    bandwidth: {
      available: number;
      reserved: number;
      used: number;
    };
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/smart-preload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          behavior: userBehavior,
          config: {
            aggressiveness: this.getPreloadAggressiveness(userBehavior.connectionSpeed),
            maxConcurrent: this.getMaxConcurrentPreloads(userBehavior.deviceType),
            bandwidth: {
              limit: this.getBandwidthLimit(userBehavior.connectionSpeed),
              reserved: 0.3 // Reserve 30% for user interactions
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Smart preloading failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Execute preloading recommendations
      this.executePreloadingRecommendations(result.recommendations);

      return result;

    } catch (error) {
      console.error('Smart preloading failed:', error);
      return {
        recommendations: [],
        bandwidth: {
          available: 0,
          reserved: 0,
          used: 0
        }
      };
    }
  }

  /**
   * Configure adaptive bitrate streaming for videos
   */
  async configureAdaptiveStreaming(
    videoUrl: string,
    options?: {
      qualities?: Array<{
        resolution: string;
        bitrate: number;
        codecs: string[];
      }>;
      format?: 'hls' | 'dash' | 'smooth';
      thumbnails?: {
        interval: number;
        width: number;
        height: number;
      };
    }
  ): Promise<{
    manifestUrl: string;
    qualities: Array<{
      resolution: string;
      bitrate: number;
      url: string;
    }>;
    thumbnailsUrl?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/adaptive-streaming`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoUrl,
          options: {
            qualities: options?.qualities || [
              { resolution: '240p', bitrate: 400000, codecs: ['avc1.42E01E', 'mp4a.40.2'] },
              { resolution: '480p', bitrate: 1000000, codecs: ['avc1.42E01E', 'mp4a.40.2'] },
              { resolution: '720p', bitrate: 2500000, codecs: ['avc1.64001F', 'mp4a.40.2'] },
              { resolution: '1080p', bitrate: 5000000, codecs: ['avc1.640028', 'mp4a.40.2'] }
            ],
            format: options?.format || 'hls',
            thumbnails: options?.thumbnails || {
              interval: 10,
              width: 160,
              height: 90
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Adaptive streaming configuration failed: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Adaptive streaming configuration failed:', error);
      return {
        manifestUrl: videoUrl,
        qualities: [],
        thumbnailsUrl: undefined
      };
    }
  }

  /**
   * Private helper methods
   */
  private buildOptimizationParams(options?: any): Record<string, any> {
    return {
      format: options?.format || 'auto',
      quality: options?.quality || 85,
      resize: options?.resize,
      cache: {
        ttl: options?.cache?.ttl || this.config.caching.defaultTTL,
        tags: options?.cache?.tags || []
      },
      compression: this.config.optimization.compression,
      minification: this.config.optimization.minification
    };
  }

  private generateCacheKey(url: string, params: Record<string, any>): string {
    const paramsString = JSON.stringify(params);
    const hash = require('crypto').createHash('md5').update(url + paramsString).digest('hex');
    return `opt_${hash}`;
  }

  private async getCachedContent(cacheKey: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/cache/${cacheKey}`);
      return response.ok ? await response.json() : null;
    } catch {
      return null;
    }
  }

  private async cacheOptimizedContent(
    cacheKey: string,
    content: any,
    cacheOptions?: { ttl?: number; tags?: string[] }
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/cache/${cacheKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `max-age=${cacheOptions?.ttl || this.config.caching.defaultTTL}`,
          'Cache-Tags': cacheOptions?.tags?.join(',') || ''
        },
        body: JSON.stringify(content)
      });
    } catch (error) {
      console.error('Failed to cache optimized content:', error);
    }
  }

  private async processPurgeRequest(request: PurgeRequest): Promise<any> {
    const response = await fetch(`${this.baseUrl}/purge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Purge request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  private scheduleBatchPurge(): void {
    // Batch process purge requests every 30 seconds
    setTimeout(async () => {
      if (this.cacheInvalidationQueue.length > 0) {
        const batch = this.cacheInvalidationQueue.splice(0, 100); // Process 100 at a time
        
        try {
          await fetch(`${this.baseUrl}/batch-purge`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requests: batch })
          });
        } catch (error) {
          console.error('Batch purge failed:', error);
        }
      }
    }, 30000);
  }

  private estimatePurgeCount(request: PurgeRequest): number {
    if (request.urls) return request.urls.length;
    if (request.tags) return request.tags.length * 50; // Estimate
    if (request.patterns) return request.patterns.length * 100; // Estimate
    return 1;
  }

  private estimatePropagationTime(priority: string): number {
    switch (priority) {
      case 'critical': return 5000; // 5 seconds
      case 'high': return 30000; // 30 seconds
      case 'medium': return 120000; // 2 minutes
      case 'low': return 300000; // 5 minutes
      default: return 120000;
    }
  }

  private getPreloadAggressiveness(connectionSpeed: string): 'conservative' | 'moderate' | 'aggressive' {
    switch (connectionSpeed) {
      case 'fast': return 'aggressive';
      case 'medium': return 'moderate';
      case 'slow': return 'conservative';
      default: return 'moderate';
    }
  }

  private getMaxConcurrentPreloads(deviceType: string): number {
    switch (deviceType) {
      case 'desktop': return 6;
      case 'tablet': return 4;
      case 'mobile': return 2;
      default: return 4;
    }
  }

  private getBandwidthLimit(connectionSpeed: string): number {
    switch (connectionSpeed) {
      case 'fast': return 10000000; // 10 Mbps
      case 'medium': return 5000000; // 5 Mbps
      case 'slow': return 1000000; // 1 Mbps
      default: return 5000000;
    }
  }

  private async executePreloadingRecommendations(
    recommendations: Array<{
      url: string;
      priority: string;
      prefetchType: string;
    }>
  ): Promise<void> {
    for (const rec of recommendations) {
      try {
        switch (rec.prefetchType) {
          case 'dns':
            this.prefetchDNS(rec.url);
            break;
          case 'preconnect':
            this.preconnect(rec.url);
            break;
          case 'preload':
            this.preload(rec.url);
            break;
          case 'prefetch':
            this.prefetch(rec.url);
            break;
        }
      } catch (error) {
        console.error(`Failed to execute preload for ${rec.url}:`, error);
      }
    }
  }

  private prefetchDNS(url: string): void {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = new URL(url).origin;
    document.head.appendChild(link);
  }

  private preconnect(url: string): void {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = new URL(url).origin;
    document.head.appendChild(link);
  }

  private preload(url: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = this.getResourceType(url);
    document.head.appendChild(link);
  }

  private prefetch(url: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'css': return 'style';
      case 'js': return 'script';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg': return 'image';
      case 'woff':
      case 'woff2':
      case 'ttf':
      case 'eot': return 'font';
      case 'mp4':
      case 'webm':
      case 'ogg': return 'video';
      case 'mp3':
      case 'wav':
      case 'ogg': return 'audio';
      default: return 'fetch';
    }
  }

  private initializeDefaultCacheRules(): void {
    this.config.caching.rules = [
      {
        pattern: '*.css',
        contentType: ['text/css'],
        ttl: 86400, // 1 day
        purgeOnUpdate: true,
        varyHeaders: ['Accept-Encoding'],
        conditions: {}
      },
      {
        pattern: '*.js',
        contentType: ['application/javascript'],
        ttl: 86400, // 1 day
        purgeOnUpdate: true,
        varyHeaders: ['Accept-Encoding'],
        conditions: {}
      },
      {
        pattern: '*.{jpg,jpeg,png,gif,webp,svg}',
        contentType: ['image/*'],
        ttl: 604800, // 1 week
        purgeOnUpdate: false,
        varyHeaders: ['Accept'],
        conditions: {}
      },
      {
        pattern: '*.{woff,woff2,ttf,eot}',
        contentType: ['font/*'],
        ttl: 2592000, // 30 days
        purgeOnUpdate: false,
        varyHeaders: [],
        conditions: {}
      },
      {
        pattern: '/api/*',
        contentType: ['application/json'],
        ttl: 300, // 5 minutes
        purgeOnUpdate: true,
        varyHeaders: ['Authorization', 'Accept'],
        conditions: {}
      }
    ];
  }

  private startPerformanceMonitoring(): void {
    setInterval(async () => {
      try {
        const analytics = await this.getPerformanceAnalytics('hour');
        this.performanceCache.set('latest', analytics.performance);
        
        // Auto-optimize based on performance metrics
        await this.autoOptimizeBasedOnMetrics(analytics);
      } catch (error) {
        console.error('Performance monitoring failed:', error);
      }
    }, 300000); // Every 5 minutes
  }

  private async autoOptimizeBasedOnMetrics(analytics: CDNAnalytics): Promise<void> {
    // Auto-scale cache TTL based on hit ratio
    if (analytics.performance.cacheHitRatio < 0.8) {
      // Increase cache TTL for better hit ratios
      this.adjustCacheTTL('increase');
    } else if (analytics.performance.cacheHitRatio > 0.95) {
      // Decrease cache TTL to ensure freshness
      this.adjustCacheTTL('decrease');
    }

    // Auto-purge slow-performing content
    if (analytics.performance.averageResponseTime > 1000) {
      const slowContent = analytics.topContent
        .filter(content => content.requests > 100)
        .slice(0, 10); // Top 10 slow content items

      if (slowContent.length > 0) {
        await this.purgeCache({
          urls: slowContent.map(c => c.url),
          priority: 'medium'
        });
      }
    }
  }

  private adjustCacheTTL(direction: 'increase' | 'decrease'): void {
    const multiplier = direction === 'increase' ? 1.2 : 0.8;
    
    this.config.caching.rules.forEach(rule => {
      rule.ttl = Math.min(
        Math.max(rule.ttl * multiplier, 300), // Min 5 minutes
        this.config.caching.maxTTL // Max 1 year
      );
    });
  }
}

export default CDNOptimizationService;