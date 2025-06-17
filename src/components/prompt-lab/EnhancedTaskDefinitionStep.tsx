
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Target, ArrowRight, Lightbulb, CheckCircle, AlertTriangle, Edit3 } from 'lucide-react';
import EnhancedAICoach from './EnhancedAICoach';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const EnhancedTaskDefinitionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [firstTask, setFirstTask] = useState('');
  const [secondTask, setSecondTask] = useState('');
  const [exerciseQuality, setExerciseQuality] = useState(0);
  const [canProceedExercise, setCanProceedExercise] = useState(false);

  // Esempi di task specifici (non selezionabili)
  const taskExamples = [
    {
      title: "Analisi Sentiment Email",
      description: "Analizza il sentiment dell'email del cliente (positivo/neutro/negativo) e identifica il livello di urgenza su scala 1-5",
      context: "Customer Service"
    },
    {
      title: "Categorizzazione Richieste",
      description: "Classifica la richiesta in: reclamo, informazione prodotto, supporto tecnico, rimborso o altro, con confidence score",
      context: "Help Desk"
    },
    {
      title: "Generazione Risposta Personalizzata",
      description: "Redigi risposta professionale ed empatica che riconosca il problema e offra soluzione concreta con timeline",
      context: "Customer Success"
    },
    {
      title: "Estrazione Dati Rilevanti",
      description: "Identifica: nome cliente, prodotto coinvolto, data acquisto, problema specifico e azioni già tentate",
      context: "Data Processing"
    },
    {
      title: "Proposta Next Steps",
      description: "Definisci 2-3 azioni specifiche da intraprendere con responsabile assegnato e deadline realistiche",
      context: "Project Management"
    }
  ];

  const handleFirstTaskChange = (text: string) => {
    setFirstTask(text);
    updatePromptData('firstTaskAttempt', text);
  };

  const handleSecondTaskChange = (text: string) => {
    setSecondTask(text);
    updatePromptData('userWrittenTasks', text);
  };

  const handleExerciseQuality = (score: number, canProceed: boolean) => {
    setExerciseQuality(score);
    setCanProceedExercise(canProceed);
  };

  const canProceed = firstTask.length > 20 && secondTask.length > 20 && canProceedExercise;

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <Target className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Definizione Task Specifici
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            I task definiscono cosa deve fare l'AI. Più specifici sono i task, più precisa sarà l'esecuzione. 
            Ogni task dovrebbe essere misurabile e actionable.
          </p>
        </div>

        {/* Esempi di Task Specifici */}
        <div className="section-spacing">
          <h3 className="text-slate-200 font-medium mb-4 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-blue-400" />
            💡 Esempi di Task Specifici Efficaci
          </h3>
          
          <div className="space-y-3">
            {taskExamples.map((example, index) => (
              <div key={index} className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-slate-200 font-medium text-sm">{example.title}</h4>
                  <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                    {example.context}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {example.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Teoria sui Task Efficaci */}
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 element-spacing">
          <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3 mb-3">
            <div className="flex items-center space-x-2 sub-element-spacing">
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-300 text-sm font-medium">Task Efficaci:</span>
            </div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Usano verbi d'azione specifici (analizza, identifica, proponi, redigi)</li>
              <li>• Includono parametri misurabili (scala 1-5, 2-3 opzioni, entro 24h)</li>
              <li>• Definiscono il formato output (lista, punteggio, testo strutturato)</li>
            </ul>
          </div>

          <div className="bg-rose-900/15 border border-rose-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 sub-element-spacing">
              <AlertTriangle className="w-4 h-4 text-rose-300" />
              <span className="text-rose-300 text-sm font-medium">Task Vaghi da Evitare:</span>
            </div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• "Aiutami con l'email" (troppo generico)</li>
              <li>• "Rispondi bene" (non misurabile)</li>
              <li>• "Sii professionale" (soggettivo)</li>
            </ul>
          </div>
        </div>

        {/* Primo Esercizio - Senza Feedback */}
        <div className="section-spacing">
          <div className="bg-orange-900/15 border border-orange-700/30 rounded-xl p-4">
            <h4 className="text-orange-300 font-medium flex items-center mb-3">
              <Edit3 className="w-4 h-4 mr-2" />
              📝 Esercizio 1: Prima Prova (Senza Feedback)
            </h4>
            <p className="text-orange-200 text-sm mb-3">
              Scrivi il tuo primo task specifico per il customer service. Non riceverai feedback per questo esercizio.
            </p>
            <textarea
              value={firstTask}
              onChange={(e) => handleFirstTaskChange(e.target.value)}
              placeholder="Esempio: Analizza il sentiment dell'email del cliente e identifica..."
              className="w-full bg-slate-800/60 border border-orange-600/50 rounded-lg p-3 text-slate-200 placeholder-slate-400 resize-none h-20 focus:border-orange-500 focus:outline-none text-sm"
              rows={3}
            />
          </div>
        </div>

        {/* Secondo Esercizio - Con Feedback */}
        {firstTask.length > 20 && (
          <div className="section-spacing">
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-xl p-4">
              <h4 className="text-emerald-300 font-medium flex items-center mb-3">
                <Edit3 className="w-4 h-4 mr-2" />
                ✅ Esercizio 2: Seconda Prova (Con Feedback AI)
              </h4>
              <p className="text-emerald-200 text-sm mb-3">
                Ora scrivi un secondo task specifico. Questa volta riceverai feedback dall'AI Coach per migliorare la qualità.
              </p>
              <textarea
                value={secondTask}
                onChange={(e) => handleSecondTaskChange(e.target.value)}
                placeholder="Esempio: Identifica la categoria principale della richiesta (reclamo/info/supporto) e proponi..."
                className="w-full bg-slate-800/60 border border-emerald-600/50 rounded-lg p-3 text-slate-200 placeholder-slate-400 resize-none h-20 focus:border-emerald-500 focus:outline-none text-sm"
                rows={3}
              />
              
              <EnhancedAICoach 
                userInput={secondTask} 
                context="tasks"
                onScoreChange={handleExerciseQuality}
                onRetryRequest={() => {
                  const textarea = document.querySelector('textarea:last-of-type') as HTMLTextAreaElement;
                  if (textarea) textarea.focus();
                }}
              />
            </div>
          </div>
        )}

        {/* Confronto e Apprendimento */}
        {firstTask.length > 20 && secondTask.length > 20 && (
          <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4 element-spacing">
            <h4 className="text-slate-200 font-medium mb-3">🔍 Confronto tra i Tuoi Task</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/40 rounded-lg p-3">
                <div className="text-slate-300 text-xs mb-2">Primo Task (senza feedback):</div>
                <div className="text-slate-200 text-sm">{firstTask}</div>
              </div>
              <div className="bg-slate-700/40 rounded-lg p-3">
                <div className="text-slate-300 text-xs mb-2">Secondo Task (con feedback):</div>
                <div className="text-slate-200 text-sm">{secondTask}</div>
              </div>
            </div>
            <div className="mt-3 p-2 bg-blue-900/20 rounded">
              <p className="text-blue-200 text-xs">
                💡 Nota la differenza: il feedback AI ti ha aiutato a rendere il secondo task più specifico e actionable!
              </p>
            </div>
          </div>
        )}

        {canProceed && (
          <div className="flex justify-end">
            <Button
              onClick={onComplete}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 flex items-center space-x-2"
            >
              <span>Procedi a Stile e Vincoli</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTaskDefinitionStep;
