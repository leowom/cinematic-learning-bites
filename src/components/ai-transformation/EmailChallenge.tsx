
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Star,
  Zap,
  CheckCircle,
  Brain,
  User,
  MessageSquare,
  Target,
  Palette
} from 'lucide-react';

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

interface EmailChallengeProps {
  userProfile: UserProfile;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  callAIService: (prompt: string, challengeType: string) => Promise<string>;
  completeChallenge: (result: ChallengeResult) => void;
  isProcessing: boolean;
}

const inputBaseStyles = "w-full bg-slate-800/80 border border-slate-600/60 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-0 focus:outline-none transition-all duration-200 rounded-lg";

const EmailChallenge: React.FC<EmailChallengeProps> = React.memo(({ 
  userProfile, 
  timeLeft, 
  formatTime, 
  callAIService, 
  completeChallenge, 
  isProcessing 
}) => {
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    objective: '',
    tone: 'professionale'
  });

  const [currentChallenge, setCurrentChallenge] = useState<any>({});

  const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleToneChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, tone: value }));
  }, []);

  const generateEmail = useCallback(async () => {
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
  }, [formData, userProfile.role, callAIService, timeLeft]);

  if (currentChallenge.type === 'email') {
    return (
      <div className="prompt-lab-container">
        <div className="step-card max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">✨ La tua email è pronta!</h2>
            <p className="text-slate-300">L'AI ha generato una email professionale perfetta per il tuo obiettivo</p>
          </div>

          <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-6 mb-6">
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-mono text-sm">
              {currentChallenge.result}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">Tempo risparmiato</span>
              </div>
              <p className="text-green-200 text-2xl font-bold">~8 minuti</p>
              <p className="text-green-300 text-sm">Invece di scrivere da zero</p>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">Qualità</span>
              </div>
              <p className="text-blue-200 text-sm">✓ Tono appropriato<br/>✓ Struttura professionale<br/>✓ Call-to-action chiara</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-slate-300 mb-4 font-medium">⭐ Quanto useresti questa email? (1-10)</p>
            <div className="flex justify-center space-x-2">
              {[1,2,3,4,5,6,7,8,9,10].map(star => (
                <Star
                  key={star}
                  className="w-8 h-8 cursor-pointer text-yellow-400 hover:scale-110 transition-transform duration-200 hover:text-yellow-300"
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
            <p className="text-slate-400 text-sm mt-2">Clicca una stella per continuare</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prompt-lab-container">
      <div className="step-card max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">📧 Sfida 1/5: Email Smart</h2>
          <p className="text-slate-300">
            L'AI ti aiuterà a scrivere una email professionale in 30 secondi invece di 8+ minuti
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label className="text-slate-200 mb-3 block font-medium flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>Destinatario:</span>
              </Label>
              <Input
                type="text"
                className={inputBaseStyles}
                value={formData.recipient}
                onChange={handleInputChange('recipient')}
                placeholder="es. Cliente, Manager, Team..."
              />
            </div>

            <div>
              <Label className="text-slate-200 mb-3 block font-medium flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-green-400" />
                <span>Argomento:</span>
              </Label>
              <Input
                type="text"
                className={inputBaseStyles}
                value={formData.subject}
                onChange={handleInputChange('subject')}
                placeholder="es. Aggiornamento progetto, Proposta..."
              />
            </div>

            <div>
              <Label className="text-slate-200 mb-3 block font-medium flex items-center space-x-2">
                <Target className="w-4 h-4 text-yellow-400" />
                <span>Obiettivo:</span>
              </Label>
              <Input
                type="text"
                className={inputBaseStyles}
                value={formData.objective}
                onChange={handleInputChange('objective')}
                placeholder="es. Richiedere feedback, Proporre meeting..."
              />
            </div>

            <div>
              <Label className="text-slate-200 mb-3 block font-medium flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Tono desiderato:</span>
              </Label>
              <Select value={formData.tone} onValueChange={handleToneChange}>
                <SelectTrigger className={inputBaseStyles}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 border-slate-600/60 backdrop-blur-sm z-50">
                  <SelectItem value="formale" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">🎩 Formale</SelectItem>
                  <SelectItem value="amichevole" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">😊 Amichevole</SelectItem>
                  <SelectItem value="diretto" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">⚡ Diretto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
              <h3 className="text-blue-300 font-medium mb-2">💡 AI Tips</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Più specifico sei, migliore sarà il risultato</li>
                <li>• L'AI adatterà il linguaggio al tuo ruolo</li>
                <li>• Puoi sempre modificare l'email generata</li>
              </ul>
            </div>

            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
              <h3 className="text-green-300 font-medium mb-2">⚡ Risparmio tempo</h3>
              <div className="text-green-200 text-sm">
                <div className="flex justify-between">
                  <span>Manuale:</span>
                  <span>8+ minuti</span>
                </div>
                <div className="flex justify-between">
                  <span>Con AI:</span>
                  <span className="text-green-400 font-bold">30 secondi</span>
                </div>
                <hr className="border-green-700/50 my-2" />
                <div className="flex justify-between font-bold">
                  <span>Risparmi:</span>
                  <span className="text-green-400">93%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={generateEmail}
            disabled={!formData.recipient || !formData.subject || !formData.objective || isProcessing}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-4 px-8 text-lg font-semibold transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-48"
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
      </div>
    </div>
  );
});

EmailChallenge.displayName = 'EmailChallenge';

export default EmailChallenge;
