import Razorpay from 'razorpay'

// Razorpay Error Types
export interface RazorpayError {
  error: {
    code: string
    description: string
    field?: string
    source?: string
    step?: string
    reason?: string
  }
}

// Razorpay Error Codes and their meanings
export const RAZORPAY_ERROR_CODES = {
  // Payment Errors
  'BAD_REQUEST_ERROR': 'Invalid request parameters',
  'GATEWAY_ERROR': 'Gateway error occurred',
  'SERVER_ERROR': 'Internal server error',
  
  // Order Errors
  'INVALID_ORDER_ID': 'Invalid order ID provided',
  'ORDER_ALREADY_PAID': 'Order has already been paid',
  'ORDER_EXPIRED': 'Order has expired',
  
  // Payment Specific
  'PAYMENT_FAILED': 'Payment failed',
  'PAYMENT_PENDING': 'Payment is still pending',
  'PAYMENT_DECLINED': 'Payment was declined by bank',
  'INSUFFICIENT_FUNDS': 'Insufficient funds in account',
  'CARD_EXPIRED': 'Card has expired',
  'INVALID_CARD': 'Invalid card details',
  'CVV_FAILURE': 'Invalid CVV provided',
  
  // Network Errors
  'NETWORK_ERROR': 'Network connection error',
  'TIMEOUT': 'Request timeout',
  
  // Signature Verification
  'SIGNATURE_VERIFICATION_FAILED': 'Payment signature verification failed',
  
  // KYC/Business Errors
  'BUSINESS_VALIDATION_ERROR': 'Business validation failed',
  'KYC_REQUIREMENT': 'KYC verification required'
} as const

export type RazorpayErrorCode = keyof typeof RAZORPAY_ERROR_CODES

// Enhanced Error Handler
export class RazorpayErrorHandler {
  static handleError(error: any): {
    code: string
    message: string
    userMessage: string
    statusCode: number
    shouldRetry: boolean
    logLevel: 'error' | 'warn' | 'info'
  } {
    // Check if it's a Razorpay API error
    if (error?.error) {
      const razorpayError = error.error
      const errorCode = razorpayError.code || 'UNKNOWN_ERROR'
      
      switch (errorCode) {
        case 'BAD_REQUEST_ERROR':
          return {
            code: errorCode,
            message: razorpayError.description || 'Invalid request',
            userMessage: 'Please check your payment details and try again',
            statusCode: 400,
            shouldRetry: false,
            logLevel: 'warn'
          }
          
        case 'GATEWAY_ERROR':
        case 'SERVER_ERROR':
          return {
            code: errorCode,
            message: razorpayError.description || 'Gateway error',
            userMessage: 'Payment gateway is temporarily unavailable. Please try again in a few minutes.',
            statusCode: 502,
            shouldRetry: true,
            logLevel: 'error'
          }
          
        case 'PAYMENT_FAILED':
          return {
            code: errorCode,
            message: razorpayError.description || 'Payment failed',
            userMessage: 'Payment was unsuccessful. Please check your payment method and try again.',
            statusCode: 402,
            shouldRetry: true,
            logLevel: 'info'
          }
          
        case 'INSUFFICIENT_FUNDS':
          return {
            code: errorCode,
            message: 'Insufficient funds',
            userMessage: 'Insufficient funds in your account. Please check your balance or use a different payment method.',
            statusCode: 402,
            shouldRetry: false,
            logLevel: 'info'
          }
          
        case 'CARD_EXPIRED':
        case 'INVALID_CARD':
        case 'CVV_FAILURE':
          return {
            code: errorCode,
            message: razorpayError.description || 'Invalid card details',
            userMessage: 'Invalid card details. Please check your card information and try again.',
            statusCode: 402,
            shouldRetry: false,
            logLevel: 'info'
          }
          
        default:
          return {
            code: errorCode,
            message: razorpayError.description || 'Payment processing error',
            userMessage: 'Payment processing failed. Please try again or contact support.',
            statusCode: 400,
            shouldRetry: false,
            logLevel: 'error'
          }
      }
    }
    
    // Network or other errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        userMessage: 'Unable to connect to payment service. Please check your internet connection and try again.',
        statusCode: 503,
        shouldRetry: true,
        logLevel: 'error'
      }
    }
    
    if (error.code === 'ETIMEDOUT') {
      return {
        code: 'TIMEOUT',
        message: 'Request timeout',
        userMessage: 'Payment request timed out. Please try again.',
        statusCode: 504,
        shouldRetry: true,
        logLevel: 'warn'
      }
    }
    
    // Default error
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Unknown error occurred',
      userMessage: 'Something went wrong. Please try again or contact support.',
      statusCode: 500,
      shouldRetry: false,
      logLevel: 'error'
    }
  }
  
  static logError(error: any, context: string, additionalData?: any) {
    const errorInfo = this.handleError(error)
    
    const logData = {
      timestamp: new Date().toISOString(),
      context,
      errorCode: errorInfo.code,
      message: errorInfo.message,
      statusCode: errorInfo.statusCode,
      shouldRetry: errorInfo.shouldRetry,
      additionalData,
      stack: error.stack
    }
    
    switch (errorInfo.logLevel) {
      case 'error':
        console.error(`Razorpay Error [${context}]:`, logData)
        break
      case 'warn':
        console.warn(`Razorpay Warning [${context}]:`, logData)
        break
      case 'info':
        console.info(`Razorpay Info [${context}]:`, logData)
        break
    }
    
    return errorInfo
  }
}

// Razorpay Configuration with Error Handling
export const createRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.')
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  })
}

// Utility to validate Razorpay webhook signature
export const validateWebhookSignature = (
  rawBody: string,
  signature: string,
  secret: string
): boolean => {
  try {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Webhook signature validation error:', error)
    return false
  }
}

// Payment status checker
export const getPaymentStatus = (status: string): {
  isSuccess: boolean
  isFailure: boolean
  isPending: boolean
  userMessage: string
} => {
  switch (status?.toLowerCase()) {
    case 'captured':
    case 'authorized':
      return {
        isSuccess: true,
        isFailure: false,
        isPending: false,
        userMessage: 'Payment successful'
      }
      
    case 'failed':
      return {
        isSuccess: false,
        isFailure: true,
        isPending: false,
        userMessage: 'Payment failed. Please try again.'
      }
      
    case 'created':
    case 'attempted':
      return {
        isSuccess: false,
        isFailure: false,
        isPending: true,
        userMessage: 'Payment is being processed. Please wait.'
      }
      
    default:
      return {
        isSuccess: false,
        isFailure: false,
        isPending: true,
        userMessage: 'Payment status unknown. Please contact support.'
      }
  }
}
