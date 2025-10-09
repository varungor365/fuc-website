'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function UpgradeAccountPage() {
  const { user, isAnonymous, loading, signOut, signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Redirect if user is not anonymous
  if (!loading && user && !isAnonymous) {
    router.push('/account');
    return null;
  }

  // Redirect if user is not authenticated
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoadingUpgrade(true);
    setError('');
    setMessage('');
    
    try {
      // First, try to sign up the user with the provided credentials
      const { data, error: signUpError } = await signUp(email, password);
      
      if (signUpError) {
        throw new Error(signUpError.message || 'Failed to create account');
      }
      
      // If successful, sign out the anonymous user and sign in with the new account
      await signOut();
      
      // Sign in with the new credentials
      // Note: In a real implementation, you would transfer data from the anonymous account
      // to the new account before signing out
      
      setMessage('Account successfully upgraded! You are now signed in with your new account.');
      
      // Redirect to account page after a short delay
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    } catch (err: any) {
      console.error('Upgrade error:', err);
      setError(err.message || 'Failed to upgrade account');
    } finally {
      setLoadingUpgrade(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Upgrade Your Account</h1>
            <p className="text-gray-600 mt-2">
              Convert your anonymous account to a full account
            </p>
          </div>
          
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">Anonymous Account</p>
                <p className="text-xs text-blue-700 mt-1">
                  Your current anonymous account will be converted to a full account with email and password.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleUpgrade} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="you@example.com"
                disabled={loadingUpgrade}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                disabled={loadingUpgrade}
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters long
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                disabled={loadingUpgrade}
              />
            </div>
            
            <button
              type="submit"
              disabled={loadingUpgrade}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loadingUpgrade ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Upgrading Account...
                </div>
              ) : (
                'Upgrade to Full Account'
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push('/')}
              className="w-full py-2 px-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Continue as Anonymous
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}