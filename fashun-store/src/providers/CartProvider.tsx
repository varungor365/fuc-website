'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MedusaCartService } from '@/services/medusa/cart.service';
import { Cart } from '@medusajs/medusa';

type MedusaCart = Cart; // Using the Cart type directly from @medusajs/medusa

interface CartContextType {
  cart: MedusaCart | null;
  loading: boolean;
  error: string | null;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCart = async () => {
      try {
        setLoading(true);
        const fetchedCart = await MedusaCartService.getOrCreateCart();
        setCart(fetchedCart as MedusaCart);
      } catch (err) {
        setError('Failed to load cart.');
        console.error('Cart initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    initializeCart();
  }, []);

  const updateCart = async (action: () => Promise<MedusaCart>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await action();
      setCart(updatedCart as MedusaCart);
    } catch (err) {
      setError('Failed to update cart.');
      console.error('Cart update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (variantId: string, quantity: number) => {
    if (!cart) {
      setError('Cart not initialized.');
      return;
    }
    await updateCart(() => MedusaCartService.addItem(cart.id, variantId, quantity));
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) {
      setError('Cart not initialized.');
      return;
    }
    await updateCart(() => MedusaCartService.updateItem(cart.id, lineId, quantity));
  };

  const removeItem = async (lineId: string) => {
    if (!cart) {
      setError('Cart not initialized.');
      return;
    }
    await updateCart(() => MedusaCartService.removeItem(cart.id, lineId));
  };

  const clearCart = async () => {
    // This functionality might need to be implemented in MedusaCartService if not available
    // For now, we'll just clear the local state and create a new cart
    localStorage.removeItem('cart_id');
    setCart(null);
    setLoading(true);
    setError(null);
    try {
      const newCart = await MedusaCartService.createCart();
      setCart(newCart as MedusaCart);
    } catch (err) {
      setError('Failed to clear cart and create a new one.');
      console.error('Clear cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, error, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
