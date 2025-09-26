import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Set sampling rate for profiling
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  debug: process.env.NODE_ENV === 'development',
  
  environment: process.env.NODE_ENV,
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

  integrations: [
    Sentry.localVariablesIntegration(),
  ],

  beforeSend(event, hint) {
    // Server-side error filtering
    const noisyErrors = [
      'ENOTFOUND',
      'ECONNRESET', 
      'timeout',
      'Request timeout'
    ];

    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error && noisyErrors.some(noisy => error.value?.includes(noisy))) {
        return null;
      }
    }

    return event;
  },

  initialScope: {
    tags: {
      component: 'fashun-store-server',
      version: process.env.npm_package_version || '1.0.0'
    }
  }
});

export { Sentry };