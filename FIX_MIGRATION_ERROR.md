# 🚨 FIX: Run This Migration NOW

## The Error You're Seeing:
```
GET .../referrals?select=... 400 (Bad Request)
```

**Cause:** The `referrals` table doesn't exist yet in your database.

## ✅ SOLUTION: Run the Migration

### Step 1: Open Supabase
1. Go to https://supabase.com/dashboard
2. Select your project: `bcioubwyogptmotwdgty`
3. Click "SQL Editor" in the left sidebar

### Step 2: Copy the Migration
Copy ALL the SQL from: `supabase/migrations/020_offline_whatsapp_referrals.sql`

### Step 3: Run It
1. Click "New Query" in SQL Editor
2. Paste the entire SQL
3. Click "Run" (or press Ctrl+Enter)
4. Wait for "Success. No rows returned"

### Step 4: Verify
Run this query to check tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('referrals', 'offline_bible_downloads');
```

You should see both tables listed.

### Step 5: Refresh Your App
1. Close all browser tabs with the app
2. Open the app again
3. The error should be gone!

## 🔍 Quick Verification Queries

### Check if referral codes were generated:
```sql
SELECT full_name, referral_code 
FROM profiles 
LIMIT 5;
```

### Check if tables exist:
```sql
SELECT * FROM referrals LIMIT 1;
SELECT * FROM offline_bible_downloads LIMIT 1;
```

### Check cell_groups columns:
```sql
SELECT whatsapp_link, whatsapp_enabled 
FROM cell_groups 
LIMIT 1;
```

## ⚠️ If Migration Fails

### Error: "relation already exists"
Some tables might already exist. Run this instead:
```sql
-- Just add the columns that are missing
ALTER TABLE cell_groups ADD COLUMN IF NOT EXISTS whatsapp_link TEXT;
ALTER TABLE cell_groups ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);

-- Generate codes for existing users
UPDATE profiles SET referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)) WHERE referral_code IS NULL;
```

### Error: "function already exists"
Drop and recreate:
```sql
DROP FUNCTION IF EXISTS generate_referral_code() CASCADE;
DROP FUNCTION IF EXISTS set_referral_code() CASCADE;
DROP TRIGGER IF EXISTS ensure_referral_code ON profiles;
```
Then run the migration again.

## ✅ Success Indicators

After running the migration, you should see:
- ✅ No more 400 errors in console
- ✅ Referral page loads without errors
- ✅ Profile page shows referral link
- ✅ Each user has a referral_code

---

**Run the migration NOW to fix the error!** 🚀
