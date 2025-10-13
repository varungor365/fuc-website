'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

const questions = [
  {
    id: 1,
    question: 'What\'s your style vibe?',
    options: ['Minimalist', 'Bold & Colorful', 'Streetwear', 'Vintage'],
  },
  {
    id: 2,
    question: 'Preferred fit?',
    options: ['Slim Fit', 'Regular Fit', 'Oversized', 'Relaxed'],
  },
  {
    id: 3,
    question: 'Favorite colors?',
    options: ['Black & White', 'Earth Tones', 'Bright Colors', 'Pastels'],
  },
];

export default function StyleQuiz() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      localStorage.setItem('stylePreferences', JSON.stringify(newAnswers));
      setIsOpen(false);
      setCurrentQ(0);
      setAnswers([]);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-24 md:bottom-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform z-30 flex items-center gap-2"
      >
        <SparklesIcon className="w-5 h-5" />
        <span className="font-semibold">Find Your Style</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border border-purple-500/50 relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    {questions.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${i <= currentQ ? 'bg-purple-600' : 'bg-gray-700'}`}
                      />
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {questions[currentQ].question}
                  </h2>
                  <p className="text-gray-400">Question {currentQ + 1} of {questions.length}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {questions[currentQ].options.map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(option)}
                      className="bg-gray-800 hover:bg-purple-600 text-white p-4 rounded-xl font-semibold transition-colors"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
