-- Add admin policies for profile management

-- Allow admins to update any profile
CREATE POLICY "profiles_admin_update" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to delete profiles
CREATE POLICY "profiles_admin_delete" ON profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to read all profiles
DROP POLICY IF EXISTS "profiles_own_read" ON profiles;
CREATE POLICY "profiles_read" ON profiles
  FOR SELECT USING (
    id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'clergy', 'leader')
    )
  );
