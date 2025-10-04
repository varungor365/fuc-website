'use client';

import * as React from 'react';
import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Report error to monitoring API
    this.reportError(error, errorInfo);
  }

  private async reportError(error: Error, errorInfo: React.ErrorInfo) {
    try {
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          severity: 'error',
          category: 'React Error Boundary',
          source: 'client'
        }),
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            {/* Glassmorphism Error Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-4">
                  Something went wrong
                </h1>
                
                <p className="text-gray-300 mb-6">
                  We encountered an unexpected error. Our team has been notified and will investigate the issue.
                </p>

                {/* Error Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-black/30 rounded-lg p-4 mb-6 text-left">
                    <h3 className="text-sm font-semibold text-red-400 mb-2">
                      Error Details (Development)
                    </h3>
                    <pre className="text-xs text-gray-300 overflow-auto max-h-32">
                      {this.state.error.message}
                      {this.state.error.stack && '\n\n' + this.state.error.stack}
                    </pre>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={this.handleReset}
                    className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={this.handleReload}
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reload Page
                  </button>
                  
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
                  >
                    <Home className="w-4 h-4" />
                    Go Home
                  </Link>
                </div>

                {/* Support Information */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400">
                    If this problem persists, please contact{' '}
                    <a 
                      href="mailto:support@fashun.co" 
                      className="text-primary-400 hover:text-primary-300 underline"
                    >
                      support@fashun.co
                    </a>
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {Date.now().toString(36)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;