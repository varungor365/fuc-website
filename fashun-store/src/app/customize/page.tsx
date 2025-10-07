'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
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
    return (
      <MainLayout>
        <VirtualTryOn designImage={customDesign} onBack={handleBackToEditor} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <CustomizerCanvas onVirtualTryOn={handleVirtualTryOn} />
    </MainLayout>
  );
}
