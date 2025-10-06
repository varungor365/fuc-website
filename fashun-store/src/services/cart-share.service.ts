import crypto from 'crypto';

export const CartShareService = {
  async shareCart(cartId: string) {
    const shareToken = crypto.randomBytes(16).toString('hex');
    
    await fetch('/api/cart/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId, shareToken })
    });
    
    const shareUrl = `${window.location.origin}/cart/shared/${shareToken}`;
    return shareUrl;
  },

  async getSharedCart(shareToken: string) {
    const response = await fetch(`/api/cart/shared/${shareToken}`);
    return response.json();
  },

  async copyToMyCart(shareToken: string, myCartId: string) {
    const response = await fetch('/api/cart/copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareToken, myCartId })
    });
    return response.json();
  }
};
