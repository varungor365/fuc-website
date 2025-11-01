# n8n Quick Setup Guide for FASHUN

## Installation

```bash
# Install n8n globally
npm install -g n8n

# Start n8n
n8n start

# Access dashboard
# Open browser: http://localhost:5678
```

## Initial Configuration

### 1. Create Account
- First time: Create admin account
- Set strong password
- Enable 2FA (recommended)

### 2. Add Credentials

Go to **Settings → Credentials** and add:

#### Supabase
- **Name:** FASHUN Supabase
- **Host:** Your Supabase URL
- **Service Role Key:** Your Supabase service key

#### Razorpay
- **Key ID:** Your Razorpay key
- **Key Secret:** Your Razorpay secret

#### Twilio
- **Account SID:** Your Twilio SID
- **Auth Token:** Your Twilio token
- **WhatsApp Number:** Your Twilio WhatsApp number

#### Gmail/SendGrid
- **Email:** your-email@domain.com
- **App Password:** Generated app password

#### Telegram Bot
- **Access Token:** Bot token from @BotFather

#### Strapi
- **URL:** http://localhost:1337
- **API Token:** Your Strapi API token

## Import Workflows

1. Go to **Workflows** → **Import from File**
2. Select workflow JSON from `/n8n-workflows/` directory
3. Configure credentials for each node
4. Test workflow with sample data
5. Activate workflow

## Priority Workflows to Set Up First

### Week 1: Critical Operations
1. **Order Confirmation** (`01-order-confirmation-automation.json`)
   - Configure Razorpay webhook
   - Test email templates
   - Test WhatsApp notifications

### Week 2: Customer Engagement  
2. **Abandoned Cart** (`02-abandoned-cart-recovery.json`)
   - Set up hourly cron job
   - Configure discount code generation
   - Test recovery sequence

### Week 3: Additional Automation
3. Inventory alerts
4. Review requests
5. Social media posting

## Testing Workflows

### Test Order Confirmation:
```bash
# Send test webhook to n8n
curl -X POST http://localhost:5678/webhook/razorpay-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment.captured",
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_test123",
          "order_id": "order_test123",
          "amount": 129900,
          "method": "upi",
          "email": "test@example.com",
          "contact": "+919876543210"
        }
      }
    }
  }'
```

## Webhook URLs

After importing workflows, get webhook URLs:

1. Open workflow
2. Click on Webhook node
3. Copy **Production URL**
4. Add to Razorpay/Instagram settings

### Razorpay Webhook Setup:
1. Go to Razorpay Dashboard → Webhooks
2. Add new webhook
3. URL: `https://automations.fashun.co.in/webhook/razorpay-webhook`
4. Events: `payment.captured`, `payment.failed`
5. Secret: Generate and save in n8n

## Monitoring

### View Executions:
- **Executions** tab shows all runs
- Filter by workflow
- View input/output data
- Check error logs

### Set Up Alerts:
1. Create error handling workflow
2. Send to Telegram/Slack on failure
3. Set up retry logic

## Environment Variables

Create `.env` in n8n directory:

```env
# Database (for n8n data)
DB_TYPE=sqlite
DB_SQLITE_DATABASE=database.sqlite

# Timezone
GENERIC_TIMEZONE=Asia/Kolkata

# Webhook URL
WEBHOOK_URL=https://automations.fashun.co.in/

# Execution limits
N8N_PAYLOAD_SIZE_MAX=16
N8N_METRICS=true
```

## Production Deployment

### Option 1: Docker
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Option 2: PM2
```bash
pm2 start n8n --name "fashun-automation"
pm2 startup
pm2 save
```

### Option 3: Cloud (Recommended)
- Deploy to n8n.cloud (easiest)
- Or use Railway/Render/DigitalOcean
- Enable HTTPS
- Set up domain: **automations.fashun.co.in**

## Backup & Recovery

```bash
# Backup workflows
n8n export:workflow --all --output=./backups/

# Backup credentials (encrypted)
n8n export:credentials --all --output=./backups/
```

## Troubleshooting

### Workflow Not Triggering:
1. Check webhook URL is correct
2. Verify credentials are saved
3. Test manually with test data
4. Check execution logs

### Email Not Sending:
1. Verify Gmail app password
2. Check spam folder
3. Enable "Less secure apps" if needed
4. Try SendGrid instead

### WhatsApp Not Sending:
1. Verify Twilio sandbox is joined
2. Check phone number format (+country code)
3. Verify Twilio credits
4. Check Twilio logs

## Best Practices

1. **Name workflows clearly:** Use descriptive names
2. **Add notes:** Document each node's purpose
3. **Error handling:** Add error triggers
4. **Test in staging:** Never test on production webhooks
5. **Monitor executions:** Check daily for failures
6. **Version control:** Export workflows regularly
7. **Secure credentials:** Never commit credentials
8. **Rate limiting:** Don't spam APIs
9. **Logging:** Log important events to database
10. **Alerts:** Set up failure notifications

## Advanced Tips

### Conditional Logic:
Use IF/Switch nodes to handle different scenarios:
- Different messages for high-value orders
- Urgent alerts for low inventory
- VIP customer special handling

### Data Transformation:
Use Code node (JavaScript) for complex logic:
```javascript
// Example: Generate SKU
const sku = `FSH-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
return { sku };
```

### Scheduled Tasks:
Set cron expressions:
- Every hour: `0 * * * *`
- Daily at 9 AM: `0 9 * * *`
- Every Monday: `0 0 * * 1`

## Support Resources

- **n8n Docs:** https://docs.n8n.io
- **Community:** https://community.n8n.io
- **YouTube:** n8n official channel
- **Examples:** https://n8n.io/workflows

## Quick Command Reference

```bash
# Start n8n
n8n start

# Start with custom port
n8n start --port=5679

# Export all workflows
n8n export:workflow --all --output=./backup/

# Import workflow
n8n import:workflow --input=./workflow.json

# List workflows
n8n list:workflow

# Execute workflow
n8n execute --id=<workflow-id>
```

---

**Ready to automate!** Start with the critical workflows and expand from there. 🚀
