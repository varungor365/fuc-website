'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, CreditCard, Truck, Apple, Chrome, Loader2, Check, AlertCircle } from 'lucide-react';
import OneClickCheckoutService, { CartItem, CheckoutProfile, PaymentMethod, ShippingAddress } from '@/lib/one-click-checkout';

interface OneClickCheckoutProps {
  items: CartItem[];
  userId?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

const OneClickCheckout: React.FC<OneClickCheckoutProps> = ({
  items,
  userId,
  onSuccess,
  onError,
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<CheckoutProfile | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [showExpressOptions, setShowExpressOptions] = useState(true);
  const [expressLoading, setExpressLoading] = useState<'apple' | 'google' | null>(null);

  const checkoutService = new OneClickCheckoutService();

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (userId) {
      loadCheckoutProfile();
    }
    initializeExpressCheckout();
  }, [userId]);

  const loadCheckoutProfile = async () => {
    if (!userId) return;

    try {
      const userProfile = await checkoutService.getCheckoutProfile(userId);
      setProfile(userProfile);
      
      if (userProfile) {
        setSelectedPayment(userProfile.defaultPaymentId || userProfile.paymentMethods[0]?.id || '');
        setSelectedShipping(userProfile.defaultShippingId || userProfile.shippingAddresses[0]?.id || '');
      }
    } catch (error) {
      console.error('Error loading checkout profile:', error);
    }
  };

  const initializeExpressCheckout = async () => {
    try {
      await checkoutService.initializeExpressProviders();
    } catch (error) {
      console.error('Error initializing express checkout:', error);
    }
  };

  const handleOneClickCheckout = async () => {
    if (!userId || !profile) {
      onError?.('Please sign in to use one-click checkout');
      return;
    }

    if (!selectedPayment || !selectedShipping) {
      onError?.('Please select payment method and shipping address');
      return;
    }

    setLoading(true);

    try {
      const result = await checkoutService.oneClickCheckout(items, userId, {
        paymentMethodId: selectedPayment,
        shippingAddressId: selectedShipping
      });

      if (result.success && result.orderId) {
        onSuccess?.(result.orderId);
      } else {
        onError?.(result.error || 'Checkout failed');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApplePayCheckout = async () => {
    setExpressLoading('apple');

    try {
      const result = await checkoutService.applePayCheckout(items, total);
      
      if (result.success && result.orderId) {
        onSuccess?.(result.orderId);
      } else {
        onError?.(result.error || 'Apple Pay checkout failed');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Apple Pay checkout failed');
    } finally {
      setExpressLoading(null);
    }
  };

  const handleGooglePayCheckout = async () => {
    setExpressLoading('google');

    try {
      const result = await checkoutService.googlePayCheckout(items, total);
      
      if (result.success && result.orderId) {
        onSuccess?.(result.orderId);
      } else {
        onError?.(result.error || 'Google Pay checkout failed');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Google Pay checkout failed');
    } finally {
      setExpressLoading(null);
    }
  };

  const isApplePayAvailable = () => {
    return window.ApplePaySession && window.ApplePaySession.canMakePayments();
  };

  const isGooglePayAvailable = () => {
    return window.google?.payments?.api;
  };

  const canUseOneClick = profile && profile.paymentMethods.length > 0 && profile.shippingAddresses.length > 0;

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <ShoppingBag className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Quick Checkout</h3>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
          <span className="text-lg font-semibold text-gray-900">
            ${total.toFixed(2)}
          </span>
        </div>
        <div className="space-y-1">
          {items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600 truncate">
                {item.title} {item.size && `(${item.size})`}
              </span>
              <span className="text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          {items.length > 2 && (
            <div className="text-sm text-gray-500">
              +{items.length - 2} more item{items.length > 3 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Express Checkout Options */}
      {showExpressOptions && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-3">Express Checkout</div>
          <div className="space-y-2">
            {isApplePayAvailable() && (
              <button
                onClick={handleApplePayCheckout}
                disabled={expressLoading !== null}
                className="w-full flex items-center justify-center px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {expressLoading === 'apple' ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Apple className="w-5 h-5 mr-2" />
                )}
                {expressLoading === 'apple' ? 'Processing...' : 'Buy with Apple Pay'}
              </button>
            )}

            {isGooglePayAvailable() && (
              <button
                onClick={handleGooglePayCheckout}
                disabled={expressLoading !== null}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {expressLoading === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Chrome className="w-5 h-5 mr-2" />
                )}
                {expressLoading === 'google' ? 'Processing...' : 'Buy with Google Pay'}
              </button>
            )}
          </div>

          {(isApplePayAvailable() || isGooglePayAvailable()) && (
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
          )}
        </div>
      )}

      {/* One-Click Checkout for Returning Customers */}
      {canUseOneClick && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-3">One-Click Checkout</div>
          
          {/* Payment Method Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Payment Method
            </label>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {profile?.paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.brand ? `${method.brand.toUpperCase()} ****${method.last4}` : method.type}
                  {method.isDefault && ' (Default)'}
                </option>
              ))}
            </select>
          </div>

          {/* Shipping Address Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Truck className="w-4 h-4 inline mr-1" />
              Shipping Address
            </label>
            <select
              value={selectedShipping}
              onChange={(e) => setSelectedShipping(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {profile?.shippingAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.name} - {address.address1}, {address.city}
                  {address.isDefault && ' (Default)'}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOneClickCheckout}
            disabled={loading || !selectedPayment || !selectedShipping}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Check className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Processing Order...' : 'Complete Order'}
          </button>
        </div>
      )}

      {/* Guest Checkout Option */}
      {!canUseOneClick && (
        <div className="text-center">
          <div className="mb-4">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {!userId 
                ? 'Sign in to enable one-click checkout'
                : 'Save payment and shipping info for faster checkout'
              }
            </p>
          </div>
          <button
            onClick={() => {
              // Redirect to regular checkout
              window.location.href = '/checkout';
            }}
            className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue to Checkout
          </button>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-4 h-4 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-xs text-green-800">
              <strong>Secure checkout</strong> - Your payment information is encrypted and never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneClickCheckout;