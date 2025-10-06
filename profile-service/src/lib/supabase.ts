import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
