-- Backend Automation Database Schema
-- This file contains all the necessary tables and functions for the automation system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Automation Logs Table
CREATE TABLE IF NOT EXISTS automation_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    details JSONB DEFAULT '{}',
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_automation_logs_type ON automation_logs(type);
CREATE INDEX IF NOT EXISTS idx_automation_logs_created_at ON automation_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_automation_logs_user_id ON automation_logs(user_id);

-- Webhook Logs Table
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    signature_verified BOOLEAN DEFAULT false
);

-- Index for webhook logs
CREATE INDEX IF NOT EXISTS idx_webhook_logs_type ON webhook_logs(webhook_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_processed_at ON webhook_logs(processed_at DESC);

-- Phygital Orders Table (enhanced from previous version)
CREATE TABLE IF NOT EXISTS phygital_orders (
    id VARCHAR(255) PRIMARY KEY, -- Order ID from main store
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    order_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for phygital orders
CREATE INDEX IF NOT EXISTS idx_phygital_orders_user_id ON phygital_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_phygital_orders_status ON phygital_orders(status);
CREATE INDEX IF NOT EXISTS idx_phygital_orders_created_at ON phygital_orders(created_at DESC);

-- Virtual Closet Table (enhanced)
CREATE TABLE IF NOT EXISTS virtual_closet (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    order_id VARCHAR(255) REFERENCES phygital_orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'tshirts',
    brand VARCHAR(100) DEFAULT 'FASHUN',
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    wear_count INTEGER DEFAULT 0,
    is_favorite BOOLEAN DEFAULT false,
    rarity VARCHAR(20) DEFAULT 'common',
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    nft_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for virtual closet
CREATE INDEX IF NOT EXISTS idx_virtual_closet_user_id ON virtual_closet(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_closet_category ON virtual_closet(category);
CREATE INDEX IF NOT EXISTS idx_virtual_closet_rarity ON virtual_closet(rarity);
CREATE INDEX IF NOT EXISTS idx_virtual_closet_purchase_date ON virtual_closet(purchase_date DESC);

-- Profile Analytics Table (enhanced)
CREATE TABLE IF NOT EXISTS profile_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    total_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    qr_scans INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0, -- in seconds
    last_visit TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for analytics
CREATE INDEX IF NOT EXISTS idx_profile_analytics_user_id ON profile_analytics(user_id);

-- QR Settings Table (enhanced)
CREATE TABLE IF NOT EXISTS qr_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    dot_color VARCHAR(7) DEFAULT '#6366f1',
    background_color VARCHAR(7) DEFAULT '#ffffff',
    corner_color VARCHAR(7) DEFAULT '#1f2937',
    corner_dot_color VARCHAR(7) DEFAULT '#1f2937',
    dot_style VARCHAR(20) DEFAULT 'rounded',
    corner_style VARCHAR(20) DEFAULT 'extra-rounded',
    corner_dot_style VARCHAR(20) DEFAULT 'dot',
    logo_url TEXT,
    custom_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Index for QR settings
CREATE INDEX IF NOT EXISTS idx_qr_settings_user_id ON qr_settings(user_id);

-- Add automation-related columns to profiles table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'qr_code_url') THEN
        ALTER TABLE profiles ADD COLUMN qr_code_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'qr_auto_generated') THEN
        ALTER TABLE profiles ADD COLUMN qr_auto_generated BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'auto_created') THEN
        ALTER TABLE profiles ADD COLUMN auto_created BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'profile_completed') THEN
        ALTER TABLE profiles ADD COLUMN profile_completed BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Function to log automation activity
CREATE OR REPLACE FUNCTION log_automation_activity(
    p_type VARCHAR(50),
    p_user_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}',
    p_success BOOLEAN DEFAULT true,
    p_error_message TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO automation_logs (type, user_id, details, success, error_message)
    VALUES (p_type, p_user_id, p_details, p_success, p_error_message)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update profile analytics
CREATE OR REPLACE FUNCTION update_profile_analytics(
    p_user_id UUID,
    p_action VARCHAR(20), -- 'view', 'click', 'qr_scan'
    p_increment INTEGER DEFAULT 1
) RETURNS BOOLEAN AS $$
BEGIN
    -- Insert or update analytics
    INSERT INTO profile_analytics (user_id, total_views, total_clicks, qr_scans, last_visit, updated_at)
    VALUES (
        p_user_id,
        CASE WHEN p_action = 'view' THEN p_increment ELSE 0 END,
        CASE WHEN p_action = 'click' THEN p_increment ELSE 0 END,
        CASE WHEN p_action = 'qr_scan' THEN p_increment ELSE 0 END,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_views = profile_analytics.total_views + 
            CASE WHEN p_action = 'view' THEN p_increment ELSE 0 END,
        total_clicks = profile_analytics.total_clicks + 
            CASE WHEN p_action = 'click' THEN p_increment ELSE 0 END,
        qr_scans = profile_analytics.qr_scans + 
            CASE WHEN p_action = 'qr_scan' THEN p_increment ELSE 0 END,
        last_visit = NOW(),
        updated_at = NOW();
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to add item to virtual closet
CREATE OR REPLACE FUNCTION add_to_virtual_closet(
    p_user_id UUID,
    p_order_id VARCHAR(255),
    p_product_id VARCHAR(255),
    p_product_name VARCHAR(255),
    p_price DECIMAL(10,2),
    p_category VARCHAR(50) DEFAULT 'tshirts',
    p_rarity VARCHAR(20) DEFAULT 'common'
) RETURNS UUID AS $$
DECLARE
    item_id UUID;
BEGIN
    INSERT INTO virtual_closet (
        user_id, order_id, product_id, product_name, 
        price, category, rarity, purchase_date
    )
    VALUES (
        p_user_id, p_order_id, p_product_id, p_product_name,
        p_price, p_category, p_rarity, NOW()
    )
    RETURNING id INTO item_id;
    
    -- Log the activity
    PERFORM log_automation_activity(
        'closet_item_added',
        p_user_id,
        jsonb_build_object(
            'item_id', item_id,
            'product_name', p_product_name,
            'price', p_price
        )
    );
    
    RETURN item_id;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old logs
CREATE OR REPLACE FUNCTION cleanup_old_logs(
    p_days_old INTEGER DEFAULT 30
) RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete old automation logs
    DELETE FROM automation_logs 
    WHERE created_at < NOW() - INTERVAL '1 day' * p_days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete old webhook logs
    DELETE FROM webhook_logs 
    WHERE processed_at < NOW() - INTERVAL '1 day' * p_days_old;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to relevant tables
DROP TRIGGER IF EXISTS update_phygital_orders_updated_at ON phygital_orders;
CREATE TRIGGER update_phygital_orders_updated_at
    BEFORE UPDATE ON phygital_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_virtual_closet_updated_at ON virtual_closet;
CREATE TRIGGER update_virtual_closet_updated_at
    BEFORE UPDATE ON virtual_closet
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profile_analytics_updated_at ON profile_analytics;
CREATE TRIGGER update_profile_analytics_updated_at
    BEFORE UPDATE ON profile_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_qr_settings_updated_at ON qr_settings;
CREATE TRIGGER update_qr_settings_updated_at
    BEFORE UPDATE ON qr_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE phygital_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_closet ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for automation_logs
CREATE POLICY "Users can view their own automation logs" ON automation_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert automation logs" ON automation_logs
    FOR INSERT WITH CHECK (true);

-- RLS Policies for webhook_logs (admin only)
CREATE POLICY "Admin can view webhook logs" ON webhook_logs
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Service role can insert webhook logs" ON webhook_logs
    FOR INSERT WITH CHECK (true);

-- RLS Policies for phygital_orders
CREATE POLICY "Users can view their own phygital orders" ON phygital_orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage phygital orders" ON phygital_orders
    FOR ALL USING (true);

-- RLS Policies for virtual_closet
CREATE POLICY "Users can view their own virtual closet" ON virtual_closet
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own virtual closet items" ON virtual_closet
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage virtual closet" ON virtual_closet
    FOR ALL USING (true);

-- RLS Policies for profile_analytics
CREATE POLICY "Users can view their own analytics" ON profile_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage analytics" ON profile_analytics
    FOR ALL USING (true);

-- RLS Policies for qr_settings
CREATE POLICY "Users can view their own QR settings" ON qr_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own QR settings" ON qr_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage QR settings" ON qr_settings
    FOR ALL USING (true);

-- Create storage bucket for QR codes if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-codes', 'qr-codes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for QR codes
CREATE POLICY "Users can upload their own QR codes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'qr-codes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "QR codes are publicly viewable" ON storage.objects
    FOR SELECT USING (bucket_id = 'qr-codes');

CREATE POLICY "Users can update their own QR codes" ON storage.objects
    FOR UPDATE USING (bucket_id = 'qr-codes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own QR codes" ON storage.objects
    FOR DELETE USING (bucket_id = 'qr-codes' AND auth.uid()::text = (storage.foldername(name))[1]);