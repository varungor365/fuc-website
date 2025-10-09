'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<any>;
  linkIdentity: (provider: 'google' | 'apple' | 'github') => Promise<any>;
  unlinkIdentity: (identityId: string) => Promise<any>;
  getIdentities: () => Promise<any>;
  signInAnonymously: () => Promise<any>;
  isAnonymous: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Check if user is anonymous (no email)
          setIsAnonymous(!session.user.email);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Check if user is anonymous (no email)
          setIsAnonymous(!session.user.email);
        } else {
          setUser(null);
          setIsAnonymous(false);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAnonymous(false);
  };

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
  };

  const signInAnonymously = async () => {
    try {
      // Sign in anonymously using Supabase
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) throw error;
      
      if (data?.user) {
        setUser(data.user);
        setIsAnonymous(true);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      return { data: null, error };
    }
  };

  const linkIdentity = async (provider: 'google' | 'apple' | 'github') => {
    try {
      // Get the current access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Link the new identity using the correct Supabase method
      // This will redirect the user to the provider's authentication page
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/account/identities`,
          skipBrowserRedirect: true // We'll handle the redirect ourselves
        },
      });

      if (error) throw error;
      
      // Redirect the user to the provider's authentication page
      if (data?.url) {
        window.location.href = data.url;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error linking identity:', error);
      return { data: null, error };
    }
  };

  const unlinkIdentity = async (identityId: string) => {
    try {
      // Call our custom API endpoint to unlink the identity
      const response = await fetch('/api/auth/unlink-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identityId }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to unlink identity');
      }
      
      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      if (updatedUser) {
        setUser(updatedUser);
        setIsAnonymous(!updatedUser.email);
      }

      return { data: result, error: null };
    } catch (error) {
      console.error('Error unlinking identity:', error);
      return { data: null, error };
    }
  };

  const getIdentities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        return { data: user.identities || [], error: null };
      }
      return { data: [], error: 'No user found' };
    } catch (error) {
      console.error('Error fetching identities:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
    linkIdentity,
    unlinkIdentity,
    getIdentities,
    signInAnonymously,
    isAnonymous,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}