-- Sync profiles.cell_group with cell_groups table
-- =====================================================================

-- Function to auto-assign member to cell group when profile is updated
CREATE OR REPLACE FUNCTION sync_cell_group_membership()
RETURNS TRIGGER AS $$
DECLARE
  group_id UUID;
BEGIN
  -- If cell_group is set in profile
  IF NEW.cell_group IS NOT NULL AND NEW.cell_group != '' THEN
    -- Find matching cell group by name (case-insensitive)
    SELECT id INTO group_id
    FROM cell_groups
    WHERE LOWER(name) = LOWER(NEW.cell_group)
    AND is_active = true
    LIMIT 1;

    -- If group exists, add member
    IF group_id IS NOT NULL THEN
      INSERT INTO cell_group_members (cell_group_id, member_id, is_active)
      VALUES (group_id, NEW.id, true)
      ON CONFLICT (cell_group_id, member_id) 
      DO UPDATE SET is_active = true;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync on profile insert/update
CREATE TRIGGER sync_cell_group_on_profile_change
  AFTER INSERT OR UPDATE OF cell_group ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_cell_group_membership();

-- Function to update profile.cell_group when member joins via UI
CREATE OR REPLACE FUNCTION update_profile_cell_group()
RETURNS TRIGGER AS $$
DECLARE
  group_name TEXT;
BEGIN
  -- Get the cell group name
  SELECT name INTO group_name
  FROM cell_groups
  WHERE id = NEW.cell_group_id;

  -- Update the profile
  IF group_name IS NOT NULL THEN
    UPDATE profiles
    SET cell_group = group_name
    WHERE id = NEW.member_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profile when member is added
CREATE TRIGGER update_profile_on_cell_group_join
  AFTER INSERT ON cell_group_members
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_cell_group();

-- Seed common cell groups (Youth, Sunday School, etc.)
INSERT INTO cell_groups (name, description, max_members, is_active) VALUES
  ('Youth Fellowship', 'Young adults and youth ministry group', 30, true),
  ('Sunday School', 'Children''s Sunday school ministry', 50, true),
  ('Women''s Guild', 'Women''s fellowship and ministry', 40, true),
  ('Men''s Fellowship', 'Men''s ministry and brotherhood', 40, true),
  ('Choir', 'Church choir and music ministry', 35, true),
  ('Ushers', 'Ushering and hospitality ministry', 25, true),
  ('Mother''s Union', 'Mothers'' fellowship and support group', 30, true)
ON CONFLICT DO NOTHING;

-- Migrate existing members to cell groups
DO $$
DECLARE
  profile_record RECORD;
  group_id UUID;
BEGIN
  FOR profile_record IN 
    SELECT id, cell_group 
    FROM profiles 
    WHERE cell_group IS NOT NULL AND cell_group != ''
  LOOP
    -- Find matching group
    SELECT id INTO group_id
    FROM cell_groups
    WHERE LOWER(name) = LOWER(profile_record.cell_group)
    AND is_active = true
    LIMIT 1;

    -- Add member if group exists
    IF group_id IS NOT NULL THEN
      INSERT INTO cell_group_members (cell_group_id, member_id, is_active)
      VALUES (group_id, profile_record.id, true)
      ON CONFLICT (cell_group_id, member_id) DO NOTHING;
    END IF;
  END LOOP;
END $$;
