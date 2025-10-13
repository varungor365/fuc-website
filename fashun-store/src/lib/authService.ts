import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { ApiKeyService } from './apiKeyService'

export interface JWTPayload {
  userId: string
  role: 'admin' | 'user'
  email?: string
  exp: number
  iat: number
}

export interface AuthResult {
  isValid: boolean
  payload?: JWTPayload
  error?: string
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'development-jwt-secret-key'
  private static readonly TOKEN_EXPIRY = '24h'
  private static readonly RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
  private static readonly RATE_LIMIT_MAX_REQUESTS = 100
  
  // In-memory rate limiting (should use Redis in production)
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>()

  /**
   * Generate JWT token for authenticated user
   */
  static generateToken(userId: string, role: 'admin' | 'user', email?: string): string {
    const payload: Omit<JWTPayload, 'exp' | 'iat'> = {
      userId,
      role,
      email
    }

    return jwt.sign(payload, this.JWT_SECRET, { 
      expiresIn: this.TOKEN_EXPIRY,
      issuer: 'fashun-platform',
      audience: 'fashun-admin'
    })
  }

  /**
   * Verify and decode JWT token
   */
  static verifyToken(token: string): AuthResult {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        issuer: 'fashun-platform',
        audience: 'fashun-admin'
      }) as JWTPayload

      // Additional expiry check (jwt.verify should handle this, but being explicit)
      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        return {
          isValid: false,
          error: 'Token expired'
        }
      }

      return {
        isValid: true,
        payload: decoded
      }
    } catch (error) {
      let errorMessage = 'Invalid token'
      
      if (error instanceof jwt.TokenExpiredError) {
        errorMessage = 'Token expired'
      } else if (error instanceof jwt.JsonWebTokenError) {
        errorMessage = 'Malformed token'
      } else if (error instanceof jwt.NotBeforeError) {
        errorMessage = 'Token not active yet'
      }

      return {
        isValid: false,
        error: errorMessage
      }
    }
  }

  /**
   * Extract and verify token from Authorization header
   */
  static authenticateRequest(request: NextRequest): AuthResult {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        isValid: false,
        error: 'Missing or invalid Authorization header'
      }
    }

    const token = authHeader.substring(7).trim()
    
    if (!token) {
      return {
        isValid: false,
        error: 'Empty token'
      }
    }

    return this.verifyToken(token)
  }

  /**
   * Check if user has required role
   */
  static hasRole(authResult: AuthResult, requiredRole: 'admin' | 'user'): boolean {
    if (!authResult.isValid || !authResult.payload) {
      return false
    }

    // Admin role can access everything
    if (authResult.payload.role === 'admin') {
      return true
    }

    return authResult.payload.role === requiredRole
  }

  /**
   * Rate limiting check
   */
  static checkRateLimit(clientId: string): boolean {
    const now = Date.now()
    const clientData = this.rateLimitMap.get(clientId)

    if (!clientData || now > clientData.resetTime) {
      // Reset or create new entry
      this.rateLimitMap.set(clientId, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW
      })
      return true
    }

    if (clientData.count >= this.RATE_LIMIT_MAX_REQUESTS) {
      return false
    }

    clientData.count++
    return true
  }

  /**
   * Get client identifier for rate limiting
   */
  static getClientId(request: NextRequest): string {
    // Try to get IP address from various headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = request.headers.get('x-client-ip')
    
    return forwarded?.split(',')[0] || realIp || clientIp || 'unknown'
  }

  /**
   * Complete authentication middleware
   */
  static async authenticateAdmin(request: NextRequest): Promise<{
    isAuthenticated: boolean
    userId?: string
    error?: string
    statusCode?: number
  }> {
    try {
      // Rate limiting
      const clientId = this.getClientId(request)
      if (!this.checkRateLimit(clientId)) {
        return {
          isAuthenticated: false,
          error: 'Rate limit exceeded',
          statusCode: 429
        }
      }

      // Development mode bypass
      if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH === 'true') {
        return {
          isAuthenticated: true,
          userId: 'dev-admin-user'
        }
      }

      // JWT Authentication
      const authResult = this.authenticateRequest(request)
      
      if (!authResult.isValid) {
        return {
          isAuthenticated: false,
          error: authResult.error || 'Authentication failed',
          statusCode: 401
        }
      }

      // Check admin role
      if (!this.hasRole(authResult, 'admin')) {
        return {
          isAuthenticated: false,
          error: 'Insufficient permissions - admin role required',
          statusCode: 403
        }
      }

      // Log authentication event
      await ApiKeyService.logAuditEvent({
        service: 'AUTH',
        action: 'ADMIN_ACCESS',
        userId: authResult.payload!.userId,
        userAgent: request.headers.get('user-agent') || undefined,
        ipAddress: clientId,
        metadata: {
          endpoint: request.url,
          method: request.method
        }
      })

      return {
        isAuthenticated: true,
        userId: authResult.payload!.userId
      }

    } catch (error) {
      console.error('Authentication error:', error)
      return {
        isAuthenticated: false,
        error: 'Authentication service error',
        statusCode: 500
      }
    }
  }

  /**
   * Clean up expired rate limit entries (call periodically)
   */
  static cleanupRateLimit(): void {
    const now = Date.now()
    for (const [clientId, data] of this.rateLimitMap.entries()) {
      if (now > data.resetTime) {
        this.rateLimitMap.delete(clientId)
      }
    }
  }
}

// Cleanup rate limit entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    AuthService.cleanupRateLimit()
  }, 5 * 60 * 1000)
}