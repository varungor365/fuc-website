'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  UserIcon, 
  LinkIcon, 
  EyeIcon, 
  ShareIcon,
  PaintBrushIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  SwatchIcon,
  MoonIcon,
  SunIcon,
  FireIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

// Mock user profile data (in production, this would come from Supabase)
const mockProfiles = {
  'arjun_k': {
    id: '1',
    username: 'arjun_k',
    displayName: 'Arjun Kumar',
    bio: 'Street fashion enthusiast & digital creator',
    location: 'Mumbai, India',
    avatar: '/images/avatars/avatar-1.jpg',
    coverImage: '/images/covers/cover-1.jpg',
    theme: 'vibrant',
    verified: true,
    followers: 12800,
    following: 345,
    profileViews: 25600,
    links: [
      { id: '1', title: 'My Latest Drop', url: 'https://fashun.co/drops/arjun-k', icon: 'shopping', clicks: 2340 },
      { id: '2', title: 'Instagram', url: 'https://instagram.com/arjun_k', icon: 'instagram', clicks: 890 },
      { id: '3', title: 'YouTube Channel', url: 'https://youtube.com/@arjun_k', icon: 'youtube', clicks: 456 },
      { id: '4', title: 'Spotify Playlist', url: 'https://spotify.com/playlist/arjun-vibes', icon: 'music', clicks: 234 }
    ],
    closet: [
      { id: '1', name: 'Cyber Punk Hoodie', image: '/images/products/hoodies/hoodie-1-main.jpg', qrCode: 'QR001', owned: true },
      { id: '2', name: 'Neon Glow Tee', image: '/images/products/t-shirts/tshirt-1-main.jpg', qrCode: 'QR002', owned: true },
      { id: '3', name: 'Quantum Bomber', image: '/images/products/hoodies/hoodie-2-main.jpg', qrCode: 'QR003', owned: true }
    ],
    analytics: {
      totalViews: 25600,
      totalClicks: 3920,
      conversionRate: 15.3,
      topPerforming: 'My Latest Drop'
    }
  },
  'priya_s': {
    id: '2',
    username: 'priya_s',
    displayName: 'Priya Sharma',
    bio: 'Minimalist fashion & lifestyle curator',
    location: 'Delhi, India',
    avatar: '/images/avatars/avatar-2.jpg',
    coverImage: '/images/covers/cover-2.jpg',
    theme: 'minimalist',
    verified: true,
    followers: 8500,
    following: 189,
    profileViews: 18200,
    links: [
      { id: '1', title: 'Minimal Collection', url: 'https://fashun.co/collections/minimal', icon: 'shopping', clicks: 1560 },
      { id: '2', title: 'Pinterest', url: 'https://pinterest.com/priya_s', icon: 'pinterest', clicks: 720 },
      { id: '3', title: 'Blog', url: 'https://priyastyle.blog', icon: 'web', clicks: 380 },
    ],
    closet: [
      { id: '1', name: 'Essential White Tee', image: '/images/products/t-shirts/tshirt-2-main.jpg', qrCode: 'QR004', owned: true },
      { id: '2', name: 'Classic Denim', image: '/images/products/hoodies/hoodie-1-front.jpg', qrCode: 'QR005', owned: true }
    ],
    analytics: {
      totalViews: 18200,
      totalClicks: 2660,
      conversionRate: 14.6,
      topPerforming: 'Minimal Collection'
    }
  }
};

// Theme configurations
const themes = {
  minimalist: {
    name: 'Minimalist',
    background: 'bg-gradient-to-br from-gray-50 to-white',
    card: 'bg-white border border-gray-200',
    text: 'text-gray-900',
    accent: 'text-gray-600',
    button: 'bg-gray-900 hover:bg-gray-800 text-white',
    isDark: false
  },
  vibrant: {
    name: 'Vibrant',
    background: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    card: 'bg-white/10 backdrop-blur-md border border-white/20',
    text: 'text-white',
    accent: 'text-white/80',
    button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white',
    isDark: true
  },
  dark: {
    name: 'Dark Mode',
    background: 'bg-gradient-to-br from-gray-900 via-black to-gray-800',
    card: 'bg-gray-800/50 backdrop-blur-md border border-gray-700',
    text: 'text-white',
    accent: 'text-gray-300',
    button: 'bg-white hover:bg-gray-100 text-black',
    isDark: true
  }
};

interface ProfilePageProps {}

export default function DynamicProfilePage({}: ProfilePageProps) {
  const params = useParams();
  const username = params.username as string;
  
  const [profile, setProfile] = useState(mockProfiles[username as keyof typeof mockProfiles]);
  const [activeTab, setActiveTab] = useState('links');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(profile?.theme || 'minimalist');

  useEffect(() => {
    if (!profile) {
      // In production, this would redirect to 404
      console.log('Profile not found');
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const theme = themes[currentTheme as keyof typeof themes];

  const handleThemeChange = (newTheme: string) => {
    setCurrentTheme(newTheme);
    // In production, this would update the user's theme in Supabase
    console.log('Theme changed to:', newTheme);
  };

  const getIconForLink = (iconType: string) => {
    switch (iconType) {
      case 'shopping':
        return <ShoppingBagIcon className="w-5 h-5" />;
      case 'instagram':
        return <span className="w-5 h-5 text-pink-500">📷</span>;
      case 'youtube':
        return <span className="w-5 h-5 text-red-500">📺</span>;
      case 'music':
        return <span className="w-5 h-5 text-green-500">🎵</span>;
      case 'pinterest':
        return <span className="w-5 h-5 text-red-600">📌</span>;
      case 'web':
        return <LinkIcon className="w-5 h-5" />;
      default:
        return <LinkIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className={`min-h-screen ${theme.background} transition-all duration-500`}>
      {/* Theme Selector */}
      <div className="fixed top-4 right-4 z-50">
        <motion.button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className={`w-12 h-12 rounded-full ${theme.card} ${theme.text} flex items-center justify-center border backdrop-blur-md hover:scale-105 transition-all`}
          whileTap={{ scale: 0.95 }}
        >
          <SwatchIcon className="w-6 h-6" />
        </motion.button>

        <AnimatePresence>
          {showThemeSelector && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className={`absolute top-14 right-0 ${theme.card} rounded-xl p-4 shadow-xl border backdrop-blur-md`}
            >
              <div className="space-y-2">
                {Object.entries(themes).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      currentTheme === key ? theme.button : `hover:bg-white/10 ${theme.text}`
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${
                      key === 'minimalist' ? 'bg-gray-300' : 
                      key === 'vibrant' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 
                      'bg-gray-800'
                    }`} />
                    <span className="text-sm font-medium">{t.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-purple-500/20 to-blue-500/20 relative">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Info */}
        <div className="relative -mt-20 px-6 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1">
                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-gray-600" />
                </div>
              </div>
              {profile.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className={`text-3xl font-bold ${theme.text} flex items-center gap-2`}>
                    {profile.displayName}
                    {profile.verified && (
                      <StarIcon className="w-6 h-6 text-yellow-500 fill-current" />
                    )}
                  </h1>
                  <p className={`${theme.accent} text-lg`}>@{profile.username}</p>
                  <p className={`${theme.accent} mt-2`}>{profile.bio}</p>
                  <p className={`${theme.accent} text-sm mt-1`}>📍 {profile.location}</p>
                </div>

                {/* Stats */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${theme.text}`}>
                      {profile.followers.toLocaleString()}
                    </div>
                    <div className={`text-sm ${theme.accent}`}>Followers</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${theme.text}`}>
                      {profile.following.toLocaleString()}
                    </div>
                    <div className={`text-sm ${theme.accent}`}>Following</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${theme.text}`}>
                      {profile.profileViews.toLocaleString()}
                    </div>
                    <div className={`text-sm ${theme.accent}`}>Views</div>
                  </div>
                </div>

                {/* QR Customizer Button - Only show for profile owner */}
                {typeof window !== 'undefined' && window.location.pathname === `/${profile.username}` && (
                  <div className="mt-4">
                    <motion.button
                      onClick={() => window.location.href = '/qr-customizer'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${theme.card} ${theme.text} hover:scale-105`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <QrCodeIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Customize QR Code</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 mb-8">
        <div className={`${theme.card} rounded-xl p-2 inline-flex gap-2`}>
          {[
            { id: 'links', label: 'Links', icon: LinkIcon },
            { id: 'closet', label: 'My Closet', icon: ShoppingBagIcon },
            { id: 'analytics', label: 'Analytics', icon: ChartBarIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? theme.button
                  : `${theme.text} hover:bg-white/10`
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-4 max-w-md mx-auto"
            >
              {profile.links.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${theme.card} p-4 rounded-xl hover:scale-105 transition-all block group`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      theme.isDark ? 'bg-white/10' : 'bg-gray-100'
                    }`}>
                      {getIconForLink(link.icon)}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${theme.text} group-hover:text-purple-500 transition-colors`}>
                        {link.title}
                      </h3>
                      <p className={`text-sm ${theme.accent}`}>
                        {link.clicks.toLocaleString()} clicks
                      </p>
                    </div>
                    <div className={`${theme.accent} group-hover:translate-x-1 transition-transform`}>
                      →
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}

          {activeTab === 'closet' && (
            <motion.div
              key="closet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.closet.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={`${theme.card} rounded-xl overflow-hidden group hover:scale-105 transition-all`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="aspect-square bg-gray-200 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold mb-1">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white/80 text-sm">QR: {item.qrCode}</span>
                          {item.owned && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Owned
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Views', value: profile.analytics.totalViews, icon: EyeIcon, color: 'blue' },
                  { label: 'Total Clicks', value: profile.analytics.totalClicks, icon: LinkIcon, color: 'green' },
                  { label: 'Conversion Rate', value: `${profile.analytics.conversionRate}%`, icon: ChartBarIcon, color: 'purple' },
                  { label: 'Top Link', value: profile.analytics.topPerforming, icon: FireIcon, color: 'orange' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className={`${theme.card} p-6 rounded-xl`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                      </div>
                      <h3 className={`font-medium ${theme.accent}`}>{stat.label}</h3>
                    </div>
                    <p className={`text-2xl font-bold ${theme.text}`}>
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* QR Code Manager */}
              <div className={`${theme.card} p-8 rounded-xl`}>
                <h3 className={`text-xl font-semibold ${theme.text} mb-6 flex items-center gap-2`}>
                  <QrCodeIcon className="w-6 h-6" />
                  QR Code Management
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* QR Preview */}
                  <div className="text-center">
                    <div className="bg-white rounded-xl p-6 mb-4 inline-block">
                      <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <QrCodeIcon className="w-16 h-16 text-gray-600" />
                      </div>
                    </div>
                    <p className={`text-sm ${theme.accent} mb-3`}>Your Profile QR Code</p>
                    <div className="flex gap-2 justify-center">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Download</button>
                      <button className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
                        <a href="/qr-customizer" className="text-white no-underline">Customize</a>
                      </button>
                    </div>
                  </div>
                  
                  {/* QR Stats */}
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${theme.isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium ${theme.text} mb-2`}>QR Scans This Week</h4>
                      <p className={`text-2xl font-bold ${theme.text}`}>147</p>
                      <p className={`text-sm ${theme.accent}`}>+23% from last week</p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${theme.isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium ${theme.text} mb-2`}>Phygital Items Sold</h4>
                      <p className={`text-2xl font-bold ${theme.text}`}>8</p>
                      <p className={`text-sm ${theme.accent}`}>Custom QR codes printed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Chart Placeholder */}
              <div className={`${theme.card} p-8 rounded-xl text-center`}>
                <ChartBarIcon className={`w-16 h-16 ${theme.accent} mx-auto mb-4`} />
                <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>Detailed Analytics</h3>
                <p className={`${theme.accent}`}>
                  View comprehensive analytics including traffic sources, geographic data, and engagement trends.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}