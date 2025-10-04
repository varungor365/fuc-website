# Strapi Backend Setup Guide for FASHUN.CO

Complete step-by-step guide to get Strapi CMS running for product management.

## Prerequisites

- **Node.js**: Version 18.x or 20.x installed
- **npm**: Version 6.x or higher
- **Port 1337**: Must be available (not used by other services)
- **SQLite**: Built-in with Node.js (no additional setup required)

## Step 1: First Time Setup

Navigate to the backend directory and start Strapi:

```bash
cd fashun-backend
npm install  # If not already done
npm run develop
```

**Important**: First startup may take 1-2 minutes as Strapi creates the database and builds the admin panel.

Look for this success message:
```
Welcome back! To manage your project, go to: http://localhost:1337/admin
```

## Step 2: Create Admin Account

1. Open your browser to: **http://localhost:1337/admin**
2. Fill in the admin registration form:
   - **First name**: Your first name
   - **Last name**: Your last name  
   - **Email**: Use a real email (for password recovery)
   - **Password**: Minimum 8 characters (use a strong password)
3. Click **"Let's start"**
4. You'll be automatically logged into the Strapi admin panel

## Step 3: Create Product Content-Type

Use Strapi's Content-Type Builder to create the Product model:

### 3.1 Start Content-Type Creation
1. In Strapi admin, click **"Content-Type Builder"** in the left sidebar
2. Click **"+ Create new collection type"**
3. **Display name**: `Product`
4. Click **"Continue"**

### 3.2 Add Required Fields

Add each field with these exact specifications:

**Basic Information:**
- **Text field**: `name` (Short text, Required, Unique)
- **UID field**: `slug` (Attached to: name, Required)
- **Rich text field**: `description` (Required)

**Pricing:**
- **Number field**: `price` (Decimal, Required)
- **Number field**: `originalPrice` (Decimal, Optional)
- **Number field**: `discount` (Integer, Optional)

**Categories:**
- **Text field**: `category` (Short text, Required)
- **Text field**: `subcategory` (Short text, Optional)
- **Text field**: `brand` (Short text, Required)

**Media & Attributes:**
- **Media field**: `images` (Multiple files, Required)
- **JSON field**: `colors` (Required)
- **JSON field**: `sizes` (Required)
- **JSON field**: `features` (Required)
- **Text field**: `material` (Short text, Required)
- **JSON field**: `care` (Required)
- **JSON field**: `tags` (Required)

**Ratings & Badges:**
- **Number field**: `rating` (Decimal, Default: 0)
- **Number field**: `reviewsCount` (Integer, Default: 0)
- **JSON field**: `badges` (Optional)

**Status Flags:**
- **Boolean field**: `inStock` (Default: true)
- **Boolean field**: `isNew` (Default: false)
- **Boolean field**: `isBestseller` (Default: false)
- **Boolean field**: `isOnSale` (Default: false)

### 3.3 Save and Restart
1. Click **"Save"** (top right corner)
2. Click **"Restart"** when prompted
3. Wait for Strapi to restart (30-60 seconds)

## Step 4: Configure API Permissions

Enable public access to product data:

1. Go to **"Settings"** → **"Users & Permissions"** → **"Roles"**
2. Click on **"Public"** role
3. Expand the **"Product"** section
4. **Check these boxes**: `find` and `findOne`
5. **Leave unchecked**: `create`, `update`, `delete` (admin only)
6. Click **"Save"** (top right)

## Step 5: Add Test Product

Create your first product manually:

1. Click **"Content Manager"** in left sidebar
2. Click **"Product"** under "Collection Types"
3. Click **"+ Create new entry"** (top right)
4. Fill in these test values:

**Basic Info:**
- **name**: `Test Hoodie`
- **slug**: `test-hoodie` (auto-generated)
- **description**: `A comfortable test hoodie for development`
- **price**: `1999`
- **category**: `hoodies`
- **brand**: `FASHUN.CO`

**JSON Fields** (copy-paste these exact formats):
- **colors**: `[{"name":"Black","value":"#000000"}]`
- **sizes**: `[{"name":"M","value":"m","stock":10}]`
- **features**: `["Test feature", "Comfortable fit"]`
- **care**: `["Machine wash cold", "Tumble dry low"]`
- **tags**: `["test", "hoodie"]`

**Status:**
- **inStock**: `true` (checked)
- **Upload at least one image** using the media field

5. Click **"Save"** (top right)
6. Click **"Publish"** (top right) - **CRITICAL**: Product must be published to appear in API

## Step 6: Test Strapi API

Verify everything is working:

### Test All Products Endpoint:
Open browser to: **http://localhost:1337/api/products**

Expected response:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Test Hoodie",
        "slug": "test-hoodie",
        "price": 1999,
        // ... other fields
      }
    }
  ],
  "meta": {
    "pagination": { /* pagination info */ }
  }
}
```

### Test Single Product Endpoint:
**http://localhost:1337/api/products/1**

Should return the single product data.

## Troubleshooting

### Strapi Won't Start
- **Port 1337 in use**: Kill other processes or change `PORT` in `.env`
- **Startup errors**: Delete `.tmp` folder and restart: `rm -rf .tmp && npm run develop`
- **Permission errors**: Check file permissions in project directory

### Can't Access Admin Panel
- **Blank page**: Clear browser cache and cookies
- **404 errors**: Ensure Strapi fully started (check console logs)
- **Login issues**: Reset admin password using Strapi CLI

### API Returns Empty Results
- **Check product is published**: Draft products don't appear in API
- **Check API permissions**: Verify Public role has `find` permission
- **Check URL format**: Ensure using `/api/products` not `/products`

### CORS Errors from Frontend
- **Check CORS_ORIGIN**: Must match frontend URL exactly
- **Restart Strapi**: CORS changes require restart
- **Check browser console**: Look for specific CORS error messages

### Seed Script Issues
- **Strapi not running**: Ensure `npm run develop` is active
- **Content-type missing**: Must create Product content-type first
- **Permission errors**: May need API token for script access

## Next Steps

Once Strapi is running successfully:

1. **Proceed to Phase 2**: Create Next.js API routes
2. **Run seed script**: Populate with all mock products
3. **Test frontend integration**: Verify product pages load from Strapi
4. **Add more content-types**: Categories, Orders, etc.

## Production Notes

For production deployment:

- **Change all secrets** in `.env` to strong random values
- **Use PostgreSQL** instead of SQLite
- **Enable proper authentication** for admin panel
- **Configure proper CORS** for your domain
- **Set up SSL certificates** for HTTPS

---

**Need Help?** Check the main README.md for additional troubleshooting and architecture information.