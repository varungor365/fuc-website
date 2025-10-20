-- =============================================
-- FASHUN.CO.IN DIGITAL ECOSYSTEM - COMPLETE SQL SCHEMA
-- Supabase PostgreSQL Database Structure
-- Supports: Profile Service, E-commerce Integration, Analytics, Security
-- =============================================

-- =============================================
-- 1. EXTEND AUTH USERS WITH A PUBLIC PROFILES TABLE
-- This table will hold public user data and is linked one-to-one with Supabase's auth.users.
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    profile_image_url TEXT,
    theme_settings JSONB DEFAULT '{}'::jsonb, -- To store theme choices like colors, background image, etc.
    qr_settings JSONB DEFAULT '{}'::jsonb, -- To store custom QR code styling options.
    custom_qr_url TEXT, -- To store the public URL of the final, user-styled QR code.
    affiliate_code TEXT UNIQUE, -- For the user's unique referral code.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
    CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_]+$') -- Lowercase alphanumeric and underscores only.
);

COMMENT ON TABLE public.profiles IS 'Public profile data for each user, extending the auth.users table.';

-- =============================================
-- 2. CREATE THE LINKS TABLE FOR THE PROFILE SERVICE
-- This table will store all the social media and other links for a user's profile.
-- =============================================
CREATE TABLE IF NOT EXISTS public.links (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT, -- e.g., 'instagram', 'youtube', 'custom'
    position INT DEFAULT 0, -- For ordering the links.
    is_spotlight BOOLEAN DEFAULT FALSE, -- For the special "Spotlight" link feature.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.links IS 'Stores the individual links for a user''s profile page.';

-- =============================================
-- 3. CREATE THE ANALYTICS TABLE
-- This table will track profile views and link clicks.
-- =============================================
DO $$ BEGIN
    CREATE TYPE public.event_type AS ENUM ('profile_view', 'link_click', 'qr_scan', 'social_click', 'download', 'share');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.analytics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type public.event_type NOT NULL,
    link_id uuid REFERENCES public.links(id) ON DELETE SET NULL, -- Null if it's a general profile view.
    visitor_ip_hash TEXT, -- Store a hash of the IP for privacy and uniqueness tracking.
    visitor_id TEXT, -- Session-based visitor tracking
    user_agent TEXT, -- Browser information
    referrer TEXT, -- Traffic source
    country TEXT, -- Geographic data
    device_type TEXT, -- mobile, desktop, tablet
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.analytics IS 'Tracks engagement metrics like views and clicks for profiles.';

-- =============================================
-- 4. CREATE THE "MY CLOSET" TABLE
-- This table links a user's profile to the products they have purchased from Medusa.
-- =============================================
CREATE TABLE IF NOT EXISTS public.closet_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    medusa_order_id TEXT NOT NULL, -- The order ID from your Medusa backend.
    product_title TEXT NOT NULL,
    product_image_url TEXT NOT NULL,
    product_variant_id TEXT, -- Medusa variant ID
    product_price DECIMAL(10,2), -- Price when purchased
    quantity INTEGER DEFAULT 1,
    purchased_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.closet_items IS 'Represents items a user has purchased, for the "My Closet" feature.';

-- =============================================
-- 5. BUSINESS CARDS TABLE
-- Store AI-generated business cards
-- =============================================
CREATE TABLE IF NOT EXISTS public.business_cards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    card_name TEXT NOT NULL,
    template_id TEXT NOT NULL,
    card_data JSONB NOT NULL, -- All card content and styling
    card_image_url TEXT, -- Generated card image
    qr_code_url TEXT, -- QR code for the card
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.business_cards IS 'AI-generated business cards for users';

-- =============================================
-- 6. QR CODES TABLE
-- Dynamic QR code management
-- =============================================
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    qr_name TEXT NOT NULL,
    qr_type TEXT NOT NULL CHECK (qr_type IN ('profile', 'business_card', 'link', 'custom')),
    qr_data JSONB NOT NULL, -- QR content and metadata
    qr_image_url TEXT NOT NULL, -- Generated QR code image
    scan_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.qr_codes IS 'Dynamic QR codes with analytics tracking';

-- =============================================
-- 7. SOCIAL MEDIA ACCOUNTS TABLE
-- Connected social media accounts
-- =============================================
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'twitter', 'linkedin', 'facebook', 'youtube', 'tiktok', 'snapchat')),
    account_id TEXT NOT NULL, -- Platform-specific user ID
    username TEXT NOT NULL,
    access_token TEXT, -- Encrypted access token
    refresh_token TEXT, -- Encrypted refresh token
    token_expires_at TIMESTAMPTZ,
    is_connected BOOLEAN DEFAULT TRUE,
    auto_post_enabled BOOLEAN DEFAULT FALSE,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, platform)
);

COMMENT ON TABLE public.social_accounts IS 'Connected social media accounts for cross-platform management';

-- =============================================
-- 8. CONTACTS TABLE (CRM)
-- Contact management system
-- =============================================
CREATE TABLE IF NOT EXISTS public.contacts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    notes TEXT,
    tags TEXT[], -- Array of tags
    contact_source TEXT, -- How they were acquired
    last_contacted_at TIMESTAMPTZ,
    contact_status TEXT DEFAULT 'active' CHECK (contact_status IN ('active', 'inactive', 'blocked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.contacts IS 'CRM system for managing business contacts';

-- =============================================
-- 9. CONTACT INTERACTIONS TABLE
-- Track all interactions with contacts
-- =============================================
CREATE TABLE IF NOT EXISTS public.contact_interactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('email', 'call', 'meeting', 'note', 'task')),
    subject TEXT,
    content TEXT,
    interaction_date TIMESTAMPTZ DEFAULT NOW(),
    follow_up_date TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.contact_interactions IS 'Track all interactions and communications with contacts';

-- =============================================
-- 10. AUTOMATION LOGS TABLE
-- Track automated processes
-- =============================================
CREATE TABLE IF NOT EXISTS public.automation_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    automation_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.automation_logs IS 'Tracks all automated processes and their outcomes';

-- =============================================
-- 11. WEBHOOK LOGS TABLE
-- Track webhook deliveries
-- =============================================
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    webhook_type TEXT NOT NULL,
    endpoint_url TEXT NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    attempts INTEGER DEFAULT 1,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.webhook_logs IS 'Tracks webhook deliveries and responses';

-- =============================================
-- 12. AFFILIATES TABLE
-- Affiliate program management
-- =============================================
CREATE TABLE IF NOT EXISTS public.affiliates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Percentage
    tier_level INTEGER DEFAULT 1,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    total_referrals INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.affiliates IS 'Affiliate program participants and their performance metrics';

-- =============================================
-- 13. REFERRALS TABLE
-- Track affiliate referrals
-- =============================================
CREATE TABLE IF NOT EXISTS public.referrals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    referred_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    referral_source TEXT, -- Where the referral came from
    conversion_value DECIMAL(10,2), -- Value of the conversion
    commission_earned DECIMAL(10,2), -- Commission calculated
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled')),
    converted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.referrals IS 'Individual referral tracking for affiliate program';

-- =============================================
-- 14. PAYOUT REQUESTS TABLE
-- Affiliate payout management
-- =============================================
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payout_method TEXT NOT NULL,
    payout_details JSONB, -- Payment method details
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    notes TEXT
);

COMMENT ON TABLE public.payout_requests IS 'Affiliate payout requests and processing status';

-- =============================================
-- 15. ANALYTICS EVENTS TABLE (Detailed)
-- Comprehensive analytics tracking
-- =============================================
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

-- =============================================
-- 16. ANALYTICS DAILY COUNTERS TABLE
-- Aggregated daily statistics
-- =============================================
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

-- =============================================
-- 17. MEDIA ITEMS TABLE
-- Rich media content management
-- =============================================
CREATE TABLE IF NOT EXISTS public.media_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('video', 'audio', 'document', 'image', 'gallery')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size BIGINT,
    duration INTEGER, -- in seconds
    mime_type TEXT,
    metadata JSONB DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 1,
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.media_items IS 'Rich media content for user profiles';

-- =============================================
-- 18. INTERACTIVE EMBEDS TABLE
-- Interactive content and widgets
-- =============================================
CREATE TABLE IF NOT EXISTS public.interactive_embeds (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    embed_type TEXT NOT NULL CHECK (embed_type IN ('calendar', 'form', 'poll', 'widget', 'iframe')),
    embed_code TEXT NOT NULL,
    configuration JSONB DEFAULT '{}',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.interactive_embeds IS 'Interactive elements and embedded content';

-- =============================================
-- 19. PROFILE CUSTOMIZATIONS TABLE
-- Advanced theming and customization
-- =============================================
CREATE TABLE IF NOT EXISTS public.profile_customizations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme_name TEXT NOT NULL,
    theme_data JSONB NOT NULL,
    custom_css TEXT,
    background_image_url TEXT,
    font_family TEXT,
    color_scheme JSONB,
    layout_settings JSONB,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profile_customizations IS 'Advanced profile theming and customization options';

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_affiliate_code ON public.profiles(affiliate_code);

-- Links indexes
CREATE INDEX IF NOT EXISTS idx_links_profile_id ON public.links(profile_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON public.links(position);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_profile_id ON public.analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_profile_id ON public.analytics_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON public.analytics_events(timestamp);

-- Closet items indexes
CREATE INDEX IF NOT EXISTS idx_closet_items_profile_id ON public.closet_items(profile_id);
CREATE INDEX IF NOT EXISTS idx_closet_items_medusa_order_id ON public.closet_items(medusa_order_id);

-- Business cards indexes
CREATE INDEX IF NOT EXISTS idx_business_cards_profile_id ON public.business_cards(profile_id);

-- QR codes indexes
CREATE INDEX IF NOT EXISTS idx_qr_codes_profile_id ON public.qr_codes(profile_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_qr_type ON public.qr_codes(qr_type);

-- Social accounts indexes
CREATE INDEX IF NOT EXISTS idx_social_accounts_profile_id ON public.social_accounts(profile_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON public.social_accounts(platform);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_profile_id ON public.contacts(profile_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_contact_id ON public.contact_interactions(contact_id);

-- Affiliate indexes
CREATE INDEX IF NOT EXISTS idx_affiliates_profile_id ON public.affiliates(profile_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON public.affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON public.referrals(affiliate_id);

-- Media indexes
CREATE INDEX IF NOT EXISTS idx_media_items_profile_id ON public.media_items(profile_id);
CREATE INDEX IF NOT EXISTS idx_media_items_media_type ON public.media_items(media_type);
CREATE INDEX IF NOT EXISTS idx_interactive_embeds_profile_id ON public.interactive_embeds(profile_id);

-- =============================================
-- CREATE HELPFUL FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON public.links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_cards_updated_at BEFORE UPDATE ON public.business_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON public.qr_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON public.social_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON public.affiliates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_daily_counters_updated_at BEFORE UPDATE ON public.analytics_daily_counters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_items_updated_at BEFORE UPDATE ON public.media_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interactive_embeds_updated_at BEFORE UPDATE ON public.interactive_embeds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_customizations_updated_at BEFORE UPDATE ON public.profile_customizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique affiliate codes
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        code := upper(substring(md5(random()::text) from 1 for 8));
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE affiliate_code = code) INTO exists;
        IF NOT exists THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to create affiliate record when profile is created
CREATE OR REPLACE FUNCTION create_affiliate_for_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create affiliate if affiliate_code is set
    IF NEW.affiliate_code IS NOT NULL THEN
        INSERT INTO public.affiliates (profile_id, referral_code)
        VALUES (NEW.id, NEW.affiliate_code);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create affiliate record
CREATE TRIGGER create_affiliate_on_profile_insert
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    WHEN (NEW.affiliate_code IS NOT NULL)
    EXECUTE FUNCTION create_affiliate_for_profile();