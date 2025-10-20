-- =============================================
-- FASHUN.CO.IN - STEP 1: CREATE ENUM TYPES
-- Execute this first to create all custom types
-- =============================================

-- Create event_type enum for analytics
DO $$ BEGIN
    CREATE TYPE public.event_type AS ENUM (
        'profile_view', 
        'link_click', 
        'qr_scan', 
        'social_click', 
        'download', 
        'share'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verify enum created
SELECT 'event_type enum created successfully' as status;
