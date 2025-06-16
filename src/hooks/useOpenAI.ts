
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const testPromptWithGPT = async (prompt: string, testCase: any): Promise<TestResult> => {
    try {
      console.log('🚀 Calling Supabase edge function for GPT-4o test...');
      
      const { data, error } = await supabase.functions.invoke('test-prompt-gpt', {
        body: {
          prompt,
          testCase
        }
      });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(`Errore edge function: ${error.message}`);
      }

      if (data.error) {
        console.error('❌ OpenAI API error:', data.error);
        throw new Error(data.error);
      }

      console.log('✅ GPT-4o test completed successfully:', data);

      return {
        response: data.response,
        score: data.score,
        analysis: data.analysis,
        feedback: data.feedback
      };

    } catch (error) {
      console.error('❌ Errore chiamata GPT-4o:', error);
      throw error;
    }
  };

  return {
    testPromptWithGPT,
    hasApiKey: true, // Sempre true con Supabase
    apiKey: '', // Non più necessario nel frontend
    saveApiKey: () => {} // Non più necessario
  };
};
