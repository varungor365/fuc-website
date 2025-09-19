'use strict';

/**
 * Admin Dashboard Controller
 * Provides essential KPIs and statistics for the admin dashboard
 */

module.exports = {
  /**
   * Get overview statistics for admin dashboard
   */
  async getOverview(ctx) {
    try {
      // Get total sales
      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: { status: 'paid' }
      });
      
      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

      // Get counts
      const ordersCount = await strapi.entityService.count('api::order.order');
      const customersCount = await strapi.entityService.count('api::customer.customer');
      const productsCount = await strapi.entityService.count('api::product.product');

      ctx.body = {
        totalSales: totalSales.toFixed(2),
        ordersCount,
        customersCount,
        productsCount
      };
    } catch (error) {
      ctx.throw(500, 'Failed to fetch overview statistics');
    }
  }
};