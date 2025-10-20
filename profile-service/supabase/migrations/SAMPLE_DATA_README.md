# Sample Data Installation Guide

## 🚨 IMPORTANT: Foreign Key Constraint Issue

The sample data files require **actual authenticated users** in the `auth.users` table because the `profiles` table has a foreign key constraint:

```sql
profiles.id → references auth.users(id)
```

**You cannot insert profiles with random UUIDs.** You must use real user IDs from Supabase Auth.

---

## ✅ Solution: Two Options

### **Option 1: Automatic Sample Data (Recommended for Testing)**

Use `012_sample_data.sql` - This file automatically detects existing users and creates profiles for them.

**Steps:**

1. **Create 3 test users in Supabase:**
   - Go to: Supabase Dashboard → Authentication → Users → "Add User"
   - Create users with any email (e.g., `test1@example.com`, `test2@example.com`, `test3@example.com`)
   - Set passwords for each user

2. **Run the sample data file:**
   - Open Supabase SQL Editor
   - Copy and paste the entire content of `012_sample_data.sql`
   - Execute the query
   - It will automatically use your first 3 users

3. **Verify:**
   ```sql
   SELECT * FROM public.profiles ORDER BY created_at DESC;
   ```

**Pros:**
- ✅ Automatic - no UUID replacement needed
- ✅ Works with any existing users
- ✅ Safe - uses `ON CONFLICT DO NOTHING`

**Cons:**
- ⚠️ Only creates profiles for existing users
- ⚠️ Requires at least 1-3 users to exist first
- ⚠️ Other sample data (links, analytics) may not fully populate if fewer than 3 users

---

### **Option 2: Manual Sample Data (Full Control)**

Use `012_sample_data_MANUAL.sql` - This file requires you to manually replace placeholder UUIDs with real ones.

**Steps:**

1. **Create 3 test users** (same as Option 1)

2. **Get the user IDs:**
   ```sql
   SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 3;
   ```
   
   Example output:
   ```
   id                                   | email
   ------------------------------------ | -------------------
   abc12345-1234-1234-1234-123456789abc | test1@example.com
   def67890-5678-5678-5678-567890123def | test2@example.com
   ghi13579-9012-9012-9012-901234567ghi | test3@example.com
   ```

3. **Replace all placeholders in `012_sample_data_MANUAL.sql`:**
   - Find & Replace: `USER_1_UUID_HERE` → `abc12345-1234-1234-1234-123456789abc`
   - Find & Replace: `USER_2_UUID_HERE` → `def67890-5678-5678-5678-567890123def`
   - Find & Replace: `USER_3_UUID_HERE` → `ghi13579-9012-9012-9012-901234567ghi`

4. **Execute the modified SQL file** in Supabase SQL Editor

5. **Verify with the included query** at the end of the file

**Pros:**
- ✅ Complete control over which users get sample data
- ✅ All sample data (links, analytics, contacts, etc.) fully populated
- ✅ Verification query included

**Cons:**
- ⚠️ Requires manual find & replace
- ⚠️ Must be careful to replace ALL occurrences
- ⚠️ More steps involved

---

## 🎯 Recommended Approach

### For Quick Testing:
**Use Option 1** (`012_sample_data.sql`)
- Fastest setup
- Automatic profile creation
- Perfect for development

### For Production-like Demo:
**Use Option 2** (`012_sample_data_MANUAL.sql`)
- Complete sample dataset
- Full analytics, links, contacts, media
- Better for showcasing features

---

## 🔍 Why This Happens

Supabase uses PostgreSQL foreign key constraints to maintain data integrity:

```sql
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    ...
);
```

This means:
- ✅ Every profile **must** have a matching user in `auth.users`
- ❌ You **cannot** insert profiles with random/fake UUIDs
- ✅ When a user is deleted, their profile auto-deletes (CASCADE)

This is a **security feature** that ensures profiles are always linked to authenticated users.

---

## 📊 Expected Sample Data Counts

After running either option successfully, you should have:

| Table | Records |
|-------|---------|
| Profiles | 3 |
| Links | 15 (5 per user) |
| Analytics | 8-9 |
| Closet Items | 9 (3 per user) |
| Business Cards | 3 |
| QR Codes | 6 (2 per user) |
| Social Accounts | 9 (3 per user) |
| Contacts | 7 |
| Affiliates | 3 |
| Referrals | 4 |
| Media Items | 6 (2 per user) |
| Interactive Embeds | 6 (2 per user) |
| Analytics Events | 4 |
| Daily Counters | 6 |

---

## ❌ Skip Sample Data (Production Approach)

**For production**, you don't need sample data at all:

1. Users sign up through your application
2. Your application creates profiles automatically using triggers (from `012_create_triggers.sql`)
3. Users add their own links, media, etc.

This is the **recommended production approach** - let real users create real data.

---

## 🐛 Troubleshooting

### Error: "violates foreign key constraint profiles_id_fkey"
**Cause:** No users exist in `auth.users` table  
**Solution:** Create users first (see steps above)

### Error: "duplicate key value violates unique constraint"
**Cause:** Sample data already inserted or usernames already taken  
**Solution:** Either skip sample data or change the usernames in the SQL file

### No data inserted (Option 1)
**Cause:** No users found in `auth.users`  
**Solution:** Check terminal output for "No users found" message - create users first

---

## 📝 Notes

- Both files are **safe to run multiple times** (use `ON CONFLICT` or checks)
- Sample data uses realistic demo data for testing
- All timestamps are relative (using `NOW() - INTERVAL`)
- Analytics data includes various device types, countries, and referrers
- Affiliate codes are unique: `JOHN2024`, `SARAH2024`, `MIKE2024`

---

**Need help?** Check `TROUBLESHOOTING_TYPE_MISMATCH.md` for more detailed error resolution.
