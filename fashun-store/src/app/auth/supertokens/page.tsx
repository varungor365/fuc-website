'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SuperTokensAuthPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderAuthComponents = () => {
    if (!isClient) return null;

    // Dynamic import to prevent SSR issues
    try {
      const { EmailPasswordAuth } = require('supertokens-auth-react/recipe/emailpassword');
      const { ThirdPartyAuth } = require('supertokens-auth-react/recipe/thirdparty');

      return (
        <div className="space-y-6">
          {/* Social Login Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Sign In
            </h3>
            <ThirdPartyAuth />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-primary-900/75 text-gray-300">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Section */}
          <div>
            <EmailPasswordAuth />
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="text-center text-white">
          <p>Loading authentication...</p>
          <p className="text-sm text-gray-400 mt-2">
            SuperTokens is initializing. Please wait.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to FASHUN.CO
            </h1>
            <p className="text-gray-300">
              Sign in to access your premium streetwear experience
            </p>
          </div>

          {/* SuperTokens Authentication Components */}
          {renderAuthComponents()}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              By signing in, you agree to our{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}