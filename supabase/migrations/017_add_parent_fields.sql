-- Sacrament Requests - Add Parent Fields
-- =====================================================================
-- This migration adds parent fields for baptism and wedding requests

-- Add baptism parent fields
ALTER TABLE sacrament_requests 
  ADD COLUMN IF NOT EXISTS baptism_father_name TEXT,
  ADD COLUMN IF NOT EXISTS baptism_mother_name TEXT,
  ADD COLUMN IF NOT EXISTS baptism_godparent1 TEXT,
  ADD COLUMN IF NOT EXISTS baptism_godparent2 TEXT;

-- Add wedding parent fields
ALTER TABLE sacrament_requests
  ADD COLUMN IF NOT EXISTS wedding_groom_father TEXT,
  ADD COLUMN IF NOT EXISTS wedding_groom_mother TEXT,
  ADD COLUMN IF NOT EXISTS wedding_bride_father TEXT,
  ADD COLUMN IF NOT EXISTS wedding_bride_mother TEXT;

-- Drop old columns if they exist
ALTER TABLE sacrament_requests 
  DROP COLUMN IF EXISTS baptism_parent_names,
  DROP COLUMN IF EXISTS baptism_godparents;
