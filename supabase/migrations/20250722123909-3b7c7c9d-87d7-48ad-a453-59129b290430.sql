-- Add prerequisites and learning paths support
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS prerequisites TEXT[], 
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS target_role TEXT DEFAULT 'all';

-- Create user enrollments table
CREATE TABLE IF NOT EXISTS user_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on user_enrollments
ALTER TABLE user_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_enrollments
CREATE POLICY "Users can view their own enrollments" 
ON user_enrollments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enrollments" 
ON user_enrollments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all enrollments" 
ON user_enrollments FOR ALL 
USING (is_admin_or_instructor(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_user_enrollments_updated_at
BEFORE UPDATE ON user_enrollments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create learning paths table
CREATE TABLE IF NOT EXISTS learning_paths (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  course_sequence TEXT[] NOT NULL, -- Array of course IDs in order
  target_role TEXT DEFAULT 'all',
  estimated_duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on learning_paths
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

-- RLS policies for learning_paths
CREATE POLICY "Learning paths are viewable by everyone" 
ON learning_paths FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage learning paths" 
ON learning_paths FOR ALL 
USING (is_admin_or_instructor(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_learning_paths_updated_at
BEFORE UPDATE ON learning_paths
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample learning path
INSERT INTO learning_paths (id, title, description, course_sequence, target_role, estimated_duration)
VALUES 
  ('path-ai-fundamentals', 'AI Fundamentals Path', 'Percorso completo dalle basi all''applicazione pratica dell''AI', 
   ARRAY['corso-prompting'], 'all', '4-6 settimane');

-- Update courses with metadata
UPDATE courses 
SET 
  tags = ARRAY['ai', 'prompting', 'fondamentali'],
  level = 'beginner',
  target_role = 'all'
WHERE id = 'corso-prompting';