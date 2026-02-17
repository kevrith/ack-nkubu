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
  paymentData: FlutterwavePaymentData
): Promise<FlutterwaveResponse> {
  try {
    const response = await fetch('https://api.flutterwave.com/v3/charges?type=mpesa', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_PUBLIC_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...paymentData,
        currency: 'KES',
      }),
    });

    if (!response.ok) {
      throw new Error('Payment initiation failed');
    }

    return await response.json();
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
