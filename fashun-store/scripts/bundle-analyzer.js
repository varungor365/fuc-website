#!/usr/bin/env node

// Bundle Size Analysis Script for FASHUN.CO
// This script analyzes the Next.js bundle and provides optimization recommendations

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BundleAnalyzer {
  constructor() {
    this.buildDir = path.join(process.cwd(), '.next');
    this.staticDir = path.join(this.buildDir, 'static');
  }

  async analyze() {
    console.log('🔍 Analyzing bundle size for FASHUN.CO...\n');

    if (!fs.existsSync(this.buildDir)) {
      console.error('❌ Build directory not found. Please run "npm run build" first.');
      process.exit(1);
    }

    const results = {
      pages: this.analyzePages(),
      chunks: this.analyzeChunks(),
      assets: this.analyzeAssets(),
      recommendations: []
    };

    this.generateReport(results);
    this.generateRecommendations(results);
  }

  analyzePages() {
    const pagesManifest = path.join(this.buildDir, 'server/pages-manifest.json');
    
    if (!fs.existsSync(pagesManifest)) {
      return { error: 'Pages manifest not found' };
    }

    const manifest = JSON.parse(fs.readFileSync(pagesManifest, 'utf8'));
    const pages = {};

    Object.keys(manifest).forEach(page => {
      const pagePath = path.join(this.buildDir, 'server', manifest[page]);
      if (fs.existsSync(pagePath)) {
        const stats = fs.statSync(pagePath);
        pages[page] = {
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024 * 100) / 100
        };
      }
    });

    return pages;
  }

  analyzeChunks() {
    const chunksDir = path.join(this.staticDir, 'chunks');
    
    if (!fs.existsSync(chunksDir)) {
      return { error: 'Chunks directory not found' };
    }

    const chunks = {};
    const files = fs.readdirSync(chunksDir, { recursive: true });

    files.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join(chunksDir, file);
        const stats = fs.statSync(filePath);
        chunks[file] = {
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024 * 100) / 100
        };
      }
    });

    return chunks;
  }

  analyzeAssets() {
    const assets = {
      css: {},
      images: {},
      fonts: {},
      total: 0
    };

    // Analyze CSS files
    const cssDir = path.join(this.staticDir, 'css');
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir);
      cssFiles.forEach(file => {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        assets.css[file] = {
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024 * 100) / 100
        };
        assets.total += stats.size;
      });
    }

    // Analyze image assets in public folder
    const publicImagesDir = path.join(process.cwd(), 'public', 'images');
    if (fs.existsSync(publicImagesDir)) {
      const imageFiles = fs.readdirSync(publicImagesDir, { recursive: true });
      imageFiles.forEach(file => {
        if (file.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          const filePath = path.join(publicImagesDir, file);
          const stats = fs.statSync(filePath);
          assets.images[file] = {
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024 * 100) / 100
          };
          assets.total += stats.size;
        }
      });
    }

    return assets;
  }

  generateReport(results) {
    console.log('📊 BUNDLE ANALYSIS REPORT\n');
    console.log('═'.repeat(50));

    // Pages Analysis
    console.log('\n📄 PAGES ANALYSIS:');
    console.log('-'.repeat(30));
    
    const pages = Object.entries(results.pages)
      .sort(([,a], [,b]) => (b.size || 0) - (a.size || 0));
    
    pages.slice(0, 10).forEach(([page, data]) => {
      if (data.sizeKB) {
        const status = data.sizeKB > 100 ? '🔴' : data.sizeKB > 50 ? '🟡' : '🟢';
        console.log(`${status} ${page}: ${data.sizeKB}KB`);
      }
    });

    // Chunks Analysis
    console.log('\n🧩 CHUNKS ANALYSIS:');
    console.log('-'.repeat(30));
    
    const chunks = Object.entries(results.chunks)
      .sort(([,a], [,b]) => (b.size || 0) - (a.size || 0));
    
    chunks.slice(0, 10).forEach(([chunk, data]) => {
      if (data.sizeKB) {
        const status = data.sizeKB > 200 ? '🔴' : data.sizeKB > 100 ? '🟡' : '🟢';
        console.log(`${status} ${chunk}: ${data.sizeKB}KB`);
      }
    });

    // Assets Analysis
    console.log('\n🎨 ASSETS ANALYSIS:');
    console.log('-'.repeat(30));
    
    const totalMB = Math.round(results.assets.total / 1024 / 1024 * 100) / 100;
    console.log(`Total Asset Size: ${totalMB}MB`);
    
    if (Object.keys(results.assets.css).length > 0) {
      console.log('\nCSS Files:');
      Object.entries(results.assets.css).forEach(([file, data]) => {
        const status = data.sizeKB > 50 ? '🔴' : data.sizeKB > 25 ? '🟡' : '🟢';
        console.log(`  ${status} ${file}: ${data.sizeKB}KB`);
      });
    }
  }

  generateRecommendations(results) {
    console.log('\n💡 OPTIMIZATION RECOMMENDATIONS:');
    console.log('═'.repeat(50));

    const recommendations = [];

    // Check for large pages
    const largePages = Object.entries(results.pages)
      .filter(([, data]) => data.sizeKB > 100);
    
    if (largePages.length > 0) {
      recommendations.push({
        type: 'Page Size',
        message: `${largePages.length} pages exceed 100KB. Consider code splitting.`,
        pages: largePages.map(([page]) => page)
      });
    }

    // Check for large chunks
    const largeChunks = Object.entries(results.chunks)
      .filter(([, data]) => data.sizeKB > 200);
    
    if (largeChunks.length > 0) {
      recommendations.push({
        type: 'Chunk Size',
        message: `${largeChunks.length} chunks exceed 200KB. Consider dynamic imports.`,
        chunks: largeChunks.map(([chunk]) => chunk)
      });
    }

    // Check total bundle size
    const totalJS = Object.values(results.chunks)
      .reduce((sum, chunk) => sum + (chunk.size || 0), 0);
    const totalJSMB = Math.round(totalJS / 1024 / 1024 * 100) / 100;

    if (totalJSMB > 1) {
      recommendations.push({
        type: 'Total Bundle Size',
        message: `Total JS bundle is ${totalJSMB}MB. Target: <1MB for optimal performance.`
      });
    }

    // Display recommendations
    if (recommendations.length === 0) {
      console.log('🎉 Great job! Your bundle size is well optimized.');
    } else {
      recommendations.forEach((rec, index) => {
        console.log(`\n${index + 1}. ${rec.type}:`);
        console.log(`   ${rec.message}`);
        
        if (rec.pages) {
          console.log(`   Affected pages: ${rec.pages.slice(0, 3).join(', ')}${rec.pages.length > 3 ? '...' : ''}`);
        }
        if (rec.chunks) {
          console.log(`   Large chunks: ${rec.chunks.slice(0, 3).join(', ')}${rec.chunks.length > 3 ? '...' : ''}`);
        }
      });
    }

    // Performance targets
    console.log('\n🎯 PERFORMANCE TARGETS:');
    console.log('-'.repeat(30));
    console.log('✅ First Contentful Paint: <1.8s');
    console.log('✅ Largest Contentful Paint: <2.5s');
    console.log('✅ Cumulative Layout Shift: <0.1');
    console.log('✅ Total Bundle Size: <1MB');
    console.log('✅ Individual Page Size: <100KB');
    console.log('✅ Third-party Scripts: Minimize');
  }
}

// Run analysis
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = BundleAnalyzer;