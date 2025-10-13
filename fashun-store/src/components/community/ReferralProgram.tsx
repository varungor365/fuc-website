'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReferralProgram({ customerId }: { customerId: string }) {
  const [copied, setCopied] = useState(false);
  const referralCode = `FASHUN${customerId.slice(0, 6).toUpperCase()}`;
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Get 15% off at FASHUN.CO',
        text: 'Use my referral code for 15% off your first order!',
        url: referralLink
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6"
    >
      <div className="flex items-center mb-4">
        <Gift className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="text-xl font-bold">Refer & Earn</h3>
      </div>

      <p className="text-gray-700 mb-4">
        Give ₹200 off to friends, get ₹200 when they make their first purchase!
      </p>

      <div className="bg-white rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-2">Your Referral Code</p>
        <div className="flex items-center justify-between">
          <code className="text-lg font-bold text-purple-600">{referralCode}</code>
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyToClipboard}
          className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Copy Link
        </button>
        <button
          onClick={shareReferral}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
