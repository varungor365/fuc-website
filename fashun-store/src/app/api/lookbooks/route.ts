import { NextRequest, NextResponse } from 'next/server';

// Types
interface LookbookPost {
  id: number;
  title: string;
  description: string;
  image: string;
  author: {
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  hotspots: Array<{
    x: number;
    y: number;
    product: {
      id: number;
      name: string;
      price: number;
      image: string;
      brand?: string;
    };
  }>;
  featured_products: any[];
  instagram_post_url?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_featured: boolean;
  category: string;
  tags: string[];
  estimated_price: number;
  style_notes?: string;
  created_at: string;
}

// Mock data for development
const mockLookbooks: LookbookPost[] = [
  {
    id: 1,
    title: "Urban Street Vibes",
    description: "Perfect streetwear combo for city adventures",
    image: "/api/placeholder/600/800",
    author: {
      username: "stylecrewofficial",
      avatar: "/api/placeholder/40/40",
      isVerified: true
    },
    hotspots: [
      {
        x: 30,
        y: 20,
        product: {
          id: 1,
          name: "FUC! Oversized Hoodie",
          price: 89.99,
          image: "/api/placeholder/200/200",
          brand: "FUC!"
        }
      },
      {
        x: 40,
        y: 70,
        product: {
          id: 2,
          name: "Cargo Pants",
          price: 129.99,
          image: "/api/placeholder/200/200",
          brand: "Street Essentials"
        }
      }
    ],
    featured_products: [],
    likes_count: 1250,
    comments_count: 89,
    shares_count: 156,
    is_featured: true,
    category: "street",
    tags: ["urban", "hoodie", "cargo", "streetwear"],
    estimated_price: 219.98,
    style_notes: "Mix textures and oversized fits for that perfect street aesthetic",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Minimalist Chic",
    description: "Clean lines and neutral tones",
    image: "/api/placeholder/600/900",
    author: {
      username: "minimalfashion",
      avatar: "/api/placeholder/40/40"
    },
    hotspots: [
      {
        x: 50,
        y: 35,
        product: {
          id: 3,
          name: "Essential White Tee",
          price: 49.99,
          image: "/api/placeholder/200/200",
          brand: "Basics Co."
        }
      }
    ],
    featured_products: [],
    likes_count: 892,
    comments_count: 34,
    shares_count: 67,
    is_featured: false,
    category: "casual",
    tags: ["minimal", "white", "clean", "basics"],
    estimated_price: 149.97,
    created_at: "2024-01-14T15:30:00Z"
  },
  {
    id: 3,
    title: "Night Out Essential",
    description: "Turn heads with this killer combo",
    image: "/api/placeholder/600/850",
    author: {
      username: "nightlife_guru",
      avatar: "/api/placeholder/40/40"
    },
    hotspots: [
      {
        x: 45,
        y: 25,
        product: {
          id: 4,
          name: "Black Leather Jacket",
          price: 299.99,
          image: "/api/placeholder/200/200",
          brand: "FUC! Premium"
        }
      },
      {
        x: 50,
        y: 60,
        product: {
          id: 5,
          name: "Distressed Jeans",
          price: 159.99,
          image: "/api/placeholder/200/200",
          brand: "Denim Co."
        }
      }
    ],
    featured_products: [],
    likes_count: 2105,
    comments_count: 156,
    shares_count: 289,
    is_featured: true,
    category: "formal",
    tags: ["leather", "edgy", "nightout", "premium"],
    estimated_price: 459.98,
    style_notes: "Layer textures for a sophisticated yet rebellious look",
    created_at: "2024-01-13T20:15:00Z"
  },
  {
    id: 4,
    title: "Seasonal Transition",
    description: "Perfect for the changing weather",
    image: "/api/placeholder/600/750",
    author: {
      username: "seasonal_style",
      avatar: "/api/placeholder/40/40"
    },
    hotspots: [
      {
        x: 35,
        y: 30,
        product: {
          id: 6,
          name: "Layering Cardigan",
          price: 79.99,
          image: "/api/placeholder/200/200",
          brand: "Cozy Essentials"
        }
      }
    ],
    featured_products: [],
    likes_count: 678,
    comments_count: 45,
    shares_count: 89,
    is_featured: false,
    category: "seasonal",
    tags: ["layering", "transition", "cozy", "versatile"],
    estimated_price: 189.97,
    created_at: "2024-01-12T14:30:00Z"
  },
  {
    id: 5,
    title: "Trending Now",
    description: "What everyone's wearing this week",
    image: "/api/placeholder/600/820",
    author: {
      username: "trendspotter",
      avatar: "/api/placeholder/40/40",
      isVerified: true
    },
    hotspots: [
      {
        x: 40,
        y: 40,
        product: {
          id: 7,
          name: "Trendy Crop Top",
          price: 39.99,
          image: "/api/placeholder/200/200",
          brand: "Trend Factory"
        }
      },
      {
        x: 45,
        y: 75,
        product: {
          id: 8,
          name: "High-Waist Pants",
          price: 89.99,
          image: "/api/placeholder/200/200",
          brand: "Style Central"
        }
      }
    ],
    featured_products: [],
    likes_count: 1567,
    comments_count: 98,
    shares_count: 234,
    is_featured: true,
    category: "trending",
    tags: ["trending", "crop", "highwaist", "modern"],
    estimated_price: 129.98,
    style_notes: "Mix proportions for a balanced and contemporary silhouette",
    created_at: "2024-01-11T16:45:00Z"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset') || '0';

    // TODO: Replace with actual Strapi API call
    // const response = await fetch(`${process.env.STRAPI_URL}/api/lookbooks?populate=*`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
    //   }
    // });
    // const data = await response.json();

    let filteredLookbooks = [...mockLookbooks];

    // Apply filters
    if (category && category !== 'all') {
      filteredLookbooks = filteredLookbooks.filter(post => post.category === category);
    }

    if (featured === 'true') {
      filteredLookbooks = filteredLookbooks.filter(post => post.is_featured);
    }

    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = limit ? startIndex + parseInt(limit) : filteredLookbooks.length;
    const paginatedLookbooks = filteredLookbooks.slice(startIndex, endIndex);

    // Sort by created_at (newest first)
    paginatedLookbooks.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      data: paginatedLookbooks,
      meta: {
        total: filteredLookbooks.length,
        offset: startIndex,
        limit: limit ? parseInt(limit) : filteredLookbooks.length,
        hasMore: endIndex < filteredLookbooks.length
      }
    });

  } catch (error) {
    console.error('Error fetching lookbooks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lookbooks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Create new lookbook in Strapi
    // const response = await fetch(`${process.env.STRAPI_URL}/api/lookbooks`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
    //   },
    //   body: JSON.stringify({ data: body })
    // });

    // For now, return mock response
    const newLookbook: LookbookPost = {
      id: mockLookbooks.length + 1,
      ...body,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      data: newLookbook,
      message: 'Lookbook created successfully'
    });

  } catch (error) {
    console.error('Error creating lookbook:', error);
    return NextResponse.json(
      { error: 'Failed to create lookbook' },
      { status: 500 }
    );
  }
}
