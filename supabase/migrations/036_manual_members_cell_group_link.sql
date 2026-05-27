-- Replace the free-text cell_group column with a proper FK to cell_groups
-- Run this after 035_manual_members.sql

ALTER TABLE manual_members
  ADD COLUMN IF NOT EXISTS cell_group_id UUID REFERENCES cell_groups(id) ON DELETE SET NULL;

-- Migrate any existing text values by matching on cell group name
UPDATE manual_members mm
SET cell_group_id = cg.id
FROM cell_groups cg
WHERE mm.cell_group = cg.name
  AND mm.cell_group IS NOT NULL;

-- Drop the old free-text column
ALTER TABLE manual_members DROP COLUMN IF EXISTS cell_group;

CREATE INDEX IF NOT EXISTS manual_members_cell_group_id_idx ON manual_members (cell_group_id);
