'use strict';

/**
 * Order lifecycle hooks to trigger notifications and other automated processes
 */

module.exports = {
  // After order creation
  async afterCreate(event) {
    try {
      const { result } = event;
      
      // Send order confirmation notification
      if (result && result.id) {
        try {
          await strapi.service('api::notification.notification').sendOrderNotification(
            result.id, 
            'order_confirmation'
          );
          
          strapi.log.info(`Order confirmation notification sent for order: ${result.orderNumber}`);
        } catch (error) {
          strapi.log.error('Failed to send order confirmation notification:', error);
        }
      }

      // Update inventory for ordered items
      if (result.orderItems && result.orderItems.length > 0) {
        try {
          await updateInventoryAfterOrder(result.orderItems);
          strapi.log.info(`Inventory updated for order: ${result.orderNumber}`);
        } catch (error) {
          strapi.log.error('Failed to update inventory after order:', error);
        }
      }

      // Update customer loyalty points if customer exists
      if (result.customer) {
        try {
          await updateLoyaltyPoints(result.customer, result.total);
          strapi.log.info(`Loyalty points updated for customer after order: ${result.orderNumber}`);
        } catch (error) {
          strapi.log.error('Failed to update loyalty points:', error);
        }
      }

    } catch (error) {
      strapi.log.error('Order afterCreate lifecycle error:', error);
    }
  },

  // After order update
  async afterUpdate(event) {
    try {
      const { result, params } = event;
      const { data } = params;

      // Check if order status changed
      if (data.status && result.status !== event.beforeUpdate?.status) {
        await handleOrderStatusChange(result, data.status, event.beforeUpdate?.status);
      }

      // Check if payment status changed
      if (data.paymentStatus && result.paymentStatus !== event.beforeUpdate?.paymentStatus) {
        await handlePaymentStatusChange(result, data.paymentStatus, event.beforeUpdate?.paymentStatus);
      }

      // Check if tracking information was added
      if (data.trackingNumber && !event.beforeUpdate?.trackingNumber) {
        await handleOrderShipped(result);
      }

    } catch (error) {
      strapi.log.error('Order afterUpdate lifecycle error:', error);
    }
  },

  // Before order update (to capture previous state)
  async beforeUpdate(event) {
    try {
      const { params } = event;
      
      if (params.where && params.where.id) {
        const existingOrder = await strapi.entityService.findOne('api::order.order', params.where.id);
        event.beforeUpdate = existingOrder;
      }
    } catch (error) {
      strapi.log.error('Order beforeUpdate lifecycle error:', error);
    }
  }
};

// Helper function to handle order status changes
async function handleOrderStatusChange(order, newStatus, oldStatus) {
  try {
    strapi.log.info(`Order ${order.orderNumber} status changed from ${oldStatus} to ${newStatus}`);

    switch (newStatus) {
      case 'processing':
        // Order is being processed
        break;

      case 'shipped':
        await strapi.service('api::notification.notification').sendOrderNotification(
          order.id, 
          'order_shipped',
          {
            trackingNumber: order.trackingNumber,
            carrier: order.carrier,
            estimatedDelivery: order.estimatedDeliveryDate,
            trackingUrl: generateTrackingUrl(order.trackingNumber, order.carrier)
          }
        );
        break;

      case 'delivered':
        await strapi.service('api::notification.notification').sendOrderNotification(
          order.id, 
          'order_delivered'
        );
        
        // Schedule review request notification for 3 days later
        const reviewDate = new Date();
        reviewDate.setDate(reviewDate.getDate() + 3);
        
        await strapi.service('api::notification.notification').sendNotification({
          recipientEmail: order.customerEmail,
          type: 'review_request',
          templateId: 'review_request',
          templateData: {
            orderNumber: order.orderNumber,
            customerName: order.customer?.firstName || 'Valued Customer'
          },
          scheduledAt: reviewDate,
          relatedOrder: order.id,
          priority: 'low'
        });
        break;

      case 'cancelled':
        // Handle order cancellation
        await handleOrderCancellation(order);
        break;

      case 'refunded':
        // Handle order refund
        await strapi.service('api::notification.notification').sendOrderNotification(
          order.id, 
          'order_refunded'
        );
        break;
    }

  } catch (error) {
    strapi.log.error('Failed to handle order status change:', error);
  }
}

// Helper function to handle payment status changes
async function handlePaymentStatusChange(order, newPaymentStatus, oldPaymentStatus) {
  try {
    strapi.log.info(`Order ${order.orderNumber} payment status changed from ${oldPaymentStatus} to ${newPaymentStatus}`);

    switch (newPaymentStatus) {
      case 'paid':
        await strapi.service('api::notification.notification').sendOrderNotification(
          order.id, 
          'payment_confirmed'
        );
        break;

      case 'failed':
        await strapi.service('api::notification.notification').sendOrderNotification(
          order.id, 
          'payment_failed'
        );
        break;

      case 'refunded':
        await strapi.service('api::notification.notification').sendOrderNotification(
          order.id, 
          'payment_refunded'
        );
        break;
    }

  } catch (error) {
    strapi.log.error('Failed to handle payment status change:', error);
  }
}

// Helper function to handle order shipment
async function handleOrderShipped(order) {
  try {
    if (order.trackingNumber) {
      await strapi.service('api::notification.notification').sendOrderNotification(
        order.id, 
        'order_shipped',
        {
          trackingNumber: order.trackingNumber,
          carrier: order.carrier,
          trackingUrl: generateTrackingUrl(order.trackingNumber, order.carrier)
        }
      );
    }
  } catch (error) {
    strapi.log.error('Failed to handle order shipped:', error);
  }
}

// Helper function to handle order cancellation
async function handleOrderCancellation(order) {
  try {
    // Send cancellation notification
    await strapi.service('api::notification.notification').sendOrderNotification(
      order.id, 
      'order_cancelled'
    );

    // Restore inventory for cancelled items
    if (order.orderItems && order.orderItems.length > 0) {
      await restoreInventoryAfterCancellation(order.orderItems);
    }

    // Process refund if payment was completed
    if (order.paymentStatus === 'paid') {
      // This would trigger refund processing
      strapi.log.info(`Refund should be processed for cancelled order: ${order.orderNumber}`);
    }

  } catch (error) {
    strapi.log.error('Failed to handle order cancellation:', error);
  }
}

// Helper function to update inventory after order
async function updateInventoryAfterOrder(orderItems) {
  try {
    for (const item of orderItems) {
      if (item.product) {
        const product = await strapi.entityService.findOne('api::product.product', item.product, {
          populate: ['inventory', 'variants']
        });

        if (product && product.inventory) {
          // Update main product inventory
          const newQuantity = Math.max(0, product.inventory.quantity - item.quantity);
          
          await strapi.entityService.update('api::inventory.inventory', product.inventory.id, {
            data: {
              quantity: newQuantity,
              lastUpdated: new Date()
            }
          });

          // Check if product is now out of stock
          if (newQuantity === 0 && product.inventory.quantity > 0) {
            // Product went out of stock, could trigger restock notifications
            strapi.log.info(`Product ${product.name} is now out of stock`);
          } else if (newQuantity <= product.inventory.lowStockThreshold) {
            // Low stock warning
            strapi.log.warn(`Product ${product.name} is running low on stock: ${newQuantity} remaining`);
          }
        }
      }
    }
  } catch (error) {
    strapi.log.error('Failed to update inventory:', error);
  }
}

// Helper function to restore inventory after cancellation
async function restoreInventoryAfterCancellation(orderItems) {
  try {
    for (const item of orderItems) {
      if (item.product) {
        const product = await strapi.entityService.findOne('api::product.product', item.product, {
          populate: ['inventory']
        });

        if (product && product.inventory) {
          const newQuantity = product.inventory.quantity + item.quantity;
          
          await strapi.entityService.update('api::inventory.inventory', product.inventory.id, {
            data: {
              quantity: newQuantity,
              lastUpdated: new Date()
            }
          });

          // Check if product came back in stock
          if (product.inventory.quantity === 0 && newQuantity > 0) {
            // Product is back in stock, send notifications to waiting customers
            await handleBackInStockNotification(product);
          }
        }
      }
    }
  } catch (error) {
    strapi.log.error('Failed to restore inventory:', error);
  }
}

// Helper function to handle back in stock notifications
async function handleBackInStockNotification(product) {
  try {
    // Find users who have this product in their wishlist or have requested stock notifications
    // This would depend on your wishlist/notification request system
    
    // For now, we'll log that the product is back in stock
    strapi.log.info(`Product ${product.name} is back in stock and available for purchase`);

    // You could implement a "notify when back in stock" feature here
    // const interestedUsers = await findUsersInterestedInProduct(product.id);
    // if (interestedUsers.length > 0) {
    //   await strapi.service('api::notification.notification').sendProductNotification(
    //     product.id,
    //     interestedUsers.map(user => user.email),
    //     'back_in_stock'
    //   );
    // }

  } catch (error) {
    strapi.log.error('Failed to handle back in stock notification:', error);
  }
}

// Helper function to update loyalty points
async function updateLoyaltyPoints(customerId, orderTotal) {
  try {
    const customer = await strapi.query('plugin::users-permissions.user').findOne({
      where: { id: customerId },
      populate: ['loyalty']
    });

    if (customer && customer.loyalty) {
      // Calculate points earned (e.g., 1 point per dollar)
      const pointsEarned = Math.floor(orderTotal);
      const newTotalPoints = customer.loyalty.totalPoints + pointsEarned;

      await strapi.entityService.update('api::loyalty.loyalty', customer.loyalty.id, {
        data: {
          totalPoints: newTotalPoints,
          currentPoints: customer.loyalty.currentPoints + pointsEarned,
          lastEarned: new Date(),
          lifetimeSpent: customer.loyalty.lifetimeSpent + orderTotal
        }
      });

      // Send loyalty update notification
      await strapi.service('api::notification.notification').sendUserNotification(
        customerId,
        'loyalty_update',
        {
          pointsEarned,
          totalPoints: newTotalPoints
        }
      );

      strapi.log.info(`Customer ${customer.email} earned ${pointsEarned} loyalty points`);
    }

  } catch (error) {
    strapi.log.error('Failed to update loyalty points:', error);
  }
}

// Helper function to generate tracking URL
function generateTrackingUrl(trackingNumber, carrier) {
  const trackingUrls = {
    'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'fedex': `https://www.fedex.com/fedextrack/?tracknum=${trackingNumber}`,
    'usps': `https://tools.usps.com/go/TrackConfirmAction_input?strOrigTrackNum=${trackingNumber}`,
    'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
  };

  return trackingUrls[carrier?.toLowerCase()] || `#tracking-${trackingNumber}`;
}