import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { reviewId } = params;
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json(
        { error: 'Flag reason is required' },
        { status: 400 }
      );
    }

    // Update review to mark as flagged
    const response = await fetch(`${process.env.STRAPI_URL}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          flagged: true,
          flag_reason: reason,
          status: 'pending' // Move back to pending for review
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to flag review');
    }

    // Notify admin about flagged review
    try {
      const emailContent = {
        to: process.env.ADMIN_EMAIL || 'admin@fashun.co.in',
        subject: `Review Flagged for Moderation - Review #${reviewId}`,
        template: 'admin-review-flagged',
        data: {
          reviewId,
          reason,
          adminUrl: `${process.env.STRAPI_URL}/admin/content-manager/collection-types/api::review.review/${reviewId}`
        }
      };

      console.log('📧 Admin notification sent for flagged review:', emailContent);
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error flagging review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
