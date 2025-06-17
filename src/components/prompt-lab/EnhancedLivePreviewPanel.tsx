
import React from 'react';
import { Eye, Target, Users, Building, Settings, FileText } from 'lucide-react';

interface Props {
  promptData: any;
}

const EnhancedLivePreviewPanel: React.FC<Props> = ({ promptData }) => {
  const generateCurrentPrompt = () => {
    let prompt = '';
    
    // Ruolo
    if (promptData.userWrittenRole) {
      prompt += `${promptData.userWrittenRole}\n\n`;
    }
    
    // Contesto
    if (promptData.userWrittenContext) {
      prompt += `CONTESTO:\n${promptData.userWrittenContext}\n\n`;
    }
    
    // Task
    if (promptData.userWrittenTasks) {
      prompt += `TASK:\n${promptData.userWrittenTasks}\n\n`;
    }
    
    // Vincoli
    if (promptData.userWrittenTone) {
      prompt += `VINCOLI:\n${promptData.userWrittenTone}\n\n`;
    }
    
    // Formato
    if (promptData.userWrittenFormat) {
      prompt += `FORMATO OUTPUT:\n${promptData.userWrittenFormat}`;
    }
    
    return prompt || 'Il tuo prompt apparirà qui mentre procedi...';
  };

  return (
    <div className="sticky top-6">
      <div className="glassmorphism-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Eye className="w-5 h-5 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-200">
            🎯 Il Tuo Prompt
          </h3>
        </div>

        <div className="space-y-4">
          {/* Componenti del Prompt */}
          <div className="space-y-3">
            {/* Ruolo */}
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Ruolo:</span>
              <span className={`text-sm ${promptData.userWrittenRole ? 'text-emerald-400' : 'text-slate-500'}`}>
                {promptData.userWrittenRole ? '✅ Definito' : '⏳ Da completare'}
              </span>
            </div>

            {/* Contesto */}
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-300">Contesto:</span>
              <span className={`text-sm ${promptData.userWrittenContext ? 'text-emerald-400' : 'text-slate-500'}`}>
                {promptData.userWrittenContext ? '✅ Definito' : '⏳ Da completare'}
              </span>
            </div>

            {/* Task */}
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">Task:</span>
              <span className={`text-sm ${promptData.userWrittenTasks ? 'text-emerald-400' : 'text-slate-500'}`}>
                {promptData.userWrittenTasks ? '✅ Definiti' : '⏳ Da completare'}
              </span>
            </div>

            {/* Vincoli */}
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-slate-300">Vincoli:</span>
              <span className={`text-sm ${promptData.userWrittenTone ? 'text-emerald-400' : 'text-slate-500'}`}>
                {promptData.userWrittenTone ? '✅ Definiti' : '⏳ Da completare'}
              </span>
            </div>

            {/* Formato */}
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-slate-300">Formato:</span>
              <span className={`text-sm ${promptData.userWrittenFormat ? 'text-emerald-400' : 'text-slate-500'}`}>
                {promptData.userWrittenFormat ? '✅ Definito' : '⏳ Da completare'}
              </span>
            </div>
          </div>

          {/* Preview del Prompt */}
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-4">
            <h4 className="text-slate-300 text-sm font-medium mb-2">📋 Anteprima Prompt:</h4>
            <div className="bg-slate-900/60 border border-slate-700/30 rounded p-3 max-h-96 overflow-y-auto">
              <pre className="text-slate-300 text-xs whitespace-pre-wrap leading-relaxed font-mono">
                {generateCurrentPrompt()}
              </pre>
            </div>
          </div>

          {/* Statistiche */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/40 rounded-lg p-3 text-center">
              <div className="text-slate-400 text-xs mb-1">Caratteri</div>
              <div className="text-slate-200 font-semibold">
                {generateCurrentPrompt().length}
              </div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center">
              <div className="text-slate-400 text-xs mb-1">Token ~</div>
              <div className="text-slate-200 font-semibold">
                {Math.ceil(generateCurrentPrompt().length / 4)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLivePreviewPanel;
