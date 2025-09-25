'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading component
const CustomizerLoading = () => (
  <div className="flex items-center justify-center h-[600px] bg-gray-900/50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="text-white mt-4">Loading Designer Studio...</p>
    </div>
  </div>
);

// Dynamically import SimpleTShirtCustomizer with no SSR
const SimpleTShirtCustomizer = dynamic(
  () => import('./SimpleTShirtCustomizer'),
  {
    loading: () => <CustomizerLoading />,
    ssr: false
  }
);

interface SimpleTShirtCustomizerWrapperProps {
  onDesignChange?: (design: any) => void;
}

const SimpleTShirtCustomizerWrapper: React.FC<SimpleTShirtCustomizerWrapperProps> = (props) => {
  return (
    <Suspense fallback={<CustomizerLoading />}>
      <SimpleTShirtCustomizer {...props} />
    </Suspense>
  );
};

export default SimpleTShirtCustomizerWrapper;