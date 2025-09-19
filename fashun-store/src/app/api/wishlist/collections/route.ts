import { NextRequest, NextResponse } from 'next/server'

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

// Mock database (shared with main wishlist route)
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
  }
]

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

// GET /api/wishlist/collections - Get user's collections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const includePublic = searchParams.get('includePublic') === 'true'
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const order = searchParams.get('order') || 'desc'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let collections = mockCollections.filter(collection => collection.userId === userId)

    if (includePublic) {
      const publicCollections = mockCollections.filter(
        collection => collection.isPublic && collection.userId !== userId
      )
      collections = [...collections, ...publicCollections]
    }

    // Sort collections
    collections.sort((a, b) => {
      let aVal: any, bVal: any
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'itemCount':
          aVal = a.itemCount
          bVal = b.itemCount
          break
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime()
          bVal = new Date(b.createdAt).getTime()
          break
        case 'updatedAt':
        default:
          aVal = new Date(a.updatedAt).getTime()
          bVal = new Date(b.updatedAt).getTime()
          break
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      }
    })

    // Add share statistics for user's own collections
    const collectionsWithStats = collections.map(collection => {
      if (collection.userId === userId) {
        const shareInfo = mockShares.find(share => share.collectionId === collection.id)
        return {
          ...collection,
          shareStats: shareInfo ? {
            viewCount: shareInfo.viewCount,
            isShared: shareInfo.isActive
          } : {
            viewCount: 0,
            isShared: false
          }
        }
      }
      return collection
    })

    return NextResponse.json({
      collections: collectionsWithStats,
      totalCollections: collections.length
    })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist/collections - Create new collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      name,
      description,
      isPublic = false,
      tags = [],
      coverImage
    } = body

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'User ID and collection name are required' },
        { status: 400 }
      )
    }

    // Check if collection name already exists for this user
    const existingCollection = mockCollections.find(
      collection => collection.userId === userId && 
                   collection.name.toLowerCase() === name.toLowerCase()
    )

    if (existingCollection) {
      return NextResponse.json(
        { error: 'Collection with this name already exists' },
        { status: 409 }
      )
    }

    // Create new collection
    const newCollection: WishlistCollection = {
      id: `collection-${Date.now()}`,
      userId,
      name: name.trim(),
      description: description?.trim(),
      isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      itemCount: 0,
      coverImage,
      tags: tags.map((tag: string) => tag.trim().toLowerCase()).filter(Boolean)
    }

    // Generate share URL if public
    if (isPublic) {
      const shareId = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
      newCollection.shareUrl = `https://fashun.co.in/wishlist/share/${shareId}`
      
      // Create share record
      const newShare: WishlistShare = {
        id: `share-${Date.now()}`,
        collectionId: newCollection.id,
        shareUrl: shareId,
        isActive: true,
        viewCount: 0,
        createdAt: new Date().toISOString()
      }
      mockShares.push(newShare)
    }

    mockCollections.push(newCollection)

    return NextResponse.json(
      {
        message: 'Collection created successfully',
        collection: newCollection
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}

// PATCH /api/wishlist/collections - Update collection
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { collectionId, userId, updates } = body

    if (!collectionId || !userId || !updates) {
      return NextResponse.json(
        { error: 'Collection ID, User ID, and updates are required' },
        { status: 400 }
      )
    }

    const collectionIndex = mockCollections.findIndex(
      collection => collection.id === collectionId && collection.userId === userId
    )

    if (collectionIndex === -1) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    const currentCollection = mockCollections[collectionIndex]
    const allowedUpdates = ['name', 'description', 'isPublic', 'tags', 'coverImage']
    
    // Create updated collection
    const updatedCollection = { ...currentCollection }
    let needsNewShareUrl = false

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        if (field === 'name' && updates[field] !== currentCollection.name) {
          // Check for name conflicts
          const nameConflict = mockCollections.find(
            collection => collection.userId === userId && 
                         collection.id !== collectionId &&
                         collection.name.toLowerCase() === updates[field].toLowerCase()
          )
          if (nameConflict) {
            throw new Error('Collection with this name already exists')
          }
          needsNewShareUrl = true
        }
        
        if (field === 'isPublic' && updates[field] !== currentCollection.isPublic) {
          needsNewShareUrl = updates[field] // Only if becoming public
        }

        if (field === 'tags' && Array.isArray(updates[field])) {
          updatedCollection[field] = updates[field].map((tag: string) => tag.trim().toLowerCase()).filter(Boolean)
        } else {
          (updatedCollection as any)[field] = updates[field]
        }
      }
    })

    updatedCollection.updatedAt = new Date().toISOString()

    // Handle share URL updates
    if (needsNewShareUrl && updatedCollection.isPublic) {
      const shareId = `${updatedCollection.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
      updatedCollection.shareUrl = `https://fashun.co.in/wishlist/share/${shareId}`
      
      // Update or create share record
      const existingShare = mockShares.find(share => share.collectionId === collectionId)
      if (existingShare) {
        existingShare.shareUrl = shareId
        existingShare.isActive = true
      } else {
        const newShare: WishlistShare = {
          id: `share-${Date.now()}`,
          collectionId,
          shareUrl: shareId,
          isActive: true,
          viewCount: 0,
          createdAt: new Date().toISOString()
        }
        mockShares.push(newShare)
      }
    } else if (!updatedCollection.isPublic) {
      // Deactivate sharing if made private
      updatedCollection.shareUrl = undefined
      const shareRecord = mockShares.find(share => share.collectionId === collectionId)
      if (shareRecord) {
        shareRecord.isActive = false
      }
    }

    mockCollections[collectionIndex] = updatedCollection

    return NextResponse.json({
      message: 'Collection updated successfully',
      collection: updatedCollection
    })
  } catch (error) {
    console.error('Error updating collection:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update collection' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist/collections - Delete collection
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const collectionId = searchParams.get('collectionId')
    const userId = searchParams.get('userId')
    const moveItems = searchParams.get('moveItems') // Optional collection ID to move items to

    if (!collectionId || !userId) {
      return NextResponse.json(
        { error: 'Collection ID and User ID are required' },
        { status: 400 }
      )
    }

    const collectionIndex = mockCollections.findIndex(
      collection => collection.id === collectionId && collection.userId === userId
    )

    if (collectionIndex === -1) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    const collection = mockCollections[collectionIndex]

    // Handle items in the collection
    if (collection.itemCount > 0) {
      // This would typically update wishlist items in the database
      // For now, we'll just note that items would be moved or orphaned
      console.log(`Collection ${collectionId} had ${collection.itemCount} items that need to be handled`)
    }

    // Remove collection
    mockCollections.splice(collectionIndex, 1)

    // Remove associated share records
    const shareIndex = mockShares.findIndex(share => share.collectionId === collectionId)
    if (shareIndex !== -1) {
      mockShares.splice(shareIndex, 1)
    }

    return NextResponse.json({
      message: 'Collection deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    )
  }
}