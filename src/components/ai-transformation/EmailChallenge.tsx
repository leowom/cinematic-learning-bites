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
  Palette,
  Sparkles,
  Clock
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

const inputBaseStyles = "w-full bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 border border-white/20 text-slate-100 placeholder-slate-400 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-0 focus:outline-none transition-all duration-300 rounded-xl backdrop-blur-sm";

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
        <div className="step-card glassmorphism-base max-w-5xl mx-auto bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-white/20 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br from-green-500 to-emerald-400 relative">
              <CheckCircle className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/50 to-emerald-400/50 blur-lg"></div>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent">
              ✨ La tua email è pronta!
            </h2>
            <p className="text-slate-300 text-lg">L'AI ha generato una email professionale perfetta per il tuo obiettivo</p>
          </div>

          <div className="glass rounded-2xl p-8 mb-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-mono text-sm bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-white/10">
              {currentChallenge.result}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-green-300 font-bold text-lg">Tempo risparmiato</span>
              </div>
              <p className="text-green-100 text-3xl font-bold mb-2">~8 minuti</p>
              <p className="text-green-300">Invece di scrivere da zero</p>
            </div>

            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-blue-300 font-bold text-lg">Qualità</span>
              </div>
              <div className="text-blue-200 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Tono appropriato</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Struttura professionale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Call-to-action chiara</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              ⭐ Quanto useresti questa email? (1-10)
            </h3>
            <div className="flex justify-center space-x-3">
              {[1,2,3,4,5,6,7,8,9,10].map(star => (
                <button
                  key={star}
                  className="group relative"
                  onClick={() => {
                    const result: ChallengeResult = {
                      aiResponse: currentChallenge.result,
                      userRating: star,
                      completionTime: currentChallenge.completionTime,
                      satisfied: star >= 7
                    };
                    completeChallenge(result);
                  }}
                >
                  <Star
                    className="w-10 h-10 text-yellow-400 hover:text-yellow-300 transition-all duration-200 group-hover:scale-110"
                    fill="currentColor"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-orange-400/50 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-sm mt-4 flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Clicca una stella per continuare</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prompt-lab-container">
      <div className="step-card glassmorphism-base max-w-4xl mx-auto bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-white/20 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br from-blue-500 to-cyan-400 relative">
            <Mail className="w-8 h-8 text-white relative z-10" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/50 to-cyan-400/50 blur-lg"></div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
            📧 Sfida 1/5: Email Smart
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            L'AI ti aiuterà a scrivere una email professionale in 30 secondi invece di 8+ minuti
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <Label className="text-slate-200 mb-4 block font-semibold flex items-center space-x-3 text-base">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
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
              <Label className="text-slate-200 mb-4 block font-semibold flex items-center space-x-3 text-base">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-3 h-3 text-white" />
                </div>
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
              <Label className="text-slate-200 mb-4 block font-semibold flex items-center space-x-3 text-base">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-400 flex items-center justify-center">
                  <Target className="w-3 h-3 text-white" />
                </div>
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
              <Label className="text-slate-200 mb-4 block font-semibold flex items-center space-x-3 text-base">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                  <Palette className="w-3 h-3 text-white" />
                </div>
                <span>Tono desiderato:</span>
              </Label>
              <Select value={formData.tone} onValueChange={handleToneChange}>
                <SelectTrigger className={inputBaseStyles}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-slate-800/95 via-slate-700/90 to-slate-800/95 border-white/20 backdrop-blur-sm z-50 rounded-xl">
                  <SelectItem value="formale" className="text-slate-200 focus:bg-gradient-to-r focus:from-blue-500/20 focus:to-purple-500/20 focus:text-slate-100 rounded-lg">🎩 Formale</SelectItem>
                  <SelectItem value="amichevole" className="text-slate-200 focus:bg-gradient-to-r focus:from-blue-500/20 focus:to-purple-500/20 focus:text-slate-100 rounded-lg">😊 Amichevole</SelectItem>
                  <SelectItem value="diretto" className="text-slate-200 focus:bg-gradient-to-r focus:from-blue-500/20 focus:to-purple-500/20 focus:text-slate-100 rounded-lg">⚡ Diretto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-blue-500/10 border border-blue-400/30 backdrop-blur-sm">
              <h3 className="text-blue-300 font-bold text-lg mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>AI Tips</span>
              </h3>
              <ul className="text-blue-200 space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Più specifico sei, migliore sarà il risultato</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <span>L'AI adatterà il linguaggio al tuo ruolo</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <span>Puoi sempre modificare l'email generata</span>
                </li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 backdrop-blur-sm">
              <h3 className="text-green-300 font-bold text-lg mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Risparmio tempo</span>
              </h3>
              <div className="text-green-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span>Manuale:</span>
                  <span className="text-red-300 font-semibold">8+ minuti</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Con AI:</span>
                  <span className="text-green-400 font-bold">30 secondi</span>
                </div>
                <hr className="border-green-600/50" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Risparmi:</span>
                  <span className="text-green-400">93%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button
            onClick={generateEmail}
            disabled={!formData.recipient || !formData.subject || !formData.objective || isProcessing}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hover:from-blue-600 hover:via-purple-600 hover:to-green-600 text-white py-6 px-12 text-xl font-bold transition-all duration-300 rounded-2xl shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative group min-w-64"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-green-400/50 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative flex items-center space-x-3">
              {isProcessing ? (
                <>
                  <Brain className="w-6 h-6 animate-spin" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  <span>GENERA EMAIL</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
});

EmailChallenge.displayName = 'EmailChallenge';

export default EmailChallenge;
