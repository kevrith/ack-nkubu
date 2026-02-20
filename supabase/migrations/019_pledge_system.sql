-- Giving Pledges System
-- =====================================================================

-- Pledge campaigns table
CREATE TABLE pledge_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  goal_amount DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual pledges table
CREATE TABLE pledges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES pledge_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pledge_amount DECIMAL(10,2) NOT NULL,
  frequency TEXT CHECK (frequency IN ('one-time', 'weekly', 'monthly', 'quarterly')),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pledge payments table
CREATE TABLE pledge_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pledge_id UUID REFERENCES pledges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pledge_campaigns_active ON pledge_campaigns(is_active);
CREATE INDEX idx_pledges_campaign ON pledges(campaign_id);
CREATE INDEX idx_pledges_user ON pledges(user_id);
CREATE INDEX idx_pledge_payments_pledge ON pledge_payments(pledge_id);
CREATE INDEX idx_pledge_payments_user ON pledge_payments(user_id);

-- RLS Policies
ALTER TABLE pledge_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledge_payments ENABLE ROW LEVEL SECURITY;

-- Everyone can view active campaigns
CREATE POLICY "Anyone can view active campaigns"
  ON pledge_campaigns FOR SELECT
  USING (is_active = true);

-- Clergy/Admin can manage campaigns
CREATE POLICY "Clergy can manage campaigns"
  ON pledge_campaigns FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('clergy', 'admin')
    )
  );

-- Users can view their own pledges
CREATE POLICY "Users can view own pledges"
  ON pledges FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create pledges
CREATE POLICY "Users can create pledges"
  ON pledges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pledges
CREATE POLICY "Users can update own pledges"
  ON pledges FOR UPDATE
  USING (auth.uid() = user_id);

-- Clergy can view all pledges
CREATE POLICY "Clergy can view all pledges"
  ON pledges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('clergy', 'admin')
    )
  );

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON pledge_payments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create payments
CREATE POLICY "Users can create payments"
  ON pledge_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Clergy can view all payments
CREATE POLICY "Clergy can view all payments"
  ON pledge_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('clergy', 'admin')
    )
  );

-- Function to calculate campaign progress
CREATE OR REPLACE FUNCTION get_campaign_progress(campaign_uuid UUID)
RETURNS TABLE (
  total_pledged DECIMAL,
  total_paid DECIMAL,
  pledge_count BIGINT,
  donor_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(p.pledge_amount), 0) as total_pledged,
    COALESCE(SUM(pp.amount), 0) as total_paid,
    COUNT(DISTINCT p.id) as pledge_count,
    COUNT(DISTINCT p.user_id) as donor_count
  FROM pledges p
  LEFT JOIN pledge_payments pp ON pp.pledge_id = p.id
  WHERE p.campaign_id = campaign_uuid;
END;
$$ LANGUAGE plpgsql;
