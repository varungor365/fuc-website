'use client';

import { useState } from 'react';
import CustomizerCanvas from '@/components/customize/CustomizerCanvas';
import VirtualTryOn from '@/components/customize/VirtualTryOn';

export default function CustomizePage() {
  const [showTryOn, setShowTryOn] = useState(false);
  const [customDesign, setCustomDesign] = useState<string | null>(null);

  const handleVirtualTryOn = (designImage: string) => {
    setCustomDesign(designImage);
    setShowTryOn(true);
  };

  const handleBackToEditor = () => {
    setShowTryOn(false);
    setCustomDesign(null);
  };

  if (showTryOn && customDesign) {
    return <VirtualTryOn designImage={customDesign} onBack={handleBackToEditor} />;
  }

  return <CustomizerCanvas onVirtualTryOn={handleVirtualTryOn} />;
}
