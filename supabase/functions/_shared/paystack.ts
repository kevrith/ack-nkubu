// Shared settlement logic for Paystack giving.
//
// Both the webhook (Paystack calls us) and the verify endpoint (the browser
// returns from checkout) end up here, so a payment settles exactly once no
// matter which arrives first.
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

export interface SettleResult {
  status: 'success' | 'failed' | 'pending' | 'not_found'
  already_settled?: boolean
  giving_record_id?: string | null
  message?: string
}

/** ACK-2026-4F3A9C — human-readable and unique enough for a parish receipt. */
function receiptNumber(): string {
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
  return `ACK-${new Date().getFullYear()}-${rand}`
}

/**
 * Apply a Paystack outcome to our records.
 *
 * On success this creates the giving_record — the first and only point at which
 * a contribution is counted — and links it back to the transaction. Re-running
 * with the same reference is a no-op, so duplicate webhooks are harmless.
 */
export async function settlePaystackTransaction(
  admin: SupabaseClient,
  reference: string,
  paystackData: Record<string, any>,
): Promise<SettleResult> {
  const { data: txn, error: loadError } = await admin
    .from('payment_transactions')
    .select('*')
    .eq('reference', reference)
    .maybeSingle()

  if (loadError) return { status: 'failed', message: loadError.message }
  if (!txn) return { status: 'not_found', message: 'Unknown payment reference.' }

  // Idempotency: a settled transaction stays settled.
  if (txn.status === 'success') {
    return { status: 'success', already_settled: true, giving_record_id: txn.giving_record_id }
  }

  const paystackStatus = String(paystackData?.status ?? '').toLowerCase()

  if (paystackStatus !== 'success') {
    const failed = paystackStatus === 'abandoned' ? 'abandoned' : 'failed'
    await admin.from('payment_transactions').update({
      status: failed,
      failure_reason: paystackData?.gateway_response ?? `Paystack reported "${paystackStatus}"`,
      provider_payload: paystackData,
    }).eq('reference', reference)
    return { status: paystackStatus === 'abandoned' ? 'pending' : 'failed', message: paystackData?.gateway_response }
  }

  // Trust Paystack's amount over anything the client sent us.
  const paidKes = Number(paystackData?.amount ?? 0) / 100

  const { data: giving, error: givingError } = await admin
    .from('giving_records')
    .insert({
      donor_id: txn.is_anonymous ? null : txn.user_id,
      amount_kes: paidKes > 0 ? paidKes : txn.amount_kes,
      category: txn.category,
      is_anonymous: txn.is_anonymous,
      description: `Paystack ${txn.channel === 'mobile_money' ? 'M-Pesa' : 'card'} · ${reference}`,
      receipt_number: receiptNumber(),
      giving_date: paystackData?.paid_at ?? new Date().toISOString(),
    })
    .select('id')
    .single()

  if (givingError) {
    // The money is real even if our bookkeeping failed — record that plainly
    // rather than marking the payment failed.
    await admin.from('payment_transactions').update({
      status: 'success',
      paid_at: paystackData?.paid_at ?? new Date().toISOString(),
      failure_reason: `Paid, but the giving record failed to save: ${givingError.message}`,
      provider_payload: paystackData,
    }).eq('reference', reference)
    return { status: 'success', giving_record_id: null, message: givingError.message }
  }

  await admin.from('payment_transactions').update({
    status: 'success',
    paid_at: paystackData?.paid_at ?? new Date().toISOString(),
    giving_record_id: giving.id,
    provider_reference: String(paystackData?.id ?? txn.provider_reference ?? ''),
    provider_payload: paystackData,
    failure_reason: null,
  }).eq('reference', reference)

  // Let the giver know it landed. Best-effort: never fail the payment on this.
  if (txn.user_id) {
    const { error: notifyError } = await admin.from('notifications').insert({
      user_id: txn.user_id,
      title: 'Giving received',
      message: `Thank you. Your ${txn.category.replace('_', ' ')} of KES ${(paidKes > 0 ? paidKes : txn.amount_kes).toLocaleString()} was received.`,
      type: 'giving',
    })
    if (notifyError) console.error('Giving notification failed:', notifyError.message)
  }

  return { status: 'success', giving_record_id: giving.id }
}
