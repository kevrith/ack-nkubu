-- Add category column to hymns table
-- Values: 'ack_hymnal' (default) | 'golden_bells'

ALTER TABLE hymns ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'ack_hymnal';
CREATE INDEX IF NOT EXISTS hymns_category_idx ON hymns (category);
