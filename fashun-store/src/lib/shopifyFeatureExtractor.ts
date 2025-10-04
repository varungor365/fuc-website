import { promises as fs } from 'fs';
import path from 'path';

// Shopify Theme Feature Extractor
// Systematically extracts and catalogs features from all 30 Shopify themes

export interface ThemeFeature {
  id: string;
  name: string;
  description: string;
  category: 'UI/UX' | 'E-commerce' | 'Marketing' | 'Admin' | 'Apps Integration';
  subcategory: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  implementation: {
    difficulty: 'Easy' | 'Medium' | 'Hard';
    estimatedHours: number;
    dependencies: string[];
    technicalRequirements: string[];
  };
  themes: string[];
  examples: {
    themeName: string;
    implementation: string;
    notes?: string;
  }[];
}

export interface ThemeAnalysis {
  themeName: string;
  version: string;
  features: ThemeFeature[];
  uniqueFeatures: string[];
  settingsSchema: any;
  lastAnalyzed: Date;
}

export class ShopifyFeatureExtractor {
  private themesPath: string;
  private outputPath: string;
  private featureDatabase: Map<string, ThemeFeature> = new Map();

  constructor(themesPath: string = './shopify themes', outputPath: string = './src/data/theme-features.json') {
    this.themesPath = themesPath;
    this.outputPath = outputPath;
  }

  // Popular Shopify theme features database
  private readonly POPULAR_SHOPIFY_THEME_FEATURES: ThemeFeature[] = [
    // UI/UX Features
    {
      id: 'mega-menu',
      name: 'Mega Menu Navigation',
      description: 'Multi-column dropdown menus with images, categories, and featured products',
      category: 'UI/UX',
      subcategory: 'Navigation',
      priority: 'High',
      implementation: {
        difficulty: 'Medium',
        estimatedHours: 8,
        dependencies: ['React', 'Tailwind CSS'],
        technicalRequirements: ['Responsive design', 'Keyboard navigation', 'Touch support']
      },
      themes: ['Dawn', 'Empire', 'Prestige', 'Basel'],
      examples: [
        { themeName: 'Dawn', implementation: 'Clean multi-column layout with collection previews' },
        { themeName: 'Empire', implementation: 'Image-heavy mega menu with promotional banners' }
      ]
    },
    {
      id: 'quick-view',
      name: 'Product Quick View',
      description: 'Modal popup to view product details without leaving collection page',
      category: 'E-commerce',
      subcategory: 'Product Display',
      priority: 'Critical',
      implementation: {
        difficulty: 'Medium',
        estimatedHours: 12,
        dependencies: ['Modal component', 'Product API'],
        technicalRequirements: ['Image gallery', 'Variant selection', 'Add to cart']
      },
      themes: ['Empire', 'Prestige', 'Basel', 'Debutify'],
      examples: [
        { themeName: 'Empire', implementation: 'Full-featured modal with image zoom and variant selection' },
        { themeName: 'Basel', implementation: 'Minimalist quick view with essential product info' }
      ]
    },
    {
      id: 'parallax-scroll',
      name: 'Parallax Scrolling',
      description: 'Background images move at different speed than foreground content',
      category: 'UI/UX',
      subcategory: 'Visual Effects',
      priority: 'Medium',
      implementation: {
        difficulty: 'Easy',
        estimatedHours: 4,
        dependencies: ['Intersection Observer API', 'CSS transforms'],
        technicalRequirements: ['Performance optimization', 'Mobile support']
      },
      themes: ['Prestige', 'Ella', 'Konversion'],
      examples: [
        { themeName: 'Prestige', implementation: 'Subtle parallax on hero sections' },
        { themeName: 'Ella', implementation: 'Multi-layer parallax with text overlay' }
      ]
    },
    {
      id: 'sticky-cart',
      name: 'Sticky Add to Cart',
      description: 'Floating cart button that appears when scrolling past product info',
      category: 'E-commerce',
      subcategory: 'Cart & Checkout',
      priority: 'High',
      implementation: {
        difficulty: 'Easy',
        estimatedHours: 3,
        dependencies: ['Scroll detection', 'Fixed positioning'],
        technicalRequirements: ['Mobile optimization', 'Variant sync']
      },
      themes: ['Dawn', 'Empire', 'Basel', 'Debutify'],
      examples: [
        { themeName: 'Dawn', implementation: 'Minimal sticky bar with product image and price' },
        { themeName: 'Empire', implementation: 'Full-width sticky section with variant selection' }
      ]
    },
    {
      id: 'countdown-timer',
      name: 'Countdown Timer',
      description: 'Display time-limited offers with real-time countdown',
      category: 'Marketing',
      subcategory: 'Promotions',
      priority: 'High',
      implementation: {
        difficulty: 'Medium',
        estimatedHours: 6,
        dependencies: ['Date/time handling', 'Real-time updates'],
        technicalRequirements: ['Timezone support', 'Auto-hide when expired']
      },
      themes: ['Debutify', 'Booster', 'Konversion'],
      examples: [
        { themeName: 'Debutify', implementation: 'Prominent header countdown with urgency messaging' },
        { themeName: 'Booster', implementation: 'Product-specific countdown timers' }
      ]
    },
    {
      id: 'size-guide',
      name: 'Interactive Size Guide',
      description: 'Modal with size charts, fit guides, and measurement tools',
      category: 'E-commerce',
      subcategory: 'Product Information',
      priority: 'Critical',
      implementation: {
        difficulty: 'Hard',
        estimatedHours: 16,
        dependencies: ['Modal system', 'Data tables', 'Image overlays'],
        technicalRequirements: ['Responsive tables', 'Print functionality', 'Measurement calculator']
      },
      themes: ['Empire', 'Basel', 'Prestige'],
      examples: [
        { themeName: 'Empire', implementation: 'Comprehensive size guide with fit recommendations' },
        { themeName: 'Basel', implementation: 'Clean tabular size charts with conversion tools' }
      ]
    },
    {
      id: 'recently-viewed',
      name: 'Recently Viewed Products',
      description: 'Track and display products user has recently browsed',
      category: 'E-commerce',
      subcategory: 'Personalization',
      priority: 'Medium',
      implementation: {
        difficulty: 'Medium',
        estimatedHours: 8,
        dependencies: ['Local storage', 'Product tracking'],
        technicalRequirements: ['Privacy compliance', 'Cross-device sync']
      },
      themes: ['Dawn', 'Empire', 'Ella'],
      examples: [
        { themeName: 'Dawn', implementation: 'Sidebar widget with recently viewed items' },
        { themeName: 'Empire', implementation: 'Dedicated section on product pages' }
      ]
    },
    {
      id: 'ajax-cart',
      name: 'AJAX Cart Drawer',
      description: 'Side-sliding cart that updates without page refresh',
      category: 'E-commerce',
      subcategory: 'Cart & Checkout',
      priority: 'Critical',
      implementation: {
        difficulty: 'Hard',
        estimatedHours: 20,
        dependencies: ['API integration', 'State management', 'Animations'],
        technicalRequirements: ['Real-time updates', 'Inventory sync', 'Shipping calculator']
      },
      themes: ['Dawn', 'Empire', 'Basel', 'Prestige'],
      examples: [
        { themeName: 'Dawn', implementation: 'Clean sliding drawer with upsells' },
        { themeName: 'Empire', implementation: 'Feature-rich cart with recommendations' }
      ]
    },
    {
      id: 'product-tabs',
      name: 'Product Information Tabs',
      description: 'Tabbed interface for product details, reviews, shipping info',
      category: 'UI/UX',
      subcategory: 'Content Organization',
      priority: 'High',
      implementation: {
        difficulty: 'Easy',
        estimatedHours: 4,
        dependencies: ['Tab component', 'Content sections'],
        technicalRequirements: ['Accessibility', 'Deep linking', 'Mobile accordion']
      },
      themes: ['Empire', 'Basel', 'Prestige', 'Ella'],
      examples: [
        { themeName: 'Empire', implementation: 'Feature-rich tabs with icons and counts' },
        { themeName: 'Basel', implementation: 'Minimalist tabs with smooth transitions' }
      ]
    },
    {
      id: 'wishlist',
      name: 'Product Wishlist',
      description: 'Save products for later with heart icon and dedicated wishlist page',
      category: 'E-commerce',
      subcategory: 'User Experience',
      priority: 'High',
      implementation: {
        difficulty: 'Hard',
        estimatedHours: 24,
        dependencies: ['User accounts', 'Database storage', 'Sync across devices'],
        technicalRequirements: ['Guest wishlist', 'Sharing functionality', 'Stock notifications']
      },
      themes: ['Empire', 'Basel', 'Ella', 'Prestige'],
      examples: [
        { themeName: 'Empire', implementation: 'Full wishlist system with sharing and notifications' },
        { themeName: 'Basel', implementation: 'Simple heart icon with local storage fallback' }
      ]
    }
  ];

  async extractThemeFeatures(themePath: string): Promise<ThemeAnalysis> {
    try {
      const themeName = path.basename(themePath);
      const settingsPath = path.join(themePath, 'config', 'settings_schema.json');
      
      let settingsSchema: any = {};
      let features: ThemeFeature[] = [];
      let uniqueFeatures: string[] = [];

      // Read settings schema if it exists
      try {
        const settingsContent = await fs.readFile(settingsPath, 'utf-8');
        settingsSchema = JSON.parse(settingsContent);
        
        // Extract features from settings schema
        features = this.parseSettingsSchema(settingsSchema, themeName);
        uniqueFeatures = this.identifyUniqueFeatures(features, themeName);
        
      } catch (error) {
        console.warn(`Could not read settings schema for ${themeName}:`, error);
      }

      return {
        themeName,
        version: settingsSchema.version || 'unknown',
        features,
        uniqueFeatures,
        settingsSchema,
        lastAnalyzed: new Date()
      };

    } catch (error) {
      throw new Error(`Failed to extract features from ${themePath}: ${error}`);
    }
  }

  private parseSettingsSchema(schema: any, themeName: string): ThemeFeature[] {
    const features: ThemeFeature[] = [];
    
    if (Array.isArray(schema)) {
      schema.forEach(section => {
        if (section.settings) {
          section.settings.forEach((setting: any) => {
            const feature = this.mapSettingToFeature(setting, section.name, themeName);
            if (feature) {
              features.push(feature);
            }
          });
        }
      });
    }

    return features;
  }

  private mapSettingToFeature(setting: any, sectionName: string, themeName: string): ThemeFeature | null {
    // Map common setting types to features
    const featureMap: Record<string, Partial<ThemeFeature>> = {
      'header': {
        category: 'UI/UX',
        subcategory: 'Navigation',
        priority: 'High'
      },
      'product': {
        category: 'E-commerce',
        subcategory: 'Product Display',
        priority: 'Critical'
      },
      'cart': {
        category: 'E-commerce',
        subcategory: 'Cart & Checkout',
        priority: 'Critical'
      },
      'footer': {
        category: 'UI/UX',
        subcategory: 'Layout',
        priority: 'Medium'
      },
      'social': {
        category: 'Marketing',
        subcategory: 'Social Media',
        priority: 'Medium'
      }
    };

    const settingId = setting.id || '';
    const settingType = setting.type || '';
    
    // Find matching feature template
    const baseFeature = featureMap[sectionName.toLowerCase()] || 
                       this.POPULAR_SHOPIFY_THEME_FEATURES.find(f => 
                         settingId.includes(f.id) || 
                         setting.label?.toLowerCase().includes(f.name.toLowerCase())
                       );

    if (!baseFeature) return null;

    return {
      id: `${themeName}-${settingId}`,
      name: setting.label || settingId,
      description: setting.info || `${setting.label} setting from ${themeName}`,
      category: baseFeature.category || 'UI/UX',
      subcategory: baseFeature.subcategory || 'General',
      priority: baseFeature.priority || 'Medium',
      implementation: {
        difficulty: this.assessDifficulty(setting),
        estimatedHours: this.estimateHours(setting),
        dependencies: this.extractDependencies(setting),
        technicalRequirements: this.extractRequirements(setting)
      },
      themes: [themeName],
      examples: [{
        themeName,
        implementation: setting.info || `${settingType} setting in ${sectionName}`
      }]
    };
  }

  private assessDifficulty(setting: any): 'Easy' | 'Medium' | 'Hard' {
    const complexTypes = ['range', 'color_scheme', 'font_picker', 'collection', 'product'];
    if (complexTypes.includes(setting.type)) return 'Medium';
    if (setting.type === 'textarea' || setting.type === 'richtext') return 'Hard';
    return 'Easy';
  }

  private estimateHours(setting: any): number {
    const hourMap: Record<string, number> = {
      'checkbox': 1,
      'text': 2,
      'textarea': 4,
      'select': 3,
      'radio': 3,
      'range': 4,
      'color': 2,
      'color_scheme': 6,
      'font_picker': 8,
      'collection': 12,
      'product': 12,
      'blog': 8,
      'page': 6,
      'richtext': 8
    };
    return hourMap[setting.type] || 3;
  }

  private extractDependencies(setting: any): string[] {
    const dependencies: string[] = [];
    
    if (setting.type === 'color_scheme') dependencies.push('CSS Variables', 'Color Management');
    if (setting.type === 'font_picker') dependencies.push('Web Fonts API', 'Typography System');
    if (setting.type === 'collection') dependencies.push('Collection API', 'Product Data');
    if (setting.type === 'product') dependencies.push('Product API', 'Inventory System');
    
    return dependencies;
  }

  private extractRequirements(setting: any): string[] {
    const requirements: string[] = [];
    
    if (setting.type === 'range') requirements.push('Input validation', 'Real-time updates');
    if (setting.type === 'color') requirements.push('Color picker UI', 'CSS generation');
    if (setting.type === 'richtext') requirements.push('Rich text editor', 'HTML sanitization');
    
    return requirements;
  }

  private identifyUniqueFeatures(features: ThemeFeature[], themeName: string): string[] {
    // Features that are unique to this theme
    return features
      .filter(feature => feature.themes.length === 1)
      .map(feature => feature.name);
  }

  async analyzeAllThemes(): Promise<ThemeAnalysis[]> {
    const analyses: ThemeAnalysis[] = [];
    
    try {
      const themeDirectories = await fs.readdir(this.themesPath, { withFileTypes: true });
      
      for (const dir of themeDirectories) {
        if (dir.isDirectory()) {
          try {
            console.log(`Analyzing theme: ${dir.name}`);
            const analysis = await this.extractThemeFeatures(path.join(this.themesPath, dir.name));
            analyses.push(analysis);
          } catch (error) {
            console.error(`Failed to analyze ${dir.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to read themes directory:', error);
    }

    return analyses;
  }

  generateFeatureMatrix(analyses: ThemeAnalysis[]): Record<string, string[]> {
    const matrix: Record<string, string[]> = {};
    
    // Create matrix of features by theme
    analyses.forEach(analysis => {
      analysis.features.forEach(feature => {
        if (!matrix[feature.name]) {
          matrix[feature.name] = [];
        }
        matrix[feature.name].push(analysis.themeName);
      });
    });

    return matrix;
  }

  prioritizeFeatures(analyses: ThemeAnalysis[]): ThemeFeature[] {
    const featureFrequency: Record<string, number> = {};
    const allFeatures: Record<string, ThemeFeature> = {};
    
    // Count feature frequency across themes
    analyses.forEach(analysis => {
      analysis.features.forEach(feature => {
        featureFrequency[feature.name] = (featureFrequency[feature.name] || 0) + 1;
        allFeatures[feature.name] = feature;
      });
    });

    // Sort by frequency and priority
    return Object.values(allFeatures)
      .sort((a, b) => {
        const freqA = featureFrequency[a.name];
        const freqB = featureFrequency[b.name];
        
        // Primary sort by frequency
        if (freqA !== freqB) return freqB - freqA;
        
        // Secondary sort by priority
        const priorityWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      });
  }

  async generateReport(analyses: ThemeAnalysis[]): Promise<string> {
    const matrix = this.generateFeatureMatrix(analyses);
    const prioritizedFeatures = this.prioritizeFeatures(analyses);
    
    const report = {
      generatedAt: new Date().toISOString(),
      totalThemes: analyses.length,
      totalFeatures: Object.keys(matrix).length,
      themeAnalyses: analyses,
      featureMatrix: matrix,
      prioritizedFeatures: prioritizedFeatures.slice(0, 50), // Top 50 features
      implementationRoadmap: this.generateImplementationRoadmap(prioritizedFeatures),
      statistics: {
        byCategory: this.groupFeaturesByCategory(prioritizedFeatures),
        byDifficulty: this.groupFeaturesByDifficulty(prioritizedFeatures),
        totalEstimatedHours: prioritizedFeatures.reduce((total, f) => total + f.implementation.estimatedHours, 0)
      }
    };

    // Save to file
    await fs.writeFile(this.outputPath, JSON.stringify(report, null, 2));
    
    return JSON.stringify(report, null, 2);
  }

  private generateImplementationRoadmap(features: ThemeFeature[]) {
    const phases = {
      'Phase 1 - Critical Features (Week 1-2)': features.filter(f => f.priority === 'Critical').slice(0, 10),
      'Phase 2 - High Priority (Week 3-4)': features.filter(f => f.priority === 'High').slice(0, 15),
      'Phase 3 - Medium Priority (Week 5-6)': features.filter(f => f.priority === 'Medium').slice(0, 20),
      'Phase 4 - Nice to Have (Week 7-8)': features.filter(f => f.priority === 'Low').slice(0, 10)
    };

    return phases;
  }

  private groupFeaturesByCategory(features: ThemeFeature[]) {
    return features.reduce((acc, feature) => {
      acc[feature.category] = (acc[feature.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupFeaturesByDifficulty(features: ThemeFeature[]) {
    return features.reduce((acc, feature) => {
      acc[feature.implementation.difficulty] = (acc[feature.implementation.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

// Main extraction function
export async function extractAllShopifyFeatures(): Promise<string> {
  const extractor = new ShopifyFeatureExtractor();
  
  console.log('Starting Shopify theme analysis...');
  const analyses = await extractor.analyzeAllThemes();
  
  console.log('Generating comprehensive report...');
  const report = await extractor.generateReport(analyses);
  
  console.log(`Analysis complete! Found ${analyses.length} themes with comprehensive feature extraction.`);
  console.log('Report saved to: ./src/data/theme-features.json');
  
  return report;
}

// Export for use in components
export default extractAllShopifyFeatures;