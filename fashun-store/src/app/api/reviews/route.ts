import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  const reviews = [
    {
      id: '1',
      productId: 'p1',
      userName: 'John Doe',
      rating: 5,
      comment: 'Amazing quality! Love the fit.',
      verified: true,
      createdAt: '2025-01-20',
    },
    {
      id: '2',
      productId: 'p1',
      userName: 'Jane Smith',
      rating: 4,
      comment: 'Good product but sizing runs small.',
      verified: true,
      createdAt: '2025-01-19',
    },
  ];

  const filtered = productId ? reviews.filter(r => r.productId === productId) : reviews;

  return NextResponse.json({ reviews: filtered, success: true });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, rating, comment, userName } = body;

  if (!productId || !rating || !comment || !userName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }

  const newReview = {
    id: Date.now().toString(),
    productId,
    userName,
    rating,
    comment,
    verified: false,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ review: newReview, success: true }, { status: 201 });
}
