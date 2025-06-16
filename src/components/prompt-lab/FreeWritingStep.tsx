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
    if (!freeWrittenPrompt.trim()) {
      return {
        hasRole: false,
        hasContext: false,
        hasTasks: false,
        hasConstraints: false,
        hasFormat: false,
        length: 0,
        score: 0,
        qualityScore: 0,
        feedback: ['Nessun prompt inserito']
      };
    }

    const lowerPrompt = freeWrittenPrompt.toLowerCase();
    
    // Analisi più dettagliata
    const analysis = {
      hasRole: lowerPrompt.includes('sei un') || lowerPrompt.includes('you are') || lowerPrompt.includes('agisci come'),
      hasContext: lowerPrompt.includes('contesto') || lowerPrompt.includes('context') || lowerPrompt.includes('scenario') || lowerPrompt.includes('situazione'),
      hasTasks: lowerPrompt.includes('task') || lowerPrompt.includes('compito') || lowerPrompt.includes('devi') || lowerPrompt.includes('obiettivo'),
      hasConstraints: lowerPrompt.includes('constraint') || lowerPrompt.includes('tone') || lowerPrompt.includes('stile') || lowerPrompt.includes('modalità'),
      hasFormat: lowerPrompt.includes('format') || lowerPrompt.includes('struttura') || lowerPrompt.includes('output') || lowerPrompt.includes('risposta'),
      length: freeWrittenPrompt.length
    };

    // Calcolo score base
    const baseScore = (
      (analysis.hasRole ? 2 : 0) +
      (analysis.hasContext ? 2 : 0) +
      (analysis.hasTasks ? 3 : 0) +
      (analysis.hasConstraints ? 2 : 0) +
      (analysis.hasFormat ? 1 : 0)
    );

    // Analisi qualitativa aggiuntiva
    let qualityBonus = 0;
    const feedback = [];

    // Controllo specifico per customer service
    if (lowerPrompt.includes('customer') || lowerPrompt.includes('cliente') || lowerPrompt.includes('assistenza')) {
      qualityBonus += 0.5;
      feedback.push('✅ Contesto customer service identificato');
    }

    // Controllo per dettagli specifici
    if (lowerPrompt.includes('email') || lowerPrompt.includes('risposta') || lowerPrompt.includes('messaggio')) {
      qualityBonus += 0.5;
      feedback.push('✅ Tipo di comunicazione specificato');
    }

    // Controllo lunghezza appropriata
    if (analysis.length > 100 && analysis.length < 800) {
      qualityBonus += 0.5;
      feedback.push('✅ Lunghezza appropriata');
    } else if (analysis.length < 100) {
      feedback.push('⚠️ Prompt troppo breve - aggiungi più dettagli');
    } else {
      feedback.push('⚠️ Prompt molto lungo - considera di semplificare');
    }

    // Controllo per istruzioni specifiche
    if (lowerPrompt.includes('analizza') || lowerPrompt.includes('identifica') || lowerPrompt.includes('rispondi')) {
      qualityBonus += 0.5;
      feedback.push('✅ Istruzioni operative presenti');
    }

    // Feedback specifico per elementi mancanti
    if (!analysis.hasRole) {
      feedback.push('❌ Manca definizione del ruolo - inizia con "Sei un..."');
    }
    if (!analysis.hasContext) {
      feedback.push('❌ Manca contesto specifico - aggiungi informazioni sul business');
    }
    if (!analysis.hasTasks) {
      feedback.push('❌ Mancano task specifici - cosa deve fare esattamente l\'AI?');
    }
    if (!analysis.hasConstraints) {
      feedback.push('❌ Mancano constraints - specifica tone di voce e stile');
    }
    if (!analysis.hasFormat) {
      feedback.push('❌ Manca formato output - come deve strutturare la risposta?');
    }

    const finalScore = Math.min(10, baseScore + qualityBonus);
    const qualityScore = Math.round((finalScore / 10) * 100);

    return { 
      ...analysis, 
      score: finalScore, 
      qualityScore,
      feedback 
    };
  };

  const freePromptAnalysis = analyzeFreePrompt();
  const guidedPrompt = generateGuidedPrompt();

  // Confronto intelligente tra i due prompt
  const comparePrompts = () => {
    const freeWords = freeWrittenPrompt.toLowerCase().split(/\s+/).length;
    const guidedWords = guidedPrompt.toLowerCase().split(/\s+/).length;
    
    const comparison = {
      lengthDiff: freeWords - guidedWords,
      hasMoreDetail: freeWords > guidedWords * 1.2,
      hasLessDetail: freeWords < guidedWords * 0.8,
      similarLength: Math.abs(freeWords - guidedWords) < guidedWords * 0.2
    };

    return comparison;
  };

  const promptComparison = comparePrompts();

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
            {/* Free Prompt Analysis - Enhanced */}
            <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4">
              <h4 className="text-slate-200 font-medium sub-element-spacing flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>📊 Analisi Dettagliata del Tuo Prompt:</span>
              </h4>
              
              {/* Score principale */}
              <div className="bg-slate-700/40 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Score Qualità Generale:</span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-slate-600 rounded-full h-3 w-32">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          freePromptAnalysis.qualityScore >= 80 ? 'bg-emerald-400' : 
                          freePromptAnalysis.qualityScore >= 60 ? 'bg-orange-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${freePromptAnalysis.qualityScore}%` }}
                      />
                    </div>
                    <span className={`font-bold text-lg ${
                      freePromptAnalysis.qualityScore >= 80 ? 'text-emerald-400' : 
                      freePromptAnalysis.qualityScore >= 60 ? 'text-orange-400' : 'text-rose-400'
                    }`}>
                      {freePromptAnalysis.qualityScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Analisi dettagliata componenti */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Definizione Ruolo:</span>
                    <span className={freePromptAnalysis.hasRole ? 'text-emerald-400' : 'text-rose-400'}>
                      {freePromptAnalysis.hasRole ? '✅ Presente' : '❌ Mancante'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Contesto Business:</span>
                    <span className={freePromptAnalysis.hasContext ? 'text-emerald-400' : 'text-rose-400'}>
                      {freePromptAnalysis.hasContext ? '✅ Presente' : '❌ Mancante'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Task Specifici:</span>
                    <span className={freePromptAnalysis.hasTasks ? 'text-emerald-400' : 'text-rose-400'}>
                      {freePromptAnalysis.hasTasks ? '✅ Presente' : '❌ Mancante'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Constraints/Tone:</span>
                    <span className={freePromptAnalysis.hasConstraints ? 'text-emerald-400' : 'text-rose-400'}>
                      {freePromptAnalysis.hasConstraints ? '✅ Presente' : '❌ Mancante'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Output Format:</span>
                    <span className={freePromptAnalysis.hasFormat ? 'text-emerald-400' : 'text-rose-400'}>
                      {freePromptAnalysis.hasFormat ? '✅ Presente' : '❌ Mancante'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Score Numerico:</span>
                    <span className={`font-bold ${
                      freePromptAnalysis.score >= 8 ? 'text-emerald-400' : 
                      freePromptAnalysis.score >= 6 ? 'text-orange-400' : 'text-rose-400'
                    }`}>
                      {freePromptAnalysis.score.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              </div>

              {/* Feedback specifico */}
              <div className="bg-slate-700/30 rounded-lg p-3">
                <h5 className="text-slate-200 font-medium text-sm mb-2">Feedback Dettagliato:</h5>
                <div className="space-y-1">
                  {freePromptAnalysis.feedback.map((item, index) => (
                    <div key={index} className="text-slate-300 text-xs leading-relaxed">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Confronto Intelligente */}
            <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4">
              <h4 className="text-slate-200 font-medium sub-element-spacing">⚖️ Confronto Intelligente:</h4>
              <div className="space-y-3 text-sm">
                {promptComparison.hasMoreDetail && (
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400">💡</span>
                    <span className="text-slate-300">Il tuo prompt è più dettagliato del modello guidato - ottimo approfondimento!</span>
                  </div>
                )}
                {promptComparison.hasLessDetail && (
                  <div className="flex items-start space-x-2">
                    <span className="text-orange-400">⚠️</span>
                    <span className="text-slate-300">Il tuo prompt è più conciso - considera di aggiungere più dettagli specifici.</span>
                  </div>
                )}
                {promptComparison.similarLength && (
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-400">✅</span>
                    <span className="text-slate-300">Lunghezza simile al modello guidato - buon bilanciamento!</span>
                  </div>
                )}
                
                <div className="flex items-start space-x-2">
                  <span className="text-slate-400">📝</span>
                  <span className="text-slate-300">
                    Parole nel tuo prompt: <strong>{freeWrittenPrompt.split(/\s+/).length}</strong> | 
                    Parole nel modello: <strong>{guidedPrompt.split(/\s+/).length}</strong>
                  </span>
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
                <div className="mt-2 text-xs text-slate-400">
                  Score: {freePromptAnalysis.qualityScore}% - {
                    freePromptAnalysis.qualityScore >= 80 ? 'Eccellente!' :
                    freePromptAnalysis.qualityScore >= 60 ? 'Buono' : 'Da migliorare'
                  }
                </div>
              </div>

              <div>
                <h4 className="text-slate-200 font-medium sub-element-spacing">🎯 Versione Guidata:</h4>
                <div className="bg-slate-800/50 border border-emerald-700/30 rounded-lg p-4 prompt-preview">
                  <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {guidedPrompt || 'Completa gli step precedenti per vedere il prompt guidato...'}
                  </pre>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Modello di riferimento basato sui tuoi input
                </div>
              </div>
            </div>

            {/* Learning Insights - Enhanced */}
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-4">
              <h4 className="text-emerald-300 font-medium sub-element-spacing flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>🧠 Learning Insights Personalizzati:</span>
              </h4>
              <div className="text-slate-300 text-sm space-y-2">
                {freePromptAnalysis.qualityScore >= 80 && (
                  <p>🎉 <strong>Eccellente!</strong> Hai assimilato perfettamente i concetti di prompt engineering. Il tuo prompt include tutti gli elementi chiave e dimostra una comprensione approfondita della struttura.</p>
                )}
                {freePromptAnalysis.qualityScore >= 60 && freePromptAnalysis.qualityScore < 80 && (
                  <p>👍 <strong>Buon lavoro!</strong> Il tuo prompt ha una struttura solida e copre la maggior parte degli elementi essenziali. Considera di aggiungere più specifiche sui task o sul formato output.</p>
                )}
                {freePromptAnalysis.qualityScore < 60 && (
                  <p>📚 <strong>Continua a sperimentare!</strong> Il prompt ha potenziale ma necessita di più struttura. Focus su: definizione del ruolo, contesto specifico e task misurabili.</p>
                )}
                
                <p>💡 <strong>Osservazione:</strong> La sperimentazione libera consolida l'apprendimento e sviluppa intuizione per prompt engineering avanzato. Ogni tentativo migliora la tua capacità di strutturare istruzioni efficaci per l'AI.</p>
                
                {freePromptAnalysis.score > 7 && (
                  <p>🚀 <strong>Pronto per il livello successivo:</strong> Potresti sperimentare con tecniche avanzate come few-shot prompting o chain-of-thought reasoning.</p>
                )}
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
