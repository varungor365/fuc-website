import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Google Sheets Web App URL
    const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';
    
    // Try to send to Google Sheets, but don't fail if it doesn't work
    let sheetsSuccess = false;
    let sheetsError = null;
    
    if (GOOGLE_SHEETS_URL) {
      try {
        // Method 1: POST with JSON body
        const sheetsResponse = await fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors', // Important for Google Apps Script
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            timestamp: new Date().toISOString(),
            source: 'launch_countdown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            referrer: request.headers.get('referer') || 'direct'
          })
        });

        // With no-cors, we can't check response, but if no error thrown, it likely worked
        sheetsSuccess = true;
        console.log('Email sent to Google Sheets:', email);
      } catch (error) {
        sheetsError = error;
        console.error('Google Sheets error:', error);
        
        // Fallback: Try GET method with URL parameters
        try {
          const params = new URLSearchParams({
            email,
            timestamp: new Date().toISOString(),
            source: 'launch_countdown'
          });
          
          await fetch(`${GOOGLE_SHEETS_URL}?${params}`, {
            method: 'GET',
            mode: 'no-cors'
          });
          
          sheetsSuccess = true;
          console.log('Email sent to Google Sheets via GET fallback');
        } catch (fallbackError) {
          console.error('Google Sheets GET fallback also failed:', fallbackError);
        }
      }
    }

    // Always return success - email is stored in localStorage on client side as backup
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined the waitlist!',
      sheetsStored: sheetsSuccess,
      localStorageBackup: true
    });

  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    );
  }
}

// Optional: Get total count
export async function GET() {
  try {
    // This would require a separate Google Sheets endpoint to get count
    // For now, return a placeholder
    return NextResponse.json({ 
      count: 247, // You can update this manually or create a count endpoint
      message: 'Check your Google Sheet for full list'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get count' }, { status: 500 });
  }
}
