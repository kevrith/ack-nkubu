-- Community reactions table
CREATE TABLE IF NOT EXISTS community_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'pray', 'amen')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE community_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reactions_read" ON community_reactions FOR SELECT USING (true);
CREATE POLICY "reactions_insert" ON community_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reactions_delete" ON community_reactions FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_reactions_post ON community_reactions(post_id);
