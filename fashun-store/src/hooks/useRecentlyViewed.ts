import { useState, useEffect } from 'react';

const MAX_ITEMS = 10;

export const useRecentlyViewed = () => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recently_viewed');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const addItem = (productId: string) => {
    const updated = [productId, ...items.filter(id => id !== productId)].slice(0, MAX_ITEMS);
    setItems(updated);
    localStorage.setItem('recently_viewed', JSON.stringify(updated));
  };

  const clearAll = () => {
    setItems([]);
    localStorage.removeItem('recently_viewed');
  };

  return { items, addItem, clearAll };
};
