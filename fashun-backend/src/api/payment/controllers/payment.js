'use strict';

/**
 * payment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = createCoreController('api::payment.payment', ({ strapi }) => ({
  // Create payment intent
  async createPaymentIntent(ctx) {
    try {
      const { orderId, amount, currency = 'inr' } = ctx.request.body;
      const user = ctx.state.user;

      if (!orderId || !amount) {
        return ctx.badRequest('Order ID and amount are required');
      }

      // Validate order
      const order = await strapi.entityService.findOne('api::order.order', orderId, {
        populate: ['customer', 'orderItems']
      });

      if (!order) {
        return ctx.notFound('Order not found');
      }

      // Check if user owns the order
      if (user && order.customer?.id !== user.id) {
        return ctx.forbidden('Access denied');
      }

      // Create Stripe Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          orderId: orderId.toString(),
          customerId: user?.id?.toString() || 'guest'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Create payment record
      const payment = await strapi.entityService.create('api::payment.payment', {
        data: {
          paymentId: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          stripePaymentIntentId: paymentIntent.id,
          order: orderId,
          customer: user?.id,
          amount,
          currency: currency.toUpperCase(),
          status: 'pending',
          paymentMethod: 'stripe',
          metadata: {
            stripe_payment_intent_id: paymentIntent.id,
            client_secret: paymentIntent.client_secret
          }
        }
      });

      return {
        paymentId: payment.paymentId,
        clientSecret: paymentIntent.client_secret,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        amount,
        currency,
        status: 'created'
      };

    } catch (error) {
      strapi.log.error('Payment intent creation failed:', error);
      return ctx.internalServerError('Failed to create payment intent');
    }
  },

  // Confirm payment
  async confirmPayment(ctx) {
    try {
      const { paymentIntentId, paymentMethodId } = ctx.request.body;

      if (!paymentIntentId) {
        return ctx.badRequest('Payment intent ID is required');
      }

      // Find payment record
      const payment = await strapi.entityService.findMany('api::payment.payment', {
        filters: { stripePaymentIntentId: paymentIntentId },
        populate: ['order'],
        limit: 1
      });

      if (!payment || payment.length === 0) {
        return ctx.notFound('Payment not found');
      }

      const paymentRecord = payment[0];

      // Confirm payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
        return_url: `${process.env.FRONTEND_URL}/payment/success?payment_intent=${paymentIntentId}`
      });

      // Update payment record
      await strapi.entityService.update('api::payment.payment', paymentRecord.id, {
        data: {
          status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'processing',
          paymentMethod: paymentIntent.payment_method?.type || 'unknown',
          paymentMethodDetails: {
            type: paymentIntent.payment_method?.type,
            last4: paymentIntent.payment_method?.card?.last4,
            brand: paymentIntent.payment_method?.card?.brand
          },
          processedAt: paymentIntent.status === 'succeeded' ? new Date() : null,
          receiptUrl: paymentIntent.charges?.data[0]?.receipt_url,
          fees: paymentIntent.charges?.data[0]?.balance_transaction?.fee / 100,
          netAmount: paymentIntent.charges?.data[0]?.balance_transaction?.net / 100,
          riskScore: paymentIntent.charges?.data[0]?.outcome?.risk_score,
          metadata: {
            ...paymentRecord.metadata,
            stripe_confirmation: paymentIntent
          }
        }
      });

      // Update order status if payment succeeded
      if (paymentIntent.status === 'succeeded') {
        await strapi.entityService.update('api::order.order', paymentRecord.order.id, {
          data: {
            paymentStatus: 'paid',
            status: 'confirmed'
          }
        });

        // Send order confirmation email
        await this.sendOrderConfirmationEmail(paymentRecord.order);
      }

      return {
        status: paymentIntent.status,
        paymentId: paymentRecord.paymentId,
        requiresAction: paymentIntent.status === 'requires_action',
        nextAction: paymentIntent.next_action
      };

    } catch (error) {
      strapi.log.error('Payment confirmation failed:', error);
      return ctx.internalServerError('Failed to confirm payment');
    }
  },

  // Handle Stripe webhooks
  async handleWebhook(ctx) {
    try {
      const sig = ctx.request.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !endpointSecret) {
        return ctx.badRequest('Missing signature or webhook secret');
      }

      let event;

      try {
        event = stripe.webhooks.constructEvent(ctx.request.body, sig, endpointSecret);
      } catch (err) {
        strapi.log.error('Webhook signature verification failed:', err.message);
        return ctx.badRequest('Invalid signature');
      }

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'payment_intent.canceled':
          await this.handlePaymentCanceled(event.data.object);
          break;
        case 'charge.dispute.created':
          await this.handleDisputeCreated(event.data.object);
          break;
        default:
          strapi.log.info('Unhandled webhook event type:', event.type);
      }

      return { received: true, type: event.type };

    } catch (error) {
      strapi.log.error('Webhook handling failed:', error);
      return ctx.internalServerError('Webhook processing failed');
    }
  },

  // Process refund
  async processRefund(ctx) {
    try {
      const { paymentId, amount, reason } = ctx.request.body;

      if (!paymentId) {
        return ctx.badRequest('Payment ID is required');
      }

      // Find payment record
      const payment = await strapi.entityService.findMany('api::payment.payment', {
        filters: { paymentId },
        populate: ['order'],
        limit: 1
      });

      if (!payment || payment.length === 0) {
        return ctx.notFound('Payment not found');
      }

      const paymentRecord = payment[0];

      if (paymentRecord.status !== 'succeeded') {
        return ctx.badRequest('Payment must be succeeded to refund');
      }

      // Create refund with Stripe
      const refund = await stripe.refunds.create({
        payment_intent: paymentRecord.stripePaymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
        reason: reason || 'requested_by_customer',
        metadata: {
          orderId: paymentRecord.order.id.toString(),
          paymentId: paymentId
        }
      });

      // Update payment record
      const refundedAmount = (paymentRecord.refundedAmount || 0) + (refund.amount / 100);
      const newStatus = refundedAmount >= paymentRecord.amount ? 'refunded' : 'partially_refunded';

      await strapi.entityService.update('api::payment.payment', paymentRecord.id, {
        data: {
          status: newStatus,
          refundedAmount,
          metadata: {
            ...paymentRecord.metadata,
            refunds: [...(paymentRecord.metadata.refunds || []), refund]
          }
        }
      });

      // Update order status
      await strapi.entityService.update('api::order.order', paymentRecord.order.id, {
        data: {
          paymentStatus: newStatus,
          status: newStatus === 'refunded' ? 'refunded' : paymentRecord.order.status
        }
      });

      return {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        reason: refund.reason
      };

    } catch (error) {
      strapi.log.error('Refund processing failed:', error);
      return ctx.internalServerError('Failed to process refund');
    }
  },

  // Get payment analytics
  async getAnalytics(ctx) {
    try {
      const { startDate, endDate } = ctx.query;

      const filters = {};
      if (startDate) filters.createdAt = { $gte: startDate };
      if (endDate) filters.createdAt = { ...filters.createdAt, $lte: endDate };

      const payments = await strapi.entityService.findMany('api::payment.payment', {
        filters
      });

      const analytics = {
        totalPayments: payments.length,
        totalAmount: payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0),
        totalRefunded: payments.reduce((sum, payment) => sum + parseFloat(payment.refundedAmount || 0), 0),
        statusBreakdown: {
          pending: 0,
          processing: 0,
          succeeded: 0,
          failed: 0,
          canceled: 0,
          refunded: 0,
          partially_refunded: 0
        },
        paymentMethods: {},
        averageTransactionValue: 0,
        successRate: 0,
        fraudDetected: payments.filter(p => p.fraudDetected).length
      };

      // Calculate breakdowns
      payments.forEach(payment => {
        analytics.statusBreakdown[payment.status] = (analytics.statusBreakdown[payment.status] || 0) + 1;
        analytics.paymentMethods[payment.paymentMethod] = (analytics.paymentMethods[payment.paymentMethod] || 0) + 1;
      });

      analytics.averageTransactionValue = analytics.totalPayments > 0 ? analytics.totalAmount / analytics.totalPayments : 0;
      analytics.successRate = analytics.totalPayments > 0 ? (analytics.statusBreakdown.succeeded / analytics.totalPayments) * 100 : 0;

      return analytics;

    } catch (error) {
      strapi.log.error('Payment analytics failed:', error);
      return ctx.internalServerError('Failed to get payment analytics');
    }
  },

  // Helper methods
  async handlePaymentSucceeded(paymentIntent) {
    try {
      const payment = await strapi.entityService.findMany('api::payment.payment', {
        filters: { stripePaymentIntentId: paymentIntent.id },
        populate: ['order'],
        limit: 1
      });

      if (payment && payment.length > 0) {
        const paymentRecord = payment[0];
        
        await strapi.entityService.update('api::payment.payment', paymentRecord.id, {
          data: {
            status: 'succeeded',
            processedAt: new Date(),
            receiptUrl: paymentIntent.charges?.data[0]?.receipt_url,
            fees: paymentIntent.charges?.data[0]?.balance_transaction?.fee / 100,
            netAmount: paymentIntent.charges?.data[0]?.balance_transaction?.net / 100
          }
        });

        // Update order
        await strapi.entityService.update('api::order.order', paymentRecord.order.id, {
          data: {
            paymentStatus: 'paid',
            status: 'confirmed'
          }
        });

        strapi.log.info('Payment succeeded:', paymentIntent.id);
      }
    } catch (error) {
      strapi.log.error('Error handling payment succeeded:', error);
    }
  },

  async handlePaymentFailed(paymentIntent) {
    try {
      const payment = await strapi.entityService.findMany('api::payment.payment', {
        filters: { stripePaymentIntentId: paymentIntent.id },
        populate: ['order'],
        limit: 1
      });

      if (payment && payment.length > 0) {
        const paymentRecord = payment[0];
        
        await strapi.entityService.update('api::payment.payment', paymentRecord.id, {
          data: {
            status: 'failed',
            failureReason: paymentIntent.last_payment_error?.message || 'Payment failed'
          }
        });

        // Update order
        await strapi.entityService.update('api::order.order', paymentRecord.order.id, {
          data: {
            paymentStatus: 'failed'
          }
        });

        strapi.log.info('Payment failed:', paymentIntent.id);
      }
    } catch (error) {
      strapi.log.error('Error handling payment failed:', error);
    }
  },

  async handlePaymentCanceled(paymentIntent) {
    try {
      const payment = await strapi.entityService.findMany('api::payment.payment', {
        filters: { stripePaymentIntentId: paymentIntent.id },
        limit: 1
      });

      if (payment && payment.length > 0) {
        const paymentRecord = payment[0];
        
        await strapi.entityService.update('api::payment.payment', paymentRecord.id, {
          data: {
            status: 'canceled'
          }
        });

        strapi.log.info('Payment canceled:', paymentIntent.id);
      }
    } catch (error) {
      strapi.log.error('Error handling payment canceled:', error);
    }
  },

  async handleDisputeCreated(dispute) {
    try {
      strapi.log.warn('Dispute created:', dispute.id);
      // Handle dispute logic here
    } catch (error) {
      strapi.log.error('Error handling dispute:', error);
    }
  },

  async sendOrderConfirmationEmail(order) {
    try {
      // Email logic would be implemented here
      strapi.log.info(`Order confirmation email should be sent for order: ${order.orderNumber}`);
    } catch (error) {
      strapi.log.error('Failed to send confirmation email:', error);
    }
  }
}));