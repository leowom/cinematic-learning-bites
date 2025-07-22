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