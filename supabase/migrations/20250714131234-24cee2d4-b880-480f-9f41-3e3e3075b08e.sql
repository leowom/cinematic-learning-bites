-- Create courses table
CREATE TABLE public.courses (
  id TEXT NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  total_duration TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create modules table
CREATE TABLE public.modules (
  id TEXT NOT NULL PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  total_duration TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id TEXT NOT NULL PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT NOT NULL,
  route TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (publicly readable)
CREATE POLICY "Courses are viewable by everyone" 
ON public.courses 
FOR SELECT 
USING (true);

-- RLS Policies for modules (publicly readable)
CREATE POLICY "Modules are viewable by everyone" 
ON public.modules 
FOR SELECT 
USING (true);

-- RLS Policies for lessons (publicly readable)
CREATE POLICY "Lessons are viewable by everyone" 
ON public.lessons 
FOR SELECT 
USING (true);

-- RLS Policies for user_progress (user-specific)
CREATE POLICY "Users can view their own progress" 
ON public.user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.user_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for timestamps
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial course data
INSERT INTO public.courses (id, title, description, total_duration) VALUES
('prompting-mastery', 'Prompting Mastery', 'Master the art of AI prompting with hands-on exercises and real-world applications.', '4 ore');

-- Insert initial modules data
INSERT INTO public.modules (id, course_id, title, description, total_duration, order_index) VALUES
('fundamentals', 'prompting-mastery', 'Fondamenti', 'Impara le basi del prompting e come strutturare richieste efficaci', '45 min', 1),
('advanced-techniques', 'prompting-mastery', 'Tecniche Avanzate', 'Scopri strategie avanzate per prompting complesso e professionale', '1.5 ore', 2),
('practical-applications', 'prompting-mastery', 'Applicazioni Pratiche', 'Metti in pratica le tue competenze con progetti reali', '2 ore', 3);

-- Insert initial lessons data
INSERT INTO public.lessons (id, module_id, title, description, duration, route, order_index) VALUES
-- Fundamentals module lessons
('intro-course', 'fundamentals', 'Introduzione al Corso', 'Panoramica completa del corso e obiettivi di apprendimento', '10 min', '/introduzione', 1),
('llm-fundamentals', 'fundamentals', 'Fondamenti degli LLM', 'Comprendere come funzionano i Large Language Models', '15 min', '/llm-fundamentals', 2),
('role-instruction', 'fundamentals', 'Istruzioni di Ruolo', 'Come definire il ruolo e il contesto per l''AI', '20 min', '/role-instruction', 3),

-- Advanced Techniques module lessons
('contesto-exercise', 'advanced-techniques', 'Esercizio sul Contesto', 'Pratica avanzata sulla gestione del contesto', '25 min', '/contesto-exercise', 1),
('format-control', 'advanced-techniques', 'Controllo del Formato', 'Padroneggiare il controllo del formato di output', '30 min', '/format-control', 2),
('prompt-iteration', 'advanced-techniques', 'Iterazione del Prompt', 'Tecniche per raffinare e migliorare i prompt', '35 min', '/prompt-iteration', 3),

-- Practical Applications module lessons
('edit-output', 'practical-applications', 'Modifica Output', 'Come modificare e raffinare le risposte dell''AI', '20 min', '/edit-output', 1),
('module3-code-by-prompt', 'practical-applications', 'Codice tramite Prompt', 'Generare codice utilizzando prompting avanzato', '45 min', '/module3-code-by-prompt', 2),
('module3-image-generator', 'practical-applications', 'Generatore di Immagini', 'Creare prompt per la generazione di immagini', '30 min', '/module3-image-generator', 3),
('module3-pdf-prompt', 'practical-applications', 'PDF Prompt', 'Lavorare con documenti PDF attraverso prompting', '25 min', '/module3-pdf-prompt', 4);

-- Enable realtime for user_progress table
ALTER TABLE public.user_progress REPLICA IDENTITY FULL;