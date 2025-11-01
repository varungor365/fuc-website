#!/usr/bin/env tsx
/**
 * Image Optimization Analyzer
 * Analyzes all images in the project and provides optimization recommendations
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

interface ImageInfo {
  path: string;
  size: number;
  dimensions?: { width: number; height: number };
  format: string;
  canOptimize: boolean;
  recommendations: string[];
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif'];
const MAX_SIZE = 200 * 1024; // 200KB
const MAX_DIMENSIONS = { width: 2000, height: 2000 };

async function analyzeImages() {
  console.log('🖼️  Analyzing Images for Optimization...\n');

  const publicDir = path.join(process.cwd(), 'public');
  const images: ImageInfo[] = [];

  // Find all images
  function scanDirectory(dir: string) {
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
  }

  if (fs.existsSync(publicDir)) {
    scanDirectory(publicDir);
  }

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
    
    needsOptimization.forEach((img, index) => {
      console.log(`\n${index + 1}. ${img.path}`);
      console.log(`   Size: ${formatBytes(img.size)}`);
      console.log(`   Format: ${img.format}`);
      if (img.dimensions) {
        console.log(`   Dimensions: ${img.dimensions.width}x${img.dimensions.height}px`);
      }
      console.log(`   Recommendations:`);
      img.recommendations.forEach(rec => {
        console.log(`     • ${rec}`);
      });
    });
  }

  // Generate optimization commands
  console.log('\n\n📝 Optimization Commands:\n');
  generateOptimizationCommands(needsOptimization);
  
  // Save report
  const report = {
    date: new Date().toISOString(),
    summary: {
      total: images.length,
      needsOptimization: needsOptimization.length,
      totalSize: totalSize,
      oversized: oversized.length,
    },
    images: needsOptimization,
  };
  
  fs.mkdirSync(path.join(process.cwd(), 'reports'), { recursive: true });
  fs.writeFileSync(
    path.join(process.cwd(), 'reports', 'image-optimization-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n✅ Report saved: reports/image-optimization-report.json\n');
}

function analyzeImage(filePath: string, size: number, format: string): ImageInfo {
  const recommendations: string[] = [];
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
    recommendations.push('Ensure JPEG quality is 80-85% (optimal balance)');
    recommendations.push('Consider converting to WebP for 25-35% size reduction');
    canOptimize = true;
  }

  if (format === '.gif') {
    recommendations.push('Convert to MP4 or WebM for animations (90% smaller)');
    recommendations.push('Or convert to WebP if static image');
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

function generateOptimizationCommands(images: ImageInfo[]) {
  console.log('# Install optimization tools:');
  console.log('npm install -g sharp-cli');
  console.log('# or');
  console.log('npm install sharp');
  console.log('\n# Optimize individual images:\n');

  images.slice(0, 10).forEach(img => {
    const outputPath = img.path.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
    console.log(`sharp -i "${img.path}" -o "${outputPath}" --webp`);
  });

  if (images.length > 10) {
    console.log(`\n... and ${images.length - 10} more images`);
  }

  console.log('\n# Bulk optimize all images:');
  console.log('find public -type f \\( -name "*.jpg" -o -name "*.png" \\) -exec sh -c \'sharp -i "$1" -o "${1%.*}.webp" --webp\' _ {} \\;');
  
  console.log('\n# Or use the automated script:');
  console.log('npm run optimize:images');
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Run the analysis
analyzeImages().catch(console.error);
