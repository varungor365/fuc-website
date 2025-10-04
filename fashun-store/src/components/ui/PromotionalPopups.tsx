'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Gift, Tag, Zap, Clock, Star, ArrowRight, Mail, Percent, Crown } from 'lucide-react';
import Image from 'next/image';

export type PopupType = 'exit-intent' | 'time-based' | 'scroll-based' | 'new-visitor' | 'returning-visitor';
export type PopupVariant = 'discount' | 'newsletter' | 'free-shipping' | 'new-arrival' | 'limited-time' | 'cart-abandonment';

export interface PopupConfig {
  id: string;
  type: PopupType;
  variant: PopupVariant;
  title: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  ctaUrl?: string;
  discountCode?: string;
  discountAmount?: number;
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  enabled: boolean;
  
  // Timing and triggers
  delay?: number; // milliseconds
  scrollPercentage?: number;
  showOnPages?: string[];
  excludePages?: string[];
  frequency: 'once' | 'session' | 'daily' | 'always';
  
  // Targeting
  newVisitorsOnly?: boolean;
  returningVisitorsOnly?: boolean;
  minTimeOnSite?: number; // seconds
  
  // A/B testing
  testGroup?: 'A' | 'B';
  testWeight?: number; // 0-100
}

interface PromotionalPopupsProps {
  popups: PopupConfig[];
  onEmailSubmit?: (email: string, popup: PopupConfig) => void;
  onPopupAction?: (action: 'shown' | 'clicked' | 'closed', popup: PopupConfig) => void;
}

const PromotionalPopups: React.FC<PromotionalPopupsProps> = ({
  popups,
  onEmailSubmit,
  onPopupAction
}) => {
  const [activePopup, setActivePopup] = useState<PopupConfig | null>(null);
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [hasExitIntent, setHasExitIntent] = useState(false);
  const [timeOnSite, setTimeOnSite] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isNewVisitor, setIsNewVisitor] = useState(true);

  // Check if popup should be shown based on frequency and storage
  const shouldShowPopup = useCallback((popup: PopupConfig): boolean => {
    const storageKey = `popup_${popup.id}`;
    const lastShown = localStorage.getItem(storageKey);
    const now = Date.now();

    switch (popup.frequency) {
      case 'once':
        return !lastShown;
      case 'session':
        return !sessionStorage.getItem(storageKey);
      case 'daily':
        if (!lastShown) return true;
        const daysSince = (now - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
        return daysSince >= 1;
      case 'always':
        return true;
      default:
        return false;
    }
  }, []);

  // Mark popup as shown in storage
  const markPopupShown = useCallback((popup: PopupConfig) => {
    const storageKey = `popup_${popup.id}`;
    const now = Date.now();

    if (popup.frequency === 'session') {
      sessionStorage.setItem(storageKey, now.toString());
    } else {
      localStorage.setItem(storageKey, now.toString());
    }
  }, []);

  // Check visitor status
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    setIsNewVisitor(!hasVisited);
    
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  // Track time on site
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeOnSite(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / totalHeight) * 100;
      setScrollPercentage(Math.min(scrolled, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exit intent detection
  useEffect(() => {
    let exitIntentTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentTriggered) {
        setHasExitIntent(true);
        exitIntentTriggered = true;
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // Find and trigger appropriate popup
  useEffect(() => {
    if (activePopup) return;

    const currentPath = window.location.pathname;
    
    const eligiblePopups = popups.filter(popup => {
      // Basic checks
      if (!popup.enabled) return false;
      if (!shouldShowPopup(popup)) return false;

      // Page targeting
      if (popup.showOnPages && !popup.showOnPages.includes(currentPath)) return false;
      if (popup.excludePages && popup.excludePages.includes(currentPath)) return false;

      // Visitor targeting
      if (popup.newVisitorsOnly && !isNewVisitor) return false;
      if (popup.returningVisitorsOnly && isNewVisitor) return false;

      // Time on site requirement
      if (popup.minTimeOnSite && timeOnSite < popup.minTimeOnSite) return false;

      // Trigger conditions
      switch (popup.type) {
        case 'exit-intent':
          return hasExitIntent;
        case 'time-based':
          return timeOnSite >= (popup.delay || 0) / 1000;
        case 'scroll-based':
          return scrollPercentage >= (popup.scrollPercentage || 50);
        case 'new-visitor':
          return isNewVisitor && timeOnSite >= (popup.delay || 0) / 1000;
        case 'returning-visitor':
          return !isNewVisitor && timeOnSite >= (popup.delay || 0) / 1000;
        default:
          return false;
      }
    });

    if (eligiblePopups.length > 0) {
      // A/B testing and random selection
      const selectedPopup = eligiblePopups[Math.floor(Math.random() * eligiblePopups.length)];
      
      // A/B test check
      if (selectedPopup.testGroup) {
        const testRandom = Math.random() * 100;
        if (testRandom > (selectedPopup.testWeight || 50)) {
          return;
        }
      }

      setActivePopup(selectedPopup);
      setIsVisible(true);
      markPopupShown(selectedPopup);
      onPopupAction?.('shown', selectedPopup);
    }
  }, [
    popups,
    hasExitIntent,
    timeOnSite,
    scrollPercentage,
    isNewVisitor,
    activePopup,
    shouldShowPopup,
    markPopupShown,
    onPopupAction
  ]);

  const handleClose = () => {
    if (activePopup) {
      onPopupAction?.('closed', activePopup);
    }
    setIsVisible(false);
    setTimeout(() => setActivePopup(null), 300);
  };

  const handleAction = () => {
    if (!activePopup) return;

    if (activePopup.variant === 'newsletter' && email) {
      onEmailSubmit?.(email, activePopup);
    }

    onPopupAction?.('clicked', activePopup);

    if (activePopup.ctaUrl) {
      window.location.href = activePopup.ctaUrl;
    }

    handleClose();
  };

  const getPopupIcon = (variant: PopupVariant) => {
    switch (variant) {
      case 'discount':
        return <Percent className="w-8 h-8" />;
      case 'newsletter':
        return <Mail className="w-8 h-8" />;
      case 'free-shipping':
        return <Gift className="w-8 h-8" />;
      case 'new-arrival':
        return <Star className="w-8 h-8" />;
      case 'limited-time':
        return <Clock className="w-8 h-8" />;
      case 'cart-abandonment':
        return <Zap className="w-8 h-8" />;
      default:
        return <Tag className="w-8 h-8" />;
    }
  };

  const getVariantColors = (variant: PopupVariant) => {
    switch (variant) {
      case 'discount':
        return 'from-red-600 to-red-500 text-white';
      case 'newsletter':
        return 'from-blue-600 to-blue-500 text-white';
      case 'free-shipping':
        return 'from-green-600 to-green-500 text-white';
      case 'new-arrival':
        return 'from-purple-600 to-purple-500 text-white';
      case 'limited-time':
        return 'from-yellow-600 to-yellow-500 text-black';
      case 'cart-abandonment':
        return 'from-orange-600 to-orange-500 text-white';
      default:
        return 'from-gray-600 to-gray-500 text-white';
    }
  };

  if (!activePopup || !isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div 
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl z-50 
                   transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 
                   transition-colors rounded-full hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with gradient */}
        <div className={`relative p-8 text-center bg-gradient-to-br ${getVariantColors(activePopup.variant)} rounded-t-2xl`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-t-2xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 
                          bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              {getPopupIcon(activePopup.variant)}
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {activePopup.title}
            </h2>

            {activePopup.subtitle && (
              <p className="text-lg opacity-90">
                {activePopup.subtitle}
              </p>
            )}

            {/* Discount Code Display */}
            {activePopup.discountCode && (
              <div className="mt-4 p-3 bg-white/20 backdrop-blur-sm rounded-lg 
                            border border-white/30 inline-block">
                <div className="text-sm opacity-75 mb-1">Use code:</div>
                <div className="text-xl font-bold tracking-wide">
                  {activePopup.discountCode}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-gray-600 text-center mb-6">
            {activePopup.description}
          </p>

          {/* Newsletter Email Input */}
          {activePopup.variant === 'newsletter' && (
            <div className="mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent text-gray-900"
              />
            </div>
          )}

          {/* Discount Amount Display */}
          {activePopup.discountAmount && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 
                            bg-red-50 text-red-600 rounded-full border border-red-200">
                <Tag className="w-4 h-4" />
                <span className="font-semibold">
                  Save {activePopup.discountAmount}% on your order!
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAction}
              disabled={activePopup.variant === 'newsletter' && !email.trim()}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 
                        bg-gradient-to-r ${getVariantColors(activePopup.variant)} 
                        rounded-lg font-semibold transition-all duration-200 
                        hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]
                        disabled:opacity-50 disabled:cursor-not-allowed 
                        disabled:hover:scale-100 disabled:hover:shadow-none`}
            >
              <span>{activePopup.ctaText}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleClose}
              className="w-full px-6 py-3 text-gray-600 hover:text-gray-800 
                       transition-colors text-sm"
            >
              No thanks, continue shopping
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>5k+ Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        {activePopup.image && (
          <div className="absolute -top-4 -right-4 w-24 h-24 opacity-20">
            <Image
              src={activePopup.image}
              alt="Promotion"
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>
    </>
  );
};

// Example popup configurations
export const DEFAULT_POPUPS: PopupConfig[] = [
  {
    id: 'welcome-discount',
    type: 'time-based',
    variant: 'discount',
    title: 'Welcome to FASHUN!',
    subtitle: '10% OFF Your First Order',
    description: 'Join thousands of fashion enthusiasts and save on your first purchase.',
    ctaText: 'Get My Discount',
    ctaUrl: '/products',
    discountCode: 'WELCOME10',
    discountAmount: 10,
    enabled: true,
    delay: 15000, // 15 seconds
    frequency: 'once',
    newVisitorsOnly: true
  },
  {
    id: 'exit-intent-offer',
    type: 'exit-intent',
    variant: 'discount',
    title: 'Wait! Don\'t Leave Empty Handed',
    subtitle: '15% OFF Everything',
    description: 'Use this exclusive discount before you go. Limited time offer!',
    ctaText: 'Claim Discount',
    ctaUrl: '/products',
    discountCode: 'SAVE15',
    discountAmount: 15,
    enabled: true,
    frequency: 'session',
    excludePages: ['/checkout', '/cart']
  },
  {
    id: 'newsletter-signup',
    type: 'scroll-based',
    variant: 'newsletter',
    title: 'Stay in the Loop',
    subtitle: 'Get Exclusive Deals & New Arrivals',
    description: 'Be the first to know about sales, new collections, and fashion tips.',
    ctaText: 'Subscribe Now',
    enabled: true,
    scrollPercentage: 70,
    frequency: 'once',
    minTimeOnSite: 30
  },
  {
    id: 'free-shipping-reminder',
    type: 'time-based',
    variant: 'free-shipping',
    title: 'Free Shipping Available!',
    subtitle: 'On Orders Over ₹3,000',
    description: 'Add a few more items to your cart and enjoy free shipping.',
    ctaText: 'Continue Shopping',
    ctaUrl: '/products',
    enabled: true,
    delay: 60000, // 1 minute
    frequency: 'session',
    showOnPages: ['/cart']
  },
  {
    id: 'new-collection-announcement',
    type: 'new-visitor',
    variant: 'new-arrival',
    title: 'New Winter Collection',
    subtitle: 'Just Dropped!',
    description: 'Explore our latest streetwear designs perfect for the season.',
    ctaText: 'Shop New Arrivals',
    ctaUrl: '/collections/new',
    enabled: true,
    delay: 10000,
    frequency: 'daily'
  }
];

// Hook for managing popups
export const usePromotionalPopups = () => {
  const [popups, setPopups] = useState<PopupConfig[]>(DEFAULT_POPUPS);

  const addPopup = (popup: PopupConfig) => {
    setPopups(prev => [...prev, popup]);
  };

  const removePopup = (popupId: string) => {
    setPopups(prev => prev.filter(p => p.id !== popupId));
  };

  const updatePopup = (popupId: string, updates: Partial<PopupConfig>) => {
    setPopups(prev => prev.map(p => 
      p.id === popupId ? { ...p, ...updates } : p
    ));
  };

  const enablePopup = (popupId: string) => {
    updatePopup(popupId, { enabled: true });
  };

  const disablePopup = (popupId: string) => {
    updatePopup(popupId, { enabled: false });
  };

  return {
    popups,
    addPopup,
    removePopup,
    updatePopup,
    enablePopup,
    disablePopup
  };
};

export default PromotionalPopups;