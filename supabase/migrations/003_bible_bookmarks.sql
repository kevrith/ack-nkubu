-- Bible bookmarks table
CREATE TABLE IF NOT EXISTS bible_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  version bible_version NOT NULL,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bible_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "bookmarks_own_read" ON bible_bookmarks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "bookmarks_own_insert" ON bible_bookmarks
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "bookmarks_own_delete" ON bible_bookmarks
  FOR DELETE USING (user_id = auth.uid());
