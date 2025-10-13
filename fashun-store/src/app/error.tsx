'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-800 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl font-brand text-accent-500 mb-4">Oops!</h1>
          <h2 className="text-2xl font-heading text-white mb-2">Something went wrong</h2>
          <p className="text-primary-300">
            We're sorry for the inconvenience. Please try again.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-primary-900 font-semibold px-8 py-3 rounded-lg hover:from-accent-400 hover:to-accent-500 transition-all"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="block w-full bg-white/10 text-white font-medium px-8 py-3 rounded-lg hover:bg-white/20 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
