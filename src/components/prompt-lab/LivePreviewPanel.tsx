
import React, { useMemo } from 'react';

interface Props {
  promptData: any;
}

const LivePreviewPanel: React.FC<Props> = ({ promptData }) => {
  const qualityScore = useMemo(() => {
    let score = 0;
    if (promptData.role) score += 2;
    if (promptData.businessType) score += 2;
    if (promptData.tasks?.length > 0) score += promptData.tasks.length;
    if (promptData.tone) score += 1;
    if (promptData.outputFormat?.length > 0) score += 2;
    return Math.min(score, 10);
  }, [promptData]);

  const generatePromptPreview = () => {
    let prompt = '';
    
    if (promptData.role) {
      prompt += `Sei un ${promptData.role}`;
      if (promptData.experience) {
        prompt += ` con ${promptData.experience} anni di esperienza`;
      }
      prompt += '.\n\n';
    }
    
    if (promptData.context) {
      prompt += `CONTESTO:\n${promptData.context}\n\n`;
    }
    
    if (promptData.tasks?.length > 0) {
      prompt += 'TASK:\n';
      promptData.tasks.forEach((task: string, index: number) => {
        prompt += `${index + 1}. ${task}\n`;
      });
      prompt += '\n';
    }
    
    if (promptData.tone) {
      prompt += 'CONSTRAINTS:\n';
      prompt += `- Tone: ${promptData.tone.formal > 60 ? 'Professionale' : 'Casual'} ${promptData.tone.empathy > 60 ? 'ed empatico' : 'e diretto'}\n`;
      prompt += '- Lunghezza: Concisa ma completa\n\n';
    }
    
    if (promptData.outputFormat?.length > 0) {
      prompt += 'OUTPUT FORMAT:\n';
      promptData.outputFormat.forEach((format: string) => {
        prompt += `${format}\n`;
      });
    }
    
    return prompt || 'Il tuo prompt apparirà qui mentre completi i step...';
  };

  const getAIInsights = () => {
    const insights = [];
    
    if (promptData.role && promptData.businessType) {
      insights.push({
        type: 'success',
        message: 'Role specifico migliora accuracy del 40%'
      });
    }
    
    if (promptData.context) {
      insights.push({
        type: 'success',
        message: 'Context business ben definito'
      });
    }
    
    if (!promptData.tasks || promptData.tasks.length < 3) {
      insights.push({
        type: 'warning',
        message: 'Aggiungi più task specifici per risultati migliori'
      });
    }
    
    if (promptData.tasks?.length >= 3) {
      insights.push({
        type: 'tip',
        message: 'Aggiungi esempi per output ancora migliore'
      });
    }
    
    return insights;
  };

  return (
    <div className="sticky top-6 space-y-6">
      {/* Quality Score Card */}
      <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
        
        <h3 className="text-xl font-semibold text-white mb-4 relative z-10">
          🎯 Il Tuo Prompt
        </h3>
        
        {/* Quality indicator */}
        <div className="mb-4 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70">Quality Score</span>
            <span className={`font-bold ${qualityScore >= 8 ? 'text-green-400' : qualityScore >= 6 ? 'text-amber-400' : 'text-red-400'}`}>
              {qualityScore}/10
            </span>
          </div>
          <div className="bg-slate-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                qualityScore >= 8 
                  ? 'bg-gradient-to-r from-green-500 to-green-400'
                  : qualityScore >= 6
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                  : 'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${(qualityScore / 10) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Live prompt preview */}
        <div className="bg-slate-800/60 border border-white/20 rounded-lg p-4 max-h-96 overflow-y-auto relative z-10">
          <pre className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">
            {generatePromptPreview()}
          </pre>
        </div>
      </div>
      
      {/* AI Insights Card */}
      <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
        
        <h3 className="text-xl font-semibold text-white mb-4 relative z-10">
          🤖 AI Insights
        </h3>
        
        <div className="space-y-3 relative z-10">
          {getAIInsights().map((insight, index) => (
            <div key={index} className="flex items-start">
              <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                insight.type === 'success' ? 'bg-green-400' :
                insight.type === 'warning' ? 'bg-amber-400' :
                'bg-blue-400'
              }`} />
              <p className="text-white/70 text-sm leading-relaxed">
                {insight.message}
              </p>
            </div>
          ))}
          
          {getAIInsights().length === 0 && (
            <div className="text-center py-4">
              <p className="text-white/50 text-sm">
                Completa i step per vedere insights personalizzati
              </p>
            </div>
          )}
        </div>
        
        {/* Progress hint */}
        <div className="mt-4 p-3 bg-slate-800/40 rounded-lg border border-white/10 relative z-10">
          <div className="text-white/60 text-xs mb-1">Prossimo miglioramento:</div>
          <div className="text-white/80 text-sm">
            {qualityScore < 4 ? 'Definisci il ruolo dell\'AI' :
             qualityScore < 6 ? 'Aggiungi contesto business' :
             qualityScore < 8 ? 'Specifica i task da svolgere' :
             'Ottimizza tone e format output'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreviewPanel;
