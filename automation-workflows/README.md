# n8n Automation Workflows for FASHUN.CO

This directory contains automated workflows for order processing, supplier management, social media automation, and customer communications.

## 🔄 Workflow Overview

### 1. Order Processing Workflow
- **Trigger**: New order placed via Strapi webhook
- **Actions**: 
  - Send order confirmation email
  - Generate invoice PDF
  - Update inventory levels
  - Notify suppliers for dropshipping
  - Create shipping labels
  - Send tracking information

### 2. Supplier Management Workflow
- **Trigger**: Low inventory alert or new order
- **Actions**:
  - Check supplier availability
  - Send purchase orders
  - Track order status
  - Update inventory upon receipt
  - Generate supplier performance reports

### 3. Social Media Automation
- **Trigger**: New product added or scheduled posts
- **Actions**:
  - Generate product mockups
  - Create social media content
  - Post to Instagram, Twitter, TikTok
  - Schedule story content
  - Track engagement metrics

### 4. Customer Communication
- **Trigger**: Various customer touchpoints
- **Actions**:
  - Welcome email series
  - Abandoned cart recovery
  - Order status updates
  - Review requests
  - Loyalty program updates

## 🚀 Setup Instructions

1. **Install n8n**
   ```bash
   npx n8n
   # Or using Docker
   docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
   ```

2. **Import Workflows**
   - Navigate to n8n interface (http://localhost:5678)
   - Go to Workflows > Import from File
   - Select each workflow JSON file

3. **Configure Credentials**
   - Set up email service (Gmail, SendGrid)
   - Configure webhooks for Strapi
   - Add social media API keys
   - Set payment gateway credentials

4. **Test Workflows**
   - Use test mode for initial setup
   - Verify webhook connections
   - Test email deliverability
   - Validate API integrations

## 📁 Workflow Files

- `order-processing.json` - Complete order fulfillment automation
- `supplier-management.json` - Supplier communication and inventory management
- `social-media.json` - Automated content creation and posting
- `customer-lifecycle.json` - Customer journey automation
- `inventory-alerts.json` - Stock level monitoring and alerts
- `analytics-reporting.json` - Automated performance reports

## 🔧 Configuration Variables

Set these environment variables in n8n:

```bash
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# API Endpoints
STRAPI_URL=https://your-backend.railway.app
AI_SERVICE_URL=https://your-ai-service.railway.app

# Social Media APIs
INSTAGRAM_ACCESS_TOKEN=your-token
TWITTER_API_KEY=your-key
TIKTOK_API_KEY=your-key

# Payment Processing
STRIPE_SECRET_KEY=sk_live_...
RAZORPAY_KEY_ID=rzp_live_...

# Supplier APIs
SUPPLIER_API_ENDPOINT=https://supplier-api.com
SHIPPING_API_KEY=your-shipping-key
```

## 📈 Monitoring & Analytics

Each workflow includes:
- Error handling and retry logic
- Performance metrics tracking
- Success/failure rate monitoring
- Cost tracking for API calls
- Execution time optimization

## 🛠️ Customization

Workflows are designed to be easily customizable:
- Modify trigger conditions
- Add new notification channels
- Integrate additional services
- Customize email templates
- Adjust timing and frequencies

## 🚨 Error Handling

All workflows include comprehensive error handling:
- Retry mechanisms for failed API calls
- Fallback notification methods
- Error logging and alerting
- Manual intervention triggers
- Recovery procedures

---

Start with the order processing workflow as it's the most critical for business operations.
