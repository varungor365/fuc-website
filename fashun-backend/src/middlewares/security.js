'use strict';

/**
 * Security middleware
 * Comprehensive security hardening for FASHUN.CO API
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const xss = require('xss');
const validator = require('validator');
const crypto = require('crypto');

module.exports = (config, { strapi }) => {
  return {
    // Helmet security headers
    helmet: helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }),

    // Rate limiting (disabled for development)
    rateLimiter: (req, res, next) => next(),

    // Speed limiter (disabled for development)
    speedLimiter: (req, res, next) => next(),

    // Search-specific rate limiting (disabled for development)
    searchRateLimiter: (req, res, next) => next(),

    // Authentication rate limiting (for login attempts)
    authRateLimiter: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per 15 minutes
      skipSuccessfulRequests: true,
      message: {
        error: 'Too many authentication attempts, please try again later.',
        code: 'AUTH_RATE_LIMIT_EXCEEDED'
      },
      keyGenerator: (req) => {
        return req.body?.identifier || req.ip;
      }
    }),

    // Input validation and sanitization
    inputValidator: async (ctx, next) => {
      try {
        // Sanitize query parameters
        if (ctx.query) {
          for (const [key, value] of Object.entries(ctx.query)) {
            if (typeof value === 'string') {
              // XSS protection
              ctx.query[key] = xss(value, {
                whiteList: {}, // No HTML tags allowed
                stripIgnoreTag: true,
                stripIgnoreTagBody: ['script']
              });

              // Length validation
              if (value.length > 1000) {
                return ctx.badRequest('Query parameter too long', {
                  parameter: key,
                  maxLength: 1000
                });
              }
            }
          }
        }

        // Sanitize request body
        if (ctx.request.body) {
          ctx.request.body = sanitizeObject(ctx.request.body);
        }

        await next();

      } catch (error) {
        strapi.log.error('Input validation error:', error);
        return ctx.badRequest('Invalid input data');
      }
    },

    // CSRF protection
    csrfProtection: async (ctx, next) => {
      try {
        // Skip CSRF for GET, HEAD, OPTIONS requests
        if (['GET', 'HEAD', 'OPTIONS'].includes(ctx.method)) {
          await next();
          return;
        }

        // Skip CSRF for API endpoints with Bearer token
        if (ctx.headers.authorization?.startsWith('Bearer ')) {
          await next();
          return;
        }

        const token = ctx.headers['x-csrf-token'] || ctx.request.body?._csrf;
        const sessionToken = ctx.session?.csrfToken;

        if (!token || !sessionToken || token !== sessionToken) {
          return ctx.forbidden('Invalid CSRF token', {
            code: 'CSRF_TOKEN_INVALID'
          });
        }

        await next();

      } catch (error) {
        strapi.log.error('CSRF protection error:', error);
        return ctx.forbidden('CSRF validation failed');
      }
    },

    // IP whitelist/blacklist
    ipFilter: async (ctx, next) => {
      try {
        const clientIP = getClientIP(ctx.request);
        
        // Check blacklist
        const blacklist = process.env.IP_BLACKLIST?.split(',') || [];
        if (blacklist.includes(clientIP)) {
          strapi.log.warn(`Blocked request from blacklisted IP: ${clientIP}`);
          return ctx.forbidden('Access denied', {
            code: 'IP_BLACKLISTED'
          });
        }

        // Check whitelist (if configured)
        const whitelist = process.env.IP_WHITELIST?.split(',');
        if (whitelist && whitelist.length > 0 && !whitelist.includes(clientIP)) {
          strapi.log.warn(`Blocked request from non-whitelisted IP: ${clientIP}`);
          return ctx.forbidden('Access denied', {
            code: 'IP_NOT_WHITELISTED'
          });
        }

        await next();

      } catch (error) {
        strapi.log.error('IP filter error:', error);
        await next(); // Continue on error to avoid breaking the app
      }
    },

    // Brute force protection
    bruteForceProtection: async (ctx, next) => {
      try {
        const key = `brute_force:${ctx.ip}`;
        const attempts = await getBruteForceAttempts(key);

        // Check if IP is temporarily blocked
        if (attempts.blocked) {
          const timeLeft = Math.ceil((attempts.blockedUntil - Date.now()) / 1000 / 60);
          return ctx.tooManyRequests(`IP temporarily blocked. Try again in ${timeLeft} minutes.`, {
            code: 'IP_TEMPORARILY_BLOCKED',
            blockedUntil: attempts.blockedUntil
          });
        }

        // Proceed with request
        await next();

        // Reset attempts on successful request
        if (ctx.status < 400) {
          await resetBruteForceAttempts(key);
        }

      } catch (error) {
        strapi.log.error('Brute force protection error:', error);
        await next(); // Continue on error
      }
    },

    // Request size limiting
    requestSizeLimit: async (ctx, next) => {
      try {
        const contentLength = parseInt(ctx.headers['content-length'] || '0');
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (contentLength > maxSize) {
          return ctx.payloadTooLarge('Request too large', {
            maxSize: maxSize,
            actualSize: contentLength
          });
        }

        await next();

      } catch (error) {
        strapi.log.error('Request size limit error:', error);
        await next();
      }
    },

    // Security headers
    securityHeaders: async (ctx, next) => {
      await next();

      // Add security headers
      ctx.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'X-Permitted-Cross-Domain-Policies': 'none'
      });

      // Remove server information
      ctx.remove('X-Powered-By');
      ctx.remove('Server');
    },

    // Request logging for security monitoring
    securityLogger: async (ctx, next) => {
      const startTime = Date.now();
      const requestId = generateRequestId();
      
      // Add request ID to context
      ctx.requestId = requestId;

      // Log suspicious requests
      const suspiciousPatterns = [
        /[<>'"]/g, // Potential XSS
        /(\bor\b|\band\b).*[=]/gi, // Potential SQL injection
        /(union|select|insert|update|delete|drop|create|alter)/gi, // SQL injection
        /\.\.\//g, // Path traversal
        /__proto__|constructor|prototype/gi // Prototype pollution
      ];

      const requestData = JSON.stringify({
        query: ctx.query,
        body: ctx.request.body
      });

      const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestData));

      if (isSuspicious) {
        strapi.log.warn('Suspicious request detected:', {
          requestId,
          ip: getClientIP(ctx.request),
          method: ctx.method,
          url: ctx.url,
          userAgent: ctx.headers['user-agent'],
          data: requestData
        });
      }

      try {
        await next();
      } catch (error) {
        // Log security-related errors
        if (error.status === 401 || error.status === 403 || error.status === 429) {
          strapi.log.warn('Security event:', {
            requestId,
            ip: getClientIP(ctx.request),
            method: ctx.method,
            url: ctx.url,
            status: error.status,
            error: error.message
          });
        }
        throw error;
      } finally {
        const duration = Date.now() - startTime;
        
        // Log slow requests (potential DoS)
        if (duration > 10000) { // 10 seconds
          strapi.log.warn('Slow request detected:', {
            requestId,
            ip: getClientIP(ctx.request),
            method: ctx.method,
            url: ctx.url,
            duration
          });
        }
      }
    }
  };
};

// Utility functions
function sanitizeObject(obj, maxDepth = 10, currentDepth = 0) {
  if (currentDepth >= maxDepth || obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, maxDepth, currentDepth + 1));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // XSS protection
      sanitized[key] = xss(value, {
        whiteList: {
          // Allow basic formatting tags for rich text fields
          b: [],
          i: [],
          em: [],
          strong: [],
          p: [],
          br: []
        },
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script', 'style']
      });

      // Length validation
      if (value.length > 10000) {
        sanitized[key] = value.substring(0, 10000);
      }
    } else {
      sanitized[key] = sanitizeObject(value, maxDepth, currentDepth + 1);
    }
  }

  return sanitized;
}

function getClientIP(request) {
  return request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         request.headers['x-real-ip'] ||
         request.connection.remoteAddress ||
         request.socket.remoteAddress ||
         (request.connection.socket ? request.connection.socket.remoteAddress : null) ||
         'unknown';
}

async function getBruteForceAttempts(key) {
  // In production, this would use Redis or database
  // For now, use in-memory storage (not recommended for production)
  const attempts = global.bruteForceAttempts = global.bruteForceAttempts || {};
  
  const record = attempts[key] || { count: 0, firstAttempt: Date.now() };
  
  // Check if blocked
  if (record.blockedUntil && record.blockedUntil > Date.now()) {
    return { blocked: true, blockedUntil: record.blockedUntil };
  }

  // Reset if window expired (1 hour)
  if (Date.now() - record.firstAttempt > 60 * 60 * 1000) {
    attempts[key] = { count: 0, firstAttempt: Date.now() };
    return { blocked: false };
  }

  return { blocked: false, count: record.count };
}

async function resetBruteForceAttempts(key) {
  const attempts = global.bruteForceAttempts = global.bruteForceAttempts || {};
  delete attempts[key];
}

async function incrementBruteForceAttempts(key) {
  const attempts = global.bruteForceAttempts = global.bruteForceAttempts || {};
  
  if (!attempts[key]) {
    attempts[key] = { count: 1, firstAttempt: Date.now() };
  } else {
    attempts[key].count++;
  }

  // Block after 10 failed attempts
  if (attempts[key].count >= 10) {
    attempts[key].blockedUntil = Date.now() + (30 * 60 * 1000); // Block for 30 minutes
  }
}

function generateRequestId() {
  return crypto.randomBytes(16).toString('hex');
}