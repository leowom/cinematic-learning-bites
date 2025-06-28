
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, User, Target, ArrowRight, Sparkles } from 'lucide-react';

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

const inputBaseStyles = "w-full bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 border border-white/20 text-slate-100 placeholder-slate-400 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-0 focus:outline-none transition-all duration-300 rounded-xl backdrop-blur-sm";

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
      <div className="step-card glassmorphism-base max-w-5xl mx-auto bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-white/20 backdrop-blur-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 relative">
            <Zap className="w-10 h-10 text-white relative z-10" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/50 to-green-400/50 blur-lg"></div>
          </div>
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
            ⚡ Benvenuto nel tuo AI Transformation
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed max-w-3xl mx-auto">
            Oggi farai 5 sfide rapide per scoprire come l'AI può rivoluzionare il tuo modo di lavorare. 
            Ogni sfida ti mostrerà tecniche pratiche che puoi usare immediatamente.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-10">
          <div className="space-y-6">
            <div>
              <Label className="text-slate-200 mb-4 block font-semibold flex items-center space-x-3 text-base">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span>Il tuo ruolo professionale:</span>
              </Label>
              <Select value={userProfile.role} onValueChange={handleRoleChange}>
                <SelectTrigger className={inputBaseStyles}>
                  <SelectValue placeholder="Seleziona il tuo ruolo" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-slate-800/95 via-slate-700/90 to-slate-800/95 border-white/20 backdrop-blur-sm z-50 rounded-xl">
                  <SelectItem value="manager" className="text-slate-200 focus:bg-gradient-to-r focus:from-blue-500/20 focus:to-purple-500/20 focus:text-slate-100 rounded-lg">👔 Manager</SelectItem>
                  <SelectItem value="developer" className="text-slate-200 focus:bg-gradient-to-r focus:from-blue-500/20 focus:to-purple-500/20 focus:text-slate-100 rounded-lg">💻 Developer</SelectItem>
                  <SelectItem value="marketing" className="text-slate-200 focus:bg-gradient-to-r focus:from-blue-500/20 focus:to-purple-500/20 focus:text-slate-100 rounded-lg">📢 Marketing</SelectItem>
                  <SelectItem value="sales" className="text-slate-200 focus:bg-gradient-to-r focus:from-blue-500/20 focus:to-purple-500/20 focus:text-slate-100 rounded-lg">💼 Sales</SelectItem>
                  <SelectItem value="hr" className="text-slate-200 focus:bg-gradient-to-r focus:from-blue-500/20 focus:to-purple-500/20 focus:text-slate-100 rounded-lg">👥 HR</SelectItem>
                  <SelectItem value="consultant" className="text-slate-200 focus:bg-gradient-to-r focus:from-blue-500/20 focus:to-purple-500/20 focus:text-slate-100 rounded-lg">🎯 Consultant</SelectItem>
                  <SelectItem value="entrepreneur" className="text-slate-200 focus:bg-gradient-to-r focus:from-blue-500/20 focus:to-purple-500/20 focus:text-slate-100 rounded-lg">🚀 Entrepreneur</SelectItem>
                  <SelectItem value="other" className="text-slate-200 focus:bg-gradient-to-r focus:from-blue-500/20 focus:to-purple-500/20 focus:text-slate-100 rounded-lg">🔧 Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-200 mb-4 block font-semibold flex items-center space-x-3 text-base">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                  <Target className="w-3 h-3 text-white" />
                </div>
                <span>Una sfida che stai affrontando:</span>
              </Label>
              <Textarea
                placeholder="Descrivi una sfida lavorativa concreta (es. 'Devo preparare una presentazione per il board', 'Analizzare i dati di vendita del trimestre', etc.)"
                className={`${inputBaseStyles} resize-none min-h-[140px]`}
                rows={5}
                value={userProfile.currentChallenge}
                onChange={handleChallengeChange}
              />
              <div className="text-sm text-slate-400 mt-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Più specifico sei, più l'AI potrà aiutarti con soluzioni mirate</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-8 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-green-500/10 border border-blue-400/30 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent flex items-center space-x-3">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <span>Cosa imparerai oggi:</span>
              </h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm mt-0.5">1</div>
                  <span className="leading-relaxed">Scrivere email professionali in 30 secondi</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm mt-0.5">2</div>
                  <span className="leading-relaxed">Analizzare dati e trovare insights</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm mt-0.5">3</div>
                  <span className="leading-relaxed">Generare idee creative per problemi</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-bold text-sm mt-0.5">4</div>
                  <span className="leading-relaxed">Creare piani d'azione strutturati</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold text-sm mt-0.5">5</div>
                  <span className="leading-relaxed">Preparare presentazioni persuasive</span>
                </li>
              </ul>
            </div>

            <div className="glass rounded-xl p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse"></div>
                <span className="text-amber-300 font-semibold">Tempo stimato</span>
              </div>
              <p className="text-amber-100 flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-2">
                  <span>⏱️</span>
                  <span>15-20 minuti totali</span>
                </span>
                <span className="text-amber-300">•</span>
                <span className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Risultati immediati</span>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={onStart}
            disabled={!userProfile.role || !userProfile.currentChallenge}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hover:from-blue-600 hover:via-purple-600 hover:to-green-600 text-white py-6 px-12 text-xl font-bold transition-all duration-300 rounded-2xl shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-green-400/50 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative flex items-center space-x-3">
              <ArrowRight className="w-6 h-6" />
              <span>INIZIA LE SFIDE AI</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
});

OnboardingScreen.displayName = 'OnboardingScreen';

export default OnboardingScreen;
