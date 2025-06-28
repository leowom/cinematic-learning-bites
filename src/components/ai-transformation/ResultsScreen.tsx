
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Share,
  ArrowRight,
  Award
} from 'lucide-react';
import GlassmorphismCard from '@/components/GlassmorphismCard';

interface ChallengeResult {
  aiResponse: string;
  userRating?: number;
  completionTime: number;
  satisfied: boolean;
}

interface ResultsScreenProps {
  challengeResults: ChallengeResult[];
  sessionStartTime: number;
}

const ResultsScreen: React.FC<ResultsScreenProps> = React.memo(({ 
  challengeResults, 
  sessionStartTime 
}) => {
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
});

ResultsScreen.displayName = 'ResultsScreen';

export default ResultsScreen;
