-- =============================================
-- FASHUN.CO.IN - STEP 9: CREATE ADVANCED ANALYTICS TABLES
-- Execute this after 008_create_affiliate_tables.sql
-- =============================================

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    visitor_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.analytics_events IS 'Detailed analytics events for comprehensive tracking';

-- Create analytics_daily_counters table
CREATE TABLE IF NOT EXISTS public.analytics_daily_counters (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    link_clicks INTEGER DEFAULT 0,
    qr_scans INTEGER DEFAULT 0,
    social_clicks INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, date)
);

COMMENT ON TABLE public.analytics_daily_counters IS 'Daily aggregated analytics for performance optimization';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_profile_id ON public.analytics_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON public.analytics_events(timestamp);

-- Verify tables created
SELECT 'analytics_events and analytics_daily_counters tables created successfully' as status;
