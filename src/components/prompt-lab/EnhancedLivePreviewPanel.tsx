
import React, { useMemo } from 'react';

interface Props {
  promptData: any;
}

const EnhancedLivePreviewPanel: React.FC<Props> = ({ promptData }) => {
  const qualityScore = useMemo(() => {
    let score = 0;
    if (promptData.role) score += 2;
    if (promptData.businessType) score += 1.5;
    if (promptData.context) score += 1.5;
    if (promptData.tasks?.length > 0) {
      score += Math.min(promptData.tasks.length * 0.8, 3);
    }
    if (promptData.tone) score += 1;
    if (promptData.outputFormat?.length > 0) score += 1;
    if (promptData.aiTestScore) score += promptData.aiTestScore * 0.1;
    
    return Math.min(score, 10);
  }, [promptData]);

  const complexity = useMemo(() => {
    return promptData.taskComplexity || 0;
  }, [promptData.taskComplexity]);

  const efficiency = useMemo(() => {
    if (complexity <= 6) return 95 - (complexity * 5);
    if (complexity <= 10) return 85 - (complexity * 3);
    return Math.max(40, 70 - (complexity * 2));
  }, [complexity]);

  const generatePromptPreview = () => {
    let prompt = '';
    
    // Solo se l'utente ha scritto il ruolo manualmente
    if (promptData.userWrittenRole) {
      prompt += `${promptData.userWrittenRole}\n\n`;
    }
    
    // Solo se l'utente ha scritto il contesto manualmente
    if (promptData.userWrittenContext) {
      prompt += `CONTESTO:\n${promptData.userWrittenContext}\n\n`;
    }
    
    // Solo se l'utente ha scritto i task manualmente
    if (promptData.userWrittenTasks) {
      prompt += `TASK:\n${promptData.userWrittenTasks}\n\n`;
    }
    
    // Solo se l'utente ha scritto il tone manualmente
    if (promptData.userWrittenTone) {
      prompt += `CONSTRAINTS:\n${promptData.userWrittenTone}\n\n`;
    }
    
    // Solo se l'utente ha scritto il formato manualmente
    if (promptData.userWrittenFormat) {
      prompt += `OUTPUT FORMAT:\n${promptData.userWrittenFormat}\n`;
    }
    
    return prompt || 'Il tuo prompt apparirà qui mentre completi gli esercizi di scrittura...';
  };

  const getQualityInsights = () => {
    const insights = [];
    
    if (promptData.userWrittenRole && promptData.userWrittenContext) {
      insights.push({
        type: 'success',
        message: 'Ruolo e contesto definiti chiaramente'
      });
    }
    
    if (promptData.userWrittenContext && promptData.userWrittenContext.length > 50) {
      insights.push({
        type: 'success',
        message: 'Contesto dettagliato e specifico'
      });
    }
    
    if (complexity > 10) {
      insights.push({
        type: 'warning',
        message: `Complessità alta (${complexity}/15) può ridurre efficienza`
      });
    }
    
    if (efficiency < 60) {
      insights.push({
        type: 'warning',
        message: 'Considera di semplificare i task'
      });
    }
    
    if (promptData.userWrittenTasks && promptData.userWrittenFormat) {
      insights.push({
        type: 'tip',
        message: 'Task e formato ben definiti migliorano le risposte'
      });
    }
    
    if (promptData.aiTestScore >= 8) {
      insights.push({
        type: 'success',
        message: `Test AI superato con ${promptData.aiTestScore}/10!`
      });
    }
    
    return insights;
  };

  return (
    <div className="sticky top-6 space-y-6">
      {/* Quality Score Card */}
      <div className="step-card glassmorphism-base">
        <h3 className="text-xl font-semibold text-white mb-4 relative z-10">
          🎯 Il Tuo Prompt
        </h3>
        
        {/* Quality & Efficiency Meters */}
        <div className="mb-4 relative z-10 space-y-3">
          <div className="flex justify-between items-center sub-element-spacing">
            <span className="text-white/70 text-sm">Quality Score</span>
            <span className={`font-bold ${qualityScore >= 8 ? 'text-green-400' : qualityScore >= 6 ? 'text-amber-400' : 'text-red-400'}`}>
              {qualityScore.toFixed(1)}/10
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

          {complexity > 0 && (
            <>
              <div className="flex justify-between items-center sub-element-spacing">
                <span className="text-white/70 text-sm">Complessità</span>
                <span className={`font-bold ${complexity <= 6 ? 'text-green-400' : complexity <= 10 ? 'text-amber-400' : 'text-red-400'}`}>
                  {complexity}/15
                </span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    complexity <= 6 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                    complexity <= 10 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                    'bg-gradient-to-r from-red-500 to-red-400'
                  }`}
                  style={{ width: `${Math.min((complexity / 15) * 100, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Efficienza</span>
                <span className={`font-bold ${efficiency >= 80 ? 'text-green-400' : efficiency >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                  {efficiency}%
                </span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    efficiency >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                    efficiency >= 60 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                    'bg-gradient-to-r from-red-500 to-red-400'
                  }`}
                  style={{ width: `${efficiency}%` }}
                />
              </div>
            </>
          )}
        </div>
        
        {/* Live prompt preview - solo quello scritto dall'utente */}
        <div className="bg-slate-800/60 border border-white/20 rounded-lg p-4 prompt-preview relative z-10">
          <pre className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">
            {generatePromptPreview()}
          </pre>
        </div>

        {/* Character count and estimated tokens */}
        <div className="mt-2 flex justify-between text-xs text-white/50 relative z-10">
          <span>Caratteri: {generatePromptPreview().length}</span>
          <span>~{Math.ceil(generatePromptPreview().length / 4)} tokens</span>
        </div>
      </div>
      
      {/* AI Insights Card */}
      <div className="step-card glassmorphism-base">
        <h3 className="text-xl font-semibold text-white mb-4 relative z-10">
          🤖 AI Insights
        </h3>
        
        <div className="space-y-3 relative z-10">
          {getQualityInsights().map((insight, index) => (
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
          
          {getQualityInsights().length === 0 && (
            <div className="text-center py-4">
              <p className="text-white/50 text-sm">
                Completa gli esercizi di scrittura per vedere il tuo prompt
              </p>
            </div>
          )}
        </div>
        
        {/* Progress hint */}
        <div className="mt-4 p-3 bg-slate-800/40 rounded-lg border border-white/10 relative z-10">
          <div className="text-white/60 text-xs sub-element-spacing">Prossimo esercizio:</div>
          <div className="text-white/80 text-sm">
            {!promptData.userWrittenRole ? 'Scrivi la definizione del ruolo' :
             !promptData.userWrittenContext ? 'Descrivi il contesto aziendale' :
             !promptData.userWrittenTasks ? 'Elenca i task specifici' :
             !promptData.userWrittenTone ? 'Definisci tone e constraints' :
             !promptData.userWrittenFormat ? 'Specifica il formato output' :
             'Prompt completo! Pronto per il testing'}
          </div>
        </div>

        {/* Performance Predictions */}
        {complexity > 0 && (
          <div className="mt-4 p-3 bg-slate-800/40 rounded-lg border border-white/10 relative z-10">
            <div className="text-white/60 text-xs sub-element-spacing">Performance stimata:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Velocità:</span>
                <span className={efficiency >= 80 ? 'text-green-400' : efficiency >= 60 ? 'text-amber-400' : 'text-red-400'}>
                  {efficiency >= 80 ? 'Veloce' : efficiency >= 60 ? 'Media' : 'Lenta'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Costo:</span>
                <span className={complexity <= 6 ? 'text-green-400' : complexity <= 10 ? 'text-amber-400' : 'text-red-400'}>
                  {complexity <= 6 ? 'Basso' : complexity <= 10 ? 'Medio' : 'Alto'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedLivePreviewPanel;
