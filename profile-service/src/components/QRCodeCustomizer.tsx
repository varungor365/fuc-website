'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import QRCodeStyling from 'qr-code-styling';
import { HexColorPicker } from 'react-colorful';
import {
  QrCodeIcon,
  PhotoIcon,
  SwatchIcon,
  ArrowDownTrayIcon,
  BookmarkIcon,
  EyeIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface QRCustomizerProps {
  username: string;
  profileUrl: string;
  currentSettings?: any;
  onSave: (settings: any, qrCodeUrl: string) => void;
  onClose?: () => void;
}

const dotTypes = [
  { id: 'square', name: 'Square', preview: '⬛' },
  { id: 'dots', name: 'Dots', preview: '●' },
  { id: 'rounded', name: 'Rounded', preview: '⬜' },
  { id: 'extra-rounded', name: 'Extra Rounded', preview: '🔲' },
  { id: 'classy', name: 'Classy', preview: '◆' },
  { id: 'classy-rounded', name: 'Classy Rounded', preview: '♦' }
];

const cornerTypes = [
  { id: 'square', name: 'Square' },
  { id: 'extra-rounded', name: 'Rounded' },
  { id: 'dot', name: 'Dot' }
];

const backgroundTypes = [
  { id: 'solid', name: 'Solid Color' },
  { id: 'gradient', name: 'Gradient' }
];

export default function QRCodeCustomizer({ 
  username, 
  profileUrl, 
  currentSettings, 
  onSave,
  onClose 
}: QRCustomizerProps) {
  const [qrSettings, setQrSettings] = useState({
    width: 1000,
    height: 1000,
    data: profileUrl,
    image: '',
    margin: 10,
    qrOptions: {
      typeNumber: 'auto' as any,
      mode: 'Byte' as const,
      errorCorrectionLevel: 'Q' as const
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      crossOrigin: 'anonymous' as const,
      margin: 0
    },
    dotsOptions: {
      color: '#000000',
      type: 'square' as any
    },
    backgroundOptions: {
      color: '#ffffff',
      gradient: {
        type: 'linear' as const,
        rotation: 0,
        colorStops: [
          { offset: 0, color: '#ffffff' },
          { offset: 1, color: '#f0f0f0' }
        ]
      }
    },
    cornersSquareOptions: {
      color: '#000000',
      type: 'square' as any
    },
    cornersDotOptions: {
      color: '#000000',
      type: 'square' as any
    }
  });

  const [showColorPickers, setShowColorPickers] = useState({
    dots: false,
    background: false,
    corners: false,
    gradient1: false,
    gradient2: false
  });

  const [backgroundType, setBackgroundType] = useState('solid');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize QR code
  useEffect(() => {
    if (typeof window !== 'undefined') {
      qrCode.current = new QRCodeStyling(qrSettings);
      if (qrCodeRef.current) {
        qrCodeRef.current.innerHTML = '';
        qrCode.current.append(qrCodeRef.current);
      }
    }
  }, []);

  // Update QR code when settings change
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update(qrSettings);
    }
  }, [qrSettings]);

  // Load existing settings
  useEffect(() => {
    if (currentSettings) {
      setQrSettings({ ...qrSettings, ...currentSettings });
    }
  }, [currentSettings]);

  const updateQrSettings = (updates: any) => {
    setQrSettings(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    
    try {
      // Create a data URL from the file
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        updateQrSettings({
          image: imageDataUrl
        });
        setUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploadingLogo(false);
    }
  };

  const handleDownload = async () => {
    if (!qrCode.current) return;
    
    setIsGenerating(true);
    try {
      // Download as PNG
      await qrCode.current.download({
        name: `${username}-qr-code`,
        extension: 'png'
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
    setIsGenerating(false);
  };

  const handleSaveForPrint = async () => {
    if (!qrCode.current) return;
    
    setIsSaving(true);
    try {
      // Generate high-resolution version for print
      const printSettings = {
        ...qrSettings,
        width: 2000,
        height: 2000
      };
      
      qrCode.current.update(printSettings);
      
      // For now, we'll just save the settings and generate the URL on the server side
      // In production, you'd upload to Supabase storage here
      const timestamp = Date.now();
      const mockUrl = `https://storage.supabase.co/qr-codes/${username}-${timestamp}.png`;
      
      // Save settings and mock URL
      await onSave(qrSettings, mockUrl);
    } catch (error) {
      console.error('Error saving QR code for print:', error);
    }
    setIsSaving(false);
  };

  const ColorPicker = ({ 
    color, 
    onChange, 
    show, 
    onToggle 
  }: { 
    color: string; 
    onChange: (color: string) => void; 
    show: boolean; 
    onToggle: () => void; 
  }) => (
    <div className="relative">
      <button
        onClick={onToggle}
        className="w-12 h-8 rounded-lg border-2 border-white/20 hover:border-white/40 transition-colors"
        style={{ backgroundColor: color }}
      />
      {show && (
        <div className="absolute top-10 left-0 z-50 bg-gray-800 p-4 rounded-xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">Pick Color</h4>
            <button
              onClick={onToggle}
              className="text-white/60 hover:text-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <HexColorPicker
            color={color}
            onChange={onChange}
          />
          <div className="mt-3 p-2 bg-white/10 rounded text-white text-sm font-mono">
            {color}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <QrCodeIcon className="w-7 h-7 text-white" />
              </div>
              QR Code Styler
            </h1>
            <p className="text-white/60">Customize your personal QR code for @{username}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <EyeIcon className="w-6 h-6" />
                Live Preview
              </h2>
              
              <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
                <div
                  ref={qrCodeRef}
                  className="w-64 h-64 flex items-center justify-center"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      Download
                    </>
                  )}
                </button>

                <button
                  onClick={handleSaveForPrint}
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <BookmarkIcon className="w-5 h-5" />
                      Save for Print
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PhotoIcon className="w-6 h-6" />
                Logo / Profile Picture
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="w-full border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-white/50 transition-colors"
                >
                  {uploadingLogo ? (
                    <div className="flex items-center justify-center gap-2 text-white/60">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    <div>
                      <PhotoIcon className="w-8 h-8 text-white/60 mx-auto mb-2" />
                      <p className="text-white/80 font-medium">Upload Logo</p>
                      <p className="text-white/50 text-sm">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                {qrSettings.image && (
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                    <span className="text-white/80 text-sm">Logo uploaded</span>
                    <button
                      onClick={() => updateQrSettings({ image: '' })}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <SwatchIcon className="w-6 h-6" />
                Colors
              </h3>
              
              <div className="space-y-4">
                {/* Dots Color */}
                <div className="flex items-center justify-between">
                  <label className="text-white/80">Dots Color</label>
                  <ColorPicker
                    color={qrSettings.dotsOptions.color}
                    onChange={(color) => updateQrSettings({
                      dotsOptions: { ...qrSettings.dotsOptions, color }
                    })}
                    show={showColorPickers.dots}
                    onToggle={() => setShowColorPickers(prev => ({
                      ...prev,
                      dots: !prev.dots,
                      background: false,
                      corners: false
                    }))}
                  />
                </div>

                {/* Background Type */}
                <div className="space-y-2">
                  <label className="text-white/80 block">Background</label>
                  <select
                    value={backgroundType}
                    onChange={(e) => setBackgroundType(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    {backgroundTypes.map(type => (
                      <option key={type.id} value={type.id} className="bg-gray-800">
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Background Color(s) */}
                {backgroundType === 'solid' ? (
                  <div className="flex items-center justify-between">
                    <label className="text-white/80">Background Color</label>
                    <ColorPicker
                      color={qrSettings.backgroundOptions.color}
                      onChange={(color) => updateQrSettings({
                        backgroundOptions: { ...qrSettings.backgroundOptions, color }
                      })}
                      show={showColorPickers.background}
                      onToggle={() => setShowColorPickers(prev => ({
                        ...prev,
                        background: !prev.background,
                        dots: false,
                        corners: false
                      }))}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-white/80">Gradient Start</label>
                      <ColorPicker
                        color={qrSettings.backgroundOptions.gradient?.colorStops[0].color || '#ffffff'}
                        onChange={(color) => updateQrSettings({
                          backgroundOptions: {
                            ...qrSettings.backgroundOptions,
                            gradient: {
                              ...qrSettings.backgroundOptions.gradient,
                              colorStops: [
                                { offset: 0, color },
                                qrSettings.backgroundOptions.gradient?.colorStops[1] || { offset: 1, color: '#f0f0f0' }
                              ]
                            }
                          }
                        })}
                        show={showColorPickers.gradient1}
                        onToggle={() => setShowColorPickers(prev => ({
                          ...prev,
                          gradient1: !prev.gradient1,
                          gradient2: false,
                          dots: false,
                          corners: false
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-white/80">Gradient End</label>
                      <ColorPicker
                        color={qrSettings.backgroundOptions.gradient?.colorStops[1].color || '#f0f0f0'}
                        onChange={(color) => updateQrSettings({
                          backgroundOptions: {
                            ...qrSettings.backgroundOptions,
                            gradient: {
                              ...qrSettings.backgroundOptions.gradient,
                              colorStops: [
                                qrSettings.backgroundOptions.gradient?.colorStops[0] || { offset: 0, color: '#ffffff' },
                                { offset: 1, color }
                              ]
                            }
                          }
                        })}
                        show={showColorPickers.gradient2}
                        onToggle={() => setShowColorPickers(prev => ({
                          ...prev,
                          gradient2: !prev.gradient2,
                          gradient1: false,
                          dots: false,
                          corners: false
                        }))}
                      />
                    </div>
                  </div>
                )}

                {/* Corners Color */}
                <div className="flex items-center justify-between">
                  <label className="text-white/80">Corners Color</label>
                  <ColorPicker
                    color={qrSettings.cornersSquareOptions.color}
                    onChange={(color) => updateQrSettings({
                      cornersSquareOptions: { ...qrSettings.cornersSquareOptions, color },
                      cornersDotOptions: { ...qrSettings.cornersDotOptions, color }
                    })}
                    show={showColorPickers.corners}
                    onToggle={() => setShowColorPickers(prev => ({
                      ...prev,
                      corners: !prev.corners,
                      dots: false,
                      background: false
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Styles */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="w-6 h-6" />
                Styles
              </h3>
              
              <div className="space-y-4">
                {/* Dot Style */}
                <div>
                  <label className="text-white/80 block mb-2">Dot Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {dotTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => updateQrSettings({
                          dotsOptions: { ...qrSettings.dotsOptions, type: type.id }
                        })}
                        className={`p-3 rounded-lg border-2 transition-colors text-center ${
                          qrSettings.dotsOptions.type === type.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className="text-2xl mb-1">{type.preview}</div>
                        <div className="text-xs text-white/80">{type.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Corner Style */}
                <div>
                  <label className="text-white/80 block mb-2">Corner Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {cornerTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => updateQrSettings({
                          cornersSquareOptions: { ...qrSettings.cornersSquareOptions, type: type.id }
                        })}
                        className={`p-3 rounded-lg border-2 transition-colors text-center ${
                          qrSettings.cornersSquareOptions.type === type.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className="text-white/80 text-sm">{type.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}