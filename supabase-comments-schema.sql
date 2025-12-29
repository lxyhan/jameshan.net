-- Comments & Likes Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_flagged BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE
);

-- Post likes table
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_slug, user_id)
);

-- Comment likes table
CREATE TABLE comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_comments_post_slug ON comments(post_slug);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_post_likes_post_slug ON post_likes(post_slug);
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Allow public read on approved comments"
  ON comments FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Allow public insert on comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Post likes policies
CREATE POLICY "Allow public read on post_likes"
  ON post_likes FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on post_likes"
  ON post_likes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to delete their own post likes"
  ON post_likes FOR DELETE
  USING (true);

-- Comment likes policies
CREATE POLICY "Allow public read on comment_likes"
  ON comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on comment_likes"
  ON comment_likes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to delete their own comment likes"
  ON comment_likes FOR DELETE
  USING (true);
