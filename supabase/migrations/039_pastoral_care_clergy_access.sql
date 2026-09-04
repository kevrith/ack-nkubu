-- Pastoral care: give clergy the access the dashboard has always assumed.
--
-- 002_rls_policies.sql shipped pastoral_care_requests with exactly two policies:
--   * pastoral_care_read   — requester, ASSIGNED clergy, or admin
--   * pastoral_care_insert — any signed-in user
--
-- Two consequences, both of which made the Pastoral Care Dashboard look broken:
--
--   1. A clergy member could not SELECT a request until they were already the
--      assigned_clergy_id. Nothing assigns them before they act on it, so the
--      dashboard was empty for every non-admin pastor.
--   2. There was no UPDATE policy at all, so "Acknowledge", "Start Working",
--      "Mark Complete" and the clergy-notes box updated zero rows. PostgREST
--      reports no error for a 0-row update, so every action failed silently.

-- Clergy and admins see the whole queue; members still see only their own.
DROP POLICY IF EXISTS "pastoral_care_read" ON pastoral_care_requests;
CREATE POLICY "pastoral_care_read" ON pastoral_care_requests
  FOR SELECT USING (
    requester_id = auth.uid()
    OR assigned_clergy_id = auth.uid()
    OR get_user_role() IN ('clergy', 'admin')
  );

-- Clergy and admins can work the queue: status, assignment, notes, completion.
DROP POLICY IF EXISTS "pastoral_care_clergy_update" ON pastoral_care_requests;
CREATE POLICY "pastoral_care_clergy_update" ON pastoral_care_requests
  FOR UPDATE
  USING (get_user_role() IN ('clergy', 'admin'))
  WITH CHECK (get_user_role() IN ('clergy', 'admin'));

-- A member may still correct their own request while nobody has picked it up.
DROP POLICY IF EXISTS "pastoral_care_owner_update" ON pastoral_care_requests;
CREATE POLICY "pastoral_care_owner_update" ON pastoral_care_requests
  FOR UPDATE
  USING (requester_id = auth.uid() AND status = 'pending')
  WITH CHECK (requester_id = auth.uid());

-- Note: clergy can already read requester names and phones — the "profiles_read"
-- policy from 011_admin_profile_policies.sql covers admin/clergy/leader — so no
-- profiles change is needed here.

-- Keep updated_at honest so the dashboard can order by recency later.
CREATE OR REPLACE FUNCTION touch_pastoral_care_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pastoral_care_touch_updated_at ON pastoral_care_requests;
CREATE TRIGGER pastoral_care_touch_updated_at
  BEFORE UPDATE ON pastoral_care_requests
  FOR EACH ROW EXECUTE FUNCTION touch_pastoral_care_updated_at();
