import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Target, ArrowRight, Lightbulb, CheckCircle, AlertTriangle, Edit3, Copy, Check } from 'lucide-react';
import EnhancedAICoach from './EnhancedAICoach';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const EnhancedTaskDefinitionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [userTask, setUserTask] = useState('');
  const [exerciseQuality, setExerciseQuality] = useState(0);
  const [canProceedExercise, setCanProceedExercise] = useState(false);
  const [copied, setCopied] = useState(false);

  // Esempi di task specifici (non selezionabili)
  const taskExamples = [
    {
      title: "Analisi Sentiment Email",
      description: "Analizza il sentiment dell'email del cliente (positivo/neutro/negativo) su scala 1-5, identifica la categoria principale della richiesta (reclamo/informazione/supporto tecnico/rimborso) con confidence score, poi genera una risposta professionale ed empatica di massimo 150 parole che riconosca il problema e offra una soluzione concreta con timeline realistiche entro 24-48 ore.",
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

  const exampleTask = "Analizza il sentiment dell'email del cliente su scala 1-5, identifica la categoria della richiesta (reclamo/info/supporto) e genera una risposta professionale di massimo 150 parole con timeline specifiche.";

  const handleUserTaskChange = (text: string) => {
    setUserTask(text);
    updatePromptData('userWrittenTasks', text);
  };

  const handleExerciseQuality = (score: number) => {
    setExerciseQuality(score);
    setCanProceedExercise(score >= 7);
    console.log('Exercise quality score:', score, 'Can proceed:', score >= 7);
  };

  const handleUseExample = () => {
    setUserTask(exampleTask);
    updatePromptData('userWrittenTasks', exampleTask);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canProceed = userTask.length > 20 && canProceedExercise;
  console.log('Can proceed check:', { 
    userTaskLength: userTask.length, 
    exerciseQuality, 
    canProceedExercise, 
    finalCanProceed: canProceed 
  });

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

        {/* Esercizio Pratico - Con Feedback */}
        <div className="section-spacing">
          <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-emerald-300 font-medium flex items-center">
                <Edit3 className="w-4 h-4 mr-2" />
                ✅ Esercizio Pratico: Scrivi il Tuo Task Specifico
              </h4>
              <Button
                onClick={handleUseExample}
                size="sm"
                className="bg-emerald-700/60 hover:bg-emerald-600/80 text-emerald-200 border border-emerald-600/50 text-xs px-3 py-1"
              >
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? 'Copiato!' : 'Utilizza Esempio'}
              </Button>
            </div>
            <p className="text-emerald-200 text-sm mb-3">
              Scrivi un task specifico per il customer service. Riceverai feedback dall'AI Coach per migliorare la qualità.
            </p>
            <textarea
              value={userTask}
              onChange={(e) => handleUserTaskChange(e.target.value)}
              placeholder="Esempio: Analizza il sentiment dell'email del cliente e identifica la categoria principale della richiesta..."
              className="w-full bg-slate-800/60 border border-emerald-600/50 rounded-lg p-3 text-slate-200 placeholder-slate-400 resize-none h-24 focus:border-emerald-500 focus:outline-none text-sm"
              rows={4}
            />
            
            <EnhancedAICoach 
              userInput={userTask} 
              context="tasks"
              onScoreChange={handleExerciseQuality}
              onRetryRequest={() => {
                const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                if (textarea) textarea.focus();
              }}
            />
          </div>
        </div>

        {/* Pulsante per proseguire - sempre visibile se può procedere */}
        <div className="flex justify-end section-spacing">
          <Button
            onClick={onComplete}
            disabled={!canProceed}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 border flex items-center space-x-2 ${
              canProceed 
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600' 
                : 'bg-slate-800/50 text-slate-500 border-slate-700/50 cursor-not-allowed'
            }`}
          >
            <span>Procedi a Stile e Vincoli</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTaskDefinitionStep;
