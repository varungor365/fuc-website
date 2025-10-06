'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Lock, Unlock, Clock } from 'lucide-react';

export default function GameDrop({ dropDate, productId }: { dropDate: Date; productId: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(dropDate).getTime() - now;

      if (distance < 0) {
        setGameActive(true);
        clearInterval(timer);
      } else {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dropDate]);

  const playGame = () => {
    const newScore = score + Math.floor(Math.random() * 10) + 1;
    setScore(newScore);
    if (newScore >= 50) setUnlocked(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white rounded-2xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Zap className="w-8 h-8 mr-2 text-yellow-400" />
          <h2 className="text-3xl font-bold">Exclusive Drop</h2>
        </div>
        {unlocked ? <Unlock className="w-8 h-8 text-green-400" /> : <Lock className="w-8 h-8" />}
      </div>

      <AnimatePresence mode="wait">
        {!gameActive ? (
          <motion.div key="countdown" className="text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <p className="text-xl mb-4">Drop starts in:</p>
            <div className="flex justify-center gap-4 text-4xl font-bold">
              <div><span>{String(timeLeft.hours).padStart(2, '0')}</span><p className="text-sm">Hours</p></div>
              <span>:</span>
              <div><span>{String(timeLeft.minutes).padStart(2, '0')}</span><p className="text-sm">Minutes</p></div>
              <span>:</span>
              <div><span>{String(timeLeft.seconds).padStart(2, '0')}</span><p className="text-sm">Seconds</p></div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="game" className="text-center">
            <p className="text-xl mb-4">Click to unlock early access!</p>
            <div className="mb-6">
              <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                <motion.div className="bg-gradient-to-r from-green-400 to-blue-500 h-full" animate={{ width: `${(score / 50) * 100}%` }} />
              </div>
              <p className="mt-2">{score} / 50 points</p>
            </div>
            {!unlocked ? (
              <button onClick={playGame} className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-lg">Click Me!</button>
            ) : (
              <button onClick={() => window.location.href = `/products/${productId}`} className="px-8 py-4 bg-white text-purple-900 font-bold rounded-lg">Shop Now</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
