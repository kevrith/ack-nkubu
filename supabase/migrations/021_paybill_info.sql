-- Parish Paybill Information
CREATE TABLE IF NOT EXISTS paybill_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paybill_number TEXT NOT NULL,
  account_number TEXT,
  business_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default paybill info (update with actual details)
INSERT INTO paybill_info (paybill_number, account_number, business_name)
VALUES ('123456', 'CHURCH', 'ACK St Francis Nkubu')
ON CONFLICT DO NOTHING;

-- RLS
ALTER TABLE paybill_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view paybill info" ON paybill_info
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage paybill" ON paybill_info
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
