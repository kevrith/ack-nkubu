import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const FLUTTERWAVE_SECRET_HASH = Deno.env.get('FLUTTERWAVE_SECRET_HASH')!

serve(async (req) => {
  const signature = req.headers.get('verif-hash')
  if (signature !== FLUTTERWAVE_SECRET_HASH) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const payload = await req.json()
    const { txRef, amount, customer, status, flwRef } = payload

    if (status !== 'successful') {
      return new Response('OK', { status: 200 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { data: mpesaRecord } = await supabase
      .from('mpesa_transactions')
      .select('*')
      .eq('id', txRef)
      .single()

    if (mpesaRecord) {
      await supabase
        .from('mpesa_transactions')
        .update({
          status: 'completed',
          mpesa_receipt_number: flwRef,
          transaction_date: new Date().toISOString(),
        })
        .eq('id', txRef)
    } else {
      const phone = customer.phone_number.replace(/^\+254/, '0')
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .single()

      const { data: giving } = await supabase
        .from('giving_records')
        .insert({
          donor_id: profile?.id,
          amount_kes: amount,
          category: 'offering',
          is_anonymous: !profile,
        })
        .select()
        .single()

      await supabase
        .from('mpesa_transactions')
        .insert({
          giving_record_id: giving.id,
          phone_number: customer.phone_number,
          amount_kes: amount,
          mpesa_receipt_number: flwRef,
          status: 'completed',
          transaction_date: new Date().toISOString(),
        })
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Error', { status: 500 })
  }
})
