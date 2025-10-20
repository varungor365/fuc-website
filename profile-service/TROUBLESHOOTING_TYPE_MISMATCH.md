# 🚨 TROUBLESHOOTING: Column "username" does not exist / Type Mismatch Error

## ❌ ERROR YOU'RE SEEING

```
ERROR: 42703: column "username" does not exist
ERROR: 42804: foreign key constraint "links_profile_id_fkey" cannot be implemented
DETAIL: Key columns "profile_id" and "id" are of incompatible types: uuid and bigint.
```

---

## 🔍 ROOT CAUSE

Your Supabase database has an **OLD `profiles` table** that was created with:
- `id` type: **BIGINT** (wrong!)
- Missing columns like `username`
- Wrong structure

The new schema requires:
- `id` type: **UUID** (correct!)
- All proper columns including `username`
- References to `auth.users(id)` which is UUID

---

## ✅ SOLUTION: Run CLEAN_DEPLOY.sql First!

### Option 1: Quick Fix (Recommended)

**Step 1: Run CLEAN_DEPLOY.sql**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy contents of `CLEAN_DEPLOY.sql`
4. Click **RUN**
5. You should see: "All tables, types, and functions dropped successfully"

**Step 2: Run migration files in order**
```
001_create_enum_types.sql
002_create_profiles_table.sql
003_create_links_analytics.sql
... (continue through 012)
```

### Option 2: One-Shot Deployment

**Use QUICK_START_DEPLOY.sql:**
1. This combines cleanup + core tables in one file
2. Drops old tables automatically
3. Creates new tables with correct UUID types

---

## 🔧 MANUAL CLEANUP (If scripts don't work)

Run this directly in Supabase SQL Editor:

```sql
-- Drop all existing tables
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.links CASCADE;
DROP TABLE IF EXISTS public.analytics CASCADE;
DROP TABLE IF EXISTS public.closet_items CASCADE;
DROP TABLE IF EXISTS public.business_cards CASCADE;
DROP TABLE IF EXISTS public.qr_codes CASCADE;
DROP TABLE IF EXISTS public.social_accounts CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.contact_interactions CASCADE;
DROP TABLE IF EXISTS public.automation_logs CASCADE;
DROP TABLE IF EXISTS public.webhook_logs CASCADE;
DROP TABLE IF EXISTS public.affiliates CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.payout_requests CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.analytics_daily_counters CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;
DROP TABLE IF EXISTS public.interactive_embeds CASCADE;
DROP TABLE IF EXISTS public.profile_customizations CASCADE;

-- Drop types
DROP TYPE IF EXISTS public.event_type CASCADE;

-- Now run 001_create_enum_types.sql and continue...
```

---

## ✅ VERIFICATION

After cleanup, verify tables are gone:

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public';

-- Should return EMPTY or only tables you want to keep
```

Then check profiles table doesn't exist:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Should return NO ROWS
```

---

## 📋 DEPLOYMENT CHECKLIST

- [ ] ✅ **Backup any important data** (if you have production data)
- [ ] ✅ **Run CLEAN_DEPLOY.sql** (drops all tables)
- [ ] ✅ **Verify tables are dropped** (run verification query above)
- [ ] ✅ **Run 001_create_enum_types.sql**
- [ ] ✅ **Run 002_create_profiles_table.sql** 
- [ ] ✅ **Verify profiles has UUID id** (check below)
- [ ] ✅ **Continue with 003-012**

### Verify profiles table structure:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Should show:
-- id          | uuid | NO
-- username    | text | NO
-- ... (and more columns)
```

---

## 🎯 WHY THIS HAPPENS

The error occurs because:

1. **Previous deployment** created tables with BIGINT IDs
2. **Your new schema** uses UUID IDs (to match Supabase auth.users)
3. **PostgreSQL** won't let you create foreign keys between incompatible types
4. **`CREATE TABLE IF NOT EXISTS`** doesn't modify existing tables

**Solution:** Drop old tables, create new ones with correct structure!

---

## 🚀 AFTER SUCCESSFUL DEPLOYMENT

You'll have:
- ✅ 19 tables with consistent UUID types
- ✅ All foreign keys working correctly
- ✅ Proper references to auth.users
- ✅ All indexes and triggers in place

---

## 📞 STILL HAVING ISSUES?

1. Run **DIAGNOSTIC.sql** to see current state
2. Check **TYPE_MISMATCH_RESOLUTION.md** for detailed explanation
3. Review **SPLIT_SCHEMA_DEPLOYMENT_GUIDE.md** for step-by-step guide

**Remember:** You MUST clean up old tables before deploying new schema!
