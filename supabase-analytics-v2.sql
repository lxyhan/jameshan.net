-- Comprehensive Analytics Schema v2
-- Run this in Supabase SQL Editor

-- Drop old table and create new comprehensive one
DROP TABLE IF EXISTS page_views;

-- Comprehensive page views table
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Timing
  viewed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Page info
  page_path TEXT NOT NULL,
  page_query TEXT,  -- query string parameters

  -- Visitor identification
  ip_address TEXT,
  session_id TEXT,  -- from cookie/localStorage
  fingerprint TEXT, -- browser fingerprint hash

  -- Request info
  user_agent TEXT,
  referer TEXT,     -- where they came from

  -- Geo (derived from IP - can be populated later)
  country TEXT,
  region TEXT,
  city TEXT,

  -- Device info (parsed from user agent)
  device_type TEXT,    -- desktop, mobile, tablet
  browser TEXT,        -- Chrome, Firefox, Safari, etc
  browser_version TEXT,
  os TEXT,             -- Windows, macOS, iOS, Android, Linux
  os_version TEXT,

  -- Client info (from JS when available)
  screen_width INTEGER,
  screen_height INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  language TEXT,
  timezone TEXT,

  -- Engagement (updated via separate calls)
  time_on_page INTEGER,  -- seconds
  scroll_depth INTEGER,  -- percentage 0-100

  -- Classification
  is_bot BOOLEAN DEFAULT FALSE,
  bot_name TEXT
);

-- Indexes for common queries
CREATE INDEX idx_pv_viewed_at ON page_views(viewed_at);
CREATE INDEX idx_pv_page_path ON page_views(page_path);
CREATE INDEX idx_pv_ip_address ON page_views(ip_address);
CREATE INDEX idx_pv_session_id ON page_views(session_id);
CREATE INDEX idx_pv_fingerprint ON page_views(fingerprint);
CREATE INDEX idx_pv_referer ON page_views(referer);
CREATE INDEX idx_pv_country ON page_views(country);
CREATE INDEX idx_pv_device_type ON page_views(device_type);
CREATE INDEX idx_pv_browser ON page_views(browser);
CREATE INDEX idx_pv_is_bot ON page_views(is_bot);

-- Composite indexes for unique visitor counting
CREATE INDEX idx_pv_unique_visitor ON page_views(ip_address, user_agent);
CREATE INDEX idx_pv_date_path ON page_views(viewed_at, page_path);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read on page_views"
  ON page_views FOR SELECT USING (true);

CREATE POLICY "Allow public insert on page_views"
  ON page_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on page_views"
  ON page_views FOR UPDATE USING (true);

-- Migrate old data (all old views go to / with minimal info)
-- Note: This assumes you still have the old page_views table
-- If you already dropped it, skip this section
-- INSERT INTO page_views (session_id, ip_address, page_path, user_agent, viewed_at)
-- SELECT session_id, ip_address, page_path, user_agent, viewed_at FROM page_views_old;
