-- Allow members to update and delete their own cell group and ministry memberships
-- Without this, ProfilePage and OnboardingWizard UPDATE calls fail for basic_member role

CREATE POLICY "Members can update own cell group membership"
  ON cell_group_members FOR UPDATE
  USING (auth.uid() = member_id)
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Members can update own ministry membership"
  ON ministry_members FOR UPDATE
  USING (auth.uid() = member_id)
  WITH CHECK (auth.uid() = member_id);
