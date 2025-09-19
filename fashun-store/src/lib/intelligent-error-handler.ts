/**
 * Intelligent Error Handling & Recovery Service
 * Provides smart error recovery, graceful degradation, and user-friendly error handling
 */

export interface ErrorContext {
  id: string;
  timestamp: Date;
  source: 'frontend' | 'backend' | 'api' | 'database' | 'network' | 'external' | 'unknown';
  type: 'validation' | 'network' | 'server' | 'authentication' | 'authorization' | 'business' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  operation: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata: Record<string, any>;
}

export interface ErrorRecoveryStrategy {
  id: string;
  name: string;
  description: string;
  applicableErrors: string[];
  priority: number;
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  baseDelay: number;
  maxDelay: number;
  timeout: number;
  fallbackStrategy?: string;
  recoveryAction: (error: ErrorContext, attempt: number) => Promise<ErrorRecoveryResult>;
}

export interface ErrorRecoveryResult {
  success: boolean;
  recovered: boolean;
  fallbackUsed: boolean;
  newStrategy?: string;
  retryAfter?: number;
  message?: string;
  metadata?: Record<string, any>;
}

export interface UserFriendlyError {
  title: string;
  message: string;
  action?: string;
  actionText?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  dismissible: boolean;
  autoHide: boolean;
  hideAfter?: number;
  showRetry: boolean;
  showSupport: boolean;
  supportContext?: Record<string, any>;
}

export interface GracefulDegradationConfig {
  feature: string;
  fallbackMode: 'disabled' | 'basic' | 'cached' | 'mock';
  fallbackData?: any;
  fallbackComponent?: string;
  enabledInDegradation: string[];
  disabledInDegradation: string[];
  userMessage?: string;
  recoveryTrigger?: 'manual' | 'automatic' | 'time-based';
  recoveryInterval?: number;
}

export interface ErrorAnalytics {
  errorId: string;
  frequency: number;
  firstOccurrence: Date;
  lastOccurrence: Date;
  affectedUsers: number;
  averageResolutionTime: number;
  successfulRecoveries: number;
  failedRecoveries: number;
  userFeedback: {
    helpful: number;
    notHelpful: number;
    comments: string[];
  };
  patterns: {
    timeOfDay: Record<string, number>;
    dayOfWeek: Record<string, number>;
    userAgent: Record<string, number>;
    geolocation: Record<string, number>;
  };
}

class IntelligentErrorHandler {
  private baseUrl = '/api/error-handling';
  private errorHistory: Map<string, ErrorContext[]> = new Map();
  private recoveryStrategies: Map<string, ErrorRecoveryStrategy> = new Map();
  private degradationConfig: Map<string, GracefulDegradationConfig> = new Map();
  private errorAnalytics: Map<string, ErrorAnalytics> = new Map();
  private retryAttempts: Map<string, number> = new Map();
  private circuitBreakers: Map<string, { isOpen: boolean; lastAttempt: Date; failures: number }> = new Map();

  constructor() {
    this.initializeDefaultStrategies();
    this.initializeDegradationConfig();
    this.startErrorAnalytics();
  }

  /**
   * Handle an error with intelligent recovery
   */
  async handleError(error: Error, context: Partial<ErrorContext>): Promise<{
    recovered: boolean;
    userError: UserFriendlyError;
    strategy?: string;
    retryAfter?: number;
  }> {
    try {
      // Create error context
      const errorContext: ErrorContext = {
        id: this.generateErrorId(),
        timestamp: new Date(),
        source: context.source || 'unknown',
        type: this.classifyError(error),
        severity: this.calculateSeverity(error, context),
        operation: context.operation || 'unknown',
        userId: context.userId,
        sessionId: context.sessionId,
        userAgent: context.userAgent,
        ipAddress: context.ipAddress,
        metadata: {
          message: error.message,
          stack: error.stack,
          name: error.name,
          ...context.metadata
        }
      };

      // Log error
      await this.logError(errorContext);

      // Update analytics
      this.updateErrorAnalytics(errorContext);

      // Check circuit breaker
      if (this.isCircuitBreakerOpen(errorContext.operation)) {
        return {
          recovered: false,
          userError: this.createUserFriendlyError(errorContext, 'circuit_breaker'),
          retryAfter: 60000 // 1 minute
        };
      }

      // Find recovery strategy
      const strategy = this.findBestRecoveryStrategy(errorContext);

      if (strategy) {
        // Attempt recovery
        const result = await this.attemptRecovery(errorContext, strategy);
        
        if (result.success) {
          this.resetCircuitBreaker(errorContext.operation);
          return {
            recovered: result.recovered,
            userError: this.createUserFriendlyError(errorContext, 'recovered'),
            strategy: strategy.id
          };
        } else {
          this.updateCircuitBreaker(errorContext.operation, false);
          
          // Try fallback strategy
          if (strategy.fallbackStrategy) {
            const fallbackStrategy = this.recoveryStrategies.get(strategy.fallbackStrategy);
            if (fallbackStrategy) {
              const fallbackResult = await this.attemptRecovery(errorContext, fallbackStrategy);
              if (fallbackResult.success) {
                return {
                  recovered: fallbackResult.recovered,
                  userError: this.createUserFriendlyError(errorContext, 'fallback_recovered'),
                  strategy: fallbackStrategy.id
                };
              }
            }
          }
        }
      }

      // Check for graceful degradation
      const degradationResult = await this.attemptGracefulDegradation(errorContext);
      if (degradationResult.enabled) {
        return {
          recovered: false,
          userError: this.createUserFriendlyError(errorContext, 'degraded'),
          strategy: 'graceful_degradation'
        };
      }

      // Create user-friendly error
      const userError = this.createUserFriendlyError(errorContext);

      return {
        recovered: false,
        userError
      };

    } catch (handlingError) {
      console.error('Error in error handler:', handlingError);
      
      // Fallback error handling
      return {
        recovered: false,
        userError: {
          title: 'Something went wrong',
          message: 'We\'re experiencing technical difficulties. Please try again in a few moments.',
          severity: 'error',
          dismissible: true,
          autoHide: false,
          showRetry: true,
          showSupport: true
        }
      };
    }
  }

  /**
   * Attempt recovery using a strategy
   */
  private async attemptRecovery(
    errorContext: ErrorContext,
    strategy: ErrorRecoveryStrategy
  ): Promise<ErrorRecoveryResult> {
    const attemptKey = `${errorContext.operation}_${strategy.id}`;
    const currentAttempts = this.retryAttempts.get(attemptKey) || 0;

    if (currentAttempts >= strategy.maxRetries) {
      return {
        success: false,
        recovered: false,
        fallbackUsed: false,
        message: 'Maximum retry attempts exceeded'
      };
    }

    // Calculate delay
    const delay = this.calculateDelay(strategy, currentAttempts);
    
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      // Increment attempt counter
      this.retryAttempts.set(attemptKey, currentAttempts + 1);

      // Execute recovery action with timeout
      const result = await Promise.race([
        strategy.recoveryAction(errorContext, currentAttempts + 1),
        this.timeoutPromise(strategy.timeout)
      ]);

      if (result.success) {
        // Reset retry counter on success
        this.retryAttempts.delete(attemptKey);
      }

      return result;

    } catch (recoveryError) {
      console.error(`Recovery strategy ${strategy.id} failed:`, recoveryError);
      
      const errorMessage = recoveryError instanceof Error ? recoveryError.message : 'Unknown error';
      
      return {
        success: false,
        recovered: false,
        fallbackUsed: false,
        message: `Recovery failed: ${errorMessage}`
      };
    }
  }

  /**
   * Attempt graceful degradation
   */
  private async attemptGracefulDegradation(errorContext: ErrorContext): Promise<{
    enabled: boolean;
    config?: GracefulDegradationConfig;
  }> {
    try {
      // Find applicable degradation config
      for (const [feature, config] of Array.from(this.degradationConfig.entries())) {
        if (this.isApplicableForDegradation(errorContext, feature)) {
          // Enable degraded mode
          await this.enableDegradedMode(feature, config);
          
          return {
            enabled: true,
            config
          };
        }
      }

      return { enabled: false };

    } catch (error) {
      console.error('Error attempting graceful degradation:', error);
      return { enabled: false };
    }
  }

  /**
   * Create user-friendly error message
   */
  private createUserFriendlyError(
    errorContext: ErrorContext,
    scenario: 'default' | 'recovered' | 'fallback_recovered' | 'degraded' | 'circuit_breaker' = 'default'
  ): UserFriendlyError {
    switch (scenario) {
      case 'recovered':
        return {
          title: 'Issue Resolved',
          message: 'We automatically fixed the issue. You can continue.',
          severity: 'info',
          dismissible: true,
          autoHide: true,
          hideAfter: 5000,
          showRetry: false,
          showSupport: false
        };

      case 'fallback_recovered':
        return {
          title: 'Using Alternative Method',
          message: 'We\'re using an alternative approach to complete your request.',
          severity: 'warning',
          dismissible: true,
          autoHide: true,
          hideAfter: 10000,
          showRetry: false,
          showSupport: false
        };

      case 'degraded':
        return {
          title: 'Limited Functionality',
          message: 'Some features are temporarily limited. Core functionality remains available.',
          severity: 'warning',
          dismissible: false,
          autoHide: false,
          showRetry: true,
          showSupport: true
        };

      case 'circuit_breaker':
        return {
          title: 'Service Temporarily Unavailable',
          message: 'This service is temporarily unavailable. Please try again in a few minutes.',
          severity: 'error',
          dismissible: true,
          autoHide: false,
          showRetry: true,
          showSupport: true
        };

      default:
        return this.generateContextualErrorMessage(errorContext);
    }
  }

  /**
   * Generate contextual error message based on error type and context
   */
  private generateContextualErrorMessage(errorContext: ErrorContext): UserFriendlyError {
    const baseConfig = {
      dismissible: true,
      autoHide: false,
      showRetry: true,
      showSupport: true
    };

    switch (errorContext.type) {
      case 'network':
        return {
          title: 'Connection Issue',
          message: 'Please check your internet connection and try again.',
          severity: 'error',
          ...baseConfig
        };

      case 'authentication':
        return {
          title: 'Authentication Required',
          message: 'Please sign in to continue.',
          action: '/auth/login',
          actionText: 'Sign In',
          severity: 'warning',
          ...baseConfig
        };

      case 'authorization':
        return {
          title: 'Access Denied',
          message: 'You don\'t have permission to perform this action.',
          severity: 'error',
          showRetry: false,
          showSupport: true,
          dismissible: true,
          autoHide: false
        };

      case 'validation':
        return {
          title: 'Invalid Information',
          message: 'Please check your information and try again.',
          severity: 'warning',
          ...baseConfig
        };

      case 'server':
        if (errorContext.severity === 'critical') {
          return {
            title: 'Service Unavailable',
            message: 'Our servers are experiencing issues. We\'re working to fix this.',
            severity: 'critical',
            ...baseConfig
          };
        }
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again.',
          severity: 'error',
          ...baseConfig
        };

      case 'business':
        return {
          title: 'Unable to Complete',
          message: this.getBusinessErrorMessage(errorContext),
          severity: 'warning',
          ...baseConfig
        };

      default:
        return {
          title: 'Unexpected Error',
          message: 'Something unexpected happened. Please try again.',
          severity: 'error',
          ...baseConfig
        };
    }
  }

  /**
   * Get business-specific error message
   */
  private getBusinessErrorMessage(errorContext: ErrorContext): string {
    const operation = errorContext.operation.toLowerCase();

    if (operation.includes('payment')) {
      return 'Payment processing failed. Please check your payment information.';
    }
    if (operation.includes('checkout')) {
      return 'Checkout process failed. Please review your order and try again.';
    }
    if (operation.includes('inventory')) {
      return 'This item is no longer available. Please choose a different option.';
    }
    if (operation.includes('shipping')) {
      return 'Shipping calculation failed. Please verify your address.';
    }
    if (operation.includes('account')) {
      return 'Account operation failed. Please try again or contact support.';
    }

    return 'Operation could not be completed. Please try again.';
  }

  /**
   * Initialize default recovery strategies
   */
  private initializeDefaultStrategies(): void {
    // Network retry strategy
    this.recoveryStrategies.set('network_retry', {
      id: 'network_retry',
      name: 'Network Retry',
      description: 'Retry network operations with exponential backoff',
      applicableErrors: ['network', 'timeout'],
      priority: 1,
      maxRetries: 3,
      backoffStrategy: 'exponential',
      baseDelay: 1000,
      maxDelay: 10000,
      timeout: 30000,
      recoveryAction: async (error, attempt) => {
        try {
          // Attempt to retry the original network request
          const result = await this.retryNetworkOperation(error);
          return {
            success: true,
            recovered: result.success,
            fallbackUsed: false
          };
        } catch (retryError) {
          const errorMessage = retryError instanceof Error ? retryError.message : 'Unknown error';
          return {
            success: false,
            recovered: false,
            fallbackUsed: false,
            message: `Network retry failed: ${errorMessage}`
          };
        }
      }
    });

    // Authentication refresh strategy
    this.recoveryStrategies.set('auth_refresh', {
      id: 'auth_refresh',
      name: 'Authentication Refresh',
      description: 'Refresh authentication tokens and retry',
      applicableErrors: ['authentication'],
      priority: 1,
      maxRetries: 2,
      backoffStrategy: 'fixed',
      baseDelay: 500,
      maxDelay: 1000,
      timeout: 10000,
      recoveryAction: async (error, attempt) => {
        try {
          const refreshed = await this.refreshAuthentication(error);
          if (refreshed) {
            return {
              success: true,
              recovered: true,
              fallbackUsed: false
            };
          }
          return {
            success: false,
            recovered: false,
            fallbackUsed: false,
            message: 'Token refresh failed'
          };
        } catch (refreshError) {
          const errorMessage = refreshError instanceof Error ? refreshError.message : 'Unknown error';
          return {
            success: false,
            recovered: false,
            fallbackUsed: false,
            message: `Auth refresh failed: ${errorMessage}`
          };
        }
      }
    });

    // Cache fallback strategy
    this.recoveryStrategies.set('cache_fallback', {
      id: 'cache_fallback',
      name: 'Cache Fallback',
      description: 'Fallback to cached data when fresh data is unavailable',
      applicableErrors: ['network', 'server'],
      priority: 2,
      maxRetries: 1,
      backoffStrategy: 'fixed',
      baseDelay: 0,
      maxDelay: 0,
      timeout: 5000,
      recoveryAction: async (error, attempt) => {
        try {
          const cachedData = await this.getCachedData(error);
          if (cachedData) {
            return {
              success: true,
              recovered: true,
              fallbackUsed: true,
              metadata: { dataSource: 'cache' }
            };
          }
          return {
            success: false,
            recovered: false,
            fallbackUsed: false,
            message: 'No cached data available'
          };
        } catch (cacheError) {
          const errorMessage = cacheError instanceof Error ? cacheError.message : 'Unknown error';
          return {
            success: false,
            recovered: false,
            fallbackUsed: false,
            message: `Cache fallback failed: ${errorMessage}`
          };
        }
      }
    });

    // API endpoint fallback strategy
    this.recoveryStrategies.set('endpoint_fallback', {
      id: 'endpoint_fallback',
      name: 'API Endpoint Fallback',
      description: 'Switch to backup API endpoints',
      applicableErrors: ['server', 'network'],
      priority: 2,
      maxRetries: 2,
      backoffStrategy: 'linear',
      baseDelay: 2000,
      maxDelay: 5000,
      timeout: 15000,
      recoveryAction: async (error, attempt) => {
        try {
          const result = await this.tryBackupEndpoint(error, attempt);
          return {
            success: result.success,
            recovered: result.success,
            fallbackUsed: true,
            metadata: { endpoint: result.endpoint }
          };
        } catch (endpointError) {
          const errorMessage = endpointError instanceof Error ? endpointError.message : 'Unknown error';
          return {
            success: false,
            recovered: false,
            fallbackUsed: false,
            message: `Endpoint fallback failed: ${errorMessage}`
          };
        }
      }
    });
  }

  /**
   * Initialize graceful degradation configuration
   */
  private initializeDegradationConfig(): void {
    // Product recommendations degradation
    this.degradationConfig.set('product_recommendations', {
      feature: 'product_recommendations',
      fallbackMode: 'cached',
      fallbackData: [],
      enabledInDegradation: ['basic_browse', 'search', 'checkout'],
      disabledInDegradation: ['ai_recommendations', 'personalized_feed'],
      userMessage: 'Personalized recommendations temporarily unavailable',
      recoveryTrigger: 'automatic',
      recoveryInterval: 300000 // 5 minutes
    });

    // Payment processing degradation
    this.degradationConfig.set('payment_processing', {
      feature: 'payment_processing',
      fallbackMode: 'basic',
      enabledInDegradation: ['credit_card', 'paypal'],
      disabledInDegradation: ['apple_pay', 'google_pay', 'buy_now_pay_later'],
      userMessage: 'Some payment methods temporarily unavailable',
      recoveryTrigger: 'manual',
      recoveryInterval: 600000 // 10 minutes
    });

    // Search functionality degradation
    this.degradationConfig.set('search_functionality', {
      feature: 'search_functionality',
      fallbackMode: 'basic',
      enabledInDegradation: ['basic_search', 'category_browse'],
      disabledInDegradation: ['ai_search', 'visual_search', 'voice_search'],
      userMessage: 'Advanced search features temporarily unavailable',
      recoveryTrigger: 'automatic',
      recoveryInterval: 180000 // 3 minutes
    });

    // User authentication degradation
    this.degradationConfig.set('user_authentication', {
      feature: 'user_authentication',
      fallbackMode: 'basic',
      enabledInDegradation: ['email_password', 'guest_checkout'],
      disabledInDegradation: ['social_login', 'passwordless', 'biometric'],
      userMessage: 'Some sign-in methods temporarily unavailable',
      recoveryTrigger: 'automatic',
      recoveryInterval: 120000 // 2 minutes
    });
  }

  /**
   * Classify error type based on error object and context
   */
  private classifyError(error: Error): ErrorContext['type'] {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (name.includes('network') || message.includes('network') || message.includes('fetch')) {
      return 'network';
    }
    if (name.includes('auth') || message.includes('unauthorized') || message.includes('authentication')) {
      return 'authentication';
    }
    if (message.includes('forbidden') || message.includes('access denied')) {
      return 'authorization';
    }
    if (name.includes('validation') || message.includes('validation') || message.includes('invalid')) {
      return 'validation';
    }
    if (message.includes('server') || message.includes('internal') || message.includes('500')) {
      return 'server';
    }
    if (message.includes('business') || message.includes('rule')) {
      return 'business';
    }

    return 'unknown';
  }

  /**
   * Calculate error severity
   */
  private calculateSeverity(error: Error, context: Partial<ErrorContext>): ErrorContext['severity'] {
    const message = error.message.toLowerCase();
    
    // Critical errors
    if (message.includes('payment') || message.includes('security') || message.includes('data loss')) {
      return 'critical';
    }
    
    // High severity
    if (message.includes('database') || message.includes('auth') || message.includes('server')) {
      return 'high';
    }
    
    // Medium severity
    if (message.includes('network') || message.includes('validation')) {
      return 'medium';
    }
    
    // Default to low
    return 'low';
  }

  /**
   * Find the best recovery strategy for an error
   */
  private findBestRecoveryStrategy(errorContext: ErrorContext): ErrorRecoveryStrategy | null {
    const applicableStrategies = Array.from(this.recoveryStrategies.values())
      .filter(strategy => strategy.applicableErrors.includes(errorContext.type))
      .sort((a, b) => a.priority - b.priority);

    return applicableStrategies[0] || null;
  }

  /**
   * Calculate delay for retry attempts
   */
  private calculateDelay(strategy: ErrorRecoveryStrategy, attempt: number): number {
    switch (strategy.backoffStrategy) {
      case 'exponential':
        return Math.min(strategy.baseDelay * Math.pow(2, attempt), strategy.maxDelay);
      case 'linear':
        return Math.min(strategy.baseDelay * (attempt + 1), strategy.maxDelay);
      case 'fixed':
      default:
        return strategy.baseDelay;
    }
  }

  /**
   * Create timeout promise
   */
  private timeoutPromise(timeout: number): Promise<ErrorRecoveryResult> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Recovery timeout'));
      }, timeout);
    });
  }

  /**
   * Check if circuit breaker is open
   */
  private isCircuitBreakerOpen(operation: string): boolean {
    const breaker = this.circuitBreakers.get(operation);
    if (!breaker) return false;

    if (breaker.isOpen) {
      // Check if enough time has passed to try again
      const timeSinceLastAttempt = Date.now() - breaker.lastAttempt.getTime();
      if (timeSinceLastAttempt > 60000) { // 1 minute
        breaker.isOpen = false;
        breaker.failures = 0;
        return false;
      }
      return true;
    }

    return false;
  }

  /**
   * Update circuit breaker state
   */
  private updateCircuitBreaker(operation: string, success: boolean): void {
    let breaker = this.circuitBreakers.get(operation);
    if (!breaker) {
      breaker = { isOpen: false, lastAttempt: new Date(), failures: 0 };
      this.circuitBreakers.set(operation, breaker);
    }

    breaker.lastAttempt = new Date();

    if (success) {
      breaker.failures = 0;
      breaker.isOpen = false;
    } else {
      breaker.failures++;
      if (breaker.failures >= 5) { // Open circuit after 5 failures
        breaker.isOpen = true;
      }
    }
  }

  /**
   * Reset circuit breaker
   */
  private resetCircuitBreaker(operation: string): void {
    const breaker = this.circuitBreakers.get(operation);
    if (breaker) {
      breaker.isOpen = false;
      breaker.failures = 0;
    }
  }

  /**
   * Helper methods for recovery strategies
   */
  private async retryNetworkOperation(errorContext: ErrorContext): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/retry-operation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorContext)
      });

      return { success: response.ok };
    } catch (error) {
      return { success: false };
    }
  }

  private async refreshAuthentication(errorContext: ErrorContext): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/refresh-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: errorContext.sessionId })
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private async getCachedData(errorContext: ErrorContext): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/cached-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ operation: errorContext.operation })
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private async tryBackupEndpoint(errorContext: ErrorContext, attempt: number): Promise<{
    success: boolean;
    endpoint?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/backup-endpoint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ operation: errorContext.operation, attempt })
      });

      const result = await response.json();
      return {
        success: response.ok,
        endpoint: result.endpoint
      };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Check if error is applicable for degradation
   */
  private isApplicableForDegradation(errorContext: ErrorContext, feature: string): boolean {
    const operation = errorContext.operation.toLowerCase();
    const featureLower = feature.toLowerCase();

    return operation.includes(featureLower.replace('_', '')) || 
           operation.includes(featureLower.split('_')[0]);
  }

  /**
   * Enable degraded mode for a feature
   */
  private async enableDegradedMode(feature: string, config: GracefulDegradationConfig): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/enable-degraded-mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feature, config })
      });
    } catch (error) {
      console.error('Error enabling degraded mode:', error);
    }
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log error to analytics
   */
  private async logError(errorContext: ErrorContext): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/log-error`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorContext)
      });
    } catch (error) {
      console.error('Error logging error:', error);
    }
  }

  /**
   * Update error analytics
   */
  private updateErrorAnalytics(errorContext: ErrorContext): void {
    const key = `${errorContext.type}_${errorContext.operation}`;
    let analytics = this.errorAnalytics.get(key);

    if (!analytics) {
      analytics = {
        errorId: key,
        frequency: 0,
        firstOccurrence: errorContext.timestamp,
        lastOccurrence: errorContext.timestamp,
        affectedUsers: 0,
        averageResolutionTime: 0,
        successfulRecoveries: 0,
        failedRecoveries: 0,
        userFeedback: {
          helpful: 0,
          notHelpful: 0,
          comments: []
        },
        patterns: {
          timeOfDay: {},
          dayOfWeek: {},
          userAgent: {},
          geolocation: {}
        }
      };
      this.errorAnalytics.set(key, analytics);
    }

    analytics.frequency++;
    analytics.lastOccurrence = errorContext.timestamp;

    // Update patterns
    const hour = errorContext.timestamp.getHours().toString();
    const day = errorContext.timestamp.getDay().toString();
    
    analytics.patterns.timeOfDay[hour] = (analytics.patterns.timeOfDay[hour] || 0) + 1;
    analytics.patterns.dayOfWeek[day] = (analytics.patterns.dayOfWeek[day] || 0) + 1;

    if (errorContext.userAgent) {
      const browser = errorContext.userAgent.split(' ')[0];
      analytics.patterns.userAgent[browser] = (analytics.patterns.userAgent[browser] || 0) + 1;
    }
  }

  /**
   * Start error analytics monitoring
   */
  private startErrorAnalytics(): void {
    setInterval(() => {
      this.generateErrorReport();
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Generate error report
   */
  private async generateErrorReport(): Promise<void> {
    try {
      const report = {
        timestamp: new Date(),
        analytics: Array.from(this.errorAnalytics.values()),
        circuitBreakers: Array.from(this.circuitBreakers.entries()).map(([operation, state]) => ({
          operation,
          ...state
        })),
        activeRetries: this.retryAttempts.size
      };

      await fetch(`${this.baseUrl}/error-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      });
    } catch (error) {
      console.error('Error generating error report:', error);
    }
  }

  /**
   * Get error analytics for dashboard
   */
  async getErrorAnalytics(timeframe: 'hour' | 'day' | 'week' = 'day'): Promise<{
    totalErrors: number;
    errorsByType: Record<string, number>;
    errorsBySeverity: Record<string, number>;
    recoveryRate: number;
    topErrors: Array<{ error: string; count: number; trend: 'up' | 'down' | 'stable' }>;
    circuitBreakerStatus: Array<{ operation: string; status: 'open' | 'closed'; failures: number }>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch error analytics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching error analytics:', error);
      return {
        totalErrors: 0,
        errorsByType: {},
        errorsBySeverity: {},
        recoveryRate: 0,
        topErrors: [],
        circuitBreakerStatus: []
      };
    }
  }
}

export default IntelligentErrorHandler;