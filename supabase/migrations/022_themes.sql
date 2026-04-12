CREATE TYPE theme_type AS ENUM ('diocesan', 'church');

CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  scripture TEXT,
  type theme_type NOT NULL DEFAULT 'church',
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "themes_read_published" ON themes
  FOR SELECT USING (is_published = true OR get_user_role() IN ('clergy', 'admin'));

CREATE POLICY "themes_clergy_insert" ON themes
  FOR INSERT WITH CHECK (get_user_role() IN ('clergy', 'admin'));

CREATE POLICY "themes_clergy_update" ON themes
  FOR UPDATE USING (get_user_role() IN ('clergy', 'admin'));

CREATE POLICY "themes_clergy_delete" ON themes
  FOR DELETE USING (get_user_role() IN ('clergy', 'admin'));
