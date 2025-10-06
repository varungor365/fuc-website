'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Fingerprint, Sparkles, Shield } from 'lucide-react';
import { MedusaCustomerService } from '@/services/medusa';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic' | 'passkey'>('password');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast.success('Account created! Please sign in.');
    }
  }, [searchParams]);

  const checkPasswordBreach = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/check-breach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      return data.breached;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (loginMethod === 'password' && !formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const isBreached = await checkPasswordBreach(formData.password);
      if (isBreached) {
        toast.error('⚠️ This password has been compromised. Please use a different one.');
        setLoading(false);
        return;
      }

      const customer = await MedusaCustomerService.login(formData.email, formData.password);
      
      localStorage.setItem('customer_id', customer.id);
      localStorage.setItem('customer_email', customer.email);
      
      toast.success('Welcome back!');
      router.push('/account');
    } catch (error: any) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      if (response.ok) {
        setMagicLinkSent(true);
        toast.success('Magic link sent! Check your email.');
      } else {
        toast.error('Failed to send magic link');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setLoading(true);
    try {
      if (!window.PublicKeyCredential) {
        toast.error('Passkeys not supported on this device');
        return;
      }

      const response = await fetch('/api/auth/passkey/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const { challenge, allowCredentials } = await response.json();

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
          allowCredentials: allowCredentials.map((cred: any) => ({
            id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
            type: 'public-key'
          })),
          timeout: 60000,
          userVerification: 'required'
        }
      }) as any;

      const verifyResponse = await fetch('/api/auth/passkey/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: {
            id: credential.id,
            rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
            response: {
              authenticatorData: btoa(String.fromCharCode(...new Uint8Array(credential.response.authenticatorData))),
              clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))),
              signature: btoa(String.fromCharCode(...new Uint8Array(credential.response.signature)))
            }
          }
        })
      });

      if (verifyResponse.ok) {
        const { customer } = await verifyResponse.json();
        localStorage.setItem('customer_id', customer.id);
        localStorage.setItem('customer_email', customer.email);
        toast.success('Signed in with passkey!');
        router.push('/account');
      }
    } catch (error) {
      toast.error('Passkey authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    window.location.href = `/api/auth/social/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Login Method Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                loginMethod === 'password'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lock className="w-4 h-4 inline mr-1" />
              Password
            </button>
            <button
              onClick={() => setLoginMethod('magic')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                loginMethod === 'magic'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              Magic Link
            </button>
            <button
              onClick={() => setLoginMethod('passkey')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                loginMethod === 'passkey'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Fingerprint className="w-4 h-4 inline mr-1" />
              Passkey
            </button>
          </div>

          {/* Password Login */}
          {loginMethod === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Magic Link Login */}
          {loginMethod === 'magic' && !magicLinkSent && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Sparkles className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Passwordless Login</p>
                    <p className="text-xs text-purple-700 mt-1">
                      We'll send a secure link to your email. Click it to sign in instantly.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
          )}

          {magicLinkSent && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
              <p className="text-gray-600 mb-4">
                We sent a magic link to <strong>{formData.email}</strong>
              </p>
              <button
                onClick={() => setMagicLinkSent(false)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Try another email
              </button>
            </div>
          )}

          {/* Passkey Login */}
          {loginMethod === 'passkey' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Secure Biometric Login</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Use your fingerprint, face, or device PIN for instant secure access.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                onClick={handlePasskeyLogin}
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
              >
                <Fingerprint className="w-5 h-5 mr-2" />
                {loading ? 'Authenticating...' : 'Sign In with Passkey'}
              </button>
            </div>
          )}

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              <button
                onClick={() => handleSocialLogin('apple')}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                Create Account
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-2 text-green-600" />
              Protected by bot detection & breach monitoring
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
