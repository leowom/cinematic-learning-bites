
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Timer, 
  Star,
  Zap,
  CheckCircle,
  Brain
} from 'lucide-react';
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

interface EmailChallengeProps {
  userProfile: UserProfile;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  callAIService: (prompt: string, challengeType: string) => Promise<string>;
  completeChallenge: (result: ChallengeResult) => void;
  isProcessing: boolean;
}

const inputBaseStyles = "w-full bg-slate-800/80 border border-slate-600/60 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-0 focus:outline-none transition-all duration-200";

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
          <Label className="text-slate-200 mb-2 block font-medium">Destinatario:</Label>
          <Input
            type="text"
            className={inputBaseStyles}
            value={formData.recipient}
            onChange={handleInputChange('recipient')}
            placeholder="es. Cliente, Manager, Team..."
          />
        </div>

        <div>
          <Label className="text-slate-200 mb-2 block font-medium">Argomento:</Label>
          <Input
            type="text"
            className={inputBaseStyles}
            value={formData.subject}
            onChange={handleInputChange('subject')}
            placeholder="es. Aggiornamento progetto, Proposta..."
          />
        </div>

        <div>
          <Label className="text-slate-200 mb-2 block font-medium">Obiettivo:</Label>
          <Input
            type="text"
            className={inputBaseStyles}
            value={formData.objective}
            onChange={handleInputChange('objective')}
            placeholder="es. Richiedere feedback, Proporre meeting..."
          />
        </div>

        <div>
          <Label className="text-slate-200 mb-2 block font-medium">Tono desiderato:</Label>
          <Select value={formData.tone} onValueChange={handleToneChange}>
            <SelectTrigger className={inputBaseStyles}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800/95 border-slate-600/60 backdrop-blur-sm z-50">
              <SelectItem value="formale" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">Formale</SelectItem>
              <SelectItem value="amichevole" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">Amichevole</SelectItem>
              <SelectItem value="diretto" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">Diretto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={generateEmail}
          disabled={!formData.recipient || !formData.subject || !formData.objective || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg transition-all duration-200"
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
});

EmailChallenge.displayName = 'EmailChallenge';

export default EmailChallenge;
