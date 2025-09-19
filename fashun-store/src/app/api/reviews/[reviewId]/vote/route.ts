import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { reviewId } = params;
    const { helpful } = await request.json();

    // Get current review
    const reviewResponse = await fetch(`${process.env.STRAPI_URL}/api/reviews/${reviewId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!reviewResponse.ok) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    const reviewData = await reviewResponse.json();
    const review = reviewData.data.attributes;

    // Update vote counts
    const newHelpfulVotes = helpful 
      ? (review.helpful_votes || 0) + 1 
      : review.helpful_votes || 0;
    const newTotalVotes = (review.total_votes || 0) + 1;

    // Update review
    const updateResponse = await fetch(`${process.env.STRAPI_URL}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          helpful_votes: newHelpfulVotes,
          total_votes: newTotalVotes
        }
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update vote');
    }

    const updatedData = await updateResponse.json();
    return NextResponse.json(updatedData.data.attributes);

  } catch (error) {
    console.error('Error voting on review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
