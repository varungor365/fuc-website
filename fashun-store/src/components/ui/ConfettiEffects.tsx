'use client';

import React from 'react';
import confetti from 'canvas-confetti';

interface ConfettiConfig {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  shapes?: string[];
  scalar?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
}

class ConfettiEffects {
  // Celebration when user gets 100th profile scan
  static profileMilestone() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Burst from bottom left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });

      // Burst from bottom right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }

  // First T-shirt order celebration
  static firstOrder() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    
    // Sequential bursts
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
        shapes: ['star', 'circle'],
        scalar: 1.2
      });
    }, 0);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        shapes: ['star', 'circle'],
        scalar: 1.2
      });
    }, 300);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        shapes: ['star', 'circle'],
        scalar: 1.2
      });
    }, 600);
  }

  // Design completion celebration
  static designComplete() {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: 0.8 },
      colors: ['#FFD700', '#FFA500', '#FF4500', '#DC143C', '#8A2BE2'],
      shapes: ['star', 'circle', 'square'],
      scalar: 0.8,
      gravity: 0.8,
      drift: 0.2
    });
  }

  // Achievement unlock
  static achievement() {
    const end = Date.now() + (2 * 1000);
    const colors = ['#FFD700', '#FFA500', '#FF6347'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        shapes: ['star'],
        scalar: 1.5
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        shapes: ['star'],
        scalar: 1.5
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  // Purchase success
  static purchaseSuccess() {
    confetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.3 },
      colors: ['#00FF00', '#32CD32', '#7CFC00', '#ADFF2F', '#9AFF9A'],
      shapes: ['circle'],
      scalar: 1.0,
      gravity: 1.2
    });
  }

  // Custom celebration
  static custom(config: ConfettiConfig) {
    confetti({
      particleCount: config.particleCount || 100,
      spread: config.spread || 70,
      origin: config.origin || { y: 0.6 },
      colors: config.colors || ['#FFD700', '#FF6B6B', '#4ECDC4'],
      shapes: config.shapes as any || ['circle'],
      scalar: config.scalar || 1.0,
      gravity: config.gravity || 1.0,
      drift: config.drift || 0,
      ticks: config.ticks || 200
    });
  }

  // Fireworks effect
  static fireworks() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: randomInRange(10, 40),
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: {
          x: randomInRange(0.2, 0.8),
          y: randomInRange(0.2, 0.7)
        },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
        shapes: ['star', 'circle'],
        scalar: randomInRange(0.8, 1.2),
        gravity: randomInRange(0.4, 0.6),
        drift: randomInRange(-0.4, 0.4)
      });
    }, 200);
  }
}

// React Hook for easy use in components
export const useConfetti = () => {
  return {
    profileMilestone: ConfettiEffects.profileMilestone,
    firstOrder: ConfettiEffects.firstOrder,
    designComplete: ConfettiEffects.designComplete,
    achievement: ConfettiEffects.achievement,
    purchaseSuccess: ConfettiEffects.purchaseSuccess,
    fireworks: ConfettiEffects.fireworks,
    custom: ConfettiEffects.custom
  };
};

// Component wrapper for trigger-based confetti
interface ConfettiTriggerProps {
  children: React.ReactNode;
  effect: 'profileMilestone' | 'firstOrder' | 'designComplete' | 'achievement' | 'purchaseSuccess' | 'fireworks';
  onClick?: () => void;
}

export const ConfettiTrigger: React.FC<ConfettiTriggerProps> = ({ 
  children, 
  effect, 
  onClick 
}) => {
  const confetti = useConfetti();

  const handleClick = () => {
    confetti[effect]();
    onClick?.();
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export default ConfettiEffects;