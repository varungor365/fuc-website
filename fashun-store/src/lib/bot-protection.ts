/**
 * Advanced Bot Protection Service
 * Uses behavioral analysis, device fingerprinting, and ML to detect automated traffic
 */

export interface BotDetectionResult {
  isBot: boolean;
  confidence: number; // 0-100
  botType?: 'crawler' | 'scraper' | 'malicious' | 'automation' | 'unknown';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  allowedActions: string[];
  restrictions: string[];
  challengeRequired: boolean;
  challengeType?: 'captcha' | 'behavioral' | 'human_verification';
}

export interface DeviceFingerprint {
  userAgent: string;
  language: string;
  platform: string;
  vendor: string;
  cookieEnabled: boolean;
  javaScriptEnabled: boolean;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelRatio: number;
  };
  timezone: string;
  timezoneOffset: number;
  plugins: string[];
  fonts: string[];
  canvas: string;
  webgl: string;
  audio: string;
  webrtc: string[];
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  webSockets: boolean;
  touchPoints: number;
  hardwareConcurrency: number;
  memory: number;
}

export interface BehavioralMetrics {
  sessionId: string;
  startTime: Date;
  interactions: InteractionEvent[];
  mouseMovements: MouseMovement[];
  keystrokes: Keystroke[];
  scrollEvents: ScrollEvent[];
  clickEvents: ClickEvent[];
  focusEvents: FocusEvent[];
  pageViews: PageView[];
  formInteractions: FormInteraction[];
}

export interface InteractionEvent {
  type: 'mouse' | 'keyboard' | 'scroll' | 'click' | 'focus' | 'touch';
  timestamp: number;
  x?: number;
  y?: number;
  duration?: number;
  target?: string;
  data?: any;
}

export interface MouseMovement {
  x: number;
  y: number;
  timestamp: number;
  velocity: number;
  acceleration: number;
  pressure?: number;
}

export interface Keystroke {
  key: string;
  timestamp: number;
  dwellTime: number;
  flightTime: number;
  pressure?: number;
}

export interface ScrollEvent {
  direction: 'up' | 'down';
  distance: number;
  timestamp: number;
  velocity: number;
}

export interface ClickEvent {
  x: number;
  y: number;
  timestamp: number;
  target: string;
  button: number;
  duration: number;
}

export interface FocusEvent {
  target: string;
  timestamp: number;
  duration: number;
}

export interface PageView {
  url: string;
  timestamp: number;
  duration: number;
  referrer: string;
  scrollDepth: number;
}

export interface FormInteraction {
  fieldName: string;
  action: 'focus' | 'blur' | 'input' | 'paste' | 'autocomplete';
  timestamp: number;
  value?: string;
  inputMethod?: 'typing' | 'paste' | 'autocomplete';
  duration?: number;
}

export interface BotSignature {
  id: string;
  name: string;
  patterns: {
    userAgents: string[];
    ipRanges: string[];
    behaviors: Array<{
      type: string;
      threshold: number;
      comparison: 'greater' | 'less' | 'equal';
    }>;
  };
  severity: 'low' | 'medium' | 'high';
  action: 'monitor' | 'challenge' | 'block';
}

class BotProtectionService {
  private baseUrl = '/api/bot-protection';
  private signatures: BotSignature[] = [];
  private behavioralData: Map<string, BehavioralMetrics> = new Map();
  private deviceFingerprints: Map<string, DeviceFingerprint> = new Map();
  
  constructor() {
    this.initializeSignatures();
    this.startBehavioralTracking();
  }

  /**
   * Analyze request for bot activity
   */
  async analyzeBotActivity(
    sessionId: string,
    ipAddress: string,
    userAgent: string,
    headers: Record<string, string>
  ): Promise<BotDetectionResult> {
    try {
      const results: BotDetectionResult[] = [];

      // User agent analysis
      const uaResult = this.analyzeUserAgent(userAgent);
      results.push(uaResult);

      // Header analysis
      const headerResult = this.analyzeHeaders(headers);
      results.push(headerResult);

      // Behavioral analysis
      const behavioralResult = await this.analyzeBehavior(sessionId);
      results.push(behavioralResult);

      // Device fingerprint analysis
      const fingerprintResult = this.analyzeDeviceFingerprint(sessionId);
      results.push(fingerprintResult);

      // IP reputation analysis
      const ipResult = await this.analyzeIPReputation(ipAddress);
      results.push(ipResult);

      // Rate limiting analysis
      const rateResult = await this.analyzeRateLimit(ipAddress, sessionId);
      results.push(rateResult);

      // ML-based analysis
      const mlResult = await this.analyzeWithML(sessionId, ipAddress, userAgent);
      results.push(mlResult);

      // Combine results
      const finalResult = this.combineResults(results);

      // Log detection
      await this.logBotDetection(sessionId, ipAddress, finalResult);

      return finalResult;

    } catch (error) {
      console.error('Error analyzing bot activity:', error);
      
      return {
        isBot: false,
        confidence: 0,
        riskLevel: 'low',
        reasons: ['Analysis error'],
        allowedActions: ['all'],
        restrictions: [],
        challengeRequired: false
      };
    }
  }

  /**
   * Analyze user agent for bot signatures
   */
  private analyzeUserAgent(userAgent: string): BotDetectionResult {
    const botPatterns = [
      // Common bots
      /bot|crawler|spider|scraper/i,
      // Headless browsers
      /headless|phantom|selenium|puppeteer/i,
      // Automated tools
      /curl|wget|python|ruby|go-http|httpclient/i,
      // Known bad actors
      /zgrab|masscan|nmap|nikto/i
    ];

    const suspiciousPatterns = [
      // Empty or minimal user agents
      /^$/,
      /^Mozilla\/5\.0$/,
      // Unusual versions
      /Firefox\/1\./,
      /Chrome\/1\./,
      // Missing expected components
      /^Mozilla\/\d+\.\d+$/
    ];

    let confidence = 0;
    const reasons: string[] = [];

    // Check for bot patterns
    for (const pattern of botPatterns) {
      if (pattern.test(userAgent)) {
        confidence += 80;
        reasons.push(`User agent matches bot pattern: ${pattern.source}`);
        break;
      }
    }

    // Check for suspicious patterns
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(userAgent)) {
        confidence += 40;
        reasons.push(`User agent matches suspicious pattern: ${pattern.source}`);
      }
    }

    // Check for known good browsers
    const goodBrowsers = /Chrome|Firefox|Safari|Edge|Opera/i;
    if (!goodBrowsers.test(userAgent) && confidence === 0) {
      confidence += 30;
      reasons.push('User agent does not match known browsers');
    }

    return {
      isBot: confidence >= 50,
      confidence: Math.min(100, confidence),
      riskLevel: confidence >= 80 ? 'high' : confidence >= 50 ? 'medium' : 'low',
      reasons,
      allowedActions: confidence >= 80 ? ['read'] : ['all'],
      restrictions: confidence >= 80 ? ['write', 'purchase'] : [],
      challengeRequired: confidence >= 60,
      challengeType: confidence >= 80 ? 'captcha' : 'behavioral'
    };
  }

  /**
   * Analyze HTTP headers for bot signatures
   */
  private analyzeHeaders(headers: Record<string, string>): BotDetectionResult {
    let confidence = 0;
    const reasons: string[] = [];

    // Check for missing standard headers
    const requiredHeaders = ['accept', 'accept-language', 'accept-encoding'];
    const missingHeaders = requiredHeaders.filter(h => !headers[h]);
    
    if (missingHeaders.length > 0) {
      confidence += missingHeaders.length * 20;
      reasons.push(`Missing standard headers: ${missingHeaders.join(', ')}`);
    }

    // Check for unusual header values
    if (headers['accept'] === '*/*') {
      confidence += 30;
      reasons.push('Generic accept header suggests automated client');
    }

    if (!headers['accept-language'] || headers['accept-language'] === '*') {
      confidence += 25;
      reasons.push('Missing or generic accept-language header');
    }

    // Check for bot-specific headers
    const botHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'x-cluster-client-ip',
      'x-forwarded',
      'forwarded-for',
      'forwarded'
    ];

    const proxyHeaders = botHeaders.filter(h => headers[h]);
    if (proxyHeaders.length > 2) {
      confidence += 20;
      reasons.push('Multiple proxy headers suggest bot traffic');
    }

    // Check for automation tools
    if (headers['user-agent'] && /automation|test|bot/i.test(headers['user-agent'])) {
      confidence += 60;
      reasons.push('User agent indicates automation tool');
    }

    return {
      isBot: confidence >= 50,
      confidence: Math.min(100, confidence),
      riskLevel: confidence >= 70 ? 'high' : confidence >= 40 ? 'medium' : 'low',
      reasons,
      allowedActions: confidence >= 70 ? ['read'] : ['all'],
      restrictions: confidence >= 70 ? ['write', 'purchase'] : [],
      challengeRequired: confidence >= 60,
      challengeType: 'captcha'
    };
  }

  /**
   * Analyze behavioral patterns
   */
  private async analyzeBehavior(sessionId: string): Promise<BotDetectionResult> {
    const behavior = this.behavioralData.get(sessionId);
    
    if (!behavior) {
      return {
        isBot: false,
        confidence: 0,
        riskLevel: 'low',
        reasons: ['No behavioral data available'],
        allowedActions: ['all'],
        restrictions: [],
        challengeRequired: false
      };
    }

    let confidence = 0;
    const reasons: string[] = [];

    // Analyze mouse movements
    if (behavior.mouseMovements.length === 0) {
      confidence += 40;
      reasons.push('No mouse movements detected');
    } else {
      // Check for unnatural movement patterns
      const movements = behavior.mouseMovements;
      const straightLines = this.detectStraightLineMovements(movements);
      
      if (straightLines > movements.length * 0.8) {
        confidence += 50;
        reasons.push('Unnatural straight-line mouse movements');
      }

      // Check movement velocity
      const avgVelocity = movements.reduce((sum, m) => sum + m.velocity, 0) / movements.length;
      if (avgVelocity > 1000 || avgVelocity < 10) {
        confidence += 30;
        reasons.push('Unusual mouse movement velocity');
      }
    }

    // Analyze keystroke patterns
    if (behavior.keystrokes.length > 0) {
      const keystrokes = behavior.keystrokes;
      const avgDwellTime = keystrokes.reduce((sum, k) => sum + k.dwellTime, 0) / keystrokes.length;
      const avgFlightTime = keystrokes.reduce((sum, k) => sum + k.flightTime, 0) / keystrokes.length;

      // Humans have variable typing patterns
      if (avgDwellTime < 50 || avgDwellTime > 500) {
        confidence += 25;
        reasons.push('Unusual keystroke dwell time');
      }

      if (avgFlightTime < 20 || avgFlightTime > 300) {
        confidence += 25;
        reasons.push('Unusual keystroke flight time');
      }

      // Check for too-regular typing
      const dwellVariance = this.calculateVariance(keystrokes.map(k => k.dwellTime));
      if (dwellVariance < 100) {
        confidence += 30;
        reasons.push('Too-regular typing pattern suggests automation');
      }
    }

    // Analyze click patterns
    if (behavior.clickEvents.length > 0) {
      const clicks = behavior.clickEvents;
      const intervals = [];
      
      for (let i = 1; i < clicks.length; i++) {
        intervals.push(clicks[i].timestamp - clicks[i-1].timestamp);
      }

      // Check for too-regular click intervals
      if (intervals.length > 1) {
        const intervalVariance = this.calculateVariance(intervals);
        if (intervalVariance < 100) {
          confidence += 35;
          reasons.push('Too-regular click intervals');
        }
      }

      // Check for inhuman click speed
      const rapidClicks = intervals.filter(i => i < 100).length;
      if (rapidClicks > intervals.length * 0.5) {
        confidence += 40;
        reasons.push('Abnormally fast clicking detected');
      }
    }

    // Analyze scroll behavior
    if (behavior.scrollEvents.length > 0) {
      const scrolls = behavior.scrollEvents;
      const avgVelocity = scrolls.reduce((sum, s) => sum + s.velocity, 0) / scrolls.length;

      if (avgVelocity > 2000) {
        confidence += 25;
        reasons.push('Abnormally fast scrolling');
      }

      // Check for too-regular scrolling
      const distances = scrolls.map(s => s.distance);
      const distanceVariance = this.calculateVariance(distances);
      if (distanceVariance < 10) {
        confidence += 20;
        reasons.push('Too-regular scroll distances');
      }
    }

    // Analyze page view patterns
    if (behavior.pageViews.length > 0) {
      const pageViews = behavior.pageViews;
      const avgDuration = pageViews.reduce((sum, p) => sum + p.duration, 0) / pageViews.length;

      if (avgDuration < 1000) { // Less than 1 second per page
        confidence += 45;
        reasons.push('Abnormally short page view durations');
      }

      // Check for sequential URL patterns
      const sequentialPages = this.detectSequentialAccess(pageViews);
      if (sequentialPages) {
        confidence += 30;
        reasons.push('Sequential page access pattern detected');
      }
    }

    return {
      isBot: confidence >= 50,
      confidence: Math.min(100, confidence),
      riskLevel: confidence >= 80 ? 'critical' : confidence >= 60 ? 'high' : confidence >= 40 ? 'medium' : 'low',
      reasons,
      allowedActions: confidence >= 80 ? [] : confidence >= 60 ? ['read'] : ['all'],
      restrictions: confidence >= 60 ? ['write', 'purchase'] : [],
      challengeRequired: confidence >= 40,
      challengeType: confidence >= 60 ? 'human_verification' : 'behavioral'
    };
  }

  /**
   * Analyze device fingerprint
   */
  private analyzeDeviceFingerprint(sessionId: string): BotDetectionResult {
    const fingerprint = this.deviceFingerprints.get(sessionId);
    
    if (!fingerprint) {
      return {
        isBot: false,
        confidence: 30,
        riskLevel: 'medium',
        reasons: ['No device fingerprint available'],
        allowedActions: ['all'],
        restrictions: [],
        challengeRequired: true,
        challengeType: 'captcha'
      };
    }

    let confidence = 0;
    const reasons: string[] = [];

    // Check for headless browser indicators
    if (fingerprint.webgl === 'swiftshader' || fingerprint.webgl.includes('llvmpipe')) {
      confidence += 60;
      reasons.push('Headless browser WebGL renderer detected');
    }

    // Check for missing plugins (modern browsers have some plugins)
    if (fingerprint.plugins.length === 0) {
      confidence += 30;
      reasons.push('No browser plugins detected');
    }

    // Check for suspicious canvas fingerprint
    if (fingerprint.canvas === 'blocked' || fingerprint.canvas.length < 10) {
      confidence += 25;
      reasons.push('Suspicious canvas fingerprint');
    }

    // Check for disabled storage APIs (common in bots)
    if (!fingerprint.localStorage || !fingerprint.sessionStorage) {
      confidence += 20;
      reasons.push('Storage APIs disabled');
    }

    // Check for unusual screen resolution
    const { width, height } = fingerprint.screen;
    if (width === 1024 && height === 768) { // Common default for automation
      confidence += 15;
      reasons.push('Common automation screen resolution');
    }

    // Check for missing touch support on mobile user agents
    if (fingerprint.userAgent.includes('Mobile') && fingerprint.touchPoints === 0) {
      confidence += 35;
      reasons.push('Mobile user agent with no touch support');
    }

    // Check for impossible hardware values
    if (fingerprint.hardwareConcurrency > 32 || fingerprint.memory > 32) {
      confidence += 20;
      reasons.push('Suspicious hardware specifications');
    }

    return {
      isBot: confidence >= 50,
      confidence: Math.min(100, confidence),
      riskLevel: confidence >= 70 ? 'high' : confidence >= 40 ? 'medium' : 'low',
      reasons,
      allowedActions: confidence >= 70 ? ['read'] : ['all'],
      restrictions: confidence >= 70 ? ['write', 'purchase'] : [],
      challengeRequired: confidence >= 40,
      challengeType: 'captcha'
    };
  }

  /**
   * Analyze IP reputation
   */
  private async analyzeIPReputation(ipAddress: string): Promise<BotDetectionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/ip-reputation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ipAddress })
      });

      if (!response.ok) {
        throw new Error('IP reputation check failed');
      }

      return await response.json();

    } catch (error) {
      console.error('IP reputation analysis error:', error);
      return {
        isBot: false,
        confidence: 0,
        riskLevel: 'low',
        reasons: ['IP reputation check unavailable'],
        allowedActions: ['all'],
        restrictions: [],
        challengeRequired: false
      };
    }
  }

  /**
   * Analyze rate limiting patterns
   */
  private async analyzeRateLimit(ipAddress: string, sessionId: string): Promise<BotDetectionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/rate-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ipAddress, sessionId })
      });

      if (!response.ok) {
        throw new Error('Rate limit analysis failed');
      }

      return await response.json();

    } catch (error) {
      console.error('Rate limit analysis error:', error);
      return {
        isBot: false,
        confidence: 0,
        riskLevel: 'low',
        reasons: ['Rate limit analysis unavailable'],
        allowedActions: ['all'],
        restrictions: [],
        challengeRequired: false
      };
    }
  }

  /**
   * ML-based bot detection
   */
  private async analyzeWithML(sessionId: string, ipAddress: string, userAgent: string): Promise<BotDetectionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/ml-detection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          ipAddress,
          userAgent,
          behavioral: this.behavioralData.get(sessionId),
          fingerprint: this.deviceFingerprints.get(sessionId)
        })
      });

      if (!response.ok) {
        throw new Error('ML detection failed');
      }

      return await response.json();

    } catch (error) {
      console.error('ML detection error:', error);
      return {
        isBot: false,
        confidence: 0,
        riskLevel: 'low',
        reasons: ['ML detection unavailable'],
        allowedActions: ['all'],
        restrictions: [],
        challengeRequired: false
      };
    }
  }

  /**
   * Combine multiple detection results
   */
  private combineResults(results: BotDetectionResult[]): BotDetectionResult {
    const weights = [0.2, 0.15, 0.25, 0.15, 0.1, 0.05, 0.1]; // User agent, headers, behavior, fingerprint, IP, rate, ML
    
    let totalConfidence = 0;
    let totalWeight = 0;
    const allReasons: string[] = [];
    const allRestrictions: string[] = [];
    let highestRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let challengeRequired = false;
    let challengeType: 'captcha' | 'behavioral' | 'human_verification' = 'captcha';

    results.forEach((result, index) => {
      const weight = weights[index] || 0.1;
      totalConfidence += result.confidence * weight;
      totalWeight += weight;
      
      allReasons.push(...result.reasons);
      allRestrictions.push(...result.restrictions);
      
      if (result.challengeRequired) {
        challengeRequired = true;
        if (result.challengeType) {
          challengeType = result.challengeType;
        }
      }

      // Determine highest risk level
      const riskLevels = ['low', 'medium', 'high', 'critical'];
      if (riskLevels.indexOf(result.riskLevel) > riskLevels.indexOf(highestRisk)) {
        highestRisk = result.riskLevel;
      }
    });

    const finalConfidence = totalWeight > 0 ? totalConfidence / totalWeight : 0;
    const uniqueRestrictions = Array.from(new Set(allRestrictions));

    return {
      isBot: finalConfidence >= 50,
      confidence: Math.round(finalConfidence),
      riskLevel: highestRisk,
      reasons: allReasons,
      allowedActions: uniqueRestrictions.length > 0 ? 
        ['read', 'browse'].filter(action => !uniqueRestrictions.includes(action)) : 
        ['all'],
      restrictions: uniqueRestrictions,
      challengeRequired,
      challengeType
    };
  }

  /**
   * Detect straight line mouse movements
   */
  private detectStraightLineMovements(movements: MouseMovement[]): number {
    let straightLines = 0;
    
    for (let i = 2; i < movements.length; i++) {
      const p1 = movements[i-2];
      const p2 = movements[i-1];
      const p3 = movements[i];
      
      // Calculate if points are roughly collinear
      const slope1 = (p2.y - p1.y) / (p2.x - p1.x);
      const slope2 = (p3.y - p2.y) / (p3.x - p2.x);
      
      if (Math.abs(slope1 - slope2) < 0.1) {
        straightLines++;
      }
    }
    
    return straightLines;
  }

  /**
   * Calculate variance of an array
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Detect sequential page access patterns
   */
  private detectSequentialAccess(pageViews: PageView[]): boolean {
    if (pageViews.length < 3) return false;
    
    let sequentialCount = 0;
    for (let i = 1; i < pageViews.length; i++) {
      const current = pageViews[i].url;
      const previous = pageViews[i-1].url;
      
      // Check if URLs follow a pattern (e.g., page1, page2, page3)
      const currentNum = this.extractNumber(current);
      const previousNum = this.extractNumber(previous);
      
      if (currentNum && previousNum && currentNum === previousNum + 1) {
        sequentialCount++;
      }
    }
    
    return sequentialCount >= pageViews.length * 0.6;
  }

  /**
   * Extract number from URL
   */
  private extractNumber(url: string): number | null {
    const match = url.match(/\/(\d+)(?:\/|$)/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Start behavioral tracking
   */
  private startBehavioralTracking(): void {
    if (typeof window === 'undefined') return;

    // Track mouse movements
    document.addEventListener('mousemove', (e) => {
      // Implementation would track mouse movements
    });

    // Track keystrokes
    document.addEventListener('keydown', (e) => {
      // Implementation would track keystroke patterns
    });

    // Track scroll events
    document.addEventListener('scroll', (e) => {
      // Implementation would track scroll behavior
    });
  }

  /**
   * Initialize bot signatures
   */
  private initializeSignatures(): void {
    this.signatures = [
      {
        id: 'common_crawlers',
        name: 'Common Web Crawlers',
        patterns: {
          userAgents: ['googlebot', 'bingbot', 'facebookexternalhit', 'twitterbot'],
          ipRanges: [],
          behaviors: []
        },
        severity: 'low',
        action: 'monitor'
      },
      {
        id: 'scrapers',
        name: 'Content Scrapers',
        patterns: {
          userAgents: ['python', 'curl', 'wget', 'scrapy'],
          ipRanges: [],
          behaviors: [
            { type: 'page_view_duration', threshold: 1000, comparison: 'less' },
            { type: 'requests_per_minute', threshold: 60, comparison: 'greater' }
          ]
        },
        severity: 'high',
        action: 'challenge'
      }
    ];
  }

  /**
   * Log bot detection
   */
  private async logBotDetection(sessionId: string, ipAddress: string, result: BotDetectionResult): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          ipAddress,
          result,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error logging bot detection:', error);
    }
  }

  /**
   * Track behavioral data
   */
  trackBehavior(sessionId: string, event: InteractionEvent): void {
    if (!this.behavioralData.has(sessionId)) {
      this.behavioralData.set(sessionId, {
        sessionId,
        startTime: new Date(),
        interactions: [],
        mouseMovements: [],
        keystrokes: [],
        scrollEvents: [],
        clickEvents: [],
        focusEvents: [],
        pageViews: [],
        formInteractions: []
      });
    }

    const behavior = this.behavioralData.get(sessionId)!;
    behavior.interactions.push(event);

    // Add to specific event arrays based on type
    switch (event.type) {
      case 'mouse':
        if (event.x !== undefined && event.y !== undefined) {
          behavior.mouseMovements.push({
            x: event.x,
            y: event.y,
            timestamp: event.timestamp,
            velocity: 0, // Calculate from previous movements
            acceleration: 0
          });
        }
        break;
      // Add other event type handling as needed
    }
  }

  /**
   * Set device fingerprint
   */
  setDeviceFingerprint(sessionId: string, fingerprint: DeviceFingerprint): void {
    this.deviceFingerprints.set(sessionId, fingerprint);
  }

  /**
   * Get bot protection statistics
   */
  async getBotStats(period: 'hour' | 'day' | 'week' = 'day'): Promise<{
    totalRequests: number;
    botRequests: number;
    botPercentage: number;
    challengesSent: number;
    challengeSuccess: number;
    blockedRequests: number;
    topBotTypes: Array<{ type: string; count: number }>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/stats?period=${period}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bot stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching bot stats:', error);
      return {
        totalRequests: 0,
        botRequests: 0,
        botPercentage: 0,
        challengesSent: 0,
        challengeSuccess: 0,
        blockedRequests: 0,
        topBotTypes: []
      };
    }
  }
}

export default BotProtectionService;