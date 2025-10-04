'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useCart, CartItem } from '@/hooks/useCart'

// Re-export the hook's CartItem type for compatibility
export type { CartItem } from '@/hooks/useCart'

interface CartMetadata {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  itemCount: number
  discountCode?: string
  estimatedDelivery?: Date
  lastUpdated: Date
}

interface CartContextType {
  // Cart state
  items: CartItem[]
  metadata: CartMetadata
  isLoading: boolean
  
  // Cart actions (compatible with existing hook)
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  
  // Extended functionality
  applyDiscount: (code: string) => Promise<boolean>
  removeDiscount: () => void
  getCartRecommendations: () => CartItem[]
  trackAbandonmentTime: () => void
  getAbandonmentDuration: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [discountCode, setDiscountCode] = useState<string>()
  const [abandonmentStartTime, setAbandonmentStartTime] = useState<Date | null>(null)
  const [cartRecommendations, setCartRecommendations] = useState<CartItem[]>([])

  // Calculate cart metadata
  const calculateMetadata = (): CartMetadata => {
    const subtotal = cart.totalPrice
    const itemCount = cart.itemCount
    
    // Calculate tax (18% GST)
    const tax = subtotal * 0.18
    
    // Calculate shipping (free over ₹999)
    const shipping = subtotal >= 999 ? 0 : 99
    
    // Apply discount if any
    let discount = 0
    if (discountCode) {
      // Mock discount calculation - 10% for WELCOME10
      if (discountCode === 'WELCOME10') {
        discount = subtotal * 0.1
      } else if (discountCode === 'SAVE20') {
        discount = subtotal * 0.2
      }
    }
    
    const total = subtotal + tax + shipping - discount
    
    // Estimate delivery (3-5 business days)
    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4)
    
    return {
      subtotal,
      tax,
      shipping,
      discount,
      total,
      itemCount,
      discountCode,
      estimatedDelivery,
      lastUpdated: new Date()
    }
  }

  const [metadata, setMetadata] = useState<CartMetadata>(calculateMetadata())

  // Update metadata when cart changes
  useEffect(() => {
    setMetadata(calculateMetadata())
  }, [cart.items, cart.totalPrice, cart.itemCount, discountCode])

  // Track cart abandonment
  useEffect(() => {
    if (cart.items.length > 0 && !abandonmentStartTime) {
      setAbandonmentStartTime(new Date())
    } else if (cart.items.length === 0) {
      setAbandonmentStartTime(null)
    }
  }, [cart.items.length])

  // Update recommendations when cart changes
  useEffect(() => {
    updateCartRecommendations()
  }, [cart.items])

  const applyDiscount = async (code: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Mock discount validation
      const validCodes = ['WELCOME10', 'SAVE20', 'STUDENT15']
      
      if (validCodes.includes(code)) {
        setDiscountCode(code)
        return true
      } else {
        throw new Error('Invalid discount code')
      }
    } catch (error) {
      console.error('Failed to apply discount:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeDiscount = (): void => {
    setDiscountCode(undefined)
  }

  const updateCartRecommendations = () => {
    // Mock AI recommendations based on cart items
    if (cart.items.length === 0) {
      setCartRecommendations([])
      return
    }

    // Generate recommendations based on cart contents
    const mockRecommendations: CartItem[] = [
      {
        id: '101',
        name: 'Matching Joggers',
        price: 1999,
        quantity: 1,
        size: 'M',
        color: 'Black',
        image: '/api/placeholder/200/250'
      },
      {
        id: '102', 
        name: 'Classic Sneakers',
        price: 3999,
        quantity: 1,
        size: '42',
        color: 'White',
        image: '/api/placeholder/200/250'
      },
      {
        id: '103',
        name: 'Baseball Cap',
        price: 899,
        quantity: 1,
        size: 'OS',
        color: 'Black',
        image: '/api/placeholder/200/250'
      }
    ]

    setCartRecommendations(mockRecommendations)
  }

  const getCartRecommendations = (): CartItem[] => {
    return cartRecommendations
  }

  const trackAbandonmentTime = () => {
    if (cart.items.length > 0) {
      setAbandonmentStartTime(new Date())
    }
  }

  const getAbandonmentDuration = (): number => {
    if (!abandonmentStartTime) return 0
    return Math.floor((Date.now() - abandonmentStartTime.getTime()) / 1000 / 60) // minutes
  }

  const contextValue: CartContextType = {
    items: cart.items,
    metadata,
    isLoading,
    addItem: cart.addItem,
    removeItem: cart.removeItem,
    updateQuantity: cart.updateQuantity,
    clearCart: cart.clearCart,
    toggleCart: cart.toggleCart,
    applyDiscount,
    removeDiscount,
    getCartRecommendations,
    trackAbandonmentTime,
    getAbandonmentDuration
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}

// Re-export useCart for backward compatibility
export { useCart }
