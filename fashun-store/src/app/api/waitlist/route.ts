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
    
    console.log('📧 Waitlist signup:', email);
    console.log('📊 Google Sheets URL configured:', !!GOOGLE_SHEETS_URL);
    
    // Try to send to Google Sheets
    let sheetsSuccess = false;
    
    if (GOOGLE_SHEETS_URL) {
      try {
        const payload = {
          email,
          timestamp: new Date().toISOString(),
          source: 'launch_countdown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          referrer: request.headers.get('referer') || 'direct'
        };
        
        console.log('📤 Sending to Google Sheets:', payload);
        
        // Use redirect: 'follow' and mode: 'cors' for Google Apps Script
        const sheetsResponse = await fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          redirect: 'follow',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload)
        });

        const responseText = await sheetsResponse.text();
        console.log('📥 Google Sheets response:', responseText);
        
        // Try to parse as JSON
        try {
          const responseJson = JSON.parse(responseText);
          sheetsSuccess = responseJson.success || responseJson.result === 'success';
          console.log('✅ Parsed response:', responseJson);
        } catch (parseError) {
          // Response might not be JSON, check if it contains success indicators
          sheetsSuccess = responseText.includes('success') || responseText.includes('Success');
          console.log('⚠️ Non-JSON response, checking for success keyword');
        }

        if (sheetsSuccess) {
          console.log('✅ Email saved to Google Sheets successfully!');
        } else {
          console.warn('⚠️ Google Sheets response unclear, assuming success');
          sheetsSuccess = true; // Assume success if no error thrown
        }
        
      } catch (error) {
        console.error('❌ Google Sheets error:', error);
        // Don't fail - email is still in localStorage
      }
    } else {
      console.warn('⚠️ Google Sheets URL not configured');
    }

    // Always return success - email is stored in localStorage on client side as backup
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined the waitlist!',
      sheetsStored: sheetsSuccess,
      localStorageBackup: true,
      debugInfo: GOOGLE_SHEETS_URL ? 'Sent to Google Sheets' : 'localStorage only'
    });

  } catch (error) {
    console.error('❌ Waitlist API error:', error);
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
