/**
 * User-Friendly Error Display Component
 * Displays errors with smart recovery options and graceful degradation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, MessageCircle, X, CheckCircle, Info, AlertCircle } from 'lucide-react';
import IntelligentErrorHandler, { UserFriendlyError } from '@/lib/intelligent-error-handler';

interface ErrorDisplayProps {
  error: UserFriendlyError;
  onRetry?: () => void;
  onDismiss?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  onContactSupport,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (error.autoHide && error.hideAfter) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, error.hideAfter);

      return () => clearTimeout(timer);
    }
  }, [error.autoHide, error.hideAfter, onDismiss]);

  const handleRetry = async () => {
    if (onRetry && !isRetrying) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getIcon = () => {
    switch (error.severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (error.severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`rounded-lg border p-4 ${getBackgroundColor()} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            {error.title}
          </h3>
          
          <div className="mt-1 text-sm text-gray-700">
            {error.message}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {error.showRetry && onRetry && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Try Again
                  </>
                )}
              </button>
            )}

            {error.action && error.actionText && (
              <a
                href={error.action}
                className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {error.actionText}
              </a>
            )}

            {error.showSupport && onContactSupport && (
              <button
                onClick={onContactSupport}
                className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Contact Support
              </button>
            )}
          </div>
        </div>

        {error.dismissible && (
          <div className="ml-3 flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="inline-flex rounded-md p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Error Boundary Component with Smart Recovery
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorHandler: IntelligentErrorHandler;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.errorHandler = new IntelligentErrorHandler();
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);

    // Handle error with intelligent recovery
    this.errorHandler.handleError(error, {
      source: 'frontend',
      operation: 'component_render',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            retry={this.handleRetry}
          />
        );
      }

      return (
        <ErrorDisplay
          error={{
            title: 'Something went wrong',
            message: 'An unexpected error occurred. Please try refreshing the page.',
            severity: 'error',
            dismissible: false,
            autoHide: false,
            showRetry: true,
            showSupport: true
          }}
          onRetry={this.handleRetry}
          onContactSupport={() => {
            // Implement support contact logic
            window.location.href = '/support';
          }}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for handling errors with intelligent recovery
 */
export const useErrorHandler = () => {
  const [errorHandler] = useState(() => new IntelligentErrorHandler());
  const [currentError, setCurrentError] = useState<UserFriendlyError | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const handleError = async (
    error: Error,
    context?: {
      operation?: string;
      source?: 'frontend' | 'backend' | 'api' | 'database' | 'network' | 'external';
      userId?: string;
      metadata?: Record<string, any>;
    }
  ) => {
    setIsRecovering(true);
    
    try {
      const result = await errorHandler.handleError(error, {
        source: context?.source || 'frontend',
        operation: context?.operation || 'unknown',
        userId: context?.userId,
        metadata: context?.metadata
      });

      setCurrentError(result.userError);
      return result;
    } finally {
      setIsRecovering(false);
    }
  };

  const clearError = () => {
    setCurrentError(null);
  };

  const retryOperation = async (operation: () => Promise<any>) => {
    try {
      setIsRecovering(true);
      const result = await operation();
      clearError();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        await handleError(error);
      }
      throw error;
    } finally {
      setIsRecovering(false);
    }
  };

  return {
    handleError,
    clearError,
    retryOperation,
    currentError,
    isRecovering
  };
};

/**
 * Success Message Component
 */
export const SuccessDisplay: React.FC<{
  title: string;
  message: string;
  action?: string;
  actionText?: string;
  onDismiss?: () => void;
  autoHide?: boolean;
  hideAfter?: number;
}> = ({
  title,
  message,
  action,
  actionText,
  onDismiss,
  autoHide = true,
  hideAfter = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide && hideAfter) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, hideAfter);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideAfter, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="rounded-lg border bg-green-50 border-green-200 p-4"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-green-900">
            {title}
          </h3>
          
          <div className="mt-1 text-sm text-green-700">
            {message}
          </div>

          {action && actionText && (
            <div className="mt-3">
              <a
                href={action}
                className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {actionText}
              </a>
            </div>
          )}
        </div>

        <div className="ml-3 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="inline-flex rounded-md p-1.5 text-green-400 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Loading State Component for Recovery Operations
 */
export const RecoveryLoading: React.FC<{
  message?: string;
  onCancel?: () => void;
}> = ({
  message = 'Attempting to recover...',
  onCancel
}) => {
  return (
    <div className="flex items-center justify-center p-8 bg-blue-50 rounded-lg border border-blue-200">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-sm text-blue-700 mb-4">{message}</p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
export { ErrorBoundary, type ErrorDisplayProps, type ErrorBoundaryProps };