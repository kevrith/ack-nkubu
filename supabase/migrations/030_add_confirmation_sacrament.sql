-- Add Confirmation as a sacrament type (Anglican catechism/bishop confirmation)
ALTER TYPE sacrament_type ADD VALUE 'confirmation';

-- Confirmation-specific columns
ALTER TABLE sacrament_requests
  ADD COLUMN IF NOT EXISTS confirmation_candidate_name TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_candidate_dob DATE,
  ADD COLUMN IF NOT EXISTS confirmation_baptism_date DATE,
  ADD COLUMN IF NOT EXISTS confirmation_baptism_parish TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_sponsor_name TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_preferred_date DATE;
