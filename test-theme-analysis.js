/**
 * Test script to analyze all real Shopify themes
 */

import { extractAllRealThemeFeatures, getTopFeaturesAcrossThemes } from './fashun-store/src/lib/extractRealThemeFeatures.js';
import path from 'path';

async function main() {
  const themesPath = path.resolve('shopify themes');
  const outputPath = path.resolve('theme-analysis-report.json');
  
  console.log('🚀 Analyzing themes in:', themesPath);
  
  try {
    const { analysis, report } = await extractAllRealThemeFeatures(themesPath, outputPath);
    
    console.log('\n📋 SUMMARY:');
    console.log(`Themes Successfully Analyzed: ${analysis.totalThemes}`);
    
    analysis.themes.forEach((theme, index) => {
      console.log(`${index + 1}. ${theme.themeName} (${theme.totalSettings} settings)`);
    });
    
    console.log('\n🏆 TOP FEATURES (found in most themes):');
    const topFeatures = getTopFeaturesAcrossThemes(analysis, 2);
    topFeatures.slice(0, 20).forEach((item, index) => {
      console.log(`${index + 1}. ${item.feature} - ${item.percentage}% (${item.themesCount}/${analysis.totalThemes} themes)`);
    });
    
    console.log('\n🎨 CATEGORIES SUMMARY:');
    Object.entries(analysis.categorySummary)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} themes`);
      });
    
    console.log('\n🛠️ CAPABILITIES ANALYSIS:');
    const capabilities = analysis.themes.map(t => t.capabilities);
    const capabilityStats = {
      hasAjaxCart: capabilities.filter(c => c.hasAjaxCart).length,
      hasQuickView: capabilities.filter(c => c.hasQuickView).length,
      hasWishlist: capabilities.filter(c => c.hasWishlist).length,
      hasColorSwatches: capabilities.filter(c => c.hasColorSwatches).length,
      hasStickyHeader: capabilities.filter(c => c.hasStickyHeader).length,
      hasParallax: capabilities.filter(c => c.hasParallax).length,
      hasCountdown: capabilities.filter(c => c.hasCountdown).length,
      hasNewsletterPopup: capabilities.filter(c => c.hasNewsletterPopup).length,
      hasSearchFilters: capabilities.filter(c => c.hasSearchFilters).length,
      hasSocialSharing: capabilities.filter(c => c.hasSocialSharing).length,
      hasMultiCurrency: capabilities.filter(c => c.hasMultiCurrency).length,
      hasRTL: capabilities.filter(c => c.hasRTL).length,
      hasCustomCSS: capabilities.filter(c => c.hasCustomCSS).length,
    };
    
    Object.entries(capabilityStats).forEach(([capability, count]) => {
      const percentage = Math.round((count / analysis.totalThemes) * 100);
      console.log(`${capability}: ${percentage}% (${count}/${analysis.totalThemes} themes)`);
    });
    
    console.log(`\n📄 Full report saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
}

main();