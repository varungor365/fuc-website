-- =============================================
-- FASHUN.CO.IN DATABASE DEPLOYMENT SCRIPT
-- Use this file to deploy the complete schema to Supabase
-- =============================================

-- Step 1: Drop existing tables if there are type conflicts
DROP TABLE IF EXISTS public.analytics CASCADE;
DROP TABLE IF EXISTS public.closet_items CASCADE;
DROP TABLE IF EXISTS public.links CASCADE;

-- Step 2: Drop existing event_type if it exists to ensure clean deployment
DROP TYPE IF EXISTS public.event_type CASCADE;

-- Step 3: Create the event_type enum with proper PostgreSQL syntax
DO $$ BEGIN
    CREATE TYPE public.event_type AS ENUM ('profile_view', 'link_click', 'qr_scan', 'social_click', 'download', 'share');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 4: Now execute the main schema file
-- Copy and paste the contents of 010_complete_fashun_schema.sql after this point
-- Or execute this file first, then run the main schema file

-- Verify the type was created successfully
SELECT 'event_type enum created successfully, ready for main schema deployment' as status;