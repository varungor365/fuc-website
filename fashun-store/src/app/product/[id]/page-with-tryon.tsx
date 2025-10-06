'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TryOnButton from '@/components/product/TryOnButton';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  variants: Array<{
    id: string;
    title: string;
    options: Array<{ value: string }>;
  }>;
}

export default function ProductPageWithTryOn({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedSize, setSelectedSize] = useState('M');

  useEffect(() => {
    // Fetch product data
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(console.error);
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full rounded-2xl shadow-2xl"
            />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="text-2xl text-purple-400">${product.price}</p>
            <p className="text-gray-300">{product.description}</p>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex gap-3">
                {['black', 'white', 'gray', 'navy', 'red'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 ${
                      selectedColor === color ? 'border-purple-500 scale-110' : 'border-gray-600'
                    } transition-all`}
                    style={{ backgroundColor: color === 'black' ? '#000' : color }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex gap-3">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 ${
                      selectedSize === size
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    } transition-all`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Try On Button */}
            <div className="pt-4">
              <TryOnButton
                productId={product.id}
                productColor={selectedColor}
                productName={product.title}
              />
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-white text-black py-4 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300">
              Add to Cart
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
