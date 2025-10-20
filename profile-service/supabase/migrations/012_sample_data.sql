-- =============================================
-- FASHUN.CO.IN DIGITAL ECOSYSTEM - SAMPLE DATA
-- Insert demo data for testing and development
-- =============================================

-- Insert sample profiles
INSERT INTO public.profiles (id, username, display_name, bio, profile_image_url, theme_settings, qr_settings, custom_qr_url, affiliate_code) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'johndoe', 'John Doe', 'Fashion enthusiast and entrepreneur. Sharing my style journey and business insights.', '/demo/john-profile.jpg', '{"primaryColor": "#3B82F6", "backgroundColor": "#F8FAFC", "theme": "modern"}', '{"style": "squares", "color": "#3B82F6", "logo": true}', '/demo/john-qr.png', 'JOHN2024'),
('550e8400-e29b-41d4-a716-446655440001', 'sarahstyle', 'Sarah Johnson', 'Fashion designer and lifestyle blogger. Creating content that inspires confidence and creativity.', '/demo/sarah-profile.jpg', '{"primaryColor": "#EC4899", "backgroundColor": "#FDF2F8", "theme": "elegant"}', '{"style": "dots", "color": "#EC4899", "logo": true}', '/demo/sarah-qr.png', 'SARAH2024'),
('550e8400-e29b-41d4-a716-446655440002', 'mikefashion', 'Mike Chen', 'Streetwear enthusiast and trend forecaster. Connecting fashion with culture and community.', '/demo/mike-profile.jpg', '{"primaryColor": "#10B981", "backgroundColor": "#F0FDF4", "theme": "urban"}', '{"style": "rounded", "color": "#10B981", "logo": true}', '/demo/mike-qr.png', 'MIKE2024');

-- Insert sample links
INSERT INTO public.links (profile_id, title, url, icon, position, is_spotlight) VALUES
-- John Doe's links
('550e8400-e29b-41d4-a716-446655440000', 'Instagram', 'https://instagram.com/johndoe', 'instagram', 1, true),
('550e8400-e29b-41d4-a716-446655440000', 'Personal Website', 'https://johndoe.com', 'globe', 2, false),
('550e8400-e29b-41d4-a716-446655440000', 'LinkedIn', 'https://linkedin.com/in/johndoe', 'linkedin', 3, false),
('550e8400-e29b-41d4-a716-446655440000', 'YouTube', 'https://youtube.com/@johndoe', 'youtube', 4, false),
('550e8400-e29b-41d4-a716-446655440000', 'Shop My Style', 'https://fashun.co.in/shop/johndoe', 'shopping-bag', 5, false),

-- Sarah Johnson's links
('550e8400-e29b-41d4-a716-446655440001', 'Fashion Blog', 'https://sarahstyle.blog', 'edit', 1, true),
('550e8400-e29b-41d4-a716-446655440001', 'Instagram', 'https://instagram.com/sarahstyle', 'instagram', 2, false),
('550e8400-e29b-41d4-a716-446655440001', 'Pinterest', 'https://pinterest.com/sarahstyle', 'image', 3, false),
('550e8400-e29b-41d4-a716-446655440001', 'TikTok', 'https://tiktok.com/@sarahstyle', 'music', 4, false),
('550e8400-e29b-41d4-a716-446655440001', 'Design Portfolio', 'https://behance.net/sarahstyle', 'palette', 5, false),

-- Mike Chen's links
('550e8400-e29b-41d4-a716-446655440002', 'Streetwear Collection', 'https://fashun.co.in/shop/mikefashion', 'shopping-bag', 1, true),
('550e8400-e29b-41d4-a716-446655440002', 'Instagram', 'https://instagram.com/mikefashion', 'instagram', 2, false),
('550e8400-e29b-41d4-a716-446655440002', 'Twitter', 'https://twitter.com/mikefashion', 'twitter', 3, false),
('550e8400-e29b-41d4-a716-446655440002', 'Fashion Newsletter', 'https://mikefashion.substack.com', 'mail', 4, false),
('550e8400-e29b-41d4-a716-446655440002', 'Trend Podcast', 'https://spotify.com/trendfocus', 'headphones', 5, false);

-- Insert sample analytics data
INSERT INTO public.analytics (profile_id, event_type, link_id, visitor_ip_hash, visitor_id, user_agent, referrer, country, device_type, created_at) VALUES
-- John Doe analytics
('550e8400-e29b-41d4-a716-446655440000', 'profile_view', NULL, 'hash1', 'visitor_1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', 'https://google.com', 'United States', 'mobile', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440000', 'link_click', (SELECT id FROM public.links WHERE profile_id = '550e8400-e29b-41d4-a716-446655440000' AND title = 'Instagram' LIMIT 1), 'hash1', 'visitor_1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', 'https://google.com', 'United States', 'mobile', NOW() - INTERVAL '45 minutes'),
('550e8400-e29b-41d4-a716-446655440000', 'profile_view', NULL, 'hash2', 'visitor_2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://twitter.com', 'Canada', 'desktop', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440000', 'qr_scan', NULL, 'hash3', 'visitor_3', 'Mozilla/5.0 (Android 14)', 'direct', 'United Kingdom', 'mobile', NOW() - INTERVAL '15 minutes'),

-- Sarah Johnson analytics
('550e8400-e29b-41d4-a716-446655440001', 'profile_view', NULL, 'hash4', 'visitor_4', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'https://instagram.com', 'Australia', 'desktop', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440001', 'link_click', (SELECT id FROM public.links WHERE profile_id = '550e8400-e29b-41d4-a716-446655440001' AND title = 'Fashion Blog' LIMIT 1), 'hash4', 'visitor_4', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'https://instagram.com', 'Australia', 'desktop', NOW() - INTERVAL '1.5 hours'),
('550e8400-e29b-41d4-a716-446655440001', 'profile_view', NULL, 'hash5', 'visitor_5', 'Mozilla/5.0 (iPad; CPU OS 17_0)', 'https://pinterest.com', 'Germany', 'tablet', NOW() - INTERVAL '1 hour'),

-- Mike Chen analytics
('550e8400-e29b-41d4-a716-446655440002', 'profile_view', NULL, 'hash6', 'visitor_6', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', 'https://tiktok.com', 'Japan', 'mobile', NOW() - INTERVAL '3 hours'),
('550e8400-e29b-41d4-a716-446655440002', 'link_click', (SELECT id FROM public.links WHERE profile_id = '550e8400-e29b-41d4-a716-446655440002' AND title = 'Streetwear Collection' LIMIT 1), 'hash6', 'visitor_6', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', 'https://tiktok.com', 'Japan', 'mobile', NOW() - INTERVAL '2.5 hours');

-- Insert sample closet items
INSERT INTO public.closet_items (profile_id, medusa_order_id, product_title, product_image_url, product_variant_id, product_price, quantity, purchased_at) VALUES
-- John Doe's closet
('550e8400-e29b-41d4-a716-446655440000', 'order_01HJKM2E4Y8X7Z9Q3W5R8T6U1V', 'Premium Cotton T-Shirt - White', '/products/tshirt-white.jpg', 'variant_123', 29.99, 2, NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440000', 'order_01HJKM2E4Y8X7Z9Q3W5R8T6U1V', 'Denim Jacket - Classic Blue', '/products/denim-jacket.jpg', 'variant_456', 89.99, 1, NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440000', 'order_01HJKM3F5Z9Y8A1B4X6S9U7V2W', 'Sneakers - Limited Edition', '/products/sneakers-limited.jpg', 'variant_789', 149.99, 1, NOW() - INTERVAL '3 days'),

-- Sarah Johnson's closet
('550e8400-e29b-41d4-a716-446655440001', 'order_01HJKM4G6A0Z9B2C5Y7T0V8W3X', 'Silk Dress - Floral Print', '/products/silk-dress.jpg', 'variant_101', 199.99, 1, NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440001', 'order_01HJKM4G6A0Z9B2C5Y7T0V8W3X', 'Designer Handbag - Black', '/products/handbag-black.jpg', 'variant_202', 299.99, 1, NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440001', 'order_01HJKM5H7B1A0C3D6Z8U1W9X4Y', 'Heels - Nude Patent', '/products/heels-nude.jpg', 'variant_303', 129.99, 1, NOW() - INTERVAL '5 days'),

-- Mike Chen's closet
('550e8400-e29b-41d4-a716-446655440002', 'order_01HJKM6I8C2B1D4E7A9V2X0Y5Z', 'Hoodie - Streetwear Collection', '/products/hoodie-streetwear.jpg', 'variant_404', 79.99, 1, NOW() - INTERVAL '12 days'),
('550e8400-e29b-41d4-a716-446655440002', 'order_01HJKM6I8C2B1D4E7A9V2X0Y5Z', 'Cargo Pants - Olive Green', '/products/cargo-pants.jpg', 'variant_505', 69.99, 1, NOW() - INTERVAL '12 days'),
('550e8400-e29b-41d4-a716-446655440002', 'order_01HJKM7J9D3C2E5F8B0W3Y1Z6A', 'Cap - Embroidered Logo', '/products/cap-logo.jpg', 'variant_606', 24.99, 2, NOW() - INTERVAL '1 day');

-- Insert sample business cards
INSERT INTO public.business_cards (profile_id, card_name, template_id, card_data, card_image_url, qr_code_url, is_default) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Professional Card', 'template_modern', '{"name": "John Doe", "title": "Fashion Entrepreneur", "company": "Style Co.", "email": "john@styleco.com", "phone": "+1-555-0123", "website": "johndoe.com", "colors": {"primary": "#3B82F6", "secondary": "#1E40AF"}}', '/cards/john-business-card.png', '/qr/john-business-qr.png', true),
('550e8400-e29b-41d4-a716-446655440001', 'Creative Card', 'template_elegant', '{"name": "Sarah Johnson", "title": "Fashion Designer", "company": "Sarah Style Studio", "email": "sarah@sarahstyle.com", "phone": "+1-555-0456", "website": "sarahstyle.blog", "colors": {"primary": "#EC4899", "secondary": "#BE185D"}}', '/cards/sarah-business-card.png', '/qr/sarah-business-qr.png', true),
('550e8400-e29b-41d4-a716-446655440002', 'Urban Card', 'template_urban', '{"name": "Mike Chen", "title": "Trend Forecaster", "company": "Urban Insights", "email": "mike@urbaninsights.co", "phone": "+1-555-0789", "website": "mikefashion.com", "colors": {"primary": "#10B981", "secondary": "#047857"}}', '/cards/mike-business-card.png', '/qr/mike-business-qr.png', true);

-- Insert sample QR codes
INSERT INTO public.qr_codes (profile_id, qr_name, qr_type, qr_data, qr_image_url, scan_count, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Profile QR', 'profile', '{"url": "https://p.fashun.co.in/johndoe", "style": "squares", "color": "#3B82F6"}', '/qr/john-profile-qr.png', 45, true),
('550e8400-e29b-41d4-a716-446655440000', 'Shop QR', 'link', '{"url": "https://fashun.co.in/shop/johndoe", "style": "squares", "color": "#3B82F6"}', '/qr/john-shop-qr.png', 23, true),
('550e8400-e29b-41d4-a716-446655440001', 'Profile QR', 'profile', '{"url": "https://p.fashun.co.in/sarahstyle", "style": "dots", "color": "#EC4899"}', '/qr/sarah-profile-qr.png', 67, true),
('550e8400-e29b-41d4-a716-446655440001', 'Blog QR', 'link', '{"url": "https://sarahstyle.blog", "style": "dots", "color": "#EC4899"}', '/qr/sarah-blog-qr.png', 34, true),
('550e8400-e29b-41d4-a716-446655440002', 'Profile QR', 'profile', '{"url": "https://p.fashun.co.in/mikefashion", "style": "rounded", "color": "#10B981"}', '/qr/mike-profile-qr.png', 89, true),
('550e8400-e29b-41d4-a716-446655440002', 'Collection QR', 'link', '{"url": "https://fashun.co.in/shop/mikefashion", "style": "rounded", "color": "#10B981"}', '/qr/mike-collection-qr.png', 56, true);

-- Insert sample social accounts
INSERT INTO public.social_accounts (profile_id, platform, account_id, username, is_connected, auto_post_enabled, last_sync_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'instagram', 'ig_john_123', 'johndoe', true, true, NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440000', 'linkedin', 'li_john_456', 'johndoe', true, false, NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440000', 'youtube', 'yt_john_789', '@johndoe', true, false, NOW() - INTERVAL '3 hours'),
('550e8400-e29b-41d4-a716-446655440001', 'instagram', 'ig_sarah_abc', 'sarahstyle', true, true, NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440001', 'pinterest', 'pin_sarah_def', 'sarahstyle', true, true, NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440001', 'tiktok', 'tt_sarah_ghi', '@sarahstyle', true, false, NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440002', 'instagram', 'ig_mike_xyz', 'mikefashion', true, true, NOW() - INTERVAL '45 minutes'),
('550e8400-e29b-41d4-a716-446655440002', 'twitter', 'tw_mike_uvw', 'mikefashion', true, false, NOW() - INTERVAL '1.5 hours'),
('550e8400-e29b-41d4-a716-446655440002', 'tiktok', 'tt_mike_rst', '@mikefashion', true, true, NOW() - INTERVAL '2.5 hours');

-- Insert sample contacts
INSERT INTO public.contacts (profile_id, first_name, last_name, email, phone, company, job_title, notes, tags, contact_source, last_contacted_at, contact_status) VALUES
-- John Doe's contacts
('550e8400-e29b-41d4-a716-446655440000', 'Emma', 'Wilson', 'emma@fashionmag.com', '+1-555-1001', 'Fashion Magazine', 'Editor', 'Met at Fashion Week. Interested in collaboration.', ARRAY['media', 'collaboration'], 'networking_event', NOW() - INTERVAL '2 days', 'active'),
('550e8400-e29b-41d4-a716-446655440000', 'David', 'Brown', 'david@brandstudio.com', '+1-555-1002', 'Brand Studio', 'Creative Director', 'Potential brand partnership opportunity.', ARRAY['business', 'partnership'], 'referral', NOW() - INTERVAL '5 days', 'active'),
('550e8400-e29b-41d4-a716-446655440000', 'Lisa', 'Garcia', 'lisa@retailchain.com', '+1-555-1003', 'Retail Chain', 'Buyer', 'Interested in stocking our products.', ARRAY['retail', 'buyer'], 'trade_show', NOW() - INTERVAL '1 week', 'active'),

-- Sarah Johnson's contacts
('550e8400-e29b-41d4-a716-446655440001', 'Michael', 'Taylor', 'michael@designhouse.com', '+1-555-2001', 'Design House', 'Head of Design', 'Potential collaboration on upcoming collection.', ARRAY['design', 'collaboration'], 'industry_event', NOW() - INTERVAL '3 days', 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'Jennifer', 'Martinez', 'jen@influenceragency.com', '+1-555-2002', 'Influencer Agency', 'Account Manager', 'Managing brand partnerships for influencers.', ARRAY['influencer', 'agency'], 'social_media', NOW() - INTERVAL '1 day', 'active'),

-- Mike Chen's contacts
('550e8400-e29b-41d4-a716-446655440002', 'Alex', 'Johnson', 'alex@streetbrand.com', '+1-555-3001', 'Street Brand', 'Founder', 'Interested in trend forecasting services.', ARRAY['streetwear', 'founder'], 'cold_outreach', NOW() - INTERVAL '4 days', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'Rachel', 'Kim', 'rachel@fashiontech.io', '+1-555-3002', 'Fashion Tech', 'Product Manager', 'Exploring tech solutions for fashion industry.', ARRAY['technology', 'innovation'], 'conference', NOW() - INTERVAL '6 days', 'active');

-- Insert sample affiliates
INSERT INTO public.affiliates (profile_id, referral_code, commission_rate, tier_level, total_earnings, total_referrals, is_active, joined_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'JOHN2024', 15.00, 2, 1250.75, 8, true, NOW() - INTERVAL '2 months'),
('550e8400-e29b-41d4-a716-446655440001', 'SARAH2024', 12.50, 1, 890.25, 5, true, NOW() - INTERVAL '1 month'),
('550e8400-e29b-41d4-a716-446655440002', 'MIKE2024', 20.00, 3, 2150.50, 12, true, NOW() - INTERVAL '3 months');

-- Insert sample referrals
INSERT INTO public.referrals (affiliate_id, referred_user_id, referral_source, conversion_value, commission_earned, status, converted_at) VALUES
((SELECT id FROM public.affiliates WHERE referral_code = 'JOHN2024'), '550e8400-e29b-41d4-a716-446655440001', 'social_media', 299.99, 45.00, 'confirmed', NOW() - INTERVAL '1 week'),
((SELECT id FROM public.affiliates WHERE referral_code = 'JOHN2024'), '550e8400-e29b-41d4-a716-446655440002', 'blog_post', 189.99, 28.50, 'confirmed', NOW() - INTERVAL '3 days'),
((SELECT id FROM public.affiliates WHERE referral_code = 'SARAH2024'), '550e8400-e29b-41d4-a716-446655440000', 'instagram', 129.99, 16.25, 'confirmed', NOW() - INTERVAL '5 days'),
((SELECT id FROM public.affiliates WHERE referral_code = 'MIKE2024'), NULL, 'youtube', 399.99, 80.00, 'pending', NOW() - INTERVAL '1 day');

-- Insert sample media items
INSERT INTO public.media_items (profile_id, title, description, media_type, media_url, thumbnail_url, file_size, duration, mime_type, metadata, is_featured, display_order, visibility) VALUES
-- John Doe's media
('550e8400-e29b-41d4-a716-446655440000', 'Style Journey Video', 'My personal style evolution over the years', 'video', '/media/john/style-journey.mp4', '/media/john/style-journey-thumb.jpg', 25600000, 180, 'video/mp4', '{"resolution": "1920x1080", "fps": 30}', true, 1, 'public'),
('550e8400-e29b-41d4-a716-446655440000', 'Fashion Portfolio', 'Collection of my favorite looks and outfits', 'image', '/media/john/portfolio.jpg', '/media/john/portfolio.jpg', 2048000, NULL, 'image/jpeg', '{"width": 1920, "height": 1080}', true, 2, 'public'),

-- Sarah Johnson's media
('550e8400-e29b-41d4-a716-446655440001', 'Design Process Timelapse', 'Creating a dress from concept to completion', 'video', '/media/sarah/design-process.mp4', '/media/sarah/design-process-thumb.jpg', 40960000, 300, 'video/mp4', '{"resolution": "1920x1080", "fps": 24}', true, 1, 'public'),
('550e8400-e29b-41d4-a716-446655440001', 'Fashion Podcast Episode', 'Discussing sustainable fashion trends', 'audio', '/media/sarah/podcast-ep1.mp3', '/media/sarah/podcast-thumb.jpg', 35840000, 1800, 'audio/mpeg', '{"bitrate": "192kbps"}', false, 2, 'public'),

-- Mike Chen's media
('550e8400-e29b-41d4-a716-446655440002', 'Streetwear Lookbook', 'Latest streetwear trends and styling tips', 'image', '/media/mike/lookbook.jpg', '/media/mike/lookbook.jpg', 3072000, NULL, 'image/jpeg', '{"width": 2560, "height": 1440}', true, 1, 'public'),
('550e8400-e29b-41d4-a716-446655440002', 'Trend Report 2024', 'Comprehensive analysis of upcoming fashion trends', 'document', '/media/mike/trend-report.pdf', '/media/mike/document-thumb.jpg', 5120000, NULL, 'application/pdf', '{"pages": 25}', false, 2, 'public');

-- Insert sample interactive embeds
INSERT INTO public.interactive_embeds (profile_id, title, embed_type, embed_code, configuration, display_order, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Book a Consultation', 'calendar', '<iframe src="https://calendly.com/johndoe" width="100%" height="600"></iframe>', '{"calendar_type": "calendly", "duration": 30}', 1, true),
('550e8400-e29b-41d4-a716-446655440000', 'Style Preferences Quiz', 'form', '<iframe src="https://forms.gle/style-quiz" width="100%" height="500"></iframe>', '{"form_type": "google_forms"}', 2, true),

('550e8400-e29b-41d4-a716-446655440001', 'Design Consultation', 'calendar', '<iframe src="https://calendly.com/sarahstyle" width="100%" height="600"></iframe>', '{"calendar_type": "calendly", "duration": 60}', 1, true),
('550e8400-e29b-41d4-a716-446655440001', 'Favorite Designer Poll', 'poll', '<iframe src="https://poll.ly/designer-poll" width="100%" height="400"></iframe>', '{"poll_type": "multiple_choice"}', 2, true),

('550e8400-e29b-41d4-a716-446655440002', 'Trend Newsletter Signup', 'form', '<iframe src="https://forms.gle/newsletter" width="100%" height="400"></iframe>', '{"form_type": "newsletter"}', 1, true),
('550e8400-e29b-41d4-a716-446655440002', 'Style Poll', 'poll', '<iframe src="https://poll.ly/style-poll" width="100%" height="350"></iframe>', '{"poll_type": "rating"}', 2, true);

-- Insert sample analytics events
INSERT INTO public.analytics_events (profile_id, event_type, event_data, visitor_id, ip_address, user_agent, referrer, country, city, device_type, browser, os, timestamp) VALUES
-- Recent events for all profiles
('550e8400-e29b-41d4-a716-446655440000', 'page_view', '{"page": "/profile"}', 'visitor_001', '192.168.1.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', 'https://google.com', 'United States', 'New York', 'mobile', 'Safari', 'iOS', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440000', 'link_click', '{"url": "https://instagram.com/johndoe", "text": "Instagram"}', 'visitor_001', '192.168.1.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', 'https://google.com', 'United States', 'New York', 'mobile', 'Safari', 'iOS', NOW() - INTERVAL '55 minutes'),
('550e8400-e29b-41d4-a716-446655440001', 'page_view', '{"page": "/profile"}', 'visitor_002', '192.168.1.2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://instagram.com', 'Canada', 'Toronto', 'desktop', 'Chrome', 'Windows', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440002', 'qr_scan', '{"type": "profile"}', 'visitor_003', '192.168.1.3', 'Mozilla/5.0 (Android 14)', 'direct', 'United Kingdom', 'London', 'mobile', 'Chrome', 'Android', NOW() - INTERVAL '30 minutes');

-- Insert sample daily counters
INSERT INTO public.analytics_daily_counters (profile_id, date, page_views, link_clicks, qr_scans, social_clicks, downloads, shares, unique_visitors) VALUES
('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 45, 12, 8, 5, 3, 2, 28),
('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '1 day', 52, 15, 6, 7, 4, 3, 35),
('550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, 38, 10, 4, 8, 2, 5, 24),
('550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', 41, 13, 7, 6, 3, 4, 29),
('550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE, 67, 18, 12, 9, 5, 7, 42),
('550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '1 day', 59, 16, 9, 11, 6, 6, 38);

COMMENT ON SCHEMA public IS 'FASHUN.CO.IN Digital Ecosystem - Sample data for development and testing';