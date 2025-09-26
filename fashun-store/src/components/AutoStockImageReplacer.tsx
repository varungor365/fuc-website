/**
 * Automatic Stock Image Replacement Component
 * Shows progress and allows manual triggering of stock image replacement
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Download, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import useStockImageReplacer from '@/hooks/useStockImageReplacer';

interface AutoStockImageReplacerProps {
  autoStart?: boolean;
  showProgress?: boolean;
  className?: string;
}

const AutoStockImageReplacer: React.FC<AutoStockImageReplacerProps> = ({
  autoStart = false,
  showProgress = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const {
    isReplacing,
    progress,
    completed,
    total,
    results,
    error,
    replaceAllImages
  } = useStockImageReplacer();

  // Auto-start replacement if enabled
  useEffect(() => {
    if (autoStart && !hasStarted && !isReplacing) {
      setHasStarted(true);
      handleReplaceImages();
    }
  }, [autoStart, hasStarted, isReplacing]);

  // Show/hide based on replacement status
  useEffect(() => {
    if (isReplacing || error || (completed > 0 && total > 0)) {
      setIsVisible(true);
    } else if (!isReplacing && !error) {
      // Hide after a delay when completed
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isReplacing, error, completed, total]);

  const handleReplaceImages = async () => {
    setHasStarted(true);
    await replaceAllImages();
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-5 h-5 text-red-400" />;
    if (isReplacing) return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
    if (completed === total && total > 0) return <CheckCircle className="w-5 h-5 text-green-400" />;
    return <Wand2 className="w-5 h-5 text-purple-400" />;
  };

  const getStatusText = () => {
    if (error) return 'Image replacement failed';
    if (isReplacing) return 'Generating AI images...';
    if (completed === total && total > 0) return 'All images replaced successfully!';
    return 'Ready to replace stock images';
  };

  if (!showProgress && !isReplacing) return null;

  return (
    <AnimatePresence>
      {(isVisible || !autoStart) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 ${className}`}
        >
          <div className="bg-gray-900/95 backdrop-blur-md border border-purple-500/20 rounded-lg p-4 min-w-[320px] shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon()}
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">
                  AI Stock Image Replacement
                </h3>
                <p className="text-gray-400 text-xs">
                  {getStatusText()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {(isReplacing || (completed > 0 && total > 0)) && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{completed} of {total} images</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* Success Message */}
            {completed === total && total > 0 && !error && (
              <div className="mb-3 p-2 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-xs">
                ✨ {results.length} high-quality AI images generated successfully!
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!autoStart && (
                <button
                  onClick={handleReplaceImages}
                  disabled={isReplacing}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-xs font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Wand2 className="w-3 h-3" />
                  {isReplacing ? 'Generating...' : 'Replace Images'}
                </button>
              )}
              
              {completed === total && total > 0 && (
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-xs font-medium transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              )}
            </div>

            {/* Results Summary */}
            {results.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-400">
                  <div className="grid grid-cols-2 gap-2">
                    <div>✅ Heroes: {results.filter(r => r.category === 'hero').length}</div>
                    <div>✅ Products: {results.filter(r => r.category === 'product').length}</div>
                    <div>✅ Collections: {results.filter(r => r.category === 'collection').length}</div>
                    <div>✅ Categories: {results.filter(r => r.category === 'category').length}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AutoStockImageReplacer;