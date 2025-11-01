'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { getAllProducts, addToCart, createCart } from '@/lib/shopify/client';
import type { ShopifyProduct } from '@/lib/shopify/types';

export default function ShopifyProductGrid() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
    loadCartId();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts(50);
      setProducts(data?.edges.map((edge: any) => edge.node) || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartId = () => {
    const stored = localStorage.getItem('shopify_cart_id');
    if (stored) setCartId(stored);
  };

  const handleAddToCart = async (variantId: string, productTitle: string) => {
    try {
      setAddingToCart(variantId);
      
      let currentCartId = cartId;
      
      // Create cart if doesn't exist
      if (!currentCartId) {
        const newCart = await createCart([{ merchandiseId: variantId, quantity: 1 }]);
        currentCartId = newCart.id;
        setCartId(currentCartId);
        if (currentCartId) {
          localStorage.setItem('shopify_cart_id', currentCartId);
        }
      } else {
        // Add to existing cart
        await addToCart(currentCartId, [{ merchandiseId: variantId, quantity: 1 }]);
      }

      // Show success message
      alert(`✅ ${productTitle} added to cart!`);
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleAddToWishlist = (product: ShopifyProduct) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist.push({
      id: product.id,
      title: product.title,
      image: product.featuredImage.url,
      price: product.priceRange.minVariantPrice.amount,
      handle: product.handle,
    });
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert(`❤️ ${product.title} added to wishlist!`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-primary-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 animate-pulse"
          >
            <div className="aspect-square bg-primary-800/50" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-primary-800/50 rounded" />
              <div className="h-6 bg-primary-800/50 rounded w-2/3" />
              <div className="h-4 bg-primary-800/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => {
        const mainVariant = product.variants.edges[0]?.node;
        const price = parseFloat(product.priceRange.minVariantPrice.amount);
        const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
          ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
          : null;
        const discount = compareAtPrice
          ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
          : 0;

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-primary-900/75 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-accent-purple/50 transition-all duration-300"
          >
            {/* Product Image */}
            <Link href={`/products/${product.handle}`}>
              <div className="relative aspect-square overflow-hidden bg-primary-800/30">
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-accent-purple to-accent-pink px-3 py-1 rounded-full text-xs font-bold">
                    {discount}% OFF
                  </div>
                )}

                {/* Stock Badge */}
                {mainVariant && mainVariant.quantityAvailable !== undefined && mainVariant.quantityAvailable < 5 && (
                  <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                    {mainVariant.quantityAvailable === 0 ? 'SOLD OUT' : `Only ${mainVariant.quantityAvailable} left`}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToWishlist(product);
                    }}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                  </motion.button>
                  <Link href={`/products/${product.handle}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-4 space-y-2">
              {/* Vendor */}
              <p className="text-xs text-white/50 uppercase tracking-wider">
                {product.vendor}
              </p>

              {/* Title */}
              <Link href={`/products/${product.handle}`}>
                <h3 className="font-heading font-bold text-lg line-clamp-2 hover:text-accent-purple transition-colors">
                  {product.title}
                </h3>
              </Link>

              {/* Price */}
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
                  ₹{price.toLocaleString()}
                </p>
                {compareAtPrice && (
                  <p className="text-sm text-white/40 line-through">
                    ₹{compareAtPrice.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-white/5 rounded-full text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => mainVariant && handleAddToCart(mainVariant.id, product.title)}
                disabled={!mainVariant?.availableForSale || addingToCart === mainVariant?.id}
                className="w-full py-3 mt-3 bg-gradient-to-r from-accent-purple to-accent-pink rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart === mainVariant?.id ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : !mainVariant?.availableForSale ? (
                  'Sold Out'
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
