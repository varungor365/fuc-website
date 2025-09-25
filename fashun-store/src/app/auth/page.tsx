'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { AuthForm } from '@/components/auth/AuthForm';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  if (user) {
    router.push('/');
    return null;
  }

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">FashUn.Co</h1>
          <p className="text-white/70">Premium Streetwear Collection</p>
        </div>

        <AuthForm mode={mode} onSuccess={handleSuccess} />

        <div className="text-center mt-6">
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-white/70 hover:text-white transition-colors"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
    </div>
  );
}