import { NextRequest, NextResponse } from 'next/server'

interface ErrorLogRequest {
  type: 'javascript' | 'api' | 'network' | 'render'
  message: string
  stack: string
  url: string
  userAgent: string
  userId?: string
  sessionId: string
  severity?: 'critical' | 'high' | 'medium' | 'low'
  metadata?: {
    componentStack?: string
    apiEndpoint?: string
    statusCode?: number
    requestData?: any
    responseData?: any
    breadcrumbs?: Array<{
      timestamp: string
      category: string
      message: string
      data?: any
    }>
    userContext?: {
      email: string
      name: string
      role: string
    }
    deviceInfo?: {
      browser: string
      os: string
      screenSize: string
    }
    performanceMetrics?: {
      loadTime: number
      apiResponseTime: number
    }
  }
}

// Mock error store - replace with database
let errorStore: Array<any> = [
  {
    id: 'err-001',
    type: 'javascript',
    message: 'Cannot read property "map" of undefined',
    stack: 'TypeError: Cannot read property "map" of undefined\n    at ProductList.render (ProductList.tsx:45:20)',
    url: '/collections/hoodies',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess-001',
    severity: 'high',
    status: 'new',
    count: 3,
    firstSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    metadata: {
      componentStack: 'ProductList > CollectionPage',
      breadcrumbs: [
        { timestamp: new Date().toISOString(), category: 'navigation', message: 'User navigated to /collections/hoodies' },
        { timestamp: new Date().toISOString(), category: 'action', message: 'Applied filter: color=black' }
      ]
    }
  },
  {
    id: 'err-002',
    type: 'api',
    message: 'Failed to fetch products from Strapi',
    stack: 'Error: Network request failed\n    at fetch (/api/products)',
    url: '/api/products',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
    sessionId: 'sess-002',
    severity: 'critical',
    status: 'acknowledged',
    count: 12,
    firstSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    metadata: {
      apiEndpoint: '/api/products',
      statusCode: 500,
      performanceMetrics: { apiResponseTime: 5000 }
    }
  }
]

function sanitizeData(data: any): any {
  if (typeof data !== 'object' || data === null) return data
  
  const sanitized = { ...data }
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'key', 'authorization']
  
  for (const [key, value] of Object.entries(sanitized)) {
    const lowerKey = key.toLowerCase()
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'string' && value.includes('@')) {
      // Mask email addresses
      sanitized[key] = value.replace(/(.{2}).*(@.*)/, '$1***$2')
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeData(value)
    }
  }
  
  return sanitized
}

function determineSeverity(type: string, message: string, metadata?: any): 'critical' | 'high' | 'medium' | 'low' {
  // Critical: 500 errors, payment failures, data loss
  if (metadata?.statusCode >= 500) return 'critical'
  if (message.toLowerCase().includes('payment')) return 'critical'
  if (message.toLowerCase().includes('data loss')) return 'critical'
  
  // High: 400 errors, authentication failures, broken features
  if (metadata?.statusCode >= 400) return 'high'
  if (message.toLowerCase().includes('auth')) return 'high'
  if (type === 'javascript' && message.includes('TypeError')) return 'high'
  
  // Medium: Validation errors, missing data
  if (message.toLowerCase().includes('validation')) return 'medium'
  if (message.toLowerCase().includes('not found')) return 'medium'
  
  // Low: Warnings, deprecation notices
  return 'low'
}

function generateErrorFingerprint(type: string, message: string, stack: string): string {
  const content = `${type}:${message}:${stack.split('\n')[0]}`
  // Simple hash - in production use crypto.createHash
  return Buffer.from(content).toString('base64').slice(0, 16)
}

function findDuplicateError(fingerprint: string): any | null {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  return errorStore.find(error => 
    error.fingerprint === fingerprint && 
    new Date(error.lastSeen) > fiveMinutesAgo
  )
}

export async function POST(request: NextRequest) {
  try {
    const body: ErrorLogRequest = await request.json()
    
    // Validate required fields
    if (!body.type || !body.message || !body.url) {
      return NextResponse.json(
        { error: 'Missing required fields: type, message, url' },
        { status: 400 }
      )
    }

    // Rate limiting check (simple implementation)
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    // In production, implement proper rate limiting with Redis

    // Sanitize sensitive data
    const sanitizedMetadata = body.metadata ? sanitizeData(body.metadata) : undefined

    // Determine severity if not provided
    const severity = body.severity || determineSeverity(body.type, body.message, sanitizedMetadata)

    // Generate error fingerprint for deduplication
    const fingerprint = generateErrorFingerprint(body.type, body.message, body.stack)
    
    // Check for duplicate errors
    const existingError = findDuplicateError(fingerprint)
    
    if (existingError) {
      // Update existing error
      existingError.count += 1
      existingError.lastSeen = new Date().toISOString()
      
      return NextResponse.json({
        success: true,
        errorId: existingError.id,
        message: 'Error logged (duplicate found, count updated)'
      })
    }

    // Create new error record
    const errorId = `err-${Date.now()}`
    const newError = {
      id: errorId,
      type: body.type,
      message: body.message,
      stack: body.stack,
      url: body.url,
      userAgent: body.userAgent,
      userId: body.userId,
      sessionId: body.sessionId,
      severity,
      status: 'new',
      count: 1,
      fingerprint,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      metadata: sanitizedMetadata,
      clientIP
    }

    // Store error (in production, save to database)
    errorStore.push(newError)

    // Send alerts for critical errors
    if (severity === 'critical') {
      await sendAlert(newError)
    }

    // Check for error rate alerts
    const recentErrors = errorStore.filter(error => 
      new Date(error.firstSeen) > new Date(Date.now() - 5 * 60 * 1000)
    )
    
    if (recentErrors.length > 10) {
      await sendRateAlert(recentErrors.length)
    }

    return NextResponse.json({
      success: true,
      errorId,
      message: 'Error logged successfully'
    })

  } catch (error) {
    console.error('Error logging failed:', error)
    
    // Fallback to file system logging
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        originalRequest: 'Failed to parse'
      }
      // In production, write to log file
      console.log('Fallback log:', JSON.stringify(logEntry))
    } catch (fallbackError) {
      console.error('Fallback logging also failed:', fallbackError)
    }

    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    )
  }
}

async function sendAlert(error: any) {
  try {
    // In production, implement email/Slack/webhook alerts
    console.log(`CRITICAL ERROR ALERT: ${error.message}`)
    
    // Example: Send to Slack
    // await fetch(process.env.SLACK_WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     text: `🚨 Critical Error: ${error.message}`,
    //     attachments: [{
    //       fields: [
    //         { title: 'URL', value: error.url, short: true },
    //         { title: 'Type', value: error.type, short: true },
    //         { title: 'Time', value: error.firstSeen, short: true }
    //       ]
    //     }]
    //   })
    // })
    
  } catch (alertError) {
    console.error('Failed to send alert:', alertError)
  }
}

async function sendRateAlert(errorCount: number) {
  try {
    console.log(`ERROR RATE ALERT: ${errorCount} errors in last 5 minutes`)
    // Implement rate-based alerting
  } catch (alertError) {
    console.error('Failed to send rate alert:', alertError)
  }
}

// GET endpoint for fetching error logs (used by admin dashboard)
export async function GET(request: NextRequest) {
  try {
    // Admin authentication check
    // if (!isAdminAuthenticated(request)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const url = new URL(request.url)
    const severity = url.searchParams.get('severity')
    const status = url.searchParams.get('status')
    const type = url.searchParams.get('type')
    const search = url.searchParams.get('search')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    let filteredErrors = [...errorStore]

    // Apply filters
    if (severity && severity !== 'all') {
      filteredErrors = filteredErrors.filter(error => error.severity === severity)
    }
    if (status && status !== 'all') {
      filteredErrors = filteredErrors.filter(error => error.status === status)
    }
    if (type && type !== 'all') {
      filteredErrors = filteredErrors.filter(error => error.type === type)
    }
    if (search) {
      filteredErrors = filteredErrors.filter(error => 
        error.message.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Sort by most recent first
    filteredErrors.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())

    // Limit results
    filteredErrors = filteredErrors.slice(0, limit)

    return NextResponse.json({ errors: filteredErrors })

  } catch (error) {
    console.error('Error fetch failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch errors' },
      { status: 500 }
    )
  }
}