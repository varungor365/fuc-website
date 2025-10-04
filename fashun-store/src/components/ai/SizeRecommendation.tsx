'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  UserIcon, 
  ScaleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChartBarIcon,
  CpuChipIcon,
  ClockIcon,
  BeakerIcon,
  TruckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface SizeData {
  size: string;
  confidence: number;
  reasoning: string;
  measurements: {
    chest?: number;
    waist?: number;
    length?: number;
  };
  fitType: 'tight' | 'regular' | 'loose' | 'oversized';
}

interface SizeRecommendationProps {
  productId: string;
  category: string;
  userMeasurements?: {
    height: number;
    weight: number;
    chest?: number;
    waist?: number;
    preferredFit?: 'tight' | 'regular' | 'loose' | 'oversized';
  };
  onSizeSelect: (size: string) => void;
  selectedSize?: string;
}

interface UserBodyProfile {
  height: number;
  weight: number;
  chest?: number;
  waist?: number;
  preferredFit: 'tight' | 'regular' | 'loose' | 'oversized';
  purchaseHistory: Array<{
    productId: string;
    size: string;
    satisfaction: 'too_small' | 'perfect' | 'too_large';
    category: string;
  }>;
}

const SizeRecommendation: React.FC<SizeRecommendationProps> = ({
  productId,
  category,
  userMeasurements,
  onSizeSelect,
  selectedSize
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<SizeData | null>(null);
  const [alternativeSizes, setAlternativeSizes] = useState<SizeData[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [userProfile, setUserProfile] = useState<UserBodyProfile | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Mock user profile - in production, this would come from user account/measurements
  const mockUserProfile: UserBodyProfile = {
    height: 175, // cm
    weight: 70, // kg
    chest: 95, // cm
    waist: 80, // cm
    preferredFit: 'regular',
    purchaseHistory: [
      { productId: 'hoodie-1', size: 'M', satisfaction: 'perfect', category: 'hoodies' },
      { productId: 'tshirt-1', size: 'M', satisfaction: 'too_large', category: 'tshirts' },
      { productId: 'jeans-1', size: 'L', satisfaction: 'perfect', category: 'jeans' }
    ]
  };

  useEffect(() => {
    generateSizeRecommendation();
  }, [productId, category]);

  const generateSizeRecommendation = async () => {
    setIsLoading(true);
    setAnalysisComplete(false);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const profile = userMeasurements ? {
      ...mockUserProfile,
      ...userMeasurements
    } : mockUserProfile;
    
    setUserProfile(profile);

    // AI-powered size analysis based on multiple factors
    const sizeAnalysis = analyzeSizeForProduct(profile, category);
    setRecommendation(sizeAnalysis.primary);
    setAlternativeSizes(sizeAnalysis.alternatives);
    setAnalysisComplete(true);
    setIsLoading(false);
  };

  const analyzeSizeForProduct = (profile: UserBodyProfile, productCategory: string): {
    primary: SizeData;
    alternatives: SizeData[];
  } => {
    // Complex AI logic that considers multiple factors
    const heightFactor = profile.height / 175; // Normalized to average height
    const chestFactor = (profile.chest || 95) / 95; // Normalized to average chest
    const categoryAdjustment = getCategoryAdjustment(productCategory);
    const fitPreference = getFitAdjustment(profile.preferredFit);
    const historyAdjustment = getHistoryAdjustment(profile.purchaseHistory, productCategory);

    // Calculate base size score
    const sizeScore = (heightFactor + chestFactor) / 2 * categoryAdjustment * fitPreference * historyAdjustment;

    let recommendedSize = 'M';
    let confidence = 85;
    let reasoning = 'Based on your body measurements and fit preferences';

    if (sizeScore < 0.8) {
      recommendedSize = 'S';
      confidence = Math.round(92 - (0.8 - sizeScore) * 20);
      reasoning = 'Your measurements suggest a smaller size for the perfect fit';
    } else if (sizeScore > 1.2) {
      recommendedSize = 'L';
      confidence = Math.round(89 - (sizeScore - 1.2) * 15);
      reasoning = 'Your measurements and fit preference suggest a larger size';
    } else {
      confidence = Math.round(95 - Math.abs(sizeScore - 1) * 10);
      reasoning = 'Medium size aligns perfectly with your measurements and preferences';
    }

    // Add category-specific reasoning
    if (productCategory === 'hoodies') {
      reasoning += '. Hoodies tend to run slightly large, so this accounts for the relaxed fit.';
    } else if (productCategory === 'tshirts') {
      reasoning += '. T-shirts have a more fitted cut, perfect for your preferred style.';
    } else if (productCategory === 'jeans') {
      reasoning += '. Based on your previous jean purchases, this size will give you the best comfort.';
    }

    const primary: SizeData = {
      size: recommendedSize,
      confidence,
      reasoning,
      measurements: {
        chest: profile.chest,
        waist: profile.waist,
        length: Math.round(profile.height * 0.6)
      },
      fitType: profile.preferredFit
    };

    // Generate alternative recommendations
    const alternatives: SizeData[] = [];
    
    if (recommendedSize !== 'S') {
      alternatives.push({
        size: 'S',
        confidence: Math.max(60, confidence - 25),
        reasoning: 'For a more fitted look',
        measurements: { chest: (profile.chest || 95) - 5 },
        fitType: 'tight'
      });
    }
    
    if (recommendedSize !== 'L') {
      alternatives.push({
        size: 'L',
        confidence: Math.max(65, confidence - 20),
        reasoning: 'For a more relaxed fit',
        measurements: { chest: (profile.chest || 95) + 5 },
        fitType: 'loose'
      });
    }

    return { primary, alternatives };
  };

  const getCategoryAdjustment = (category: string): number => {
    const adjustments: { [key: string]: number } = {
      'hoodies': 1.1, // Hoodies run large
      'tshirts': 0.95, // T-shirts run slightly small
      'jeans': 1.0, // True to size
      'jackets': 1.05, // Slightly large for layering
      'sweaters': 1.08 // Run large
    };
    return adjustments[category] || 1.0;
  };

  const getFitAdjustment = (preferredFit: string): number => {
    const adjustments: { [key: string]: number } = {
      'tight': 0.9,
      'regular': 1.0,
      'loose': 1.1,
      'oversized': 1.2
    };
    return adjustments[preferredFit] || 1.0;
  };

  const getHistoryAdjustment = (history: UserBodyProfile['purchaseHistory'], category: string): number => {
    const categoryHistory = history.filter(item => item.category === category);
    if (categoryHistory.length === 0) return 1.0;

    const satisfactionAvg = categoryHistory.reduce((acc, item) => {
      const score = item.satisfaction === 'perfect' ? 1 : 
                   item.satisfaction === 'too_large' ? 0.8 : 0.9;
      return acc + score;
    }, 0) / categoryHistory.length;

    return satisfactionAvg;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-400/20 border-green-400/30';
    if (confidence >= 80) return 'bg-yellow-400/20 border-yellow-400/30';
    return 'bg-orange-400/20 border-orange-400/30';
  };

  const handleSizeClick = (size: string) => {
    onSizeSelect(size);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-4"
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <CpuChipIcon className="w-5 h-5 text-white" />
            </motion.div>
          </div>
          <h4 className="text-white font-semibold">AI Size Analysis</h4>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-purple-300">
            <ClockIcon className="w-4 h-4" />
            <span className="text-sm">Analyzing your measurements...</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-300">
            <BeakerIcon className="w-4 h-4" />
            <span className="text-sm">Comparing with fit data...</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-300">
            <ChartBarIcon className="w-4 h-4" />
            <span className="text-sm">Calculating optimal size...</span>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-2"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!recommendation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-white font-semibold">AI Size Recommendation</h4>
            <p className="text-purple-300 text-xs">Powered by machine learning</p>
          </div>
        </div>
        {analysisComplete && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-1 text-green-400"
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Analysis Complete</span>
          </motion.div>
        )}
      </div>

      {/* Primary Recommendation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`border rounded-lg p-4 mb-4 ${getConfidenceBg(recommendation.confidence)}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-white text-lg font-bold">Size {recommendation.size}</span>
            <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">RECOMMENDED</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${getConfidenceColor(recommendation.confidence)}`}>
              {recommendation.confidence}%
            </div>
            <div className="text-xs text-gray-400">Confidence</div>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm mb-3">{recommendation.reasoning}</p>
        
        <button
          onClick={() => handleSizeClick(recommendation.size)}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
            selectedSize === recommendation.size
              ? 'bg-purple-600 text-white'
              : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
          }`}
        >
          {selectedSize === recommendation.size ? 'Selected' : 'Select This Size'}
        </button>
      </motion.div>

      {/* Alternative Sizes */}
      {alternativeSizes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full text-purple-300 hover:text-purple-200 mb-2"
          >
            <span className="text-sm font-medium">Alternative Sizes</span>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <InformationCircleIcon className="w-4 h-4" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {alternativeSizes.map((size, index) => (
                  <motion.div
                    key={size.size}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-600/50 rounded-lg p-3 bg-gray-800/30"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">Size {size.size}</span>
                      <span className={`text-sm ${getConfidenceColor(size.confidence)}`}>
                        {size.confidence}%
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{size.reasoning}</p>
                    <button
                      onClick={() => handleSizeClick(size.size)}
                      className={`w-full py-1 px-3 rounded text-sm transition-all ${
                        selectedSize === size.size
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {selectedSize === size.size ? 'Selected' : 'Select'}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* User Profile Insights */}
      {userProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 pt-4 border-t border-purple-500/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <UserIcon className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Based on Your Profile</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-gray-400">Height</div>
              <div className="text-white">{userProfile.height}cm</div>
            </div>
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-gray-400">Fit Preference</div>
              <div className="text-white capitalize">{userProfile.preferredFit}</div>
            </div>
          </div>
          
          {userProfile.purchaseHistory.length > 0 && (
            <div className="mt-2 flex items-center space-x-1 text-xs text-gray-400">
              <StarIcon className="w-3 h-3" />
              <span>Based on {userProfile.purchaseHistory.length} previous purchases</span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SizeRecommendation;