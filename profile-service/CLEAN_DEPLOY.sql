-- =============================================
-- FASHUN.CO.IN - COMPLETE DATABASE RESET & DEPLOYMENT
-- WARNING: This will DROP ALL existing tables and data
-- Only use this for fresh deployment or complete reset
-- =============================================

-- Step 1: Drop all existing tables in reverse dependency order
DROP TABLE IF EXISTS public.payout_requests CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.affiliates CASCADE;
DROP TABLE IF EXISTS public.analytics_daily_counters CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.profile_customizations CASCADE;
DROP TABLE IF EXISTS public.interactive_embeds CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;
DROP TABLE IF EXISTS public.webhook_logs CASCADE;
DROP TABLE IF EXISTS public.automation_logs CASCADE;
DROP TABLE IF EXISTS public.contact_interactions CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.social_accounts CASCADE;
DROP TABLE IF EXISTS public.qr_codes CASCADE;
DROP TABLE IF EXISTS public.business_cards CASCADE;
DROP TABLE IF EXISTS public.closet_items CASCADE;
DROP TABLE IF EXISTS public.analytics CASCADE;
DROP TABLE IF EXISTS public.links CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Step 2: Drop custom types
DROP TYPE IF EXISTS public.event_type CASCADE;

-- Step 3: Drop functions
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.generate_affiliate_code() CASCADE;
DROP FUNCTION IF EXISTS public.create_affiliate_for_profile() CASCADE;

-- Step 4: Verify cleanup
SELECT 'All tables, types, and functions dropped successfully. Ready for fresh deployment.' as status;

-- =============================================
-- IMPORTANT: After running this script
-- Execute the following files in order:
-- 1. 010_complete_fashun_schema.sql (creates all tables)
-- 2. 011_security_policies.sql (applies RLS policies)
-- 3. 012_sample_data.sql (optional - sample data)
-- =============================================
