'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
}

export default function AIRecommendations({ currentProductId }: { currentProductId?: string }) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [currentProductId]);

  async function loadRecommendations() {
    // Simulate AI recommendations
    const mockProducts: Product[] = [
      { id: '1', title: 'Oversized Hoodie', price: 2499, image: '/products/hoodie.jpg' },
      { id: '2', title: 'Graphic Tee', price: 1299, image: '/products/tee.jpg' },
      { id: '3', title: 'Cargo Pants', price: 3499, image: '/products/pants.jpg' },
      { id: '4', title: 'Snapback Cap', price: 899, image: '/products/cap.jpg' },
    ];
    
    setTimeout(() => {
      setRecommendations(mockProducts);
      setLoading(false);
    }, 500);
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse flex space-x-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-800 h-64 w-48 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🤖</span>
        <h2 className="text-2xl font-bold">AI Recommended For You</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map(product => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-purple-500 transition group"
          >
            <div className="aspect-square bg-gray-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-2 line-clamp-1">{product.title}</h3>
              <p className="text-purple-400 font-bold">₹{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
