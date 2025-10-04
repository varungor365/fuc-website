'use client';

import { useState, useCallback } from 'react';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setIsScriptLoaded(true);
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setIsScriptLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }, []);

  const createOrder = useCallback(async (amount: number, customer: any) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          customer: {
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            phone: customer.phone
          }
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyPayment = useCallback(async (paymentData: any, orderDetails: any) => {
    try {
      const response = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          order_details: orderDetails
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Payment verification failed');
      }

      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }, []);

  const openRazorpay = useCallback(async (options: RazorpayOptions) => {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  }, [loadRazorpayScript]);

  const processPayment = useCallback(async (
    amount: number,
    customer: any,
    orderDetails: any,
    onSuccess: (data: any) => void,
    onError: (error: any) => void
  ) => {
    try {
      // Create order
      const orderData = await createOrder(amount, customer);

      // Open Razorpay checkout
      await openRazorpay({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: 'FASHUN.CO',
        description: 'Premium Streetwear Purchase',
        image: '/images/logo.png',
        handler: async (response: any) => {
          try {
            // Verify payment
            const verificationData = await verifyPayment(response, orderDetails);
            onSuccess(verificationData);
          } catch (error) {
            onError(error);
          }
        },
        prefill: {
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          contact: customer.phone
        },
        theme: {
          color: '#8b5cf6'
        },
        modal: {
          ondismiss: () => {
            onError(new Error('Payment cancelled'));
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  }, [createOrder, openRazorpay, verifyPayment]);

  return {
    isLoading,
    isScriptLoaded,
    processPayment,
    createOrder,
    verifyPayment,
    loadRazorpayScript
  };
};