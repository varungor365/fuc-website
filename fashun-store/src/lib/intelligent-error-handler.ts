/**
 * Intelligent Error Handler
 * Mock implementation for demo purposes
 */

export interface UserFriendlyError {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  severity?: 'critical' | 'error' | 'warning' | 'info';
  actionable: boolean;
  suggestions?: string[];
  metadata?: Record<string, any>;
  autoHide?: boolean;
  hideAfter?: number;
  retryable?: boolean;
  showRetry?: boolean;
  showSupport?: boolean;
  action?: string;
  actionText?: string;
  dismissible?: boolean;
}

class IntelligentErrorHandler {
  transformError(error: Error): UserFriendlyError {
    return {
      title: 'Something went wrong',
      message: error.message || 'An unexpected error occurred',
      type: 'error',
      severity: 'error',
      actionable: true,
      suggestions: ['Try refreshing the page', 'Check your internet connection'],
      dismissible: true,
      showRetry: true,
      retryable: true
    };
  }

  async reportError(error: Error): Promise<void> {
    console.error('Error reported:', error);
  }
}

const intelligentErrorHandler = new IntelligentErrorHandler();
export default intelligentErrorHandler;