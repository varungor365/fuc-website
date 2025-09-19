'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBagIcon,
  TrashIcon,
  HeartIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  TruckIcon,
  GiftIcon,
  SparklesIcon,
  TagIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  color: string;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  inStock: boolean;
  maxQuantity: number;
  category: string;
  brand: string;
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: React.ReactNode;
}

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
  description: string;
}

interface PremiumShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onMoveToWishlist: (itemId: string) => void;
}

const PremiumShoppingCart: React.FC<PremiumShoppingCartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist
}) => {
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const shippingOptions: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: 'Free delivery',
      price: 0,
      estimatedDays: '3-5 business days',
      icon: <TruckIcon className="w-5 h-5" />
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Faster delivery',
      price: 299,
      estimatedDays: '1-2 business days',
      icon: <TruckIcon className="w-5 h-5 text-orange-500" />
    },
    {
      id: 'same-day',
      name: 'Same Day Delivery',
      description: 'Available in select cities',
      price: 599,
      estimatedDays: 'Today before 9 PM',
      icon: <TruckIcon className="w-5 h-5 text-green-500" />
    }
  ];

  const availablePromoCodes: PromoCode[] = [
    {
      code: 'WELCOME10',
      discount: 10,
      type: 'percentage',
      minAmount: 1999,
      description: '10% off on orders above ₹1999'
    },
    {
      code: 'FLAT500',
      discount: 500,
      type: 'fixed',
      minAmount: 2999,
      description: '₹500 off on orders above ₹2999'
    },
    {
      code: 'FIRSTORDER',
      discount: 15,
      type: 'percentage',
      minAmount: 1499,
      description: '15% off on your first order'
    }
  ];

  const recommendedItems = [
    {
      id: 'rec-1',
      name: 'Matching Accessory',
      image: '/api/placeholder/80/80',
      price: 899,
      originalPrice: 1299,
      category: 'accessories'
    },
    {
      id: 'rec-2',
      name: 'Complementary Piece',
      image: '/api/placeholder/80/80',
      price: 1499,
      category: 'clothing'
    }
  ];

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping);
  const shippingCost = selectedShippingOption?.price || 0;
  
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discount = (subtotal * appliedPromo.discount) / 100;
    } else {
      discount = appliedPromo.discount;
    }
  }
  
  const total = subtotal + shippingCost - discount;
  const savings = items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);

  const applyPromoCode = () => {
    const promo = availablePromoCodes.find(p => p.code === promoCode.toUpperCase());
    if (promo && subtotal >= promo.minAmount) {
      setAppliedPromo(promo);
      setPromoCode('');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      // Navigate to checkout page
    }, 2000);
  };

  const CartItemComponent: React.FC<{ item: CartItem; index: number }> = ({ item, index }) => (
    <motion.div
      className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      layout
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {!item.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-neutral-900 text-sm line-clamp-2">
              {item.name}
            </h3>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-1 hover:bg-neutral-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XMarkIcon className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-neutral-600 mb-2">
            <span>{item.color}</span>
            <span>•</span>
            <span>Size {item.size}</span>
            <span>•</span>
            <span>{item.brand}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900">
                ₹{item.price.toLocaleString()}
              </span>
              {item.originalPrice && (
                <span className="text-xs text-neutral-500 line-through">
                  ₹{item.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                disabled={item.quantity <= 1}
                className="w-8 h-8 border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MinusIcon className="w-3 h-3" />
              </button>
              
              <span className="w-8 text-center text-sm font-medium">
                {item.quantity}
              </span>
              
              <button
                onClick={() => onUpdateQuantity(item.id, Math.min(item.maxQuantity, item.quantity + 1))}
                disabled={item.quantity >= item.maxQuantity}
                className="w-8 h-8 border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onMoveToWishlist(item.id)}
              className="flex items-center gap-1 text-xs text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <HeartIcon className="w-3 h-3" />
              Save for later
            </button>
            
            <button className="flex items-center gap-1 text-xs text-neutral-600 hover:text-primary-600 transition-colors">
              <SparklesIcon className="w-3 h-3" />
              Find similar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
              <ShoppingBagIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Shopping Cart</h2>
              <p className="text-sm text-neutral-600">{items.length} items</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 hover:bg-neutral-100 rounded-full flex items-center justify-center transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-neutral-600" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Cart Items */}
          <div className="flex-1 p-6 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBagIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Your cart is empty</h3>
                <p className="text-neutral-600 mb-6">Start shopping and add items to your cart</p>
                <button
                  onClick={onClose}
                  className="btn btn-primary"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <CartItemComponent key={item.id} item={item} index={index} />
                  ))}
                </AnimatePresence>

                {/* Recommendations */}
                {showRecommendations && recommendedItems.length > 0 && (
                  <motion.div
                    className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-neutral-900">Complete the look</h3>
                      <button
                        onClick={() => setShowRecommendations(false)}
                        className="text-sm text-neutral-600 hover:text-neutral-900"
                      >
                        Dismiss
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {recommendedItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-semibold">₹{item.price}</span>
                                {item.originalPrice && (
                                  <span className="text-xs text-neutral-500 line-through">
                                    ₹{item.originalPrice}
                                  </span>
                                )}
                              </div>
                              <button className="btn btn-sm btn-primary mt-2">
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="w-96 bg-neutral-50 p-6 border-l border-neutral-100 overflow-y-auto">
              <h3 className="font-semibold text-neutral-900 mb-4">Order Summary</h3>
              
              {/* Shipping Options */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-neutral-700">Shipping Options</h4>
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      selectedShipping === option.id
                        ? 'bg-primary-50 border border-primary-200'
                        : 'bg-white border border-neutral-200 hover:border-primary-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={selectedShipping === option.id}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-shrink-0">{option.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{option.name}</div>
                      <div className="text-xs text-neutral-600">{option.estimatedDays}</div>
                    </div>
                    <div className="font-semibold">
                      {option.price === 0 ? 'Free' : `₹${option.price}`}
                    </div>
                  </label>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <h4 className="font-medium text-neutral-700 mb-3">Promo Code</h4>
                {appliedPromo ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-green-700">{appliedPromo.code}</div>
                        <div className="text-xs text-green-600">{appliedPromo.description}</div>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-green-600 hover:text-green-700"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={!promoCode}
                      className="btn btn-secondary disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? 'Free' : `₹${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                
                {discount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                
                {savings > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>You saved</span>
                    <span className="font-medium">₹{savings.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                  <span className="font-semibold text-neutral-900">Total</span>
                  <span className="font-bold text-xl text-neutral-900">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                onClick={handleCheckout}
                disabled={isCheckingOut || items.some(item => !item.inStock)}
                className="w-full btn btn-primary btn-lg disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Proceed to Checkout
                    <ArrowRightIcon className="w-5 h-5" />
                  </div>
                )}
              </motion.button>

              {/* Security Badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-neutral-500">
                <div className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  Secure Checkout
                </div>
                <div className="flex items-center gap-1">
                  <TruckIcon className="w-4 h-4 text-blue-500" />
                  Free Returns
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PremiumShoppingCart;