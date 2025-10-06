

'use client';

import { useState } from 'react';
import { Ruler, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SizeGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fit, setFit] = useState('regular');
  const [recommendation, setRecommendation] = useState('');

  const calculateSize = () => {
    const h = parseInt(height);
    const w = parseInt(weight);
    if (!h || !w) return;

    let size = '';
    if (h < 165 && w < 60) size = 'S';
    else if (h < 175 && w < 70) size = 'M';
    else if (h < 185 && w < 85) size = 'L';
    else size = 'XL';

    if (fit === 'loose') size = size === 'S' ? 'M' : size === 'M' ? 'L' : 'XL';
    setRecommendation(size);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
        <Ruler className="w-4 h-4" />
        Size Guide
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">AI Size Assistant</h3>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Height (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="170" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="70" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Fit</label>
                  <div className="flex gap-2">
                    {['snug', 'regular', 'loose'].map(f => (
                      <button key={f} onClick={() => setFit(f)} className={`flex-1 py-2 rounded-lg border-2 capitalize ${fit === f ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={calculateSize} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold">
                  Get Recommendation
                </button>

                {recommendation && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">We recommend</p>
                    <p className="text-3xl font-bold text-green-600">{recommendation}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
