-- Creator Studio Database Schema
-- Run this in Supabase SQL Editor

-- AI Generated Patterns
CREATE TABLE IF NOT EXISTS ai_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_seamless BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Design Submissions (for Creator Royalty Program)
CREATE TABLE IF NOT EXISTS design_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  design_image TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id)
);

-- Design Sales (track royalties)
CREATE TABLE IF NOT EXISTS design_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID REFERENCES design_submissions(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sale_amount DECIMAL(10,2) NOT NULL,
  royalty_amount DECIMAL(10,2) NOT NULL,
  royalty_percentage DECIMAL(5,2) DEFAULT 10.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Design Votes (community voting)
CREATE TABLE IF NOT EXISTS design_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID REFERENCES design_submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(design_id, user_id)
);

-- Creator Earnings (aggregate view)
CREATE TABLE IF NOT EXISTS creator_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_sales INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  pending_payout DECIMAL(10,2) DEFAULT 0,
  last_payout_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_ai_patterns_user ON ai_patterns(user_id);
CREATE INDEX idx_design_submissions_user ON design_submissions(user_id);
CREATE INDEX idx_design_submissions_status ON design_submissions(status);
CREATE INDEX idx_design_sales_creator ON design_sales(creator_id);
CREATE INDEX idx_design_sales_design ON design_sales(design_id);

-- Row Level Security Policies

-- AI Patterns
ALTER TABLE ai_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own patterns"
  ON ai_patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patterns"
  ON ai_patterns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Design Submissions
ALTER TABLE design_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved designs"
  ON design_submissions FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can submit designs"
  ON design_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending designs"
  ON design_submissions FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Design Sales
ALTER TABLE design_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view own sales"
  ON design_sales FOR SELECT
  USING (auth.uid() = creator_id);

-- Design Votes
ALTER TABLE design_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes"
  ON design_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can vote"
  ON design_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Creator Earnings
ALTER TABLE creator_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view own earnings"
  ON creator_earnings FOR SELECT
  USING (auth.uid() = creator_id);

-- Functions

-- Update vote count on design
CREATE OR REPLACE FUNCTION update_design_votes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE design_submissions
  SET votes = (
    SELECT COUNT(*) FROM design_votes
    WHERE design_id = NEW.design_id AND vote_type = 'up'
  ) - (
    SELECT COUNT(*) FROM design_votes
    WHERE design_id = NEW.design_id AND vote_type = 'down'
  )
  WHERE id = NEW.design_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_votes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON design_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_design_votes();

-- Update creator earnings on sale
CREATE OR REPLACE FUNCTION update_creator_earnings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO creator_earnings (creator_id, total_sales, total_earnings, pending_payout)
  VALUES (NEW.creator_id, 1, NEW.royalty_amount, NEW.royalty_amount)
  ON CONFLICT (creator_id) DO UPDATE SET
    total_sales = creator_earnings.total_sales + 1,
    total_earnings = creator_earnings.total_earnings + NEW.royalty_amount,
    pending_payout = creator_earnings.pending_payout + NEW.royalty_amount,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_earnings_trigger
  AFTER INSERT ON design_sales
  FOR EACH ROW
  EXECUTE FUNCTION update_creator_earnings();

-- Insert sample data for testing
INSERT INTO design_submissions (user_id, title, description, design_image, status, votes)
SELECT 
  id,
  'Sample Design ' || generate_series,
  'A beautiful design created by our community',
  'https://via.placeholder.com/600x700',
  'approved',
  floor(random() * 100)
FROM auth.users, generate_series(1, 5)
LIMIT 5;
