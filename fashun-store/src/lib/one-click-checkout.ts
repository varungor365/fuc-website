/**
 * One-Click Checkout Service
 * Handles fast checkout with stored payment methods and shipping information
 */

// Extend window interface for payment providers
declare global {
  interface Window {
    ApplePaySession?: typeof ApplePaySession;
    google?: {
      payments?: {
        api?: {
          PaymentsClient: new (config: any) => any;
        };
      };
    };
    ShopifyPay?: any;
  }
}

// Apple Pay types
declare var ApplePaySession: {
  canMakePayments(): boolean;
  STATUS_SUCCESS: number;
  STATUS_FAILURE: number;
  new (version: number, request: any): {
    begin(): void;
    abort(): void;
    completeMerchantValidation(session: any): void;
    completePayment(status: number): void;
    onvalidatemerchant: ((event: any) => void) | null;
    onpaymentauthorized: ((event: any) => void) | null;
    oncancel: (() => void) | null;
  };
};

export interface CheckoutProfile {
  id: string;
  email: string;
  shippingAddresses: ShippingAddress[];
  paymentMethods: PaymentMethod[];
  defaultShippingId?: string;
  defaultPaymentId?: string;
  preferences: CheckoutPreferences;
}

export interface ShippingAddress {
  id: string;
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay' | 'shopifypay';
  provider: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  fingerprint?: string;
}

export interface CheckoutPreferences {
  savePaymentMethods: boolean;
  saveShippingAddresses: boolean;
  autoFillShipping: boolean;
  expressCheckout: boolean;
  notifications: {
    orderConfirmation: boolean;
    shippingUpdates: boolean;
    marketingEmails: boolean;
  };
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  title: string;
  image?: string;
  size?: string;
  color?: string;
}

export interface CheckoutSession {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress?: ShippingAddress;
  paymentMethod?: PaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  expiresAt: Date;
}

class OneClickCheckoutService {
  private baseUrl = '/api/checkout';
  private apiKey = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  /**
   * Initialize express checkout providers
   */
  async initializeExpressProviders(): Promise<void> {
    try {
      // Initialize Apple Pay
      if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        console.log('Apple Pay available');
      }

      // Initialize Google Pay
      if (window.google?.payments?.api) {
        const paymentsClient = new window.google.payments.api.PaymentsClient({
          environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST'
        });
        
        const request = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX']
            }
          }]
        };

        const canPay = await paymentsClient.isReadyToPay(request);
        if (canPay.result) {
          console.log('Google Pay available');
        }
      }

      // Initialize Shop Pay
      if (window.ShopifyPay) {
        console.log('Shop Pay available');
      }
    } catch (error) {
      console.error('Error initializing express providers:', error);
    }
  }

  /**
   * Get user's checkout profile
   */
  async getCheckoutProfile(userId: string): Promise<CheckoutProfile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch checkout profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching checkout profile:', error);
      return null;
    }
  }

  /**
   * Save or update checkout profile
   */
  async saveCheckoutProfile(profile: Partial<CheckoutProfile>): Promise<CheckoutProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Failed to save checkout profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving checkout profile:', error);
      throw error;
    }
  }

  /**
   * Create checkout session
   */
  async createCheckoutSession(items: CartItem[], userId?: string): Promise<CheckoutSession> {
    try {
      const response = await fetch(`${this.baseUrl}/session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items,
          userId,
          expiresIn: 15 * 60 * 1000 // 15 minutes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * One-click checkout for returning customers
   */
  async oneClickCheckout(
    items: CartItem[], 
    userId: string,
    options?: {
      shippingAddressId?: string;
      paymentMethodId?: string;
    }
  ): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      // Get user's profile
      const profile = await this.getCheckoutProfile(userId);
      if (!profile) {
        throw new Error('No checkout profile found');
      }

      // Use provided or default addresses/payment methods
      const shippingAddress = options?.shippingAddressId 
        ? profile.shippingAddresses.find(addr => addr.id === options.shippingAddressId)
        : profile.shippingAddresses.find(addr => addr.isDefault);

      const paymentMethod = options?.paymentMethodId
        ? profile.paymentMethods.find(pm => pm.id === options.paymentMethodId)
        : profile.paymentMethods.find(pm => pm.isDefault);

      if (!shippingAddress || !paymentMethod) {
        throw new Error('Default shipping address or payment method not found');
      }

      // Create checkout session
      const session = await this.createCheckoutSession(items, userId);

      // Process payment
      const orderResult = await this.processOrder({
        sessionId: session.id,
        shippingAddress,
        paymentMethod,
        items
      });

      return {
        success: true,
        orderId: orderResult.orderId
      };

    } catch (error) {
      console.error('One-click checkout failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Checkout failed'
      };
    }
  }

  /**
   * Express checkout with Apple Pay
   */
  async applePayCheckout(items: CartItem[], total: number): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
        throw new Error('Apple Pay not available');
      }

      const request = {
        countryCode: 'US',
        currencyCode: 'USD',
        supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
        merchantCapabilities: ['supports3DS'],
        total: {
          label: 'FUC Fashion',
          amount: total.toFixed(2)
        },
        lineItems: items.map(item => ({
          label: item.title,
          amount: (item.price * item.quantity).toFixed(2)
        }))
      };

      const session = new ApplePaySession(3, request);

      return new Promise((resolve) => {
        session.onvalidatemerchant = async (event) => {
          try {
            const validationResponse = await fetch('/api/checkout/apple-pay/validate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ validationURL: event.validationURL })
            });
            
            const merchantSession = await validationResponse.json();
            session.completeMerchantValidation(merchantSession);
          } catch (error) {
            session.abort();
            resolve({ success: false, error: 'Merchant validation failed' });
          }
        };

        session.onpaymentauthorized = async (event) => {
          try {
            const orderResult = await this.processApplePayment(event.payment, items);
            
            if (orderResult.success) {
              session.completePayment(ApplePaySession.STATUS_SUCCESS);
              resolve({ success: true, orderId: orderResult.orderId });
            } else {
              session.completePayment(ApplePaySession.STATUS_FAILURE);
              resolve({ success: false, error: orderResult.error });
            }
          } catch (error) {
            session.completePayment(ApplePaySession.STATUS_FAILURE);
            resolve({ success: false, error: 'Payment processing failed' });
          }
        };

        session.oncancel = () => {
          resolve({ success: false, error: 'Payment cancelled' });
        };

        session.begin();
      });

    } catch (error) {
      console.error('Apple Pay checkout failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Apple Pay failed'
      };
    }
  }

  /**
   * Express checkout with Google Pay
   */
  async googlePayCheckout(items: CartItem[], total: number): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      if (!window.google?.payments?.api) {
        throw new Error('Google Pay not available');
      }

      const paymentsClient = new window.google.payments.api.PaymentsClient({
        environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST'
      });

      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'shopify',
              gatewayMerchantId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN
            }
          }
        }],
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: total.toFixed(2),
          currencyCode: 'USD'
        },
        merchantInfo: {
          merchantName: 'FUC Fashion'
        }
      };

      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      const orderResult = await this.processGooglePayment(paymentData, items);

      return {
        success: orderResult.success,
        orderId: orderResult.orderId,
        error: orderResult.error
      };

    } catch (error) {
      console.error('Google Pay checkout failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google Pay failed'
      };
    }
  }

  /**
   * Process regular order
   */
  private async processOrder(orderData: {
    sessionId: string;
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    items: CartItem[];
  }): Promise<{ orderId: string }> {
    const response = await fetch(`${this.baseUrl}/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error('Order processing failed');
    }

    return await response.json();
  }

  /**
   * Process Apple Pay payment
   */
  private async processApplePayment(payment: any, items: CartItem[]): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      const response = await fetch('/api/checkout/apple-pay/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment, items })
      });

      return await response.json();
    } catch (error) {
      return { success: false, error: 'Payment processing failed' };
    }
  }

  /**
   * Process Google Pay payment
   */
  private async processGooglePayment(paymentData: any, items: CartItem[]): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      const response = await fetch('/api/checkout/google-pay/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentData, items })
      });

      return await response.json();
    } catch (error) {
      return { success: false, error: 'Payment processing failed' };
    }
  }

  /**
   * Save payment method for future use
   */
  async savePaymentMethod(userId: string, paymentData: any): Promise<PaymentMethod> {
    const response = await fetch(`${this.baseUrl}/payment-methods`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, paymentData })
    });

    if (!response.ok) {
      throw new Error('Failed to save payment method');
    }

    return await response.json();
  }

  /**
   * Save shipping address for future use
   */
  async saveShippingAddress(userId: string, address: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress> {
    const response = await fetch(`${this.baseUrl}/shipping-addresses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, address })
    });

    if (!response.ok) {
      throw new Error('Failed to save shipping address');
    }

    return await response.json();
  }

  /**
   * Get shipping rates for address
   */
  async getShippingRates(items: CartItem[], address: Partial<ShippingAddress>): Promise<{
    rates: Array<{
      id: string;
      title: string;
      price: number;
      deliveryTime: string;
    }>;
  }> {
    const response = await fetch(`${this.baseUrl}/shipping-rates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items, address })
    });

    if (!response.ok) {
      throw new Error('Failed to get shipping rates');
    }

    return await response.json();
  }

  /**
   * Calculate taxes for order
   */
  async calculateTax(items: CartItem[], address: Partial<ShippingAddress>): Promise<{ tax: number; breakdown: any }> {
    const response = await fetch(`${this.baseUrl}/calculate-tax`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items, address })
    });

    if (!response.ok) {
      throw new Error('Failed to calculate tax');
    }

    return await response.json();
  }

  /**
   * Apply discount code
   */
  async applyDiscount(sessionId: string, code: string): Promise<{
    success: boolean;
    discount: number;
    message: string;
  }> {
    const response = await fetch(`${this.baseUrl}/apply-discount`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId, code })
    });

    return await response.json();
  }
}

export default OneClickCheckoutService;