
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

  // Check completion status for each section - only user written content counts
  const roleComplete = isFieldCompleted(promptData.userWrittenRole);
  const contextComplete = isFieldCompleted(promptData.userWrittenContext);
  const tasksComplete = isFieldCompleted(promptData.userWrittenTasks);
  const styleComplete = isFieldCompleted(promptData.userWrittenTone);
  const formatComplete = isFieldCompleted(promptData.userWrittenFormat);

  const getStatusIcon = (isComplete: boolean) => {
    return isComplete ? (
      <CheckCircle className="w-4 h-4 text-emerald-400" />
    ) : (
      <Clock className="w-4 h-4 text-orange-400" />
    );
  };

  // Generate the current prompt preview - only show completed sections
  const generatePromptPreview = () => {
    let preview = "";
    
    if (roleComplete) {
      preview += promptData.userWrittenRole + "\n\n";
    }
    
    if (contextComplete) {
      preview += "CONTESTO:\n" + promptData.userWrittenContext + "\n\n";
    }
    
    if (tasksComplete) {
      preview += "TASK:\n" + promptData.userWrittenTasks + "\n\n";
    }
    
    if (styleComplete) {
      preview += "VINCOLI:\n" + promptData.userWrittenTone + "\n\n";
    }
    
    if (formatComplete) {
      preview += "FORMATO OUTPUT:\n" + promptData.userWrittenFormat;
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
