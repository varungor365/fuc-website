# 🏥 Autonomous Website Health and Self-Healing System

## Overview

The Autonomous Website Health and Self-Healing System is a comprehensive monitoring solution for FASHUN.CO that automatically detects issues, analyzes errors using AI, and provides actionable fixes. The system runs daily health checks, captures visual regressions, and integrates with multiple monitoring services.

## 🌟 Features

### Stage 1: E2E Testing & Visual Regression ✅
- **Playwright Integration**: Comprehensive end-to-end testing
- **Visual Regression Testing**: Screenshot comparison and baseline management
- **Critical User Journeys**: Authentication, Profile Management, E-commerce flows
- **Multi-browser Testing**: Chrome, Firefox, Safari, Mobile

### Stage 2: Error Monitoring ✅
- **Sentry Integration**: Real-time error tracking and performance monitoring
- **Source Map Support**: Readable error traces in production
- **Error Filtering**: Noise reduction and meaningful alerts
- **Performance Monitoring**: Track web vitals and user experience

### Stage 3: AI Self-Healing Loop ✅
- **OpenAI Integration**: GPT-4 powered error analysis
- **Automated Fix Generation**: AI-suggested code solutions
- **GitHub Issue Creation**: Automatic issue creation with fix suggestions
- **Slack Notifications**: Real-time team notifications

## 🚀 Quick Start

### 1. Setup
```bash
# Install dependencies (already done)
npm install

# Run setup script
npm run health-check:setup

# Copy environment configuration
cp .env.health-check.example .env.local
```

### 2. Configure Environment
Edit `.env.local` with your credentials:

```env
# Required
TEST_URL=https://fashun.co.in

# Optional but recommended for full functionality
SENTRY_DSN=your_sentry_dsn
OPENAI_API_KEY=your_openai_key
SLACK_WEBHOOK=your_slack_webhook
GITHUB_TOKEN=your_github_token
```

### 3. Create Baselines
```bash
# Generate baseline screenshots for visual regression
npm run health-check:baselines
```

### 4. Test the System
```bash
# Run health check immediately
npm run health-check:test

# Start daily monitoring
npm run health-check:start
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run health-check:setup` | Initial system setup |
| `npm run health-check:test` | Run health check immediately |
| `npm run health-check:start` | Start daily scheduler |
| `npm run health-check:baselines` | Update visual baselines |
| `npm run test:e2e` | Run E2E tests only |
| `npm run test:visual` | Run visual regression tests |

## 🧪 Test Suites

### 1. Authentication Flow (`auth.spec.ts`)
- ✅ Complete sign-up flow
- ✅ Login/logout functionality  
- ✅ Session management
- 📸 Visual regression testing

### 2. Profile Management (`profile.spec.ts`)
- ✅ Profile creation and editing
- ✅ Social media link management
- ✅ Avatar upload functionality
- ✅ Public profile viewing

### 3. E-commerce Flow (`ecommerce.spec.ts`)
- ✅ Product browsing and search
- ✅ Add to cart functionality
- ✅ Checkout process
- ✅ Order confirmation
- ✅ Cart management

## 🤖 AI-Powered Analysis

The system uses GPT-4 to analyze test failures and provide:

1. **Root Cause Analysis**: Understanding why tests failed
2. **Code Fix Suggestions**: Specific code changes to resolve issues
3. **Test Improvement Recommendations**: Better test patterns
4. **Performance Optimization Tips**: Speed and reliability improvements

### Example AI Analysis

```javascript
// AI-Generated Fix Suggestion
// Issue: Element not found during checkout

// Problem: Selector too specific, element might be loading
await page.locator('button[data-testid="checkout-button"]').click();

// Suggested Fix: Add proper waits and fallback selectors
await page.waitForSelector('button[data-testid="checkout-button"], button:has-text("Checkout")', { timeout: 30000 });
const checkoutButton = page.locator('button[data-testid="checkout-button"], button:has-text("Checkout")').first();
await expect(checkoutButton).toBeVisible();
await checkoutButton.click();
```

## 📊 Monitoring & Reporting

### Daily Health Check Report
```json
{
  "timestamp": "2025-09-26T09:00:00.000Z",
  "summary": {
    "totalTests": 15,
    "passed": 12,
    "failed": 3,
    "visualRegressions": 1
  },
  "failures": [
    {
      "testName": "Complete checkout flow",
      "error": "Element not found: checkout-button",
      "aiSuggestion": "Add proper wait conditions..."
    }
  ],
  "recommendations": [
    "Update checkout button selector",
    "Add retry logic for payment processing"
  ]
}
```

### Notifications

**Slack Integration**:
- ✅ Success notifications (daily)
- 🚨 Failure alerts with fix suggestions
- 📊 Weekly summary reports

**GitHub Integration**:
- 🐛 Automatic issue creation
- 🔧 AI-generated fix suggestions in issue descriptions
- 🏷️ Proper labeling and assignment

## 🔧 Configuration

### Scheduling
```env
# Daily health check at 9:00 AM
DAILY_CRON_SCHEDULE=0 9 * * *

# Weekly comprehensive check on Sunday at 10:00 AM  
WEEKLY_CRON_SCHEDULE=0 10 * * 0

# Timezone
TZ=UTC
```

### Test Configuration
```env
# Test timeouts
TEST_TIMEOUT=30000

# Visual regression threshold (0-1)
VISUAL_THRESHOLD=0.2

# Retry attempts
TEST_RETRIES=2
```

### Sentry Configuration
```javascript
// Automatic error capture
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});
```

## 📁 Project Structure

```
fashun-store/
├── tests/
│   ├── e2e/                    # E2E test specs
│   │   ├── auth.spec.ts
│   │   ├── profile.spec.ts
│   │   └── ecommerce.spec.ts
│   ├── utils/                  # Test utilities
│   │   └── visual-regression.ts
│   ├── visual-baselines/       # Baseline screenshots
│   ├── auth/                   # Auth state storage
│   ├── global-setup.ts         # Global test setup
│   └── global-teardown.ts      # Global test cleanup
├── scripts/
│   ├── health-check-orchestrator.ts  # Main orchestrator
│   ├── health-check-scheduler.ts     # Cron scheduler
│   └── setup-health-check.ts         # Setup script
├── test-results/               # Test artifacts
├── logs/                       # System logs
├── reports/                    # Health check reports
├── playwright.config.ts        # Playwright configuration
├── sentry.client.config.ts     # Sentry client config
├── sentry.server.config.ts     # Sentry server config
└── .env.health-check.example   # Environment template
```

## 🔍 Troubleshooting

### Common Issues

**1. Screenshot failures on first run**
```bash
# Solution: Create baselines first
npm run health-check:baselines
```

**2. Test timeouts**
```env
# Increase timeout in .env.local
TEST_TIMEOUT=60000
```

**3. Sentry integration issues**
```bash
# Verify Sentry DSN
echo $SENTRY_DSN

# Test Sentry connection
npx @sentry/cli info
```

**4. OpenAI API errors**
```env
# Check API key and model
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
```

### Debug Mode
```bash
# Enable debug logging
DEBUG_HEALTH_CHECK=true npm run health-check:test
```

## 🚦 System Status

### Health Check Components
- ✅ **Playwright Tests**: Installed and configured
- ✅ **Visual Regression**: Baseline system ready  
- ✅ **Sentry Integration**: Error monitoring configured
- ✅ **AI Analysis**: OpenAI integration ready
- ✅ **Scheduling**: Cron-based daily checks
- ✅ **Notifications**: Slack and GitHub integration

### Current Test Coverage
- 🔐 **Authentication**: 3 test scenarios
- 👤 **Profile Management**: 4 test scenarios  
- 🛒 **E-commerce**: 3 test scenarios
- 📱 **Mobile Testing**: Cross-device compatibility
- 🎨 **Visual Regression**: Full page screenshots

## 📈 Future Enhancements

### Planned Features
- 🔄 **Auto-healing**: Automatic code fixes via pull requests
- 📱 **Mobile App Testing**: React Native integration
- 🌐 **Multi-environment**: Staging, production, and preview deployments
- 📊 **Performance Budgets**: Automated performance regression detection
- 🤖 **ML Predictions**: Predictive failure analysis

### Integration Roadmap
- **Datadog**: Infrastructure monitoring
- **PagerDuty**: Escalation management
- **Jira**: Issue tracking integration
- **Microsoft Teams**: Additional notification channel

## 💡 Best Practices

### Writing Tests
1. **Use data-testid attributes** for stable selectors
2. **Wait for network idle** before taking screenshots
3. **Handle loading states** explicitly
4. **Use page object patterns** for maintainability

### Visual Regression
1. **Disable animations** for consistent screenshots
2. **Use appropriate thresholds** (0.1-0.3 recommended)
3. **Mask dynamic content** (timestamps, user data)
4. **Update baselines** after intentional UI changes

### Error Handling
1. **Categorize errors** (critical, warning, info)
2. **Filter noise** (known browser quirks)
3. **Provide context** (user actions, environment)
4. **Track patterns** (recurring issues)

## 🤝 Contributing

### Adding New Tests
1. Create test spec in `tests/e2e/`
2. Follow existing patterns
3. Add visual regression checkpoints
4. Update this documentation

### Modifying AI Analysis
1. Update prompts in `health-check-orchestrator.ts`
2. Test with sample failures
3. Validate fix suggestions

### Integration Changes
1. Update configuration templates
2. Add environment variables
3. Update setup scripts

---

## 📞 Support

For issues or questions:
- 📧 Email: admin@fashun.co.in
- 🐛 GitHub Issues: Create an issue with `health-check` label
- 💬 Slack: #dev-health-monitoring channel

---

*Last updated: September 26, 2025*
*System Version: 1.0.0*