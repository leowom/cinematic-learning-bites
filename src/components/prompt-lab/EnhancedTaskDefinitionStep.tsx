import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

interface TaskDefinition {
  id: string;
  label: string;
  description: string;
  specificPrompt: string;
  complexity: number;
  impact: string;
}

const EnhancedTaskDefinitionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>(promptData.tasks || []);
  const [showComplexityWarning, setShowComplexityWarning] = useState(false);

  const availableTasks: TaskDefinition[] = [
    {
      id: 'sentiment',
      label: 'Analisi Sentiment Avanzata',
      description: 'Valuta emozioni e tono del cliente',
      specificPrompt: 'Analizza il sentiment dell\'email su scala 1-5 (1=molto negativo, 5=molto positivo). Identifica parole chiave emotive specifiche (es: "furioso", "deluso", "soddisfatto") e categorizza il tono emotivo (frustrato/preoccupato/neutro/soddisfatto/entusiasta).',
      complexity: 2,
      impact: 'Migliora personalizzazione risposta +40%'
    },
    {
      id: 'urgency',
      label: 'Valutazione Urgenza Precisa',
      description: 'Determina priorità con criteri oggettivi',
      specificPrompt: 'Valuta urgenza da 1-5 basandoti su: timeline menzionati (1 giorno=5, >1 settimana=1), parole di urgenza ("subito", "immediato"=+2 punti), valore ordine (>€500=+1 punto), status cliente (VIP=+1 punto). Specifica il motivo del punteggio.',
      complexity: 3,
      impact: 'Riduce tempi escalation -50%'
    },
    {
      id: 'category',
      label: 'Categorizzazione Intelligente',
      description: 'Classifica tipo richiesta con confidence',
      specificPrompt: 'Categorizza richiesta in: FAQ (informazioni generali), Supporto Tecnico (problemi prodotto), Reclamo (insoddisfazione), Vendite (interesse acquisto), Billing (questioni pagamento). Indica confidence level (%) e keywords che hanno determinato la categoria.',
      complexity: 2,
      impact: 'Ottimizza routing automatico +65%'
    },
    {
      id: 'response',
      label: 'Generazione Risposta Completa',
      description: 'Crea risposta personalizzata e actionable',
      specificPrompt: 'Genera risposta completa che: 1) Usa il nome del cliente, 2) Riconosce specificamente il problema, 3) Offre soluzione concreta con timeline, 4) Include next steps chiari, 5) Mantiene tone appropriato al sentiment rilevato, 6) Rispetta policy aziendali.',
      complexity: 4,
      impact: 'Aumenta customer satisfaction +55%'
    },
    {
      id: 'extraction',
      label: 'Estrazione Dati Strutturati',
      description: 'Identifica informazioni chiave per CRM',
      specificPrompt: 'Estrai e struttura: numero ordine (#XXXXX), prodotto/servizio menzionato, importo (se presente), data evento, contact preference (email/telefono), riferimenti precedenti. Formato output: JSON con campi standardizzati.',
      complexity: 3,
      impact: 'Automatizza data entry +80%'
    },
    {
      id: 'escalation',
      label: 'Logic Escalation Intelligente',
      description: 'Identifica quando serve intervento umano',
      specificPrompt: 'Valuta necessità escalation basandoti su: complessità tecnica (>3/5), valore monetario (>€1000), sentiment molto negativo (<2/5), richiesta refund >€500, menzione legale/avvocato, cliente VIP. Se escalation necessaria, specifica motivo e urgenza.',
      complexity: 4,
      impact: 'Riduce errori gestione -30%'
    }
  ];

  const calculateComplexity = () => {
    return selectedTasks.reduce((total, taskId) => {
      const task = availableTasks.find(t => t.id === taskId);
      return total + (task?.complexity || 0);
    }, 0);
  };

  const calculateEfficiency = () => {
    const complexity = calculateComplexity();
    if (complexity <= 6) return 95 - (complexity * 5); // Optimal zone
    if (complexity <= 10) return 85 - (complexity * 3); // Good zone
    return Math.max(40, 70 - (complexity * 2)); // Diminishing returns
  };

  const handleTaskToggle = (taskId: string) => {
    const newTasks = selectedTasks.includes(taskId)
      ? selectedTasks.filter(id => id !== taskId)
      : [...selectedTasks, taskId];
    
    setSelectedTasks(newTasks);
    
    // Generate specific prompt sections
    const specificPrompts = newTasks.map(id => {
      const task = availableTasks.find(t => t.id === id);
      return task?.specificPrompt || '';
    });
    
    updatePromptData('tasks', specificPrompts);
    updatePromptData('taskComplexity', calculateComplexity());
    
    // Show warning if complexity gets too high
    const newComplexity = newTasks.reduce((total, id) => {
      const task = availableTasks.find(t => t.id === id);
      return total + (task?.complexity || 0);
    }, 0);
    
    setShowComplexityWarning(newComplexity > 10);
  };

  const generateTaskSummary = () => {
    const taskNames = selectedTasks.map(id => {
      const task = availableTasks.find(t => t.id === id);
      return task?.label.split(' ')[0].toLowerCase();
    });
    
    return `Esegui ${taskNames.join(', ')} con criteri specifici e metriche precise, fornendo output strutturato e actionable.`;
  };

  const complexity = calculateComplexity();
  const efficiency = calculateEfficiency();

  return (
    <div className="step-card glassmorphism-base">
      <h2 className="text-2xl font-semibold text-white element-spacing relative z-10">
        🎯 STEP 4/9: Task Specifici e Misurabili
      </h2>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-white/80 leading-relaxed element-spacing">
            Seleziona i compiti che l'AI deve svolgere. Ogni task ha specifiche precise e metriche misurabili.
          </p>

          <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4 element-spacing">
            <h4 className="text-blue-400 font-medium sub-element-spacing">🧠 PERCHÉ PIÙ TASK = PIÙ COMPLESSITÀ?</h4>
            <div className="text-white/80 text-sm leading-relaxed space-y-2">
              <p><strong>Cognitive Load:</strong> Ogni task aggiuntivo richiede all'AI di processare più informazioni simultaneamente, come chiedere a una persona di fare 6 cose contemporaneamente.</p>
              <p><strong>Context Switching:</strong> L'AI deve "saltare" mentalmente tra diversi tipi di analisi (sentiment → urgenza → categorizzazione), perdendo focus.</p>
              <p><strong>Output Conflicts:</strong> Task multipli possono generare istruzioni contraddittorie (es: "sii conciso" + "includi tutti i dettagli").</p>
              <p><strong>Quality Degradation:</strong> Oltre 6-8 task, la precisione diminuisce perché l'AI non riesce a mantenere la qualità su tutti i fronti.</p>
            </div>
          </div>

          {/* Complexity vs Efficiency Meter */}
          <div className="bg-slate-800/40 rounded-lg p-4 border border-white/10 element-spacing">
            <div className="flex justify-between items-center sub-element-spacing">
              <span className="text-white/70 text-sm">Complessità Task</span>
              <span className="text-white font-medium">{complexity}/15</span>
            </div>
            <div className="complexity-meter">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  complexity <= 6 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                  complexity <= 10 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                  'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                style={{ width: `${Math.min((complexity / 15) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-white/60 text-xs">Efficienza Stimata:</span>
              <span className={`font-bold ${efficiency >= 80 ? 'text-green-400' : efficiency >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                {efficiency}%
              </span>
            </div>
          </div>

          {/* Efficiency Warning */}
          {showComplexityWarning && (
            <div className="efficiency-warning">
              <h4 className="text-amber-400 font-medium sub-element-spacing">⚠️ Attenzione Complessità!</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                Troppi task possono ridurre l'efficienza. I prompt complessi tendono a confondere l'AI e produrre output meno precisi. 
                Considera di limitarti ai task più importanti per il tuo use case.
              </p>
            </div>
          )}

          {/* Optimal Zone Indicator */}
          {complexity >= 4 && complexity <= 6 && (
            <div className="optimal-zone">
              <h4 className="text-green-400 font-medium sub-element-spacing">✨ Zona Ottimale!</h4>
              <p className="text-white/80 text-sm">
                Perfetto bilanciamento tra funzionalità e efficienza. Questo livello di complessità offre il miglior rapporto qualità/performance.
              </p>
            </div>
          )}
        </div>

        {/* Task Selection */}
        <div className="section-spacing">
          <h3 className="text-white font-medium sub-element-spacing">Seleziona Task Specifici:</h3>
          <div className="space-y-3">
            {availableTasks.map((task) => (
              <label
                key={task.id}
                className="flex items-start bg-slate-800/40 rounded-lg p-4 border border-white/10 hover:bg-slate-700/60 cursor-pointer transition-all duration-200 group"
              >
                <input
                  type="checkbox"
                  className="mr-3 mt-1 accent-green-500"
                  checked={selectedTasks.includes(task.id)}
                  onChange={() => handleTaskToggle(task.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between sub-element-spacing">
                    <span className="text-white font-medium">{task.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 text-xs px-2 py-1 bg-blue-400/20 rounded-full">
                        Complexity: {task.complexity}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm sub-element-spacing">{task.description}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 sub-element-spacing">
                    <span className="text-white/50 text-xs">Prompt specifico:</span>
                    <p className="text-white/80 text-xs mt-1 leading-relaxed">{task.specificPrompt}</p>
                  </div>
                  <span className="text-green-400/80 text-xs">💡 {task.impact}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Task Summary */}
        {selectedTasks.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-lg p-4 section-spacing">
            <h4 className="text-white font-medium sub-element-spacing flex items-center">
              🎯 Task Summary:
            </h4>
            <p className="text-white/80 text-sm leading-relaxed">
              {generateTaskSummary()}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-white/60 text-xs">Task Attivi</div>
                <div className="text-blue-400 font-bold">{selectedTasks.length}</div>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-xs">Complessità</div>
                <div className={`font-bold ${complexity <= 6 ? 'text-green-400' : complexity <= 10 ? 'text-amber-400' : 'text-red-400'}`}>
                  {complexity}/15
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-xs">Efficienza</div>
                <div className={`font-bold ${efficiency >= 80 ? 'text-green-400' : efficiency >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                  {efficiency}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            disabled={selectedTasks.length === 0}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
          >
            Continua Step 5 →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTaskDefinitionStep;
