-- Fix existing posts with null like_count values
-- Run this in your Supabase SQL editor

UPDATE posts 
SET like_count = 0 
WHERE like_count IS NULL;

-- Also ensure the like_count column has a proper default
ALTER TABLE posts 
ALTER COLUMN like_count SET DEFAULT 0;

-- Update any remaining null values
UPDATE posts 
SET like_count = 0 
WHERE like_count IS NULL; 