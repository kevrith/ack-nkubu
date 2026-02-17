-- Fix missing INSERT/UPDATE policies for content management

-- Notices policies
CREATE POLICY "notices_insert" ON notices
  FOR INSERT WITH CHECK (get_user_role() IN ('leader', 'clergy', 'admin'));

CREATE POLICY "notices_update" ON notices
  FOR UPDATE USING (get_user_role() IN ('leader', 'clergy', 'admin'));

CREATE POLICY "notices_delete" ON notices
  FOR DELETE USING (get_user_role() IN ('leader', 'clergy', 'admin'));

-- Events policies
CREATE POLICY "events_insert" ON events
  FOR INSERT WITH CHECK (get_user_role() IN ('leader', 'clergy', 'admin'));

CREATE POLICY "events_update" ON events
  FOR UPDATE USING (get_user_role() IN ('leader', 'clergy', 'admin'));

CREATE POLICY "events_delete" ON events
  FOR DELETE USING (get_user_role() IN ('leader', 'clergy', 'admin'));

-- Sermons delete policy
CREATE POLICY "sermons_delete" ON sermons
  FOR DELETE USING (get_user_role() IN ('clergy', 'admin'));

-- Prayers policies
CREATE POLICY "prayers_read" ON prayers
  FOR SELECT USING (true);

CREATE POLICY "prayers_insert" ON prayers
  FOR INSERT WITH CHECK (get_user_role() IN ('leader', 'clergy', 'admin'));

CREATE POLICY "prayers_update" ON prayers
  FOR UPDATE USING (get_user_role() IN ('leader', 'clergy', 'admin'));

CREATE POLICY "prayers_delete" ON prayers
  FOR DELETE USING (get_user_role() IN ('leader', 'clergy', 'admin'));
