import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '12';
    
    // Get Instagram access token from environment variables
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      // Return mock data if no access token is provided
      return NextResponse.json({
        data: getMockInstagramData(parseInt(limit)),
        paging: {}
      });
    }

    // Fetch from Instagram Basic Display API
    const instagramUrl = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,timestamp&limit=${limit}&access_token=${accessToken}`;
    
    const response = await fetch(instagramUrl);
    
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Instagram API error:', error);
    
    // Return mock data as fallback
    return NextResponse.json({
      data: getMockInstagramData(12),
      paging: {}
    });
  }
}

function getMockInstagramData(limit: number) {
  const mockPosts = [
    {
      id: '1',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,streetwear,hoodie,1',
      permalink: 'https://instagram.com/p/mock1',
      caption: 'New streetwear collection dropping soon! 🔥 Premium hoodies that define your style. #FashUn #Streetwear #NewCollection',
      timestamp: '2024-01-15T10:30:00+0000'
    },
    {
      id: '2',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,tshirt,style,2',
      permalink: 'https://instagram.com/p/mock2',
      caption: 'Premium quality tees that speak your language ✨ Comfort meets style in every thread. #Fashion #Style #ComfortWear',
      timestamp: '2024-01-14T14:20:00+0000'
    },
    {
      id: '3',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,jacket,urban,3',
      permalink: 'https://instagram.com/p/mock3',
      caption: 'Urban vibes with our latest jacket collection 🧥 Perfect for the city life. #Urban #Fashion #JacketSeason',
      timestamp: '2024-01-13T16:45:00+0000'
    },
    {
      id: '4',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,jeans,denim,4',
      permalink: 'https://instagram.com/p/mock4',
      caption: 'Perfect fit, premium denim. What more do you need? 👖 Crafted for comfort and style. #Denim #Style #PerfectFit',
      timestamp: '2024-01-12T11:15:00+0000'
    },
    {
      id: '5',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,accessories,style,5',
      permalink: 'https://instagram.com/p/mock5',
      caption: 'Complete your look with our accessories collection 🎒 Details that make the difference. #Accessories #StyleDetails',
      timestamp: '2024-01-11T09:30:00+0000'
    },
    {
      id: '6',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,shoes,sneakers,6',
      permalink: 'https://instagram.com/p/mock6',
      caption: 'Step up your game with premium footwear 👟 Comfort that takes you places. #Shoes #Sneakers #FootwearFashion',
      timestamp: '2024-01-10T13:20:00+0000'
    },
    {
      id: '7',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,winter,coat,7',
      permalink: 'https://instagram.com/p/mock7',
      caption: 'Winter essentials that never go out of style ❄️ Stay warm, stay stylish. #WinterFashion #Essentials',
      timestamp: '2024-01-09T15:45:00+0000'
    },
    {
      id: '8',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,summer,casual,8',
      permalink: 'https://instagram.com/p/mock8',
      caption: 'Summer vibes all year round ☀️ Light, breezy, and effortlessly cool. #SummerStyle #CasualWear',
      timestamp: '2024-01-08T12:10:00+0000'
    },
    {
      id: '9',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,formal,shirt,9',
      permalink: 'https://instagram.com/p/mock9',
      caption: 'Elevate your formal game 👔 Professional looks that make an impact. #FormalWear #Professional',
      timestamp: '2024-01-07T10:25:00+0000'
    },
    {
      id: '10',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,sport,athletic,10',
      permalink: 'https://instagram.com/p/mock10',
      caption: 'Active lifestyle, premium gear 💪 Performance meets style. #Activewear #Fitness #SportStyle',
      timestamp: '2024-01-06T17:30:00+0000'
    },
    {
      id: '11',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,vintage,retro,11',
      permalink: 'https://instagram.com/p/mock11',
      caption: 'Vintage vibes, modern comfort 🕰️ Timeless pieces for the modern wardrobe. #Vintage #RetroStyle',
      timestamp: '2024-01-05T14:15:00+0000'
    },
    {
      id: '12',
      media_type: 'IMAGE',
      media_url: 'https://source.unsplash.com/400x400/?fashion,minimalist,clean,12',
      permalink: 'https://instagram.com/p/mock12',
      caption: 'Less is more. Minimalist fashion for maximum impact ⚡ Clean lines, perfect fits. #Minimalist #CleanStyle',
      timestamp: '2024-01-04T11:40:00+0000'
    }
  ];

  return mockPosts.slice(0, limit);
}