// Paystack server-to-server webhook — the authoritative source of truth for
// whether a contribution was actually paid.
//
// Every request is authenticated by verifying the x-paystack-signature header
// (HMAC SHA-512 of the raw body, keyed with the secret key) before anything is
// read from it. An unsigned or mis-signed request is rejected outright.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { settlePaystackTransaction } from '../_shared/paystack.ts'

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const encoder = new TextEncoder()

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Constant-time compare so a bad signature leaks nothing through timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function signatureFor(rawBody: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign'],
  )
  return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody)))
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }
  if (!PAYSTACK_SECRET_KEY) {
    console.error('PAYSTACK_SECRET_KEY is not set; cannot verify webhooks.')
    return new Response('Not configured', { status: 500 })
  }

  // Read the body as raw text: the signature is over the exact bytes sent.
  const rawBody = await req.text()
  const provided = req.headers.get('x-paystack-signature') ?? ''
  const expected = await signatureFor(rawBody, PAYSTACK_SECRET_KEY)

  if (!provided || !safeEqual(provided, expected)) {
    console.warn('Rejected webhook with an invalid signature.')
    return new Response('Invalid signature', { status: 401 })
  }

  let event: { event?: string; data?: Record<string, any> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return new Response('Bad payload', { status: 400 })
  }

  const reference = event.data?.reference
  if (!reference) {
    // Nothing addressed at us; acknowledge so Paystack stops retrying.
    return new Response('ok', { status: 200 })
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    if (event.event === 'charge.success') {
      const result = await settlePaystackTransaction(admin, reference, event.data!)
      console.log(`charge.success ${reference}:`, result.status, result.already_settled ? '(already settled)' : '')
    } else if (event.event === 'charge.failed') {
      await admin.from('payment_transactions').update({
        status: 'failed',
        failure_reason: event.data?.gateway_response ?? 'Charge failed',
        provider_payload: event.data,
      }).eq('reference', reference).neq('status', 'success')
    }
  } catch (error) {
    // Return 500 so Paystack retries rather than dropping a real payment.
    console.error('Webhook handling failed:', (error as Error).message)
    return new Response('Handler error', { status: 500 })
  }

  return new Response('ok', { status: 200 })
})
