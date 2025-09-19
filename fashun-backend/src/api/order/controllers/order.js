'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  // Create new order with inventory management
  async create(ctx) {
    const { data } = ctx.request.body;
    const user = ctx.state.user;

    try {
      // Generate unique order number
      const orderNumber = `FUC-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Validate and reserve inventory
      const stockValidation = await this.validateAndReserveStock(data.orderItems);
      if (!stockValidation.success) {
        return ctx.badRequest(stockValidation.message, stockValidation.details);
      }

      // Calculate totals
      const totals = await this.calculateOrderTotals(data.orderItems, data.shipping || 0, data.tax || 0, data.discount || 0);

      // Create order
      const orderData = {
        ...data,
        orderNumber,
        customer: user?.id,
        customerEmail: user?.email || data.customerEmail,
        subtotal: totals.subtotal,
        total: totals.total,
        status: 'pending',
        paymentStatus: 'pending'
      };

      const order = await strapi.entityService.create('api::order.order', {
        data: orderData,
        populate: {
          orderItems: {
            populate: ['product']
          },
          shippingAddress: true,
          billingAddress: true,
          customer: true
        }
      });

      // Send order confirmation email
      await this.sendOrderConfirmationEmail(order);

      return this.transformResponse(order);

    } catch (error) {
      strapi.log.error('Order creation failed:', error);
      return ctx.internalServerError('Failed to create order');
    }
  },

  // Find orders with user filtering
  async find(ctx) {
    const user = ctx.state.user;
    const { query } = ctx;

    // If not admin, only show user's own orders
    if (user && user.role?.type !== 'admin') {
      query.filters = {
        ...query.filters,
        customer: user.id
      };
    }

    query.populate = query.populate || {
      orderItems: {
        populate: ['product']
      },
      shippingAddress: true,
      billingAddress: true,
      customer: {
        populate: ['role']
      }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  // Update order status
  async updateStatus(ctx) {
    const { id } = ctx.params;
    const { status, paymentStatus, trackingNumber, notes } = ctx.request.body;

    const order = await strapi.entityService.findOne('api::order.order', id, {
      populate: {
        orderItems: {
          populate: ['product']
        },
        customer: true
      }
    });

    if (!order) {
      return ctx.notFound('Order not found');
    }

    const updateData = {};
    let emailType = null;

    // Handle status updates
    if (status && status !== order.status) {
      updateData.status = status;
      
      if (status === 'shipped') {
        updateData.shippedAt = new Date();
        emailType = 'shipped';
      } else if (status === 'delivered') {
        updateData.deliveredAt = new Date();
        emailType = 'delivered';
      } else if (status === 'cancelled') {
        // Release reserved inventory
        await this.releaseReservedStock(order.orderItems);
        emailType = 'cancelled';
      }
    }

    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      
      if (paymentStatus === 'paid') {
        emailType = 'payment_confirmed';
      }
    }

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    if (notes) {
      updateData.notes = notes;
    }

    // Update order
    const updatedOrder = await strapi.entityService.update('api::order.order', id, {
      data: updateData,
      populate: {
        orderItems: {
          populate: ['product']
        },
        shippingAddress: true,
        billingAddress: true,
        customer: true
      }
    });

    // Send status update email
    if (emailType) {
      await this.sendStatusUpdateEmail(updatedOrder, emailType);
    }

    return this.transformResponse(updatedOrder);
  },

  // Get order analytics
  async getAnalytics(ctx) {
    const { startDate, endDate } = ctx.query;

    const filters = {};
    if (startDate) filters.createdAt = { $gte: startDate };
    if (endDate) filters.createdAt = { ...filters.createdAt, $lte: endDate };

    const orders = await strapi.entityService.findMany('api::order.order', {
      filters,
      populate: ['orderItems']
    });

    const analytics = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0),
      averageOrderValue: 0,
      statusBreakdown: {
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        refunded: 0
      },
      paymentStatusBreakdown: {
        pending: 0,
        paid: 0,
        failed: 0,
        refunded: 0,
        partially_refunded: 0
      },
      topProducts: {}
    };

    // Calculate analytics
    orders.forEach(order => {
      analytics.statusBreakdown[order.status] = (analytics.statusBreakdown[order.status] || 0) + 1;
      analytics.paymentStatusBreakdown[order.paymentStatus] = (analytics.paymentStatusBreakdown[order.paymentStatus] || 0) + 1;

      // Track top products
      order.orderItems?.forEach(item => {
        const productName = item.productName;
        analytics.topProducts[productName] = (analytics.topProducts[productName] || 0) + item.quantity;
      });
    });

    analytics.averageOrderValue = analytics.totalOrders > 0 ? analytics.totalRevenue / analytics.totalOrders : 0;

    // Convert topProducts to sorted array
    analytics.topProducts = Object.entries(analytics.topProducts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    return analytics;
  },

  // Helper method: Validate and reserve stock
  async validateAndReserveStock(orderItems) {
    for (const item of orderItems) {
      const product = await strapi.entityService.findOne('api::product.product', item.product, {
        populate: ['variants', 'inventory']
      });

      if (!product) {
        return {
          success: false,
          message: `Product not found: ${item.productName}`,
          details: { productId: item.product }
        };
      }

      // Check variant stock if applicable
      if (item.variantSize && item.variantColor) {
        const variant = product.variants.find(
          v => v.size === item.variantSize && v.color === item.variantColor
        );

        if (!variant || variant.stock < item.quantity) {
          return {
            success: false,
            message: `Insufficient stock for ${item.productName} (${item.variantSize}, ${item.variantColor})`,
            details: { 
              productId: item.product, 
              requested: item.quantity, 
              available: variant?.stock || 0 
            }
          };
        }

        // Reserve stock
        variant.stock -= item.quantity;
      } else {
        // Check overall inventory
        if (!product.inventory || product.inventory.availableStock < item.quantity) {
          return {
            success: false,
            message: `Insufficient stock for ${item.productName}`,
            details: { 
              productId: item.product, 
              requested: item.quantity, 
              available: product.inventory?.availableStock || 0 
            }
          };
        }

        // Reserve stock
        product.inventory.availableStock -= item.quantity;
        product.inventory.reservedStock = (product.inventory.reservedStock || 0) + item.quantity;
      }

      // Update product inventory
      await strapi.entityService.update('api::product.product', item.product, {
        data: {
          variants: product.variants,
          inventory: product.inventory
        }
      });
    }

    return { success: true };
  },

  // Helper method: Release reserved stock
  async releaseReservedStock(orderItems) {
    for (const item of orderItems) {
      const product = await strapi.entityService.findOne('api::product.product', item.product, {
        populate: ['variants', 'inventory']
      });

      if (product) {
        if (item.variantSize && item.variantColor) {
          const variant = product.variants.find(
            v => v.size === item.variantSize && v.color === item.variantColor
          );
          if (variant) {
            variant.stock += item.quantity;
          }
        } else {
          product.inventory.availableStock += item.quantity;
          product.inventory.reservedStock = Math.max(0, (product.inventory.reservedStock || 0) - item.quantity);
        }

        await strapi.entityService.update('api::product.product', item.product, {
          data: {
            variants: product.variants,
            inventory: product.inventory
          }
        });
      }
    }
  },

  // Helper method: Calculate order totals
  async calculateOrderTotals(orderItems, shipping = 0, tax = 0, discount = 0) {
    let subtotal = 0;

    for (const item of orderItems) {
      subtotal += parseFloat(item.unitPrice) * item.quantity;
    }

    const total = subtotal + shipping + tax - discount;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  },

  // Helper method: Send order confirmation email
  async sendOrderConfirmationEmail(order) {
    try {
      // This would integrate with your email service
      strapi.log.info(`Order confirmation email should be sent for order: ${order.orderNumber}`);
      // Implementation would depend on your email plugin configuration
    } catch (error) {
      strapi.log.error('Failed to send order confirmation email:', error);
    }
  },

  // Helper method: Send status update email
  async sendStatusUpdateEmail(order, type) {
    try {
      strapi.log.info(`${type} email should be sent for order: ${order.orderNumber}`);
      // Implementation would depend on your email plugin configuration
    } catch (error) {
      strapi.log.error('Failed to send status update email:', error);
    }
  }
}));