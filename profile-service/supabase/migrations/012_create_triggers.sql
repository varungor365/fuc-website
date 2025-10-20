-- =============================================
-- FASHUN.CO.IN - STEP 12: CREATE TRIGGERS
-- Execute this after 011_create_functions.sql
-- =============================================

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for links table
CREATE TRIGGER update_links_updated_at 
    BEFORE UPDATE ON public.links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for business_cards table
CREATE TRIGGER update_business_cards_updated_at 
    BEFORE UPDATE ON public.business_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for qr_codes table
CREATE TRIGGER update_qr_codes_updated_at 
    BEFORE UPDATE ON public.qr_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for social_accounts table
CREATE TRIGGER update_social_accounts_updated_at 
    BEFORE UPDATE ON public.social_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for contacts table
CREATE TRIGGER update_contacts_updated_at 
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for affiliates table
CREATE TRIGGER update_affiliates_updated_at 
    BEFORE UPDATE ON public.affiliates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for analytics_daily_counters table
CREATE TRIGGER update_analytics_daily_counters_updated_at 
    BEFORE UPDATE ON public.analytics_daily_counters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for media_items table
CREATE TRIGGER update_media_items_updated_at 
    BEFORE UPDATE ON public.media_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for interactive_embeds table
CREATE TRIGGER update_interactive_embeds_updated_at 
    BEFORE UPDATE ON public.interactive_embeds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profile_customizations table
CREATE TRIGGER update_profile_customizations_updated_at 
    BEFORE UPDATE ON public.profile_customizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-create affiliate record
CREATE TRIGGER create_affiliate_on_profile_insert
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    WHEN (NEW.affiliate_code IS NOT NULL)
    EXECUTE FUNCTION create_affiliate_for_profile();

-- Verify triggers created
SELECT 'All triggers created successfully' as status;
