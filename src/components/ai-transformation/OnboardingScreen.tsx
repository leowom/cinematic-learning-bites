
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap } from 'lucide-react';
import GlassmorphismCard from '@/components/GlassmorphismCard';

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

const inputBaseStyles = "w-full bg-slate-800/80 border border-slate-600/60 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-0 focus:outline-none transition-all duration-200";

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
          <Label className="text-slate-200 mb-2 block font-medium">Dimmi il tuo ruolo:</Label>
          <Select value={userProfile.role} onValueChange={handleRoleChange}>
            <SelectTrigger className={inputBaseStyles}>
              <SelectValue placeholder="Seleziona il tuo ruolo" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800/95 border-slate-600/60 backdrop-blur-sm z-50">
              <SelectItem value="manager" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">Manager</SelectItem>
              <SelectItem value="developer" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">Developer</SelectItem>
              <SelectItem value="marketing" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">Marketing</SelectItem>
              <SelectItem value="sales" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">Sales</SelectItem>
              <SelectItem value="hr" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">HR</SelectItem>
              <SelectItem value="consultant" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">Consultant</SelectItem>
              <SelectItem value="entrepreneur" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">Entrepreneur</SelectItem>
              <SelectItem value="other" className="text-slate-200 focus:bg-slate-700/80 focus:text-slate-100">Altro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-slate-200 mb-2 block font-medium">Una sfida che affronti questa settimana:</Label>
          <Textarea
            placeholder="Descrivi una sfida lavorativa che stai affrontando..."
            className={`${inputBaseStyles} resize-none min-h-[120px]`}
            rows={4}
            value={userProfile.currentChallenge}
            onChange={handleChallengeChange}
          />
        </div>

        <Button
          onClick={onStart}
          disabled={!userProfile.role || !userProfile.currentChallenge}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 text-lg font-semibold transition-all duration-200"
        >
          <Zap className="w-5 h-5 mr-2" />
          INIZIA LE SFIDE
        </Button>
      </div>
    </GlassmorphismCard>
  );
});

OnboardingScreen.displayName = 'OnboardingScreen';

export default OnboardingScreen;
