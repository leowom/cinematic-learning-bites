
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, User, Target, ArrowRight } from 'lucide-react';

interface UserProfile {
  name: string;
  role: string;
  currentChallenge: string;
}

interface OnboardingScreenProps {
  userProfile: UserProfile;
  onUserProfileChange: (profile: UserProfile) => void;
  onStart: () => void;
}

const inputBaseStyles = "w-full bg-slate-800/80 border border-slate-600/60 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-0 focus:outline-none transition-all duration-200 rounded-lg";

const OnboardingScreen: React.FC<OnboardingScreenProps> = React.memo(({ 
  userProfile, 
  onUserProfileChange, 
  onStart 
}) => {
  const handleRoleChange = useCallback((value: string) => {
    onUserProfileChange({ ...userProfile, role: value });
  }, [userProfile, onUserProfileChange]);

  const handleChallengeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onUserProfileChange({ ...userProfile, currentChallenge: value });
  }, [userProfile, onUserProfileChange]);

  return (
    <div className="prompt-lab-container">
      <div className="step-card max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">
            ⚡ Benvenuto nel tuo AI Transformation
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Oggi farai 5 sfide rapide per scoprire come l'AI può rivoluzionare il tuo modo di lavorare. 
            Ogni sfida ti mostrerà tecniche pratiche che puoi usare immediatamente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <Label className="text-slate-200 mb-3 block font-medium flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>Il tuo ruolo professionale:</span>
              </Label>
              <Select value={userProfile.role} onValueChange={handleRoleChange}>
                <SelectTrigger className={inputBaseStyles}>
                  <SelectValue placeholder="Seleziona il tuo ruolo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 border-slate-600/60 backdrop-blur-sm z-50">
                  <SelectItem value="manager" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">👔 Manager</SelectItem>
                  <SelectItem value="developer" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">💻 Developer</SelectItem>
                  <SelectItem value="marketing" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">📢 Marketing</SelectItem>
                  <SelectItem value="sales" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">💼 Sales</SelectItem>
                  <SelectItem value="hr" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">👥 HR</SelectItem>
                  <SelectItem value="consultant" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">🎯 Consultant</SelectItem>
                  <SelectItem value="entrepreneur" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">🚀 Entrepreneur</SelectItem>
                  <SelectItem value="other" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">🔧 Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-200 mb-3 block font-medium flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-400" />
                <span>Una sfida che stai affrontando:</span>
              </Label>
              <Textarea
                placeholder="Descrivi una sfida lavorativa concreta (es. 'Devo preparare una presentazione per il board', 'Analizzare i dati di vendita del trimestre', etc.)"
                className={`${inputBaseStyles} resize-none min-h-[120px]`}
                rows={4}
                value={userProfile.currentChallenge}
                onChange={handleChallengeChange}
              />
              <div className="text-xs text-slate-400 mt-2">
                💡 Più specifico sei, più l'AI potrà aiutarti con soluzioni mirate
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-900/30 to-green-900/30 border border-blue-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🎯 Cosa imparerai oggi:</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>Scrivere email professionali in 30 secondi</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 font-bold">2.</span>
                  <span>Analizzare dati e trovare insights</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold">3.</span>
                  <span>Generare idee creative per problemi</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-400 font-bold">4.</span>
                  <span>Creare piani d'azione strutturati</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-400 font-bold">5.</span>
                  <span>Preparare presentazioni persuasive</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-amber-300 font-medium text-sm">Tempo stimato</span>
              </div>
              <p className="text-amber-100 text-sm">⏱️ 15-20 minuti totali • 🚀 Risultati immediati</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={onStart}
            disabled={!userProfile.role || !userProfile.currentChallenge}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-4 px-8 text-lg font-semibold transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            INIZIA LE SFIDE AI
          </Button>
        </div>
      </div>
    </div>
  );
});

OnboardingScreen.displayName = 'OnboardingScreen';

export default OnboardingScreen;
