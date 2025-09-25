'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (mode === 'login') {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, fullName);
      }

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder-white/50"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}