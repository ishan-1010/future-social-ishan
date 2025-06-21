-- Future Social Database Schema (v2 - Robust Likes)
-- Run this in your Supabase SQL editor.
-- This version uses a dedicated `post_likes` table for a more robust system.

-- Drop existing objects in the correct order to handle dependencies.
-- Policies are dropped automatically when their corresponding tables are dropped.

-- 1. Drop the view first, as it depends on other tables.
DROP VIEW IF EXISTS public.posts_with_details;

-- 2. Drop tables. `post_likes` must be dropped before `posts` due to the foreign key.
DROP TABLE IF EXISTS public.post_likes;
DROP TABLE IF EXISTS public.posts;
DROP TABLE IF EXISTS public.profiles;


-- The script will now create everything from a clean slate.

-- Create posts table (without like_count)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create post_likes junction table
CREATE TABLE post_likes (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for posts
CREATE POLICY "Users can view all posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);
  
CREATE POLICY "Users can delete their own posts" ON posts
    FOR DELETE USING (auth.uid() = author_id);

-- Create policies for post_likes
CREATE POLICY "Users can view all likes" ON post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like/unlike posts" ON post_likes
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);


-- Profiles table (ensure it's up-to-date)
-- Note: It's often better to run this separately if profiles already exist.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Drop policies before creating them to ensure a clean state
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to create a profile for a new user automatically
-- This ensures every user has a profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'user_name');
  return new;
end;
$$;

-- trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to create profiles for existing users who don't have one
-- Run this manually if needed: SELECT create_missing_profiles();
create or replace function public.create_missing_profiles()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  select 
    u.id,
    u.raw_user_meta_data->>'user_name'
  from auth.users u
  left join public.profiles p on u.id = p.id
  where p.id is null;
end;
$$;

-- Create a view for posts with like counts and user's like status
-- This is a very efficient way to get all the data we need in one query.
-- FIXED: Now properly joins with profiles table instead of user metadata
CREATE OR REPLACE VIEW posts_with_details AS
SELECT
    p.id,
    p.author_id,
    p.content,
    p.image_url,
    p.created_at,
    prof.username,
    prof.avatar_url,
    (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) as like_count,
    EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = auth.uid()) as user_has_liked
FROM
    posts p
LEFT JOIN
    profiles prof ON p.author_id = prof.id; 