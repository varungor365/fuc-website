export const LoyaltyService = {
  async getPoints(customerId: string) {
    const response = await fetch(`/api/loyalty/points/${customerId}`);
    const data = await response.json();
    return data.points || 0;
  },

  async addPoints(customerId: string, points: number, reason: string) {
    await fetch('/api/loyalty/add-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, points, reason })
    });
  },

  async redeemPoints(customerId: string, points: number) {
    const response = await fetch('/api/loyalty/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, points })
    });
    return response.json();
  },

  calculatePointsForPurchase(amount: number) {
    return Math.floor(amount / 100);
  },

  async getBadges(customerId: string) {
    const response = await fetch(`/api/loyalty/badges/${customerId}`);
    return response.json();
  },

  async checkBadgeEligibility(customerId: string) {
    const points = await this.getPoints(customerId);
    const badges = [];
    
    if (points >= 100) badges.push({ id: 'bronze', name: 'Bronze Member', icon: '🥉' });
    if (points >= 500) badges.push({ id: 'silver', name: 'Silver Member', icon: '🥈' });
    if (points >= 1000) badges.push({ id: 'gold', name: 'Gold Member', icon: '🥇' });
    if (points >= 5000) badges.push({ id: 'platinum', name: 'Platinum Member', icon: '💎' });
    
    return badges;
  }
};
