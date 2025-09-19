/**
 * Credential Stuffing Protection Service
 * Protects against automated login attempts using breached credentials
 */

export interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  sessionId: string;
  deviceFingerprint: string;
  geolocation?: {
    country: string;
    region: string;
    city: string;
    latitude?: number;
    longitude?: number;
  };
  behavioralSignals: {
    timeToSubmit: number; // milliseconds from page load to form submit
    keyboardDynamics?: {
      dwellTimes: number[];
      flightTimes: number[];
      typingSpeed: number;
    };
    mouseActivity: boolean;
    pasteEvents: number;
    tabSwitches: number;
    formAutofill: boolean;
  };
}

export interface CredentialStuffingResult {
  allowed: boolean;
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  action: 'allow' | 'challenge' | 'delay' | 'block';
  delayDuration?: number; // seconds
  challengeType?: 'captcha' | 'sms' | 'email' | 'mfa';
  recommendations: string[];
}

export interface AccountSecurityStatus {
  email: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recentSuspiciousActivity: boolean;
  failedLoginAttempts: number;
  lastFailedAttempt?: Date;
  accountLocked: boolean;
  lockoutExpires?: Date;
  breachDetected: boolean;
  breachSources?: string[];
  recommendedActions: string[];
}

export interface BreachDatabase {
  source: string;
  credentials: Set<string>; // hashed email:password combinations
  dateDiscovered: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedAccounts: number;
}

export interface AttackPattern {
  id: string;
  name: string;
  description: string;
  indicators: {
    rapidAttempts: boolean;
    crossAccountPattern: boolean;
    geographicAnomalies: boolean;
    userAgentPatterns: string[];
    ipRanges: string[];
    timingPatterns: boolean;
  };
  riskWeight: number;
  action: 'monitor' | 'challenge' | 'block';
}

class CredentialStuffingProtectionService {
  private baseUrl = '/api/credential-stuffing';
  private loginAttempts: Map<string, LoginAttempt[]> = new Map();
  private breachDatabases: BreachDatabase[] = [];
  private attackPatterns: AttackPattern[] = [];
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    this.initializeAttackPatterns();
    this.loadBreachDatabases();
  }

  /**
   * Analyze login attempt for credential stuffing
   */
  async analyzeLoginAttempt(attempt: LoginAttempt): Promise<CredentialStuffingResult> {
    try {
      let riskScore = 0;
      const reasons: string[] = [];
      const recommendations: string[] = [];

      // Store the attempt
      this.storeLoginAttempt(attempt);

      // Rate limiting analysis
      const rateResult = this.analyzeRateLimit(attempt);
      riskScore += rateResult.score;
      reasons.push(...rateResult.reasons);

      // Behavioral analysis
      const behaviorResult = this.analyzeBehavior(attempt);
      riskScore += behaviorResult.score;
      reasons.push(...behaviorResult.reasons);

      // Geographic analysis
      const geoResult = this.analyzeGeographic(attempt);
      riskScore += geoResult.score;
      reasons.push(...geoResult.reasons);

      // Breach database check
      const breachResult = await this.checkBreachDatabases(attempt);
      riskScore += breachResult.score;
      reasons.push(...breachResult.reasons);

      // Pattern matching
      const patternResult = this.analyzeAttackPatterns(attempt);
      riskScore += patternResult.score;
      reasons.push(...patternResult.reasons);

      // Device analysis
      const deviceResult = this.analyzeDevice(attempt);
      riskScore += deviceResult.score;
      reasons.push(...deviceResult.reasons);

      // Account history analysis
      const historyResult = await this.analyzeAccountHistory(attempt);
      riskScore += historyResult.score;
      reasons.push(...historyResult.reasons);

      // Determine action based on risk score
      const action = this.determineAction(riskScore);
      const riskLevel = this.determineRiskLevel(riskScore);

      // Generate recommendations
      recommendations.push(...this.generateRecommendations(riskLevel, reasons));

      const result: CredentialStuffingResult = {
        allowed: action === 'allow',
        riskScore: Math.min(100, riskScore),
        riskLevel,
        reasons,
        action,
        delayDuration: action === 'delay' ? this.calculateDelay(riskScore) : undefined,
        challengeType: action === 'challenge' ? this.selectChallengeType(riskScore) : undefined,
        recommendations
      };

      // Log the analysis
      await this.logAttemptAnalysis(attempt, result);

      return result;

    } catch (error) {
      console.error('Error analyzing login attempt:', error);
      
      return {
        allowed: false,
        riskScore: 50,
        riskLevel: 'medium',
        reasons: ['Analysis error - defaulting to challenge'],
        action: 'challenge',
        challengeType: 'captcha',
        recommendations: ['Please complete verification to proceed']
      };
    }
  }

  /**
   * Analyze rate limiting patterns
   */
  private analyzeRateLimit(attempt: LoginAttempt): { score: number; reasons: string[] } {
    const key = `${attempt.ipAddress}:${attempt.email}`;
    const windowSize = 5 * 60 * 1000; // 5 minutes
    const now = Date.now();
    
    // Clean old rate limit entries
    for (const [k, limit] of Array.from(this.rateLimits.entries())) {
      if (limit.resetTime < now) {
        this.rateLimits.delete(k);
      }
    }

    // Get or create rate limit entry
    let rateLimit = this.rateLimits.get(key);
    if (!rateLimit || rateLimit.resetTime < now) {
      rateLimit = { count: 0, resetTime: now + windowSize };
      this.rateLimits.set(key, rateLimit);
    }

    rateLimit.count++;

    let score = 0;
    const reasons: string[] = [];

    // Analyze attempt frequency
    if (rateLimit.count > 10) {
      score += 40;
      reasons.push(`High frequency login attempts: ${rateLimit.count} in 5 minutes`);
    } else if (rateLimit.count > 5) {
      score += 20;
      reasons.push(`Moderate frequency login attempts: ${rateLimit.count} in 5 minutes`);
    }

    // Check IP-wide rate limiting
    const ipAttempts = Array.from(this.rateLimits.entries())
      .filter(([k]) => k.startsWith(attempt.ipAddress + ':'))
      .reduce((sum, [, limit]) => sum + limit.count, 0);

    if (ipAttempts > 50) {
      score += 50;
      reasons.push(`Excessive attempts from IP: ${ipAttempts} across all accounts`);
    } else if (ipAttempts > 20) {
      score += 25;
      reasons.push(`High attempts from IP: ${ipAttempts} across all accounts`);
    }

    return { score, reasons };
  }

  /**
   * Analyze behavioral signals
   */
  private analyzeBehavior(attempt: LoginAttempt): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
    const { behavioralSignals } = attempt;

    // Analyze form submission speed
    if (behavioralSignals.timeToSubmit < 2000) { // Less than 2 seconds
      score += 30;
      reasons.push('Extremely fast form submission suggests automation');
    } else if (behavioralSignals.timeToSubmit < 5000) { // Less than 5 seconds
      score += 15;
      reasons.push('Very fast form submission');
    }

    // Analyze typing patterns
    if (behavioralSignals.keyboardDynamics) {
      const { dwellTimes, flightTimes, typingSpeed } = behavioralSignals.keyboardDynamics;
      
      // Check for inhuman typing speed
      if (typingSpeed > 150) { // WPM
        score += 25;
        reasons.push('Abnormally fast typing speed suggests automation');
      }

      // Check for too-consistent timing
      if (dwellTimes.length > 0) {
        const dwellVariance = this.calculateVariance(dwellTimes);
        if (dwellVariance < 10) {
          score += 20;
          reasons.push('Too-consistent keystroke timing');
        }
      }

      if (flightTimes.length > 0) {
        const flightVariance = this.calculateVariance(flightTimes);
        if (flightVariance < 5) {
          score += 20;
          reasons.push('Too-consistent key transition timing');
        }
      }
    }

    // Analyze mouse activity
    if (!behavioralSignals.mouseActivity) {
      score += 20;
      reasons.push('No mouse activity detected during session');
    }

    // Analyze paste events
    if (behavioralSignals.pasteEvents > 1) {
      score += 25;
      reasons.push('Multiple paste events suggest credential list usage');
    } else if (behavioralSignals.pasteEvents === 1) {
      score += 10;
      reasons.push('Credential pasted from clipboard');
    }

    // Analyze form autofill
    if (behavioralSignals.formAutofill) {
      score += 15;
      reasons.push('Form autofilled by browser or automation tool');
    }

    // Analyze tab switching
    if (behavioralSignals.tabSwitches > 3) {
      score += 10;
      reasons.push('Excessive tab switching during login process');
    }

    return { score, reasons };
  }

  /**
   * Analyze geographic patterns
   */
  private analyzeGeographic(attempt: LoginAttempt): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    if (!attempt.geolocation) {
      return { score: 5, reasons: ['No geolocation data available'] };
    }

    // Check for high-risk countries
    const highRiskCountries = [
      'CN', 'RU', 'IR', 'KP', 'SY', 'AF', 'IQ', 'YE', 'SO', 'LY'
    ];

    if (highRiskCountries.includes(attempt.geolocation.country)) {
      score += 20;
      reasons.push(`Login attempt from high-risk country: ${attempt.geolocation.country}`);
    }

    // Check for geographic velocity (if we have previous attempts)
    const recentAttempts = this.getRecentAttempts(attempt.email, 60 * 60 * 1000); // Last hour
    if (recentAttempts.length > 1) {
      const lastAttempt = recentAttempts[recentAttempts.length - 2];
      if (lastAttempt.geolocation) {
        const distance = this.calculateDistance(
          attempt.geolocation.latitude || 0,
          attempt.geolocation.longitude || 0,
          lastAttempt.geolocation.latitude || 0,
          lastAttempt.geolocation.longitude || 0
        );

        const timeDiff = attempt.timestamp.getTime() - lastAttempt.timestamp.getTime();
        const velocity = distance / (timeDiff / 1000 / 3600); // km/h

        // Impossible travel speed
        if (velocity > 1000) { // Faster than commercial aircraft
          score += 40;
          reasons.push(`Impossible geographic velocity: ${velocity.toFixed(0)} km/h`);
        } else if (velocity > 500) { // Unusually fast travel
          score += 20;
          reasons.push(`Unusually fast geographic velocity: ${velocity.toFixed(0)} km/h`);
        }
      }
    }

    return { score, reasons };
  }

  /**
   * Check against breach databases
   */
  private async checkBreachDatabases(attempt: LoginAttempt): Promise<{ score: number; reasons: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/breach-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: attempt.email,
          timestamp: attempt.timestamp
        })
      });

      if (!response.ok) {
        return { score: 0, reasons: ['Breach database check unavailable'] };
      }

      const result = await response.json();
      return {
        score: result.found ? 30 : 0,
        reasons: result.found ? [`Email found in ${result.sources.length} breach database(s)`] : []
      };

    } catch (error) {
      console.error('Breach database check error:', error);
      return { score: 0, reasons: ['Breach database check failed'] };
    }
  }

  /**
   * Analyze against known attack patterns
   */
  private analyzeAttackPatterns(attempt: LoginAttempt): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    for (const pattern of this.attackPatterns) {
      let matches = 0;
      let totalChecks = 0;

      // Check user agent patterns
      if (pattern.indicators.userAgentPatterns.length > 0) {
        totalChecks++;
        if (pattern.indicators.userAgentPatterns.some(ua => 
          new RegExp(ua, 'i').test(attempt.userAgent)
        )) {
          matches++;
        }
      }

      // Check for rapid attempts
      if (pattern.indicators.rapidAttempts) {
        totalChecks++;
        const recentAttempts = this.getRecentAttempts(attempt.email, 5 * 60 * 1000); // 5 minutes
        if (recentAttempts.length > 5) {
          matches++;
        }
      }

      // Check for cross-account patterns
      if (pattern.indicators.crossAccountPattern) {
        totalChecks++;
        const ipAttempts = this.getRecentAttemptsFromIP(attempt.ipAddress, 10 * 60 * 1000); // 10 minutes
        const uniqueEmails = new Set(ipAttempts.map(a => a.email));
        if (uniqueEmails.size > 10) {
          matches++;
        }
      }

      // Check geographic anomalies
      if (pattern.indicators.geographicAnomalies && attempt.geolocation) {
        totalChecks++;
        // This would check for patterns like multiple countries in short time
        // Implementation depends on specific geographic anomaly detection logic
      }

      // If pattern matches significantly, add to score
      const matchPercentage = totalChecks > 0 ? matches / totalChecks : 0;
      if (matchPercentage >= 0.7) {
        score += pattern.riskWeight;
        reasons.push(`Matches attack pattern: ${pattern.name}`);
      }
    }

    return { score, reasons };
  }

  /**
   * Analyze device characteristics
   */
  private analyzeDevice(attempt: LoginAttempt): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Check for suspicious user agents
    const botPatterns = [
      /bot|crawler|spider|scraper/i,
      /headless|phantom|selenium|puppeteer/i,
      /curl|wget|python|ruby/i
    ];

    for (const pattern of botPatterns) {
      if (pattern.test(attempt.userAgent)) {
        score += 35;
        reasons.push('User agent suggests automated tool');
        break;
      }
    }

    // Check device fingerprint reuse
    const fingerprintAttempts = this.getAttemptsByFingerprint(
      attempt.deviceFingerprint, 
      24 * 60 * 60 * 1000 // 24 hours
    );
    
    const uniqueEmails = new Set(fingerprintAttempts.map(a => a.email));
    if (uniqueEmails.size > 5) {
      score += 30;
      reasons.push(`Device fingerprint used with ${uniqueEmails.size} different accounts`);
    } else if (uniqueEmails.size > 2) {
      score += 15;
      reasons.push(`Device fingerprint used with multiple accounts`);
    }

    return { score, reasons };
  }

  /**
   * Analyze account history
   */
  private async analyzeAccountHistory(attempt: LoginAttempt): Promise<{ score: number; reasons: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/account-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: attempt.email,
          ipAddress: attempt.ipAddress
        })
      });

      if (!response.ok) {
        return { score: 0, reasons: ['Account history check unavailable'] };
      }

      const history = await response.json();
      let score = 0;
      const reasons: string[] = [];

      // Check for recent failed attempts
      if (history.recentFailedAttempts > 10) {
        score += 25;
        reasons.push(`${history.recentFailedAttempts} recent failed login attempts`);
      } else if (history.recentFailedAttempts > 5) {
        score += 15;
        reasons.push(`${history.recentFailedAttempts} recent failed login attempts`);
      }

      // Check for new IP address
      if (history.newIpAddress) {
        score += 10;
        reasons.push('Login attempt from new IP address');
      }

      // Check for account lockout history
      if (history.previousLockouts > 0) {
        score += 15;
        reasons.push('Account has history of security lockouts');
      }

      return { score, reasons };

    } catch (error) {
      console.error('Account history check error:', error);
      return { score: 0, reasons: ['Account history check failed'] };
    }
  }

  /**
   * Determine action based on risk score
   */
  private determineAction(riskScore: number): 'allow' | 'challenge' | 'delay' | 'block' {
    if (riskScore >= 80) return 'block';
    if (riskScore >= 60) return 'challenge';
    if (riskScore >= 30) return 'delay';
    return 'allow';
  }

  /**
   * Determine risk level
   */
  private determineRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 30) return 'medium';
    return 'low';
  }

  /**
   * Calculate delay duration
   */
  private calculateDelay(riskScore: number): number {
    // Progressive delay based on risk score
    if (riskScore >= 50) return 30; // 30 seconds
    if (riskScore >= 40) return 15; // 15 seconds
    return 5; // 5 seconds
  }

  /**
   * Select challenge type
   */
  private selectChallengeType(riskScore: number): 'captcha' | 'sms' | 'email' | 'mfa' {
    if (riskScore >= 70) return 'mfa';
    if (riskScore >= 60) return 'sms';
    if (riskScore >= 50) return 'email';
    return 'captcha';
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(riskLevel: string, reasons: string[]): string[] {
    const recommendations: string[] = [];

    switch (riskLevel) {
      case 'critical':
        recommendations.push('Consider temporary account lockout');
        recommendations.push('Notify account owner of suspicious activity');
        recommendations.push('Require multi-factor authentication');
        break;
      case 'high':
        recommendations.push('Require additional verification');
        recommendations.push('Monitor for continued suspicious activity');
        recommendations.push('Consider rate limiting');
        break;
      case 'medium':
        recommendations.push('Apply progressive delay');
        recommendations.push('Request CAPTCHA verification');
        break;
      case 'low':
        recommendations.push('Continue monitoring');
        break;
    }

    // Add specific recommendations based on reasons
    if (reasons.some(r => r.includes('breach database'))) {
      recommendations.push('Recommend password change to user');
      recommendations.push('Enable breach monitoring alerts');
    }

    if (reasons.some(r => r.includes('geographic'))) {
      recommendations.push('Verify login location with user');
      recommendations.push('Enable location-based alerts');
    }

    return recommendations;
  }

  /**
   * Store login attempt
   */
  private storeLoginAttempt(attempt: LoginAttempt): void {
    if (!this.loginAttempts.has(attempt.email)) {
      this.loginAttempts.set(attempt.email, []);
    }
    
    const attempts = this.loginAttempts.get(attempt.email)!;
    attempts.push(attempt);
    
    // Keep only recent attempts (last 24 hours)
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.loginAttempts.set(
      attempt.email,
      attempts.filter(a => a.timestamp > cutoff)
    );
  }

  /**
   * Get recent attempts for email
   */
  private getRecentAttempts(email: string, timeWindow: number): LoginAttempt[] {
    const attempts = this.loginAttempts.get(email) || [];
    const cutoff = new Date(Date.now() - timeWindow);
    return attempts.filter(a => a.timestamp > cutoff);
  }

  /**
   * Get recent attempts from IP
   */
  private getRecentAttemptsFromIP(ipAddress: string, timeWindow: number): LoginAttempt[] {
    const cutoff = new Date(Date.now() - timeWindow);
    const allAttempts: LoginAttempt[] = [];
    
    for (const attempts of Array.from(this.loginAttempts.values())) {
      allAttempts.push(...attempts.filter((a: LoginAttempt) => 
        a.ipAddress === ipAddress && a.timestamp > cutoff
      ));
    }
    
    return allAttempts;
  }

  /**
   * Get attempts by device fingerprint
   */
  private getAttemptsByFingerprint(fingerprint: string, timeWindow: number): LoginAttempt[] {
    const cutoff = new Date(Date.now() - timeWindow);
    const allAttempts: LoginAttempt[] = [];
    
    for (const attempts of Array.from(this.loginAttempts.values())) {
      allAttempts.push(...attempts.filter((a: LoginAttempt) => 
        a.deviceFingerprint === fingerprint && a.timestamp > cutoff
      ));
    }
    
    return allAttempts;
  }

  /**
   * Calculate distance between two coordinates
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate variance
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Initialize attack patterns
   */
  private initializeAttackPatterns(): void {
    this.attackPatterns = [
      {
        id: 'rapid_login_attempts',
        name: 'Rapid Login Attempts',
        description: 'Multiple rapid login attempts suggesting automation',
        indicators: {
          rapidAttempts: true,
          crossAccountPattern: false,
          geographicAnomalies: false,
          userAgentPatterns: [],
          ipRanges: [],
          timingPatterns: true
        },
        riskWeight: 30,
        action: 'challenge'
      },
      {
        id: 'cross_account_stuffing',
        name: 'Cross-Account Credential Stuffing',
        description: 'Single IP attempting multiple accounts',
        indicators: {
          rapidAttempts: false,
          crossAccountPattern: true,
          geographicAnomalies: false,
          userAgentPatterns: [],
          ipRanges: [],
          timingPatterns: false
        },
        riskWeight: 40,
        action: 'block'
      },
      {
        id: 'automated_tools',
        name: 'Automated Tools',
        description: 'User agent suggests automation tools',
        indicators: {
          rapidAttempts: false,
          crossAccountPattern: false,
          geographicAnomalies: false,
          userAgentPatterns: ['python', 'curl', 'selenium', 'phantomjs'],
          ipRanges: [],
          timingPatterns: false
        },
        riskWeight: 35,
        action: 'block'
      }
    ];
  }

  /**
   * Load breach databases
   */
  private async loadBreachDatabases(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/breach-databases`);
      if (response.ok) {
        const databases = await response.json();
        this.breachDatabases = databases;
      }
    } catch (error) {
      console.error('Error loading breach databases:', error);
    }
  }

  /**
   * Log attempt analysis
   */
  private async logAttemptAnalysis(attempt: LoginAttempt, result: CredentialStuffingResult): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attempt: {
            id: attempt.id,
            email: attempt.email,
            ipAddress: attempt.ipAddress,
            timestamp: attempt.timestamp,
            success: attempt.success
          },
          result,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error logging attempt analysis:', error);
    }
  }

  /**
   * Get account security status
   */
  async getAccountSecurityStatus(email: string): Promise<AccountSecurityStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/account-status/${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Failed to get account status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting account security status:', error);
      
      return {
        email,
        riskLevel: 'low',
        recentSuspiciousActivity: false,
        failedLoginAttempts: 0,
        accountLocked: false,
        breachDetected: false,
        recommendedActions: []
      };
    }
  }

  /**
   * Get credential stuffing statistics
   */
  async getCredentialStuffingStats(period: 'hour' | 'day' | 'week' = 'day'): Promise<{
    totalAttempts: number;
    blockedAttempts: number;
    successRate: number;
    topTargetedAccounts: Array<{ email: string; attempts: number }>;
    topAttackIPs: Array<{ ip: string; attempts: number }>;
    attackPatterns: Array<{ pattern: string; occurrences: number }>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/stats?period=${period}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch credential stuffing stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching credential stuffing stats:', error);
      return {
        totalAttempts: 0,
        blockedAttempts: 0,
        successRate: 0,
        topTargetedAccounts: [],
        topAttackIPs: [],
        attackPatterns: []
      };
    }
  }

  /**
   * Block IP address
   */
  async blockIP(ipAddress: string, duration: number = 24 * 60 * 60 * 1000): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/block-ip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ipAddress,
          duration,
          timestamp: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error blocking IP:', error);
      return false;
    }
  }

  /**
   * Lock account
   */
  async lockAccount(email: string, duration: number = 60 * 60 * 1000): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/lock-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          duration,
          timestamp: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error locking account:', error);
      return false;
    }
  }
}

export default CredentialStuffingProtectionService;