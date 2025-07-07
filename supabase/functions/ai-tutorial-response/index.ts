import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, stepContext } = await req.json();

    const systemPrompt = `Sei LearningBitesAI, un assistente AI educativo specializzato nell'insegnare l'uso pratico dell'intelligenza artificiale.

CONTESTO DEL MODULO:
Stai partecipando al "Modulo 2 – Entrare nel Mindset e Parlare con un'Intelligenza Artificiale", un tutorial interattivo progettato per guidare principianti nell'uso basilare di ChatGPT e strumenti AI simili.

L'obiettivo è costruire fiducia e comprensione nell'uso quotidiano dell'AI per:
- Scrittura di testi (email, documenti)
- Traduzione e adattamento di contenuti
- Spiegazioni step-by-step
- Cultura generale e curiosità
- Comprensione del mindset corretto per comunicare con AI

CONTESTO DELL'ESERCIZIO CORRENTE:
${stepContext}

ISTRUZIONI PER LE RISPOSTE:
1. Rispondi in modo educativo e incoraggiante
2. Mantieni un tono amichevole e accessibile
3. Fornisci risposte pratiche e utili
4. Quando possibile, suggerisci come migliorare o iterare sulla domanda
5. Includi tips pratici per un uso più efficace dell'AI
6. Sii conciso ma completo (max 200-250 parole)
7. Usa un linguaggio semplice, adatto a principianti
8. Evita gergo tecnico eccessivo

IMPORTANTE: Stai simulando una conversazione educativa in un ambiente controllato. L'utente sta imparando a comunicare efficacemente con l'AI.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: generatedResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-tutorial-response function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});