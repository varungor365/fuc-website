import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { errors, performance } = await request.json();

    // Log errors for debugging
    if (errors && errors.length > 0) {
      console.error('Client Errors:', errors);
    }

    // Log performance metrics
    if (performance && performance.length > 0) {
      console.log('Performance Metrics:', performance);
    }

    // In production, you'd send this to services like:
    // - Sentry for error tracking
    // - LogRocket for session replay
    // - DataDog for performance monitoring
    // - Your own analytics database

    // For now, we'll store in a simple format
    const timestamp = new Date().toISOString();
    
    // Save to monitoring logs (in production, use proper logging service)
    if (process.env.NODE_ENV === 'production') {
      // Example integration with external services:
      
      // Sentry error reporting
      if (errors.length > 0 && process.env.SENTRY_DSN) {
        // await Sentry.captureException(errors);
      }

      // LogRocket session data
      if (process.env.LOGROCKET_APP_ID) {
        // await LogRocket.captureLog('performance', performance);
      }

      // Custom analytics endpoint
      if (process.env.ANALYTICS_ENDPOINT) {
        await fetch(process.env.ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ errors, performance, timestamp })
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      received: {
        errors: errors?.length || 0,
        performance: performance?.length || 0
      }
    });

  } catch (error) {
    console.error('Error processing monitoring data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process monitoring data' },
      { status: 500 }
    );
  }
}