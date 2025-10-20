/**
 * Rich Media Embeds System
 * Comprehensive multimedia support for user profiles
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface MediaItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  media_type: 'video' | 'audio' | 'document' | 'image' | 'gallery' | 'interactive';
  media_url: string;
  thumbnail_url?: string;
  file_size?: number;
  duration?: number;
  mime_type?: string;
  metadata: Record<string, any>;
  is_featured: boolean;
  display_order: number;
  visibility: 'public' | 'private' | 'unlisted';
  created_at: Date;
  updated_at: Date;
}

export interface MediaGallery {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  media_items: string[]; // Array of media item IDs
  layout_type: 'grid' | 'carousel' | 'masonry' | 'timeline';
  display_order: number;
  is_featured: boolean;
  created_at: Date;
}

export interface InteractiveEmbed {
  id: string;
  user_id: string;
  title: string;
  embed_type: 'calendar' | 'form' | 'poll' | 'widget' | 'iframe';
  embed_code: string;
  configuration: Record<string, any>;
  display_order: number;
  is_active: boolean;
}

/**
 * Media Management Service
 */
export class MediaService {
  private static instance: MediaService;

  static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  /**
   * Upload media file
   */
  async uploadMedia(
    userId: string,
    file: File,
    title: string,
    description?: string,
    metadata: Record<string, any> = {}
  ): Promise<MediaItem | null> {
    try {
      console.log(`📁 [Media] Uploading file: ${file.name} for user: ${userId}`);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `media/${userId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media-files')
        .getPublicUrl(filePath);

      // Determine media type
      const mediaType = this.getMediaType(file.type);

      // Generate thumbnail for videos and images
      const thumbnailUrl = await this.generateThumbnail(file, urlData.publicUrl, mediaType);

      // Extract additional metadata
      const enrichedMetadata = await this.extractMetadata(file, metadata);

      // Create media record
      const mediaItem: Partial<MediaItem> = {
        user_id: userId,
        title,
        description,
        media_type: mediaType,
        media_url: urlData.publicUrl,
        thumbnail_url: thumbnailUrl,
        file_size: file.size,
        mime_type: file.type,
        metadata: enrichedMetadata,
        is_featured: false,
        display_order: await this.getNextDisplayOrder(userId),
        visibility: 'public'
      };

      // Insert into database
      const { data, error } = await supabase
        .from('media_items')
        .insert(mediaItem)
        .select()
        .single();

      if (error) {
        console.error('Error creating media record:', error);
        return null;
      }

      console.log(`✅ [Media] File uploaded successfully: ${data.id}`);
      return data;

    } catch (error) {
      console.error('❌ [Media] Error uploading media:', error);
      return null;
    }
  }

  /**
   * Get media type from MIME type
   */
  private getMediaType(mimeType: string): MediaItem['media_type'] {
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return 'document';
    }
    return 'document';
  }

  /**
   * Generate thumbnail for media
   */
  private async generateThumbnail(
    file: File,
    mediaUrl: string,
    mediaType: MediaItem['media_type']
  ): Promise<string | undefined> {
    try {
      if (mediaType === 'image') {
        // For images, use the image itself as thumbnail (could resize in production)
        return mediaUrl;
      }

      if (mediaType === 'video') {
        // In production, use a video thumbnail generation service
        // For demo, return a placeholder
        return '/api/media/thumbnail/video-placeholder.jpg';
      }

      if (mediaType === 'audio') {
        return '/api/media/thumbnail/audio-placeholder.jpg';
      }

      if (mediaType === 'document') {
        return '/api/media/thumbnail/document-placeholder.jpg';
      }

      return undefined;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return undefined;
    }
  }

  /**
   * Extract metadata from file
   */
  private async extractMetadata(file: File, userMetadata: Record<string, any>): Promise<Record<string, any>> {
    const metadata = { ...userMetadata };

    try {
      // Basic file metadata
      metadata.originalName = file.name;
      metadata.fileSize = file.size;
      metadata.lastModified = file.lastModified;
      metadata.uploadedAt = new Date().toISOString();

      // For videos, extract duration (in production, use a library like ffprobe)
      if (file.type.startsWith('video/')) {
        metadata.duration = await this.getVideoDuration(file);
      }

      // For audio, extract duration and metadata
      if (file.type.startsWith('audio/')) {
        metadata.duration = await this.getAudioDuration(file);
      }

      // For images, extract dimensions
      if (file.type.startsWith('image/')) {
        metadata.dimensions = await this.getImageDimensions(file);
      }

      return metadata;
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return metadata;
    }
  }

  /**
   * Get video duration
   */
  private async getVideoDuration(file: File): Promise<number | undefined> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      
      video.onerror = () => {
        resolve(undefined);
      };
      
      video.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get audio duration
   */
  private async getAudioDuration(file: File): Promise<number | undefined> {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
      
      audio.onerror = () => {
        resolve(undefined);
      };
      
      audio.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get image dimensions
   */
  private async getImageDimensions(file: File): Promise<{ width: number; height: number } | undefined> {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        resolve(undefined);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get next display order
   */
  private async getNextDisplayOrder(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('media_items')
      .select('display_order')
      .eq('user_id', userId)
      .order('display_order', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return 1;
    }

    return data[0].display_order + 1;
  }

  /**
   * Get user media items
   */
  async getUserMedia(userId: string): Promise<MediaItem[]> {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('user_id', userId)
        .eq('visibility', 'public')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching user media:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserMedia:', error);
      return [];
    }
  }

  /**
   * Update media item
   */
  async updateMedia(
    mediaId: string,
    updates: Partial<MediaItem>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('media_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', mediaId);

      if (error) {
        console.error('Error updating media:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateMedia:', error);
      return false;
    }
  }

  /**
   * Delete media item
   */
  async deleteMedia(mediaId: string): Promise<boolean> {
    try {
      // Get media item first to delete file
      const { data: mediaItem } = await supabase
        .from('media_items')
        .select('media_url, user_id')
        .eq('id', mediaId)
        .single();

      if (mediaItem) {
        // Extract file path from URL and delete from storage
        const urlParts = mediaItem.media_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `media/${mediaItem.user_id}/${fileName}`;

        await supabase.storage
          .from('media-files')
          .remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', mediaId);

      if (error) {
        console.error('Error deleting media:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteMedia:', error);
      return false;
    }
  }

  /**
   * Reorder media items
   */
  async reorderMedia(userId: string, mediaIds: string[]): Promise<boolean> {
    try {
      // Update display_order for each item
      const updates = mediaIds.map((id, index) => ({
        id,
        display_order: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('media_items')
          .update({ display_order: update.display_order })
          .eq('id', update.id)
          .eq('user_id', userId);
      }

      return true;
    } catch (error) {
      console.error('Error reordering media:', error);
      return false;
    }
  }
}

/**
 * Gallery Management Service
 */
export class GalleryService {
  private static instance: GalleryService;

  static getInstance(): GalleryService {
    if (!GalleryService.instance) {
      GalleryService.instance = new GalleryService();
    }
    return GalleryService.instance;
  }

  /**
   * Create media gallery
   */
  async createGallery(
    userId: string,
    title: string,
    description: string,
    mediaIds: string[],
    layoutType: MediaGallery['layout_type'] = 'grid'
  ): Promise<MediaGallery | null> {
    try {
      const gallery: Partial<MediaGallery> = {
        user_id: userId,
        title,
        description,
        media_items: mediaIds,
        layout_type: layoutType,
        display_order: await this.getNextDisplayOrder(userId),
        is_featured: false
      };

      const { data, error } = await supabase
        .from('media_galleries')
        .insert(gallery)
        .select()
        .single();

      if (error) {
        console.error('Error creating gallery:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createGallery:', error);
      return null;
    }
  }

  /**
   * Get user galleries
   */
  async getUserGalleries(userId: string): Promise<MediaGallery[]> {
    try {
      const { data, error } = await supabase
        .from('media_galleries')
        .select('*')
        .eq('user_id', userId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching galleries:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserGalleries:', error);
      return [];
    }
  }

  private async getNextDisplayOrder(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('media_galleries')
      .select('display_order')
      .eq('user_id', userId)
      .order('display_order', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return 1;
    }

    return data[0].display_order + 1;
  }
}

/**
 * Interactive Embeds Service
 */
export class InteractiveService {
  private static instance: InteractiveService;

  static getInstance(): InteractiveService {
    if (!InteractiveService.instance) {
      InteractiveService.instance = new InteractiveService();
    }
    return InteractiveService.instance;
  }

  /**
   * Create interactive embed
   */
  async createEmbed(
    userId: string,
    title: string,
    embedType: InteractiveEmbed['embed_type'],
    embedCode: string,
    configuration: Record<string, any> = {}
  ): Promise<InteractiveEmbed | null> {
    try {
      const embed: Partial<InteractiveEmbed> = {
        user_id: userId,
        title,
        embed_type: embedType,
        embed_code: embedCode,
        configuration,
        display_order: await this.getNextDisplayOrder(userId),
        is_active: true
      };

      const { data, error } = await supabase
        .from('interactive_embeds')
        .insert(embed)
        .select()
        .single();

      if (error) {
        console.error('Error creating embed:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createEmbed:', error);
      return null;
    }
  }

  /**
   * Get user embeds
   */
  async getUserEmbeds(userId: string): Promise<InteractiveEmbed[]> {
    try {
      const { data, error } = await supabase
        .from('interactive_embeds')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching embeds:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserEmbeds:', error);
      return [];
    }
  }

  private async getNextDisplayOrder(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('interactive_embeds')
      .select('display_order')
      .eq('user_id', userId)
      .order('display_order', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return 1;
    }

    return data[0].display_order + 1;
  }
}