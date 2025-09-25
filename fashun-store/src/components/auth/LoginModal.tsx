'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
  ShieldCheckIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { trackLogin, trackSignUp, trackEvent } from '@/lib/analytics';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
  onSocialLogin: (provider: 'google' | 'facebook' | 'apple') => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password';

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onSocialLogin
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (authMode !== 'forgot-password') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
    }

    if (authMode === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await onLogin(formData.email, formData.password);
      } else if (authMode === 'register') {
        await onRegister(formData.name, formData.email, formData.password);
      } else {
        // Handle forgot password
        alert('Password reset link sent to your email!');
        setAuthMode('login');
      }
      onClose();
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    try {
      await onSocialLogin(provider);
      trackLogin(provider);
      trackEvent('social_login_success', 'Authentication', provider);
      onClose();
    } catch (error) {
      console.error('Social login error:', error);
      trackEvent('social_login_error', 'Authentication', provider);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-primary-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>

              {/* Header */}
              <div className="relative px-8 pt-8 pb-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {authMode === 'login' && 'Welcome Back'}
                  {authMode === 'register' && 'Join FASHUN'}
                  {authMode === 'forgot-password' && 'Reset Password'}
                </h2>
                <p className="text-gray-400">
                  {authMode === 'login' && 'Sign in to your account to continue'}
                  {authMode === 'register' && 'Create your account and join the streetwear revolution'}
                  {authMode === 'forgot-password' && 'Enter your email to reset your password'}
                </p>
              </div>

              {/* Form */}
              <div className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field (Register only) */}
                  {authMode === 'register' && (
                    <div>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-300"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-300"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  {authMode !== 'forgot-password' && (
                    <div>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>
                  )}

                  {/* Confirm Password Field (Register only) */}
                  {authMode === 'register' && (
                    <div>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-300"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  {/* Forgot Password Link */}
                  {authMode === 'login' && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot-password')}
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-3 font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <>
                        {authMode === 'login' && 'Sign In'}
                        {authMode === 'register' && 'Create Account'}
                        {authMode === 'forgot-password' && 'Send Reset Link'}
                      </>
                    )}
                  </button>
                </form>

                {/* Social Login */}
                {authMode !== 'forgot-password' && (
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-primary-900 text-gray-400">Or continue with</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleSocialLogin('google')}
                        className="flex justify-center items-center px-4 py-2 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleSocialLogin('facebook')}
                        className="flex justify-center items-center px-4 py-2 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleSocialLogin('apple')}
                        className="flex justify-center items-center px-4 py-2 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C8.396 0 8.025.044 8.025.044c0 0-.396 2.325 1.985 3.374 2.381 1.049 5.017-1.895 5.017-1.895s.508-.146.678 1.792c.17 1.938-1.893 1.893-1.893 1.893s-1.188.145-.678-.678c.51-.823 2.55-.678 2.55-.678s.848 1.893-.678 3.374c-1.526 1.481-4.415 1.748-4.415 1.748s-2.325.679-1.188 2.55 3.374.339 3.374.339 2.55 1.893 1.528 4.755c-1.022 2.862-5.186 2.325-5.186 2.325s-3.544-.339-3.544-2.55c0-2.211 2.55-2.55 2.55-2.55s2.55-.339 2.55-1.893-.678-1.893-.678-1.893-3.374.678-3.544 3.374-.339 6.789 4.245 6.789c4.584 0 5.186-6.789 5.186-6.789s.339-4.924-2.55-6.449c-2.889-1.525-5.356 1.893-5.356 1.893s-2.889 3.374-1.188 6.449 6.449 2.55 6.449 2.55 6.788-2.211 6.788-8.321C24 8.396 12.017 0 12.017 0z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Mode Switch */}
                <div className="mt-6 text-center">
                  {authMode === 'login' && (
                    <p className="text-gray-400">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setAuthMode('register')}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                      >
                        Sign up
                      </button>
                    </p>
                  )}
                  {authMode === 'register' && (
                    <p className="text-gray-400">
                      Already have an account?{' '}
                      <button
                        onClick={() => setAuthMode('login')}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                  {authMode === 'forgot-password' && (
                    <p className="text-gray-400">
                      Remember your password?{' '}
                      <button
                        onClick={() => setAuthMode('login')}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </div>

                {/* Benefits for Registration */}
                {authMode === 'register' && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <GiftIcon className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-medium">Join FASHUN and get:</span>
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• 10% off your first order</li>
                      <li>• Early access to new collections</li>
                      <li>• Exclusive member-only deals</li>
                      <li>• Style recommendations from AI</li>
                    </ul>
                  </div>
                )}

                {/* Security Badge */}
                <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-400">
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>Your data is protected with 256-bit SSL encryption</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginModal;