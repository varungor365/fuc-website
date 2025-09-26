# FASHUN.CO Autonomous Broken Link Checker 🔍

An intelligent link checking system that automatically crawls your website, detects broken links, and creates GitHub issues with suggested fixes from the Wayback Machine.

## 🚀 Features

- **Comprehensive Link Scanning**: Checks all internal and external links
- **Wayback Machine Integration**: Automatically finds archived versions of broken links
- **GitHub Issue Creation**: Creates detailed issues with fix suggestions
- **Scheduled Scanning**: Runs nightly checks automatically
- **Detailed Reporting**: Generates HTML, JSON, and CSV reports
- **Priority Link Detection**: Identifies critical links for faster fixes
- **Smart Grouping**: Groups related broken links into single issues

## 📦 Installation

1. Install dependencies:
```bash
cd scripts/link-checker
npm install
```

2. Set up environment variables in your `.env.local`:
```env
# GitHub Integration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=varungor365
GITHUB_REPO=fuc-website

# Website Configuration
NEXT_PUBLIC_SITE_URL=https://fashun.co
```

3. Run setup:
```bash
npm run setup
```

## 🔧 Usage

### Manual Link Check
```bash
# Basic link check
npm run check

# Full site scan (all pages)
npm run check -- --full

# Check external links only
npm run check -- --external-only

# Generate report and create GitHub issues
npm run check -- --report --github
```

### Scheduled Scanning
```bash
# Start nightly scheduler (runs at 2 AM)
npm run schedule
```

### Command Line Options
```bash
node index.js check [options]

Options:
  -u, --url <url>       Base URL to check (default: from env)
  -f, --full            Check all pages (not just critical paths)
  -e, --external-only   Check only external links
  -r, --report          Generate detailed report
  -g, --github          Create GitHub issues for broken links
```

## 📊 Reports

The link checker generates three types of reports:

### HTML Report
- Beautiful, responsive dashboard
- Interactive broken link details
- Wayback Machine suggestions
- Visual statistics and charts

### JSON Report
- Machine-readable results
- Perfect for CI/CD integration
- Complete scan metadata

### CSV Report
- Spreadsheet-friendly format
- Easy analysis and filtering
- Data export capabilities

Reports are saved in the `reports/` directory with timestamps.

## 🤖 GitHub Integration

### Automatic Issue Creation

When broken links are detected, the system automatically:

1. **Groups Related Issues**: Similar broken links are grouped together
2. **Prioritizes Critical Links**: Internal and priority external links get immediate attention
3. **Provides Fix Suggestions**: Includes Wayback Machine archives when available
4. **Assigns Labels**: Uses consistent labeling for easy filtering
5. **Prevents Duplicates**: Checks for existing issues before creating new ones

### Issue Labels

- `broken-link`: All broken link issues
- `external-link`: Issues with external links
- `internal-link`: Issues with internal links (high priority)
- `priority`: High-impact broken links
- `automated`: Issues created by the link checker

### Issue Content

Each issue includes:
- Broken link details (URL, status, location)
- Impact assessment (SEO and UX impact)
- Fix suggestions from Wayback Machine
- Action checklist for developers
- Timestamps and metadata

## 🕰️ Wayback Machine Integration

The system intelligently suggests alternatives for broken links:

### For External Links
- Searches Internet Archive for cached versions
- Finds the most recent working snapshot
- Provides multiple date options when available
- Includes confidence ratings for suggestions

### For Internal Links
- Analyzes URL patterns for similar pages
- Suggests parent directories or variations
- Checks for redirects and URL changes
- Provides site structure insights

## 🔄 Scheduling & Automation

### Nightly Scans
```bash
# Run as a service (keeps running)
npm run schedule

# Or use with process managers like PM2
pm2 start "npm run schedule" --name "fashun-link-checker"
```

### GitHub Actions Integration
Create `.github/workflows/link-check.yml`:

```yaml
name: Link Check
on:
  schedule:
    - cron: '0 2 * * *'  # Run at 2 AM daily
  workflow_dispatch:

jobs:
  link-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd scripts/link-checker
          npm install
      
      - name: Run link check
        run: |
          cd scripts/link-checker
          npm run check -- --full --report --github
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NEXT_PUBLIC_SITE_URL: https://fashun.co
```

## 📈 Performance & Optimization

### Scan Configuration
- **Concurrency**: Adjustable parallel requests (default: 10)
- **Timeouts**: Configurable per-link timeout (default: 30s)
- **Rate Limiting**: Respectful API usage for external services
- **Caching**: Intelligent caching of Wayback Machine results

### Priority Scanning
Critical paths are always checked first:
- Homepage (`/`)
- Product pages (`/collections`, `/products`)
- Key user flows (`/cart`, `/checkout`)
- API endpoints (`/api/health`)

## 🛠️ Configuration

### Environment Variables
```env
# Required
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_OWNER=varungor365
GITHUB_REPO=fuc-website
NEXT_PUBLIC_SITE_URL=https://fashun.co

# Optional
LINK_CHECK_TIMEOUT=30000
LINK_CHECK_CONCURRENCY=10
WAYBACK_TIMEOUT=10000
```

### Custom Configuration
Modify `src/link-checker.js` to customize:
- Critical paths to prioritize
- Domains to skip or prioritize
- Link patterns to ignore
- Scan depth and recursion rules

## 🎯 Integration with FASHUN.CO

### SEO Benefits
- Maintains link equity and search rankings
- Prevents 404 errors that hurt SEO
- Ensures all product and category links work
- Monitors affiliate and partner links

### User Experience
- Prevents broken checkout flows
- Ensures social media links work
- Maintains navigation integrity
- Keeps contact and support links functional

### Development Workflow
- Automatically catches deployment issues
- Validates content management changes
- Monitors third-party integrations
- Tracks external service availability

## 📝 Example Output

### Console Output
```
🔍 Starting FASHUN.CO Link Check...
✅ Scan completed in 15.3s
📊 Summary:
  Total links: 247
  Working: 239
  Broken: 6
  Redirects: 2
  Warnings: 0

🔧 Creating GitHub issues for 6 broken links...
✅ Created issue: 🔗 Priority External Link Broken: instagram.com
✅ Created issue: 🏠 Internal Link Broken: /products/invalid-product
✅ Link check completed!
```

### Generated Issue Example
```markdown
## 🔍 Broken Link Detected

**Detected on:** 2025-09-26 10:30:15
**Link Type:** External
**Priority:** High

### Broken Link

**URL:** `https://instagram.com/fashunco_official`
- **Status:** 404
- **Found on:** https://fashun.co/contact
- **Timestamp:** 2025-09-26T10:30:15.123Z
- **Suggestions:**
  - [Archived version from 2025-08-15](https://web.archive.org/web/20250815...)

### 🔧 Action Required

- [ ] Verify if the external link is permanently broken
- [ ] Replace with alternative link if available
- [ ] Remove link if no alternative exists
- [ ] Update any related documentation

### 📊 Impact Assessment

- **SEO Impact:** High - Broken links can negatively affect search rankings
- **User Experience:** Medium - External links affect user navigation
- **Pages Affected:** 1

---
*This issue was automatically created by the FASHUN.CO Link Checker*
*Run `npm run link-check` to manually verify fixes*
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**🔗 Keep your links healthy, keep your users happy!**