'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import Link from 'next/link';

interface CountdownTimerProps {
  launchDate: Date;
  collectionName: string;
  collectionSlug: string;
  onDismiss?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CollectionCountdownTimer({
  launchDate,
  collectionName,
  collectionSlug,
  onDismiss
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [isVisible, setIsVisible] = useState(true);
  const [isLaunched, setIsLaunched] = useState(false);

  function calculateTimeLeft(): TimeLeft {
    const difference = +launchDate - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if countdown has reached zero
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setIsLaunched(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
    // Store in localStorage to not show again for this session
    localStorage.setItem(`countdown-dismissed-${collectionSlug}`, 'true');
  };

  // Check if user already dismissed this countdown
  useEffect(() => {
    const dismissed = localStorage.getItem(`countdown-dismissed-${collectionSlug}`);
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, [collectionSlug]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      className="relative z-30"
    >
      {/* Countdown Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
              )`
            }}
          />
        </div>

        <div className="container-custom relative">
          <div className="py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Launch Info */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-1">
                  {isLaunched ? '🔥 LIVE NOW!' : 'Launching Soon!'}
                </h3>
                <p className="text-white/90 font-medium">
                  {isLaunched ? `${collectionName} is now available!` : collectionName}
                </p>
              </div>
            </div>

            {/* Center: Countdown */}
            {!isLaunched && (
              <div className="flex items-center gap-3 md:gap-6">
                <CountdownUnit value={timeLeft.days} label="Days" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.hours} label="Hours" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.minutes} label="Mins" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.seconds} label="Secs" />
              </div>
            )}

            {/* Right: CTA */}
            <div className="flex items-center gap-3">
              <Link
                href={`/collections/${collectionSlug}`}
                className="px-6 md:px-8 py-3 md:py-4 bg-white text-orange-600 font-black rounded-xl hover:scale-105 transition-transform shadow-xl text-sm md:text-base whitespace-nowrap"
              >
                {isLaunched ? 'Shop Now 🔥' : 'Get Notified 🔔'}
              </Link>
              
              <button
                onClick={handleDismiss}
                className="p-2 md:p-3 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Dismiss countdown"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Pulsing Border Effect */}
        <motion.div
          animate={{
            scaleX: [1, 1.02, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-white"
        />
      </div>
    </motion.div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-14 h-14 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/30"
      >
        <span className="text-2xl md:text-4xl font-black text-white">
          {value.toString().padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-xs md:text-sm font-bold text-white/80 mt-2">
        {label}
      </span>
    </div>
  );
}

function CountdownSeparator() {
  return (
    <motion.div
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      className="text-3xl md:text-5xl font-black text-white mb-6"
    >
      :
    </motion.div>
  );
}
