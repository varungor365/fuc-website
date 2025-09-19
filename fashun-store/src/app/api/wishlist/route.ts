import { NextRequest, NextResponse } from 'next/server'

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  variantId?: string
  size?: string
  color?: string
  addedAt: string
  notes?: string
  priority: 'low' | 'medium' | 'high'
  priceAtAddition: number
  currentPrice: number
  priceDropAlert: boolean
  stockAlert: boolean
  collectionId?: string
}

export interface WishlistCollection {
  id: string
  userId: string
  name: string
  description?: string
  isPublic: boolean
  shareUrl?: string
  createdAt: string
  updatedAt: string
  itemCount: number
  coverImage?: string
  tags: string[]
}

export interface WishlistShare {
  id: string
  collectionId: string
  shareUrl: string
  isActive: boolean
  expiresAt?: string
  viewCount: number
  createdAt: string
}

export interface PriceAlert {
  id: string
  userId: string
  productId: string
  variantId?: string
  targetPrice: number
  isActive: boolean
  createdAt: string
  triggeredAt?: string
}

// Mock databases
const mockWishlistItems: WishlistItem[] = [
  {
    id: '1',
    userId: 'user1',
    productId: 'product-1',
    variantId: 'variant-1',
    size: 'L',
    color: 'Black',
    addedAt: '2025-01-15T10:00:00Z',
    notes: 'For winter collection',
    priority: 'high',
    priceAtAddition: 2999,
    currentPrice: 2699,
    priceDropAlert: true,
    stockAlert: true,
    collectionId: 'collection-1'
  },
  {
    id: '2',
    userId: 'user1',
    productId: 'product-2',
    addedAt: '2025-01-14T15:30:00Z',
    priority: 'medium',
    priceAtAddition: 1999,
    currentPrice: 1999,
    priceDropAlert: false,
    stockAlert: true,
    collectionId: 'collection-1'
  }
]

const mockCollections: WishlistCollection[] = [
  {
    id: 'collection-1',
    userId: 'user1',
    name: 'Winter Essentials',
    description: 'Cozy pieces for the cold season',
    isPublic: true,
    shareUrl: 'https://fashun.co.in/wishlist/share/winter-essentials-abc123',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    itemCount: 2,
    coverImage: '/api/placeholder/400/300',
    tags: ['winter', 'cozy', 'essentials']
  },
  {
    id: 'collection-2',
    userId: 'user1',
    name: 'Summer Vibes',
    description: 'Light and breezy summer collection',
    isPublic: false,
    createdAt: '2025-01-05T14:00:00Z',
    updatedAt: '2025-01-12T16:00:00Z',
    itemCount: 0,
    tags: ['summer', 'light', 'casual']
  }
]

const mockPriceAlerts: PriceAlert[] = [
  {
    id: '1',
    userId: 'user1',
    productId: 'product-1',
    variantId: 'variant-1',
    targetPrice: 2500,
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z'
  }
]

// GET /api/wishlist - Get user's wishlist items and collections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const collectionId = searchParams.get('collectionId')
    const type = searchParams.get('type') || 'items' // 'items', 'collections', 'both'
    const includeShared = searchParams.get('includeShared') === 'true'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let response: any = {}

    // Get wishlist items
    if (type === 'items' || type === 'both') {
      let items = mockWishlistItems.filter(item => item.userId === userId)
      
      if (collectionId) {
        items = items.filter(item => item.collectionId === collectionId)
      }

      // Sort by priority and date added
      items.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      })

      response.items = items
      response.totalItems = items.length
    }

    // Get collections
    if (type === 'collections' || type === 'both') {
      let collections = mockCollections.filter(collection => collection.userId === userId)
      
      if (includeShared) {
        // Include public collections from other users (for discovery)
        const sharedCollections = mockCollections.filter(
          collection => collection.isPublic && collection.userId !== userId
        )
        collections = [...collections, ...sharedCollections]
      }

      response.collections = collections
      response.totalCollections = collections.length
    }

    // Get price alerts if requested
    if (searchParams.get('includePriceAlerts') === 'true') {
      const priceAlerts = mockPriceAlerts.filter(
        alert => alert.userId === userId && alert.isActive
      )
      response.priceAlerts = priceAlerts
    }

    // Calculate summary statistics
    if (type === 'both' || type === 'items') {
      const userItems = mockWishlistItems.filter(item => item.userId === userId)
      const totalValue = userItems.reduce((sum, item) => sum + item.currentPrice, 0)
      const totalSavings = userItems.reduce((sum, item) => 
        sum + Math.max(0, item.priceAtAddition - item.currentPrice), 0
      )
      const priceDrops = userItems.filter(item => item.currentPrice < item.priceAtAddition).length

      response.summary = {
        totalValue,
        totalSavings,
        priceDrops,
        averageItemPrice: userItems.length > 0 ? totalValue / userItems.length : 0
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      productId,
      variantId,
      size,
      color,
      notes,
      priority = 'medium',
      currentPrice,
      priceDropAlert = false,
      stockAlert = true,
      collectionId
    } = body

    if (!userId || !productId || !currentPrice) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, productId, currentPrice' },
        { status: 400 }
      )
    }

    // Check if item already exists
    const existingItem = mockWishlistItems.find(
      item => item.userId === userId && 
               item.productId === productId && 
               item.variantId === variantId &&
               item.size === size &&
               item.color === color
    )

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 409 }
      )
    }

    // Create new wishlist item
    const newItem: WishlistItem = {
      id: Date.now().toString(),
      userId,
      productId,
      variantId,
      size,
      color,
      addedAt: new Date().toISOString(),
      notes,
      priority,
      priceAtAddition: currentPrice,
      currentPrice,
      priceDropAlert,
      stockAlert,
      collectionId
    }

    mockWishlistItems.push(newItem)

    // Update collection item count if item is added to a collection
    if (collectionId) {
      const collection = mockCollections.find(c => c.id === collectionId && c.userId === userId)
      if (collection) {
        collection.itemCount++
        collection.updatedAt = new Date().toISOString()
      }
    }

    // Create price alert if requested
    if (priceDropAlert) {
      const priceAlert: PriceAlert = {
        id: Date.now().toString() + '_alert',
        userId,
        productId,
        variantId,
        targetPrice: currentPrice * 0.9, // 10% discount alert by default
        isActive: true,
        createdAt: new Date().toISOString()
      }
      mockPriceAlerts.push(priceAlert)
    }

    return NextResponse.json(
      {
        message: 'Item added to wishlist successfully',
        item: newItem
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add item to wishlist' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    const userId = searchParams.get('userId')

    if (!itemId || !userId) {
      return NextResponse.json(
        { error: 'Item ID and User ID are required' },
        { status: 400 }
      )
    }

    const itemIndex = mockWishlistItems.findIndex(
      item => item.id === itemId && item.userId === userId
    )

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      )
    }

    const removedItem = mockWishlistItems[itemIndex]
    mockWishlistItems.splice(itemIndex, 1)

    // Update collection item count
    if (removedItem.collectionId) {
      const collection = mockCollections.find(c => c.id === removedItem.collectionId)
      if (collection) {
        collection.itemCount = Math.max(0, collection.itemCount - 1)
        collection.updatedAt = new Date().toISOString()
      }
    }

    // Remove associated price alerts
    const alertIndex = mockPriceAlerts.findIndex(
      alert => alert.userId === userId && 
               alert.productId === removedItem.productId &&
               alert.variantId === removedItem.variantId
    )
    if (alertIndex !== -1) {
      mockPriceAlerts.splice(alertIndex, 1)
    }

    return NextResponse.json({
      message: 'Item removed from wishlist successfully'
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from wishlist' },
      { status: 500 }
    )
  }
}

// PATCH /api/wishlist - Update wishlist item
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, userId, updates } = body

    if (!itemId || !userId || !updates) {
      return NextResponse.json(
        { error: 'Item ID, User ID, and updates are required' },
        { status: 400 }
      )
    }

    const itemIndex = mockWishlistItems.findIndex(
      item => item.id === itemId && item.userId === userId
    )

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      )
    }

    // Update the item
    const allowedUpdates = ['notes', 'priority', 'priceDropAlert', 'stockAlert', 'collectionId']
    const updatedItem = { ...mockWishlistItems[itemIndex] }

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        (updatedItem as any)[field] = updates[field]
      }
    })

    mockWishlistItems[itemIndex] = updatedItem

    return NextResponse.json({
      message: 'Wishlist item updated successfully',
      item: updatedItem
    })
  } catch (error) {
    console.error('Error updating wishlist item:', error)
    return NextResponse.json(
      { error: 'Failed to update wishlist item' },
      { status: 500 }
    )
  }
}