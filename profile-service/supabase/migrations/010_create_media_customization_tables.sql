-- =============================================
-- FASHUN.CO.IN - STEP 10: CREATE MEDIA AND CUSTOMIZATION TABLES
-- Execute this after 009_create_advanced_analytics_tables.sql
-- =============================================

-- Create media_items table
CREATE TABLE IF NOT EXISTS public.media_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('video', 'audio', 'document', 'image', 'gallery')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size BIGINT,
    duration INTEGER,
    mime_type TEXT,
    metadata JSONB DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 1,
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.media_items IS 'Rich media content for user profiles';

-- Create interactive_embeds table
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

-- Create profile_customizations table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_items_profile_id ON public.media_items(profile_id);
CREATE INDEX IF NOT EXISTS idx_media_items_media_type ON public.media_items(media_type);
CREATE INDEX IF NOT EXISTS idx_interactive_embeds_profile_id ON public.interactive_embeds(profile_id);

-- Verify tables created
SELECT 'media_items, interactive_embeds, and profile_customizations tables created successfully' as status;
