import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Target, Plus, X, ArrowRight, Lightbulb, CheckCircle } from 'lucide-react';
import MicropromptWriter from './MicropromptWriter';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const EnhancedTaskDefinitionStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [newTask, setNewTask] = useState('');
  const [microprompt, setMicroprompt] = useState(promptData.microprompt5 || '');

  const addTask = () => {
    if (newTask.trim()) {
      const updatedTasks = [...(promptData.tasks || []), newTask.trim()];
      updatePromptData('tasks', updatedTasks);
      setNewTask('');
    }
  };

  const removeTask = (index: number) => {
    const updatedTasks = promptData.tasks.filter((_: any, i: number) => i !== index);
    updatePromptData('tasks', updatedTasks);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleMicropromptChange = (text: string) => {
    setMicroprompt(text);
    updatePromptData('microprompt5', text);
  };

  const canProceed = promptData.tasks?.length >= 2 && microprompt.trim().length > 0;

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
          
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4 element-spacing">
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3 element-spacing">
              <div className="flex items-center space-x-2 sub-element-spacing">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300 text-sm font-medium">Task Efficaci:</span>
              </div>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• "Analizza il sentiment dell'email (positivo/neutro/negativo)"</li>
                <li>• "Identifica la richiesta principale del cliente"</li>
                <li>• "Proponi 3 soluzioni concrete con timeline"</li>
                <li>• "Redigi risposta mantenendo tone professionale ma empatico"</li>
              </ul>
            </div>

            <div className="bg-rose-900/15 border border-rose-700/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 sub-element-spacing">
                <X className="w-4 h-4 text-rose-300" />
                <span className="text-rose-300 text-sm font-medium">Task Vaghi da Evitare:</span>
              </div>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• "Aiutami con l'email" (troppo generico)</li>
                <li>• "Rispondi bene" (non misurabile)</li>
                <li>• "Sii professionale" (soggettivo)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section-spacing">
          <h3 className="text-slate-200 font-medium sub-element-spacing">I Tuoi Task Specifici:</h3>
          
          <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 element-spacing">
            <div className="flex space-x-2 sub-element-spacing">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Esempio: Analizza il sentiment dell'email del cliente..."
                className="flex-1 bg-slate-700/60 border border-slate-600/50 rounded px-3 py-2 text-slate-200 placeholder-slate-400 text-sm focus:border-slate-500 focus:outline-none"
              />
              <Button
                onClick={addTask}
                disabled={!newTask.trim()}
                size="sm"
                className="bg-slate-600 hover:bg-slate-500 text-slate-200 px-4"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {promptData.tasks?.length > 0 && (
              <div className="space-y-2">
                {promptData.tasks.map((task: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-slate-700/40 border border-slate-600/30 rounded px-3 py-2">
                    <span className="text-slate-200 text-sm flex-1">{index + 1}. {task}</span>
                    <button
                      onClick={() => removeTask(index)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(!promptData.tasks || promptData.tasks.length < 2) && (
              <div className="flex items-center space-x-2 text-orange-400 text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>Aggiungi almeno 2 task per procedere</span>
              </div>
            )}
          </div>
        </div>

        {promptData.tasks?.length >= 2 && (
          <MicropromptWriter
            title="Pratica: Scrivi i Task per il Tuo Scenario"
            instruction="Ora scrivi 3-4 task specifici per il tuo scenario aziendale. Ricorda: ogni task deve essere misurabile e actionable."
            placeholder="1. Analizza il sentiment dell'email (positivo/neutro/negativo)&#10;2. Identifica la categoria di richiesta (rimborso/informazioni/supporto)&#10;3. Proponi una soluzione specifica con timeline&#10;4. Redigi risposta mantenendo tone [specificare tone]"
            example="1. Analizza il sentiment dell'email del cliente (positivo/neutro/negativo)&#10;2. Identifica la categoria principale: reclamo, informazione, rimborso&#10;3. Proponi una soluzione concreta con timeline di risoluzione&#10;4. Redigi risposta professionale che riconosca il problema e offra azione immediata"
            context="tasks"
            onTextChange={handleMicropromptChange}
            value={microprompt}
          />
        )}

        {canProceed && (
          <div className="flex justify-end">
            <Button
              onClick={onComplete}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 flex items-center space-x-2"
            >
              <span>Procedi a Style & Constraints</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTaskDefinitionStep;
