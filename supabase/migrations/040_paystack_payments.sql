-- Paystack giving: M-Pesa and card, each opening Paystack on that channel only.
--
-- Deliberately a new table rather than reusing `mpesa_transactions`: that table
-- is M-Pesa/Flutterwave shaped (phone_number NOT NULL, mpesa_receipt_number)
-- and card payments do not fit it. The old table and its rows are left alone.
--
-- A giving_record is NOT created up front. It is created only when Paystack
-- confirms the charge, so giving reports never count money that never arrived.
-- The donor's intent (category, amount, anonymity) lives on the transaction
-- until then.

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Who is giving, and what they intended before the charge settled
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category giving_category NOT NULL,
  amount_kes DECIMAL(12, 2) NOT NULL CHECK (amount_kes > 0),
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  phone_number TEXT,

  -- Provider details
  provider TEXT NOT NULL DEFAULT 'paystack',
  channel TEXT NOT NULL CHECK (channel IN ('mobile_money', 'card')),
  reference TEXT NOT NULL UNIQUE,
  authorization_url TEXT,
  provider_reference TEXT,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'success', 'failed', 'abandoned')),

  -- Set once the charge settles and the giving record is written
  giving_record_id UUID REFERENCES giving_records(id) ON DELETE SET NULL,
  paid_at TIMESTAMPTZ,
  failure_reason TEXT,
  provider_payload JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference ON payment_transactions(reference);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Donors read their own attempts; admins see everything for reconciliation.
DROP POLICY IF EXISTS "payment_transactions_read" ON payment_transactions;
CREATE POLICY "payment_transactions_read" ON payment_transactions
  FOR SELECT USING (
    user_id = auth.uid()
    OR get_user_role() = 'admin'
  );

-- No INSERT/UPDATE policy on purpose: only the edge functions write here, and
-- they use the service role key, which bypasses RLS. A client cannot forge a
-- payment row or mark one as paid.

CREATE OR REPLACE FUNCTION touch_payment_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS payment_transactions_touch_updated_at ON payment_transactions;
CREATE TRIGGER payment_transactions_touch_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION touch_payment_transactions_updated_at();

-- Paystack stays switched OFF until the parish confirms M-Pesa is live on their
-- Paystack account. The paybill shortcut remains the primary giving route.
INSERT INTO cms_settings (key, value, description)
VALUES (
  'paystack_enabled',
  'false'::jsonb,
  'Show the Paystack (M-Pesa / card) giving option. Keep false until Paystack KES mobile money is active on the parish account.'
)
ON CONFLICT (key) DO NOTHING;
