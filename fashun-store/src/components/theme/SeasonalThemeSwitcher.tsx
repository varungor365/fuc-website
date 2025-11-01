'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { 
  SparklesIcon, 
  GiftIcon, 
  SunIcon as SunIconOutline,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const seasonalThemes = [
  {
    id: 'default',
    name: 'Default',
    icon: '🎨',
    description: 'Classic FASHUN style',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'halloween',
    name: 'Halloween',
    icon: '🎃',
    description: 'Spooky season vibes',
    gradient: 'from-orange-500 to-purple-600'
  },
  {
    id: 'christmas',
    name: 'Christmas',
    icon: '🎄',
    description: 'Festive holiday spirit',
    gradient: 'from-red-500 to-green-500'
  },
  {
    id: 'summer',
    name: 'Summer',
    icon: '☀️',
    description: 'Bright & vibrant',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'spring',
    name: 'Spring',
    icon: '🌸',
    description: 'Fresh & blooming',
    gradient: 'from-pink-400 to-purple-400'
  }
] as const;

export default function SeasonalThemeSwitcher() {
  const { seasonalTheme, setSeasonalTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = seasonalThemes.find(t => t.id === seasonalTheme) || seasonalThemes[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
        aria-label="Change seasonal theme"
      >
        <span className="text-xl">{currentTheme.icon}</span>
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Theme Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Seasonal Themes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your vibe
                </p>
              </div>

              {/* Theme Options */}
              <div className="p-2 max-h-[400px] overflow-y-auto">
                {seasonalThemes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setSeasonalTheme(theme.id as any);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                      seasonalTheme === theme.id
                        ? 'bg-gradient-to-r ' + theme.gradient + ' text-white shadow-lg'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg text-2xl ${
                      seasonalTheme === theme.id
                        ? 'bg-white/20'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {theme.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{theme.name}</div>
                      <div className={`text-sm ${
                        seasonalTheme === theme.id
                          ? 'text-white/80'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {theme.description}
                      </div>
                    </div>
                    {seasonalTheme === theme.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Themes change colors, patterns & special effects
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
