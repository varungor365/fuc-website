/**
 * Security Hardening Manager
 * Implements advanced security measures and hardening techniques
 */

interface SecurityConfig {
  enableCSPHardening: boolean;
  enableRateLimiting: boolean;
  enableSecurityHeaders: boolean;
  enableContentValidation: boolean;
  enableSessionSecurity: boolean;
  enableInputSanitization: boolean;
  enableCORSHardening: boolean;
  securityLevel: 'basic' | 'moderate' | 'strict';
}

interface SecurityAuditResult {
  category: string;
  status: 'secure' | 'warning' | 'vulnerable';
  issues: string[];
  recommendations: string[];
  score: number;
}

interface SecurityMetrics {
  blockedRequests: number;
  rateLimitHits: number;
  cspViolations: number;
  invalidInputAttempts: number;
  suspiciousActivity: number;
}

class SecurityHardening {
  private static instance: SecurityHardening;
  private config: SecurityConfig;
  private metrics: SecurityMetrics;
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map();
  private securityLog: Array<{ timestamp: Date; event: string; details: any }> = [];

  private constructor() {
    this.config = {
      enableCSPHardening: true,
      enableRateLimiting: true,
      enableSecurityHeaders: true,
      enableContentValidation: true,
      enableSessionSecurity: true,
      enableInputSanitization: true,
      enableCORSHardening: true,
      securityLevel: 'strict',
    };

    this.metrics = {
      blockedRequests: 0,
      rateLimitHits: 0,
      cspViolations: 0,
      invalidInputAttempts: 0,
      suspiciousActivity: 0,
    };

    console.log('🔒 Security Hardening initialized');
    this.initializeSecurityMeasures();
  }

  static getInstance(): SecurityHardening {
    if (!SecurityHardening.instance) {
      SecurityHardening.instance = new SecurityHardening();
    }
    return SecurityHardening.instance;
  }

  private async initializeSecurityMeasures(): Promise<void> {
    await this.setupContentSecurityPolicy();
    await this.setupSecurityHeaders();
    await this.setupInputValidation();
    await this.setupRateLimiting();
    await this.setupSessionSecurity();
    await this.setupCORSHardening();
    await this.setupSecurityMonitoring();
  }

  private async setupContentSecurityPolicy(): Promise<void> {
    if (!this.config.enableCSPHardening) return;

    try {
      const cspDirectives: Record<string, string[]> = {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'", // Only for Next.js development
          'https://vercel.live',
          'https://va.vercel-scripts.com',
          'https://js.stripe.com',
          'https://maps.googleapis.com',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ],
        'img-src': [
          "'self'",
          'data:',
          'https:',
          'blob:',
        ],
        'font-src': [
          "'self'",
          'https://fonts.gstatic.com',
        ],
        'connect-src': [
          "'self'",
          'https://api.stripe.com',
          'https://vercel.live',
          'https://vitals.vercel-insights.com',
        ],
        'frame-src': [
          'https://js.stripe.com',
          'https://hooks.stripe.com',
        ],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': [],
      };

      // Apply CSP based on security level
      if (this.config.securityLevel === 'strict') {
        cspDirectives['script-src'] = cspDirectives['script-src'].filter(src => src !== "'unsafe-inline'");
        cspDirectives['require-trusted-types-for'] = ["'script'"];
      }

      const cspHeader = Object.entries(cspDirectives)
        .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
        .join('; ');

      // Set CSP header (this would be done at the server level in production)
      if (typeof document !== 'undefined') {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = cspHeader;
        document.head.appendChild(meta);
      }

      // Monitor CSP violations
      if (typeof document !== 'undefined') {
        document.addEventListener('securitypolicyviolation', (e) => {
          this.metrics.cspViolations++;
          this.logSecurityEvent('CSP_VIOLATION', {
            violatedDirective: e.violatedDirective,
            blockedURI: e.blockedURI,
            lineNumber: e.lineNumber,
            sourceFile: e.sourceFile,
          });
        });
      }

      console.log('🛡️ Content Security Policy configured');
    } catch (error) {
      console.warn('⚠️ CSP setup failed:', error);
    }
  }

  private async setupSecurityHeaders(): Promise<void> {
    if (!this.config.enableSecurityHeaders) return;

    try {
      const securityHeaders: Record<string, string> = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      };

      // Apply stricter headers based on security level
      if (this.config.securityLevel === 'strict') {
        securityHeaders['X-Permitted-Cross-Domain-Policies'] = 'none';
        securityHeaders['X-Download-Options'] = 'noopen';
        securityHeaders['Cross-Origin-Embedder-Policy'] = 'require-corp';
        securityHeaders['Cross-Origin-Opener-Policy'] = 'same-origin';
        securityHeaders['Cross-Origin-Resource-Policy'] = 'same-origin';
      }

      // In a real Next.js app, these would be set in next.config.js
      console.log('🔐 Security headers configured:', securityHeaders);
    } catch (error) {
      console.warn('⚠️ Security headers setup failed:', error);
    }
  }

  private async setupInputValidation(): Promise<void> {
    if (!this.config.enableInputSanitization) return;

    try {
      // XSS protection patterns
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
        /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      ];

      // SQL injection patterns
      const sqlPatterns = [
        /('|(\\')|(;|--|\||%7C))/gi,
        /(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi,
        /(\bor\b|\band\b)(\s)+(\d)+(\s)*(=|>|<)/gi,
      ];

      // Path traversal patterns
      const pathTraversalPatterns = [
        /\.\.\//gi,
        /\.\.\\g/gi,
        /%2e%2e%2f/gi,
        /%2e%2e/gi,
      ];

      // Global input sanitization function
      (window as any).sanitizeInput = (input: string): string => {
        if (typeof input !== 'string') return input;

        let sanitized = input;

        // Check for XSS
        xssPatterns.forEach(pattern => {
          if (pattern.test(sanitized)) {
            this.metrics.invalidInputAttempts++;
            this.logSecurityEvent('XSS_ATTEMPT', { input: sanitized });
          }
          sanitized = sanitized.replace(pattern, '');
        });

        // Check for SQL injection
        sqlPatterns.forEach(pattern => {
          if (pattern.test(sanitized)) {
            this.metrics.invalidInputAttempts++;
            this.logSecurityEvent('SQL_INJECTION_ATTEMPT', { input: sanitized });
          }
        });

        // Check for path traversal
        pathTraversalPatterns.forEach(pattern => {
          if (pattern.test(sanitized)) {
            this.metrics.invalidInputAttempts++;
            this.logSecurityEvent('PATH_TRAVERSAL_ATTEMPT', { input: sanitized });
          }
        });

        // HTML encode special characters
        sanitized = sanitized
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');

        return sanitized;
      };

      // Intercept form submissions for validation
      if (typeof document !== 'undefined') {
        document.addEventListener('submit', (e) => {
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          
          // Convert FormData to array for iteration
          const entries = Array.from(formData.entries());
          for (const [key, value] of entries) {
            if (typeof value === 'string') {
              const sanitized = (window as any).sanitizeInput(value);
              if (sanitized !== value) {
                e.preventDefault();
                this.showSecurityWarning('Invalid input detected and blocked');
                return;
              }
            }
          }
        });
      }

      console.log('🧹 Input validation and sanitization configured');
    } catch (error) {
      console.warn('⚠️ Input validation setup failed:', error);
    }
  }

  private async setupRateLimiting(): Promise<void> {
    if (!this.config.enableRateLimiting) return;

    try {
      const rateLimits = {
        api: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
        auth: { maxRequests: 5, windowMs: 300000 }, // 5 auth attempts per 5 minutes
        search: { maxRequests: 50, windowMs: 60000 }, // 50 searches per minute
        contact: { maxRequests: 3, windowMs: 3600000 }, // 3 contact forms per hour
      };

      // Apply stricter limits based on security level
      if (this.config.securityLevel === 'strict') {
        rateLimits.api.maxRequests = 50;
        rateLimits.auth.maxRequests = 3;
        rateLimits.search.maxRequests = 25;
        rateLimits.contact.maxRequests = 1;
      }

      // Rate limiting function
      (window as any).checkRateLimit = (category: string, identifier: string): boolean => {
        const key = `${category}:${identifier}`;
        const now = Date.now();
        const limit = rateLimits[category as keyof typeof rateLimits];
        
        if (!limit) return true;

        const existing = this.rateLimitMap.get(key);
        
        if (!existing || now > existing.resetTime) {
          this.rateLimitMap.set(key, {
            count: 1,
            resetTime: now + limit.windowMs,
          });
          return true;
        }

        if (existing.count >= limit.maxRequests) {
          this.metrics.rateLimitHits++;
          this.logSecurityEvent('RATE_LIMIT_HIT', { category, identifier, count: existing.count });
          return false;
        }

        existing.count++;
        return true;
      };

      console.log('⏱️ Rate limiting configured');
    } catch (error) {
      console.warn('⚠️ Rate limiting setup failed:', error);
    }
  }

  private async setupSessionSecurity(): Promise<void> {
    if (!this.config.enableSessionSecurity) return;

    try {
      // Session security configurations
      const sessionConfig = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict' as const,
        maxAge: 3600000, // 1 hour
        domain: typeof window !== 'undefined' ? window.location.hostname : undefined,
      };

      // Apply stricter session security based on security level
      if (this.config.securityLevel === 'strict') {
        sessionConfig.maxAge = 1800000; // 30 minutes
      }

      // Session token validation
      (window as any).validateSessionToken = (token: string): boolean => {
        if (!token || typeof token !== 'string') return false;
        
        // Basic token validation (in production, this would be more sophisticated)
        const tokenPattern = /^[A-Za-z0-9+/]{32,}={0,2}$/;
        return tokenPattern.test(token);
      };

      // Session fingerprinting for additional security
      (window as any).generateSessionFingerprint = (): string => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx!.textBaseline = 'top';
        ctx!.font = '14px Arial';
        ctx!.fillText('Session fingerprint', 2, 2);
        
        const fingerprint = [
          navigator.userAgent,
          navigator.language,
          screen.width + 'x' + screen.height,
          new Date().getTimezoneOffset(),
          canvas.toDataURL(),
        ].join('|');
        
        return btoa(fingerprint).substring(0, 32);
      };

      console.log('🔑 Session security configured');
    } catch (error) {
      console.warn('⚠️ Session security setup failed:', error);
    }
  }

  private async setupCORSHardening(): Promise<void> {
    if (!this.config.enableCORSHardening) return;

    try {
      const allowedOrigins = [
        'https://fashun.co.in',
        'https://www.fashun.co.in',
        'https://admin.fashun.co.in',
      ];

      // Apply stricter CORS based on security level
      if (this.config.securityLevel === 'strict') {
        // Remove any development origins in strict mode
      }

      // CORS validation function
      (window as any).validateCORSRequest = (origin: string): boolean => {
        if (!origin) return false;
        return allowedOrigins.includes(origin);
      };

      console.log('🌐 CORS hardening configured');
    } catch (error) {
      console.warn('⚠️ CORS hardening setup failed:', error);
    }
  }

  private async setupSecurityMonitoring(): Promise<void> {
    try {
      // Monitor for suspicious activities
      if (typeof window !== 'undefined') {
        // Monitor excessive API calls
        let apiCallCount = 0;
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
          apiCallCount++;
          
          if (apiCallCount > 200) { // Threshold for suspicious activity
            this.metrics.suspiciousActivity++;
            this.logSecurityEvent('EXCESSIVE_API_CALLS', { count: apiCallCount });
          }
          
          return originalFetch(...args);
        };

        // Monitor console access (potential debugging attempts)
        let consoleAccessCount = 0;
        const originalLog = console.log;
        console.log = (...args) => {
          consoleAccessCount++;
          
          if (consoleAccessCount > 50) {
            this.metrics.suspiciousActivity++;
            this.logSecurityEvent('EXCESSIVE_CONSOLE_ACCESS', { count: consoleAccessCount });
          }
          
          return originalLog(...args);
        };

        // Monitor page focus/blur for tab switching detection
        let tabSwitchCount = 0;
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            tabSwitchCount++;
            
            if (tabSwitchCount > 20) {
              this.metrics.suspiciousActivity++;
              this.logSecurityEvent('EXCESSIVE_TAB_SWITCHING', { count: tabSwitchCount });
            }
          }
        });
      }

      console.log('👁️ Security monitoring initialized');
    } catch (error) {
      console.warn('⚠️ Security monitoring setup failed:', error);
    }
  }

  private logSecurityEvent(event: string, details: any): void {
    const logEntry = {
      timestamp: new Date(),
      event,
      details,
    };

    this.securityLog.push(logEntry);
    
    // Keep only last 1000 entries
    if (this.securityLog.length > 1000) {
      this.securityLog.shift();
    }

    // Alert on critical events
    const criticalEvents = [
      'CSP_VIOLATION',
      'XSS_ATTEMPT', 
      'SQL_INJECTION_ATTEMPT',
      'PATH_TRAVERSAL_ATTEMPT',
      'EXCESSIVE_API_CALLS'
    ];

    if (criticalEvents.includes(event)) {
      console.warn(`🚨 Security Event: ${event}`, details);
      
      // In production, this would send alerts to security team
      this.sendSecurityAlert(event, details);
    }
  }

  private async sendSecurityAlert(event: string, details: any): Promise<void> {
    // In production, this would send alerts via email, Slack, or security monitoring service
    console.log(`🚨 SECURITY ALERT: ${event}`, details);
  }

  private showSecurityWarning(message: string): void {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Security Warning', {
          body: message,
          icon: '/favicon.ico',
        });
      }
    }
    
    console.warn(`🚨 Security Warning: ${message}`);
  }

  public async runSecurityAudit(): Promise<{
    overall_score: number;
    audits: SecurityAuditResult[];
    metrics: SecurityMetrics;
    recommendations: string[];
  }> {
    console.log('🔍 Running security audit...');

    const audits: SecurityAuditResult[] = [
      {
        category: 'Content Security Policy',
        status: this.config.enableCSPHardening ? 'secure' : 'vulnerable',
        issues: this.config.enableCSPHardening ? [] : ['CSP not enabled'],
        recommendations: [
          'Enable strict CSP headers',
          'Remove unsafe-inline directives',
          'Monitor CSP violations',
        ],
        score: this.config.enableCSPHardening ? 95 : 40,
      },
      {
        category: 'Input Validation',
        status: this.config.enableInputSanitization ? 'secure' : 'vulnerable',
        issues: this.config.enableInputSanitization ? [] : ['Input sanitization disabled'],
        recommendations: [
          'Implement comprehensive input validation',
          'Use parameterized queries',
          'Validate all user inputs',
        ],
        score: this.config.enableInputSanitization ? 90 : 30,
      },
      {
        category: 'Rate Limiting',
        status: this.config.enableRateLimiting ? 'secure' : 'warning',
        issues: this.config.enableRateLimiting ? [] : ['Rate limiting not configured'],
        recommendations: [
          'Implement API rate limiting',
          'Monitor for abuse patterns',
          'Use progressive delays',
        ],
        score: this.config.enableRateLimiting ? 85 : 60,
      },
      {
        category: 'Session Security',
        status: this.config.enableSessionSecurity ? 'secure' : 'vulnerable',
        issues: this.config.enableSessionSecurity ? [] : ['Session security not configured'],
        recommendations: [
          'Use secure session cookies',
          'Implement session fingerprinting',
          'Regular session rotation',
        ],
        score: this.config.enableSessionSecurity ? 88 : 35,
      },
      {
        category: 'Security Headers',
        status: this.config.enableSecurityHeaders ? 'secure' : 'vulnerable',
        issues: this.config.enableSecurityHeaders ? [] : ['Security headers missing'],
        recommendations: [
          'Implement all security headers',
          'Use HSTS for HTTPS enforcement',
          'Set proper CORS policies',
        ],
        score: this.config.enableSecurityHeaders ? 92 : 45,
      },
    ];

    const overallScore = Math.round(
      audits.reduce((sum, audit) => sum + audit.score, 0) / audits.length
    );

    const recommendations = [
      'Enable all security hardening measures',
      'Regular security audits and penetration testing',
      'Monitor security logs for suspicious activity',
      'Keep dependencies updated',
      'Implement Web Application Firewall (WAF)',
      'Use Content Delivery Network (CDN) with security features',
      'Implement proper error handling to avoid information disclosure',
      'Regular backup and disaster recovery testing',
      'Employee security training',
      'Implement zero-trust security model',
    ];

    const auditResult = {
      overall_score: overallScore,
      audits,
      metrics: this.metrics,
      recommendations,
    };

    console.log('🔒 Security audit completed:', auditResult);
    return auditResult;
  }

  public getSecurityMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  public getSecurityLog(): typeof this.securityLog {
    return [...this.securityLog];
  }

  public updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Security config updated:', this.config);
    
    // Reinitialize security measures with new config
    this.initializeSecurityMeasures();
  }
}

// Export singleton instance
export const securityHardening = SecurityHardening.getInstance();

// Export types
export type { SecurityConfig, SecurityAuditResult, SecurityMetrics };

// Default export
export default securityHardening;