import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateModulesRequest {
  content: string;
  topic: string;
  targetAudience: string;
}

interface GenerateQuizRequest {
  content: string;
  questionCount: number;
  difficulty: string;
}

interface GenerateExplanationRequest {
  text: string;
  requestType: 'example' | 'simplify' | 'expand';
}

interface GenerateFullCourseRequest {
  content: string;
  topic?: string;
  targetAudience: string;
  moduleCount?: number;
  lessonPerModule?: number;
}

interface ParsePDFRequest {
  pdfContent: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 AI Content Generator called')
    const { action, ...requestData } = await req.json()
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found in environment')
      throw new Error('OpenAI API key not configured')
    }

    console.log('🎯 Processing action:', action)

    let response;
    
    switch (action) {
      case 'generate_modules':
        response = await generateModules(requestData as GenerateModulesRequest, openAIApiKey);
        break;
      case 'generate_quiz':
        response = await generateQuiz(requestData as GenerateQuizRequest, openAIApiKey);
        break;
      case 'generate_explanation':
        response = await generateExplanation(requestData as GenerateExplanationRequest, openAIApiKey);
        break;
      case 'generate_full_course':
        response = await generateFullCourse(requestData as GenerateFullCourseRequest, openAIApiKey);
        break;
      case 'parse_pdf':
        response = await parsePDF(requestData as ParsePDFRequest, openAIApiKey);
        break;
      default:
        throw new Error('Invalid action: ' + action);
    }

    console.log('✅ AI processing completed successfully')

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Error in AI content generator:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

async function generateModules(request: GenerateModulesRequest, apiKey: string) {
  const prompt = `Basandoti sul seguente contenuto, crea una struttura di corso organizzata in moduli.

CONTENUTO DA ANALIZZARE:
${request.content}

PARAMETRI:
- Topic: ${request.topic}
- Target Audience: ${request.targetAudience}

ISTRUZIONI:
1. Analizza il contenuto e crea 3-5 moduli logici
2. Per ogni modulo fornisci:
   - Titolo chiaro e coinvolgente
   - Descrizione dettagliata (2-3 frasi)
   - Durata stimata (es. "45 min", "1h 30m")
   - Lista di 3-5 lezioni specifiche con titoli pratici
   - Obiettivi di apprendimento

FORMATO RISPOSTA (JSON):
{
  "modules": [
    {
      "title": "Titolo del modulo",
      "description": "Descrizione dettagliata del modulo",
      "duration": "durata stimata",
      "lessons": [
        {
          "title": "Titolo della lezione",
          "description": "Breve descrizione della lezione",
          "type": "theory|exercise|video|quiz",
          "duration": "durata"
        }
      ],
      "learning_objectives": ["obiettivo 1", "obiettivo 2"]
    }
  ]
}

Rispondi SOLO con il JSON, senza testo aggiuntivo.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }

  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (e) {
    throw new Error('Invalid JSON response from AI');
  }
}

async function generateQuiz(request: GenerateQuizRequest, apiKey: string) {
  const prompt = `Basandoti sul seguente contenuto, crea ${request.questionCount} domande quiz di difficoltà ${request.difficulty}.

CONTENUTO:
${request.content}

ISTRUZIONI:
1. Crea domande pertinenti al contenuto
2. Varia i tipi di domanda (scelta multipla, vero/falso)
3. Per scelta multipla: 4 opzioni, 1 corretta
4. Includi spiegazioni per le risposte
5. Difficoltà ${request.difficulty}: adatta linguaggio e complessità

FORMATO RISPOSTA (JSON):
{
  "questions": [
    {
      "question_text": "Testo della domanda",
      "question_type": "multiple_choice|true_false",
      "options": ["opzione1", "opzione2", "opzione3", "opzione4"], // solo per multiple_choice
      "correct_answer": "risposta corretta",
      "explanation": "Spiegazione del perché questa è la risposta corretta"
    }
  ]
}

Rispondi SOLO con il JSON, senza testo aggiuntivo.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }

  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (e) {
    throw new Error('Invalid JSON response from AI');
  }
}

async function generateExplanation(request: GenerateExplanationRequest, apiKey: string) {
  let prompt = '';
  
  switch (request.requestType) {
    case 'example':
      prompt = `Fornisci un esempio pratico e concreto per spiegare questo concetto:
      
"${request.text}"

Rendi l'esempio facile da comprendere e applicabile nel mondo reale.`;
      break;
    case 'simplify':
      prompt = `Semplifica questo testo rendendolo più facile da capire, mantenendo tutte le informazioni importanti:
      
"${request.text}"

Usa un linguaggio più semplice e accessibile.`;
      break;
    case 'expand':
      prompt = `Espandi e approfondisci questo concetto fornendo più dettagli e contesto:
      
"${request.text}"

Aggiungi informazioni utili e dettagli che aiutino la comprensione.`;
      break;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }

  return {
    enhanced_text: data.choices[0].message.content.trim()
  };
}

async function generateFullCourse(request: GenerateFullCourseRequest, apiKey: string) {
  const moduleCount = request.moduleCount || 4;
  const lessonPerModule = request.lessonPerModule || 3;
  
  console.log(`📚 Generating full course: ${request.topic || 'Untitled'} for ${request.targetAudience}`)
  
  const prompt = `Analizza il seguente contenuto e genera un corso completo strutturato secondo i principi del micro-learning avanzato.

CONTENUTO DA ANALIZZARE:
${request.content}

PARAMETRI DI CONFIGURAZIONE:
- Titolo argomento: ${request.topic || 'Argomento principale da identificare'}
- Target audience: ${request.targetAudience}
- Numero moduli richiesti: ${moduleCount}
- Lezioni per modulo: circa ${lessonPerModule}

ISTRUZIONI SPECIFICHE AVANZATE:
1. ANALISI CONTENUTO: Estrai i concetti chiave e organizzali in una progressione didattica logica
2. TITOLO: Crea un titolo coinvolgente e professionale che rifletta il valore del corso
3. STRUTTURA: Suddividi in ${moduleCount} moduli che seguono questo schema:
   - Modulo 1: Fondamenti e introduzione
   - Moduli intermedi: Sviluppo progressivo dei concetti
   - Ultimo modulo: Applicazione pratica e sintesi

4. MICRO-LEZIONI: Per ogni modulo, crea ${lessonPerModule}-${lessonPerModule + 2} micro-lezioni (max 200 parole ciascuna):
   - Titolo specifico e action-oriented
   - Contenuto conciso ma completo
   - Focus su un singolo concetto chiave
   - Linguaggio appropriato per ${request.targetAudience}

5. ELEMENTI DIDATTICI per ogni lezione:
   - CONTENUTO: 150-200 parole, pratico e chiaro
   - SLIDE SCRIPT: 4-5 punti chiave per slide presentation
   - ESEMPI: 2-3 esempi concreti e applicabili
   - QUIZ: 2-3 domande multiple choice (4 opzioni, 1 corretta) con spiegazioni dettagliate

6. TEST FINALE: 5-7 domande che coprono tutti i moduli con difficoltà progressiva

7. QUALITÀ CONTENT:
   - Linguaggio professionale ma accessibile
   - Esempi pertinenti e aggiornati
   - Concetti spiegati in modo progressivo
   - Call-to-action chiari in ogni lezione

FORMATO RISPOSTA (JSON RIGOROSO - NESSUN TESTO AGGIUNTIVO):
{
  "courseTitle": "Titolo Professionale del Corso",
  "totalDuration": "durata stimata (es: 3-4 ore)",
  "description": "Descrizione coinvolgente del corso (2-3 frasi)",
  "modules": [
    {
      "moduleTitle": "Titolo del Modulo",
      "description": "Descrizione del modulo (1-2 frasi specifiche)",
      "duration": "durata stimata (es: 45-60 min)",
      "lessons": [
        {
          "lessonTitle": "Titolo Specifico della Micro-lezione",
          "content": "Contenuto della lezione (150-200 parole, didattico, pratico e strutturato)",
          "duration": "8-12 min",
          "slides": [
            "Punto chiave 1 per slide",
            "Punto chiave 2 per slide", 
            "Punto chiave 3 per slide",
            "Takeaway pratico specifico"
          ],
          "examples": [
            "Esempio pratico 1 con dettagli concreti e applicabili",
            "Esempio pratico 2 con scenario reale",
            "Caso studio o situazione pratica (opzionale)"
          ],
          "quiz": [
            {
              "question": "Domanda specifica sulla lezione appena studiata",
              "options": ["Opzione A dettagliata", "Opzione B dettagliata", "Opzione C dettagliata", "Opzione D dettagliata"],
              "correctAnswer": "Opzione corretta esatta",
              "explanation": "Spiegazione dettagliata del perché è corretta e perché le altre sono sbagliate"
            }
          ]
        }
      ],
      "learningObjectives": [
        "Obiettivo di apprendimento specifico e misurabile 1",
        "Obiettivo di apprendimento specifico e misurabile 2",
        "Obiettivo di apprendimento specifico e misurabile 3"
      ]
    }
  ],
  "finalTest": [
    {
      "question": "Domanda di riepilogo che integra concetti di più moduli",
      "options": ["Opzione A", "Opzione B", "Opzione C", "Opzione D"],
      "correctAnswer": "Risposta corretta",
      "explanation": "Spiegazione completa che richiama concetti del corso"
    }
  ]
}

IMPORTANTE: 
- Rispondi ESCLUSIVAMENTE con il JSON valido
- Non aggiungere testo, markdown o commenti
- Assicurati che tutti i campi siano popolati
- Mantieni la coerenza tematica tra moduli e lezioni
- Bilancia teoria e pratica per il target ${request.targetAudience}`;

  console.log('📝 Sending enhanced prompt to OpenAI...');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    console.error('❌ OpenAI API Error:', data.error);
    throw new Error(data.error.message);
  }

  console.log('📊 OpenAI Response received, parsing JSON...');

  try {
    const result = JSON.parse(data.choices[0].message.content);
    
    // Validate the structure
    if (!result.courseTitle || !result.modules || result.modules.length === 0) {
      throw new Error('Generated course structure is invalid');
    }

    console.log('✅ Course generated successfully:', {
      title: result.courseTitle,
      moduleCount: result.modules.length,
      totalLessons: result.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)
    });

    return result;
  } catch (e) {
    console.error('❌ JSON Parse Error:', e);
    console.error('Raw response:', data.choices[0].message.content?.substring(0, 500));
    throw new Error('Invalid JSON response from AI: ' + e.message);
  }
}

async function parsePDF(request: ParsePDFRequest, apiKey: string) {
  console.log('📄 Starting PDF content parsing...');
  
  const prompt = `Analizza questo contenuto estratto da un documento e prepara un'analisi strutturata per la creazione di un corso.

CONTENUTO GREZZO:
${request.pdfContent}

ISTRUZIONI AVANZATE:
1. PULIZIA CONTENUTO:
   - Rimuovi intestazioni, piè di pagina, numerazione pagine
   - Elimina caratteri di controllo e formattazioni strane
   - Correggi errori di OCR evidenti
   - Mantieni struttura logica e paragrafi

2. ANALISI TEMATICA:
   - Identifica 5-8 argomenti principali
   - Rileva la difficoltà del contenuto
   - Determina il target audience più appropriato

3. OTTIMIZZAZIONE:
   - Organizza in paragrafi logici e fluidi
   - Mantieni terminologia tecnica importante
   - Assicura comprensibilità e coerenza

FORMATO RISPOSTA (JSON):
{
  "cleanedText": "Testo ripulito, organizzato e ottimizzato per la didattica",
  "wordCount": numero_parole_effettive,
  "mainTopics": ["argomento principale 1", "argomento principale 2", "argomento principale 3", "argomento principale 4", "argomento principale 5"],
  "suggestedTitle": "Titolo professionale suggerito per il corso",
  "contentComplexity": "beginner|intermediate|advanced",
  "estimatedDuration": "durata stimata per il corso completo",
  "keyLearningAreas": ["area di apprendimento 1", "area di apprendimento 2", "area di apprendimento 3"]
}

Rispondi SOLO con il JSON valido, senza testo aggiuntivo.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    console.error('❌ OpenAI PDF Parse Error:', data.error);
    throw new Error(data.error.message);
  }

  try {
    const result = JSON.parse(data.choices[0].message.content);
    console.log('✅ PDF parsed successfully:', {
      wordCount: result.wordCount,
      topics: result.mainTopics?.length || 0,
      complexity: result.contentComplexity
    });
    return result;
  } catch (e) {
    console.error('❌ PDF Parse JSON Error:', e);
    throw new Error('Invalid JSON response from PDF parsing');
  }
}
