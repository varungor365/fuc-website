// Instagram Basic Display API Integration Service
// This service handles fetching user posts, hashtag content, and media for UGC

interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  username?: string;
}

interface InstagramHashtagMedia {
  data: Array<{
    id: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    permalink: string;
    caption?: string;
    timestamp: string;
    like_count?: number;
    comments_count?: number;
  }>;
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

class InstagramService {
  private readonly baseUrl = 'https://graph.instagram.com';
  private readonly accessToken: string;

  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || '';
  }

  /**
   * Fetch recent media from a specific Instagram account
   */
  async fetchUserMedia(userId: string, limit: number = 25): Promise<InstagramMedia[]> {
    try {
      const url = `${this.baseUrl}/${userId}/media`;
      const params = new URLSearchParams({
        fields: 'id,media_type,media_url,permalink,caption,timestamp',
        limit: limit.toString(),
        access_token: this.accessToken
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Instagram user media:', error);
      return [];
    }
  }

  /**
   * Fetch posts by hashtag (requires Instagram Business account)
   */
  async fetchHashtagMedia(hashtag: string, limit: number = 25): Promise<InstagramHashtagMedia> {
    try {
      // First, get the hashtag ID
      const hashtagIdUrl = `${this.baseUrl}/ig_hashtag_search`;
      const hashtagParams = new URLSearchParams({
        user_id: process.env.INSTAGRAM_BUSINESS_USER_ID || '',
        q: hashtag,
        access_token: this.accessToken
      });

      const hashtagResponse = await fetch(`${hashtagIdUrl}?${hashtagParams}`);
      const hashtagData = await hashtagResponse.json();
      
      if (!hashtagData.data || hashtagData.data.length === 0) {
        return { data: [] };
      }

      const hashtagId = hashtagData.data[0].id;

      // Then fetch recent media for that hashtag
      const mediaUrl = `${this.baseUrl}/${hashtagId}/recent_media`;
      const mediaParams = new URLSearchParams({
        user_id: process.env.INSTAGRAM_BUSINESS_USER_ID || '',
        fields: 'id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count',
        limit: limit.toString(),
        access_token: this.accessToken
      });

      const mediaResponse = await fetch(`${mediaUrl}?${mediaParams}`);
      
      if (!mediaResponse.ok) {
        throw new Error(`Instagram API error: ${mediaResponse.statusText}`);
      }

      return await mediaResponse.json();
    } catch (error) {
      console.error('Error fetching Instagram hashtag media:', error);
      return { data: [] };
    }
  }

  /**
   * Fetch branded hashtag content (#fucfashion, #shopfuc, etc.)
   */
  async fetchBrandedContent(hashtags: string[] = ['fucfashion', 'shopfuc', 'fucstyle']): Promise<InstagramMedia[]> {
    const allMedia: InstagramMedia[] = [];

    for (const hashtag of hashtags) {
      const media = await this.fetchHashtagMedia(hashtag, 10);
      allMedia.push(...media.data.map(item => ({
        id: item.id,
        media_type: item.media_type,
        media_url: item.media_url,
        permalink: item.permalink,
        caption: item.caption,
        timestamp: item.timestamp
      })));
    }

    // Remove duplicates based on ID
    const uniqueMedia = allMedia.filter((media, index, self) => 
      index === self.findIndex(m => m.id === media.id)
    );

    // Sort by timestamp (newest first)
    return uniqueMedia.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Process Instagram media for UGC integration
   */
  async processMediaForUGC(media: InstagramMedia): Promise<any> {
    try {
      // Extract product mentions from caption
      const productMentions = this.extractProductMentions(media.caption || '');
      
      // Extract hashtags
      const hashtags = this.extractHashtags(media.caption || '');
      
      // Determine style category based on hashtags and caption
      const styleCategory = this.determineStyleCategory(hashtags, media.caption || '');

      return {
        external_id: media.id,
        caption: media.caption || '',
        media: [media.media_url],
        hashtags,
        social_platform: 'instagram',
        external_url: media.permalink,
        submission_date: media.timestamp,
        style_category: styleCategory,
        mentioned_products: productMentions,
        needs_moderation: true,
        engagement_score: 0 // Will be updated when we fetch detailed metrics
      };
    } catch (error) {
      console.error('Error processing media for UGC:', error);
      return null;
    }
  }

  /**
   * Extract product mentions from caption text
   */
  private extractProductMentions(caption: string): string[] {
    const mentions: string[] = [];
    
    // Look for common product keywords
    const productKeywords = [
      'hoodie', 'tee', 'shirt', 'pants', 'jeans', 'jacket', 'sweater',
      'dress', 'skirt', 'shorts', 'sneakers', 'boots', 'hat', 'cap'
    ];

    productKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(caption)) {
        mentions.push(keyword);
      }
    });

    return mentions;
  }

  /**
   * Extract hashtags from caption
   */
  private extractHashtags(caption: string): string[] {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = caption.match(hashtagRegex);
    return matches ? matches.map(tag => tag.toLowerCase()) : [];
  }

  /**
   * Determine style category based on content analysis
   */
  private determineStyleCategory(hashtags: string[], caption: string): string {
    const content = (hashtags.join(' ') + ' ' + caption).toLowerCase();

    if (content.includes('street') || content.includes('urban') || content.includes('casual')) {
      return 'street';
    }
    if (content.includes('formal') || content.includes('dress') || content.includes('suit')) {
      return 'formal';
    }
    if (content.includes('party') || content.includes('night') || content.includes('club')) {
      return 'party';
    }
    if (content.includes('workout') || content.includes('gym') || content.includes('athletic')) {
      return 'workout';
    }
    if (content.includes('vintage') || content.includes('retro') || content.includes('thrift')) {
      return 'vintage';
    }

    return 'casual'; // Default category
  }

  /**
   * Sync Instagram content to database
   */
  async syncInstagramContent(): Promise<any> {
    try {
      console.log('Starting Instagram content sync...');
      
      // Fetch branded content
      const brandedMedia = await this.fetchBrandedContent();
      
      const processedContent = [];
      
      for (const media of brandedMedia) {
        const ugcData = await this.processMediaForUGC(media);
        if (ugcData) {
          processedContent.push(ugcData);
        }
      }

      // TODO: Save to Strapi
      // for (const content of processedContent) {
      //   await fetch(`${process.env.STRAPI_URL}/api/user-generated-contents`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
      //     },
      //     body: JSON.stringify({ data: content })
      //   });
      // }

      console.log(`Synced ${processedContent.length} Instagram posts`);
      return {
        synced: processedContent.length,
        content: processedContent
      };

    } catch (error) {
      console.error('Error syncing Instagram content:', error);
      throw error;
    }
  }

  /**
   * Get Instagram embed code for a post
   */
  async getEmbedCode(postUrl: string): Promise<string> {
    try {
      const oEmbedUrl = `https://graph.facebook.com/v18.0/instagram_oembed`;
      const params = new URLSearchParams({
        url: postUrl,
        access_token: this.accessToken
      });

      const response = await fetch(`${oEmbedUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`oEmbed API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.html || '';
    } catch (error) {
      console.error('Error getting Instagram embed code:', error);
      return '';
    }
  }
}

export default InstagramService;

// Utility functions for Instagram integration
export const instagramUtils = {
  /**
   * Validate Instagram URL format
   */
  isValidInstagramUrl(url: string): boolean {
    const instagramUrlRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+\/?(\?.*)?$/;
    return instagramUrlRegex.test(url);
  },

  /**
   * Extract post ID from Instagram URL
   */
  extractPostId(url: string): string | null {
    const match = url.match(/\/p\/([A-Za-z0-9_-]+)\//);
    return match ? match[1] : null;
  },

  /**
   * Check if content is brand-appropriate
   */
  isBrandAppropriate(caption: string, hashtags: string[]): boolean {
    const content = (caption + ' ' + hashtags.join(' ')).toLowerCase();
    
    // Check for inappropriate content
    const inappropriateTerms = ['hate', 'violence', 'explicit', 'spam'];
    const hasInappropriate = inappropriateTerms.some(term => content.includes(term));
    
    // Check for brand mentions
    const brandTerms = ['fuc', 'fashun', '@fucfashion'];
    const hasBrandMention = brandTerms.some(term => content.includes(term));
    
    return !hasInappropriate && hasBrandMention;
  },

  /**
   * Calculate engagement score based on metrics
   */
  calculateEngagementScore(likes: number, comments: number, views?: number): number {
    const baseScore = likes + (comments * 2); // Comments weighted more
    const viewsMultiplier = views ? Math.min(views / 1000, 2) : 1;
    return Math.round(baseScore * viewsMultiplier);
  }
};
