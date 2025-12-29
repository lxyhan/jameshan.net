-- Analytics Schema Update for Supabase
-- Run this in the Supabase SQL Editor

-- Create new page_views table
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  ip_address TEXT,
  page_path TEXT NOT NULL DEFAULT '/',
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX idx_page_views_page_path ON page_views(page_path);
CREATE INDEX idx_page_views_ip_address ON page_views(ip_address);
CREATE INDEX idx_page_views_session_id ON page_views(session_id);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read on page_views"
  ON page_views FOR SELECT
  USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert on page_views"
  ON page_views FOR INSERT
  WITH CHECK (true);

-- Migrate existing data from visitors table
INSERT INTO page_views (session_id, user_agent, viewed_at, page_path, ip_address)
SELECT session_id, user_agent, visited_at, '/', NULL FROM visitors;

-- Drop old table
DROP TABLE visitors;
