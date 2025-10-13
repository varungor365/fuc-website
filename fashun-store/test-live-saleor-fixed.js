/**
 * Direct Saleor GraphQL Test
 * Test connection to live Saleor instance
 */

const { GraphQLClient } = require('graphql-request');

const SALEOR_API_URL = 'https://fashun-store.saleor.cloud/graphql/';
const SALEOR_API_URL_ALT = 'https://fashun-store.saleor.cloud/graphql';
const SALEOR_AUTH_TOKEN = 'a22ea8828ba5439b95476a53136a482d.VB3ey8kpAfquTIRE0gUKde9oVECIBXqGrnouFlvlmLcFTlRe';

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

// Simple query to test connection
const SIMPLE_QUERY = `
  query {
    shop {
      name
      domain {
        host
      }
    }
  }
`;

async function testWithUrl(apiUrl, description) {
  console.log(`\n🔄 Testing ${description}...`);
  console.log(`📡 API URL: ${apiUrl}`);
  
  const client = new GraphQLClient(apiUrl, {
    headers: {
      'Authorization': `Bearer ${SALEOR_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  try {
    // First try simple shop query
    console.log('📤 Testing basic shop query...');
    const shopData = await client.request(SIMPLE_QUERY);
    console.log('✅ Shop query successful!');
    console.log(`🏪 Shop Name: ${shopData.shop.name}`);
    console.log(`🌐 Domain: ${shopData.shop.domain.host}`);
    
    // Then try products query
    console.log('📤 Testing products query...');
    const productsData = await client.request(PRODUCTS_QUERY, {
      first: 5,
      channel: 'default-channel'
    });
    
    console.log('✅ Products query successful!');
    console.log(`📦 Found ${productsData.products.edges.length} products`);
    
    if (productsData.products.edges.length > 0) {
      console.log('\n🎯 Sample Products:');
      productsData.products.edges.slice(0, 3).forEach((edge, index) => {
        const product = edge.node;
        const price = product.pricing?.priceRange?.start?.gross;
        console.log(`  ${index + 1}. ${product.name}`);
        if (price) {
          console.log(`     Price: ${price.amount} ${price.currency}`);
        }
        console.log(`     Category: ${product.category?.name || 'Uncategorized'}`);
        console.log('');
      });
    }
    
    return { success: true, url: apiUrl };
    
  } catch (error) {
    console.error(`❌ Failed with ${description}:`);
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.errors || error.response.data);
    }
    return { success: false, error: error.message };
  }
}

async function testSaleorConnection() {
  console.log('🚀 Testing Live Saleor GraphQL Connection...');
  console.log(`🔑 Token: ${SALEOR_AUTH_TOKEN.substring(0, 20)}...`);
  
  // Test both URL formats
  const result1 = await testWithUrl(SALEOR_API_URL, 'URL with trailing slash');
  if (result1.success) {
    console.log('\n🎉 SUCCESS! Saleor GraphQL integration is working perfectly!');
    return result1;
  }
  
  const result2 = await testWithUrl(SALEOR_API_URL_ALT, 'URL without trailing slash');
  if (result2.success) {
    console.log('\n🎉 SUCCESS! Saleor GraphQL integration is working perfectly!');
    return result2;
  }
  
  console.log('\n❌ Both URL formats failed. Please check your Saleor configuration.');
  return { success: false };
}

// Run the test
testSaleorConnection()
  .then(result => {
    if (result.success) {
      console.log('🚀 Your FASHUN.CO platform is ready for high-performance e-commerce!');
      console.log(`✅ Working API URL: ${result.url}`);
    } else {
      console.log('🔧 Please verify your Saleor instance is active and accessible.');
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
  });