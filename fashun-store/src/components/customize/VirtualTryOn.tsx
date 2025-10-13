'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraIcon, ArrowDownTrayIcon, ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/hooks/useCart';

interface VirtualTryOnProps {
  customTshirtImage: string;
  onBack: () => void;
  productDetails: {
    name: string;
    price: number;
    color: string;
    size: string;
  };
}

export default function VirtualTryOn({ customTshirtImage, onBack, productDetails }: VirtualTryOnProps) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const photoData = event.target?.result as string;
      setUserPhoto(photoData);
      processVirtualTryOn(photoData);
    };
    reader.readAsDataURL(file);
  };

  const processVirtualTryOn = async (photoData: string) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhoto: photoData,
          tshirtDesign: customTshirtImage,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.image) {
        setTryOnResult(result.image);
      } else {
        setTryOnResult(photoData);
      }
    } catch (error) {
      console.error('Virtual try-on failed:', error);
      setTryOnResult(photoData);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: `custom-${Date.now()}`,
      name: productDetails.name,
      price: productDetails.price,
      image: customTshirtImage,
      size: productDetails.size,
      color: productDetails.color,
      customization: {
        design: customTshirtImage,
      },
    });
    alert('Added to cart!');
  };

  const handleDownload = () => {
    if (!tryOnResult) return;
    
    const link = document.createElement('a');
    link.href = tryOnResult;
    link.download = 'virtual-tryon-result.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Editor
            </button>
            <h1 className="text-3xl font-bold">Virtual Try-On</h1>
            <div className="w-32" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Your Custom Design</h3>
                <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                  <img src={customTshirtImage} alt="Custom design" className="w-full h-full object-contain" />
                </div>
              </div>

              {!userPhoto && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Upload Your Photo</h3>
                  <p className="text-gray-400 mb-4">
                    Upload a full-body photo to see how your custom design looks on you!
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <CameraIcon className="w-6 h-6" />
                    Upload Photo
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Try-On Result</h3>
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
                        <p className="text-lg">Processing your try-on...</p>
                        <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
                      </div>
                    </motion.div>
                  ) : tryOnResult ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="aspect-square bg-gray-700 rounded-lg overflow-hidden"
                    >
                      <img src={tryOnResult} alt="Try-on result" className="w-full h-full object-cover" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center"
                    >
                      <div className="text-center text-gray-500">
                        <CameraIcon className="w-16 h-16 mx-auto mb-4" />
                        <p>Upload a photo to see the result</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {tryOnResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-3"
                >
                  <button
                    onClick={handleAddToCart}
                    className="col-span-2 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleDownload}
                    className="py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}