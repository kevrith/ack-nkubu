# Deployment Checklist

## Before Deploying

### 1. Build the App
```bash
npm run build
```

### 2. Test Production Build Locally
```bash
npm run preview
```

## After Getting Your Production URL (e.g., https://acknkubu.com)

### 3. Update Supabase Settings
**URL**: https://bcioubwyogptmotwdgty.supabase.co/project/bcioubwyogptmotwdgty/settings/auth

Add to **Site URL**:
```
https://yourdomain.com
```

Add to **Redirect URLs**:
```
https://yourdomain.com/**
https://yourdomain.com/auth/callback
```

### 4. Update Firebase Settings
**URL**: https://console.firebase.google.com/project/acknkubu/settings/general

Add to **Authorized domains**:
```
yourdomain.com
```

### 5. Update Flutterwave Settings
**URL**: https://dashboard.flutterwave.com/

Add **Redirect URL**:
```
https://yourdomain.com/giving
```

Add **Webhook URL** (if you create one):
```
https://yourdomain.com/api/payment-webhook
```

### 6. Update Cloudinary (Optional)
Your preset is "unsigned" so no changes needed.
If you want to restrict uploads, create a signed preset in Cloudinary dashboard.

## Deployment Options

### Option A: Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables from `.env.local`
4. Deploy

### Option B: Netlify
1. Push code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables

### Option C: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Environment Variables to Add in Hosting Platform

Copy all variables from `.env.local`:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_API_BIBLE_KEY
- VITE_FLUTTERWAVE_PUBLIC_KEY
- VITE_CLOUDINARY_CLOUD_NAME
- VITE_CLOUDINARY_UPLOAD_PRESET
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_VAPID_KEY

## Post-Deployment

### 7. Test Everything
- [ ] User registration/login
- [ ] Bible reading
- [ ] M-Pesa payments
- [ ] Push notifications
- [ ] PWA install prompt
- [ ] Image uploads (Cloudinary)
- [ ] All admin features

### 8. Update Production Flutterwave Key
Replace test key with production key:
```
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxx
```

## Custom Domain Setup

If using custom domain (e.g., acknkubu.com):
1. Add DNS records (A or CNAME) pointing to hosting provider
2. Update all URLs above with your custom domain
3. Enable SSL/HTTPS (usually automatic)

## Notes

- Your app is a **static frontend** with **serverless backend** (Supabase)
- No traditional backend server needed
- All API calls go to:
  - Supabase (database, auth, storage)
  - api.bible (Bible content)
  - Flutterwave (payments)
  - Cloudinary (media)
  - Firebase (push notifications)
