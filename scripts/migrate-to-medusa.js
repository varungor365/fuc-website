// Migration script from Strapi to Medusa
const axios = require('axios');
const fs = require('fs');

const STRAPI_URL = 'http://localhost:1337';
const MEDUSA_URL = 'http://localhost:9000';

async function exportFromStrapi() {
  console.log('📦 Exporting data from Strapi...');
  
  try {
    const [products, categories] = await Promise.all([
      axios.get(`${STRAPI_URL}/api/products?populate=*`),
      axios.get(`${STRAPI_URL}/api/categories?populate=*`)
    ]);

    const exportData = {
      products: products.data.data,
      categories: categories.data.data,
      exportDate: new Date().toISOString()
    };

    fs.writeFileSync('strapi-export.json', JSON.stringify(exportData, null, 2));
    console.log('✅ Strapi data exported to strapi-export.json');
    return exportData;
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    throw error;
  }
}

async function importToMedusa(data, adminToken) {
  console.log('📥 Importing data to Medusa...');
  
  const headers = {
    'Content-Type': 'application/json',
    'x-medusa-access-token': adminToken
  };

  // Import categories
  const categoryMap = {};
  for (const cat of data.categories) {
    try {
      const response = await axios.post(
        `${MEDUSA_URL}/admin/product-categories`,
        {
          name: cat.attributes.name,
          handle: cat.attributes.slug || cat.attributes.name.toLowerCase().replace(/\s+/g, '-'),
          description: cat.attributes.description || ''
        },
        { headers }
      );
      categoryMap[cat.id] = response.data.product_category.id;
      console.log(`✅ Category imported: ${cat.attributes.name}`);
    } catch (error) {
      console.error(`❌ Failed to import category ${cat.attributes.name}:`, error.response?.data || error.message);
    }
  }

  // Import products
  for (const prod of data.products) {
    try {
      const productData = {
        title: prod.attributes.name,
        handle: prod.attributes.slug || prod.attributes.name.toLowerCase().replace(/\s+/g, '-'),
        description: prod.attributes.description || '',
        status: 'published',
        variants: [{
          title: 'Default',
          prices: [{
            amount: Math.round((prod.attributes.price || 999) * 100),
            currency_code: 'inr'
          }],
          inventory_quantity: prod.attributes.stock || 100,
          manage_inventory: true
        }],
        images: prod.attributes.images?.data?.map(img => img.attributes.url) || []
      };

      await axios.post(`${MEDUSA_URL}/admin/products`, productData, { headers });
      console.log(`✅ Product imported: ${prod.attributes.name}`);
    } catch (error) {
      console.error(`❌ Failed to import product ${prod.attributes.name}:`, error.response?.data || error.message);
    }
  }

  console.log('✅ Migration completed!');
}

async function migrate() {
  console.log('🚀 Starting Strapi to Medusa migration...\n');
  
  // Check if export file exists
  let data;
  if (fs.existsSync('strapi-export.json')) {
    console.log('📂 Found existing export file');
    data = JSON.parse(fs.readFileSync('strapi-export.json'));
  } else {
    data = await exportFromStrapi();
  }

  console.log(`\n📊 Data summary:`);
  console.log(`   Categories: ${data.categories.length}`);
  console.log(`   Products: ${data.products.length}\n`);

  // Get admin token (you need to login first)
  console.log('⚠️  Please provide your Medusa admin API token:');
  console.log('   1. Login to Medusa admin (http://localhost:7001)');
  console.log('   2. Go to Settings > API Keys');
  console.log('   3. Create a new API key\n');
  
  const adminToken = process.env.MEDUSA_ADMIN_TOKEN;
  
  if (!adminToken) {
    console.error('❌ MEDUSA_ADMIN_TOKEN environment variable not set');
    console.log('   Set it with: $env:MEDUSA_ADMIN_TOKEN="your_token_here"');
    process.exit(1);
  }

  await importToMedusa(data, adminToken);
}

migrate().catch(console.error);
