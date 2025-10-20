'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function TestAuthPage() {
  const { user, loading, signIn, signOut, signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleAppleLogin = () => {
    // Redirect to our API route which will handle the OAuth flow
    window.location.href = `/api/auth/social/apple?redirect=/test-auth`;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      setMessage('Login successful!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMessage('Signed out successfully!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
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
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Authentication Test</h1>
          
          {message && (
            <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
              {message}
            </div>
          )}
          
          {user ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Welcome, {user.email}!</h2>
              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <p className="mb-2"><strong>User ID:</strong> {user.id}</p>
                <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                <p className="mb-2"><strong>Provider:</strong> {user.app_metadata?.provider || 'Email'}</p>
                <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Sign In Options</h3>
              
              {/* Social Login Buttons */}
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={handleAppleLogin}
                  className="flex items-center justify-center px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Sign in with Apple
                </button>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>
              
              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  Sign In with Email
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}