-- Hymns table: ACK Hymnal + Golden Bells
-- Run this FIRST, then run the seed files

CREATE TABLE IF NOT EXISTS hymns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  chorus TEXT,
  full_text TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN DEFAULT true,
  category TEXT NOT NULL DEFAULT 'ack_hymnal',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS hymns_number_idx ON hymns (number);
CREATE INDEX IF NOT EXISTS hymns_title_idx ON hymns (title);
CREATE INDEX IF NOT EXISTS hymns_category_idx ON hymns (category);

ALTER TABLE hymns ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read published hymns
CREATE POLICY "hymns_read" ON hymns
  FOR SELECT USING (is_published = true);

-- Clergy/admin can insert, update, delete
CREATE POLICY "hymns_write" ON hymns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('clergy', 'admin')
    )
  );
