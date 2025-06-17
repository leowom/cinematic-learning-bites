
import React, { useEffect, useState } from 'react';
import { Award, Clock, Star, Zap } from 'lucide-react';

interface Props {
  startTime: number;
  totalScore: number;
  exerciseScores: number[];
  onComplete: (finalData: { score: number; xp: number; completionTime: number }) => void;
}

const FinalScoring: React.FC<Props> = ({ 
  startTime, 
  totalScore, 
  exerciseScores, 
  onComplete 
}) => {
  const [finalScore, setFinalScore] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [completionTime, setCompletionTime] = useState(0);

  useEffect(() => {
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - startTime) / 1000 / 60); // in minuti
    setCompletionTime(timeSpent);

    // Calcola score finale (media ponderata)
    const avgScore = exerciseScores.reduce((sum, score) => sum + score, 0) / exerciseScores.length;
    
    // Bonus tempo (massimo 20 punti)
    let timeBonus = 0;
    if (timeSpent <= 15) timeBonus = 20; // Velocissimo
    else if (timeSpent <= 30) timeBonus = 15; // Veloce
    else if (timeSpent <= 45) timeBonus = 10; // Normale
    else if (timeSpent <= 60) timeBonus = 5; // Lento

    const calculatedScore = Math.min(100, Math.round(avgScore * 20 + timeBonus)); // Scale 1-5 to 1-100
    setFinalScore(calculatedScore);

    // Calcola XP basato su score e tempo
    let baseXP = calculatedScore * 10; // 1000 XP massimi per qualità
    let speedMultiplier = 1;
    
    if (timeSpent <= 15) speedMultiplier = 1.5; // Bonus 50%
    else if (timeSpent <= 30) speedMultiplier = 1.3; // Bonus 30%
    else if (timeSpent <= 45) speedMultiplier = 1.1; // Bonus 10%

    const calculatedXP = Math.round(baseXP * speedMultiplier);
    setEarnedXP(calculatedXP);

    // Notifica il risultato dopo 2 secondi
    setTimeout(() => {
      onComplete({
        score: calculatedScore,
        xp: calculatedXP,
        completionTime: timeSpent
      });
    }, 2000);

  }, [startTime, exerciseScores, onComplete]);

  const getPerformanceLevel = () => {
    if (finalScore >= 90) return { level: "Esperto", color: "text-emerald-400", icon: "🏆" };
    if (finalScore >= 80) return { level: "Avanzato", color: "text-blue-400", icon: "⭐" };
    if (finalScore >= 70) return { level: "Intermedio", color: "text-yellow-400", icon: "📈" };
    return { level: "Principiante", color: "text-orange-400", icon: "🌱" };
  };

  const performance = getPerformanceLevel();

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-center">
      <div className="space-y-4">
        <Award className="w-16 h-16 text-yellow-400 mx-auto" />
        <h2 className="text-3xl font-bold text-white">Esercizio Completato!</h2>
        <p className="text-slate-300">Calcolo del punteggio finale in corso...</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Finale */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white">{finalScore}/100</div>
          <div className="text-sm text-slate-400">Score Finale</div>
          <div className={`text-lg font-medium ${performance.color} mt-2`}>
            {performance.icon} {performance.level}
          </div>
        </div>

        {/* Tempo */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6">
          <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white">{completionTime}</div>
          <div className="text-sm text-slate-400">Minuti</div>
          <div className="text-sm text-blue-300 mt-2">
            {completionTime <= 30 ? "⚡ Veloce!" : "⏱️ Buon ritmo"}
          </div>
        </div>

        {/* XP Guadagnati */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6">
          <Zap className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white">{earnedXP}</div>
          <div className="text-sm text-slate-400">XP Guadagnati</div>
          <div className="text-sm text-emerald-300 mt-2">
            💎 Esperienza Acquisita
          </div>
        </div>
      </div>

      {/* Breakdown Score */}
      <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Dettaglio Valutazione</h3>
        <div className="space-y-3">
          {exerciseScores.map((score, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-slate-300">Esercizio {index + 1}</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= score ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalScoring;
