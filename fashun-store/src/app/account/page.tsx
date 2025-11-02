'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase-client';
import { CustomerAnalytics } from '@/components/ui/customer-analytics';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for successful authentication redirect
    if (searchParams?.get('auth_success') === 'true') {
      // Force refresh the session to ensure proper state sync
      const refreshSession = async () => {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (data?.session) {
            console.log('Session refreshed successfully');
            toast.success('Welcome! You are now signed in.');
            // Clean up the URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
        } catch (error) {
          console.error('Session refresh error:', error);
        }
      };
      refreshSession();
    }

    // Redirect to login if not authenticated (with a small delay to allow session refresh)
    const checkAuth = setTimeout(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, 1000);

    return () => clearTimeout(checkAuth);
  }, [user, loading, router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Signing you in...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">My Account</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:shadow-lg transition"
            >
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center border border-white/10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-white">
                  {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-gray-400 text-sm mt-1">{user.email}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Email</label>
                    <p className="mt-1 text-sm text-white">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400">User ID</label>
                    <p className="mt-1 text-sm text-white">{user.id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Provider</label>
                    <p className="mt-1 text-sm text-white">
                      {user.app_metadata?.provider || 'Email'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Last Sign In</label>
                    <p className="mt-1 text-sm text-white">
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleString() 
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Analytics Section */}
        <div className="mt-8">
          <CustomerAnalytics />
        </div>
      </div>
    </div>
  );
}
