-- Rich Media Embeds System Database Schema
-- Create tables for multimedia content and interactive elements

-- Media Items Table
CREATE TABLE IF NOT EXISTS media_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
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

-- Media Galleries Table
CREATE TABLE IF NOT EXISTS media_galleries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    media_items TEXT[] DEFAULT '{}', -- Array of media item IDs
    layout_type TEXT DEFAULT 'grid' CHECK (layout_type IN ('grid', 'carousel', 'masonry', 'timeline')),
    display_order INTEGER DEFAULT 1,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interactive Embeds Table
CREATE TABLE IF NOT EXISTS interactive_embeds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    embed_type TEXT NOT NULL CHECK (embed_type IN ('calendar', 'form', 'poll', 'widget', 'iframe')),
    embed_code TEXT NOT NULL,
    configuration JSONB DEFAULT '{}',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Analytics Table
CREATE TABLE IF NOT EXISTS media_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    media_id UUID REFERENCES media_items(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'play', 'download', 'share', 'like')),
    visitor_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Media Tags Table (for organization)
CREATE TABLE IF NOT EXISTS media_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    media_id UUID REFERENCES media_items(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(media_id, tag_name)
);

-- Media Collections Table (playlists, albums, etc.)
CREATE TABLE IF NOT EXISTS media_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    collection_type TEXT DEFAULT 'playlist' CHECK (collection_type IN ('playlist', 'album', 'series', 'portfolio')),
    media_items JSONB DEFAULT '[]', -- Array of {media_id, order} objects
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_items_user_id ON media_items(user_id);
CREATE INDEX IF NOT EXISTS idx_media_items_media_type ON media_items(media_type);
CREATE INDEX IF NOT EXISTS idx_media_items_display_order ON media_items(display_order);
CREATE INDEX IF NOT EXISTS idx_media_items_visibility ON media_items(visibility);
CREATE INDEX IF NOT EXISTS idx_media_items_is_featured ON media_items(is_featured);

CREATE INDEX IF NOT EXISTS idx_media_galleries_user_id ON media_galleries(user_id);
CREATE INDEX IF NOT EXISTS idx_media_galleries_display_order ON media_galleries(display_order);

CREATE INDEX IF NOT EXISTS idx_interactive_embeds_user_id ON interactive_embeds(user_id);
CREATE INDEX IF NOT EXISTS idx_interactive_embeds_embed_type ON interactive_embeds(embed_type);
CREATE INDEX IF NOT EXISTS idx_interactive_embeds_is_active ON interactive_embeds(is_active);

CREATE INDEX IF NOT EXISTS idx_media_analytics_media_id ON media_analytics(media_id);
CREATE INDEX IF NOT EXISTS idx_media_analytics_timestamp ON media_analytics(timestamp);

CREATE INDEX IF NOT EXISTS idx_media_tags_media_id ON media_tags(media_id);
CREATE INDEX IF NOT EXISTS idx_media_tags_tag_name ON media_tags(tag_name);

CREATE INDEX IF NOT EXISTS idx_media_collections_user_id ON media_collections(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_media_items_updated_at BEFORE UPDATE ON media_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_galleries_updated_at BEFORE UPDATE ON media_galleries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interactive_embeds_updated_at BEFORE UPDATE ON interactive_embeds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_collections_updated_at BEFORE UPDATE ON media_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get media with analytics
CREATE OR REPLACE FUNCTION get_media_with_stats(p_user_id TEXT, p_media_type TEXT DEFAULT NULL)
RETURNS TABLE (
    media_id UUID,
    title TEXT,
    media_type TEXT,
    media_url TEXT,
    thumbnail_url TEXT,
    file_size BIGINT,
    duration INTEGER,
    is_featured BOOLEAN,
    display_order INTEGER,
    view_count BIGINT,
    play_count BIGINT,
    download_count BIGINT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mi.id as media_id,
        mi.title,
        mi.media_type,
        mi.media_url,
        mi.thumbnail_url,
        mi.file_size,
        mi.duration,
        mi.is_featured,
        mi.display_order,
        COALESCE(views.count, 0) as view_count,
        COALESCE(plays.count, 0) as play_count,
        COALESCE(downloads.count, 0) as download_count,
        mi.created_at
    FROM media_items mi
    LEFT JOIN (
        SELECT media_id, COUNT(*) as count
        FROM media_analytics 
        WHERE event_type = 'view'
        GROUP BY media_id
    ) views ON mi.id = views.media_id
    LEFT JOIN (
        SELECT media_id, COUNT(*) as count
        FROM media_analytics 
        WHERE event_type = 'play'
        GROUP BY media_id
    ) plays ON mi.id = plays.media_id
    LEFT JOIN (
        SELECT media_id, COUNT(*) as count
        FROM media_analytics 
        WHERE event_type = 'download'
        GROUP BY media_id
    ) downloads ON mi.id = downloads.media_id
    WHERE mi.user_id = p_user_id
    AND mi.visibility = 'public'
    AND (p_media_type IS NULL OR mi.media_type = p_media_type)
    ORDER BY mi.display_order ASC, mi.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to track media events
CREATE OR REPLACE FUNCTION track_media_event(
    p_media_id UUID,
    p_user_id TEXT,
    p_event_type TEXT,
    p_visitor_id TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO media_analytics (
        media_id,
        user_id,
        event_type,
        visitor_id,
        ip_address,
        user_agent,
        referrer
    ) VALUES (
        p_media_id,
        p_user_id,
        p_event_type,
        p_visitor_id,
        p_ip_address,
        p_user_agent,
        p_referrer
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactive_embeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_collections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for media_items
CREATE POLICY "Users can view public media items" ON media_items
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can manage their own media items" ON media_items
    FOR ALL USING (user_id = current_setting('app.user_id', true));

-- Create RLS policies for media_galleries
CREATE POLICY "Users can view their own galleries" ON media_galleries
    FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can manage their own galleries" ON media_galleries
    FOR ALL USING (user_id = current_setting('app.user_id', true));

-- Create RLS policies for interactive_embeds
CREATE POLICY "Users can view active embeds" ON interactive_embeds
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their own embeds" ON interactive_embeds
    FOR ALL USING (user_id = current_setting('app.user_id', true));

-- Create RLS policies for media_analytics
CREATE POLICY "Users can view their own media analytics" ON media_analytics
    FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Anyone can insert media analytics" ON media_analytics
    FOR INSERT WITH CHECK (true);

-- Create RLS policies for media_tags
CREATE POLICY "Users can view tags for public media" ON media_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM media_items 
            WHERE id = media_tags.media_id 
            AND visibility = 'public'
        )
    );

CREATE POLICY "Users can manage tags for their own media" ON media_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM media_items 
            WHERE id = media_tags.media_id 
            AND user_id = current_setting('app.user_id', true)
        )
    );

-- Create RLS policies for media_collections
CREATE POLICY "Users can view public collections" ON media_collections
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own collections" ON media_collections
    FOR ALL USING (user_id = current_setting('app.user_id', true));

-- Insert sample media data for demo
INSERT INTO media_items (user_id, title, description, media_type, media_url, thumbnail_url, file_size, mime_type, metadata, is_featured, display_order) VALUES
('demo-user', 'Welcome Video', 'Introduction to my profile and services', 'video', '/demo/welcome-video.mp4', '/demo/welcome-thumb.jpg', 15728640, 'video/mp4', '{"duration": 120, "resolution": "1920x1080"}', true, 1),
('demo-user', 'Portfolio Showcase', 'Visual showcase of my recent work', 'image', '/demo/portfolio.jpg', '/demo/portfolio.jpg', 2097152, 'image/jpeg', '{"width": 1920, "height": 1080}', true, 2),
('demo-user', 'Podcast Episode', 'Latest episode discussing industry trends', 'audio', '/demo/podcast.mp3', '/demo/podcast-thumb.jpg', 52428800, 'audio/mpeg', '{"duration": 1800, "bitrate": "192kbps"}', false, 3),
('demo-user', 'Company Brochure', 'Detailed information about services', 'document', '/demo/brochure.pdf', '/demo/document-thumb.jpg', 3145728, 'application/pdf', '{"pages": 12}', false, 4);

-- Insert sample galleries
INSERT INTO media_galleries (user_id, title, description, media_items, layout_type, is_featured, display_order) VALUES
('demo-user', 'Featured Work', 'My best projects and achievements', ARRAY['media-1', 'media-2'], 'grid', true, 1),
('demo-user', 'Media Collection', 'Various multimedia content', ARRAY['media-1', 'media-3', 'media-4'], 'carousel', false, 2);

-- Insert sample interactive embeds
INSERT INTO interactive_embeds (user_id, title, embed_type, embed_code, configuration, display_order) VALUES
('demo-user', 'Book a Meeting', 'calendar', '<iframe src="https://calendly.com/demo-user" width="100%" height="600"></iframe>', '{"calendar_type": "calendly"}', 1),
('demo-user', 'Contact Form', 'form', '<iframe src="https://forms.gle/demo-form" width="100%" height="500"></iframe>', '{"form_type": "google_forms"}', 2),
('demo-user', 'Quick Poll', 'poll', '<iframe src="https://poll.ly/demo-poll" width="100%" height="400"></iframe>', '{"poll_type": "multiple_choice"}', 3);

-- Insert sample media analytics
INSERT INTO media_analytics (media_id, user_id, event_type, visitor_id, timestamp) VALUES
((SELECT id FROM media_items WHERE title = 'Welcome Video' LIMIT 1), 'demo-user', 'view', 'visitor_1', NOW() - INTERVAL '1 hour'),
((SELECT id FROM media_items WHERE title = 'Welcome Video' LIMIT 1), 'demo-user', 'play', 'visitor_1', NOW() - INTERVAL '55 minutes'),
((SELECT id FROM media_items WHERE title = 'Portfolio Showcase' LIMIT 1), 'demo-user', 'view', 'visitor_2', NOW() - INTERVAL '30 minutes'),
((SELECT id FROM media_items WHERE title = 'Podcast Episode' LIMIT 1), 'demo-user', 'play', 'visitor_3', NOW() - INTERVAL '15 minutes');

COMMENT ON TABLE media_items IS 'Stores individual media files with metadata';
COMMENT ON TABLE media_galleries IS 'Groups media items into collections';
COMMENT ON TABLE interactive_embeds IS 'Stores interactive elements like forms and calendars';
COMMENT ON TABLE media_analytics IS 'Tracks user interactions with media content';
COMMENT ON TABLE media_tags IS 'Tags for organizing and categorizing media';
COMMENT ON TABLE media_collections IS 'Advanced collections like playlists and portfolios';