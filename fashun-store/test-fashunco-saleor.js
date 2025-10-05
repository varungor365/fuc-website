/**
 * Test Live Saleor Connection with Correct URL
 * Testing: https://fashunco.saleor.cloud/graphql/
 */

const { GraphQLClient } = require('graphql-request');

const SALEOR_API_URL = 'https://fashunco.saleor.cloud/graphql/';
const SALEOR_AUTH_TOKEN = 'a22ea8828ba5439b95476a53136a482d.VB3ey8kpAfquTIRE0gUKde9oVECIBXqGrnouFlvlmLcFTlRe';

const client = new GraphQLClient(SALEOR_API_URL, {
  headers: {
    'Authorization': `Bearer ${SALEOR_AUTH_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Simple query to test connection
const SHOP_QUERY = `
  query {
    shop {
      name
      domain {
        host
      }
      defaultCountry {
        code
        country
      }
      defaultCurrency
    }
  }
`;

// Products query
const PRODUCTS_QUERY = `
  query GetProducts($first: Int, $channel: String) {
    products(first: $first, channel: $channel) {
      edges {
        node {
          id
          name
          slug
          description
          thumbnail {
            url
            alt
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          category {
            name
            slug
          }
        }
      }
    }
  }
`;

async function testLiveSaleorConnection() {
  console.log('🚀 Testing FASHUN.CO Live Saleor Connection...');
  console.log(`📡 API URL: ${SALEOR_API_URL}`);
  console.log(`🔑 Token: ${SALEOR_AUTH_TOKEN.substring(0, 20)}...`);
  console.log('');

  try {
    // Test basic shop query first
    console.log('📤 Testing shop information...');
    const shopData = await client.request(SHOP_QUERY);
    
    console.log('✅ SUCCESS! Connected to your Saleor instance!');
    console.log(`🏪 Shop Name: ${shopData.shop.name}`);
    console.log(`🌐 Domain: ${shopData.shop.domain.host}`);
    console.log(`🌍 Country: ${shopData.shop.defaultCountry.country} (${shopData.shop.defaultCountry.code})`);
    console.log(`💰 Currency: ${shopData.shop.defaultCurrency}`);
    console.log('');
    
    // Test products query
    console.log('📤 Testing products query...');
    const productsData = await client.request(PRODUCTS_QUERY, {
      first: 5,
      channel: 'default-channel'
    });
    
    console.log(`📦 Found ${productsData.products.edges.length} products in your store`);
    
    if (productsData.products.edges.length > 0) {
      console.log('\n🎯 Your Products:');
      productsData.products.edges.forEach((edge, index) => {
        const product = edge.node;
        const price = product.pricing?.priceRange?.start?.gross;
        console.log(`  ${index + 1}. ${product.name}`);
        console.log(`     ID: ${product.id}`);
        console.log(`     Slug: ${product.slug}`);
        if (price) {
          console.log(`     Price: ${price.amount} ${price.currency}`);
        }
        console.log(`     Category: ${product.category?.name || 'Uncategorized'}`);
        if (product.thumbnail?.url) {
          console.log(`     Image: ${product.thumbnail.url}`);
        }
        console.log('');
      });
    } else {
      console.log('📝 No products found. You can add products in your Saleor dashboard.');
    }
    
    console.log('🎉 FASHUN.CO Saleor Integration Test Complete!');
    console.log('✅ Your e-commerce platform is ready for high-performance operations!');
    
    return { success: true, shopData, productsCount: productsData.products.edges.length };
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Details:', JSON.stringify(error.response.errors || error.response.data, null, 2));
    }
    
    return { success: false, error: error.message };
  }
}

// Run the test
testLiveSaleorConnection()
  .then(result => {
    if (result.success) {
      console.log('\n🚀 NEXT STEPS:');
      console.log('1. ✅ Saleor connection verified');
      console.log('2. 🔄 Restart your Next.js development server');
      console.log('3. 🌐 Test your FASHUN.CO website integration');
      console.log('4. 📦 Add products via Saleor dashboard if needed');
      console.log('\n💡 Run: npm run dev (in fashun-store directory)');
    } else {
      console.log('\n🔧 Please check your Saleor configuration and try again.');
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
  });