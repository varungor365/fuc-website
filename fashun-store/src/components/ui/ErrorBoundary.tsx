'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import Honeybadger from '@/lib/honeybadger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'page' | 'component' | 'critical';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report to Honeybadger
    Honeybadger.notify(error, {
      context: {
        errorInfo: errorInfo.componentStack,
        errorId: this.state.errorId,
        level: this.props.level || 'component'
      }
    });

    this.setState({
      error,
      errorInfo
    });
    this.reportError(error, errorInfo);
  }

  private async reportError(error: Error, errorInfo: ErrorInfo) {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          timestamp: Date.now(),
          level: this.props.level || 'component',
          userAgent: navigator.userAgent
        }),
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportIssue = () => {
    const subject = encodeURIComponent(`Bug Report: ${this.state.error?.message || 'Application Error'}`);
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}

Error Details:
${this.state.error?.message}

Please describe what you were doing when this error occurred.
    `);
    
    window.open(`mailto:fashun.co.in@gmail.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { level = 'component' } = this.props;

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {level === 'critical' ? 'Critical Error' : 'Something went wrong'}
              </h2>
              <p className="text-gray-600 mb-4">
                {level === 'critical' 
                  ? 'A critical error has occurred. Please refresh the page or contact support.'
                  : 'We encountered an unexpected error. You can try refreshing or go back to the homepage.'
                }
              </p>
              {this.state.errorId && (
                <p className="text-sm text-gray-500 mb-6">
                  Error ID: <code className="bg-gray-100 px-2 py-1 rounded">{this.state.errorId}</code>
                </p>
              )}
            </div>

            <div className="space-y-3">
              {level !== 'critical' && (
                <button
                  onClick={this.handleRetry}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </button>
              )}

              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </button>

              <button
                onClick={this.handleReportIssue}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="mr-2 h-4 w-4" />
                Report Issue
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Developer Info
                </summary>
                <div className="mt-2 p-4 bg-red-50 rounded-lg">
                  <pre className="text-xs text-red-800 whitespace-pre-wrap overflow-auto">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;