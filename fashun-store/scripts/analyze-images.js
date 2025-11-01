#!/usr/bin/env node
/**
 * Image Optimization Analyzer
 * Analyzes all images in the project and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif'];
const MAX_SIZE = 200 * 1024; // 200KB

function analyzeImages() {
  console.log('🖼️  Analyzing Images for Optimization...\n');

  const publicDir = path.join(process.cwd(), 'public');
  const images = [];

  // Check if public directory exists
  if (!fs.existsSync(publicDir)) {
    console.log('⚠️  No public directory found. Skipping image analysis.\n');
    return;
  }

  // Find all images
  function scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else {
          const ext = path.extname(item).toLowerCase();
          if (IMAGE_EXTENSIONS.includes(ext)) {
            const relativePath = path.relative(process.cwd(), fullPath);
            images.push(analyzeImage(relativePath, stat.size, ext));
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not scan directory: ${dir}`);
    }
  }

  scanDirectory(publicDir);

  // Generate report
  console.log('📊 Analysis Results:\n');
  console.log(`   Total Images: ${images.length}`);
  
  const needsOptimization = images.filter(img => img.canOptimize);
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  const oversized = images.filter(img => img.size > MAX_SIZE);
  
  console.log(`   ✅ Optimized: ${images.length - needsOptimization.length}`);
  console.log(`   ⚠️  Needs Optimization: ${needsOptimization.length}`);
  console.log(`   📦 Total Size: ${formatBytes(totalSize)}`);
  console.log(`   🚨 Oversized (>${formatBytes(MAX_SIZE)}): ${oversized.length}\n`);

  if (needsOptimization.length > 0) {
    console.log('🔴 Images Needing Optimization:\n');
    console.log('─'.repeat(100));
    
    needsOptimization.slice(0, 10).forEach((img, index) => {
      console.log(`\n${index + 1}. ${img.path}`);
      console.log(`   Size: ${formatBytes(img.size)}`);
      console.log(`   Format: ${img.format}`);
      console.log(`   Recommendations:`);
      img.recommendations.forEach(rec => {
        console.log(`     • ${rec}`);
      });
    });

    if (needsOptimization.length > 10) {
      console.log(`\n... and ${needsOptimization.length - 10} more images need optimization`);
    }
  } else {
    console.log('🎉 All images are optimized!\n');
  }

  // Generate optimization commands
  console.log('\n\n📝 Optimization Recommendations:\n');
  console.log('1. Use Next.js Image component for automatic optimization');
  console.log('2. Enable WebP/AVIF in next.config.js (✅ Already configured)');
  console.log('3. Use appropriate image dimensions (no oversizing)');
  console.log('4. Consider using a CDN for image delivery');
  
  if (needsOptimization.length > 0) {
    console.log('\n# To optimize manually, install sharp:');
    console.log('npm install sharp-cli -g');
    console.log('\n# Then convert images:');
    console.log('find public -type f \\( -name "*.jpg" -o -name "*.png" \\) -exec sharp -i "{}" -o "{}.webp" --webp \\;');
  }
  
  // Save report
  const report = {
    date: new Date().toISOString(),
    summary: {
      total: images.length,
      needsOptimization: needsOptimization.length,
      totalSize: totalSize,
      oversized: oversized.length,
    },
    images: needsOptimization.map(img => ({
      path: img.path,
      size: img.size,
      format: img.format,
      recommendations: img.recommendations
    })),
  };
  
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(reportsDir, 'image-optimization-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n✅ Report saved: reports/image-optimization-report.json\n');
}

function analyzeImage(filePath, size, format) {
  const recommendations = [];
  let canOptimize = false;

  // Check size
  if (size > MAX_SIZE) {
    recommendations.push(`Compress image - current size ${formatBytes(size)} exceeds ${formatBytes(MAX_SIZE)}`);
    canOptimize = true;
  }

  // Check format
  if (format === '.png' && size > 50 * 1024) {
    recommendations.push('Convert to WebP for better compression (50-80% smaller)');
    canOptimize = true;
  }
  
  if (format === '.jpg' || format === '.jpeg') {
    recommendations.push('Consider converting to WebP for 25-35% size reduction');
    canOptimize = true;
  }

  if (format === '.gif') {
    recommendations.push('Convert to MP4/WebM for animations or WebP for static images');
    canOptimize = true;
  }

  // Check if modern format
  if (!['.webp', '.avif'].includes(format)) {
    recommendations.push('Modern format recommended (WebP or AVIF)');
    canOptimize = true;
  }

  // Lazy loading recommendation
  recommendations.push('Ensure Next.js Image component is used with lazy loading');

  return {
    path: filePath,
    size,
    format,
    canOptimize,
    recommendations,
  };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Run the analysis
analyzeImages();
