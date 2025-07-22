-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'student');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role public.app_role DEFAULT 'student';

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin or instructor
CREATE OR REPLACE FUNCTION public.is_admin_or_instructor(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role IN ('admin', 'instructor')
  )
$$;

-- Create quiz_questions table for assessments
CREATE TABLE public.quiz_questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id text NOT NULL,
    question_text text NOT NULL,
    question_type text NOT NULL DEFAULT 'multiple_choice', -- multiple_choice, true_false, open_text
    options jsonb, -- For multiple choice questions
    correct_answer text NOT NULL,
    explanation text,
    order_index integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on quiz_questions
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view quiz questions
CREATE POLICY "Quiz questions are viewable by everyone" 
ON public.quiz_questions 
FOR SELECT 
USING (true);

-- Policy: Only admins and instructors can modify quiz questions
CREATE POLICY "Admins and instructors can insert quiz questions" 
ON public.quiz_questions 
FOR INSERT 
WITH CHECK (public.is_admin_or_instructor(auth.uid()));

CREATE POLICY "Admins and instructors can update quiz questions" 
ON public.quiz_questions 
FOR UPDATE 
USING (public.is_admin_or_instructor(auth.uid()));

CREATE POLICY "Admins and instructors can delete quiz questions" 
ON public.quiz_questions 
FOR DELETE 
USING (public.is_admin_or_instructor(auth.uid()));

-- Create quiz_results table for tracking user quiz performance
CREATE TABLE public.quiz_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    lesson_id text NOT NULL,
    question_id uuid REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    user_answer text NOT NULL,
    is_correct boolean NOT NULL,
    completed_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on quiz_results
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own quiz results
CREATE POLICY "Users can view their own quiz results" 
ON public.quiz_results 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own quiz results
CREATE POLICY "Users can insert their own quiz results" 
ON public.quiz_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins and instructors can view all quiz results
CREATE POLICY "Admins and instructors can view all quiz results" 
ON public.quiz_results 
FOR SELECT 
USING (public.is_admin_or_instructor(auth.uid()));

-- Create triggers for updated_at timestamp
CREATE TRIGGER update_quiz_questions_updated_at
    BEFORE UPDATE ON public.quiz_questions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample admin user (you can change this email to your actual admin email)
INSERT INTO public.profiles (id, first_name, last_name, role) 
VALUES (
    (SELECT id FROM auth.users WHERE email = 'dilan@trytrustjoy.com' LIMIT 1),
    'Admin',
    'User',
    'admin'
) ON CONFLICT (id) DO UPDATE SET role = 'admin';