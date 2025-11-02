import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key) => {
        if (typeof window !== 'undefined') {
          // Try cookies first, then localStorage
          const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${key}=`))
            ?.split('=')[1];
          
          return cookieValue || window.localStorage.getItem(key);
        }
        return null;
      },
      setItem: (key, value) => {
        if (typeof window !== 'undefined') {
          // Set both cookie and localStorage for redundancy
          const maxAge = key.includes('refresh') ? 60 * 60 * 24 * 7 : 60 * 60; // 7 days for refresh, 1 hour for access
          document.cookie = `${key}=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
          window.localStorage.setItem(key, value);
        }
      },
      removeItem: (key) => {
        if (typeof window !== 'undefined') {
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          window.localStorage.removeItem(key);
        }
      },
    },
  },
});
