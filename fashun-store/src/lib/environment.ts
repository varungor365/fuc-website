/**
 * Environment Configuration Management
 * Handles environment-specific settings and secrets management
 */

import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default('FASHUN.CO.IN'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
  
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.string().default('10').transform(Number),
  DATABASE_SSL: z.enum(['true', 'false']).default('true').transform((val: string) => val === 'true'),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  
  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  
  // Payment Processing
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  
  // Email Services
  RESEND_API_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  
  // Cloud Storage
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string().optional(),
  
  // CDN & Assets
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  // Analytics & Monitoring
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  
  // Performance Monitoring
  SPEEDCURVE_API_KEY: z.string().optional(),
  SPEEDCURVE_SITE_ID: z.string().optional(),
  
  // Redis Cache
  REDIS_URL: z.string().url().optional(),
  REDIS_PASSWORD: z.string().optional(),
  
  // Rate Limiting
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Feature Flags
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
  
  // Security
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(32),
  
  // AI Services
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // Search
  ALGOLIA_APP_ID: z.string().optional(),
  ALGOLIA_API_KEY: z.string().optional(),
  ALGOLIA_SEARCH_KEY: z.string().optional(),
});

// Environment-specific configurations
const environmentConfigs = {
  development: {
    // Development-specific settings
    LOG_LEVEL: 'debug',
    ENABLE_DEBUG: true,
    MOCK_PAYMENTS: true,
    MOCK_EMAIL: true,
    RATE_LIMIT_ENABLED: false,
    CACHE_TTL: 60, // 1 minute
    SESSION_MAX_AGE: 24 * 60 * 60, // 24 hours
  },
  staging: {
    // Staging-specific settings
    LOG_LEVEL: 'info',
    ENABLE_DEBUG: false,
    MOCK_PAYMENTS: false,
    MOCK_EMAIL: false,
    RATE_LIMIT_ENABLED: true,
    CACHE_TTL: 300, // 5 minutes
    SESSION_MAX_AGE: 8 * 60 * 60, // 8 hours
  },
  production: {
    // Production-specific settings
    LOG_LEVEL: 'warn',
    ENABLE_DEBUG: false,
    MOCK_PAYMENTS: false,
    MOCK_EMAIL: false,
    RATE_LIMIT_ENABLED: true,
    CACHE_TTL: 3600, // 1 hour
    SESSION_MAX_AGE: 4 * 60 * 60, // 4 hours
  },
};

class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: any;
  private environment: string;

  private constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.validateAndLoad();
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  private validateAndLoad(): void {
    try {
      // Validate environment variables
      const envVars = envSchema.parse(process.env);
      
      // Merge with environment-specific config
      const envConfig = environmentConfigs[this.environment as keyof typeof environmentConfigs] || environmentConfigs.development;
      
      this.config = {
        ...envVars,
        ...envConfig,
        ENVIRONMENT: this.environment,
        IS_DEVELOPMENT: this.environment === 'development',
        IS_STAGING: this.environment === 'staging',
        IS_PRODUCTION: this.environment === 'production',
        BUILD_TIME: new Date().toISOString(),
      };

      // Log configuration status (without sensitive data)
      console.log(`✅ Environment configuration loaded for: ${this.environment}`);
      console.log(`📦 App: ${this.config.NEXT_PUBLIC_APP_NAME} v${this.config.NEXT_PUBLIC_APP_VERSION}`);
      
    } catch (error) {
      console.error('❌ Environment configuration validation failed:', error);
      throw new Error('Invalid environment configuration');
    }
  }

  get<T = string>(key: string, defaultValue?: T): T {
    const value = this.config[key];
    if (value === undefined && defaultValue !== undefined) {
      return defaultValue;
    }
    if (value === undefined) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
  }

  getAll(): Record<string, any> {
    // Return copy without sensitive data for logging
    const safeCopy = { ...this.config };
    const sensitiveKeys = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'JWT_SECRET',
      'ENCRYPTION_KEY',
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
    ];
    
    sensitiveKeys.forEach(key => {
      if (safeCopy[key]) {
        safeCopy[key] = '[REDACTED]';
      }
    });
    
    return safeCopy;
  }

  isDevelopment(): boolean {
    return this.environment === 'development';
  }

  isStaging(): boolean {
    return this.environment === 'staging';
  }

  isProduction(): boolean {
    return this.environment === 'production';
  }

  getEnvironment(): string {
    return this.environment;
  }

  // Database configuration
  getDatabaseConfig() {
    return {
      url: this.get('DATABASE_URL'),
      poolSize: this.get('DATABASE_POOL_SIZE'),
      ssl: this.get('DATABASE_SSL'),
    };
  }

  // Payment configuration
  getPaymentConfig() {
    return {
      stripeSecretKey: this.get('STRIPE_SECRET_KEY'),
      stripePublishableKey: this.get('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
      stripeWebhookSecret: this.get('STRIPE_WEBHOOK_SECRET'),
      mockPayments: this.get('MOCK_PAYMENTS', false),
    };
  }

  // Cache configuration
  getCacheConfig() {
    return {
      redisUrl: this.get('REDIS_URL', null),
      ttl: this.get('CACHE_TTL', 300),
      enabled: !this.isDevelopment(),
    };
  }

  // Session configuration
  getSessionConfig() {
    return {
      secret: this.get('NEXTAUTH_SECRET'),
      maxAge: this.get('SESSION_MAX_AGE', 3600),
      secure: this.isProduction(),
      sameSite: this.isProduction() ? 'strict' : 'lax',
    };
  }

  // Security configuration
  getSecurityConfig() {
    return {
      jwtSecret: this.get('JWT_SECRET'),
      encryptionKey: this.get('ENCRYPTION_KEY'),
      rateLimitEnabled: this.get('RATE_LIMIT_ENABLED', true),
      corsOrigins: this.isProduction() 
        ? [this.get('NEXT_PUBLIC_APP_URL')]
        : ['http://localhost:3000', 'http://localhost:3001'],
    };
  }

  // Monitoring configuration
  getMonitoringConfig() {
    return {
      sentryDsn: this.get('SENTRY_DSN', null),
      googleAnalyticsId: this.get('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID', null),
      logLevel: this.get('LOG_LEVEL', 'info'),
      enableDebug: this.get('ENABLE_DEBUG', false),
    };
  }

  // Feature flags
  getFeatureFlags() {
    return {
      enableAI: this.get('OPENAI_API_KEY', null) !== null,
      enableSearch: this.get('ALGOLIA_APP_ID', null) !== null,
      enableCloudStorage: this.get('AWS_S3_BUCKET', null) !== null,
      enableRedis: this.get('REDIS_URL', null) !== null,
      enableAnalytics: this.get('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID', null) !== null,
    };
  }

  // Health check
  healthCheck(): Record<string, boolean> {
    const requiredForProduction = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'STRIPE_SECRET_KEY',
      'JWT_SECRET',
      'ENCRYPTION_KEY',
    ];

    const health: Record<string, boolean> = {};
    
    requiredForProduction.forEach(key => {
      health[key] = !!this.config[key];
    });

    return health;
  }

  // Configuration summary
  getSummary() {
    const featureFlags = this.getFeatureFlags();
    const health = this.healthCheck();
    
    return {
      environment: this.environment,
      version: this.get('NEXT_PUBLIC_APP_VERSION'),
      buildTime: this.get('BUILD_TIME'),
      features: featureFlags,
      health: Object.values(health).every(Boolean),
      healthDetails: health,
    };
  }
}

// Export singleton instance
export const env = EnvironmentManager.getInstance();

// Export types
export type EnvironmentConfig = z.infer<typeof envSchema>;

// Default export
export default env;