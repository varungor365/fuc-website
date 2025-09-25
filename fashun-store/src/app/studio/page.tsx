'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pagefonts } from '@/lib/simpleFonts';
import { 
  UserCircleIcon,
  PaintBrushIcon,
  QrCodeIcon,
  SparklesIcon,
  ArrowRightIcon,
  CameraIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import SimpleTShirtCustomizer from '@/components/customizer/SimpleTShirtCustomizer';
import AvatarCreator from '@/components/avatar/AvatarCreator';

const StudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('avatar');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [customDesign, setCustomDesign] = useState<string>('');

  const tabs = [
    {
      id: 'avatar',
      name: '3D Avatar',
      icon: UserCircleIcon,
      description: 'Create your 3D avatar from a selfie'
    },
    {
      id: 'customizer',
      name: 'Design Studio',
      icon: PaintBrushIcon,
      description: 'Customize T-shirts with text and colors'
    },
    {
      id: 'integration',
      name: 'Virtual Try-On',
      icon: SparklesIcon,
      description: 'See your designs on your avatar'
    }
  ];

  const handleAvatarCreated = (url: string) => {
    setAvatarUrl(url);
    setActiveTab('customizer');
  };

  const handleDesignChange = (design: string) => {
    setCustomDesign(design);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${pagefonts.homepage.primary.className} text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6`}
          >
            FASHUN Design Studio
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${pagefonts.content.primary.className} text-2xl text-gray-300 max-w-4xl mx-auto`}
          >
            The complete fashion experience: Create your 3D avatar, design custom streetwear, 
            and see how it looks with virtual try-on technology.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-semibold">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${avatarUrl ? 'text-green-400' : 'text-gray-400'}`}>
                <UserCircleIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Avatar {avatarUrl ? '✓' : ''}</span>
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-500" />
              <div className={`flex items-center space-x-2 ${customDesign ? 'text-green-400' : 'text-gray-400'}`}>
                <PaintBrushIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Design {customDesign ? '✓' : ''}</span>
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-500" />
              <div className={`flex items-center space-x-2 ${avatarUrl && customDesign ? 'text-green-400' : 'text-gray-400'}`}>
                <SparklesIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Try-On {avatarUrl && customDesign ? '✓' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {activeTab === 'avatar' && (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <AvatarCreator onAvatarCreated={handleAvatarCreated} />
            </motion.div>
          )}

          {activeTab === 'customizer' && (
            <motion.div
              key="customizer"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <SimpleTShirtCustomizer onDesignChange={handleDesignChange} />
            </motion.div>
          )}

          {activeTab === 'integration' && (
            <motion.div
              key="integration"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="text-center py-20"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className={`${pagefonts.homepage.primary.className} text-4xl font-bold text-white mb-8`}>
                  Virtual Try-On Experience
                </h2>
                
                {avatarUrl && customDesign ? (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Your Avatar</h3>
                        <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                          <UserCircleIcon className="h-32 w-32 text-purple-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Your Design</h3>
                        <div className="aspect-square bg-white/5 rounded-xl p-4">
                          <img 
                            src={customDesign} 
                            alt="Custom design"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                        Apply Design to Avatar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20">
                    <div className="text-center">
                      <div className="flex justify-center space-x-8 mb-8">
                        <div className={`p-4 rounded-xl ${avatarUrl ? 'bg-green-500/20 border border-green-400' : 'bg-gray-500/20 border border-gray-400'}`}>
                          <UserCircleIcon className={`h-12 w-12 ${avatarUrl ? 'text-green-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex items-center">
                          <ArrowRightIcon className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className={`p-4 rounded-xl ${customDesign ? 'bg-green-500/20 border border-green-400' : 'bg-gray-500/20 border border-gray-400'}`}>
                          <SwatchIcon className={`h-12 w-12 ${customDesign ? 'text-green-400' : 'text-gray-400'}`} />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4">Complete Your Setup</h3>
                      <p className="text-gray-300 mb-8">
                        {!avatarUrl && !customDesign && "Create your 3D avatar and design a custom T-shirt to unlock virtual try-on."}
                        {avatarUrl && !customDesign && "Great! Now create a custom design to see it on your avatar."}
                        {!avatarUrl && customDesign && "Awesome design! Create your avatar to see how it looks on you."}
                      </p>
                      
                      <div className="flex justify-center space-x-4">
                        {!avatarUrl && (
                          <button
                            onClick={() => setActiveTab('avatar')}
                            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-semibold transition-colors flex items-center space-x-2"
                          >
                            <CameraIcon className="h-5 w-5" />
                            <span>Create Avatar</span>
                          </button>
                        )}
                        {!customDesign && (
                          <button
                            onClick={() => setActiveTab('customizer')}
                            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-lg text-white font-semibold transition-colors flex items-center space-x-2"
                          >
                            <PaintBrushIcon className="h-5 w-5" />
                            <span>Design T-Shirt</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid md:grid-cols-4 gap-6"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <UserCircleIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
              3D Avatars
            </h3>
            <p className="text-gray-300 text-sm">
              Create realistic 3D avatars from selfies using Ready Player Me technology.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <PaintBrushIcon className="h-12 w-12 text-pink-400 mx-auto mb-4" />
            <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
              Custom Design
            </h3>
            <p className="text-gray-300 text-sm">
              Design custom T-shirts with text, colors, and advanced editing tools.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <QrCodeIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
              QR Integration
            </h3>
            <p className="text-gray-300 text-sm">
              Generate QR codes and mockups for your designs and profiles.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <SparklesIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
              Virtual Try-On
            </h3>
            <p className="text-gray-300 text-sm">
              See how your custom designs look on your 3D avatar before ordering.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudioPage;