-- Analytics table for tracking visitors
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries on date
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at);

-- Index for session lookups
CREATE INDEX IF NOT EXISTS idx_visitors_session_id ON visitors(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts from anyone (for tracking)
CREATE POLICY "Allow public inserts" ON visitors
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy to allow reads from anyone (for stats)
CREATE POLICY "Allow public reads" ON visitors
  FOR SELECT
  TO anon
  USING (true);
