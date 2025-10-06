import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  tracesSampleRate: 1.0,
  
  environment: process.env.NODE_ENV,
  
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  
  beforeSend(event, hint) {
    if (event.exception) {
      console.error('Server error captured by Sentry:', hint.originalException || hint.syntheticException);
    }
    return event;
  },
});
