
import React from 'react';
import { Brain, TrendingUp, Clock, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightsPanelProps {
  currentStep: number;
  userProfile: {
    name: string;
    role: string;
    currentChallenge: string;
  };
  challengeResults: any[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ 
  currentStep, 
  userProfile, 
  challengeResults 
}) => {
  const getQualityScore = () => {
    if (challengeResults.length === 0) return 0;
    const avgRating = challengeResults.reduce((sum, r) => sum + (r.userRating || 0), 0) / challengeResults.length;
    return Math.round(avgRating * 10);
  };

  const getEfficiencyTip = () => {
    const tips = [
      "💡 Tip: Sii specifico negli obiettivi per risultati migliori",
      "⚡ Tip: L'AI funziona meglio con contesto chiaro",
      "🎯 Tip: Prova diverse variazioni per ottimizzare",
      "📈 Tip: Monitora il feedback per migliorare",
      "✨ Tip: Combina creatività e precisione per eccellere"
    ];
    return tips[currentStep % tips.length];
  };

  return (
    <div className="step-card glassmorphism-base bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-white/20 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
          AI Insights
        </h3>
      </div>

      <div className="space-y-4">
        {/* Quality Score */}
        <div className="glass rounded-xl p-4 bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 text-sm font-medium">Quality Score</span>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Target className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-green-400 font-bold text-lg">{getQualityScore()}/100</span>
            </div>
          </div>
          <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-white/10">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500 relative",
                "bg-gradient-to-r",
                getQualityScore() >= 80 ? "from-emerald-500 to-green-400" :
                getQualityScore() >= 60 ? "from-yellow-500 to-amber-400" : "from-orange-500 to-red-400"
              )}
              style={{ width: `${getQualityScore()}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm"></div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="glass rounded-xl p-4 bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-white font-medium">Performance</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Completati:</span>
              <div className="glass rounded px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30">
                <span className="text-blue-300 font-medium">{challengeResults.length}/5</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Tempo medio:</span>
              <div className="glass rounded px-2 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30">
                <span className="text-green-300 font-medium">
                  {challengeResults.length > 0 
                    ? `${Math.round(challengeResults.reduce((sum, r) => sum + r.completionTime, 0) / challengeResults.length)}s`
                    : '0s'
                  }
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Soddisfazione:</span>
              <div className="glass rounded px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                <span className="text-yellow-300 font-medium">
                  {challengeResults.length > 0 
                    ? `${Math.round((challengeResults.filter(r => r.satisfied).length / challengeResults.length) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Tip */}
        <div className="glass rounded-xl p-4 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-blue-500/10 border border-blue-400/30">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center animate-pulse">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-blue-300 text-sm font-medium">AI Coach</span>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed">{getEfficiencyTip()}</p>
        </div>

        {/* Profile Context */}
        <div className="glass rounded-xl p-4 bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
          <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
            <span>Il tuo profilo</span>
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Ruolo:</span>
              <span className="text-slate-200 font-medium">{userProfile.role}</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block mb-1">Focus:</span>
              <span className="text-sm leading-relaxed">{userProfile.currentChallenge?.slice(0, 80)}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
