
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const FreeWritingStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [freeWrittenPrompt, setFreeWrittenPrompt] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const hints = [
    "💡 Inizia definendo il ruolo: 'Sei un...'",
    "🎯 Aggiungi contesto specifico del business",
    "📋 Elenca task specifici e misurabili",
    "⚖️ Definisci constraints e tone di voce",
    "📤 Specifica formato output desiderato"
  ];

  const generateGuidedPrompt = () => {
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
    
    return prompt;
  };

  const handleFreeWritingSubmit = () => {
    updatePromptData('freeWrittenPrompt', freeWrittenPrompt);
    setShowComparison(true);
  };

  const analyzeFreePrompt = () => {
    const analysis = {
      hasRole: freeWrittenPrompt.toLowerCase().includes('sei') || freeWrittenPrompt.toLowerCase().includes('you are'),
      hasContext: freeWrittenPrompt.includes('contesto') || freeWrittenPrompt.includes('context'),
      hasTasks: freeWrittenPrompt.includes('task') || freeWrittenPrompt.includes('compito'),
      hasConstraints: freeWrittenPrompt.includes('constraint') || freeWrittenPrompt.includes('tone'),
      hasFormat: freeWrittenPrompt.includes('format') || freeWrittenPrompt.includes('struttura'),
      length: freeWrittenPrompt.length
    };

    const score = (
      (analysis.hasRole ? 2 : 0) +
      (analysis.hasContext ? 2 : 0) +
      (analysis.hasTasks ? 3 : 0) +
      (analysis.hasConstraints ? 2 : 0) +
      (analysis.hasFormat ? 1 : 0)
    );

    return { ...analysis, score };
  };

  const freePromptAnalysis = analyzeFreePrompt();
  const guidedPrompt = generateGuidedPrompt();

  return (
    <div className="step-card glassmorphism-base">
      <h2 className="text-2xl font-semibold text-white mb-4 relative z-10">
        ✍️ STEP BONUS: Scrivi il TUO Prompt da Zero
      </h2>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-white/70 leading-relaxed element-spacing">
            Ora prova a scrivere un prompt completo usando quello che hai imparato. 
            Sperimentazione libera per consolidare l'apprendimento!
          </p>

          <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4 element-spacing">
            <h3 className="text-blue-400 font-medium sub-element-spacing">🎯 Sfida:</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Scrivi un prompt per gestire email di customer service per un'azienda e-commerce. 
              Includi tutti gli elementi che abbiamo visto nei step precedenti.
            </p>
          </div>
        </div>

        {/* Free Writing Area */}
        <div className="section-spacing">
          <label className="text-white/70 text-sm block sub-element-spacing">
            Il tuo prompt personalizzato:
          </label>
          <textarea
            value={freeWrittenPrompt}
            onChange={(e) => setFreeWrittenPrompt(e.target.value)}
            placeholder="Inizia scrivendo: 'Sei un...' e continua con il tuo prompt completo..."
            className="w-full bg-slate-700/60 border border-white/20 rounded-lg p-4 text-white placeholder-white/40 resize-none h-64"
            rows={12}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-white/50 text-xs">
              Caratteri: {freeWrittenPrompt.length}
            </span>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowHints(!showHints)}
                variant="outline"
                size="sm"
                className="text-white/60 border-white/20"
              >
                {showHints ? 'Nascondi' : 'Mostra'} Hints
              </Button>
              <Button
                onClick={handleFreeWritingSubmit}
                disabled={freeWrittenPrompt.length < 50}
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                Analizza Prompt
              </Button>
            </div>
          </div>
        </div>

        {/* Hints Section */}
        {showHints && (
          <div className="bg-slate-800/40 rounded-lg p-4 border border-white/10 section-spacing">
            <h4 className="text-white font-medium sub-element-spacing">💡 Hints Progressivi:</h4>
            <div className="space-y-2">
              {hints.map((hint, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span className="text-white/70 text-sm">{hint}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis and Comparison */}
        {showComparison && (
          <div className="space-y-6 section-spacing">
            {/* Free Prompt Analysis */}
            <div className="bg-slate-800/50 border border-white/20 rounded-lg p-4">
              <h4 className="text-white font-medium sub-element-spacing">📊 Analisi del Tuo Prompt:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Definizione Ruolo:</span>
                    <span className={freePromptAnalysis.hasRole ? 'text-green-400' : 'text-red-400'}>
                      {freePromptAnalysis.hasRole ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Contesto Business:</span>
                    <span className={freePromptAnalysis.hasContext ? 'text-green-400' : 'text-red-400'}>
                      {freePromptAnalysis.hasContext ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Task Specifici:</span>
                    <span className={freePromptAnalysis.hasTasks ? 'text-green-400' : 'text-red-400'}>
                      {freePromptAnalysis.hasTasks ? '✅' : '❌'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Constraints/Tone:</span>
                    <span className={freePromptAnalysis.hasConstraints ? 'text-green-400' : 'text-red-400'}>
                      {freePromptAnalysis.hasConstraints ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Output Format:</span>
                    <span className={freePromptAnalysis.hasFormat ? 'text-green-400' : 'text-red-400'}>
                      {freePromptAnalysis.hasFormat ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Score Totale:</span>
                    <span className={`font-bold ${freePromptAnalysis.score >= 8 ? 'text-green-400' : freePromptAnalysis.score >= 6 ? 'text-amber-400' : 'text-red-400'}`}>
                      {freePromptAnalysis.score}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Side by Side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium sub-element-spacing">✍️ Il Tuo Prompt:</h4>
                <div className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-4 prompt-preview">
                  <pre className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">
                    {freeWrittenPrompt || 'Nessun prompt scritto ancora...'}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium sub-element-spacing">🎯 Versione Guidata:</h4>
                <div className="bg-slate-800/50 border border-green-400/30 rounded-lg p-4 prompt-preview">
                  <pre className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">
                    {guidedPrompt || 'Completa gli step precedenti per vedere il prompt guidato...'}
                  </pre>
                </div>
              </div>
            </div>

            {/* Learning Insights */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 rounded-lg p-4">
              <h4 className="text-purple-400 font-medium sub-element-spacing">🧠 Learning Insights:</h4>
              <div className="text-white/80 text-sm space-y-2">
                {freePromptAnalysis.score >= 8 && (
                  <p>🎉 Eccellente! Hai assimilato bene i concetti di prompt engineering. Il tuo prompt include tutti gli elementi chiave.</p>
                )}
                {freePromptAnalysis.score >= 6 && freePromptAnalysis.score < 8 && (
                  <p>👍 Buon lavoro! Il tuo prompt ha una struttura solida. Considera di aggiungere più dettagli sui task specifici.</p>
                )}
                {freePromptAnalysis.score < 6 && (
                  <p>📚 Continua a sperimentare! Prova a includere più elementi strutturali per migliorare l'efficacia del prompt.</p>
                )}
                <p>💡 La sperimentazione libera consolida l'apprendimento e sviluppa intuizione per prompt engineering avanzato.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300"
          >
            Continua al Test Finale →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FreeWritingStep;
