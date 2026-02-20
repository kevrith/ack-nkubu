# Quick M-Pesa STK Push Setup

## 1. Deploy Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project (get ref from dashboard URL)
supabase link --project-ref bcioubwyogptmotwdgty

# Deploy function
supabase functions deploy initiate-mpesa
```

## 2. Set Secret Key

```bash
# Get your Flutterwave SECRET key from dashboard
supabase secrets set FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your_secret_key_here
```

## 3. Test STK Push

- Use a real Kenyan M-Pesa number (07XX or 01XX)
- Must be registered for M-Pesa
- You'll receive STK push prompt on phone
- Enter M-Pesa PIN to complete

## Alternative: Test Without Edge Function

For now, you can test the paybill shortcut:
1. Click "Open M-Pesa" button
2. It opens M-Pesa app with paybill pre-filled
3. Complete payment manually
4. Admin can manually record it later

## Note on Paybill Auto-Recording

The paybill shortcut is for manual payments. To auto-record:
- Need M-Pesa C2B webhook (requires business account)
- Or users manually submit transaction code
- Or admin imports from M-Pesa statement

Would you like me to add a "Submit Manual Payment" form for paybill users?
