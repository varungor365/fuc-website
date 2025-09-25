import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { hashPassword, generateToken, validateEmail, generateUsername } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json();

    // Validate input
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'Email, password, and display name are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Generate unique username
    let username = generateUsername(email);
    let counter = 1;
    while (db.prepare('SELECT id FROM users WHERE username = ?').get(username)) {
      username = `${generateUsername(email)}${counter}`;
      counter++;
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    
    const result = db.prepare(`
      INSERT INTO users (username, email, password_hash, display_name)
      VALUES (?, ?, ?, ?)
    `).run(username, email, passwordHash, displayName);

    const userId = result.lastInsertRowid as number;

    // Generate JWT token
    const token = generateToken({ userId, email });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: userId,
        username,
        email,
        displayName
      },
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}