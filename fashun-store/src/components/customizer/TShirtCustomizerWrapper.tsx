'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading component
const CustomizerLoading = () => (
  <div className="flex items-center justify-center h-[500px] bg-gray-900/50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="text-white mt-4">Loading Designer...</p>
    </div>
  </div>
);

// Dynamically import TShirtCustomizer with no SSR
const TShirtCustomizer = dynamic(
  () => import('./TShirtCustomizer'),
  {
    loading: () => <CustomizerLoading />,
    ssr: false
  }
);

interface TShirtCustomizerWrapperProps {
  onDesignChange?: (design: any) => void;
}

const TShirtCustomizerWrapper: React.FC<TShirtCustomizerWrapperProps> = (props) => {
  return (
    <Suspense fallback={<CustomizerLoading />}>
      <TShirtCustomizer {...props} />
    </Suspense>
  );
};

export default TShirtCustomizerWrapper;