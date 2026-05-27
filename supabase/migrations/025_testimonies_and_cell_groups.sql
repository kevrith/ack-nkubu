-- Testimonies and Cell Groups Management
-- =====================================================================

-- =====================================================================
-- TESTIMONIES
-- =====================================================================

CREATE TYPE testimony_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE testimonies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- 'answered_prayer', 'healing', 'provision', 'salvation', 'deliverance', 'other'
  image_url TEXT,
  status testimony_status DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE testimony_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  testimony_id UUID REFERENCES testimonies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL, -- 'amen', 'praise', 'pray'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(testimony_id, user_id, reaction_type)
);

-- =====================================================================
-- CELL GROUPS
-- =====================================================================

CREATE TABLE cell_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES profiles(id),
  assistant_leader_id UUID REFERENCES profiles(id),
  meeting_day TEXT, -- 'Monday', 'Tuesday', etc.
  meeting_time TIME,
  location TEXT,
  address TEXT,
  max_members INTEGER DEFAULT 15,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cell_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cell_group_id UUID REFERENCES cell_groups(id) ON DELETE CASCADE,
  member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(cell_group_id, member_id)
);

CREATE TABLE cell_group_meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cell_group_id UUID REFERENCES cell_groups(id) ON DELETE CASCADE,
  meeting_date DATE NOT NULL,
  topic TEXT,
  notes TEXT,
  attendance_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cell_group_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES cell_group_meetings(id) ON DELETE CASCADE,
  member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  was_present BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(meeting_id, member_id)
);

CREATE TABLE cell_group_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cell_group_id UUID REFERENCES cell_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- RLS POLICIES
-- =====================================================================

-- Testimonies
ALTER TABLE testimonies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved testimonies"
  ON testimonies FOR SELECT
  USING (status = 'approved' OR auth.uid() = author_id);

CREATE POLICY "Members can create testimonies"
  ON testimonies FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own pending testimonies"
  ON testimonies FOR UPDATE
  USING (auth.uid() = author_id AND status = 'pending');

CREATE POLICY "Clergy can approve/reject testimonies"
  ON testimonies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('clergy', 'admin')
    )
  );

-- Testimony Reactions
ALTER TABLE testimony_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reactions"
  ON testimony_reactions FOR SELECT
  USING (true);

CREATE POLICY "Members can add reactions"
  ON testimony_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can delete own reactions"
  ON testimony_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Cell Groups
ALTER TABLE cell_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active cell groups"
  ON cell_groups FOR SELECT
  USING (is_active = true);

CREATE POLICY "Leaders and admin can manage cell groups"
  ON cell_groups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('leader', 'clergy', 'admin')
    )
  );

-- Cell Group Members
ALTER TABLE cell_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view cell group members"
  ON cell_group_members FOR SELECT
  USING (true);

CREATE POLICY "Members can join cell groups"
  ON cell_group_members FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Leaders can manage members"
  ON cell_group_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cell_groups cg
      WHERE cg.id = cell_group_id 
      AND (cg.leader_id = auth.uid() OR cg.assistant_leader_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('leader', 'clergy', 'admin')
    )
  );

-- Cell Group Meetings
ALTER TABLE cell_group_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view meetings"
  ON cell_group_meetings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cell_group_members
      WHERE cell_group_id = cell_group_meetings.cell_group_id
      AND member_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('leader', 'clergy', 'admin')
    )
  );

CREATE POLICY "Leaders can create meetings"
  ON cell_group_meetings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cell_groups cg
      WHERE cg.id = cell_group_id 
      AND (cg.leader_id = auth.uid() OR cg.assistant_leader_id = auth.uid())
    )
  );

-- Cell Group Attendance
ALTER TABLE cell_group_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view attendance"
  ON cell_group_attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cell_group_meetings cgm
      JOIN cell_group_members cgmem ON cgmem.cell_group_id = cgm.cell_group_id
      WHERE cgm.id = meeting_id AND cgmem.member_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('leader', 'clergy', 'admin')
    )
  );

CREATE POLICY "Leaders can manage attendance"
  ON cell_group_attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cell_group_meetings cgm
      JOIN cell_groups cg ON cg.id = cgm.cell_group_id
      WHERE cgm.id = meeting_id 
      AND (cg.leader_id = auth.uid() OR cg.assistant_leader_id = auth.uid())
    )
  );

-- Cell Group Announcements
ALTER TABLE cell_group_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view announcements"
  ON cell_group_announcements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cell_group_members
      WHERE cell_group_id = cell_group_announcements.cell_group_id
      AND member_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can create announcements"
  ON cell_group_announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cell_groups cg
      WHERE cg.id = cell_group_id 
      AND (cg.leader_id = auth.uid() OR cg.assistant_leader_id = auth.uid())
    )
  );

-- =====================================================================
-- INDEXES
-- =====================================================================

CREATE INDEX idx_testimonies_status ON testimonies(status);
CREATE INDEX idx_testimonies_author ON testimonies(author_id);
CREATE INDEX idx_cell_groups_leader ON cell_groups(leader_id);
CREATE INDEX idx_cell_group_members_group ON cell_group_members(cell_group_id);
CREATE INDEX idx_cell_group_meetings_group ON cell_group_meetings(cell_group_id);
