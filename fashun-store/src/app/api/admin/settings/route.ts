import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'config', 'settings.json');
const ENV_FILE = path.join(process.cwd(), '.env.local');

export async function GET() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      return NextResponse.json(settings);
    }
    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();
    
    const configDir = path.join(process.cwd(), 'config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    
    const envContent = `
NEXT_PUBLIC_MEDUSA_URL=${settings.medusaUrl || 'http://localhost:9000'}
NEXT_PUBLIC_RAZORPAY_KEY=${settings.razorpayKeyId || ''}
RAZORPAY_SECRET=${settings.razorpayKeySecret || ''}
NEXT_PUBLIC_STRIPE_KEY=${settings.stripePublishableKey || ''}
STRIPE_SECRET=${settings.stripeSecretKey || ''}
NEXT_PUBLIC_SITE_URL=${settings.siteUrl || 'https://fashun.co'}
NEXT_PUBLIC_SITE_NAME=${settings.siteName || 'FASHUN.CO'}
NEXT_PUBLIC_SUPPORT_EMAIL=${settings.supportEmail || 'support@fashun.co'}
NEXT_PUBLIC_DEFAULT_CURRENCY=${settings.currency || 'INR'}
NEXT_PUBLIC_GA_ID=${settings.googleAnalyticsId || ''}
NEXT_PUBLIC_FB_PIXEL=${settings.facebookPixelId || ''}
SENDGRID_API_KEY=${settings.sendgridApiKey || ''}
INSTAGRAM_ACCESS_TOKEN=${settings.instagramAccessToken || ''}
OPENROUTER_API_KEY=${settings.openRouterApiKey || ''}
LUMMI_API_KEY=${settings.lummiApiKey || ''}
NEXT_PUBLIC_ENABLE_WISHLIST=${settings.enableWishlist || 'true'}
NEXT_PUBLIC_ENABLE_REVIEWS=${settings.enableReviews || 'true'}
NEXT_PUBLIC_ENABLE_AI_FEATURES=${settings.enableAIFeatures || 'true'}
`;
    
    fs.writeFileSync(ENV_FILE, envContent.trim());
    
    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
