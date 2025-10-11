import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

// Validate URLs only in production
if (typeof window !== 'undefined' && supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('Using placeholder Supabase URL. Please configure environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export type Profile = {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  theme_settings: {
    theme: string;
    primaryColor: string;
    backgroundColor: string;
    backgroundImage?: string;
  };
  qr_code_url: string | null;
};

export type Link = {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  icon: string | null;
  is_featured: boolean;
  position: number;
  clicks: number;
};
