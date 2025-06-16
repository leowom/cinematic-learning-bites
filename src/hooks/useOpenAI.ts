
import { useState } from 'react';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface TestResult {
  response: string;
  score: number;
  analysis: {
    completeness: number;
    accuracy: number;
    tone: number;
    specificity: number;
    actionability: number;
  };
  feedback: string[];
}

export const useOpenAI = () => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('openai_api_key') || '';
  });

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  };

  const testPromptWithGPT = async (prompt: string, testCase: any): Promise<TestResult> => {
    if (!apiKey) {
      throw new Error('API Key OpenAI non configurata');
    }

    try {
      // Costruisci il prompt per GPT-4o
      const systemPrompt = `Sei un esperto di customer service che deve rispondere a questa email seguendo il prompt fornito. Rispondi SOLO con la risposta del customer service, senza commenti aggiuntivi.

PROMPT DA SEGUIRE:
${prompt}

EMAIL CLIENTE:
${testCase.email}`;

      // Chiamata a OpenAI GPT-4o
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: OpenAIResponse = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Nessuna risposta generata';

      // Analizza la risposta con GPT-4o
      const analysisResult = await analyzeResponseWithGPT(aiResponse, testCase, prompt);

      return {
        response: aiResponse,
        score: analysisResult.score,
        analysis: analysisResult.analysis,
        feedback: analysisResult.feedback
      };

    } catch (error) {
      console.error('Errore chiamata OpenAI:', error);
      throw error;
    }
  };

  const analyzeResponseWithGPT = async (response: string, testCase: any, originalPrompt: string) => {
    const analysisPrompt = `Analizza questa risposta di customer service e dammi un punteggio da 1-100 per ogni criterio. Rispondi SOLO in formato JSON.

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

Rispondi in questo formato JSON:
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
          model: 'gpt-4o',
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

      const analysisData: OpenAIResponse = await analysisResponse.json();
      const analysisText = analysisData.choices[0]?.message?.content || '';
      
      // Parse del JSON
      const analysisJson = JSON.parse(analysisText);
      
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
      console.error('Errore analisi OpenAI:', error);
      // Fallback a analisi locale se l'API fallisce
      return {
        analysis: { completeness: 70, accuracy: 70, tone: 70, specificity: 70, actionability: 70 },
        score: 7,
        feedback: ['❌ Errore nell\'analisi automatica, punteggio stimato']
      };
    }
  };

  return {
    apiKey,
    saveApiKey,
    testPromptWithGPT,
    hasApiKey: !!apiKey
  };
};
