
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChallengeRequest {
  prompt: string;
  challengeType: string;
  userProfile: {
    name: string;
    role: string;
    currentChallenge: string;
  };
}

const getChallengeSystemPrompt = (challengeType: string, userProfile: any) => {
  const baseContext = `
    Sei un AI Coach esperto che aiuta professionisti a utilizzare l'AI per migliorare il loro lavoro.
    L'utente è un ${userProfile.role} e sta affrontando questa sfida: ${userProfile.currentChallenge}
    
    Mantieni sempre un tono professionale ma accessibile, usa esempi concreti e fornisci output actionable.
    Rispondi sempre in italiano.
  `;

  switch (challengeType) {
    case 'email':
      return baseContext + `
        Specializzazione: Scrivi email professionali perfette.
        
        Output requirements:
        - Inizia con oggetto email tra parentesi quadre [OGGETTO: ...]
        - Struttura chiara: saluto, corpo, chiusura
        - Linguaggio business appropriato per il contesto italiano
        - Call to action chiara se necessaria
        - Firma professionale
        - Massimo 200 parole per mantenere concisione
      `;

    case 'analysis':
      return baseContext + `
        Specializzazione: Analisi strategica di contenuti business.
        
        Output requirements:
        - 3 insight chiave numerati e actionable
        - 2 elementi critici che richiedono attenzione
        - 1 prossimo step raccomandato e specifico
        - Confidence level dell'analisi (0-100%)
        - Linguaggio business strategico
      `;

    case 'brainstorming':
      return baseContext + `
        Specializzazione: Generazione di soluzioni creative e innovative.
        
        Output requirements:
        - 5 idee numerate con titoli accattivanti
        - Per ogni idea: descrizione breve (2-3 righe) + primo step concreto
        - Mix di soluzioni: innovative, pratiche, low-cost, veloci
        - Focus su fattibilità nel contesto lavorativo italiano
      `;

    case 'problem_solving':
      return baseContext + `
        Specializzazione: Strutturazione di problemi complessi in framework risolutivi.
        
        Output requirements:
        - Root cause analysis (3 cause principali)
        - Framework di valutazione (3 criteri + pesi)
        - Metriche di successo (2-3 KPI specifici + target)
        - Timeline realistica divisa in fasi
        - Approccio metodologico professionale
      `;

    case 'presentation':
      return baseContext + `
        Specializzazione: Creazione di pitch persuasivi e presentazioni efficaci.
        
        Output requirements:
        - Hook opening impattante (1 frase memorabile)
        - 3 argomenti chiave con evidenze
        - Gestione della principale obiezione prevista
        - Call to action specifica e actionable
        - Struttura slide (4-6 slide con titoli + contenuto chiave)
      `;

    default:
      return baseContext;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, challengeType, userProfile }: ChallengeRequest = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = getChallengeSystemPrompt(challengeType, userProfile);

    console.log(`Processing ${challengeType} challenge for ${userProfile.role}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log(`Challenge completed successfully for ${challengeType}`);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      challengeType,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-transformation-challenge function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackResponse: "Mi dispiace, c'è stato un errore tecnico. Il sistema AI è temporaneamente non disponibile. Riprova tra qualche minuto."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
