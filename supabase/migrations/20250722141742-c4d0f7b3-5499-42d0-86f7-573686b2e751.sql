
-- Aggiungiamo le colonne necessarie alla tabella lessons per supportare il contenuto teorico
ALTER TABLE public.lessons 
ADD COLUMN content TEXT,
ADD COLUMN slides JSONB,
ADD COLUMN examples JSONB;

-- Aggiorniamo il trigger per updated_at se non esiste già
DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Aggiungiamo un indice per migliorare le performance quando cerchiamo per module_id
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
