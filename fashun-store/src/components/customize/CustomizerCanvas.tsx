'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const COLORS = [
  { name: 'Black', value: '#000000', hex: '000000' },
  { name: 'White', value: '#FFFFFF', hex: 'FFFFFF' },
  { name: 'Navy', value: '#001F3F', hex: '001F3F' },
  { name: 'Red', value: '#FF4136', hex: 'FF4136' },
  { name: 'Gray', value: '#808080', hex: '808080' },
];

interface CustomizerCanvasProps {
  onVirtualTryOn: (designImage: string) => void;
}

export default function CustomizerCanvas({ onVirtualTryOn }: CustomizerCanvasProps) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawCanvas();
  }, [selectedColor, text, fontSize, textColor, uploadedImage]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw t-shirt background
    ctx.fillStyle = selectedColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw uploaded image if exists
    if (uploadedImage) {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.5;
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2 - 50;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      };
      img.src = uploadedImage;
    }

    // Draw text
    if (text) {
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 100);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateMockup = async () => {
    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const designDataUrl = canvas.toDataURL('image/png');
      
      // Use mockup template from public folder
      const mockupPath = `/tshirt-mockups/${selectedColor.name.toLowerCase()}.png`;
      
      // Create composite image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const mockupCanvas = document.createElement('canvas');
        mockupCanvas.width = 800;
        mockupCanvas.height = 1000;
        const ctx = mockupCanvas.getContext('2d');
        
        if (ctx) {
          // Draw t-shirt mockup
          ctx.drawImage(img, 0, 0, 800, 1000);
          
          // Draw design on t-shirt
          const designImg = new Image();
          designImg.src = designDataUrl;
          designImg.onload = () => {
            ctx.drawImage(designImg, 250, 350, 300, 300);
            onVirtualTryOn(mockupCanvas.toDataURL('image/png'));
            setIsGenerating(false);
          };
        }
      };
      img.onerror = () => {
        // Fallback to design only
        onVirtualTryOn(designDataUrl);
        setIsGenerating(false);
      };
      img.src = mockupPath;
    } catch (error) {
      console.error('Mockup generation failed:', error);
      const canvas = canvasRef.current;
      if (canvas) {
        onVirtualTryOn(canvas.toDataURL('image/png'));
      }
      setIsGenerating(false);
    }
  };

  const clearDesign = () => {
    setText('');
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Design Your Custom T-Shirt
          </h1>
          <p className="text-gray-600 text-lg">Create unique designs with our easy-to-use editor</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Tools */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Design Tools</h2>

              {/* Text Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Add Text</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your text..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={30}
                />
              </div>

              {/* Font Size */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="24"
                  max="96"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Text Color */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Text Color</label>
                <div className="flex gap-3">
                  {['#FFFFFF', '#000000', '#FF4136', '#0074D9', '#FFDC00'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className={`w-10 h-10 rounded-full border-4 transition ${
                        textColor === color ? 'border-purple-600 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              <button
                onClick={clearDesign}
                className="w-full px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
              >
                Clear Design
              </button>
            </div>
          </motion.div>

          {/* Right Panel - Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Live Preview</h2>

              {/* Live Preview with T-Shirt Mockup */}
              <div className="relative bg-gray-100 rounded-xl p-8 flex items-center justify-center mb-6">
                <div className="relative w-full max-w-md">
                  <img
                    src={`/tshirt-mockups/${selectedColor.name.toLowerCase()}.png`}
                    alt="T-shirt mockup"
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.src = '/tshirt-mockups/black.png';
                    }}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={500}
                      className="w-full h-auto opacity-90"
                    />
                  </div>
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-700">T-Shirt Color</label>
                <div className="flex gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-4 transition ${
                        selectedColor.value === color.value
                          ? 'border-purple-600 scale-110'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={generateMockup}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                >
                  {isGenerating ? '⏳ Generating...' : '🎭 Generate Mockup & Try On'}
                </button>

                <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition">
                  🛒 Add to Cart - ₹999
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
