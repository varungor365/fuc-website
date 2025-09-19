'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon, LockClosedIcon, CreditCardIcon, TruckIcon } from '@heroicons/react/24/outline'

// Mock cart data
const cartItems = [
  {
    id: 1,
    name: 'Oversized Black Hoodie',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=120&fit=crop&crop=center',
    color: 'Black',
    size: 'L',
    quantity: 2
  },
  {
    id: 2,
    name: 'Graphic Print Tee',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=120&fit=crop&crop=center',
    color: 'White',
    size: 'M',
    quantity: 1
  }
]

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Contact Info
    email: '',
    
    // Shipping Address
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    
    // Payment
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    
    // UPI
    upiId: '',
    
    // Other options
    saveInfo: false,
    sameAsBilling: true
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 0 // Free shipping
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {}
    
    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required'
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.address) newErrors.address = 'Address is required'
      if (!formData.city) newErrors.city = 'City is required'
      if (!formData.state) newErrors.state = 'State is required'
      if (!formData.pincode) newErrors.pincode = 'PIN code is required'
      if (!formData.phone) newErrors.phone = 'Phone number is required'
    }
    
    if (step === 2) {
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required'
        if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
        if (!formData.cvv) newErrors.cvv = 'CVV is required'
        if (!formData.nameOnCard) newErrors.nameOnCard = 'Name on card is required'
      }
      if (formData.paymentMethod === 'upi' && !formData.upiId) {
        newErrors.upiId = 'UPI ID is required'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handlePlaceOrder = () => {
    if (validateStep(2)) {
      // Process order
      console.log('Order placed:', formData)
      setCurrentStep(3)
    }
  }

  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-primary-950 text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-primary-300 mb-8">
              Thank you for your order. We&apos;ll send you a confirmation email shortly.
            </p>
            <div className="space-y-4">
              <Link
                href="/account/orders"
                className="inline-block bg-accent-500 hover:bg-accent-600 text-black py-3 px-8 rounded-lg font-semibold transition-colors"
              >
                View Order Details
              </Link>
              <br />
              <Link
                href="/collections/all"
                className="inline-block text-accent-400 hover:text-accent-300 font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Progress Steps */}
        <div className="mb-8">
          <nav className="flex items-center justify-center space-x-4">
            {[
              { step: 1, name: 'Shipping', icon: TruckIcon },
              { step: 2, name: 'Payment', icon: CreditCardIcon },
              { step: 3, name: 'Confirmation', icon: LockClosedIcon }
            ].map(({ step, name, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-accent-500 border-accent-500 text-black' 
                    : 'border-primary-600 text-primary-400'
                }`}>
                  {currentStep > step ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-white' : 'text-primary-400'
                }`}>
                  {name}
                </span>
                {step < 3 && <ChevronRightIcon className="w-4 h-4 text-primary-600 ml-4" />}
              </div>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Main Content - Shipping Form */}
          <div>
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full bg-primary-900 border ${errors.email ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full bg-primary-900 border ${errors.firstName ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                        placeholder="First name"
                      />
                      {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full bg-primary-900 border ${errors.lastName ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                        placeholder="Last name"
                      />
                      {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Continue with more form fields */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full bg-primary-900 border ${errors.address ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                      placeholder="Street address"
                    />
                    {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full bg-primary-900 border ${errors.city ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                        placeholder="City"
                      />
                      {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">State</label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={`w-full bg-primary-900 border ${errors.state ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-400`}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">PIN Code</label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        className={`w-full bg-primary-900 border ${errors.pincode ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                        placeholder="PIN Code"
                        maxLength={6}
                      />
                      {errors.pincode && <p className="text-red-400 text-sm mt-1">{errors.pincode}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full bg-primary-900 border ${errors.phone ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-4">Payment Method</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
                        { id: 'upi', name: 'UPI', icon: '📱' },
                        { id: 'cod', name: 'Cash on Delivery', icon: '💰' }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => handleInputChange('paymentMethod', method.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            formData.paymentMethod === method.id
                              ? 'border-accent-400 bg-accent-400/10'
                              : 'border-primary-700 hover:border-primary-600'
                          }`}
                        >
                          <div className="text-2xl mb-2">{method.icon}</div>
                          <div className="font-medium">{method.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Card Number</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          className={`w-full bg-primary-900 border ${errors.cardNumber ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Expiry Date</label>
                          <input
                            type="text"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            className={`w-full bg-primary-900 border ${errors.expiryDate ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                            placeholder="MM/YY"
                          />
                          {errors.expiryDate && <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">CVV</label>
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            className={`w-full bg-primary-900 border ${errors.cvv ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                            placeholder="123"
                            maxLength={4}
                          />
                          {errors.cvv && <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Name on Card</label>
                        <input
                          type="text"
                          value={formData.nameOnCard}
                          onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                          className={`w-full bg-primary-900 border ${errors.nameOnCard ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                          placeholder="John Doe"
                        />
                        {errors.nameOnCard && <p className="text-red-400 text-sm mt-1">{errors.nameOnCard}</p>}
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'upi' && (
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">UPI ID</label>
                      <input
                        type="text"
                        value={formData.upiId}
                        onChange={(e) => handleInputChange('upiId', e.target.value)}
                        className={`w-full bg-primary-900 border ${errors.upiId ? 'border-red-500' : 'border-primary-700'} rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400`}
                        placeholder="yourname@paytm"
                      />
                      {errors.upiId && <p className="text-red-400 text-sm mt-1">{errors.upiId}</p>}
                    </div>
                  )}

                  {formData.paymentMethod === 'cod' && (
                    <div className="p-4 bg-primary-900 rounded-lg">
                      <p className="text-primary-200">
                        You will pay ₹{total.toLocaleString()} when your order is delivered.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  onClick={handlePreviousStep}
                  className="py-3 px-6 border border-primary-600 text-white rounded-lg hover:border-primary-400 transition-colors"
                >
                  Back
                </button>
              )}
              <div className="ml-auto">
                {currentStep < 2 ? (
                  <button
                    onClick={handleNextStep}
                    className="py-3 px-8 bg-accent-500 hover:bg-accent-600 text-black rounded-lg font-semibold transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    className="py-3 px-8 bg-accent-500 hover:bg-accent-600 text-black rounded-lg font-semibold transition-colors"
                  >
                    Place Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-primary-900 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-primary-800 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <div className="absolute -top-2 -right-2 bg-accent-500 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm">{item.name}</h3>
                      <p className="text-primary-400 text-xs">{item.color} • {item.size}</p>
                      <p className="text-accent-400 font-semibold text-sm mt-1">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 border-t border-primary-700 pt-6">
                <div className="flex justify-between text-primary-200">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-primary-200">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-primary-200">
                  <span>Tax (GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-primary-700 pt-4">
                <div className="flex justify-between text-xl font-semibold text-white">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center text-primary-400">
                <LockClosedIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">Secure SSL Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
