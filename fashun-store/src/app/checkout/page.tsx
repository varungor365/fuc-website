'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { useSaleorCheckout, SaleorStatus } from '@/hooks/useSaleor';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const { checkout, createCheckout, loading: creating, error: orderError } = useSaleorCheckout();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStepSubmit = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Create Saleor checkout
      const lines = [
        {
          variantId: 'UHJvZHVjdFZhcmlhbnQ6MQ==', // Base64 encoded variant ID for demo
          quantity: 1
        }
      ];

      const newCheckout = await createCheckout(lines);
      if (newCheckout) {
        setCreatedOrder(newCheckout);
        setOrderComplete(true);
      }
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center p-8 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl"
        >
          <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
          {createdOrder?.id && (
            <p className="text-white/80 mb-2">Order ID: #{createdOrder.id}</p>
          )}
          <p className="text-white/60 mb-6">Thank you for your purchase. Your order has been successfully created with Saleor GraphQL.</p>
          <SaleorStatus className="mb-4" />
          <Link href="/" className="bg-gradient-to-r from-white via-gray-50 to-white text-black px-6 py-3 rounded-xl font-subheading shadow-lg hover:shadow-xl hover:from-gray-50 hover:to-gray-100 transition-all duration-300">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-white/60 hover:text-white mb-4">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Cart
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Saleor GraphQL Checkout</h1>
            <SaleorStatus />
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step <= currentStep ? 'bg-white text-black' : 'bg-white/20 text-white/60'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  step < currentStep ? 'bg-white' : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {/* Step 1: Contact Information */}
          {currentStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </motion.div>
          )}

          {/* Step 2: Shipping Information */}
          {currentStep >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="PIN Code"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment Method */}
          {currentStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'saleor', title: 'Saleor GraphQL Payment', icon: ShieldCheckIcon },
                  { id: 'stripe', title: 'Credit/Debit Card', icon: CreditCardIcon },
                  { id: 'cod', title: 'Cash on Delivery', icon: BanknotesIcon }
                ].map((method) => (
                  <label key={method.id} className="flex items-center p-4 bg-white/5 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <method.icon className="h-6 w-6 text-white mr-3" />
                    <span className="text-white font-medium">{method.title}</span>
                    {paymentMethod === method.id && (
                      <CheckCircleIcon className="h-5 w-5 text-green-400 ml-auto" />
                    )}
                  </label>
                ))}
              </div>

              {orderError && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-red-400 text-sm">{orderError}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleStepSubmit}
            disabled={creating || (!paymentMethod && currentStep === 3)}
            className="w-full bg-gradient-to-r from-white via-gray-50 to-white text-black py-4 px-6 rounded-xl font-subheading shadow-lg hover:shadow-xl hover:from-gray-50 hover:to-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {creating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2"></div>
                Creating Order...
              </div>
            ) : (
              <>
                {currentStep < 3 && 'Continue'}
                {currentStep === 3 && 'Complete Order with Saleor GraphQL'}
              </>
            )}
          </button>


        </div>
      </div>
    </div>
  );
}