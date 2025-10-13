/**
 * Test FASHUN.CO Saleor with Simpler Query
 * Testing different authentication and query approaches
 */

const { GraphQLClient } = require('graphql-request');

const SALEOR_API_URL = 'https://fashunco.saleor.cloud/graphql/';
const SALEOR_AUTH_TOKEN = 'a22ea8828ba5439b95476a53136a482d.VB3ey8kpAfquTIRE0gUKde9oVECIBXqGrnouFlvlmLcFTlRe';

// Very simple introspection query to test basic connection
const INTROSPECTION_QUERY = `
  query {
    __schema {
      queryType {
        name
      }
    }
  }
`;

// Simple shop query without nested fields
const SIMPLE_SHOP_QUERY = `
  query {
    shop {
      name
    }
  }
`;

// Products query with minimal fields
const SIMPLE_PRODUCTS_QUERY = `
  query GetProducts($first: Int) {
    products(first: $first) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

async function testWithDifferentApproaches() {
  console.log('🔍 FASHUN.CO Saleor Connectivity Test');
  console.log('=====================================');
  console.log(`📡 API URL: ${SALEOR_API_URL}`);
  console.log('');

  // Test 1: Without authentication
  console.log('🧪 Test 1: Basic connection without auth...');
  try {
    const clientNoAuth = new GraphQLClient(SALEOR_API_URL);
    const result = await clientNoAuth.request(INTROSPECTION_QUERY);
    console.log('✅ Basic connection successful - GraphQL schema accessible');
  } catch (error) {
    console.log(`❌ Basic connection failed: ${error.message.substring(0, 100)}...`);
  }

  console.log('');

  // Test 2: With authentication - introspection
  console.log('🧪 Test 2: With authentication - introspection...');
  try {
    const clientAuth = new GraphQLClient(SALEOR_API_URL, {
      headers: {
        'Authorization': `Bearer ${SALEOR_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await clientAuth.request(INTROSPECTION_QUERY);
    console.log('✅ Authenticated introspection successful');
  } catch (error) {
    console.log(`❌ Authenticated introspection failed: ${error.message.substring(0, 100)}...`);
  }

  console.log('');

  // Test 3: Simple shop query
  console.log('🧪 Test 3: Simple shop query...');
  try {
    const clientAuth = new GraphQLClient(SALEOR_API_URL, {
      headers: {
        'Authorization': `Bearer ${SALEOR_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await clientAuth.request(SIMPLE_SHOP_QUERY);
    console.log('✅ Shop query successful!');
    console.log(`🏪 Shop Name: ${result.shop.name}`);
  } catch (error) {
    console.log(`❌ Shop query failed: ${error.message.substring(0, 100)}...`);
    if (error.response?.errors) {
      console.log('📋 GraphQL Errors:', JSON.stringify(error.response.errors, null, 2));
    }
  }

  console.log('');

  // Test 4: Simple products query
  console.log('🧪 Test 4: Simple products query...');
  try {
    const clientAuth = new GraphQLClient(SALEOR_API_URL, {
      headers: {
        'Authorization': `Bearer ${SALEOR_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await clientAuth.request(SIMPLE_PRODUCTS_QUERY, { first: 3 });
    console.log('✅ Products query successful!');
    console.log(`📦 Found ${result.products.edges.length} products`);
    
    if (result.products.edges.length > 0) {
      console.log('🎯 Product List:');
      result.products.edges.forEach((edge, index) => {
        console.log(`  ${index + 1}. ${edge.node.name} (ID: ${edge.node.id})`);
      });
    }
    
    return { success: true, productsCount: result.products.edges.length };
  } catch (error) {
    console.log(`❌ Products query failed: ${error.message.substring(0, 100)}...`);
    if (error.response?.errors) {
      console.log('📋 GraphQL Errors:', JSON.stringify(error.response.errors, null, 2));
    }
    return { success: false, error: error.message };
  }
}

// Run the comprehensive test
testWithDifferentApproaches()
  .then(result => {
    console.log('\n' + '='.repeat(50));
    if (result && result.success) {
      console.log('🎉 SUCCESS! FASHUN.CO Saleor integration is working!');
      console.log(`📊 Products available: ${result.productsCount}`);
      console.log('\n🚀 Next Steps:');
      console.log('1. Restart your Next.js development server');
      console.log('2. Your FASHUN.CO website should now load products from Saleor');
      console.log('3. Test the frontend integration');
    } else {
      console.log('⚠️  Some tests failed, but this helps us diagnose the issue');
      console.log('💡 Check the error details above for troubleshooting');
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
  });