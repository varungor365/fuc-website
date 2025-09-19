/**
 * Payment Fraud Detection Service
 * Uses ML algorithms and risk scoring to detect fraudulent transactions
 */

export interface TransactionData {
  orderId: string;
  userId?: string;
  email: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'paypal' | 'applepay' | 'googlepay';
  
  // Card details (for card payments)
  cardFingerprint?: string;
  cardCountry?: string;
  cardType?: string;
  
  // Billing details
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  
  // Shipping details
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  
  // Device and session data
  deviceData: {
    ipAddress: string;
    userAgent: string;
    deviceFingerprint: string;
    timezone: string;
    language: string;
    screenResolution: string;
    cookiesEnabled: boolean;
    javaScriptEnabled: boolean;
  };
  
  // Behavioral data
  behavioralData: {
    timeOnSite: number; // seconds
    pagesVisited: number;
    clickCount: number;
    typingSpeed: number; // words per minute
    mouseMovements: number;
    formFillTime: number; // seconds
    copyPasteCount: number;
    mobileBehavior?: {
      touchEvents: number;
      deviceOrientation: string;
      accelerometerData?: number[];
    };
  };
  
  // Order context
  orderContext: {
    cartValue: number;
    itemCount: number;
    highValueItems: boolean;
    newCustomer: boolean;
    rushOrder: boolean;
    giftOrder: boolean;
    discountApplied: boolean;
    discountAmount: number;
  };
  
  timestamp: Date;
}

export interface RiskScore {
  score: number; // 0-100 (0 = lowest risk, 100 = highest risk)
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  recommendation: 'approve' | 'review' | 'decline';
  confidence: number; // 0-100
}

export interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  weight: number;
  value: string | number;
}

export interface FraudRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  weight: number;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'regex';
    value: any;
  }>;
  action: 'flag' | 'decline' | 'review';
}

export interface MLModel {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  lastTrained: Date;
  features: string[];
  thresholds: {
    low: number;
    medium: number;
    high: number;
  };
}

class PaymentFraudDetectionService {
  private baseUrl = '/api/fraud-detection';
  private rules: FraudRule[] = [];
  private models: MLModel[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Analyze transaction for fraud risk
   */
  async analyzeTransaction(transaction: TransactionData): Promise<RiskScore> {
    try {
      // Collect risk factors from multiple sources
      const riskFactors: RiskFactor[] = [];

      // Rule-based analysis
      const ruleFactors = await this.analyzeWithRules(transaction);
      riskFactors.push(...ruleFactors);

      // ML-based analysis
      const mlFactors = await this.analyzeWithML(transaction);
      riskFactors.push(...mlFactors);

      // Behavioral analysis
      const behavioralFactors = this.analyzeBehavior(transaction);
      riskFactors.push(...behavioralFactors);

      // Geolocation analysis
      const geoFactors = this.analyzeGeolocation(transaction);
      riskFactors.push(...geoFactors);

      // Historical analysis
      const historicalFactors = await this.analyzeHistoricalData(transaction);
      riskFactors.push(...historicalFactors);

      // Calculate overall risk score
      const riskScore = this.calculateRiskScore(riskFactors);

      // Log the analysis
      await this.logFraudAnalysis(transaction, riskScore);

      return riskScore;

    } catch (error) {
      console.error('Error analyzing transaction:', error);
      
      // Return default medium risk score in case of error
      return {
        score: 50,
        level: 'medium',
        factors: [{
          type: 'system_error',
          severity: 'medium',
          description: 'Unable to complete fraud analysis',
          weight: 50,
          value: 'analysis_error'
        }],
        recommendation: 'review',
        confidence: 0
      };
    }
  }

  /**
   * Analyze with rule-based system
   */
  private async analyzeWithRules(transaction: TransactionData): Promise<RiskFactor[]> {
    const factors: RiskFactor[] = [];

    for (const rule of this.rules.filter(r => r.enabled)) {
      try {
        if (this.evaluateRule(rule, transaction)) {
          factors.push({
            type: `rule_${rule.id}`,
            severity: this.getActionSeverity(rule.action),
            description: rule.description,
            weight: rule.weight,
            value: rule.name
          });
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
      }
    }

    return factors;
  }

  /**
   * Analyze with ML models
   */
  private async analyzeWithML(transaction: TransactionData): Promise<RiskFactor[]> {
    try {
      const response = await fetch(`${this.baseUrl}/ml-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
      });

      if (!response.ok) {
        throw new Error('ML analysis failed');
      }

      const result = await response.json();
      return result.factors || [];

    } catch (error) {
      console.error('ML analysis error:', error);
      return [];
    }
  }

  /**
   * Analyze behavioral patterns
   */
  private analyzeBehavior(transaction: TransactionData): RiskFactor[] {
    const factors: RiskFactor[] = [];
    const { behavioralData } = transaction;

    // Analyze time on site
    if (behavioralData.timeOnSite < 30) {
      factors.push({
        type: 'behavioral_rush',
        severity: 'medium',
        description: 'Very quick purchase - potential bot or stolen card',
        weight: 25,
        value: behavioralData.timeOnSite
      });
    }

    // Analyze typing speed
    if (behavioralData.typingSpeed > 120) {
      factors.push({
        type: 'behavioral_typing',
        severity: 'medium',
        description: 'Unusually fast typing speed - possible auto-fill or bot',
        weight: 20,
        value: behavioralData.typingSpeed
      });
    }

    // Analyze copy-paste behavior
    if (behavioralData.copyPasteCount > 3) {
      factors.push({
        type: 'behavioral_copypaste',
        severity: 'low',
        description: 'Excessive copy-paste usage - possible data entry from external source',
        weight: 15,
        value: behavioralData.copyPasteCount
      });
    }

    // Analyze form fill time
    if (behavioralData.formFillTime < 10) {
      factors.push({
        type: 'behavioral_formspeed',
        severity: 'high',
        description: 'Extremely fast form completion - likely automated',
        weight: 30,
        value: behavioralData.formFillTime
      });
    }

    // Analyze mouse movements
    if (behavioralData.mouseMovements < 5) {
      factors.push({
        type: 'behavioral_mouse',
        severity: 'medium',
        description: 'Very few mouse movements - possible bot activity',
        weight: 20,
        value: behavioralData.mouseMovements
      });
    }

    return factors;
  }

  /**
   * Analyze geolocation patterns
   */
  private analyzeGeolocation(transaction: TransactionData): RiskFactor[] {
    const factors: RiskFactor[] = [];
    const { billingAddress, shippingAddress, deviceData } = transaction;

    // Check for address mismatches
    if (billingAddress.country !== shippingAddress.country) {
      const severity = this.isHighRiskCountryCombination(billingAddress.country, shippingAddress.country)
        ? 'high' : 'medium';
      
      factors.push({
        type: 'geo_address_mismatch',
        severity,
        description: 'Billing and shipping countries differ',
        weight: severity === 'high' ? 35 : 20,
        value: `${billingAddress.country} -> ${shippingAddress.country}`
      });
    }

    // Check for high-risk countries
    if (this.isHighRiskCountry(billingAddress.country)) {
      factors.push({
        type: 'geo_high_risk_billing',
        severity: 'high',
        description: 'Billing address in high-risk country',
        weight: 40,
        value: billingAddress.country
      });
    }

    if (this.isHighRiskCountry(shippingAddress.country)) {
      factors.push({
        type: 'geo_high_risk_shipping',
        severity: 'medium',
        description: 'Shipping address in high-risk country',
        weight: 25,
        value: shippingAddress.country
      });
    }

    // Check IP geolocation vs billing address
    // This would require IP geolocation service integration
    
    return factors;
  }

  /**
   * Analyze historical transaction data
   */
  private async analyzeHistoricalData(transaction: TransactionData): Promise<RiskFactor[]> {
    try {
      const response = await fetch(`${this.baseUrl}/historical-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: transaction.userId,
          email: transaction.email,
          deviceFingerprint: transaction.deviceData.deviceFingerprint,
          cardFingerprint: transaction.cardFingerprint,
          ipAddress: transaction.deviceData.ipAddress
        })
      });

      if (!response.ok) {
        return [];
      }

      const result = await response.json();
      return result.factors || [];

    } catch (error) {
      console.error('Historical analysis error:', error);
      return [];
    }
  }

  /**
   * Calculate overall risk score
   */
  private calculateRiskScore(factors: RiskFactor[]): RiskScore {
    if (factors.length === 0) {
      return {
        score: 10,
        level: 'low',
        factors: [],
        recommendation: 'approve',
        confidence: 95
      };
    }

    // Calculate weighted score
    const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
    const score = Math.min(100, totalWeight);

    // Determine risk level
    let level: 'low' | 'medium' | 'high' | 'critical';
    let recommendation: 'approve' | 'review' | 'decline';

    if (score <= 20) {
      level = 'low';
      recommendation = 'approve';
    } else if (score <= 50) {
      level = 'medium';
      recommendation = 'review';
    } else if (score <= 80) {
      level = 'high';
      recommendation = 'review';
    } else {
      level = 'critical';
      recommendation = 'decline';
    }

    // Calculate confidence based on number and quality of factors
    const highSeverityFactors = factors.filter(f => f.severity === 'high').length;
    const totalFactors = factors.length;
    const confidence = Math.min(95, 50 + (highSeverityFactors * 15) + (totalFactors * 5));

    return {
      score,
      level,
      factors,
      recommendation,
      confidence
    };
  }

  /**
   * Evaluate a single fraud rule
   */
  private evaluateRule(rule: FraudRule, transaction: TransactionData): boolean {
    return rule.conditions.every(condition => {
      const value = this.getNestedValue(transaction, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'not_equals':
          return value !== condition.value;
        case 'greater_than':
          return Number(value) > Number(condition.value);
        case 'less_than':
          return Number(value) < Number(condition.value);
        case 'contains':
          return String(value).toLowerCase().includes(String(condition.value).toLowerCase());
        case 'regex':
          return new RegExp(condition.value).test(String(value));
        default:
          return false;
      }
    });
  }

  /**
   * Get nested object value by path
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Get severity from action
   */
  private getActionSeverity(action: string): 'low' | 'medium' | 'high' {
    switch (action) {
      case 'decline':
        return 'high';
      case 'review':
        return 'medium';
      default:
        return 'low';
    }
  }

  /**
   * Check if country is high-risk
   */
  private isHighRiskCountry(country: string): boolean {
    const highRiskCountries = [
      'AF', 'BD', 'BJ', 'BF', 'BI', 'CM', 'CF', 'TD', 'CG', 'CD',
      'CI', 'DJ', 'GQ', 'ER', 'ET', 'GM', 'GN', 'GW', 'HT', 'IQ',
      'LR', 'LY', 'MG', 'ML', 'MR', 'NE', 'NG', 'PK', 'RW', 'SL',
      'SO', 'SS', 'SD', 'SY', 'TZ', 'TG', 'UG', 'YE', 'ZW'
    ];
    
    return highRiskCountries.includes(country.toUpperCase());
  }

  /**
   * Check if country combination is high-risk
   */
  private isHighRiskCountryCombination(billing: string, shipping: string): boolean {
    const highRiskCombinations = [
      ['US', 'NG'], ['US', 'GH'], ['US', 'PK'], ['US', 'BD'],
      ['GB', 'NG'], ['GB', 'GH'], ['GB', 'PK'], ['GB', 'BD'],
      ['DE', 'NG'], ['DE', 'GH'], ['DE', 'PK'], ['DE', 'BD'],
      ['FR', 'NG'], ['FR', 'GH'], ['FR', 'PK'], ['FR', 'BD']
    ];
    
    return highRiskCombinations.some(([b, s]) => 
      billing.toUpperCase() === b && shipping.toUpperCase() === s
    );
  }

  /**
   * Log fraud analysis for audit trail
   */
  private async logFraudAnalysis(transaction: TransactionData, riskScore: RiskScore): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: transaction.orderId,
          riskScore,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error logging fraud analysis:', error);
    }
  }

  /**
   * Initialize default fraud rules
   */
  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'high_amount',
        name: 'High Transaction Amount',
        description: 'Transaction amount exceeds $1000',
        enabled: true,
        weight: 25,
        conditions: [{ field: 'amount', operator: 'greater_than', value: 1000 }],
        action: 'review'
      },
      {
        id: 'new_customer_high_amount',
        name: 'New Customer High Amount',
        description: 'New customer with transaction over $500',
        enabled: true,
        weight: 35,
        conditions: [
          { field: 'orderContext.newCustomer', operator: 'equals', value: true },
          { field: 'amount', operator: 'greater_than', value: 500 }
        ],
        action: 'review'
      },
      {
        id: 'velocity_check',
        name: 'Rapid Fire Transactions',
        description: 'Multiple transactions in short time period',
        enabled: true,
        weight: 40,
        conditions: [],
        action: 'decline'
      },
      {
        id: 'gift_card_purchase',
        name: 'Gift Card Purchase',
        description: 'Transaction includes gift cards',
        enabled: true,
        weight: 20,
        conditions: [{ field: 'orderContext.giftOrder', operator: 'equals', value: true }],
        action: 'review'
      }
    ];
  }

  /**
   * Add custom fraud rule
   */
  async addFraudRule(rule: Omit<FraudRule, 'id'>): Promise<string> {
    const id = `custom_${Date.now()}`;
    const newRule: FraudRule = { ...rule, id };
    this.rules.push(newRule);
    
    // Save to backend
    try {
      await fetch(`${this.baseUrl}/rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRule)
      });
    } catch (error) {
      console.error('Error saving fraud rule:', error);
    }
    
    return id;
  }

  /**
   * Update fraud rule
   */
  async updateFraudRule(id: string, updates: Partial<FraudRule>): Promise<boolean> {
    const ruleIndex = this.rules.findIndex(r => r.id === id);
    if (ruleIndex === -1) return false;
    
    this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
    
    try {
      await fetch(`${this.baseUrl}/rules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.rules[ruleIndex])
      });
      return true;
    } catch (error) {
      console.error('Error updating fraud rule:', error);
      return false;
    }
  }

  /**
   * Get fraud statistics
   */
  async getFraudStats(period: 'day' | 'week' | 'month' = 'week'): Promise<{
    totalTransactions: number;
    fraudulentTransactions: number;
    fraudRate: number;
    falsePositives: number;
    falseNegatives: number;
    accuracy: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/stats?period=${period}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch fraud stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching fraud stats:', error);
      return {
        totalTransactions: 0,
        fraudulentTransactions: 0,
        fraudRate: 0,
        falsePositives: 0,
        falseNegatives: 0,
        accuracy: 0
      };
    }
  }
}

export default PaymentFraudDetectionService;