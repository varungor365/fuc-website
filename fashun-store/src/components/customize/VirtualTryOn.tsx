'use client';

import { useState, useRef } from 'react';

interface VirtualTryOnProps {
  designImage: string;
  onBack: () => void;
}

export default function VirtualTryOn({ designImage, onBack }: VirtualTryOnProps) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUserPhoto(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processTryOn = async () => {
    if (!userPhoto) return;

    setProcessing(true);

    try {
      // Call virtual try-on API
      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhoto,
          designImage,
        }),
      });

      const data = await response.json();
      setTryOnResult(data.resultImage);
    } catch (error) {
      console.error('Try-on failed:', error);
      alert('Virtual try-on failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!tryOnResult) return;

    const link = document.createElement('a');
    link.href = tryOnResult;
    link.download = 'fashun-tryon.png';
    link.click();
  };

  const addToCart = () => {
    // Add custom design to cart
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Virtual Try-On</h1>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition"
          >
            ← Back to Editor
          </button>
        </div>

        {!tryOnResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Design Preview */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold mb-4">Your Custom Design</h2>
              <img
                src={designImage}
                alt="Custom design"
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            {/* Right - Upload Photo */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold mb-4">Upload Your Photo</h2>

              {!userPhoto ? (
                <div className="border-2 border-dashed border-white/30 rounded-lg p-12 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-white/70 mb-4">
                    Upload a full-body photo to see how your design looks on you
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                  >
                    Choose Photo
                  </button>
                  <p className="text-sm text-white/50 mt-4">
                    Tips: Stand straight, good lighting, full body visible
                  </p>
                </div>
              ) : (
                <div>
                  <img
                    src={userPhoto}
                    alt="Your photo"
                    className="w-full rounded-lg shadow-2xl mb-4"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                    >
                      Change Photo
                    </button>
                    <button
                      onClick={processTryOn}
                      disabled={processing}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : '✨ Try It On'}
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              🎉 Here's How You Look!
            </h2>

            <div className="max-w-2xl mx-auto mb-8">
              <img
                src={tryOnResult}
                alt="Try-on result"
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <button
                onClick={addToCart}
                className="flex-1 px-6 py-4 bg-green-600 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                🛒 Add to Cart - ₹999
              </button>

              <button
                onClick={downloadResult}
                className="flex-1 px-6 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                📥 Download Image
              </button>

              <button
                onClick={onBack}
                className="flex-1 px-6 py-4 bg-white/20 rounded-lg hover:bg-white/30 transition font-semibold"
              >
                ✏️ Edit Design
              </button>
            </div>

            <p className="text-center text-white/70 mt-6 text-sm">
              Share your custom design on social media! 📱
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
