'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ShoppingBag } from 'lucide-react';

export default function UGCGallery() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    loadInstagramPosts();
  }, []);

  const loadInstagramPosts = async () => {
    const response = await fetch('/api/instagram/tagged-posts');
    const data = await response.json();
    setPosts(data.posts || []);
  };

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Instagram className="w-8 h-8 text-pink-600 mr-2" />
          <h2 className="text-3xl font-bold">Shop Our Instagram</h2>
        </div>
        <p className="text-gray-600">Tag #FASHUNCO to be featured</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-square rounded-lg overflow-hidden"
          >
            <img src={post.image_url} alt={post.caption} className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition">
              <div className="absolute bottom-4 left-4 right-4">
                {post.tagged_products?.map((product: any) => (
                  <button
                    key={product.id}
                    onClick={() => window.location.href = `/products/${product.id}`}
                    className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-full text-xs"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    Shop
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
