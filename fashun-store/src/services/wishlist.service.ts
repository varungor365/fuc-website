export const WishlistService = {
  async getWishlist(customerId: string) {
    const wishlist = localStorage.getItem(`wishlist_${customerId}`);
    return wishlist ? JSON.parse(wishlist) : [];
  },

  async addToWishlist(customerId: string, productId: string) {
    const wishlist = await this.getWishlist(customerId);
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem(`wishlist_${customerId}`, JSON.stringify(wishlist));
      
      await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, productId })
      });
    }
    return wishlist;
  },

  async removeFromWishlist(customerId: string, productId: string) {
    let wishlist = await this.getWishlist(customerId);
    wishlist = wishlist.filter((id: string) => id !== productId);
    localStorage.setItem(`wishlist_${customerId}`, JSON.stringify(wishlist));
    
    await fetch('/api/wishlist/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, productId })
    });
    
    return wishlist;
  },

  async isInWishlist(customerId: string, productId: string) {
    const wishlist = await this.getWishlist(customerId);
    return wishlist.includes(productId);
  }
};
