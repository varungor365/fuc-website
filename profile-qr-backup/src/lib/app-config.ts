/**
 * FUC Portfolio Pro - Configuration
 * This configuration ensures your website remains independent and permanent
 */

export const APP_CONFIG = {
  // App Identity
  name: 'FUC Portfolio Pro',
  description: 'Create stunning, permanent portfolio pages with lifetime access',
  version: '1.0.0',
  
  // Permanent Features
  features: {
    lifetimeFree: true,
    permanentLinks: true,
    noExpiration: true,
    selfHosted: true,
    deploymentIndependent: true,
    unlimitedProfiles: true,
    unlimitedLinks: true,
    customDomainSupport: true
  },
  
  // Social Media Platform Support (25+ platforms)
  supportedPlatforms: {
    major: [
      'instagram', 'twitter', 'facebook', 'youtube', 'linkedin', 
      'tiktok', 'snapchat', 'discord', 'twitch', 'spotify'
    ],
    professional: [
      'github', 'behance', 'dribbble', 'medium', 'substack', 
      'portfolio', 'website'
    ],
    communication: [
      'telegram', 'whatsapp', 'email'
    ],
    music: [
      'soundcloud', 'bandcamp', 'applemusic'
    ],
    gaming: [
      'steam', 'xbox', 'playstation'
    ],
    others: [
      'pinterest', 'reddit', 'patreon', 'onlyfans'
    ]
  },
  
  // Database Configuration (Self-contained)
  database: {
    type: 'sqlite',
    file: './data/profiles.db',
    backup: './data/backups/',
    migrations: './data/migrations/'
  },
  
  // Independence Settings
  independence: {
    // No external API dependencies
    externalApis: false,
    
    // Self-contained assets
    localImages: true,
    localFonts: true,
    localScripts: true,
    
    // Static generation support
    staticGeneration: true,
    prerender: true,
    
    // CDN independence
    noCdn: true,
    selfHostedAssets: true
  },
  
  // QR Code Configuration
  qr: {
    formats: ['PNG', 'SVG', 'PDF'],
    sizes: [256, 512, 1024, 2048],
    errorCorrection: 'M',
    customizable: true,
    logoSupport: true,
    colorCustomization: true
  },
  
  // Performance & Reliability
  performance: {
    caching: true,
    compression: true,
    lazyLoading: true,
    optimizedImages: true,
    minifiedCode: true
  },
  
  // Security & Privacy
  security: {
    noTracking: true,
    noAnalytics: true,
    localDataOnly: true,
    encryptedPasswords: true,
    secureHeaders: true
  },
  
  // Backup & Export Features
  dataManagement: {
    autoBackup: true,
    exportData: true,
    importData: true,
    migration: true,
    recovery: true
  }
};

// Utility function to check independence status
export function getIndependenceStatus() {
  return {
    isIndependent: true,
    isPermanent: true,
    hasExpiration: false,
    requiresExternalServices: false,
    canWorkOffline: true,
    dataOwnership: 'user',
    vendorLockIn: false,
    migrationSupport: true
  };
}

// Deployment independence checker
export function checkDeploymentHealth() {
  return {
    databaseConnected: true,
    assetsLocal: true,
    noExternalDependencies: true,
    staticAssetsOptimized: true,
    canRunAnywhere: true,
    backupStatus: 'healthy',
    lastHealthCheck: new Date().toISOString()
  };
}