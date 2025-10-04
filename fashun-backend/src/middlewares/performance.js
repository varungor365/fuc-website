'use strict';

/**
 * Performance optimization middleware
 * Caching, compression, and performance monitoring
 */

const compression = require('compression');
const sharp = require('sharp');
const NodeCache = require('node-cache');
const crypto = require('crypto');

// Initialize cache (in production, would use Redis)
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes default
  checkperiod: 60, // cleanup every minute
  maxKeys: 10000
});

module.exports = (config, { strapi }) => {
  return {
    // Response compression
    compression: compression({
      filter: (req, res) => {
        // Don't compress responses with this request header
        if (req.headers['x-no-compression']) {
          return false;
        }
        // fallback to standard filter function
        return compression.filter(req, res);
      },
      level: 6, // Compression level (1-9, 6 is good balance)
      threshold: 1024, // Only compress if response is larger than 1KB
      memLevel: 8
    }),

    // Response caching
    responseCache: async (ctx, next) => {
      try {
        // Only cache GET requests
        if (ctx.method !== 'GET') {
          await next();
          return;
        }

        // Skip caching for authenticated requests (unless specifically allowed)
        if (ctx.state.user && !shouldCacheAuthenticatedRequest(ctx)) {
          await next();
          return;
        }

        // Generate cache key
        const cacheKey = generateCacheKey(ctx);
        
        // Check cache
        const cached = cache.get(cacheKey);
        if (cached) {
          ctx.body = cached.body;
          ctx.status = cached.status;
          ctx.set(cached.headers);
          ctx.set('X-Cache', 'HIT');
          ctx.set('X-Cache-Key', cacheKey);
          return;
        }

        // Execute request
        await next();

        // Cache successful responses
        if (ctx.status === 200 && shouldCacheResponse(ctx)) {
          const ttl = getCacheTTL(ctx);
          cache.set(cacheKey, {
            body: ctx.body,
            status: ctx.status,
            headers: {
              'Content-Type': ctx.response.get('Content-Type'),
              'Last-Modified': ctx.response.get('Last-Modified') || new Date().toUTCString(),
              'ETag': ctx.response.get('ETag') || generateETag(ctx.body)
            }
          }, ttl);
          
          ctx.set('X-Cache', 'MISS');
          ctx.set('X-Cache-TTL', ttl.toString());
        }

      } catch (error) {
        strapi.log.error('Response cache error:', error);
        await next();
      }
    },

    // Database query optimization
    queryOptimization: async (ctx, next) => {
      const startTime = Date.now();
      
      // Override entity service methods to add performance monitoring
      const originalFind = strapi.entityService.findMany;
      const originalFindOne = strapi.entityService.findOne;
      const originalCreate = strapi.entityService.create;
      const originalUpdate = strapi.entityService.update;

      // Monitor findMany queries
      strapi.entityService.findMany = async function(uid, parameters) {
        const queryStart = Date.now();
        const result = await originalFind.call(this, uid, optimizeQuery(parameters));
        const queryTime = Date.now() - queryStart;
        
        logSlowQuery('findMany', uid, parameters, queryTime);
        return result;
      };

      // Monitor findOne queries  
      strapi.entityService.findOne = async function(uid, entityId, parameters) {
        const queryStart = Date.now();
        const result = await originalFindOne.call(this, uid, entityId, optimizeQuery(parameters));
        const queryTime = Date.now() - queryStart;
        
        logSlowQuery('findOne', uid, parameters, queryTime);
        return result;
      };

      try {
        await next();
      } finally {
        // Restore original methods
        strapi.entityService.findMany = originalFind;
        strapi.entityService.findOne = originalFindOne;
        
        const totalTime = Date.now() - startTime;
        if (totalTime > 5000) { // Log requests taking longer than 5 seconds
          strapi.log.warn('Slow request:', {
            method: ctx.method,
            url: ctx.url,
            duration: totalTime,
            requestId: ctx.requestId
          });
        }
      }
    },

    // Image optimization middleware
    imageOptimization: async (ctx, next) => {
      await next();

      // Check if response is an image
      const contentType = ctx.response.get('Content-Type');
      if (!contentType || !contentType.startsWith('image/')) {
        return;
      }

      try {
        const accepts = ctx.headers.accept || '';
        const userAgent = ctx.headers['user-agent'] || '';
        
        // Check if client supports WebP
        const supportsWebP = accepts.includes('image/webp');
        const isMobile = /mobile|android|iphone/i.test(userAgent);
        
        if (ctx.body && Buffer.isBuffer(ctx.body)) {
          const optimized = await optimizeImage(ctx.body, {
            webp: supportsWebP,
            mobile: isMobile,
            quality: 85
          });
          
          if (optimized.buffer.length < ctx.body.length) {
            ctx.body = optimized.buffer;
            ctx.set('Content-Type', optimized.contentType);
            ctx.set('X-Image-Optimized', 'true');
            ctx.set('X-Original-Size', ctx.body.length.toString());
            ctx.set('X-Optimized-Size', optimized.buffer.length.toString());
          }
        }
      } catch (error) {
        strapi.log.error('Image optimization error:', error);
        // Continue without optimization
      }
    },

    // ETag and conditional requests
    conditionalRequests: async (ctx, next) => {
      await next();

      // Only handle successful GET requests
      if (ctx.method !== 'GET' || ctx.status !== 200) {
        return;
      }

      // Generate ETag if not already set
      let etag = ctx.response.get('ETag');
      if (!etag && ctx.body) {
        etag = generateETag(ctx.body);
        ctx.set('ETag', etag);
      }

      // Set Last-Modified if not set
      if (!ctx.response.get('Last-Modified')) {
        ctx.set('Last-Modified', new Date().toUTCString());
      }

      // Handle If-None-Match (ETag)
      const ifNoneMatch = ctx.headers['if-none-match'];
      if (ifNoneMatch && etag && ifNoneMatch === etag) {
        ctx.status = 304;
        ctx.body = null;
        return;
      }

      // Handle If-Modified-Since
      const ifModifiedSince = ctx.headers['if-modified-since'];
      const lastModified = ctx.response.get('Last-Modified');
      if (ifModifiedSince && lastModified) {
        const modifiedDate = new Date(lastModified);
        const requestDate = new Date(ifModifiedSince);
        
        if (modifiedDate <= requestDate) {
          ctx.status = 304;
          ctx.body = null;
          return;
        }
      }
    },

    // Performance monitoring
    performanceMonitoring: async (ctx, next) => {
      const startTime = process.hrtime.bigint();
      const startMemory = process.memoryUsage();

      try {
        await next();
      } finally {
        const endTime = process.hrtime.bigint();
        const endMemory = process.memoryUsage();
        
        const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
        const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;
        
        // Add performance headers
        ctx.set('X-Response-Time', `${duration.toFixed(2)}ms`);
        ctx.set('X-Memory-Usage', `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
        
        // Log performance metrics
        const metrics = {
          method: ctx.method,
          url: ctx.url,
          status: ctx.status,
          duration: Math.round(duration),
          memoryDelta: Math.round(memoryDelta / 1024 / 1024), // MB
          timestamp: new Date().toISOString(),
          requestId: ctx.requestId
        };

        // Store metrics for monitoring (in production, would send to monitoring service)
        storeMetrics(metrics);
        
        // Log slow requests
        if (duration > 2000) {
          strapi.log.warn('Slow request detected:', metrics);
        }
        
        // Log high memory usage
        if (memoryDelta > 100 * 1024 * 1024) { // 100MB
          strapi.log.warn('High memory usage:', metrics);
        }
      }
    },

    // Connection pooling optimization
    connectionOptimization: async (ctx, next) => {
      // Set keep-alive headers for connection reuse
      ctx.set('Connection', 'keep-alive');
      ctx.set('Keep-Alive', 'timeout=5, max=1000');
      
      await next();
    },

    // CDN integration headers
    cdnHeaders: async (ctx, next) => {
      await next();

      // Set CDN-friendly headers for static assets
      const isStatic = /\.(jpg|jpeg|png|gif|webp|svg|css|js|woff|woff2|ttf|eot|ico)$/i.test(ctx.path);
      
      if (isStatic) {
        // Long cache for static assets
        ctx.set('Cache-Control', 'public, max-age=31536000, immutable');
        ctx.set('Expires', new Date(Date.now() + 31536000000).toUTCString());
      } else if (ctx.method === 'GET' && ctx.status === 200) {
        // Short cache for API responses
        ctx.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        ctx.set('Vary', 'Accept-Encoding, Authorization');
      }
    },

    // Prefetch optimization
    resourceHints: async (ctx, next) => {
      await next();

      // Add resource hints for better performance
      if (ctx.path === '/' || ctx.path.startsWith('/api/products')) {
        ctx.set('Link', [
          '</api/categories>; rel=prefetch',
          '</api/brands>; rel=prefetch',
          '<https://fonts.googleapis.com>; rel=preconnect',
          '<https://cdnjs.cloudflare.com>; rel=preconnect'
        ].join(', '));
      }
    }
  };
};

// Utility functions
function generateCacheKey(ctx) {
  const key = `${ctx.method}:${ctx.path}:${JSON.stringify(ctx.query)}`;
  return crypto.createHash('md5').update(key).digest('hex');
}

function shouldCacheAuthenticatedRequest(ctx) {
  // Cache public data even for authenticated users
  const publicPaths = [
    '/api/products',
    '/api/categories',
    '/api/brands',
    '/api/search'
  ];
  
  return publicPaths.some(path => ctx.path.startsWith(path));
}

function shouldCacheResponse(ctx) {
  // Don't cache errors or redirects
  if (ctx.status >= 300) return false;
  
  // Don't cache if no-cache header is set
  if (ctx.response.get('Cache-Control')?.includes('no-cache')) return false;
  
  // Cache GET requests for public endpoints
  const cachePaths = [
    '/api/products',
    '/api/categories', 
    '/api/brands',
    '/api/search/filters',
    '/api/search/popular'
  ];
  
  return cachePaths.some(path => ctx.path.startsWith(path));
}

function getCacheTTL(ctx) {
  // Different TTL for different endpoints
  if (ctx.path.startsWith('/api/products')) return 600; // 10 minutes
  if (ctx.path.startsWith('/api/categories')) return 1800; // 30 minutes
  if (ctx.path.startsWith('/api/brands')) return 3600; // 1 hour
  if (ctx.path.startsWith('/api/search/popular')) return 300; // 5 minutes
  
  return 300; // Default 5 minutes
}

function generateETag(body) {
  const content = typeof body === 'string' ? body : JSON.stringify(body);
  return `"${crypto.createHash('md5').update(content).digest('hex')}"`;
}

function optimizeQuery(parameters = {}) {
  // Optimize database queries
  const optimized = { ...parameters };
  
  // Limit pagination to reasonable defaults
  if (optimized.pagination) {
    optimized.pagination.pageSize = Math.min(
      optimized.pagination.pageSize || 25,
      100 // Maximum 100 items per page
    );
  }
  
  // Limit population depth
  if (optimized.populate && Array.isArray(optimized.populate)) {
    optimized.populate = optimized.populate.slice(0, 5); // Max 5 populate fields
  }
  
  // Add select fields for better performance
  if (!optimized.fields && !optimized.populate) {
    // Select only essential fields for list views
    optimized.fields = ['id', 'name', 'slug', 'price', 'createdAt', 'updatedAt'];
  }
  
  return optimized;
}

function logSlowQuery(method, uid, parameters, duration) {
  if (duration > 1000) { // Log queries taking longer than 1 second
    strapi.log.warn('Slow database query:', {
      method,
      uid,
      duration,
      parameters: JSON.stringify(parameters, null, 2)
    });
  }
}

async function optimizeImage(buffer, options = {}) {
  const { webp = false, mobile = false, quality = 85 } = options;
  
  let pipeline = sharp(buffer);
  
  // Resize for mobile if needed
  if (mobile) {
    pipeline = pipeline.resize(800, null, {
      withoutEnlargement: true,
      fit: 'inside'
    });
  }
  
  // Convert to WebP if supported
  if (webp) {
    pipeline = pipeline.webp({ quality });
    return {
      buffer: await pipeline.toBuffer(),
      contentType: 'image/webp'
    };
  }
  
  // Optimize JPEG/PNG
  const metadata = await sharp(buffer).metadata();
  if (metadata.format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality, progressive: true });
  } else if (metadata.format === 'png') {
    pipeline = pipeline.png({ quality, progressive: true });
  }
  
  return {
    buffer: await pipeline.toBuffer(),
    contentType: `image/${metadata.format}`
  };
}

function storeMetrics(metrics) {
  // In production, this would send to monitoring service (DataDog, New Relic, etc.)
  // For now, just store in memory for basic monitoring
  
  if (!global.performanceMetrics) {
    global.performanceMetrics = [];
  }
  
  global.performanceMetrics.push(metrics);
  
  // Keep only last 1000 metrics
  if (global.performanceMetrics.length > 1000) {
    global.performanceMetrics = global.performanceMetrics.slice(-1000);
  }
  
  // Log aggregated stats every 100 requests
  if (global.performanceMetrics.length % 100 === 0) {
    const recent = global.performanceMetrics.slice(-100);
    const avgDuration = recent.reduce((sum, m) => sum + m.duration, 0) / 100;
    const avgMemory = recent.reduce((sum, m) => sum + m.memoryDelta, 0) / 100;
    
    strapi.log.info('Performance stats (last 100 requests):', {
      averageDuration: Math.round(avgDuration),
      averageMemoryDelta: Math.round(avgMemory),
      slowRequests: recent.filter(m => m.duration > 2000).length
    });
  }
}