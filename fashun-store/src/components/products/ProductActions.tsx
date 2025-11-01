'use client';

import { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductActionsProps {
  product: {
    id: string;
    title: string;
    variants?: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          priceV2: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
        };
      }>;
    };
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.edges[0]?.node.id || ''
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    try {
      // Get or create cart
      let cartId = localStorage.getItem('cartId');
      
      if (!cartId) {
        // Create new cart
        const response = await fetch('/api/shopify/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            lines: [{ merchandiseId: selectedVariant, quantity: 1 }] 
          }),
        });
        const data = await response.json();
        cartId = data.cart?.id || '';
        if (cartId) {
          localStorage.setItem('cartId', cartId);
        }
      } else {
        // Add to existing cart
        await fetch('/api/shopify/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartId,
            lines: [{ merchandiseId: selectedVariant, quantity: 1 }],
          }),
        });
      }

      // Show success message (you can add a toast notification here)
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isWishlisted) {
      // Remove from wishlist
      const filtered = wishlist.filter((id: string) => id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(filtered));
      setIsWishlisted(false);
    } else {
      // Add to wishlist
      wishlist.push(product.id);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
    }
  };

  const variant = product.variants?.edges.find(
    (v) => v.node.id === selectedVariant
  )?.node;

  return (
    <div className="space-y-4">
      {/* Variant Selection */}
      {product.variants && product.variants.edges.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Select Variant
          </label>
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
          >
            {product.variants.edges.map((variant) => (
              <option
                key={variant.node.id}
                value={variant.node.id}
                disabled={!variant.node.availableForSale}
                className="bg-gray-900"
              >
                {variant.node.title} - ₹
                {parseFloat(variant.node.priceV2.amount).toFixed(2)}
                {!variant.node.availableForSale && ' (Out of Stock)'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price */}
      {variant && (
        <div className="text-3xl font-bold text-white">
          ₹{parseFloat(variant.priceV2.amount).toFixed(2)}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={!variant?.availableForSale || isAddingToCart}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleWishlist}
          className={`px-4 py-3 rounded-lg border-2 transition-colors ${
            isWishlisted
              ? 'bg-pink-600 border-pink-600 text-white'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Availability */}
      <div className="text-sm text-white/70">
        {variant?.availableForSale ? (
          <span className="text-green-400">✓ In Stock</span>
        ) : (
          <span className="text-red-400">Out of Stock</span>
        )}
      </div>
    </div>
  );
}
