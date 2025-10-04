'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Zap, Gift, Tag, X } from 'lucide-react';

interface CountdownTimerProps {
  endDate: Date;
  title?: string;
  description?: string;
  variant?: 'sale' | 'launch' | 'flash' | 'limited';
  size?: 'small' | 'medium' | 'large';
  showAnimation?: boolean;
  onExpire?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  title,
  description,
  variant = 'sale',
  size = 'medium',
  showAnimation = true,
  onExpire,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        onExpire?.();
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  if (isExpired) {
    return null; // Or show expired state
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'sale':
        return {
          container: 'bg-gradient-to-r from-red-600/20 via-red-500/20 to-red-600/20 border-red-500/30',
          text: 'text-red-300',
          accent: 'text-red-400',
          glow: 'shadow-red-500/20'
        };
      case 'launch':
        return {
          container: 'bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-600/20 border-blue-500/30',
          text: 'text-blue-300',
          accent: 'text-blue-400',
          glow: 'shadow-blue-500/20'
        };
      case 'flash':
        return {
          container: 'bg-gradient-to-r from-yellow-600/20 via-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
          text: 'text-yellow-300',
          accent: 'text-yellow-400',
          glow: 'shadow-yellow-500/20'
        };
      case 'limited':
        return {
          container: 'bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-purple-600/20 border-purple-500/30',
          text: 'text-purple-300',
          accent: 'text-purple-400',
          glow: 'shadow-purple-500/20'
        };
      default:
        return {
          container: 'bg-gradient-to-r from-accent-600/20 via-accent-500/20 to-accent-600/20 border-accent-500/30',
          text: 'text-accent-300',
          accent: 'text-accent-400',
          glow: 'shadow-accent-500/20'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-3',
          title: 'text-sm font-semibold',
          description: 'text-xs',
          timeUnit: 'text-lg font-bold',
          timeLabel: 'text-xs',
          icon: 'w-4 h-4'
        };
      case 'large':
        return {
          container: 'p-8',
          title: 'text-2xl font-bold',
          description: 'text-base',
          timeUnit: 'text-4xl font-bold',
          timeLabel: 'text-sm',
          icon: 'w-8 h-8'
        };
      default: // medium
        return {
          container: 'p-6',
          title: 'text-lg font-bold',
          description: 'text-sm',
          timeUnit: 'text-2xl font-bold',
          timeLabel: 'text-xs',
          icon: 'w-6 h-6'
        };
    }
  };

  const getVariantIcon = () => {
    switch (variant) {
      case 'sale':
        return <Tag className={sizeClasses.icon} />;
      case 'launch':
        return <Zap className={sizeClasses.icon} />;
      case 'flash':
        return <Zap className={sizeClasses.icon} />;
      case 'limited':
        return <Gift className={sizeClasses.icon} />;
      default:
        return <Clock className={sizeClasses.icon} />;
    }
  };

  const styles = getVariantStyles();
  const sizeClasses = getSizeClasses();

  const TimeUnit: React.FC<{ value: number; label: string; showAnimation?: boolean }> = ({ 
    value, 
    label, 
    showAnimation = true 
  }) => (
    <div className="flex flex-col items-center">
      <div className={`relative ${showAnimation ? 'transition-all duration-500' : ''}`}>
        <div className={`${styles.accent} ${sizeClasses.timeUnit} ${
          showAnimation && value < 10 ? 'animate-pulse' : ''
        } bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10`}>
          {value.toString().padStart(2, '0')}
        </div>
        {showAnimation && value < 5 && (
          <div className={`absolute inset-0 ${styles.accent} ${sizeClasses.timeUnit} animate-ping opacity-30 rounded-lg`}>
            {value.toString().padStart(2, '0')}
          </div>
        )}
      </div>
      <span className={`${styles.text} ${sizeClasses.timeLabel} font-medium mt-1 uppercase tracking-wide`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className={`
      ${styles.container} ${styles.glow} ${sizeClasses.container}
      backdrop-blur-md rounded-xl border relative overflow-hidden
      ${showAnimation ? 'animate-pulse-glow' : ''}
      ${className}
    `}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                      transform -skew-x-12 animate-shimmer"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        {(title || description) && (
          <div className="mb-4 text-center">
            <div className={`flex items-center justify-center gap-2 mb-2 ${styles.accent}`}>
              {getVariantIcon()}
              {title && (
                <h3 className={`${sizeClasses.title} ${styles.accent}`}>
                  {title}
                </h3>
              )}
            </div>
            {description && (
              <p className={`${sizeClasses.description} ${styles.text}`}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Countdown Display */}
        <div className="flex items-center justify-center gap-4">
          {timeLeft.days > 0 && (
            <>
              <TimeUnit value={timeLeft.days} label="Days" showAnimation={showAnimation} />
              <div className={`${styles.accent} text-2xl font-bold`}>:</div>
            </>
          )}
          
          <TimeUnit value={timeLeft.hours} label="Hours" showAnimation={showAnimation} />
          <div className={`${styles.accent} text-2xl font-bold animate-pulse`}>:</div>
          
          <TimeUnit value={timeLeft.minutes} label="Minutes" showAnimation={showAnimation} />
          <div className={`${styles.accent} text-2xl font-bold animate-pulse`}>:</div>
          
          <TimeUnit 
            value={timeLeft.seconds} 
            label="Seconds" 
            showAnimation={showAnimation && timeLeft.minutes < 5} 
          />
        </div>

        {/* Urgency Indicator */}
        {(timeLeft.days === 0 && timeLeft.hours < 2) && (
          <div className="mt-4 text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full 
                          bg-red-500/20 border border-red-500/30 ${showAnimation ? 'animate-bounce' : ''}`}>
              <Zap className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">
                {timeLeft.hours === 0 ? 'Final Hour!' : 'Hurry! Almost Gone!'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Animated Border */}
      {showAnimation && (
        <div className={`absolute inset-0 rounded-xl border-2 ${styles.accent} opacity-50 animate-pulse`}></div>
      )}
    </div>
  );
};

// Preset Countdown Components for common use cases
export const SaleCountdown: React.FC<Omit<CountdownTimerProps, 'variant'>> = (props) => (
  <CountdownTimer {...props} variant="sale" />
);

export const LaunchCountdown: React.FC<Omit<CountdownTimerProps, 'variant'>> = (props) => (
  <CountdownTimer {...props} variant="launch" />
);

export const FlashSaleCountdown: React.FC<Omit<CountdownTimerProps, 'variant'>> = (props) => (
  <CountdownTimer {...props} variant="flash" />
);

export const LimitedTimeCountdown: React.FC<Omit<CountdownTimerProps, 'variant'>> = (props) => (
  <CountdownTimer {...props} variant="limited" />
);

// Compact Inline Countdown for product cards
export const InlineCountdown: React.FC<{ endDate: Date; className?: string }> = ({ endDate, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!mounted) {
    return null;
  }

  const formatTime = () => {
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h`;
    }
    if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m`;
    }
    return `${timeLeft.minutes}:${timeLeft.seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 
                   rounded-full text-red-300 text-xs font-medium ${className}`}>
      <Clock className="w-3 h-3" />
      <span>{formatTime()}</span>
    </div>
  );
};

export default CountdownTimer;