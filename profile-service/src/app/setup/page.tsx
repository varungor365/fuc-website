'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  PaintBrushIcon, 
  LinkIcon, 
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  DevicePhoneMobileIcon,
  SwatchIcon,
  CameraIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ProfileSetupData {
  username: string;
  displayName: string;
  bio: string;
  location: string;
  theme: string;
  avatar?: File | null;
  coverImage?: File | null;
  links: Array<{
    id: string;
    title: string;
    url: string;
    icon: string;
  }>;
}

const themes = {
  minimalist: {
    name: 'Minimalist',
    description: 'Clean and simple design with subtle colors',
    preview: 'bg-gradient-to-br from-gray-50 to-white',
    accent: 'bg-gray-900'
  },
  vibrant: {
    name: 'Vibrant',
    description: 'Bold gradients and eye-catching colors',
    preview: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    accent: 'bg-white'
  },
  dark: {
    name: 'Dark Mode',
    description: 'Sleek dark theme perfect for night viewing',
    preview: 'bg-gradient-to-br from-gray-900 via-black to-gray-800',
    accent: 'bg-white'
  }
};

const linkIcons = [
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'shopping', name: 'Shop', icon: '🛍️' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'web', name: 'Website', icon: '🌐' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'github', name: 'GitHub', icon: '⚡' }
];

export default function ProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileSetupData>({
    username: '',
    displayName: '',
    bio: '',
    location: '',
    theme: 'vibrant',
    avatar: null,
    coverImage: null,
    links: []
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // In production, this would save to Supabase
    console.log('Profile setup complete:', profileData);
    // Redirect to the new profile
    window.location.href = `/${profileData.username}`;
  };

  const addLink = () => {
    const newLink = {
      id: Date.now().toString(),
      title: '',
      url: '',
      icon: 'web'
    };
    setProfileData({
      ...profileData,
      links: [...profileData.links, newLink]
    });
  };

  const updateLink = (id: string, field: string, value: string) => {
    setProfileData({
      ...profileData,
      links: profileData.links.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    });
  };

  const removeLink = (id: string) => {
    setProfileData({
      ...profileData,
      links: profileData.links.filter(link => link.id !== id)
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.username && profileData.displayName;
      case 2:
        return profileData.theme;
      case 3:
        return true; // Links are optional
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <SparklesIcon className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Digital Identity</h1>
          <p className="text-white/70">Set up your phygital profile in just a few steps</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Step {currentStep} of {totalSteps}</span>
            <span className="text-white/60 text-sm">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <UserIcon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
                  <p className="text-white/60">Tell us about yourself</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Username *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">@</span>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 pl-8 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                        placeholder="your_username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none h-24 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                    placeholder="City, Country"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Theme Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <SwatchIcon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-white mb-2">Choose Your Style</h2>
                  <p className="text-white/60">Select a theme that represents you</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(themes).map(([key, theme]) => (
                    <motion.button
                      key={key}
                      onClick={() => setProfileData({ ...profileData, theme: key })}
                      className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                        profileData.theme === key
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-full h-24 rounded-lg mb-4 ${theme.preview}`} />
                      <h3 className="text-white font-semibold mb-1">{theme.name}</h3>
                      <p className="text-white/60 text-sm">{theme.description}</p>
                      
                      {profileData.theme === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                        >
                          <CheckIcon className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Links */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <LinkIcon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-white mb-2">Add Your Links</h2>
                  <p className="text-white/60">Connect your social media and important links</p>
                </div>

                <div className="space-y-4">
                  {profileData.links.map((link, index) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex gap-4 items-start">
                        <select
                          value={link.icon}
                          onChange={(e) => updateLink(link.id, 'icon', e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm min-w-[120px]"
                        >
                          {linkIcons.map((icon) => (
                            <option key={icon.id} value={icon.id} className="bg-gray-800">
                              {icon.icon} {icon.name}
                            </option>
                          ))}
                        </select>
                        
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm"
                            placeholder="Link title"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm"
                            placeholder="https://..."
                          />
                        </div>
                        
                        <button
                          onClick={() => removeLink(link.id)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  <button
                    onClick={addLink}
                    className="w-full border-2 border-dashed border-white/30 rounded-lg p-4 text-white/60 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add Link
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <EyeIcon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-white mb-2">Review Your Profile</h2>
                  <p className="text-white/60">Everything looks good? Let's create your profile!</p>
                </div>

                {/* Profile Preview */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{profileData.displayName}</h3>
                      <p className="text-white/60">@{profileData.username}</p>
                      {profileData.bio && <p className="text-white/80 text-sm mt-1">{profileData.bio}</p>}
                      {profileData.location && <p className="text-white/60 text-sm">📍 {profileData.location}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Theme: {themes[profileData.theme as keyof typeof themes].name}</h4>
                    <div className={`h-8 rounded-lg ${themes[profileData.theme as keyof typeof themes].preview}`} />
                  </div>

                  {profileData.links.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Links ({profileData.links.length})</h4>
                      <div className="space-y-2">
                        {profileData.links.slice(0, 3).map((link) => (
                          <div key={link.id} className="flex items-center gap-2 text-white/80 text-sm">
                            <span>{linkIcons.find(icon => icon.id === link.icon)?.icon}</span>
                            <span>{link.title || 'Untitled Link'}</span>
                          </div>
                        ))}
                        {profileData.links.length > 3 && (
                          <p className="text-white/60 text-sm">+{profileData.links.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:cursor-not-allowed"
              >
                Next
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                <CheckIcon className="w-5 h-5" />
                Create Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}