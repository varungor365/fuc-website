'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

interface InstagramFeedProps {
  accessToken?: string;
  limit?: number;
  className?: string;
}

const InstagramFeed = ({ accessToken, limit = 9, className = '' }: InstagramFeedProps) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      fetchInstagramPosts();
    } else {
      // Use mock data for demo
      setMockPosts();
    }
  }, [accessToken, limit]);

  const fetchInstagramPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/instagram?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Instagram posts');
      }
      
      const data = await response.json();
      setPosts(data.data || []);
    } catch (err) {
      console.error('Error fetching Instagram posts:', err);
      setError('Failed to load Instagram posts');
      setMockPosts(); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const setMockPosts = () => {
    // Mock Instagram posts for demo
    const mockPosts: InstagramPost[] = [
      {
        id: '1',
        media_type: 'IMAGE',
        media_url: 'https://source.unsplash.com/400x400/?fashion,streetwear,hoodie',
        permalink: '#',
        caption: 'New streetwear collection dropping soon! 🔥 #FashUn #Streetwear',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        media_type: 'IMAGE',
        media_url: 'https://source.unsplash.com/400x400/?fashion,tshirt,style',
        permalink: '#',
        caption: 'Premium quality tees that speak your language ✨ #Fashion #Style',
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        media_type: 'IMAGE',
        media_url: 'https://source.unsplash.com/400x400/?fashion,jacket,urban',
        permalink: '#',
        caption: 'Urban vibes with our latest jacket collection 🧥 #Urban #Fashion',
        timestamp: new Date().toISOString()
      },
      {
        id: '4',
        media_type: 'IMAGE',
        media_url: 'https://source.unsplash.com/400x400/?fashion,jeans,denim',
        permalink: '#',
        caption: 'Perfect fit, premium denim. What more do you need? 👖 #Denim #Style',
        timestamp: new Date().toISOString()
      },
      {
        id: '5',
        media_type: 'IMAGE',
        media_url: 'https://source.unsplash.com/400x400/?fashion,accessories,style',
        permalink: '#',
        caption: 'Complete your look with our accessories collection 🎒 #Accessories',
        timestamp: new Date().toISOString()
      },
      {
        id: '6',
        media_type: 'IMAGE',
        media_url: 'https://source.unsplash.com/400x400/?fashion,shoes,sneakers',
        permalink: '#',
        caption: 'Step up your game with premium footwear 👟 #Shoes #Sneakers',
        timestamp: new Date().toISOString()
      }
    ];
    setPosts(mockPosts.slice(0, limit));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">Unable to load Instagram posts</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="group relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <img
            src={post.media_url}
            alt={post.caption || 'Instagram post'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = `https://source.unsplash.com/400x400/?fashion,style,${index}`;
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <p className="text-sm line-clamp-3 mb-2">
                {post.caption?.substring(0, 100)}...
              </p>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                View on Instagram
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InstagramFeed;