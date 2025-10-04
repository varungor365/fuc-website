/**
 * Real Theme Feature Extractor
 * Analyzes actual Shopify themes from the shopify themes folder
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface ThemeFeature {
  id: string;
  name: string;
  type: string;
  category: 'layout' | 'colors' | 'typography' | 'ecommerce' | 'social' | 'seo' | 'advanced' | 'marketing';
  description?: string;
  default?: any;
  options?: any[];
}

export interface ThemeAnalysis {
  themeName: string;
  version?: string;
  author?: string;
  totalSettings: number;
  categories: string[];
  features: ThemeFeature[];
  capabilities: {
    hasAjaxCart: boolean;
    hasQuickView: boolean;
    hasWishlist: boolean;
    hasColorSwatches: boolean;
    hasStickyHeader: boolean;
    hasParallax: boolean;
    hasCountdown: boolean;
    hasNewsletterPopup: boolean;
    hasSearchFilters: boolean;
    hasSocialSharing: boolean;
    hasMultiCurrency: boolean;
    hasRTL: boolean;
    hasCustomCSS: boolean;
  };
}

export interface AllThemesAnalysis {
  totalThemes: number;
  themes: ThemeAnalysis[];
  commonFeatures: ThemeFeature[];
  featureMatrix: Record<string, string[]>; // feature -> themes that have it
  categorySummary: Record<string, number>;
}

/**
 * Extract features from a single theme's settings_schema.json
 */
export async function analyzeTheme(themePath: string): Promise<ThemeAnalysis | null> {
  try {
    const themeName = path.basename(themePath);
    let configPath: string;

    // Find the actual config path (themes have different structures)
    try {
      const items = await fs.readdir(themePath);
      const configDir = items.find(item => item === 'config');
      if (configDir) {
        configPath = path.join(themePath, 'config', 'settings_schema.json');
      } else {
        // Some themes have nested structure
        const subDirs = await Promise.all(
          items.map(async (item) => {
            const itemPath = path.join(themePath, item);
            const stat = await fs.stat(itemPath);
            return stat.isDirectory() ? item : null;
          })
        );
        
        const validSubDir = subDirs.find(Boolean);
        if (validSubDir) {
          configPath = path.join(themePath, validSubDir, 'config', 'settings_schema.json');
        } else {
          return null;
        }
      }
    } catch {
      return null;
    }

    const schemaContent = await fs.readFile(configPath, 'utf-8');
    const schema = JSON.parse(schemaContent);

    if (!Array.isArray(schema)) {
      return null;
    }

    const features: ThemeFeature[] = [];
    const categories: string[] = [];
    let themeInfo: any = {};

    // Extract theme info and settings
    for (const section of schema) {
      if (section.name === 'theme_info') {
        themeInfo = section;
        continue;
      }

      if (section.settings && Array.isArray(section.settings)) {
        const categoryName = section.name || 'General';
        if (!categories.includes(categoryName)) {
          categories.push(categoryName);
        }

        for (const setting of section.settings) {
          if (setting.type && setting.type !== 'header' && setting.type !== 'paragraph') {
            const feature: ThemeFeature = {
              id: `${section.name}_${setting.id || setting.type}`,
              name: setting.label || setting.content || 'Unnamed Setting',
              type: setting.type,
              category: categorizeFeature(section.name, setting),
              description: setting.info || setting.content,
              default: setting.default,
              options: setting.options || undefined
            };
            
            features.push(feature);
          }
        }
      }
    }

    // Analyze capabilities based on found features
    const capabilities = analyzeCapabilities(features, schema);

    return {
      themeName,
      version: themeInfo.theme_version,
      author: themeInfo.theme_author,
      totalSettings: features.length,
      categories,
      features,
      capabilities
    };

  } catch (error) {
    console.error(`Error analyzing theme ${themePath}:`, error);
    return null;
  }
}

/**
 * Categorize features based on section name and setting details
 */
function categorizeFeature(sectionName: string, setting: any): ThemeFeature['category'] {
  const section = sectionName.toLowerCase();
  const type = setting.type?.toLowerCase() || '';
  const id = setting.id?.toLowerCase() || '';
  const label = setting.label?.toLowerCase() || '';

  // Colors category
  if (section.includes('color') || type === 'color' || section.includes('styles')) {
    return 'colors';
  }

  // Typography category
  if (section.includes('typography') || section.includes('font') || type === 'font_picker' || 
      id.includes('font') || label.includes('font')) {
    return 'typography';
  }

  // E-commerce category
  if (section.includes('cart') || section.includes('product') || section.includes('collection') ||
      section.includes('shop') || id.includes('cart') || id.includes('wishlist') || 
      id.includes('compare') || id.includes('quick') || label.includes('add to cart')) {
    return 'ecommerce';
  }

  // Social category
  if (section.includes('social') || id.includes('social') || id.includes('share') || 
      id.includes('facebook') || id.includes('twitter') || id.includes('instagram')) {
    return 'social';
  }

  // Marketing category
  if (section.includes('popup') || section.includes('newsletter') || section.includes('promo') ||
      id.includes('countdown') || id.includes('popup') || id.includes('banner') || 
      label.includes('popup') || label.includes('newsletter')) {
    return 'marketing';
  }

  // SEO category
  if (section.includes('seo') || id.includes('seo') || id.includes('meta') || 
      type === 'image_picker' && id.includes('favicon')) {
    return 'seo';
  }

  // Advanced category
  if (section.includes('advanced') || section.includes('custom') || section.includes('css') ||
      section.includes('js') || type === 'textarea' && (id.includes('css') || id.includes('js')) ||
      id.includes('api') || id.includes('tracking')) {
    return 'advanced';
  }

  // Layout category (default)
  return 'layout';
}

/**
 * Analyze theme capabilities based on settings
 */
function analyzeCapabilities(features: ThemeFeature[], schema: any[]): ThemeAnalysis['capabilities'] {
  const hasFeature = (searchTerms: string[]) => {
    return features.some(feature => 
      searchTerms.some(term => 
        feature.id.toLowerCase().includes(term) || 
        feature.name.toLowerCase().includes(term) ||
        (feature.description && feature.description.toLowerCase().includes(term))
      )
    );
  };

  return {
    hasAjaxCart: hasFeature(['ajax', 'cart']),
    hasQuickView: hasFeature(['quick', 'view', 'quickview']),
    hasWishlist: hasFeature(['wishlist', 'wish', 'favorite']),
    hasColorSwatches: hasFeature(['swatch', 'color', 'variant']),
    hasStickyHeader: hasFeature(['sticky', 'fixed', 'header']),
    hasParallax: hasFeature(['parallax']),
    hasCountdown: hasFeature(['countdown', 'timer']),
    hasNewsletterPopup: hasFeature(['newsletter', 'popup', 'subscribe']),
    hasSearchFilters: hasFeature(['search', 'filter', 'ajax']),
    hasSocialSharing: hasFeature(['share', 'social']),
    hasMultiCurrency: hasFeature(['currency', 'multi']),
    hasRTL: hasFeature(['rtl', 'right to left']),
    hasCustomCSS: hasFeature(['css', 'custom'])
  };
}

/**
 * Analyze all themes in the shopify themes directory
 */
export async function analyzeAllRealThemes(themesBasePath: string): Promise<AllThemesAnalysis> {
  const themes: ThemeAnalysis[] = [];
  const featureMatrix: Record<string, string[]> = {};
  const categorySummary: Record<string, number> = {};

  try {
    const themeDirectories = await fs.readdir(themesBasePath);
    
    console.log(`Found ${themeDirectories.length} potential themes`);

    for (const themeDir of themeDirectories) {
      const themePath = path.join(themesBasePath, themeDir);
      
      try {
        const stats = await fs.stat(themePath);
        if (stats.isDirectory()) {
          console.log(`Analyzing theme: ${themeDir}`);
          const analysis = await analyzeTheme(themePath);
          
          if (analysis) {
            themes.push(analysis);

            // Build feature matrix
            analysis.features.forEach(feature => {
              const featureKey = `${feature.name} (${feature.type})`;
              if (!featureMatrix[featureKey]) {
                featureMatrix[featureKey] = [];
              }
              featureMatrix[featureKey].push(analysis.themeName);
            });

            // Count categories
            analysis.categories.forEach(category => {
              categorySummary[category] = (categorySummary[category] || 0) + 1;
            });
          }
        }
      } catch (error) {
        console.warn(`Skipping ${themeDir}: ${error}`);
      }
    }
  } catch (error) {
    console.error('Error reading themes directory:', error);
  }

  // Find common features (present in 3+ themes)
  const commonFeatures: ThemeFeature[] = [];
  Object.entries(featureMatrix).forEach(([featureName, themesList]) => {
    if (themesList.length >= 3) {
      // Create a representative feature
      const firstTheme = themes.find(t => t.themeName === themesList[0]);
      const feature = firstTheme?.features.find(f => `${f.name} (${f.type})` === featureName);
      if (feature) {
        commonFeatures.push({
          ...feature,
          description: `Found in ${themesList.length} themes: ${themesList.slice(0, 3).join(', ')}${themesList.length > 3 ? '...' : ''}`
        });
      }
    }
  });

  return {
    totalThemes: themes.length,
    themes,
    commonFeatures,
    featureMatrix,
    categorySummary
  };
}

/**
 * Generate a comprehensive report of all theme features
 */
export async function generateThemeFeatureReport(analysis: AllThemesAnalysis, outputPath?: string) {
  const report = {
    summary: {
      totalThemesAnalyzed: analysis.totalThemes,
      totalUniqueFeatures: Object.keys(analysis.featureMatrix).length,
      commonFeatures: analysis.commonFeatures.length,
      categoriesFound: Object.keys(analysis.categorySummary),
      generatedAt: new Date().toISOString()
    },
    themeCapabilities: analysis.themes.map(theme => ({
      name: theme.themeName,
      author: theme.author,
      version: theme.version,
      totalSettings: theme.totalSettings,
      categories: theme.categories,
      capabilities: theme.capabilities
    })),
    commonFeatures: analysis.commonFeatures,
    featureMatrix: analysis.featureMatrix,
    categorySummary: analysis.categorySummary,
    detailedThemes: analysis.themes
  };

  if (outputPath) {
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
    console.log(`Detailed theme analysis report saved to: ${outputPath}`);
  }

  return report;
}

/**
 * Get top features across all themes
 */
export function getTopFeaturesAcrossThemes(analysis: AllThemesAnalysis, minThemes: number = 3) {
  return Object.entries(analysis.featureMatrix)
    .filter(([_, themes]) => themes.length >= minThemes)
    .sort(([, a], [, b]) => b.length - a.length)
    .map(([featureName, themes]) => ({
      feature: featureName,
      themesCount: themes.length,
      themes: themes,
      percentage: Math.round((themes.length / analysis.totalThemes) * 100)
    }));
}

/**
 * Main function to extract all real theme features
 */
export async function extractAllRealThemeFeatures(themesPath: string, outputPath?: string) {
  console.log('🔍 Starting analysis of real Shopify themes...');
  
  const analysis = await analyzeAllRealThemes(themesPath);
  
  console.log(`✅ Analysis complete!`);
  console.log(`📊 Themes analyzed: ${analysis.totalThemes}`);
  console.log(`🎯 Unique features found: ${Object.keys(analysis.featureMatrix).length}`);
  console.log(`⭐ Common features (3+ themes): ${analysis.commonFeatures.length}`);
  
  if (outputPath) {
    const report = await generateThemeFeatureReport(analysis, outputPath);
    return { analysis, report };
  }
  
  return { analysis };
}