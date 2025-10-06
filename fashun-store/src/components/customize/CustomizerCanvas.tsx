'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const COLORS = [
  { name: 'Black', value: '#000000', image: '/tshirt-mockups/black.png' },
  { name: 'White', value: '#FFFFFF', image: '/tshirt-mockups/white.png' },
  { name: 'Navy', value: '#001F3F', image: '/tshirt-mockups/navy.png' },
  { name: 'Red', value: '#FF4136', image: '/tshirt-mockups/red.png' },
  { name: 'Gray', value: '#808080', image: '/tshirt-mockups/gray.png' },
];

interface CustomizerCanvasProps {
  onVirtualTryOn: (designImage: string) => void;
}

export default function CustomizerCanvas({ onVirtualTryOn }: CustomizerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [text, setText] = useState('');
  const [mockupImage, setMockupImage] = useState<string>(COLORS[0].image);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 500,
        backgroundColor: 'transparent',
      });
    }

    return () => {
      fabricCanvasRef.current?.dispose();
    };
  }, []);

  const handleColorChange = (color: typeof COLORS[0]) => {
    setSelectedColor(color);
    setMockupImage(color.image);
  };

  const addText = () => {
    if (!fabricCanvasRef.current || !text) return;

    const textObj = new fabric.IText(text, {
      left: 100,
      top: 200,
      fontSize: 40,
      fill: selectedColor.value === '#FFFFFF' ? '#000000' : '#FFFFFF',
      fontFamily: 'Arial',
    });

    fabricCanvasRef.current.add(textObj);
    fabricCanvasRef.current.setActiveObject(textObj);
    setText('');
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target?.result as string, (img) => {
        img.scaleToWidth(200);
        img.set({ left: 100, top: 150 });
        fabricCanvasRef.current?.add(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const generateFinalDesign = () => {
    if (!fabricCanvasRef.current) return;

    // Create composite image
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d')!;

    // Load mockup
    const mockup = new Image();
    mockup.crossOrigin = 'anonymous';
    mockup.onload = () => {
      // Draw mockup
      ctx.drawImage(mockup, 0, 0, 1000, 1200);

      // Draw design overlay
      const designData = fabricCanvasRef.current!.toDataURL({
        format: 'png',
        quality: 1,
      });

      const designImg = new Image();
      designImg.onload = () => {
        // Position design on chest area
        ctx.drawImage(designImg, 300, 350, 400, 500);

        // Get final composite
        const finalImage = canvas.toDataURL('image/png');
        onVirtualTryOn(finalImage);
      };
      designImg.src = designData;
    };
    mockup.src = mockupImage;
  };

  const clearCanvas = () => {
    fabricCanvasRef.current?.clear();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Customize Your T-Shirt</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Tools */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Design Tools</h2>

              {/* Text Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Add Text</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={addText}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Add Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={addImage}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Canvas */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <canvas ref={canvasRef} />
              </div>

              <button
                onClick={clearCanvas}
                className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear Design
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>

              {/* Mockup Display */}
              <div className="relative bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                <img
                  src={mockupImage}
                  alt="T-shirt mockup"
                  className="max-w-full h-auto"
                  style={{ maxHeight: '600px' }}
                />
              </div>

              {/* Color Selector */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-3">Select Color</label>
                <div className="flex gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorChange(color)}
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
              <div className="mt-6 space-y-3">
                <button
                  onClick={generateFinalDesign}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
                >
                  🎭 Virtual Try-On
                </button>

                <button className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition">
                  🛒 Add to Cart - ₹999
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
