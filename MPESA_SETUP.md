# M-Pesa Integration Setup

## 1. Database Migration

Run the new migration in Supabase SQL Editor:

```sql
-- Run: supabase/migrations/021_paybill_info.sql
```

Update the paybill details with your actual information:

```sql
UPDATE paybill_info 
SET 
  paybill_number = 'YOUR_ACTUAL_PAYBILL',
  account_number = 'YOUR_ACCOUNT_NUMBER',
  business_name = 'ACK St Francis Nkubu'
WHERE id = (SELECT id FROM paybill_info LIMIT 1);
```

## 2. Supabase Edge Functions

Deploy the new Edge Function:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy initiate-mpesa
```

## 3. Set Flutterwave Secret Key

Add your Flutterwave secret key to Supabase secrets:

```bash
# Set the secret key
supabase secrets set FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key_here

# Verify it's set
supabase secrets list
```

Or via Supabase Dashboard:
1. Go to Project Settings → Edge Functions
2. Add secret: `FLUTTERWAVE_SECRET_KEY` = `your_secret_key`

## 4. Get Your Flutterwave Keys

1. Login to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Go to Settings → API Keys
3. Copy:
   - **Public Key** (already in `.env.local` as `VITE_FLUTTERWAVE_PUBLIC_KEY`)
   - **Secret Key** (add to Supabase secrets)

## 5. Test the Integration

1. Start your dev server: `npm run dev`
2. Navigate to Giving page
3. Try both methods:
   - **Paybill Shortcut**: Tap "Open M-Pesa" button
   - **STK Push**: Fill form and submit

## Features Added

✅ **Server-side payment initiation** - Secret key never exposed to client
✅ **Paybill shortcut** - One-tap copy paybill number
✅ **Pre-filled USSD** - Opens M-Pesa with paybill details
✅ **Dual payment options** - Manual paybill or automated STK push

## Security Notes

- ✅ Secret key stored server-side only
- ✅ Payment initiation via Edge Function
- ✅ Transaction verification server-side
- ✅ RLS policies on paybill_info table

## Troubleshooting

**Edge Function not working?**
- Check secrets are set: `supabase secrets list`
- Check function logs: `supabase functions logs initiate-mpesa`

**Paybill not showing?**
- Verify migration ran successfully
- Check paybill_info table has data
- Ensure `is_active = true`

**M-Pesa USSD not opening?**
- Only works on mobile devices
- Requires phone with M-Pesa app installed
- Some browsers may block `tel:` links
