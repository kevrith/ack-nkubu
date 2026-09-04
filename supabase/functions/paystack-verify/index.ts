// Confirms a contribution when the giver lands back on /giving/callback.
//
// The webhook is authoritative, but it can arrive after the browser redirect —
// so we ask Paystack directly and settle through the same shared path. Whichever
// gets there first wins; the second is a no-op.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { settlePaystackTransaction } from '../_shared/paystack.ts'

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    const authHeader = req.headers.get('Authorization') ?? ''
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return json({ error: 'Not signed in.' }, 401)

    const { reference } = await req.json()
    if (!reference || typeof reference !== 'string') {
      return json({ error: 'Missing payment reference.' }, 400)
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Only let a giver verify their own payment.
    const { data: txn } = await admin
      .from('payment_transactions')
      .select('user_id, status, amount_kes, category, channel')
      .eq('reference', reference)
      .maybeSingle()

    if (!txn) return json({ error: 'Unknown payment reference.' }, 404)
    if (txn.user_id !== user.id) return json({ error: 'Not your payment.' }, 403)

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } },
    )
    const result = await response.json()

    if (!response.ok || !result?.status) {
      return json({ error: result?.message ?? 'Could not verify with Paystack.' }, 502)
    }

    const settled = await settlePaystackTransaction(admin, reference, result.data)

    return json({
      status: settled.status,
      already_settled: settled.already_settled ?? false,
      amount_kes: txn.amount_kes,
      category: txn.category,
      channel: txn.channel,
      message: settled.message,
    })
  } catch (error) {
    return json({ error: (error as Error).message }, 400)
  }
})
