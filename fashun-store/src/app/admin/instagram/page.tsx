'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, RefreshCw, Settings, Eye, Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';

interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export default function InstagramAdminPage() {
  const [accessToken, setAccessToken] = useState('');
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedToken, setSavedToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('instagram_access_token');
    if (token) {
      setSavedToken(token);
      setAccessToken(token);
    }
  }, []);

  const saveToken = () => {
    localStorage.setItem('instagram_access_token', accessToken);
    setSavedToken(accessToken);
    alert('Instagram Access Token saved!');
  };

  const fetchPosts = async () => {
    if (!accessToken) {
      setError('Please enter your Instagram Access Token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&access_token=${accessToken}`
      );

      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      setPosts(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Instagram className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold">Instagram Integration</h1>
          </div>
          <p className="text-gray-400">Connect your Instagram to display real-time posts</p>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Setup Instructions
          </h2>
          <ol className="space-y-2 text-sm text-gray-300">
            <li>1. Go to <a href="https://developers.facebook.com/" target="_blank" className="text-blue-400 underline">Facebook Developers</a></li>
            <li>2. Create app and add Instagram Basic Display</li>
            <li>3. Generate User Token with permissions</li>
            <li>4. Paste Access Token below</li>
          </ol>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Access Token</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Instagram Access Token</label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Enter your Instagram Access Token"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              />
              {savedToken && <p className="text-green-400 text-sm mt-2">✓ Token saved</p>}
            </div>

            <div className="flex gap-4">
              <button onClick={saveToken} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg">
                Save Token
              </button>
              
              <button onClick={fetchPosts} disabled={loading} className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Fetching...' : 'Fetch Posts'}
              </button>
            </div>

            {error && <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">{error}</div>}
          </div>
        </div>

        {posts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Instagram Posts ({posts.length})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-900 rounded-xl overflow-hidden">
                  <div className="relative aspect-square">
                    {post.media_type === 'VIDEO' ? (
                      <video src={post.media_url} className="w-full h-full object-cover" controls />
                    ) : (
                      <Image src={post.media_url} alt={post.caption || 'Post'} fill className="object-cover" />
                    )}
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1 text-white">
                        <Heart className="w-5 h-5" />
                        <span>{post.like_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments_count || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-gray-300 line-clamp-2">{post.caption || 'No caption'}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</span>
                      <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 text-sm flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        View
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
