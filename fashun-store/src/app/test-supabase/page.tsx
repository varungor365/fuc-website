'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    const tests: any = {};
    
    try {
      // Test 1: Basic connection
      console.log('Testing Supabase connection...');
      setConnectionStatus('connecting');
      
      // Test 2: Query a system table to verify connection
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);

      if (error) {
        console.error('Connection error:', error);
        tests.connection = { status: 'error', message: error.message };
      } else {
        tests.connection = { status: 'success', message: 'Connected successfully' };
      }

      // Test 3: Try to query products table (will fail if table doesn't exist)
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(1);

      if (productsError) {
        tests.products = { 
          status: 'warning', 
          message: `Products table not found: ${productsError.message}` 
        };
      } else {
        tests.products = { 
          status: 'success', 
          message: `Products table exists with ${productsData?.length || 0} sample records` 
        };
      }

      // Test 4: Auth status
      const { data: authData } = await supabase.auth.getSession();
      tests.auth = {
        status: authData.session ? 'success' : 'info',
        message: authData.session ? 'User logged in' : 'No user session (normal for new setup)'
      };

      setResults(tests);
      setConnectionStatus('completed');

    } catch (error) {
      console.error('Test failed:', error);
      setConnectionStatus('error');
      setResults({ 
        general: { 
          status: 'error', 
          message: `Test failed: ${(error as Error).message}` 
        } 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'info': return 'text-blue-400';
      default: return 'text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '🔄';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6">🧪 Supabase Connection Test</h1>
          <p className="text-white/70 mb-8">
            Testing the connection to your Supabase project and database setup.
          </p>

          {/* Connection Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Connection Status</h2>
            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  connectionStatus === 'testing' ? 'bg-yellow-400 animate-pulse' :
                  connectionStatus === 'connecting' ? 'bg-blue-400 animate-pulse' :
                  connectionStatus === 'completed' ? 'bg-green-400' :
                  'bg-red-400'
                }`}></div>
                <span className="text-white font-mono">
                  {connectionStatus === 'testing' && 'Initializing tests...'}
                  {connectionStatus === 'connecting' && 'Connecting to Supabase...'}
                  {connectionStatus === 'completed' && 'Tests completed'}
                  {connectionStatus === 'error' && 'Connection failed'}
                </span>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Test Results</h2>
            
            {Object.keys(results).length === 0 ? (
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  <span className="text-white/70">Running tests...</span>
                </div>
              </div>
            ) : (
              Object.entries(results).map(([testName, result]: [string, any]) => (
                <div key={testName} className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{getStatusIcon(result.status)}</span>
                    <div>
                      <h3 className="font-semibold text-white capitalize mb-1">
                        {testName} Test
                      </h3>
                      <p className={`text-sm ${getStatusColor(result.status)}`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">📋 Next Steps</h3>
            <div className="text-blue-100 space-y-2 text-sm">
              <p>• If connection test passes: Your Supabase project is properly configured!</p>
              <p>• If products table warning: Run the SQL schema from <code className="bg-black/30 px-1 rounded">supabase-schema.sql</code></p>
              <p>• Go to your Supabase dashboard → SQL Editor → Paste the schema → Run</p>
              <p>• Then refresh this page to see all tests pass</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button
              onClick={testSupabaseConnection}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              🔄 Rerun Tests
            </button>
            <a
              href="https://supabase.com/dashboard/project/sjgcvozzuobmlejsokzi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300"
            >
              🔗 Open Supabase Dashboard
            </a>
            <a
              href="/"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-all duration-300"
            >
              🏠 Back to Home
            </a>
          </div>

          {/* Technical Details */}
          <div className="mt-8 bg-gray-900/50 rounded-lg p-4">
            <details className="text-white">
              <summary className="cursor-pointer font-semibold mb-2">🔧 Technical Details</summary>
              <div className="text-sm text-white/70 space-y-1 font-mono">
                <p>Project URL: https://sjgcvozzuobmlejsokzi.supabase.co</p>
                <p>Environment: {process.env.NODE_ENV}</p>
                <p>Client configured: {typeof supabase !== 'undefined' ? '✅' : '❌'}</p>
                <p>API Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}