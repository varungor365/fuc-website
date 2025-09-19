'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface Product360Image {
  angle: number;
  url: string;
  preloaded: boolean;
}

interface Product360ViewerProps {
  images: Product360Image[];
  autoRotate?: boolean;
  initialAngle?: number;
  rotationSpeed?: number;
  className?: string;
  onAngleChange?: (angle: number) => void;
}

const Product360Viewer: React.FC<Product360ViewerProps> = ({
  images,
  autoRotate = false,
  initialAngle = 0,
  rotationSpeed = 2,
  className = '',
  onAngleChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const animationRef = useRef<number>();
  const lastMouseXRef = useRef<number>(0);
  
  const [currentAngle, setCurrentAngle] = useState(initialAngle);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);

  // Hotspots for interactive features (fabric details, measurements, etc.)
  const hotspots = [
    { angle: 45, x: 30, y: 40, label: 'Premium Cotton Fabric', detail: 'Made from 100% organic cotton with a soft, breathable feel.' },
    { angle: 135, x: 70, y: 30, label: 'Reinforced Stitching', detail: 'Double-stitched seams for enhanced durability and longevity.' },
    { angle: 225, x: 50, y: 60, label: 'Perfect Fit', detail: 'Tailored cut designed for a comfortable and flattering fit.' },
    { angle: 315, x: 60, y: 25, label: 'Quality Details', detail: 'Attention to detail in every element, from buttons to finishing.' }
  ];

  // Find the closest image index for the current angle
  const getCurrentImageIndex = useCallback((angle: number) => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    let closestIndex = 0;
    let minDifference = Infinity;

    images.forEach((image, index) => {
      const difference = Math.abs(normalizedAngle - image.angle);
      const wrappedDifference = Math.abs(normalizedAngle - (image.angle + 360));
      const minDiff = Math.min(difference, wrappedDifference);
      
      if (minDiff < minDifference) {
        minDifference = minDiff;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, [images]);

  const currentImageIndex = getCurrentImageIndex(currentAngle);

  // Auto-rotation animation
  useEffect(() => {
    if (isAutoRotating && !isDragging) {
      const animate = () => {
        setCurrentAngle(prev => {
          const newAngle = (prev + rotationSpeed) % 360;
          onAngleChange?.(newAngle);
          return newAngle;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoRotating, isDragging, rotationSpeed, onAngleChange]);

  // Preload images
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setLoadedImages(0);

    const preloadImages = async () => {
      const promises = images.map((image, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (mounted) {
              imageRefs.current[index] = img;
              setLoadedImages(prev => prev + 1);
            }
            resolve();
          };
          img.onerror = () => resolve(); // Continue even if image fails to load
          img.src = image.url;
        });
      });

      await Promise.all(promises);
      
      if (mounted) {
        setIsLoading(false);
      }
    };

    preloadImages();

    return () => {
      mounted = false;
    };
  }, [images]);

  // Handle mouse/touch interactions
  const handlePanStart = (event: any, info: PanInfo) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    lastMouseXRef.current = info.point.x;
  };

  const handlePan = (event: any, info: PanInfo) => {
    if (!isDragging) return;

    const deltaX = info.point.x - lastMouseXRef.current;
    const sensitivity = 0.5;
    const angleChange = deltaX * sensitivity;
    
    setCurrentAngle(prev => {
      const newAngle = ((prev + angleChange) % 360 + 360) % 360;
      onAngleChange?.(newAngle);
      return newAngle;
    });
    
    lastMouseXRef.current = info.point.x;
  };

  const handlePanEnd = () => {
    setIsDragging(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          setCurrentAngle(prev => ((prev - 10) % 360 + 360) % 360);
          setIsAutoRotating(false);
          break;
        case 'ArrowRight':
          setCurrentAngle(prev => (prev + 10) % 360);
          setIsAutoRotating(false);
          break;
        case ' ':
          e.preventDefault();
          setIsAutoRotating(prev => !prev);
          break;
        case 'Escape':
          setIsFullscreen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetView = () => {
    setCurrentAngle(initialAngle);
    onAngleChange?.(initialAngle);
  };

  const getVisibleHotspots = () => {
    if (!showHotspots) return [];
    
    const tolerance = 30; // Show hotspots within 30 degrees of current angle
    return hotspots.filter(hotspot => {
      const angleDiff = Math.abs(currentAngle - hotspot.angle);
      const wrappedDiff = Math.abs(currentAngle - (hotspot.angle + 360));
      return Math.min(angleDiff, wrappedDiff) <= tolerance;
    });
  };

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-3 border-neutral-300 border-t-primary-500 rounded-full mx-auto mb-4"></div>
        <p className="text-neutral-600">Loading 360° view...</p>
        <div className="mt-2 text-sm text-neutral-500">
          {loadedImages} / {images.length} images loaded
        </div>
        <div className="w-48 bg-neutral-200 rounded-full h-2 mt-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(loadedImages / images.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const ControlBar = () => (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
      <motion.button
        onClick={() => setIsAutoRotating(!isAutoRotating)}
        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isAutoRotating ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
      </motion.button>
      
      <motion.button
        onClick={resetView}
        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowPathIcon className="w-5 h-5" />
      </motion.button>
      
      <motion.button
        onClick={() => setShowHotspots(!showHotspots)}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${
          showHotspots ? 'bg-primary-500 hover:bg-primary-600' : 'bg-white/20 hover:bg-white/30'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <InformationCircleIcon className="w-5 h-5" />
      </motion.button>
      
      <motion.button
        onClick={toggleFullscreen}
        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isFullscreen ? 
          <ArrowsPointingInIcon className="w-5 h-5" /> : 
          <ArrowsPointingOutIcon className="w-5 h-5" />
        }
      </motion.button>
      
      <div className="text-white text-sm px-3">
        {Math.round(currentAngle)}°
      </div>
    </div>
  );

  const AngleIndicator = () => (
    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl p-3">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 border-2 border-white/30 rounded-full"></div>
        <div 
          className="absolute top-0 left-1/2 w-0.5 h-6 bg-primary-500 transform -translate-x-1/2 origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${currentAngle}deg)` }}
        ></div>
        <div className="absolute inset-2 border border-white/20 rounded-full"></div>
      </div>
    </div>
  );

  const currentImage = images[currentImageIndex];

  return (
    <motion.div
      ref={containerRef}
      className={`relative bg-neutral-100 rounded-2xl overflow-hidden ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
      initial={false}
      animate={{
        scale: isFullscreen ? 1 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <motion.div
            className="relative w-full h-full cursor-grab active:cursor-grabbing"
            onPanStart={handlePanStart}
            onPan={handlePan}
            onPanEnd={handlePanEnd}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={currentImage?.url}
                alt={`Product view at ${currentImage?.angle}°`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              />
            </AnimatePresence>

            {/* Hotspots */}
            <AnimatePresence>
              {getVisibleHotspots().map((hotspot, index) => (
                <motion.div
                  key={`${hotspot.angle}-${hotspot.label}`}
                  className="absolute group"
                  style={{ 
                    left: `${hotspot.x}%`, 
                    top: `${hotspot.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="w-4 h-4 bg-primary-500 rounded-full border-2 border-white shadow-lg cursor-pointer animate-pulse group-hover:animate-none">
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-black/90 text-white text-xs rounded-lg p-2 whitespace-nowrap max-w-48">
                        <div className="font-semibold">{hotspot.label}</div>
                        <div className="text-white/80">{hotspot.detail}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Drag Indicator */}
            {!isDragging && !isAutoRotating && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 1, duration: 2 }}
                >
                  Drag to rotate • Click play for auto-rotation
                </motion.div>
              </div>
            )}
          </motion.div>

          <AngleIndicator />
          <ControlBar />

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-primary-500 transition-all duration-100"
              style={{ width: `${(currentAngle / 360) * 100}%` }}
            />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Product360Viewer;