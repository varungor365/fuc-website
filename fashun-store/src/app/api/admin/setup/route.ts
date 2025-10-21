import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    if (!password || password.length < 8) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters long' 
      }, { status: 400 });
    }
    
    // Use service role key to create user
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create the admin user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'fashun.co.in@gmail.com',
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'admin',
        full_name: 'FASHUN Admin'
      }
    });
    
    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }
    
    // Create profile with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: 'fashun.co.in@gmail.com',
        full_name: 'FASHUN Admin',
        role: 'admin',
        is_active: true
      });
    
    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Try to delete the auth user if profile creation failed
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Admin account created successfully' 
    });
  } catch (error) {
    console.error('Error in admin setup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
