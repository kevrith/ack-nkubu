-- Create Bible cache table
CREATE TABLE IF NOT EXISTS public.bible_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  content TEXT NOT NULL,
  reference TEXT NOT NULL,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(version, chapter_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_bible_cache_lookup ON public.bible_cache(version, chapter_id);

-- Enable RLS
ALTER TABLE public.bible_cache ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read cache
CREATE POLICY "bible_cache_read" ON public.bible_cache
  FOR SELECT USING (true);

-- Only admins can insert/update cache
CREATE POLICY "bible_cache_write" ON public.bible_cache
  FOR INSERT WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'clergy')
  );
