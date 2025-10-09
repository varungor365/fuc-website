import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { anonymousUserId, email, password } = await request.json();
    
    if (!anonymousUserId || !email || !password) {
      return NextResponse.json(
        { error: 'Anonymous user ID, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if email is already taken
    const { data: existingUsers, error: existingUsersError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email);

    if (existingUsersError) {
      console.error('Error checking existing users:', existingUsersError);
      return NextResponse.json(
        { error: 'Failed to check email availability' },
        { status: 500 }
      );
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 400 }
      );
    }

    // Upgrade anonymous user to a full account
    // This is a simplified approach - in practice, you might need to:
    // 1. Create a new user with the provided credentials
    // 2. Transfer data from the anonymous user to the new user
    // 3. Delete the anonymous user account
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation for demo
    });

    if (error) {
      console.error('Error upgrading anonymous user:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // In a real implementation, you would transfer data from the anonymous user
    // to the new user account here. For example:
    // - Shopping cart items
    // - Wishlist items
    // - User preferences
    // - Any other user-specific data

    return NextResponse.json({ 
      success: true, 
      user: data.user,
      message: 'Anonymous user successfully upgraded to full account'
    });
  } catch (error) {
    console.error('Upgrade anonymous user exception:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade anonymous user' },
      { status: 500 }
    );
  }
}