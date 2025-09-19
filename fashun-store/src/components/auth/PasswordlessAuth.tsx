'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Key, Chrome, Apple, Github, Loader2, Check, AlertCircle } from 'lucide-react';
import PasswordlessAuthService from '@/lib/passwordless-auth';

interface PasswordlessAuthProps {
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  redirectUrl?: string;
}

const PasswordlessAuth: React.FC<PasswordlessAuthProps> = ({
  onSuccess,
  onError,
  redirectUrl = '/account'
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [activeMethod, setActiveMethod] = useState<'magic-link' | 'passkey' | 'social'>('magic-link');
  const [hasPasskeys, setHasPasskeys] = useState(false);
  const [supportsPasskeys, setSupportsPasskeys] = useState(false);

  const authService = new PasswordlessAuthService();

  useEffect(() => {
    // Check if passkeys are supported
    if (window.PublicKeyCredential) {
      setSupportsPasskeys(true);
    }
  }, []);

  useEffect(() => {
    // Check if user has existing passkeys when email changes
    if (email && email.includes('@')) {
      checkExistingPasskeys();
    }
  }, [email]);

  const checkExistingPasskeys = async () => {
    try {
      const hasKeys = await authService.hasPasskeys(email);
      setHasPasskeys(hasKeys);
    } catch (error) {
      console.error('Error checking passkeys:', error);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    if (type === 'error' && onError) {
      onError(msg);
    }
  };

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showMessage('Please enter your email address', 'error');
      return;
    }

    setLoading(true);
    clearMessage();

    try {
      const result = await authService.sendMagicLink(email);
      if (result.success) {
        showMessage(result.message, 'success');
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Failed to send magic link. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyAuth = async () => {
    setLoading(true);
    clearMessage();

    try {
      const result = await authService.authenticateWithPasskey();
      if (result.success) {
        showMessage(result.message, 'success');
        if (onSuccess) {
          onSuccess(result);
        }
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        }
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Passkey authentication failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyRegister = async () => {
    if (!email) {
      showMessage('Please enter your email address first', 'error');
      return;
    }

    setLoading(true);
    clearMessage();

    try {
      const displayName = email.split('@')[0];
      const result = await authService.registerPasskey(email, displayName);
      if (result.success) {
        showMessage(result.message, 'success');
        setHasPasskeys(true);
        if (onSuccess) {
          onSuccess(result);
        }
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        }
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Failed to register passkey. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple' | 'github') => {
    setLoading(true);
    clearMessage();

    try {
      const result = await authService.socialAuth(provider);
      if (result.success) {
        showMessage(result.message, 'success');
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage(`Failed to authenticate with ${provider}`, 'error');
    }
    // Note: Loading will remain true as user is being redirected
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          messageType === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {messageType === 'success' ? (
            <Check className="w-5 h-5 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          )}
          <span className="text-sm">{message}</span>
        </div>
      )}

      {/* Method Selection */}
      <div className="mb-6">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setActiveMethod('magic-link')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeMethod === 'magic-link'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Mail className="w-4 h-4 mx-auto mb-1" />
            Magic Link
          </button>
          {supportsPasskeys && (
            <button
              onClick={() => setActiveMethod('passkey')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeMethod === 'passkey'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Key className="w-4 h-4 mx-auto mb-1" />
              Passkey
            </button>
          )}
          <button
            onClick={() => setActiveMethod('social')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeMethod === 'social'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Chrome className="w-4 h-4 mx-auto mb-1" />
            Social
          </button>
        </div>
      </div>

      {/* Magic Link Method */}
      {activeMethod === 'magic-link' && (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
          <p className="text-xs text-gray-500 text-center">
            We'll send you a secure link to sign in instantly
          </p>
        </form>
      )}

      {/* Passkey Method */}
      {activeMethod === 'passkey' && (
        <div className="space-y-4">
          {!hasPasskeys && (
            <div>
              <label htmlFor="passkey-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="passkey-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          )}

          {hasPasskeys ? (
            <button
              onClick={handlePasskeyAuth}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Key className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Authenticating...' : 'Sign in with Passkey'}
            </button>
          ) : (
            <button
              onClick={handlePasskeyRegister}
              disabled={loading || !email}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Key className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Creating...' : 'Create Passkey'}
            </button>
          )}

          <p className="text-xs text-gray-500 text-center">
            {hasPasskeys 
              ? 'Use your registered passkey to sign in securely'
              : 'Create a passkey for secure, password-free authentication'
            }
          </p>
        </div>
      )}

      {/* Social Authentication */}
      {activeMethod === 'social' && (
        <div className="space-y-3">
          <button
            onClick={() => handleSocialAuth('google')}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Chrome className="w-4 h-4 mr-2" />
            )}
            Continue with Google
          </button>

          <button
            onClick={() => handleSocialAuth('apple')}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Apple className="w-4 h-4 mr-2" />
            )}
            Continue with Apple
          </button>

          <button
            onClick={() => handleSocialAuth('github')}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Github className="w-4 h-4 mr-2" />
            )}
            Continue with GitHub
          </button>

          <p className="text-xs text-gray-500 text-center">
            Sign in securely with your preferred social account
          </p>
        </div>
      )}

      {/* Benefits */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Why passwordless?</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• More secure than passwords</li>
          <li>• No password to remember or forget</li>
          <li>• Faster and more convenient sign-in</li>
          <li>• Protected against phishing attacks</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordlessAuth;