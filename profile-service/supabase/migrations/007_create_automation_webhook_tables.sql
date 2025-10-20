-- =============================================
-- FASHUN.CO.IN - STEP 7: CREATE AUTOMATION AND WEBHOOK TABLES
-- Execute this after 006_create_social_crm_tables.sql
-- =============================================

-- Create automation_logs table
CREATE TABLE IF NOT EXISTS public.automation_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    automation_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.automation_logs IS 'Tracks all automated processes and their outcomes';

-- Create webhook_logs table
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    webhook_type TEXT NOT NULL,
    endpoint_url TEXT NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    attempts INTEGER DEFAULT 1,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.webhook_logs IS 'Tracks webhook deliveries and responses';

-- Verify tables created
SELECT 'automation_logs and webhook_logs tables created successfully' as status;
