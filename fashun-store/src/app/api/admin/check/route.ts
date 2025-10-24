import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    // Use service role key to check auth users
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if admin user exists in auth.users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error listing users:', usersError);
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }
    
    // Find admin user
    const adminUser = users?.find(user => user.email === 'fashun.co.in@gmail.com');
    
    if (adminUser) {
      // Admin exists, check if they have a profile with admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', adminUser.id)
        .single();
      
      // If profile doesn't exist or has error, create it with admin role
      if (profileError || !profile) {
        await supabase
          .from('profiles')
          .upsert({ 
            id: adminUser.id, 
            role: 'admin',
            created_at: new Date().toISOString()
          });
      }
      
      return NextResponse.json({ 
        exists: true,
        needsSetup: false 
      });
    }
    
    // No admin user found
    return NextResponse.json({ 
      exists: false,
      needsSetup: true 
    });
  } catch (error) {
    console.error('Error in admin check:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
