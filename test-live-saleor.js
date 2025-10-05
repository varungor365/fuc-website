/**
 * Direct Saleor GraphQL Test
 * Test connection to live Saleor instance
 */

const { GraphQLClient } = require('graphql-request');

const SALEOR_API_URL = 'https://fashun-store.saleor.cloud/graphql/';
const SALEOR_AUTH_TOKEN = 'a22ea8828ba5439b95476a53136a482d.VB3ey8kpAfquTIRE0gUKde9oVECIBXqGrnouFlvlmLcFTlRe';

const client = new GraphQLClient(SALEOR_API_URL, {
  headers: {
    'Authorization': `Bearer ${SALEOR_AUTH_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

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

async function testSaleorConnection() {
  console.log('🚀 Testing Live Saleor GraphQL Connection...');
  console.log(`📡 API URL: ${SALEOR_API_URL}`);
  console.log(`🔑 Token: ${SALEOR_AUTH_TOKEN.substring(0, 20)}...`);
  console.log('');

  try {
    const variables = {
      first: 5,
      channel: 'default-channel'
    };

    console.log('📤 Sending GraphQL query...');
    const data = await client.request(PRODUCTS_QUERY, variables);
    
    console.log('✅ SUCCESS! Saleor GraphQL API is working!');
    console.log(`📦 Found ${data.products.edges.length} products`);
    console.log('');
    
    if (data.products.edges.length > 0) {
      console.log('🎯 Sample Products:');
      data.products.edges.forEach((edge, index) => {
        const product = edge.node;
        const price = product.pricing.priceRange.start.gross;
        console.log(`  ${index + 1}. ${product.name}`);
        console.log(`     Price: ${price.amount} ${price.currency}`);
        console.log(`     Category: ${product.category?.name || 'Uncategorized'}`);
        console.log('');
      });
    }
    
    return { success: true, data: data.products.edges };
  } catch (error) {
    console.error('❌ FAILED! Saleor connection error:');
    console.error(error.message);
    
    if (error.response) {
      console.error('Response details:', error.response.errors);
    }
    
    return { success: false, error: error.message };
  }
}

// Run the test
testSaleorConnection()
  .then(result => {
    if (result.success) {
      console.log('🎉 Saleor GraphQL integration is working perfectly!');
      console.log('🚀 Your FASHUN.CO platform is ready for high-performance e-commerce!');
    } else {
      console.log('🔧 Please check your Saleor configuration and try again.');
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
  });