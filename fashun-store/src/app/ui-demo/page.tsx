'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnhancedButton, AchievementSystem, ProfileStats } from '@/components/ui/AdvancedUIProvider';
import { ConfettiTrigger } from '@/components/ui/ConfettiEffects';
import { WithSoundEffects } from '@/components/ui/SoundEffects';
import { TourTrigger } from '@/components/ui/GuidedTour';
import GenerativeBackground from '@/components/ui/GenerativeBackground';
import {
  SparklesIcon,
  CommandLineIcon,
  SpeakerWaveIcon,
  QuestionMarkCircleIcon,
  FireIcon,
  StarIcon,
  TrophyIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const AdvancedUIDemo = () => {
  const [profileStats, setProfileStats] = useState({
    profileViews: 95,
    designsCreated: 0,
    ordersPlaced: 0
  });

  const [achievements, setAchievements] = useState([
    { id: 'first-visit', title: 'Welcome!', description: 'Visited the platform for the first time', unlocked: true },
    { id: 'explorer', title: 'Explorer', description: 'Checked out the AI features', unlocked: true },
    { id: 'designer', title: 'Designer', description: 'Created your first design', unlocked: false },
    { id: 'social', title: 'Social Butterfly', description: 'Got 100 profile views', unlocked: false },
    { id: 'customer', title: 'First Purchase', description: 'Made your first order', unlocked: false },
  ]);

  const incrementStat = (stat: keyof typeof profileStats, amount: number) => {
    setProfileStats(prev => ({
      ...prev,
      [stat]: prev[stat] + amount
    }));

    // Unlock achievements based on stats
    if (stat === 'profileViews' && profileStats.profileViews + amount >= 100) {
      setAchievements(prev => prev.map(a => 
        a.id === 'social' ? { ...a, unlocked: true } : a
      ));
    }
    if (stat === 'designsCreated' && profileStats.designsCreated + amount >= 1) {
      setAchievements(prev => prev.map(a => 
        a.id === 'designer' ? { ...a, unlocked: true } : a
      ));
    }
    if (stat === 'ordersPlaced' && profileStats.ordersPlaced + amount >= 1) {
      setAchievements(prev => prev.map(a => 
        a.id === 'customer' ? { ...a, unlocked: true } : a
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Achievement and Stats Systems */}
      <AchievementSystem achievements={achievements} />
      <ProfileStats stats={profileStats} />

      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <GenerativeBackground 
          seed="advanced-ui-demo"
          variant="particles"
          animated={true}
          width={1920}
          height={1080}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6">
            Advanced UI/UX Features
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the next generation of user interface design with keyboard shortcuts, 
            realistic physics effects, AI-generated backgrounds, and intelligent user guidance.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <CommandLineIcon className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-semibold">Command Palette</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Press <kbd className="px-2 py-1 bg-white/20 rounded text-sm">Ctrl+K</kbd> to open 
              the command palette for lightning-fast navigation.
            </p>
            <WithSoundEffects soundOnClick="pop">
              <div className="bg-black/20 rounded-lg p-3 text-sm font-mono">
                <span className="text-gray-400">⌘K</span> <span className="text-white">Command Palette</span><br/>
                <span className="text-gray-400">Ctrl+Shift+T</span> <span className="text-white">Start Tour</span><br/>
                <span className="text-gray-400">Ctrl+Shift+M</span> <span className="text-white">Toggle Sound</span>
              </div>
            </WithSoundEffects>
          </motion.div>

          {/* Sound Effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <SpeakerWaveIcon className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-semibold">UI Sonification</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Subtle, satisfying sound effects make interactions feel more responsive and engaging.
            </p>
            <div className="space-y-2">
              <WithSoundEffects soundOnClick="click">
                <button className="w-full p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-sm transition-colors">
                  Click Sound
                </button>
              </WithSoundEffects>
              <WithSoundEffects soundOnClick="pop">
                <button className="w-full p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-sm transition-colors">
                  Pop Sound
                </button>
              </WithSoundEffects>
              <WithSoundEffects soundOnClick="chime">
                <button className="w-full p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-sm transition-colors">
                  Chime Sound
                </button>
              </WithSoundEffects>
            </div>
          </motion.div>

          {/* Confetti Effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <SparklesIcon className="w-8 h-8 text-yellow-400" />
              <h3 className="text-xl font-semibold">Celebration Effects</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Realistic, physics-based confetti for milestone achievements and special moments.
            </p>
            <div className="space-y-2">
              <ConfettiTrigger effect="achievement">
                <button className="w-full p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-sm transition-colors">
                  🏆 Achievement
                </button>
              </ConfettiTrigger>
              <ConfettiTrigger effect="purchaseSuccess">
                <button className="w-full p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-sm transition-colors">
                  💚 Purchase Success
                </button>
              </ConfettiTrigger>
              <ConfettiTrigger effect="fireworks">
                <button className="w-full p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors">
                  🎆 Fireworks
                </button>
              </ConfettiTrigger>
            </div>
          </motion.div>

          {/* Guided Tours */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <QuestionMarkCircleIcon className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-semibold">Guided Tours</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Interactive spotlight tours guide new users through the platform features.
            </p>
            <TourTrigger tourId="newUser">
              <EnhancedButton 
                variant="success" 
                size="sm" 
                soundEffect="chime"
                className="w-full"
              >
                Start Platform Tour
              </EnhancedButton>
            </TourTrigger>
          </motion.div>

          {/* Generative Backgrounds */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <FireIcon className="w-8 h-8 text-orange-400" />
              <h3 className="text-xl font-semibold">Generative Art</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Unique SVG patterns generated from user data ensure no two profiles look the same.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative h-16 rounded-lg overflow-hidden">
                <GenerativeBackground seed="user1" variant="geometric" width={200} height={100} />
              </div>
              <div className="relative h-16 rounded-lg overflow-hidden">
                <GenerativeBackground seed="user2" variant="organic" width={200} height={100} />
              </div>
              <div className="relative h-16 rounded-lg overflow-hidden">
                <GenerativeBackground seed="user3" variant="waves" width={200} height={100} />
              </div>
              <div className="relative h-16 rounded-lg overflow-hidden">
                <GenerativeBackground seed="user4" variant="particles" width={200} height={100} />
              </div>
            </div>
          </motion.div>

          {/* Enhanced Interactions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <GiftIcon className="w-8 h-8 text-pink-400" />
              <h3 className="text-xl font-semibold">Smart Interactions</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Buttons and interactions that combine sound, visual feedback, and celebration effects.
            </p>
            <div className="space-y-2">
              <EnhancedButton 
                variant="primary" 
                size="sm" 
                soundEffect="pop"
                confettiEffect="achievement"
                className="w-full"
              >
                🎉 Celebrate Achievement
              </EnhancedButton>
              <EnhancedButton 
                variant="success" 
                size="sm" 
                soundEffect="chime"
                confettiEffect="purchaseSuccess"
                className="w-full"
              >
                💚 Complete Purchase
              </EnhancedButton>
            </div>
          </motion.div>
        </div>

        {/* Interactive Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/20 rounded-3xl p-8"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Interactive Demo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Stats */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                <StarIcon className="w-6 h-6 text-yellow-400" />
                Profile Stats
              </h3>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">{profileStats.profileViews}</div>
                  <div className="text-sm text-gray-300">Profile Views</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-400">{profileStats.designsCreated}</div>
                  <div className="text-sm text-gray-300">Designs Created</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">{profileStats.ordersPlaced}</div>
                  <div className="text-sm text-gray-300">Orders Placed</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                <SparklesIcon className="w-6 h-6 text-purple-400" />
                Try Actions
              </h3>
              <div className="space-y-3">
                <EnhancedButton 
                  onClick={() => incrementStat('profileViews', 10)}
                  variant="primary"
                  soundEffect="pop"
                  className="w-full"
                >
                  +10 Profile Views
                </EnhancedButton>
                <EnhancedButton 
                  onClick={() => incrementStat('designsCreated', 1)}
                  variant="secondary"
                  soundEffect="chime"
                  confettiEffect="designComplete"
                  className="w-full"
                >
                  Create Design
                </EnhancedButton>
                <EnhancedButton 
                  onClick={() => incrementStat('ordersPlaced', 1)}
                  variant="success"
                  soundEffect="achievement"
                  confettiEffect="purchaseSuccess"
                  className="w-full"
                >
                  Place Order
                </EnhancedButton>
              </div>
            </div>

            {/* Achievements */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                <TrophyIcon className="w-6 h-6 text-orange-400" />
                Achievements
              </h3>
              <div className="space-y-2">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'bg-green-500/20 border-green-400/30 text-green-100' 
                        : 'bg-gray-500/10 border-gray-600/30 text-gray-400'
                    }`}
                  >
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="text-xs opacity-75">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Quick Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>• Press <kbd className="px-1 bg-white/20 rounded">Ctrl+K</kbd> for command palette</div>
              <div>• Press <kbd className="px-1 bg-white/20 rounded">Ctrl+Shift+T</kbd> for guided tour</div>
              <div>• Press <kbd className="px-1 bg-white/20 rounded">Ctrl+Shift+M</kbd> to toggle sounds</div>
              <div>• Try the floating controls in the bottom-right corner</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedUIDemo;