'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  LinkIcon,
  ClipboardDocumentIcon,
  ArrowTrendingUpIcon,
  GiftIcon,
  CreditCardIcon,
  EyeIcon,
  ShoppingCartIcon,
  UserPlusIcon,
  StarIcon,
  TrophyIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';

interface AffiliateDashboardData {
  affiliate: any;
  recentReferrals: any[];
  monthlyStats: {
    earnings: number;
    referrals: number;
    signups: number;
    purchases: number;
  };
  referralLink: string;
  profileLink: string;
}

interface PerformanceData {
  totalVisits: number;
  totalConversions: number;
  conversionRate: number;
  totalEarnings: number;
  avgOrderValue: number;
  dailyStats: Array<{
    date: string;
    visits: number;
    conversions: number;
    earnings: number;
  }>;
  topSources: Array<{
    source: string;
    count: number;
  }>;
  conversionBreakdown: Record<string, number>;
}

export default function AffiliateDashboard({ userId }: { userId: string }) {
  const [dashboardData, setDashboardData] = useState<AffiliateDashboardData | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'analytics' | 'links' | 'payouts'>('overview');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [payoutRequest, setPayoutRequest] = useState({
    amount: '',
    method: 'paypal',
    details: {}
  });

  useEffect(() => {
    fetchDashboardData();
    fetchPerformanceData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/affiliate/dashboard?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(`/api/affiliate/analytics?userId=${userId}&days=30`);
      if (response.ok) {
        const data = await response.json();
        setPerformanceData(data);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const copyToClipboard = async (text: string, linkType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(linkType);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'diamond': return <TrophyIcon className="w-5 h-5 text-blue-400" />;
      case 'platinum': return <StarIcon className="w-5 h-5 text-gray-300" />;
      case 'gold': return <StarIcon className="w-5 h-5 text-yellow-400" />;
      case 'silver': return <StarIcon className="w-5 h-5 text-gray-400" />;
      default: return <StarIcon className="w-5 h-5 text-orange-600" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond': return 'from-blue-400 to-cyan-400';
      case 'platinum': return 'from-gray-300 to-gray-400';
      case 'gold': return 'from-yellow-400 to-amber-400';
      case 'silver': return 'from-gray-400 to-gray-500';
      default: return 'from-orange-600 to-red-600';
    }
  };

  const handlePayoutRequest = async () => {
    try {
      const response = await fetch('/api/affiliate/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          affiliateId: dashboardData?.affiliate.id,
          amount: parseFloat(payoutRequest.amount),
          paymentMethod: payoutRequest.method,
          paymentDetails: payoutRequest.details
        })
      });

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData();
        setPayoutRequest({ amount: '', method: 'paypal', details: {} });
      }
    } catch (error) {
      console.error('Error requesting payout:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Affiliate Dashboard</h2>
          <p className="text-purple-300">Fetching your performance data...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <UserGroupIcon className="w-24 h-24 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Join the Creator Program</h2>
          <p className="text-purple-300 mb-8 max-w-md">
            Start earning by referring customers to FASHUN. Get up to 15% commission on every sale!
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
            Apply Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Creator Dashboard</h1>
              <p className="text-purple-300">Track your referrals and earnings</p>
            </div>
            <div className="flex items-center gap-3">
              {getTierIcon(dashboardData.affiliate.tier)}
              <span className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getTierColor(dashboardData.affiliate.tier)} text-white font-medium`}>
                {dashboardData.affiliate.tier.toUpperCase()} TIER
              </span>
            </div>
          </div>

          {/* Referral Code Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Your Referral Code</h3>
                <p className="text-gray-400 text-sm">Share this code to earn commissions</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-white bg-white/10 px-6 py-3 rounded-lg border border-white/20">
                  {dashboardData.affiliate.referral_code}
                </div>
                <button
                  onClick={() => copyToClipboard(dashboardData.affiliate.referral_code, 'code')}
                  className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  {copiedLink === 'code' ? (
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  ) : (
                    <ClipboardDocumentIcon className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${dashboardData.affiliate.pending_commission.toFixed(2)}
                </div>
                <p className="text-gray-400 text-sm">Pending</p>
              </div>
            </div>
            <h3 className="text-white font-medium">Commission Earned</h3>
            <p className="text-green-400 text-sm">
              +${dashboardData.monthlyStats.earnings.toFixed(2)} this month
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <UserGroupIcon className="w-8 h-8 text-blue-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {dashboardData.affiliate.total_referrals}
                </div>
                <p className="text-gray-400 text-sm">Total</p>
              </div>
            </div>
            <h3 className="text-white font-medium">Referrals</h3>
            <p className="text-blue-400 text-sm">
              +{dashboardData.monthlyStats.referrals} this month
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="w-8 h-8 text-purple-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {performanceData?.conversionRate.toFixed(1)}%
                </div>
                <p className="text-gray-400 text-sm">Rate</p>
              </div>
            </div>
            <h3 className="text-white font-medium">Conversion</h3>
            <p className="text-purple-400 text-sm">
              {performanceData?.totalConversions} / {performanceData?.totalVisits} visits
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <BanknotesIcon className="w-8 h-8 text-yellow-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${dashboardData.affiliate.total_sales.toFixed(0)}
                </div>
                <p className="text-gray-400 text-sm">Total</p>
              </div>
            </div>
            <h3 className="text-white font-medium">Sales Generated</h3>
            <p className="text-yellow-400 text-sm">
              ${performanceData?.avgOrderValue.toFixed(2)} avg order
            </p>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
          {[
            { key: 'overview', label: 'Overview', icon: ChartBarIcon },
            { key: 'analytics', label: 'Analytics', icon: ArrowTrendingUpIcon },
            { key: 'links', label: 'Links & Tools', icon: LinkIcon },
            { key: 'payouts', label: 'Payouts', icon: CreditCardIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedTab(key as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedTab === key
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Recent Activity */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <h3 className="text-2xl font-bold text-white mb-6">Recent Referrals</h3>
                {dashboardData.recentReferrals.length === 0 ? (
                  <div className="text-center py-8">
                    <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No referrals yet. Start sharing your links!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentReferrals.map((referral, index) => (
                      <motion.div
                        key={referral.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center gap-4">
                          {referral.conversion_type === 'signup' ? (
                            <UserPlusIcon className="w-6 h-6 text-blue-400" />
                          ) : (
                            <ShoppingCartIcon className="w-6 h-6 text-green-400" />
                          )}
                          <div>
                            <p className="text-white font-medium">
                              {referral.conversion_type === 'signup' ? 'New Signup' : 'Purchase'}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {new Date(referral.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-medium">
                            +${referral.commission_amount.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-1">
                            {referral.commission_status === 'pending' && (
                              <>
                                <ClockIcon className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-400 text-sm">Pending</span>
                              </>
                            )}
                            {referral.commission_status === 'approved' && (
                              <>
                                <CheckCircleIcon className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-sm">Approved</span>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {selectedTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Affiliate Links */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <h3 className="text-2xl font-bold text-white mb-6">Your Affiliate Links</h3>
                <div className="space-y-4">
                  {/* Store Link */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="text-white font-medium mb-1">Main Store Link</h4>
                      <p className="text-gray-400 text-sm truncate max-w-md">
                        {dashboardData.referralLink}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(dashboardData.referralLink, 'store')}
                      className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                      {copiedLink === 'store' ? (
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      ) : (
                        <ClipboardDocumentIcon className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Profile Link */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="text-white font-medium mb-1">Profile Link</h4>
                      <p className="text-gray-400 text-sm truncate max-w-md">
                        {dashboardData.profileLink}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(dashboardData.profileLink, 'profile')}
                      className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                      {copiedLink === 'profile' ? (
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      ) : (
                        <ClipboardDocumentIcon className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Link Generator */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                  <h4 className="text-white font-medium mb-3">Custom Link Generator</h4>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter product URL or path"
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                    <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}