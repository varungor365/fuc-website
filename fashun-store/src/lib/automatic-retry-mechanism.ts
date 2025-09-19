/**
 * Automatic Retry Mechanism Service
 * Provides intelligent retry logic with exponential backoff and circuit breakers
 */

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitterRange: number;
  timeoutMs: number;
  retryableErrors: string[];
  circuitBreakerThreshold: number;
  circuitBreakerResetTimeMs: number;
}

export interface RetryContext {
  operation: string;
  attempt: number;
  totalAttempts: number;
  lastError?: Error;
  startTime: number;
  metadata: Record<string, any>;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  totalTime: number;
  failureReasons: string[];
  recoveryStrategy?: string;
}

export interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailureTime: number;
  lastSuccessTime: number;
  nextAttemptTime: number;
}

export interface RetryAnalytics {
  operation: string;
  totalAttempts: number;
  successfulRetries: number;
  failedRetries: number;
  averageRetryTime: number;
  circuitBreakerActivations: number;
  commonFailureReasons: Record<string, number>;
  retryPatterns: {
    timeOfDay: Record<string, number>;
    errorType: Record<string, number>;
    recoveryTime: number[];
  };
}

class AutomaticRetryMechanism {
  private defaultConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitterRange: 0.1,
    timeoutMs: 60000,
    retryableErrors: [
      'network',
      'timeout',
      'rate_limit',
      'temporary_failure',
      'service_unavailable'
    ],
    circuitBreakerThreshold: 5,
    circuitBreakerResetTimeMs: 60000
  };

  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private retryAnalytics: Map<string, RetryAnalytics> = new Map();
  private activeRetries: Map<string, Promise<any>> = new Map();

  constructor(private baseUrl = '/api/retry-mechanism') {
    this.startAnalyticsReporting();
  }

  /**
   * Execute operation with automatic retry
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    config?: Partial<RetryConfig>
  ): Promise<RetryResult<T>> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const startTime = Date.now();
    const failureReasons: string[] = [];
    
    // Check if we already have an active retry for this operation
    const retryKey = `${operationName}_${JSON.stringify(config)}`;
    if (this.activeRetries.has(retryKey)) {
      try {
        const result = await this.activeRetries.get(retryKey);
        return result;
      } catch (error) {
        // Continue with new retry if existing one failed
      }
    }

    // Check circuit breaker
    const circuitState = this.getCircuitBreakerState(operationName);
    if (circuitState.state === 'open') {
      const timeUntilRetry = circuitState.nextAttemptTime - Date.now();
      if (timeUntilRetry > 0) {
        return {
          success: false,
          error: new Error(`Circuit breaker is open. Retry in ${Math.ceil(timeUntilRetry / 1000)}s`),
          attempts: 0,
          totalTime: Date.now() - startTime,
          failureReasons: ['circuit_breaker_open']
        };
      } else {
        // Transition to half-open
        this.updateCircuitBreakerState(operationName, {
          ...circuitState,
          state: 'half-open'
        });
      }
    }

    const retryPromise = this.performRetryLogic(
      operation,
      operationName,
      finalConfig,
      startTime,
      failureReasons
    );

    this.activeRetries.set(retryKey, retryPromise);

    try {
      const result = await retryPromise;
      return result;
    } finally {
      this.activeRetries.delete(retryKey);
    }
  }

  /**
   * Perform the actual retry logic
   */
  private async performRetryLogic<T>(
    operation: () => Promise<T>,
    operationName: string,
    config: RetryConfig,
    startTime: number,
    failureReasons: string[]
  ): Promise<RetryResult<T>> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      const context: RetryContext = {
        operation: operationName,
        attempt,
        totalAttempts: config.maxAttempts,
        lastError,
        startTime,
        metadata: {}
      };

      try {
        // Add timeout wrapper
        const result = await this.withTimeout(operation(), config.timeoutMs);
        
        // Success - update circuit breaker and analytics
        this.onRetrySuccess(operationName, attempt, Date.now() - startTime);
        
        return {
          success: true,
          data: result,
          attempts: attempt,
          totalTime: Date.now() - startTime,
          failureReasons,
          recoveryStrategy: attempt > 1 ? 'retry' : undefined
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const errorType = this.classifyError(lastError);
        failureReasons.push(errorType);

        // Check if error is retryable
        if (!this.isRetryableError(lastError, config)) {
          this.onRetryFailure(operationName, attempt, errorType);
          return {
            success: false,
            error: lastError,
            attempts: attempt,
            totalTime: Date.now() - startTime,
            failureReasons
          };
        }

        // Don't wait after last attempt
        if (attempt < config.maxAttempts) {
          const delay = this.calculateDelay(attempt, config);
          await this.sleep(delay);
        }

        // Update analytics
        this.updateRetryAnalytics(operationName, context, errorType);
      }
    }

    // All attempts failed
    this.onRetryFailure(operationName, config.maxAttempts, failureReasons[failureReasons.length - 1]);
    
    return {
      success: false,
      error: lastError,
      attempts: config.maxAttempts,
      totalTime: Date.now() - startTime,
      failureReasons
    };
  }

  /**
   * Execute with intelligent fallback strategies
   */
  async executeWithFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperations: Array<() => Promise<T>>,
    operationName: string,
    config?: Partial<RetryConfig>
  ): Promise<RetryResult<T>> {
    // Try primary operation first
    let result = await this.executeWithRetry(primaryOperation, `${operationName}_primary`, config);
    
    if (result.success) {
      return result;
    }

    // Try fallback operations
    for (let i = 0; i < fallbackOperations.length; i++) {
      const fallbackResult = await this.executeWithRetry(
        fallbackOperations[i],
        `${operationName}_fallback_${i + 1}`,
        { ...config, maxAttempts: Math.min(config?.maxAttempts || 2, 2) }
      );

      if (fallbackResult.success) {
        return {
          ...fallbackResult,
          recoveryStrategy: `fallback_${i + 1}`
        };
      }
    }

    // All operations failed
    return {
      success: false,
      error: result.error,
      attempts: result.attempts + fallbackOperations.length,
      totalTime: result.totalTime,
      failureReasons: result.failureReasons
    };
  }

  /**
   * Batch retry operations with coordination
   */
  async executeBatchWithRetry<T>(
    operations: Array<{
      operation: () => Promise<T>;
      name: string;
      config?: Partial<RetryConfig>;
    }>,
    batchConfig?: {
      failFast?: boolean;
      maxConcurrent?: number;
      retryFailedOnly?: boolean;
    }
  ): Promise<{
    results: Array<RetryResult<T>>;
    summary: {
      totalOperations: number;
      successful: number;
      failed: number;
      totalTime: number;
    };
  }> {
    const config = {
      failFast: false,
      maxConcurrent: 5,
      retryFailedOnly: true,
      ...batchConfig
    };

    const startTime = Date.now();
    const results: Array<RetryResult<T>> = [];
    const chunks = this.chunkArray(operations, config.maxConcurrent);

    for (const chunk of chunks) {
      const promises = chunk.map(({ operation, name, config: opConfig }) =>
        this.executeWithRetry(operation, name, opConfig)
      );

      if (config.failFast) {
        // Fail fast - stop on first failure
        try {
          const chunkResults = await Promise.all(promises);
          results.push(...chunkResults);
        } catch (error) {
          // Add partial results and stop
          for (let i = 0; i < promises.length; i++) {
            try {
              const result = await promises[i];
              results.push(result);
            } catch {
              results.push({
                success: false,
                error: new Error('Batch operation cancelled'),
                attempts: 0,
                totalTime: 0,
                failureReasons: ['batch_cancelled']
              });
            }
          }
          break;
        }
      } else {
        // Continue on failures
        const chunkResults = await Promise.allSettled(promises);
        results.push(...chunkResults.map(result => 
          result.status === 'fulfilled' 
            ? result.value 
            : {
                success: false,
                error: new Error('Promise rejected'),
                attempts: 0,
                totalTime: 0,
                failureReasons: ['promise_rejected']
              }
        ));
      }
    }

    // Retry failed operations if configured
    if (config.retryFailedOnly) {
      const failedOperations = operations.filter((_, index) => !results[index]?.success);
      
      if (failedOperations.length > 0) {
        const retryResults = await this.executeBatchWithRetry(
          failedOperations,
          { ...config, retryFailedOnly: false }
        );

        // Update results with retry outcomes
        let retryIndex = 0;
        for (let i = 0; i < results.length; i++) {
          if (!results[i].success) {
            results[i] = retryResults.results[retryIndex++];
          }
        }
      }
    }

    const summary = {
      totalOperations: operations.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      totalTime: Date.now() - startTime
    };

    return { results, summary };
  }

  /**
   * Smart retry with adaptive configuration
   */
  async executeWithAdaptiveRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    learningConfig?: {
      enableLearning?: boolean;
      adaptationRate?: number;
      successThreshold?: number;
    }
  ): Promise<RetryResult<T>> {
    const learning = {
      enableLearning: true,
      adaptationRate: 0.1,
      successThreshold: 0.8,
      ...learningConfig
    };

    // Get historical analytics to adapt configuration
    const analytics = this.retryAnalytics.get(operationName);
    let adaptedConfig = { ...this.defaultConfig };

    if (learning.enableLearning && analytics) {
      adaptedConfig = this.adaptConfigurationFromAnalytics(analytics, learning);
    }

    const result = await this.executeWithRetry(operation, operationName, adaptedConfig);

    // Update learning model with result
    if (learning.enableLearning) {
      this.updateLearningModel(operationName, result, adaptedConfig);
    }

    return result;
  }

  /**
   * Helper methods
   */
  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        setTimeout(() => reject(new Error('Operation timeout')), timeoutMs);
      })
    ]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    const exponentialDelay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);
    const cappedDelay = Math.min(exponentialDelay, config.maxDelay);
    
    // Add jitter to avoid thundering herd
    const jitter = cappedDelay * config.jitterRange * (Math.random() - 0.5);
    
    return Math.max(0, cappedDelay + jitter);
  }

  private classifyError(error: Error): string {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (message.includes('network') || message.includes('fetch')) return 'network';
    if (message.includes('timeout')) return 'timeout';
    if (message.includes('rate limit')) return 'rate_limit';
    if (message.includes('service unavailable') || message.includes('502') || message.includes('503')) return 'service_unavailable';
    if (message.includes('temporary')) return 'temporary_failure';
    if (message.includes('auth')) return 'authentication';
    if (message.includes('validation')) return 'validation';
    
    return 'unknown';
  }

  private isRetryableError(error: Error, config: RetryConfig): boolean {
    const errorType = this.classifyError(error);
    return config.retryableErrors.includes(errorType);
  }

  private getCircuitBreakerState(operation: string): CircuitBreakerState {
    let state = this.circuitBreakers.get(operation);
    
    if (!state) {
      state = {
        state: 'closed',
        failures: 0,
        lastFailureTime: 0,
        lastSuccessTime: 0,
        nextAttemptTime: 0
      };
      this.circuitBreakers.set(operation, state);
    }

    return state;
  }

  private updateCircuitBreakerState(operation: string, newState: CircuitBreakerState): void {
    this.circuitBreakers.set(operation, newState);
  }

  private onRetrySuccess(operation: string, attempts: number, totalTime: number): void {
    const state = this.getCircuitBreakerState(operation);
    
    this.updateCircuitBreakerState(operation, {
      ...state,
      state: 'closed',
      failures: 0,
      lastSuccessTime: Date.now()
    });

    this.updateSuccessAnalytics(operation, attempts, totalTime);
  }

  private onRetryFailure(operation: string, attempts: number, errorType: string): void {
    const state = this.getCircuitBreakerState(operation);
    const newFailures = state.failures + 1;

    if (newFailures >= this.defaultConfig.circuitBreakerThreshold) {
      this.updateCircuitBreakerState(operation, {
        ...state,
        state: 'open',
        failures: newFailures,
        lastFailureTime: Date.now(),
        nextAttemptTime: Date.now() + this.defaultConfig.circuitBreakerResetTimeMs
      });
    } else {
      this.updateCircuitBreakerState(operation, {
        ...state,
        failures: newFailures,
        lastFailureTime: Date.now()
      });
    }

    this.updateFailureAnalytics(operation, attempts, errorType);
  }

  private updateRetryAnalytics(operation: string, context: RetryContext, errorType: string): void {
    let analytics = this.retryAnalytics.get(operation);
    
    if (!analytics) {
      analytics = {
        operation,
        totalAttempts: 0,
        successfulRetries: 0,
        failedRetries: 0,
        averageRetryTime: 0,
        circuitBreakerActivations: 0,
        commonFailureReasons: {},
        retryPatterns: {
          timeOfDay: {},
          errorType: {},
          recoveryTime: []
        }
      };
      this.retryAnalytics.set(operation, analytics);
    }

    analytics.totalAttempts++;
    analytics.commonFailureReasons[errorType] = (analytics.commonFailureReasons[errorType] || 0) + 1;

    const hour = new Date().getHours().toString();
    analytics.retryPatterns.timeOfDay[hour] = (analytics.retryPatterns.timeOfDay[hour] || 0) + 1;
    analytics.retryPatterns.errorType[errorType] = (analytics.retryPatterns.errorType[errorType] || 0) + 1;
  }

  private updateSuccessAnalytics(operation: string, attempts: number, totalTime: number): void {
    const analytics = this.retryAnalytics.get(operation);
    if (analytics) {
      analytics.successfulRetries++;
      analytics.retryPatterns.recoveryTime.push(totalTime);
      
      // Update average retry time
      const totalRetryTime = analytics.retryPatterns.recoveryTime.reduce((sum, time) => sum + time, 0);
      analytics.averageRetryTime = totalRetryTime / analytics.retryPatterns.recoveryTime.length;
    }
  }

  private updateFailureAnalytics(operation: string, attempts: number, errorType: string): void {
    const analytics = this.retryAnalytics.get(operation);
    if (analytics) {
      analytics.failedRetries++;
      
      if (this.getCircuitBreakerState(operation).state === 'open') {
        analytics.circuitBreakerActivations++;
      }
    }
  }

  private adaptConfigurationFromAnalytics(
    analytics: RetryAnalytics,
    learningConfig: { adaptationRate: number; successThreshold: number }
  ): RetryConfig {
    const successRate = analytics.successfulRetries / (analytics.successfulRetries + analytics.failedRetries);
    const adaptedConfig = { ...this.defaultConfig };

    // Adapt max attempts based on success rate
    if (successRate < learningConfig.successThreshold) {
      adaptedConfig.maxAttempts = Math.min(
        adaptedConfig.maxAttempts + Math.ceil(learningConfig.adaptationRate * 5),
        10
      );
    } else if (successRate > 0.9) {
      adaptedConfig.maxAttempts = Math.max(
        adaptedConfig.maxAttempts - Math.ceil(learningConfig.adaptationRate * 2),
        1
      );
    }

    // Adapt base delay based on average retry time
    if (analytics.averageRetryTime > 0) {
      const optimalDelay = analytics.averageRetryTime / adaptedConfig.maxAttempts;
      adaptedConfig.baseDelay = Math.max(
        Math.min(optimalDelay, adaptedConfig.maxDelay / 4),
        500
      );
    }

    return adaptedConfig;
  }

  private updateLearningModel(
    operation: string,
    result: RetryResult<any>,
    config: RetryConfig
  ): void {
    // Store learning data for future adaptations
    const learningData = {
      operation,
      timestamp: Date.now(),
      config,
      result: {
        success: result.success,
        attempts: result.attempts,
        totalTime: result.totalTime,
        failureReasons: result.failureReasons
      }
    };

    // In a real implementation, this would be stored in a database
    // or sent to a machine learning service
    this.sendLearningData(learningData);
  }

  private async sendLearningData(data: any): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/learning-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      // Silently fail - learning is non-critical
    }
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private startAnalyticsReporting(): void {
    setInterval(() => {
      this.sendAnalyticsReport();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private async sendAnalyticsReport(): Promise<void> {
    try {
      const report = {
        timestamp: Date.now(),
        analytics: Array.from(this.retryAnalytics.values()),
        circuitBreakers: Array.from(this.circuitBreakers.entries()).map(([operation, state]) => ({
          operation,
          ...state
        })),
        activeRetries: this.activeRetries.size
      };

      await fetch(`${this.baseUrl}/analytics-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      });
    } catch (error) {
      // Silently fail - reporting is non-critical
    }
  }

  /**
   * Get retry analytics for monitoring
   */
  async getRetryAnalytics(operation?: string): Promise<{
    operations: RetryAnalytics[];
    circuitBreakers: Array<{ operation: string; state: CircuitBreakerState }>;
    activeRetries: number;
    summary: {
      totalOperations: number;
      averageSuccessRate: number;
      averageRetryTime: number;
      circuitBreakerActivations: number;
    };
  }> {
    try {
      const url = operation 
        ? `${this.baseUrl}/analytics?operation=${operation}`
        : `${this.baseUrl}/analytics`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch retry analytics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching retry analytics:', error);
      return {
        operations: [],
        circuitBreakers: [],
        activeRetries: 0,
        summary: {
          totalOperations: 0,
          averageSuccessRate: 0,
          averageRetryTime: 0,
          circuitBreakerActivations: 0
        }
      };
    }
  }
}

export default AutomaticRetryMechanism;