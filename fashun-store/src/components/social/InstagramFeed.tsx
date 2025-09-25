'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HeartIcon, 
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  isVideo?: boolean;
  videoUrl?: string;
}

interface InstagramFeedProps {
  className?: string;
  autoSlide?: boolean;
  slideInterval?: number;
  showControls?: boolean;
}

// Mock Instagram posts data - In production, this would come from Instagram API
const mockInstagramPosts: InstagramPost[] = [
  {
    id: '1',
    image: '/api/placeholder/400/400',
    caption: 'New drop alert! 🔥 Our latest streetwear collection is here. Which piece is your favorite? #FASHUN #streetwear #newdrop',
    likes: 2847,
    comments: 156,
    timestamp: '2h ago'
  },
  {
    id: '2',
    image: '/api/placeholder/400/400',
    caption: 'Behind the scenes at our latest photoshoot 📸 The energy was unmatched! #BTS #photoshoot #streetstyle',
    likes: 1923,
    comments: 89,
    timestamp: '5h ago',
    isVideo: true,
    videoUrl: '/api/placeholder/video'
  },
  {
    id: '3',
    image: '/api/placeholder/400/400',
    caption: 'Street style inspiration from our community 💫 Tag us in your FASHUN fits! #communitypost #streetfashion',
    likes: 3421,
    comments: 234,
    timestamp: '1d ago'
  },
  {
    id: '4',
    image: '/api/placeholder/400/400',
    caption: 'Minimalist vibes with our new tech collection ⚡ Function meets fashion. #techware #minimalist #function',
    likes: 1654,
    comments: 67,
    timestamp: '2d ago'
  },
  {
    id: '5',
    image: '/api/placeholder/400/400',
    caption: 'Color pop moment! 🌈 Which color combination speaks to you? #colorful #streetwear #vibrant',
    likes: 2156,
    comments: 143,
    timestamp: '3d ago'
  },
  {
    id: '6',
    image: '/api/placeholder/400/400',
    caption: 'Throwback to our first collection launch 📅 How far we\'ve come! #throwback #journey #growth',
    likes: 4532,
    comments: 398,
    timestamp: '1w ago'
  }
];

const InstagramFeed: React.FC<InstagramFeedProps> = ({
  className = '',
  autoSlide = true,
  slideInterval = 4000,
  showControls = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoSlide);
  const [posts] = useState(mockInstagramPosts);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === posts.length - 1 ? 0 : prevIndex + 1
      );
    }, slideInterval);

    return () => clearInterval(timer);
  }, [isPlaying, posts.length, slideInterval]);

  const handlePrevious = () => {
    setCurrentIndex(currentIndex === 0 ? posts.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex === posts.length - 1 ? 0 : currentIndex + 1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                F
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">@fashun.co</h3>
            <p className="text-gray-400 text-sm">Follow us for daily style inspiration</p>
          </div>
        </div>
        
        <Link
          href="https://www.instagram.com/fashun.co"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          Follow
        </Link>
      </div>

      {/* Instagram Posts Slider */}
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative"
          >
            {/* Post Image/Video */}
            <div className="relative aspect-square">
              {posts[currentIndex]?.isVideo ? (
                <div className="relative w-full h-full bg-black rounded-t-2xl">
                  <Image
                    src={posts[currentIndex].image}
                    alt="Instagram post"
                    fill
                    className="object-cover rounded-t-2xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <PlayIcon className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={posts[currentIndex]?.image || '/api/placeholder/400/400'}
                  alt="Instagram post"
                  fill
                  className="object-cover rounded-t-2xl"
                />
              )}
              
              {/* Post Index Indicator */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">
                  {currentIndex + 1} / {posts.length}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-6">
              {/* Engagement Stats */}
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-2">
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  <span className="text-white font-medium">
                    {formatNumber(posts[currentIndex]?.likes || 0)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ChatBubbleOvalLeftIcon className="w-6 h-6 text-gray-300" />
                  <span className="text-white font-medium">
                    {formatNumber(posts[currentIndex]?.comments || 0)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShareIcon className="w-6 h-6 text-gray-300" />
                </div>
              </div>

              {/* Caption */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {posts[currentIndex]?.caption}
              </p>

              {/* Timestamp */}
              <p className="text-gray-500 text-xs">
                {posts[currentIndex]?.timestamp}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {showControls && (
          <>
            {/* Previous/Next Buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
            >
              →
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
            >
              {isPlaying ? (
                <PauseIcon className="w-5 h-5" />
              ) : (
                <PlayIcon className="w-5 h-5 ml-0.5" />
              )}
            </button>
          </>
        )}

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* View All Posts Link */}
      <div className="mt-6 text-center">
        <Link
          href="https://www.instagram.com/fashun.co"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-300"
        >
          <span>View all posts on Instagram</span>
          <ShareIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default InstagramFeed;