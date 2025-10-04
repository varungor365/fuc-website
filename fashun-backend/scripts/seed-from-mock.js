#!/usr/bin/env node

/**
 * Seed script to populate Strapi with products from mockProducts data
 * Run with: npm run seed
 * 
 * Prerequisites:
 * 1. Strapi backend running (npm run develop)
 * 2. Product content-type created in Strapi admin
 * 3. API permissions configured (Public role can create products)
 */

require('dotenv').config()

// Import the products data from fashun-store
const { products } = require('../fashun-store/src/data/products')

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

// Check if product already exists by slug or name
async function checkProductExists(name, slug) {
  try {
    const searchParams = new URLSearchParams()
    searchParams.append('filters[name][$eq]', name)
    
    const response = await fetch(`${STRAPI_URL}/api/products?${searchParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to check product: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.data && data.data.length > 0
  } catch (error) {
    console.error('Error checking product existence:', error.message)
    return false
  }
}

// Create a single product in Strapi
async function createProduct(product) {
  try {
    // Check if product already exists
    const exists = await checkProductExists(product.name)
    if (exists) {
      console.log(`⏭️  Skipping ${product.name} - already exists`)
      return { success: true, skipped: true }
    }
    
    // Transform product data for Strapi format
    const strapiProduct = {
      name: product.name,
      slug: product.id, // Use ID as slug for now
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      subcategory: product.subcategory,
      brand: 'FASHUN.CO', // Default brand
      colors: product.colors.map(color => ({ name: color, value: color })),
      sizes: product.sizes.map(size => ({ name: size, value: size.toLowerCase(), stock: 10 })),
      features: product.tags || [], // Use tags as features
      material: product.material || 'Cotton Blend',
      care: ['Machine wash cold', 'Tumble dry low'],
      tags: product.tags || [],
      rating: product.rating || 0,
      reviewsCount: product.reviews || 0,
      badges: product.isNew ? ['New'] : (product.isFeatured ? ['Featured'] : []),
      inStock: product.inStock !== false,
      isNew: product.isNew || false,
      isBestseller: product.isFeatured || false,
      isOnSale: !!product.originalPrice,
    }
    
    // Create product in Strapi
    const response = await fetch(`${STRAPI_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: JSON.stringify({ data: strapiProduct }),
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorData}`)
    }
    
    const result = await response.json()
    console.log(`✅ Created: ${product.name}`)
    return { success: true, data: result.data }
    
  } catch (error) {
    console.error(`❌ Failed to create ${product.name}:`, error.message)
    return { success: false, error: error.message }
  }
}

// Main seed function
async function seedProducts() {
  console.log('\n🌱 Starting seed process...')
  console.log(`📡 Strapi URL: ${STRAPI_URL}`)
  console.log(`🔑 Using API Token: ${STRAPI_TOKEN ? 'Yes' : 'No (public access)'}`)
  console.log(`📦 Total products to seed: ${products.length}`)
  console.log('\n' + '='.repeat(50))
  
  let successful = 0
  let skipped = 0
  let failed = 0
  
  // Process each product
  for (const product of products) {
    const result = await createProduct(product)
    
    if (result.success) {
      if (result.skipped) {
        skipped++
      } else {
        successful++
      }
    } else {
      failed++
    }
    
    // Small delay to avoid overwhelming Strapi
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 SEED SUMMARY:')
  console.log(`✅ Successfully created: ${successful}`)
  console.log(`⏭️  Skipped (already exist): ${skipped}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📦 Total processed: ${successful + skipped + failed}`)
  
  if (failed > 0) {
    console.log('\n⚠️  Some products failed to create. Check the errors above.')
    console.log('💡 Common issues:')
    console.log('   - Strapi backend not running')
    console.log('   - Product content-type not created')
    console.log('   - API permissions not configured')
    process.exit(1)
  } else {
    console.log('\n🎉 Seed process completed successfully!')
    console.log('\n👉 Next steps:')
    console.log('   1. Check Strapi admin: http://localhost:1337/admin')
    console.log('   2. Test API: http://localhost:1337/api/products')
    console.log('   3. Start frontend and test integration')
  }
}

// Health check before seeding
async function healthCheck() {
  try {
    console.log('🔍 Checking Strapi connection...')
    const response = await fetch(`${STRAPI_URL}/api/products`, {
      headers: {
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
    })
    
    if (response.ok) {
      console.log('✅ Strapi is running and accessible')
      return true
    } else if (response.status === 404) {
      console.error('❌ Product content-type not found. Please create it in Strapi admin first.')
      return false
    } else {
      console.error(`❌ Strapi returned status: ${response.status}`)
      return false
    }
  } catch (error) {
    console.error('❌ Cannot connect to Strapi:', error.message)
    console.log('💡 Make sure Strapi is running: npm run develop')
    return false
  }
}

// Run the seed process
async function main() {
  console.log('🚀 FASHUN.CO Product Seeder')
  
  // Health check first
  const isHealthy = await healthCheck()
  if (!isHealthy) {
    process.exit(1)
  }
  
  // Run seed
  await seedProducts()
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error)
  process.exit(1)
})

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Seed process failed:', error)
    process.exit(1)
  })
}

module.exports = { seedProducts, createProduct, checkProductExists }