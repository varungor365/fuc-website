-- Additional schema for phygital order tracking
-- Execute this in your Supabase SQL editor

-- Create orders table (if not exists)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id),
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  is_phygital BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  print_payload JSONB,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create phygital_orders table for tracking custom QR usage
CREATE TABLE IF NOT EXISTS phygital_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id),
  qr_code_url TEXT,
  qr_settings_used JSONB,
  print_provider_order_id TEXT,
  print_status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_phygital_orders_customer_id ON phygital_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_phygital_orders_order_id ON phygital_orders(order_id);

-- Create RLS policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE phygital_orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = customer_id);

-- Users can only see their own phygital orders
CREATE POLICY "Users can view own phygital orders" ON phygital_orders
  FOR SELECT USING (auth.uid() = customer_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create a phygital order
CREATE OR REPLACE FUNCTION create_phygital_order(
  p_product_id TEXT,
  p_product_name TEXT,
  p_size TEXT,
  p_color TEXT,
  p_quantity INTEGER,
  p_price DECIMAL,
  p_shipping_address JSONB
)
RETURNS JSONB AS $$
DECLARE
  new_order_id UUID;
  user_profile RECORD;
  result JSONB;
BEGIN
  -- Get user profile with QR settings
  SELECT id, username, custom_qr_url, qr_settings 
  INTO user_profile
  FROM profiles 
  WHERE id = auth.uid();
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  -- Create the order
  INSERT INTO orders (
    customer_id, product_id, product_name, size, color, 
    quantity, price, is_phygital, shipping_address, status
  ) VALUES (
    auth.uid(), p_product_id, p_product_name, p_size, p_color,
    p_quantity, p_price, true, p_shipping_address, 'pending'
  ) RETURNING id INTO new_order_id;
  
  -- Create phygital order record
  INSERT INTO phygital_orders (
    order_id, customer_id, qr_code_url, qr_settings_used
  ) VALUES (
    new_order_id, auth.uid(), user_profile.custom_qr_url, user_profile.qr_settings
  );
  
  -- Return order details
  SELECT to_jsonb(o.*) || jsonb_build_object(
    'qr_code_url', user_profile.custom_qr_url,
    'qr_settings', user_profile.qr_settings,
    'username', user_profile.username
  )
  INTO result
  FROM orders o 
  WHERE o.id = new_order_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_phygital_order TO authenticated;