-- =============================================
-- FASHUN.CO.IN - STEP 3: CREATE LINKS AND ANALYTICS TABLES
-- Execute this after 002_create_profiles_table.sql
-- =============================================

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    position INT DEFAULT 0,
    is_spotlight BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.links IS 'Stores the individual links for a user''s profile page.';

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type public.event_type NOT NULL,
    link_id uuid REFERENCES public.links(id) ON DELETE SET NULL,
    visitor_ip_hash TEXT,
    visitor_id TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    device_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.analytics IS 'Tracks engagement metrics like views and clicks for profiles.';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_links_profile_id ON public.links(profile_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON public.links(position);
CREATE INDEX IF NOT EXISTS idx_analytics_profile_id ON public.analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at);

-- Verify tables created
SELECT 'links and analytics tables created successfully' as status;
