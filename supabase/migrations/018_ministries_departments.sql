-- Ministries/Departments System (separate from Cell Groups)
-- =====================================================================

-- =====================================================================
-- MINISTRIES (Church-wide departments)
-- =====================================================================

CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT, -- 'fellowship', 'service', 'worship', 'education', 'outreach'
  leader_id UUID REFERENCES profiles(id),
  assistant_leader_id UUID REFERENCES profiles(id),
  meeting_day TEXT,
  meeting_time TIME,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ministry_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ministry_id UUID REFERENCES ministries(id) ON DELETE CASCADE,
  member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'member', 'coordinator', 'secretary'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(ministry_id, member_id)
);

CREATE TABLE ministry_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ministry_id UUID REFERENCES ministries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ministry_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ministry_id UUID REFERENCES ministries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- RLS POLICIES
-- =====================================================================

ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active ministries"
  ON ministries FOR SELECT
  USING (is_active = true);

CREATE POLICY "Leaders and admin can manage ministries"
  ON ministries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('leader', 'clergy', 'admin')
    )
  );

ALTER TABLE ministry_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view ministry members"
  ON ministry_members FOR SELECT
  USING (true);

CREATE POLICY "Members can join ministries"
  ON ministry_members FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Leaders can manage ministry members"
  ON ministry_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM ministries m
      WHERE m.id = ministry_id 
      AND (m.leader_id = auth.uid() OR m.assistant_leader_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('leader', 'clergy', 'admin')
    )
  );

ALTER TABLE ministry_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view ministry events"
  ON ministry_events FOR SELECT
  USING (true);

CREATE POLICY "Leaders can manage ministry events"
  ON ministry_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM ministries m
      WHERE m.id = ministry_id 
      AND (m.leader_id = auth.uid() OR m.assistant_leader_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('leader', 'clergy', 'admin')
    )
  );

ALTER TABLE ministry_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view ministry announcements"
  ON ministry_announcements FOR SELECT
  USING (true);

CREATE POLICY "Leaders can create ministry announcements"
  ON ministry_announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ministries m
      WHERE m.id = ministry_id 
      AND (m.leader_id = auth.uid() OR m.assistant_leader_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('leader', 'clergy', 'admin')
    )
  );

-- =====================================================================
-- SEED COMMON MINISTRIES
-- =====================================================================

INSERT INTO ministries (name, description, category, is_active) VALUES
  ('KAMA (Kenya Anglican Men Association)', 'Men''s fellowship and ministry', 'fellowship', true),
  ('Youth Fellowship', 'Young adults and youth ministry', 'fellowship', true),
  ('Sunday School', 'Children''s Christian education', 'education', true),
  ('Choir', 'Church music and worship ministry', 'worship', true),
  ('Mother''s Union', 'Women''s fellowship and support', 'fellowship', true),
  ('Ushers & Hospitality', 'Welcoming and ushering ministry', 'service', true),
  ('Women''s Guild', 'Women''s ministry and service', 'fellowship', true),
  ('Altar Guild', 'Altar care and preparation', 'service', true),
  ('Evangelism Team', 'Outreach and evangelism', 'outreach', true),
  ('Prayer Ministry', 'Intercessory prayer team', 'service', true),
  ('Bible Study Group', 'Weekly Bible study fellowship', 'education', true),
  ('Confirmation Class', 'Confirmation preparation', 'education', true)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- INDEXES
-- =====================================================================

CREATE INDEX idx_ministries_category ON ministries(category);
CREATE INDEX idx_ministries_leader ON ministries(leader_id);
CREATE INDEX idx_ministry_members_ministry ON ministry_members(ministry_id);
CREATE INDEX idx_ministry_members_member ON ministry_members(member_id);
CREATE INDEX idx_ministry_events_ministry ON ministry_events(ministry_id);
CREATE INDEX idx_ministry_events_date ON ministry_events(event_date);

-- =====================================================================
-- UPDATE CELL GROUPS SEED DATA
-- =====================================================================

-- Remove ministry-like groups from cell_groups (they should be in ministries)
DELETE FROM cell_groups WHERE name IN (
  'Youth Fellowship', 'Sunday School', 'Women''s Guild', 
  'Men''s Fellowship', 'Choir', 'Ushers', 'Mother''s Union'
);

-- Add example geographic cell groups
INSERT INTO cell_groups (name, description, max_members, is_active) VALUES
  ('Nkubu East Cell', 'Cell group for members in Nkubu East area', 15, true),
  ('Nkubu West Cell', 'Cell group for members in Nkubu West area', 15, true),
  ('Nkubu Central Cell', 'Cell group for members in Nkubu Central area', 15, true),
  ('Karingani Cell', 'Cell group for members in Karingani area', 15, true),
  ('Mitunguu Cell', 'Cell group for members in Mitunguu area', 15, true)
ON CONFLICT DO NOTHING;
