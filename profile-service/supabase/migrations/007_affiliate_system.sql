-- Affiliate Program Database Schema
-- This file contains all the necessary tables for the affiliate system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Affiliate Programs Table
CREATE TABLE IF NOT EXISTS affiliate_programs (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00, -- Percentage
    commission_type VARCHAR(20) DEFAULT 'percentage', -- 'percentage' or 'fixed'
    fixed_amount DECIMAL(10,2) DEFAULT 0,
    min_payout DECIMAL(10,2) DEFAULT 50.00,
    is_active BOOLEAN DEFAULT true,
    tier_requirements JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default affiliate program
INSERT INTO affiliate_programs (
    id, name, description, commission_rate, commission_type, 
    min_payout, is_active, tier_requirements
) VALUES (
    'fashun_standard',
    'FASHUN Creator Program',
    'Earn commissions by referring customers to FASHUN',
    15.00,
    'percentage',
    50.00,
    true,
    '[
        {"sales_required": 500, "tier_name": "Silver", "bonus_rate": 2},
        {"sales_required": 2000, "tier_name": "Gold", "bonus_rate": 5},
        {"sales_required": 5000, "tier_name": "Platinum", "bonus_rate": 8},
        {"sales_required": 10000, "tier_name": "Diamond", "bonus_rate": 12}
    ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Affiliates Table
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    program_id VARCHAR(50) NOT NULL REFERENCES affiliate_programs(id),
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'suspended', 'banned'
    tier VARCHAR(20) DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum', 'diamond'
    total_referrals INTEGER DEFAULT 0,
    total_sales DECIMAL(12,2) DEFAULT 0,
    total_commission DECIMAL(12,2) DEFAULT 0,
    pending_commission DECIMAL(12,2) DEFAULT 0,
    paid_commission DECIMAL(12,2) DEFAULT 0,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, program_id)
);

-- Referral Visits Table (for tracking clicks)
CREATE TABLE IF NOT EXISTS referral_visits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) NOT NULL,
    visitor_ip INET,
    user_agent TEXT,
    referrer TEXT,
    landing_page TEXT,
    converted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals Table (for tracking conversions)
CREATE TABLE IF NOT EXISTS referrals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    referral_code VARCHAR(20) NOT NULL,
    order_id VARCHAR(255), -- Reference to order in main store
    conversion_type VARCHAR(20) NOT NULL, -- 'signup', 'purchase', 'subscription'
    commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    commission_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'paid', 'cancelled'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payout Requests Table
CREATE TABLE IF NOT EXISTS payout_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    payment_method VARCHAR(50) NOT NULL, -- 'bank_transfer', 'paypal', 'crypto', 'store_credit'
    payment_details JSONB NOT NULL DEFAULT '{}',
    admin_notes TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate Tiers Table (for tier management)
CREATE TABLE IF NOT EXISTS affiliate_tiers (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    min_sales DECIMAL(12,2) DEFAULT 0,
    min_referrals INTEGER DEFAULT 0,
    bonus_rate DECIMAL(5,2) DEFAULT 0, -- Additional bonus percentage
    perks JSONB DEFAULT '[]',
    color VARCHAR(7) DEFAULT '#6b7280',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO affiliate_tiers (id, name, min_sales, min_referrals, bonus_rate, color) VALUES
('bronze', 'Bronze', 0, 0, 0, '#cd7f32'),
('silver', 'Silver', 500, 10, 2, '#c0c0c0'),
('gold', 'Gold', 2000, 25, 5, '#ffd700'),
('platinum', 'Platinum', 5000, 50, 8, '#e5e4e2'),
('diamond', 'Diamond', 10000, 100, 12, '#b9f2ff')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_tier ON affiliates(tier);

CREATE INDEX IF NOT EXISTS idx_referral_visits_affiliate_id ON referral_visits(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referral_visits_referral_code ON referral_visits(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_visits_created_at ON referral_visits(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_conversion_type ON referrals(conversion_type);
CREATE INDEX IF NOT EXISTS idx_referrals_commission_status ON referrals(commission_status);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payout_requests_affiliate_id ON payout_requests(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON payout_requests(status);
CREATE INDEX IF NOT EXISTS idx_payout_requests_requested_at ON payout_requests(requested_at DESC);

-- Function to update affiliate statistics
CREATE OR REPLACE FUNCTION update_affiliate_stats(
    p_affiliate_id UUID,
    p_sales_amount DECIMAL DEFAULT 0,
    p_commission_amount DECIMAL DEFAULT 0,
    p_increment_referrals INTEGER DEFAULT 0
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE affiliates 
    SET 
        total_referrals = total_referrals + p_increment_referrals,
        total_sales = total_sales + p_sales_amount,
        pending_commission = pending_commission + p_commission_amount,
        last_activity = NOW(),
        updated_at = NOW()
    WHERE id = p_affiliate_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate tier based on performance
CREATE OR REPLACE FUNCTION calculate_affiliate_tier(
    p_total_sales DECIMAL,
    p_total_referrals INTEGER
) RETURNS VARCHAR(20) AS $$
BEGIN
    IF p_total_sales >= 10000 AND p_total_referrals >= 100 THEN
        RETURN 'diamond';
    ELSIF p_total_sales >= 5000 AND p_total_referrals >= 50 THEN
        RETURN 'platinum';
    ELSIF p_total_sales >= 2000 AND p_total_referrals >= 25 THEN
        RETURN 'gold';
    ELSIF p_total_sales >= 500 AND p_total_referrals >= 10 THEN
        RETURN 'silver';
    ELSE
        RETURN 'bronze';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to process affiliate conversion
CREATE OR REPLACE FUNCTION process_affiliate_conversion(
    p_referral_code VARCHAR(20),
    p_conversion_type VARCHAR(20),
    p_order_value DECIMAL DEFAULT 0,
    p_user_id UUID DEFAULT NULL,
    p_order_id VARCHAR(255) DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_affiliate affiliates%ROWTYPE;
    v_program affiliate_programs%ROWTYPE;
    v_commission_amount DECIMAL;
    v_new_tier VARCHAR(20);
BEGIN
    -- Get affiliate and program info
    SELECT a.*, ap.* INTO v_affiliate, v_program
    FROM affiliates a
    JOIN affiliate_programs ap ON a.program_id = ap.id
    WHERE a.referral_code = p_referral_code 
    AND a.status = 'active'
    AND ap.is_active = true;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Calculate commission
    IF p_conversion_type = 'purchase' AND p_order_value > 0 THEN
        IF v_program.commission_type = 'percentage' THEN
            v_commission_amount := (p_order_value * v_program.commission_rate) / 100;
        ELSE
            v_commission_amount := v_program.fixed_amount;
        END IF;
    ELSIF p_conversion_type = 'signup' THEN
        v_commission_amount := COALESCE(v_program.fixed_amount, 10);
    ELSE
        v_commission_amount := 0;
    END IF;
    
    -- Insert referral record
    INSERT INTO referrals (
        affiliate_id, referred_user_id, referral_code, order_id,
        conversion_type, commission_amount, commission_status, metadata
    ) VALUES (
        v_affiliate.id, p_user_id, p_referral_code, p_order_id,
        p_conversion_type, v_commission_amount, 'pending',
        jsonb_build_object(
            'order_value', p_order_value,
            'conversion_timestamp', NOW()
        )
    );
    
    -- Update affiliate stats
    PERFORM update_affiliate_stats(
        v_affiliate.id,
        CASE WHEN p_conversion_type = 'purchase' THEN p_order_value ELSE 0 END,
        v_commission_amount,
        1
    );
    
    -- Check for tier upgrade
    v_new_tier := calculate_affiliate_tier(
        v_affiliate.total_sales + CASE WHEN p_conversion_type = 'purchase' THEN p_order_value ELSE 0 END,
        v_affiliate.total_referrals + 1
    );
    
    IF v_new_tier != v_affiliate.tier THEN
        UPDATE affiliates 
        SET tier = v_new_tier 
        WHERE id = v_affiliate.id;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to approve commission and update balances
CREATE OR REPLACE FUNCTION approve_commission(
    p_referral_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_referral referrals%ROWTYPE;
BEGIN
    SELECT * INTO v_referral 
    FROM referrals 
    WHERE id = p_referral_id AND commission_status = 'pending';
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Update referral status
    UPDATE referrals 
    SET commission_status = 'approved', updated_at = NOW()
    WHERE id = p_referral_id;
    
    -- Move commission from pending to total
    UPDATE affiliates 
    SET 
        total_commission = total_commission + v_referral.commission_amount,
        pending_commission = pending_commission - v_referral.commission_amount,
        updated_at = NOW()
    WHERE id = v_referral.affiliate_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_affiliates_updated_at ON affiliates;
CREATE TRIGGER update_affiliates_updated_at
    BEFORE UPDATE ON affiliates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_referrals_updated_at ON referrals;
CREATE TRIGGER update_referrals_updated_at
    BEFORE UPDATE ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payout_requests_updated_at ON payout_requests;
CREATE TRIGGER update_payout_requests_updated_at
    BEFORE UPDATE ON payout_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE affiliate_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliate_programs (public read)
CREATE POLICY "Affiliate programs are publicly viewable" ON affiliate_programs
    FOR SELECT USING (is_active = true);

-- RLS Policies for affiliates
CREATE POLICY "Users can view their own affiliate data" ON affiliates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliate data" ON affiliates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage affiliates" ON affiliates
    FOR ALL USING (true);

-- RLS Policies for referral_visits
CREATE POLICY "Affiliates can view their own referral visits" ON referral_visits
    FOR SELECT USING (
        affiliate_id IN (
            SELECT id FROM affiliates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage referral visits" ON referral_visits
    FOR ALL USING (true);

-- RLS Policies for referrals
CREATE POLICY "Affiliates can view their own referrals" ON referrals
    FOR SELECT USING (
        affiliate_id IN (
            SELECT id FROM affiliates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage referrals" ON referrals
    FOR ALL USING (true);

-- RLS Policies for payout_requests
CREATE POLICY "Affiliates can view their own payout requests" ON payout_requests
    FOR SELECT USING (
        affiliate_id IN (
            SELECT id FROM affiliates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Affiliates can create payout requests" ON payout_requests
    FOR INSERT WITH CHECK (
        affiliate_id IN (
            SELECT id FROM affiliates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage payout requests" ON payout_requests
    FOR ALL USING (true);

-- RLS Policies for affiliate_tiers (public read)
CREATE POLICY "Affiliate tiers are publicly viewable" ON affiliate_tiers
    FOR SELECT USING (true);