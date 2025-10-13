'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';

export default function CartTest() {
  const { items, itemCount, totalPrice, addItem, clearCart } = useCart();

  const testProduct = {
    id: 'test-product-1',
    name: 'Test T-Shirt',
    price: 999,
    image: '/api/placeholder/200/250',
    size: 'M',
    color: 'Black'
  };

  const handleAddToCart = () => {
    addItem(testProduct);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Cart Test</h2>
      
      <div className="mb-4">
        <p>Items in cart: {itemCount}</p>
        <p>Total price: ₹{totalPrice.toFixed(2)}</p>
      </div>

      <div className="space-y-2 mb-4">
        {items.map((item, index) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="p-2 bg-gray-100 rounded">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600">{item.size} • {item.color}</p>
            <p className="text-sm">Qty: {item.quantity} • ₹{item.price}</p>
          </div>
        ))}
      </div>

      <div className="space-x-2">
        <button
          onClick={handleAddToCart}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Test Product
        </button>
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}