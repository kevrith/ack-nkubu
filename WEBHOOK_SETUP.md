# M-Pesa Webhook Integration

## How It Works

```
User pays via paybill → M-Pesa → Flutterwave → Webhook → Auto-record in database
```

### Flow:

1. **User pays manually** using paybill shortcut
2. **M-Pesa processes** payment to your paybill
3. **Flutterwave receives** payment notification
4. **Webhook triggers** your Edge Function
5. **Auto-creates** giving record in database
6. **Matches user** by phone number (if registered)

## Setup Steps

### 1. Deploy Webhook Function

```bash
supabase functions deploy mpesa-webhook
```

### 2. Set Webhook Secret

```bash
# Get from Flutterwave Dashboard → Settings → Webhooks
supabase secrets set FLUTTERWAVE_SECRET_HASH=your_webhook_hash
```

### 3. Configure Flutterwave Webhook

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Settings → Webhooks
3. Add webhook URL:
   ```
   https://bcioubwyogptmotwdgty.supabase.co/functions/v1/mpesa-webhook
   ```
4. Copy the "Secret Hash" and set it in step 2

### 4. Enable C2B (Customer to Business)

Contact Flutterwave support to enable:
- M-Pesa C2B payments
- Paybill integration
- Webhook notifications

## What Gets Auto-Recorded

✅ **Paybill payments** - When users pay via paybill shortcut
✅ **STK Push payments** - When users use the form
✅ **User matching** - Links payment to user by phone number
✅ **Anonymous donations** - Records even if user not found

## Webhook Payload Example

```json
{
  "event": "charge.completed",
  "data": {
    "id": 123456,
    "tx_ref": "unique-ref",
    "flw_ref": "FLW-MOCK-123",
    "amount": 1000,
    "currency": "KES",
    "customer": {
      "phone_number": "+254712345678",
      "email": "user@example.com"
    },
    "status": "successful"
  }
}
```

## Testing

### Test Webhook Locally

```bash
# Use ngrok or similar
ngrok http 54321

# Update webhook URL in Flutterwave to ngrok URL
https://your-ngrok-url.ngrok.io/functions/v1/mpesa-webhook
```

### Simulate Webhook

```bash
curl -X POST https://bcioubwyogptmotwdgty.supabase.co/functions/v1/mpesa-webhook \
  -H "verif-hash: your_secret_hash" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "successful",
    "amount": 100,
    "customer": {
      "phone_number": "+254712345678"
    },
    "flwRef": "TEST123",
    "txRef": "test-ref"
  }'
```

## Benefits

✅ **Auto-recording** - No manual entry needed
✅ **Real-time** - Instant record creation
✅ **User matching** - Links to profiles automatically
✅ **Audit trail** - Complete transaction history
✅ **Notifications** - Can notify users of received payments

## Limitations

⚠️ **Requires business account** - Not available on test/sandbox
⚠️ **Flutterwave approval** - Need to request C2B activation
⚠️ **Phone matching only** - Users must have phone in profile
⚠️ **Default category** - Manual payments default to "offering"

## Alternative: Manual Entry Form

If webhook isn't available, add a form for users to submit:
- M-Pesa transaction code
- Amount
- Category
- Date

Admin can verify and approve later.

**Want me to create the manual entry form instead?**
