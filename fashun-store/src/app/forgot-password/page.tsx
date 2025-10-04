'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  KeyIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  const handleResend = () => {
    setIsSubmitted(false)
    setEmail('')
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 w-full max-w-md px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-primary-900/30 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center"
          >
            <div className="bg-green-500/20 rounded-full p-4 w-fit mx-auto mb-6">
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Check Your Email</h1>
            
            <p className="text-primary-200 mb-6 leading-relaxed">
              We've sent a password reset link to{' '}
              <span className="text-accent-400 font-medium">{email}</span>
            </p>

            <div className="bg-primary-800/30 border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-start space-x-3 text-left">
                <EnvelopeIcon className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-primary-200">
                  <p className="mb-2">
                    Click the link in the email to reset your password. 
                    The link will expire in 24 hours for security.
                  </p>
                  <p>
                    Don't see the email? Check your spam folder or try again.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleResend}
                className="w-full btn btn-glass"
              >
                Send Another Email
              </button>
              
              <Link
                href="/login"
                className="w-full btn btn-ghost text-white border-white/30 hover:bg-white/10 flex items-center justify-center"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>

            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
              <div className="flex items-start text-left">
                <ClockIcon className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-primary-200">
                  <p className="font-medium text-white mb-1">Security Note</p>
                  <p>
                    For security reasons, we don't confirm whether an email address 
                    exists in our system. If you have an account, you'll receive the reset email.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-primary-900/30 backdrop-blur-md border border-white/10 rounded-3xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-accent-500/20 rounded-full p-4 w-fit mx-auto mb-6">
              <KeyIcon className="w-8 h-8 text-accent-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-primary-200">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-primary-800/30 border rounded-xl text-white placeholder-primary-400 focus:outline-none focus:ring-2 transition-all ${
                    error 
                      ? 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20' 
                      : 'border-white/10 focus:border-accent-400/50 focus:ring-accent-400/20'
                  }`}
                  placeholder="Enter your registered email"
                />
              </div>
              {error && (
                <div className="mt-2 flex items-center text-red-400 text-sm">
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  {error}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-glass relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary-900 border-t-transparent rounded-full animate-spin mr-2" />
                  Sending Reset Link...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Send Reset Link
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </div>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="text-accent-400 hover:text-accent-300 font-semibold transition-colors flex items-center justify-center"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-primary-800/20 border border-white/10 rounded-xl">
            <div className="flex items-start">
              <ShieldCheckIcon className="w-5 h-5 text-accent-400 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-primary-200">
                <p className="font-medium text-white mb-2">Need Help?</p>
                <ul className="space-y-1 text-primary-300">
                  <li>• Make sure you're using the email associated with your account</li>
                  <li>• Check your spam or junk folder for the reset email</li>
                  <li>• The reset link expires after 24 hours</li>
                  <li>• Contact support if you still can't access your account</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alternative Actions */}
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-primary-900/30 text-primary-400">Or</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <Link
                href="/register"
                className="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors"
              >
                Create Account
              </Link>
              <Link
                href="/contact"
                className="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Security Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-center"
        >
          <div className="bg-primary-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-center text-primary-300 text-sm">
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              <span>Your security is our priority. Reset links are encrypted and expire automatically.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}