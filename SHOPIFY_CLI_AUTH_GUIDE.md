# 🚀 FASHUN.CO - Shopify CLI Setup Guide

## Authorization Issue - Here's What You Need to Do

### ❌ The Problem
The Shopify CLI is installed and authenticated, but **you don't have developer permissions** for `fashuncoin.myshopify.com` yet.

### ✅ The Solution (2-3 minutes)

**Step 1: Log into Your Shopify Admin**
1. Go to: https://admin.shopify.com
2. Select your store: **fashuncoin.myshopify.com**
3. Log in with your credentials (fashun.co.in@gmail.com)

**Step 2: Grant CLI Access (One of these options)**

**Option A: Using an Admin API Access Token** (Recommended for development)
1. In Shopify Admin, go to **Settings** → **Apps and integrations**
2. Click **Develop apps** (top right)
3. Click **Create an app**
4. Name it: "FASHUN CLI Development"
5. Under **Admin API scopes**, enable:
   - `write_themes`
   - `read_themes`
6. Click **Save and install**
7. Go to **API Credentials** tab
8. Copy the **Admin API access token**
9. In PowerShell, run:
   ```powershell
   $env:SHOPIFY_CLI_THEME_TOKEN='your-access-token-here'
   cd "g:\fuc website\fashun-shopify-theme"
   shopify theme dev
   ```

**Option B: Direct Admin Access** (Easier - uses your account)
1. Log into Shopify Admin: https://admin.shopify.com
2. Make sure you're the **store owner** or have a **staff account with CLI permission**
3. In PowerShell, run:
   ```powershell
   $env:SHOPIFY_FLAG_STORE='fashuncoin.myshopify.com'
   cd "g:\fuc website\fashun-shopify-theme"
   shopify theme dev
   ```

### 🔍 Check Your Store Status
Your authenticated account: **fashun.co.in@gmail.com**
Your Shopify Store: **fashuncoin.myshopify.com**

### 📞 If You Still Get Errors
1. Verify you're the **store owner** (not just a staff member without app access)
2. Try logging out and back in:
   ```powershell
   shopify auth logout
   shopify auth login
   ```
3. Make sure you've logged into the store at least once via the Shopify Admin

### ✨ Once You're Set Up
Your theme will be available at:
- **Preview URL**: https://fashuncoin-preview.myshopify.com
- **Theme Editor**: https://admin.shopify.com/admin/themes
- **Local Development**: http://localhost:9292 (approximately)

---

Need help? Follow Option B first - it's the quickest way!
