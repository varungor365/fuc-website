'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Check, 
  X, 
  Filter, 
  Download, 
  ExternalLink, 
  RefreshCw,
  AlertTriangle,
  Star,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Grid3X3,
  Play,
  Settings
} from 'lucide-react';

// Types
interface UGCPost {
  id: number;
  caption: string;
  media: string[];
  author: {
    username: string;
    avatar: string;
  };
  hashtags: string[];
  social_platform: string;
  likes_count: number;
  style_category: string;
  outfit_rating: number;
  location?: string;
  submission_date: string;
  is_approved: boolean;
  moderation_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  engagement_score: number;
  external_url?: string;
}

interface SyncStats {
  total_posts: number;
  pending_moderation: number;
  approved_posts: number;
  rejected_posts: number;
  last_sync: string;
  engagement_rate: number;
}

// Mock data
const mockUGCPosts: UGCPost[] = [
  {
    id: 1,
    caption: "Living my best life in @fucfashion! The quality is unmatched 🔥",
    media: ["/api/placeholder/400/600"],
    author: {
      username: "fashionista_alex",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#fucfashion", "#streetstyle", "#ootd"],
    social_platform: "instagram",
    likes_count: 456,
    style_category: "street",
    outfit_rating: 4.8,
    location: "New York, NY",
    submission_date: "2024-01-16T09:15:00Z",
    is_approved: false,
    moderation_status: "pending",
    engagement_score: 92,
    external_url: "https://instagram.com/p/abc123"
  },
  {
    id: 2,
    caption: "Weekend vibes ✨ Thanks @fucfashion for keeping me stylish!",
    media: ["/api/placeholder/500/700"],
    author: {
      username: "style_maven",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#weekendstyle", "#comfortable"],
    social_platform: "instagram",
    likes_count: 234,
    style_category: "casual",
    outfit_rating: 4.5,
    submission_date: "2024-01-15T18:45:00Z",
    is_approved: true,
    moderation_status: "approved",
    engagement_score: 78
  }
];

const mockStats: SyncStats = {
  total_posts: 156,
  pending_moderation: 12,
  approved_posts: 128,
  rejected_posts: 16,
  last_sync: "2024-01-16T10:30:00Z",
  engagement_rate: 4.2
};

// UGC Card Component
const UGCModerationCard: React.FC<{
  post: UGCPost;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onFlag: (id: number) => void;
}> = ({ post, onApprove, onReject, onFlag }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      {/* Media */}
      <div className="relative aspect-square">
        <Image
          src={post.media[currentMediaIndex]}
          alt={post.caption}
          fill
          className="object-cover"
        />
        
        {/* Media count indicator */}
        {post.media.length > 1 && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
            {currentMediaIndex + 1}/{post.media.length}
          </div>
        )}
        
        {/* Platform badge */}
        <div className="absolute top-3 left-3 bg-pink-500 p-2 rounded-full text-white">
          <Instagram className="w-4 h-4" />
        </div>
        
        {/* Status badge */}
        <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.moderation_status)}`}>
          {post.moderation_status}
        </div>
        
        {/* Rating */}
        <div className="absolute bottom-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs font-medium">{post.outfit_rating}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Author */}
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={post.author.avatar}
            alt={post.author.username}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <div className="font-medium text-sm">@{post.author.username}</div>
            {post.location && (
              <div className="text-xs text-gray-500">{post.location}</div>
            )}
          </div>
          {post.external_url && (
            <a
              href={post.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto p-1 text-gray-400 hover:text-gray-600"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        
        {/* Caption */}
        <p className="text-sm text-gray-700 mb-3 line-clamp-3">{post.caption}</p>
        
        {/* Hashtags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {post.hashtags.slice(0, 3).map((hashtag, index) => (
            <span key={index} className="text-blue-500 text-xs">
              {hashtag}
            </span>
          ))}
          {post.hashtags.length > 3 && (
            <span className="text-gray-400 text-xs">
              +{post.hashtags.length - 3} more
            </span>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {post.likes_count}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {post.engagement_score}
          </span>
          <span className="capitalize text-xs bg-gray-100 px-2 py-1 rounded">
            {post.style_category}
          </span>
        </div>
        
        {/* Moderation Actions */}
        {post.moderation_status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(post.id)}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => onFlag(post.id)}
              className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
            <button
              onClick={() => onReject(post.id)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Approved Actions */}
        {post.moderation_status === 'approved' && (
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Feature on Site
            </button>
            <button
              onClick={() => onFlag(post.id)}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <p className="text-green-500 text-sm mt-1">↗ {trend}</p>
        )}
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

// Main Component
export default function UGCManagementPage() {
  const [posts, setPosts] = useState<UGCPost[]>(mockUGCPosts);
  const [stats, setStats] = useState<SyncStats>(mockStats);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.moderation_status === filter;
  });

  const handleApprove = async (id: number) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, moderation_status: 'approved', is_approved: true }
        : post
    ));
    
    // TODO: API call to approve post
    // await fetch(`/api/ugc/${id}/approve`, { method: 'POST' });
  };

  const handleReject = async (id: number) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, moderation_status: 'rejected', is_approved: false }
        : post
    ));
    
    // TODO: API call to reject post
    // await fetch(`/api/ugc/${id}/reject`, { method: 'POST' });
  };

  const handleFlag = async (id: number) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, moderation_status: 'flagged' }
        : post
    ));
    
    // TODO: API call to flag post
    // await fetch(`/api/ugc/${id}/flag`, { method: 'POST' });
  };

  const handleInstagramSync = async () => {
    setIsSyncing(true);
    try {
      // TODO: Call Instagram sync API
      // const response = await fetch('/api/instagram/sync', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ action: 'sync' })
      // });
      
      // For now, simulate sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStats(prev => ({
        ...prev,
        last_sync: new Date().toISOString(),
        total_posts: prev.total_posts + 5,
        pending_moderation: prev.pending_moderation + 5
      }));
      
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold">UGC Management</h1>
              <p className="text-gray-600">Manage user-generated content and Instagram integration</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleInstagramSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Instagram'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total Posts"
            value={stats.total_posts}
            icon={<Grid3X3 className="w-6 h-6 text-white" />}
            color="bg-blue-500"
          />
          <StatsCard
            title="Pending Review"
            value={stats.pending_moderation}
            icon={<Eye className="w-6 h-6 text-white" />}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Approved"
            value={stats.approved_posts}
            icon={<Check className="w-6 h-6 text-white" />}
            color="bg-green-500"
          />
          <StatsCard
            title="Engagement Rate"
            value={`${stats.engagement_rate}%`}
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            trend="+0.3%"
            color="bg-purple-500"
          />
          <StatsCard
            title="Last Sync"
            value={new Date(stats.last_sync).toLocaleDateString()}
            icon={<Calendar className="w-6 h-6 text-white" />}
            color="bg-gray-500"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All Posts' },
                  { key: 'pending', label: 'Pending Review' },
                  { key: 'approved', label: 'Approved' },
                  { key: 'rejected', label: 'Rejected' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterOption.key
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredPosts.length} posts
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <UGCModerationCard
                key={post.id}
                post={post}
                onApprove={handleApprove}
                onReject={handleReject}
                onFlag={handleFlag}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Grid3X3 className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No UGC posts available. Try syncing with Instagram to get fresh content.'
                : `No posts with status "${filter}" found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
