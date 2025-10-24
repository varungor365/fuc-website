# Supabase Waitlist Setup Guide

## 🎯 Quick Setup (2 minutes)

### Step 1: Create the Database Table

1. **Open Supabase SQL Editor**
   - Go to: https://oyysorgjqeqxhmyczphk.supabase.co/project/oyysorgjqeqxhmyczphk/sql
   - Or: Supabase Dashboard → Your Project → SQL Editor

2. **Run the Migration**
   - Copy the entire contents of `supabase/migrations/create_waitlist_table.sql`
   - Paste into the SQL Editor
   - Click "RUN" button

3. **Verify Table Creation**
   - Go to: Table Editor → waitlist table should appear
   - Check that it has columns: id, email, created_at, source, user_agent, referrer, metadata

### Step 2: Test the API

```bash
# Test adding an email
curl -X POST http://localhost:3001/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@fashun.co.in"}'

# Get waitlist count
curl http://localhost:3001/api/waitlist

# Get all emails (admin)
curl http://localhost:3001/api/waitlist?emails=true
```

### Step 3: View Your Waitlist Data

**Option A: Supabase Dashboard**
- Go to: Table Editor → waitlist
- View all signups with timestamps

**Option B: API Endpoint**
```bash
# Get count only
curl http://localhost:3001/api/waitlist

# Get all emails with details
curl http://localhost:3001/api/waitlist?emails=true
```

**Option C: SQL Query**
```sql
-- View all signups
SELECT * FROM waitlist ORDER BY created_at DESC;

-- Count total signups
SELECT COUNT(*) FROM waitlist;

-- Export as CSV (in Supabase SQL Editor, use "Download CSV" button)
SELECT email, created_at, source FROM waitlist ORDER BY created_at DESC;
```

## 📊 What Changed

### Before (Google Sheets - Not Working)
- ❌ Unreliable API connection
- ❌ Complex setup with Apps Script
- ❌ Difficult to debug
- ❌ No real-time count

### After (Supabase Database - Production Ready)
- ✅ Reliable database storage
- ✅ Built-in duplicate prevention
- ✅ Real-time count updates
- ✅ Easy to export data
- ✅ Secure with Row Level Security
- ✅ Admin access for viewing all emails

## 🔧 Technical Details

### Database Schema
```sql
waitlist (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,           -- Prevents duplicates
  created_at TIMESTAMP,         -- Automatic timestamp
  source TEXT,                  -- 'launch_countdown'
  user_agent TEXT,              -- Browser info
  referrer TEXT,                -- Where they came from
  metadata JSONB                -- Extra data
)
```

### Security Features
- **Row Level Security (RLS)** enabled
- Public can INSERT (signup)
- Only authenticated users can SELECT (view)
- Service role has full access
- Email uniqueness enforced at database level

### API Endpoints

**POST /api/waitlist** - Add email to waitlist
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Successfully joined the waitlist!",
  "stored": true,
  "totalSignups": 42,
  "storage": "Supabase Database"
}
```

**GET /api/waitlist** - Get count
```json
{
  "count": 42,
  "message": "42 people on the waitlist"
}
```

**GET /api/waitlist?emails=true** - Get all emails (admin)
```json
{
  "count": 42,
  "message": "42 people on the waitlist",
  "emails": [
    {
      "email": "user@example.com",
      "created_at": "2025-10-24T10:30:00Z",
      "source": "launch_countdown",
      "referrer": "direct"
    }
  ]
}
```

## 🚀 Production Deployment

When deploying to production (fashun.co.in):

1. **Environment Variables** (already configured in .env.local)
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://oyysorgjqeqxhmyczphk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

2. **Vercel Deployment**
   - Add these environment variables in Vercel dashboard
   - They're already in .env.local for development

3. **Domain Update**
   - No code changes needed
   - API will work automatically at fashun.co.in/api/waitlist

## 📈 Exporting Data

### Method 1: Supabase Dashboard
1. Table Editor → waitlist
2. Click "..." menu → Export as CSV

### Method 2: SQL Query
```sql
-- Copy this into SQL Editor, then click "Download CSV"
SELECT 
  email,
  created_at,
  source,
  referrer
FROM waitlist 
ORDER BY created_at DESC;
```

### Method 3: API Call (Programmatic)
```javascript
// Fetch all emails
const response = await fetch('https://fashun.co.in/api/waitlist?emails=true');
const data = await response.json();
console.log(data.emails);
```

## 🔍 Monitoring & Analytics

### Check Signups in Real-Time
```sql
-- Recent signups (last 24 hours)
SELECT * FROM waitlist 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Signups by source
SELECT source, COUNT(*) as count 
FROM waitlist 
GROUP BY source;

-- Daily signups
SELECT 
  DATE(created_at) as date, 
  COUNT(*) as signups 
FROM waitlist 
GROUP BY DATE(created_at) 
ORDER BY date DESC;
```

## ✅ Verification Checklist

- [ ] SQL migration run successfully
- [ ] waitlist table visible in Supabase Table Editor
- [ ] Test POST request works (add email)
- [ ] Test GET request works (get count)
- [ ] Duplicate email prevention works (try same email twice)
- [ ] View data in Supabase dashboard
- [ ] Frontend countdown page saves emails successfully

## 🆘 Troubleshooting

### "Table does not exist" error
- Run the SQL migration in Supabase SQL Editor
- Check Table Editor to confirm table was created

### "Permission denied" error
- Verify RLS policies are created (they're in the migration)
- Check that SUPABASE_SERVICE_ROLE_KEY is set in .env.local

### Emails not saving
- Check browser console for errors
- Check server logs (terminal where npm run dev is running)
- Verify Supabase credentials in .env.local

### Can't view emails
- Use the API: GET /api/waitlist?emails=true
- Or check Supabase Table Editor directly

## 🎉 Benefits

1. **Reliable** - Database-backed storage, not third-party APIs
2. **Fast** - Local database, instant response
3. **Scalable** - Supabase handles millions of rows
4. **Secure** - RLS policies protect data
5. **Easy** - One SQL script to set up
6. **Free** - Supabase free tier is generous
7. **Exportable** - CSV export built-in
8. **Real-time** - See signups instantly in dashboard

---

**Ready to launch! 🚀** Your waitlist is now powered by a professional database system.
