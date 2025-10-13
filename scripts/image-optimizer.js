const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await optimizeImages(filePath);
      continue;
    }
    
    if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;
    
    const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    if (fs.existsSync(outputPath)) continue;
    
    try {
      await sharp(filePath)
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      const originalSize = stat.size;
      const newSize = fs.statSync(outputPath).size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);
      
      console.log(`✅ ${file} → ${path.basename(outputPath)} (${savings}% smaller)`);
    } catch (error) {
      console.error(`❌ Failed to optimize ${file}:`, error.message);
    }
  }
}

const uploadDir = process.argv[2] || './public/uploads';
optimizeImages(uploadDir);
