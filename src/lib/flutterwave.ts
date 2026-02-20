const FLUTTERWAVE_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

export interface FlutterwavePaymentData {
  amount: number;
  currency: string;
  email: string;
  phone_number: string;
  tx_ref: string;
  redirect_url?: string;
}

export interface FlutterwaveResponse {
  status: string;
  message: string;
  data?: {
    link: string;
  };
}

export async function initiateMpesaPayment(
  paymentData: FlutterwavePaymentData & { mpesa_record_id: string; giving_record_id: string }
): Promise<FlutterwaveResponse> {
  try {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.functions.invoke('initiate-mpesa', {
      body: paymentData,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Flutterwave error:', error);
    throw error;
  }
}

/**
 * Verify a transaction server-side via Supabase Edge Function.
 * The secret key is never exposed to the client.
 */
export async function verifyTransaction(transactionId: string): Promise<{ status: string; data?: Record<string, unknown> }> {
  try {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.functions.invoke('verify-transaction', {
      body: { transactionId },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
}
