'use client';

import { useState } from 'react';

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
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [text, setText] = useState('');
  const [mockupImage, setMockupImage] = useState<string>(COLORS[0].image);
  const [designElements, setDesignElements] = useState<Array<{type: 'text' | 'image', content: string}>>([]);

  const handleColorChange = (color: typeof COLORS[0]) => {
    setSelectedColor(color);
    setMockupImage(color.image);
  };

  const addText = () => {
    if (!text) return;
    setDesignElements([...designElements, { type: 'text', content: text }]);
    setText('');
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setDesignElements([...designElements, { type: 'image', content: result }]);
    };
    reader.readAsDataURL(file);
  };

  const generateFinalDesign = () => {
    onVirtualTryOn(mockupImage);
  };

  const clearCanvas = () => {
    setDesignElements([]);
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

              {/* Design Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[300px]">
                <h3 className="text-sm font-medium mb-2">Design Elements:</h3>
                {designElements.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Add text or images to start designing</p>
                ) : (
                  <div className="space-y-2">
                    {designElements.map((element, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        {element.type === 'text' ? (
                          <p className="font-medium">{element.content}</p>
                        ) : (
                          <img src={element.content} alt="Design" className="max-h-20" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
