
-- Aggiungiamo politiche DELETE per permettere agli admin/instructor di eliminare corsi e dipendenze

-- Politiche per la tabella courses
CREATE POLICY "Admins and instructors can delete courses" 
ON public.courses 
FOR DELETE 
USING (public.is_admin_or_instructor(auth.uid()));

-- Politiche per la tabella modules
CREATE POLICY "Admins and instructors can delete modules" 
ON public.modules 
FOR DELETE 
USING (public.is_admin_or_instructor(auth.uid()));

-- Politiche per la tabella lessons
CREATE POLICY "Admins and instructors can delete lessons" 
ON public.lessons 
FOR DELETE 
USING (public.is_admin_or_instructor(auth.uid()));

-- Aggiungiamo anche le politiche INSERT e UPDATE che mancavano
CREATE POLICY "Admins and instructors can insert courses" 
ON public.courses 
FOR INSERT 
WITH CHECK (public.is_admin_or_instructor(auth.uid()));

CREATE POLICY "Admins and instructors can update courses" 
ON public.courses 
FOR UPDATE 
USING (public.is_admin_or_instructor(auth.uid()));

CREATE POLICY "Admins and instructors can insert modules" 
ON public.modules 
FOR INSERT 
WITH CHECK (public.is_admin_or_instructor(auth.uid()));

CREATE POLICY "Admins and instructors can update modules" 
ON public.modules 
FOR UPDATE 
USING (public.is_admin_or_instructor(auth.uid()));

CREATE POLICY "Admins and instructors can insert lessons" 
ON public.lessons 
FOR INSERT 
WITH CHECK (public.is_admin_or_instructor(auth.uid()));

CREATE POLICY "Admins and instructors can update lessons" 
ON public.lessons 
FOR UPDATE 
USING (public.is_admin_or_instructor(auth.uid()));

-- Creiamo una funzione per gestire l'eliminazione sicura a cascata
CREATE OR REPLACE FUNCTION public.delete_course_cascade(course_id_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Verifica che l'utente sia admin o instructor
  IF NOT public.is_admin_or_instructor(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins and instructors can delete courses';
  END IF;

  -- Elimina i quiz results collegati alle lezioni del corso
  DELETE FROM public.quiz_results 
  WHERE lesson_id IN (
    SELECT l.id FROM public.lessons l 
    JOIN public.modules m ON l.module_id = m.id 
    WHERE m.course_id = course_id_param
  );

  -- Elimina i quiz questions collegati alle lezioni del corso
  DELETE FROM public.quiz_questions 
  WHERE lesson_id IN (
    SELECT l.id FROM public.lessons l 
    JOIN public.modules m ON l.module_id = m.id 
    WHERE m.course_id = course_id_param
  );

  -- Elimina il progresso utente per le lezioni del corso
  DELETE FROM public.user_progress 
  WHERE lesson_id IN (
    SELECT l.id FROM public.lessons l 
    JOIN public.modules m ON l.module_id = m.id 
    WHERE m.course_id = course_id_param
  );

  -- Elimina le iscrizioni al corso
  DELETE FROM public.user_enrollments 
  WHERE course_id = course_id_param;

  -- Elimina le lezioni
  DELETE FROM public.lessons 
  WHERE module_id IN (
    SELECT id FROM public.modules WHERE course_id = course_id_param
  );

  -- Elimina i moduli
  DELETE FROM public.modules 
  WHERE course_id = course_id_param;

  -- Elimina il corso
  DELETE FROM public.courses 
  WHERE id = course_id_param;

  RETURN true;
END;
$$;
