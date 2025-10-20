'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaTwitter, FaYoutube, FaGithub, FaLinkedin, FaGlobe, FaShoppingBag, FaEnvelope, FaPalette, FaChartLine, FaQrcode, FaStar } from 'react-icons/fa';

// Theme configurations
const themes = {
  minimalist: {
    name: 'Minimalist',
    primary: 'from-gray-900 via-slate-900 to-black',
    card: 'bg-white/5 backdrop-blur-sm border border-white/10',
    text: 'text-white',
    accent: 'text-gray-300',
    button: 'bg-white text-black hover:bg-gray-100',
    gradient: 'from-gray-600 to-gray-800'
  },
  vibrant: {
    name: 'Vibrant',
    primary: 'from-purple-900 via-pink-900 to-orange-900',
    card: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20',
    text: 'text-white',
    accent: 'text-purple-300',
    button: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
    gradient: 'from-purple-500 to-pink-500'
  },
  dark: {
    name: 'Dark Mode',
    primary: 'from-black via-gray-900 to-zinc-900',
    card: 'bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50',
    text: 'text-white',
    accent: 'text-zinc-400',
    button: 'bg-zinc-700 text-white hover:bg-zinc-600',
    gradient: 'from-zinc-600 to-zinc-800'
  }
};

// Demo profile data with enhanced features
const demoProfile = {
  username: 'fashionista',
  name: 'Alex Fashion',
  bio: '👔 Streetwear Enthusiast | 🎨 Style Creator | ✨ FASHUN Ambassador',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
  coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea2f40f2?w=1200&h=400&fit=crop&q=80',
  spotlightLink: 2, // Instagram is spotlight
  links: [
    {
      id: 1,
      title: 'Shop My Style',
      url: 'https://fashun.co.in',
      icon: 'shopping',
      color: 'from-purple-500 to-pink-500',
      type: 'affiliate'
    },
    {
      id: 2,
      title: 'Instagram',
      url: 'https://instagram.com/fashun',
      icon: 'instagram',
      color: 'from-pink-500 to-rose-500',
      type: 'social'
    },
    {
      id: 3,
      title: 'Latest YouTube Video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      icon: 'youtube',
      color: 'from-red-500 to-red-600',
      type: 'youtube',
      embed: true
    },
    {
      id: 4,
      title: 'Twitter',
      url: 'https://twitter.com',
      icon: 'twitter',
      color: 'from-blue-400 to-blue-500',
      type: 'social'
    },
    {
      id: 5,
      title: 'Portfolio',
      url: 'https://fashun.co.in',
      icon: 'globe',
      color: 'from-cyan-500 to-blue-500',
      type: 'website'
    },
    {
      id: 6,
      title: 'Contact Me',
      url: 'mailto:hello@fashun.co.in',
      icon: 'email',
      color: 'from-gray-600 to-gray-700',
      type: 'contact'
    }
  ],
  closet: [
    {
      id: 1,
      name: 'Cyber Punk Hoodie',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop&q=80',
      qrCode: true,
      price: '₹3,299'
    },
    {
      id: 2,
      name: 'Neon Glow Tee',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&q=80',
      qrCode: true,
      price: '₹1,799'
    },
    {
      id: 3,
      name: 'Matrix Style Jacket',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop&q=80',
      qrCode: true,
      price: '₹4,999'
    },
    {
      id: 4,
      name: 'Holographic Hoodie',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop&q=80',
      qrCode: true,
      price: '₹2,999'
    },
    {
      id: 5,
      name: 'Future Tech Tee',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&q=80',
      qrCode: true,
      price: '₹1,599'
    },
    {
      id: 6,
      name: 'Quantum Bomber',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop&q=80',
      qrCode: true,
      price: '₹5,499'
    }
  ],
  stats: {
    views: 1247,
    clicks: 342,
    topLink: 'Instagram',
    conversionRate: '27.4%'
  },
  analytics: {
    dailyViews: [15, 23, 18, 35, 28, 42, 38],
    linkClicks: {
      'Shop My Style': 89,
      'Instagram': 156,
      'YouTube': 67,
      'Twitter': 30
    }
  }
};

const getIcon = (iconName: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    shopping: <FaShoppingBag size={20} />,
    instagram: <FaInstagram size={20} />,
    youtube: <FaYoutube size={20} />,
    twitter: <FaTwitter size={20} />,
    github: <FaGithub size={20} />,
    linkedin: <FaLinkedin size={20} />,
    globe: <FaGlobe size={20} />,
    email: <FaEnvelope size={20} />
  };
  return icons[iconName] || <FaGlobe size={20} />;
};

export default function EnhancedDemoProfilePage() {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('vibrant');
  const [clickCount, setClickCount] = useState<{ [key: number]: number }>({});
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCloset, setShowCloset] = useState(true);
  
  const theme = themes[currentTheme];

  const handleLinkClick = (linkId: number, url: string) => {
    setClickCount(prev => ({
      ...prev,
      [linkId]: (prev[linkId] || 0) + 1
    }));
    window.open(url, '_blank');
  };

  const handleThemeChange = (themeName: keyof typeof themes) => {
    setCurrentTheme(themeName);
  };

  return (
    <motion.div 
      className={`min-h-screen bg-gradient-to-br ${theme.primary}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Theme Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`${theme.card} rounded-xl p-3`}>
          <div className="flex items-center gap-2 mb-2">
            <FaPalette className={theme.accent} />
            <span className={`text-sm font-medium ${theme.text}`}>Theme</span>
          </div>
          <div className="flex gap-2">
            {Object.entries(themes).map(([key, t]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key as keyof typeof themes)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  currentTheme === key 
                    ? theme.button 
                    : `${theme.card} ${theme.accent} hover:${theme.text}`
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={demoProfile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80" />
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-12">
        {/* Profile Section */}
        <motion.div 
          className="relative -mt-20 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative">
              <motion.img
                src={demoProfile.avatar}
                alt={demoProfile.name}
                className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-xl object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-gray-900 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>

            {/* Name & Bio */}
            <motion.h1 
              className={`text-3xl font-bold ${theme.text} mt-4 mb-2`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {demoProfile.name}
            </motion.h1>
            <p className={`${theme.accent} mb-1`}>@{demoProfile.username}</p>
            <p className={`${theme.accent} text-center max-w-md mb-4`}>
              {demoProfile.bio}
            </p>

            {/* Enhanced Stats */}
            <motion.div 
              className={`${theme.card} rounded-xl p-4 mb-6`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme.text}`}>{demoProfile.stats.views}</div>
                  <div className={`text-sm ${theme.accent}`}>Views</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme.text}`}>{demoProfile.stats.clicks}</div>
                  <div className={`text-sm ${theme.accent}`}>Clicks</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className={theme.accent}>Top Link: {demoProfile.stats.topLink}</span>
                  <span className={theme.accent}>CTR: {demoProfile.stats.conversionRate}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Demo Features Notice */}
        <motion.div 
          className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaStar className="text-yellow-400" />
            <span className="text-yellow-200 font-bold">Live Demo Features</span>
            <FaStar className="text-yellow-400" />
          </div>
          <p className="text-yellow-200 text-center text-sm">
            🎨 Theme Switching • 📊 Analytics • 👔 Virtual Closet • 🔗 Rich Links • ⭐ Spotlight Features
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowCloset(false)}
            className={`flex-1 py-3 px-4 rounded-xl transition-all ${
              !showCloset ? theme.button : `${theme.card} ${theme.accent}`
            }`}
          >
            🔗 Links
          </button>
          <button
            onClick={() => setShowCloset(true)}
            className={`flex-1 py-3 px-4 rounded-xl transition-all ${
              showCloset ? theme.button : `${theme.card} ${theme.accent}`
            }`}
          >
            👔 My Closet
          </button>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`py-3 px-4 rounded-xl transition-all ${
              showAnalytics ? theme.button : `${theme.card} ${theme.accent}`
            }`}
          >
            <FaChartLine />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showCloset && (
            <motion.div
              key="links"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {demoProfile.links.map((link, index) => {
                const isSpotlight = link.id === demoProfile.spotlightLink;
                return (
                  <motion.button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id, link.url)}
                    className="w-full group relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`
                      w-full p-5 rounded-2xl relative overflow-hidden
                      ${isSpotlight ? `bg-gradient-to-r ${link.color} shadow-2xl` : theme.card}
                      transition-all duration-300
                      flex items-center justify-between
                      ${isSpotlight ? 'text-white' : theme.text} font-semibold
                      ${isSpotlight ? 'border-2 border-yellow-400/50' : ''}
                    `}>
                      {isSpotlight && (
                        <motion.div
                          className="absolute top-2 right-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <FaStar className="text-yellow-300 text-sm" />
                        </motion.div>
                      )}
                      
                      <div className="flex items-center gap-4">
                        <div className={`p-2 ${isSpotlight ? 'bg-white/20' : 'bg-white/10'} rounded-lg backdrop-blur-sm`}>
                          {getIcon(link.icon)}
                        </div>
                        <div className="text-left">
                          <span className="text-lg block">{link.title}</span>
                          {isSpotlight && (
                            <span className="text-sm text-white/80">⭐ Spotlight Link</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {clickCount[link.id] > 0 && (
                          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                            {clickCount[link.id]} clicks
                          </span>
                        )}
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {showCloset && (
            <motion.div
              key="closet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`${theme.card} rounded-2xl p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme.text} flex items-center gap-2`}>
                  👔 My Virtual Closet
                </h3>
                <span className={`text-sm ${theme.accent}`}>
                  {demoProfile.closet.length} Phygital Items
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {demoProfile.closet.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={`${theme.card} rounded-xl overflow-hidden group cursor-pointer`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="aspect-square relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                      {item.qrCode && (
                        <div className="absolute top-2 right-2 bg-black/50 rounded-lg p-1">
                          <FaQrcode className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className={`font-medium ${theme.text} text-sm mb-1`}>{item.name}</h4>
                      <p className={`text-xs ${theme.accent}`}>{item.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className={`${theme.button} px-6 py-3 rounded-xl font-medium transition-all`}>
                  🛍️ Shop More Phygital Items
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analytics Panel */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`${theme.card} rounded-2xl p-6 mt-6`}
            >
              <h3 className={`text-xl font-bold ${theme.text} mb-4 flex items-center gap-2`}>
                📊 Analytics Dashboard
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-medium ${theme.text} mb-2`}>Daily Views</h4>
                  <div className="flex items-end gap-1 h-20">
                    {demoProfile.analytics.dailyViews.map((views, index) => (
                      <motion.div
                        key={index}
                        className={`bg-gradient-to-t ${theme.gradient} rounded-t-sm flex-1`}
                        initial={{ height: 0 }}
                        animate={{ height: `${(views / 50) * 100}%` }}
                        transition={{ delay: index * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-medium ${theme.text} mb-2`}>Top Links</h4>
                  <div className="space-y-2">
                    {Object.entries(demoProfile.analytics.linkClicks)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([name, clicks]) => (
                        <div key={name} className="flex justify-between">
                          <span className={`text-sm ${theme.accent}`}>{name}</span>
                          <span className={`text-sm font-medium ${theme.text}`}>{clicks}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Affiliate CTA */}
        <motion.div 
          className={`mt-8 ${theme.card} rounded-2xl p-6 text-center`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className={`text-lg font-bold ${theme.text} mb-2`}>
            ✨ Get Your Own FASHUN Profile
          </h3>
          <p className={`${theme.accent} text-sm mb-4`}>
            Create your digital identity with phygital integration
          </p>
          <button className={`${theme.button} px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105`}>
            Start Building • FREE
          </button>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className={`${theme.accent} text-sm mb-2`}>
            Powered by FASHUN Digital Identity Platform
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <a href="/" className={`${theme.accent} hover:${theme.text} underline`}>
              Create Profile
            </a>
            <span className={theme.accent}>•</span>
            <a href="/docs" className={`${theme.accent} hover:${theme.text} underline`}>
              API Docs
            </a>
            <span className={theme.accent}>•</span>
            <a href="/shop" className={`${theme.accent} hover:${theme.text} underline`}>
              Shop Phygital
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
