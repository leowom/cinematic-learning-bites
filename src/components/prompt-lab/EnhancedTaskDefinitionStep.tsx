
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Target, Plus, Trash2, AlertTriangle, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

interface Task {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  complexity: number;
}

const EnhancedTaskDefinitionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const predefinedTasks = [
    { id: '1', description: 'Rispondere a richieste di rimborso', priority: 'high' as const, complexity: 4 },
    { id: '2', description: 'Gestire reclami di prodotti difettosi', priority: 'high' as const, complexity: 5 },
    { id: '3', description: 'Fornire informazioni su spedizioni', priority: 'medium' as const, complexity: 2 },
    { id: '4', description: 'Assistere con modifiche ordini', priority: 'medium' as const, complexity: 3 },
    { id: '5', description: 'Rispondere a domande su policy aziendale', priority: 'low' as const, complexity: 2 }
  ];

  const addPredefinedTask = (task: typeof predefinedTasks[0]) => {
    if (!tasks.find(t => t.id === task.id)) {
      const newTasks = [...tasks, task];
      setTasks(newTasks);
      updatePromptData('tasks', newTasks.map(t => t.description));
      updateComplexityScore(newTasks);
      setShowAnalysis(true);
    }
  };

  const addCustomTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        description: newTask.trim(),
        priority: 'medium',
        complexity: 3
      };
      const newTasks = [...tasks, task];
      setTasks(newTasks);
      updatePromptData('tasks', newTasks.map(t => t.description));
      updateComplexityScore(newTasks);
      setNewTask('');
      setShowAnalysis(true);
    }
  };

  const removeTask = (taskId: string) => {
    const newTasks = tasks.filter(t => t.id !== taskId);
    setTasks(newTasks);
    updatePromptData('tasks', newTasks.map(t => t.description));
    updateComplexityScore(newTasks);
  };

  const updateComplexityScore = (taskList: Task[]) => {
    const totalComplexity = taskList.reduce((sum, task) => sum + task.complexity, 0);
    updatePromptData('taskComplexity', totalComplexity);
    
    // Update quality score based on task count and complexity
    const qualityBonus = Math.min(taskList.length * 0.5, 3);
    updatePromptData('qualityScore', (promptData.qualityScore || 6) + qualityBonus);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-300 bg-rose-900/15 border-rose-700/30';
      case 'medium': return 'text-orange-300 bg-orange-900/15 border-orange-700/30';
      case 'low': return 'text-emerald-300 bg-emerald-900/15 border-emerald-700/30';
      default: return 'text-slate-300 bg-slate-800/30 border-slate-700/40';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Bassa';
      default: return 'Non definita';
    }
  };

  const getComplexityLevel = () => {
    const complexity = promptData.taskComplexity || 0;
    if (complexity <= 6) return { label: 'Ottimale', color: 'text-emerald-300' };
    if (complexity <= 10) return { label: 'Gestibile', color: 'text-orange-300' };
    return { label: 'Critica', color: 'text-rose-300' };
  };

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <Target className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Definizione Obiettivi e Task Specifici
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            Definire task specifici e misurabili trasforma istruzioni vaghe in obiettivi concreti, 
            permettendo all'AI di fornire soluzioni pratiche e attuabili.
          </p>
          
          <div className="bg-orange-900/15 border border-orange-700/30 rounded-lg p-4 element-spacing">
            <div className="flex items-center space-x-2 sub-element-spacing">
              <AlertTriangle className="w-4 h-4 text-orange-300" />
              <span className="text-orange-300 text-sm font-medium">Impatto della Specificità:</span>
            </div>
            <div className="text-slate-300 text-sm leading-relaxed">
              Task vaghi come "gestire email" producono consigli generici. Task specifici come "rispondere a richieste di rimborso entro 2 ore" 
              generano procedure dettagliate e actionable.
            </div>
          </div>
        </div>

        <div className="section-spacing">
          <h3 className="text-slate-200 font-medium element-spacing">Task Predefiniti per il Settore:</h3>
          <div className="grid grid-cols-1 gap-2">
            {predefinedTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                  tasks.find(t => t.id === task.id)
                    ? 'bg-slate-700/60 border-slate-600 opacity-60'
                    : 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/80 cursor-pointer'
                }`}
                onClick={() => !tasks.find(t => t.id === task.id) && addPredefinedTask(task)}
              >
                <div className="flex-1">
                  <div className="text-slate-300 text-sm font-medium sub-element-spacing">{task.description}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                      Priorità {getPriorityLabel(task.priority)}
                    </span>
                    <span className="text-slate-400 text-xs">Complessità: {task.complexity}/5</span>
                  </div>
                </div>
                <div className="ml-3">
                  {tasks.find(t => t.id === task.id) ? (
                    <CheckCircle className="w-5 h-5 text-emerald-300" />
                  ) : (
                    <Plus className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-spacing">
          <h3 className="text-slate-200 font-medium element-spacing">Aggiungi Task Personalizzato:</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Descrivi un task specifico da aggiungere..."
              className="flex-1 bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && addCustomTask()}
            />
            <Button
              onClick={addCustomTask}
              disabled={!newTask.trim()}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 border border-slate-600"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 section-spacing">
            <h4 className="text-slate-200 font-medium element-spacing flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <span>Task Selezionati ({tasks.length}):</span>
            </h4>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between bg-slate-900/40 rounded-lg p-3 border border-slate-700/30">
                  <div className="flex-1">
                    <div className="text-slate-300 text-sm sub-element-spacing">{task.description}</div>
                    <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                      Priorità {getPriorityLabel(task.priority)}
                    </span>
                  </div>
                  <Button
                    onClick={() => removeTask(task.id)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-rose-300 hover:bg-rose-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAnalysis && tasks.length > 0 && (
          <div className="space-y-4 animate-fade-in section-spacing">
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-4">
              <h4 className="text-emerald-300 font-medium sub-element-spacing flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Analisi della Complessità:</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-slate-400 sub-element-spacing">Task Totali</div>
                  <div className="text-slate-200 text-lg font-medium">{tasks.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400 sub-element-spacing">Complessità Totale</div>
                  <div className={`text-lg font-medium ${getComplexityLevel().color}`}>
                    {promptData.taskComplexity || 0}/15
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400 sub-element-spacing">Livello</div>
                  <div className={`text-lg font-medium ${getComplexityLevel().color}`}>
                    {getComplexityLevel().label}
                  </div>
                </div>
              </div>
              
              {promptData.taskComplexity > 10 && (
                <div className="bg-orange-900/15 border border-orange-700/30 rounded-lg p-3 mt-4">
                  <div className="text-orange-300 text-sm font-medium sub-element-spacing">Attenzione alla Complessità:</div>
                  <div className="text-slate-300 text-sm">
                    Prompt troppo complessi possono produrre risposte confuse. Considera di suddividere in prompt separati.
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3">
              <div className="text-slate-200 font-medium sub-element-spacing">Benefici della Specificità:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-orange-300 font-medium sub-element-spacing">Vago:</div>
                  <div className="text-slate-400">"Aiutami con il customer service"</div>
                </div>
                <div>
                  <div className="text-emerald-300 font-medium sub-element-spacing">Specifico:</div>
                  <div className="text-slate-300">"Gestisci rimborsi entro 2h, con procedura escalation per importi >100€"</div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3">
              <span className="text-emerald-300 font-medium">Punteggio Qualità: +{Math.min(tasks.length * 0.5, 3).toFixed(1)} punti!</span>
              <span className="text-slate-300 text-sm ml-2">
                Task specifici trasformano obiettivi vaghi in procedure concrete.
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            disabled={tasks.length === 0}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 border border-slate-600 flex items-center space-x-2"
          >
            <span>Procedi ai Vincoli di Stile</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTaskDefinitionStep;
