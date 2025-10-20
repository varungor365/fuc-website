-- =============================================
-- FASHUN.CO.IN - STEP 11: CREATE DATABASE FUNCTIONS
-- Execute this after 010_create_media_customization_tables.sql
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
    IF NEW.affiliate_code IS NOT NULL THEN
        INSERT INTO public.affiliates (profile_id, referral_code)
        VALUES (NEW.id, NEW.affiliate_code);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verify functions created
SELECT 'Database functions created successfully' as status;
