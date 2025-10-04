'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  maxQuantity?: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Premium Streetwear Hoodie',
      price: 129.99,
      image: '/images/products/hoodies/hoodie-1.jpg',
      size: 'M',
      color: 'Black',
      quantity: 1,
      maxQuantity: 5
    },
    {
      id: '2',
      name: 'Limited Edition T-Shirt',
      price: 59.99,
      image: '/images/products/tshirts/tshirt-1.jpg',
      size: 'L',
      color: 'White',
      quantity: 2,
      maxQuantity: 3
    }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const maxQty = item.maxQuantity || 10;
        return {
          ...item,
          quantity: Math.min(newQuantity, maxQty)
        };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary-400" />
                <h2 className="text-xl font-semibold text-white">
                  Shopping Cart ({itemCount})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-400 mb-6">Add some items to get started</p>
                  <button
                    onClick={onClose}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 300 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm leading-tight mb-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>• Color: {item.color}</span>}
                          </div>
                          <div className="text-primary-400 font-semibold">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4 text-gray-400" />
                          </button>
                          <span className="w-8 text-center text-white font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.maxQuantity || 10)}
                            className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                        <div className="font-semibold text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-white/10 p-6 bg-gray-900/50 backdrop-blur-sm">
                {/* Order Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-primary-400 text-lg">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Free shipping notice */}
                {shipping > 0 && (
                  <div className="bg-primary-600/20 border border-primary-500/30 rounded-lg p-3 mb-4">
                    <p className="text-sm text-primary-300">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <button
                    onClick={onClose}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-colors border border-white/20"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
