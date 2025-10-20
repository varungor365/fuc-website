-- =============================================
-- FASHUN.CO.IN - STEP 4: CREATE E-COMMERCE TABLES
-- Execute this after 003_create_links_analytics.sql
-- =============================================

-- Create closet_items table
CREATE TABLE IF NOT EXISTS public.closet_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    medusa_order_id TEXT NOT NULL,
    product_title TEXT NOT NULL,
    product_image_url TEXT NOT NULL,
    product_variant_id TEXT,
    product_price DECIMAL(10,2),
    quantity INTEGER DEFAULT 1,
    purchased_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.closet_items IS 'Represents items a user has purchased, for the "My Closet" feature.';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_closet_items_profile_id ON public.closet_items(profile_id);
CREATE INDEX IF NOT EXISTS idx_closet_items_medusa_order_id ON public.closet_items(medusa_order_id);

-- Verify table created
SELECT 'closet_items table created successfully' as status;
