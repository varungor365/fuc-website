import { useState, useEffect } from 'react';
import { MedusaCartService } from '@/services/medusa';

export const useMedusaCart = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cart = await MedusaCartService.getOrCreateCart();
      setCart(cart);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (variantId: string, quantity: number = 1) => {
    if (!cart) return;
    try {
      const updatedCart = await MedusaCartService.addItem(cart.id, variantId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) return;
    try {
      const updatedCart = await MedusaCartService.updateItem(cart.id, lineId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error;
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cart) return;
    try {
      const updatedCart = await MedusaCartService.removeItem(cart.id, lineId);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    }
  };

  const totalItems = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
  const subtotal = cart?.subtotal || 0;
  const total = cart?.total || 0;

  return {
    cart,
    loading,
    addItem,
    updateItem,
    removeItem,
    totalItems,
    subtotal,
    total,
    refresh: loadCart
  };
};
