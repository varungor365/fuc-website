# 🔐 FASHUN.CO - Authentication System Guide

## Overview
Complete authentication system with email/password stored in PostgreSQL database via Medusa backend.

---

## 🏗️ Architecture

```
Frontend (Next.js)
    ↓
Medusa Customer API
    ↓
PostgreSQL Database
    ↓
Encrypted Passwords (bcrypt)
```

---

## 📊 Database Schema

### Customer Table (Medusa)
```sql
CREATE TABLE customer (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  password_hash VARCHAR NOT NULL,
  phone VARCHAR,
  has_account BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Customer Addresses
```sql
CREATE TABLE address (
  id VARCHAR PRIMARY KEY,
  customer_id VARCHAR REFERENCES customer(id),
  first_name VARCHAR,
  last_name VARCHAR,
  address_1 VARCHAR,
  address_2 VARCHAR,
  city VARCHAR,
  province VARCHAR,
  postal_code VARCHAR,
  country_code VARCHAR,
  phone VARCHAR
);
```

---

## 🔑 Features

### Registration
- Email validation
- Password strength check (min 8 characters)
- Duplicate email prevention
- Automatic password hashing
- Database storage

### Login
- Email/password authentication
- Session management
- Remember me functionality
- Secure token storage

### Password Reset
- Email-based reset link
- Token expiration (24 hours)
- Secure password update

### Profile Management
- Update personal information
- Manage addresses
- View order history
- Change password

---

## 🚀 Implementation

### 1. Backend Setup (Medusa)

Medusa handles all authentication automatically:
- Password hashing with bcrypt
- JWT token generation
- Session management
- Email verification

### 2. Frontend Integration

#### Register User
```typescript
import { MedusaCustomerService } from '@/services/medusa';

const customer = await MedusaCustomerService.create({
  email: 'user@example.com',
  password: 'securepassword',
  first_name: 'John',
  last_name: 'Doe'
});
```

#### Login User
```typescript
const customer = await MedusaCustomerService.login(
  'user@example.com',
  'securepassword'
);

// Store session
localStorage.setItem('customer_id', customer.id);
```

#### Get Customer Data
```typescript
const customer = await MedusaCustomerService.retrieve();
```

#### Update Profile
```typescript
await MedusaCustomerService.update({
  first_name: 'Jane',
  phone: '+91 98765 43210'
});
```

---

## 🔒 Security Features

### Password Security
- Minimum 8 characters
- Hashed with bcrypt (10 rounds)
- Never stored in plain text
- Secure transmission over HTTPS

### Session Management
- JWT tokens
- HTTP-only cookies
- Secure flag enabled
- Token expiration

### API Security
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention

---

## 📧 Email Integration

### SendGrid Setup

1. Create SendGrid account
2. Get API key
3. Configure in admin settings
4. Verify sender email

### Email Templates

#### Welcome Email
```
Subject: Welcome to FASHUN.CO!
Body: Account created successfully...
```

#### Password Reset
```
Subject: Reset Your Password
Body: Click link to reset password...
```

#### Order Confirmation
```
Subject: Order Confirmed #12345
Body: Your order has been placed...
```

---

## 🔄 User Flow

### Registration Flow
1. User fills registration form
2. Frontend validates input
3. API call to Medusa
4. Password hashed
5. User created in database
6. Welcome email sent
7. Redirect to login

### Login Flow
1. User enters credentials
2. API authenticates
3. JWT token generated
4. Session stored
5. Redirect to account

### Password Reset Flow
1. User requests reset
2. Token generated
3. Email sent with link
4. User clicks link
5. New password set
6. Token invalidated

---

## 🛠️ API Endpoints

### Customer Endpoints (Medusa)

```
POST   /store/customers                    # Register
POST   /store/auth                         # Login
GET    /store/customers/me                 # Get profile
POST   /store/customers/me                 # Update profile
POST   /store/customers/password-reset     # Request reset
POST   /store/customers/password-token     # Reset password
GET    /store/customers/me/orders          # Get orders
POST   /store/customers/me/addresses       # Add address
```

---

## 🧪 Testing

### Test Accounts

**Admin:**
```
Email: admin@medusa-test.com
Password: supersecret
```

**Customer:**
```
Email: test@fashun.co
Password: testpassword123
```

### Test Scenarios

1. **Registration**
   - Valid email/password
   - Duplicate email
   - Weak password
   - Invalid email format

2. **Login**
   - Correct credentials
   - Wrong password
   - Non-existent email
   - Remember me

3. **Password Reset**
   - Valid email
   - Invalid email
   - Expired token
   - Token reuse

---

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/fashun_medusa

# JWT
JWT_SECRET=your-super-secret-jwt-key
COOKIE_SECRET=your-super-secret-cookie-key

# Email
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM=noreply@fashun.co

# Session
SESSION_SECRET=your-session-secret
SESSION_TIMEOUT=86400
```

---

## 📱 Frontend Pages

### `/register`
- Registration form
- Email validation
- Password strength indicator
- Terms acceptance

### `/login`
- Login form
- Remember me
- Forgot password link
- Social login (optional)

### `/account`
- Profile information
- Order history
- Saved addresses
- Wishlist

### `/forgot-password`
- Email input
- Reset link sent confirmation

---

## 🚨 Error Handling

### Common Errors

```typescript
// Email already exists
{
  code: 'duplicate_error',
  message: 'Email already registered'
}

// Invalid credentials
{
  code: 'invalid_credentials',
  message: 'Invalid email or password'
}

// Weak password
{
  code: 'invalid_data',
  message: 'Password must be at least 8 characters'
}
```

---

## 🔄 Migration from Old System

### If migrating from existing auth:

1. Export user data
2. Hash passwords with bcrypt
3. Import to Medusa database
4. Update user IDs
5. Test authentication

---

## 📊 Database Queries

### Get Customer
```sql
SELECT * FROM customer WHERE email = 'user@example.com';
```

### Count Customers
```sql
SELECT COUNT(*) FROM customer WHERE has_account = true;
```

### Recent Registrations
```sql
SELECT * FROM customer 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🎯 Best Practices

1. **Never log passwords**
2. **Use HTTPS in production**
3. **Implement rate limiting**
4. **Validate all inputs**
5. **Use secure session storage**
6. **Enable 2FA (optional)**
7. **Monitor failed login attempts**
8. **Regular security audits**

---

## 🆘 Troubleshooting

### Login Not Working
```bash
# Check database connection
psql -U postgres -d fashun_medusa

# Verify customer exists
SELECT * FROM customer WHERE email = 'user@example.com';

# Check password hash
SELECT password_hash FROM customer WHERE email = 'user@example.com';
```

### Email Not Sending
```bash
# Test SendGrid API
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Session Expired
```typescript
// Clear local storage
localStorage.clear();

// Redirect to login
router.push('/login');
```

---

## 📞 Support

- **Medusa Docs**: https://docs.medusajs.com/modules/customers
- **Security Issues**: security@fashun.co
- **General Support**: support@fashun.co

---

**Last Updated**: 2025
**Version**: 2.0.0
**Status**: Production Ready ✅
