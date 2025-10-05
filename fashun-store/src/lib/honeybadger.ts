/**
 * Honeybadger Configuration
 * Professional error tracking and monitoring
 */

import Honeybadger from '@honeybadger-io/js'

// Safe Honeybadger initialization with SSR checks
const isClient = typeof window !== 'undefined';
const apiKey = process.env.NEXT_PUBLIC_HONEYBADGER_API_KEY;
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Only initialize on client-side and if we have an API key or are in production
if (isClient && (apiKey || isProduction)) {
  try {
    Honeybadger.configure({
      apiKey: apiKey || 'missing-api-key',
      environment: process.env.NODE_ENV || 'development',
      developmentEnvironments: ['development', 'test'],
      
      // Enable reporting only in production with valid API key
      reportData: isProduction && !!apiKey,
      
      // Configure breadcrumbs
      breadcrumbsEnabled: true,
      maxBreadcrumbs: 40,
      
      // Configure user tracking
      enableUncaught: isProduction,
      enableUnhandledRejection: isProduction,
      
      // Add application info
      revision: process.env.VERCEL_GIT_COMMIT_SHA,
      projectRoot: process.env.PWD,
      
      // Enable debugging in development
      debug: isDevelopment
    });
    
    if (isDevelopment) {
      console.log('🐛 Honeybadger initialized in development mode (client-side)');
    }
  } catch (error) {
    console.warn('⚠️ Failed to initialize Honeybadger:', error);
  }
} else if (!isClient) {
  console.log('🚫 Honeybadger not initialized - server-side rendering');
} else {
  console.log('🚫 Honeybadger not initialized - missing API key in development mode');
}

// Set user information helper
export const setUserContext = (user: {
  id: string
  email?: string
  name?: string
  [key: string]: any
}) => {
  Honeybadger.setContext({
    user_id: user.id,
    user_email: user.email,
    user_name: user.name,
    ...user
  })
}

// Custom error reporting functions
export const reportError = (error: Error, context?: Record<string, any>) => {
  if (context) {
    Honeybadger.setContext(context)
  }
  Honeybadger.notify(error)
}

export const reportInfo = (message: string, context?: Record<string, any>) => {
  Honeybadger.notify({
    message,
    name: 'Info',
    stack: new Error().stack
  }, {
    context,
    fingerprint: message
  })
}

// Breadcrumb helpers
export const addBreadcrumb = (message: string, metadata?: Record<string, any>) => {
  Honeybadger.addBreadcrumb(message, {
    category: 'custom',
    metadata
  })
}

export default Honeybadger