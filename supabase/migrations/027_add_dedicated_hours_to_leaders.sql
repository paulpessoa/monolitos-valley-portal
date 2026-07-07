-- Add dedicated hours and validation columns to community_leaders
ALTER TABLE community_leaders 
ADD COLUMN IF NOT EXISTS dedicated_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS hours_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS approved_by UUID[] DEFAULT '{}';
