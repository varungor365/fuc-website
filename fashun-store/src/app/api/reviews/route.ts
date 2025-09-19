import { NextRequest, NextResponse } from 'next/server'

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  verified: boolean
  createdAt: string
  images?: string[]
}

const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user-1',
    userName: 'Arjun Patel',
    rating: 5,
    title: 'Amazing quality!',
    comment: 'This hoodie exceeded my expectations. Great quality and fit.',
    verified: true,
    createdAt: '2024-12-10T10:30:00Z'
  },
  {
    id: '2',
    productId: '1',
    userId: 'user-2',
    userName: 'Priya Sharma',
    rating: 4,
    title: 'Great purchase',
    comment: 'Love the design and comfort. Will definitely buy again.',
    verified: true,
    createdAt: '2024-12-09T15:45:00Z'
  },
  {
    id: '3',
    productId: '2',
    userId: 'user-3',
    userName: 'Rahul Kumar',
    rating: 5,
    title: 'Perfect fit!',
    comment: 'Exactly what I was looking for. The material is top-notch.',
    verified: false,
    createdAt: '2024-12-08T09:20:00Z'
  },
  {
    id: '4',
    productId: '2',
    userId: 'user-4',
    userName: 'Sneha Gupta',
    rating: 4,
    title: 'Good value',
    comment: 'Nice product for the price. Fast delivery too.',
    verified: true,
    createdAt: '2024-12-07T12:15:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const productId = url.searchParams.get('productId')
    
    let reviews = mockReviews
    
    if (productId) {
      reviews = mockReviews.filter(review => review.productId === productId)
    }
    
    // Sort by creation date (newest first)
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json({
      success: true,
      data: reviews,
      total: reviews.length
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, userId, userName, rating, title, comment } = body
    
    // Validate required fields
    if (!productId || !userId || !userName || !rating || !title || !comment) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }
    
    const newReview: Review = {
      id: Date.now().toString(),
      productId,
      userId,
      userName,
      rating,
      title,
      comment,
      verified: false, // New reviews start as unverified
      createdAt: new Date().toISOString()
    }
    
    // In a real app, this would be saved to a database
    mockReviews.push(newReview)
    
    return NextResponse.json({
      success: true,
      data: newReview,
      message: 'Review submitted successfully'
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    )
  }
}