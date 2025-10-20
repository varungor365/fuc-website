# FASHUN.CO.IN - Split Schema Deployment Guide

## 📋 Overview
The database schema has been split into **12 separate SQL files** for easier deployment and troubleshooting. Each file can be executed independently and includes verification steps.

---

## 🚀 DEPLOYMENT ORDER (Execute in this exact sequence)

### Before Starting
1. Open Supabase Dashboard → SQL Editor
2. **CRITICAL:** You MUST run CLEAN_DEPLOY.sql first!

---

### Step 1: ⚠️ MANDATORY Clean Deployment
**YOU MUST DO THIS FIRST - Your database has existing tables with wrong structure!**

**Error you're seeing:**
- `column "username" does not exist` 
- `incompatible types: uuid and bigint`

**This means:** Your existing `profiles` table uses BIGINT, not UUID!

**Solution: Execute CLEAN_DEPLOY.sql**
```sql
-- Copy CLEAN_DEPLOY.sql contents into Supabase SQL Editor
-- Click RUN
-- This will DROP all existing tables safely
```

**⚠️ WARNING:** This deletes all data in these tables. Backup first if needed!

After running CLEAN_DEPLOY.sql, you should see:
```
All tables, types, and functions dropped successfully. Ready for fresh deployment.
```

---

### Step 2: Execute Migration Files in Order

#### 001_create_enum_types.sql
**Purpose:** Creates custom enum types (event_type)
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "event_type enum created successfully"

#### 002_create_profiles_table.sql
**Purpose:** Creates core profiles table (links to auth.users)
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "profiles table created successfully"

#### 003_create_links_analytics.sql
**Purpose:** Creates links and analytics tables
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "links and analytics tables created successfully"

#### 004_create_ecommerce_tables.sql
**Purpose:** Creates closet_items for e-commerce integration
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "closet_items table created successfully"

#### 005_create_cards_qr_tables.sql
**Purpose:** Creates business_cards and qr_codes tables
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "business_cards and qr_codes tables created successfully"

#### 006_create_social_crm_tables.sql
**Purpose:** Creates social_accounts, contacts, and contact_interactions
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "social_accounts, contacts, and contact_interactions tables created successfully"

#### 007_create_automation_webhook_tables.sql
**Purpose:** Creates automation_logs and webhook_logs
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "automation_logs and webhook_logs tables created successfully"

#### 008_create_affiliate_tables.sql
**Purpose:** Creates affiliates, referrals, and payout_requests
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "affiliates, referrals, and payout_requests tables created successfully"

#### 009_create_advanced_analytics_tables.sql
**Purpose:** Creates analytics_events and analytics_daily_counters
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "analytics_events and analytics_daily_counters tables created successfully"

#### 010_create_media_customization_tables.sql
**Purpose:** Creates media_items, interactive_embeds, and profile_customizations
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "media_items, interactive_embeds, and profile_customizations tables created successfully"

#### 011_create_functions.sql
**Purpose:** Creates database functions (update_updated_at, generate_affiliate_code, etc.)
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "Database functions created successfully"

#### 012_create_triggers.sql
**Purpose:** Creates all triggers for auto-updating timestamps and affiliate creation
**Execution:** Copy and paste into Supabase SQL Editor → Run
**Verification:** Should see "All triggers created successfully"

---

## ✅ POST-DEPLOYMENT VERIFICATION

After executing all 12 files, run this verification query:

```sql
-- Check all tables were created
SELECT 
    schemaname,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Should show 19 tables total:
-- 1. affiliates
-- 2. analytics
-- 3. analytics_daily_counters
-- 4. analytics_events
-- 5. business_cards
-- 6. closet_items
-- 7. contact_interactions
-- 8. contacts
-- 9. interactive_embeds
-- 10. links
-- 11. media_items
-- 12. payout_requests
-- 13. profile_customizations
-- 14. profiles
-- 15. qr_codes
-- 16. referrals
-- 17. social_accounts
-- 18. automation_logs
-- 19. webhook_logs
```

### Check Foreign Keys
```sql
-- Verify all foreign keys are correctly set up
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table,
    ccu.column_name AS foreign_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

### Check Triggers
```sql
-- Verify all triggers were created
SELECT 
    trigger_name,
    event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;

-- Should show 12 triggers total
```

---

## 🔧 TROUBLESHOOTING

### If a File Fails:
1. **Read the error message** - it will tell you exactly what's wrong
2. **Check dependencies** - ensure all previous files executed successfully
3. **Run DIAGNOSTIC.sql** - check current database state
4. **Common Issues:**
   - Type mismatch → Run CLEAN_DEPLOY.sql first
   - "already exists" → Safe to ignore if using IF NOT EXISTS
   - Foreign key error → Verify referenced table was created

### Starting Over:
```sql
-- Execute CLEAN_DEPLOY.sql to drop everything
-- Then restart from file 001
```

---

## 📦 NEXT STEPS

After successful deployment:

1. **Apply Security Policies:**
   - Execute `011_security_policies.sql` (from original set)
   
2. **Add Sample Data (Optional):**
   - Execute `012_sample_data.sql` (from original set)

3. **Verify Application Connection:**
   - Update your Supabase connection strings
   - Test authentication flow
   - Verify RLS policies work correctly

---

## 🎯 ADVANTAGES OF SPLIT DEPLOYMENT

✅ **Easier Troubleshooting** - Pinpoint exactly which table/feature has issues
✅ **Flexible Deployment** - Deploy only what you need
✅ **Better Testing** - Test each component independently
✅ **Clear Progress** - See exactly where you are in deployment
✅ **Rollback Friendly** - Easy to undo specific changes

---

## 📞 SUPPORT

If you encounter issues:
- Check DIAGNOSTIC.sql output
- Review TYPE_MISMATCH_RESOLUTION.md
- Consult DATABASE_DEPLOYMENT_GUIDE.md
- All files include verification queries

**All 19 tables deployed with full UUID consistency!** 🎉
