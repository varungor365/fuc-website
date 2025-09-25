'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { pagefonts } from '@/lib/simpleFonts';
import { 
  UserIcon, 
  QrCodeIcon, 
  ShareIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  links: Array<{
    platform: string;
    url: string;
    handle: string;
  }>;
  styles: string[];
  joinDate: string;
  profileUrl: string;
  qrCode: string;
}

interface ProfilePageProps {
  params: { userId: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [mockupTemplate, setMockupTemplate] = useState('tshirt-front');

  useEffect(() => {
    fetchProfile();
  }, [params.userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${params.userId}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.user);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const generateMockup = async () => {
    if (!profile) return;
    
    try {
      const mockupUrl = `/api/mockup?userId=${profile.id}&template=${mockupTemplate}`;
      window.open(mockupUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate mockup:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className={`${pagefonts.content.primary.className} text-white mt-4 text-center`}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className={`${pagefonts.homepage.primary.className} text-2xl font-bold text-white mb-2`}>
            Profile Not Found
          </h1>
          <p className={`${pagefonts.content.primary.className} text-gray-300`}>
            {error || 'This user profile does not exist.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-1">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                  <UserIcon className="h-16 w-16 text-gray-400" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className={`${pagefonts.homepage.primary.className} text-4xl font-bold text-white mb-2`}>
                {profile.displayName}
              </h1>
              <p className={`${pagefonts.content.primary.className} text-purple-300 text-lg mb-4`}>
                @{profile.username}
              </p>
              <p className={`${pagefonts.content.primary.className} text-gray-300 mb-6`}>
                {profile.bio}
              </p>
              
              {/* Style Tags */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                {profile.styles.map((style, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-500/30 border border-purple-400/50 rounded-full text-purple-200 text-sm"
                  >
                    {style}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-4 justify-center md:justify-start">
                {profile.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-300"
                  >
                    {link.handle}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* QR Code & Mockup Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className={`${pagefonts.homepage.primary.className} text-2xl font-bold text-white mb-4 flex items-center gap-2`}>
              <QrCodeIcon className="h-6 w-6" />
              Share Profile
            </h2>
            <div className="bg-white rounded-2xl p-6 text-center">
              <img 
                src={profile.qrCode} 
                alt="Profile QR Code"
                className="mx-auto mb-4 w-48 h-48"
              />
              <p className="text-gray-600 text-sm">
                Scan to view this profile
              </p>
            </div>
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
            >
              <ShareIcon className="h-5 w-5" />
              Share QR Code
            </button>
          </div>

          {/* Mockup Generator */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className={`${pagefonts.homepage.primary.className} text-2xl font-bold text-white mb-4 flex items-center gap-2`}>
              <SparklesIcon className="h-6 w-6" />
              Mockup Generator
            </h2>
            
            {/* Template Selection */}
            <div className="mb-4">
              <label className="block text-white mb-2">Choose Template:</label>
              <select
                value={mockupTemplate}
                onChange={(e) => setMockupTemplate(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="tshirt-front">T-Shirt Front</option>
                <option value="tshirt-back">T-Shirt Back</option>
                <option value="hoodie-front">Hoodie Front</option>
                <option value="hoodie-back">Hoodie Back</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateMockup}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Generate Mockup
            </button>
            
            <p className="text-gray-400 text-sm mt-2 text-center">
              Create a custom mockup with your QR code
            </p>
          </div>
        </div>

        {/* Joined Date */}
        <div className="text-center mt-8">
          <p className={`${pagefonts.content.primary.className} text-gray-400`}>
            Member since {new Date(profile.joinDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}