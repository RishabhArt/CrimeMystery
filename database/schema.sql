-- Crime Mystery Game Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  total_xp INTEGER DEFAULT 0 NOT NULL,
  total_clues_owned INTEGER DEFAULT 0 NOT NULL,
  free_clues_remaining INTEGER DEFAULT 3 NOT NULL,
  last_clue_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_spent_amount DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  thumbnail_url VARCHAR(500),
  storyline TEXT,
  total_episodes INTEGER DEFAULT 1 NOT NULL,
  total_chapters INTEGER DEFAULT 1 NOT NULL,
  estimated_play_time INTEGER, -- in minutes
  is_published BOOLEAN DEFAULT false NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  case_number INTEGER UNIQUE NOT NULL,
  max_level_required INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reward_xp INTEGER DEFAULT 0 NOT NULL,
  is_locked BOOLEAN DEFAULT true NOT NULL,
  required_level INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(case_id, chapter_number)
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')) DEFAULT 'locked' NOT NULL,
  score INTEGER DEFAULT 0 NOT NULL,
  completion_time INTEGER, -- in seconds
  hints_used INTEGER DEFAULT 0 NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, case_id, chapter_id)
);

-- Clues table
CREATE TABLE IF NOT EXISTS clues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  clue_type VARCHAR(50) NOT NULL,
  cost INTEGER DEFAULT 0 NOT NULL,
  is_free BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User clues table
CREATE TABLE IF NOT EXISTS user_clues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clue_id UUID NOT NULL REFERENCES clues(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, clue_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_cases_published ON cases(is_published);
CREATE INDEX IF NOT EXISTS idx_cases_featured ON cases(is_featured);
CREATE INDEX IF NOT EXISTS idx_chapters_case_id ON chapters(case_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_case_id ON user_progress(case_id);
CREATE INDEX IF NOT EXISTS idx_user_clues_user_id ON user_clues(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_clues ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth_id = auth.uid());

-- Users can only see their own progress
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can manage own progress" ON user_progress
    FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can only see their own clues
CREATE POLICY "Users can view own clues" ON user_clues
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can manage own clues" ON user_clues
    FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Cases and chapters are public for reading
CREATE POLICY "Cases are publicly readable" ON cases
    FOR SELECT USING (is_published = true);

CREATE POLICY "Chapters are publicly readable" ON chapters
    FOR SELECT USING (true);

-- Clues are publicly readable
CREATE POLICY "Clues are publicly readable" ON clues
    FOR SELECT USING (true);

-- Insert sample clues
INSERT INTO clues (title, description, clue_type, cost, is_free) VALUES
('Hint: Location', 'A hint about where to look next', 'location', 10, false),
('Hint: Person', 'A hint about who might be involved', 'person', 15, false),
('Hint: Time', 'A hint about when something happened', 'time', 5, false),
('Free Hint', 'A general hint to get started', 'general', 0, true);

-- Create storage bucket for case images
INSERT INTO storage.buckets (id, name, public) VALUES 
('case-images', 'case-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Anyone can view case images" ON storage.objects
FOR SELECT USING (bucket_id = 'case-images');

CREATE POLICY "Anyone can upload case images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'case-images');

CREATE POLICY "Anyone can update case images" ON storage.objects
FOR UPDATE USING (bucket_id = 'case-images');

CREATE POLICY "Anyone can delete case images" ON storage.objects
FOR DELETE USING (bucket_id = 'case-images');
