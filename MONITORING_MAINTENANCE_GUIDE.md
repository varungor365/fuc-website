# MONITORING & MAINTENANCE GUIDE

Complete guide for monitoring and maintaining your production FASHUN platform.

---

## 📊 Monitoring Dashboard Overview

### Key Metrics to Track

| Metric | Target | Tool | Alert Threshold |
|--------|--------|------|-----------------|
| **Uptime** | 99.9% | UptimeRobot | < 99% |
| **Response Time** | < 2s | Vercel Analytics | > 3s |
| **Error Rate** | < 0.1% | Sentry | > 1% |
| **Core Web Vitals** | All Green | Lighthouse | Any Red |
| **Order Success Rate** | > 95% | Supabase | < 90% |
| **Cart Recovery Rate** | > 20% | n8n Analytics | < 15% |
| **Inventory Accuracy** | 99%+ | Custom Metrics | < 95% |
| **API Latency** | < 300ms | Vercel Logs | > 500ms |

---

## 🔍 Monitoring Tools Setup

### 1. Vercel Analytics

**Already included** - No setup needed!

Access: https://vercel.com/your-org/fashun-store/analytics

**What to Monitor:**
- Page views and unique visitors
- Top pages and traffic sources
- Core Web Vitals (LCP, FID, CLS)
- Real-time visitor count

### 2. Sentry Error Tracking

**Setup:**
```bash
cd fashun-store
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**Configure `sentry.client.config.ts`:**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
});
```

**What to Monitor:**
- JavaScript errors
- API failures
- Performance issues
- User sessions (optional)

### 3. UptimeRobot

**Setup:**
1. Go to https://uptimerobot.com
2. Create new monitors:
   - **Website**: `https://fashun.co.in` (HTTP, 5 min interval)
   - **API**: `https://fashun.co.in/api/health` (HTTP, 5 min interval)
   - **n8n**: `https://automations.fashun.co.in` (HTTP, 15 min interval)
3. Set up alert contacts (Email, SMS, Telegram)

**Alert Settings:**
- Notify when down for 5+ minutes
- Notify when slow (> 5s response time)
- Send to: Your email + Telegram bot

### 4. Custom Metrics API

**Access metrics:**
```bash
curl -H "Authorization: Bearer YOUR_METRICS_TOKEN" \
  https://fashun.co.in/api/metrics
```

**Response includes:**
- Orders (24h & 7d)
- Revenue & AOV
- Abandoned cart metrics
- Inventory alerts
- Customer growth

**Set up monitoring dashboard:**
- Use Grafana, Datadog, or custom dashboard
- Pull metrics every 15 minutes
- Create alerts for anomalies

---

## 🚨 Alert Configuration

### Critical Alerts (Immediate Response)

1. **Website Down**
   - Trigger: Uptime < 99%
   - Action: Check Vercel status, review logs
   - Notify: SMS + Telegram

2. **Payment Gateway Failure**
   - Trigger: Payment API errors > 5%
   - Action: Check Razorpay status
   - Notify: SMS + Email

3. **Database Connection Lost**
   - Trigger: Supabase unreachable
   - Action: Check Supabase dashboard
   - Notify: SMS + Telegram

4. **High Error Rate**
   - Trigger: Errors > 1% of requests
   - Action: Check Sentry, review recent deployments
   - Notify: Email + Slack

### Warning Alerts (Review Within 1 Hour)

1. **Slow Response Times**
   - Trigger: P95 latency > 3s
   - Action: Review Vercel logs, optimize queries

2. **Low Inventory**
   - Trigger: > 10 products with stock < threshold
   - Action: Review inventory reports, notify suppliers

3. **High Cart Abandonment**
   - Trigger: Abandonment rate > 80%
   - Action: Review checkout flow, check for errors

4. **Low Cart Recovery**
   - Trigger: Recovery rate < 15%
   - Action: Review email templates, check n8n workflows

---

## 📋 Daily Maintenance Checklist

### Morning Review (10 minutes)

- [ ] Check Vercel deployment status
- [ ] Review overnight orders in Supabase
- [ ] Check n8n workflow executions (last 24h)
- [ ] Review Sentry errors (any new issues?)
- [ ] Check UptimeRobot dashboard (any downtime?)
- [ ] Review inventory alerts
- [ ] Check abandoned cart recovery rate

### Weekly Deep Dive (30 minutes)

- [ ] Analyze sales metrics (revenue, AOV, conversion)
- [ ] Review top-performing products
- [ ] Check cart abandonment trends
- [ ] Review email campaign performance
- [ ] Analyze traffic sources (Vercel Analytics)
- [ ] Check Core Web Vitals scores
- [ ] Review Sentry error trends
- [ ] Audit inventory accuracy
- [ ] Check n8n execution success rates
- [ ] Review customer feedback/complaints

### Monthly Health Check (2 hours)

- [ ] Full performance audit (Lighthouse)
- [ ] Security audit (npm audit, dependency updates)
- [ ] Database performance review
- [ ] Cost analysis (Vercel, Supabase, n8n usage)
- [ ] A/B test results review
- [ ] Customer retention analysis
- [ ] Inventory turnover rate
- [ ] ROI calculation for automations
- [ ] Backup verification
- [ ] Disaster recovery drill

---

## 🔧 Common Issues & Solutions

### Issue 1: Slow Product Pages

**Symptoms:**
- Lighthouse score drops
- Users report slow loading

**Diagnosis:**
```bash
# Check ISR is working
curl -I https://fashun.co.in/products/your-product-handle
# Look for X-Vercel-Cache: HIT

# Check image optimization
curl -I https://cdn.shopify.com/s/files/1/xxxx/product.jpg?width=800
```

**Solutions:**
1. Verify ISR revalidation is running (check `/api/cron/revalidate-products`)
2. Check Shopify CDN image URLs are using optimized parameters
3. Enable Redis caching if high traffic
4. Review database query performance

### Issue 2: Failed n8n Workflows

**Symptoms:**
- Orders not syncing
- Notifications not sending
- Cart recovery emails missing

**Diagnosis:**
1. Go to n8n Cloud dashboard
2. Check workflow executions
3. Review error logs

**Solutions:**
- Verify API credentials (Shopify, Supabase, Twilio, SendGrid)
- Check webhook URLs are correct
- Ensure environment variables are set
- Test individual nodes in n8n editor
- Check rate limits on external APIs

### Issue 3: Inventory Sync Issues

**Symptoms:**
- Stock numbers don't match Shopify
- Overselling products

**Diagnosis:**
```sql
-- Check recent inventory updates
SELECT * FROM inventory_logs 
ORDER BY created_at DESC 
LIMIT 50;

-- Compare with Shopify
-- Go to Shopify Admin → Products → Inventory
```

**Solutions:**
1. Run manual sync: `curl -X GET https://fashun.co.in/api/cron/sync-inventory -H "Authorization: Bearer YOUR_SECRET"`
2. Check n8n inventory sync workflow
3. Verify Shopify webhook is active
4. Review inventory reservation logic

### Issue 4: High Error Rate in Sentry

**Diagnosis:**
1. Open Sentry dashboard
2. Group errors by type
3. Check affected pages/APIs

**Common Errors:**
- **CORS errors**: Check `vercel.json` CORS headers
- **TypeScript errors**: Run `npm run build` locally
- **API errors**: Check external service status (Shopify, Supabase)
- **Timeout errors**: Increase timeout limits or optimize queries

**Solutions:**
- Deploy hotfix for critical bugs
- Add error boundaries to catch React errors
- Implement retry logic for API calls
- Add better error messages for users

---

## 📊 Performance Optimization

### Weekly Performance Audit

```bash
# Run Lighthouse CI
npx @lhci/cli@latest autorun --collect.url=https://fashun.co.in

# Check bundle size
cd fashun-store
npm run build
npm run analyze
```

**Optimization Checklist:**
- [ ] Images optimized (WebP/AVIF)
- [ ] Unused dependencies removed
- [ ] Code splitting implemented
- [ ] ISR working correctly
- [ ] CDN headers configured
- [ ] Database queries optimized
- [ ] API response times < 300ms

### Database Optimization

Run monthly vacuum and analyze:
```sql
-- In Supabase SQL editor
VACUUM ANALYZE;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Add indexes if needed
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_handle ON products(handle);
```

---

## 🔐 Security Maintenance

### Monthly Security Audit

```bash
# Check for vulnerable dependencies
cd fashun-store
npm audit

# Update dependencies
npm update
npm audit fix

# Check for outdated packages
npx npm-check-updates
```

**Security Checklist:**
- [ ] All dependencies up to date
- [ ] No critical vulnerabilities
- [ ] API keys rotated quarterly
- [ ] SSL certificates valid
- [ ] Firewall rules configured
- [ ] Rate limiting active
- [ ] CORS properly configured
- [ ] Webhook signatures verified

---

## 💾 Backup & Recovery

### Automated Backups

**Supabase:**
- Automatic daily backups (retained 7 days)
- Point-in-time recovery available
- Access: Supabase Dashboard → Settings → Database

**Vercel:**
- Deployment history (rollback available)
- Environment variables backed up
- Access: Vercel Dashboard → Deployments

**n8n:**
- Export workflows monthly
- Store in git repository
- Access: n8n Dashboard → Workflows → Export

### Manual Backup Procedure

```bash
# Export Supabase data
pg_dump -h db.xxx.supabase.co -U postgres fashun_db > backup_$(date +%Y%m%d).sql

# Export n8n workflows
# Go to n8n → Workflows → Select All → Export

# Backup environment variables
# Copy from Vercel Dashboard → Settings → Environment Variables
```

### Recovery Procedure

1. **Database Recovery:**
   - Go to Supabase → Settings → Database → Backups
   - Select backup date
   - Click "Restore"

2. **Application Rollback:**
   ```bash
   vercel rollback fashun-store
   # Or via Vercel dashboard
   ```

3. **n8n Workflow Restoration:**
   - Import workflow JSON files
   - Reconfigure credentials
   - Test and activate

---

## 📈 Growth Scaling Plan

### When to Scale

**Triggers:**
- Traffic > 10,000 daily visitors
- Orders > 500 per day
- Response time > 2s consistently
- Error rate > 0.5%

**Scaling Actions:**

1. **Upgrade Vercel Plan:**
   - Pro: $20/month per user
   - Better performance
   - More analytics
   - Priority support

2. **Upgrade Supabase:**
   - Pro: $25/month
   - More database resources
   - Better backup retention
   - Increased API limits

3. **Implement Redis Caching:**
   ```bash
   npm install @upstash/redis
   # Configure in environment variables
   ```

4. **Enable CDN:**
   - Use Vercel Edge Network (included)
   - Configure cache headers
   - Optimize static assets

5. **Database Optimization:**
   - Add read replicas
   - Implement connection pooling
   - Optimize slow queries

---

## 🎯 Success Metrics Dashboard

Create a dashboard tracking:

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Uptime | 99.95% | 99.9% | ✅ |
| Response Time | 1.8s | < 2s | ✅ |
| Error Rate | 0.05% | < 0.1% | ✅ |
| Orders/Day | 50 | 100 | 🔄 |
| Cart Recovery | 22% | > 20% | ✅ |
| Revenue/Day | ₹25,000 | ₹50,000 | 🔄 |
| Customer Satisfaction | 4.5/5 | > 4/5 | ✅ |

**Update weekly and share with team!**

---

*For urgent issues, check logs in this order: Vercel → Sentry → n8n → Supabase*
