'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Instagram Feed - Social proof section inspired by social commerce themes
export default function InstagramFeed() {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  const instagramPosts = [
    {
      id: 1,
      image: '/images/mock/instagram/post-1.jpg',
      likes: 2847,
      comments: 94,
      caption: 'Streetwear vibes on point 🔥 #FASHUNCO #StreetStyle',
      username: '@fashun.co.in',
      userAvatar: '/images/mock/avatars/brand-avatar.jpg',
      link: '#'
    },
    {
      id: 2,
      image: '/images/mock/instagram/post-2.jpg',
      likes: 1923,
      comments: 67,
      caption: 'New drop landing tomorrow! Stay tuned 👀 #NewDrop',
      username: '@fashun.co.in',
      userAvatar: '/images/mock/avatars/brand-avatar.jpg',
      link: '#'
    },
    {
      id: 3,
      image: '/images/mock/instagram/post-3.jpg',
      likes: 3456,
      comments: 128,
      caption: 'Behind the scenes at our latest photoshoot 📸',
      username: '@fashun.co.in',
      userAvatar: '/images/mock/avatars/brand-avatar.jpg',
      link: '#'
    },
    {
      id: 4,
      image: '/images/mock/instagram/post-4.jpg',
      likes: 2134,
      comments: 89,
      caption: 'Customer spotlight! @alex_styles killing it 💯',
      username: '@fashun.co.in',
      userAvatar: '/images/mock/avatars/brand-avatar.jpg',
      link: '#'
    },
    {
      id: 5,
      image: '/images/mock/instagram/post-5.jpg',
      likes: 4127,
      comments: 203,
      caption: 'Sustainable fashion meets street culture 🌱 #Sustainability',
      username: '@fashun.co.in',
      userAvatar: '/images/mock/avatars/brand-avatar.jpg',
      link: '#'
    },
    {
      id: 6,
      image: '/images/mock/instagram/post-6.jpg',
      likes: 1876,
      comments: 76,
      caption: 'Minimalist meets maximum impact ⚡ #MinimalStyle',
      username: '@fashun.co.in',
      userAvatar: '/images/mock/avatars/brand-avatar.jpg',
      link: '#'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-accent-500/5 to-pink-500/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Glassmorphic header container */}
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-2xl shadow-pink-500/10 mx-auto max-w-4xl">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-full mb-6 border border-pink-400/30 shadow-lg shadow-pink-500/20">
            <svg className="w-6 h-6 mr-2 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="font-semibold text-pink-300">Follow Us @fashun.co.in</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Street Style <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Community</span>
          </h2>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Join thousands of streetwear enthusiasts sharing their FASHUN.CO looks. Tag us and get featured!
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>50K+ followers</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span>Daily interactions</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span>User-generated content</span>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -10, 
                rotateX: 5, 
                rotateY: 5, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group relative overflow-hidden rounded-3xl aspect-square cursor-pointer bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl shadow-black/20 transform-gpu perspective-1000"
              onMouseEnter={() => setIsHovered(post.id)}
              onMouseLeave={() => setIsHovered(null)}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Glassmorphic frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 rounded-3xl z-10 pointer-events-none"></div>
              
              {/* Post Image */}
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                
                {/* Inner glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 rounded-3xl"></div>
              </div>
              
              {/* Hover Overlay */}
                            {/* Hover Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-sm transition-all duration-300 rounded-3xl ${isHovered === post.id ? 'opacity-100' : 'opacity-0'}`}>
                {/* Instagram Icon */}
                <div className="absolute top-4 right-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>

                {/* Post Stats */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold">{post.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm font-semibold">{post.comments}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <img
                        src={post.userAvatar}
                        alt="FASHUN.CO"
                        className="w-8 h-8 rounded-full border-2 border-white mr-2"
                      />
                      <span className="text-sm font-semibold">{post.username}</span>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  <p className="text-white text-sm leading-relaxed line-clamp-2">
                    {post.caption}
                  </p>
                </div>
              </div>

              {/* View on Instagram Button (appears on hover) */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered === post.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(`https://instagram.com/fashun.co.in`, '_blank')}
                  className="bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 font-semibold py-3 px-6 rounded-2xl shadow-2xl shadow-black/20 border border-white/20 transform transition-all duration-200 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    View on Instagram
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-pink-500/90 to-purple-600/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-white relative overflow-hidden border border-white/10 shadow-2xl shadow-pink-500/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-xl"></div>
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-lg"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <svg className="w-12 h-12 mr-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-3xl md:text-4xl font-bold">Join Our Community</span>
              </div>
              
              <p className="text-xl mb-8 text-pink-100 max-w-2xl mx-auto">
                Follow @fashun.co.in for daily style inspiration, behind-the-scenes content, 
                and chances to be featured in our community spotlight!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="https://instagram.com/fashun.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-white/95 backdrop-blur-sm text-pink-600 font-bold rounded-2xl hover:bg-white border border-white/20 shadow-2xl shadow-black/10 transition-all duration-300"
                >
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Follow @fashun.co.in
                </motion.a>
                
                <motion.button 
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'FASHUN.CO.IN - Premium Streetwear',
                        text: 'Check out my FASHUN.CO look! #FashunStyle #StreetStyle',
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(`Check out FASHUN.CO.IN - Premium Streetwear! ${window.location.href}`);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/20 hover:bg-white/20 shadow-lg shadow-black/10 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
                  </svg>
                  Share Your Look
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}