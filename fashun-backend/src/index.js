'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Initialize notification system
    try {
      strapi.log.info('Initializing FASHUN.CO Backend Services...');

      // Test notification service
      const notificationService = strapi.service('api::notification.notification');
      if (notificationService && notificationService.emailService) {
        await notificationService.init();
        strapi.log.info('✓ Notification service initialized');

        // Test email connection
        const emailTest = await notificationService.emailService.testConnection();
        if (emailTest.success) {
          strapi.log.info('✓ Email service connection verified');
        } else {
          strapi.log.warn('⚠ Email service connection failed:', emailTest.error);
        }
      }

      // Schedule background tasks
      setupCronJobs(strapi);

      // Initialize other services
      await initializeServices(strapi);

      strapi.log.info('✅ FASHUN.CO Backend Services initialized successfully');

    } catch (error) {
      strapi.log.error('❌ Failed to initialize backend services:', error);
    }
  },
};

// Setup cron jobs for background tasks
function setupCronJobs(strapi) {
  try {
    // Process scheduled notifications every minute
    setInterval(async () => {
      try {
        const notificationService = strapi.service('api::notification.notification');
        if (notificationService) {
          await notificationService.processScheduledNotifications();
        }
      } catch (error) {
        strapi.log.error('Cron job error - scheduled notifications:', error);
      }
    }, 60000); // Every 1 minute

    // Retry failed notifications every 10 minutes
    setInterval(async () => {
      try {
        const notificationService = strapi.service('api::notification.notification');
        if (notificationService) {
          await notificationService.retryFailedNotifications();
        }
      } catch (error) {
        strapi.log.error('Cron job error - retry failed notifications:', error);
      }
    }, 600000); // Every 10 minutes

    // Send abandoned cart reminders every hour
    setInterval(async () => {
      try {
        await sendAbandonedCartReminders(strapi);
      } catch (error) {
        strapi.log.error('Cron job error - abandoned cart reminders:', error);
      }
    }, 3600000); // Every 1 hour

    // Clean up old notifications daily
    setInterval(async () => {
      try {
        await cleanupOldNotifications(strapi);
      } catch (error) {
        strapi.log.error('Cron job error - notification cleanup:', error);
      }
    }, 86400000); // Every 24 hours

    strapi.log.info('✓ Background task schedulers initialized');

  } catch (error) {
    strapi.log.error('Failed to setup cron jobs:', error);
  }
}

// Send abandoned cart reminders
async function sendAbandonedCartReminders(strapi) {
  try {
    strapi.log.debug('Checking for abandoned carts...');
    // Abandoned cart logic would go here
  } catch (error) {
    strapi.log.error('Failed to send abandoned cart reminders:', error);
  }
}

// Clean up old notifications
async function cleanupOldNotifications(strapi) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedCount = await strapi.db.query('api::notification.notification').deleteMany({
      where: {
        createdAt: { $lt: thirtyDaysAgo },
        status: { $in: ['sent', 'delivered', 'failed'] }
      }
    });

    if (deletedCount > 0) {
      strapi.log.info(`Cleaned up ${deletedCount} old notifications`);
    }
  } catch (error) {
    strapi.log.error('Failed to cleanup old notifications:', error);
  }
}

// Initialize other services
async function initializeServices(strapi) {
  try {
    const apis = Object.keys(strapi.api || {});
    if (apis.length > 0) {
      strapi.log.info(`Available APIs: ${apis.join(', ')}`);
    }

    const plugins = Object.keys(strapi.plugins || {});
    if (plugins.length > 0) {
      strapi.log.info(`Loaded plugins: ${plugins.join(', ')}`);
    }
  } catch (error) {
    strapi.log.debug('Could not log services:', error.message);
  }
}
