import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Upload source maps during build to get better error reports
  debug: process.env.NODE_ENV === 'development',

  // Environment
  environment: process.env.NODE_ENV,
  
  // Release information
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

  integrations: [
    // Capture 100% of the transactions for performance monitoring.
    Sentry.localVariablesIntegration(),
    Sentry.replayIntegration({
      // Mask all text content, excluding navigation and buttons
      maskAllText: false,
      // Capture console logs
      maskAllInputs: true,
    }),
  ],

  beforeSend(event, hint) {
    // Filter out noisy errors
    const noisyErrors = [
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Script error',
      'Network request failed'
    ];

    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error && noisyErrors.some(noisy => error.value?.includes(noisy))) {
        return null;
      }
    }

    return event;
  },

  // Error tags for better organization
  initialScope: {
    tags: {
      component: 'fashun-store',
      version: process.env.npm_package_version || '1.0.0'
    }
  }
});

export { Sentry };