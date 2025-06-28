
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Share,
  ArrowRight,
  Award,
  TrendingUp,
  Clock,
  Star,
  Target
} from 'lucide-react';

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
  
  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreBadge = () => {
    if (score >= 90) return { text: 'AI MASTER', color: 'from-yellow-400 to-orange-400', emoji: '👑' };
    if (score >= 75) return { text: 'AI EXPERT', color: 'from-blue-400 to-purple-400', emoji: '🚀' };
    if (score >= 60) return { text: 'AI PRACTITIONER', color: 'from-green-400 to-blue-400', emoji: '⭐' };
    return { text: 'AI EXPLORER', color: 'from-slate-400 to-slate-600', emoji: '🔍' };
  };

  const badge = getScoreBadge();

  return (
    <div className="prompt-lab-container">
      <div className="step-card max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-6">
            <Trophy className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            🎉 COMPLIMENTI! Hai completato il tuo primo giorno di AI mastery!
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Hai appena scoperto il potere dell'AI applicata al lavoro quotidiano. Questi sono solo i primi passi di un viaggio che cambierà il tuo modo di lavorare.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Score Overview */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Target className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Il tuo punteggio</h3>
                </div>
                <div className={`text-5xl font-bold mb-2 ${getScoreColor()}`}>
                  {score}
                  <span className="text-2xl">/100</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      score >= 80 ? 'bg-emerald-500' :
                      score >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${badge.color} rounded-full px-4 py-2 text-slate-900 font-bold`}>
                  <span>{badge.emoji}</span>
                  <span>{badge.text}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Tempo totale:</span>
                  </span>
                  <span className="text-white font-semibold">{Math.floor(totalTime/60)}:{(totalTime%60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Rating medio:</span>
                  </span>
                  <span className="text-yellow-400 font-semibold">{avgRating.toFixed(1)}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Soddisfazione:</span>
                  </span>
                  <span className="text-green-400 font-semibold">
                    {Math.round((challengeResults.filter(r => r.satisfied).length / challengeResults.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Value Generated */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs">💰</span>
                </div>
                <span>VALORE GENERATO OGGI</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                    <div className="text-green-300 font-medium mb-2">⏱️ Tempo risparmiato</div>
                    <div className="text-2xl font-bold text-green-400">~45 minuti</div>
                    <div className="text-green-200 text-sm">Equivalente a €45-90 di lavoro</div>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                    <div className="text-blue-300 font-medium mb-2">📈 Produttività</div>
                    <div className="text-2xl font-bold text-blue-400">+300%</div>
                    <div className="text-blue-200 text-sm">Velocità di esecuzione media</div>
                  </div>
                </div>

                <div className="space-y-3 text-slate-300 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Email professionale pronta per invio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Analisi dati con insight actionable</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>5+ idee creative per problem solving</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Framework strutturato per decisioni</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span>Presentazione persuasiva e professionale</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="text-center mb-8">
          <div className={`bg-gradient-to-r ${badge.color} rounded-2xl p-6 mb-6 inline-block`}>
            <Award className="w-12 h-12 mx-auto mb-3 text-slate-900" />
            <h3 className="font-bold text-slate-900 text-xl">🏅 BADGE SBLOCCATO</h3>
            <p className="text-slate-900 font-semibold text-lg">[{badge.text} BADGE] {badge.emoji}</p>
          </div>

          <div className="mb-6">
            <p className="text-slate-300 mb-3 font-medium">📈 PROGRESS DEL PERCORSO</p>
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Giorno 1</span>
                <span>Giorno 21</span>
              </div>
              <Progress value={4.8} className="w-full h-4 bg-slate-700" />
              <p className="text-slate-400 text-sm mt-2">4.8% completato • 20 giorni rimanenti</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
            <div className="text-2xl mb-2">🔮</div>
            <h4 className="text-blue-300 font-bold mb-2">DOMANI TI ASPETTA:</h4>
            <p className="text-blue-200">
              Imparerai a <strong>scegliere lo strumento AI perfetto</strong> per ogni situazione e a costruire il tuo toolkit personale per massimizzare l'efficienza.
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl">
            <Share className="w-4 h-4 mr-2" />
            CONDIVIDI RISULTATO
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl">
            <ArrowRight className="w-4 h-4 mr-2" />
            CONTINUA DOMANI
          </Button>
        </div>
      </div>
    </div>
  );
});

ResultsScreen.displayName = 'ResultsScreen';

export default ResultsScreen;
