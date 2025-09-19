import { NextRequest, NextResponse } from 'next/server';

// Types
interface UGCPost {
  id: number;
  caption: string;
  media: string[];
  author: {
    username: string;
    avatar: string;
  };
  hashtags: string[];
  featured_products: any[];
  social_platform: string;
  likes_count: number;
  style_category: string;
  outfit_rating: number;
  location?: string;
  submission_date: string;
  is_approved: boolean;
  moderation_status: string;
  engagement_score: number;
}

// Mock data for development
const mockUGC: UGCPost[] = [
  {
    id: 1,
    caption: "Living my best life in @fucfashion! The quality is unmatched 🔥",
    media: ["/api/placeholder/400/600", "/api/placeholder/400/400"],
    author: {
      username: "fashionista_alex",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#fucfashion", "#streetstyle", "#ootd", "#fashioninspo"],
    featured_products: [
      {
        id: 4,
        name: "FUC! Graphic Tee",
        price: 59.99,
        image: "/api/placeholder/200/200"
      }
    ],
    social_platform: "instagram",
    likes_count: 456,
    style_category: "street",
    outfit_rating: 4.8,
    location: "New York, NY",
    submission_date: "2024-01-16T09:15:00Z",
    is_approved: true,
    moderation_status: "approved",
    engagement_score: 92
  },
  {
    id: 2,
    caption: "Weekend vibes ✨ Thanks @fucfashion for keeping me stylish!",
    media: ["/api/placeholder/500/700"],
    author: {
      username: "style_maven",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#weekendstyle", "#comfortable", "#chic"],
    featured_products: [],
    social_platform: "instagram",
    likes_count: 234,
    style_category: "casual",
    outfit_rating: 4.5,
    submission_date: "2024-01-15T18:45:00Z",
    is_approved: true,
    moderation_status: "approved",
    engagement_score: 78
  },
  {
    id: 3,
    caption: "Date night ready! 💫 This outfit makes me feel so confident",
    media: ["/api/placeholder/450/650", "/api/placeholder/450/650"],
    author: {
      username: "confident_queen",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#datenight", "#confidence", "#fashion", "#selfie"],
    featured_products: [
      {
        id: 5,
        name: "Elegant Dress",
        price: 129.99,
        image: "/api/placeholder/200/200"
      }
    ],
    social_platform: "instagram",
    likes_count: 789,
    style_category: "formal",
    outfit_rating: 4.9,
    location: "Los Angeles, CA",
    submission_date: "2024-01-14T20:30:00Z",
    is_approved: true,
    moderation_status: "approved",
    engagement_score: 95
  },
  {
    id: 4,
    caption: "Gym to brunch transition 💪 Who says you can't be stylish and comfortable?",
    media: ["/api/placeholder/400/550"],
    author: {
      username: "active_lifestyle",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#activewear", "#gymtostyle", "#comfortable", "#athleisure"],
    featured_products: [],
    social_platform: "tiktok",
    likes_count: 567,
    style_category: "workout",
    outfit_rating: 4.3,
    location: "Miami, FL",
    submission_date: "2024-01-13T11:15:00Z",
    is_approved: true,
    moderation_status: "approved",
    engagement_score: 85
  },
  {
    id: 5,
    caption: "Thrift flip Friday! ♻️ Turned this vintage find into something special",
    media: ["/api/placeholder/480/620", "/api/placeholder/480/620", "/api/placeholder/480/620"],
    author: {
      username: "thrift_queen",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#thriftflip", "#sustainable", "#vintage", "#diy"],
    featured_products: [
      {
        id: 6,
        name: "Vintage Jacket",
        price: 45.99,
        image: "/api/placeholder/200/200"
      }
    ],
    social_platform: "instagram",
    likes_count: 1203,
    style_category: "vintage",
    outfit_rating: 4.7,
    submission_date: "2024-01-12T15:20:00Z",
    is_approved: true,
    moderation_status: "approved",
    engagement_score: 98
  },
  {
    id: 6,
    caption: "Office to dinner transition 💼✨ One outfit, multiple vibes",
    media: ["/api/placeholder/420/580"],
    author: {
      username: "working_woman",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#workwear", "#professional", "#versatile", "#transition"],
    featured_products: [
      {
        id: 7,
        name: "Blazer Set",
        price: 189.99,
        image: "/api/placeholder/200/200"
      }
    ],
    social_platform: "instagram",
    likes_count: 345,
    style_category: "formal",
    outfit_rating: 4.6,
    location: "Chicago, IL",
    submission_date: "2024-01-11T12:45:00Z",
    is_approved: true,
    moderation_status: "approved",
    engagement_score: 82
  },
  {
    id: 7,
    caption: "Summer festival ready! 🌻 Comfort meets style",
    media: ["/api/placeholder/460/640"],
    author: {
      username: "festival_vibes",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#festival", "#summer", "#boho", "#comfort"],
    featured_products: [],
    social_platform: "instagram",
    likes_count: 678,
    style_category: "casual",
    outfit_rating: 4.4,
    location: "Austin, TX",
    submission_date: "2024-01-10T16:30:00Z",
    is_approved: true,
    moderation_status: "approved",
    engagement_score: 88
  },
  {
    id: 8,
    caption: "Cozy fall layers 🍂 Perfect for the changing season",
    media: ["/api/placeholder/440/600", "/api/placeholder/440/600"],
    author: {
      username: "autumn_lover",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#fallstyle", "#layers", "#cozy", "#autumn"],
    featured_products: [
      {
        id: 8,
        name: "Knit Sweater",
        price: 79.99,
        image: "/api/placeholder/200/200"
      }
    ],
    social_platform: "instagram",
    likes_count: 892,
    style_category: "casual",
    outfit_rating: 4.5,
    submission_date: "2024-01-09T14:15:00Z",
    is_approved: true,
    moderation_status: "approved",
    engagement_score: 91
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const platform = searchParams.get('platform');
    const approved = searchParams.get('approved') !== 'false'; // Default to approved only
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset') || '0';
    const sortBy = searchParams.get('sortBy') || 'submission_date'; // submission_date, likes_count, engagement_score

    // TODO: Replace with actual Strapi API call
    // const response = await fetch(`${process.env.STRAPI_URL}/api/user-generated-contents?populate=*`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
    //   }
    // });
    // const data = await response.json();

    let filteredUGC = [...mockUGC];

    // Apply filters
    if (approved) {
      filteredUGC = filteredUGC.filter(post => post.is_approved);
    }

    if (category && category !== 'all') {
      filteredUGC = filteredUGC.filter(post => post.style_category === category);
    }

    if (platform) {
      filteredUGC = filteredUGC.filter(post => post.social_platform === platform);
    }

    // Apply sorting
    filteredUGC.sort((a, b) => {
      switch (sortBy) {
        case 'likes_count':
          return b.likes_count - a.likes_count;
        case 'engagement_score':
          return b.engagement_score - a.engagement_score;
        case 'outfit_rating':
          return b.outfit_rating - a.outfit_rating;
        default: // submission_date
          return new Date(b.submission_date).getTime() - new Date(a.submission_date).getTime();
      }
    });

    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = limit ? startIndex + parseInt(limit) : filteredUGC.length;
    const paginatedUGC = filteredUGC.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedUGC,
      meta: {
        total: filteredUGC.length,
        offset: startIndex,
        limit: limit ? parseInt(limit) : filteredUGC.length,
        hasMore: endIndex < filteredUGC.length
      }
    });

  } catch (error) {
    console.error('Error fetching UGC:', error);
    return NextResponse.json(
      { error: 'Failed to fetch UGC content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Create new UGC post in Strapi
    // const response = await fetch(`${process.env.STRAPI_URL}/api/user-generated-contents`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
    //   },
    //   body: JSON.stringify({ data: body })
    // });

    // For now, return mock response
    const newUGCPost: UGCPost = {
      id: mockUGC.length + 1,
      ...body,
      likes_count: 0,
      is_approved: false,
      moderation_status: 'pending',
      engagement_score: 0,
      submission_date: new Date().toISOString()
    };

    return NextResponse.json({
      data: newUGCPost,
      message: 'UGC post submitted successfully and is pending moderation'
    });

  } catch (error) {
    console.error('Error creating UGC post:', error);
    return NextResponse.json(
      { error: 'Failed to submit UGC post' },
      { status: 500 }
    );
  }
}

// Like/unlike UGC post
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, action } = body; // action: 'like' | 'unlike'

    // TODO: Update likes in Strapi
    // const response = await fetch(`${process.env.STRAPI_URL}/api/user-generated-contents/${postId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
    //   },
    //   body: JSON.stringify({ data: updatedData })
    // });

    // For now, return mock response
    const post = mockUGC.find(p => p.id === postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const newLikesCount = action === 'like' ? post.likes_count + 1 : Math.max(0, post.likes_count - 1);
    post.likes_count = newLikesCount;

    return NextResponse.json({
      data: { likes_count: newLikesCount },
      message: `Post ${action}d successfully`
    });

  } catch (error) {
    console.error('Error updating UGC post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}
