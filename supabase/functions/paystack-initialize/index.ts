// Starts a Paystack checkout for a single giving contribution.
//
// The client picks a channel ("mobile_money" for M-Pesa, or "card") and we pass
// exactly that one channel to Paystack, so the hosted page opens straight on
// M-Pesa or straight on card entry rather than showing every method.
//
// Nothing is written to giving_records here: a contribution only becomes a
// giving record once Paystack confirms the charge (see paystack-webhook).
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SITE_URL = Deno.env.get('SITE_URL') || 'https://acknkubu.org'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const VALID_CHANNELS = ['mobile_money', 'card'] as const
const VALID_CATEGORIES = [
  'tithe', 'offering', 'harambee', 'building_fund', 'missions', 'welfare', 'other',
]

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  if (!PAYSTACK_SECRET_KEY) {
    return json({ error: 'Paystack is not configured on the server.' }, 500)
  }

  try {
    // Identify the giver from their own JWT — never trust a user_id in the body.
    const authHeader = req.headers.get('Authorization') ?? ''
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return json({ error: 'You must be signed in to give.' }, 401)
    }

    const { amount, category, channel, phone_number, is_anonymous } = await req.json()

    const amountKes = Number(amount)
    if (!Number.isFinite(amountKes) || amountKes < 10) {
      return json({ error: 'Enter an amount of at least KES 10.' }, 400)
    }
    if (!VALID_CHANNELS.includes(channel)) {
      return json({ error: 'Choose M-Pesa or card.' }, 400)
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return json({ error: 'Unknown giving category.' }, 400)
    }
    // Paystack's M-Pesa flow needs a phone number to push the prompt to.
    if (channel === 'mobile_money' && !/^254\d{9}$/.test(String(phone_number ?? ''))) {
      return json({ error: 'Enter a valid Kenyan M-Pesa number.' }, 400)
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Our own reference — it is what the webhook and the verify call key on.
    const reference = `ack-${crypto.randomUUID()}`

    const { error: insertError } = await admin.from('payment_transactions').insert({
      user_id: user.id,
      category,
      amount_kes: amountKes,
      is_anonymous: Boolean(is_anonymous),
      phone_number: channel === 'mobile_money' ? String(phone_number) : null,
      provider: 'paystack',
      channel,
      reference,
      status: 'pending',
    })
    if (insertError) {
      return json({ error: `Could not start the payment: ${insertError.message}` }, 500)
    }

    const paystackBody: Record<string, unknown> = {
      email: user.email ?? 'giving@acknkubu.org',
      // Paystack takes the smallest currency unit — cents for KES.
      amount: Math.round(amountKes * 100),
      currency: 'KES',
      reference,
      // The whole point: restrict the hosted page to the chosen method.
      channels: [channel],
      callback_url: `${SITE_URL}/giving/callback`,
      metadata: {
        category,
        user_id: user.id,
        is_anonymous: Boolean(is_anonymous),
        custom_fields: [
          { display_name: 'Giving category', variable_name: 'category', value: category },
        ],
      },
    }
    if (channel === 'mobile_money') {
      paystackBody.mobile_money = { phone: String(phone_number), provider: 'mpesa' }
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackBody),
    })
    const result = await response.json()

    if (!response.ok || !result?.status) {
      await admin.from('payment_transactions')
        .update({ status: 'failed', failure_reason: result?.message ?? 'Initialisation failed' })
        .eq('reference', reference)
      return json({ error: result?.message ?? 'Could not reach Paystack.' }, 502)
    }

    await admin.from('payment_transactions')
      .update({
        authorization_url: result.data?.authorization_url,
        provider_reference: result.data?.access_code,
      })
      .eq('reference', reference)

    return json({
      reference,
      authorization_url: result.data?.authorization_url,
      access_code: result.data?.access_code,
    })
  } catch (error) {
    return json({ error: (error as Error).message }, 400)
  }
})
