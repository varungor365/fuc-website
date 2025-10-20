'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TryOnButtonProps {
  productId: string;
  productColor?: string;
  productName: string;
  productImageUrl?: string;
  garmentType?: 'tshirt' | 'hoodie' | 'jacket' | 'dress' | 'pants' | 'tank-top' | 'sweatshirt' | 'blazer';
}

export default function TryOnButton({ 
  productId, 
  productColor = 'black', 
  productName,
  productImageUrl,
  garmentType = 'tshirt'
}: TryOnButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState(productColor);
  const [opacity, setOpacity] = useState(0.7);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPlaceholderGarment = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 500;
      const ctx = canvas.getContext('2d')!;
      
      const colors: Record<string, string> = {
        black: '#000000',
        white: '#ffffff', 
        red: '#ff0000',
        blue: '#007AFF',
        green: '#00ff00',
        gray: '#808080',
        navy: '#000080',
        purple: '#800080',
        pink: '#ffc0cb',
        orange: '#ffa500',
        yellow: '#ffff00',
        brown: '#964b00'
      };
      
      ctx.fillStyle = colors[customColor] || customColor || '#007AFF';
      ctx.fillRect(0, 0, 400, 500);
      
      canvas.toBlob((blob) => {
        resolve(blob!);
      });
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setMockupUrl(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      let garmentBlob: Blob;
      
      if (productImageUrl) {
        try {
          const garmentResponse = await fetch(productImageUrl);
          garmentBlob = await garmentResponse.blob();
        } catch {
          garmentBlob = await createPlaceholderGarment();
        }
      } else {
        garmentBlob = await createPlaceholderGarment();
      }
      
      formData.append('garment', garmentBlob);
      formData.append('garmentType', garmentType);

      const response = await fetch('/api/mockup/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Virtual try-on failed');
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setMockupUrl(imageUrl);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadMockup = () => {
    if (!mockupUrl) return;
    const a = document.createElement('a');
    a.href = mockupUrl;
    a.download = `${productName}-virtual-tryon.png`;
    a.click();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Try On Yourself
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Virtual Try-On</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!mockupUrl && (
                <>
                  <div className="mb-6">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing Virtual Try-On...
                        </span>
                      ) : (
                        'Upload Your Full-Body Photo'
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                      <strong>Error:</strong> {error}
                    </div>
                  )}

                  {/* Customization Panel */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Customize Your Try-On</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Garment Color
                        </label>
                        <select
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                        >
                          <option value="black">Black</option>
                          <option value="white">White</option>
                          <option value="red">Red</option>
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>
                          <option value="gray">Gray</option>
                          <option value="navy">Navy</option>
                          <option value="purple">Purple</option>
                          <option value="pink">Pink</option>
                          <option value="orange">Orange</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opacity: {Math.round(opacity * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0.3"
                          max="1"
                          step="0.1"
                          value={opacity}
                          onChange={(e) => setOpacity(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                    <strong>Tips for best results:</strong>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>Use a clear, full-body photo</li>
                      <li>Stand straight with arms at your sides</li>
                      <li>Ensure good lighting and clear background</li>
                      <li>Wear fitted clothing for better pose detection</li>
                      <li>Face the camera directly</li>
                    </ul>
                  </div>
                </>
              )}

              {mockupUrl && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Your Virtual Try-On Result
                    </h3>
                    <img
                      src={mockupUrl}
                      alt="Virtual try-on result"
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={downloadMockup}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all"
                    >
                      Download Result
                    </button>
                    <button
                      onClick={() => {
                        if (mockupUrl) URL.revokeObjectURL(mockupUrl);
                        setMockupUrl(null);
                        setError(null);
                      }}
                      className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                    >
                      Try Another Photo
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}