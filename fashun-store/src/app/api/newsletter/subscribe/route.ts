// Newsletter subscription API endpoint
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, source, discount_code } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if already subscribed (to prevent duplicates)
    const existingSubscriber = await checkExistingSubscriber(email)
    if (existingSubscriber) {
      return NextResponse.json(
        { 
          message: 'Email already subscribed',
          discount_code: discount_code || 'WELCOME10'
        },
        { status: 200 }
      )
    }

    // Subscribe to Sendinblue/Brevo
    const sendinblueResult = await subscribeToSendinblue(email, source)
    
    // Subscribe to Strapi (for internal database)
    const strapiResult = await subscribeToStrapi(email, source, discount_code)
    
    // Send welcome email with discount code
    await sendWelcomeEmail(email, discount_code || 'WELCOME10')

    // Track subscription in analytics
    await trackSubscription(email, source)

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      discount_code: discount_code || 'WELCOME10',
      services: {
        sendinblue: sendinblueResult.success,
        strapi: strapiResult.success
      }
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

async function checkExistingSubscriber(email: string) {
  try {
    // Check in Strapi
    const response = await fetch(`${process.env.STRAPI_URL}/api/subscribers?filters[email][$eq]=${email}`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.data.length > 0
    }
  } catch (error) {
    console.error('Error checking existing subscriber:', error)
  }
  
  return false
}

async function subscribeToSendinblue(email: string, source: string) {
  try {
    const response = await fetch('https://api.sendinblue.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.SENDINBLUE_API_KEY || ''
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          SOURCE: source || 'website',
          SIGNUP_DATE: new Date().toISOString(),
          DISCOUNT_SENT: true
        },
        listIds: [2], // Main newsletter list ID
        updateEnabled: true
      })
    })

    if (response.ok || response.status === 204) {
      return { success: true }
    } else {
      const error = await response.text()
      console.error('Sendinblue subscription error:', error)
      return { success: false, error }
    }
  } catch (error) {
    console.error('Sendinblue API error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function subscribeToStrapi(email: string, source: string, discountCode: string) {
  try {
    const response = await fetch(`${process.env.STRAPI_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          email: email,
          source: source || 'website',
          discountCode: discountCode,
          subscribedAt: new Date().toISOString(),
          isActive: true
        }
      })
    })

    if (response.ok) {
      return { success: true }
    } else {
      const error = await response.text()
      console.error('Strapi subscription error:', error)
      return { success: false, error }
    }
  } catch (error) {
    console.error('Strapi API error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function sendWelcomeEmail(email: string, discountCode: string) {
  try {
    // Send via Sendinblue transactional email
    const response = await fetch('https://api.sendinblue.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.SENDINBLUE_API_KEY || ''
      },
      body: JSON.stringify({
        sender: {
          name: 'FUC! Team',
          email: 'noreply@fashun.co.in'
        },
        to: [{ email: email }],
        subject: `Welcome to FUC! Here's your ${discountCode} discount 🔥`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Welcome to FUC!</h1>
            </div>
            
            <div style="padding: 30px 20px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Thanks for joining our streetwear community! 👕</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                You're now part of the FUC! family. Get ready for exclusive drops, 
                style tips, and the freshest streetwear trends.
              </p>
              
              <div style="background: #000; color: #fff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0;">Your Exclusive Discount Code</h3>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${discountCode}</div>
                <p style="margin: 10px 0 0 0; font-size: 14px;">Get 10% off your first order</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://fashun.co.in/products" 
                   style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Shop Now
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center;">
                Follow us on social media for daily style inspiration:<br>
                <a href="#" style="color: #000;">Instagram</a> | 
                <a href="#" style="color: #000;">Twitter</a> | 
                <a href="#" style="color: #000;">Facebook</a>
              </p>
            </div>
          </div>
        `
      })
    })

    return response.ok
  } catch (error) {
    console.error('Welcome email error:', error)
    return false
  }
}

async function trackSubscription(email: string, source: string) {
  try {
    // Track in analytics (this could be sent to multiple platforms)
    const analyticsData = {
      event: 'newsletter_subscription',
      email: email,
      source: source,
      timestamp: new Date().toISOString()
    }

    // This would typically be sent to your analytics service
    console.log('Newsletter subscription tracked:', analyticsData)
    
    return true
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return false
  }
}
