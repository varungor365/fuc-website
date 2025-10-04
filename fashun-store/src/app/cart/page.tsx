'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { TrashIcon, HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

// Mock cart data
const mockCartItems = [
  {
    id: 1,
    name: 'Oversized Black Hoodie',
    price: 2999,
    originalPrice: 3999,
    image: '/images/products/hoodies/hoodie-1-main.jpg',
    color: 'Black',
    size: 'L',
    quantity: 2,
    inStock: true
  },
  {
    id: 2,
    name: 'Graphic Print Tee',
    price: 1499,
    originalPrice: 1999,
    image: '/images/products/t-shirts/tshirt-1-main.jpg',
    color: 'White',
    size: 'M',
    quantity: 1,
    inStock: true
  },
  {
    id: 3,
    name: 'Premium Cotton Polo',
    price: 2299,
    originalPrice: 2799,
    image: '/images/products/t-shirts/tshirt-2-main.jpg',
    color: 'Navy',
    size: 'L',
    quantity: 1,
    inStock: false
  }
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const moveToWishlist = (id: number) => {
    // Move to wishlist logic
    removeItem(id)
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'fuc10') {
      setPromoApplied(true)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const savings = cartItems.reduce((sum, item) => 
    sum + ((item.originalPrice - item.price) * item.quantity), 0
  )
  const discount = promoApplied ? subtotal * 0.1 : 0
  const shipping = subtotal >= 2000 ? 0 : 200
  const total = subtotal - discount + shipping

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-primary-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-primary-300 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
            <Link 
              href="/collections/all"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-black py-3 px-8 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-primary-300">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-primary-900 rounded-lg p-6"
              >
                <div className="flex gap-6">
                  
                  {/* Product Image */}
                  <div className="relative w-24 h-32 bg-primary-800 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-xs text-red-400 font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-primary-300 text-sm">
                          Color: {item.color} • Size: {item.size}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveToWishlist(item.id)}
                          className="p-2 text-primary-400 hover:text-white transition-colors"
                          title="Move to Wishlist"
                        >
                          <HeartIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-primary-400 hover:text-red-400 transition-colors"
                          title="Remove Item"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-white">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-primary-400 line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={!item.inStock}
                          className="w-8 h-8 border border-primary-600 rounded-lg flex items-center justify-center hover:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={!item.inStock}
                          className="w-8 h-8 border border-primary-600 rounded-lg flex items-center justify-center hover:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {!item.inStock && (
                      <div className="mt-3 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                        <p className="text-red-400 text-sm">
                          This item is currently out of stock. You can keep it in your cart or remove it.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Continue Shopping */}
            <div className="pt-6">
              <Link 
                href="/collections/all"
                className="text-accent-400 hover:text-accent-300 font-semibold inline-flex items-center"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-primary-900 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 bg-primary-800 border border-primary-700 rounded-lg px-3 py-2 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={promoApplied}
                    className="px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:bg-primary-700 disabled:text-primary-400 text-black font-semibold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-400 text-sm mt-2">Promo code applied successfully!</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-primary-200">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>You Save</span>
                    <span>-₹{savings.toLocaleString()}</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Promo Discount (10%)</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-primary-200">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                
                {shipping === 0 && (
                  <p className="text-green-400 text-sm">
                    🎉 You qualify for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-primary-700 pt-4 mb-6">
                <div className="flex justify-between text-xl font-semibold text-white">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-accent-500 hover:bg-accent-600 text-black py-4 px-6 rounded-lg font-semibold text-center block transition-colors"
              >
                Proceed to Checkout
              </Link>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <p className="text-primary-400 text-sm mb-2">Secure Checkout</p>
                <div className="flex items-center justify-center space-x-4 text-primary-300">
                  <span className="text-xs">🔒 SSL Encrypted</span>
                  <span className="text-xs">💳 Safe Payment</span>
                </div>
              </div>

              {/* Free Shipping Threshold */}
              {shipping > 0 && (
                <div className="mt-6 p-4 bg-primary-800 rounded-lg">
                  <p className="text-primary-300 text-sm text-center">
                    Add ₹{(2000 - subtotal).toLocaleString()} more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-square bg-primary-900 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={`/images/products/${i % 2 === 0 ? 'hoodies/hoodie-1-main.jpg' : 't-shirts/tshirt-1-main.jpg'}`}
                    alt={`Recommended Product ${i}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-white group-hover:text-accent-400 transition-colors">
                  Recommended Product {i}
                </h3>
                <p className="text-accent-400 font-bold">₹{(1999 + i * 500).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
