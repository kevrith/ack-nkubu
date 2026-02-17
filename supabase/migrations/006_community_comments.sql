-- Community comments table
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "comments_read" ON community_comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert" ON community_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "comments_delete_own" ON community_comments
  FOR DELETE USING (author_id = auth.uid() OR get_user_role() IN ('leader', 'clergy', 'admin'));

-- Function to increment comment count
CREATE OR REPLACE FUNCTION increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts 
  SET comments_count = comments_count + 1 
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER on_comment_created
  AFTER INSERT ON community_comments
  FOR EACH ROW EXECUTE FUNCTION increment_comment_count();
