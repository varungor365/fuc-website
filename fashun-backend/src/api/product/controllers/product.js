'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
  // Find products with advanced filtering
  async find(ctx) {
    const { query } = ctx;
    
    // Handle search parameter
    if (query.search) {
      query.$or = [
        { name: { $containsi: query.search } },
        { shortDescription: { $containsi: query.search } },
        { 'category.name': { $containsi: query.search } }
      ];
      delete query.search;
    }

    // Handle price range filter
    if (query.minPrice || query.maxPrice) {
      query.price = {};
      if (query.minPrice) query.price.$gte = query.minPrice;
      if (query.maxPrice) query.price.$lte = query.maxPrice;
      delete query.minPrice;
      delete query.maxPrice;
    }

    // Default populate
    query.populate = query.populate || {
      images: true,
      category: true,
      tags: true,
      variants: true,
      inventory: true,
      dimensions: true
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  // Find one product with full population
  async findOne(ctx) {
    const { id } = ctx.params;
    
    ctx.query.populate = {
      images: true,
      category: true,
      tags: true,
      variants: true,
      inventory: true,
      dimensions: true
    };

    const { data, meta } = await super.findOne(ctx);
    
    if (!data) {
      return ctx.notFound('Product not found');
    }

    return { data, meta };
  },

  // Get featured products
  async getFeatured(ctx) {
    const entity = await strapi.entityService.findMany('api::product.product', {
      filters: { 
        isFeatured: true,
        isActive: true,
        publishedAt: { $notNull: true }
      },
      populate: {
        images: true,
        category: true,
        tags: true,
        variants: true
      },
      sort: { createdAt: 'desc' },
      ...ctx.query
    });

    return this.transformResponse(entity);
  },

  // Get products by category
  async getByCategory(ctx) {
    const { categorySlug } = ctx.params;
    
    const category = await strapi.entityService.findMany('api::category.category', {
      filters: { slug: categorySlug },
      limit: 1
    });

    if (!category || category.length === 0) {
      return ctx.notFound('Category not found');
    }

    const products = await strapi.entityService.findMany('api::product.product', {
      filters: {
        category: category[0].id,
        isActive: true,
        publishedAt: { $notNull: true }
      },
      populate: {
        images: true,
        category: true,
        tags: true,
        variants: true
      },
      ...ctx.query
    });

    return this.transformResponse(products);
  },

  // Check stock availability
  async checkStock(ctx) {
    const { id } = ctx.params;
    const { variants } = ctx.request.body;

    const product = await strapi.entityService.findOne('api::product.product', id, {
      populate: ['variants', 'inventory']
    });

    if (!product) {
      return ctx.notFound('Product not found');
    }

    const stockStatus = {};

    if (variants && Array.isArray(variants)) {
      variants.forEach(variant => {
        const productVariant = product.variants.find(
          v => v.size === variant.size && v.color === variant.color
        );
        
        if (productVariant) {
          stockStatus[`${variant.size}-${variant.color}`] = {
            available: productVariant.stock >= (variant.quantity || 1),
            stock: productVariant.stock
          };
        } else {
          stockStatus[`${variant.size}-${variant.color}`] = {
            available: false,
            stock: 0
          };
        }
      });
    }

    return {
      productId: id,
      stockStatus,
      overallStock: product.inventory?.totalStock || 0
    };
  },

  // Update stock
  async updateStock(ctx) {
    const { id } = ctx.params;
    const { variants } = ctx.request.body;

    const product = await strapi.entityService.findOne('api::product.product', id, {
      populate: ['variants', 'inventory']
    });

    if (!product) {
      return ctx.notFound('Product not found');
    }

    // Update variant stocks
    if (variants && Array.isArray(variants)) {
      const updatedVariants = product.variants.map(variant => {
        const stockUpdate = variants.find(
          v => v.size === variant.size && v.color === variant.color
        );
        
        if (stockUpdate) {
          return {
            ...variant,
            stock: Math.max(0, variant.stock + stockUpdate.stockChange)
          };
        }
        return variant;
      });

      // Calculate total stock
      const totalStock = updatedVariants.reduce((sum, variant) => sum + variant.stock, 0);

      // Update product
      const updatedProduct = await strapi.entityService.update('api::product.product', id, {
        data: {
          variants: updatedVariants,
          inventory: {
            ...product.inventory,
            totalStock,
            availableStock: totalStock - (product.inventory?.reservedStock || 0),
            stockStatus: totalStock > 0 ? (totalStock <= (product.inventory?.lowStockThreshold || 10) ? 'low_stock' : 'in_stock') : 'out_of_stock'
          }
        },
        populate: {
          images: true,
          category: true,
          tags: true,
          variants: true,
          inventory: true
        }
      });

      return this.transformResponse(updatedProduct);
    }

    return ctx.badRequest('No variant stock updates provided');
  }
}));