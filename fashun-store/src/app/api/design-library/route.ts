import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (replace with database in production)
let designLibrary: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let filteredDesigns = designLibrary;
    
    if (customerId) {
      filteredDesigns = designLibrary.filter(design => design.customerId === customerId);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDesigns = filteredDesigns.slice(startIndex, endIndex);
    
    return NextResponse.json({
      designs: paginatedDesigns,
      total: filteredDesigns.length,
      page,
      limit,
      totalPages: Math.ceil(filteredDesigns.length / limit)
    });
    
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch designs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      imageUrl,
      style,
      productType,
      color,
      customerId,
      customerEmail,
      designName
    } = await request.json();

    const newDesign = {
      id: `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      prompt,
      imageUrl,
      style,
      productType,
      color,
      customerId,
      customerEmail,
      designName: designName || `Custom Design ${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      orderCount: 0,
      tags: [],
      metadata: {
        width: 800,
        height: 800,
        format: 'digital'
      }
    };

    designLibrary.push(newDesign);

    return NextResponse.json({
      success: true,
      design: newDesign,
      message: 'Design saved to library successfully'
    });

  } catch (error) {
    console.error('Error saving design:', error);
    return NextResponse.json(
      { error: 'Failed to save design' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();
    
    const designIndex = designLibrary.findIndex(design => design.id === id);
    
    if (designIndex === -1) {
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404 }
      );
    }

    designLibrary[designIndex] = {
      ...designLibrary[designIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      design: designLibrary[designIndex],
      message: 'Design updated successfully'
    });

  } catch (error) {
    console.error('Error updating design:', error);
    return NextResponse.json(
      { error: 'Failed to update design' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Design ID is required' },
        { status: 400 }
      );
    }

    const designIndex = designLibrary.findIndex(design => design.id === id);
    
    if (designIndex === -1) {
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404 }
      );
    }

    designLibrary.splice(designIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Design deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting design:', error);
    return NextResponse.json(
      { error: 'Failed to delete design' },
      { status: 500 }
    );
  }
}