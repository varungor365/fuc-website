/**
 * Secure Session Management Service
 * Provides secure session handling with advanced security features
 */

export interface SessionData {
  id: string;
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  geolocation?: {
    country: string;
    region: string;
    city: string;
  };
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  isActive: boolean;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  authenticationMethod: 'password' | 'passwordless' | 'social' | 'mfa';
  requiresReauth: boolean;
  metadata: Record<string, any>;
}

export interface SessionValidationResult {
  valid: boolean;
  session?: SessionData;
  requiresReauth: boolean;
  securityWarnings: string[];
  riskFactors: string[];
  recommendedActions: string[];
}

export interface SessionSecurityEvent {
  id: string;
  sessionId: string;
  type: 'login' | 'logout' | 'hijack_attempt' | 'concurrent_session' | 'location_anomaly' | 'device_change' | 'privilege_escalation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  actionTaken: string;
}

export interface SessionConfiguration {
  maxSessionDuration: number; // milliseconds
  inactivityTimeout: number; // milliseconds
  maxConcurrentSessions: number;
  requireSecureTransport: boolean;
  enableDeviceTracking: boolean;
  enableLocationTracking: boolean;
  strictDeviceValidation: boolean;
  autoLogoutOnSuspiciousActivity: boolean;
  sessionRotationInterval: number; // milliseconds
  securityEventNotifications: boolean;
}

export interface DeviceInfo {
  fingerprint: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  os: string;
  browser: string;
  trusted: boolean;
  lastSeen: Date;
  firstSeen: Date;
}

class SecureSessionManager {
  private baseUrl = '/api/session-management';
  private sessions: Map<string, SessionData> = new Map();
  private securityEvents: SessionSecurityEvent[] = [];
  private config: SessionConfiguration;
  private refreshTokens: Map<string, { token: string; sessionId: string; expiresAt: Date }> = new Map();

  constructor(config?: Partial<SessionConfiguration>) {
    this.config = {
      maxSessionDuration: 8 * 60 * 60 * 1000, // 8 hours
      inactivityTimeout: 30 * 60 * 1000, // 30 minutes
      maxConcurrentSessions: 5,
      requireSecureTransport: true,
      enableDeviceTracking: true,
      enableLocationTracking: true,
      strictDeviceValidation: false,
      autoLogoutOnSuspiciousActivity: true,
      sessionRotationInterval: 15 * 60 * 1000, // 15 minutes
      securityEventNotifications: true,
      ...config
    };

    this.startSessionCleanup();
    this.startSecurityMonitoring();
  }

  /**
   * Create a new secure session
   */
  async createSession(
    userId: string,
    email: string,
    deviceFingerprint: string,
    ipAddress: string,
    userAgent: string,
    authMethod: 'password' | 'passwordless' | 'social' | 'mfa',
    additionalData?: Record<string, any>
  ): Promise<{ sessionId: string; accessToken: string; refreshToken: string; expiresAt: Date }> {
    try {
      // Check for concurrent sessions
      await this.checkConcurrentSessions(userId);

      // Determine security level
      const securityLevel = this.determineSecurityLevel(authMethod, deviceFingerprint, ipAddress);

      // Get geolocation
      const geolocation = await this.getGeolocation(ipAddress);

      // Create session
      const sessionId = this.generateSecureId();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.config.maxSessionDuration);

      const session: SessionData = {
        id: sessionId,
        userId,
        email,
        roles: additionalData?.roles || ['user'],
        permissions: additionalData?.permissions || [],
        deviceFingerprint,
        ipAddress,
        userAgent,
        geolocation: geolocation || undefined,
        createdAt: now,
        lastActivityAt: now,
        expiresAt,
        isActive: true,
        securityLevel,
        authenticationMethod: authMethod,
        requiresReauth: false,
        metadata: additionalData || {}
      };

      // Store session
      this.sessions.set(sessionId, session);

      // Generate tokens
      const accessToken = await this.generateAccessToken(session);
      const refreshToken = await this.generateRefreshToken(sessionId);

      // Log security event
      await this.logSecurityEvent({
        sessionId,
        type: 'login',
        severity: 'low',
        description: `User logged in via ${authMethod}`,
        metadata: { authMethod, securityLevel },
        ipAddress,
        userAgent,
        actionTaken: 'session_created'
      });

      // Persist session
      await this.persistSession(session);

      return {
        sessionId,
        accessToken,
        refreshToken,
        expiresAt
      };

    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create secure session');
    }
  }

  /**
   * Validate and refresh session
   */
  async validateSession(
    sessionId: string,
    accessToken: string,
    currentIpAddress: string,
    currentUserAgent: string,
    currentDeviceFingerprint: string
  ): Promise<SessionValidationResult> {
    try {
      const session = this.sessions.get(sessionId) || await this.loadSession(sessionId);

      if (!session) {
        return {
          valid: false,
          requiresReauth: true,
          securityWarnings: ['Session not found'],
          riskFactors: [],
          recommendedActions: ['Please log in again']
        };
      }

      const warnings: string[] = [];
      const riskFactors: string[] = [];
      const actions: string[] = [];
      let requiresReauth = false;

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        return {
          valid: false,
          requiresReauth: true,
          securityWarnings: ['Session expired'],
          riskFactors: [],
          recommendedActions: ['Please log in again']
        };
      }

      // Check if session is inactive
      const inactivityPeriod = Date.now() - session.lastActivityAt.getTime();
      if (inactivityPeriod > this.config.inactivityTimeout) {
        await this.invalidateSession(sessionId);
        return {
          valid: false,
          requiresReauth: true,
          securityWarnings: ['Session timed out due to inactivity'],
          riskFactors: [],
          recommendedActions: ['Please log in again']
        };
      }

      // Validate access token
      const tokenValid = await this.validateAccessToken(accessToken, session);
      if (!tokenValid) {
        return {
          valid: false,
          requiresReauth: true,
          securityWarnings: ['Invalid access token'],
          riskFactors: [],
          recommendedActions: ['Please log in again']
        };
      }

      // Security checks
      const securityChecks = await this.performSecurityChecks(
        session,
        currentIpAddress,
        currentUserAgent,
        currentDeviceFingerprint
      );

      warnings.push(...securityChecks.warnings);
      riskFactors.push(...securityChecks.riskFactors);
      actions.push(...securityChecks.actions);

      if (securityChecks.requiresReauth) {
        requiresReauth = true;
      }

      // Update last activity
      session.lastActivityAt = new Date();
      this.sessions.set(sessionId, session);

      // Check if session rotation is needed
      const sessionAge = Date.now() - session.createdAt.getTime();
      if (sessionAge > this.config.sessionRotationInterval) {
        actions.push('Session will be rotated soon for security');
      }

      return {
        valid: !requiresReauth,
        session,
        requiresReauth,
        securityWarnings: warnings,
        riskFactors,
        recommendedActions: actions
      };

    } catch (error) {
      console.error('Error validating session:', error);
      return {
        valid: false,
        requiresReauth: true,
        securityWarnings: ['Session validation error'],
        riskFactors: [],
        recommendedActions: ['Please log in again']
      };
    }
  }

  /**
   * Perform comprehensive security checks
   */
  private async performSecurityChecks(
    session: SessionData,
    currentIpAddress: string,
    currentUserAgent: string,
    currentDeviceFingerprint: string
  ): Promise<{
    warnings: string[];
    riskFactors: string[];
    actions: string[];
    requiresReauth: boolean;
  }> {
    const warnings: string[] = [];
    const riskFactors: string[] = [];
    const actions: string[] = [];
    let requiresReauth = false;

    // IP Address validation
    if (session.ipAddress !== currentIpAddress) {
      const ipRisk = await this.analyzeIPChange(session.ipAddress, currentIpAddress, session.geolocation);
      
      if (ipRisk.severity === 'high') {
        riskFactors.push('Suspicious IP address change detected');
        requiresReauth = true;
        
        await this.logSecurityEvent({
          sessionId: session.id,
          type: 'location_anomaly',
          severity: 'high',
          description: `IP address changed from ${session.ipAddress} to ${currentIpAddress}`,
          metadata: { previousIP: session.ipAddress, newIP: currentIpAddress },
          ipAddress: currentIpAddress,
          userAgent: currentUserAgent,
          actionTaken: 'require_reauth'
        });
      } else if (ipRisk.severity === 'medium') {
        warnings.push('Your location appears to have changed');
        actions.push('Please verify this login attempt was made by you');
      }
    }

    // Device fingerprint validation
    if (this.config.enableDeviceTracking && session.deviceFingerprint !== currentDeviceFingerprint) {
      if (this.config.strictDeviceValidation) {
        riskFactors.push('Device fingerprint mismatch - possible session hijacking');
        requiresReauth = true;
        
        await this.logSecurityEvent({
          sessionId: session.id,
          type: 'device_change',
          severity: 'high',
          description: 'Device fingerprint changed during session',
          metadata: { 
            previousFingerprint: session.deviceFingerprint, 
            newFingerprint: currentDeviceFingerprint 
          },
          ipAddress: currentIpAddress,
          userAgent: currentUserAgent,
          actionTaken: 'require_reauth'
        });
      } else {
        warnings.push('Device characteristics have changed');
        actions.push('Please verify this is your device');
      }
    }

    // User agent validation
    if (session.userAgent !== currentUserAgent) {
      const uaChangeSeverity = this.analyzeUserAgentChange(session.userAgent, currentUserAgent);
      
      if (uaChangeSeverity === 'high') {
        riskFactors.push('Significant browser or device change detected');
        warnings.push('Your browser appears to have changed significantly');
      } else if (uaChangeSeverity === 'medium') {
        warnings.push('Minor browser changes detected');
      }
    }

    // Check for concurrent sessions
    const concurrentSessions = await this.getConcurrentSessions(session.userId);
    if (concurrentSessions.length > this.config.maxConcurrentSessions) {
      warnings.push(`You have ${concurrentSessions.length} active sessions`);
      actions.push('Consider logging out of unused sessions');
    }

    // Check for suspicious activity patterns
    const suspiciousActivity = await this.detectSuspiciousActivity(session.userId);
    if (suspiciousActivity.detected) {
      riskFactors.push(...suspiciousActivity.indicators);
      
      if (suspiciousActivity.severity === 'high') {
        requiresReauth = true;
      }
    }

    // Check session age and require periodic reauth for high-security operations
    const sessionAge = Date.now() - session.createdAt.getTime();
    if (session.securityLevel === 'critical' && sessionAge > 60 * 60 * 1000) { // 1 hour
      session.requiresReauth = true;
      actions.push('Please re-authenticate for continued access to sensitive features');
    }

    return {
      warnings,
      riskFactors,
      actions,
      requiresReauth
    };
  }

  /**
   * Refresh session with new tokens
   */
  async refreshSession(refreshToken: string): Promise<{
    sessionId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  } | null> {
    try {
      const tokenData = this.refreshTokens.get(refreshToken);
      
      if (!tokenData || tokenData.expiresAt < new Date()) {
        return null;
      }

      const session = this.sessions.get(tokenData.sessionId);
      if (!session || !session.isActive) {
        return null;
      }

      // Generate new tokens
      const newAccessToken = await this.generateAccessToken(session);
      const newRefreshToken = await this.generateRefreshToken(session.id);

      // Revoke old refresh token
      this.refreshTokens.delete(refreshToken);

      // Update session
      session.lastActivityAt = new Date();
      this.sessions.set(session.id, session);

      return {
        sessionId: session.id,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: session.expiresAt
      };

    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  }

  /**
   * Invalidate session
   */
  async invalidateSession(sessionId: string): Promise<boolean> {
    try {
      const session = this.sessions.get(sessionId);
      
      if (session) {
        session.isActive = false;
        this.sessions.delete(sessionId);

        // Remove refresh tokens
        for (const [token, data] of Array.from(this.refreshTokens.entries())) {
          if (data.sessionId === sessionId) {
            this.refreshTokens.delete(token);
          }
        }

        // Log security event
        await this.logSecurityEvent({
          sessionId,
          type: 'logout',
          severity: 'low',
          description: 'Session invalidated',
          metadata: {},
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          actionTaken: 'session_terminated'
        });

        // Persist changes
        await this.removePersistedSession(sessionId);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error invalidating session:', error);
      return false;
    }
  }

  /**
   * Invalidate all user sessions
   */
  async invalidateAllUserSessions(userId: string): Promise<number> {
    try {
      const userSessions = Array.from(this.sessions.values())
        .filter(session => session.userId === userId);

      let invalidatedCount = 0;

      for (const session of userSessions) {
        const success = await this.invalidateSession(session.id);
        if (success) {
          invalidatedCount++;
        }
      }

      return invalidatedCount;
    } catch (error) {
      console.error('Error invalidating all user sessions:', error);
      return 0;
    }
  }

  /**
   * Get user's active sessions
   */
  async getUserSessions(userId: string): Promise<SessionData[]> {
    try {
      return Array.from(this.sessions.values())
        .filter(session => session.userId === userId && session.isActive);
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  /**
   * Update session security level
   */
  async updateSessionSecurityLevel(
    sessionId: string,
    newLevel: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<boolean> {
    try {
      const session = this.sessions.get(sessionId);
      
      if (!session) {
        return false;
      }

      const previousLevel = session.securityLevel;
      session.securityLevel = newLevel;

      // If upgrading to critical, require reauth
      if (newLevel === 'critical' && previousLevel !== 'critical') {
        session.requiresReauth = true;
      }

      this.sessions.set(sessionId, session);

      await this.logSecurityEvent({
        sessionId,
        type: 'privilege_escalation',
        severity: 'medium',
        description: `Security level changed from ${previousLevel} to ${newLevel}`,
        metadata: { previousLevel, newLevel },
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        actionTaken: 'security_level_updated'
      });

      return true;
    } catch (error) {
      console.error('Error updating session security level:', error);
      return false;
    }
  }

  /**
   * Determine security level based on authentication method and context
   */
  private determineSecurityLevel(
    authMethod: string,
    deviceFingerprint: string,
    ipAddress: string
  ): 'low' | 'medium' | 'high' | 'critical' {
    let score = 0;

    // Base score by auth method
    switch (authMethod) {
      case 'mfa':
        score += 30;
        break;
      case 'passwordless':
        score += 25;
        break;
      case 'social':
        score += 15;
        break;
      case 'password':
        score += 10;
        break;
    }

    // Add device trust score (would be implemented with device history)
    // For now, assume unknown devices are less trusted
    score += 10; // Placeholder

    // Add IP reputation score (would be implemented with IP reputation service)
    score += 10; // Placeholder

    if (score >= 40) return 'critical';
    if (score >= 30) return 'high';
    if (score >= 20) return 'medium';
    return 'low';
  }

  /**
   * Check concurrent sessions
   */
  private async checkConcurrentSessions(userId: string): Promise<void> {
    const userSessions = Array.from(this.sessions.values())
      .filter(session => session.userId === userId && session.isActive);

    if (userSessions.length >= this.config.maxConcurrentSessions) {
      // Remove oldest session
      const oldestSession = userSessions.reduce((oldest, current) => 
        oldest.createdAt < current.createdAt ? oldest : current
      );

      await this.invalidateSession(oldestSession.id);
    }
  }

  /**
   * Analyze IP address change
   */
  private async analyzeIPChange(
    previousIP: string,
    newIP: string,
    previousLocation?: { country: string; region: string; city: string }
  ): Promise<{ severity: 'low' | 'medium' | 'high' }> {
    try {
      // Get geolocation for new IP
      const newLocation = await this.getGeolocation(newIP);

      if (!previousLocation || !newLocation) {
        return { severity: 'medium' };
      }

      // Different countries = high risk
      if (previousLocation.country !== newLocation.country) {
        return { severity: 'high' };
      }

      // Different regions = medium risk
      if (previousLocation.region !== newLocation.region) {
        return { severity: 'medium' };
      }

      // Same region = low risk
      return { severity: 'low' };

    } catch (error) {
      console.error('Error analyzing IP change:', error);
      return { severity: 'medium' };
    }
  }

  /**
   * Analyze user agent change
   */
  private analyzeUserAgentChange(previousUA: string, newUA: string): 'low' | 'medium' | 'high' {
    // Extract browser and OS information
    const extractInfo = (ua: string) => {
      const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/?([\d.]+)/);
      const os = ua.match(/(Windows|Mac|Linux|iOS|Android)/);
      return { browser: browser?.[1], os: os?.[1] };
    };

    const prev = extractInfo(previousUA);
    const current = extractInfo(newUA);

    // Different OS = high risk
    if (prev.os !== current.os) {
      return 'high';
    }

    // Different browser = medium risk
    if (prev.browser !== current.browser) {
      return 'medium';
    }

    // Same browser, possibly different version = low risk
    return 'low';
  }

  /**
   * Get geolocation from IP
   */
  private async getGeolocation(ipAddress: string): Promise<{
    country: string;
    region: string;
    city: string;
  } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/geolocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ipAddress })
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting geolocation:', error);
      return null;
    }
  }

  /**
   * Get concurrent sessions
   */
  private async getConcurrentSessions(userId: string): Promise<SessionData[]> {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId && session.isActive);
  }

  /**
   * Detect suspicious activity
   */
  private async detectSuspiciousActivity(userId: string): Promise<{
    detected: boolean;
    severity: 'low' | 'medium' | 'high';
    indicators: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/suspicious-activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        return { detected: false, severity: 'low', indicators: [] };
      }

      return await response.json();
    } catch (error) {
      console.error('Error detecting suspicious activity:', error);
      return { detected: false, severity: 'low', indicators: [] };
    }
  }

  /**
   * Generate secure session ID
   */
  private generateSecureId(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate access token
   */
  private async generateAccessToken(session: SessionData): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: session.id,
          userId: session.userId,
          roles: session.roles,
          permissions: session.permissions,
          securityLevel: session.securityLevel
        })
      });

      if (!response.ok) {
        throw new Error('Token generation failed');
      }

      const result = await response.json();
      return result.accessToken;
    } catch (error) {
      console.error('Error generating access token:', error);
      throw error;
    }
  }

  /**
   * Generate refresh token
   */
  private async generateRefreshToken(sessionId: string): Promise<string> {
    const crypto = require('crypto');
    const refreshToken = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    this.refreshTokens.set(refreshToken, {
      token: refreshToken,
      sessionId,
      expiresAt
    });

    return refreshToken;
  }

  /**
   * Validate access token
   */
  private async validateAccessToken(token: string, session: SessionData): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          sessionId: session.id
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error validating access token:', error);
      return false;
    }
  }

  /**
   * Persist session to storage
   */
  private async persistSession(session: SessionData): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/persist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(session)
      });
    } catch (error) {
      console.error('Error persisting session:', error);
    }
  }

  /**
   * Load session from storage
   */
  private async loadSession(sessionId: string): Promise<SessionData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/load/${sessionId}`);
      
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading session:', error);
      return null;
    }
  }

  /**
   * Remove persisted session
   */
  private async removePersistedSession(sessionId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/remove/${sessionId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error removing persisted session:', error);
    }
  }

  /**
   * Log security event
   */
  private async logSecurityEvent(event: Omit<SessionSecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const securityEvent: SessionSecurityEvent = {
      id: this.generateSecureId(),
      timestamp: new Date(),
      ...event
    };

    this.securityEvents.push(securityEvent);

    try {
      await fetch(`${this.baseUrl}/security-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(securityEvent)
      });
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  /**
   * Start session cleanup task
   */
  private startSessionCleanup(): void {
    setInterval(() => {
      const now = new Date();
      
      for (const [sessionId, session] of Array.from(this.sessions.entries())) {
        // Remove expired sessions
        if (session.expiresAt < now || !session.isActive) {
          this.sessions.delete(sessionId);
        }
        
        // Remove inactive sessions
        const inactiveTime = now.getTime() - session.lastActivityAt.getTime();
        if (inactiveTime > this.config.inactivityTimeout) {
          this.invalidateSession(sessionId);
        }
      }

      // Clean up expired refresh tokens
      for (const [token, data] of Array.from(this.refreshTokens.entries())) {
        if (data.expiresAt < now) {
          this.refreshTokens.delete(token);
        }
      }
    }, 60 * 1000); // Run every minute
  }

  /**
   * Start security monitoring
   */
  private startSecurityMonitoring(): void {
    setInterval(() => {
      // Monitor for suspicious patterns
      this.detectAnomalousActivity();
    }, 5 * 60 * 1000); // Run every 5 minutes
  }

  /**
   * Detect anomalous activity across all sessions
   */
  private async detectAnomalousActivity(): Promise<void> {
    try {
      // Group sessions by user to detect concurrent login patterns
      const userSessions = new Map<string, SessionData[]>();
      
      for (const session of Array.from(this.sessions.values())) {
        if (!userSessions.has(session.userId)) {
          userSessions.set(session.userId, []);
        }
        userSessions.get(session.userId)!.push(session);
      }

      // Check for suspicious patterns
      for (const [userId, sessions] of Array.from(userSessions.entries())) {
        // Multiple geographic locations
        const locations = new Set(sessions.map((s: SessionData) => `${s.geolocation?.country}:${s.geolocation?.city}`));
        if (locations.size > 3) {
          await this.logSecurityEvent({
            sessionId: sessions[0].id,
            type: 'concurrent_session',
            severity: 'medium',
            description: `User has active sessions in ${locations.size} different locations`,
            metadata: { locations: Array.from(locations) },
            ipAddress: sessions[0].ipAddress,
            userAgent: sessions[0].userAgent,
            actionTaken: 'monitoring'
          });
        }

        // Too many concurrent sessions
        if (sessions.length > this.config.maxConcurrentSessions * 1.5) {
          await this.logSecurityEvent({
            sessionId: sessions[0].id,
            type: 'concurrent_session',
            severity: 'high',
            description: `User has ${sessions.length} concurrent sessions`,
            metadata: { sessionCount: sessions.length },
            ipAddress: sessions[0].ipAddress,
            userAgent: sessions[0].userAgent,
            actionTaken: 'investigation_required'
          });
        }
      }
    } catch (error) {
      console.error('Error detecting anomalous activity:', error);
    }
  }

  /**
   * Get session security statistics
   */
  async getSecurityStats(period: 'hour' | 'day' | 'week' = 'day'): Promise<{
    totalSessions: number;
    activeSessions: number;
    securityEvents: number;
    topRiskFactors: Array<{ factor: string; count: number }>;
    averageSessionDuration: number;
    concurrentSessionsDistribution: Record<string, number>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/security-stats?period=${period}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch security stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching security stats:', error);
      return {
        totalSessions: 0,
        activeSessions: 0,
        securityEvents: 0,
        topRiskFactors: [],
        averageSessionDuration: 0,
        concurrentSessionsDistribution: {}
      };
    }
  }
}

export default SecureSessionManager;