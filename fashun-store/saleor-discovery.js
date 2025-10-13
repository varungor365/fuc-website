/**
 * Alternative Saleor Testing with Demo Instance
 * Since fashun-store.saleor.cloud is not accessible, let's try the public demo
 */

const { GraphQLClient } = require('graphql-request');

// Saleor Demo Instance (public, no auth required)
const DEMO_API_URL = 'https://demo.saleor.io/graphql/';

// Saleor Cloud alternatives to try
const ALTERNATIVE_URLS = [
  'https://fashun-store.eu-west-1.saleor.cloud/graphql/',
  'https://fashun-store.us-east-1.saleor.cloud/graphql/',
  'https://fashun-store.ap-southeast-1.saleor.cloud/graphql/',
];

const YOUR_TOKEN = 'a22ea8828ba5439b95476a53136a482d.VB3ey8kpAfquTIRE0gUKde9oVECIBXqGrnouFlvlmLcFTlRe';

const SIMPLE_QUERY = `
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
    }
  }
`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int, $channel: String) {
    products(first: $first, channel: $channel) {
      edges {
        node {
          id
          name
          slug
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
          }
        }
      }
    }
  }
`;

async function testDemoInstance() {
  console.log('🚀 Testing Saleor Demo Instance...');
  console.log(`📡 Demo URL: ${DEMO_API_URL}`);
  
  const client = new GraphQLClient(DEMO_API_URL);
  
  try {
    // Test demo instance (no auth required)
    const shopData = await client.request(SIMPLE_QUERY);
    console.log('✅ Demo instance working!');
    console.log(`🏪 Shop: ${shopData.shop.name}`);
    console.log(`🌐 Domain: ${shopData.shop.domain.host}`);
    console.log(`🌍 Country: ${shopData.shop.defaultCountry.country} (${shopData.shop.defaultCountry.code})`);
    
    // Test products
    const productsData = await client.request(PRODUCTS_QUERY, {
      first: 3,
      channel: 'default-channel'
    });
    
    console.log(`📦 Found ${productsData.products.edges.length} demo products`);
    
    if (productsData.products.edges.length > 0) {
      console.log('\n🎯 Demo Products:');
      productsData.products.edges.forEach((edge, index) => {
        const product = edge.node;
        const price = product.pricing?.priceRange?.start?.gross;
        console.log(`  ${index + 1}. ${product.name}`);
        if (price) {
          console.log(`     Price: ${price.amount} ${price.currency}`);
        }
        console.log(`     Category: ${product.category?.name || 'N/A'}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Demo instance failed:', error.message);
    return false;
  }
}

async function testAlternativeUrls() {
  console.log('\n🔄 Testing alternative Saleor Cloud regions...');
  
  for (const url of ALTERNATIVE_URLS) {
    console.log(`\n📡 Testing: ${url}`);
    
    const client = new GraphQLClient(url, {
      headers: {
        'Authorization': `Bearer ${YOUR_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    try {
      const shopData = await client.request(SIMPLE_QUERY);
      console.log('✅ SUCCESS! Found your Saleor instance!');
      console.log(`🏪 Shop: ${shopData.shop.name}`);
      console.log(`🌐 Domain: ${shopData.shop.domain.host}`);
      console.log(`🌍 Country: ${shopData.shop.defaultCountry.country}`);
      console.log(`🎯 Correct API URL: ${url}`);
      
      // Update environment file with correct URL
      console.log('\n📝 Update your .env.local with this URL:');
      console.log(`NEXT_PUBLIC_SALEOR_API_URL=${url}`);
      
      return { success: true, url, shopData };
    } catch (error) {
      console.log(`❌ Failed: ${error.message.substring(0, 100)}...`);
    }
  }
  
  return { success: false };
}

async function main() {
  console.log('🔍 SALEOR INSTANCE DISCOVERY TOOL');
  console.log('=================================\n');
  
  // First test demo instance to verify GraphQL client works
  const demoWorks = await testDemoInstance();
  
  if (!demoWorks) {
    console.log('❌ Network issues - cannot connect to any Saleor instance');
    return;
  }
  
  // Now test your token with alternative URLs
  const result = await testAlternativeUrls();
  
  if (result.success) {
    console.log('\n🎉 SOLUTION FOUND!');
    console.log(`✅ Your Saleor instance is at: ${result.url}`);
    console.log('📋 Next steps:');
    console.log('1. Update .env.local with the correct URL above');
    console.log('2. Restart your development server');
    console.log('3. Test your FASHUN.CO integration');
  } else {
    console.log('\n⚠️  Your token might be for a different region or instance');
    console.log('💡 Recommendations:');
    console.log('1. Check your Saleor Cloud dashboard for the exact URL');
    console.log('2. Verify your instance is active and deployed');
    console.log('3. Consider using the demo instance for development:');
    console.log(`   NEXT_PUBLIC_SALEOR_API_URL=${DEMO_API_URL}`);
  }
}

main().catch(console.error);