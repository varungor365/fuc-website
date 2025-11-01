import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * API Route for On-Demand Revalidation
 * Allows cache invalidation when content changes in Shopify
 */

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const authHeader = request.headers.get('authorization');
    const secret = authHeader?.replace('Bearer ', '');

    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { path, paths, tag, tags } = body;

    // Revalidate specific paths
    if (path) {
      revalidatePath(path);
      console.log(`✅ Revalidated path: ${path}`);
    }

    if (paths && Array.isArray(paths)) {
      paths.forEach((p: string) => {
        revalidatePath(p);
        console.log(`✅ Revalidated path: ${p}`);
      });
    }

    // Revalidate by tags
    if (tag) {
      revalidateTag(tag);
      console.log(`✅ Revalidated tag: ${tag}`);
    }

    if (tags && Array.isArray(tags)) {
      tags.forEach((t: string) => {
        revalidateTag(t);
        console.log(`✅ Revalidated tag: ${t}`);
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cache revalidated successfully',
      revalidated: {
        paths: paths || (path ? [path] : []),
        tags: tags || (tag ? [tag] : []),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to revalidate',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Example usage from Shopify webhook:
/*
await fetch('https://fashun.co.in/api/revalidate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${REVALIDATE_SECRET}`,
  },
  body: JSON.stringify({
    paths: ['/products/product-handle', '/collections/all'],
    tags: ['products', 'collections'],
  }),
});
*/
