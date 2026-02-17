import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const FLUTTERWAVE_SECRET_KEY = Deno.env.get('FLUTTERWAVE_SECRET_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const { transactionId } = await req.json()

    if (!transactionId) {
      return new Response(JSON.stringify({ error: 'transactionId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Verify with Flutterwave using the SECRET key (server-side only)
    const res = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    )

    if (!res.ok) {
      throw new Error(`Flutterwave verification failed: ${res.status}`)
    }

    const result = await res.json()

    // If successful, update the mpesa_transactions record
    if (result.status === 'success' && result.data?.status === 'successful') {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

      await supabase
        .from('mpesa_transactions')
        .update({
          status: 'completed',
          mpesa_receipt_number: result.data.flw_ref || result.data.tx_ref,
          result_code: 0,
          result_description: 'Transaction successful',
          transaction_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', transactionId)
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
