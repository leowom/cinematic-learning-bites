
import React from 'react';
import { Brain, TrendingUp, Clock, Target } from 'lucide-react';
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
    <div className="step-card">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
      </div>

      <div className="space-y-4">
        {/* Quality Score */}
        <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm">Quality Score</span>
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold">{getQualityScore()}/100</span>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                getQualityScore() >= 80 ? "bg-emerald-500" :
                getQualityScore() >= 60 ? "bg-yellow-500" : "bg-orange-500"
              )}
              style={{ width: `${getQualityScore()}%` }}
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-white font-medium">Performance</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Completati:</span>
              <span className="text-white">{challengeResults.length}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tempo medio:</span>
              <span className="text-white">
                {challengeResults.length > 0 
                  ? `${Math.round(challengeResults.reduce((sum, r) => sum + r.completionTime, 0) / challengeResults.length)}s`
                  : '0s'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Soddisfazione:</span>
              <span className="text-green-400">
                {challengeResults.length > 0 
                  ? `${Math.round((challengeResults.filter(r => r.satisfied).length / challengeResults.length) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Tip */}
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">AI Coach</span>
          </div>
          <p className="text-blue-200 text-sm">{getEfficiencyTip()}</p>
        </div>

        {/* Profile Context */}
        <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Il tuo profilo</h4>
          <div className="space-y-1 text-sm">
            <div className="text-slate-300">
              <span className="text-slate-400">Ruolo:</span> {userProfile.role}
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">Focus:</span> {userProfile.currentChallenge?.slice(0, 50)}...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
