'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  GiftIcon,
  CreditCardIcon,
  HeartIcon,
  SparklesIcon,
  CalendarIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  StarIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline'

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(2000)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedDesign, setSelectedDesign] = useState('celebration')
  const [deliveryMethod, setDeliveryMethod] = useState('email')
  const [giftCardData, setGiftCardData] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    senderName: '',
    message: '',
    deliveryDate: ''
  })

  const predefinedAmounts = [500, 1000, 2000, 3000, 5000, 10000]
  
  const giftCardDesigns = [
    {
      id: 'celebration',
      name: 'Celebration',
      preview: 'bg-gradient-to-br from-accent-400 to-accent-600',
      theme: 'Perfect for birthdays and special occasions'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      preview: 'bg-gradient-to-br from-primary-600 to-primary-800',
      theme: 'Clean and elegant design'
    },
    {
      id: 'streetwear',
      name: 'Streetwear',
      preview: 'bg-gradient-to-br from-orange-500 to-red-600',
      theme: 'Bold and urban aesthetic'
    },
    {
      id: 'luxury',
      name: 'Luxury',
      preview: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      theme: 'Premium gold finish'
    }
  ]

  const benefits = [
    {
      icon: CreditCardIcon,
      title: 'No Expiry Date',
      description: 'Our gift cards never expire, so they can shop whenever they want'
    },
    {
      icon: SparklesIcon,
      title: 'Any Amount',
      description: 'Choose from preset amounts or enter a custom value (₹100 - ₹50,000)'
    },
    {
      icon: HeartIcon,
      title: 'Personal Touch',
      description: 'Add a personalized message to make your gift extra special'
    },
    {
      icon: EnvelopeIcon,
      title: 'Instant Delivery',
      description: 'Send immediately or schedule delivery for a specific date'
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setGiftCardData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getGiftCardAmount = () => {
    if (customAmount && parseFloat(customAmount) > 0) {
      return parseFloat(customAmount)
    }
    return selectedAmount
  }

  const handlePurchase = () => {
    // Handle gift card purchase logic
    console.log('Purchasing gift card:', {
      amount: getGiftCardAmount(),
      design: selectedDesign,
      delivery: deliveryMethod,
      ...giftCardData
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GiftIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Gift
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Cards
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Give the gift of style. Perfect for any occasion, our digital gift cards 
              let them choose their favorite streetwear pieces.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
                >
                  <div className="bg-accent-500/20 rounded-full p-3 w-fit mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-primary-300 text-sm">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gift Card Builder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Amount Selection */}
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <CurrencyRupeeIcon className="w-6 h-6 mr-2 text-accent-400" />
                Choose Amount
              </h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount)
                      setCustomAmount('')
                    }}
                    className={`p-4 rounded-xl font-semibold transition-all ${
                      selectedAmount === amount && !customAmount
                        ? 'bg-accent-500 text-primary-900 border-2 border-accent-400'
                        : 'bg-primary-800/30 text-primary-200 border border-white/10 hover:border-accent-400/50'
                    }`}
                  >
                    ₹{amount.toLocaleString()}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-primary-200 text-sm font-medium mb-2">
                  Or enter custom amount (₹100 - ₹50,000)
                </label>
                <input
                  type="number"
                  min="100"
                  max="50000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-3 bg-primary-800/30 border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
                />
              </div>
            </div>

            {/* Design Selection */}
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-accent-400" />
                Choose Design
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {giftCardDesigns.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesign(design.id)}
                    className={`relative p-4 rounded-xl transition-all ${
                      selectedDesign === design.id
                        ? 'ring-2 ring-accent-400 ring-offset-2 ring-offset-primary-900'
                        : 'hover:ring-1 hover:ring-white/20'
                    }`}
                  >
                    <div className={`${design.preview} aspect-[3/2] rounded-lg mb-3 flex items-center justify-center`}>
                      <GiftIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1">{design.name}</h3>
                    <p className="text-primary-300 text-xs">{design.theme}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <EnvelopeIcon className="w-6 h-6 mr-2 text-accent-400" />
                Delivery Method
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 bg-primary-800/30 rounded-xl cursor-pointer hover:bg-primary-700/30 transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    value="email"
                    checked={deliveryMethod === 'email'}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-4 h-4 text-accent-500 bg-primary-800/30 border-white/20"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-5 h-5 text-accent-400 mr-2" />
                      <span className="text-white font-semibold">Email Delivery</span>
                    </div>
                    <p className="text-primary-300 text-sm">Instant delivery to recipient's email</p>
                  </div>
                </label>

                <label className="flex items-center p-4 bg-primary-800/30 rounded-xl cursor-pointer hover:bg-primary-700/30 transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    value="sms"
                    checked={deliveryMethod === 'sms'}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-4 h-4 text-accent-500 bg-primary-800/30 border-white/20"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <DevicePhoneMobileIcon className="w-5 h-5 text-accent-400 mr-2" />
                      <span className="text-white font-semibold">SMS Delivery</span>
                    </div>
                    <p className="text-primary-300 text-sm">Send via text message</p>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Gift Card Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Gift Card Preview */}
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Gift Card Preview</h2>
              
              <div className="relative">
                <div className={`${giftCardDesigns.find(d => d.id === selectedDesign)?.preview} aspect-[3/2] rounded-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <GiftIcon className="w-8 h-8" />
                      <span className="text-sm font-medium">FASHUN</span>
                    </div>
                    <div>
                      <p className="text-sm opacity-90 mb-1">Gift Card</p>
                      <p className="text-2xl font-bold">₹{getGiftCardAmount().toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs opacity-75">Valid for all products • No expiry</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recipient Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-primary-200 text-sm font-medium mb-2">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={giftCardData.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    placeholder="Enter recipient's name"
                    className="w-full p-3 bg-primary-800/30 border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
                  />
                </div>

                {deliveryMethod === 'email' ? (
                  <div>
                    <label className="block text-primary-200 text-sm font-medium mb-2">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      value={giftCardData.recipientEmail}
                      onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                      placeholder="recipient@email.com"
                      className="w-full p-3 bg-primary-800/30 border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-primary-200 text-sm font-medium mb-2">
                      Recipient Phone
                    </label>
                    <input
                      type="tel"
                      value={giftCardData.recipientPhone}
                      onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full p-3 bg-primary-800/30 border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-primary-200 text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={giftCardData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    placeholder="Your name"
                    className="w-full p-3 bg-primary-800/30 border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
                  />
                </div>

                <div>
                  <label className="block text-primary-200 text-sm font-medium mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={giftCardData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Add a personal message..."
                    maxLength={200}
                    className="w-full p-3 bg-primary-800/30 border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20 resize-none"
                  />
                  <p className="text-primary-400 text-xs mt-1">{giftCardData.message.length}/200 characters</p>
                </div>

                <div>
                  <label className="block text-primary-200 text-sm font-medium mb-2">
                    Delivery Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={giftCardData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 bg-primary-800/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
                  />
                  <p className="text-primary-400 text-xs mt-1">Leave empty to send immediately</p>
                </div>
              </div>
            </div>

            {/* Purchase Summary */}
            <div className="bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-primary-200">Gift Card Value</span>
                  <span className="text-white font-semibold">₹{getGiftCardAmount().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-200">Processing Fee</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-accent-400 font-bold text-xl">₹{getGiftCardAmount().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full btn btn-glass mb-4"
              >
                Purchase Gift Card
              </button>

              <div className="flex items-center text-primary-300 text-sm">
                <CheckCircleIcon className="w-4 h-4 mr-2 text-green-400" />
                <span>Secure payment • Instant delivery • No expiry</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-2">Do gift cards expire?</h3>
                <p className="text-primary-200 text-sm">No, our gift cards never expire. Recipients can use them whenever they want.</p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Can gift cards be used with other offers?</h3>
                <p className="text-primary-200 text-sm">Yes, gift cards can be combined with most promotional offers and discounts.</p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">What if the order is less than the gift card value?</h3>
                <p className="text-primary-200 text-sm">The remaining balance stays on the gift card for future purchases.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-2">Can I get a refund on gift cards?</h3>
                <p className="text-primary-200 text-sm">Gift cards are non-refundable, but they never expire so can always be used later.</p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">How will the recipient receive the gift card?</h3>
                <p className="text-primary-200 text-sm">Gift cards are delivered digitally via email or SMS with a unique code and instructions.</p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Can I schedule delivery for a future date?</h3>
                <p className="text-primary-200 text-sm">Yes, you can schedule delivery up to 1 year in advance for special occasions.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}