/**
 * Profile Analytics System
 * Comprehensive tracking and insights for user profiles
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: 'page_view' | 'link_click' | 'qr_scan' | 'social_click' | 'download' | 'share';
  event_data: Record<string, any>;
  visitor_id?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  timestamp: Date;
}

export interface AnalyticsMetrics {
  totalViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topSources: Array<{ source: string; count: number; percentage: number }>;
  topCountries: Array<{ country: string; count: number; percentage: number }>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  hourlyDistribution: Record<string, number>;
  dailyStats: Array<{
    date: string;
    views: number;
    visitors: number;
    clicks: number;
    qrScans: number;
  }>;
}

export interface RealtimeStats {
  activeVisitors: number;
  viewsToday: number;
  clicksToday: number;
  qrScansToday: number;
  topPagesRealtime: Array<{ page: string; visitors: number }>;
}

/**
 * Analytics Tracking Service
 */
export class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Track analytics event
   */
  async trackEvent(
    userId: string,
    eventType: string,
    eventData: Record<string, any> = {},
    metadata: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      console.log(`📊 [Analytics] Tracking event: ${eventType} for user: ${userId}`);

      // Generate or get visitor ID for session tracking
      const visitorId = metadata.visitorId || this.generateVisitorId();

      // Parse user agent for device/browser info
      const deviceInfo = this.parseUserAgent(metadata.userAgent || '');
      
      // Get location info (in production, use a GeoIP service)
      const locationInfo = await this.getLocationInfo(metadata.ipAddress);

      // Insert analytics event
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          user_id: userId,
          event_type: eventType,
          event_data: eventData,
          visitor_id: visitorId,
          ip_address: metadata.ipAddress,
          user_agent: metadata.userAgent,
          referrer: metadata.referrer,
          country: locationInfo.country,
          city: locationInfo.city,
          device_type: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Error tracking analytics event:', error);
        return false;
      }

      // Update real-time counters
      await this.updateRealtimeCounters(userId, eventType);

      // Update profile analytics summary
      if (eventType === 'page_view') {
        await this.updateProfileAnalyticsSummary(userId, visitorId, metadata.ipAddress);
      }

      console.log(`✅ [Analytics] Event tracked successfully: ${eventType}`);
      return true;

    } catch (error) {
      console.error('❌ [Analytics] Error tracking event:', error);
      return false;
    }
  }

  /**
   * Generate unique visitor ID
   */
  private generateVisitorId(): string {
    return `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Parse user agent for device information
   */
  private parseUserAgent(userAgent: string) {
    const deviceInfo = {
      deviceType: 'desktop',
      browser: 'unknown',
      os: 'unknown'
    };

    // Simple user agent parsing (in production, use a library like ua-parser-js)
    if (/mobile|android|iphone|ipad/i.test(userAgent)) {
      deviceInfo.deviceType = /ipad/i.test(userAgent) ? 'tablet' : 'mobile';
    }

    if (/chrome/i.test(userAgent)) deviceInfo.browser = 'Chrome';
    else if (/firefox/i.test(userAgent)) deviceInfo.browser = 'Firefox';
    else if (/safari/i.test(userAgent)) deviceInfo.browser = 'Safari';
    else if (/edge/i.test(userAgent)) deviceInfo.browser = 'Edge';

    if (/windows/i.test(userAgent)) deviceInfo.os = 'Windows';
    else if (/mac/i.test(userAgent)) deviceInfo.os = 'macOS';
    else if (/linux/i.test(userAgent)) deviceInfo.os = 'Linux';
    else if (/android/i.test(userAgent)) deviceInfo.os = 'Android';
    else if (/ios|iphone|ipad/i.test(userAgent)) deviceInfo.os = 'iOS';

    return deviceInfo;
  }

  /**
   * Get location information from IP
   */
  private async getLocationInfo(ipAddress?: string) {
    // In production, integrate with a GeoIP service like MaxMind or IPinfo
    // For demo purposes, return mock data
    return {
      country: 'United States',
      city: 'New York'
    };
  }

  /**
   * Update real-time counters
   */
  private async updateRealtimeCounters(userId: string, eventType: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Update or insert today's counters
      const { error } = await supabase
        .from('analytics_daily_counters')
        .upsert({
          user_id: userId,
          date: today,
          page_views: eventType === 'page_view' ? 1 : 0,
          link_clicks: eventType === 'link_click' ? 1 : 0,
          qr_scans: eventType === 'qr_scan' ? 1 : 0,
          social_clicks: eventType === 'social_click' ? 1 : 0,
          downloads: eventType === 'download' ? 1 : 0,
          shares: eventType === 'share' ? 1 : 0,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error updating daily counters:', error);
      }

    } catch (error) {
      console.error('Error in updateRealtimeCounters:', error);
    }
  }

  /**
   * Update profile analytics summary
   */
  private async updateProfileAnalyticsSummary(userId: string, visitorId: string, ipAddress?: string) {
    try {
      // Check if this is a unique visitor today
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingVisit } = await supabase
        .from('analytics_events')
        .select('id')
        .eq('user_id', userId)
        .eq('visitor_id', visitorId)
        .gte('timestamp', `${today}T00:00:00`)
        .limit(1);

      const isUniqueVisitor = !existingVisit || existingVisit.length === 0;

      // Update profile analytics
      const { error } = await supabase
        .rpc('update_profile_analytics', {
          p_user_id: userId,
          p_action: 'view',
          p_increment: 1,
          p_is_unique: isUniqueVisitor
        });

      if (error) {
        console.error('Error updating profile analytics:', error);
      }

    } catch (error) {
      console.error('Error in updateProfileAnalyticsSummary:', error);
    }
  }

  /**
   * Get comprehensive analytics for a user
   */
  async getAnalytics(userId: string, days: number = 30): Promise<AnalyticsMetrics | null> {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      console.log(`📊 [Analytics] Fetching analytics for user: ${userId}, days: ${days}`);

      // Get all events for the period
      const { data: events, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });

      if (eventsError) {
        console.error('Error fetching analytics events:', eventsError);
        return null;
      }

      // Process analytics data
      const analytics = this.processAnalyticsData(events || [], days);

      console.log(`✅ [Analytics] Analytics processed for user: ${userId}`);
      return analytics;

    } catch (error) {
      console.error('❌ [Analytics] Error fetching analytics:', error);
      return null;
    }
  }

  /**
   * Process raw analytics data into metrics
   */
  private processAnalyticsData(events: any[], days: number): AnalyticsMetrics {
    const totalViews = events.filter(e => e.event_type === 'page_view').length;
    const uniqueVisitors = new Set(events.map(e => e.visitor_id)).size;
    
    // Calculate top sources
    const sourceCount: Record<string, number> = {};
    events.forEach(event => {
      const source = this.extractSource(event.referrer) || 'Direct';
      sourceCount[source] = (sourceCount[source] || 0) + 1;
    });

    const topSources = Object.entries(sourceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([source, count]) => ({
        source,
        count,
        percentage: (count / events.length) * 100
      }));

    // Calculate top countries
    const countryCount: Record<string, number> = {};
    events.forEach(event => {
      if (event.country) {
        countryCount[event.country] = (countryCount[event.country] || 0) + 1;
      }
    });

    const topCountries = Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({
        country,
        count,
        percentage: (count / events.length) * 100
      }));

    // Device and browser breakdown
    const deviceBreakdown: Record<string, number> = {};
    const browserBreakdown: Record<string, number> = {};
    
    events.forEach(event => {
      if (event.device_type) {
        deviceBreakdown[event.device_type] = (deviceBreakdown[event.device_type] || 0) + 1;
      }
      if (event.browser) {
        browserBreakdown[event.browser] = (browserBreakdown[event.browser] || 0) + 1;
      }
    });

    // Hourly distribution
    const hourlyDistribution: Record<string, number> = {};
    for (let i = 0; i < 24; i++) {
      hourlyDistribution[i.toString()] = 0;
    }
    
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourlyDistribution[hour.toString()]++;
    });

    // Daily stats
    const dailyStats = this.calculateDailyStats(events, days);

    return {
      totalViews,
      uniqueVisitors,
      avgSessionDuration: this.calculateAvgSessionDuration(events),
      bounceRate: this.calculateBounceRate(events),
      topSources,
      topCountries,
      deviceBreakdown,
      browserBreakdown,
      hourlyDistribution,
      dailyStats
    };
  }

  /**
   * Extract source from referrer
   */
  private extractSource(referrer?: string): string {
    if (!referrer) return 'Direct';
    
    try {
      const url = new URL(referrer);
      const hostname = url.hostname.toLowerCase();
      
      if (hostname.includes('google')) return 'Google';
      if (hostname.includes('facebook')) return 'Facebook';
      if (hostname.includes('twitter') || hostname.includes('t.co')) return 'Twitter';
      if (hostname.includes('instagram')) return 'Instagram';
      if (hostname.includes('linkedin')) return 'LinkedIn';
      if (hostname.includes('youtube')) return 'YouTube';
      if (hostname.includes('tiktok')) return 'TikTok';
      
      return hostname;
    } catch {
      return 'Direct';
    }
  }

  /**
   * Calculate average session duration
   */
  private calculateAvgSessionDuration(events: any[]): number {
    // Group events by visitor and calculate session durations
    const sessions: Record<string, any[]> = {};
    
    events.forEach(event => {
      if (!sessions[event.visitor_id]) {
        sessions[event.visitor_id] = [];
      }
      sessions[event.visitor_id].push(event);
    });

    let totalDuration = 0;
    let sessionCount = 0;

    Object.values(sessions).forEach(sessionEvents => {
      if (sessionEvents.length > 1) {
        sessionEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const duration = new Date(sessionEvents[sessionEvents.length - 1].timestamp).getTime() - 
                        new Date(sessionEvents[0].timestamp).getTime();
        
        // Only count sessions longer than 10 seconds and shorter than 30 minutes
        if (duration > 10000 && duration < 1800000) {
          totalDuration += duration;
          sessionCount++;
        }
      }
    });

    return sessionCount > 0 ? Math.round(totalDuration / sessionCount / 1000) : 0;
  }

  /**
   * Calculate bounce rate
   */
  private calculateBounceRate(events: any[]): number {
    const sessions: Record<string, any[]> = {};
    
    events.forEach(event => {
      if (!sessions[event.visitor_id]) {
        sessions[event.visitor_id] = [];
      }
      sessions[event.visitor_id].push(event);
    });

    const totalSessions = Object.keys(sessions).length;
    const bouncedSessions = Object.values(sessions).filter(session => session.length === 1).length;

    return totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;
  }

  /**
   * Calculate daily statistics
   */
  private calculateDailyStats(events: any[], days: number) {
    const dailyStats = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEvents = events.filter(e => e.timestamp.split('T')[0] === dateStr);
      const dayViews = dayEvents.filter(e => e.event_type === 'page_view');
      const dayClicks = dayEvents.filter(e => e.event_type === 'link_click');
      const dayQRScans = dayEvents.filter(e => e.event_type === 'qr_scan');
      const dayVisitors = new Set(dayEvents.map(e => e.visitor_id)).size;
      
      dailyStats.unshift({
        date: dateStr,
        views: dayViews.length,
        visitors: dayVisitors,
        clicks: dayClicks.length,
        qrScans: dayQRScans.length
      });
    }
    
    return dailyStats;
  }

  /**
   * Get real-time statistics
   */
  async getRealtimeStats(userId: string): Promise<RealtimeStats | null> {
    try {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const today = now.toISOString().split('T')[0];

      // Get active visitors (visitors in last 5 minutes)
      const { data: activeVisitors, error: activeError } = await supabase
        .from('analytics_events')
        .select('visitor_id')
        .eq('user_id', userId)
        .gte('timestamp', fiveMinutesAgo.toISOString());

      // Get today's stats
      const { data: todayStats, error: todayError } = await supabase
        .from('analytics_daily_counters')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (activeError || todayError) {
        console.error('Error fetching realtime stats:', activeError || todayError);
        return null;
      }

      return {
        activeVisitors: new Set(activeVisitors?.map(v => v.visitor_id) || []).size,
        viewsToday: todayStats?.page_views || 0,
        clicksToday: todayStats?.link_clicks || 0,
        qrScansToday: todayStats?.qr_scans || 0,
        topPagesRealtime: [] // Would implement page-specific tracking
      };

    } catch (error) {
      console.error('❌ [Analytics] Error fetching realtime stats:', error);
      return null;
    }
  }
}

// Analytics tracking utilities for client-side
export const trackPageView = async (userId: string, metadata: Record<string, any> = {}) => {
  return fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      eventType: 'page_view',
      eventData: { page: window.location.pathname },
      metadata: {
        ...metadata,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      }
    })
  });
};

export const trackLinkClick = async (userId: string, linkUrl: string, linkText: string) => {
  return fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      eventType: 'link_click',
      eventData: { url: linkUrl, text: linkText },
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
    })
  });
};

export const trackQRScan = async (userId: string, qrType: string = 'profile') => {
  return fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      eventType: 'qr_scan',
      eventData: { type: qrType },
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
    })
  });
};