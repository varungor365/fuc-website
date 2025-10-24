-- Create waitlist table for launch countdown email collection
-- Run this SQL in your Supabase SQL Editor: https://oyysorgjqeqxhmyczphk.supabase.co/project/oyysorgjqeqxhmyczphk/sql

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'launch_countdown',
  user_agent TEXT,
  referrer TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON waitlist(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for waitlist signups)
CREATE POLICY "Allow public waitlist signups" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read (for admin)
CREATE POLICY "Allow authenticated users to read waitlist" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role to do everything (for API)
CREATE POLICY "Allow service role full access" ON waitlist
  FOR ALL
  TO service_role
  USING (true);

COMMENT ON TABLE waitlist IS 'Email waitlist for fashun.co.in launch countdown';
COMMENT ON COLUMN waitlist.email IS 'User email address (unique)';
COMMENT ON COLUMN waitlist.source IS 'Source of signup (e.g., launch_countdown, homepage)';
COMMENT ON COLUMN waitlist.user_agent IS 'Browser user agent string';
COMMENT ON COLUMN waitlist.referrer IS 'HTTP referrer URL';
COMMENT ON COLUMN waitlist.metadata IS 'Additional metadata as JSON';
