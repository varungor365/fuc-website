'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
  title?: string;
  description?: string;
  onExpire?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  title = "Limited Time Offer",
  description = "Don't miss out on this exclusive deal!",
  onExpire
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        if (onExpire) {
          onExpire();
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (isExpired) {
    return (
      <div className="bg-gray-600 text-white p-6 rounded-lg text-center">
        <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <h3 className="text-lg font-semibold mb-1">Offer Expired</h3>
        <p className="text-gray-300">This deal has ended, but check out our other offers!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg">
      <div className="flex items-center justify-center mb-4">
        <Flame className="w-6 h-6 mr-2 text-yellow-400" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      
      <p className="text-center text-red-100 mb-6">{description}</p>
      
      <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
        <div className="text-center bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="text-xs text-red-200">Days</div>
        </div>
        <div className="text-center bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs text-red-200">Hours</div>
        </div>
        <div className="text-center bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs text-red-200">Minutes</div>
        </div>
        <div className="text-center bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs text-red-200">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;