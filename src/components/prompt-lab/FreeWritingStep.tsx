
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, TrendingUp, Target, Brain, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';

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
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <Edit3 className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          STEP BONUS: Scrivi il TUO Prompt da Zero
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            Ora prova a scrivere un prompt completo usando quello che hai imparato. 
            Sperimentazione libera per consolidare l'apprendimento!
          </p>

          <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-4 element-spacing">
            <h3 className="text-emerald-300 font-medium sub-element-spacing flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>🎯 Sfida:</span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Scrivi un prompt per gestire email di customer service per un'azienda e-commerce. 
              Includi tutti gli elementi che abbiamo visto nei step precedenti.
            </p>
          </div>
        </div>

        {/* Free Writing Area */}
        <div className="section-spacing">
          <label className="text-slate-200 font-medium sub-element-spacing block">
            Il tuo prompt personalizzato:
          </label>
          <textarea
            value={freeWrittenPrompt}
            onChange={(e) => setFreeWrittenPrompt(e.target.value)}
            placeholder="Inizia scrivendo: 'Sei un...' e continua con il tuo prompt completo..."
            className="w-full bg-slate-700/60 border border-slate-600/50 rounded-lg p-4 text-slate-200 placeholder-slate-400 resize-none h-64 focus:border-slate-500 focus:outline-none"
            rows={12}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-slate-400 text-xs">
              Caratteri: {freeWrittenPrompt.length}
            </span>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowHints(!showHints)}
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700/60"
              >
                {showHints ? 'Nascondi' : 'Mostra'} Hints
              </Button>
              <Button
                onClick={handleFreeWritingSubmit}
                disabled={freeWrittenPrompt.length < 50}
                className="bg-emerald-700 hover:bg-emerald-600 text-slate-200 border border-emerald-600"
              >
                Analizza Prompt
              </Button>
            </div>
          </div>
        </div>

        {/* Hints Section */}
        {showHints && (
          <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/40 section-spacing">
            <h4 className="text-slate-200 font-medium sub-element-spacing flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span>💡 Hints Progressivi:</span>
            </h4>
            <div className="space-y-2">
              {hints.map((hint, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-emerald-400 mr-2">•</span>
                  <span className="text-slate-300 text-sm">{hint}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis and Comparison */}
        {showComparison && (
          <div className="space-y-6 section-spacing">
            {/* Free Prompt Analysis */}
            <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4">
              <h4 className="text-slate-200 font-medium sub-element-spacing flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>📊 Analisi del Tuo Prompt:</span>
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Definizione Ruolo:</span>
                    <span className={freePromptAnalysis.hasRole ? 'text-emerald-400' : 'text-rose-400'}>
                      {freePromptAnalysis.hasRole ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Contesto Business:</span>
                    <span className={freePromptAnalysis.hasContext ? 'text-emerald-400' : 'text-rose-400'}>
                      {freePromptAnalysis.hasContext ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Task Specifici:</span>
                    <span className={freePromptAnalysis.hasTasks ? 'text-emerald-400' : 'text-rose-400'}>
                      {freePromptAnalysis.hasTasks ? '✅' : '❌'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Constraints/Tone:</span>
                    <span className={freePromptAnalysis.hasConstraints ? 'text-emerald-400' : 'text-rose-400'}>
                      {freePromptAnalysis.hasConstraints ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Output Format:</span>
                    <span className={freePromptAnalysis.hasFormat ? 'text-emerald-400' : 'text-rose-400'}>
                      {freePromptAnalysis.hasFormat ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Score Totale:</span>
                    <span className={`font-bold ${freePromptAnalysis.score >= 8 ? 'text-emerald-400' : freePromptAnalysis.score >= 6 ? 'text-orange-400' : 'text-rose-400'}`}>
                      {freePromptAnalysis.score}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Side by Side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-slate-200 font-medium sub-element-spacing">✍️ Il Tuo Prompt:</h4>
                <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 prompt-preview">
                  <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {freeWrittenPrompt || 'Nessun prompt scritto ancora...'}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-slate-200 font-medium sub-element-spacing">🎯 Versione Guidata:</h4>
                <div className="bg-slate-800/50 border border-emerald-700/30 rounded-lg p-4 prompt-preview">
                  <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {guidedPrompt || 'Completa gli step precedenti per vedere il prompt guidato...'}
                  </pre>
                </div>
              </div>
            </div>

            {/* Learning Insights */}
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-4">
              <h4 className="text-emerald-300 font-medium sub-element-spacing flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>🧠 Learning Insights:</span>
              </h4>
              <div className="text-slate-300 text-sm space-y-2">
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
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 flex items-center space-x-2"
          >
            <span>Continua al Test Finale</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FreeWritingStep;
