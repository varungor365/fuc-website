# Strapi Setup and Automation Guide

## 1. Admin Setup (Complete via Browser)
Visit http://localhost:1337/admin and create your admin account:
- Email: admin@fashun.co.in
- Password: [secure-password]
- First Name: Admin
- Last Name: User

## 2. Content Types to Create

### Product Collection Type
- **Singular:** product
- **Plural:** products

#### Fields:
- `name` (Text, Required)
- `description` (Rich Text)
- `price` (Number, Decimal, Required)
- `originalPrice` (Number, Decimal)
- `images` (Media, Multiple)
- `category` (Relation, Many-to-One with Category)
- `sizes` (JSON)
- `colors` (JSON)
- `stock` (Number, Integer, Required)
- `sku` (Text, Required, Unique)
- `tags` (JSON)
- `featured` (Boolean, Default: false)
- `isNew` (Boolean, Default: true)
- `rating` (Number, Decimal, Default: 0)
- `reviewCount` (Number, Integer, Default: 0)
- `seoTitle` (Text)
- `seoDescription` (Text)
- `slug` (UID, Target: name)

### Category Collection Type
- **Singular:** category
- **Plural:** categories

#### Fields:
- `name` (Text, Required)
- `slug` (UID, Target: name)
- `description` (Text)
- `image` (Media, Single)
- `productCount` (Number, Integer, Default: 0)
- `featured` (Boolean, Default: false)
- `products` (Relation, One-to-Many with Product)

### Order Collection Type
- **Singular:** order
- **Plural:** orders

#### Fields:
- `items` (JSON, Required)
- `total` (Number, Decimal, Required)
- `subtotal` (Number, Decimal, Required)
- `tax` (Number, Decimal, Default: 0)
- `shipping` (Number, Decimal, Default: 0)
- `status` (Enumeration: pending, processing, shipped, delivered, cancelled)
- `customerEmail` (Email, Required)
- `shippingAddress` (JSON, Required)
- `billingAddress` (JSON, Required)
- `trackingNumber` (Text)
- `notes` (Text)

### Customer Collection Type
- **Singular:** customer
- **Plural:** customers

#### Fields:
- `email` (Email, Required, Unique)
- `firstName` (Text, Required)
- `lastName` (Text, Required)
- `phone` (Text)
- `dateOfBirth` (Date)
- `addresses` (JSON)
- `orders` (Relation, One-to-Many with Order)
- `totalSpent` (Number, Decimal, Default: 0)
- `orderCount` (Number, Integer, Default: 0)
- `lastOrderDate` (DateTime)
- `isVip` (Boolean, Default: false)

## 3. Automated Workflows to Implement

### Order Processing Workflow
1. **Order Creation** → Send confirmation email
2. **Payment Confirmed** → Update inventory, Send shipping notification
3. **Shipped** → Send tracking email
4. **Delivered** → Send review request email

### Inventory Management
1. **Low Stock Alert** → Notify admin when stock < 5
2. **Out of Stock** → Auto-hide product from frontend
3. **Restock** → Auto-show product, send restock notification

### Customer Lifecycle
1. **New Customer** → Send welcome email series
2. **First Purchase** → Send thank you + care instructions
3. **Repeat Customer** → Send loyalty rewards
4. **VIP Customer** → Send exclusive offers

### Marketing Automation
1. **Abandoned Cart** → Send reminder emails (1h, 24h, 7 days)
2. **Birthday** → Send special discount
3. **Seasonal** → Automated campaign triggers
4. **Review Request** → 7 days after delivery

## 4. API Endpoints Available After Setup

### Products
- GET /api/products - List products with filtering
- GET /api/products/:id - Get single product
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Categories
- GET /api/categories - List categories
- GET /api/categories/:id - Get single category

### Orders
- POST /api/orders - Create order
- GET /api/orders/:id - Get order details
- PUT /api/orders/:id - Update order status (admin)

### Customers
- POST /api/customers - Register customer
- GET /api/customers/:id - Get customer profile
- PUT /api/customers/:id - Update customer

## 5. Webhooks and Lifecycle Hooks

Create these in Strapi to automate business processes:

### src/api/order/lifecycles.js
```javascript
module.exports = {
  async afterCreate(event) {
    const { result } = event;
    // Send order confirmation email
    // Update inventory
    // Create customer if new
  },
  
  async afterUpdate(event) {
    const { result, params } = event;
    // Handle status changes
    // Send appropriate notifications
  }
};
```

### src/api/product/lifecycles.js
```javascript
module.exports = {
  async afterUpdate(event) {
    const { result, params } = event;
    // Check stock levels
    // Send low stock alerts
    // Update category product counts
  }
};
```

## 6. Environment Variables
Add to .env file:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@fashun.co.in
EMAIL_REPLY_TO=support@fashun.co.in
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```
