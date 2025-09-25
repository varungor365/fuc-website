'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pagefonts } from '@/lib/simpleFonts';
import { 
  UserCircleIcon,
  CameraIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface AvatarCreatorProps {
  onAvatarCreated?: (avatarUrl: string) => void;
}

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ onAvatarCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedGender, setSelectedGender] = useState('male');
  const [step, setStep] = useState(1);

  // Ready Player Me configuration
  const READY_PLAYER_ME_SUBDOMAIN = 'fashun';
  const API_KEY = 'sk_live_hXPnOoYDFzLvQP-7sQwcY7o3Q38zpE5yPND0';

  const avatarStyles = [
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic 3D avatars' },
    { id: 'stylized', name: 'Stylized', description: 'Cartoon-style avatars' },
    { id: 'anime', name: 'Anime', description: 'Anime-inspired look' }
  ];

  const generateAvatarFromSelfie = async (file: File) => {
    setIsLoading(true);
    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('style', selectedStyle);
      formData.append('gender', selectedGender);

      // Simulate API call (Ready Player Me integration)
      // In production, this would call Ready Player Me's avatar generation API
      const response = await fetch('/api/avatar/generate', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(data.avatarUrl);
        if (onAvatarCreated) {
          onAvatarCreated(data.avatarUrl);
        }
        setStep(3);
      } else {
        throw new Error('Failed to generate avatar');
      }
    } catch (error) {
      console.error('Avatar generation error:', error);
      // For demo purposes, use a placeholder avatar
      const demoAvatarUrl = `https://api.readyplayer.me/v1/avatars/${selectedGender}-${selectedStyle}-demo.glb`;
      setAvatarUrl(demoAvatarUrl);
      if (onAvatarCreated) {
        onAvatarCreated(demoAvatarUrl);
      }
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      generateAvatarFromSelfie(file);
    }
  };

  const launchAvatarCreator = () => {
    // Launch Ready Player Me's web-based avatar creator
    const creatorUrl = `https://${READY_PLAYER_ME_SUBDOMAIN}.readyplayer.me/avatar?frameApi`;
    window.open(creatorUrl, '_blank', 'width=800,height=600');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${pagefonts.homepage.primary.className} text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6`}
        >
          Create Your 3D Avatar
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${pagefonts.content.primary.className} text-xl text-gray-300 max-w-3xl mx-auto`}
        >
          Transform your selfie into a stunning 3D avatar for virtual try-ons and fashion experiences.
        </motion.p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= stepNumber 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-4 ${
                  step > stepNumber ? 'bg-purple-500' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          {/* Step 1: Style Selection */}
          {step >= 1 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className={`${pagefonts.homepage.primary.className} text-2xl font-bold text-white mb-6 flex items-center gap-2`}>
                <Cog6ToothIcon className="h-6 w-6 text-purple-400" />
                Choose Avatar Style
              </h2>
              
              <div className="space-y-4">
                {avatarStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedStyle === style.id
                        ? 'border-purple-400 bg-purple-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <h3 className="text-white font-semibold">{style.name}</h3>
                    <p className="text-gray-300 text-sm">{style.description}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Gender:</h3>
                <div className="flex gap-3">
                  {['male', 'female', 'non-binary'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setSelectedGender(gender)}
                      className={`px-4 py-2 rounded-lg capitalize transition-all ${
                        selectedGender === gender
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-semibold transition-colors"
              >
                Next: Upload Photo
              </button>
            </div>
          )}

          {/* Step 2: Photo Upload */}
          {step >= 2 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className={`${pagefonts.homepage.primary.className} text-2xl font-bold text-white mb-6 flex items-center gap-2`}>
                <CameraIcon className="h-6 w-6 text-pink-400" />
                Upload Your Selfie
              </h2>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="selfie-upload"
                  />
                  <label 
                    htmlFor="selfie-upload"
                    className="cursor-pointer block"
                  >
                    <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-white font-semibold mb-2">Click to upload your selfie</p>
                    <p className="text-gray-400 text-sm">PNG, JPG, or JPEG files up to 10MB</p>
                  </label>
                </div>

                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-4">Or create from scratch:</p>
                  <button
                    onClick={launchAvatarCreator}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors"
                  >
                    Launch Avatar Creator
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-4">
            <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
              <SparklesIcon className="h-4 w-4" />
              Pro Tips
            </h4>
            <ul className="text-purple-200 text-sm space-y-1">
              <li>• Use a clear, well-lit photo</li>
              <li>• Face the camera directly</li>
              <li>• Remove sunglasses and hats</li>
              <li>• Neutral expression works best</li>
            </ul>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
        >
          <h2 className={`${pagefonts.homepage.primary.className} text-2xl font-bold text-white mb-6 flex items-center gap-2`}>
            <EyeIcon className="h-6 w-6 text-orange-400" />
            Avatar Preview
          </h2>

          <div className="aspect-square bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl flex items-center justify-center">
            {isLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
                <p className="text-white">Generating your avatar...</p>
              </div>
            ) : avatarUrl ? (
              <div className="text-center">
                <div className="w-64 h-64 bg-white/10 rounded-xl mb-4 flex items-center justify-center">
                  <UserCircleIcon className="h-32 w-32 text-purple-400" />
                </div>
                <p className="text-white mb-4">Avatar generated successfully!</p>
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm flex items-center gap-2 mx-auto">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download Avatar
                </button>
              </div>
            ) : (
              <div className="text-center">
                <UserCircleIcon className="h-32 w-32 text-gray-500 mb-4" />
                <p className="text-gray-400">Your 3D avatar will appear here</p>
              </div>
            )}
          </div>

          {step >= 3 && avatarUrl && (
            <div className="mt-6 space-y-3">
              <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors">
                Try On Clothes
              </button>
              <button className="w-full px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white transition-colors">
                Share Avatar
              </button>
            </div>
          )}
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
          <SparklesIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
            AI-Powered
          </h3>
          <p className="text-gray-300 text-sm">
            Advanced AI technology transforms your selfie into a realistic 3D avatar in seconds.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <UserCircleIcon className="h-12 w-12 text-pink-400 mx-auto mb-4" />
          <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
            Virtual Try-On
          </h3>
          <p className="text-gray-300 text-sm">
            Use your avatar to try on FASHUN streetwear and see how you look before buying.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <CameraIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
            Multiple Styles
          </h3>
          <p className="text-gray-300 text-sm">
            Choose from realistic, stylized, or anime avatar styles to match your vibe.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarCreator;