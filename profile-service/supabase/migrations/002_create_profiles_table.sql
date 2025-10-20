-- =============================================
-- FASHUN.CO.IN - STEP 2: CREATE CORE PROFILE TABLE
-- Execute this after 001_create_enum_types.sql
-- =============================================

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    profile_image_url TEXT,
    theme_settings JSONB DEFAULT '{}'::jsonb,
    qr_settings JSONB DEFAULT '{}'::jsonb,
    custom_qr_url TEXT,
    affiliate_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
    CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_]+$')
);

COMMENT ON TABLE public.profiles IS 'Public profile data for each user, extending the auth.users table.';

-- Create indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_affiliate_code ON public.profiles(affiliate_code);

-- Verify table created
SELECT 'profiles table created successfully' as status;
