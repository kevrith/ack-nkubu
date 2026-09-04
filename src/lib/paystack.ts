import { supabase } from '@/lib/supabase'
import { GivingCategory } from '@/types/giving'

export type PaystackChannel = 'mobile_money' | 'card'

export interface InitializeArgs {
  amount: number
  category: GivingCategory
  channel: PaystackChannel
  /** Required for mobile_money — normalised 2547XXXXXXXX. */
  phone_number?: string
  is_anonymous?: boolean
}

export interface InitializeResult {
  reference: string
  authorization_url: string
  access_code?: string
}

export interface VerifyResult {
  status: 'success' | 'failed' | 'pending' | 'not_found'
  already_settled: boolean
  amount_kes?: number
  category?: string
  channel?: PaystackChannel
  message?: string
}

/**
 * Supabase surfaces a non-2xx edge function response as a generic
 * "Edge Function returned a non-2xx status code", hiding the real reason. Pull
 * the JSON `error` out of the response body so givers see something useful.
 */
async function readFunctionError(error: unknown, fallback: string): Promise<string> {
  const context = (error as { context?: Response })?.context
  if (context && typeof context.json === 'function') {
    try {
      const body = await context.json()
      if (body?.error) return String(body.error)
    } catch {
      /* not JSON — fall through */
    }
  }
  const message = (error as Error)?.message
  return message && !message.includes('non-2xx') ? message : fallback
}

/** Start a checkout. Returns the Paystack URL to send the giver to. */
export async function initializePaystackGiving(args: InitializeArgs): Promise<InitializeResult> {
  const { data, error } = await supabase.functions.invoke('paystack-initialize', { body: args })

  if (error) {
    throw new Error(await readFunctionError(error, 'Could not start the payment. Please try again.'))
  }
  if (!data?.authorization_url) {
    throw new Error(data?.error ?? 'Paystack did not return a checkout link.')
  }
  return data as InitializeResult
}

/** Confirm a payment after Paystack redirects the giver back. */
export async function verifyPaystackGiving(reference: string): Promise<VerifyResult> {
  const { data, error } = await supabase.functions.invoke('paystack-verify', {
    body: { reference },
  })

  if (error) {
    throw new Error(await readFunctionError(error, 'Could not confirm the payment.'))
  }
  return data as VerifyResult
}

/**
 * Whether the parish has switched Paystack on. Defaults to false so the paybill
 * shortcut stays the only route until M-Pesa is confirmed live on the account.
 */
export async function isPaystackEnabled(): Promise<boolean> {
  const { data, error } = await supabase
    .from('cms_settings')
    .select('value')
    .eq('key', 'paystack_enabled')
    .maybeSingle()

  if (error || !data) return false
  return data.value === true || data.value === 'true'
}
