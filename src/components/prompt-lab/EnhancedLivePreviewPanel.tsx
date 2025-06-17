
import React from 'react';
import { FileText, Users, Building, Target, Settings, Eye, CheckCircle, Clock } from 'lucide-react';

interface Props {
  promptData: any;
}

const EnhancedLivePreviewPanel: React.FC<Props> = ({ promptData }) => {
  // Helper function to check if a field is completed
  const isFieldCompleted = (field: any) => {
    if (typeof field === 'string') return field.trim().length > 0;
    if (Array.isArray(field)) return field.length > 0;
    if (typeof field === 'object' && field !== null) {
      return Object.values(field).some(val => 
        typeof val === 'string' ? val.trim().length > 0 : Boolean(val)
      );
    }
    return Boolean(field);
  };

  // Check completion status for each section
  const roleComplete = isFieldCompleted(promptData.userWrittenRole) || isFieldCompleted(promptData.role);
  const contextComplete = isFieldCompleted(promptData.userWrittenContext) || isFieldCompleted(promptData.context);
  const tasksComplete = isFieldCompleted(promptData.userWrittenTasks) || isFieldCompleted(promptData.tasks);
  const styleComplete = isFieldCompleted(promptData.userWrittenTone) || (promptData.tone?.formal && promptData.tone?.empathy);
  const formatComplete = isFieldCompleted(promptData.userWrittenFormat) || isFieldCompleted(promptData.outputFormat);

  console.log('🔍 EnhancedLivePreviewPanel DEBUG:', {
    roleComplete,
    contextComplete,
    tasksComplete,
    styleComplete,
    formatComplete,
    outputFormat: promptData.outputFormat,
    userWrittenFormat: promptData.userWrittenFormat
  });

  const getStatusIcon = (isComplete: boolean) => {
    return isComplete ? (
      <CheckCircle className="w-4 h-4 text-emerald-400" />
    ) : (
      <Clock className="w-4 h-4 text-orange-400" />
    );
  };

  const getStatusText = (isComplete: boolean) => {
    return isComplete ? (
      <span className="text-emerald-400">✅ Completato</span>
    ) : (
      <span className="text-orange-400">⏳ Da completare</span>
    );
  };

  // Generate the current prompt preview
  const generatePromptPreview = () => {
    let preview = "";
    
    if (roleComplete) {
      const roleText = promptData.userWrittenRole || `Sei un ${promptData.role || 'assistente AI'} con ${promptData.experience || 5} anni di esperienza.`;
      preview += roleText + "\n\n";
    }
    
    if (contextComplete) {
      const contextText = promptData.userWrittenContext || promptData.context;
      preview += "CONTESTO:\n" + contextText + "\n\n";
    }
    
    if (tasksComplete) {
      const tasksText = promptData.userWrittenTasks || (Array.isArray(promptData.tasks) ? promptData.tasks.join(", ") : promptData.tasks);
      preview += "COMPITI:\n" + tasksText + "\n\n";
    }
    
    if (styleComplete) {
      const styleText = promptData.userWrittenTone || `Mantieni un tono ${promptData.tone?.formal > 70 ? 'formale' : 'informale'} e ${promptData.tone?.empathy > 70 ? 'empatico' : 'diretto'}.`;
      preview += "STILE:\n" + styleText + "\n\n";
    }
    
    if (formatComplete) {
      const formatText = promptData.userWrittenFormat || (Array.isArray(promptData.outputFormat) ? promptData.outputFormat.join(", ") : promptData.outputFormat);
      preview += "FORMATO OUTPUT:\n" + formatText;
    }
    
    return preview.trim() || "Il tuo prompt apparirà qui man mano che completi gli step...";
  };

  return (
    <div className="sticky top-6">
      <div className="bg-slate-900/95 border border-slate-700/50 rounded-xl p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-6">
          <Eye className="w-5 h-5 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-200">Live Preview</h3>
        </div>

        {/* Progress Overview */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">Ruolo</span>
            </div>
            {getStatusIcon(roleComplete)}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">Contesto</span>
            </div>
            {getStatusIcon(contextComplete)}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">Task</span>
            </div>
            {getStatusIcon(tasksComplete)}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">Stile</span>
            </div>
            {getStatusIcon(styleComplete)}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">Formato</span>
            </div>
            {getStatusIcon(formatComplete)}
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Prompt Preview:</h4>
          <div className="bg-slate-800/50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
              {generatePromptPreview()}
            </pre>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Progress:</span>
            <span className="text-sm text-slate-300">
              {[roleComplete, contextComplete, tasksComplete, styleComplete, formatComplete].filter(Boolean).length}/5
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-700/50 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${([roleComplete, contextComplete, tasksComplete, styleComplete, formatComplete].filter(Boolean).length / 5) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLivePreviewPanel;
