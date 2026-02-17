# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click "Select a project" at the top
   - Click "NEW PROJECT"
   - Name: "ACK Nkubu Parish App"
   - Click "CREATE"

3. **Enable Google+ API**
   - In the left menu, go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and click "ENABLE"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" (unless you have Google Workspace)
   - Click "CREATE"
   
   **Fill in the form:**
   - App name: `ACK St Francis Nkubu Parish`
   - User support email: `ackstfrancisnkubu@gmail.com`
   - Developer contact: `ackstfrancisnkubu@gmail.com`
   - Click "SAVE AND CONTINUE"
   
   **Scopes:**
   - Click "ADD OR REMOVE SCOPES"
   - Select: `email`, `profile`, `openid`
   - Click "UPDATE" then "SAVE AND CONTINUE"
   
   **Test users (optional for development):**
   - Add `ackstfrancisnkubu@gmail.com`
   - Click "SAVE AND CONTINUE"

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "ACK Nkubu Web App"
   
   **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://your-vercel-domain.vercel.app
   ```
   
   **Authorized redirect URIs:**
   ```
   https://bcioubwyogptmotwdgty.supabase.co/auth/v1/callback
   ```
   
   - Click "CREATE"
   - **COPY** the Client ID and Client Secret (you'll need these)

---

## Step 2: Configure Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://bcioubwyogptmotwdgty.supabase.co/project/bcioubwyogptmotwdgty/auth/providers

2. **Enable Google Provider**
   - Find "Google" in the list
   - Toggle it ON

3. **Add Google Credentials**
   - Paste your **Client ID** from Google
   - Paste your **Client Secret** from Google
   - Click "SAVE"

4. **Configure Redirect URLs** (if not already done)
   - Go to: Authentication → URL Configuration
   - Add Site URL: `http://localhost:5173` (for development)
   - Add Redirect URLs:
     ```
     http://localhost:5173/**
     https://your-vercel-domain.vercel.app/**
     ```

---

## Step 3: Test Locally

1. **Start your dev server**
   ```bash
   npm run dev
   ```

2. **Go to login page**
   - Visit: http://localhost:5173/login

3. **Click "Continue with Google"**
   - Should redirect to Google sign-in
   - Select your Google account
   - Grant permissions
   - Should redirect back to /home

---

## Step 4: Deploy to Production

1. **Update Google Cloud Console**
   - Go back to your OAuth credentials
   - Add production URLs:
   
   **Authorized JavaScript origins:**
   ```
   https://your-production-domain.com
   ```
   
   **Authorized redirect URIs:**
   ```
   https://bcioubwyogptmotwdgty.supabase.co/auth/v1/callback
   ```

2. **Update Supabase**
   - Add production URL to Site URL
   - Add production URL to Redirect URLs

3. **Test on production**
   - Visit your live site
   - Try Google sign-in

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches:
  `https://bcioubwyogptmotwdgty.supabase.co/auth/v1/callback`

### Error: "Access blocked: This app's request is invalid"
- Complete the OAuth consent screen configuration
- Add test users if using "External" user type

### Error: "Invalid client"
- Double-check Client ID and Secret in Supabase
- Make sure they're copied correctly with no extra spaces

### Users not being created in profiles table
- Check if you have a trigger/function to create profile on signup
- Or manually create profile after first Google sign-in

---

## Security Notes

✅ **Client ID and Secret are safe in Supabase** - they're server-side
✅ **OAuth flow is handled by Supabase** - secure by default
✅ **Users are authenticated via Google** - no password storage needed

---

## Quick Reference

**Google Console:** https://console.cloud.google.com/apis/credentials
**Supabase Auth:** https://bcioubwyogptmotwdgty.supabase.co/project/bcioubwyogptmotwdgty/auth/providers
**Redirect URI:** `https://bcioubwyogptmotwdgty.supabase.co/auth/v1/callback`
