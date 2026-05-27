-- Enable RLS on tables that were missed in 002_rls_policies.sql
ALTER TABLE sermon_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

-- sermon_series policies
-- Anyone (including anonymous) can read sermon series
CREATE POLICY "sermon_series_read" ON sermon_series
  FOR SELECT USING (true);

-- Only clergy/admin can create, update, or delete series
CREATE POLICY "sermon_series_clergy_insert" ON sermon_series
  FOR INSERT WITH CHECK (get_user_role() IN ('clergy', 'admin'));

CREATE POLICY "sermon_series_clergy_update" ON sermon_series
  FOR UPDATE USING (get_user_role() IN ('clergy', 'admin'));

CREATE POLICY "sermon_series_clergy_delete" ON sermon_series
  FOR DELETE USING (get_user_role() IN ('clergy', 'admin'));

-- event_rsvps policies
-- Users see their own RSVPs; leaders/clergy/admin see all
CREATE POLICY "event_rsvps_read" ON event_rsvps
  FOR SELECT USING (
    user_id = auth.uid()
    OR get_user_role() IN ('leader', 'clergy', 'admin')
  );

-- Authenticated users can RSVP for themselves only
CREATE POLICY "event_rsvps_insert" ON event_rsvps
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can update/cancel their own RSVP
CREATE POLICY "event_rsvps_update_own" ON event_rsvps
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "event_rsvps_delete_own" ON event_rsvps
  FOR DELETE USING (user_id = auth.uid() OR get_user_role() IN ('leader', 'clergy', 'admin'));
