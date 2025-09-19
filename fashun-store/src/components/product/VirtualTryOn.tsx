'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CameraIcon, 
  XMarkIcon,
  ArrowPathIcon,
  PhotoIcon,
  ShareIcon,
  BookmarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface TryOnState {
  isActive: boolean;
  hasPermission: boolean | null;
  isLoading: boolean;
  capturedImage: string | null;
  filterIntensity: number;
  productOverlay: boolean;
}

interface Product {
  id: string;
  name: string;
  image: string;
  color: string;
  type: 'shirt' | 'hoodie' | 'dress' | 'jacket';
}

const VirtualTryOn: React.FC<{ 
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}> = ({ product, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [tryOnState, setTryOnState] = useState<TryOnState>({
    isActive: false,
    hasPermission: null,
    isLoading: false,
    capturedImage: null,
    filterIntensity: 0.8,
    productOverlay: true
  });

  const startCamera = useCallback(async () => {
    setTryOnState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setTryOnState(prev => ({
        ...prev,
        isActive: true,
        hasPermission: true,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error accessing camera:', error);
      setTryOnState(prev => ({
        ...prev,
        hasPermission: false,
        isLoading: false
      }));
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setTryOnState(prev => ({
      ...prev,
      isActive: false,
      capturedImage: null
    }));
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame
    ctx.drawImage(video, 0, 0);
    
    // Apply product overlay (simplified version)
    if (tryOnState.productOverlay) {
      ctx.globalAlpha = tryOnState.filterIntensity;
      
      // This would be where AI/AR processing happens
      // For demo purposes, we'll add a simple color overlay
      const overlayColor = getProductOverlayColor(product.color);
      ctx.fillStyle = overlayColor;
      
      // Simulate clothing area detection (simplified rectangle)
      const clothingArea = getClothingArea(canvas.width, canvas.height, product.type);
      ctx.fillRect(clothingArea.x, clothingArea.y, clothingArea.width, clothingArea.height);
      
      ctx.globalAlpha = 1;
    }
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setTryOnState(prev => ({ ...prev, capturedImage: imageData }));
  }, [product, tryOnState.filterIntensity, tryOnState.productOverlay]);

  const getProductOverlayColor = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      'black': 'rgba(0, 0, 0, 0.3)',
      'white': 'rgba(255, 255, 255, 0.3)',
      'red': 'rgba(220, 38, 38, 0.3)',
      'blue': 'rgba(37, 99, 235, 0.3)',
      'green': 'rgba(34, 197, 94, 0.3)',
      'yellow': 'rgba(251, 191, 36, 0.3)',
      'purple': 'rgba(168, 85, 247, 0.3)',
      'pink': 'rgba(236, 72, 153, 0.3)',
      'gray': 'rgba(107, 114, 128, 0.3)',
      'navy': 'rgba(30, 58, 138, 0.3)'
    };
    
    return colorMap[color.toLowerCase()] || 'rgba(107, 114, 128, 0.3)';
  };

  const getClothingArea = (width: number, height: number, type: Product['type']) => {
    // Simplified clothing area detection
    // In a real implementation, this would use AI/ML for body detection
    const centerX = width / 2;
    const centerY = height / 2;
    
    switch (type) {
      case 'shirt':
        return {
          x: centerX - width * 0.15,
          y: centerY - height * 0.1,
          width: width * 0.3,
          height: height * 0.25
        };
      case 'hoodie':
        return {
          x: centerX - width * 0.18,
          y: centerY - height * 0.15,
          width: width * 0.36,
          height: height * 0.35
        };
      case 'dress':
        return {
          x: centerX - width * 0.2,
          y: centerY - height * 0.1,
          width: width * 0.4,
          height: height * 0.5
        };
      case 'jacket':
        return {
          x: centerX - width * 0.2,
          y: centerY - height * 0.15,
          width: width * 0.4,
          height: height * 0.4
        };
      default:
        return {
          x: centerX - width * 0.15,
          y: centerY - height * 0.1,
          width: width * 0.3,
          height: height * 0.25
        };
    }
  };

  const retakePhoto = () => {
    setTryOnState(prev => ({ ...prev, capturedImage: null }));
  };

  const savePhoto = () => {
    if (!tryOnState.capturedImage) return;
    
    const link = document.createElement('a');
    link.download = `fashun-tryOn-${product.name}-${Date.now()}.jpg`;
    link.href = tryOnState.capturedImage;
    link.click();
  };

  const sharePhoto = async () => {
    if (!tryOnState.capturedImage) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(tryOnState.capturedImage);
      const blob = await response.blob();
      
      if (navigator.share && navigator.canShare({ files: [new File([blob], 'tryOn.jpg', { type: 'image/jpeg' })] })) {
        await navigator.share({
          title: `Try-On: ${product.name}`,
          text: 'Check out how I look in this outfit from FASHUN.CO.IN!',
          files: [new File([blob], 'tryOn.jpg', { type: 'image/jpeg' })]
        });
      } else {
        // Fallback: copy to clipboard or show share options
        navigator.clipboard.writeText(`Check out how I look in this ${product.name} from FASHUN.CO.IN!`);
        alert('Share text copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  React.useEffect(() => {
    if (isOpen && !tryOnState.isActive) {
      startCamera();
    }
    
    return () => {
      if (streamRef.current) {
        stopCamera();
      }
    };
  }, [isOpen, startCamera, stopCamera, tryOnState.isActive]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-white font-semibold">Virtual Try-On</h2>
            <p className="text-white/70 text-sm">{product.name}</p>
          </div>
        </div>
        
        {tryOnState.isActive && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTryOnState(prev => ({ ...prev, productOverlay: !prev.productOverlay }))}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                tryOnState.productOverlay
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Overlay
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {tryOnState.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white">
              <div className="animate-spin w-12 h-12 border-3 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
              <p>Starting camera...</p>
            </div>
          </div>
        )}

        {tryOnState.hasPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-center text-white p-8">
            <div>
              <CameraIcon className="w-16 h-16 mx-auto mb-4 text-white/70" />
              <h3 className="text-xl font-semibold mb-2">Camera Access Required</h3>
              <p className="text-white/70 mb-6">
                To use the virtual try-on feature, please allow camera access and try again.
              </p>
              <button
                onClick={startCamera}
                className="btn btn-primary bg-white text-black hover:bg-white/90"
              >
                Enable Camera
              </button>
            </div>
          </div>
        )}

        {tryOnState.capturedImage ? (
          // Photo Preview Mode
          <div className="absolute inset-0">
            <img
              src={tryOnState.capturedImage}
              alt="Try-on capture"
              className="w-full h-full object-cover"
            />
            
            {/* Photo Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  onClick={retakePhoto}
                  className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowPathIcon className="w-6 h-6" />
                </motion.button>
                
                <motion.button
                  onClick={savePhoto}
                  className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookmarkIcon className="w-6 h-6" />
                </motion.button>
                
                <motion.button
                  onClick={sharePhoto}
                  className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShareIcon className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          // Live Camera View
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            {/* Product Info Overlay */}
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="text-white">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-white/70 capitalize">{product.color} • {product.type}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Adjustment Controls */}
            {tryOnState.productOverlay && (
              <div className="absolute top-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-white text-sm mb-2">Overlay Intensity</div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={tryOnState.filterIntensity}
                    onChange={(e) => setTryOnState(prev => ({ ...prev, filterIntensity: parseFloat(e.target.value) }))}
                    className="w-24 accent-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Capture Button */}
            {tryOnState.isActive && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <motion.button
                  onClick={capturePhoto}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:bg-white/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <CameraIcon className="w-8 h-8 text-white" />
                  </div>
                </motion.button>
              </div>
            )}

            {/* Helper Text */}
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center">
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                Position yourself in the frame and tap to capture
              </div>
            </div>
          </div>
        )}

        {/* Hidden Canvas for Image Processing */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>
    </motion.div>
  );
};

export default VirtualTryOn;