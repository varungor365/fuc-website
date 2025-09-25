'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  CheckIcon,
  CurrencyRupeeIcon,
  GiftIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
  TagIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PricingDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  showDiscount?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'minimal' | 'bold' | 'gradient';
  className?: string;
}

interface PricingCardProps {
  tier: PricingTier;
  isSelected?: boolean;
  onSelect?: (tier: PricingTier) => void;
  className?: string;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({
  price,
  originalPrice,
  currency = '₹',
  showDiscount = true,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('₹', currency);
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Current Price */}
      <div className={`font-bold ${sizeClasses[size]} ${
        variant === 'gradient' 
          ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
          : variant === 'bold'
          ? 'text-white'
          : 'text-white'
      }`}>
        {formatPrice(price)}
      </div>

      {/* Original Price & Discount */}
      {originalPrice && showDiscount && (
        <div className="flex items-center space-x-2">
          <span className={`line-through text-gray-400 ${
            size === 'xl' ? 'text-lg' : 
            size === 'lg' ? 'text-base' : 
            size === 'md' ? 'text-sm' : 'text-xs'
          }`}>
            {formatPrice(originalPrice)}
          </span>
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            -{discount}%
          </span>
        </div>
      )}
    </div>
  );
};

const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  isSelected = false,
  onSelect,
  className = ''
}) => {
  const IconComponent = tier.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative ${className}`}
    >
      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
            <FireIcon className="w-4 h-4" />
            <span>MOST POPULAR</span>
          </div>
        </div>
      )}

      <div 
        className={`relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full transition-all duration-300 ${
          isSelected 
            ? `border-${tier.color}-500/50 shadow-lg shadow-${tier.color}-500/20` 
            : `hover:border-${tier.color}-500/30`
        }`}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 ${tier.gradient} opacity-5 rounded-3xl`} />

        {/* Icon */}
        <div className={`w-16 h-16 bg-${tier.color}-500/20 rounded-2xl flex items-center justify-center mb-6`}>
          <IconComponent className={`w-8 h-8 text-${tier.color}-400`} />
        </div>

        {/* Tier Name */}
        <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
        
        {/* Description */}
        <p className="text-gray-400 mb-6">{tier.description}</p>

        {/* Price */}
        <div className="mb-8">
          <PricingDisplay
            price={tier.price}
            originalPrice={tier.originalPrice}
            size="xl"
            variant="gradient"
          />
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-5 h-5 bg-${tier.color}-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <CheckIcon className={`w-3 h-3 text-${tier.color}-400`} />
              </div>
              <span className="text-gray-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Select Button */}
        <button
          onClick={() => onSelect?.(tier)}
          className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
            isSelected
              ? `bg-${tier.color}-500 text-white`
              : `bg-${tier.color}-500/10 text-${tier.color}-400 hover:bg-${tier.color}-500/20`
          }`}
        >
          {isSelected ? 'Selected' : 'Choose Plan'}
        </button>
      </div>
    </motion.div>
  );
};

// Premium subscription tiers
const subscriptionTiers: PricingTier[] = [
  {
    id: 'basic',
    name: 'Street Style',
    price: 999,
    originalPrice: 1499,
    description: 'Perfect for style enthusiasts getting started',
    features: [
      'AI Style Recommendations',
      'Basic Outfit Builder',
      'Monthly Style Guide',
      'Community Access',
      'Standard Support'
    ],
    color: 'blue',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    icon: TagIcon
  },
  {
    id: 'pro',
    name: 'Fashion Pro',
    price: 1999,
    originalPrice: 2999,
    description: 'For serious fashion lovers and influencers',
    features: [
      'Advanced AI Styling',
      'Unlimited Outfit Generation',
      'Weekly Personal Consultations',
      'Early Access to Drops',
      'Priority Support',
      'Exclusive Community Events',
      'Style Analytics Dashboard'
    ],
    popular: true,
    color: 'purple',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
    icon: SparklesIcon
  },
  {
    id: 'elite',
    name: 'Elite Trendsetter',
    price: 3999,
    originalPrice: 5999,
    description: 'Ultimate experience for fashion industry professionals',
    features: [
      'Personal AI Stylist',
      'Custom Design Collaboration',
      'One-on-One Style Sessions',
      'VIP Event Invitations',
      '24/7 Concierge Support',
      'Limited Edition Access',
      'Brand Partnership Opportunities',
      'Professional Portfolio Builder'
    ],
    color: 'gold',
    gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    icon: GiftIcon
  }
];

interface PremiumPricingProps {
  showSubscriptions?: boolean;
  onSelectPlan?: (plan: PricingTier) => void;
  className?: string;
}

const PremiumPricing: React.FC<PremiumPricingProps> = ({
  showSubscriptions = false,
  onSelectPlan,
  className = ''
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = (tier: PricingTier) => {
    setSelectedPlan(tier.id);
    onSelectPlan?.(tier);
  };

  if (!showSubscriptions) {
    // Simple pricing display for products
    return (
      <div className={`space-y-4 ${className}`}>
        <PricingDisplay
          price={2999}
          originalPrice={4999}
          size="lg"
          variant="gradient"
        />
        
        {/* Payment options */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <TruckIcon className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-xs text-gray-400">Free Shipping</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-xs text-gray-400">Secure Payment</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <ClockIcon className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-xs text-gray-400">Easy Returns</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Choose Your Style Journey
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Unlock premium features and take your fashion game to the next level
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mt-8 bg-white/5 rounded-2xl p-2 w-fit mx-auto">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
              billingPeriod === 'monthly'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
              billingPeriod === 'yearly'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Yearly
            <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {subscriptionTiers.map((tier) => (
          <PricingCard
            key={tier.id}
            tier={{
              ...tier,
              price: billingPeriod === 'yearly' ? Math.round(tier.price * 10) : tier.price,
              originalPrice: billingPeriod === 'yearly' ? Math.round((tier.originalPrice || 0) * 10) : tier.originalPrice
            }}
            isSelected={selectedPlan === tier.id}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h4 className="font-semibold text-white mb-2">Can I change my plan anytime?</h4>
            <p className="text-gray-400 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h4 className="font-semibold text-white mb-2">What payment methods do you accept?</h4>
            <p className="text-gray-400 text-sm">We accept all major credit cards, UPI, net banking, and digital wallets.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h4 className="font-semibold text-white mb-2">Is there a free trial?</h4>
            <p className="text-gray-400 text-sm">Yes! All plans come with a 7-day free trial. No commitment required.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h4 className="font-semibold text-white mb-2">Can I cancel anytime?</h4>
            <p className="text-gray-400 text-sm">Absolutely. Cancel your subscription anytime from your account settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPricing;
export { PricingDisplay, PricingCard };