-- English Hymns table for ACK Songs section
CREATE TABLE IF NOT EXISTS hymns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  chorus TEXT,
  full_text TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX hymns_number_idx ON hymns(number);
CREATE INDEX hymns_title_idx ON hymns(title);

ALTER TABLE hymns ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read published hymns
CREATE POLICY "hymns_read" ON hymns
  FOR SELECT USING (is_published = true);

-- Only clergy/admin can insert/update/delete
CREATE POLICY "hymns_write" ON hymns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('clergy', 'admin')
    )
  );
