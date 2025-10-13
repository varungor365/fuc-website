'use client';

import React from 'react';
import { HoneybadgerErrorBoundary } from '@honeybadger-io/react';
import Honeybadger from '@/lib/honeybadger';

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-300 mb-6">
          We've been notified of this error and are working to fix it.
        </p>
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Go to homepage
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-gray-400 cursor-pointer mb-2">
              Error details (dev only)
            </summary>
            <pre className="bg-black/30 p-3 rounded text-xs text-gray-300 overflow-auto">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <HoneybadgerErrorBoundary
      honeybadger={Honeybadger}
      ErrorComponent={ErrorFallback}
    >
      {children}
    </HoneybadgerErrorBoundary>
  );
};

export default ErrorBoundary;