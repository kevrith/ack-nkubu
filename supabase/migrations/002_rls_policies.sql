-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE giving_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpesa_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pastoral_care_requests ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "profiles_own_read" ON profiles
  FOR SELECT USING (id = auth.uid() OR get_user_role() IN ('admin', 'clergy'));

CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Sermons policies
CREATE POLICY "sermons_read_published" ON sermons
  FOR SELECT USING (is_published = true OR get_user_role() IN ('clergy', 'admin'));

CREATE POLICY "sermons_clergy_insert" ON sermons
  FOR INSERT WITH CHECK (get_user_role() IN ('clergy', 'admin'));

CREATE POLICY "sermons_clergy_update" ON sermons
  FOR UPDATE USING (get_user_role() IN ('clergy', 'admin'));

-- Prayer requests policies
CREATE POLICY "prayer_requests_read_public" ON prayer_requests
  FOR SELECT USING (is_public = true OR requester_id = auth.uid() OR get_user_role() IN ('clergy', 'admin'));

CREATE POLICY "prayer_requests_insert" ON prayer_requests
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Giving policies
CREATE POLICY "giving_own_read" ON giving_records
  FOR SELECT USING (
    (is_anonymous = false AND donor_id = auth.uid())
    OR get_user_role() IN ('leader', 'clergy', 'admin')
  );

CREATE POLICY "giving_insert" ON giving_records
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Pastoral care policies
CREATE POLICY "pastoral_care_read" ON pastoral_care_requests
  FOR SELECT USING (
    requester_id = auth.uid()
    OR assigned_clergy_id = auth.uid()
    OR get_user_role() = 'admin'
  );

CREATE POLICY "pastoral_care_insert" ON pastoral_care_requests
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Events policies
CREATE POLICY "events_read_published" ON events
  FOR SELECT USING (is_published = true OR get_user_role() IN ('leader', 'clergy', 'admin'));

-- Notices policies
CREATE POLICY "notices_read_published" ON notices
  FOR SELECT USING (is_published = true OR get_user_role() IN ('leader', 'clergy', 'admin'));

-- Community posts policies
CREATE POLICY "community_posts_read" ON community_posts
  FOR SELECT USING (is_approved = true OR author_id = auth.uid() OR get_user_role() IN ('leader', 'clergy', 'admin'));

CREATE POLICY "community_posts_insert" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "community_posts_update_own" ON community_posts
  FOR UPDATE USING (author_id = auth.uid() OR get_user_role() IN ('leader', 'clergy', 'admin'));
