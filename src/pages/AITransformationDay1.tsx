
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import TransformationHeader from '@/components/ai-transformation/TransformationHeader';
import OnboardingScreen from '@/components/ai-transformation/OnboardingScreen';
import EmailChallenge from '@/components/ai-transformation/EmailChallenge';
import ResultsScreen from '@/components/ai-transformation/ResultsScreen';
import InsightsPanel from '@/components/ai-transformation/InsightsPanel';

interface UserProfile {
  name: string;
  role: string;
  currentChallenge: string;
}

interface ChallengeResult {
  aiResponse: string;
  userRating?: number;
  completionTime: number;
  satisfied: boolean;
}

const AITransformationDay1 = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0=onboarding, 1-5=challenges, 6=results
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    role: '',
    currentChallenge: ''
  });
  
  const [challengeResults, setChallengeResults] = useState<ChallengeResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [sessionStartTime] = useState(Date.now());

  // Timer effect
  useEffect(() => {
    if (currentStep >= 1 && currentStep <= 5 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const callAIService = useCallback(async (prompt: string, challengeType: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-transformation-challenge', {
        body: {
          prompt,
          challengeType,
          userProfile
        }
      });

      if (error) throw error;
      
      return data.response;
    } catch (error) {
      console.error('AI service error:', error);
      return "Mi dispiace, c'è stato un errore. Riprova tra poco.";
    } finally {
      setIsProcessing(false);
    }
  }, [userProfile]);

  const completeChallenge = useCallback((result: ChallengeResult) => {
    setChallengeResults(prev => [...prev, result]);
    setTimeLeft(180); // Reset timer for next challenge
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(6); // Results screen
    }
  }, [currentStep]);

  const handleUserProfileChange = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
  }, []);

  const handleStart = useCallback(() => {
    setCurrentStep(1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      {currentStep > 0 && currentStep < 6 && (
        <TransformationHeader
          currentStep={currentStep}
          totalSteps={5}
          timeLeft={timeLeft}
          formatTime={formatTime}
        />
      )}

      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className={currentStep > 0 && currentStep < 6 ? "flex-1 pr-4" : "w-full"}>
          {/* Render current step */}
          {currentStep === 0 && (
            <OnboardingScreen
              userProfile={userProfile}
              onUserProfileChange={handleUserProfileChange}
              onStart={handleStart}
            />
          )}
          
          {currentStep === 1 && (
            <EmailChallenge
              userProfile={userProfile}
              timeLeft={timeLeft}
              formatTime={formatTime}
              callAIService={callAIService}
              completeChallenge={completeChallenge}
              isProcessing={isProcessing}
            />
          )}
          
          {currentStep === 6 && (
            <ResultsScreen
              challengeResults={challengeResults}
              sessionStartTime={sessionStartTime}
            />
          )}

          {/* Placeholder for challenges 2-5 */}
          {currentStep >= 2 && currentStep <= 5 && (
            <div className="prompt-lab-container">
              <div className="step-card max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  🚧 Sfida {currentStep}/5 - In Sviluppo
                </h2>
                <p className="text-slate-300 mb-6">
                  Questa sfida sarà disponibile presto! Stiamo perfezionando l'esperienza per te.
                </p>
                <button 
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Prossima Sfida →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Insights Panel - Only show during challenges */}
        {currentStep > 0 && currentStep < 6 && (
          <div className="w-80 p-4 bg-slate-900/50 border-l border-slate-700">
            <InsightsPanel
              currentStep={currentStep}
              userProfile={userProfile}
              challengeResults={challengeResults}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AITransformationDay1;
