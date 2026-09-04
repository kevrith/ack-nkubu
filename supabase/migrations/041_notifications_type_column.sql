-- Add the notifications.type column that several writers already assume exists.
--
-- 010_notifications_table.sql created notifications with
-- (id, user_id, title, message, read, created_at) and no `type`.
--
-- 027_sacrament_notifications.sql then added a trigger that runs
--   INSERT INTO notifications (user_id, title, message, type) ...
-- on every sacrament status change. Because the column does not exist, that
-- INSERT raises, and since the trigger fires inside the UPDATE's transaction it
-- takes the whole status change down with it: clergy approving a sacrament
-- request get "column type of relation notifications does not exist" — or, on a
-- database where the column was patched in by hand, it happens to work. This
-- makes the schema match what the code has always expected.

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'general';

CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Service-role writers (edge functions) and database triggers bypass RLS, but
-- there is no INSERT policy at all, so nothing else can write notifications.
-- Clergy and admins legitimately send notices from the admin UI.
DROP POLICY IF EXISTS "notifications_staff_insert" ON public.notifications;
CREATE POLICY "notifications_staff_insert" ON public.notifications
  FOR INSERT WITH CHECK (get_user_role() IN ('clergy', 'admin'));
