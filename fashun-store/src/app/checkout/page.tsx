'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

const mockCartItems: CheckoutItem[] = [
  {
    id: 'cyber-punk-hoodie',
    name: 'Cyber Punk Neon Hoodie',
    price: 3299,
    quantity: 1,
    size: 'L',
    image: '/images/mock/products/hoodies/cyber-punk-hoodie.svg'
  }
];

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
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const cartItems = mockCartItems;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1500 ? 0 : 149;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStepSubmit = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Process payment
      setIsProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setOrderComplete(true);
      }, 3000);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            </motion.div>
            
            <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-white/60 mb-6">
              Thank you for your purchase. Your order #FAS-2024-001 has been confirmed.
            </p>
            
            <div className="space-y-3">
              <Link
                href="/account/orders"
                className="block w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Track Your Order
              </Link>
              <Link
                href="/collections/all"
                className="block w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
          <p className="text-white/60">Please do not close this window...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-white/60 hover:text-white mb-4">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Checkout
            </span>
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl">
            {[
              { step: 1, title: 'Shipping' },
              { step: 2, title: 'Payment' },
              { step: 3, title: 'Review' }
            ].map(({ step, title }) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  currentStep >= step 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-white/60'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 ${
                  currentStep >= step ? 'text-white' : 'text-white/60'
                }`}>
                  {title}
                </span>
                {step < 3 && <div className="w-16 h-0.5 bg-white/10 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {/* Step 1: Shipping Information */}
            {currentStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-xl p-6 border border-white/10"
              >
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                      placeholder="Street address or P.O. Box"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-xl p-6 border border-white/10"
              >
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                
                <div className="space-y-4 mb-6">
                  {[
                    { id: 'card', title: 'Credit/Debit Card', icon: CreditCardIcon },
                    { id: 'upi', title: 'UPI Payment', icon: BanknotesIcon },
                    { id: 'razorpay', title: 'Razorpay Secure', icon: ShieldCheckIcon }
                  ].map(({ id, title, icon: Icon }) => (
                    <label key={id} className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={id}
                        checked={paymentMethod === id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-4 accent-purple-500"
                      />
                      <Icon className="w-6 h-6 mr-3 text-purple-400" />
                      <span className="font-medium">{title}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="text-center py-8">
                    <div className="w-48 h-48 bg-white mx-auto rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-gray-500">QR Code</span>
                    </div>
                    <p className="text-white/60">Scan this QR code with any UPI app</p>
                  </div>
                )}

                {paymentMethod === 'razorpay' && (
                  <div className="text-center py-8">
                    <ShieldCheckIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-white/60">You will be redirected to Razorpay secure checkout</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Order Review */}
            {currentStep >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-xl p-6 border border-white/10"
              >
                <h2 className="text-xl font-bold mb-4">Order Review</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm">
                    <LockClosedIcon className="w-4 h-4 mr-2 text-green-400" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Shipping to:</h3>
                    <p className="text-white/80 text-sm">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.pincode}<br />
                      {formData.phone}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Payment Method:</h3>
                    <p className="text-white/80 text-sm capitalize">
                      {paymentMethod.replace('-', ' ')}
                      {paymentMethod === 'card' && formData.cardNumber && 
                        ` ending in ${formData.cardNumber.slice(-4)}`
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleStepSubmit}
              disabled={!paymentMethod && currentStep === 2}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
            >
              {currentStep === 1 && 'Continue to Payment'}
              {currentStep === 2 && 'Review Order'}
              {currentStep === 3 && 'Complete Order'}
            </button>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-sm text-white/60">Size: {item.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pricing */}
              <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-white/60">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Tax (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-2">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-white/60">
                  <TruckIcon className="w-4 h-4 mr-2" />
                  <span>Free shipping on orders over ₹1500</span>
                </div>
                <div className="flex items-center text-sm text-white/60">
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center text-sm text-white/60">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  <span>30-day return guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}