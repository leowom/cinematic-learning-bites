
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const TaskDefinitionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>(promptData.tasks || []);

  const availableTasks = [
    {
      id: 'sentiment',
      label: 'Classifica sentiment (positivo/neutro/negativo)',
      description: 'Analizza il tono emotivo del messaggio',
      impact: 'Migliora personalizzazione risposta +35%'
    },
    {
      id: 'urgency',
      label: 'Determina urgenza (scala 1-5)',
      description: 'Valuta la priorità della richiesta',
      impact: 'Riduce tempi escalation -40%'
    },
    {
      id: 'category',
      label: 'Categorizza richiesta (supporto/vendite/billing)',
      description: 'Classifica il tipo di richiesta',
      impact: 'Ottimizza routing automatico +60%'
    },
    {
      id: 'response',
      label: 'Genera risposta completa e personalizzata',
      description: 'Crea risposta appropriata al contesto',
      impact: 'Aumenta customer satisfaction +45%'
    },
    {
      id: 'next-steps',
      label: 'Definisci next steps e timeline',
      description: 'Stabilisce azioni successive e tempistiche',
      impact: 'Migliora follow-up rate +30%'
    },
    {
      id: 'escalation',
      label: 'Valuta necessità escalation a umano',
      description: 'Identifica casi complessi per escalation',
      impact: 'Riduce errori gestione -25%'
    }
  ];

  const handleTaskToggle = (taskId: string) => {
    const newTasks = selectedTasks.includes(taskId)
      ? selectedTasks.filter(id => id !== taskId)
      : [...selectedTasks, taskId];
    
    setSelectedTasks(newTasks);
    updatePromptData('tasks', newTasks);
  };

  const generateTaskSummary = () => {
    const selectedTaskLabels = availableTasks
      .filter(task => selectedTasks.includes(task.id))
      .map(task => task.label.split(' ')[0]);
    
    return `Analizza email per ${selectedTaskLabels.join(', ').toLowerCase()}, poi genera risposta completa con next steps specifici e timeline appropriato.`;
  };

  return (
    <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20 hover:bg-slate-800/95 transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      <h2 className="text-2xl font-semibold text-white mb-4 relative z-10">
        🎯 STEP 3/5: Task Specifici
      </h2>
      
      <p className="text-white/70 mb-6 relative z-10">
        Seleziona i compiti che l'AI deve svolgere. Più task specifici = risultati più accurati.
      </p>
      
      {/* Task checkboxes */}
      <div className="space-y-3 mb-6 relative z-10">
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
              <span className="text-white font-medium block">{task.label}</span>
              <p className="text-white/60 text-sm mt-1">{task.description}</p>
              <span className="text-green-400/80 text-xs mt-1 block">💡 {task.impact}</span>
            </div>
          </label>
        ))}
      </div>
      
      {/* Task summary */}
      {selectedTasks.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-lg p-4 mb-6 relative z-10">
          <h4 className="text-white font-medium mb-2 flex items-center">
            🎯 Task Summary:
          </h4>
          <p className="text-white/80 text-sm leading-relaxed">
            {generateTaskSummary()}
          </p>
          <div className="mt-3 flex items-center">
            <span className="text-white/60 text-xs mr-2">Complexity Score:</span>
            <div className="bg-slate-700 rounded-full h-2 flex-1 max-w-32">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((selectedTasks.length / 6) * 100, 100)}%` }}
              />
            </div>
            <span className="text-blue-400 text-sm ml-2">{selectedTasks.length}/6</span>
          </div>
        </div>
      )}

      {/* Performance impact preview */}
      {selectedTasks.length >= 3 && (
        <div className="bg-slate-800/50 border border-green-400/30 rounded-lg p-4 mb-6 relative z-10">
          <h4 className="text-green-400 font-medium mb-2">📈 Performance Impact Stimato:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Accuracy:</span>
                <span className="text-green-400 font-bold">+{selectedTasks.length * 15}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Speed:</span>
                <span className="text-green-400 font-bold">+{selectedTasks.length * 10}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Consistency:</span>
                <span className="text-green-400 font-bold">+{selectedTasks.length * 12}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Satisfaction:</span>
                <span className="text-green-400 font-bold">+{selectedTasks.length * 8}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue button */}
      <div className="flex justify-end relative z-10">
        <Button
          onClick={onComplete}
          disabled={selectedTasks.length === 0}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
        >
          Continua Step 4 →
        </Button>
      </div>
    </div>
  );
};

export default TaskDefinitionStep;
