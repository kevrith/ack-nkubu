# Quick Setup Guide - New Features

## 🚀 Installation Steps

### 1. Run Database Migration

Go to your Supabase project → SQL Editor → New Query

Copy and paste the contents of:
```
supabase/migrations/020_offline_whatsapp_referrals.sql
```

Click "Run" to execute the migration.

### 2. Verify Tables Created

Check that these tables exist in your database:
- `offline_bible_downloads`
- `referrals`

Check that these columns were added:
- `cell_groups.whatsapp_link`
- `cell_groups.whatsapp_enabled`
- `profiles.referral_code`
- `profiles.referred_by`

### 3. Test the Features

#### Test Offline Bible:
1. Login to the app
2. Go to Bible page
3. Click "Offline" tab
4. Try downloading a book (e.g., Genesis)
5. Verify it appears as downloaded

#### Test WhatsApp Sharing:
1. Go to Bible page → Read a chapter
2. Click the green WhatsApp button
3. Verify it opens WhatsApp with the share text

#### Test Cell Group WhatsApp:
1. Go to Admin → Cell Groups
2. Edit a cell group
3. Enable WhatsApp integration
4. Add a WhatsApp group link (format: https://chat.whatsapp.com/...)
5. Save
6. Go to Cell Groups page as a regular user
7. Click on the group
8. Verify "Join WhatsApp Group" button appears

#### Test Referral System:
1. Go to Profile page
2. Click "View Referral Program"
3. Copy your referral link
4. Open in incognito/private window
5. Register with the referral link
6. Verify the referral appears in your dashboard

## 🔍 Troubleshooting

### Migration Fails
- Check if tables already exist
- Verify you have admin access to Supabase
- Check for syntax errors in the SQL

### Referral Code Not Generated
- Check the trigger is created: `ensure_referral_code`
- Manually run: `UPDATE profiles SET referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)) WHERE referral_code IS NULL;`

### WhatsApp Button Not Working
- Verify the link format is correct
- Check browser allows opening WhatsApp links
- Test on mobile device

### Offline Downloads Not Saving
- Check RLS policies are enabled
- Verify user is authenticated
- Check browser console for errors

## 📊 Monitoring

### Check Referral Stats
```sql
SELECT 
  p.full_name,
  p.referral_code,
  COUNT(r.id) as total_referrals
FROM profiles p
LEFT JOIN referrals r ON r.referrer_id = p.id
GROUP BY p.id, p.full_name, p.referral_code
ORDER BY total_referrals DESC;
```

### Check Offline Downloads
```sql
SELECT 
  p.full_name,
  COUNT(o.id) as books_downloaded
FROM profiles p
LEFT JOIN offline_bible_downloads o ON o.user_id = p.id
GROUP BY p.id, p.full_name
ORDER BY books_downloaded DESC;
```

### Check WhatsApp Groups
```sql
SELECT 
  name,
  whatsapp_enabled,
  whatsapp_link IS NOT NULL as has_link
FROM cell_groups
WHERE is_active = true;
```

## ✅ Success Checklist

- [ ] Migration executed successfully
- [ ] All new tables visible in Supabase
- [ ] Referral codes generated for existing users
- [ ] Offline Bible downloads working
- [ ] WhatsApp share buttons functional
- [ ] Cell group WhatsApp links working
- [ ] Referral tracking operational
- [ ] Registration with referral code works
- [ ] Admin can manage WhatsApp links

## 🎉 You're Done!

All features are now live and ready to use!
