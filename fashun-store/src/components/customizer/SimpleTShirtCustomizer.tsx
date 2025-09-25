'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { pagefonts } from '@/lib/simpleFonts';
import { 
  SwatchIcon,
  PhotoIcon,
  PaintBrushIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface TShirtCustomizerProps {
  onDesignChange?: (design: string) => void;
}

const TShirtCustomizer: React.FC<TShirtCustomizerProps> = ({ onDesignChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTshirtColor, setSelectedTshirtColor] = useState('#4A90E2');
  const [textValue, setTextValue] = useState('FASHUN');
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [isLoading, setIsLoading] = useState(false);

  const tshirtColors = [
    { name: 'Blue', value: '#4A90E2' },
    { name: 'Black', value: '#1A1A1A' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Red', value: '#E74C3C' },
    { name: 'Green', value: '#27AE60' },
    { name: 'Purple', value: '#9B59B6' },
    { name: 'Orange', value: '#F39C12' },
    { name: 'Pink', value: '#E91E63' }
  ];

  useEffect(() => {
    drawTshirt();
  }, [selectedTshirtColor, textValue, fontSize, textColor]);

  const drawTshirt = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw T-shirt shape
    ctx.fillStyle = selectedTshirtColor;
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;

    // T-shirt body
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(350, 150);
    ctx.lineTo(350, 120);
    ctx.lineTo(380, 120);
    ctx.lineTo(380, 200);
    ctx.lineTo(350, 200);
    ctx.lineTo(350, 450);
    ctx.lineTo(50, 450);
    ctx.lineTo(50, 200);
    ctx.lineTo(20, 200);
    ctx.lineTo(20, 120);
    ctx.lineTo(50, 120);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Neck opening
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.ellipse(200, 150, 30, 20, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Add text
    if (textValue) {
      ctx.fillStyle = textColor;
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textValue, 200, 250);
    }

    // Notify parent of changes
    if (onDesignChange) {
      onDesignChange(canvas.toDataURL());
    }
  };

  const downloadDesign = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'fashun-tshirt-design.png';
    link.href = canvas.toDataURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${pagefonts.homepage.primary.className} text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6`}
        >
          T-Shirt Design Studio
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${pagefonts.content.primary.className} text-xl text-gray-300 max-w-3xl mx-auto`}
        >
          Create your custom FASHUN designs with our T-shirt customizer. 
          Add text and customize colors to create unique streetwear pieces.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tools Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <h2 className={`${pagefonts.homepage.primary.className} text-2xl font-bold text-white mb-6 flex items-center gap-2`}>
            <AdjustmentsHorizontalIcon className="h-6 w-6 text-purple-400" />
            Design Tools
          </h2>

          {/* T-shirt Colors */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">T-shirt Color:</h3>
            <div className="grid grid-cols-4 gap-2">
              {tshirtColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedTshirtColor(color.value)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all duration-300 ${
                    selectedTshirtColor === color.value 
                      ? 'border-purple-400 scale-110' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Text Controls */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Custom Text:</h3>
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white mb-3"
              placeholder="Enter text..."
            />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Font Size:</label>
                <input
                  type="range"
                  min="12"
                  max="60"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-gray-400 text-sm">{fontSize}px</span>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Text Color:</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 rounded border border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={downloadDesign}
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Download Design
            </button>
            <button
              onClick={() => {
                setTextValue('FASHUN');
                setFontSize(40);
                setTextColor('#FFFFFF');
                setSelectedTshirtColor('#4A90E2');
              }}
              className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
            >
              Reset Design
            </button>
          </div>

          {/* Coming Soon */}
          <div className="mt-6 p-4 bg-purple-500/20 border border-purple-400/50 rounded-lg">
            <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
              <SparklesIcon className="h-4 w-4" />
              Coming Soon
            </h4>
            <p className="text-purple-200 text-sm">
              • Image upload<br/>
              • Advanced text effects<br/>
              • More templates<br/>
              • 3D avatar integration
            </p>
          </div>
        </motion.div>

        {/* Canvas */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
        >
          <h2 className={`${pagefonts.homepage.primary.className} text-2xl font-bold text-white mb-6 flex items-center gap-2`}>
            <EyeIcon className="h-6 w-6 text-purple-400" />
            Design Preview
          </h2>

          <div className="flex justify-center">
            <div className="bg-white/5 rounded-xl p-8 inline-block">
              {isLoading ? (
                <div className="w-[400px] h-[500px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={500}
                  className="border border-gray-600 rounded-lg shadow-2xl bg-white/10"
                />
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Use the controls on the left to customize your T-shirt design. 
              Advanced editing features coming soon with Fabric.js integration.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 grid md:grid-cols-3 gap-8"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <PaintBrushIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
            Custom Text
          </h3>
          <p className="text-gray-300 text-sm">
            Add custom text with various fonts, sizes, and colors to make your design unique.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <SwatchIcon className="h-12 w-12 text-pink-400 mx-auto mb-4" />
          <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
            Color Options
          </h3>
          <p className="text-gray-300 text-sm">
            Choose from multiple T-shirt colors to match your style and brand preferences.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <PhotoIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
            Advanced Features
          </h3>
          <p className="text-gray-300 text-sm">
            Full Fabric.js integration coming soon with image upload, layers, and professional editing tools.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TShirtCustomizer;