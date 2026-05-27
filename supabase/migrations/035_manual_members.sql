-- Manual members: added by clergy/admin for members without smartphones

CREATE TABLE IF NOT EXISTS manual_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  date_of_birth DATE,
  cell_group TEXT,
  membership_number TEXT,
  date_joined DATE,
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS manual_members_name_idx ON manual_members (full_name);
CREATE INDEX IF NOT EXISTS manual_members_active_idx ON manual_members (is_active);

ALTER TABLE manual_members ENABLE ROW LEVEL SECURITY;

-- Leaders, clergy, admin can read
CREATE POLICY "manual_members_read" ON manual_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('leader', 'clergy', 'admin')
    )
  );

-- Clergy and admin can insert/update/delete
CREATE POLICY "manual_members_write" ON manual_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('clergy', 'admin')
    )
  );
