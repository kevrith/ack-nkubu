-- ============================================
-- COMMUNITY GROUPS (missing table)
-- ============================================
CREATE TABLE IF NOT EXISTS community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  leader_id UUID REFERENCES profiles(id),
  is_private BOOLEAN DEFAULT false,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "groups_read" ON community_groups
  FOR SELECT USING (true);

CREATE POLICY "groups_insert" ON community_groups
  FOR INSERT WITH CHECK (get_user_role() IN ('leader', 'clergy', 'admin'));

CREATE POLICY "groups_update" ON community_groups
  FOR UPDATE USING (leader_id = auth.uid() OR get_user_role() IN ('clergy', 'admin'));

CREATE POLICY "groups_delete" ON community_groups
  FOR DELETE USING (get_user_role() IN ('clergy', 'admin'));

-- Add FK on community_posts.group_id now that community_groups exists
ALTER TABLE community_posts
  ADD CONSTRAINT fk_community_posts_group
  FOREIGN KEY (group_id) REFERENCES community_groups(id) ON DELETE SET NULL;

-- ============================================
-- READING PLAN PROGRESS (missing table)
-- ============================================
CREATE TABLE IF NOT EXISTS reading_plan_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  current_day INTEGER DEFAULT 1,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(user_id, plan_name)
);

ALTER TABLE reading_plan_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reading_plan_own_read" ON reading_plan_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "reading_plan_own_insert" ON reading_plan_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "reading_plan_own_update" ON reading_plan_progress
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "reading_plan_own_delete" ON reading_plan_progress
  FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- GENERIC INCREMENT RPC (missing function)
-- Used by PrayerWall to increment prayer_count
-- ============================================
CREATE OR REPLACE FUNCTION increment(row_id UUID, table_name TEXT, column_name TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format(
    'UPDATE %I SET %I = %I + 1 WHERE id = $1',
    table_name, column_name, column_name
  ) USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
