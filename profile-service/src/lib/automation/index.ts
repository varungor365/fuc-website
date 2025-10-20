/**
 * Backend Automation System
 * Handles automated QR generation, profile creation, and phygital item management
 */

import { createClient } from '@supabase/supabase-js';
import QRCodeStyling from 'qr-code-styling';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AutomationConfig {
  qrCodeGeneration: boolean;
  profileAutoCreation: boolean;
  phygitalOrderProcessing: boolean;
  analyticsTracking: boolean;
}

export interface PhygitalOrder {
  orderId: string;
  customerId: string;
  productId: string;
  customerEmail: string;
  customerName: string;
  productName: string;
  orderTotal: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface QRGenerationRequest {
  userId: string;
  profileUrl: string;
  customSettings?: any;
  urgentGeneration?: boolean;
}

export interface ProfileCreationData {
  userId: string;
  email: string;
  username: string;
  displayName: string;
  theme: 'minimalist' | 'vibrant' | 'dark';
  autoGenerateQR: boolean;
}

/**
 * Automated QR Code Generation System
 */
export class QRAutomationService {
  private static instance: QRAutomationService;

  static getInstance(): QRAutomationService {
    if (!QRAutomationService.instance) {
      QRAutomationService.instance = new QRAutomationService();
    }
    return QRAutomationService.instance;
  }

  /**
   * Generate QR code automatically for new users
   */
  async generateAutomaticQR(request: QRGenerationRequest): Promise<string | null> {
    try {
      console.log(`🤖 [QR Automation] Generating QR for user: ${request.userId}`);

      // Get user's custom QR settings or use defaults
      const { data: qrSettings, error: settingsError } = await supabase
        .from('qr_settings')
        .select('*')
        .eq('user_id', request.userId)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching QR settings:', settingsError);
      }

      // Default QR configuration
      const defaultConfig: any = {
        type: 'svg',
        width: 512,
        height: 512,
        data: request.profileUrl,
        margin: 10,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: 'M'
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 5
        },
        dotsOptions: {
          color: qrSettings?.dot_color || '#6366f1',
          type: qrSettings?.dot_style || 'rounded'
        },
        backgroundOptions: {
          color: qrSettings?.background_color || '#ffffff'
        },
        cornersSquareOptions: {
          color: qrSettings?.corner_color || '#1f2937',
          type: qrSettings?.corner_style || 'extra-rounded'
        },
        cornersDotOptions: {
          color: qrSettings?.corner_dot_color || '#1f2937',
          type: qrSettings?.corner_dot_style || 'dot'
        }
      };

      // Create QR code
      const qrCode = new QRCodeStyling(defaultConfig);
      
      // Generate SVG data
      const svgData = await new Promise<string>((resolve, reject) => {
        qrCode.getRawData('svg').then((blob) => {
          if (!blob) {
            reject(new Error('Failed to generate QR code'));
            return;
          }
          
          // Handle both Blob and Buffer types
          if (blob instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(blob);
          } else {
            // Handle Buffer type
            resolve(blob.toString());
          }
        });
      });

      // Upload to Supabase Storage
      const fileName = `qr-codes/${request.userId}/auto-generated-${Date.now()}.svg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('qr-codes')
        .upload(fileName, svgData, {
          contentType: 'image/svg+xml',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading QR code:', uploadError);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('qr-codes')
        .getPublicUrl(fileName);

      // Update user profile with QR URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          qr_code_url: urlData.publicUrl,
          qr_auto_generated: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.userId);

      if (updateError) {
        console.error('Error updating profile with QR URL:', updateError);
      }

      console.log(`✅ [QR Automation] QR generated successfully: ${urlData.publicUrl}`);
      return urlData.publicUrl;

    } catch (error) {
      console.error('❌ [QR Automation] Error generating QR:', error);
      return null;
    }
  }

  /**
   * Batch generate QR codes for multiple users
   */
  async batchGenerateQRCodes(requests: QRGenerationRequest[]): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    
    console.log(`🤖 [QR Automation] Starting batch generation for ${requests.length} users`);

    // Process in chunks to avoid overwhelming the system
    const chunkSize = 5;
    for (let i = 0; i < requests.length; i += chunkSize) {
      const chunk = requests.slice(i, i + chunkSize);
      
      const promises = chunk.map(async (request) => {
        const qrUrl = await this.generateAutomaticQR(request);
        if (qrUrl) {
          results.set(request.userId, qrUrl);
        }
      });

      await Promise.all(promises);
      
      // Small delay between chunks
      if (i + chunkSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`✅ [QR Automation] Batch generation complete: ${results.size}/${requests.length} successful`);
    return results;
  }
}

/**
 * Automated Profile Creation System
 */
export class ProfileAutomationService {
  private static instance: ProfileAutomationService;

  static getInstance(): ProfileAutomationService {
    if (!ProfileAutomationService.instance) {
      ProfileAutomationService.instance = new ProfileAutomationService();
    }
    return ProfileAutomationService.instance;
  }

  /**
   * Create profile automatically for new users
   */
  async createAutomaticProfile(data: ProfileCreationData): Promise<boolean> {
    try {
      console.log(`🤖 [Profile Automation] Creating profile for user: ${data.username}`);

      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.userId)
        .single();

      if (existingProfile) {
        console.log(`⚠️ [Profile Automation] Profile already exists for user: ${data.userId}`);
        return true;
      }

      // Create new profile
      const profileData = {
        id: data.userId,
        username: data.username,
        display_name: data.displayName,
        email: data.email,
        theme: data.theme,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile_completed: false,
        auto_created: true
      };

      const { error: insertError } = await supabase
        .from('profiles')
        .insert(profileData);

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return false;
      }

      // Generate QR code if requested
      if (data.autoGenerateQR) {
        const qrService = QRAutomationService.getInstance();
        const profileUrl = `https://p.fashun.co.in/${data.username}`;
        
        await qrService.generateAutomaticQR({
          userId: data.userId,
          profileUrl,
          urgentGeneration: true
        });
      }

      // Initialize default settings
      await this.initializeDefaultSettings(data.userId, data.theme);

      console.log(`✅ [Profile Automation] Profile created successfully for: ${data.username}`);
      return true;

    } catch (error) {
      console.error('❌ [Profile Automation] Error creating profile:', error);
      return false;
    }
  }

  /**
   * Initialize default settings for new profiles
   */
  private async initializeDefaultSettings(userId: string, theme: string): Promise<void> {
    try {
      // Default QR settings based on theme
      const themeSettings = {
        minimalist: {
          dot_color: '#1f2937',
          background_color: '#ffffff',
          corner_color: '#374151',
          corner_dot_color: '#6b7280'
        },
        vibrant: {
          dot_color: '#7c3aed',
          background_color: '#fef7ff',
          corner_color: '#a855f7',
          corner_dot_color: '#c084fc'
        },
        dark: {
          dot_color: '#6366f1',
          background_color: '#0f172a',
          corner_color: '#3730a3',
          corner_dot_color: '#4f46e5'
        }
      };

      const settings = themeSettings[theme as keyof typeof themeSettings] || themeSettings.minimalist;

      // Insert default QR settings
      await supabase
        .from('qr_settings')
        .insert({
          user_id: userId,
          ...settings,
          dot_style: 'rounded',
          corner_style: 'extra-rounded',
          corner_dot_style: 'dot',
          logo_url: null,
          created_at: new Date().toISOString()
        });

      // Initialize analytics
      await supabase
        .from('profile_analytics')
        .insert({
          user_id: userId,
          total_views: 0,
          total_clicks: 0,
          qr_scans: 0,
          created_at: new Date().toISOString()
        });

      console.log(`✅ [Profile Automation] Default settings initialized for user: ${userId}`);

    } catch (error) {
      console.error('❌ [Profile Automation] Error initializing settings:', error);
    }
  }
}

/**
 * Phygital Order Processing Automation
 */
export class PhygitalAutomationService {
  private static instance: PhygitalAutomationService;

  static getInstance(): PhygitalAutomationService {
    if (!PhygitalAutomationService.instance) {
      PhygitalAutomationService.instance = new PhygitalAutomationService();
    }
    return PhygitalAutomationService.instance;
  }

  /**
   * Process phygital order automatically
   */
  async processPhygitalOrder(order: PhygitalOrder): Promise<boolean> {
    try {
      console.log(`🤖 [Phygital Automation] Processing order: ${order.orderId}`);

      // Check if customer has a profile
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', order.customerEmail)
        .single();

      // Auto-create profile if it doesn't exist
      if (!profile && profileError?.code === 'PGRST116') {
        console.log(`🤖 [Phygital Automation] Creating profile for new customer: ${order.customerEmail}`);
        
        const profileService = ProfileAutomationService.getInstance();
        const username = this.generateUsername(order.customerName, order.customerId);
        
        const success = await profileService.createAutomaticProfile({
          userId: order.customerId,
          email: order.customerEmail,
          username,
          displayName: order.customerName,
          theme: 'vibrant',
          autoGenerateQR: true
        });

        if (success) {
          // Fetch the newly created profile
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', order.customerId)
            .single();
          
          profile = newProfile;
        }
      }

      if (!profile) {
        console.error('❌ [Phygital Automation] Could not create/find profile for customer');
        return false;
      }

      // Record the phygital order
      const { error: orderError } = await supabase
        .from('phygital_orders')
        .insert({
          id: order.orderId,
          user_id: profile.id,
          product_id: order.productId,
          product_name: order.productName,
          order_total: order.orderTotal,
          status: 'completed',
          created_at: order.timestamp.toISOString(),
          metadata: order.metadata || {}
        });

      if (orderError) {
        console.error('Error recording phygital order:', orderError);
        return false;
      }

      // Add item to virtual closet
      await this.addToVirtualCloset(profile.id, order);

      // Send notification email (would integrate with email service)
      await this.sendPhygitalWelcomeEmail(order, profile);

      console.log(`✅ [Phygital Automation] Order processed successfully: ${order.orderId}`);
      return true;

    } catch (error) {
      console.error('❌ [Phygital Automation] Error processing order:', error);
      return false;
    }
  }

  /**
   * Add purchased item to virtual closet
   */
  private async addToVirtualCloset(userId: string, order: PhygitalOrder): Promise<void> {
    try {
      // This would typically fetch product details from the main store
      // For now, we'll create a basic closet entry
      const closetItem = {
        user_id: userId,
        order_id: order.orderId,
        product_id: order.productId,
        product_name: order.productName,
        price: order.orderTotal,
        purchase_date: order.timestamp.toISOString(),
        wear_count: 0,
        is_favorite: false,
        rarity: this.determineRarity(order.orderTotal),
        created_at: new Date().toISOString()
      };

      await supabase
        .from('virtual_closet')
        .insert(closetItem);

      console.log(`✅ [Phygital Automation] Item added to virtual closet: ${order.productName}`);

    } catch (error) {
      console.error('❌ [Phygital Automation] Error adding to virtual closet:', error);
    }
  }

  /**
   * Determine item rarity based on price
   */
  private determineRarity(price: number): string {
    if (price >= 200) return 'legendary';
    if (price >= 150) return 'epic';
    if (price >= 100) return 'rare';
    return 'common';
  }

  /**
   * Generate username from customer name and ID
   */
  private generateUsername(name: string, id: string): string {
    const cleanName = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
    
    const shortId = id.substring(0, 6);
    return `${cleanName}_${shortId}`;
  }

  /**
   * Send welcome email for phygital purchase
   */
  private async sendPhygitalWelcomeEmail(order: PhygitalOrder, profile: any): Promise<void> {
    try {
      // This would integrate with your email service (SendGrid, Resend, etc.)
      console.log(`📧 [Phygital Automation] Would send welcome email to: ${order.customerEmail}`);
      console.log(`Profile URL: https://p.fashun.co.in/${profile.username}`);
      
      // Record email sent
      await supabase
        .from('automation_logs')
        .insert({
          type: 'email_sent',
          user_id: profile.id,
          details: {
            email_type: 'phygital_welcome',
            recipient: order.customerEmail,
            order_id: order.orderId
          },
          created_at: new Date().toISOString()
        });

    } catch (error) {
      console.error('❌ [Phygital Automation] Error sending email:', error);
    }
  }
}

/**
 * Main Automation Controller
 */
export class AutomationController {
  private qrService: QRAutomationService;
  private profileService: ProfileAutomationService;
  private phygitalService: PhygitalAutomationService;
  private config: AutomationConfig;

  constructor(config: AutomationConfig) {
    this.config = config;
    this.qrService = QRAutomationService.getInstance();
    this.profileService = ProfileAutomationService.getInstance();
    this.phygitalService = PhygitalAutomationService.getInstance();
  }

  /**
   * Process webhook from main store
   */
  async processWebhook(type: string, payload: any): Promise<boolean> {
    try {
      console.log(`🤖 [Automation] Processing webhook: ${type}`);

      switch (type) {
        case 'order.completed':
          if (this.config.phygitalOrderProcessing && payload.items?.some((item: any) => item.phygital)) {
            return await this.phygitalService.processPhygitalOrder({
              orderId: payload.id,
              customerId: payload.customer_id,
              productId: payload.items[0].product_id,
              customerEmail: payload.customer.email,
              customerName: payload.customer.name,
              productName: payload.items[0].name,
              orderTotal: payload.total,
              timestamp: new Date(payload.created_at),
              metadata: payload.metadata
            });
          }
          break;

        case 'customer.created':
          if (this.config.profileAutoCreation) {
            return await this.profileService.createAutomaticProfile({
              userId: payload.id,
              email: payload.email,
              username: payload.username || this.generateUsername(payload.name, payload.id),
              displayName: payload.name,
              theme: 'vibrant',
              autoGenerateQR: this.config.qrCodeGeneration
            });
          }
          break;

        case 'profile.qr_requested':
          if (this.config.qrCodeGeneration) {
            const qrUrl = await this.qrService.generateAutomaticQR({
              userId: payload.user_id,
              profileUrl: `https://p.fashun.co.in/${payload.username}`,
              customSettings: payload.settings,
              urgentGeneration: true
            });
            return !!qrUrl;
          }
          break;

        default:
          console.log(`⚠️ [Automation] Unknown webhook type: ${type}`);
          return false;
      }

      return true;

    } catch (error) {
      console.error('❌ [Automation] Error processing webhook:', error);
      return false;
    }
  }

  /**
   * Generate username helper
   */
  private generateUsername(name: string, id: string): string {
    const cleanName = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
    
    const shortId = id.substring(0, 6);
    return `${cleanName}_${shortId}`;
  }

  /**
   * Get automation statistics
   */
  async getAutomationStats(): Promise<any> {
    try {
      const { data: logs, error } = await supabase
        .from('automation_logs')
        .select('type, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching automation stats:', error);
        return null;
      }

      const stats = logs.reduce((acc: any, log: any) => {
        acc[log.type] = (acc[log.type] || 0) + 1;
        return acc;
      }, {});

      return {
        last24Hours: stats,
        totalProcessed: logs.length,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error calculating automation stats:', error);
      return null;
    }
  }
}

// Export default configuration
export const defaultAutomationConfig: AutomationConfig = {
  qrCodeGeneration: true,
  profileAutoCreation: true,
  phygitalOrderProcessing: true,
  analyticsTracking: true
};