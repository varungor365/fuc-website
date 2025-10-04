import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'signin' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signIn, signUp, isLoading } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (activeTab === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      let success = false;
      
      if (activeTab === 'signin') {
        success = await signIn(formData.email, formData.password);
        if (!success) {
          setErrors({ general: 'Invalid email or password' });
        }
      } else {
        success = await signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
        if (!success) {
          setErrors({ general: 'Sign up failed. Please try again.' });
        }
      }

      if (success) {
        onClose();
        setFormData({
          email: '',
          password: '',
          name: '',
          confirmPassword: '',
          agreeToTerms: false,
        });
        setErrors({});
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
  };

  const inputClasses = "w-full p-3 bg-[#0F0F10] border border-[#333] rounded-lg text-[#E8E8E8] focus:border-[#E4C590] focus:outline-none transition-colors";
  const errorClasses = "text-red-400 text-sm mt-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-[#2A2A2A]">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#E4C590]">
                    {activeTab === 'signin' ? 'Welcome Back' : 'Join FashUn.Co.in'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2A2A2A] transition-colors"
                  >
                    <svg className="w-5 h-5 text-[#B8B8B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex mt-4 bg-[#0F0F10] rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('signin')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'signin'
                        ? 'bg-[#E4C590] text-black'
                        : 'text-[#B8B8B8] hover:text-[#E8E8E8]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setActiveTab('signup')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'signup'
                        ? 'bg-[#E4C590] text-black'
                        : 'text-[#B8B8B8] hover:text-[#E8E8E8]'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6">
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                    <p className="text-red-400 text-sm">{errors.general}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {activeTab === 'signup' && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#E8E8E8]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className={errorClasses}>{errors.name}</p>}
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#E8E8E8]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className={errorClasses}>{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2 text-[#E8E8E8]">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder={activeTab === 'signin' ? 'Enter your password' : 'Create a password (min. 6 characters)'}
                    />
                    {errors.password && <p className={errorClasses}>{errors.password}</p>}
                  </div>

                  {activeTab === 'signup' && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-[#E8E8E8]">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="Confirm your password"
                      />
                      {errors.confirmPassword && <p className={errorClasses}>{errors.confirmPassword}</p>}
                    </div>
                  )}

                  {activeTab === 'signin' && (
                    <div className="text-right">
                      <button
                        type="button"
                        className="text-sm text-[#E4C590] hover:text-[#E4C590]/80 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {activeTab === 'signup' && (
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 text-[#E4C590] bg-[#0F0F10] border-[#333] rounded focus:ring-[#E4C590] focus:ring-2"
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-[#B8B8B8]">
                        I agree to the{' '}
                        <a href="/terms-of-service" className="text-[#E4C590] hover:underline" target="_blank">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy-policy" className="text-[#E4C590] hover:underline" target="_blank">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  )}
                  {activeTab === 'signup' && errors.agreeToTerms && (
                    <p className={errorClasses}>{errors.agreeToTerms}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#E4C590] text-black font-semibold rounded-lg hover:bg-[#E4C590]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {activeTab === 'signin' ? 'Signing In...' : 'Creating Account...'}
                      </>
                    ) : (
                      activeTab === 'signin' ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </form>

                {/* Demo Credentials */}
                {activeTab === 'signin' && (
                  <div className="mt-6 p-4 bg-[#0F0F10] rounded-lg border border-[#333]">
                    <p className="text-sm text-[#B8B8B8] mb-2">Demo Credentials:</p>
                    <p className="text-xs text-[#888]">Email: demo@fashun.co.in</p>
                    <p className="text-xs text-[#888]">Password: demo123</p>
                  </div>
                )}

                {/* Social Login Options */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#333]" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-[#1A1A1A] text-[#B8B8B8]">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-2 border border-[#333] rounded-lg hover:bg-[#2A2A2A] transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="text-sm text-[#E8E8E8]">Google</span>
                    </button>
                    
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-2 border border-[#333] rounded-lg hover:bg-[#2A2A2A] transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-sm text-[#E8E8E8]">Facebook</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
