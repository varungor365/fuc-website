import { NextRequest, NextResponse } from 'next/server'

export interface WishlistShare {
  id: string
  collectionId: string
  shareUrl: string
  isActive: boolean
  expiresAt?: string
  viewCount: number
  createdAt: string
}

export interface SharedWishlistView {
  id: string
  shareId: string
  viewerIp: string
  viewerUserAgent: string
  viewedAt: string
  referrer?: string
}

// Mock database
const mockShares: WishlistShare[] = [
  {
    id: 'share-1',
    collectionId: 'collection-1',
    shareUrl: 'winter-essentials-abc123',
    isActive: true,
    viewCount: 25,
    createdAt: '2025-01-10T09:00:00Z'
  }
]

const mockViews: SharedWishlistView[] = [
  {
    id: 'view-1',
    shareId: 'share-1',
    viewerIp: '192.168.1.1',
    viewerUserAgent: 'Mozilla/5.0...',
    viewedAt: '2025-01-15T14:30:00Z',
    referrer: 'https://instagram.com'
  }
]

// GET /api/wishlist/share/[shareId] - Get shared wishlist by share URL
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const pathSegments = url.pathname.split('/')
    const shareId = pathSegments[pathSegments.length - 1]

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      )
    }

    // Find the share record
    const shareRecord = mockShares.find(
      share => share.shareUrl === shareId && share.isActive
    )

    if (!shareRecord) {
      return NextResponse.json(
        { error: 'Shared wishlist not found or no longer available' },
        { status: 404 }
      )
    }

    // Check if share has expired
    if (shareRecord.expiresAt && new Date(shareRecord.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Shared wishlist has expired' },
        { status: 410 }
      )
    }

    // Record the view
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer')

    const newView: SharedWishlistView = {
      id: `view-${Date.now()}`,
      shareId: shareRecord.id,
      viewerIp: clientIp,
      viewerUserAgent: userAgent,
      viewedAt: new Date().toISOString(),
      referrer: referrer || undefined
    }

    mockViews.push(newView)

    // Update view count
    shareRecord.viewCount++

    // Fetch the collection details (this would typically join with collections table)
    const mockCollection = {
      id: shareRecord.collectionId,
      name: 'Winter Essentials',
      description: 'Cozy pieces for the cold season',
      ownerName: 'Fashion Enthusiast',
      createdAt: '2025-01-10T09:00:00Z',
      itemCount: 5,
      coverImage: '/api/placeholder/400/300',
      tags: ['winter', 'cozy', 'essentials']
    }

    // Fetch items in the collection (mock data)
    const mockItems = [
      {
        id: '1',
        productId: 'product-1',
        productName: 'Cozy Winter Hoodie',
        productImage: '/api/placeholder/300/300',
        currentPrice: 2699,
        originalPrice: 2999,
        size: 'L',
        color: 'Black',
        inStock: true,
        addedAt: '2025-01-15T10:00:00Z'
      },
      {
        id: '2',
        productId: 'product-2',
        productName: 'Warm Wool Scarf',
        productImage: '/api/placeholder/300/300',
        currentPrice: 1299,
        originalPrice: 1499,
        color: 'Grey',
        inStock: true,
        addedAt: '2025-01-14T15:30:00Z'
      }
    ]

    return NextResponse.json({
      collection: mockCollection,
      items: mockItems,
      shareInfo: {
        shareUrl: shareRecord.shareUrl,
        viewCount: shareRecord.viewCount,
        createdAt: shareRecord.createdAt,
        isExpired: false
      }
    })
  } catch (error) {
    console.error('Error fetching shared wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shared wishlist' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist/share - Create or update share link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      collectionId,
      userId,
      expiresIn, // Optional: duration in days
      regenerateUrl = false
    } = body

    if (!collectionId || !userId) {
      return NextResponse.json(
        { error: 'Collection ID and User ID are required' },
        { status: 400 }
      )
    }

    // Verify user owns the collection (mock verification)
    const ownsCollection = true // In real app, check against collections table

    if (!ownsCollection) {
      return NextResponse.json(
        { error: 'You can only share your own collections' },
        { status: 403 }
      )
    }

    // Check if share already exists
    let existingShare = mockShares.find(share => share.collectionId === collectionId)

    if (existingShare && !regenerateUrl) {
      // Reactivate existing share if it was deactivated
      existingShare.isActive = true
      
      // Update expiration if provided
      if (expiresIn) {
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + expiresIn)
        existingShare.expiresAt = expirationDate.toISOString()
      }

      return NextResponse.json({
        message: 'Share link activated',
        shareUrl: `https://fashun.co.in/wishlist/share/${existingShare.shareUrl}`,
        shareId: existingShare.shareUrl,
        viewCount: existingShare.viewCount,
        expiresAt: existingShare.expiresAt
      })
    }

    // Create new share or regenerate URL
    const shareId = `${collectionId}-${Date.now().toString(36)}`
    let expirationDate: string | undefined

    if (expiresIn) {
      const expDate = new Date()
      expDate.setDate(expDate.getDate() + expiresIn)
      expirationDate = expDate.toISOString()
    }

    if (existingShare && regenerateUrl) {
      // Update existing share with new URL
      existingShare.shareUrl = shareId
      existingShare.isActive = true
      existingShare.expiresAt = expirationDate
      existingShare.viewCount = 0 // Reset view count for new URL
    } else {
      // Create new share
      const newShare: WishlistShare = {
        id: `share-${Date.now()}`,
        collectionId,
        shareUrl: shareId,
        isActive: true,
        expiresAt: expirationDate,
        viewCount: 0,
        createdAt: new Date().toISOString()
      }
      mockShares.push(newShare)
      existingShare = newShare
    }

    return NextResponse.json(
      {
        message: 'Share link created successfully',
        shareUrl: `https://fashun.co.in/wishlist/share/${existingShare.shareUrl}`,
        shareId: existingShare.shareUrl,
        expiresAt: existingShare.expiresAt
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating share link:', error)
    return NextResponse.json(
      { error: 'Failed to create share link' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist/share - Deactivate share link
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const collectionId = searchParams.get('collectionId')
    const userId = searchParams.get('userId')

    if (!collectionId || !userId) {
      return NextResponse.json(
        { error: 'Collection ID and User ID are required' },
        { status: 400 }
      )
    }

    // Find and deactivate the share
    const shareIndex = mockShares.findIndex(share => share.collectionId === collectionId)

    if (shareIndex === -1) {
      return NextResponse.json(
        { error: 'Share link not found' },
        { status: 404 }
      )
    }

    // Deactivate the share instead of deleting it (preserve analytics)
    mockShares[shareIndex].isActive = false

    return NextResponse.json({
      message: 'Share link deactivated successfully'
    })
  } catch (error) {
    console.error('Error deactivating share link:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate share link' },
      { status: 500 }
    )
  }
}