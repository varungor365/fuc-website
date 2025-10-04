import { NextRequest, NextResponse } from 'next/server';

// Mock error store - in production, use database
let errorStore: any[] = [
  {
    id: '1',
    message: 'Failed to load product data',
    stack: 'Error: Network timeout\n    at ProductService.fetchProduct',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: 'error',
    status: 'open',
    category: 'API',
    source: 'server',
    url: '/api/products/123'
  },
  {
    id: '2',
    message: 'Component render error',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    severity: 'error',
    status: 'investigating',
    category: 'React',
    source: 'client'
  },
  {
    id: '3',
    message: 'Payment timeout',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    severity: 'critical',
    status: 'resolved',
    category: 'Payment',
    source: 'server'
  }
];

function isAdminAuthenticated(request: NextRequest): boolean {
  // TODO: Implement proper admin authentication
  return true;
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['open', 'investigating', 'resolved', 'ignored'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    const errorIndex = errorStore.findIndex(error => error.id === id);
    
    if (errorIndex === -1) {
      return NextResponse.json(
        { error: 'Error not found' },
        { status: 404 }
      );
    }

    // Update the error status
    errorStore[errorIndex] = {
      ...errorStore[errorIndex],
      status,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Error status updated successfully',
      error: errorStore[errorIndex]
    });

  } catch (error) {
    console.error('Error updating error status:', error);
    return NextResponse.json(
      { error: 'Failed to update error status' },
      { status: 500 }
    );
  }
}