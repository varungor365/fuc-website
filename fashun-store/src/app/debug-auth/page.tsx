'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export default function AuthDebugPage() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    addLog('Component mounted, checking initial session...');
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        addLog(`Error getting session: ${error.message}`);
      } else if (session) {
        addLog(`Initial session found for user: ${session.user?.email}`);
        setSession(session);
        setUser(session.user);
      } else {
        addLog('No initial session found');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      addLog(`Auth state changed: ${event}`);
      if (session) {
        addLog(`New session for user: ${session.user?.email}`);
        setSession(session);
        setUser(session.user);
      } else {
        addLog('Session cleared');
        setSession(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    addLog('Initiating Google login...');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=/debug-auth`,
        },
      });
      
      if (error) {
        addLog(`Google login error: ${error.message}`);
      } else {
        addLog('Google login initiated, redirecting...');
      }
    } catch (err) {
      addLog(`Google login exception: ${err}`);
    }
  };

  const handleLogout = async () => {
    addLog('Logging out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      addLog(`Logout error: ${error.message}`);
    } else {
      addLog('Logged out successfully');
    }
  };

  const handleRefreshSession = async () => {
    addLog('Refreshing session...');
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      addLog(`Refresh error: ${error.message}`);
    } else {
      addLog('Session refreshed successfully');
      setSession(data.session);
      setUser(data.user);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Console</h1>
      
      {/* Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Current Status</h2>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Authenticated:</strong> {user ? 'Yes' : 'No'}</p>
        {user && (
          <div className="mt-2">
            <p><strong>User Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Provider:</strong> {user.app_metadata?.provider}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mb-6 space-x-4">
        {!user ? (
          <button
            onClick={handleGoogleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login with Google
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
        
        <button
          onClick={handleRefreshSession}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Refresh Session
        </button>
        
        <button
          onClick={() => setLogs([])}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Logs
        </button>
      </div>

      {/* Session Details */}
      {session && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Session Details</h2>
          <pre className="text-sm overflow-auto bg-white p-2 rounded border">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      )}

      {/* Environment Info */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Environment Info</h2>
        <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
        <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        <p><strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL}</p>
      </div>

      {/* Logs */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Debug Logs</h2>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-auto">
          {logs.length === 0 ? (
            <p>No logs yet...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}