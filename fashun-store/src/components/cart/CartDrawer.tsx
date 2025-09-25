'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBagIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  HeartIcon,
  GiftIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { trackAddToCart, trackRemoveFromCart, trackEvent } from '@/lib/analytics';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  category: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onMoveToWishlist: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState<Record<string, boolean>>({});

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedPromo === 'WELCOME10' ? subtotal * 0.1 : 0;
  const shipping = subtotal > 2999 ? 0 : 199;
  const total = subtotal - discount + shipping;

  const handleApplyPromo = () => {
    if (promoCode === 'WELCOME10') {
      setAppliedPromo(promoCode);
    } else {
      alert('Invalid promo code');
    }
  };

  const toggleWishlist = (itemId: string) => {
    setIsWishlisted(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-primary-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <ShoppingBagIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
                  <p className="text-gray-400 text-sm">{items.length} items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                /* Empty Cart */
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-400 mb-6">Add some amazing streetwear to get started!</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                      >
                        <div className="flex space-x-4">
                          {/* Product Image */}
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/10">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{item.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-gray-400">Size: {item.size}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-sm text-gray-400">Color: {item.color}</span>
                            </div>
                            
                            {/* Price */}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="font-semibold text-white">{formatPrice(item.price)}</span>
                              {item.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(item.originalPrice)}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                >
                                  <MinusIcon className="w-4 h-4 text-white" />
                                </button>
                                <span className="font-medium text-white w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                >
                                  <PlusIcon className="w-4 h-4 text-white" />
                                </button>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleWishlist(item.id)}
                                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                >
                                  {isWishlisted[item.id] ? (
                                    <HeartSolidIcon className="w-4 h-4 text-red-500" />
                                  ) : (
                                    <HeartIcon className="w-4 h-4 text-white" />
                                  )}
                                </button>
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/20 transition-colors group"
                                >
                                  <XMarkIcon className="w-4 h-4 text-white group-hover:text-red-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Promo Code */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-3">
                      <GiftIcon className="w-5 h-5 text-purple-400" />
                      <span className="font-medium text-white">Promo Code</span>
                    </div>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-green-500/20 rounded-xl p-3">
                        <span className="text-green-400 font-medium">{appliedPromo} Applied!</span>
                        <button
                          onClick={() => setAppliedPromo(null)}
                          className="text-green-400 hover:text-green-300"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter promo code"
                          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-400">
                          <span>Discount</span>
                          <span>-{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-300">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex justify-between text-white font-semibold text-lg">
                          <span>Total</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TruckIcon className="w-5 h-5 text-green-400" />
                      </div>
                      <p className="text-xs text-gray-400">Free shipping on orders over ₹2,999</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-xs text-gray-400">Secure payment & 30-day returns</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <SparklesIcon className="w-5 h-5 text-purple-400" />
                      </div>
                      <p className="text-xs text-gray-400">Premium quality guaranteed</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Checkout Button */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl py-4 font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <CreditCardIcon className="w-5 h-5" />
                  <span>Proceed to Checkout • {formatPrice(total)}</span>
                </Link>
                <p className="text-center text-gray-400 text-xs mt-3">
                  Secure checkout with 256-bit SSL encryption
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;