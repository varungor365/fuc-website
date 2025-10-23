'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

export default function AdminLogin() {
  const router = useRouter();
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const ADMIN_EMAIL = 'fashun.co.in@gmail.com'; // Hidden from UI for security
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAdminSetup();
  }, []);

  const checkAdminSetup = async () => {
    try {
      const response = await fetch('/api/admin/check');
      const data = await response.json();
      setIsFirstTimeSetup(data.needsSetup);
    } catch (error) {
      console.error('Error checking admin setup:', error);
      setError('Failed to check admin setup status');
    } finally {
      setIsCheckingSetup(false);
    }
  };

  const handleFirstTimeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to setup admin account');
        return;
      }
      
      // After successful setup, automatically log in
      await handleLogin(e);
    } catch (error) {
      console.error('Setup error:', error);
      setError('Failed to setup admin account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });
      
      if (signInError) {
        setError(signInError.message || 'Invalid email or password');
        return;
      }
      
      // Verify user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profileError || profile?.role !== 'admin') {
        await supabase.auth.signOut();
        setError('Access denied. Admin privileges required.');
        return;
      }
      
      // Redirect to admin dashboard
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isFirstTimeSetup ? handleFirstTimeSetup : handleLogin;

  if (isCheckingSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Checking admin setup...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          {isFirstTimeSetup ? 'Admin Setup' : 'Admin Login'}
        </h1>
        <p className="text-white/70 text-sm mb-6 text-center">
          {isFirstTimeSetup 
            ? 'Create your admin password for first-time setup' 
            : 'Sign in to access the admin dashboard'}
        </p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2 text-sm font-medium">
              {isFirstTimeSetup ? 'Create Admin Password' : 'Admin Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
              placeholder={isFirstTimeSetup ? 'Minimum 8 characters' : 'Enter your password'}
              required
              minLength={8}
            />
          </div>
          
          {isFirstTimeSetup && (
            <div className="mb-6">
              <label className="block text-white mb-2 text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                placeholder="Re-enter your password"
                required
                minLength={8}
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : (isFirstTimeSetup ? 'Create Admin Account' : 'Login')}
          </button>
        </form>
        
        {isFirstTimeSetup && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-200 text-xs">
              <strong>First-time setup:</strong> Your password will be securely stored and used for all future logins.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
