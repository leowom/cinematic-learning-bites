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
    const { action, ...requestData } = await req.json()
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found')
    }

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
        throw new Error('Invalid action');
    }

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
    console.error('Error in AI content generator:', error)
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
  
  const prompt = `Analizza il seguente contenuto e genera un corso completo strutturato secondo i principi del micro-learning.

CONTENUTO DA ANALIZZARE:
${request.content}

PARAMETRI:
- Titolo argomento: ${request.topic || 'Argomento principale'}
- Target audience: ${request.targetAudience}
- Numero moduli richiesti: ${moduleCount}
- Lezioni per modulo: circa ${lessonPerModule}

ISTRUZIONI SPECIFICHE:
1. Analizza il contenuto e crea un titolo coinvolgente per il corso
2. Suddividi in ${moduleCount} moduli logici che seguono una progressione didattica
3. Per ogni modulo, crea ${lessonPerModule}-${lessonPerModule + 2} micro-lezioni (100-150 parole ciascuna)
4. Ogni lezione deve includere:
   - Titolo chiaro e specifico
   - Contenuto micro-learning (100-150 parole max)
   - 3-4 slide script (bullet points)
   - 1-2 esempi pratici
   - 1-2 quiz a scelta multipla (4 opzioni, 1 corretta)
5. Aggiungi un test finale di 5 domande che copra tutti i moduli
6. Linguaggio: chiaro, pratico, orientato all'azione
7. Mantieni fedeltà al contenuto ma semplifica concetti complessi

FORMATO RISPOSTA (JSON rigoroso):
{
  "courseTitle": "Titolo del Corso Completo",
  "totalDuration": "durata stimata (es: 2h 30m)",
  "description": "Descrizione breve del corso",
  "modules": [
    {
      "moduleTitle": "Titolo del Modulo",
      "description": "Descrizione del modulo (1-2 frasi)",
      "duration": "durata stimata",
      "lessons": [
        {
          "lessonTitle": "Titolo Micro-lezione",
          "content": "Contenuto della lezione (100-150 parole, didattico e pratico)",
          "duration": "5-8 min",
          "slides": [
            "Punto chiave 1",
            "Punto chiave 2", 
            "Punto chiave 3",
            "Takeaway pratico"
          ],
          "examples": [
            "Esempio pratico 1 con dettagli",
            "Esempio pratico 2 applicativo"
          ],
          "quiz": [
            {
              "question": "Domanda specifica sulla lezione",
              "options": ["Opzione A", "Opzione B", "Opzione C", "Opzione D"],
              "correctAnswer": "Opzione corretta",
              "explanation": "Spiegazione del perché è corretta"
            }
          ]
        }
      ],
      "learningObjectives": [
        "Obiettivo 1",
        "Obiettivo 2"
      ]
    }
  ],
  "finalTest": [
    {
      "question": "Domanda di riepilogo generale",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "Risposta corretta",
      "explanation": "Spiegazione dettagliata"
    }
  ]
}

IMPORTANTE: Rispondi ESCLUSIVAMENTE con il JSON valido, senza testo aggiuntivo o markdown.`;

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
      max_tokens: 4000,
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }

  try {
    const result = JSON.parse(data.choices[0].message.content);
    return result;
  } catch (e) {
    throw new Error('Invalid JSON response from AI: ' + data.choices[0].message.content.substring(0, 200));
  }
}

async function parsePDF(request: ParsePDFRequest, apiKey: string) {
  const prompt = `Analizza questo testo estratto da un PDF e ripuliscilo per l'uso didattico:

TESTO GREZZO:
${request.pdfContent}

ISTRUZIONI:
1. Rimuovi intestazioni ripetitive, numeri di pagina, riferimenti non essenziali
2. Elimina formattazioni strane e caratteri di controllo
3. Mantieni solo il contenuto principale educativo
4. Organizza in paragrafi logici
5. Correggi errori di OCR evidenti
6. Mantieni terminologia tecnica importante
7. Assicurati che il testo sia fluido e comprensibile

FORMATO RISPOSTA (JSON):
{
  "cleanedText": "Testo ripulito e organizzato",
  "wordCount": numero_parole,
  "mainTopics": ["argomento 1", "argomento 2", "argomento 3"],
  "suggestedTitle": "Titolo suggerito per il contenuto"
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
      temperature: 0.3,
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