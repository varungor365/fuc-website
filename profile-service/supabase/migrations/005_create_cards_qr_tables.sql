-- =============================================
-- FASHUN.CO.IN - STEP 5: CREATE BUSINESS CARDS AND QR TABLES
-- Execute this after 004_create_ecommerce_tables.sql
-- =============================================

-- Create business_cards table
CREATE TABLE IF NOT EXISTS public.business_cards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    card_name TEXT NOT NULL,
    template_id TEXT NOT NULL,
    card_data JSONB NOT NULL,
    card_image_url TEXT,
    qr_code_url TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.business_cards IS 'AI-generated business cards for users';

-- Create qr_codes table
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    qr_name TEXT NOT NULL,
    qr_type TEXT NOT NULL CHECK (qr_type IN ('profile', 'business_card', 'link', 'custom')),
    qr_data JSONB NOT NULL,
    qr_image_url TEXT NOT NULL,
    scan_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.qr_codes IS 'Dynamic QR codes with analytics tracking';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_business_cards_profile_id ON public.business_cards(profile_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_profile_id ON public.qr_codes(profile_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_qr_type ON public.qr_codes(qr_type);

-- Verify tables created
SELECT 'business_cards and qr_codes tables created successfully' as status;
