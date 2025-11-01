'use strict';

/**
 * One-Click Product Addition Controller
 * Streamlined product creation with auto-generated SKU, slug, and description
 */

const slugify = require('slugify');
const crypto = require('crypto');

module.exports = {
  /**
   * Quick Add Product
   * Minimal input required: name, price, image, collection
   * Auto-generates: SKU, slug, description template, metadata
   */
  async quickAdd(ctx) {
    try {
      const { name, price, designImage, collection, category, sizes, colors } = ctx.request.body;

      // Validation
      if (!name || !price || !designImage) {
        return ctx.badRequest('Product name, price, and design image are required');
      }

      // Auto-generate SKU (e.g., FSH-2024-ABC123)
      const sku = `FSH-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      // Auto-generate URL slug
      const slug = slugify(name, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      }) + `-${crypto.randomBytes(2).toString('hex')}`;

      // Auto-generate description template based on product type
      const description = generateDescriptionTemplate(name, category);

      // Auto-generate metadata for SEO
      const metadata = {
        title: `${name} | FASHUN - Premium Streetwear`,
        description: `Shop ${name} - Exclusive streetwear design from FASHUN. Premium quality, bold style. ${description.substring(0, 100)}...`,
        keywords: generateKeywords(name, category, collection)
      };

      // Prepare product data
      const productData = {
        name,
        slug,
        sku,
        price: parseFloat(price),
        description,
        metadata,
        images: [designImage],
        collection,
        category: category || 'Streetwear',
        sizes: sizes || ['S', 'M', 'L', 'XL', 'XXL'],
        colors: colors || [],
        inStock: true,
        inventory: 50, // Default inventory
        publishedAt: new Date(),
        badge: 'NEW DROP',
        featured: false
      };

      // Create product in Strapi
      const product = await strapi.entityService.create('api::product.product', {
        data: productData
      });

      // Log activity
      await strapi.entityService.create('api::admin-activity.admin-activity', {
        data: {
          action: 'QUICK_PRODUCT_ADD',
          resource: 'product',
          resourceId: product.id,
          details: {
            productName: name,
            sku,
            generatedSlug: slug
          },
          adminUser: ctx.state.user?.id || 'system',
          timestamp: new Date()
        }
      });

      ctx.send({
        success: true,
        message: 'Product added successfully with auto-generated data',
        data: {
          product,
          generated: {
            sku,
            slug,
            descriptionPreview: description.substring(0, 150) + '...'
          }
        }
      });

    } catch (error) {
      console.error('Quick Add Product Error:', error);
      ctx.throw(500, `Failed to add product: ${error.message}`);
    }
  },

  /**
   * Bulk Quick Add Products
   * Add multiple products at once from CSV or JSON
   */
  async bulkQuickAdd(ctx) {
    try {
      const { products } = ctx.request.body;

      if (!Array.isArray(products) || products.length === 0) {
        return ctx.badRequest('Products array is required');
      }

      const results = {
        success: [],
        failed: [],
        total: products.length
      };

      for (const productData of products) {
        try {
          // Generate SKU and slug for each product
          const sku = `FSH-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
          const slug = slugify(productData.name, {
            lower: true,
            strict: true
          }) + `-${crypto.randomBytes(2).toString('hex')}`;

          const description = generateDescriptionTemplate(productData.name, productData.category);

          const product = await strapi.entityService.create('api::product.product', {
            data: {
              ...productData,
              sku,
              slug,
              description: productData.description || description,
              inStock: true,
              inventory: productData.inventory || 50,
              publishedAt: new Date()
            }
          });

          results.success.push({
            name: productData.name,
            sku,
            id: product.id
          });

        } catch (error) {
          results.failed.push({
            name: productData.name,
            error: error.message
          });
        }
      }

      ctx.send({
        success: true,
        message: `Bulk import completed: ${results.success.length} succeeded, ${results.failed.length} failed`,
        data: results
      });

    } catch (error) {
      console.error('Bulk Quick Add Error:', error);
      ctx.throw(500, `Bulk import failed: ${error.message}`);
    }
  },

  /**
   * Preview generated data before creating product
   */
  async preview(ctx) {
    try {
      const { name, category, collection } = ctx.request.body;

      if (!name) {
        return ctx.badRequest('Product name is required for preview');
      }

      const sku = `FSH-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      const slug = slugify(name, { lower: true, strict: true }) + `-${crypto.randomBytes(2).toString('hex')}`;
      const description = generateDescriptionTemplate(name, category);
      const keywords = generateKeywords(name, category, collection);

      ctx.send({
        success: true,
        preview: {
          sku,
          slug,
          description,
          keywords,
          url: `https://fashun.co.in/products/${slug}`,
          metadata: {
            title: `${name} | FASHUN - Premium Streetwear`,
            description: `Shop ${name} - Exclusive streetwear design from FASHUN.`
          }
        }
      });

    } catch (error) {
      console.error('Preview Error:', error);
      ctx.throw(500, `Preview failed: ${error.message}`);
    }
  }
};

/**
 * Helper Functions
 */

function generateDescriptionTemplate(name, category) {
  const templates = {
    'Tees': `Elevate your streetwear game with the ${name}. Crafted from premium 100% cotton, this tee features our signature bold design that speaks volumes. Perfect for making a statement wherever you go. Comfortable fit, durable fabric, and an eye-catching design that embodies the FASHUN spirit.`,
    
    'Hoodies': `Stay warm and stylish with the ${name}. This premium hoodie combines comfort with cutting-edge streetwear aesthetics. Featuring a soft fleece interior, adjustable drawstrings, and our iconic design, it's the perfect addition to your wardrobe.`,
    
    'Caps': `Complete your look with the ${name}. This premium cap features structured design, adjustable fit, and bold FASHUN branding. Perfect for adding that final touch to your streetwear outfit.`,
    
    'Accessories': `Upgrade your style with the ${name}. This premium accessory is designed to complement your streetwear collection while making a bold statement.`,
    
    'default': `Introducing the ${name} - a premium streetwear piece that combines style, quality, and attitude. Designed for those who dare to stand out, this product embodies the FASHUN philosophy of bold, unapologetic fashion. Made with attention to detail and crafted from high-quality materials.`
  };

  return templates[category] || templates['default'];
}

function generateKeywords(name, category, collection) {
  const baseKeywords = ['streetwear', 'fashion', 'fashun', 'urban wear', 'trendy clothing'];
  const categoryKeywords = {
    'Tees': ['graphic tee', 't-shirt', 'printed tee', 'designer tee'],
    'Hoodies': ['hoodie', 'sweatshirt', 'pullover', 'fleece'],
    'Caps': ['cap', 'snapback', 'hat', 'headwear'],
    'Accessories': ['accessories', 'fashion accessories', 'streetwear accessories']
  };

  const nameWords = name.toLowerCase().split(' ').filter(word => word.length > 3);
  const collectionWords = collection ? collection.toLowerCase().split(' ') : [];

  return [
    ...baseKeywords,
    ...(categoryKeywords[category] || []),
    ...nameWords,
    ...collectionWords
  ].join(', ');
}
