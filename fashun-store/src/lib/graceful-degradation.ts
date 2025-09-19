/**
 * Graceful Degradation Service
 * Manages feature degradation and fallback modes when services are unavailable
 */

export interface FeatureConfig {
  name: string;
  description: string;
  category: 'core' | 'enhanced' | 'optional';
  dependencies: string[];
  fallbackModes: FallbackMode[];
  healthCheck: () => Promise<boolean>;
  enableGracefulDegradation: boolean;
  criticalityScore: number; // 1-10, higher is more critical
}

export interface FallbackMode {
  name: string;
  description: string;
  performance: 'full' | 'reduced' | 'minimal' | 'cached';
  userExperience: 'normal' | 'degraded' | 'basic';
  dataSource: 'live' | 'cached' | 'mock' | 'disabled';
  enabledFeatures: string[];
  disabledFeatures: string[];
  userMessage?: string;
  technicalMessage?: string;
  activationConditions: {
    errorThreshold: number;
    timeWindow: number;
    dependencies: string[];
    manualOverride?: boolean;
  };
}

export interface DegradationStatus {
  feature: string;
  isActive: boolean;
  activeFallbackMode?: FallbackMode;
  reason: string;
  activatedAt: Date;
  estimatedRecoveryTime?: Date;
  affectedUsers: number;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  automaticRecovery: boolean;
}

export interface HealthCheckResult {
  feature: string;
  healthy: boolean;
  responseTime: number;
  lastChecked: Date;
  errorRate: number;
  consecutiveFailures: number;
  dependencies: Record<string, boolean>;
}

export interface DegradationEvent {
  id: string;
  type: 'activation' | 'deactivation' | 'mode_change' | 'recovery';
  feature: string;
  timestamp: Date;
  previousMode?: string;
  newMode?: string;
  reason: string;
  impact: {
    affectedFeatures: string[];
    estimatedUserImpact: number;
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
  };
  metadata: Record<string, any>;
}

class GracefulDegradationService {
  private features: Map<string, FeatureConfig> = new Map();
  private degradationStatus: Map<string, DegradationStatus> = new Map();
  private healthChecks: Map<string, HealthCheckResult> = new Map();
  private degradationEvents: DegradationEvent[] = [];
  private activeMonitoring: Map<string, NodeJS.Timeout> = new Map();
  private baseUrl = '/api/degradation';

  constructor() {
    this.initializeDefaultFeatures();
    this.startHealthMonitoring();
  }

  /**
   * Register a feature for graceful degradation
   */
  registerFeature(config: FeatureConfig): void {
    this.features.set(config.name, config);
    
    // Initialize health check
    this.healthChecks.set(config.name, {
      feature: config.name,
      healthy: true,
      responseTime: 0,
      lastChecked: new Date(),
      errorRate: 0,
      consecutiveFailures: 0,
      dependencies: {}
    });

    // Start monitoring if enabled
    if (config.enableGracefulDegradation) {
      this.startFeatureMonitoring(config.name);
    }
  }

  /**
   * Check if a feature should be degraded
   */
  async evaluateFeatureDegradation(
    featureName: string,
    errorCount: number = 0,
    timeWindow: number = 300000 // 5 minutes
  ): Promise<{
    shouldDegrade: boolean;
    recommendedMode?: FallbackMode;
    reason: string;
  }> {
    const feature = this.features.get(featureName);
    if (!feature) {
      return {
        shouldDegrade: false,
        reason: 'Feature not registered'
      };
    }

    // Check current health
    const health = await this.performHealthCheck(feature);
    
    // Check dependencies
    const dependencyStatus = await this.checkDependencies(feature.dependencies);
    const healthyDependencies = Object.values(dependencyStatus).filter(Boolean).length;
    const totalDependencies = Object.keys(dependencyStatus).length;

    // Determine if degradation is needed
    let shouldDegrade = false;
    let reason = '';
    let recommendedMode: FallbackMode | undefined;

    // Primary health check failure
    if (!health.healthy) {
      shouldDegrade = true;
      reason = `Health check failed: ${health.consecutiveFailures} consecutive failures`;
    }

    // Dependency failures
    if (totalDependencies > 0 && healthyDependencies / totalDependencies < 0.5) {
      shouldDegrade = true;
      reason = `Dependencies failing: ${totalDependencies - healthyDependencies}/${totalDependencies}`;
    }

    // Error rate threshold
    if (health.errorRate > 0.1) { // 10% error rate
      shouldDegrade = true;
      reason = `High error rate: ${(health.errorRate * 100).toFixed(1)}%`;
    }

    // Manual override check
    const currentStatus = this.degradationStatus.get(featureName);
    if (currentStatus?.activeFallbackMode?.activationConditions.manualOverride) {
      shouldDegrade = true;
      reason = 'Manual override activated';
    }

    // Find appropriate fallback mode
    if (shouldDegrade) {
      recommendedMode = this.selectOptimalFallbackMode(
        feature,
        health,
        dependencyStatus,
        errorCount
      );
    }

    return {
      shouldDegrade,
      recommendedMode,
      reason
    };
  }

  /**
   * Activate degradation for a feature
   */
  async activateDegradation(
    featureName: string,
    fallbackMode: FallbackMode,
    reason: string,
    manual: boolean = false
  ): Promise<boolean> {
    try {
      const feature = this.features.get(featureName);
      if (!feature) {
        throw new Error(`Feature ${featureName} not found`);
      }

      // Calculate impact
      const impact = await this.calculateDegradationImpact(feature, fallbackMode);

      // Create degradation status
      const status: DegradationStatus = {
        feature: featureName,
        isActive: true,
        activeFallbackMode: fallbackMode,
        reason,
        activatedAt: new Date(),
        estimatedRecoveryTime: this.estimateRecoveryTime(fallbackMode),
        affectedUsers: impact.estimatedUserImpact,
        impactLevel: impact.businessImpact,
        automaticRecovery: !manual
      };

      this.degradationStatus.set(featureName, status);

      // Log degradation event
      const event: DegradationEvent = {
        id: this.generateEventId(),
        type: 'activation',
        feature: featureName,
        timestamp: new Date(),
        newMode: fallbackMode.name,
        reason,
        impact,
        metadata: {
          manual,
          fallbackMode: fallbackMode.name
        }
      };

      this.degradationEvents.push(event);

      // Apply degradation configuration
      await this.applyDegradationConfig(featureName, fallbackMode);

      // Notify stakeholders
      await this.notifyDegradationActivation(status, event);

      return true;

    } catch (error) {
      console.error(`Failed to activate degradation for ${featureName}:`, error);
      return false;
    }
  }

  /**
   * Deactivate degradation and restore normal operation
   */
  async deactivateDegradation(
    featureName: string,
    reason: string = 'Service recovered'
  ): Promise<boolean> {
    try {
      const status = this.degradationStatus.get(featureName);
      if (!status || !status.isActive) {
        return false;
      }

      // Verify feature is healthy before restoration
      const feature = this.features.get(featureName);
      if (feature) {
        const health = await this.performHealthCheck(feature);
        if (!health.healthy) {
          console.warn(`Attempted to restore unhealthy feature: ${featureName}`);
          return false;
        }
      }

      // Update status
      status.isActive = false;
      this.degradationStatus.set(featureName, status);

      // Log recovery event
      const event: DegradationEvent = {
        id: this.generateEventId(),
        type: 'recovery',
        feature: featureName,
        timestamp: new Date(),
        previousMode: status.activeFallbackMode?.name,
        reason,
        impact: {
          affectedFeatures: [],
          estimatedUserImpact: 0,
          businessImpact: 'low'
        },
        metadata: {
          recoveryTime: Date.now() - status.activatedAt.getTime()
        }
      };

      this.degradationEvents.push(event);

      // Restore normal configuration
      await this.restoreNormalOperation(featureName);

      // Notify stakeholders
      await this.notifyDegradationRecovery(status, event);

      return true;

    } catch (error) {
      console.error(`Failed to deactivate degradation for ${featureName}:`, error);
      return false;
    }
  }

  /**
   * Get current degradation status for all features
   */
  getDegradationStatus(): {
    active: DegradationStatus[];
    inactive: string[];
    summary: {
      totalFeatures: number;
      degradedFeatures: number;
      healthyFeatures: number;
      criticalDegradations: number;
    };
  } {
    const allStatuses = Array.from(this.degradationStatus.values());
    const active = allStatuses.filter(status => status.isActive);
    const inactive = Array.from(this.features.keys()).filter(
      name => !this.degradationStatus.get(name)?.isActive
    );

    return {
      active,
      inactive,
      summary: {
        totalFeatures: this.features.size,
        degradedFeatures: active.length,
        healthyFeatures: inactive.length,
        criticalDegradations: active.filter(status => status.impactLevel === 'critical').length
      }
    };
  }

  /**
   * Check if a specific feature is degraded
   */
  isFeatureDegraded(featureName: string): {
    degraded: boolean;
    mode?: string;
    reason?: string;
    since?: Date;
  } {
    const status = this.degradationStatus.get(featureName);
    
    if (!status || !status.isActive) {
      return { degraded: false };
    }

    return {
      degraded: true,
      mode: status.activeFallbackMode?.name,
      reason: status.reason,
      since: status.activatedAt
    };
  }

  /**
   * Get fallback configuration for a feature
   */
  getFallbackConfig(featureName: string): {
    enabledFeatures: string[];
    disabledFeatures: string[];
    userMessage?: string;
    performance: string;
    dataSource: string;
  } | null {
    const status = this.degradationStatus.get(featureName);
    
    if (!status?.isActive || !status.activeFallbackMode) {
      return null;
    }

    const mode = status.activeFallbackMode;
    return {
      enabledFeatures: mode.enabledFeatures,
      disabledFeatures: mode.disabledFeatures,
      userMessage: mode.userMessage,
      performance: mode.performance,
      dataSource: mode.dataSource
    };
  }

  /**
   * Private helper methods
   */
  private async performHealthCheck(feature: FeatureConfig): Promise<HealthCheckResult> {
    const startTime = Date.now();
    let healthy = false;
    let error: Error | null = null;

    try {
      healthy = await Promise.race([
        feature.healthCheck(),
        new Promise<boolean>((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), 10000)
        )
      ]);
    } catch (e) {
      error = e instanceof Error ? e : new Error(String(e));
      healthy = false;
    }

    const responseTime = Date.now() - startTime;
    const existingHealth = this.healthChecks.get(feature.name);
    
    const result: HealthCheckResult = {
      feature: feature.name,
      healthy,
      responseTime,
      lastChecked: new Date(),
      errorRate: this.calculateErrorRate(feature.name, !healthy),
      consecutiveFailures: healthy 
        ? 0 
        : (existingHealth?.consecutiveFailures || 0) + 1,
      dependencies: await this.checkDependencies(feature.dependencies)
    };

    this.healthChecks.set(feature.name, result);
    return result;
  }

  private async checkDependencies(dependencies: string[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const dependency of dependencies) {
      try {
        const response = await fetch(`${this.baseUrl}/dependency-health/${dependency}`, {
          method: 'GET',
          timeout: 5000
        } as any);
        results[dependency] = response.ok;
      } catch {
        results[dependency] = false;
      }
    }

    return results;
  }

  private selectOptimalFallbackMode(
    feature: FeatureConfig,
    health: HealthCheckResult,
    dependencies: Record<string, boolean>,
    errorCount: number
  ): FallbackMode {
    // Sort fallback modes by severity (least to most degraded)
    const sortedModes = [...feature.fallbackModes].sort((a, b) => {
      const severityOrder = { full: 0, reduced: 1, minimal: 2, cached: 3 };
      return severityOrder[a.performance] - severityOrder[b.performance];
    });

    // Select mode based on failure severity
    if (health.consecutiveFailures > 5 || health.errorRate > 0.5) {
      // Severe issues - use most conservative mode
      return sortedModes[sortedModes.length - 1];
    } else if (health.consecutiveFailures > 2 || health.errorRate > 0.2) {
      // Moderate issues - use middle-ground mode
      const middleIndex = Math.floor(sortedModes.length / 2);
      return sortedModes[middleIndex];
    } else {
      // Minor issues - use least degraded mode
      return sortedModes[0];
    }
  }

  private async calculateDegradationImpact(
    feature: FeatureConfig,
    fallbackMode: FallbackMode
  ): Promise<{
    affectedFeatures: string[];
    estimatedUserImpact: number;
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/impact-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feature: feature.name,
          fallbackMode: fallbackMode.name,
          disabledFeatures: fallbackMode.disabledFeatures
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to calculate degradation impact:', error);
    }

    // Fallback calculation
    return {
      affectedFeatures: fallbackMode.disabledFeatures,
      estimatedUserImpact: this.estimateUserImpact(feature, fallbackMode),
      businessImpact: this.assessBusinessImpact(feature, fallbackMode)
    };
  }

  private estimateUserImpact(feature: FeatureConfig, fallbackMode: FallbackMode): number {
    // Simple estimation based on feature criticality and fallback performance
    const baseImpact = feature.criticalityScore * 1000; // Users potentially affected
    const performanceMultiplier = {
      full: 0,
      reduced: 0.3,
      minimal: 0.7,
      cached: 0.5
    };

    return Math.floor(baseImpact * (performanceMultiplier[fallbackMode.performance] || 1));
  }

  private assessBusinessImpact(
    feature: FeatureConfig,
    fallbackMode: FallbackMode
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (feature.category === 'core' && fallbackMode.performance === 'minimal') {
      return 'critical';
    } else if (feature.category === 'core' && fallbackMode.performance === 'reduced') {
      return 'high';
    } else if (feature.category === 'enhanced' && fallbackMode.performance === 'minimal') {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private estimateRecoveryTime(fallbackMode: FallbackMode): Date {
    // Estimate based on fallback mode complexity
    const recoveryMinutes = {
      full: 5,
      reduced: 15,
      minimal: 30,
      cached: 10
    };

    const minutes = recoveryMinutes[fallbackMode.performance] || 15;
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  private async applyDegradationConfig(
    featureName: string,
    fallbackMode: FallbackMode
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/apply-degradation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feature: featureName,
          config: {
            enabledFeatures: fallbackMode.enabledFeatures,
            disabledFeatures: fallbackMode.disabledFeatures,
            dataSource: fallbackMode.dataSource,
            performance: fallbackMode.performance
          }
        })
      });
    } catch (error) {
      console.error('Failed to apply degradation config:', error);
    }
  }

  private async restoreNormalOperation(featureName: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/restore-normal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feature: featureName })
      });
    } catch (error) {
      console.error('Failed to restore normal operation:', error);
    }
  }

  private calculateErrorRate(featureName: string, hasError: boolean): number {
    // Simple sliding window error rate calculation
    // In production, this would use a proper time series database
    const key = `error_rate_${featureName}`;
    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 minutes

    // This is a simplified implementation
    // Real implementation would track errors over time
    return hasError ? 0.1 : 0.05; // Placeholder values
  }

  private startFeatureMonitoring(featureName: string): void {
    const feature = this.features.get(featureName);
    if (!feature) return;

    const interval = setInterval(async () => {
      const evaluation = await this.evaluateFeatureDegradation(featureName);
      
      if (evaluation.shouldDegrade && evaluation.recommendedMode) {
        const currentStatus = this.degradationStatus.get(featureName);
        
        if (!currentStatus?.isActive) {
          await this.activateDegradation(
            featureName,
            evaluation.recommendedMode,
            evaluation.reason
          );
        }
      } else {
        const currentStatus = this.degradationStatus.get(featureName);
        
        if (currentStatus?.isActive && currentStatus.automaticRecovery) {
          await this.deactivateDegradation(featureName, 'Service recovered');
        }
      }
    }, 30000); // Check every 30 seconds

    this.activeMonitoring.set(featureName, interval);
  }

  private startHealthMonitoring(): void {
    setInterval(() => {
      this.generateHealthReport();
    }, 60000); // Generate report every minute
  }

  private async generateHealthReport(): Promise<void> {
    try {
      const report = {
        timestamp: Date.now(),
        features: Array.from(this.healthChecks.values()),
        degradations: Array.from(this.degradationStatus.values()),
        events: this.degradationEvents.slice(-50) // Last 50 events
      };

      await fetch(`${this.baseUrl}/health-report`, {
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

  private async notifyDegradationActivation(
    status: DegradationStatus,
    event: DegradationEvent
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/notify-degradation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'activation',
          status,
          event
        })
      });
    } catch (error) {
      console.error('Failed to send degradation notification:', error);
    }
  }

  private async notifyDegradationRecovery(
    status: DegradationStatus,
    event: DegradationEvent
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/notify-recovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'recovery',
          status,
          event
        })
      });
    } catch (error) {
      console.error('Failed to send recovery notification:', error);
    }
  }

  private generateEventId(): string {
    return `deg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeDefaultFeatures(): void {
    // Initialize common e-commerce features with degradation configs
    
    // Product Search
    this.registerFeature({
      name: 'product_search',
      description: 'AI-powered product search and recommendations',
      category: 'enhanced',
      dependencies: ['elasticsearch', 'recommendation_engine'],
      enableGracefulDegradation: true,
      criticalityScore: 7,
      healthCheck: async () => {
        try {
          const response = await fetch('/api/search/health', { timeout: 5000 } as any);
          return response.ok;
        } catch {
          return false;
        }
      },
      fallbackModes: [
        {
          name: 'basic_search',
          description: 'Basic text search without AI enhancements',
          performance: 'reduced',
          userExperience: 'degraded',
          dataSource: 'live',
          enabledFeatures: ['text_search', 'category_filter'],
          disabledFeatures: ['ai_recommendations', 'visual_search', 'voice_search'],
          userMessage: 'Advanced search features temporarily unavailable',
          activationConditions: {
            errorThreshold: 3,
            timeWindow: 300000,
            dependencies: ['elasticsearch']
          }
        },
        {
          name: 'cached_search',
          description: 'Cached search results only',
          performance: 'minimal',
          userExperience: 'basic',
          dataSource: 'cached',
          enabledFeatures: ['cached_results'],
          disabledFeatures: ['live_search', 'filtering', 'sorting'],
          userMessage: 'Showing cached search results',
          activationConditions: {
            errorThreshold: 5,
            timeWindow: 300000,
            dependencies: []
          }
        }
      ]
    });

    // Payment Processing
    this.registerFeature({
      name: 'payment_processing',
      description: 'Multi-provider payment processing',
      category: 'core',
      dependencies: ['stripe', 'paypal', 'fraud_detection'],
      enableGracefulDegradation: true,
      criticalityScore: 10,
      healthCheck: async () => {
        try {
          const response = await fetch('/api/payments/health', { timeout: 5000 } as any);
          return response.ok;
        } catch {
          return false;
        }
      },
      fallbackModes: [
        {
          name: 'single_provider',
          description: 'Single payment provider only',
          performance: 'reduced',
          userExperience: 'degraded',
          dataSource: 'live',
          enabledFeatures: ['credit_card'],
          disabledFeatures: ['paypal', 'apple_pay', 'google_pay'],
          userMessage: 'Some payment methods temporarily unavailable',
          activationConditions: {
            errorThreshold: 2,
            timeWindow: 300000,
            dependencies: ['stripe']
          }
        }
      ]
    });

    // User Recommendations
    this.registerFeature({
      name: 'user_recommendations',
      description: 'Personalized product recommendations',
      category: 'enhanced',
      dependencies: ['ml_service', 'user_behavior_tracking'],
      enableGracefulDegradation: true,
      criticalityScore: 6,
      healthCheck: async () => {
        try {
          const response = await fetch('/api/recommendations/health', { timeout: 5000 } as any);
          return response.ok;
        } catch {
          return false;
        }
      },
      fallbackModes: [
        {
          name: 'popularity_based',
          description: 'Popular products instead of personalized',
          performance: 'reduced',
          userExperience: 'degraded',
          dataSource: 'cached',
          enabledFeatures: ['popular_products', 'trending_items'],
          disabledFeatures: ['personalized_recommendations', 'ai_suggestions'],
          userMessage: 'Showing popular products',
          activationConditions: {
            errorThreshold: 3,
            timeWindow: 300000,
            dependencies: []
          }
        }
      ]
    });
  }

  /**
   * Get degradation analytics for monitoring
   */
  async getDegradationAnalytics(timeframe: 'hour' | 'day' | 'week' = 'day'): Promise<{
    totalDegradations: number;
    averageDegradationTime: number;
    mostDegradedFeatures: Array<{ feature: string; count: number }>;
    impactDistribution: Record<string, number>;
    recoveryRate: number;
    healthScore: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch degradation analytics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching degradation analytics:', error);
      return {
        totalDegradations: 0,
        averageDegradationTime: 0,
        mostDegradedFeatures: [],
        impactDistribution: {},
        recoveryRate: 0,
        healthScore: 100
      };
    }
  }
}

export default GracefulDegradationService;