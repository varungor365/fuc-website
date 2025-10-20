/**
 * Affiliate Program System
 * Handles referral tracking, commission calculation, and creator partnerships
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AffiliateProgram {
  id: string;
  name: string;
  description: string;
  commission_rate: number; // Percentage (e.g., 10 for 10%)
  commission_type: 'percentage' | 'fixed';
  fixed_amount?: number;
  min_payout: number;
  is_active: boolean;
  tier_requirements?: {
    sales_required: number;
    tier_name: string;
    bonus_rate: number;
  }[];
}

export interface Affiliate {
  id: string;
  user_id: string;
  referral_code: string;
  program_id: string;
  status: 'pending' | 'active' | 'suspended' | 'banned';
  tier: string;
  total_referrals: number;
  total_sales: number;
  total_commission: number;
  pending_commission: number;
  paid_commission: number;
  joined_at: Date;
  last_activity: Date;
}

export interface Referral {
  id: string;
  affiliate_id: string;
  referred_user_id?: string;
  referral_code: string;
  order_id?: string;
  conversion_type: 'signup' | 'purchase' | 'subscription';
  commission_amount: number;
  commission_status: 'pending' | 'approved' | 'paid' | 'cancelled';
  metadata: Record<string, any>;
  created_at: Date;
}

export interface PayoutRequest {
  id: string;
  affiliate_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method: 'bank_transfer' | 'paypal' | 'crypto' | 'store_credit';
  payment_details: Record<string, any>;
  requested_at: Date;
  processed_at?: Date;
}

/**
 * Affiliate Management Service
 */
export class AffiliateService {
  private static instance: AffiliateService;

  static getInstance(): AffiliateService {
    if (!AffiliateService.instance) {
      AffiliateService.instance = new AffiliateService();
    }
    return AffiliateService.instance;
  }

  /**
   * Generate unique referral code
   */
  private generateReferralCode(username: string): string {
    const prefix = username.substring(0, 4).toUpperCase();
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${suffix}`;
  }

  /**
   * Create new affiliate
   */
  async createAffiliate(userId: string, programId: string): Promise<string | null> {
    try {
      console.log(`🤝 [Affiliate] Creating affiliate for user: ${userId}`);

      // Get user profile for referral code generation
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      // Generate unique referral code
      let referralCode = this.generateReferralCode(profile.username);
      let attempts = 0;
      
      // Ensure uniqueness
      while (attempts < 5) {
        const { data: existing } = await supabase
          .from('affiliates')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (!existing) break;
        
        referralCode = this.generateReferralCode(profile.username);
        attempts++;
      }

      // Create affiliate record
      const { data: affiliate, error: affiliateError } = await supabase
        .from('affiliates')
        .insert({
          user_id: userId,
          program_id: programId,
          referral_code: referralCode,
          status: 'pending',
          tier: 'bronze',
          total_referrals: 0,
          total_sales: 0,
          total_commission: 0,
          pending_commission: 0,
          paid_commission: 0,
          joined_at: new Date().toISOString(),
          last_activity: new Date().toISOString()
        })
        .select()
        .single();

      if (affiliateError) {
        console.error('Error creating affiliate:', affiliateError);
        return null;
      }

      console.log(`✅ [Affiliate] Created affiliate with code: ${referralCode}`);
      return affiliate.id;

    } catch (error) {
      console.error('❌ [Affiliate] Error creating affiliate:', error);
      return null;
    }
  }

  /**
   * Track referral click/visit
   */
  async trackReferral(referralCode: string, metadata: Record<string, any> = {}): Promise<boolean> {
    try {
      console.log(`👆 [Affiliate] Tracking referral click: ${referralCode}`);

      // Get affiliate by referral code
      const { data: affiliate, error: affiliateError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('referral_code', referralCode)
        .eq('status', 'active')
        .single();

      if (affiliateError || !affiliate) {
        console.log(`⚠️ [Affiliate] Invalid or inactive referral code: ${referralCode}`);
        return false;
      }

      // Record the referral visit
      const { error: visitError } = await supabase
        .from('referral_visits')
        .insert({
          affiliate_id: affiliate.id,
          referral_code: referralCode,
          visitor_ip: metadata.ip,
          user_agent: metadata.userAgent,
          referrer: metadata.referrer,
          landing_page: metadata.landingPage,
          created_at: new Date().toISOString()
        });

      if (visitError) {
        console.error('Error recording referral visit:', visitError);
        return false;
      }

      // Update affiliate last activity
      await supabase
        .from('affiliates')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', affiliate.id);

      console.log(`✅ [Affiliate] Referral visit tracked for: ${referralCode}`);
      return true;

    } catch (error) {
      console.error('❌ [Affiliate] Error tracking referral:', error);
      return false;
    }
  }

  /**
   * Process referral conversion (signup or purchase)
   */
  async processConversion(
    referralCode: string,
    conversionType: 'signup' | 'purchase',
    orderId?: string,
    orderValue?: number,
    userId?: string
  ): Promise<boolean> {
    try {
      console.log(`💰 [Affiliate] Processing ${conversionType} conversion for: ${referralCode}`);

      // Get affiliate and program details
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select(`
          *,
          affiliate_programs (
            commission_rate,
            commission_type,
            fixed_amount
          )
        `)
        .eq('referral_code', referralCode)
        .eq('status', 'active')
        .single();

      if (affiliateError || !affiliateData) {
        console.log(`⚠️ [Affiliate] Invalid affiliate for conversion: ${referralCode}`);
        return false;
      }

      const affiliate = affiliateData;
      const program = affiliateData.affiliate_programs;

      // Calculate commission
      let commissionAmount = 0;
      if (conversionType === 'purchase' && orderValue) {
        if (program.commission_type === 'percentage') {
          commissionAmount = (orderValue * program.commission_rate) / 100;
        } else {
          commissionAmount = program.fixed_amount || 0;
        }
      } else if (conversionType === 'signup') {
        // Fixed signup bonus
        commissionAmount = program.fixed_amount || 10; // Default $10 signup bonus
      }

      // Create referral record
      const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .insert({
          affiliate_id: affiliate.id,
          referred_user_id: userId,
          referral_code: referralCode,
          order_id: orderId,
          conversion_type: conversionType,
          commission_amount: commissionAmount,
          commission_status: 'pending',
          metadata: {
            order_value: orderValue,
            conversion_timestamp: new Date().toISOString()
          },
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (referralError) {
        console.error('Error creating referral record:', referralError);
        return false;
      }

      // Update affiliate stats
      const updates: any = {
        total_referrals: affiliate.total_referrals + 1,
        pending_commission: affiliate.pending_commission + commissionAmount,
        last_activity: new Date().toISOString()
      };

      if (conversionType === 'purchase' && orderValue) {
        updates.total_sales = affiliate.total_sales + orderValue;
      }

      // Check for tier upgrade
      const newTier = this.calculateTier(updates.total_sales, affiliate.total_referrals + 1);
      if (newTier !== affiliate.tier) {
        updates.tier = newTier;
      }

      const { error: updateError } = await supabase
        .from('affiliates')
        .update(updates)
        .eq('id', affiliate.id);

      if (updateError) {
        console.error('Error updating affiliate stats:', updateError);
        return false;
      }

      console.log(`✅ [Affiliate] Conversion processed: ${conversionType}, Commission: $${commissionAmount}`);
      return true;

    } catch (error) {
      console.error('❌ [Affiliate] Error processing conversion:', error);
      return false;
    }
  }

  /**
   * Calculate affiliate tier based on performance
   */
  private calculateTier(totalSales: number, totalReferrals: number): string {
    if (totalSales >= 10000 && totalReferrals >= 100) return 'diamond';
    if (totalSales >= 5000 && totalReferrals >= 50) return 'platinum';
    if (totalSales >= 2000 && totalReferrals >= 25) return 'gold';
    if (totalSales >= 500 && totalReferrals >= 10) return 'silver';
    return 'bronze';
  }

  /**
   * Get affiliate dashboard data
   */
  async getAffiliateDashboard(userId: string): Promise<any> {
    try {
      // Get affiliate data
      const { data: affiliate, error: affiliateError } = await supabase
        .from('affiliates')
        .select(`
          *,
          affiliate_programs (
            name,
            commission_rate,
            commission_type
          )
        `)
        .eq('user_id', userId)
        .single();

      if (affiliateError) {
        console.error('Error fetching affiliate data:', affiliateError);
        return null;
      }

      // Get recent referrals
      const { data: recentReferrals, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('affiliate_id', affiliate.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get monthly stats
      const { data: monthlyStats, error: statsError } = await supabase
        .from('referrals')
        .select('conversion_type, commission_amount, created_at')
        .eq('affiliate_id', affiliate.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Calculate monthly metrics
      const thisMonth = monthlyStats || [];
      const monthlyEarnings = thisMonth.reduce((sum, r) => sum + r.commission_amount, 0);
      const monthlyReferrals = thisMonth.length;
      const monthlySignups = thisMonth.filter(r => r.conversion_type === 'signup').length;
      const monthlyPurchases = thisMonth.filter(r => r.conversion_type === 'purchase').length;

      return {
        affiliate,
        recentReferrals: recentReferrals || [],
        monthlyStats: {
          earnings: monthlyEarnings,
          referrals: monthlyReferrals,
          signups: monthlySignups,
          purchases: monthlyPurchases
        },
        referralLink: `https://fashun.co.in?ref=${affiliate.referral_code}`,
        profileLink: `https://p.fashun.co.in/ref/${affiliate.referral_code}`
      };

    } catch (error) {
      console.error('❌ [Affiliate] Error fetching dashboard data:', error);
      return null;
    }
  }

  /**
   * Request payout
   */
  async requestPayout(
    affiliateId: string, 
    amount: number, 
    paymentMethod: string, 
    paymentDetails: Record<string, any>
  ): Promise<boolean> {
    try {
      console.log(`💸 [Affiliate] Payout request: ${affiliateId}, Amount: $${amount}`);

      // Verify affiliate has sufficient pending commission
      const { data: affiliate, error: affiliateError } = await supabase
        .from('affiliates')
        .select('pending_commission, total_commission')
        .eq('id', affiliateId)
        .single();

      if (affiliateError || !affiliate) {
        console.error('Error fetching affiliate for payout:', affiliateError);
        return false;
      }

      if (affiliate.pending_commission < amount) {
        console.error('Insufficient pending commission for payout');
        return false;
      }

      // Create payout request
      const { error: payoutError } = await supabase
        .from('payout_requests')
        .insert({
          affiliate_id: affiliateId,
          amount: amount,
          status: 'pending',
          payment_method: paymentMethod,
          payment_details: paymentDetails,
          requested_at: new Date().toISOString()
        });

      if (payoutError) {
        console.error('Error creating payout request:', payoutError);
        return false;
      }

      console.log(`✅ [Affiliate] Payout request created successfully`);
      return true;

    } catch (error) {
      console.error('❌ [Affiliate] Error requesting payout:', error);
      return false;
    }
  }

  /**
   * Generate affiliate links with tracking
   */
  generateAffiliateLinks(referralCode: string) {
    const baseUrls = {
      store: 'https://fashun.co.in',
      profile: 'https://p.fashun.co.in'
    };

    return {
      storeLink: `${baseUrls.store}?ref=${referralCode}`,
      profileLink: `${baseUrls.profile}/ref/${referralCode}`,
      productLink: (productId: string) => `${baseUrls.store}/products/${productId}?ref=${referralCode}`,
      customLink: (path: string) => `${baseUrls.store}${path}${path.includes('?') ? '&' : '?'}ref=${referralCode}`
    };
  }
}

/**
 * Affiliate Analytics Service
 */
export class AffiliateAnalyticsService {
  private static instance: AffiliateAnalyticsService;

  static getInstance(): AffiliateAnalyticsService {
    if (!AffiliateAnalyticsService.instance) {
      AffiliateAnalyticsService.instance = new AffiliateAnalyticsService();
    }
    return AffiliateAnalyticsService.instance;
  }

  /**
   * Get affiliate performance analytics
   */
  async getPerformanceAnalytics(affiliateId: string, days: number = 30): Promise<any> {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // Get referral data
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (referralsError) {
        console.error('Error fetching referral analytics:', referralsError);
        return null;
      }

      // Get visit data
      const { data: visits, error: visitsError } = await supabase
        .from('referral_visits')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      // Process analytics
      const analytics = {
        totalVisits: visits?.length || 0,
        totalConversions: referrals?.length || 0,
        conversionRate: visits?.length ? ((referrals?.length || 0) / visits.length * 100) : 0,
        totalEarnings: referrals?.reduce((sum, r) => sum + r.commission_amount, 0) || 0,
        avgOrderValue: 0,
        dailyStats: this.processDailyStats(referrals || [], visits || [], days),
        topSources: this.processTopSources(visits || []),
        conversionBreakdown: this.processConversionBreakdown(referrals || [])
      };

      // Calculate average order value
      const purchases = referrals?.filter(r => r.conversion_type === 'purchase') || [];
      if (purchases.length > 0) {
        analytics.avgOrderValue = purchases.reduce((sum, r) => sum + (r.metadata?.order_value || 0), 0) / purchases.length;
      }

      return analytics;

    } catch (error) {
      console.error('❌ [Affiliate Analytics] Error fetching performance data:', error);
      return null;
    }
  }

  /**
   * Process daily statistics
   */
  private processDailyStats(referrals: any[], visits: any[], days: number) {
    const dailyStats = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayReferrals = referrals.filter(r => r.created_at.split('T')[0] === dateStr);
      const dayVisits = visits.filter(v => v.created_at.split('T')[0] === dateStr);
      
      dailyStats.unshift({
        date: dateStr,
        visits: dayVisits.length,
        conversions: dayReferrals.length,
        earnings: dayReferrals.reduce((sum, r) => sum + r.commission_amount, 0)
      });
    }
    
    return dailyStats;
  }

  /**
   * Process top traffic sources
   */
  private processTopSources(visits: any[]) {
    const sources: Record<string, number> = {};
    
    visits.forEach(visit => {
      const source = visit.referrer || 'Direct';
      sources[source] = (sources[source] || 0) + 1;
    });
    
    return Object.entries(sources)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }));
  }

  /**
   * Process conversion breakdown
   */
  private processConversionBreakdown(referrals: any[]) {
    const breakdown: Record<string, number> = {};
    
    referrals.forEach(referral => {
      const type = referral.conversion_type;
      breakdown[type] = (breakdown[type] || 0) + 1;
    });
    
    return breakdown;
  }
}

// Export default configuration
export const defaultAffiliateProgram: AffiliateProgram = {
  id: 'fashun_standard',
  name: 'FASHUN Creator Program',
  description: 'Earn commissions by referring customers to FASHUN',
  commission_rate: 15,
  commission_type: 'percentage',
  min_payout: 50,
  is_active: true,
  tier_requirements: [
    { sales_required: 500, tier_name: 'Silver', bonus_rate: 2 },
    { sales_required: 2000, tier_name: 'Gold', bonus_rate: 5 },
    { sales_required: 5000, tier_name: 'Platinum', bonus_rate: 8 },
    { sales_required: 10000, tier_name: 'Diamond', bonus_rate: 12 }
  ]
};