'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { pagefonts } from '@/lib/simpleFonts';
import { 
  SwatchIcon,
  PhotoIcon,
  PaintBrushIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// Declare fabric as global for TypeScript
declare global {
  const fabric: any;
}

interface TShirtCustomizerProps {
  onDesignChange?: (design: any) => void;
}

const TShirtCustomizer: React.FC<TShirtCustomizerProps> = ({ onDesignChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const [selectedTshirtColor, setSelectedTshirtColor] = useState('#4A90E2');
  const [selectedTool, setSelectedTool] = useState('text');
  const [textValue, setTextValue] = useState('FASHUN');
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [isLoading, setIsLoading] = useState(true);
  const [fabricLoaded, setFabricLoaded] = useState(false);

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

  const fontFamilies = [
    'Arial',
    'Impact',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana'
  ];

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      // Initialize Fabric.js canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 500,
        backgroundColor: 'transparent'
      });

      fabricCanvasRef.current = canvas;

      // Create T-shirt background
      createTshirtBackground(canvas);

      // Set up event listeners
      canvas.on('object:modified', () => {
        if (onDesignChange) {
          onDesignChange(canvas.toJSON());
        }
      });

      setIsLoading(false);
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [onDesignChange]);

  const createTshirtBackground = (canvas: fabric.Canvas) => {
    // Create T-shirt shape using SVG path
    const tshirtPath = `
      M 50 150 
      L 350 150 
      L 350 120 
      L 380 120 
      L 380 200 
      L 350 200 
      L 350 450 
      L 50 450 
      L 50 200 
      L 20 200 
      L 20 120 
      L 50 120 
      Z
    `;

    fabric.loadSVGFromString(`
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <path d="${tshirtPath}" fill="${selectedTshirtColor}" stroke="#333" stroke-width="2"/>
        <ellipse cx="200" cy="150" rx="30" ry="20" fill="#f0f0f0"/>
      </svg>
    `, (objects) => {
      const tshirt = fabric.util.groupSVGElements(objects, {
        selectable: false,
        evented: false,
        excludeFromExport: false
      });
      
      canvas.add(tshirt);
      canvas.sendToBack(tshirt);
    });
  };

  const updateTshirtColor = (color: string) => {
    setSelectedTshirtColor(color);
    if (fabricCanvasRef.current) {
      // Remove old t-shirt and create new one with new color
      const objects = fabricCanvasRef.current.getObjects();
      const tshirtObject = objects.find(obj => obj.excludeFromExport === false && !obj.selectable);
      if (tshirtObject) {
        fabricCanvasRef.current.remove(tshirtObject);
      }
      createTshirtBackground(fabricCanvasRef.current);
    }
  };

  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new fabric.Text(textValue, {
      left: 200,
      top: 250,
      fontSize: fontSize,
      fontFamily: 'Arial',
      fill: textColor,
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
  };

  const addImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgUrl = e.target?.result as string;
      fabric.Image.fromURL(imgUrl, (img) => {
        img.set({
          left: 200,
          top: 250,
          originX: 'center',
          originY: 'center',
          scaleX: 0.5,
          scaleY: 0.5
        });
        fabricCanvasRef.current?.add(img);
        fabricCanvasRef.current?.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const deleteSelected = () => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
    }
  };

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.clear();
    createTshirtBackground(fabricCanvasRef.current);
  };

  const downloadDesign = () => {
    if (!fabricCanvasRef.current) return;
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1
    });
    
    const link = document.createElement('a');
    link.download = 'fashun-tshirt-design.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateTextProperties = () => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
      (activeObject as fabric.Text).set({
        fontSize: fontSize,
        fill: textColor
      });
      fabricCanvasRef.current.renderAll();
    }
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
          Create your custom FASHUN designs with our advanced T-shirt customizer. 
          Add text, images, and graphics to create unique streetwear pieces.
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
                  onClick={() => updateTshirtColor(color.value)}
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
            <h3 className="text-white font-semibold mb-3">Add Text:</h3>
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
                  max="80"
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(parseInt(e.target.value));
                    updateTextProperties();
                  }}
                  className="w-full"
                />
                <span className="text-gray-400 text-sm">{fontSize}px</span>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Text Color:</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    updateTextProperties();
                  }}
                  className="w-full h-10 rounded border border-gray-700"
                />
              </div>
            </div>
            <button
              onClick={addText}
              className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
            >
              <PaintBrushIcon className="h-4 w-4" />
              Add Text
            </button>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Add Image:</h3>
            <label className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <PhotoIcon className="h-4 w-4" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={addImage}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={deleteSelected}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
            >
              <TrashIcon className="h-4 w-4" />
              Delete Selected
            </button>
            <button
              onClick={clearCanvas}
              className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={downloadDesign}
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Download Design
            </button>
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
                  className="border border-gray-600 rounded-lg shadow-2xl"
                />
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Click and drag elements to reposition them. Use the controls on the left to customize your design.
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
          <PhotoIcon className="h-12 w-12 text-pink-400 mx-auto mb-4" />
          <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
            Image Upload
          </h3>
          <p className="text-gray-300 text-sm">
            Upload your own images, logos, or graphics to create personalized designs.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <SwatchIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h3 className={`${pagefonts.homepage.primary.className} text-lg font-bold text-white mb-2`}>
            Color Options
          </h3>
          <p className="text-gray-300 text-sm">
            Choose from multiple T-shirt colors and customize every element of your design.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TShirtCustomizer;