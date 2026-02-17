-- CMS Tables Migration
-- Run this in Supabase SQL Editor

-- CMS Pages Table
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  last_edited_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CMS Blocks Table
CREATE TABLE IF NOT EXISTS cms_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES cms_pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'video', 'scripture', 'hero', 'cta', 'grid', 'carousel')),
  order_index INTEGER NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CMS Settings Table
CREATE TABLE IF NOT EXISTS cms_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cms_pages
CREATE POLICY "cms_pages_read_published" ON cms_pages
  FOR SELECT USING (is_published = true OR auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'clergy')
  ));

CREATE POLICY "cms_pages_write_admin" ON cms_pages
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- RLS Policies for cms_blocks
CREATE POLICY "cms_blocks_read" ON cms_blocks
  FOR SELECT USING (true);

CREATE POLICY "cms_blocks_write_admin" ON cms_blocks
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- RLS Policies for cms_settings
CREATE POLICY "cms_settings_read" ON cms_settings
  FOR SELECT USING (true);

CREATE POLICY "cms_settings_write_admin" ON cms_settings
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cms_blocks_page_id ON cms_blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_cms_blocks_order ON cms_blocks(page_id, order_index);
