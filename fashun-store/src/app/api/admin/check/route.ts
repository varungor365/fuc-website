import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    // Use service role key to query profiles table
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if admin user exists with the specific email
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', 'fashun.co.in@gmail.com')
      .eq('role', 'admin')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected if admin doesn't exist
      console.error('Error checking admin:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      exists: !!data,
      needsSetup: !data 
    });
  } catch (error) {
    console.error('Error in admin check:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
