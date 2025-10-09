'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TshirtMockupProps {
  designCanvas: HTMLCanvasElement | null;
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const TSHIRT_COLORS = [
  { id: 'white', name: 'White', hex: '#FFFFFF', image: '/mockups/tshirts/white-tshirt.png' },
  { id: 'black', name: 'Black', hex: '#000000', image: '/mockups/tshirts/black-tshirt.png' },
  { id: 'navy', name: 'Navy', hex: '#1E3A8A', image: '/mockups/tshirts/navy-tshirt.png' },
  { id: 'red', name: 'Red', hex: '#DC2626', image: '/mockups/tshirts/red-tshirt.png' },
  { id: 'green', name: 'Green', hex: '#16A34A', image: '/mockups/tshirts/green-tshirt.png' },
  { id: 'gray', name: 'Gray', hex: '#6B7280', image: '/mockups/tshirts/gray-tshirt.png' },
];

export default function TshirtMockup({ designCanvas, selectedColor, onColorChange }: TshirtMockupProps) {
  const [compositeImage, setCompositeImage] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !designCanvas) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const tshirtImg = new Image();
    tshirtImg.crossOrigin = 'anonymous';
    
    const currentColor = TSHIRT_COLORS.find(c => c.id === selectedColor);
    tshirtImg.src = currentColor?.image || '/api/placeholder/600/700';

    tshirtImg.onload = () => {
      canvasRef.current!.width = 600;
      canvasRef.current!.height = 700;
      
      ctx.drawImage(tshirtImg, 0, 0, 600, 700);
      
      const designData = designCanvas.toDataURL();
      const designImg = new Image();
      designImg.src = designData;
      
      designImg.onload = () => {
        const designX = 150;
        const designY = 200;
        const designWidth = 300;
        const designHeight = 300;
        
        ctx.drawImage(designImg, designX, designY, designWidth, designHeight);
        setCompositeImage(canvasRef.current!.toDataURL('image/png'));
      };
    };

    tshirtImg.onerror = () => {
      ctx.fillStyle = currentColor?.hex || '#FFFFFF';
      ctx.fillRect(0, 0, 600, 700);
      
      if (designCanvas) {
        const designData = designCanvas.toDataURL();
        const designImg = new Image();
        designImg.src = designData;
        
        designImg.onload = () => {
          ctx.drawImage(designImg, 150, 200, 300, 300);
          setCompositeImage(canvasRef.current!.toDataURL('image/png'));
        };
      }
    };
  }, [designCanvas, selectedColor]);

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Live Preview</h3>
        <div className="relative aspect-[6/7] bg-gray-700 rounded-lg overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium mb-3">T-Shirt Color</h4>
        <div className="flex gap-3 flex-wrap">
          {TSHIRT_COLORS.map((color) => (
            <motion.button
              key={color.id}
              onClick={() => onColorChange(color.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                selectedColor === color.id ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-600'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {selectedColor === color.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { TSHIRT_COLORS };