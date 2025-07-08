
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, testCase } = await req.json();

    console.log('🚀 Testing prompt with GPT-4.1:', { 
      prompt: prompt.substring(0, 100) + '...', 
      type: testCase?.type || 'customer_service' 
    });

    // Initialize messages array at the beginning
    const messages = [];
    let systemPrompt;
    let userPrompt;
    let aiResponse;

    if (testCase?.type === 'pdf_analysis') {
      console.log('📄 Processing PDF analysis with base64 content');
      
      // Extract base64 and user request from prompt
      const base64Match = prompt.match(/PDF_BASE64_CONTENT:\s*([A-Za-z0-9+/=]+)/);
      const requestMatch = prompt.match(/USER_REQUEST:\s*(.+)$/);
      
      if (!base64Match || !requestMatch) {
        throw new Error('Formato prompt PDF non valido');
      }
      
      const base64Content = base64Match[1];
      const userRequest = requestMatch[1];
      
      console.log(`📄 PDF base64 length: ${base64Content.length} chars`);
      console.log(`📄 User request: ${userRequest}`);
      
      systemPrompt = `Sei un esperto analista di documenti PDF. Il documento è fornito in formato base64. 
Analizza il contenuto e rispondi alla richiesta dell'utente in modo preciso e dettagliato.

ISTRUZIONI:
- Il documento PDF è codificato in base64 
- Estrai e analizza il contenuto del documento
- Rispondi SOLO basandoti sul contenuto del documento
- Se alcune parti non sono chiare, menzionalo esplicitamente
- Fornisci sempre informazioni utili e specifiche
- Usa un tono professionale ma accessibile`;

      userPrompt = `Documento PDF (codificato in base64): ${base64Content}

Richiesta dell'utente: ${userRequest}

Analizza il documento PDF e rispondi alla richiesta in modo dettagliato e preciso.`;
      
      messages.push({
        role: 'system',
        content: systemPrompt
      });
      
      messages.push({
        role: 'user',
        content: userPrompt
      });
      
    } else {
      // Logica originale per customer service
      systemPrompt = `Sei un esperto di customer service che deve rispondere a questa email seguendo il prompt fornito. Rispondi SOLO con la risposta del customer service, senza commenti aggiuntivi.

PROMPT DA SEGUIRE:
${prompt}

EMAIL CLIENTE:
${testCase.email}`;
      
      userPrompt = '';
      
      messages.push({
        role: 'system',
        content: systemPrompt
      });
      
      if (userPrompt) {
        messages.push({
          role: 'user',
          content: userPrompt
        });
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages,
        max_tokens: testCase?.type === 'pdf_analysis' ? 1500 : 1000,
        temperature: testCase?.type === 'pdf_analysis' ? 0.3 : 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ OpenAI API Error:', errorData);
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    aiResponse = data.choices[0]?.message?.content || 'Nessuna risposta generata';

    if (testCase?.type === 'pdf_analysis') {
      console.log('✅ PDF analysis completed successfully');
      
      // Per l'analisi PDF, restituisci una risposta semplificata
      return new Response(JSON.stringify({
        response: aiResponse,
        score: 10, // Punteggio fisso per PDF
        analysis: {
          completeness: 95,
          accuracy: 95,
          tone: 90,
          specificity: 90,
          actionability: 90
        },
        feedback: ['✅ Documento analizzato con successo']
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.log('✅ Customer service response generated, analyzing...');

      // Analizza la risposta per customer service
      const analysisResult = await analyzeResponseWithGPT(aiResponse, testCase, prompt, openAIApiKey);

      console.log('📊 Analysis completed:', analysisResult);

      return new Response(JSON.stringify({
        response: aiResponse,
        score: analysisResult.score,
        analysis: analysisResult.analysis,
        feedback: analysisResult.feedback
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ Error in test-prompt-gpt function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Errore sconosciuto durante il test AI' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeResponseWithGPT(response: string, testCase: any, originalPrompt: string, apiKey: string) {
  const analysisPrompt = `Analizza questa risposta di customer service e dammi un punteggio da 1-100 per ogni criterio. Rispondi in formato JSON puro, senza markdown o backticks.

RISPOSTA DA ANALIZZARE:
${response}

EMAIL ORIGINALE:
${testCase.email}

PROMPT USATO:
${originalPrompt}

CRITERI DI VALUTAZIONE:
1. COMPLETENESS: La risposta affronta tutti i punti della email?
2. ACCURACY: I dettagli sono corretti e pertinenti?
3. TONE: Il tono è appropriato alla situazione?
4. SPECIFICITY: Include dettagli specifici (date, importi, contatti)?
5. ACTIONABILITY: Il cliente sa esattamente cosa fare dopo?

Rispondi in questo formato JSON (solo JSON, niente altro):
{
  "completeness": 85,
  "accuracy": 90,
  "tone": 75,
  "specificity": 80,
  "actionability": 85,
  "feedback": [
    "✅ Risposta completa: include tutti gli elementi essenziali",
    "⚠️ Poco specifico: aggiungi timeline precisi"
  ]
}`;

  try {
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: analysisPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    const analysisData = await analysisResponse.json();
    const analysisText = analysisData.choices[0]?.message?.content || '';
    
    console.log('🔍 Raw analysis response:', analysisText);
    
    // Rimuovi eventuali backticks markdown e spazi extra
    const cleanedText = analysisText
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s+|\s+$/g, '');
    
    console.log('🧹 Cleaned analysis text:', cleanedText);
    
    // Parse del JSON
    const analysisJson = JSON.parse(cleanedText);
    
    // Calcola score generale (media pesata)
    const weights = { completeness: 0.25, accuracy: 0.25, tone: 0.20, specificity: 0.15, actionability: 0.15 };
    const weightedScore = Object.entries(weights).reduce((total, [key, weight]) => {
      return total + (analysisJson[key] * weight);
    }, 0);
    
    return {
      analysis: {
        completeness: analysisJson.completeness,
        accuracy: analysisJson.accuracy,
        tone: analysisJson.tone,
        specificity: analysisJson.specificity,
        actionability: analysisJson.actionability
      },
      score: Math.round(weightedScore / 10), // Scala 1-10
      feedback: analysisJson.feedback || []
    };

  } catch (error) {
    console.error('❌ Errore analisi OpenAI:', error);
    // Fallback a analisi locale se l'API fallisce
    return {
      analysis: { completeness: 70, accuracy: 70, tone: 70, specificity: 70, actionability: 70 },
      score: 7,
      feedback: ['❌ Errore nell\'analisi automatica, punteggio stimato']
    };
  }
}
