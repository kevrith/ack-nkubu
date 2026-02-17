-- Pastors corner table
CREATE TABLE IF NOT EXISTS pastors_corner (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  category TEXT DEFAULT 'message',
  is_published BOOLEAN DEFAULT false,
  publish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pastors_corner ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "pastors_corner_read_published" ON pastors_corner
  FOR SELECT USING (is_published = true OR author_id = auth.uid() OR get_user_role() IN ('clergy', 'admin'));

CREATE POLICY "pastors_corner_clergy_insert" ON pastors_corner
  FOR INSERT WITH CHECK (get_user_role() IN ('clergy', 'admin'));

CREATE POLICY "pastors_corner_clergy_update" ON pastors_corner
  FOR UPDATE USING (author_id = auth.uid() OR get_user_role() = 'admin');
