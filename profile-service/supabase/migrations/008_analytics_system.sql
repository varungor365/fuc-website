-- Analytics System Database Schema
-- Create tables for comprehensive analytics tracking

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'link_click', 'qr_scan', 'social_click', 'download', 'share')),
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

-- Analytics Daily Counters Table
CREATE TABLE IF NOT EXISTS analytics_daily_counters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
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
    UNIQUE(user_id, date)
);

-- Profile Analytics Summary Table
CREATE TABLE IF NOT EXISTS profile_analytics_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    total_views INTEGER DEFAULT 0,
    total_visitors INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_qr_scans INTEGER DEFAULT 0,
    total_shares INTEGER DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    last_view_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Sessions Table
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    session_start TIMESTAMPTZ DEFAULT NOW(),
    session_end TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 1,
    actions INTEGER DEFAULT 0,
    referrer TEXT,
    entry_page TEXT,
    exit_page TEXT,
    country TEXT,
    device_type TEXT,
    browser TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_id ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_counters_user_date ON analytics_daily_counters(user_id, date);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_visitor_id ON analytics_sessions(visitor_id);

-- Create function to update profile analytics summary
CREATE OR REPLACE FUNCTION update_profile_analytics(
    p_user_id TEXT,
    p_action TEXT,
    p_increment INTEGER DEFAULT 1,
    p_is_unique BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO profile_analytics_summary (
        user_id,
        total_views,
        total_visitors,
        total_clicks,
        total_qr_scans,
        total_shares,
        last_view_at,
        updated_at
    ) VALUES (
        p_user_id,
        CASE WHEN p_action = 'view' THEN p_increment ELSE 0 END,
        CASE WHEN p_action = 'view' AND p_is_unique THEN 1 ELSE 0 END,
        CASE WHEN p_action = 'click' THEN p_increment ELSE 0 END,
        CASE WHEN p_action = 'qr_scan' THEN p_increment ELSE 0 END,
        CASE WHEN p_action = 'share' THEN p_increment ELSE 0 END,
        CASE WHEN p_action = 'view' THEN NOW() ELSE NULL END,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_views = profile_analytics_summary.total_views + 
            CASE WHEN p_action = 'view' THEN p_increment ELSE 0 END,
        total_visitors = profile_analytics_summary.total_visitors + 
            CASE WHEN p_action = 'view' AND p_is_unique THEN 1 ELSE 0 END,
        total_clicks = profile_analytics_summary.total_clicks + 
            CASE WHEN p_action = 'click' THEN p_increment ELSE 0 END,
        total_qr_scans = profile_analytics_summary.total_qr_scans + 
            CASE WHEN p_action = 'qr_scan' THEN p_increment ELSE 0 END,
        total_shares = profile_analytics_summary.total_shares + 
            CASE WHEN p_action = 'share' THEN p_increment ELSE 0 END,
        last_view_at = CASE WHEN p_action = 'view' THEN NOW() ELSE profile_analytics_summary.last_view_at END,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to update daily counters
CREATE OR REPLACE FUNCTION increment_daily_counter(
    p_user_id TEXT,
    p_date DATE,
    p_counter_type TEXT,
    p_increment INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO analytics_daily_counters (
        user_id,
        date,
        page_views,
        link_clicks,
        qr_scans,
        social_clicks,
        downloads,
        shares
    ) VALUES (
        p_user_id,
        p_date,
        CASE WHEN p_counter_type = 'page_views' THEN p_increment ELSE 0 END,
        CASE WHEN p_counter_type = 'link_clicks' THEN p_increment ELSE 0 END,
        CASE WHEN p_counter_type = 'qr_scans' THEN p_increment ELSE 0 END,
        CASE WHEN p_counter_type = 'social_clicks' THEN p_increment ELSE 0 END,
        CASE WHEN p_counter_type = 'downloads' THEN p_increment ELSE 0 END,
        CASE WHEN p_counter_type = 'shares' THEN p_increment ELSE 0 END
    )
    ON CONFLICT (user_id, date) DO UPDATE SET
        page_views = analytics_daily_counters.page_views + 
            CASE WHEN p_counter_type = 'page_views' THEN p_increment ELSE 0 END,
        link_clicks = analytics_daily_counters.link_clicks + 
            CASE WHEN p_counter_type = 'link_clicks' THEN p_increment ELSE 0 END,
        qr_scans = analytics_daily_counters.qr_scans + 
            CASE WHEN p_counter_type = 'qr_scans' THEN p_increment ELSE 0 END,
        social_clicks = analytics_daily_counters.social_clicks + 
            CASE WHEN p_counter_type = 'social_clicks' THEN p_increment ELSE 0 END,
        downloads = analytics_daily_counters.downloads + 
            CASE WHEN p_counter_type = 'downloads' THEN p_increment ELSE 0 END,
        shares = analytics_daily_counters.shares + 
            CASE WHEN p_counter_type = 'shares' THEN p_increment ELSE 0 END,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update daily counters
CREATE OR REPLACE FUNCTION trigger_update_daily_counters()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM increment_daily_counter(
        NEW.user_id,
        NEW.timestamp::DATE,
        NEW.event_type
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS analytics_events_daily_counter_trigger ON analytics_events;
CREATE TRIGGER analytics_events_daily_counter_trigger
    AFTER INSERT ON analytics_events
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_daily_counters();

-- Enable Row Level Security (RLS)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_analytics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own analytics events" ON analytics_events
    FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert their own analytics events" ON analytics_events
    FOR INSERT WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can view their own daily counters" ON analytics_daily_counters
    FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update their own daily counters" ON analytics_daily_counters
    FOR ALL USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can view their own analytics summary" ON profile_analytics_summary
    FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update their own analytics summary" ON profile_analytics_summary
    FOR ALL USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can view their own sessions" ON analytics_sessions
    FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert their own sessions" ON analytics_sessions
    FOR INSERT WITH CHECK (user_id = current_setting('app.user_id', true));

-- Insert sample analytics data for demo
INSERT INTO analytics_events (user_id, event_type, event_data, visitor_id, country, device_type, browser, timestamp) VALUES
('demo-user', 'page_view', '{"page": "/profile"}', 'visitor_1', 'United States', 'desktop', 'Chrome', NOW() - INTERVAL '1 hour'),
('demo-user', 'page_view', '{"page": "/profile"}', 'visitor_2', 'Canada', 'mobile', 'Safari', NOW() - INTERVAL '2 hours'),
('demo-user', 'link_click', '{"url": "https://linkedin.com", "text": "LinkedIn"}', 'visitor_1', 'United States', 'desktop', 'Chrome', NOW() - INTERVAL '30 minutes'),
('demo-user', 'qr_scan', '{"type": "profile"}', 'visitor_3', 'United Kingdom', 'mobile', 'Chrome', NOW() - INTERVAL '15 minutes'),
('demo-user', 'page_view', '{"page": "/profile"}', 'visitor_4', 'Australia', 'tablet', 'Safari', NOW() - INTERVAL '10 minutes');

-- Insert sample daily counters
INSERT INTO analytics_daily_counters (user_id, date, page_views, link_clicks, qr_scans, unique_visitors) VALUES
('demo-user', CURRENT_DATE, 25, 8, 3, 15),
('demo-user', CURRENT_DATE - INTERVAL '1 day', 32, 12, 5, 22),
('demo-user', CURRENT_DATE - INTERVAL '2 days', 18, 6, 2, 12),
('demo-user', CURRENT_DATE - INTERVAL '3 days', 41, 15, 7, 28);

COMMENT ON TABLE analytics_events IS 'Stores individual analytics events for detailed tracking';
COMMENT ON TABLE analytics_daily_counters IS 'Aggregated daily statistics for quick reporting';
COMMENT ON TABLE profile_analytics_summary IS 'Overall profile analytics summary for dashboard';
COMMENT ON TABLE analytics_sessions IS 'User session tracking for engagement analysis';