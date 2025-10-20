'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon, QrCodeIcon, LinkIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface PhygitalUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productPrice: number;
  onUpgrade: (upgraded: boolean) => void;
}

export default function PhygitalUpgradeModal({
  isOpen,
  onClose,
  productName,
  productPrice,
  onUpgrade
}: PhygitalUpgradeModalProps) {
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<'regular' | 'phygital' | null>(null);

  const handleSelection = (option: 'regular' | 'phygital') => {
    setSelectedOption(option);
    if (option === 'phygital') {
      setStep(2);
    } else {
      onUpgrade(false);
      onClose();
    }
  };

  const handleConfirmUpgrade = async () => {
    // In production, this would check if user has a custom QR code
    // and include that information in the order
    const orderData = {
      productName,
      productPrice,
      isPhygital: true,
      useCustomQR: true, // This would be determined by checking user's profile
      timestamp: new Date().toISOString()
    };
    
    console.log('Phygital order created:', orderData);
    onUpgrade(true);
    onClose();
  };

  const phygitalFeatures = [
    {
      icon: <QrCodeIcon className="w-6 h-6" />,
      title: "Unique QR Code",
      description: "Each item gets a personalized QR code linking to your digital profile"
    },
    {
      icon: <LinkIcon className="w-6 h-6" />,
      title: "Digital Identity",
      description: "Connect your physical fashion to your online presence"
    },
    {
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      title: "Social Integration",
      description: "Share your style story across all your social platforms"
    },
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: "Premium Features",
      description: "Access exclusive digital features and analytics"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-white">Upgrade to Phygital</h2>
                <p className="text-gray-400 text-sm mt-1">{productName}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {step === 1 && (
              <div className="p-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Choose Your Purchase Option
                  </h3>
                  <p className="text-gray-400">
                    Transform your fashion into a digital experience
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Regular Option */}
                  <motion.button
                    onClick={() => handleSelection('regular')}
                    className="group relative p-6 rounded-xl border-2 border-gray-700 hover:border-gray-600 transition-all text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">Regular Purchase</h4>
                      <div className="text-2xl font-bold text-white">
                        ₹{productPrice.toLocaleString()}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Just the physical item delivered to your door
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>✓ High-quality physical product</li>
                      <li>✓ Standard shipping</li>
                      <li>✓ 30-day return policy</li>
                    </ul>
                  </motion.button>

                  {/* Phygital Option */}
                  <motion.button
                    onClick={() => handleSelection('phygital')}
                    className="group relative p-6 rounded-xl border-2 border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all text-left overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute top-2 right-2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        FREE UPGRADE
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-purple-400" />
                        Phygital Experience
                      </h4>
                      <div className="text-2xl font-bold text-white">
                        ₹{productPrice.toLocaleString()}
                      </div>
                    </div>
                    
                    <p className="text-purple-300 text-sm mb-4">
                      Physical item + Digital identity + QR code integration
                    </p>
                    
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <QrCodeIcon className="w-4 h-4 text-purple-400" />
                        Personalized QR code
                      </li>
                      <li className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-purple-400" />
                        Digital profile integration
                      </li>
                      <li className="flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-purple-400" />
                        Premium digital features
                      </li>
                    </ul>
                  </motion.button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-6">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <SparklesIcon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Welcome to the Phygital Future!
                  </h3>
                  <p className="text-gray-400">
                    Your {productName} will come with exclusive digital features
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {phygitalFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="text-purple-400 flex-shrink-0 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Animation Preview */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 mb-6 text-center border border-purple-500/20">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center"
                  >
                    <QrCodeIcon className="w-8 h-8 text-gray-900" />
                  </motion.div>
                  <h4 className="text-white font-semibold mb-2">QR Code Integration</h4>
                  <p className="text-gray-400 text-sm">
                    Your unique QR code will be printed directly on your item, linking to your personalized digital profile.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmUpgrade}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
                  >
                    Add to Cart (Phygital)
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}