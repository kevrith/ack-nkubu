# High Priority Features Setup Guide

## 1. ✅ Cloudinary Integration for Media Uploads

### Setup Steps:
1. **Create Cloudinary Account** (if you don't have one):
   - Go to https://cloudinary.com/users/register/free
   - Sign up for a free account

2. **Get Your Credentials**:
   - After login, go to Dashboard
   - Copy your **Cloud Name**
   - Go to Settings → Upload → Upload Presets
   - Create an unsigned upload preset named `ack-parish-unsigned`
   - Set mode to "Unsigned"

3. **Update .env.local**:
   ```bash
   VITE_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=ack-parish-unsigned
   ```

### Usage:
- **Admin → Add Content → Sermon**: Upload audio/video files directly
- Files are automatically uploaded to Cloudinary
- URLs are stored in the database
- Supports audio (100MB), video (500MB), and documents

### Files Created:
- `src/lib/cloudinary.ts` - Upload utility
- `src/components/shared/MediaUploader.tsx` - Reusable uploader component
- Updated `src/pages/admin/AdminContentPage.tsx` - Integrated uploader in sermon form

---

## 2. ✅ Bible Bookmarks UI

### Features:
- **Bookmark verses** while reading
- **Add personal notes** to bookmarks
- **Edit and delete** bookmarks
- **View all bookmarks** in one place

### Usage:
1. Go to **Bible** page
2. Click **Bookmarks** tab
3. View all your saved bookmarks
4. Click edit icon to add/update notes
5. Click delete icon to remove bookmarks

### Database:
- Uses existing `bible_bookmarks` table
- Stores: version, book, chapter, verse, note
- Synced per user

### Files Created:
- `src/services/bookmark.service.ts` - Bookmark CRUD operations
- `src/components/bible/BibleBookmarks.tsx` - Bookmarks UI
- Updated `src/pages/app/BiblePage.tsx` - Added bookmarks tab

### Next Steps (Optional):
- Add bookmark button in ChapterView component
- Implement verse highlighting
- Add bookmark sync across devices

---

## 3. ✅ Clergy Pastoral Care Dashboard

### Features:
- **View all pastoral care requests**
- **Filter by status**: pending, in_progress, all
- **Update request status**: acknowledge, start working, complete
- **Add clergy notes** (private)
- **Assign requests** to clergy automatically

### Access:
- **Route**: `/clergy/pastoral-care`
- **Permissions**: Clergy and Admin roles only
- **Navigation**: Sidebar → Pastoral Care (for clergy/admin)

### Workflow:
1. Member submits pastoral care request
2. Clergy sees request in dashboard
3. Clergy clicks "Acknowledge" or "Start Working"
4. Request auto-assigns to clergy who started it
5. Clergy adds private notes
6. Clergy marks as "Complete" when done

### Files Created:
- `src/pages/admin/ClergyPastoralDashboard.tsx` - Full dashboard
- Updated `src/router/index.tsx` - Added route with role guard
- Updated `src/components/layout/DesktopSidebar.tsx` - Added navigation link

---

## 4. ✅ Admin User Management

### Features:
- **View all users** in a table
- **Search users** by name, phone, or membership number
- **Change user roles**: basic_member, leader, clergy, admin
- **Toggle active/inactive** status
- **View user details**: cell group, membership number, join date

### Access:
- **Route**: `/admin/users`
- **Permissions**: Admin role only
- **Navigation**: Sidebar → Manage Users (admin only)

### Usage:
1. Go to Admin → Manage Users
2. Search for specific user
3. Click edit icon next to role
4. Select new role from dropdown
5. Click save icon
6. Toggle active/inactive status as needed

### Files Created:
- `src/pages/admin/AdminUsersPage.tsx` - User management interface
- Updated `src/router/index.tsx` - Added admin route
- Updated `src/components/layout/DesktopSidebar.tsx` - Added navigation

---

## 5. ✅ Real Flutterwave M-Pesa Integration

### Setup Steps:
1. **Create Flutterwave Account**:
   - Go to https://flutterwave.com/ke
   - Sign up for an account
   - Complete KYC verification

2. **Get API Keys**:
   - Go to Settings → API Keys
   - Copy your **Public Key** (starts with FLWPUBK_TEST for test mode)
   - For production, use live keys (FLWPUBK-)

3. **Update .env.local**:
   ```bash
   VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-actual-key-X
   ```

### Features:
- **Real M-Pesa STK Push** (replaces simulation)
- **Transaction tracking** in database
- **Status updates**: pending, completed, failed
- **Phone number validation** (Kenyan format)
- **Multiple giving categories**

### How It Works:
1. User enters amount and M-Pesa phone number
2. System validates phone number (+254 format)
3. Creates giving record in database
4. Calls Flutterwave API to initiate M-Pesa payment
5. User receives STK push on their phone
6. User enters M-Pesa PIN to complete
7. Transaction status updated in database

### Files Created:
- `src/lib/flutterwave.ts` - Flutterwave API integration
- Updated `src/components/giving/GivingForm.tsx` - Real payment flow

### Testing:
- Use test mode keys for development
- Test phone numbers: Use your actual Safaricom number
- Test amounts: Start with small amounts (KES 10-100)

### Production Checklist:
- [ ] Complete Flutterwave KYC verification
- [ ] Switch to live API keys
- [ ] Test with real transactions
- [ ] Set up webhook for payment confirmations
- [ ] Implement transaction verification polling

---

## Navigation Updates

### Admin Sidebar (for Admin role):
- Dashboard
- Add Content
- **Manage Users** ← NEW
- **Pastoral Care** ← NEW (if clergy/admin)

### Clergy Sidebar (for Clergy role):
- Dashboard
- Add Content
- **Pastoral Care** ← NEW

### Bible Page Tabs:
- Read
- Search
- **Bookmarks** ← NEW

---

## Environment Variables Summary

Update your `.env.local` with these values:

```bash
# Supabase (already configured)
VITE_SUPABASE_URL=https://bcioubwyogptmotwdgty.supabase.co
VITE_SUPABASE_ANON_KEY=your-key

# api.bible (already configured)
VITE_API_BIBLE_KEY=AK8m0M9uLXZUPYqwYyDtN

# Flutterwave (UPDATE THIS)
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-actual-key-X

# Cloudinary (UPDATE THESE)
VITE_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=ack-parish-unsigned
```

---

## Testing Checklist

### 1. Cloudinary Upload:
- [ ] Go to Admin → Add Content → Sermon
- [ ] Select audio/video type
- [ ] Click "Choose File" and upload a test file
- [ ] Verify "Media uploaded successfully" message
- [ ] Publish sermon and verify media URL is saved

### 2. Bible Bookmarks:
- [ ] Go to Bible page
- [ ] Click Bookmarks tab
- [ ] Verify empty state shows
- [ ] (Manual bookmark creation via SQL for now)
- [ ] Verify bookmarks display correctly
- [ ] Test edit and delete functions

### 3. Clergy Pastoral Dashboard:
- [ ] Login as clergy or admin user
- [ ] Go to Pastoral Care from sidebar
- [ ] Verify requests display
- [ ] Test status filters (all, pending, in_progress)
- [ ] Click "Acknowledge" on a pending request
- [ ] Add clergy notes
- [ ] Mark request as complete

### 4. Admin User Management:
- [ ] Login as admin user
- [ ] Go to Manage Users from sidebar
- [ ] Verify all users display in table
- [ ] Test search functionality
- [ ] Edit a user's role
- [ ] Toggle active/inactive status

### 5. Flutterwave M-Pesa:
- [ ] Go to Giving page
- [ ] Enter amount (e.g., KES 50)
- [ ] Enter valid Kenyan phone number
- [ ] Click "Give"
- [ ] Verify M-Pesa prompt on phone (if using real keys)
- [ ] Check transaction status in database

---

## Database Queries for Testing

### Create Test Bookmark:
```sql
INSERT INTO bible_bookmarks (user_id, version, book_id, chapter, verse, note)
VALUES (
  'your-user-id',
  'NIV',
  'JHN',
  3,
  16,
  'For God so loved the world...'
);
```

### Create Test Pastoral Care Request:
```sql
INSERT INTO pastoral_care_requests (requester_id, type, details, status)
VALUES (
  'your-user-id',
  'prayer',
  'Please pray for my family',
  'pending'
);
```

### Make User Admin:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
```

### Make User Clergy:
```sql
UPDATE profiles SET role = 'clergy' WHERE id = 'your-user-id';
```

---

## Next Steps

### Immediate:
1. Set up Cloudinary account and update .env.local
2. Set up Flutterwave account and update .env.local
3. Test all 5 features
4. Create test data for bookmarks and pastoral care

### Short-term:
1. Add bookmark button in Bible chapter view
2. Implement Flutterwave webhook for payment confirmations
3. Add email notifications for pastoral care requests
4. Add analytics charts to admin dashboard

### Medium-term:
1. Implement reading plans UI
2. Add sermon series grouping
3. Create community groups feature
4. Add push notifications (Firebase)

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Check Supabase logs for database errors
4. Test API keys in Postman/curl first
5. Review RLS policies if permission errors occur

---

**All 5 high-priority features are now implemented and ready for testing!** 🎉
