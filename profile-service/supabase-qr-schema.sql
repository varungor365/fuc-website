-- Schema Update: Add QR Code Customization Support
-- Execute this in your Supabase SQL editor

-- Add qr_settings column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS qr_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS custom_qr_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS qr_created_at TIMESTAMPTZ DEFAULT NULL;

-- Create index for faster queries on qr_settings
CREATE INDEX IF NOT EXISTS idx_profiles_qr_settings ON profiles USING gin (qr_settings);

-- Create QR codes storage bucket (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('qr-codes', 'qr-codes', true);

-- Create storage policy for QR codes
-- CREATE POLICY "Users can upload their own QR codes" ON storage.objects 
-- FOR INSERT WITH CHECK (bucket_id = 'qr-codes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "QR codes are publicly accessible" ON storage.objects 
-- FOR SELECT USING (bucket_id = 'qr-codes');

-- Create a function to generate QR code filenames
CREATE OR REPLACE FUNCTION generate_qr_filename(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN user_id::text || '-' || extract(epoch from now())::bigint || '.png';
END;
$$ LANGUAGE plpgsql;

-- Create a function to update profile QR settings
CREATE OR REPLACE FUNCTION update_profile_qr_settings(
  profile_id UUID,
  settings JSONB,
  qr_url TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  UPDATE profiles 
  SET 
    qr_settings = settings,
    custom_qr_url = COALESCE(qr_url, custom_qr_url),
    qr_created_at = CASE WHEN qr_url IS NOT NULL THEN NOW() ELSE qr_created_at END,
    updated_at = NOW()
  WHERE id = profile_id
  RETURNING to_jsonb(profiles.*) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION update_profile_qr_settings TO authenticated;
GRANT EXECUTE ON FUNCTION generate_qr_filename TO authenticated;

-- Create sample QR settings for existing users (optional)
UPDATE profiles 
SET qr_settings = '{
  "dotsOptions": {"color": "#000000", "type": "square"},
  "backgroundOptions": {"color": "#ffffff"},
  "cornersSquareOptions": {"color": "#000000", "type": "square"},
  "cornersDotOptions": {"color": "#000000", "type": "square"},
  "imageOptions": {"hideBackgroundDots": true, "imageSize": 0.4, "margin": 0}
}'::jsonb
WHERE qr_settings IS NULL OR qr_settings = '{}'::jsonb;