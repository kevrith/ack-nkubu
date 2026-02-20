-- Remove member limit from cell groups
-- =====================================================================

-- Remove max_members constraint (set to NULL = unlimited)
ALTER TABLE cell_groups ALTER COLUMN max_members DROP NOT NULL;

-- Update existing cell groups to have unlimited members
UPDATE cell_groups SET max_members = NULL;

-- Update cell groups to show they're unlimited
COMMENT ON COLUMN cell_groups.max_members IS 'Maximum members allowed. NULL = unlimited';
