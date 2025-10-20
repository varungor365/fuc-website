-- =============================================
-- FASHUN.CO.IN DIGITAL ECOSYSTEM - SECURITY POLICIES
-- Row Level Security (RLS) Implementation
-- Ensures users can only access and modify their own data
-- =============================================

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closet_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_embeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_customizations ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLICIES FOR 'profiles' TABLE
-- =============================================
-- 1. Anyone can view public profiles.
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);

-- 2. A user can create their own profile.
CREATE POLICY "Allow users to insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. A user can only update their own profile.
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. A user can delete their own profile.
CREATE POLICY "Allow users to delete their own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- =============================================
-- POLICIES FOR 'links' TABLE
-- =============================================
-- 1. Anyone can view public links.
CREATE POLICY "Allow public read access to links" ON public.links FOR SELECT USING (true);

-- 2. A user can only create links for their own profile.
CREATE POLICY "Allow users to insert their own links" ON public.links FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 3. A user can only update or delete their own links.
CREATE POLICY "Allow users to manage their own links" ON public.links FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'analytics' TABLE (Private Data)
-- =============================================
-- 1. A user can only view their own analytics.
CREATE POLICY "Allow users to read their own analytics" ON public.analytics FOR SELECT USING (auth.uid() = profile_id);

-- 2. Allow authenticated inserts for analytics tracking.
CREATE POLICY "Allow authenticated inserts for analytics" ON public.analytics FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- POLICIES FOR 'closet_items' TABLE (Private Data)
-- =============================================
-- 1. A user can only view their own closet items.
CREATE POLICY "Allow users to read their own closet items" ON public.closet_items FOR SELECT USING (auth.uid() = profile_id);

-- 2. Allow authenticated inserts for closet items (from e-commerce integration).
CREATE POLICY "Allow authenticated inserts for closet" ON public.closet_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. A user can manage their own closet items.
CREATE POLICY "Allow users to manage their own closet items" ON public.closet_items FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'business_cards' TABLE
-- =============================================
-- 1. A user can view their own business cards.
CREATE POLICY "Allow users to read their own business cards" ON public.business_cards FOR SELECT USING (auth.uid() = profile_id);

-- 2. A user can create their own business cards.
CREATE POLICY "Allow users to insert their own business cards" ON public.business_cards FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 3. A user can manage their own business cards.
CREATE POLICY "Allow users to manage their own business cards" ON public.business_cards FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'qr_codes' TABLE
-- =============================================
-- 1. A user can view their own QR codes.
CREATE POLICY "Allow users to read their own qr codes" ON public.qr_codes FOR SELECT USING (auth.uid() = profile_id);

-- 2. A user can create their own QR codes.
CREATE POLICY "Allow users to insert their own qr codes" ON public.qr_codes FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 3. A user can manage their own QR codes.
CREATE POLICY "Allow users to manage their own qr codes" ON public.qr_codes FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'social_accounts' TABLE
-- =============================================
-- 1. A user can view their own social accounts.
CREATE POLICY "Allow users to read their own social accounts" ON public.social_accounts FOR SELECT USING (auth.uid() = profile_id);

-- 2. A user can create their own social accounts.
CREATE POLICY "Allow users to insert their own social accounts" ON public.social_accounts FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 3. A user can manage their own social accounts.
CREATE POLICY "Allow users to manage their own social accounts" ON public.social_accounts FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'contacts' TABLE
-- =============================================
-- 1. A user can view their own contacts.
CREATE POLICY "Allow users to read their own contacts" ON public.contacts FOR SELECT USING (auth.uid() = profile_id);

-- 2. A user can create their own contacts.
CREATE POLICY "Allow users to insert their own contacts" ON public.contacts FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 3. A user can manage their own contacts.
CREATE POLICY "Allow users to manage their own contacts" ON public.contacts FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'contact_interactions' TABLE
-- =============================================
-- 1. A user can view their own contact interactions.
CREATE POLICY "Allow users to read their own contact interactions" ON public.contact_interactions FOR SELECT USING (auth.uid() = profile_id);

-- 2. A user can create their own contact interactions.
CREATE POLICY "Allow users to insert their own contact interactions" ON public.contact_interactions FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 3. A user can manage their own contact interactions.
CREATE POLICY "Allow users to manage their own contact interactions" ON public.contact_interactions FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'automation_logs' TABLE
-- =============================================
-- 1. A user can view their own automation logs.
CREATE POLICY "Allow users to read their own automation logs" ON public.automation_logs FOR SELECT USING (auth.uid() = profile_id);

-- 2. Allow system to insert automation logs.
CREATE POLICY "Allow system to insert automation logs" ON public.automation_logs FOR INSERT WITH CHECK (true);

-- 3. A user can manage their own automation logs.
CREATE POLICY "Allow users to manage their own automation logs" ON public.automation_logs FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'webhook_logs' TABLE
-- =============================================
-- 1. A user can view their own webhook logs.
CREATE POLICY "Allow users to read their own webhook logs" ON public.webhook_logs FOR SELECT USING (auth.uid() = profile_id);

-- 2. Allow system to insert webhook logs.
CREATE POLICY "Allow system to insert webhook logs" ON public.webhook_logs FOR INSERT WITH CHECK (true);

-- 3. A user can manage their own webhook logs.
CREATE POLICY "Allow users to manage their own webhook logs" ON public.webhook_logs FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'affiliates' TABLE
-- =============================================
-- 1. A user can view their own affiliate data.
CREATE POLICY "Allow users to read their own affiliate data" ON public.affiliates FOR SELECT USING (auth.uid() = profile_id);

-- 2. A user can create their own affiliate record.
CREATE POLICY "Allow users to insert their own affiliate record" ON public.affiliates FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 3. A user can manage their own affiliate data.
CREATE POLICY "Allow users to manage their own affiliate data" ON public.affiliates FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'referrals' TABLE
-- =============================================
-- 1. An affiliate can view their own referrals.
CREATE POLICY "Allow affiliates to read their own referrals" ON public.referrals FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.affiliates 
        WHERE id = referrals.affiliate_id 
        AND profile_id = auth.uid()
    )
);

-- 2. Allow system to insert referrals.
CREATE POLICY "Allow system to insert referrals" ON public.referrals FOR INSERT WITH CHECK (true);

-- 3. An affiliate can manage their own referrals.
CREATE POLICY "Allow affiliates to manage their own referrals" ON public.referrals FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.affiliates 
        WHERE id = referrals.affiliate_id 
        AND profile_id = auth.uid()
    )
);

-- =============================================
-- POLICIES FOR 'payout_requests' TABLE
-- =============================================
-- 1. An affiliate can view their own payout requests.
CREATE POLICY "Allow affiliates to read their own payout requests" ON public.payout_requests FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.affiliates 
        WHERE id = payout_requests.affiliate_id 
        AND profile_id = auth.uid()
    )
);

-- 2. An affiliate can create their own payout requests.
CREATE POLICY "Allow affiliates to insert their own payout requests" ON public.payout_requests FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.affiliates 
        WHERE id = affiliate_id 
        AND profile_id = auth.uid()
    )
);

-- 3. An affiliate can manage their own payout requests.
CREATE POLICY "Allow affiliates to manage their own payout requests" ON public.payout_requests FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.affiliates 
        WHERE id = payout_requests.affiliate_id 
        AND profile_id = auth.uid()
    )
);

-- =============================================
-- POLICIES FOR 'analytics_events' TABLE
-- =============================================
-- 1. A user can view their own analytics events.
CREATE POLICY "Allow users to read their own analytics events" ON public.analytics_events FOR SELECT USING (auth.uid() = profile_id);

-- 2. Allow system to insert analytics events.
CREATE POLICY "Allow system to insert analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- =============================================
-- POLICIES FOR 'analytics_daily_counters' TABLE
-- =============================================
-- 1. A user can view their own daily analytics.
CREATE POLICY "Allow users to read their own daily analytics" ON public.analytics_daily_counters FOR SELECT USING (auth.uid() = profile_id);

-- 2. Allow system to manage daily counters.
CREATE POLICY "Allow system to manage daily counters" ON public.analytics_daily_counters FOR ALL WITH CHECK (true);

-- =============================================
-- POLICIES FOR 'media_items' TABLE
-- =============================================
-- 1. Anyone can view public media items.
CREATE POLICY "Allow public read access to public media" ON public.media_items FOR SELECT USING (visibility = 'public');

-- 2. A user can view all their own media items.
CREATE POLICY "Allow users to read their own media items" ON public.media_items FOR SELECT USING (auth.uid() = profile_id);

-- 3. A user can create their own media items.
CREATE POLICY "Allow users to insert their own media items" ON public.media_items FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 4. A user can manage their own media items.
CREATE POLICY "Allow users to manage their own media items" ON public.media_items FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'interactive_embeds' TABLE
-- =============================================
-- 1. Anyone can view active embeds.
CREATE POLICY "Allow public read access to active embeds" ON public.interactive_embeds FOR SELECT USING (is_active = true);

-- 2. A user can view all their own embeds.
CREATE POLICY "Allow users to read their own embeds" ON public.interactive_embeds FOR SELECT USING (auth.uid() = profile_id);

-- 3. A user can create their own embeds.
CREATE POLICY "Allow users to insert their own embeds" ON public.interactive_embeds FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 4. A user can manage their own embeds.
CREATE POLICY "Allow users to manage their own embeds" ON public.interactive_embeds FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- POLICIES FOR 'profile_customizations' TABLE
-- =============================================
-- 1. A user can view their own customizations.
CREATE POLICY "Allow users to read their own customizations" ON public.profile_customizations FOR SELECT USING (auth.uid() = profile_id);

-- 2. A user can create their own customizations.
CREATE POLICY "Allow users to insert their own customizations" ON public.profile_customizations FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 3. A user can manage their own customizations.
CREATE POLICY "Allow users to manage their own customizations" ON public.profile_customizations FOR ALL USING (auth.uid() = profile_id);

-- =============================================
-- ADDITIONAL SECURITY FUNCTIONS
-- =============================================

-- Function to check if user owns a contact
CREATE OR REPLACE FUNCTION user_owns_contact(contact_uuid uuid)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.contacts
        WHERE id = contact_uuid AND profile_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is affiliate owner
CREATE OR REPLACE FUNCTION user_is_affiliate_owner(affiliate_uuid uuid)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.affiliates
        WHERE id = affiliate_uuid AND profile_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate profile ownership
CREATE OR REPLACE FUNCTION validate_profile_ownership(profile_uuid uuid)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN profile_uuid = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to anonymous users for public data
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.links TO anon;
GRANT SELECT ON public.media_items TO anon;
GRANT SELECT ON public.interactive_embeds TO anon;

-- =============================================
-- CREATE SECURITY VIEWS
-- =============================================

-- View for public profile data (safe for anonymous access)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
    id,
    username,
    display_name,
    bio,
    profile_image_url,
    theme_settings,
    custom_qr_url,
    created_at
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- View for profile analytics summary (owner only)
CREATE OR REPLACE VIEW public.profile_analytics_summary AS
SELECT 
    p.id as profile_id,
    p.username,
    COUNT(DISTINCT a.id) as total_views,
    COUNT(DISTINCT a.visitor_ip_hash) as unique_visitors,
    COUNT(DISTINCT CASE WHEN a.event_type = 'link_click' THEN a.id END) as total_clicks,
    COUNT(DISTINCT CASE WHEN a.event_type = 'qr_scan' THEN a.id END) as total_qr_scans
FROM public.profiles p
LEFT JOIN public.analytics a ON p.id = a.profile_id
WHERE p.id = auth.uid()
GROUP BY p.id, p.username;

-- Grant access to analytics summary
GRANT SELECT ON public.profile_analytics_summary TO authenticated;

COMMENT ON SCHEMA public IS 'FASHUN.CO.IN Digital Ecosystem - Secure, scalable database schema with comprehensive RLS policies';