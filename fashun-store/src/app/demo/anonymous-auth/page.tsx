'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function AnonymousAuthDemo() {
  const { user, loading, signInAnonymously, isAnonymous, signOut } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAnonymousSignIn = async () => {
    setMessage('');
    setError('');
    
    try {
      const { data, error } = await signInAnonymously();
      
      if (error) {
        throw new Error(error.message || 'Failed to sign in anonymously');
      }
      
      setMessage('Successfully signed in as anonymous user!');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in anonymously');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMessage('Signed out successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
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
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Anonymous Authentication Demo</h1>
          <p className="text-gray-600 text-center mb-8">
            Try anonymous authentication with Supabase
          </p>
          
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Current Status</h2>
              
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium">Authenticated</span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                      {user.id}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Is Anonymous</p>
                    <p className="font-medium">
                      {isAnonymous ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </p>
                  </div>
                  
                  {user.email && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="font-medium">Not Authenticated</span>
                  </div>
                  
                  <button
                    onClick={handleAnonymousSignIn}
                    className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Sign In Anonymously
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <p className="text-gray-700">
                    User clicks "Sign In Anonymously" button
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <p className="text-gray-700">
                    Supabase creates a temporary anonymous account
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <p className="text-gray-700">
                    User can interact with the app without providing credentials
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <p className="text-gray-700">
                    Later, user can upgrade to a full account by linking email or social providers
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Use Cases</h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Let users try features before signing up</li>
                  <li>• Collect user data without registration friction</li>
                  <li>• Provide personalized experiences immediately</li>
                  <li>• Reduce bounce rates on landing pages</li>
                </ul>
              </div>
            </div>
          </div>
          
          {isAnonymous && user && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Anonymous User Features</h3>
              <p className="text-green-700 mb-4">
                As an anonymous user, you can interact with the application. Your data is associated with your anonymous account.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Shopping Cart</h4>
                  <p className="text-sm text-gray-600">Add items to cart and save for later</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Wishlist</h4>
                  <p className="text-sm text-gray-600">Save favorite products</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Preferences</h4>
                  <p className="text-sm text-gray-600">Save UI preferences and settings</p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/upgrade-account')}
                  className="py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition"
                >
                  Upgrade to Full Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}