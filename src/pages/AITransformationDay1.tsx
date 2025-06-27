
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Search, 
  Lightbulb, 
  Target, 
  Presentation, 
  Timer, 
  Trophy, 
  Star,
  ThumbsUp,
  Download,
  Share,
  ArrowRight,
  Zap,
  CheckCircle,
  Brain,
  Heart,
  Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import GlassmorphismCard from '@/components/GlassmorphismCard';

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
  const [currentChallenge, setCurrentChallenge] = useState<any>({});
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const callAIService = async (prompt: string, challengeType: string) => {
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
  };

  const completeChallenge = (result: ChallengeResult) => {
    setChallengeResults(prev => [...prev, result]);
    setTimeLeft(180); // Reset timer for next challenge
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(6); // Results screen
    }
  };

  // Onboarding Screen
  const OnboardingScreen = () => (
    <GlassmorphismCard className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Zap className="w-16 h-16 mx-auto mb-4 text-green-400" />
        <h1 className="text-3xl font-bold mb-4 text-white">
          ⚡ Benvenuto nel tuo AI Transformation
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed">
          Oggi farai 5 sfide rapide per scoprire come l'AI può aiutarti nel lavoro.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-slate-200 mb-2 block">Dimmi il tuo ruolo:</Label>
          <select 
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg p-3 text-slate-200 focus:border-slate-500 focus:outline-none"
            value={userProfile.role}
            onChange={(e) => setUserProfile(prev => ({...prev, role: e.target.value}))}
          >
            <option value="">Seleziona il tuo ruolo</option>
            <option value="manager">Manager</option>
            <option value="developer">Developer</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
            <option value="consultant">Consultant</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="other">Altro</option>
          </select>
        </div>

        <div>
          <Label className="text-slate-200 mb-2 block">Una sfida che affronti questa settimana:</Label>
          <Textarea
            placeholder="Descrivi una sfida lavorativa che stai affrontando..."
            className="bg-slate-800/60 border border-slate-600/50 text-slate-200 placeholder-slate-400 focus:border-slate-500 focus:outline-none resize-none"
            rows={4}
            value={userProfile.currentChallenge}
            onChange={(e) => setUserProfile(prev => ({...prev, currentChallenge: e.target.value}))}
          />
        </div>

        <Button
          onClick={() => setCurrentStep(1)}
          disabled={!userProfile.role || !userProfile.currentChallenge}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 text-lg font-semibold"
        >
          <Zap className="w-5 h-5 mr-2" />
          INIZIA LE SFIDE
        </Button>
      </div>
    </GlassmorphismCard>
  );

  // Challenge 1: Professional Email
  const EmailChallenge = () => {
    const [formData, setFormData] = useState({
      recipient: '',
      subject: '',
      objective: '',
      tone: 'professionale'
    });

    const generateEmail = async () => {
      const prompt = `
        Scrivi una email professionale con questi parametri:
        - Destinatario: ${formData.recipient}
        - Argomento: ${formData.subject}
        - Obiettivo: ${formData.objective}
        - Tono: ${formData.tone}
        - Mittente: ${userProfile.role}

        Email deve essere:
        - Professionale ma non rigida
        - Chiara e actionable
        - Appropriata per contesto business italiano
      `;

      const response = await callAIService(prompt, 'email');
      const completionTime = 180 - timeLeft;
      
      setCurrentChallenge({
        type: 'email',
        result: response,
        completionTime
      });
    };

    if (currentChallenge.type === 'email') {
      return (
        <GlassmorphismCard className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <h2 className="text-2xl font-bold text-white mb-2">✨ La tua email è pronta!</h2>
          </div>

          <div className="bg-slate-800/30 border border-slate-600 rounded-lg p-6 mb-6">
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
              {currentChallenge.result}
            </div>
          </div>

          <div className="flex items-center justify-center mb-6">
            <span className="text-green-400 font-semibold">
              💡 Tempo risparmiato: ~8 minuti
            </span>
          </div>

          <div className="text-center mb-6">
            <p className="text-slate-300 mb-4">Quanto useresti questa email?</p>
            <div className="flex justify-center space-x-2">
              {[1,2,3,4,5,6,7,8,9,10].map(star => (
                <Star
                  key={star}
                  className="w-6 h-6 cursor-pointer text-yellow-400 hover:scale-110 transition-transform"
                  fill="currentColor"
                  onClick={() => {
                    const result: ChallengeResult = {
                      aiResponse: currentChallenge.result,
                      userRating: star,
                      completionTime: currentChallenge.completionTime,
                      satisfied: star >= 7
                    };
                    completeChallenge(result);
                  }}
                />
              ))}
            </div>
          </div>
        </GlassmorphismCard>
      );
    }

    return (
      <GlassmorphismCard className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Mail className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">📧 Sfida 1/5: Email Smart</h2>
          </div>
          <div className="flex items-center space-x-2 text-orange-400">
            <Timer className="w-5 h-5" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <p className="text-slate-300 mb-6">
          L'AI ti aiuterà a scrivere una email professionale in 30 secondi.
        </p>

        <div className="space-y-4">
          <div>
            <Label className="text-slate-200 mb-2 block">Destinatario:</Label>
            <input
              type="text"
              className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg p-3 text-slate-200 placeholder-slate-400 focus:border-slate-500 focus:outline-none"
              value={formData.recipient}
              onChange={(e) => setFormData(prev => ({...prev, recipient: e.target.value}))}
              placeholder="es. Cliente, Manager, Team..."
            />
          </div>

          <div>
            <Label className="text-slate-200 mb-2 block">Argomento:</Label>
            <input
              type="text"
              className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg p-3 text-slate-200 placeholder-slate-400 focus:border-slate-500 focus:outline-none"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({...prev, subject: e.target.value}))}
              placeholder="es. Aggiornamento progetto, Proposta..."
            />
          </div>

          <div>
            <Label className="text-slate-200 mb-2 block">Obiettivo:</Label>
            <input
              type="text"
              className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg p-3 text-slate-200 placeholder-slate-400 focus:border-slate-500 focus:outline-none"
              value={formData.objective}
              onChange={(e) => setFormData(prev => ({...prev, objective: e.target.value}))}
              placeholder="es. Richiedere feedback, Proporre meeting..."
            />
          </div>

          <div>
            <Label className="text-slate-200 mb-2 block">Tono desiderato:</Label>
            <select 
              className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg p-3 text-slate-200 focus:border-slate-500 focus:outline-none"
              value={formData.tone}
              onChange={(e) => setFormData(prev => ({...prev, tone: e.target.value}))}
            >
              <option value="formale">Formale</option>
              <option value="amichevole">Amichevole</option>
              <option value="diretto">Diretto</option>
            </select>
          </div>

          <Button
            onClick={generateEmail}
            disabled={!formData.recipient || !formData.subject || !formData.objective || isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
          >
            {isProcessing ? (
              <>
                <Brain className="w-5 h-5 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                GENERA EMAIL
              </>
            )}
          </Button>
        </div>
      </GlassmorphismCard>
    );
  };

  // Final Results Screen
  const ResultsScreen = () => {
    const totalTime = Math.floor((Date.now() - sessionStartTime) / 1000);
    const avgRating = challengeResults.reduce((sum, r) => sum + (r.userRating || 0), 0) / challengeResults.length;
    const score = Math.round(avgRating * 10 + (challengeResults.filter(r => r.satisfied).length * 5));
    
    return (
      <GlassmorphismCard className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white mb-4">
            🎉 COMPLIMENTI! Hai completato il tuo primo giorno di AI mastery!
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800/30 border border-slate-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">📊 I TUOI RISULTATI:</h3>
            <div className="space-y-3 text-slate-300">
              <div className="flex justify-between">
                <span>⏱️ Tempo totale:</span>
                <span className="text-white font-semibold">{Math.floor(totalTime/60)} min {totalTime%60} sec</span>
              </div>
              <div className="flex justify-between">
                <span>🎯 Punteggio:</span>
                <span className="text-green-400 font-bold text-xl">{score}/100</span>
              </div>
              <div className="flex justify-between">
                <span>⭐ Livello raggiunto:</span>
                <span className="text-yellow-400 font-semibold">AI PRACTITIONER</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">💰 VALORE GENERATO OGGI:</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <div>• Tempo risparmiato: ~45 minuti</div>
              <div>• Email: Pronta per invio</div>
              <div>• Analisi: 3 insight actionable</div>
              <div>• Idee: 5 soluzioni innovative</div>
              <div>• Framework: Piano d'azione strutturato</div>
              <div>• Pitch: Presentazione persuasiva</div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-4 mb-6">
            <Award className="w-8 h-8 mx-auto mb-2 text-slate-900" />
            <h3 className="font-bold text-slate-900">🏅 BADGE SBLOCCATO:</h3>
            <p className="text-slate-900 font-semibold">[AI EXPLORER BADGE] 🔍</p>
          </div>

          <div className="mb-6">
            <p className="text-slate-300 mb-2">📈 PROGRESS: Giorno 1/21 completato</p>
            <Progress value={4.8} className="w-full h-3" />
            <p className="text-slate-400 text-sm mt-1">4.8% completato</p>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300">
              🔮 DOMANI: Imparerai a scegliere lo strumento AI perfetto per ogni situazione!
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button className="bg-slate-700 hover:bg-slate-600 text-white">
            <Share className="w-4 h-4 mr-2" />
            CONDIVIDI RISULTATO
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
            <ArrowRight className="w-4 h-4 mr-2" />
            CONTINUA DOMANI
          </Button>
        </div>
      </GlassmorphismCard>
    );
  };

  const getCurrentStepProgress = () => {
    if (currentStep === 0) return 0;
    if (currentStep === 6) return 100;
    return (currentStep / 5) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      {/* Progress Header */}
      {currentStep > 0 && currentStep < 6 && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">AI Transformation - Giorno 1</h1>
            <div className="text-slate-300">
              Step {currentStep}/5
            </div>
          </div>
          <Progress value={getCurrentStepProgress()} className="w-full h-2" />
        </div>
      )}

      {/* Render current step */}
      {currentStep === 0 && <OnboardingScreen />}
      {currentStep === 1 && <EmailChallenge />}
      {currentStep === 6 && <ResultsScreen />}

      {/* Placeholder for challenges 2-5 */}
      {currentStep >= 2 && currentStep <= 5 && (
        <GlassmorphismCard className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Sfida {currentStep}/5 - In Sviluppo
          </h2>
          <p className="text-slate-300 mb-6">
            Questa sfida sarà disponibile presto!
          </p>
          <Button 
            onClick={() => setCurrentStep(currentStep + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Prossima Sfida
          </Button>
        </GlassmorphismCard>
      )}
    </div>
  );
};

export default AITransformationDay1;
