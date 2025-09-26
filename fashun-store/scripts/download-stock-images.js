/**
 * Stock Image Generator for FASHUN.CO
 * Downloads and saves actual stock images for the website
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

const imageRequests = [
  // HOODIES
  { 
    filename: 'hoodie-1-main.jpg', 
    url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop&auto=format',
    description: 'Black oversized hoodie streetwear'
  },
  { 
    filename: 'hoodie-1-front.jpg', 
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop&auto=format',
    description: 'Hoodie front view'
  },
  { 
    filename: 'hoodie-1-back.jpg', 
    url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&auto=format',
    description: 'Hoodie back view'
  },
  { 
    filename: 'hoodie-1-side.jpg', 
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&auto=format',
    description: 'Hoodie side view'
  },
  { 
    filename: 'hoodie-2-main.jpg', 
    url: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=800&h=800&fit=crop&auto=format',
    description: 'Minimalist pullover hoodie'
  },
  { 
    filename: 'hoodie-2-front.jpg', 
    url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop&auto=format',
    description: 'White hoodie front'
  },
  { 
    filename: 'hoodie-2-back.jpg', 
    url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&h=800&fit=crop&auto=format',
    description: 'Grey hoodie back'
  },

  // T-SHIRTS
  { 
    filename: 'tshirt-1-main.jpg', 
    url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&auto=format&q=85',
    description: 'Typography print t-shirt'
  },
  { 
    filename: 'tshirt-1-front.jpg', 
    url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop&auto=format',
    description: 'Black graphic t-shirt front'
  },
  { 
    filename: 'tshirt-1-back.jpg', 
    url: 'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=800&h=800&fit=crop&auto=format',
    description: 'T-shirt back print'
  },
  { 
    filename: 'tshirt-2-main.jpg', 
    url: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&h=800&fit=crop&auto=format',
    description: 'Oversized drop shoulder tee'
  },
  { 
    filename: 'tshirt-2-front.jpg', 
    url: 'https://images.unsplash.com/photo-1622470952593-57c5088d9e6c?w=800&h=800&fit=crop&auto=format',
    description: 'Sage green oversized tee'
  },
  { 
    filename: 'tshirt-2-side.jpg', 
    url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop&auto=format&q=90',
    description: 'Oversized tee side view'
  },

  // SNEAKERS
  { 
    filename: 'sneaker-1-main.jpg', 
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop&auto=format',
    description: 'Urban runner sneakers'
  },
  { 
    filename: 'sneaker-1-side.jpg', 
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop&auto=format',
    description: 'White sneakers side view'
  },
  { 
    filename: 'sneaker-1-top.jpg', 
    url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=800&fit=crop&auto=format',
    description: 'Sneakers top view'
  },
  { 
    filename: 'sneaker-1-sole.jpg', 
    url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop&auto=format',
    description: 'Sneaker sole detail'
  },

  // ACCESSORIES
  { 
    filename: 'cap-1-main.jpg', 
    url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop&auto=format',
    description: 'Embroidered streetwear cap'
  },
  { 
    filename: 'cap-1-front.jpg', 
    url: 'https://images.unsplash.com/photo-1575428652377-a4047b0a6e04?w=800&h=800&fit=crop&auto=format',
    description: 'Black cap front view'
  },
  { 
    filename: 'cap-1-side.jpg', 
    url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=800&fit=crop&auto=format',
    description: 'Cap side profile'
  },

  // JEANS
  { 
    filename: 'jeans-1-main.jpg', 
    url: 'https://images.unsplash.com/photo-1541840031508-326b77c9a17e?w=800&h=800&fit=crop&auto=format',
    description: 'Relaxed fit cargo jeans'
  },
  { 
    filename: 'jeans-1-front.jpg', 
    url: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&h=800&fit=crop&auto=format',
    description: 'Dark wash jeans front'
  },
  { 
    filename: 'jeans-1-back.jpg', 
    url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop&auto=format',
    description: 'Jeans back pockets'
  },
  { 
    filename: 'jeans-1-detail.jpg', 
    url: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&h=800&fit=crop&auto=format',
    description: 'Cargo pocket detail'
  },

  // JACKETS
  { 
    filename: 'jacket-1-main.jpg', 
    url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop&auto=format',
    description: 'Utility bomber jacket'
  },
  { 
    filename: 'jacket-1-front.jpg', 
    url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=800&fit=crop&auto=format',
    description: 'Olive bomber front'
  },
  { 
    filename: 'jacket-1-back.jpg', 
    url: 'https://images.unsplash.com/photo-1562788869-4ed32648eb72?w=800&h=800&fit=crop&auto=format',
    description: 'Jacket back view'
  },
  { 
    filename: 'jacket-1-detail.jpg', 
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&auto=format&q=95',
    description: 'Utility pocket detail'
  }
];

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../public/images/products', filename);
    const file = createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve(filename);
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete incomplete file
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Main download function
async function downloadAllImages() {
  console.log('🚀 Starting FASHUN.CO stock image download...');
  console.log(`📦 Downloading ${imageRequests.length} high-quality images...`);
  
  const results = [];
  
  for (let i = 0; i < imageRequests.length; i++) {
    const request = imageRequests[i];
    try {
      console.log(`⏳ [${i + 1}/${imageRequests.length}] Downloading ${request.filename}...`);
      await downloadImage(request.url, request.filename);
      results.push({ success: true, filename: request.filename });
      
      // Small delay to be respectful to the API
      if (i < imageRequests.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`❌ Failed to download ${request.filename}:`, error.message);
      results.push({ success: false, filename: request.filename, error: error.message });
    }
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n🎉 Download Summary:');
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📁 Images saved to: /public/images/products/`);
  
  if (failed > 0) {
    console.log('\n❌ Failed downloads:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.filename}: ${r.error}`);
    });
  }
  
  console.log('\n🎯 Ready! Your FASHUN.CO website now has professional stock images.');
}

// Run if called directly
if (require.main === module) {
  downloadAllImages().catch(console.error);
}

module.exports = { downloadAllImages, imageRequests };