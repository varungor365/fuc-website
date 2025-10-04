import { NextRequest, NextResponse } from 'next/server';

// Mock error store - replace with actual database
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
    url: '/api/products/123',
    userAgent: 'Mozilla/5.0...',
    userId: 'user123',
    sessionId: 'sess456',
    metadata: { productId: '123', retryCount: 2 }
  },
  {
    id: '2',
    message: 'Component render error in ProductCard',
    stack: 'TypeError: Cannot read property map of undefined',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    severity: 'error',
    status: 'investigating',
    category: 'React',
    source: 'client',
    url: '/products',
    userAgent: 'Mozilla/5.0...',
    componentStack: '    in ProductCard\n    in ProductGrid',
    metadata: { componentName: 'ProductCard' }
  },
  {
    id: '3',
    message: 'Payment processing timeout',
    stack: 'TimeoutError: Request timed out after 30s',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    severity: 'critical',
    status: 'resolved',
    category: 'Payment',
    source: 'server',
    url: '/api/checkout/process',
    metadata: { orderId: 'ord789', amount: 99.99 }
  }
];

// Admin authentication check
function isAdminAuthenticated(request: NextRequest): boolean {
  // TODO: Implement proper admin authentication
  // For now, return true for development
  return true;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const severity = url.searchParams.get('severity');
    const category = url.searchParams.get('category');
    const source = url.searchParams.get('source');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let filteredErrors = [...errorStore];

    // Apply filters
    if (status) {
      filteredErrors = filteredErrors.filter(error => error.status === status);
    }
    if (severity) {
      filteredErrors = filteredErrors.filter(error => error.severity === severity);
    }
    if (category) {
      filteredErrors = filteredErrors.filter(error => error.category === category);
    }
    if (source) {
      filteredErrors = filteredErrors.filter(error => error.source === source);
    }

    // Sort by timestamp (newest first)
    filteredErrors.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedErrors = filteredErrors.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      errors: paginatedErrors,
      total: filteredErrors.length,
      page,
      limit,
      totalPages: Math.ceil(filteredErrors.length / limit)
    });

  } catch (error) {
    console.error('Error fetching admin errors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch errors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      message,
      stack,
      severity = 'error',
      category = 'General',
      source = 'admin',
      url,
      metadata = {}
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const newError = {
      id: Date.now().toString(),
      message,
      stack,
      timestamp: new Date().toISOString(),
      severity,
      status: 'open',
      category,
      source,
      url: url || '/admin',
      metadata
    };

    errorStore.push(newError);

    return NextResponse.json({
      message: 'Error logged successfully',
      error: newError
    }, { status: 201 });

  } catch (error) {
    console.error('Error logging admin error:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const errorId = url.searchParams.get('id');

    if (!errorId) {
      return NextResponse.json(
        { error: 'Error ID is required' },
        { status: 400 }
      );
    }

    const errorIndex = errorStore.findIndex(error => error.id === errorId);
    
    if (errorIndex === -1) {
      return NextResponse.json(
        { error: 'Error not found' },
        { status: 404 }
      );
    }

    errorStore.splice(errorIndex, 1);

    return NextResponse.json({
      message: 'Error deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting admin error:', error);
    return NextResponse.json(
      { error: 'Failed to delete error' },
      { status: 500 }
    );
  }
}