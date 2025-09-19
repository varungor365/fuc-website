/**
 * A/B Testing Framework
 * Provides comprehensive experimentation and optimization capabilities
 */

export interface ExperimentConfig {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'cancelled';
  type: 'split' | 'multivariate' | 'redirect' | 'feature_flag';
  trafficAllocation: number; // Percentage of users to include (0-100)
  startDate: Date;
  endDate?: Date;
  targetMetrics: string[];
  segments?: UserSegment[];
  targeting: {
    url?: string;
    urlPattern?: string;
    userAgent?: string;
    country?: string[];
    device?: ('mobile' | 'tablet' | 'desktop')[];
    newUsers?: boolean;
    returningUsers?: boolean;
    customAttributes?: Record<string, any>;
  };
  variants: ExperimentVariant[];
  statisticalSignificance: number; // Minimum confidence level (e.g., 95)
  minimumDetectableEffect: number; // Minimum effect size to detect
  estimatedDuration: number; // Days
}

export interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  trafficWeight: number; // Percentage allocation within experiment
  isControl: boolean;
  changes: VariantChange[];
  conversionGoals: string[];
}

export interface VariantChange {
  type: 'element_text' | 'element_style' | 'element_attribute' | 'redirect' | 'feature_flag' | 'custom_code';
  selector?: string; // CSS selector for element changes
  property?: string; // Style property or attribute name
  value: any; // New value to apply
  condition?: string; // Optional condition for applying change
  customCode?: string; // JavaScript code to execute
}

export interface UserSegment {
  id: string;
  name: string;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
    value: any;
  }>;
}

export interface ExperimentResults {
  experimentId: string;
  status: 'running' | 'completed' | 'inconclusive';
  startDate: Date;
  endDate?: Date;
  totalParticipants: number;
  statisticalSignificance: number;
  confidenceLevel: number;
  winner?: string; // Variant ID
  variants: Array<{
    id: string;
    name: string;
    participants: number;
    conversions: number;
    conversionRate: number;
    conversionRateChange: number; // Percentage change from control
    revenue: number;
    revenuePerUser: number;
    confidence: number;
    isStatisticallySignificant: boolean;
    metrics: Record<string, {
      value: number;
      change: number;
      confidence: number;
    }>;
  }>;
  recommendations: Array<{
    type: 'implement_winner' | 'continue_testing' | 'stop_test' | 'investigate_further';
    message: string;
    confidence: number;
  }>;
}

export interface ExperimentAssignment {
  experimentId: string;
  variantId: string;
  userId?: string;
  sessionId: string;
  assignedAt: Date;
  exposedAt?: Date;
  convertedAt?: Date;
  conversionValue?: number;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targeting?: {
    userIds?: string[];
    segments?: string[];
    countries?: string[];
    devices?: string[];
  };
  variations?: Record<string, any>;
  defaultVariation: string;
}

export interface MultivariateFactor {
  id: string;
  name: string;
  levels: Array<{
    id: string;
    name: string;
    value: any;
  }>;
}

export interface StatisticalTest {
  testType: 'chi_square' | 't_test' | 'z_test' | 'bayesian';
  pValue: number;
  confidenceInterval: [number, number];
  effectSize: number;
  powerAnalysis: {
    power: number;
    sampleSize: number;
    effect: number;
  };
}

class ABTestingFramework {
  private experiments: Map<string, ExperimentConfig> = new Map();
  private assignments: Map<string, ExperimentAssignment> = new Map();
  private featureFlags: Map<string, FeatureFlag> = new Map();
  private baseUrl = '/api/experiments';
  private userId?: string;
  private sessionId: string;
  private userAttributes: Record<string, any> = {};
  private eventCallbacks: Map<string, Function[]> = new Map();

  constructor(userId?: string) {
    this.userId = userId;
    this.sessionId = this.generateSessionId();
    this.initializeUserAttributes();
    this.loadActiveExperiments();
  }

  /**
   * Initialize user attributes for targeting
   */
  private initializeUserAttributes(): void {
    if (typeof window === 'undefined') return;

    this.userAttributes = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer,
      isNewUser: !localStorage.getItem('returning_user'),
      visitCount: parseInt(localStorage.getItem('visit_count') || '1'),
      lastVisit: localStorage.getItem('last_visit'),
      deviceType: this.getDeviceType()
    };

    // Update visit tracking
    localStorage.setItem('returning_user', 'true');
    localStorage.setItem('visit_count', (this.userAttributes.visitCount + 1).toString());
    localStorage.setItem('last_visit', new Date().toISOString());
  }

  /**
   * Load active experiments from server
   */
  private async loadActiveExperiments(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load experiments: ${response.statusText}`);
      }

      const experiments = await response.json();
      experiments.forEach((exp: ExperimentConfig) => {
        this.experiments.set(exp.id, exp);
      });

      // Process experiments and assign variants
      this.processExperiments();

    } catch (error) {
      console.error('Failed to load active experiments:', error);
    }
  }

  /**
   * Process experiments and assign user to variants
   */
  private processExperiments(): void {
    this.experiments.forEach((experiment) => {
      if (this.shouldParticipateInExperiment(experiment)) {
        const variant = this.assignVariant(experiment);
        if (variant) {
          this.recordAssignment(experiment.id, variant.id);
          this.applyVariantChanges(variant);
        }
      }
    });
  }

  /**
   * Create a new experiment
   */
  async createExperiment(config: Omit<ExperimentConfig, 'id'>): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`Failed to create experiment: ${response.statusText}`);
      }

      const result = await response.json();
      return result.experimentId;

    } catch (error) {
      console.error('Failed to create experiment:', error);
      throw error;
    }
  }

  /**
   * Start an experiment
   */
  async startExperiment(experimentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${experimentId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to start experiment: ${response.statusText}`);
      }

      // Update local experiment status
      const experiment = this.experiments.get(experimentId);
      if (experiment) {
        experiment.status = 'running';
        experiment.startDate = new Date();
      }

    } catch (error) {
      console.error('Failed to start experiment:', error);
      throw error;
    }
  }

  /**
   * Stop an experiment
   */
  async stopExperiment(experimentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${experimentId}/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to stop experiment: ${response.statusText}`);
      }

      // Update local experiment status
      const experiment = this.experiments.get(experimentId);
      if (experiment) {
        experiment.status = 'completed';
        experiment.endDate = new Date();
      }

    } catch (error) {
      console.error('Failed to stop experiment:', error);
      throw error;
    }
  }

  /**
   * Get experiment results
   */
  async getExperimentResults(experimentId: string): Promise<ExperimentResults | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${experimentId}/results`);

      if (!response.ok) {
        throw new Error(`Failed to get experiment results: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Failed to get experiment results:', error);
      return null;
    }
  }

  /**
   * Check if user is in experiment variant
   */
  isInExperiment(experimentId: string, variantId?: string): boolean {
    const assignment = this.getAssignment(experimentId);
    if (!assignment) return false;

    if (variantId) {
      return assignment.variantId === variantId;
    }

    return true;
  }

  /**
   * Get assigned variant for experiment
   */
  getVariant(experimentId: string): string | null {
    const assignment = this.getAssignment(experimentId);
    return assignment?.variantId || null;
  }

  /**
   * Track conversion for experiment
   */
  trackConversion(
    experimentId: string,
    goalName: string,
    value?: number,
    metadata?: Record<string, any>
  ): void {
    const assignment = this.getAssignment(experimentId);
    if (!assignment) return;

    // Mark as converted
    assignment.convertedAt = new Date();
    assignment.conversionValue = value;

    // Send conversion event
    this.sendEvent('conversion', {
      experimentId,
      variantId: assignment.variantId,
      goalName,
      value,
      metadata,
      userId: this.userId,
      sessionId: this.sessionId
    });

    // Trigger conversion callbacks
    this.triggerCallbacks('conversion', {
      experimentId,
      variantId: assignment.variantId,
      goalName,
      value
    });
  }

  /**
   * Track experiment exposure
   */
  trackExposure(experimentId: string): void {
    const assignment = this.getAssignment(experimentId);
    if (!assignment || assignment.exposedAt) return;

    assignment.exposedAt = new Date();

    // Send exposure event
    this.sendEvent('exposure', {
      experimentId,
      variantId: assignment.variantId,
      userId: this.userId,
      sessionId: this.sessionId
    });
  }

  /**
   * Feature flag functionality
   */
  async createFeatureFlag(flag: Omit<FeatureFlag, 'id'>): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/feature-flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flag)
      });

      if (!response.ok) {
        throw new Error(`Failed to create feature flag: ${response.statusText}`);
      }

      const result = await response.json();
      return result.flagId;

    } catch (error) {
      console.error('Failed to create feature flag:', error);
      throw error;
    }
  }

  /**
   * Check if feature flag is enabled
   */
  isFeatureEnabled(flagId: string): boolean {
    const flag = this.featureFlags.get(flagId);
    if (!flag || !flag.enabled) return false;

    // Check targeting rules
    if (flag.targeting) {
      if (!this.matchesFeatureFlagTargeting(flag.targeting)) {
        return false;
      }
    }

    // Check rollout percentage
    const hash = this.hashString(`${flagId}:${this.userId || this.sessionId}`);
    const bucket = hash % 100;
    return bucket < flag.rolloutPercentage;
  }

  /**
   * Get feature flag variation
   */
  getFeatureVariation(flagId: string): any {
    const flag = this.featureFlags.get(flagId);
    if (!flag || !this.isFeatureEnabled(flagId)) {
      return flag?.variations?.[flag.defaultVariation] || null;
    }

    // For now, return default variation
    // In production, this could implement more sophisticated variation selection
    return flag.variations?.[flag.defaultVariation] || null;
  }

  /**
   * Create multivariate experiment
   */
  async createMultivariateExperiment(
    name: string,
    factors: MultivariateFactor[],
    targetMetrics: string[],
    options?: Partial<ExperimentConfig>
  ): Promise<string> {
    // Generate all possible combinations
    const combinations = this.generateCombinations(factors);
    
    const variants: ExperimentVariant[] = combinations.map((combo, index) => ({
      id: `variant_${index}`,
      name: `Combination ${index + 1}`,
      description: combo.map(c => `${c.factorName}: ${c.levelName}`).join(', '),
      trafficWeight: Math.floor(100 / combinations.length),
      isControl: index === 0,
      changes: combo.map(c => ({
        type: 'custom_code',
        value: c.levelValue
      })),
      conversionGoals: targetMetrics
    }));

    const config: Omit<ExperimentConfig, 'id'> = {
      name,
      description: `Multivariate test with ${factors.length} factors`,
      hypothesis: 'Multiple factors interaction will improve conversion',
      status: 'draft',
      type: 'multivariate',
      trafficAllocation: 100,
      startDate: new Date(),
      targetMetrics,
      variants,
      statisticalSignificance: 95,
      minimumDetectableEffect: 5,
      estimatedDuration: 14,
      targeting: {},
      ...options
    };

    return this.createExperiment(config);
  }

  /**
   * Perform statistical analysis
   */
  async performStatisticalAnalysis(
    experimentId: string,
    metric: string
  ): Promise<StatisticalTest | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${experimentId}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ metric })
      });

      if (!response.ok) {
        throw new Error(`Failed to perform statistical analysis: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Failed to perform statistical analysis:', error);
      return null;
    }
  }

  /**
   * Calculate sample size for experiment
   */
  calculateSampleSize(
    baselineConversionRate: number,
    minimumDetectableEffect: number,
    statisticalPower: number = 0.8,
    significanceLevel: number = 0.05
  ): number {
    // Simplified sample size calculation
    // In production, use proper statistical library
    const effectSize = minimumDetectableEffect / 100;
    const z_alpha = 1.96; // for 95% confidence
    const z_beta = 0.84; // for 80% power
    
    const p1 = baselineConversionRate;
    const p2 = p1 * (1 + effectSize);
    const p_pooled = (p1 + p2) / 2;
    
    const numerator = Math.pow(z_alpha + z_beta, 2) * 2 * p_pooled * (1 - p_pooled);
    const denominator = Math.pow(p2 - p1, 2);
    
    return Math.ceil(numerator / denominator);
  }

  /**
   * Subscribe to experiment events
   */
  on(event: string, callback: Function): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)!.push(callback);
  }

  /**
   * Unsubscribe from experiment events
   */
  off(event: string, callback: Function): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Private helper methods
   */
  private shouldParticipateInExperiment(experiment: ExperimentConfig): boolean {
    // Check if experiment is running
    if (experiment.status !== 'running') return false;

    // Check traffic allocation
    const hash = this.hashString(`${experiment.id}:${this.userId || this.sessionId}`);
    const bucket = hash % 100;
    if (bucket >= experiment.trafficAllocation) return false;

    // Check targeting rules
    if (!this.matchesTargeting(experiment.targeting)) return false;

    // Check URL targeting
    if (experiment.targeting.url && typeof window !== 'undefined') {
      if (window.location.href !== experiment.targeting.url) return false;
    }

    if (experiment.targeting.urlPattern && typeof window !== 'undefined') {
      const regex = new RegExp(experiment.targeting.urlPattern);
      if (!regex.test(window.location.href)) return false;
    }

    return true;
  }

  private assignVariant(experiment: ExperimentConfig): ExperimentVariant | null {
    // Use deterministic assignment based on user/session ID
    const hash = this.hashString(`${experiment.id}:${this.userId || this.sessionId}`);
    const bucket = hash % 100;

    let cumulativeWeight = 0;
    for (const variant of experiment.variants) {
      cumulativeWeight += variant.trafficWeight;
      if (bucket < cumulativeWeight) {
        return variant;
      }
    }

    return experiment.variants[0] || null;
  }

  private applyVariantChanges(variant: ExperimentVariant): void {
    if (typeof window === 'undefined') return;

    variant.changes.forEach(change => {
      try {
        switch (change.type) {
          case 'element_text':
            if (change.selector) {
              const elements = document.querySelectorAll(change.selector);
              elements.forEach(el => {
                el.textContent = change.value;
              });
            }
            break;

          case 'element_style':
            if (change.selector && change.property) {
              const elements = document.querySelectorAll(change.selector);
              elements.forEach(el => {
                (el as HTMLElement).style.setProperty(change.property!, change.value);
              });
            }
            break;

          case 'element_attribute':
            if (change.selector && change.property) {
              const elements = document.querySelectorAll(change.selector);
              elements.forEach(el => {
                el.setAttribute(change.property!, change.value);
              });
            }
            break;

          case 'redirect':
            if (change.value && typeof change.value === 'string') {
              window.location.href = change.value;
            }
            break;

          case 'custom_code':
            if (change.customCode) {
              eval(change.customCode);
            }
            break;
        }
      } catch (error) {
        console.error(`Failed to apply variant change:`, error);
      }
    });
  }

  private recordAssignment(experimentId: string, variantId: string): void {
    const assignment: ExperimentAssignment = {
      experimentId,
      variantId,
      userId: this.userId,
      sessionId: this.sessionId,
      assignedAt: new Date()
    };

    this.assignments.set(experimentId, assignment);

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      const key = `experiment_${experimentId}`;
      localStorage.setItem(key, JSON.stringify(assignment));
    }

    // Send assignment event
    this.sendEvent('assignment', assignment);
  }

  private getAssignment(experimentId: string): ExperimentAssignment | null {
    // Check memory first
    let assignment = this.assignments.get(experimentId);
    
    // Check localStorage if not in memory
    if (!assignment && typeof window !== 'undefined') {
      const key = `experiment_${experimentId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          assignment = JSON.parse(stored);
          if (assignment) {
            this.assignments.set(experimentId, assignment);
          }
        } catch (error) {
          console.error('Failed to parse stored assignment:', error);
        }
      }
    }

    return assignment || null;
  }

  private matchesTargeting(targeting: ExperimentConfig['targeting']): boolean {
    // Check device type
    if (targeting.device && targeting.device.length > 0) {
      if (!targeting.device.includes(this.userAttributes.deviceType)) {
        return false;
      }
    }

    // Check new/returning user
    if (targeting.newUsers !== undefined) {
      if (targeting.newUsers !== this.userAttributes.isNewUser) {
        return false;
      }
    }

    if (targeting.returningUsers !== undefined) {
      if (targeting.returningUsers === this.userAttributes.isNewUser) {
        return false;
      }
    }

    // Check custom attributes
    if (targeting.customAttributes) {
      for (const [key, value] of Object.entries(targeting.customAttributes)) {
        if (this.userAttributes[key] !== value) {
          return false;
        }
      }
    }

    return true;
  }

  private matchesFeatureFlagTargeting(targeting: FeatureFlag['targeting']): boolean {
    if (!targeting) return true;

    // Check user IDs
    if (targeting.userIds && targeting.userIds.length > 0) {
      if (!this.userId || !targeting.userIds.includes(this.userId)) {
        return false;
      }
    }

    // Check countries
    if (targeting.countries && targeting.countries.length > 0) {
      // Would need to implement country detection
      // For now, assume targeting passes
    }

    // Check devices
    if (targeting.devices && targeting.devices.length > 0) {
      if (!targeting.devices.includes(this.userAttributes.deviceType)) {
        return false;
      }
    }

    return true;
  }

  private generateCombinations(factors: MultivariateFactor[]): Array<{
    factorName: string;
    levelName: string;
    levelValue: any;
  }[]> {
    if (factors.length === 0) return [];
    if (factors.length === 1) {
      return factors[0].levels.map(level => [{
        factorName: factors[0].name,
        levelName: level.name,
        levelValue: level.value
      }]);
    }

    const result: any[][] = [];
    const firstFactor = factors[0];
    const restCombinations = this.generateCombinations(factors.slice(1));

    firstFactor.levels.forEach(level => {
      restCombinations.forEach(combo => {
        result.push([{
          factorName: firstFactor.name,
          levelName: level.name,
          levelValue: level.value
        }, ...combo]);
      });
    });

    return result;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private triggerCallbacks(event: string, data: any): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event callback:`, error);
        }
      });
    }
  }

  private async sendEvent(eventType: string, data: any): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventType,
          timestamp: new Date(),
          data
        })
      });
    } catch (error) {
      console.error('Failed to send experiment event:', error);
    }
  }
}

export default ABTestingFramework;