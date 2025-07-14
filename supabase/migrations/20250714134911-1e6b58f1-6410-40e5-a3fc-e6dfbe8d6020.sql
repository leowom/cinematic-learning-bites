-- Clear existing data and recreate the course structure
TRUNCATE TABLE user_progress CASCADE;
TRUNCATE TABLE lessons CASCADE;
TRUNCATE TABLE modules CASCADE;
TRUNCATE TABLE courses CASCADE;

-- Insert the main course
INSERT INTO courses (id, title, description, total_duration) VALUES (
  'corso-prompting',
  'Corso di Prompting Avanzato',
  'Corso completo per padroneggiare le tecniche di prompting e l''uso efficace dell''AI',
  '3h 45m'
);

-- Insert modules with correct order
INSERT INTO modules (id, course_id, title, description, total_duration, order_index) VALUES
  ('modulo-1', 'corso-prompting', 'Fondamenta dell''AI', 'Costruire le basi cognitive e operative per comprendere il funzionamento degli LLM', '1h 30m', 1),
  ('modulo-2', 'corso-prompting', 'Tecniche Avanzate di Prompting', 'Padroneggiare le leve che rendono un prompt potente: struttura, contesto, ruoli, formattazione', '1h 45m', 2),
  ('modulo-3', 'corso-prompting', 'Applicazioni Pratiche', 'Mettere in pratica tutto quanto appreso attraverso mini-progetti verticali su task reali', '30m', 3);

-- Insert lessons for Modulo 1 - Fondamenta dell'AI
INSERT INTO lessons (id, module_id, title, description, duration, route, order_index) VALUES
  ('introduzione', 'modulo-1', 'Introduzione', 'Benvenuto e visione del percorso', '5m', '/introduzione', 1),
  ('llm-fundamentals', 'modulo-1', 'Come funziona un LLM', 'Le basi per capirlo davvero', '25m', '/llm-fundamentals', 2),
  ('ai-work-helper', 'modulo-1', 'AI nel lavoro quotidiano', 'Come l''AI può supportarti nel lavoro quotidiano', '30m', '/ai-work-helper', 3),
  ('prompt-iteration', 'modulo-1', 'Pensiero iterativo', 'Sviluppare un pensiero iterativo con l''AI', '30m', '/prompt-iteration', 4);

-- Insert lessons for Modulo 2 - Tecniche Avanzate
INSERT INTO lessons (id, module_id, title, description, duration, route, order_index) VALUES
  ('prompting', 'modulo-2', 'Prompting avanzato', 'Struttura e logica dei comandi efficaci', '20m', '/prompting', 1),
  ('contesto', 'modulo-2', 'Contesto e memoria', 'Come far capire davvero cosa vuoi', '15m', '/contesto', 2),
  ('format-control', 'modulo-2', 'Controllo formato', 'Tabelle, liste, markdown e altro', '15m', '/ai-interactive/format-control', 3),
  ('role-instruction', 'modulo-2', 'Istruzioni di ruolo', 'Far recitare all''AI la parte giusta', '20m', '/ai-interactive/role-instruction', 4),
  ('edit-output', 'modulo-2', 'Modifica output', 'Prompt di controllo qualità', '15m', '/ai-interactive/edit-output', 5),
  ('prompt-lab', 'modulo-2', 'Esercizio finale', 'Lab di prompting completo', '20m', '/prompt-lab', 6);

-- Insert lessons for Modulo 3 - Applicazioni Pratiche  
INSERT INTO lessons (id, module_id, title, description, duration, route, order_index) VALUES
  ('module3-pdf-prompt', 'modulo-3', 'AI e documenti PDF', 'Estrarre valore da PDF e documenti con l''AI', '10m', '/module3-pdf-prompt', 1),
  ('module3-image-generator', 'modulo-3', 'Generazione immagini', 'Generare immagini con prompt visivi', '10m', '/module3-image-generator', 2),
  ('module3-code-by-prompt', 'modulo-3', 'Codice con AI', 'Scrivere codice funzionante con l''AI', '10m', '/module3-code-by-prompt', 3);