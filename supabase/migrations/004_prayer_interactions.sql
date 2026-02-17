-- Prayer interactions table
CREATE TABLE IF NOT EXISTS prayer_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prayed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(request_id, user_id)
);

-- Enable RLS
ALTER TABLE prayer_interactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "interactions_read" ON prayer_interactions
  FOR SELECT USING (true);

CREATE POLICY "interactions_insert" ON prayer_interactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function to increment prayer count
CREATE OR REPLACE FUNCTION increment_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prayer_requests 
  SET prayer_count = prayer_count + 1 
  WHERE id = NEW.request_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER on_prayer_interaction
  AFTER INSERT ON prayer_interactions
  FOR EACH ROW EXECUTE FUNCTION increment_prayer_count();
