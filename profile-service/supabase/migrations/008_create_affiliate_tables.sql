-- =============================================
-- FASHUN.CO.IN - STEP 8: CREATE AFFILIATE PROGRAM TABLES
-- Execute this after 007_create_automation_webhook_tables.sql
-- =============================================

-- Create affiliates table
CREATE TABLE IF NOT EXISTS public.affiliates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    tier_level INTEGER DEFAULT 1,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    total_referrals INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.affiliates IS 'Affiliate program participants and their performance metrics';

-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    referred_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    referral_source TEXT,
    conversion_value DECIMAL(10,2),
    commission_earned DECIMAL(10,2),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled')),
    converted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.referrals IS 'Individual referral tracking for affiliate program';

-- Create payout_requests table
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payout_method TEXT NOT NULL,
    payout_details JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    notes TEXT
);

COMMENT ON TABLE public.payout_requests IS 'Affiliate payout requests and processing status';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_affiliates_profile_id ON public.affiliates(profile_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON public.affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON public.referrals(affiliate_id);

-- Verify tables created
SELECT 'affiliates, referrals, and payout_requests tables created successfully' as status;
