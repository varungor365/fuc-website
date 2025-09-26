'use client';

import React, { useEffect, useState } from 'react';
import CommandPalette, { useCommandPalette } from './CommandPalette';
import { useSoundEffects, WithSoundEffects } from './SoundEffects';
import { useConfetti, ConfettiTrigger } from './ConfettiEffects';
// import GenerativeBackground from './GenerativeBackground';
import GuidedTour, { TOURS, TourTrigger, useTour } from './GuidedTour';
import { 
  CommandLineIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  SparklesIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface AdvancedUIProviderProps {
  children: React.ReactNode;
  enableCommandPalette?: boolean;
  enableSoundEffects?: boolean;
  enableTours?: boolean;
  autoStartNewUserTour?: boolean;
  username?: string;
}

const AdvancedUIProvider: React.FC<AdvancedUIProviderProps> = ({
  children,
  enableCommandPalette = true,
  enableSoundEffects = true,
  enableTours = true,
  autoStartNewUserTour = true,
  username = 'user'
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const sounds = useSoundEffects();
  const confetti = useConfetti();
  const { startTour: startNewUserTour, isCompleted: isNewUserTourCompleted } = useTour('new-user-onboarding');
  
  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K or Cmd+K for command palette
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        // Command palette is handled by KBar internally
      }
      
      // Ctrl+Shift+T for tour
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        startNewUserTour();
      }
      
      // Ctrl+Shift+M for sound toggle
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'M') {
        event.preventDefault();
        sounds.toggle();
        setSoundEnabled(!sounds.isMuted());
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sounds, startNewUserTour]);

  // Auto-start new user tour
  useEffect(() => {
    if (autoStartNewUserTour && enableTours && !isNewUserTourCompleted()) {
      setTimeout(() => {
        startNewUserTour();
      }, 2000);
    }
  }, [autoStartNewUserTour, enableTours, isNewUserTourCompleted, startNewUserTour]);

  const content = (
    <div className="relative min-h-screen">
      {/* Generative Background for Profile Pages - Disabled temporarily to prevent hydration issues */}
      {username && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10" />
        </div>
      )}
      
      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Floating UI Controls */}
      <FloatingControls 
        soundEnabled={soundEnabled}
        onSoundToggle={() => {
          sounds.toggle();
          setSoundEnabled(!sounds.isMuted());
        }}
        onStartTour={startNewUserTour}
        onTriggerConfetti={() => {/* confetti.achievement() */ console.log('Confetti disabled - purchase success only');}}  // Disabled annoying celebration
      />
      
      {/* Guided Tours */}
      {enableTours && (
        <>
          <GuidedTour
            tourId="new-user-onboarding"
            steps={TOURS.newUser.steps}
            autoStart={false}
            onComplete={() => {
              // confetti.achievement(); // Commented out - annoying celebration
              sounds.achievement();
            }}
          />
          
          <GuidedTour
            tourId="design-studio-tour"
            steps={TOURS.designStudio.steps}
            autoStart={false}
            onComplete={() => {
              // confetti.designComplete(); // Commented out - annoying celebration
              sounds.chime();
            }}
          />
        </>
      )}
    </div>
  );

  // Wrap with command palette if enabled
  return enableCommandPalette ? (
    <CommandPalette>{content}</CommandPalette>
  ) : content;
};

// Floating Controls Component
interface FloatingControlsProps {
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onStartTour: () => void;
  onTriggerConfetti: () => void;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  soundEnabled,
  onSoundToggle,
  onStartTour,
  onTriggerConfetti
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toggle: toggleCommandPalette } = useCommandPalette();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col gap-3">
        {/* Expanded Controls */}
        {isExpanded && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-200">
            {/* Sound Toggle */}
            <WithSoundEffects soundOnClick="click">
              <button
                onClick={onSoundToggle}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-200 group"
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              >
                {soundEnabled ? (
                  <SpeakerWaveIcon className="w-5 h-5 text-white group-hover:text-purple-300" />
                ) : (
                  <SpeakerXMarkIcon className="w-5 h-5 text-white/50 group-hover:text-white" />
                )}
              </button>
            </WithSoundEffects>
            
            {/* Command Palette Trigger */}
            <WithSoundEffects soundOnClick="click">
              <button
                onClick={toggleCommandPalette}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-200 group"
                title="Open command palette (Ctrl+K)"
              >
                <CommandLineIcon className="w-5 h-5 text-white group-hover:text-blue-300" />
              </button>
            </WithSoundEffects>
            
            {/* Tour Trigger */}
            <WithSoundEffects soundOnClick="click">
              <button
                onClick={onStartTour}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-200 group"
                title="Start guided tour (Ctrl+Shift+T)"
              >
                <QuestionMarkCircleIcon className="w-5 h-5 text-white group-hover:text-green-300" />
              </button>
            </WithSoundEffects>
            
            {/* Confetti Trigger - Disabled for annoying celebrations */}
            {/* <ConfettiTrigger effect="achievement"> */}
              <WithSoundEffects soundOnClick="chime">
                <button
                  onClick={onTriggerConfetti}
                  className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-200 group"
                  title="Celebrate! 🎉 (Disabled - purchase success only)"
                >
                  <SparklesIcon className="w-5 h-5 text-white group-hover:text-yellow-300" />
                </button>
              </WithSoundEffects>
            {/* </ConfettiTrigger> */}
          </div>
        )}
        
        {/* Main Toggle Button */}
        <WithSoundEffects soundOnClick="pop">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 ${
              isExpanded ? 'rotate-45' : 'hover:scale-110'
            }`}
            title="UI Controls"
          >
            <SparklesIcon className="w-6 h-6 text-white" />
          </button>
        </WithSoundEffects>
      </div>
    </div>
  );
};

// Achievement System Component
interface AchievementSystemProps {
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
  }>;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({ achievements }) => {
  const confetti = useConfetti();
  const sounds = useSoundEffects();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check for newly unlocked achievements
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const lastChecked = localStorage.getItem('lastAchievementCheck');
    const currentCount = unlockedAchievements.length.toString();
    
    if (lastChecked && parseInt(lastChecked) < unlockedAchievements.length) {
      // New achievement unlocked!
      setTimeout(() => {
        // confetti.achievement(); // Commented out - annoying celebration
        sounds.achievement();
      }, 500);
    }
    
    localStorage.setItem('lastAchievementCheck', currentCount);
  }, [achievements, confetti, sounds]);

  return null; // This is just a logic component
};

// Profile Stats Component with Milestone Celebrations
interface ProfileStatsProps {
  stats: {
    profileViews: number;
    designsCreated: number;
    ordersPlaced: number;
  };
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const confetti = useConfetti();
  const sounds = useSoundEffects();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check for milestones
    const milestones = [
      { key: 'profileViews', value: stats.profileViews, targets: [100, 500, 1000] },
      { key: 'designsCreated', value: stats.designsCreated, targets: [1, 10, 50] },
      { key: 'ordersPlaced', value: stats.ordersPlaced, targets: [1, 5, 25] }
    ];
    
    milestones.forEach(milestone => {
      milestone.targets.forEach(target => {
        const storageKey = `milestone_${milestone.key}_${target}`;
        if (milestone.value >= target && !localStorage.getItem(storageKey)) {
          localStorage.setItem(storageKey, 'true');
          
          // Trigger celebration
          setTimeout(() => {
            if (milestone.key === 'profileViews' && target === 100) {
              // confetti.profileMilestone(); // Commented out - annoying celebration
            } else if (milestone.key === 'ordersPlaced' && target === 1) {
              confetti.firstOrder(); // Keep first order celebration - this is purchase success related
            } else {
              // confetti.achievement(); // Commented out - annoying celebration
            }
            sounds.achievement();
          }, 1000);
        }
      });
    });
  }, [stats, confetti, sounds]);

  return null; // This is just a logic component
};

// Enhanced Button Component with all effects
interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  soundEffect?: 'click' | 'pop' | 'chime';
  confettiEffect?: 'achievement' | 'purchaseSuccess' | 'designComplete';
  className?: string;
  disabled?: boolean;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  soundEffect = 'click',
  confettiEffect,
  className = '',
  disabled = false
}) => {
  const confetti = useConfetti();
  
  const handleClick = () => {
    if (confettiEffect && !disabled) {
      confetti[confettiEffect]();
    }
    onClick?.();
  };

  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <WithSoundEffects soundOnClick={soundEffect}>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          ${variants[variant]}
          ${sizes[size]}
          rounded-lg font-medium transition-all duration-200
          hover:scale-105 hover:shadow-lg
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          backdrop-blur-sm
          ${className}
        `}
      >
        {children}
      </button>
    </WithSoundEffects>
  );
};

export default AdvancedUIProvider;