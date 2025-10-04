'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  TruckIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOffice2Icon,
  GiftIcon,
  TagIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface CheckoutStep {
  id: string;
  title: string;
  completed: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
  icon: React.ReactNode;
  processingFee?: number;
  description: string;
  popular?: boolean;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

interface EnhancedCheckoutProps {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  onOrderComplete: (orderId: string) => void;
  onBack: () => void;
}

const EnhancedCheckout: React.FC<EnhancedCheckoutProps> = ({
  items,
  subtotal,
  shipping,
  discount,
  onOrderComplete,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [giftMessage, setGiftMessage] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const steps: CheckoutStep[] = [
    { id: '1', title: 'Delivery Address', completed: currentStep > 1 },
    { id: '2', title: 'Payment Method', completed: currentStep > 2 },
    { id: '3', title: 'Order Review', completed: false }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI',
      type: 'upi',
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      description: 'Pay with any UPI app',
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: <CreditCardIcon className="w-6 h-6" />,
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      type: 'netbanking',
      icon: <BuildingOffice2Icon className="w-6 h-6" />,
      description: 'All major banks supported'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      type: 'wallet',
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      description: 'Paytm, PhonePe, Amazon Pay'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      type: 'cod',
      icon: <BanknotesIcon className="w-6 h-6" />,
      description: 'Pay when you receive',
      processingFee: 49
    }
  ];

  const addresses: Address[] = [
    {
      id: '1',
      type: 'home',
      name: 'John Doe',
      phone: '+91 9876543210',
      addressLine1: '123 Fashion Street',
      addressLine2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      landmark: 'Near Metro Station',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      name: 'John Doe',
      phone: '+91 9876543210',
      addressLine1: '456 Business District',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      isDefault: false
    }
  ];

  const total = subtotal + shipping - discount + (paymentMethods.find(p => p.id === selectedPayment)?.processingFee || 0);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 3);
    }
    
    setCardDetails(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const orderId = `FUC${Date.now()}`;
    onOrderComplete(orderId);
    setIsProcessing(false);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedAddress !== '';
      case 2:
        return selectedPayment !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  const AddressCard: React.FC<{ address: Address }> = ({ address }) => (
    <motion.label
      className={`block p-4 border-2 rounded-2xl cursor-pointer transition-all ${
        selectedAddress === address.id
          ? 'border-primary-500 bg-primary-50'
          : 'border-neutral-200 hover:border-primary-300 bg-white'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="radio"
        name="address"
        value={address.id}
        checked={selectedAddress === address.id}
        onChange={(e) => setSelectedAddress(e.target.value)}
        className="sr-only"
      />
      
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-neutral-600" />
          <span className="font-semibold text-neutral-900 capitalize">{address.type}</span>
          {address.isDefault && (
            <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
              Default
            </span>
          )}
        </div>
      </div>
      
      <div className="ml-7">
        <div className="font-medium text-neutral-900">{address.name}</div>
        <div className="text-sm text-neutral-600 mt-1">
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
        </div>
        <div className="text-sm text-neutral-600">
          {address.city}, {address.state} - {address.pincode}
        </div>
        {address.landmark && (
          <div className="text-sm text-neutral-500">Landmark: {address.landmark}</div>
        )}
        <div className="text-sm text-neutral-600 mt-1">Phone: {address.phone}</div>
      </div>
    </motion.label>
  );

  const PaymentCard: React.FC<{ method: PaymentMethod }> = ({ method }) => (
    <motion.label
      className={`block p-4 border-2 rounded-2xl cursor-pointer transition-all ${
        selectedPayment === method.id
          ? 'border-primary-500 bg-primary-50'
          : 'border-neutral-200 hover:border-primary-300 bg-white'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="radio"
        name="payment"
        value={method.id}
        checked={selectedPayment === method.id}
        onChange={(e) => setSelectedPayment(e.target.value)}
        className="sr-only"
      />
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
          {method.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">{method.name}</span>
            {method.popular && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Popular
              </span>
            )}
          </div>
          <div className="text-sm text-neutral-600">{method.description}</div>
          {method.processingFee && (
            <div className="text-sm text-orange-600">
              + ₹{method.processingFee} processing fee
            </div>
          )}
        </div>
        
        <div className="w-6 h-6 border-2 border-neutral-300 rounded-full flex items-center justify-center">
          {selectedPayment === method.id && (
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
          )}
        </div>
      </div>
    </motion.label>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeftIcon className="w-5 h-5 text-neutral-600" />
          </motion.button>
          
          <div>
            <h1 className="heading-2">Secure Checkout</h1>
            <p className="text-neutral-600">Complete your order safely and securely</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  step.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : currentStep === parseInt(step.id)
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-white border-neutral-300 text-neutral-600'
                }`}>
                  {step.completed ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    step.completed ? 'bg-green-500' : 'bg-neutral-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-sm font-medium text-neutral-900">
            {steps[currentStep - 1]?.title}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Delivery Address */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="heading-3 mb-6">Select Delivery Address</h2>
                    
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <AddressCard key={address.id} address={address} />
                      ))}
                      
                      <motion.button
                        className="w-full p-4 border-2 border-dashed border-neutral-300 rounded-2xl text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        + Add New Address
                      </motion.button>
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold text-neutral-900 mb-4">Delivery Options</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <TruckIcon className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium text-green-700">Standard Delivery</div>
                            <div className="text-sm text-green-600">3-5 business days</div>
                          </div>
                        </div>
                        <span className="font-semibold text-green-700">Free</span>
                      </div>
                      
                      <div className="p-3 border border-neutral-200 rounded-xl">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} />
                          <GiftIcon className="w-5 h-5 text-neutral-600" />
                          <span>This is a gift</span>
                        </label>
                        
                        {isGift && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3"
                          >
                            <textarea
                              value={giftMessage}
                              onChange={(e) => setGiftMessage(e.target.value)}
                              placeholder="Add a gift message..."
                              className="w-full p-3 border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                              rows={3}
                            />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="p-3 border border-neutral-200 rounded-xl">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Delivery Instructions (Optional)
                        </label>
                        <input
                          type="text"
                          value={deliveryInstructions}
                          onChange={(e) => setDeliveryInstructions(e.target.value)}
                          placeholder="e.g., Leave at door, Ring bell twice"
                          className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="heading-3 mb-6">Choose Payment Method</h2>
                    
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <PaymentCard key={method.id} method={method} />
                      ))}
                    </div>
                  </div>

                  {/* Card Details */}
                  {selectedPayment === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 shadow-sm"
                    >
                      <h3 className="font-semibold text-neutral-900 mb-4">Card Details</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardDetails.number}
                            onChange={(e) => handleCardChange('number', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            maxLength={19}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={cardDetails.expiry}
                              onChange={(e) => handleCardChange('expiry', e.target.value)}
                              placeholder="MM/YY"
                              className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              maxLength={5}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={cardDetails.cvv}
                              onChange={(e) => handleCardChange('cvv', e.target.value)}
                              placeholder="123"
                              className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              maxLength={3}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={cardDetails.name}
                            onChange={(e) => handleCardChange('name', e.target.value)}
                            placeholder="John Doe"
                            className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
                        <LockClosedIcon className="w-4 h-4" />
                        Your payment information is encrypted and secure
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="heading-3 mb-6">Review Your Order</h2>
                    
                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-neutral-50 rounded-xl">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-neutral-900">{item.name}</h3>
                            <div className="text-sm text-neutral-600">
                              {item.color} • Size {item.size} • Qty {item.quantity}
                            </div>
                            <div className="font-semibold text-neutral-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Delivery Address */}
                    <div className="border-t border-neutral-200 pt-6">
                      <h3 className="font-semibold text-neutral-900 mb-3">Delivery Address</h3>
                      {addresses.find(a => a.id === selectedAddress) && (
                        <div className="p-4 bg-neutral-50 rounded-xl">
                          <div className="font-medium text-neutral-900">
                            {addresses.find(a => a.id === selectedAddress)?.name}
                          </div>
                          <div className="text-sm text-neutral-600 mt-1">
                            {addresses.find(a => a.id === selectedAddress)?.addressLine1}
                            {addresses.find(a => a.id === selectedAddress)?.addressLine2 && 
                              `, ${addresses.find(a => a.id === selectedAddress)?.addressLine2}`}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {addresses.find(a => a.id === selectedAddress)?.city}, {addresses.find(a => a.id === selectedAddress)?.state} - {addresses.find(a => a.id === selectedAddress)?.pincode}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Payment Method */}
                    <div className="border-t border-neutral-200 pt-6">
                      <h3 className="font-semibold text-neutral-900 mb-3">Payment Method</h3>
                      {paymentMethods.find(p => p.id === selectedPayment) && (
                        <div className="p-4 bg-neutral-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            {paymentMethods.find(p => p.id === selectedPayment)?.icon}
                            <span className="font-medium text-neutral-900">
                              {paymentMethods.find(p => p.id === selectedPayment)?.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <motion.button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="btn btn-secondary disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Previous
              </motion.button>
              
              {currentStep < 3 ? (
                <motion.button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToNextStep()}
                  className="btn btn-primary disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue
                </motion.button>
              ) : (
                <motion.button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="btn btn-primary btn-lg disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Place Order - ₹${total.toLocaleString()}`
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
              <h3 className="font-semibold text-neutral-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Subtotal ({items.length} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>
                
                {discount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                
                {selectedPayment === 'cod' && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Processing Fee</span>
                    <span className="font-medium">₹49</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                  <span className="font-semibold text-neutral-900">Total</span>
                  <span className="font-bold text-xl text-neutral-900">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Security Features */}
              <div className="space-y-3 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                  SSL Encrypted Checkout
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <TruckIcon className="w-4 h-4 text-blue-500" />
                  Free Returns within 30 days
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <ClockIcon className="w-4 h-4 text-purple-500" />
                  24/7 Customer Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCheckout;