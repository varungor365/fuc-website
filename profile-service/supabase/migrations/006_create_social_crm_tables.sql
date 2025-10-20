-- =============================================
-- FASHUN.CO.IN - STEP 6: CREATE SOCIAL AND CRM TABLES
-- Execute this after 005_create_cards_qr_tables.sql
-- =============================================

-- Create social_accounts table
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'twitter', 'linkedin', 'facebook', 'youtube', 'tiktok', 'snapchat')),
    account_id TEXT NOT NULL,
    username TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    is_connected BOOLEAN DEFAULT TRUE,
    auto_post_enabled BOOLEAN DEFAULT FALSE,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, platform)
);

COMMENT ON TABLE public.social_accounts IS 'Connected social media accounts for cross-platform management';

-- Create contacts table
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
    tags TEXT[],
    contact_source TEXT,
    last_contacted_at TIMESTAMPTZ,
    contact_status TEXT DEFAULT 'active' CHECK (contact_status IN ('active', 'inactive', 'blocked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.contacts IS 'CRM system for managing business contacts';

-- Create contact_interactions table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_social_accounts_profile_id ON public.social_accounts(profile_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON public.social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_contacts_profile_id ON public.contacts(profile_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contact_interactions_contact_id ON public.contact_interactions(contact_id);

-- Verify tables created
SELECT 'social_accounts, contacts, and contact_interactions tables created successfully' as status;
