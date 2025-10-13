'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp } from 'lucide-react';
import { LoyaltyService } from '@/services/loyalty.service';

export default function LoyaltyBadge({ customerId }: { customerId: string }) {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    loadLoyaltyData();
  }, [customerId]);

  const loadLoyaltyData = async () => {
    const [pointsData, badgesData] = await Promise.all([
      LoyaltyService.getPoints(customerId),
      LoyaltyService.checkBadgeEligibility(customerId)
    ]);
    setPoints(pointsData);
    setBadges(badgesData);
  };

  const currentBadge = badges[badges.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Award className="w-6 h-6 mr-2" />
          <div>
            <p className="text-sm opacity-90">Points</p>
            <p className="text-2xl font-bold">{points}</p>
          </div>
        </div>
        {currentBadge && <div className="text-4xl">{currentBadge.icon}</div>}
      </div>
    </motion.div>
  );
}
