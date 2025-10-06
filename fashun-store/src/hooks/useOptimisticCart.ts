import { useState, useTransition } from 'react';
import { useMedusaCart } from './useMedusaCart';

export const useOptimisticCart = () => {
  const { cart, addItem: serverAddItem, updateItem: serverUpdateItem, removeItem: serverRemoveItem } = useMedusaCart();
  const [optimisticCart, setOptimisticCart] = useState(cart);
  const [isPending, startTransition] = useTransition();

  const addItem = async (variantId: string, quantity: number = 1) => {
    const tempItem = {
      id: `temp-${Date.now()}`,
      variant_id: variantId,
      quantity,
      title: 'Adding...',
    };

    setOptimisticCart(prev => ({
      ...prev,
      items: [...(prev?.items || []), tempItem]
    }));

    startTransition(async () => {
      await serverAddItem(variantId, quantity);
    });
  };

  const updateItem = async (lineId: string, quantity: number) => {
    setOptimisticCart(prev => ({
      ...prev,
      items: prev?.items?.map(item => 
        item.id === lineId ? { ...item, quantity } : item
      )
    }));

    startTransition(async () => {
      await serverUpdateItem(lineId, quantity);
    });
  };

  const removeItem = async (lineId: string) => {
    setOptimisticCart(prev => ({
      ...prev,
      items: prev?.items?.filter(item => item.id !== lineId)
    }));

    startTransition(async () => {
      await serverRemoveItem(lineId);
    });
  };

  return {
    cart: optimisticCart || cart,
    addItem,
    updateItem,
    removeItem,
    isPending
  };
};
