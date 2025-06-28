
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
  Target,
  Sparkles,
  Zap
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
    if (score >= 80) return 'from-emerald-400 to-green-500';
    if (score >= 60) return 'from-yellow-400 to-amber-500';
    return 'from-orange-400 to-red-500';
  };

  const getScoreBadge = () => {
    if (score >= 90) return { text: 'AI MASTER', color: 'from-yellow-400 via-orange-400 to-red-400', emoji: '👑' };
    if (score >= 75) return { text: 'AI EXPERT', color: 'from-blue-400 via-purple-400 to-pink-400', emoji: '🚀' };
    if (score >= 60) return { text: 'AI PRACTITIONER', color: 'from-green-400 via-blue-400 to-purple-400', emoji: '⭐' };
    return { text: 'AI EXPLORER', color: 'from-slate-400 via-slate-500 to-slate-600', emoji: '🔍' };
  };

  const badge = getScoreBadge();

  return (
    <div className="prompt-lab-container">
      <div className="step-card glassmorphism-base max-w-6xl mx-auto bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-white/20 backdrop-blur-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 relative">
            <Trophy className="w-12 h-12 text-white relative z-10" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-300/50 to-orange-400/50 blur-xl"></div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent">
            🎉 COMPLIMENTI!
          </h1>
          <h2 className="text-2xl font-semibold mb-4 text-slate-200">
            Hai completato il tuo primo giorno di AI mastery!
          </h2>
          <p className="text-slate-300 text-xl leading-relaxed max-w-4xl mx-auto">
            Hai appena scoperto il potere dell'AI applicata al lavoro quotidiano. Questi sono solo i primi passi di un viaggio che cambierà il tuo modo di lavorare.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          {/* Score Overview */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Il tuo punteggio
                  </h3>
                </div>
                <div className={`text-6xl font-bold mb-4 bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
                  {score}
                  <span className="text-3xl text-slate-400">/100</span>
                </div>
                <div className="relative w-full bg-slate-700/50 rounded-full h-4 mb-6 overflow-hidden border border-white/10">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${getScoreColor()} relative`}
                    style={{ width: `${score}%` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm"></div>
                </div>
                <div className={`inline-flex items-center space-x-3 bg-gradient-to-r ${badge.color} rounded-2xl px-6 py-3 text-slate-900 font-bold text-lg shadow-lg`}>
                  <span className="text-2xl">{badge.emoji}</span>
                  <span>{badge.text}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center glass rounded-lg p-3 bg-gradient-to-r from-white/5 to-white/0 border border-white/10">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Tempo totale:</span>
                  </span>
                  <span className="text-white font-bold">{Math.floor(totalTime/60)}:{(totalTime%60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between items-center glass rounded-lg p-3 bg-gradient-to-r from-white/5 to-white/0 border border-white/10">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Rating medio:</span>
                  </span>
                  <span className="text-yellow-400 font-bold">{avgRating.toFixed(1)}/10</span>
                </div>
                <div className="flex justify-between items-center glass rounded-lg p-3 bg-gradient-to-r from-white/5 to-white/0 border border-white/10">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Soddisfazione:</span>
                  </span>
                  <span className="text-green-400 font-bold">
                    {Math.round((challengeResults.filter(r => r.satisfied).length / challengeResults.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Value Generated */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">💰</span>
                </div>
                <span>VALORE GENERATO OGGI</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 backdrop-blur-sm">
                    <div className="text-green-300 font-bold mb-3 flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Tempo risparmiato</span>
                    </div>
                    <div className="text-4xl font-bold text-green-400 mb-2">~45 min</div>
                    <div className="text-green-200">Equivalente a €45-90 di lavoro</div>
                  </div>
                  
                  <div className="glass rounded-2xl p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 backdrop-blur-sm">
                    <div className="text-blue-300 font-bold mb-3 flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Produttività</span>
                    </div>
                    <div className="text-4xl font-bold text-blue-400 mb-2">+300%</div>
                    <div className="text-blue-200">Velocità di esecuzione media</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { color: 'bg-gradient-to-r from-green-400 to-emerald-400', text: 'Email professionale pronta per invio' },
                    { color: 'bg-gradient-to-r from-blue-400 to-cyan-400', text: 'Analisi dati con insight actionable' },
                    { color: 'bg-gradient-to-r from-yellow-400 to-orange-400', text: '5+ idee creative per problem solving' },
                    { color: 'bg-gradient-to-r from-purple-400 to-pink-400', text: 'Framework strutturato per decisioni' },
                    { color: 'bg-gradient-to-r from-pink-400 to-rose-400', text: 'Presentazione persuasiva e professionale' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <span className="text-slate-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="text-center mb-10">
          <div className={`bg-gradient-to-r ${badge.color} rounded-3xl p-8 mb-8 inline-block relative shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-3xl"></div>
            <div className="relative">
              <Award className="w-16 h-16 mx-auto mb-4 text-slate-900" />
              <h3 className="font-bold text-slate-900 text-2xl mb-2">🏅 BADGE SBLOCCATO</h3>
              <p className="text-slate-900 font-bold text-xl">[{badge.text} BADGE] {badge.emoji}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-slate-300 mb-4 font-semibold text-lg flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>PROGRESS DEL PERCORSO</span>
            </p>
            <div className="max-w-lg mx-auto">
              <div className="flex justify-between text-slate-400 mb-3">
                <span className="font-medium">Giorno 1</span>
                <span className="font-medium">Giorno 21</span>
              </div>
              <div className="relative">
                <Progress value={4.8} className="w-full h-6 bg-slate-700/50 border border-white/10 rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-sm"></div>
              </div>
              <p className="text-slate-400 mt-3">4.8% completato • 20 giorni rimanenti</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 mb-8 max-w-3xl mx-auto bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-green-500/10 border border-blue-400/30 backdrop-blur-sm">
            <div className="text-4xl mb-4">🔮</div>
            <h4 className="text-blue-300 font-bold text-xl mb-4">DOMANI TI ASPETTA:</h4>
            <p className="text-blue-200 text-lg leading-relaxed">
              Imparerai a <strong>scegliere lo strumento AI perfetto</strong> per ogni situazione e a costruire il tuo toolkit personale per massimizzare l'efficienza.
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-6">
          <Button className="glass bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 text-white px-8 py-4 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300">
            <Share className="w-5 h-5 mr-3" />
            CONDIVIDI RISULTATO
          </Button>
          <Button className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/50 to-purple-400/50 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative flex items-center space-x-3">
              <ArrowRight className="w-5 h-5" />
              <span className="font-bold">CONTINUA DOMANI</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
});

ResultsScreen.displayName = 'ResultsScreen';

export default ResultsScreen;
