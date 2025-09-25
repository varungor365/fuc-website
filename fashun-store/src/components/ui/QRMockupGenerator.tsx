'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pagefonts } from '@/lib/simpleFonts';
import { 
  QrCodeIcon, 
  SparklesIcon, 
  ShareIcon,
  PhotoIcon,
  UserIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const QRMockupGenerator: React.FC = () => {
  const [userId, setUserId] = useState('john_doe');
  const [template, setTemplate] = useState('tshirt-front');
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    { id: 'tshirt-front', name: 'T-Shirt Front', preview: '/templates/tshirt-front.png' },
    { id: 'tshirt-back', name: 'T-Shirt Back', preview: '/templates/tshirt-back.png' },
    { id: 'hoodie-front', name: 'Hoodie Front', preview: '/templates/hoodie-front.png' },
    { id: 'hoodie-back', name: 'Hoodie Back', preview: '/templates/hoodie-back.png' }
  ];

  const sampleUsers = [
    { id: 'john_doe', name: 'John Doe', desc: 'Streetwear enthusiast' },
    { id: 'demo_user', name: 'Demo User', desc: 'Fashion lover' },
    { id: 'fashun_fan', name: 'FASHUN Fan', desc: 'Style explorer' }
  ];

  const generateMockup = async () => {
    if (!userId) return;
    
    setIsGenerating(true);
    try {
      // Generate using AI mockup service
      const serviceUrl = `http://localhost:3001/api/create-mockup?userId=${userId}&template=${template}`;
      setMockupUrl(serviceUrl);
    } catch (error) {
      console.error('Failed to generate mockup:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMockup = () => {
    if (!mockupUrl) return;
    
    const link = document.createElement('a');
    link.href = mockupUrl;
    link.download = `fashun-qr-mockup-${userId}-${template}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${pagefonts.homepage.primary.className} text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6`}
        >
          QR Code Mockup Generator
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${pagefonts.content.primary.className} text-xl text-gray-300 max-w-3xl mx-auto`}
        >
          Create stunning product mockups with QR codes that link to user profiles. 
          Perfect for personalized merchandise and social media marketing.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
        >
          <h2 className={`${pagefonts.homepage.primary.className} text-2xl font-bold text-white mb-6 flex items-center gap-2`}>
            <SparklesIcon className="h-6 w-6 text-purple-400" />
            Customize Your Mockup
          </h2>

          {/* User Selection */}
          <div className="mb-6">
            <label className="block text-white mb-3 font-semibold">
              Select User Profile:
            </label>
            <div className="grid gap-3">
              {sampleUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setUserId(user.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    userId === user.id 
                      ? 'border-purple-400 bg-purple-500/20' 
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-gray-400 text-sm">{user.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div className="mb-8">
            <label className="block text-white mb-3 font-semibold">
              Choose Template:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setTemplate(tmpl.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 text-center ${
                    template === tmpl.id 
                      ? 'border-purple-400 bg-purple-500/20' 
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <PhotoIcon className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-white text-sm font-medium">{tmpl.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateMockup}
            disabled={isGenerating || !userId}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <QrCodeIcon className="h-5 w-5" />
                Generate QR Mockup
              </>
            )}
          </button>

          {/* Profile Link Preview */}
          {userId && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">QR Code will link to:</p>
              <a 
                href={`/profile/${userId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors break-all"
              >
                https://fashun.co.in/profile/{userId}
              </a>
            </div>
          )}
        </motion.div>

        {/* Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
        >
          <h2 className={`${pagefonts.homepage.primary.className} text-2xl font-bold text-white mb-6 flex items-center gap-2`}>
            <PhotoIcon className="h-6 w-6 text-purple-400" />
            Preview
          </h2>

          <div className="bg-white/5 rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center">
            {mockupUrl ? (
              <div className="text-center">
                <img 
                  src={mockupUrl} 
                  alt="Generated Mockup"
                  className="max-w-full h-auto rounded-lg shadow-2xl mb-6"
                  style={{ maxHeight: '400px' }}
                />
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={downloadMockup}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={() => window.open(mockupUrl, '_blank')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors flex items-center gap-2"
                  >
                    <ShareIcon className="h-4 w-4" />
                    Open Full Size
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <QrCodeIcon className="h-24 w-24 mx-auto mb-4 text-gray-600" />
                <p className={`${pagefonts.content.primary.className} text-lg mb-2`}>
                  No mockup generated yet
                </p>
                <p className="text-sm">
                  Click "Generate QR Mockup" to create your first mockup
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 grid md:grid-cols-3 gap-8"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <QrCodeIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
            Smart QR Codes
          </h3>
          <p className="text-gray-300 text-sm">
            Dynamic QR codes that link directly to user profiles with all their social media and style preferences.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <PhotoIcon className="h-12 w-12 text-pink-400 mx-auto mb-4" />
          <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
            Multiple Templates
          </h3>
          <p className="text-gray-300 text-sm">
            Choose from various apparel templates including t-shirts, hoodies, and more premium options.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <SparklesIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
            High Quality
          </h3>
          <p className="text-gray-300 text-sm">
            Professional-grade mockups perfect for social media, marketing, and print-ready designs.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default QRMockupGenerator;